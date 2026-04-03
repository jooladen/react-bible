# Plan: React Bible — Combined View 시스템 + 커리큘럼 개선

> Feature: Topic-Tab Combined View 시스템 + Stage 01 적용 + 커리큘럼 보완
> Created: 2026-04-04
> Phase: Done (구현 완료, 2026-04-04)
> 다음 세션에서 이 문서부터 시작할 것

---

## 프로젝트 목표 (항상 염두)

> "React를 어설프게 쓰는 개발자가 보고 — '아, 이런 의미였구나!' '이 앱은 개발할 때 항상 옆에 두고 싶다' — 는 느낌을 주는 인터랙티브 학습 앱 + 전자책"

**타깃**: React 쓰고 있지만 왜 안 되는지 모르는 개발자
**핵심 경험**: 개념 설명 읽으면서 → 바로 옆에서 실행 결과 확인 → 복붙해서 VSCode 테스트

---

## 현재 상태 (2026-04-04 기준)

### 완료된 것

| 항목 | 상태 | 비고 |
|---|---|---|
| Stage 01 theory.tsx | ✅ 완료 | 9단계 스토리텔링 내러티브로 재구성 (이번 세션) |
| Stage 01 playground.tsx | ✅ 완료 | BadCase/GoodCase/ImmerPanel 구현됨 |
| Stage 01 code-viewer.tsx | ✅ 완료 | 3탭 코드 스니펫 |
| progress-store | ✅ 완료 | Zustand persist |
| StageLayout (기존 3탭) | ✅ 완료 | 이론/실험실/코드뷰어 탭 |

### 이번 세션 핵심 결정사항 (구현 완료)

1. **Topic-Tab Combined View 시스템** — 이론+데모+코드 한 화면 통합
2. **Stage 01 Combined 구현** — 3개 주제 탭으로 재편성
3. **커리큘럼 3개 교체** — Stage 09, 15, 20 교체

---

## Part 1: 커리큘럼 보완

### 교체 확정 (3개)

| # | 현재 (교체 전) | 신규 (교체 후) | 교체 이유 |
|---|---|---|---|
| 09 | CSS-in-JS vs Tailwind | **Key Props & 리스트 렌더링** | CSS는 취향 영역, React 버그 원인 아님. Key 실수는 React 버그 Top 3 |
| 15 | Signals (Fine-grained Reactivity) | **Error Boundary** | Signals는 아직 실험적, 타깃 독자에 이름. Error Boundary는 실무 필수인데 아무도 안 씀 |
| 20 | Micro Frontends | **useRef 심화** | MFE는 엔터프라이즈 전용. useRef는 90%가 DOM ref로만 앎, 실제 역할 미파악 |

### 교체 후 커리큘럼 전체

#### Group 1: 입력과 기초
| # | 제목 | 난이도 | 탭 구성 아이디어 |
|---|---|---|---|
| 01 | 불변성 & Immer | easy | 일반변수 / 배열·객체 / Immer |
| 02 | Rendering & Reconciliation | medium | 렌더 트리거 / Reconciliation / 최적화 힌트 |
| 03 | Component Lifecycle | easy | Mount / Update / Unmount |
| 04 | Hooks 기초 (useState·useEffect·useReducer) | easy | useState / useEffect / useReducer |
| 05 | Event Bubbling & Capture | medium | Bubbling / Capture / stopPropagation |

#### Group 2: 가공과 최적화
| # | 제목 | 난이도 | 탭 구성 아이디어 |
|---|---|---|---|
| 06 | Hooks & Closure (Stale Closure) | hard | 클로저 기초 / stale 문제 / 해결 패턴 |
| 07 | Memoization + React.memo | medium | useMemo / useCallback / React.memo |
| 08 | Design Systems (Headless UI) | medium | Headless 개념 / Compound Component / 실무 패턴 |
| **09** | **Key Props & 리스트 렌더링** | easy | index key 버그 / 고유 id key / key로 상태 초기화 |
| 10 | Performance Profiling | hard | React DevTools / Profiler API / 병목 진단 |

#### Group 3: 확장과 연결
| # | 제목 | 난이도 | 탭 구성 아이디어 |
|---|---|---|---|
| 11 | Context & Prop Drilling | medium | Prop Drilling 문제 / Context 기초 / Context 한계 |
| 12 | State Management (Zustand) | medium | Context 한계 / Zustand 기초 / Selector 최적화 |
| 13 | Async State (Race Condition) | hard | 경쟁 조건 / AbortController / 해결 패턴 |
| 14 | Server State (TanStack Query) | medium | useEffect fetch 문제 / useQuery / Stale-while-revalidate |
| **15** | **Error Boundary** | medium | 에러 없으면 / class EB / react-error-boundary |

