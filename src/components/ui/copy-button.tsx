"use client"

// Design Ref: §4.1 — 클립보드 복사 버튼, 2초 체크마크 피드백
import { useState } from "react"
import { cn } from "@/lib/utils"

type CopyButtonProps = {
  text: string
  className?: string
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard API 미지원 환경 — 조용히 무시
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "rounded px-2 py-1 text-xs font-medium transition-all",
        copied
          ? "bg-green-500/20 text-green-400 light:bg-green-100 light:text-green-700"
          : "bg-zinc-700/50 text-zinc-400 hover:bg-zinc-600/50 hover:text-zinc-200 light:bg-zinc-100 light:text-zinc-600 light:hover:bg-zinc-200",
        className
      )}
      title="코드 복사"
    >
      {copied ? "✓ 복사됨" : "복사"}
    </button>
  )
}
