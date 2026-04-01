"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

const LAST_STAGE_KEY = "last-stage"

export function HomeRedirect() {
  const router = useRouter()

  useEffect(() => {
    const lastSlug = localStorage.getItem(LAST_STAGE_KEY)
    router.replace(lastSlug ? `/stage/${lastSlug}` : "/stage/immutability")
  }, [router])

  return null
}
