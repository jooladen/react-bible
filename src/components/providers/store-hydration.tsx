"use client"

import { useEffect } from "react"
import { useProgressStore } from "@/stores/progress-store"
import { useExplanationStore } from "@/stores/explanation-store"
import { useThemeStore } from "@/stores/theme-store"

export function StoreHydration() {
  useEffect(() => {
    useProgressStore.persist.rehydrate()
    useExplanationStore.persist.rehydrate()
    useThemeStore.persist.rehydrate()
  }, [])

  return null
}
