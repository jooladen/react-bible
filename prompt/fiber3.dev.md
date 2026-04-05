리액트의 아키텍처를 **컴퓨터 과학(CS)과 운영체제(OS)의 관점**에서 재정의한 **[React Concurrent Engine: High-Level Spec]**입니다. 

단순한 비유를 넘어, 왜 `useTransition`이 **가상 런타임의 스케줄링 전략**을 결정하는 핵심 레버인지 전문 용어를 사용하여 분석해 드립니다.

---

## 1. Concurrent React: 가상 스택과 선점형 스케줄링

리액트 파이버(Fiber)는 JS의 호출 스택(Call Stack) 한계를 극복하기 위해 구현된 **'가상 스택 프레임(Virtual Stack Frame)'**입니다. 이 구조가 있기에 리액트는 실행 제어권을 브라우저에 양보(Yielding)할 수 있습니다.



### ① 파이버가 '장부'인 이유: Stateful Coroutine
*   **전문 정의:** 파이버는 컴포넌트의 상태와 작업 단위를 포함하는 **힙(Heap) 기반의 객체**입니다.
*   **작동 원리:** 일반 함수는 실행 중 멈추면 로컬 변수가 날아가지만, 파이버는 실행 컨텍스트를 객체에 보존하는 **코루틴(Coroutine)** 방식을 취합니다. 
*   **필연성:** 작업을 중단(Interrupt)했다가 나중에 재개(Resume)하려면, 중단 시점의 스냅샷을 저장할 **'상태 보존형 장부'**가 반드시 필요합니다.

### ② '똥 끊기'의 정체: Incremental Rendering & Time Slicing
*   **전문 정의:** 렌더링 작업을 원자적(Atomic) 단위로 쪼개어 브라우저의 프레임 드랍 없이 수행하는 **시분할(Time Slicing)** 기법입니다.
*   **작동 원리:** `RequestIdleCallback`과 유사한 메커니즘으로, 메인 스레드가 유휴 상태일 때만 렌더링을 진행하다가 **I/O 이벤트(클릭 등)**가 유입되면 즉시 제어권을 반납합니다.

---

## 2. useTransition: 렌더링 우선순위의 비트마스크(Lane) 제어

리액트 엔진은 모든 업데이트에 우선순위를 부여하며, 이를 **Lane 모델(비트마스크 자료구조)**로 관리합니다.



### 🚨 기본 모드 (Sync/Blocking Mode)
*   **메커니즘:** 모든 `setState`는 **'Sync Lane(가장 높은 우선순위)'**을 부여받습니다.
*   **결과:** 리액트는 이 작업을 **긴급(Urgent)**으로 간주하고, 엔진의 '중단 가능' 기능을 강제로 비활성화합니다. 즉, 파이버 장부를 쓰지 않고 한 번에 밀어붙이는 **Blocking Rendering**이 발생합니다.

### ⚡ useTransition 모드 (Concurrent/Non-blocking Mode)
*   **메커니즘:** `startTransition`으로 감싸진 업데이트는 **'Transition Lane(낮은 우선순위)'**으로 마킹됩니다.
*   **결과:** 이제 스케줄러가 개입합니다. 이 작업은 **선점 가능(Preemptible)**한 상태가 되어, 더 높은 우선순위의 Lane(사용자 입력)이 들어오면 하던 작업을 즉시 멈추고 장부에 체크포인트만 남긴 채 이탈합니다.

---

## 3. 실무 아키텍처 소스 분석 (Advanced Spec)

```tsx
01: import React, { useState, useTransition } from 'react';
02: 
03: export default function HighPerformanceRuntime() {
04:   // [Fiber Heap Allocation]
05:   const [data, setData] = useState(0); 
06:   // [Concurrency Control Interface]
07:   const [isPending, startTransition] = useTransition();
08: 
09:   const handleHeavyUpdate = () => {
10:     // [Scheduling Strategy: Low Priority]
11:     // 이 호출은 'Transition Lane'을 점유하며 렌더링 중단 권한을 커널에 위임함.
12:     startTransition(() => {
13:       setData(prev => prev + 1); 
14:     });
15:   };
16: 
17:   // [Reconciliation Phase: Interruptible Unit of Work]
18:   // 리컨실러가 가상 돔을 비교할 때, 이 컴포넌트는 '언제든 비켜줄 준비'가 된 상태임.
19:   return (
20:     <div className="p-4">
21:       <h1>Consistency Level: {data}</h1>
22:       <button onClick={handleHeavyUpdate}>Trigger Concurrent Task</button>
23:       {isPending && <p>Background Processing...</p>}
24:     </div>
25:   );
26: }
```

---

## 4. 시니어의 통찰: 왜 기본값이 아닐까? (Design Trade-off)

1.  **UI Data Integrity (데이터 무결성):** 모든 것이 비동기로 끊겨서 렌더링되면, 화면의 각 파트가 서로 다른 시점의 데이터를 보여주는 **Tearing(화면 찢어짐)** 현상이 발생할 수 있습니다. 리액트는 기본적으로 '안전한 동기적 일관성'을 선택합니다.
2.  **Scheduling Overhead:** 작업을 쪼개고 장부에 기록하며 우선순위를 관리하는 행위 자체도 CPU 자원을 소모합니다. 아주 가벼운 업데이트는 그냥 한 번에 밀어버리는 게 오버헤드가 적습니다.
3.  **Algebraic Effects 추상화:** 리액트 팀은 어떤 업데이트가 무거운지 개발자가 가장 잘 안다고 판단했습니다. `useTransition`은 개발자가 런타임에 주는 **'우선순위 힌트'**입니다.

---

### 💡 최종 결론 (The Senior's Summary)

*   **파이버(Fiber)**는 중단과 재개를 가능케 하는 **저수준 데이터 구조(Low-level Structure)**입니다.
*   **useTransition**은 이 구조를 활용해 **선점형 멀티태스킹(Preemptive Multitasking)**을 수행하도록 지시하는 **상위 수준의 제어 로직(High-level Controller)**입니다.

이 버튼을 누르지 않으면 리액트 엔진은 마치 구식 OS처럼 한 번에 하나의 프로세스만 점유하는 **단일 작업 모드**로 작동하게 됩니다. 진짜 유연한 앱을 만들고 싶다면, 이 **'동시성 제어 스위치'**를 전략적으로 활용해야 합니다.

리액트 파이버 엔진의 작업 분할 방식에 대해 더 구체적인 시각 자료나 Lane 모델의 비트마스크 연산 방식이 궁금하신가요?