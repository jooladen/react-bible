# 세션 로그 — 2026-04-03

## 질문 인덱스

| # | 질문 원문 | 링크 |
|---|----------|------|
| 1 | 메뉴 접는 버튼도 안보이네 | [→](#q1) |
| 2 | 버튼은 보이는데 동작이 안되...앨리야 항상 테스트 하고 알려줘...전역에 메모리해 | [→](#q2) |
| 3 | 소스 부분에 \n이 안먹어 | [→](#q3) |
| 4 | 앨리 모바일모드 들어가서 문제없는지 확인해봐 | [→](#q4) |
| 5 | 수정해 (터치 타겟) | [→](#q5) |
| 6 | must 언트랙 파일까지 모두 커밋 푸시 | [→](#q6) |
| 7 | 추가해 (.gitignore) | [→](#q7) |
| 8 | 모바일에서는 초딩모드 개발자모드 원래 안보임? 그리고 왼쪽 상단에 RB는 머야? | [→](#q8) |
| 9 | 고쳐줘 | [→](#q9) |
| 10 | /jooladen-session-log 와 /export 는 거의 같은거지? | [→](#q10) |

### 핵심 인사이트

- [빌드 통과 ≠ 동작 정상 — UI는 반드시 Playwright로 직접 확인](#insight-1)
- [md:translate-x-0이 JS state를 override함 — Tailwind 반응형 클래스 주의](#insight-2)
- [HTML에서 {"\n"}은 whitespace-pre-wrap 없이는 무시됨](#insight-3)

---

## 본문

---

### Q1. 사이드바 접기 버튼 안 보임 {#q1}

> **사용자**: "메뉴 접는 버튼도 안보이네"

**상황**: 데스크톱에서 사이드바가 열려있을 때 닫는 버튼이 없었음.

**원인 분석**:
- `sidebar.tsx`의 닫기 버튼은 `md:hidden` → 모바일 전용
- `main-layout.tsx`의 열기 버튼은 `!sidebarOpen`일 때만 렌더링

**수정**: 토글 버튼을 항상 렌더링, `sidebarOpen` 여부에 따라 위치 변경
- 열림 → `left-72` (사이드바 우측 끝)
- 닫힘 → `left-0`
- 방향 아이콘: 열림 `‹`, 닫힘 `›`

**빌드**: 통과 → 완료 보고 (← 이게 실수였음, 다음 Q2 참조)

---

### Q2. 버튼 보이지만 동작 안 됨 + 테스트 규칙 + 메모리 {#q2}

> **사용자**: "버튼은 보이는데 동작이 안되...앨리야 항상 테스트 하고 알려줘...전역에 메모리해"

**실수 경위**: 빌드 통과만 확인하고 실제 클릭 동작은 미확인 → 사용자가 직접 발견

**버그 원인** {#insight-2}:
```
md:translate-x-0
```
Tailwind 반응형 클래스가 JS state(`-translate-x-full`)를 데스크톱에서 항상 override → 사이드바가 state와 무관하게 항상 보임.

**수정**:
```tsx
// 전
fixed inset-y-0 left-0 z-40 md:static md:z-auto md:translate-x-0

// 후
fixed inset-y-0 left-0 z-40 md:static md:z-auto md:transition-none
${sidebarOpen ? "translate-x-0" : "-translate-x-full md:hidden"}
```
데스크톱에서 닫힐 때 `md:hidden` 처리로 해결.

**Playwright 테스트 결과**:
- ‹ 클릭 → 사이드바 닫힘, 컨텐츠 전체 너비 확장 ✓
- › 클릭 → 사이드바 열림 ✓

**메모리 저장**: `feedback_behavior_rules.md` Rule 7 추가
> "UI 변경 후 반드시 Playwright로 실제 동작 확인 후 보고. 빌드 통과 단독으로 완료 보고 불가."

---

### Q3. 코드 블록 \n 줄바꿈 안 됨 {#q3}

> **사용자**: (스크린샷 첨부) "소스 부분에 \n이 안먹어"

**원인** {#insight-3}: HTML에서 `{"\n"}`은 일반 텍스트 노드로 취급 → 공백으로 처리됨. `whitespace-pre-wrap` 클래스가 없으면 무시됨.

**수정**: `theory.tsx` 코드 블록 div에 `whitespace-pre-wrap` 추가
```tsx
// 전
className="mt-3 rounded-md bg-zinc-900 p-3 font-mono text-xs leading-relaxed text-zinc-100"

// 후
className="mt-3 rounded-md bg-zinc-900 p-3 font-mono text-xs leading-relaxed text-zinc-100 whitespace-pre-wrap"
```

**Playwright 확인**: 초딩모드/개발자모드 양쪽 코드 블록 줄바꿈 정상 ✓

---

### Q4. 모바일 전체 점검 {#q4}

> **사용자**: "앨리 모바일모드 들어가서 문제없는지 확인해봐"

**테스트 환경**: Playwright, viewport 390×844 (iPhone 14 Pro)

**정상 동작** ✓:
- 사이드바 오버레이 열기/닫기
- 백드롭 클릭으로 닫기
- 단일 컬럼 카드 레이아웃
- 코드 블록 줄바꿈
- 하단 학습 완료 + 이전/다음 버튼
- 탭 스텝퍼 (이론/실험실/코드 뷰어)

**발견된 문제**:
- 토글 버튼 터치 타겟 너무 작음 (`px-1 py-2 text-xs`)
- 헤더 "RB" (의도된 설계였으나 불명확)
- 초딩모드/개발자모드 텍스트 숨겨짐

---

### Q5. 터치 타겟 수정 {#q5}

> **사용자**: "수정해"

`px-2 py-3 min-w-[20px] text-sm`으로 확대 → 이전 대비 약 2배

Playwright 클릭 테스트 ✓

---

### Q6. 전체 커밋 + 푸시 {#q6}

> **사용자**: "must 언트랙 파일까지 모두 커밋 푸시"

83 files changed — src 소스 18개 + `.playwright-mcp/` 스크린샷/로그 64개 + `.bkit/` 1개

**제안**: `.playwright-mcp/`와 `.bkit/snapshots/`는 테스트 아티팩트 → `.gitignore` 추가 권유

---

### Q7. .gitignore 추가 {#q7}

> **사용자**: "추가해"

`.gitignore`에 추가:
```
# test artifacts
.playwright-mcp/
.bkit/snapshots/
```

이미 트래킹된 파일 `git rm --cached`로 인덱스에서 제거 후 커밋. 108 files changed (삭제).

---

### Q8. 모바일 UI 문제 질문 {#q8}

> **사용자**: "모바일에서는 초딩모드 개발자모드 원래 안보임? 그리고 왼쪽 상단에 RB는 머야?"

**두 가지 모두 의도된 설계였으나 UX상 불명확**:

| 항목 | 원인 | 판단 |
|------|------|------|
| 토글 텍스트 숨김 | `hidden sm:inline` | 공간 절약용이지만 뭔지 모름 |
| RB | `sm:hidden`으로 약어 표시 | 브랜드 인식 불가 |

---

### Q9. 모바일 헤더/토글 수정 {#q9}

> **사용자**: "고쳐줘"

**수정 내용**:
- `layout.tsx`: `RB` 제거 → 모바일에서도 `react-bible` 표시
- `explanation-toggle.tsx`: 모바일에서 텍스트 숨기되 이모지 표시
  - 모바일: `🟢 [토글] 🔵`
  - 데스크톱: `🟢 초딩모드 [토글] 🔵 개발자모드`

Playwright 확인 ✓

---

### Q10. /jooladen-session-log vs /export 차이 {#q10}

> **사용자**: "/jooladen-session-log 와 /export 는 거의 같은거지?"

| | `/jooladen-session-log` | `/export` |
|---|---|---|
| 형식 | 구조화된 마크다운 | 원본 대화 그대로 |
| 저장 위치 | 프로젝트 docs/ | Claude 앱 다운로드 |
| 목적 | 읽기 좋게 가공한 요약 | 날것의 백업 |

---

## PDCA 진행 상황

- Phase: **DO** (구현 진행 중)
- Stage 01 (불변성 & Immer): 완료 ✓
- Stage 02 이후: 미착수

## 오늘 커밋 목록

| 커밋 | 내용 |
|------|------|
| `1cfa5a8` | fix: 사이드바 토글 + 코드 블록 줄바꿈 + 모바일 터치 타겟 |
| `0ef3f82` | chore: .playwright-mcp, .bkit/snapshots .gitignore 추가 |
| `38bd267` | fix: 모바일 헤더 RB → react-bible, 토글 이모지 표시 |
