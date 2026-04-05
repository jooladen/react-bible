# mobile-ux Plan

## Executive Summary

| 관점 | 내용 |
|------|------|
| **문제** | 모바일(390px)에서 탭이 줄바꿈·잘림, 사이드바가 콘텐츠를 가림, 데모+코드가 세로 나열되어 스크롤이 너무 길어짐 |
| **해결** | 탭 아이콘화 + 하단 Bottom Sheet 사이드바 + 데모/코드 탭 전환 |
| **기능 UX 효과** | 모바일에서 콘텐츠 전체가 한 화면에 들어오고, 사이드바가 방해 없이 접근 가능 |
| **핵심 가치** | react-bible을 이동 중에도 편하게 학습 가능한 모바일 퍼스트 경험으로 전환 |

## Context Anchor

| | |
|--|--|
| **WHY** | 모바일 화면에서 탭 줄바꿈·잘림으로 콘텐츠 자체에 접근하기 어려움 |
| **WHO** | 이동 중 학습하는 사용자, 폰으로 react-bible 확인하는 개발자 |
| **RISK** | 데스크탑 레이아웃 깨짐 금지 — 모바일 전용 처리(md: breakpoint)로 격리 |
| **SUCCESS** | 모바일에서 탭 6개가 한 줄에 표시, 스크롤 없이 데모 또는 코드 확인 가능 |
| **SCOPE** | 4개 파일 — combined-stage-view.tsx, main-layout.tsx 수정 + mobile-tab-bar.tsx, bottom-sheet-sidebar.tsx 신규 |

---

## 1. 현황 분석 (스크린샷 기반)

### 확인된 문제

| 심각도 | 위치 | 문제 | 원인 |
|--------|------|------|------|
| 🔴 심각 | `combined-stage-view.tsx` 탭 바 | "일반\n변수", "배열/\n객체" 세로 줄바꿈, 우측 탭 잘림 | `overflow-x-auto` 없음, `whitespace-nowrap` 없음, 6개 탭이 390px 초과 |
| 🟡 불편 | `combined-stage-view.tsx` 콘텐츠 | 데모 아래 코드가 스택 → 스크롤 과다 | `flex-col` 세로 나열, 탭 전환 없음 |
| 🟡 불편 | `main-layout.tsx` 사이드바 | 토글 버튼이 콘텐츠 위 겹침, 사이드바 열면 콘텐츠 못 봄 | `fixed left-0` 버튼, 오버레이 구조 |

---

## 2. 요구사항

### 확정된 방향 (사용자 확인)

1. **탭 바 — 아이콘만 표시** (모바일)
   - 탭에 아이콘만 표시, 선택된 탭 이름은 탭 바 아래 별도 표시
   - 데스크탑(md+): 기존 아이콘 + 이름 유지

2. **사이드바 — 하단 Bottom Sheet** (모바일)
   - 화면 하단에 `☰ 스테이지 목록 ↑` 버튼 고정
   - 클릭 시 아래서 위로 올라오는 Sheet (max-h: 70vh)
   - Backdrop 클릭으로 닫기
   - 데스크탑(md+): 기존 왼쪽 오버레이 유지

3. **데모/코드 — 탭 전환** (모바일)
   - `[ 데모 ● | 코드 ]` 세그먼티드 버튼
   - 한 번에 하나만 표시
   - 데스크탑(md+): 기존 좌우 분할 유지

---

## 3. 수정 파일

| 파일 | 변경 유형 | 내용 |
|------|----------|------|
| `src/components/layout/mobile-tab-bar.tsx` | **신규** | 모바일 전용 아이콘 탭바 컴포넌트 (~45줄) |
| `src/components/layout/bottom-sheet-sidebar.tsx` | **신규** | 모바일 전용 Bottom Sheet 래퍼 컴포넌트 (~40줄) |
| `src/components/layout/combined-stage-view.tsx` | 수정 | MobileTabBar 주입 + isDesktop 분기 + 데모/코드 탭 전환 |
| `src/components/layout/main-layout.tsx` | 수정 | BottomSheetSidebar 주입 + 하단 버튼 + isDesktop 분기 |

**sidebar.tsx 수정 없음.**

---

## 4. 설계 상세

### 4.1 combined-stage-view.tsx 변경

#### 탭 바 (모바일: 아이콘만)
```
모바일 탭 바: [ 🔢 | 📦 | ✨ | 🌊 | 😂 | 🧪 ]
              선택된 탭 아래: "일반 변수"

데스크탑 탭 바: [ 🔢 일반 변수 | 📦 배열/객체 | ... ] (기존)
```

