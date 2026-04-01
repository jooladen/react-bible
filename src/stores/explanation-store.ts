"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ExplanationMode } from "@/types/stage"

type ExplanationStore = {
  mode: ExplanationMode
  setMode: (mode: ExplanationMode) => void
  toggle: () => void
}

export const useExplanationStore = create<ExplanationStore>()(
  persist(
    (set, get) => ({
      mode: "child",
      setMode: (mode) => set({ mode }),
      toggle: () => set({ mode: get().mode === "child" ? "dev" : "child" }),
    }),
    { name: "react-bible-explanation-mode" }
  )
)
