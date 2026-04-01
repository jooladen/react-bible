"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { DifficultyBadge } from "@/components/ui/badge"
import { useExplanationStore } from "@/stores/explanation-store"
import { STAGES } from "@/lib/stages"
import type { Stage } from "@/types/stage"

const LAST_STAGE_KEY = "last-stage"

type Tab = "theory" | "playground" | "code"

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "theory", label: "이론", icon: "📖" },
  { id: "playground", label: "실험실", icon: "⚗️" },
  { id: "code", label: "코드 뷰어", icon: "💻" },
]

type StageLayoutProps = {
  stage: Stage
  theory?: React.ReactNode
  playground?: React.ReactNode
  code?: React.ReactNode
}

export function StageLayout({
  stage,
  theory,
  playground,
  code,
}: StageLayoutProps) {
  const [activeTab, setActiveTab] = useState<Tab>("theory")
  const { mode } = useExplanationStore()
  const router = useRouter()

  const currentIndex = STAGES.findIndex((s) => s.id === stage.id)
  const prevStage = currentIndex > 0 ? STAGES[currentIndex - 1] : null
  const nextStage = currentIndex < STAGES.length - 1 ? STAGES[currentIndex + 1] : null

  // 마지막 방문 stage 저장
  useEffect(() => {
    localStorage.setItem(LAST_STAGE_KEY, stage.slug)
  }, [stage.slug])

  // 키보드 화살표 이동
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return
      if (e.key === "ArrowLeft" && prevStage) router.push(`/stage/${prevStage.slug}`)
      if (e.key === "ArrowRight" && nextStage) router.push(`/stage/${nextStage.slug}`)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [prevStage, nextStage, router])

  const contentMap: Record<Tab, React.ReactNode> = {
    theory,
    playground,
    code,
  }

  return (
    <div className="flex h-full flex-col">
      {/* Stage header */}
      <div className="border-b border-zinc-800 bg-zinc-950/50 px-6 py-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-zinc-500">
                {String(stage.id).padStart(2, "0")}
              </span>
              <DifficultyBadge difficulty={stage.difficulty} />
              <span className="text-xs text-zinc-500">{stage.groupName}</span>
            </div>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-1.5">
              <h2 className="text-xl font-bold text-white">{stage.title}</h2>
              <span className="text-sm text-zinc-400">: {stage.concept}</span>
            </div>
            <p className="mt-0.5 text-sm text-zinc-500">{stage.subtitle}</p>
          </div>
        </div>

        {/* Tab bar */}
        <div className="mt-4 flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-indigo-500/20 text-indigo-300"
                  : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
              )}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="h-full"
          >
            {contentMap[activeTab] ?? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl">🚧</p>
                  <p className="mt-2 text-sm text-zinc-500">
                    이 섹션은 다음 세션에서 구현됩니다
                  </p>
                  <p className="mt-1 font-mono text-xs text-zinc-600">
                    /pdca do {stage.slug}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 이전 / 다음 내비게이션 */}
      <div className="flex shrink-0 items-center justify-between border-t border-zinc-800 bg-zinc-950/50 px-6 py-3">
        {prevStage ? (
          <button
            onClick={() => router.push(`/stage/${prevStage.slug}`)}
            className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
            title="← 이전 (ArrowLeft)"
          >
            <span>←</span>
            <span className="max-w-[160px] truncate">{prevStage.title}</span>
          </button>
        ) : (
          <div />
        )}

        <span className="font-mono text-xs text-zinc-600">
          {stage.id} / {STAGES.length}
        </span>

        {nextStage ? (
          <button
            onClick={() => router.push(`/stage/${nextStage.slug}`)}
            className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
            title="다음 → (ArrowRight)"
          >
            <span className="max-w-[160px] truncate">{nextStage.title}</span>
            <span>→</span>
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}
