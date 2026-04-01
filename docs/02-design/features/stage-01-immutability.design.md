# Design: stage-01-immutability

> Feature: Stage 01 — 불변성 & Immer 콘텐츠 + 진행률 시스템
> Architecture: Option C — Pragmatic Balance
> Created: 2026-04-01
> Phase: Design

---

## Context Anchor

| 항목 | 내용 |
|------|------|
| **WHY** | React Bible 첫 Stage이자 나머지 19개 Stage의 패턴 기준점. 여기서 정한 구조가 전체에 적용됨 |
| **WHO** | React 학습자 (초보~복습 목적 숙련자) — 초딩/개발자 이중 설명 모드 |
| **RISK** | immer 미설치 → playground 동작 불가. shadcn Tailwind v4 호환성 이슈 가능. Next.js 16.2.2 breaking changes 주의 |
| **SUCCESS** | Bad Case 체험 + 학습 완료 버튼 → Progress 바 갱신 + 새로고침 후 진도 유지 |
| **SCOPE** | Stage 01 + 진행률 인프라. Stage 02~20 콘텐츠 제외 |

---

## 1. Overview

**아키텍처: Option C — Pragmatic Balance**

```
stages.ts (정적 메타데이터)      progress-store.ts (동적 완료 상태)
       ↓                                    ↓
       └──────── resolveStageCompletion() ──┘
                          ↓
                   sidebar + stage-layout

page.tsx → slug별 dynamic import → Stage 01 content
```

- `stages.ts`는 title, difficulty, group 등 **변하지 않는 메타데이터** 담당
- `progress-store`는 `localStorage` 기반 **런타임 완료 상태** 담당
- `resolveStageCompletion(slug, store)` 유틸리티가 두 소스를 머지
- 향후 Stage 추가 시 `page.tsx`에 dynamic import 한 줄만 추가

---

## 2. 파일 구조

```
src/
├── stores/
│   └── progress-store.ts          [신규] Zustand + persist (skipHydration: true)
├── lib/
│   └── stage-utils.ts             [신규] resolveStageCompletion() 유틸리티
├── features/
│   └── stage-01-immutability/
│       ├── theory.tsx             [신규] 이중 설명 (초딩/개발자)
│       ├── playground.tsx         [신규] Bad/Good Case + 메모리 주소 시각화
│       └── code-viewer.tsx        [신규] 3개 코드 스니펫 탭
├── components/
│   ├── ui/
│   │   ├── card.tsx               [신규] shadcn Card
│   │   ├── tabs.tsx               [신규] shadcn Tabs (@radix-ui/react-tabs 기반)
│   │   └── progress.tsx           [신규] shadcn Progress
│   ├── providers/
│   │   └── store-hydration.tsx    [신규] 3개 persist 스토어 수동 rehydrate
│   └── layout/
│       ├── sidebar.tsx            [수정] Progress 바 + progress-store 연동 ("use client")
│       └── stage-layout.tsx       [수정] 스텝퍼 + 학습 완료 버튼
└── app/
    ├── layout.tsx                 [수정] StoreHydration 컴포넌트 삽입
    └── stage/[slug]/
        └── page.tsx               [수정] slug별 dynamic import
```

**의존성 변경**:
- `pnpm add immer` — playground Immer 데모용

---

## 3. 데이터 모델

### 3.1 ProgressStore

```typescript
// src/stores/progress-store.ts
type ProgressStore = {
  completedSlugs: string[]              // JSON 직렬화를 위해 배열 사용
  markDone: (slug: string) => void
  isCompleted: (slug: string) => boolean
}

// localStorage key: 'react-bible-progress'
// Zustand v5 + persist 미들웨어 (skipHydration: true — SSR hydration mismatch 방지)
```

**Zustand v5 주의사항**:
- v5에서 `create<T>()(...)` 패턴 사용 (기존 explanation-store.ts와 동일)
- `persist` 미들웨어는 `zustand/middleware`에서 import

### 3.2 resolveStageCompletion

```typescript
// src/lib/stage-utils.ts
export function resolveStageCompletion(
  slug: string,
  completedSlugs: string[],
  staticStatus: StageStatus
): boolean {
  return completedSlugs.includes(slug) || staticStatus === "done"
}
```

**이 유틸리티 사용처**:
- `sidebar.tsx` — StageItem의 완료 표시 + 전체 completedCount 계산
- `stage-layout.tsx` — "학습 완료" 버튼 비활성화 여부

---

## 4. 컴포넌트 설계

### 4.1 progress-store.ts

