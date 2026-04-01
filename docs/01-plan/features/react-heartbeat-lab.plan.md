# Plan: React Heartbeat Lab

## Executive Summary

| 항목 | 내용 |
|------|------|
| Feature | react-heartbeat-lab (프로젝트 초기 뼈대) |
| 시작일 | 2026-04-01 |
| 현황 | 레이아웃 뼈대 완성 + UX 개선 세션 완료, Stage 콘텐츠 미구현 |

### Value Delivered (4-Perspective)

| 관점 | 내용 |
|------|------|
| **Problem** | 리액트 핵심 원리 20단계를 체계적으로 학습하고 포트폴리오로 활용할 플랫폼이 없음 |
| **Solution** | 초딩🟢/개발자🔵 이중 설명 + 인터렉티브 실험실 + 코드 뷰어 3-패널 학습 앱 |
| **Function UX Effect** | 토글 하나로 설명 깊이 전환, 사이드바로 20단계 진행 추적 |
| **Core Value** | 전자책 예제 + Dev-Nexus 포트폴리오 메인 콘텐츠 |

---

## Context Anchor

| 항목 | 내용 |
|------|------|
| **WHY** | 29년 SI 경력 개발자가 AI-native 시대를 위해 모던 리액트를 정리한 "바이블" 제작 |
| **WHO** | 주영준(준) — 1인 기업 목표, Dev-Nexus 포트폴리오 구축 중 |
| **RISK** | 20단계 전체 구현 시 컨텍스트 분산 → 1단계씩 PDCA 반복으로 완화 |
| **SUCCESS** | pnpm build 통과 + 20개 Stage 각각 Gap ≥ 90% |
| **SCOPE** | 이번 세션: 프로젝트 뼈대. 다음 세션부터: Stage 01~20 순차 구현 |

---

## 1. 프로젝트 개요

**React Heartbeat Lab** (`react-bible`)

리액트의 핵심 원리 20단계를 심층 학습·실습할 수 있는 대화형 웹 앱.
Next.js App Router 기반, 전자책 예제 + 포트폴리오(Dev-Nexus) 겸용.

---

## 2. 20단계 로드맵

### Phase 1: 입력과 기초

| # | 주제 | 난이도 | 상태 |
|---|------|--------|------|
| 01 | 불변성 & Immer | 🟢 쉬움 | todo |
| 02 | Rendering & Reconciliation | 🟡 보통 | todo |
| 03 | Component Lifecycle | 🟢 쉬움 | todo |
| 04 | Hooks 기초 (useState/useEffect) | 🟢 쉬움 | todo |
| 05 | Event Bubbling & Capture | 🟡 보통 | todo |

### Phase 2: 가공과 최적화

| # | 주제 | 난이도 | 상태 |
|---|------|--------|------|
| 06 | Hooks & Closure | 🔴 어려움 | todo |
| 07 | Memoization (useMemo/useCallback) | 🟡 보통 | todo |
| 08 | Design Systems (Headless UI) | 🟡 보통 | todo |
| 09 | CSS-in-JS vs Tailwind | 🟢 쉬움 | todo |
| 10 | Performance Profiling | 🔴 어려움 | todo |

### Phase 3: 확장과 연결

| # | 주제 | 난이도 | 상태 |
|---|------|--------|------|
| 11 | Context & Prop Drilling | 🟡 보통 | todo |
| 12 | State Management (Zustand) | 🟡 보통 | todo |
| 13 | Async State Handling (Race Condition) | 🔴 어려움 | todo |
| 14 | Server State & Caching (TanStack Query) | 🟡 보통 | todo |
| 15 | Fine-grained Reactivity (Signals) | 🔴 어려움 | todo |

### Phase 4: 운영과 인프라

| # | 주제 | 난이도 | 상태 |
|---|------|--------|------|
| 16 | Testing Strategy (Jest/Playwright) | 🟡 보통 | todo |
| 17 | Hydration & SSR | 🔴 어려움 | todo |
| 18 | Bundle Optimization | 🔴 어려움 | todo |
| 19 | Web Workers | 🔴 어려움 | todo |
| 20 | Micro Frontends (MFE) | 🔴 어려움 | todo |

---

