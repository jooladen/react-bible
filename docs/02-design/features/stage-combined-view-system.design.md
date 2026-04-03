# Design: stage-combined-view-system

> Feature: Topic-Tab Combined View 시스템 + Stage 01 적용 + 커리큘럼 보완
> Architecture: Option C — Pragmatic Balance
> Created: 2026-04-04
> Phase: Design

---

## Context Anchor

| 항목 | 내용 |
|------|------|
| **WHY** | 이론/실험실/코드뷰어 탭 분리 → 개념 보고 탭 전환해야 데모 확인 가능. 학습 몰입 끊김. 한 화면에서 읽고-보고-복붙까지 완결해야 "갖고 싶은 앱"이 됨 |
| **WHO** | React 어설프게 쓰는 개발자 — "왜 화면이 안 바뀌지?" 경험자. 개념+실행+코드를 동시에 보고 싶어함 |
| **RISK** | StageLayout 수정 시 기존 19개 스테이지 3탭 동작 깨질 위험. combined prop 미전달 시 fallback 처리 필수 |
| **SUCCESS** | `/stage/immutability`에서 3-topic 탭 동작 + 각 탭 이론/데모/코드 한 화면 + 복사 버튼 작동 + 기존 스테이지 영향 없음 |
| **SCOPE** | Combined View 시스템 구축 + Stage 01 적용 + stages.ts 커리큘럼 3개 교체. Stage 02~20 콘텐츠 구현 제외 |

---

## 1. Overview

**아키텍처: Option C — Pragmatic Balance**

```
StageLayout (combined prop 추가 — 최소 수정)
  ├── combined 없음 → 기존 3탭 동작 (하위 호환)
  └── combined 있음 → CombinedStageView 렌더링
                       └── TopicTab[] 배열 기반 범용 렌더러
                            ├── 주제 탭 (스테이지마다 가변)
                            ├── 이론 영역 (child/dev 토글 연동)
                            ├── 라이브 데모
                            └── 코드 스니펫 + CopyButton

page.tsx
  └── STAGE_CONTENT에 Combined 필드 추가 (선택적)
       └── immutability → Stage01Combined 동적 import

Stage01Combined
  └── TOPICS: TopicTab[] 배열 정의
       ├── Tab 1: 일반변수 vs 상태변수
       ├── Tab 2: 배열/객체 불변성
       └── Tab 3: Immer
```

**핵심 원칙**:
- StageLayout의 이전/다음 네비게이션·progress 버튼은 combined 여부 무관하게 동작
- TheoryModeToggle은 combined 모드에서도 유지 (child/dev 모드 공통 사용)
- Stage N 추가 시: `TOPICS: TopicTab[]` 배열만 정의하면 나머지 렌더링은 CombinedStageView가 처리

---

## 2. 파일 구조

```
src/
├── types/
│   └── combined-stage.ts              [신규] TopicTab, CodeSnippet 타입
├── components/
│   ├── ui/
│   │   └── copy-button.tsx            [신규] 클립보드 복사 버튼
│   └── layout/
│       ├── combined-stage-view.tsx    [신규] 범용 Topic-Tab 렌더러
│       └── stage-layout.tsx           [수정] combined?: React.ReactNode prop 추가
├── features/
│   └── stage-01-immutability/
│       └── combined.tsx               [신규] Stage 01 TOPICS 배열 + 데모 컴포넌트
└── app/
    └── stage/[slug]/
        └── page.tsx                   [수정] STAGE_CONTENT에 Combined 필드 추가

src/lib/
    └── stages.ts                      [수정] Stage 09·15·20 slug·제목·concept 교체

docs/stages/
    └── PROGRESS.md                    [수정] 교체된 Stage 반영
```

---

## 3. 타입 설계

### 3.1 TopicTab (`src/types/combined-stage.ts`)

