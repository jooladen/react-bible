# Plan: stage-01-immutability

> Feature: Stage 01 — 불변성 & Immer 콘텐츠 + 진행률 시스템
> Created: 2026-04-01
> Phase: Plan

---

## Executive Summary

| 관점 | 내용 |
|------|------|
| **Problem** | `/stage/immutability` 페이지가 🚧 상태 — theory/playground/code 3개 파일이 없어 학습 불가. 또한 진행률이 정적 데이터(stages.ts)에 의존해 localStorage 저장이 안 됨 |
| **Solution** | stage-01-immutability 3파일 구현 + Zustand progress-store로 완료 상태 영속화 + 사이드바 Progress 바 + StageLayout 스텝퍼 UI 개선 |
| **Functional UX Effect** | "학습 완료" 버튼 클릭 → Zustand 저장 → 사이드바 Progress 바 실시간 갱신. 페이지 재방문해도 진도 유지. Bad/Good Case 직접 체험 가능 |
| **Core Value** | React 불변성 개념을 이론→실험→코드 흐름으로 체험하고, 학습 진도가 지속적으로 쌓이는 학습 플랫폼의 첫 번째 완성 Stage |

---

## Context Anchor

| 항목 | 내용 |
|------|------|
| **WHY** | React Bible의 첫 Stage이자 다른 19개 Stage의 패턴 기준점. 여기서 정한 구조(파일 구성, 진행률 시스템, UI 컨벤션)가 전체 20개 Stage에 적용됨 |
| **WHO** | React를 배우는 개발자 (초딩/개발자 이중 설명) — 초보자부터 복습 목적의 숙련자까지 |
| **RISK** | progress-store가 stages.ts 정적 데이터와 이중화 → 나중에 불일치 발생 가능. immer 미설치 시 playground 동작 불가 |
| **SUCCESS** | 불변성 위반 Bad Case 직접 체험 가능 + 학습 완료 후 사이드바 진행률 갱신 + 페이지 새로고침 후에도 진도 유지 |
| **SCOPE** | Stage 01만. stages.ts의 다른 Stage 상태는 건드리지 않음 |

---

## 1. 요구사항

### 1.1 기능 요구사항

#### F-01: shadcn/ui 컴포넌트 설치
- `card.tsx`, `tabs.tsx`, `progress.tsx`를 `npx shadcn add`로 설치
- 설치 실패 시 Tailwind로 직접 구현 (fallback)

#### F-02: Zustand progress-store
- 파일: `src/stores/progress-store.ts`
- 완료된 stage slug 목록을 배열로 관리 (`completedSlugs: string[]`) — JSON 직렬화 호환 (Set 미사용)
- Zustand `persist` 미들웨어로 localStorage에 저장 (`key: 'react-bible-progress'`)
- Actions: `markDone(slug)`, `isCompleted(slug): boolean`
- `completedCount`는 스토어 액션 아님 — `sidebar.tsx`에서 `STAGES.filter()`로 계산

#### F-03: 사이드바 전체 진행률 Progress 바
- 파일: `src/components/layout/sidebar.tsx` 수정
- Header 아래에 Progress 바 추가: `{completedCount} / 20 완료`
- progress-store에서 `completedCount` 읽기 (stages.ts 정적 status 대신)
- Footer의 텍스트도 progress-store 기반으로 변경

#### F-04: StageLayout 스텝퍼 + 학습 완료 버튼
- 파일: `src/components/layout/stage-layout.tsx` 수정
- 기존 탭바를 **스텝퍼 스타일**로 교체: `[① 이론] → [② 실험실] → [③ 코드]` (현재 위치 강조)
- Stage 하단 네비게이션 영역에 "✅ 학습 완료" 버튼 추가
  - 클릭 시 `progress-store.markDone(stage.slug)` 호출
  - 이미 완료된 경우 "✅ 완료됨" (비활성화) 표시

#### F-05: Stage 01 theory.tsx
- 파일: `src/features/stage-01-immutability/theory.tsx`
- `useExplanationStore()`로 mode 읽어 이중 설명
- **🟢 초딩용**: 택배 박스 비유 — "주소가 다른 새 박스를 만들어야 React가 알아채요"
- **🔵 개발자용**: 참조 동일성(referential equality) — `Object.is()` 기반 React 감지 원리, 불변성과 메모이제이션의 관계
- shadcn Card 레이아웃 사용
- 핵심 개념 3가지를 Card로 구분: ① 불변성이란, ② 왜 React에서 중요한가, ③ Immer란

#### F-06: Stage 01 playground.tsx
- 파일: `src/features/stage-01-immutability/playground.tsx`
- **Bad Case 섹션**: `push()`로 배열을 직접 변경 → 화면이 안 바뀌는 현상 직접 체험
  - "추가" 버튼 클릭 → 실제로 배열은 바뀌지만 React가 감지 못해 화면 그대로
  - "왜 안 바뀌었을까?" 설명 토글