```typescript
export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      completedSlugs: [],
      markDone: (slug) => {
        const current = get().completedSlugs
        if (!current.includes(slug)) {
          set({ completedSlugs: [...current, slug] })
        }
      },
      isCompleted: (slug) => get().completedSlugs.includes(slug),
    }),
    { name: "react-bible-progress", skipHydration: true }
  )
)
```

### 4.2 sidebar.tsx 변경

**추가 영역**: Header와 Stage list 사이에 Progress 바 삽입

```
┌─────────────────────────────┐
│ 🧬 React Bible              │  ← 기존 헤더
├─────────────────────────────┤
│ ████████░░░░░░░░░░░░  3/20  │  ← [신규] Progress 바
├─────────────────────────────┤
│  Phase 1: 입력과 기초        │  ← 기존 Stage 목록
│   01 불변성 & Immer ✓       │
│   ...                       │
└─────────────────────────────┘
```

**변경 포인트**:
- `useProgressStore()` import 추가
- `completedSlugs` 기반 `completedCount` 계산
- `resolveStageCompletion()` 으로 각 StageItem 완료 상태 결정
- Footer 텍스트도 progress-store 기반으로 변경

**SSR Hydration 처리**:
- `sidebar.tsx`는 `"use client"` → `useProgressStore` 직접 사용 가능
- 별도 `<ProgressBar />` Client Component 분리 불필요
- SSR hydration mismatch는 `skipHydration: true` + `StoreHydration` 컴포넌트로 전역 처리 (§7 참조)

### 4.3 stage-layout.tsx 변경

**스텝퍼 디자인**:
```
기존 탭:  [📖 이론] [⚗️ 실험실] [💻 코드 뷰어]

새 스텝퍼:
  ●──────────●──────────○
  이론        실험실      코드뷰어
  (현재)
```

구현:
- 기존 `tabs` 배열과 `activeTab` 상태 **재사용** (로직 변경 없음)
- 탭 버튼 **스타일만** 변경 (stepper 연결선 추가)
- Framer Motion으로 현재 스텝 `pulse` 애니메이션 (선택사항)

**학습 완료 버튼**:
- 위치: 하단 네비게이션 바, 이전/다음 버튼 사이 (중앙)
- 조건부 렌더링:
  - 미완료 → `✅ 학습 완료` 버튼 (primary style)
  - 완료됨 → `✓ 완료됨` (disabled, green text)
- `"use client"` 이미 있음 → 직접 progress-store 사용 가능

### 4.4 page.tsx 변경 (dynamic import 패턴)

```typescript
// Next.js 16.x — params가 Promise<{slug}> 타입 (기존 코드 패턴 유지)
import dynamic from "next/dynamic"

// slug별 dynamic import 맵
const STAGE_CONTENT: Record<string, {
  Theory: React.ComponentType
  Playground: React.ComponentType
  CodeViewer: React.ComponentType
}> = {
  immutability: {
    Theory: dynamic(() => import("@/features/stage-01-immutability/theory").then(m => ({ default: m.Stage01Theory }))),
    Playground: dynamic(() => import("@/features/stage-01-immutability/playground").then(m => ({ default: m.Stage01Playground }))),
    CodeViewer: dynamic(() => import("@/features/stage-01-immutability/code-viewer").then(m => ({ default: m.Stage01CodeViewer }))),
  },
  // Stage 02 추가 시: rendering: { ... }
}
```

**이 패턴의 장점**:
- `page.tsx`는 Server Component 유지
- 각 Stage 파일은 필요할 때만 번들에 포함 (code splitting)
- 새 Stage 추가 = STAGE_CONTENT 객체에 한 항목 추가

---

## 5. Stage 01 콘텐츠 설계

### 5.1 theory.tsx 레이아웃

```
┌─────────────────────────────────────────┐
│  [🟢 초딩 모드] / [🔵 개발자 모드]  토글  │
├──────────────┬──────────────┬───────────┤
│   Card 1     │   Card 2     │  Card 3   │
│ 불변성이란?  │ React에서 왜? │  Immer란? │
│             │              │           │
│ 택배 박스   │ Object.is()  │ produce() │
│ 비유        │ 참조 동일성  │ 마법사    │
└──────────────┴──────────────┴───────────┘
```

- `useExplanationStore()` → mode 분기
- 3개 Card를 `grid grid-cols-1 md:grid-cols-3` 레이아웃
- 각 Card 내부 콘텐츠: 제목 + 핵심 설명 + 코드 예시 한 줄

**초딩용 핵심 문장**:
> "React는 택배를 주소로 구별해요. 같은 박스에 물건을 추가하면 주소가 안 바뀌어서 React가 변화를 못 느껴요."