## 3. 이번 세션 범위 (프로젝트 뼈대)

### ✅ 완료 항목

- [x] Next.js 16.2.2 + TypeScript + Tailwind v4 프로젝트 초기화
- [x] 추가 패키지 설치 (Framer Motion, Zustand, TanStack Query, Lucide React)
- [x] 글로벌 설명 모드 토글 (🟢 초딩모드 ↔ 🔵 개발자모드, Zustand persist)
- [x] 메인 레이아웃 (Sidebar + TopBar + 동적 Stage 라우트)
- [x] 20개 Stage placeholder 페이지
- [x] pnpm build 통과 (24페이지 정적 생성)
- [x] docs/stages/PROGRESS.md 세션 간 추적 체크리스트

**[2차 세션] UX 개선**
- [x] Stage 제목 옆 concept 설명 인라인 표시 (`: 설명` 형식, plan.md 원문 적용)
- [x] 사이드바 그룹 헤더에 서브타이틀 추가 (`그룹명 - 서브타이틀`)
- [x] 핵심 개념 박스 제거 (제목 옆 인라인으로 통합)
- [x] 사이드바 토글 (MainLayout 클라이언트 컴포넌트, fixed 위치 ‹/› 버튼)
- [x] 모드 힌트 아이콘 (? 버튼 + hover tooltip + 첫 방문 pulse 효과)
- [x] 이전/다음 stage 내비게이션 버튼 (하단 고정)
- [x] 키보드 화살표(←/→) stage 이동
- [x] 마지막 방문 stage 기억 (localStorage, 재방문 시 복귀)

### ⏳ 다음 세션부터 (1 Stage씩)

- [ ] Stage 01~20 각각: theory.tsx + playground.tsx + code-viewer.tsx

---

## 4. 기술 스택

| 항목 | 선택 | 버전 |
|------|------|------|
| 프레임워크 | Next.js (App Router) | 16.2.2 |
| 언어 | TypeScript | 5.9.3 |
| 스타일 | Tailwind CSS | v4.2.2 |
| UI 컴포넌트 | shadcn/ui (수동 설치) | — |
| 애니메이션 | Framer Motion | 12.38.0 |
| 상태관리 | Zustand | 5.0.12 |
| 서버 상태 | TanStack Query | 5.96.1 |
| 아이콘 | Lucide React | 1.7.0 |
| 패키지 매니저 | pnpm | 10.32.1 |

---

## 5. 핵심 파일 목록

| 파일 | 역할 |
|------|------|
| `src/lib/stages.ts` | 20개 Stage 메타데이터 단일 진실 공급원 |
| `src/types/stage.ts` | Stage, Difficulty, ExplanationMode 타입 |
| `src/stores/explanation-store.ts` | 설명 모드 전역 상태 (localStorage 유지) |
| `src/components/layout/sidebar.tsx` | Phase별 20단계 사이드바 (그룹 서브타이틀 포함) |
| `src/components/layout/explanation-toggle.tsx` | 🟢/🔵 토글 스위치 + ? 힌트 tooltip |
| `src/components/layout/stage-layout.tsx` | 탭 레이아웃 + 이전/다음 버튼 + 키보드 이동 |
| `src/components/layout/main-layout.tsx` | 사이드바 토글 클라이언트 컴포넌트 |
| `src/components/layout/home-redirect.tsx` | 마지막 방문 stage 복귀 리다이렉트 |
| `src/app/stage/[slug]/page.tsx` | 동적 Stage 라우트 (Next.js 15+) |
| `docs/stages/PROGRESS.md` | 세션 간 진행 체크리스트 |

---

## 6. 성공 기준 (Success Criteria)

| 기준 | 상태 |
|------|------|
| `pnpm build` 에러 0건 | ✅ 완료 |
| 20개 Stage 라우트 (`/stage/[slug]`) 정상 동작 | ✅ 완료 |
| 설명 모드 토글 → localStorage 유지 | ✅ 완료 |
| TypeScript strict 에러 0건 | ✅ 완료 |
| Stage 01~20 각각 콘텐츠 구현 + Gap ≥ 90% | ⏳ 진행 중 |
| `docs/stages/PROGRESS.md` 체크리스트 완비 | ✅ 완료 |