```typescript
export type CodeSnippet = {
  label: string        // 탭 레이블 — "❌ 직접 변이", "✅ spread", "✨ Immer"
  snippet: string      // VSCode 복붙 즉시 실행 가능한 완성형 코드 문자열
  useClient?: boolean  // true → 코드 상단에 "use client" 설명 주석 자동 포함
}

export type TopicTab = {
  id: string
  label: string        // 탭 레이블 — "일반 변수", "배열/객체", "Immer"
  icon?: string        // 선택적 이모지 아이콘
  theory: {
    child: React.ReactNode   // 🟢 초딩 모드 설명
    dev: React.ReactNode     // 🔵 개발자 모드 설명
  }
  demo: React.ReactNode      // 라이브 인터랙티브 데모 컴포넌트
  code: CodeSnippet[]        // 1개 이상 (mini-tab으로 전환)
}
```

---

## 4. 컴포넌트 설계

### 4.1 CopyButton (`src/components/ui/copy-button.tsx`)

```typescript
type CopyButtonProps = {
  text: string         // 복사할 문자열
  className?: string
}

// 동작:
// 1. 버튼 클릭 → navigator.clipboard.writeText(text)
// 2. 성공 → 텍스트를 "✓ 복사됨"으로 2초간 교체 → "복사"로 원복
// 3. 실패 시 (clipboard API 미지원) → 조용히 무시
```

**스타일**: 우측 상단 고정 포지션 (코드 블록 relative 컨테이너 기준)
```
┌────────────────────────────────[복사]┐
│  코드 내용...                         │
└──────────────────────────────────────┘
```

### 4.2 CombinedStageView (`src/components/layout/combined-stage-view.tsx`)

```typescript
type CombinedStageViewProps = {
  tabs: TopicTab[]
}
```

**내부 상태**:
```typescript
const [activeTab, setActiveTab] = useState(tabs[0].id)
const [activeCode, setActiveCode] = useState(0)  // 코드 mini-tab 인덱스
const { mode } = useExplanationStore()            // child | dev
```

**레이아웃 (데스크탑 md 이상)**:
```
┌── 주제 탭 ──────────────────────────────────────────────┐
│  [Tab 1] [Tab 2] [Tab 3]  ...가변                        │
├── 이론 영역 ────────────────────────────────────────────┤
│  mode === "child" ? tab.theory.child : tab.theory.dev   │
├────────────────────────┬────────────────────────────────┤
│  라이브 데모 (좌 50%)   │  코드 스니펫 (우 50%)           │
│  tab.demo 렌더링        │  [❌탭] [✅탭] mini-tab          │
│                        │  ┌─────────────────────┐       │
│                        │  │  [복사 버튼]          │       │
│                        │  │  코드 내용...         │       │
│                        │  └─────────────────────┘       │
└────────────────────────┴────────────────────────────────┘
```

**레이아웃 (모바일 md 미만)**:
```
이론 → 데모 → 코드 수직 스택
```

**탭 전환 시**:
- `activeTab` 변경 → theory, demo, code 모두 해당 탭 내용으로 교체
- `activeCode` 초기화 → 0 (첫 번째 코드 스니펫)
- Framer Motion `AnimatePresence` — 기존 StageLayout과 동일한 전환 효과 (opacity + y)

### 4.3 코드 스니펫 포맷

`useClient: true`인 경우 snippet 앞에 자동 삽입:

```
// "use client"  // Next.js의 경우 주석을 제거하세요.

{실제 snippet 내용}
```

코드 블록 스타일: 기존 패턴 유지
```
rounded-lg bg-zinc-900 p-4 font-mono text-xs leading-relaxed text-zinc-100 whitespace-pre-wrap light:bg-zinc-50 light:text-zinc-800
```

### 4.4 StageLayout 수정 (`src/components/layout/stage-layout.tsx`)

**변경 최소화 원칙**: 기존 3탭 로직 건드리지 않음

```typescript
// 타입 변경
type StageLayoutProps = {
  stage: Stage
  theory?: React.ReactNode
  playground?: React.ReactNode
  code?: React.ReactNode
  combined?: React.ReactNode    // ← 추가
}

// Content area 조건 분기
// combined 있을 때:
//   - 기존 3탭 Stepper 숨김
//   - TheoryModeToggle 유지 (combined 내부에서도 child/dev 사용)
//   - combined 컴포넌트 바로 렌더링
// combined 없을 때:
//   - 기존 로직 그대로 (activeTab, Stepper, contentMap 등)
```

**헤더 영역**: stage 제목·난이도·그룹명 표시 — combined 여부 무관하게 동일
**하단 영역**: 이전/다음 버튼·학습 완료 버튼 — combined 여부 무관하게 동일

