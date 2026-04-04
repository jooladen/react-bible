"use client"  // Next.js의 경우 주석을 제거하세요.

function BadCounter1() {
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

function BadCounter2() {
  let count = 0  // ❌ 일반 변수 — 렌더마다 0으로 초기화

  function countClick() {
    console.log('BadCounter2');
    count++;
  }

  return (
    <div>
      <p>카운트: {count}</p>
      <button onClick={countClick}>
        +1 (화면 안 바뀜)
      </button>
    </div>
  )
}

function BadCounter3() {
  let count = 0  // ❌ 일반 변수 — 렌더마다 0으로 초기화

  const countClick = () => {
    console.log('BadCounter3');
    count++;
  }

  return (
    <div>
      <p>카운트: {count}</p>
      <button onClick={countClick}>
        +1 (화면 안 바뀜)
      </button>
    </div>
  )
}

export default function BadCounterPage() {
  let count = 0  // ❌ 일반 변수 — 렌더마다 0으로 초기화
  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <div style={{border: "1px solid #ccc", padding: "1rem", borderRadius: "0.5rem" }}>
        <h3>기본</h3>
        <BadCounter1 />
      </div>
      <div style={{border: "1px solid #ccc", padding: "1rem", borderRadius: "0.5rem" }}>
        <h3>함수분리1</h3>
        <BadCounter2 />
      </div>
      <div style={{border: "1px solid #ccc", padding: "1rem", borderRadius: "0.5rem" }}>
        <h3>함수분리2</h3>
        <BadCounter3 />
      </div>
    </div>
  )
}  