#### Group 4: 운영과 인프라
| # | 제목 | 난이도 | 탭 구성 아이디어 |
|---|---|---|---|
| 16 | Testing Strategy | medium | 단위 테스트 / 통합 테스트 / E2E |
| 17 | Hydration & SSR | hard | CSR vs SSR / Hydration 원리 / mismatch 해결 |
| 18 | Bundle Optimization | hard | 번들 분석 / Code Splitting / Tree Shaking |
| 19 | Web Workers | hard | 메인 스레드 블로킹 / Worker 기초 / Comlink |
| **20** | **useRef 심화** | medium | DOM ref / 렌더간 값 유지 / stale closure 우회 |

### 기존 스테이지 보완 (선택적)
- **04 Hooks 기초** → useReducer 탭 추가 (useState 한계 → useReducer 필요성)
- **07 Memoization** → React.memo + 컴포넌트 분리 원칙 탭 추가
- **08 Design Systems** → Compound Component 패턴 탭 추가

---

## Part 2: Topic-Tab Combined View 시스템 구현

### 핵심 설계 원칙

1. **탭 수는 스테이지마다 다름** — 배열로 자유 정의 (2~5개)
2. **코드 = VSCode 복붙 즉시 실행** — `"use client"` 주석 포함, import 완비
3. **이론은 child/dev 이중 모드 유지** — `useExplanationStore()` 공통 사용
4. **기존 3탭 시스템은 건드리지 않음** — `combined` prop 우회 방식

### 구현 파일 목록

| 파일 | 작업 | 우선순위 |
|---|---|---|
| `src/types/combined-stage.ts` | `TopicTab` 타입 정의 (신규) | 1순위 |
| `src/components/ui/copy-button.tsx` | 코드 복사 버튼 (신규) | 1순위 |
| `src/components/layout/combined-stage-view.tsx` | 범용 Topic-Tab 렌더러 (신규) | 2순위 |
| `src/components/layout/stage-layout.tsx` | `combined?` prop 추가 | 2순위 |
| `src/app/stage/[slug]/page.tsx` | `Combined` 필드 지원 | 2순위 |
| `src/features/stage-01-immutability/combined.tsx` | Stage 01 구현체 (신규) | 3순위 |
| `src/lib/stages.ts` | Stage 09·15·20 slug·제목 교체 | 3순위 |

### 타입 설계

**`src/types/combined-stage.ts`**:
```ts
export type CodeSnippet = {
  label: string        // "❌ mutation", "✅ spread"
  snippet: string      // VSCode 복붙 즉시 실행 가능한 완성형 코드 문자열
  useClient?: boolean  // true → 상단에 "use client" 설명 주석 자동 포함
}

export type TopicTab = {
  id: string
  label: string        // 탭 레이블 (예: "일반 변수", "배열/객체", "Immer")
  icon?: string
  theory: {
    child: React.ReactNode   // 🟢 초딩 설명
    dev: React.ReactNode     // 🔵 개발자 설명
  }
  demo: React.ReactNode      // 라이브 인터랙티브 데모 컴포넌트
  code: CodeSnippet[]        // 1개 이상의 코드 스니펫 (mini-tab으로 전환)
}
```

### CombinedStageView 화면 레이아웃

```
┌──────────────────────────────────────────────────────────┐
│  [Tab 1: 일반 변수] [Tab 2: 배열/객체] [Tab 3: Immer]    │  ← 탭 수 가변
├──────────────────────────────────────────────────────────┤
│  이론 영역 (child/dev 토글 연동)                          │
│  — 선택된 탭의 theory.child 또는 theory.dev 렌더링        │
├────────────────────────┬─────────────────────────────────┤
│  라이브 데모 (좌 50%)   │  코드 스니펫 (우 50%)            │
│  — 버튼 + 즉시 결과    │  — [❌탭] [✅탭] mini-tab        │
│                        │  — [복사 버튼]                   │
│                        │  — 코드 블록                     │
│                        │  — "use client" 주석 포함        │
└────────────────────────┴─────────────────────────────────┘
```
모바일 (md 미만): 이론 → 데모 → 코드 수직 스택

### 코드 스니펫 포맷 (useClient: true 시)

```tsx
// "use client"  // Next.js의 경우 주석을 제거하세요.

import { useState } from "react"

export default function ExampleComponent() {
  // ... 완성형 코드 (복붙 후 바로 실행 가능)
}
```

### StageLayout 수정 요점

**`src/components/layout/stage-layout.tsx`**:
```ts
type StageLayoutProps = {
  stage: Stage
  theory?: React.ReactNode
  playground?: React.ReactNode
  code?: React.ReactNode
  combined?: React.ReactNode   // ← 추가
}

// combined 있을 때:
//   - 기존 3탭 stepper 숨김
//   - TheoryModeToggle은 유지 (combined 내부에서도 child/dev 사용)
//   - combined 컴포넌트 바로 렌더링
// combined 없을 때:
//   - 기존 동작 그대로 (하위 호환)
```