### 4.5 page.tsx 수정

```typescript
// STAGE_CONTENT 타입 확장
const STAGE_CONTENT: Record<string, {
  Theory: React.ComponentType
  Playground: React.ComponentType
  CodeViewer: React.ComponentType
  Combined?: React.ComponentType    // ← 선택적 추가
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
  // 나머지 스테이지: Combined 없음 → 기존 3탭
}

// 렌더링 변경
<StageLayout
  stage={stage}
  combined={content?.Combined ? <content.Combined /> : undefined}
  theory={content ? <content.Theory /> : undefined}
  playground={content ? <content.Playground /> : undefined}
  code={content ? <content.CodeViewer /> : undefined}
/>
```

### 4.6 Stage01Combined (`src/features/stage-01-immutability/combined.tsx`)

```typescript
"use client"
// Design Ref: §4.6 — TopicTab 배열 기반 Combined View (Option C)

const TOPICS: TopicTab[] = [
  {
    id: "primitive",
    label: "일반 변수",
    icon: "🔢",
    theory: { child: <PrimitiveTheoryChild />, dev: <PrimitiveTheoryDev /> },
    demo: <PrimitiveDemo />,
    code: [
      { label: "❌ 일반 변수", snippet: BAD_COUNTER_SNIPPET, useClient: true },
      { label: "✅ useState",  snippet: GOOD_COUNTER_SNIPPET, useClient: true },
    ],
  },
  {
    id: "array-object",
    label: "배열/객체",
    icon: "📦",
    theory: { child: <ArrayTheoryChild />, dev: <ArrayTheoryDev /> },
    demo: <ArrayObjectDemo />,     // BadCasePanel + GoodCasePanel (playground.tsx에서 이전)
    code: [
      { label: "❌ push",    snippet: BAD_LIST_SNIPPET, useClient: true },
      { label: "✅ spread",  snippet: GOOD_LIST_SNIPPET, useClient: true },
    ],
  },
  {
    id: "immer",
    label: "Immer",
    icon: "✨",
    theory: { child: <ImmerTheoryChild />, dev: <ImmerTheoryDev /> },
    demo: <ImmerDemo />,           // ImmerPanel (playground.tsx에서 이전)
    code: [
      { label: "❌ 중첩 spread", snippet: BAD_NESTED_SNIPPET, useClient: true },
      { label: "✅ produce()",   snippet: GOOD_IMMER_SNIPPET, useClient: true },
    ],
  },
]

export function Stage01Combined() {
  return <CombinedStageView tabs={TOPICS} />
}
```

**playground.tsx 처리**: BadCasePanel, GoodCasePanel, ImmerPanel 함수를 combined.tsx로 복사·이전.
playground.tsx는 Stage01Playground export 유지 (기존 page.tsx 참조 깨지지 않게).

---

## 5. Stage 01 탭별 콘텐츠 상세

### Tab 1 — 일반 변수 vs 상태 변수

**이론 child**: "일반 변수에 값을 저장해도 React는 몰라요. useState로 저장해야 React가 화면을 업데이트해요."

**이론 dev**: "일반 변수는 컴포넌트 함수 재실행 시마다 초기화. setXxx 호출 없으면 리렌더 미트리거. React의 상태는 렌더 사이클 밖에 Fiber 노드에 저장됨."

**데모** — 두 카운터 나란히:
```
┌── ❌ 일반 변수 ────────┐  ┌── ✅ useState ──────────┐
│  카운트: 0             │  │  카운트: 0               │
│  [+1 버튼]             │  │  [+1 버튼]               │
│  (클릭해도 안 바뀜)    │  │  (즉시 반영)             │
└───────────────────────┘  └─────────────────────────┘
```
구현: `let badCount = 0` 일반 변수 — `onClick`에서 `badCount++` 만 수행, `setXxx` 없으므로 리렌더 미트리거, 화면 카운트 0 고정. 힌트 텍스트 "👇 아래 버튼을 클릭해 보세요" 데모 상단 표시.

