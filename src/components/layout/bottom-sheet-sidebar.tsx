"use client"
// Design Ref: §2.2 — 모바일 전용 Bottom Sheet (19개 스테이지 공통 재사용)

import { cn } from "@/lib/utils"

type BottomSheetSidebarProps = {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

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
      {/* Bottom Sheet — transform은 inline style로 처리 (Tailwind v4 동적 클래스 미생성 방지) */}
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
