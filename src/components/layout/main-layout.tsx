"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "./sidebar"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // 데스크톱(md 이상)에서는 기본으로 열기
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)")
    setSidebarOpen(mq.matches)
    const handler = (e: MediaQueryListEvent) => setSidebarOpen(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* 모바일 backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 사이드바 — 모바일: fixed overlay, 데스크톱: static */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 transition-transform duration-200
          md:static md:z-auto md:transition-none
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:hidden"}
        `}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <main className="flex-1 overflow-auto bg-card">{children}</main>

      {/* 사이드바 토글 버튼 — 항상 표시, 사이드바 열림 여부에 따라 위치 변경 */}
      <button
        onClick={() => setSidebarOpen((v) => !v)}
        className={`
          fixed top-12 z-50 rounded-r-md border border-l-0 border-border bg-card
          min-w-[20px] px-2 py-3 text-muted-foreground transition-all duration-200
          hover:bg-accent hover:text-foreground
          ${sidebarOpen ? "left-72" : "left-0"}
        `}
        title={sidebarOpen ? "사이드바 닫기" : "사이드바 열기"}
      >
        <span className="text-sm leading-none">{sidebarOpen ? "‹" : "›"}</span>
      </button>
    </div>
  )
}
