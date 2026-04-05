# Design: stage-01-funny-story

> Feature: Stage 01 — 😂 더 웃긴 이야기 탭 (React Q&A 심화 대화)
> Architecture: deepdive variant 재사용 — 질문 박스 + 응답 카드
> Created: 2026-04-05
> Phase: Plan

---

## Context Anchor

| 항목 | 내용 |
|------|------|
| **WHY** | "나도 이 질문 했었는데!" 공감 → 시니어 답변으로 깊이 이해. 살아있는 대화 느낌 |
| **WHO** | 더 깊이 탭 읽고 추가 궁금증이 생긴 학습자. "왜?" 가 멈추지 않는 사람 |
| **RISK** | fiber3.md 원문 수정 금지 — 스타일링만. deepdive 인프라는 이미 구축됨 |
| **SUCCESS** | 4개 Q&A가 질문 박스 + 응답 카드로 가독성 있게 표시됨 |
| **SCOPE** | funny-story.tsx 신규 + combined.tsx 2줄. 공유 인프라 수정 없음 |

---

## 1. Overview

**아키텍처: deepdive variant 재사용**

```
combined.tsx
  TOPICS: TopicTab[]
    [0~2] 기존 3개  ← 변경 없음
    [3] 더 깊이     ← 기존 구현
    [4] 더 웃긴 이야기  ← 신규
          variant: "deepdive"
          theory.child = theory.dev = 동일 콘텐츠
          (Q&A는 모드 구분 불필요)
```

**Q&A 대화 구조**:
```
[질문 박스] ─ 앰버 배경, 🙋 라벨
     ↓
[응답 영역] ─ 섹션별 카드, 코드, 비교표
     ↓
[질문 박스]
     ↓
[응답 영역]
     × 4세트
```

---

## 2. 파일 구조

```
src/
└── features/stage-01-immutability/
    ├── funny-story.tsx    [신규] 콘텐츠 (fiber3.md 원문)
    └── combined.tsx       [수정] import 1줄 + TOPICS 항목 1개
```

공유 인프라(`combined-stage.ts`, `combined-stage-view.tsx`) 수정 없음.

---

## 3. 타입 설계

```typescript
// src/features/stage-01-immutability/funny-story.tsx
export const IMMUTABILITY_FUNNY_STORY: TopicTab = {
  id: "funny-story",
  label: "더 웃긴 이야기",
  icon: "😂",
  variant: "deepdive",
  theory: {
    child: <FunnyStoryContent />,  // fiber3.md Q&A 대화체
    dev: <FunnyStoryDev />,        // fiber3.dev.md — CS/OS 관점 고급 스펙
  },
}
```

---

## 4. 컴포넌트 설계

### 4.1 스타일 헬퍼

deep-dive.tsx와 동일한 헬퍼 재사용:
```typescript
Em   → text-indigo-300  (핵심 개념어)
Warn → text-amber-400   (주의/위험)
Good → text-green-400   (정답/해결)
```

추가 헬퍼:
```typescript
// 질문 박스 — fiber3.md의 "말씀하신 내용" 영역
function QuestionBox({ children }: { children: React.ReactNode })
// → 앰버 배경 카드, 상단 "🙋 질문" 라벨
```

### 4.2 FunnyStoryContent 레이아웃

fiber3.md 4세트 Q&A 구조:

```
┌─────────────────────────────────────────────┐
│  🙋 질문                                    │  ← QuestionBox (앰버)
│  "파이버는 똥끊기라고 했는데 왜 장부?"         │
└─────────────────────────────────────────────┘
  ↓
[응답 1] — 섹션별 번호 카드
  1. 왜 "똥 끊기"에 "장부"가 필요한가
  2. 주어와 목적어로 보는 파이버의 행동
     ① 작업 중단 시 (인디고 카드)
     ② 작업 재개 시 (인디고 카드)
  3. "장부"가 곧 "똥 끊기"의 핵심 부품인 이유
     → 비교표 (Stack Reconciler vs Fiber Reconciler)
  4. 시니어의 한 줄 정리 (💡 요약 배너)

┌─────────────────────────────────────────────┐
│  🙋 질문                                    │
│  "그럼 이걸 좀 다르게 써야겠는데...만들어줘"  │
└─────────────────────────────────────────────┘
  ↓
[응답 2]
  1. 파이버의 '똥 끊기' 능력을 강조한 소스 매핑
     → 코드 블록 (라인 번호 + 주석 강조)
  2. 왜 문구를 이렇게 바꿔야 하나
     ① "기록" → "이정표(Checkpoint)"로 변경한 이유
     ② "순서 관리" → "도로명 주소"로 변경한 이유
  3. 초딩용 + 개발자용 통합 설명
     👦 초딩용 카드 (인디고)
     👨‍💻 개발자용 카드 (퍼플)
  4. 시니어의 팁

┌─────────────────────────────────────────────┐
│  🙋 질문                                    │
│  "10분짜리 작업 중이라도 클릭 오면 중단?"     │
└─────────────────────────────────────────────┘
  ↓
[응답 3]
  1. 사용자가 클릭하는 순간의 3단계 긴급 작전
     Step 1 스케줄러 카드 (앰버)
     Step 2 파이버 카드 (인디고)
     Step 3 렌더러 카드 (그린)
  2. 소스 코드 매핑 (긴급 중단 상황)
     → 코드 블록 (라인 번호 + 주석)
  3. 왜 이렇게 설계했나 — 비교표 (파이버 이전/이후)
  4. 초보자를 위한 최종 정리 (💡 요약 배너)

┌─────────────────────────────────────────────┐
│  🙋 질문                                    │
│  "useTransition 안 써도 작동함?"              │
└─────────────────────────────────────────────┘
  ↓
[응답 4]
  1. 기본 소스 vs useTransition 차이
     기본 소스 카드 (레드/경고)
     useTransition 카드 (그린)
  2. 소스 코드 비교
     Case A 코드 (기본) ── Case B 코드 (useTransition) 나란히
  3. 왜 useTransition을 써야만 작동하나
     → 일관성 / 오버헤드 / 개발자 의도 3가지
  4. 핵심 요약 (하드웨어 vs 터보 버튼 비유)
     → 💡 최종 배너
```

