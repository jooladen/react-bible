"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Sidebar } from "./sidebar"
import { BottomSheetSidebar } from "./bottom-sheet-sidebar"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  // isDesktop: Tailwind hidden/md:block 충돌 대신 조건부 렌더링으로 데스크탑 사이드바 제어
  const [isDesktop, setIsDesktop] = useState(false)

  // 데스크탑(md 이상)에서는 기본으로 열기
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)")
    setIsDesktop(mq.matches)
    setSidebarOpen(mq.matches)
    const handler = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches)
      setSidebarOpen(e.matches)
    }
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* 데스크탑 사이드바 — 조건부 렌더링 (Tailwind hidden/md:block 충돌 방지) */}
      {/* Design Ref: §2.4 — 모바일/데스크탑 사이드바 분기 */}
      {isDesktop && sidebarOpen && (
        <Sidebar onClose={() => setSidebarOpen(false)} />
      )}

      {/* 메인 콘텐츠 — 모바일에서 하단 버튼 여백 확보 */}
      <main className="flex-1 overflow-auto bg-card pb-40 md:pb-0">{children}</main>

      {/* 모바일 Bottom Sheet 사이드바 — Design Ref: §2.2 */}
      <BottomSheetSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </BottomSheetSidebar>

      {/* 모바일 하단 고정 버튼 — inline style로 위치 명시 (flex 컨텍스트 bottom-0 오작동 방지) */}
      <button
        onClick={() => setSidebarOpen((v) => !v)}
        style={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        className="z-30 border-t border-border bg-card py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground md:hidden"
      >
        ☰ 스테이지 목록 {sidebarOpen ? "↓" : "↑"}
      </button>

      {/* 데스크탑 사이드바 토글 버튼 — 조건부 렌더링으로 모바일 숨김 처리 */}
      {isDesktop && (
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className={cn(
            "fixed top-12 z-50 rounded-r-md border border-l-0 border-border bg-card",
            "min-w-[20px] px-2 py-3 text-muted-foreground transition-all duration-200",
            "hover:bg-accent hover:text-foreground",
            sidebarOpen ? "left-72" : "left-0"
          )}
          title={sidebarOpen ? "사이드바 닫기" : "사이드바 열기"}
        >
          <span className="text-sm leading-none">{sidebarOpen ? "‹" : "›"}</span>
        </button>
      )}
    </div>
  )
}
