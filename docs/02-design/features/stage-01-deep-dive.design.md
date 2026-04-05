# Design: stage-01-deep-dive

> Feature: Stage 01 — 🌊 더 깊이 탭 (React 내부 원리 심화)
> Architecture: deepdive variant — 이론 풀스크린, 데모 없음
> Created: 2026-04-05
> Phase: Done

---

## Context Anchor

| 항목 | 내용 |
|------|------|
| **WHY** | "어떻게 쓰는가" → "왜 이렇게 해야 하는가" 레벨업. 규칙 암기 → 원리 이해 |
| **WHO** | React 규칙은 아는데 이유를 모르는 개발자. 레벨업 원하는 학습자 |
| **RISK** | fiber2.md / fiber2_1.md 원문 수정 금지 — 스타일링만. 내용 변경 시 저자 의도 훼손 |
| **SUCCESS** | 탭 클릭 → 원문 그대로 + 가독성 있게 표시. 개발자용은 md 파일 수령 후 채움 |
| **SCOPE** | TopicTab variant 확장은 20개 Stage 공유 인프라. Stage 01 콘텐츠만 이번 범위 |

---

## 1. Overview

**아키텍처: deepdive variant**

```
combined.tsx
  TOPICS: TopicTab[]
    [0] 일반 변수  (variant: "demo")   ← 기존, 변경 없음
    [1] 배열/객체  (variant: "demo")   ← 기존, 변경 없음
    [2] Immer      (variant: "demo")   ← 기존, 변경 없음
    [3] 더 깊이    (variant: "deepdive") ← 신규
          ↓
    CombinedStageView
      variant === "deepdive" → 이론 영역 flex-1 풀스크린
      demo/code 영역 → 렌더링 안 함
```

**레이아웃 분기 원칙**:
- 기존 demo variant: 이론(상단 고정) + 데모/코드(하단 분할) — 변경 없음
- deepdive variant: 이론 영역이 전체 높이 차지. 데모/코드 없음

---

## 2. 파일 구조

```
src/
├── types/
│   └── combined-stage.ts          [수정] variant?, demo?, code? optional 추가
├── components/layout/
│   └── combined-stage-view.tsx    [수정] deepdive variant 분기
└── features/stage-01-immutability/
    ├── deep-dive.tsx              [신규] 콘텐츠 (fiber2.md + fiber2_1.md)
    └── combined.tsx               [수정] import 1줄 + TOPICS 항목 1개
```

---

## 3. 타입 설계

### 3.1 TopicTab 확장

```typescript
// src/types/combined-stage.ts
export type TopicTab = {
  id: string
  label: string
  icon?: string
  variant?: "demo" | "deepdive"  // 없으면 "demo" 동작 (기존 호환)
  theory: {
    child: ReactNode
    dev: ReactNode
  }
  demo?: ReactNode      // deepdive면 불필요 → optional
  code?: CodeSnippet[]  // deepdive면 불필요 → optional
}
```

**하위 호환**: 기존 3개 탭은 `variant` 없음 → `"demo"` 동작과 동일. `demo`/`code` 필드 기존 그대로 동작.

### 3.2 IMMUTABILITY_DEEP_DIVE 객체

```typescript
// src/features/stage-01-immutability/deep-dive.tsx
export const IMMUTABILITY_DEEP_DIVE: TopicTab = {
  id: "react-internals",
  label: "더 깊이",
  icon: "🌊",
  variant: "deepdive",
  theory: {
    child: <DeepDiveChild />,   // fiber2.md + fiber2_1.md 원문
    dev: <DeepDiveDev />,       // fiber2_dev.md — OS/CS 관점 고급 스펙 (React Engine: The Concurrent Specs)
  },
  // demo, code 없음
}
```

---

## 4. 컴포넌트 설계

### 4.1 CombinedStageView 분기

```typescript
// 이론 영역 className 분기
className={cn(
  "bg-background/50 px-6 py-4",
  currentTab.variant === "deepdive"
    ? "flex-1 overflow-auto"    // 풀스크린
    : "border-b border-border"  // 기존 고정 높이
)}

// 데모+코드 영역 조건부 렌더링
{currentTab.variant !== "deepdive" && (
  <AnimatePresence mode="wait">
    {/* 기존 데모+코드 레이아웃 완전히 그대로 */}
  </AnimatePresence>
)}
```

### 4.2 DeepDiveChild 콘텐츠 구조

fiber2.md + fiber2_1.md 원문 100% 유지. 스타일링 헬퍼만 적용.

**스타일 헬퍼**:
```typescript
Em   → text-indigo-300  (핵심 개념어)
Warn → text-amber-400   (주의/위험)
Good → text-green-400   (정답/해결)
```

