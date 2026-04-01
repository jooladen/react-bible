"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex flex-1 overflow-hidden">
      {sidebarOpen && <Sidebar />}

      <main className="flex-1 overflow-auto bg-zinc-900">{children}</main>

      {/* 토글 버튼 — topbar 바로 아래 고정 */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-0 top-12 z-50 rounded-br-md border-b border-r border-zinc-700 bg-zinc-900 px-1.5 py-1 text-zinc-500 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
        title={sidebarOpen ? "사이드바 닫기" : "사이드바 열기"}
      >
        <span className="text-xs">{sidebarOpen ? "‹" : "›"}</span>
      </button>
    </div>
  )
}
