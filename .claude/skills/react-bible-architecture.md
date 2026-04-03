---
name: react-bible-architecture
description: react-bible 전체 아키텍처, 폴더 구조, 의존성 방향. Use when working with project structure, routing, or cross-cutting concerns.
type: project
---

# react-bible Architecture

## 프로젝트 개요
React 학습 웹앱. 20개 스테이지(단원)를 통해 React 핵심 개념을 이중 설명(초딩/개발자)으로 학습.

## 기술 스택
- **Next.js 16.2.2** + **React 19** + **TypeScript 5** (strict)
- **Tailwind CSS v4** — 라이트모드는 `light:` custom variant
- **Zustand v5** — 클라이언트 상태 (persist middleware)
- **TanStack Query v5** — 서버 상태 (현재 미사용, 추후 활용)
- **Framer Motion v12** — 탭 전환 애니메이션
- **Radix UI** — headless UI 컴포넌트 (tabs, progress, switch, scroll-area, slot)
- **Immer** — 불변 상태 업데이트 헬퍼
- **pnpm** — 패키지 매니저

## 폴더 구조 및 책임

```
src/
  app/                        # Next.js App Router
    layout.tsx                # RootLayout — StoreHydration, QueryProvider, theme class
    page.tsx                  # HomeRedirect — 마지막 방문 stage로 리다이렉트
    stage/[slug]/page.tsx     # 스테이지 페이지 — getStageBySlug + StageLayout
    globals.css               # Tailwind 전역 + CSS 변수 (--background, --foreground 등)

  components/
    ui/                       # Radix UI 기반 공통 컴포넌트 (재사용 가능한 원자 UI)
      card.tsx                # Card, CardHeader, CardTitle, CardContent
      badge.tsx               # DifficultyBadge (easy/medium/hard 색상)
      tabs.tsx                # Radix Tabs 래퍼
      progress.tsx            # Radix Progress 래퍼
    layout/                   # 페이지 레이아웃 컴포넌트 (앱 구조)
      main-layout.tsx         # 사이드바 + 메인 영역 레이아웃
      sidebar.tsx             # 스테이지 목록, 그룹별 네비게이션, 진행률
      stage-layout.tsx        # 스테이지 헤더 + 탭(이론/실험실/코드) + 이전/다음 내비
      dark-mode-toggle.tsx    # 다크/라이트 토글 버튼
      theory-mode-toggle.tsx  # 초딩/개발자 모드 토글
      home-redirect.tsx       # 클라이언트 리다이렉트 컴포넌트
    providers/
      query-provider.tsx      # TanStack Query QueryClientProvider
      store-hydration.tsx     # Zustand persist skipHydration 처리

  features/                   # 스테이지별 컨텐츠 (도메인 단위 분리)
    stage-01-immutability/
      theory.tsx              # Stage01Theory 컴포넌트
      playground.tsx          # Stage01Playground
      code-viewer.tsx         # Stage01CodeViewer
    stage-{NN}-{slug}/        # 각 스테이지 동일 구조

  lib/
    stages.ts                 # STAGES[] (20개), STAGE_GROUPS[], getStageBySlug(), getStagesByGroup()
    stage-utils.ts            # 스테이지 관련 유틸 함수
    utils.ts                  # cn() = clsx + tailwind-merge

  stores/
    progress-store.ts         # useProgressStore — completedSlugs[], markDone(), isCompleted()
    explanation-store.ts      # useExplanationStore — mode("child"|"dev"), toggle()
    theme-store.ts            # useThemeStore — theme("dark"|"light"), toggle()

  types/
    stage.ts                  # Stage, StageGroup, StageGroupMeta, Difficulty, StageStatus, ExplanationMode
```

## 의존성 방향 (역방향 금지)
```
app/ → components/ → stores/ → types/
features/ → components/ → lib/ → types/
```

## 라우팅
- `/` → HomeRedirect → `/stage/{lastSlug}` (localStorage)
- `/stage/[slug]` → getStageBySlug(slug) → StageLayout

## 다크모드 구현
- 기본 다크모드 (`html` class에 `dark`)
- 라이트모드: `light:` custom variant (globals.css에서 `.light` selector로 정의)
- themeStore가 `document.documentElement.classList`를 토글

## 인라인 설계 주석 컨벤션
- `// Design Ref: §X.X — ...` — 설계 문서 참조
- `// Plan SC: ...` — 계획 단계 결정 사항