**코드 스니펫**:
```tsx
// BAD_COUNTER_SNIPPET
// "use client"  // Next.js의 경우 주석을 제거하세요.

export default function BadCounter() {
  let count = 0  // ❌ 일반 변수 — 렌더마다 0으로 초기화
  return (
    <div>
      <p>카운트: {count}</p>
      <button onClick={() => { count++ }}>
        +1 (화면 안 바뀜)
      </button>
    </div>
  )
}

// GOOD_COUNTER_SNIPPET
// "use client"  // Next.js의 경우 주석을 제거하세요.

import { useState } from "react"

export default function GoodCounter() {
  const [count, setCount] = useState(0)  // ✅ React가 추적
  return (
    <div>
      <p>카운트: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  )
}
```

### Tab 2 — 배열/객체 불변성

**이론 child**: "React는 택배 주소로 변화를 감지해요. 같은 배열에 push하면 주소가 그대로 → React가 몰라요. `[...arr, item]`으로 새 배열을 만들어야 새 주소가 생겨요."

**이론 dev**: "`Object.is(prev, next)` 참조 비교. `push()`는 동일 참조 유지 → `false` 미반환 → 리렌더 미트리거. spread는 새 배열 생성 → 새 참조 → 리렌더."

**데모**:
- BadCasePanel: 실제 배열(`actualCount` state — N개 증가) / 화면 목록(`displayedCount` — 0개 고정) + 메모리 주소 패널. 경고: "배열은 N개인데 화면은 여전히 0개!"
- GoodCasePanel: 화면 목록(`items.length` — N개 즉시 반영) + 메모리 주소 패널
- 힌트: "👇 아래 추가 버튼을 눌러보세요" 표시

**코드 스니펫**: BAD_LIST(push) / GOOD_LIST(spread)

### Tab 3 — Immer

**이론 child**: "Immer는 마법사예요. '막 바꿔도 괜찮아~' 하면, 뒤에서 새 박스에 복사해서 돌려줘요. 코드가 훨씬 간결해져요."

**이론 dev**: "Immer `produce()`는 Proxy 기반 임시 draft를 생성. draft를 직접 변이해도 내부적으로 structural sharing으로 새 불변 객체 반환. 중첩 깊이 무관하게 동일 문법."

**데모**: 기존 playground.tsx의 ImmerPanel + 중첩 객체 spread 지옥 vs produce() 비교
- 힌트: "👇 아래 추가 버튼을 눌러보세요" 표시

**코드 스니펫**: BAD_NESTED(spread 지옥) / GOOD_IMMER(produce)

---

## 6. 커리큘럼 교체 (`src/lib/stages.ts`)

### 교체 항목 상세

```typescript
// Stage 09 교체
{
  id: 9,
  slug: "key-props",                           // css-strategies → key-props
  title: "Key Props & 리스트 렌더링",
  subtitle: "key의 진짜 의미",
  concept: "key={index} 한 줄이 앱을 망가뜨리는 이유.",
  difficulty: "easy",
  group: 2,
  groupName: "가공과 최적화",
  status: "todo",
}

// Stage 15 교체
{
  id: 15,
  slug: "error-boundary",                      // signals → error-boundary
  title: "Error Boundary",
  subtitle: "에러 방어막",
  concept: "에러 하나로 앱 전체가 죽지 않게 방어막 치기.",
  difficulty: "medium",
  group: 3,
  groupName: "확장과 연결",
  status: "todo",
}

// Stage 20 교체
{
  id: 20,
  slug: "use-ref-deep",                        // mfe → use-ref-deep
  title: "useRef 심화",
  subtitle: "렌더 밖의 기억",
  concept: "DOM ref 너머, 렌더 사이에 값을 기억하는 진짜 useRef.",
  difficulty: "medium",
  group: 4,
  groupName: "운영과 인프라",
  status: "todo",
}
```

---

## 7. 주요 기술 결정

