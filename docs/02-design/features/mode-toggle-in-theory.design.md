# Design: 초딩/개발자 모드 토글 → 이론탭 내부 이동

**Feature**: `mode-toggle-in-theory`
**Architecture**: Option B — 신규 compact TheoryModeToggle + StageLayout 주입
**Date**: 2026-04-04
**Phase**: Design

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

## 1. 개요

### 1.1 선택된 아키텍처: Option B

```
[기존]
layout.tsx
  └── header
        └── ExplanationToggle  ← 전역 항상 표시

[변경 후]
layout.tsx
  └── header
        └── (ExplanationToggle 제거)

StageLayout (stage-layout.tsx)
  └── activeTab === "theory"
        ├── TheoryModeToggle  ← 신규 compact (이론탭 활성 시만)
        └── {theory content}  ← 기존 유지
```

### 1.2 설계 결정 근거

- `StageLayout`에서 주입 → theory.tsx 파일 불변 (미래 stage 추가 시 자동 적용)
- 신규 `TheoryModeToggle` → hint/tooltip 없는 compact 버전 (이론탭 안에서 context 자명)
- `useExplanationStore` 그대로 재사용 → 상태 로직 변경 0

---

## 2. 컴포넌트 설계

### 2.1 TheoryModeToggle (신규)

**파일**: `src/components/layout/theory-mode-toggle.tsx`

**역할**: 이론탭 콘텐츠 상단 전용 compact 모드 토글

**UI 구조**:
```
🟢 초딩  [●────]  개발자 🔵
```

**Props**: 없음 (useExplanationStore에서 직접 읽음)

**스펙**:
- spring 애니메이션 (framer-motion) — 기존 ExplanationToggle과 동일
- 다크/라이트 모드 양쪽 지원
- hint 아이콘/tooltip 없음 (제거)
- `"use client"` 필수 (zustand 접근)

**크기**: 
- 토글 버튼: `h-5 w-9` (기존 `h-6 w-11`보다 약간 작게 — compact)
- 컴포넌트 내부 패딩: `px-6 py-2.5 select-none` (래퍼 div는 패딩 없음)
- 래퍼 div (StageLayout): `border-b border-border bg-background`만 담당

### 2.2 StageLayout 수정

**파일**: `src/components/layout/stage-layout.tsx`

**변경 위치**: 콘텐츠 렌더 영역 (`AnimatePresence` 내부 앞)

```tsx
// 이론탭일 때만 토글 표시 (콘텐츠 상단 고정)
{activeTab === "theory" && (
  <div className="border-b border-border bg-background">
    <TheoryModeToggle />
  </div>
)}
<AnimatePresence mode="wait">
  <motion.div key={activeTab} ...>
    {contentMap[activeTab]}
  </motion.div>
</AnimatePresence>
```

### 2.3 layout.tsx 수정

`ExplanationToggle` import 및 JSX 제거:

```tsx
// 제거
import { ExplanationToggle } from "@/components/layout/explanation-toggle"

// 제거
<ExplanationToggle />
```

### 2.4 explanation-toggle.tsx 처리

**삭제** — 더 이상 사용되지 않음.

구현 전 grep으로 다른 import 없음을 확인 필수:
```bash
grep -r "ExplanationToggle\|explanation-toggle" src/
```

---

## 3. TheoryModeToggle 상세 구현 스펙

