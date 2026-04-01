"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

// Design Ref: §3.1 — JSON 직렬화를 위해 Set 대신 string[] 사용
type ProgressStore = {
  completedSlugs: string[]
  markDone: (slug: string) => void
  isCompleted: (slug: string) => boolean
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      completedSlugs: [],
      markDone: (slug) => {
        const current = get().completedSlugs
        if (!current.includes(slug)) {
          set({ completedSlugs: [...current, slug] })
        }
      },
      isCompleted: (slug) => get().completedSlugs.includes(slug),
    }),
    { name: "react-bible-progress" }
  )
)
