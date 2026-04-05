# Design: mobile-ux

> Feature: 모바일 UX 개선 — 탭 아이콘화 + Bottom Sheet + 데모/코드 탭 전환
> Architecture: Option B — Clean (재사용 가능한 모바일 컴포넌트 분리)
> Created: 2026-04-06
> Phase: Design

---

## Context Anchor

| | |
|--|--|
| **WHY** | 모바일 화면에서 탭 줄바꿈·잘림으로 콘텐츠 자체에 접근하기 어려움 |
| **WHO** | 이동 중 학습하는 사용자, 폰으로 react-bible 확인하는 개발자 |
| **RISK** | 데스크탑 레이아웃 깨짐 금지 — 모바일 전용 처리(md: breakpoint)로 격리 |
| **SUCCESS** | 모바일에서 탭 6개가 한 줄에 표시, 스크롤 없이 데모 또는 코드 확인 가능 |
| **SCOPE** | MobileTabBar(신규) + BottomSheetSidebar(신규) + combined-stage-view(수정) + main-layout(수정) |

---

## 1. 아키텍처 결정 근거

**Option B 선택 이유**: 19개 스테이지 전체에 동일한 모바일 UX가 적용됨.
`MobileTabBar`와 `BottomSheetSidebar`를 재사용 가능한 컴포넌트로 분리하면
Stage 02~20은 추가 작업 없이 자동 적용됨.

```
[신규]
src/components/layout/mobile-tab-bar.tsx        ← 모바일 전용 탭 바
src/components/layout/bottom-sheet-sidebar.tsx  ← 모바일 Bottom Sheet 래퍼

[수정]
src/components/layout/combined-stage-view.tsx   ← MobileTabBar 주입 + 데모/코드 탭
src/components/layout/main-layout.tsx           ← BottomSheetSidebar 주입 + 하단 버튼
```

---

## 2. 컴포넌트 설계

### 2.1 MobileTabBar (신규)

**파일**: `src/components/layout/mobile-tab-bar.tsx`

**역할**: 모바일 전용 아이콘 탭 바. 데스크탑에서는 `md:hidden`으로 숨김.

**Props**:
```typescript
type MobileTabBarProps = {
  tabs: TopicTab[]
  activeTab: string
  onTabChange: (id: string) => void
}
```

**UI 구조**:
```
[ 🔢 | 📦 | ✨ | 🌊 | 😂 | 🧪 ]   ← 아이콘만 (justify-around)
  ────── 일반 변수 ──────────────   ← 선택된 탭 이름 (활성 탭 color)
```

**구현 스펙**:
```tsx
"use client"
// Design Ref: §2.1 — 모바일 전용 아이콘 탭 바 (19개 스테이지 공통 재사용)
import { cn } from "@/lib/utils"
import type { TopicTab } from "@/types/combined-stage"

export function MobileTabBar({ tabs, activeTab, onTabChange }: MobileTabBarProps) {
  const currentTab = tabs.find(t => t.id === activeTab) ?? tabs[0]

  return (
    <div className="md:hidden border-b border-border bg-background">
      {/* 아이콘 탭 바 */}
      <div className="flex justify-around px-2 pt-2">
        {tabs.map(tab => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-md transition-all",
                isActive
                  ? "text-indigo-400 light:text-teal-600"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="text-xl leading-none">{tab.icon ?? "📄"}</span>
              {/* 활성 탭 인디케이터 점 */}
              <span className={cn(
                "h-1 w-1 rounded-full",
                isActive ? "bg-indigo-400 light:bg-teal-600" : "bg-transparent"
              )} />
            </button>
          )
        })}
      </div>
      {/* 선택된 탭 이름 */}
      <div className="px-4 pb-2 text-center text-xs font-medium text-indigo-400 light:text-teal-600">
        {currentTab.label}
      </div>
    </div>
  )
}
```

---

### 2.2 BottomSheetSidebar (신규)

**파일**: `src/components/layout/bottom-sheet-sidebar.tsx`

**역할**: 모바일 전용 하단 슬라이드 시트. 데스크탑에서는 `md:hidden`.

