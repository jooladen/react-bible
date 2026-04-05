"use client"
// Design Ref: §2.1 — 모바일 전용 아이콘 탭 바 (19개 스테이지 공통 재사용)

import { cn } from "@/lib/utils"
import type { TopicTab } from "@/types/combined-stage"

type MobileTabBarProps = {
  tabs: TopicTab[]
  activeTab: string
  onTabChange: (id: string) => void
}

export function MobileTabBar({ tabs, activeTab, onTabChange }: MobileTabBarProps) {
  const currentTab = tabs.find((t) => t.id === activeTab) ?? tabs[0]

  return (
    <div className="border-b border-border bg-background md:hidden">
      {/* 아이콘 탭 바 */}
      <div className="flex justify-around px-2 pt-2">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-md px-3 py-1.5 transition-all",
                isActive
                  ? "text-indigo-400 light:text-teal-600"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="text-xl leading-none">{tab.icon ?? "📄"}</span>
              {/* 활성 탭 인디케이터 점 */}
              <span
                className={cn(
                  "h-1 w-1 rounded-full",
                  isActive ? "bg-indigo-400 light:bg-teal-600" : "bg-transparent"
                )}
              />
            </button>
          )
        })}
      </div>
      {/* 선택된 탭 이름 */}
      <div className="px-4 pb-2 text-center text-xs font-medium text-indigo-400 light:text-teal-600">
        {currentTab.label}
      </div>
    </div>
  )
}
