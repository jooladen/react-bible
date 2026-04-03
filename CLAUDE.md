@AGENTS.md

# react-bible 프로젝트 가이드

## 패키지 관리
- **항상 `pnpm` 사용** (npm, yarn 금지)

## 개발 명령어
```bash
pnpm dev                      # 개발 서버 (localhost:3000)
pnpm build                    # 프로덕션 빌드
pnpm exec tsc --noEmit        # 타입체크 (typecheck 스크립트 없음, 이 명령어 사용)
pnpm lint                     # ESLint
```

## 프로젝트 구조
```
src/
  app/             # Next.js App Router (페이지)
  components/
    ui/            # Radix UI 기반 공통 컴포넌트 (card, badge, tabs 등)
    layout/        # 레이아웃 컴포넌트 (sidebar, main-layout, stage-layout 등)
    providers/     # React Provider 컴포넌트
  features/
    stage-XX-{slug}/  # 각 스테이지 — theory.tsx / playground.tsx / code-viewer.tsx
  lib/
    stages.ts      # STAGES 배열 (20개 스테이지 데이터), STAGE_GROUPS
    stage-utils.ts # 스테이지 유틸 함수
    utils.ts       # cn() 유틸
  stores/
    progress-store.ts    # 학습 완료 slug 목록 (localStorage persist)
    explanation-store.ts # 이중 설명 모드 ("child" | "dev")
    theme-store.ts       # 다크/라이트 모드
  types/
    stage.ts       # Stage, StageGroup, Difficulty, StageStatus 등 핵심 타입
```

## 핵심 패턴

### 스테이지 구조 (`features/stage-XX-{slug}/`)
- `theory.tsx` — 이론 컴포넌트 (`Stage{N}Theory`)
  - `useExplanationStore()`로 mode("child" | "dev") 읽어 이중 설명 렌더링
  - CONCEPTS 배열 패턴: `{ title, icon, child: ReactNode, dev: ReactNode }`
- `playground.tsx` — 인터랙티브 실습 컴포넌트
- `code-viewer.tsx` — 코드 뷰어 컴포넌트

### 스테이지 페이지 (`app/stage/[slug]/page.tsx`)
- `getStageBySlug(slug)`로 Stage 조회 → `notFound()` 처리
- `StageLayout`에 theory/playground/code 컴포넌트를 prop으로 전달

### Zustand 스토어 패턴
```ts
"use client"
import { create } from "zustand"
import { persist } from "zustand/middleware"
type XxxStore = { ... }
export const useXxxStore = create<XxxStore>()(persist((set, get) => ({ ... }), { name: "react-bible-xxx", skipHydration: true }))
```

### 스타일링
- Tailwind CSS v4 사용 (`@/*` 경로 alias)
- **전역 지침의 `dark:` 클래스와 다름 — 이 프로젝트는 반대 방향**:
  - 기본이 다크 모드 (CSS 변수 기본값이 다크)
  - 라이트 모드는 `light:` custom variant로 지정 (`light:bg-white`, `light:text-zinc-900`)
  - `dark:` 클래스 사용 금지 — 효과 없음
- `cn()` (clsx + tailwind-merge) 조건부 클래스 조합
- 컴포넌트 강조색: 다크=indigo-400/500, 라이트=teal-600/700

## 타입 컨벤션
- `type` 사용 (interface 금지)
- `as const` 열거형 표현
- `enum` 금지 → 리터럴 유니온 (`"easy" | "medium" | "hard"`)

## 인라인 설계 주석
중요한 설계 결정은 `// Design Ref: §X.X — ...` 또는 `// Plan SC: ...` 형식으로 남길 것

## 금지 사항
- `console.log` 커밋 금지
- `any` 타입 사용 금지
- `interface` 사용 금지
- `enum` 사용 금지
- 직접 DOM 조작 금지 (React state/ref 사용)