**개발자용 핵심 문장**:
> "`Object.is(prev, next)`가 false여야 리렌더가 일어납니다. 직접 변이(mutation)는 참조 동일성을 깨지 않아 React의 변경 감지를 우회합니다."

### 5.2 playground.tsx 레이아웃

```
┌─────────────────────────────────────────────────┐
│  🔴 Bad Case: 직접 변이          메모리 주소 패널 │
│  ─────────────────────────────  ──────────────── │
│  [추가 버튼]  내 목록: []        Before: 0xA3F2   │
│  실제 배열: ["사과"]             After:  0xA3F2   │
│  화면 배열: []  ← 안 바뀜!      ⚠️ 동일 주소!    │
│                                                  │
│  🟢 Good Case: 불변 업데이트     메모리 주소 패널 │
│  ─────────────────────────────  ──────────────── │
│  [추가 버튼]  내 목록: ["사과"]  Before: 0xA3F2   │
│                                 After:  0xB71C   │
│                                 ✅ 새 주소!       │
│                                                  │
│  🔵 Immer 체험: produce()       메모리 주소 패널 │
│  ─────────────────────────────  ──────────────── │
│  중첩 객체 직접 수정 → 불변성 유지 자동          │
└─────────────────────────────────────────────────┘
```

**Bad Case 구현 핵심**:
```typescript
// 실제 배열은 변하지만 React는 모름
const actualArrayRef = useRef<string[]>([])  // 화면 밖에서 관리
const [displayed, setDisplayed] = useState<string[]>([])  // React 상태

function badAdd() {
  actualArrayRef.current.push("사과")  // 직접 변이
  // setDisplayed 호출 안 함 → 화면 안 바뀜
  // 단, "실제 배열" 디버그 패널은 DOM 직접 업데이트
}
```

**메모리 주소 mock 생성**:
```typescript
function genMockAddress() {
  return `0x${Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0')}`
}
// SSR/CSR Math.random() 불일치 방지:
// useState("0x????") 초기값 고정 + useEffect(() => setState(genMockAddress()), []) 패턴
// Bad Case: fixedAddress를 useState로 관리, reset 시 새 주소 생성
// Good Case: prevAddress(useRef) + curAddress(useState) 모두 "0x????" 초기화 후 useEffect에서 설정
```

### 5.3 code-viewer.tsx 레이아웃

shadcn Tabs 3개:

| 탭 | 코드 | 설명 |
|----|------|------|
| ❌ 직접 변이 | `arr.push(item)` | "React가 주소가 같아서 변화를 못 감지" |
| ✅ 스프레드 | `[...arr, item]` | "새 배열 = 새 주소 = React가 감지" |
| ✨ Immer | `produce(state, draft => { draft.push(item) })` | "복잡한 중첩 객체도 한 줄로" |

코드 블록: `<pre className="bg-zinc-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">`
(Prism 없이 정적 텍스트, 주요 키워드는 `<span className="text-[색상]">` 수동 강조)

---

## 6. shadcn 컴포넌트 설계

`components.json` 존재 확인 → `npx shadcn add card tabs progress` 사용 가능.

**단, Tailwind v4 호환성 주의**:
- shadcn은 기본적으로 Tailwind v3 CSS variables 방식을 사용
- `globals.css`에 CSS 변수(`--background`, `--foreground` 등)가 없으면 shadcn 컴포넌트 스타일이 깨질 수 있음
- 설치 후 스타일 확인 필수. 문제 시 Tailwind 직접 구현으로 교체

---

## 7. Hydration 처리 전략

**실제 구현된 방식 (설계 대비 변경됨)**

zustand `persist` 미들웨어가 SSR에서 기본값을, 클라이언트에서 localStorage 값을 읽어 HTML 불일치를 발생시킴.

**적용된 해결책**: 3개 persist 스토어에 `skipHydration: true` + `StoreHydration` 컴포넌트로 수동 rehydrate

```typescript
// 모든 persist 스토어에 동일하게 적용
persist(
  (set, get) => ({ ... }),
  { name: "react-bible-progress", skipHydration: true }  // SSR에서 localStorage 읽기 건너뜀
)
```

```typescript
// src/components/providers/store-hydration.tsx
"use client"
export function StoreHydration() {
  useEffect(() => {
    useProgressStore.persist.rehydrate()      // 클라이언트 마운트 후 localStorage 복원
    useExplanationStore.persist.rehydrate()
    useThemeStore.persist.rehydrate()
  }, [])
  return null
}
```

`<StoreHydration />`을 `layout.tsx`의 최상단(`<QueryProvider>` 바로 아래)에 삽입.

**적용 대상 스토어**: `progress-store`, `explanation-store`, `theme-store` 3개 모두.

**`sidebar.tsx`**: `"use client"` 컴포넌트로 유지 → `useProgressStore` 직접 사용 가능. 별도 `SidebarProgress` 분리 불필요.

**`playground.tsx` genMockAddress**: `useRef(genMockAddress())` → `useState("0x????")` + `useEffect`로 변경 (Math.random SSR/CSR 불일치 방지)

---

## 8. 주요 기술 결정

| 결정 | 선택 | 이유 |
|------|------|------|
| progress-store 직렬화 | `string[]` (배열) | JSON.stringify 직렬화 안전. Set은 JSON 지원 안 됨 |
| hydration 처리 | Client Component 분리 | sidebar를 Server Component로 유지하면서 CSR 데이터 사용 |
| stage content 로딩 | dynamic import + STAGE_CONTENT 맵 | code splitting + 새 Stage 추가 용이 |
| Immer 사용 | 직접 설치 (`pnpm add immer`) | playground 데모 목적, 번들 증가 최소 |
| 코드 하이라이팅 | 수동 span 태그 | Prism.js 설치 없이 핵심 부분만 강조. Stage 02~03 이후 Prism 도입 검토 |
| Bad Case 구현 | useRef + 비표시 | React 상태 밖에서 실제 배열 변이, 화면에는 원래 상태 표시 |

---

## 9. 성공 기준 — 상세 검증 방법

| 기준 | 검증 방법 |
|------|----------|
| Bad Case 화면 미갱신 | "추가" 클릭 → displayed 배열 길이가 0 유지 확인 |
| Good Case 즉시 반영 | "추가" 클릭 → 화면에 아이템 표시 확인 |
| 메모리 주소 시각화 | Bad: 빨간 "동일 주소" 텍스트 / Good: 초록 "새 주소" 텍스트 |
| 학습 완료 버튼 | 클릭 후 버튼 → "✓ 완료됨" 변경 확인 |
| Progress 바 갱신 | 완료 클릭 후 사이드바 Progress 값 상승 확인 |
| localStorage 영속화 | 새로고침 후 사이드바 count 유지 확인 |
| TypeScript 에러 0건 | `pnpm run build` 성공 |

---

## 10. 의존성 설치 순서

```bash
# 1. Immer 설치
pnpm add immer

