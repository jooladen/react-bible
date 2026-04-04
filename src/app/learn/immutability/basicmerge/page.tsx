"use client"

import { useState } from "react"

function BadCounter() {
  let count = 0  // ❌ 일반 변수 — 렌더마다 0으로 초기화
  return (
    <div>
      <p>카운트: {count}</p>
      <button onClick={() => { count++ }}>
        +1 (화면 안 바뀜)
      </button>
    </div>
  )
}

function GoodCounter() {
  const [count, setCount] = useState(0)  // ✅ React가 추적
  return (
    <div>
      <p>카운트: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  )
}

export default function BasicMergePage() {
  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <div style={{border: "1px solid #ccc", padding: "1rem", borderRadius: "0.5rem" }}>
        <h3>❌ 일반 변수</h3>
        <BadCounter />
      </div>
      <div style={{border: "1px solid #ccc", padding: "1rem", borderRadius: "0.5rem" }}>
        <h3>✅ useState</h3>
        <GoodCounter />
      </div>
    </div>
  )
}
