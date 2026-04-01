import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { MainLayout } from "@/components/layout/main-layout"
import { ExplanationToggle } from "@/components/layout/explanation-toggle"
import { QueryProvider } from "@/components/providers/query-provider"

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
    >
      <body className="flex h-full flex-col bg-zinc-950 text-zinc-100 antialiased">
        <QueryProvider>
          {/* Top bar */}
          <header className="flex h-12 shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-zinc-500">
                react-bible
              </span>
              <span className="text-zinc-700">/</span>
              <span className="font-mono text-xs text-zinc-400">v1.0.0</span>
            </div>
            <ExplanationToggle />
          </header>

          {/* Main layout */}
          <MainLayout>{children}</MainLayout>
        </QueryProvider>
      </body>
    </html>
  )
}
