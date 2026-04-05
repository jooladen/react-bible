"use client"

// Design Ref: §4.2 — Topic-Tab 범용 렌더러
// 주제 탭 → 이론(child/dev 토글) + 데모(좌) + 코드(우) 한 화면
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useExplanationStore } from "@/stores/explanation-store"
import { CopyButton } from "@/components/ui/copy-button"
import { MobileTabBar } from "./mobile-tab-bar"
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
  // Design Ref: §2.3 — 모바일 데모/코드 전환 상태
  const [mobileSection, setMobileSection] = useState<"demo" | "code">("demo")
  // Tailwind v4 hidden/md:flex 충돌 방지 — JS로 데스크탑 탭바 표시 제어
  const [isDesktop, setIsDesktop] = useState(true)
  const { mode } = useExplanationStore()

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)")
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  const currentTab = tabs.find((t) => t.id === activeTab) ?? tabs[0]

  function handleTabChange(id: string) {
    setActiveTab(id)
    setActiveCode(0)
    setMobileSection("demo") // 탭 전환 시 데모로 리셋
  }

  return (
    <div className="flex h-full flex-col">
      {/* 데스크탑 주제 탭 — isDesktop 조건부 렌더링 (Tailwind v4 충돌 방지) */}
      {/* Design Ref: §2.1 — JS 상태로 모바일/데스크탑 분기 */}
      {isDesktop && <div className="flex gap-1 border-b border-border bg-background px-4 pt-3">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-t-md px-4 py-2 text-sm font-medium transition-all",
                isActive
                  ? "-mb-px border border-b-background border-border bg-background text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>}

      {/* 모바일 아이콘 탭 바 — Design Ref: §2.1 */}
      <MobileTabBar tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />

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
              : "max-h-[35vh] overflow-auto border-b border-border md:max-h-none"
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
            {/* 모바일 데모/코드 세그먼티드 탭 — code 없으면 숨김 */}
            {currentTab.code && currentTab.code.length > 0 && (
              <div className="flex border-b border-border bg-background md:hidden">
                <button
                  onClick={() => setMobileSection("demo")}
                  className={cn(
                    "flex-1 py-2.5 text-sm font-medium transition-colors",
                    mobileSection === "demo"
                      ? "border-b-2 border-indigo-400 text-indigo-400 light:border-teal-600 light:text-teal-600"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  라이브 데모 {mobileSection === "demo" && "●"}
                </button>
                <button
                  onClick={() => setMobileSection("code")}
                  className={cn(
                    "flex-1 py-2.5 text-sm font-medium transition-colors",
                    mobileSection === "code"
                      ? "border-b-2 border-indigo-400 text-indigo-400 light:border-teal-600 light:text-teal-600"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  코드 스니펫
                </button>
              </div>
            )}

            {/* 라이브 데모 (좌 / 모바일 상) */}
            <div
              className={cn(
                "flex-1 overflow-auto border-b border-border p-3 md:border-b-0 md:p-6",
                currentTab.code && currentTab.code.length > 0 && "md:border-r",
                !isDesktop && currentTab.code && currentTab.code.length > 0 && mobileSection !== "demo" && "hidden"
              )}
            >
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                라이브 데모
              </h4>
              {currentTab.demo}
            </div>

            {/* 코드 스니펫 (우 / 모바일 하) — code 없으면 렌더링 안 함 */}
            {currentTab.code && currentTab.code.length > 0 && (
              <div
                className={cn(
                  "flex flex-1 flex-col p-3 md:p-6",
                  !isDesktop && mobileSection !== "code" && "hidden"
                )}
              >
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    코드 스니펫
                  </h4>
                  {/* 코드 mini-tab */}
                  <div className="flex gap-1">
                    {currentTab.code.map((c, i) => (
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
                        currentTab.code[activeCode]?.snippet ?? "",
                        currentTab.code[activeCode]?.useClient
                      )}
                    />
                  </div>
                  <pre className="h-full overflow-auto rounded-lg bg-zinc-900 p-4 font-mono text-xs leading-relaxed text-zinc-100 whitespace-pre-wrap light:bg-zinc-50 light:text-zinc-800">
                    {buildSnippetText(
                      currentTab.code[activeCode]?.snippet ?? "",
                      currentTab.code[activeCode]?.useClient
                    )}
                  </pre>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
