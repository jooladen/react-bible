# Design: dark-mode-toggle

> Feature: Header 다크/라이트 모드 토글 버튼
> Architecture: Option C — Pragmatic (Store, ThemeProvider 없이)
> Created: 2026-04-02
> Phase: Design

---

## Context Anchor

| 항목 | 내용 |
|------|------|
| **WHY** | 앱이 다크 고정 → 밝은 환경 학습자 불편. 전환 수단 없음 |
| **WHO** | 모든 React Bible 사용자 |
| **RISK** | SSR hydration mismatch → useEffect 내 클래스 적용으로 해결 |
| **SUCCESS** | ExplanationToggle 우측 🌙/☀️ 버튼, 클릭 시 즉시 전환, 새로고침 후 유지 |
| **SCOPE** | Header 버튼 + CSS 변수 교체. 개별 컴포넌트 dark: 클래스 없음 |

---

## 1. Overview

**아키텍처: Option C — Pragmatic Balance**

```
theme-store.ts  ←  persist (localStorage)
      ↓
DarkModeToggle  →  useEffect → document.documentElement.className
      ↓
   layout.tsx  (header 우측에 마운트)
      ↓
globals.css  (.light 클래스 CSS 변수 오버라이드)
```

- `theme-store.ts`는 `explanation-store.ts`와 동일한 Zustand v5 + persist 패턴
- `DarkModeToggle`이 항상 루트 레이아웃에 마운트 → ThemeProvider 별도 불필요
- 클래스 교체 방식: `document.documentElement.className` = `''` (dark) or `'light'`
- CSS는 `:root` = 다크 기본, `.light :root` or `.light` 셀렉터로 오버라이드

---

## 2. 파일 구조

```
src/
├── stores/
│   └── theme-store.ts              [신규] Zustand + persist
├── components/
│   └── layout/
│       └── dark-mode-toggle.tsx    [신규] Moon/Sun 아이콘 버튼
└── app/
    ├── globals.css                 [수정] .light 클래스 변수 추가
    └── layout.tsx                  [수정] header에 DarkModeToggle 추가
```

---

## 3. 데이터 모델

### 3.1 ThemeStore

```typescript
// src/stores/theme-store.ts
type ThemeStore = {
  theme: 'dark' | 'light'
  toggleTheme: () => void
}

// localStorage key: 'react-bible-theme'
// 기본값: 'dark'
```

### 3.2 구현

```typescript
export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      toggleTheme: () =>
        set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
    }),
    { name: 'react-bible-theme', skipHydration: true }
  )
)
```

---

## 4. 컴포넌트 설계

### 4.1 DarkModeToggle

```
┌────────────────────────────────────────────────────┐
│ Header 오른쪽 영역                                   │
│                                                    │
│  [🟢 초딩모드] [toggle] [🔵 개발자모드] [?]  [🌙]   │
│                                              ↑     │
│                                    DarkModeToggle  │
└────────────────────────────────────────────────────┘
```

**핵심 로직**:

```typescript
"use client"
// Design Ref: §4.1 — mounted 패턴으로 hydration mismatch 방지
// 서버/초기 클라이언트 렌더: 항상 Moon (dark default)
// hydration 완료 후: localStorage 값 반영

export function DarkModeToggle() {
  const { theme, toggleTheme } = useThemeStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme, mounted])

  const isLight = mounted && theme === 'light'

  return (
    <button onClick={toggleTheme} title={...} aria-label={...}>
      {isLight ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
```

**스타일**: 기존 Header 버튼과 동일한 패턴
```
rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200
```

### 4.2 layout.tsx 변경

```tsx
// 기존
<ExplanationToggle />

// 변경 후
<div className="flex items-center gap-3">
  <ExplanationToggle />
  <DarkModeToggle />
</div>
```

---

## 5. CSS 변수 설계

### 5.1 현재 구조 (다크 기본)

```css
:root {
  --background: #09090b;   /* zinc-950 */
  --foreground: #fafafa;
  --card: #18181b;         /* zinc-900 */
  ...
}
```

### 5.2 추가: .light 클래스 오버라이드

