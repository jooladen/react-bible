"use client"

// Design Ref: §4.2 — Topic-Tab 범용 렌더러
// 주제 탭 → 이론(child/dev 토글) + 데모(좌) + 코드(우) 한 화면
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useExplanationStore } from "@/stores/explanation-store"
import { CopyButton } from "@/components/ui/copy-button"
import type { TopicTab } from "@/types/combined-stage"

// Design Ref: §4.3 — useClient: true 시 "use client" 설명 주석 자동 삽입
const USE_CLIENT_HEADER = `// "use client"  // Next.js의 경우 주석을 제거하세요.

`

function buildSnippetText(snippet: string, useClient?: boolean): string {
  if (!useClient) return snippet
  return USE_CLIENT_HEADER + snippet
}

type CombinedStageViewProps = {
  tabs: TopicTab[]
}

export function CombinedStageView({ tabs }: CombinedStageViewProps) {
  const [activeTab, setActiveTab] = useState(tabs[0].id)
  const [activeCode, setActiveCode] = useState(0)
  const { mode } = useExplanationStore()

  const currentTab = tabs.find((t) => t.id === activeTab) ?? tabs[0]

  function handleTabChange(id: string) {
    setActiveTab(id)
    setActiveCode(0)
  }

  return (
    <div className="flex h-full flex-col">
      {/* 주제 탭 */}
      <div className="flex gap-1 border-b border-border bg-background px-4 pt-3">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-t-md px-4 py-2 text-sm font-medium transition-all",
                isActive
                  ? "border border-b-background border-border bg-background text-foreground -mb-px"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* 이론 영역 — deepdive면 flex-1 풀스크린, 아니면 border-b 고정 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`theory-${activeTab}-${mode}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.12 }}
          className={cn(
            "bg-background/50 px-6 py-4",
            currentTab.variant === "deepdive"
              ? "flex-1 overflow-auto"
              : "border-b border-border"
          )}
        >
          {mode === "child" ? currentTab.theory.child : currentTab.theory.dev}
        </motion.div>
      </AnimatePresence>

      {/* 데모 + 코드 영역 — deepdive면 렌더링 안 함 */}
      {currentTab.variant !== "deepdive" && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${activeTab}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="flex flex-1 flex-col overflow-auto md:flex-row"
          >
            {/* 라이브 데모 (좌 / 모바일 상) */}
            <div className="flex-1 overflow-auto border-b border-border p-6 md:border-b-0 md:border-r">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                라이브 데모
              </h4>
              {currentTab.demo}
            </div>

            {/* 코드 스니펫 (우 / 모바일 하) */}
            <div className="flex flex-1 flex-col p-6">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  코드 스니펫
                </h4>
                {/* 코드 mini-tab */}
                <div className="flex gap-1">
                  {currentTab.code?.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveCode(i)}
                      className={cn(
                        "rounded px-2.5 py-1 text-xs font-medium transition-all",
                        activeCode === i
                          ? "bg-indigo-500/20 text-indigo-300 light:bg-teal-100 light:text-teal-800"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 코드 블록 */}
              <div className="relative flex-1">
                <div className="absolute right-3 top-3 z-10">
                  <CopyButton
                    text={buildSnippetText(
                      currentTab.code?.[activeCode]?.snippet ?? "",
                      currentTab.code?.[activeCode]?.useClient
                    )}
                  />
                </div>
                <pre className="h-full overflow-auto rounded-lg bg-zinc-900 p-4 font-mono text-xs leading-relaxed text-zinc-100 whitespace-pre-wrap light:bg-zinc-50 light:text-zinc-800">
                  {buildSnippetText(
                    currentTab.code?.[activeCode]?.snippet ?? "",
                    currentTab.code?.[activeCode]?.useClient
                  )}
                </pre>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
