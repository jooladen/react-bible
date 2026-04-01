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
          fixed inset-y-0 left-0 z-40 md:static md:z-auto md:translate-x-0
          transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <main className="flex-1 overflow-auto bg-zinc-900">{children}</main>

      {/* 사이드바 열기 토글 버튼 (사이드바 닫혔을 때만) */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed left-0 top-12 z-50 rounded-br-md border-b border-r border-zinc-700 bg-zinc-900 px-1.5 py-1 text-zinc-500 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          title="사이드바 열기"
        >
          <span className="text-xs">›</span>
        </button>
      )}
    </div>
  )
}
