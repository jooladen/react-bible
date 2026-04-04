"use client"  // Next.js의 경우 주석을 제거하세요.

import { useState } from "react"

export default function GoodCounter() {
  const [count, setCount] = useState(0)  // ✅ React가 추적
  return (
    <div>
      <p>카운트: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  )
}