import { cn } from "@/lib/utils"
import type { Difficulty } from "@/types/stage"

const difficultyConfig: Record<
  Difficulty,
  { label: string; className: string }
> = {
  easy: {
    label: "🟢 쉬움",
    className:
      "bg-green-950/60 text-green-300 border border-green-800/50 light:bg-green-50 light:text-green-700 light:border-green-200",
  },
  medium: {
    label: "🟡 보통",
    className:
      "bg-yellow-950/60 text-yellow-300 border border-yellow-800/50 light:bg-yellow-50 light:text-yellow-700 light:border-yellow-200",
  },
  hard: {
    label: "🔴 어려움",
    className: "bg-red-950/60 text-red-300 border border-red-800/50 light:bg-red-50 light:text-red-700 light:border-red-200",
  },
}

type BadgeProps = {
  difficulty: Difficulty
  className?: string
}

export function DifficultyBadge({ difficulty, className }: BadgeProps) {
  const config = difficultyConfig[difficulty]
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}

type StatusBadgeProps = {
  status: "done" | "wip" | "todo"
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = {
    done: { label: "✅ 완료", className: "text-green-400" },
    wip: { label: "🔄 진행중", className: "text-yellow-400" },
    todo: { label: "○", className: "text-zinc-600" },
  }[status]

  return (
    <span className={cn("text-xs", config.className, className)}>
      {config.label}
    </span>
  )
}
