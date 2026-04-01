"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useExplanationStore } from "@/stores/explanation-store"

const HINT_KEY = "mode-hint-seen"

export function ExplanationToggle() {
  const { mode, toggle } = useExplanationStore()
  const isDev = mode === "dev"
  const [hintSeen, setHintSeen] = useState(true)
  const [tooltipVisible, setTooltipVisible] = useState(false)

  useEffect(() => {
    setHintSeen(!!localStorage.getItem(HINT_KEY))
  }, [])

  function handleHintEnter() {
    setTooltipVisible(true)
    if (!hintSeen) {
      setHintSeen(true)
      localStorage.setItem(HINT_KEY, "1")
    }
  }

  return (
    <div className="flex items-center gap-2 select-none">
      <span
        className={`hidden sm:inline text-xs font-medium transition-colors ${
          !isDev ? "text-green-400" : "text-zinc-500"
        }`}
      >
        🟢 초딩모드
      </span>

      <button
        onClick={toggle}
        className="relative h-6 w-11 rounded-full bg-zinc-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
        aria-label={`설명 모드: ${isDev ? "개발자" : "초딩"}`}
        role="switch"
        aria-checked={isDev}
      >
        <motion.span
          className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md"
          animate={{ left: isDev ? "1.375rem" : "0.125rem" }}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />
      </button>

      <span
        className={`hidden sm:inline text-xs font-medium transition-colors ${
          isDev ? "text-indigo-400" : "text-zinc-500"
        }`}
      >
        🔵 개발자모드
      </span>

      {/* 힌트 아이콘 */}
      <div
        className="relative"
        onMouseEnter={handleHintEnter}
        onMouseLeave={() => setTooltipVisible(false)}
      >
        {/* pulse 링 — 첫 방문자만 */}
        {!hintSeen && (
          <span className="absolute inset-0 rounded-full animate-ping bg-zinc-500 opacity-40" />
        )}

        <button className="relative flex h-5 w-5 items-center justify-center rounded-full border border-zinc-600 bg-zinc-800 text-[10px] font-bold text-zinc-400 transition-colors hover:border-zinc-400 hover:text-zinc-200">
          ?
        </button>

        {/* Tooltip */}
        {tooltipVisible && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-7 z-50 w-64 rounded-lg border border-zinc-700 bg-zinc-900 p-3 shadow-xl"
          >
            <p className="mb-2 text-[11px] font-semibold tracking-wide text-zinc-300">
              같은 개념, 두 개의 렌즈
            </p>
            <div className="space-y-2">
              <div>
                <p className="text-[11px] font-medium text-green-400">🟢 초딩모드</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-400">
                  어려운 내용도 비유와 이야기로 —<br />
                  &lsquo;왜 이렇게 됐지?&rsquo;부터 시작합니다
                </p>
              </div>
              <div className="border-t border-zinc-800 pt-2">
                <p className="text-[11px] font-medium text-indigo-400">🔵 개발자모드</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-400">
                  코드와 원리 중심 —<br />
                  &lsquo;어떻게 동작하는지&rsquo; 끝까지 파고듭니다
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