**Props**:
```typescript
type BottomSheetSidebarProps = {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}
```

**UI 구조**:
```
┌─── 핸들 바 ───────────────────┐  ← rounded-t-2xl
│  ─────                        │  ← drag handle indicator
│  [사이드바 콘텐츠]              │
│                               │
└───────────────────────────────┘
  max-h: 70vh, overflow-y: auto
```

**구현 스펙**:
```tsx
"use client"
// Design Ref: §2.2 — 모바일 전용 Bottom Sheet (19개 스테이지 공통 재사용)
export function BottomSheetSidebar({ open, onClose, children }: BottomSheetSidebarProps) {
  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={onClose}
        />
      )}
      {/* Bottom Sheet — Tailwind v4 동적 클래스 미생성 방지: transform을 inline style로 처리 */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden rounded-t-2xl border-t border-border bg-card transition-transform duration-300"
        style={{ maxHeight: "70vh", transform: open ? "translateY(0)" : "translateY(110vh)" }}
      >
        {/* 핸들 바 */}
        <div className="flex justify-center py-3">
          <div className="h-1 w-10 rounded-full bg-zinc-600 light:bg-zinc-300" />
        </div>
        {/* 콘텐츠 */}
        <div className="overflow-y-auto" style={{ maxHeight: "calc(70vh - 40px)" }}>
          {children}
        </div>
      </div>
    </>
  )
}
```

---

### 2.3 combined-stage-view.tsx 수정

**추가 state**:
```typescript
const [mobileSection, setMobileSection] = useState<"demo" | "code">("demo")
const [isDesktop, setIsDesktop] = useState(true)  // Tailwind v4 hidden/md:X 충돌 방지

useEffect(() => {
  const mq = window.matchMedia("(min-width: 768px)")
  setIsDesktop(mq.matches)
  const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
  mq.addEventListener("change", handler)
  return () => mq.removeEventListener("change", handler)
}, [])
```

**구조 변경**:
```
[데스크탑 탭 바]  {isDesktop && <div>}  ← JS 조건부 렌더링 (Tailwind v4 hidden/md:flex 충돌 방지)
[MobileTabBar]   md:hidden             ← 모바일에서만 표시

[이론 영역]       변경 없음

[모바일 데모/코드 세그먼티드 탭]  md:hidden (code 필드 없는 탭은 미렌더링)
  [ 라이브 데모 ● | 코드 스니펫 ]

[데모 div]  !isDesktop && code존재 && mobileSection !== "demo" → "hidden" 추가
[코드 div]  code 필드 있는 탭만 렌더링
            !isDesktop && mobileSection !== "code" → "hidden" 추가

> Tailwind v4 주의: "hidden md:block" / "hidden md:flex" 패턴 불가
> base 유틸리티(.hidden)가 responsive 변형(md:block) 이후 생성되어 specificity 충돌
> 모든 반응형 display 분기는 isDesktop JS 상태로 처리
```

**데모/코드 세그먼티드 탭 UI**:
```
┌──────────────────────────────┐
│  [ 라이브 데모 ● | 코드 스니펫 ]│
└──────────────────────────────┘
className: flex border-b border-border bg-background md:hidden
```

**탭 변경 시 mobileSection 리셋**:
```typescript
function handleTabChange(id: string) {
  setActiveTab(id)
  setActiveCode(0)
  setMobileSection("demo")  // 탭 전환 시 데모로 리셋
}
```

---

### 2.4 main-layout.tsx 수정

**구조 변경**:
```
[기존]
  fixed 사이드바 토글 버튼 (always visible)
  사이드바 오버레이

[변경 후]
  모바일:
    <main className="pb-16 md:pb-0">...</main>
    <BottomSheetSidebar open={...} onClose={...}>
      <Sidebar />
    </BottomSheetSidebar>
    <button className="fixed bottom-0 ... md:hidden">☰ 스테이지 목록 ↑</button>

  데스크탑(md+):
    기존 사이드바 + 토글 버튼 (hidden → block on md)
```