```tsx
"use client"

// Design Ref: §2.1 — 이론탭 전용 compact 모드 토글
import { motion } from "framer-motion"
import { useExplanationStore } from "@/stores/explanation-store"

export function TheoryModeToggle() {
  const { mode, toggle } = useExplanationStore()
  const isDev = mode === "dev"

  return (
    <div className="flex items-center gap-3 px-6 py-2.5 select-none">
      <span className={`text-xs font-medium transition-colors ${
        !isDev ? "text-green-500 light:text-green-700" : "text-muted-foreground"
      }`}>
        🟢 초딩
      </span>

      <button
        onClick={toggle}
        className="relative h-5 w-9 rounded-full bg-zinc-700 light:bg-zinc-300
                   transition-colors focus-visible:outline-none focus-visible:ring-2
                   focus-visible:ring-ring focus-visible:ring-offset-1"
        aria-label={`설명 모드: ${isDev ? "개발자" : "초딩"}`}
        role="switch"
        aria-checked={isDev}
      >
        <motion.span
          className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm"
          animate={{ left: isDev ? "1.125rem" : "0.125rem" }}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />
      </button>

      <span className={`text-xs font-medium transition-colors ${
        isDev ? "text-indigo-400 light:text-indigo-600" : "text-muted-foreground"
      }`}>
        개발자 🔵
      </span>
    </div>
  )
}
```

---

## 4. 데이터 플로우

```
useExplanationStore (zustand + localStorage)
    │
    ├── TheoryModeToggle (이론탭 상단) — 읽기/쓰기
    │
    └── theory.tsx 내 { mode === "child" ? ... : ... } — 읽기만
```

상태 구조 변경 없음. store, localStorage persistence 모두 유지.

---

## 5. 파일별 변경 상세

| 파일 | 변경 유형 | 변경 내용 |
|------|-----------|----------|
| `src/components/layout/theory-mode-toggle.tsx` | 신규 생성 | compact 토글 컴포넌트 (~35줄) |
| `src/components/layout/stage-layout.tsx` | 수정 | import 추가 + `activeTab === "theory"` 조건부 렌더 (~8줄) |
| `src/app/layout.tsx` | 수정 | ExplanationToggle import/JSX 제거 (~4줄) |
| `src/components/layout/explanation-toggle.tsx` | 삭제 | 전체 제거 |

**총 영향: 4파일, 신규 ~35줄, 추가 ~8줄, 삭제 ~113줄**

---

## 6. 다크/라이트 모드 스타일

| 요소 | 다크 | 라이트 |
|------|------|--------|
| 토글 트랙 | `bg-zinc-700` | `light:bg-zinc-300` |
| 초딩 활성 텍스트 | `text-green-500` | `light:text-green-700` |
| 개발자 활성 텍스트 | `text-indigo-400` | `light:text-indigo-600` |
| 비활성 텍스트 | `text-muted-foreground` | (CSS var 자동) |
| 컨테이너 배경 | `bg-background` | (CSS var 자동) |
| 하단 구분선 | `border-border` | (CSS var 자동) |

---

## 7. 성공 기준 (Plan 연동)

| Plan SC | 검증 포인트 |
|---------|------------|
| 헤더에서 토글 미표시 | 헤더 DOM에 toggle 없음 |
| 이론탭 활성 시 토글 표시 | 탭 전환 후 DOM 확인 |
| playground/코드뷰어에서 미표시 | 탭 전환 시 토글 사라짐 |
| 토글 전환 시 콘텐츠 변경 | child/dev 컨텐츠 토글 확인 |
| 빌드 에러 0건 | `pnpm build` |

---

## 8. 구현 가이드 (Session Guide)

### Module Map

| Module | 파일 | 작업 |
|--------|------|------|
| M1 | `theory-mode-toggle.tsx` 신규 | compact 토글 컴포넌트 생성 |
| M2 | `stage-layout.tsx` | M1 import + 조건부 렌더 삽입 |
| M3 | `layout.tsx` | ExplanationToggle 제거 |
| M4 | `explanation-toggle.tsx` | 파일 삭제 |

### 권장 구현 순서

```
M1 → M2 → 빌드 확인 → M3 → M4 → 최종 빌드
```

M3·M4는 M2 완료 후 진행 (새 토글이 정상 동작 확인 후 기존 제거).

### 구현 전 필수 확인

```bash
# ExplanationToggle 다른 곳 import 없는지 확인
grep -r "ExplanationToggle\|explanation-toggle" src/
```
