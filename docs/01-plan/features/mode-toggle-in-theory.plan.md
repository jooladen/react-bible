# Plan: 초딩/개발자 모드 토글 → 이론탭 내부 이동

**Feature**: `mode-toggle-in-theory`
**Date**: 2026-04-04
**Phase**: Done
**Status**: Done

---

## Executive Summary

| 관점 | 내용 |
|------|------|
| **Problem** | 초딩/개발자 모드 토글이 전역 헤더에 있어 playground·코드뷰어 탭에서도 표시되지만 실제로는 이론탭 콘텐츠에만 영향을 준다. 컨트롤 위치와 영향 범위 불일치 → UX 혼란 |
| **Solution** | 토글을 헤더에서 제거하고 이론탭 콘텐츠 영역 상단에 배치. 영향 범위와 컨트롤 위치를 일치시킴 |
| **Function UX Effect** | 사용자는 이론 탭에서만 토글을 보고 조작. 다른 탭에서는 노이즈 0. 인지 부하 감소 |
| **Core Value** | "컨트롤은 영향받는 콘텐츠 옆에" — 근접성 원칙(Law of Proximity) 적용으로 직관적 UX |

---

## Context Anchor

| 항목 | 내용 |
|------|------|
| **WHY** | 헤더 글로벌 토글은 비이론 탭에서 의미 없는 노이즈. 근접성 원칙 위반 |
| **WHO** | react-bible 학습자 — 초보(초딩모드)와 개발자(dev모드) 모두 |
| **RISK** | 기존 `ExplanationToggle` 삭제 시 layout.tsx 영향. 토글 상태(zustand)는 유지 필요 |
| **SUCCESS** | 이론탭에서만 토글 표시, 헤더에서 제거, 모든 stage theory.tsx에 동일하게 적용 |
| **SCOPE** | ExplanationToggle 헤더 제거 + TheoryModeToggle 신규 + StageLayout 연동 |

---

## 1. 요구사항

### 1.1 기능 요구사항

| ID | 요구사항 | 우선순위 |
|----|----------|----------|
| FR-01 | 기존 `ExplanationToggle`을 `layout.tsx` 헤더에서 제거 | Must |
| FR-02 | `TheoryModeToggle` compact 컴포넌트 신규 생성 | Must |
| FR-03 | `StageLayout`의 이론탭 콘텐츠 상단에 토글 자동 삽입 | Must |
| FR-04 | 기존 `useExplanationStore` 상태 그대로 재사용 (localStorage 유지) | Must |
| FR-05 | 기존 `ExplanationToggle` 컴포넌트 파일 삭제 또는 미사용 처리 | Should |

### 1.2 비기능 요구사항

- 다크/라이트 모드 양쪽에서 정상 표시
- 토글 상태는 탭 전환해도 유지 (zustand store 그대로)
- 기존 hint/tooltip 기능은 새 토글에 포함하지 않음 (compact 버전)

---

## 2. 범위

### 포함

- `layout.tsx` — `ExplanationToggle` import 및 렌더링 제거
- `stage-layout.tsx` — 이론탭 콘텐츠 상단에 `TheoryModeToggle` 삽입
- `src/components/layout/theory-mode-toggle.tsx` — 신규 compact 토글 컴포넌트
- `explanation-toggle.tsx` — 삭제 (또는 `@deprecated` 처리)

### 제외

- `useExplanationStore` 로직 변경 없음
- 각 stage `theory.tsx` 수정 없음 (StageLayout에서 주입하므로)
- playground, code-viewer 탭 변경 없음

---

## 3. 설계 방향

### 3.1 컴포넌트 구조

```
StageLayout (stage-layout.tsx)
  └── activeTab === "theory" 일 때
        ├── TheoryModeToggle  ← 신규 (콘텐츠 최상단)
        └── {theory content}  ← 기존 유지
```

### 3.2 TheoryModeToggle UI (compact)

```
불변성 & Immer 이론
[🟢 초딩 ●──────── 개발자 🔵]
─────────────────────────────
(카드 콘텐츠...)
```

- 토글 버튼: 기존 `ExplanationToggle`과 동일한 spring 애니메이션
- hint 툴팁 제거 (이론탭 안에 있으면 컨텍스트 자명)
- 라벨: "🟢 초딩" / "🔵 개발자" (모바일도 항상 텍스트 표시)

### 3.3 StageLayout 수정 포인트

```tsx
// stage-layout.tsx 내 contentMap 렌더 부분
// 래퍼 div는 border-b만, padding은 TheoryModeToggle 내부(px-6 py-2.5)에 위치
{activeTab === "theory" && (
  <div className="border-b border-border bg-background">
    <TheoryModeToggle />
  </div>
)}
<AnimatePresence mode="wait">
  {contentMap[activeTab]}
</AnimatePresence>
```

---

## 4. 수정 파일 목록

| 파일 | 작업 | 변경량 |
|------|------|--------|
| `src/app/layout.tsx` | `ExplanationToggle` import·JSX 제거 | ~4줄 삭제 |
| `src/components/layout/stage-layout.tsx` | 이론탭 상단 `TheoryModeToggle` 삽입 | ~8줄 추가 |
| `src/components/layout/theory-mode-toggle.tsx` | 신규 compact 토글 컴포넌트 | ~40줄 신규 |
| `src/components/layout/explanation-toggle.tsx` | 삭제 | ~109줄 제거 |

**총 영향 파일: 4개**

---

## 5. 성공 기준

| 기준 | 검증 방법 |
|------|----------|
| 헤더에서 토글 미표시 | 스크린샷 확인 |
| 이론탭 활성 시 토글 표시 | 브라우저 시각 검증 |
| playground/코드뷰어 탭에서 토글 미표시 | 탭 전환 확인 |
| 토글 전환 시 이론 콘텐츠 정상 변경 | child/dev 모드 확인 |
| 빌드 에러 0건 | `pnpm build` |

---

## 6. 리스크

| 리스크 | 대응 |
|--------|------|
| `ExplanationToggle` 다른 곳에서도 사용 중일 수 있음 | 구현 전 `grep`으로 import 전수 확인 |
| stage 수 증가 시 StageLayout 자동 적용 여부 | StageLayout에서 주입하므로 자동 적용됨 |