**하단 고정 버튼**:
```tsx
{/* Tailwind fixed bottom-0 레이아웃 충돌 방지: inline style로 position 명시 */}
<button
  onClick={() => setSidebarOpen(v => !v)}
  style={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
  className="z-30 border-t border-border bg-card py-3 text-sm font-medium
             text-muted-foreground hover:bg-accent hover:text-foreground md:hidden"
>
  ☰ 스테이지 목록 {sidebarOpen ? "↓" : "↑"}
</button>
```

**데스크탑 토글 버튼**: `{isDesktop && <button>}` JS 조건부 렌더링 (Tailwind v4 `hidden md:block` 불가)

---

## 3. 반응형 분기 전략

| 요소 | 모바일 (< md) | 데스크탑 (md+) |
|------|--------------|---------------|
| 탭 바 | MobileTabBar (아이콘+이름) | 기존 탭 바 (아이콘+레이블) |
| 사이드바 | BottomSheetSidebar | 기존 left overlay |
| 사이드바 토글 | 하단 고정 버튼 | 기존 fixed left 버튼 |
| 데모/코드 | 세그먼티드 탭 전환 | 좌우 분할 |
| 메인 콘텐츠 패딩 | pb-16 | pb-0 |

---

## 4. 데이터 플로우

```
combined-stage-view.tsx
  ├── activeTab (string)         → MobileTabBar props
  ├── mobileSection ("demo"|"code") → 데모/코드 div 표시 조건
  └── handleTabChange()          → MobileTabBar.onTabChange

main-layout.tsx
  ├── sidebarOpen (boolean)      → BottomSheetSidebar props
  └── setSidebarOpen()           → 하단 버튼 onClick
```

---

## 5. 파일별 변경 상세

| 파일 | 변경 유형 | 변경량 |
|------|-----------|--------|
| `src/components/layout/mobile-tab-bar.tsx` | 신규 | ~45줄 |
| `src/components/layout/bottom-sheet-sidebar.tsx` | 신규 | ~40줄 |
| `src/components/layout/combined-stage-view.tsx` | 수정 | +~30줄 |
| `src/components/layout/main-layout.tsx` | 수정 | +~25줄 |

**총 영향: 4파일, 신규 ~85줄, 추가 ~55줄**

---

## 6. 성공 기준

| 기준 | 검증 방법 | 결과 |
|------|----------|------|
| 모바일 탭 6개 한 줄 표시 | Chrome DevTools 390px | ✅ |
| 선택된 탭 이름 탭 바 아래 표시 | 각 탭 클릭 확인 | ✅ |
| 데모/코드 탭 전환 | 세그먼티드 탭 클릭 | ✅ |
| code 없는 탭(퀴즈 등): 세그먼티드 탭·코드 패널 미표시 | 퀴즈 탭 진입 확인 | ✅ |
| deepdive 탭(더깊이·더웃긴이야기): 풀스크린 이론, 데모/코드 없음 | 탭 클릭 확인 | ✅ |
| Bottom Sheet 슬라이드 | ☰ 클릭 → 올라옴, backdrop 클릭 → 닫힘 | ✅ |
| 데스크탑 기존 레이아웃 유지 | 1280px 브라우저 확인 | ✅ |
| 빌드 에러 0건 | `pnpm build` | ✅ |

---

## 7. 구현 가이드

### Module Map

| Module | 파일 | 작업 |
|--------|------|------|
| M1 | `mobile-tab-bar.tsx` 신규 | MobileTabBar 컴포넌트 |
| M2 | `bottom-sheet-sidebar.tsx` 신규 | BottomSheetSidebar 컴포넌트 |
| M3 | `combined-stage-view.tsx` | M1 import + mobileSection 상태 + 탭 분기 |
| M4 | `main-layout.tsx` | M2 import + 하단 버튼 + 데스크탑 버튼 격리 |

### 권장 구현 순서

```
M1 → M2 → M3 → M4 → 빌드 검증
```

M1, M2는 독립적으로 병렬 작성 가능.
M3는 M1 완료 후, M4는 M2 완료 후 진행.
