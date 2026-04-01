# Design: React Heartbeat Lab

## Context Anchor (Plan에서 복사)

| 항목 | 내용 |
|------|------|
| **WHY** | 29년 SI 경력 개발자가 AI-native 시대를 위해 모던 리액트를 정리한 "바이블" 제작 |
| **WHO** | 주영준(준) — 1인 기업 목표, Dev-Nexus 포트폴리오 구축 중 |
| **RISK** | 20단계 전체 구현 시 컨텍스트 분산 → 1단계씩 PDCA 반복으로 완화 |
| **SUCCESS** | pnpm build 통과 + 20개 Stage 각각 Gap ≥ 90% |
| **SCOPE** | 이번 세션: 프로젝트 뼈대. 다음 세션부터: Stage 01~20 순차 구현 |

---

## 1. 아키텍처 개요

**선택: Option C — Pragmatic Balance** (기능 분리 + 과잉 설계 없음)

```
┌──────────────────────────────────────────────────────┐
│  TopBar (h-12): react-bible v1.0.0 | [🟢●──○🔵 토글] │
├──────────────┬───────────────────────────────────────┤
│              │                                       │
│  Sidebar     │  Stage Content Area                   │
│  (w-72)      │  ┌─────────────────────────────────┐ │
│  ─ Phase 1   │  │ Stage Header (번호/제목/개념)    │ │
│    01 ~       │  ├─────────────────────────────────┤ │
│    05        │  │ [📖이론] [⚗️실험실] [💻코드]   │ │  ← 탭
│  ─ Phase 2   │  ├─────────────────────────────────┤ │
│    06 ~       │  │                                 │ │
│    10        │  │  콘텐츠 영역                     │ │
│  ─ Phase 3   │  │  (각 Stage 컴포넌트 주입)        │ │
│  ─ Phase 4   │  │                                 │ │
│              │  └─────────────────────────────────┘ │
└──────────────┴───────────────────────────────────────┘
```

---

## 2. 컴포넌트 계층 구조

```
app/layout.tsx
├── QueryProvider (TanStack Query)
├── StoreHydration (persist 스토어 3개 rehydrate — 클라이언트 마운트 후)
├── Header
│   ├── 로고: "react-bible / v1.0.0" (sm 이상) / "RB" (모바일)
│   └── ExplanationToggle (Zustand ← localStorage)
│       ├── 텍스트 레이블: hidden sm:inline (모바일 숨김)
│       └── HintTooltip (? 버튼 + hover tooltip + 첫방문 pulse)
└── MainLayout (client — 사이드바 토글 상태 관리)
    ├── Backdrop Overlay (모바일 전용, 사이드바 열릴 때 black/60)
    ├── Sidebar (fixed z-40 모바일 / static 데스크톱)
    │   ├── Header: React Bible 로고 + × 닫기 버튼 (md:hidden)
    │   ├── Progress 바 (completedCount / 20)
    │   ├── STAGE_GROUPS × 4 (그룹명 - 서브타이틀)
    │   └── StageItem × 20 (Link + DifficultyBadge)
    ├── SidebarToggleButton (fixed › 아이콘 — 사이드바 닫혔을 때만)
    └── main
        └── app/page.tsx → HomeRedirect (localStorage → /stage/[lastSlug])
        └── app/stage/[slug]/page.tsx
            └── StageLayout
                ├── Stage Header (번호, 제목 : concept 인라인, subtitle)
                ├── Tab Bar / Stepper (이론/실험실/코드뷰어)
                ├── Content Area
                │   ├── theory.tsx    (ExplanationMode 분기)
                │   ├── playground.tsx (인터렉티브 실험실)
                │   └── code-viewer.tsx (Syntax Highlight)
                └── Nav Bar (← 이전 | 학습완료 버튼 | 다음 →, 키보드 ←/→)
```

---

## 3. 데이터 모델

### Stage 타입 (`src/types/stage.ts`)

