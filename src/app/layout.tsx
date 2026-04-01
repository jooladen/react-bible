import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { MainLayout } from "@/components/layout/main-layout"
import { ExplanationToggle } from "@/components/layout/explanation-toggle"
import { DarkModeToggle } from "@/components/layout/dark-mode-toggle"
import { QueryProvider } from "@/components/providers/query-provider"
import { StoreHydration } from "@/components/providers/store-hydration"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "React Bible — 20 Core Concepts",
  description:
    "리액트 핵심 원리 20단계 심층 학습 실험실. 초딩부터 시니어까지.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex h-full flex-col bg-background text-foreground antialiased">
        <QueryProvider>
          <StoreHydration />
          {/* Top bar */}
          <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-background px-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">
                react-bible
              </span>
              <span className="hidden sm:inline text-muted-foreground/40">/</span>
              <span className="hidden sm:inline font-mono text-xs text-muted-foreground">v1.0.0</span>
            </div>
            <div className="flex items-center gap-3">
              <ExplanationToggle />
              <DarkModeToggle />
            </div>
          </header>

          {/* Main layout */}
          <MainLayout>{children}</MainLayout>
        </QueryProvider>
      </body>
    </html>
  )
}