# 2. shadcn 컴포넌트 설치 (components.json 존재 확인됨)
npx shadcn@latest add card
npx shadcn@latest add tabs  
npx shadcn@latest add progress

# 주의: @radix-ui/react-tabs는 이미 설치됨 → shadcn tabs가 이를 활용
```

---

## 11. Implementation Guide

### 11.1 구현 순서

```
Module 1: Infrastructure
  1-1. pnpm add immer
  1-2. npx shadcn add card tabs progress (실패 시 직접 작성)
  1-3. src/stores/progress-store.ts 생성
  1-4. src/lib/stage-utils.ts 생성 (resolveStageCompletion)

Module 2: Layout 개선
  2-1. src/components/layout/progress-bar.tsx [신규 Client Component]
  2-2. src/components/layout/sidebar.tsx 수정 (ProgressBar 삽입)
  2-3. src/components/layout/stage-layout.tsx 수정 (스텝퍼 + 완료 버튼)

Module 3: Stage 01 콘텐츠
  3-1. src/features/stage-01-immutability/theory.tsx
  3-2. src/features/stage-01-immutability/playground.tsx
  3-3. src/features/stage-01-immutability/code-viewer.tsx

Module 4: 연결 (Wiring)
  4-1. src/app/stage/[slug]/page.tsx — STAGE_CONTENT 맵 + dynamic import
  4-2. 빌드 검증 (pnpm build)
```

### 11.2 의존성 그래프

```
progress-store.ts
    ↓
stage-utils.ts (resolveStageCompletion)
    ↓
progress-bar.tsx → sidebar.tsx
    ↓
stage-layout.tsx (학습 완료 버튼)

immer
    ↓
playground.tsx

shadcn (card, tabs, progress)
    ↓
theory.tsx, code-viewer.tsx, progress-bar.tsx

[theory, playground, code-viewer]
    ↓
page.tsx (STAGE_CONTENT 맵)
```

### 11.3 Session Guide

| 세션 | --scope | 포함 모듈 | 예상 작업량 |
|------|---------|----------|------------|
| Session 1 | `--scope module-1,module-2` | 인프라 + 레이아웃 | ~150줄 |
| Session 2 | `--scope module-3,module-4` | Stage 01 콘텐츠 + 연결 | ~250줄 |
| (Full) | (없음) | 전체 | ~400줄 |

**권장**: Session 1 → 빌드 확인 → Session 2 순서
