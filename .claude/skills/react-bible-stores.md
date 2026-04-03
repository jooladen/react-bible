---
name: react-bible-stores
description: react-bible Zustand 스토어 패턴 — 스토어 생성, persist 설정, hydration 처리. Use when working with state management.
type: project
---

# react-bible Stores Skill

## 기존 스토어

### progressStore (`stores/progress-store.ts`)
학습 완료 스테이지 slug 목록을 localStorage에 저장.

```ts
type ProgressStore = {
  completedSlugs: string[]
  markDone: (slug: string) => void     // 중복 방지
  isCompleted: (slug: string) => boolean
}
// persist key: "react-bible-progress"
// skipHydration: true (StoreHydration 컴포넌트에서 수동 hydrate)
```

### explanationStore (`stores/explanation-store.ts`)
초딩/개발자 설명 모드 전환.

```ts
type ExplanationStore = {
  mode: "child" | "dev"
  toggle: () => void
}
```

### themeStore (`stores/theme-store.ts`)
다크/라이트 모드 전환.

```ts
type ThemeStore = {
  theme: "dark" | "light"
  toggle: () => void
}
// toggle 시 document.documentElement.classList 조작
```

## 스토어 생성 패턴

### persist 사용 시 (localStorage 저장 필요)
```ts
"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

type XxxStore = {
  // 상태
  // 액션
}

export const useXxxStore = create<XxxStore>()(
  persist(
    (set, get) => ({
      // 초기값
      // 액션 구현
    }),
    {
      name: "react-bible-xxx",   // localStorage key
      skipHydration: true,       // SSR hydration mismatch 방지 (필수)
    }
  )
)
```

### persist 없는 경우 (세션 상태)
```ts
"use client"

import { create } from "zustand"

type XxxStore = { ... }

export const useXxxStore = create<XxxStore>()((set, get) => ({
  // ...
}))
```

## skipHydration 처리
persist를 사용하는 모든 스토어는 `skipHydration: true` 설정 필수.
`StoreHydration` 컴포넌트(`components/providers/store-hydration.tsx`)가 클라이언트 마운트 후 수동 hydrate.

```tsx
// store-hydration.tsx 패턴
"use client"
import { useEffect } from "react"
import { useProgressStore } from "@/stores/progress-store"

export function StoreHydration() {
  useEffect(() => {
    useProgressStore.persist.rehydrate()
    // 다른 persist 스토어도 여기서 rehydrate
  }, [])
  return null
}
```

## 스토어 규칙
- 파일명: `{name}-store.ts`
- export 함수명: `use{Name}Store`
- 타입명: `{Name}Store`
- Set 대신 배열(`string[]`) 사용 — JSON 직렬화 호환 (Design Ref §3.1)
- `"use client"` 상단 선언 필수
- 중복 체크는 액션 내부에서 처리 (사용처에서 중복 체크 금지)
