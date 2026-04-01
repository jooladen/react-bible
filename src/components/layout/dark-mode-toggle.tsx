"use client"

// Design Ref: §4.1 — mounted 패턴으로 hydration mismatch 방지
// 서버/초기 클라이언트 렌더: 항상 Moon (dark default)
// hydration 완료 후: localStorage 값 반영
import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useThemeStore } from "@/stores/theme-store"

export function DarkModeToggle() {
  const { theme, toggleTheme } = useThemeStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Plan SC: 클릭 시 전체 테마 전환 + 새로고침 후 유지
  useEffect(() => {
    if (!mounted) return
    document.documentElement.classList.toggle("light", theme === "light")
  }, [theme, mounted])

  const isLight = mounted && theme === "light"

  return (
    <button
      onClick={toggleTheme}
      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      title={isLight ? "다크 모드로 전환" : "라이트 모드로 전환"}
      aria-label={isLight ? "다크 모드로 전환" : "라이트 모드로 전환"}
    >
      {isLight ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
