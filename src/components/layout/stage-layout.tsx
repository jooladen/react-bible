"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { DifficultyBadge } from "@/components/ui/badge"
import { useExplanationStore } from "@/stores/explanation-store"
import { useProgressStore } from "@/stores/progress-store"
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
  const { markDone, isCompleted } = useProgressStore()
  const router = useRouter()
  const done = isCompleted(stage.slug)

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
      <div className="border-b border-border bg-background px-6 py-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">
                {String(stage.id).padStart(2, "0")}
              </span>
              <DifficultyBadge difficulty={stage.difficulty} />
              <span className="text-xs text-muted-foreground">{stage.groupName}</span>
            </div>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-1.5">
              <h2 className="text-xl font-bold text-foreground">{stage.title}</h2>
              <span className="text-sm text-zinc-400">: {stage.concept}</span>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">{stage.subtitle}</p>
          </div>
        </div>

        {/* Stepper */}
        <div className="mt-4 flex items-center gap-0">
          {tabs.map((tab, i) => {
            const isActive = activeTab === tab.id
            const isPast = tabs.findIndex((t) => t.id === activeTab) > i
            return (
              <div key={tab.id} className="flex items-center">
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-indigo-500/20 text-indigo-300 light:bg-zinc-100 light:text-zinc-900"
                      : isPast
                        ? "text-muted-foreground hover:bg-accent hover:text-foreground"
                        : "text-muted-foreground/50 hover:bg-accent hover:text-muted-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                      isActive
                        ? "bg-indigo-500 light:bg-zinc-800 text-white"
                        : isPast
                          ? "bg-muted text-muted-foreground"
                          : "border border-border text-muted-foreground/50"
                    )}
                  >
                    {i + 1}
                  </span>
                  <span>{tab.label}</span>
                </button>
                {i < tabs.length - 1 && (
                  <div
                    className={cn(
                      "h-px w-6 shrink-0",
                      isPast ? "bg-muted-foreground/30" : "bg-border"
                    )}
                  />
                )}
              </div>
            )
          })}
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
                  <p className="mt-2 text-sm text-muted-foreground">
                    이 섹션은 다음 세션에서 구현됩니다
                  </p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    /pdca do {stage.slug}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 이전 / 다음 내비게이션 + 학습 완료 버튼 */}
      <div className="flex shrink-0 items-center justify-between border-t border-border bg-background px-6 py-3">
        {prevStage ? (
          <button
            onClick={() => router.push(`/stage/${prevStage.slug}`)}
            className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            title="← 이전 (ArrowLeft)"
          >
            <span>←</span>
            <span className="max-w-[120px] truncate">{prevStage.title}</span>
          </button>
        ) : (
          <div />
        )}

        {/* Plan SC: 학습 완료 버튼 — markDone → progress-store 저장 */}
        {done ? (
          <span className="flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-medium text-green-400">
            ✓ 완료됨
          </span>
        ) : (
          <button
            onClick={() => markDone(stage.slug)}
            className="flex items-center gap-1.5 rounded-md bg-indigo-500/20 px-4 py-1.5 text-sm font-medium text-indigo-300 transition-colors hover:bg-indigo-500/30"
          >
            ✅ 학습 완료
          </button>
        )}

        {nextStage ? (
          <button
            onClick={() => router.push(`/stage/${nextStage.slug}`)}
            className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            title="다음 → (ArrowRight)"
          >
            <span className="max-w-[120px] truncate">{nextStage.title}</span>
            <span>→</span>
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}
