# Plan: stage-01-deep-dive

> Feature: Stage 01 — 🌊 더 깊이 탭 (React 내부 원리 심화)
> Created: 2026-04-05
> Phase: Done

---

## Executive Summary

| 관점 | 내용 |
|------|------|
| **Problem** | 기존 combined 3탭(일반 변수/배열·객체/Immer)은 "어떻게 쓰는가"만 알려줌. "왜 이렇게 해야 하는가"의 React 내부 원리가 없어 규칙을 이해하지 못하고 암기만 하게 됨 |
| **Solution** | `🌊 더 깊이` 탭 추가 — React 4인방(Fiber/Scheduler/Reconciler/Renderer) 원리를 fiber2.md 원문 그대로 + 예쁜 스타일로 제공 |
| **Functional UX Effect** | 규칙 암기 → 원리 이해로 레벨업. "아 그래서 push()가 안 됐구나"를 직접 깨닫는 순간 제공 |
| **Core Value** | "이거 진짜 바이블이네" 느낌의 출발점. 20개 Stage 모두에 확장될 더 깊이 패턴의 기준점 |

---

## Context Anchor

| 항목 | 내용 |
|------|------|
| **WHY** | React 학습자 대부분이 규칙은 알지만 이유를 모름. 이유를 알면 응용이 가능해짐 |
| **WHO** | 규칙은 아는데 왜 그런지 모르는 개발자 / 레벨업을 원하는 학습자 |
| **RISK** | fiber2.md 원문을 그대로 써야 하므로 내용 수정 금지 — 스타일링만 허용 |
| **SUCCESS** | "더 깊이" 탭 클릭 → fiber2.md 내용 그대로 + 가독성 있게 표시. 개발자용은 별도 md 파일 수령 후 채움 |
| **SCOPE** | Stage 01만. 공유 인프라(TopicTab variant, combined-stage-view)는 20개 Stage 전체에 영향 |

---

## 1. 요구사항

### 1.1 기능 요구사항

#### F-01: TopicTab 타입 확장 (`combined-stage.ts`)
- `variant?: "demo" | "deepdive"` 필드 추가
- `demo?`, `code?` optional로 변경
- 기존 3개 탭은 variant 없이 그대로 동작 (하위 호환)

#### F-02: CombinedStageView deepdive 분기 (`combined-stage-view.tsx`)
- `variant === "deepdive"` 일 때 이론 영역 `flex-1` 풀스크린
- 데모/코드 분할 영역 렌더링 안 함
- 기존 demo variant는 완전히 그대로

#### F-03: deep-dive.tsx (Stage 01 콘텐츠)
- fiber2.md 원문 한 단어도 수정 금지 — 스타일링만
- 4인방 각각 색상 카드: Fiber=인디고, Scheduler=앰버, Reconciler=그린, Renderer=퍼플
- 코드 블록: 라인 번호 + 신택스 컬러
- 핵심 단어 색상 강조 (Em=인디고, Warn=앰버, Good=그린)
- 꼬임 포인트 2 카드 안에 fiber2_1.md 내용 통합 (파이버 수첩 / 대참사 예제 / 왜 순서 / 시니어 조언)
- 개발자용: fiber2_dev.md 원문 그대로 구현 (DeepDiveDev 컴포넌트 — React Engine: The Concurrent Specs)

#### F-04: combined.tsx 연결
- import 1줄 + TOPICS 배열 끝에 IMMUTABILITY_DEEP_DIVE 항목 추가

### 1.2 비기능 요구사항

- TypeScript 에러 0건
- 기존 3개 탭 동작 변화 없음
- light: 클래스로 라이트 모드 지원

---

## 2. Out of Scope

- 개발자용 콘텐츠 (별도 md 파일 수령 후 작성)
- Stage 02~20 deep-dive 콘텐츠 (패턴만 확립)
- 인터랙티브 데모 (deepdive는 이론 전용)

---

## 3. 파일 영향 범위

### 신규 생성
- `src/features/stage-01-immutability/deep-dive.tsx`

### 수정
- `src/types/combined-stage.ts` — variant, demo?, code? 추가
- `src/components/layout/combined-stage-view.tsx` — deepdive 분기
- `src/features/stage-01-immutability/combined.tsx` — import 1줄 + 탭 1개

---

## 4. 20개 Stage 확장 패턴

이 플랜이 정한 패턴을 따르면 Stage 02~20은 각각:
1. `deep-dive.tsx` 1개 신규 생성 (콘텐츠 작성)
2. `combined.tsx` 2줄 추가 (import + TOPICS 항목)

공유 인프라(타입, 레이아웃) 수정 불필요.

---

## 5. 성공 기준 체크리스트

- [x] `🌊 더 깊이` 탭 클릭 시 이론 풀스크린 렌더링
- [x] fiber2.md 원문 내용 그대로 표시 (수정 없음)
- [x] 4인방 색상 카드 구분
- [x] 꼬임 포인트 2 카드 안에 fiber2_1.md 내용 통합
- [x] 기존 3개 탭 동작 변화 없음
- [x] TypeScript 에러 0건, 빌드 통과
- [x] 개발자용 콘텐츠 (fiber2_dev.md 구현 완료)