```typescript
type Difficulty = "easy" | "medium" | "hard"
type StageStatus = "done" | "wip" | "todo"
type StageGroup = 1 | 2 | 3 | 4
type ExplanationMode = "child" | "dev"

type Stage = {
  id: number          // 1~20
  slug: string        // URL slug
  title: string       // 표시 제목
  subtitle: string    // 부제
  concept: string     // 핵심 개념 1줄
  difficulty: Difficulty
  group: StageGroup
  groupName: string
  status: StageStatus
}
```

### Zustand 스토어 (`src/stores/explanation-store.ts`)

```typescript
type ExplanationStore = {
  mode: ExplanationMode    // "child" | "dev"
  setMode: (mode) => void
  toggle: () => void
}
// persist: localStorage key = "react-bible-explanation-mode"
```

---

## 4. 라우팅 구조

```
/ → HomeRedirect (client)
    ├── localStorage["last-stage"] 존재 → /stage/[lastSlug]
    └── 없으면 → /stage/immutability

/stage/[slug]
  generateStaticParams() → 20개 slug 정적 생성
  params: Promise<{ slug: string }> (Next.js 15+ async)
  notFound() → 없는 slug 처리
  StageLayout → useEffect: localStorage["last-stage"] = slug 저장
```

---

## 5. 설명 이중 구조 패턴

각 Stage의 `theory.tsx`에서 `useExplanationStore()`로 모드 읽어 분기:

```tsx
// features/stage-0X-name/theory.tsx
export function StageXXTheory() {
  const { mode } = useExplanationStore()
  return mode === "child" ? <ChildExplanation /> : <DevExplanation />
}

function ChildExplanation() {
  // 비유, 일상 언어, 시각적 설명
  // 예: "리액트는 봉투 주소가 바뀌어야 배달되는 시스템이에요"
}

function DevExplanation() {
  // 기술 용어, 내부 원리, 코드 패턴
  // 예: "Object.is() 비교로 참조 동일성 확인 후 reconciler 실행"
}
```

---

## 6. 각 Stage 콘텐츠 구조 (다음 세션부터)

```
src/features/stage-0X-[name]/
├── theory.tsx      # ExplanationMode 분기 설명
├── playground.tsx  # 인터렉티브 실험 UI
└── code-viewer.tsx # 핵심 코드 + 문법 강조
```

`src/app/stage/[slug]/page.tsx`에서 import 후 StageLayout에 주입:

```tsx
import { Stage01Theory } from "@/features/stage-01-immutability/theory"
import { Stage01Playground } from "@/features/stage-01-immutability/playground"
import { Stage01CodeViewer } from "@/features/stage-01-immutability/code-viewer"

<StageLayout
  stage={stage}
  theory={<Stage01Theory />}
  playground={<Stage01Playground />}
  code={<Stage01CodeViewer />}
/>
```

---

## 7. 스타일 가이드

**테마: 다크 개발자 도구 느낌 (VSCode 계열)**

