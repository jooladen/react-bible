// Design Ref: §3.1 — TopicTab, CodeSnippet 타입 (combined-stage-view 전용)
import type { ReactNode } from "react"

export type CodeSnippet = {
  label: string       // 탭 레이블 — "❌ 직접 변이", "✅ spread"
  snippet: string     // VSCode 복붙 즉시 실행 가능한 완성형 코드 문자열
  useClient?: boolean // true → 코드 상단에 "use client" 설명 주석 자동 포함
}

export type TopicTab = {
  id: string
  label: string       // 탭 레이블 — "일반 변수", "배열/객체", "Immer"
  icon?: string       // 선택적 이모지 아이콘
  theory: {
    child: ReactNode  // 🟢 초딩 모드 설명
    dev: ReactNode    // 🔵 개발자 모드 설명
  }
  demo: ReactNode     // 라이브 인터랙티브 데모 컴포넌트
  code: CodeSnippet[] // 1개 이상 (mini-tab으로 전환)
}
