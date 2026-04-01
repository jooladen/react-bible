export type Difficulty = "easy" | "medium" | "hard"
export type StageStatus = "done" | "wip" | "todo"
export type StageGroup = 1 | 2 | 3 | 4
export type ExplanationMode = "child" | "dev"

export type Stage = {
  id: number
  slug: string
  title: string
  subtitle: string
  concept: string
  difficulty: Difficulty
  group: StageGroup
  groupName: string
  status: StageStatus
}

export type StageGroupMeta = {
  id: StageGroup
  name: string
  subtitle: string
}