| 결정 | 선택 | 이유 |
|------|------|------|
| combined 통합 방식 | StageLayout에 prop 추가 | 이전/다음 네비게이션·progress 버튼 중복 구현 회피 |
| TopicTab 타입 위치 | `src/types/combined-stage.ts` | 기존 `src/types/stage.ts` 오염 방지, 관심사 분리 |
| 코드 스니펫 저장 | 각 combined.tsx 내 상수 문자열 | 외부 파일 불필요, combined.tsx 자기완결성 유지 |
| playground.tsx 처리 | 데모 함수 복사 후 기존 export 유지 | page.tsx Stage01Playground 참조 깨지지 않음 |
| CopyButton 위치 | `src/components/ui/` | 다른 스테이지에서도 재사용 가능 |
| 코드 하이라이팅 | 기존 수동 span 방식 유지 | Prism 미설치 상태, 일관성 유지 |
| TheoryModeToggle | combined 모드에서도 유지 | child/dev 토글은 전역 UX, 숨기면 혼란 |

---

## 8. 성공 기준 검증

| 기준 | 검증 방법 |
|------|----------|
| 3-topic 탭 렌더링 | `/stage/immutability` 접속 → 탭 3개 표시, 이론/실험실/코드뷰어 stepper 없음 |
| 탭 전환 | 각 탭 클릭 → 이론·데모·코드 모두 교체 확인 |
| Tab 1 데모 | 일반변수 +1 → 화면 불변 / useState +1 → 즉시 반영 |
| Tab 2 데모 | push 버튼 → 화면 불변·주소 동일 / spread 버튼 → 즉시 반영·주소 변경 |
| Tab 3 데모 | produce() 버튼 → 중첩 객체 즉시 반영 |
| 복사 버튼 | 각 코드 복사 버튼 클릭 → 클립보드에 전체 snippet 복사 확인 |
| "use client" 주석 | 코드 블록 상단에 설명 주석 표시 확인 |
| child/dev 토글 | TheoryModeToggle 전환 → 각 탭 이론 설명 교체 확인 |
| 기존 스테이지 | `/stage/rendering` 접속 → 기존 3탭 stepper 정상 표시 |
| stages.ts 교체 | 사이드바에서 09=Key Props, 15=Error Boundary, 20=useRef 심화 표시 |
| TypeScript | `pnpm exec tsc --noEmit` 에러 0건 |
| 빌드 | `pnpm build` 성공 |

---

## 9. Implementation Guide

### 9.1 구현 순서

```
Module 1: 타입 + 유틸리티
  1-1. src/types/combined-stage.ts — TopicTab, CodeSnippet 타입
  1-2. src/components/ui/copy-button.tsx — 클립보드 복사 버튼

Module 2: 범용 렌더러 + 레이아웃 연결
  2-1. src/components/layout/combined-stage-view.tsx — Topic-Tab 렌더러
  2-2. src/components/layout/stage-layout.tsx — combined prop 추가
  2-3. src/app/stage/[slug]/page.tsx — Combined 필드 지원

Module 3: Stage 01 구현체
  3-1. src/features/stage-01-immutability/combined.tsx
       — PrimitiveDemo (일반변수 vs useState 나란히)
       — BadCasePanel, GoodCasePanel, ImmerPanel (playground.tsx에서 복사)
       — TOPICS 배열 정의 + 코드 스니펫 상수

Module 4: 커리큘럼 교체 + 최종 검증
  4-1. src/lib/stages.ts — Stage 09·15·20 교체
  4-2. docs/stages/PROGRESS.md 업데이트
  4-3. pnpm exec tsc --noEmit
  4-4. pnpm build
  4-5. pnpm dev → 검증 체크리스트 확인
```

### 9.2 의존성 그래프

```
combined-stage.ts (타입)
    ↓
copy-button.tsx
    ↓
combined-stage-view.tsx (TopicTab[] 렌더러)
    ↓
stage-layout.tsx (combined prop 추가)
    ↓
page.tsx (Combined 필드 + dynamic import)
    ↓
stage-01-immutability/combined.tsx (TOPICS 배열)
```

### 9.3 Session Guide

| 세션 | 모듈 | 주요 파일 | 예상 작업량 |
|------|------|----------|------------|
| Session 1 | Module 1, 2 | combined-stage.ts, copy-button.tsx, combined-stage-view.tsx, stage-layout.tsx, page.tsx | ~200줄 |
| Session 2 | Module 3, 4 | combined.tsx (Stage 01), stages.ts | ~350줄 |
| (Full) | 전체 | 모두 | ~550줄 |

**권장**: Session 1 완료 후 `pnpm build` 확인 → Session 2 시작
