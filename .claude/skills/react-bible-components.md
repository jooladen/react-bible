---
name: react-bible-components
description: react-bible UI 컴포넌트 패턴 — Radix UI 기반 공통 컴포넌트, 레이아웃 컴포넌트, 스타일링 컨벤션. Use when adding or modifying UI components.
type: project
---

# react-bible Components Skill

## UI 컴포넌트 위치
- `src/components/ui/` — 재사용 가능한 원자 UI (shadcn 스타일)
- `src/components/layout/` — 앱 구조 레이아웃 컴포넌트

## 기존 UI 컴포넌트

### Card (`components/ui/card.tsx`)
```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

<Card className="border-border bg-card">
  <CardHeader className="pb-3">
    <CardTitle className="text-base text-foreground">제목</CardTitle>
  </CardHeader>
  <CardContent>내용</CardContent>
</Card>
```

### Badge (`components/ui/badge.tsx`)
```tsx
import { DifficultyBadge } from "@/components/ui/badge"
<DifficultyBadge difficulty={stage.difficulty} />
// easy → 초록, medium → 노랑, hard → 빨강
```

### Tabs (`components/ui/tabs.tsx`)
Radix UI Tabs 래퍼. `StageLayout`에서 이론/실험실/코드 탭에 사용.

### Progress (`components/ui/progress.tsx`)
Radix UI Progress 래퍼. Sidebar의 학습 진행률 표시에 사용.

## 레이아웃 컴포넌트

### StageLayout (`components/layout/stage-layout.tsx`)
- Props: `{ stage: Stage, theory?, playground?, code? }`
- 스테이지 헤더 (ID, 난이도, 제목, 개념) + 스텝퍼 탭 + 이전/다음 내비 + 완료 버튼
- 탭 prop이 없으면 🚧 미구현 UI 자동 표시
- 키보드 ← → 로 스테이지 이동

### MainLayout (`components/layout/main-layout.tsx`)
- Sidebar + 메인 콘텐츠 영역 2분할 레이아웃

### Sidebar (`components/layout/sidebar.tsx`)
- STAGE_GROUPS별로 스테이지 목록 렌더링
- 학습 진행률 Progress 바

### TheoryModeToggle (`components/layout/theory-mode-toggle.tsx`)
- 초딩/개발자 설명 모드 전환 버튼 (useExplanationStore 연결)

### DarkModeToggle (`components/layout/dark-mode-toggle.tsx`)
- 다크/라이트 모드 전환 (useThemeStore 연결)

## 스타일링 컨벤션

### 유틸 함수
```ts
import { cn } from "@/lib/utils"
// cn = clsx + tailwind-merge
<div className={cn("base-class", condition && "conditional-class")} />
```

### CSS 변수 (globals.css)
```css
--background, --foreground, --card, --border, --muted, --muted-foreground,
--accent, --accent-foreground, --primary, --primary-foreground
```

### 다크/라이트 모드
```tsx
// 다크 기본, 라이트는 light: prefix
className="bg-zinc-900 light:bg-white text-zinc-100 light:text-zinc-900"

// 강조색
// 다크: indigo-400/500, amber-400, green-400, red-400
// 라이트: teal-600/700, zinc-600/700
```

### 애니메이션 (Framer Motion)
```tsx
import { motion, AnimatePresence } from "framer-motion"

<AnimatePresence mode="wait">
  <motion.div
    key={activeTab}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.15 }}
  >
    {content}
  </motion.div>
</AnimatePresence>
```

## 새 컴포넌트 추가 규칙
- 재사용 가능한 원자 UI → `components/ui/`
- 앱 구조/레이아웃 → `components/layout/`
- 스테이지 전용 UI → 해당 `features/stage-XX-*/` 폴더에
- `"use client"` 필요한 경우에만 선언 (이벤트, 상태, 브라우저 API 사용 시)
- Props 타입은 `type XxxProps = { ... }` (interface 금지)