```css
.light {
  --background: #ffffff;
  --foreground: #09090b;
  --card: #f4f4f5;           /* zinc-100 */
  --card-foreground: #09090b;
  --border: #e4e4e7;         /* zinc-200 */
  --input: #e4e4e7;
  --primary: #6366f1;        /* indigo-500 (라이트에서도 유지) */
  --primary-foreground: #ffffff;
  --muted: #f4f4f5;
  --muted-foreground: #71717a;
  --accent: #f4f4f5;
  --accent-foreground: #09090b;
  --secondary: #f4f4f5;
  --secondary-foreground: #09090b;
  --destructive: #ef4444;
  --ring: #6366f1;
}
```

**Tailwind v4 `@theme inline` 주의**:
- `@theme inline` 블록의 변수들은 이미 `var(--background)` 등을 참조
- `.light` 클래스로 `:root` CSS 변수만 바꾸면 Tailwind 유틸리티 클래스 자동 반영
- `@theme inline` 블록 수정 불필요

---

## 6. Hydration 처리 전략

**문제**: 서버는 항상 `dark` HTML 렌더, 클라이언트에서 `light`로 저장된 경우 순간 깜빡임(FOUC) + hydration mismatch

**실제 구현된 해결책 (2중 방어)**:

1. **`skipHydration: true`** — `theme-store.ts`의 persist 설정. SSR에서 localStorage 읽기 건너뜀
2. **`mounted` 상태** — `DarkModeToggle`에서 `useState(false)` → `useEffect`에서 `true` 설정. 클라이언트 마운트 전까지 항상 Moon(dark) 표시
3. **`StoreHydration` 컴포넌트** — `layout.tsx`에서 마운트 후 3개 스토어 `rehydrate()` 일괄 호출

```tsx
// mounted 패턴: hydration 전/후 아이콘 일치
const isLight = mounted && theme === 'light'   // mounted 전: false → Moon
// skipHydration 패턴: SSR에서 localStorage 미접근 → 항상 'dark' 기본값
```

---

## 7. 주요 기술 결정

| 결정 | 선택 | 이유 |
|------|------|------|
| 테마 클래스 적용 위치 | DarkModeToggle useEffect | ThemeProvider 불필요. 항상 마운트됨 |
| CSS 전략 | .light 클래스 오버라이드 | 기존 @theme inline 구조 유지, 변경 최소 |
| 아이콘 | lucide-react Moon/Sun | 이미 설치됨. 추가 패키지 없음 |
| 기본값 | dark | localStorage 없을 때 = 첫 방문 = 다크 |
| FOUC | 허용 (useEffect) | 학습 앱 특성상 허용. next-themes 미도입 |

---

## 8. 성공 기준 — 검증 방법

| 기준 | 검증 |
|------|------|
| 버튼 위치 | Header 오른쪽 끝에 🌙 아이콘 표시 확인 |
| 다크→라이트 전환 | 클릭 후 배경 흰색, 텍스트 검정으로 변경 확인 |
| 아이콘 전환 | 라이트 상태에서 ☀️ 표시 확인 |
| localStorage 영속화 | 새로고침 후 마지막 선택 유지 확인 |
| 빌드 | `pnpm build` 에러 0건 |

---

## 9. Implementation Guide

### 9.1 구현 순서

```
Module 1: Store + CSS
  1-1. src/stores/theme-store.ts 생성
  1-2. src/app/globals.css에 .light 변수 추가

Module 2: 컴포넌트 + 연결
  2-1. src/components/layout/dark-mode-toggle.tsx 생성
  2-2. src/app/layout.tsx 수정 (DarkModeToggle 추가)
  2-3. pnpm build 검증
```

### 9.2 의존성 그래프

```
theme-store.ts
    ↓
dark-mode-toggle.tsx → layout.tsx (header)
    ↓ (useEffect)
document.documentElement.classList
    ↓
globals.css (.light 변수 적용)
```

### 9.3 Session Guide

| 세션 | 포함 모듈 | 예상 작업량 |
|------|----------|------------|
| Single session | Module 1 + 2 | ~80줄 |