### page.tsx 수정 요점

**`src/app/stage/[slug]/page.tsx`**:
```ts
// STAGE_CONTENT 타입에 Combined 추가
const STAGE_CONTENT: Record<string, {
  Theory: React.ComponentType
  Playground: React.ComponentType
  CodeViewer: React.ComponentType
  Combined?: React.ComponentType  // ← 선택적
}> = {
  immutability: {
    Combined: dynamic(() =>
      import("@/features/stage-01-immutability/combined")
        .then(m => ({ default: m.Stage01Combined }))
    ),
    Theory: ...,     // 기존 유지
    Playground: ..., // 기존 유지
    CodeViewer: ..., // 기존 유지
  },
  // 나머지 스테이지는 Combined 없음 → 기존 3탭 동작
}

// 렌더링
<StageLayout
  stage={stage}
  combined={content?.Combined ? <content.Combined /> : undefined}
  theory={content ? <content.Theory /> : undefined}
  playground={content ? <content.Playground /> : undefined}
  code={content ? <content.CodeViewer /> : undefined}
/>
```

### Stage 01 combined.tsx — 3개 탭 구성

#### Tab 1: "일반 변수 vs 상태 변수"

**이론**:
- child: "일반 변수에 적어봤자 React는 몰라요. useState로 알려줘야 해요"
- dev: "일반 변수는 렌더 사이클 밖 — setXxx 호출 없으면 리렌더 미트리거"

**데모**:
- `let badCount = 0` 일반 변수 — `badCount++` 만 수행, `setXxx` 없음 → 리렌더 미트리거, 화면 0 고정
- `useState` 카운터 (즉시 반영)
- 나란히 비교
- 힌트: "👇 아래 버튼을 클릭해 보세요" 표시

**코드 스니펫**:
```tsx
// ❌ 일반 변수 (동작 안 함)
"use client"
export default function BadCounter() {
  let count = 0  // React가 이 변수의 변화를 모름
  return (
    <div>
      <p>카운트: {count}</p>
      <button onClick={() => count++}>+1 (화면 안 바뀜)</button>
    </div>
  )
}

// ✅ useState (동작함)
"use client"
import { useState } from "react"
export default function GoodCounter() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <p>카운트: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  )
}
```

#### Tab 2: "배열/객체 불변성"

**이론**:
- child: "같은 박스에 넣으면 React가 모름. 새 박스 만들어야 해요 (택배 비유)"
- dev: "Object.is(prev, next) 참조 비교 → mutation은 same reference → 리렌더 미트리거"

**데모**:
- BadCasePanel: 실제 배열(`actualCount` state — N개 증가) / 화면 목록(`displayedCount` — 0개 고정) + 메모리 주소 패널. 경고: "배열은 N개인데 화면은 여전히 0개!"
- GoodCasePanel: 화면 목록(`items.length` — N개 즉시 반영) + 메모리 주소 패널
- 힌트: "👇 아래 추가 버튼을 눌러보세요" 표시

**코드 스니펫**:
```tsx
// ❌ push (mutation — 화면 안 바뀜)
"use client"
import { useState } from "react"
export default function BadList() {
  const [items, setItems] = useState<string[]>([])
  function add() {
    items.push("사과")   // 같은 배열 변이 → React가 변화 감지 못함
    setItems(items)      // 같은 참조 전달
  }
  return ( <button onClick={add}>추가</button> /* 화면 안 바뀜 */ )
}

// ✅ spread (새 참조 — 정상 동작)
"use client"
import { useState } from "react"
export default function GoodList() {
  const [items, setItems] = useState<string[]>([])
  function add() {
    setItems([...items, "사과"])  // 새 배열 생성 → 새 참조 → React가 변화 감지
  }
  return ( <button onClick={add}>추가</button> /* 즉시 반영 */ )
}
```

#### Tab 3: "Immer"

**이론**:
- child: "Immer는 마법사 도구 — 막 수정해도 새 박스에 담아줘요"
- dev: "Proxy 기반 draft → 직접 변이 코드 작성 → Immer가 structural sharing으로 새 불변 객체 반환"

**데모**: 기존 playground.tsx의 ImmerPanel + 중첩 객체 spread 지옥 vs produce 비교
- 힌트: "👇 아래 추가 버튼을 눌러보세요" 표시

