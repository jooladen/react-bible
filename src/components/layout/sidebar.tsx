"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { DifficultyBadge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { STAGES, STAGE_GROUPS } from "@/lib/stages"
import { useProgressStore } from "@/stores/progress-store"
import { resolveStageCompletion } from "@/lib/stage-utils"
import type { Stage } from "@/types/stage"

function StageItem({
  stage,
  isActive,
  isDone,
  onClose,
}: {
  stage: Stage
  isActive: boolean
  isDone: boolean
  onClose?: () => void
}) {
  return (
    <Link
      href={`/stage/${stage.slug}`}
      onClick={onClose}
      className={cn(
        "group flex items-start gap-2 rounded-md px-3 py-2 text-sm transition-all",
        isActive
          ? "bg-indigo-500/15 text-indigo-300 light:bg-teal-50 light:text-teal-900 border-l-2 border-indigo-500 light:border-teal-500"
          : "text-zinc-400 hover:bg-accent/60 hover:text-foreground light:text-zinc-500 light:hover:text-zinc-900 border-l-2 border-transparent"
      )}
    >
      <span
        className={cn(
          "mt-0.5 shrink-0 font-mono text-xs font-semibold w-5 text-right",
          isActive ? "text-indigo-400 light:text-teal-600" : "text-muted-foreground group-hover:text-muted-foreground"
        )}
      >
        {String(stage.id).padStart(2, "0")}
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate font-medium leading-tight">{stage.title}</div>
        <div className="mt-0.5 flex items-center gap-1.5">
          <DifficultyBadge difficulty={stage.difficulty} />
          {isDone && (
            <span className="text-[10px] text-green-400">✓</span>
          )}
        </div>
      </div>
    </Link>
  )
}

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const activeSlug = pathname.split("/stage/")[1] ?? ""
  const { completedSlugs } = useProgressStore()

  const completedCount = STAGES.filter((s) =>
    resolveStageCompletion(s.slug, completedSlugs, s.status)
  ).length

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-border bg-background">
      {/* Header */}
      <div className="border-b border-border px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧬</span>
            <div>
              <h1 className="font-mono text-sm font-bold text-foreground">
                React Bible
              </h1>
              <p className="font-mono text-[10px] text-muted-foreground">
                20 Core Concepts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="border-b border-border px-4 py-3">
        <Progress
          value={(completedCount / STAGES.length) * 100}
          className="h-1.5"
        />
        <p className="mt-1.5 font-mono text-[10px] text-muted-foreground">
          {completedCount} / {STAGES.length} 완료
        </p>
      </div>

      {/* Stage list */}
      <nav className="flex-1 overflow-y-auto py-2">
        {STAGE_GROUPS.map((group) => {
          const stages = STAGES.filter((s) => s.group === group.id)
          const doneCount = stages.filter((s) =>
            resolveStageCompletion(s.slug, completedSlugs, s.status)
          ).length

          return (
            <div key={group.id} className="mb-1">
              {/* Group header */}
              <div className="flex items-center justify-between px-4 pb-1 pt-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Phase {group.id}
                  </p>
                  <p className="text-xs font-medium text-zinc-400">
                    {group.name} - {group.subtitle}
                  </p>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {doneCount}/{stages.length}
                </span>
              </div>

              {/* Stages */}
              <div className="px-2">
                {stages.map((stage) => (
                  <StageItem
                    key={stage.id}
                    stage={stage}
                    isActive={activeSlug === stage.slug}
                    isDone={resolveStageCompletion(stage.slug, completedSlugs, stage.status)}
                    onClose={onClose}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-4 py-3">
        <p className="font-mono text-[10px] text-muted-foreground">
          {completedCount} / {STAGES.length} completed
        </p>
      </div>
    </aside>
  )
}
