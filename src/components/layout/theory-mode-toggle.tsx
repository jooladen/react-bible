"use client"

// Design Ref: §2.1 — 이론탭 전용 compact 모드 토글 (hint 없음)
import { motion } from "framer-motion"
import { useExplanationStore } from "@/stores/explanation-store"

export function TheoryModeToggle() {
  const { mode, toggle } = useExplanationStore()
  const isDev = mode === "dev"

  return (
    <div className="flex items-center gap-3 px-6 py-2.5 select-none">
      <span
        className={`text-xs font-medium transition-colors ${
          !isDev ? "text-green-500 light:text-green-700" : "text-muted-foreground"
        }`}
      >
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

      <span
        className={`text-xs font-medium transition-colors ${
          isDev ? "text-indigo-400 light:text-indigo-600" : "text-muted-foreground"
        }`}
      >
        개발자 🔵
      </span>
    </div>
  )
}