**코드 스니펫**:
```tsx
// ❌ 중첩 spread 지옥
"use client"
import { useState } from "react"
export default function DeepSpread() {
  const [user, setUser] = useState({ name: "준", address: { city: "부산" } })
  return (
    <button onClick={() =>
      setUser({ ...user, address: { ...user.address, city: "서울" } })
    }>
      도시 변경 (spread 지옥)
    </button>
  )
}

// ✅ Immer produce (직관적)
"use client"
import { useState } from "react"
import { produce } from "immer"
export default function ImmerExample() {
  const [user, setUser] = useState({ name: "준", address: { city: "부산" } })
  return (
    <button onClick={() =>
      setUser(produce(draft => { draft.address.city = "서울" }))
    }>
      도시 변경 (Immer)
    </button>
  )
}
```

---

## Part 3: theory.tsx 현재 상태 (참고용)

이번 세션에서 완료된 내용:

**`src/features/stage-01-immutability/theory.tsx`** — 9단계 스토리텔링 내러티브로 완전 교체됨

```
1. ❌ 실패 코드 (todos.push / user.name = "철수")
2. 💭 잠깐, 왜 안 바뀔까요? (정지 포인트)
3. 📦 택배 박스 비유 (주소 개념)
4. ⚛️ Object.is() 원리
5. ✅ 해결법 (spread / 새 객체)
6. 😩 중첩 객체 spread 지옥
7. ✨ Immer 등장 (before/after)
8. 🔁 실무 패턴 3종
9. 💡 한 줄 요약 강조 블록
```

레이아웃: 좌측 타임라인(이모지+연결선) + 우측 카드 수직 흐름

> **주의**: combined.tsx 구현 후에는 theory.tsx는 `combined` 없는 스테이지용 fallback으로만 존재.  
> combined.tsx가 기본 진입점이 됨.

---

## Part 4: 구현 순서 (다음 세션 시작점)

### Step 1 — 타입 + 유틸 (30분)
```
1. src/types/combined-stage.ts 생성 (TopicTab 타입)
2. src/components/ui/copy-button.tsx 생성 (클립보드 복사 버튼)
```

### Step 2 — 범용 렌더러 + StageLayout 수정 (1시간)
```
3. src/components/layout/combined-stage-view.tsx 생성
4. src/components/layout/stage-layout.tsx — combined prop 추가
5. src/app/stage/[slug]/page.tsx — Combined 필드 지원
```

### Step 3 — Stage 01 Combined 구현 (1.5시간)
```
6. src/features/stage-01-immutability/combined.tsx 생성
   - Tab 1: 일반변수 vs useState 데모
   - Tab 2: BadCasePanel + GoodCasePanel (playground.tsx 로직 이전)
   - Tab 3: ImmerPanel (playground.tsx 로직 이전)
```

### Step 4 — 커리큘럼 교체 + 검증 (30분)
```
7. src/lib/stages.ts — Stage 09·15·20 교체
   - 09: css-strategies → key-props (제목, slug, concept 변경)
   - 15: signals → error-boundary
   - 20: mfe → use-ref-deep
8. docs/stages/PROGRESS.md 업데이트
9. pnpm exec tsc --noEmit
10. pnpm build
11. pnpm dev → 검증
```

---

## 검증 체크리스트

- [ ] `/stage/immutability` — 기존 3탭 stepper 없음, 3-topic 탭 표시
- [ ] Tab 1: 일반변수 버튼 → 화면 안 바뀜 / useState 버튼 → 즉시 반영
- [ ] Tab 2: Bad(push) / Good(spread) 나란히, 메모리 주소 시각화
- [ ] Tab 3: Immer produce 데모 동작
- [ ] 각 탭 코드 스니펫 복사 버튼 → 클립보드 복사
- [ ] `"use client"` 주석 코드 상단에 포함됨
- [ ] child/dev 토글 → 이론 설명 전환 (각 탭마다)
- [ ] `/stage/rendering` 등 다른 스테이지 → 기존 3탭 그대로 유지
- [ ] stages.ts Stage 09: key-props / 15: error-boundary / 20: use-ref-deep
- [ ] TypeScript 에러 0건
- [ ] 빌드 성공

---

## 관련 파일 현황

| 파일 | 상태 |
|---|---|
| `src/features/stage-01-immutability/theory.tsx` | ✅ 9단계 내러티브 완료 |
| `src/features/stage-01-immutability/playground.tsx` | ✅ BadCase/GoodCase/Immer 완료 |
| `src/features/stage-01-immutability/code-viewer.tsx` | ✅ 3탭 스니펫 완료 |
| `src/features/stage-01-immutability/combined.tsx` | ✅ 구현 완료 |
| `src/types/combined-stage.ts` | ✅ 구현 완료 |
| `src/components/layout/combined-stage-view.tsx` | ✅ 구현 완료 |
| `src/components/ui/copy-button.tsx` | ✅ 구현 완료 |
| `src/components/layout/stage-layout.tsx` | ✅ combined prop 추가 완료 |
| `src/app/stage/[slug]/page.tsx` | ✅ Combined 필드 추가 완료 |
| `src/lib/stages.ts` | ✅ 09·15·20 교체 완료 |
