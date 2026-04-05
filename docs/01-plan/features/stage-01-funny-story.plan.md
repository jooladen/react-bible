# Plan: stage-01-funny-story

> Feature: Stage 01 — 😂 더 웃긴 이야기 탭 (React Q&A 심화 대화)
> Created: 2026-04-05
> Phase: Done

---

## Executive Summary

| 관점 | 내용 |
|------|------|
| **Problem** | 더 깊이 탭은 4인방 원리 설명이지만, "왜 이런 질문을 하게 되는가"의 맥락이 없음. 실제 학습자가 궁금해하는 날카로운 질문들과 그 답변이 별도로 필요함 |
| **Solution** | `😂 더 웃긴 이야기` 탭 추가 — fiber3.md의 Q&A 대화(4문 4답)를 원문 그대로 + 질문 박스 스타일로 표시 |
| **Functional UX Effect** | "나도 이 질문 했었는데!" 공감 → 시니어 답변으로 깊이 이해. "이거 진짜 바이블이네" 경험 강화 |
| **Core Value** | 학습자의 실제 궁금증(똥끊기 vs 장부 / useTransition 등)을 Q&A 대화로 해소. 딱딱한 문서가 아닌 살아있는 대화 느낌 |

---

## Context Anchor

| 항목 | 내용 |
|------|------|
| **WHY** | 단순 설명보다 "질문 → 답변" 구조가 이해와 기억에 훨씬 효과적. 학습자가 자신의 질문을 미리 보는 경험 제공 |
| **WHO** | 더 깊이 탭을 읽고 추가 궁금증이 생긴 학습자 / 파이버를 깊이 이해하고 싶은 개발자 |
| **RISK** | fiber3.md 원문 수정 금지 — 스타일링(질문 박스, 코드 컬러, 표 스타일)만 허용 |
| **SUCCESS** | 4개의 Q&A가 질문 박스 + 응답 카드 형태로 가독성 있게 표시됨 |
| **SCOPE** | Stage 01만. deepdive variant 인프라는 이미 구축됨 (재사용) |

---

## 1. 요구사항

### 1.1 기능 요구사항

#### F-01: funny-story.tsx (Stage 01 콘텐츠)
- fiber3.md 원문 한 단어도 수정 금지 — 스타일링만
- Q&A 4세트 구조:
  1. "파이버는 똥끊기라고 했는데 왜 장부?"
  2. "이걸 좀 다르게 써야겠는데...만들어줘"
  3. "10분짜리 작업 중이라도 클릭 오면 중지?"
  4. "useTransition 안 써도 작동함?"

**질문 박스 스타일**:
- 앰버 배경 + `🙋 질문` 라벨
- 질문 텍스트 강조

**응답 영역 스타일**:
- 섹션별 번호 카드 (더 깊이 탭 스타일 통일)
- 비교 표: styled HTML table (헤더 인디고, 교차 행색)
- 코드 블록: 라인 번호 + 신택스 컬러
- 초딩용/개발자용 구분 표시(👦/👨‍💻) 그대로 유지

**theory.child**: FunnyStoryContent — fiber3.md Q&A 대화체 (초딩/개발자 동일)
**theory.dev**: FunnyStoryDev — fiber3.dev.md CS/OS 관점 고급 분석 (React Concurrent Engine: High-Level Spec)

#### F-02: combined.tsx 연결
- import 1줄 + TOPICS 배열 끝에 IMMUTABILITY_FUNNY_STORY 항목 추가

### 1.2 비기능 요구사항

- TypeScript 에러 0건
- deepdive variant 재사용 (인프라 수정 없음)
- light: 클래스로 라이트 모드 지원

---

## 2. Out of Scope

- fiber3.md 내용 수정/요약 (원문 그대로)
- 개발자용 별도 콘텐츠
- 인터랙티브 데모

---

## 3. 파일 영향 범위

### 신규 생성
- `src/features/stage-01-immutability/funny-story.tsx`

### 수정
- `src/features/stage-01-immutability/combined.tsx` — import 1줄 + 탭 1개

---

## 4. 콘텐츠 구조 상세

```
[질문 박스 1] 파이버는 똥끊기라고 했는데 왜 장부?
  → 응답: 체크포인트 개념 + 비교표(Stack vs Fiber) + 한 줄 정리

[질문 박스 2] 이걸 좀 다르게 써야겠는데...
  → 응답: 똥끊기 강조 소스 재매핑 + 이유 설명 + 초딩/개발자 통합 설명

[질문 박스 3] 10분 작업 중에도 클릭 오면 중단?
  → 응답: 3단계 긴급 작전(Scheduler/Fiber/Renderer) + 코드 매핑 + 비교표

[질문 박스 4] useTransition 안 써도 작동함?
  → 응답: 기본 vs useTransition 차이 + 코드 비교(Case A/B) + 왜 기본은 안 되나 + 핵심 요약
```

---

## 5. 성공 기준 체크리스트

- [ ] `😂 더 웃긴 이야기` 탭 클릭 시 이론 풀스크린 렌더링
- [ ] fiber3.md 원문 내용 그대로 표시 (수정 없음)
- [ ] 4개 질문이 앰버 박스로 시각적으로 구분됨
- [ ] 비교 표(과거/현재, 기본/useTransition) 가독성 있게 표시
- [ ] 코드 블록 신택스 컬러 적용
- [ ] 기존 탭 동작 변화 없음
- [ ] TypeScript 에러 0건, 빌드 통과
