"use client"

// Design Ref: §3.2 — explanation-store와 동일한 Zustand v5 + persist 패턴
import { create } from "zustand"
import { persist } from "zustand/middleware"

type ThemeStore = {
  theme: "dark" | "light"
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "dark",
      toggleTheme: () =>
        set({ theme: get().theme === "dark" ? "light" : "dark" }),
    }),
    { name: "react-bible-theme", skipHydration: true }
  )
)
