"use client"  // Next.js의 경우 주석을 제거하세요.

export default function BadCounter() {
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