| 요소 | 색상 |
|------|------|
| Background | `zinc-950` (#09090b) |
| Sidebar | `zinc-950` |
| Card / Panel | `zinc-900` |
| Border | `zinc-800` |
| Primary accent | `indigo-400` (#818cf8) |
| Text primary | `zinc-100` |
| Text muted | `zinc-400` / `zinc-500` |
| Easy badge | `green-300` on `green-950` |
| Medium badge | `yellow-300` on `yellow-950` |
| Hard badge | `red-300` on `red-950` |

---

## 8. 구현 완료 체크리스트 (이번 세션)

| 파일 | 상태 |
|------|------|
| `src/lib/utils.ts` | ✅ |
| `src/types/stage.ts` | ✅ |
| `src/lib/stages.ts` | ✅ |
| `src/stores/explanation-store.ts` | ✅ |
| `src/components/ui/badge.tsx` | ✅ |
| `src/components/layout/explanation-toggle.tsx` | ✅ (? 힌트 tooltip + pulse + 모바일 텍스트 숨김) |
| `src/components/layout/sidebar.tsx` | ✅ (그룹 서브타이틀 + onClose prop + 모바일 × 버튼) |
| `src/components/layout/stage-layout.tsx` | ✅ (concept 인라인, 이전/다음, 키보드 이동, 마지막 방문 저장) |
| `src/components/layout/main-layout.tsx` | ✅ (신규: 사이드바 토글 + 모바일 오버레이) |
| `src/components/layout/home-redirect.tsx` | ✅ (신규: 마지막 방문 복귀) |
| `src/components/providers/query-provider.tsx` | ✅ |
| `src/components/providers/store-hydration.tsx` | ✅ (신규: 3개 persist 스토어 rehydrate) |
| `src/app/globals.css` | ✅ |
| `src/app/layout.tsx` | ✅ (MainLayout 적용) |
| `src/app/page.tsx` | ✅ (HomeRedirect 적용) |
| `src/app/stage/[slug]/page.tsx` | ✅ |
| `src/lib/stages.ts` | ✅ (concept 원문 교체) |
| `docs/stages/PROGRESS.md` | ✅ |
| `pnpm build` 통과 | ✅ |

---

## 9. 모바일 반응형 설계 (3차 세션 추가)

### 9.1 브레이크포인트 전략

| 구간 | 사이드바 기본 | 사이드바 동작 |
|------|-------------|-------------|
| `< md` (768px 미만) | 닫힘 | fixed overlay + backdrop |
| `≥ md` (768px 이상) | 열림 | static (콘텐츠 밀기) |

### 9.2 MainLayout 모바일 동작

```
모바일 첫 방문:
  sidebarOpen = false → 사이드바 숨김, 콘텐츠 전체 너비

› 버튼 클릭:
  sidebarOpen = true
  → Sidebar: fixed inset-y-0 left-0 z-40 translate-x-0
  → Backdrop: fixed inset-0 z-30 bg-black/60

Backdrop 클릭 또는 × 버튼:
  sidebarOpen = false
  → Sidebar: translate-x-full (슬라이드 아웃)
  → Backdrop: 제거
```

### 9.3 Header 모바일 간소화

| 요소 | 데스크톱 | 모바일 |
|------|---------|-------|
| 로고 | `react-bible / v1.0.0` | `RB` |
| ExplanationToggle 텍스트 | `🟢 초딩모드`, `🔵 개발자모드` | 숨김 (토글 버튼만) |
| ? 힌트 버튼 | 표시 | 표시 |
| DarkModeToggle | 표시 | 표시 |

### 9.4 수정된 파일

| 파일 | 변경 내용 |
|------|-----------|
| `main-layout.tsx` | `useEffect`로 md 이상 기본 열림, backdrop overlay, sidebarOpen 초기값 false |
| `sidebar.tsx` | `onClose?: () => void` prop 추가, 헤더에 × 버튼 (md:hidden) |
| `explanation-toggle.tsx` | `🟢 초딩모드`, `🔵 개발자모드` 텍스트에 `hidden sm:inline` 추가 |
| `layout.tsx` | 로고 `hidden sm:inline` / `sm:hidden` 분기 |

## 10. 다음 세션 작업 가이드 (Stage별 반복 패턴)

```
세션 시작:
  1. docs/stages/PROGRESS.md 확인 → 다음 미완료 Stage 선택
  2. /pdca do stage-0X-[name] 실행

구현:
  3. src/features/stage-0X-[name]/ 폴더 생성
  4. theory.tsx 작성 (초딩 + 개발자 이중 설명 필수)
  5. playground.tsx 작성 (인터렉티브 시각화)
  6. code-viewer.tsx 작성 (핵심 코드 예제)
  7. src/app/stage/[slug]/page.tsx에 import 추가

검증:
  8. /pdca analyze stage-0X (Gap analysis)
  9. Match Rate ≥ 90% → PROGRESS.md [x] 체크
  10. stages.ts에서 status: "todo" → "done" 업데이트
```