- **Good Case 섹션**: `[...prev, newItem]` 또는 Immer `produce` 사용 → 화면 즉시 갱신
- **메모리 주소 시각화**: 상태 변경 시마다 mock hex 주소(`0xA3F2...`) 생성하여 표시
  - Bad Case: 주소 동일 (`0xA3F2 → 0xA3F2` = 변화 없음, 빨간 표시)
  - Good Case: 주소 변경 (`0xA3F2 → 0xB71C` = 새 객체, 초록 표시)
- **Immer 실험**: `produce` 로 중첩 객체를 "그냥 수정"해도 불변성 유지되는 체험

#### F-07: Stage 01 code-viewer.tsx
- 파일: `src/features/stage-01-immutability/code-viewer.tsx`
- 핵심 코드 스니펫 3개를 shadcn Tabs로 전환:
  1. Bad Case: 직접 변이
  2. Good Case: 스프레드 연산자
  3. Immer produce 패턴
- 코드 블록: `<pre>` + `bg-zinc-900` 스타일 (Prism 없이 정적 표시)
- 각 탭에 언제 쓰면 좋은지 1~2줄 설명

#### F-08: StagePage 콘텐츠 주입
- 파일: `src/app/stage/[slug]/page.tsx` 수정
- slug가 `"immutability"`일 때 3개 컴포넌트 동적 import 후 주입
- 다른 slug는 기존 동작 유지 (🚧 플레이스홀더)

### 1.2 비기능 요구사항

- TypeScript strict — `as any` 금지
- Server Component 기본, `"use client"` 필요한 곳만 명시
- progress-store hydration mismatch 방지 (SSR/CSR 불일치 처리)
- immer 패키지 설치 확인 후 없으면 설치

---

## 2. Out of Scope

- Stage 02~20 콘텐츠 구현
- Syntax highlight 라이브러리 설치 (Prism.js 등) — 이번엔 정적 코드 블록
- 백엔드 진행률 저장 (localStorage만)
- stages.ts의 정적 status 필드 제거 (향후 리팩토링 과제)

---

## 3. Risk

| 리스크 | 가능성 | 대응 |
|--------|--------|------|
| immer 미설치 | 중 | playground.tsx 구현 전 `pnpm add immer` 확인 |
| shadcn add 명령 실패 (config 없음) | 중 | `components.json` 없으면 Tailwind 직접 구현으로 fallback |
| progress-store SSR hydration mismatch | 중 | `useEffect` 내에서만 store 읽기 or `skipHydration` 옵션 사용 |
| stages.ts 정적 status vs progress-store 이중화 | 저 | progress-store가 단일 소스 역할, sidebar에서 stages.ts status 무시 |
| `[slug]/page.tsx` 조건부 import 복잡도 | 저 | slug switch문으로 명확하게 처리 |

---

## 4. 구현 순서 (Implementation Guide)

### Session 1: 인프라 (progress-store + shadcn)
1. immer 설치 확인 및 설치 (`pnpm add immer`)
2. shadcn 설치 시도 (`npx shadcn add card tabs progress`) — 실패 시 직접 작성
3. `progress-store.ts` 구현
4. `sidebar.tsx` Progress 바 추가

### Session 2: 레이아웃 개선
5. `stage-layout.tsx` 스텝퍼 + 학습 완료 버튼

### Session 3: Stage 01 콘텐츠
6. `theory.tsx`
7. `playground.tsx` (Bad/Good Case + 메모리 주소 시각화)
8. `code-viewer.tsx`
9. `page.tsx` 콘텐츠 주입

---

## 5. 파일 영향 범위

### 신규 생성
- `src/stores/progress-store.ts`
- `src/features/stage-01-immutability/theory.tsx`
- `src/features/stage-01-immutability/playground.tsx`
- `src/features/stage-01-immutability/code-viewer.tsx`
- `src/components/ui/card.tsx` (shadcn or 직접)
- `src/components/ui/tabs.tsx` (shadcn or 직접)
- `src/components/ui/progress.tsx` (shadcn or 직접)

### 수정
- `src/components/layout/sidebar.tsx` — Progress 바 추가, progress-store 연동
- `src/components/layout/stage-layout.tsx` — 스텝퍼 스타일 + 학습 완료 버튼
- `src/app/stage/[slug]/page.tsx` — Stage 01 콘텐츠 주입

---

## 6. 성공 기준 체크리스트

- [x] `/stage/immutability` 페이지에서 이론/실험실/코드 탭 모두 동작
- [x] Bad Case: "추가" 클릭 후 화면이 안 바뀌는 현상 재현 + 설명 표시
- [x] Good Case: 올바른 불변성 업데이트로 화면 즉시 반영
- [x] 메모리 주소 시각화: Bad(빨강, 동일 주소) / Good(초록, 새 주소)
- [x] Immer `produce` 체험 동작
- [x] "학습 완료" 버튼 클릭 → 사이드바 Progress 바 갱신
- [x] 페이지 새로고침 후에도 진도 유지 (localStorage persist)
- [x] TypeScript 에러 0건, 빌드 통과
