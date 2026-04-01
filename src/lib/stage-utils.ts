import type { StageStatus } from "@/types/stage"

// Design Ref: §3.2 — progress-store(동적)와 stages.ts(정적) 두 소스를 머지
export function resolveStageCompletion(
  slug: string,
  completedSlugs: string[],
  staticStatus: StageStatus
): boolean {
  return completedSlugs.includes(slug) || staticStatus === "done"
}
