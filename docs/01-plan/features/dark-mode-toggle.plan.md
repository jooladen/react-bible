# Plan: dark-mode-toggle

> Feature: Header 다크/라이트 모드 토글 버튼
> Created: 2026-04-02
> Phase: Done

---

## Executive Summary

| 관점 | 내용 |
|------|------|
| **Problem** | 앱이 다크모드로 고정되어 있어 밝은 환경에서 학습하는 사용자가 불편함. 모드 전환 수단이 없음 |
| **Solution** | Header의 ExplanationToggle 오른쪽에 🌙/☀️ 아이콘 버튼 추가. Zustand persist로 선택 영속화, CSS 변수 교체로 전체 테마 전환 |
| **Functional UX Effect** | 아이콘 클릭 → 다크/라이트 즉시 전환. 새로고침 후에도 마지막 선택 유지 |
| **Core Value** | 사용자 환경에 맞는 가독성 제공 — 학습 집중도 향상 |

---

## Context Anchor

| 항목 | 내용 |
|------|------|
| **WHY** | 다크 고정 → 밝은 환경 학습자 불편. UI 확장성(글로벌 테마)의 첫 사례 |
| **WHO** | 모든 React Bible 사용자, 특히 낮/밝은 환경 학습자 |
| **RISK** | SSR hydration mismatch (서버=dark, 클라=light 순간) → ThemeProvider 패턴으로 해결 |
| **SUCCESS** | 클릭 1번으로 테마 전환 + 새로고침 후 유지 + 빌드 에러 0건 |
| **SCOPE** | Header 버튼 + CSS 변수 전환만. 각 컴포넌트 개별 dark: 클래스 작업 없음 |

---

## 1. 요구사항

### 1.1 기능 요구사항

#### F-01: DarkModeToggle 버튼
- 위치: Header 오른쪽 끝, ExplanationToggle 오른쪽
- 아이콘: 다크 상태 → 🌙 (Moon), 라이트 상태 → ☀️ (Sun) — lucide-react 사용
- 클릭 시 테마 전환
- 툴팁: "라이트 모드로 전환" / "다크 모드로 전환"

#### F-02: theme-store.ts
- 파일: `src/stores/theme-store.ts`
- Zustand v5 + persist 미들웨어
- `theme: 'dark' | 'light'`, 기본값 `'dark'`
- `toggleTheme()` 액션

#### F-03: ThemeProvider (설계 변경 — 미구현)
- ~~`src/components/providers/theme-provider.tsx` 생성~~ → 불필요
- 실제 구현: `DarkModeToggle` 자체에 `mounted` 상태 + `useEffect`로 클래스 적용
- SSR hydration mismatch는 `skipHydration: true` + `StoreHydration` 컴포넌트로 전역 처리

#### F-04: globals.css 라이트모드 변수
- `.light` 클래스 셀렉터로 라이트 CSS 변수 세트 추가
- 핵심 변수만 오버라이드: `--background`, `--foreground`, `--card`, `--border`, `--muted`, `--muted-foreground`
- Tailwind v4 `@theme inline` 변수도 동기화 (CSS 변수 참조 구조 유지)

### 1.2 비기능 요구사항

- lucide-react 이미 설치됨 (`^1.7.0`) → 추가 패키지 없음
- TypeScript strict — `as any` 금지
- FOUC(Flash of Unstyled Content) 최소화 — ThemeProvider가 최상위에서 즉시 클래스 적용

---

## 2. Out of Scope

- 각 컴포넌트 `dark:` Tailwind 클래스 개별 추가 (CSS 변수 교체만으로 해결)
- 시스템 다크모드 자동 감지 (`prefers-color-scheme`)
- 라이트모드 전용 이미지/아이콘 변경

---

## 3. Risk

| 리스크 | 가능성 | 대응 |
|--------|--------|------|
| SSR hydration mismatch (서버=dark / 클라=light 불일치) | 중 | ThemeProvider에서 `useEffect`로 클래스 적용 (hydration 후 실행) |
| `document.documentElement` 접근 SSR 오류 | 중 | `typeof window !== 'undefined'` 가드 또는 `useEffect` 내 실행 |
| 기존 하드코딩 `bg-zinc-950` 등이 CSS 변수 무시 | 저 | 현재 앱은 CSS 변수 기반 구조 → 문제 없음. 직접 색상 클래스는 추후 정리 |
| lucide-react v1.x API 차이 | 저 | `import { Moon, Sun } from "lucide-react"` 표준 API 동일 |

---

## 4. 파일 영향 범위

### 신규 생성
- `src/stores/theme-store.ts`
- `src/components/layout/dark-mode-toggle.tsx`
- ~~`src/components/providers/theme-provider.tsx`~~ → 미생성 (DarkModeToggle 자체 처리)

### 수정
- `src/app/globals.css` — `.light` 클래스 라이트 변수 추가
- `src/app/layout.tsx` — DarkModeToggle 추가 (ThemeProvider 없이)

---

## 5. 구현 순서

1. `theme-store.ts` 생성
2. `globals.css` 라이트 변수 추가
3. `dark-mode-toggle.tsx` 생성 (ThemeProvider 미생성 — F-03 취소)
4. `layout.tsx` 수정 (DarkModeToggle 배치)
5. 빌드 검증

---

## 6. 성공 기준 체크리스트

- [x] Header 오른쪽 끝(ExplanationToggle 우측)에 🌙/☀️ 버튼 표시
- [x] 클릭 시 전체 배경/텍스트/카드 색상 즉시 전환
- [x] 새로고침 후에도 마지막 선택 유지 (localStorage persist)
- [x] 다크 기본값 — 첫 방문 시 다크모드
- [x] TypeScript 에러 0건, 빌드 통과