**섹션별 레이아웃**:

```
┌─────────────────────────────────────────────┐
│  1. 리액트 엔진 분석 소스                     │  ← 코드 블록 (라인 번호 + 신택스 컬러)
├─────────────────────────────────────────────┤
│  2. 리액트 마을의 4인방                       │
│   ┌── 인디고 카드 ──┐  Fiber  — 장부         │
│   ├── 앰버 카드 ────┤  Scheduler — 순경       │
│   ├── 그린 카드 ────┤  Reconciler — 틀린그림  │
│   └── 퍼플 카드 ────┘  Renderer — 일꾼        │
├─────────────────────────────────────────────┤
│  3. 전체 흐름                                │
│   Phase 1 카드 (인디고 라벨)                 │
│   Phase 2 카드 (앰버 라벨)                   │
├─────────────────────────────────────────────┤
│  4. 시니어의 통찰                            │
│   꼬임 포인트 1 카드 (앰버)                  │
│   ┌── 꼬임 포인트 2 카드 (앰버) ─────────── ┐│
│   │  원문 + border-t 구분선으로 fiber2_1 통합││
│   │  · 파이버 수첩                           ││
│   │  · 대참사 예제 (코드 비교)               ││
│   │  · 왜 순서로 관리하나                    ││
│   │  · 시니어 조언 (Bad/Good 2단 그리드)     ││
│   └────────────────────────────────────────┘│
├─────────────────────────────────────────────┤
│  💡 최종 정리 (인디고 배너, 중앙 정렬)        │
└─────────────────────────────────────────────┘
```

**4인방 카드 색상 규칙**:
| 캐릭터 | 보더 | 배경 |
|--------|------|------|
| Fiber | indigo-500/30 | indigo-950/10 |
| Scheduler | amber-500/30 | amber-950/10 |
| Reconciler | green-500/30 | green-950/10 |
| Renderer | purple-500/30 | purple-950/10 |

**코드 블록 구조** (라인 번호 + 신택스 컬러):
```
div.rounded-md.bg-zinc-900.font-mono.text-xs.leading-7
  div × N줄
    span.text-zinc-500   → 라인 번호 (01:, 02:, ...)
    span.text-purple-400 → import/export/function
    span.text-yellow-400 → 함수명
    span.text-green-400  → 문자열
    span.text-orange-400 → 숫자/boolean
    span.text-blue-400   → const/let
    span.text-zinc-400   → 주석 ([A. 최초 로딩] 등)
```

### 4.3 꼬임 포인트 2 — fiber2_1 통합 방식

하나의 앰버 카드 안에서 `border-t border-amber-500/20 pt-4`로 구분:

```
[꼬임 포인트 2 카드]
  원문 2줄 (질문 + 답변)
  ────────────────── border-t
  파이버 수첩 (memoizedState, 순서 원리)
  ────────────────── border-t
  대참사 예제 (정상 코드 → 대참사 코드 → 엔진 내부 독백 → 결과)
  ────────────────── border-t
  왜 순서로 관리하나 (성능 + 충돌 방지 + Linter 정책)
  ────────────────── border-t
  시니어 조언 Bad/Good (2단 grid)
```

---

## 5. 주요 기술 결정

| 결정 | 선택 | 이유 |
|------|------|------|
| 레이아웃 방식 | 풀스크린 이론, 데모 없음 | 내부 원리는 읽는 콘텐츠. 인터랙션 불필요 |
| 원문 처리 | 내용 수정 금지, 스타일만 | 저자(준) 의도 보존. 이해도 검증되지 않은 수정은 위험 |
| fiber2_1 위치 | 꼬임 포인트 2 카드 내부 | fiber2_1은 꼬임 포인트 2의 심화 설명 — 별도 섹션보다 인라인이 자연스러움 |
| 4인방 색상 | 캐릭터별 다른 색 | 빠른 스캔으로 캐릭터 구분 가능 |
| 개발자용 | fiber2_dev.md 구현 | React Engine: The Concurrent Specs — OS 추상화 관점으로 4대 모듈, Lane 모델, 라이프사이클 설명 |

---

## 6. 성공 기준

- [x] `🌊 더 깊이` 탭 클릭 시 이론 풀스크린
- [x] fiber2.md 원문 한 단어도 수정 없음
- [x] fiber2_1.md 원문 꼬임 포인트 2 카드 내부에 통합
- [x] 4인방 각각 다른 색상 카드
- [x] 코드 블록 라인 번호 + 신택스 컬러
- [x] 기존 3개 탭 동작 변화 없음
- [x] TypeScript 에러 0건, 빌드 통과
- [x] 개발자용 콘텐츠 (fiber2_dev.md 구현 완료)