### 4.3 QuestionBox 디자인

```
┌─────────────────────────────────────────────┐
│  🙋 질문                    ← xs, 앰버 라벨  │
├─────────────────────────────────────────────┤
│  "파이버는 똥끊기라고 했는데 왜 장부?"        │
│                             ← sm, 폰트 시각  │
└─────────────────────────────────────────────┘
className: rounded-lg border border-amber-500/40
           bg-amber-950/20 p-4
           light: bg-amber-50 border-amber-300
```

### 4.4 비교표 디자인 (2종)

**표 1** — Stack Reconciler vs Fiber Reconciler:
| 구분 | 과거 (Stack) | 현재 (Fiber) |
|------|-------------|-------------|
| 비유 | 폭포수 | 체크포인트 게임 |
| 구조 | 함수 호출 스택 | 객체 기반 장부 |
| 똥 끊기 | 불가능 | 가능 |

**표 2** — 파이버 이전/이후:
| 상황 | 파이버 이전 | 파이버 이후 |
|------|------------|------------|
| 작업 중 클릭 | 화면 굳음 | 즉각 반응 |
| 대규모 데이터 | 응답 없음 | 조용히 처리 |
| 개발자 경험 | 코드 지저분 | 비즈니스 로직 집중 |

```typescript
// 공통 테이블 스타일
<table className="w-full text-sm border-collapse">
  <thead>
    <tr className="bg-indigo-950/30 light:bg-indigo-50">
      <th className="border border-border px-3 py-2 text-left">...</th>
    </tr>
  </thead>
  <tbody>
    <tr className="even:bg-zinc-900/30 light:even:bg-zinc-50">
      ...
    </tr>
  </tbody>
</table>
```

### 4.5 코드 블록

deep-dive.tsx와 동일한 방식:
- 라인 번호 + 신택스 컬러
- 주석(`//`)은 `text-zinc-400`으로 강조 (fiber3.md의 주석이 핵심 설명이므로)

---

## 5. 주요 기술 결정

| 결정 | 선택 | 이유 |
|------|------|------|
| theory.child / theory.dev 분리 | 별도 콘텐츠 | 초딩용=Q&A 대화체(fiber3.md), 개발자용=CS/OS 관점 고급 분석(fiber3.dev.md) |
| 질문 박스 스타일 | 앰버 배경 카드 | 더 깊이 탭의 "꼬임 포인트" 카드와 동일 색상 → 일관성 |
| 비교표 | HTML table | 3열 이상 데이터는 table이 가장 명확 |
| 코드 비교 (Case A/B) | 2단 grid 나란히 | 차이를 한눈에 볼 수 있음. 모바일에서는 단일 컬럼으로 fallback |
| 파일 분리 | funny-story.tsx 별도 | deep-dive.tsx와 완전히 독립. 향후 수정 시 영향 없음 |

---

## 6. 성공 기준

- [ ] `😂 더 웃긴 이야기` 탭 클릭 시 이론 풀스크린
- [ ] fiber3.md 원문 한 단어도 수정 없음
- [ ] 4개 질문이 앰버 QuestionBox로 시각적 구분
- [ ] 비교표 2개 가독성 있게 표시
- [ ] 코드 블록 라인 번호 + 신택스 컬러
- [ ] Case A/B 코드 나란히 비교 표시
- [ ] 기존 탭 동작 변화 없음
- [ ] TypeScript 에러 0건, 빌드 통과