구현:
- 탭 바를 모바일/데스크탑 두 버전으로 분기
  - 모바일: `flex justify-around` + 아이콘 `text-xl` + 활성 탭 아래 인디케이터
  - 데스크탑(`md:`): 기존 탭 스타일 그대로
- 탭 바 바로 아래 `md:hidden` div에 선택된 탭 이름 표시

#### 데모/코드 탭 전환 (모바일)
```typescript
const [mobileSection, setMobileSection] = useState<"demo" | "code">("demo")
const [isDesktop, setIsDesktop] = useState(true) // Tailwind v4 hidden/md:X 충돌 방지
```
- `md:hidden` 세그먼티드 탭 버튼 추가 (code 필드 없는 탭에서는 미렌더링)
- 데모 div: `!isDesktop && code존재 && mobileSection !== "demo" && "hidden"`
- 코드 div: code 필드 있는 탭만 렌더링, `!isDesktop && mobileSection !== "code" && "hidden"`
- **주의**: Tailwind v4에서 `hidden md:block` 패턴 불가 — base 유틸리티가 responsive 변형보다 나중에 생성되어 충돌. JS `isDesktop` 조건부 렌더링으로 대체.

### 4.2 main-layout.tsx 변경

#### 현재 구조
```
[사이드바 토글 버튼 fixed left-0]
[사이드바 오버레이] + [메인 콘텐츠]
```

#### 변경 후 구조
```
모바일:
[메인 콘텐츠 - pb-14로 하단 여백]
[하단 Bottom Sheet - 올라옴]
[하단 고정: ☰ 스테이지 목록 ↑]

데스크탑(md+):
[사이드바 왼쪽] + [메인 콘텐츠]
[사이드바 토글 버튼 fixed]
```

구현:
- 모바일 사이드바: `fixed bottom-0 left-0 right-0 z-50 md:hidden` Bottom Sheet
  - inline style `transform: open ? "translateY(0)" : "translateY(110vh)"` (Tailwind v4 동적 클래스 미생성 방지)
  - `rounded-t-2xl` + 핸들 바
- 하단 고정 버튼: inline style `position: fixed, bottom: 0` + `md:hidden` (Tailwind fixed bottom-0 레이아웃 충돌 방지)
- 메인 콘텐츠: `pb-16 md:pb-0` (하단 버튼 여백)
- 데스크탑 토글 버튼: `{isDesktop && <button>}` JS 조건부 렌더링 (`hidden md:block` Tailwind v4 불가)

---

## 5. 구현 순서

```
1. combined-stage-view.tsx 수정
   1a. useState mobileSection 추가
   1b. 탭 바 → 모바일/데스크탑 분기
   1c. 탭 이름 표시 div 추가 (md:hidden)
   1d. 데모 div + 코드 div → mobileSection 조건 추가
   1e. 데모/코드 전환 탭 버튼 추가 (md:hidden)

2. main-layout.tsx 수정
   2a. 모바일 Bottom Sheet div 추가
   2b. 하단 고정 버튼 추가 (md:hidden)
   2c. 기존 데스크탑 토글 버튼 → (hidden md:block) 처리
   2d. 메인 콘텐츠에 pb-14 md:pb-0 추가

3. pnpm exec tsc --noEmit
4. pnpm build
```

---

## 6. 검증

- 모바일(390px): 탭 6개 한 줄 아이콘으로 표시, 이름 아래 별도 표시 ✅
- 모바일(390px): 데모/코드 탭 클릭으로 전환 (code 필드 없는 탭은 세그먼티드 탭 미표시) ✅
- 모바일(390px): 하단 ☰ 클릭 → Bottom Sheet 올라옴 ✅
- 데스크탑(1280px): 탭 6개 + 좌우 코드 패널 유지, 기존 레이아웃 그대로 ✅
- 퀴즈 탭처럼 code 필드 없는 탭: 코드 패널 및 세그먼티드 탭 미렌더링 ✅
- 빌드 에러 0건 ✅

---

## 컨텍스트 판단

- 수정 파일 2개 (각 ~58줄, ~148줄) → **1세션 완료 가능**
- 세션 분리 불필요
- combined-stage-view.tsx 최종 예상 ~220줄 (300줄 기준 이내)
- main-layout.tsx 최종 예상 ~100줄 (기준 이내)
