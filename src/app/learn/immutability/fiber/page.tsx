"use client"

import { useState, useRef, useEffect } from "react"

// ─── 일반 변수 패널 ───────────────────────────────────────────
function BadCounterPanel() {
  let count = 0  // 렌더마다 0으로 초기화
  const renderCount = useRef(0)
  renderCount.current += 1

  return (
    <div style={{ border: "1px solid #f66", padding: "1.2rem", borderRadius: "0.5rem", minWidth: "260px" }}>
      <h3 style={{ marginBottom: "0.8rem" }}>❌ 일반 변수</h3>

      <pre style={{ background: "#1a1a1a", padding: "0.5rem", borderRadius: "4px", fontSize: "0.8rem", marginBottom: "1rem" }}>
        {`let count = 0  ← 매 렌더 초기화`}
      </pre>

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1rem" }}>
        <tbody>
          <tr>
            <td style={{ padding: "4px 8px", color: "#aaa" }}>현재 값</td>
            <td style={{ padding: "4px 8px", fontWeight: "bold" }}>{count}</td>
          </tr>
          <tr>
            <td style={{ padding: "4px 8px", color: "#aaa" }}>렌더 횟수</td>
            <td style={{ padding: "4px 8px" }} suppressHydrationWarning>{renderCount.current}</td>
          </tr>
          <tr>
            <td style={{ padding: "4px 8px", color: "#aaa" }}>저장 위치</td>
            <td style={{ padding: "4px 8px", color: "#f66" }}>함수 스택<br /><small>(렌더마다 사라짐)</small></td>
          </tr>
          <tr>
            <td style={{ padding: "4px 8px", color: "#aaa" }}>Fiber 추적</td>
            <td style={{ padding: "4px 8px", color: "#888" }}>없음</td>
          </tr>
        </tbody>
      </table>

      <button onClick={() => { count++ }}>
        +1 (화면 안 바뀜)
      </button>
    </div>
  )
}

// ─── useState 패널 ────────────────────────────────────────────
function GoodCounterPanel() {
  const [count, setCount] = useState(0)
  const renderCount = useRef(0)
  renderCount.current += 1

  const domRef = useRef<HTMLDivElement>(null)
  const [fiberState, setFiberState] = useState<string>("읽는 중...")

  // Fiber에서 memoizedState 읽기 — DOM ref에서 return 체인 타고 컴포넌트 fiber 탐색
  useEffect(() => {
    if (!domRef.current) return
    const el = domRef.current
    const fiberKey = Object.keys(el).find(k => k.startsWith("__reactFiber$"))
    if (!fiberKey) {
      setFiberState("접근 불가 (production build)")
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let fiber = (el as any)[fiberKey]
    while (fiber) {
      if (fiber.memoizedState?.queue) {
        setFiberState(String(fiber.memoizedState.memoizedState))
        return
      }
      fiber = fiber.return
    }
    setFiberState("읽기 실패")
  }, [count])

  return (
    <div ref={domRef} style={{ border: "1px solid #6f6", padding: "1.2rem", borderRadius: "0.5rem", minWidth: "260px" }}>
      <h3 style={{ marginBottom: "0.8rem" }}>✅ useState</h3>

      <pre style={{ background: "#1a1a1a", padding: "0.5rem", borderRadius: "4px", fontSize: "0.8rem", marginBottom: "1rem" }}>
        {`const [count, setCount] = useState(0)`}
      </pre>

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1rem" }}>
        <tbody>
          <tr>
            <td style={{ padding: "4px 8px", color: "#aaa" }}>현재 값</td>
            <td style={{ padding: "4px 8px", fontWeight: "bold", color: "#6f6" }}>{count}</td>
          </tr>
          <tr>
            <td style={{ padding: "4px 8px", color: "#aaa" }}>렌더 횟수</td>
            <td style={{ padding: "4px 8px" }} suppressHydrationWarning>{renderCount.current}</td>
          </tr>
          <tr>
            <td style={{ padding: "4px 8px", color: "#aaa" }}>저장 위치</td>
            <td style={{ padding: "4px 8px", color: "#6f6" }}>React Fiber 노드<br /><small>(컴포넌트 외부, 렌더 후에도 유지)</small></td>
          </tr>
          <tr>
            <td style={{ padding: "4px 8px", color: "#aaa" }}>Fiber.memoizedState</td>
            <td style={{ padding: "4px 8px", color: "#ff0", fontWeight: "bold" }}>{fiberState}</td>
          </tr>
        </tbody>
      </table>

      <button onClick={() => setCount(count + 1)}>
        +1
      </button>
    </div>
  )
}

// ─── 페이지 ───────────────────────────────────────────────────
export default function FiberPage() {
  return (
    <div>
      <h2 style={{ marginBottom: "0.5rem" }}>변수 저장 위치 비교</h2>
      <p style={{ color: "#aaa", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
        +1을 눌러서 일반 변수와 useState가 실제로 어디에 어떻게 저장되는지 확인하세요.
      </p>
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        <BadCounterPanel />
        <GoodCounterPanel />
      </div>
    </div>
  )
}
