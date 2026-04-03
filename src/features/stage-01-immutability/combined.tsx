"use client"

// Design Ref: §4.6 — Stage 01 TopicTab 배열 + 데모 컴포넌트
// playground.tsx의 BadCasePanel, GoodCasePanel, ImmerPanel을 combined로 통합
import { useState, useRef, useEffect } from "react"
import { produce } from "immer"
import { CombinedStageView } from "@/components/layout/combined-stage-view"
import type { TopicTab } from "@/types/combined-stage"

// ─── 공통 유틸 ────────────────────────────────────────────────────────────────

const ITEM_LABEL = "사과"

function genMockAddress(): string {
  return `0x${Math.floor(Math.random() * 0xffff)
    .toString(16)
    .toUpperCase()
    .padStart(4, "0")}`
}

// ─── Tab 1 데모: 일반 변수 vs useState ────────────────────────────────────────

function PrimitiveDemo() {
  let badCount = 0  // 일반 변수 — setXxx 없으므로 React가 변화를 모름
  const [stateCount, setStateCount] = useState(0)

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">👇 아래 버튼을 클릭해 보세요</p>
      <div className="grid gap-4 sm:grid-cols-2">
      {/* 일반 변수 카운터 */}
      <div className="rounded-lg border border-red-900/50 bg-red-950/10 p-4 light:border-red-200 light:bg-red-50/40">
        <h5 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-red-400 light:text-red-600">
          <span>❌</span> 일반 변수
        </h5>
        <p className="mb-3 font-mono text-lg font-bold text-foreground">
          카운트: {badCount}
        </p>
        <button
          onClick={() => { badCount++ }}
          className="rounded-md bg-red-900/40 px-3 py-1.5 text-sm text-red-300 hover:bg-red-900/60 light:bg-red-100 light:text-red-700 light:hover:bg-red-200"
        >
          +1 (화면 안 바뀜)
        </button>
      </div>

      {/* useState 카운터 */}
      <div className="rounded-lg border border-green-900/50 bg-green-950/10 p-4 light:border-green-200 light:bg-green-50/40">
        <h5 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-green-400 light:text-green-600">
          <span>✅</span> useState
        </h5>
        <p className="mb-3 font-mono text-lg font-bold text-foreground">
          카운트: {stateCount}
        </p>
        <button
          onClick={() => setStateCount((n) => n + 1)}
          className="rounded-md bg-green-900/40 px-3 py-1.5 text-sm text-green-300 hover:bg-green-900/60 light:bg-green-100 light:text-green-700 light:hover:bg-green-200"
        >
          +1 (즉시 반영)
        </button>
      </div>
      </div>
    </div>
  )
}

// ─── Tab 2 데모: 배열/객체 불변성 (playground.tsx에서 이전) ──────────────────

function BadCasePanel() {
  const actualRef = useRef<string[]>([])
  const [actualCount, setActualCount] = useState(0)  // 실제 배열 개수 (표시용)
  const [displayedCount] = useState(0)               // 화면 목록 개수 — 절대 변하지 않음
  const [fixedAddress, setFixedAddress] = useState("0x????")

  useEffect(() => {
    setFixedAddress(genMockAddress())
  }, [])

  function badAdd() {
    actualRef.current.push(ITEM_LABEL)
    setActualCount(actualRef.current.length) // 실제 배열은 늘어남
    // setDisplayedCount 없음 → 화면 목록은 그대로 0개
  }

  function reset() {
    actualRef.current = []
    setActualCount(0)
    setFixedAddress(genMockAddress())
  }

  return (
    <div className="rounded-lg border border-red-900/50 bg-red-950/10 p-5 light:border-red-200 light:bg-red-50/40">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="flex items-center gap-2 font-semibold text-red-400 light:text-red-600">
          <span>🔴</span> Bad Case: 직접 변이 (push)
        </h4>
        <button
          onClick={reset}
          className="rounded px-2 py-0.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          초기화
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <button
            onClick={badAdd}
            className="rounded-md bg-red-900/40 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-900/60 light:bg-red-100 light:text-red-700 light:hover:bg-red-200"
          >
            + 추가 (push)
          </button>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground">실제 배열:</p>
              <span className="rounded bg-zinc-700/50 px-1.5 py-0.5 font-mono text-xs font-bold text-zinc-300 light:bg-zinc-200 light:text-zinc-700">
                {actualCount}개
              </span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground">화면 목록:</p>
              <span className="rounded bg-red-900/40 px-1.5 py-0.5 font-mono text-xs font-bold text-red-300 light:bg-red-100 light:text-red-600">
                {displayedCount}개
              </span>
            </div>
            {actualCount > 0 && (
              <div className="rounded-md border border-red-800/40 bg-red-950/40 p-2 text-xs text-red-300 light:border-red-200 light:bg-red-50 light:text-red-600">
                ⚠️ 배열은 {actualCount}개인데 화면은 여전히 0개!
              </div>
            )}
          </div>
        </div>

        <div className="rounded-md bg-zinc-900 p-3 text-xs font-mono">
          <p className="mb-2 text-zinc-500">메모리 주소</p>
          <p className="text-zinc-400">
            Before: <span className="text-amber-400">{fixedAddress}</span>
          </p>
          <p className="text-zinc-400">
            After: <span className="text-amber-400">{fixedAddress}</span>
          </p>
          <p className="mt-2 text-red-400">⚠️ 동일 주소 → 리렌더 없음</p>
        </div>
      </div>

      <p className="mt-3 text-xs text-zinc-600">
        `arr.push()` → 같은 배열 객체 변이 → 참조 주소 동일 → Object.is() → true → 리렌더 없음
      </p>
    </div>
  )
}

function GoodCasePanel() {
  const [items, setItems] = useState<string[]>([])
  const prevAddress = useRef("0x????")
  const [curAddress, setCurAddress] = useState("0x????")

  useEffect(() => {
    const addr = genMockAddress()
    prevAddress.current = addr
    setCurAddress(addr)
  }, [])

  function goodAdd() {
    prevAddress.current = curAddress
    const next = genMockAddress()
    setCurAddress(next)
    setItems((prev) => [...prev, ITEM_LABEL])
  }

  function reset() {
    const fresh = genMockAddress()
    prevAddress.current = fresh
    setCurAddress(fresh)
    setItems([])
  }

  return (
    <div className="rounded-lg border border-green-900/50 bg-green-950/10 p-5 light:border-green-200 light:bg-green-50/40">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="flex items-center gap-2 font-semibold text-green-400 light:text-green-600">
          <span>🟢</span> Good Case: 스프레드 연산자
        </h4>
        <button
          onClick={reset}
          className="rounded px-2 py-0.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          초기화
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <button
            onClick={goodAdd}
            className="rounded-md bg-green-900/40 px-4 py-2 text-sm font-medium text-green-300 transition-colors hover:bg-green-900/60 light:bg-green-100 light:text-green-700 light:hover:bg-green-200"
          >
            + 추가 ([...prev, item])
          </button>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground">화면 목록:</p>
              <span className="rounded bg-green-900/40 px-1.5 py-0.5 font-mono text-xs font-bold text-green-300 light:bg-green-100 light:text-green-600">
                {items.length}개
              </span>
            </div>
            <p className="font-mono text-foreground">
              [{items.map((i) => `"${i}"`).join(", ")}]
            </p>
          </div>
          {items.length > 0 && (
            <div className="rounded-md border border-green-800/40 bg-green-950/40 p-2 text-xs text-green-300 light:border-green-200 light:bg-green-50 light:text-green-600">
              ✅ 새 배열 → 새 주소 → 화면 즉시 갱신!
            </div>
          )}
        </div>

        <div className="rounded-md bg-zinc-900 p-3 text-xs font-mono">
          <p className="mb-2 text-zinc-500">메모리 주소</p>
          <p className="text-zinc-400">
            Before: <span className="text-zinc-400">{prevAddress.current}</span>
          </p>
          <p className="text-zinc-400">
            After: <span className="text-green-400">{curAddress}</span>
          </p>
          {items.length > 0 && (
            <p className="mt-2 text-green-400">✅ 새 주소! React가 변화를 감지함</p>
          )}
        </div>
      </div>

      <p className="mt-3 text-xs text-zinc-600">
        `[...prev, item]` → 새 배열 생성 → 새 참조 주소 → Object.is() → false → 리렌더 트리거
      </p>
    </div>
  )
}

function ArrayObjectDemo() {
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">👇 아래 추가 버튼을 눌러보세요</p>
      <BadCasePanel />
      <GoodCasePanel />
    </div>
  )
}

// ─── Tab 3 데모: Immer (playground.tsx에서 이전) ──────────────────────────────

type ImmerState = {
  user: { name: string; scores: number[] }
}

function ImmerDemo() {
  const [state, setState] = useState<ImmerState>({
    user: { name: "학습자", scores: [] },
  })

  function addScore() {
    setState(
      produce((draft) => {
        draft.user.scores.push(Math.floor(Math.random() * 40) + 60)
      })
    )
  }

  function reset() {
    setState({ user: { name: "학습자", scores: [] } })
  }

  const avg =
    state.user.scores.length > 0
      ? Math.round(
          state.user.scores.reduce((a, b) => a + b, 0) / state.user.scores.length
        )
      : 0

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">👇 아래 추가 버튼을 눌러보세요</p>
    <div className="rounded-lg border border-indigo-900/50 bg-indigo-950/10 p-5 light:border-zinc-200 light:bg-zinc-50/60">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="flex items-center gap-2 font-semibold text-indigo-400 light:text-zinc-700">
          <span>✨</span> Immer 체험: produce()
        </h4>
        <button
          onClick={reset}
          className="rounded px-2 py-0.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          초기화
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <button
            onClick={addScore}
            className="rounded-md bg-indigo-900/40 px-4 py-2 text-sm font-medium text-indigo-300 transition-colors hover:bg-indigo-900/60 light:bg-zinc-100 light:text-zinc-700 light:hover:bg-zinc-200"
          >
            + 점수 추가
          </button>
          <div className="space-y-1 text-sm text-foreground">
            <p>
              <span className="text-muted-foreground">이름:</span> {state.user.name}
            </p>
            <p>
              <span className="text-muted-foreground">점수:</span>{" "}
              <span className="font-mono">[{state.user.scores.join(", ")}]</span>
            </p>
            {state.user.scores.length > 0 && (
              <p>
                <span className="text-muted-foreground">평균:</span>{" "}
                <span className="font-semibold text-indigo-300 light:text-zinc-700">{avg}점</span>
              </p>
            )}
          </div>
        </div>

        <div className="rounded-md bg-zinc-900 p-3 text-xs font-mono leading-relaxed">
          <p className="mb-2 text-zinc-500">코드</p>
          <p>
            <span className="text-indigo-400">produce</span>(state, draft {`=>`} {"{"}
          </p>
          <p className="pl-3 text-amber-400">draft.user.scores</p>
          <p className="pl-5 text-amber-400">.push(score)</p>
          <p>{"}"}{`)`}</p>
          {state.user.scores.length > 0 && (
            <p className="mt-2 text-green-400">✅ 중첩 객체도 직접 수정 가능!</p>
          )}
        </div>
      </div>

      <p className="mt-3 text-xs text-zinc-600">
        `draft.user.scores.push(score)` — 직접 변이처럼 보이지만 Immer가 새 불변 객체를 반환함
      </p>
    </div>
    </div>
  )
}

// ─── 이론 컴포넌트 ────────────────────────────────────────────────────────────

function PrimitiveTheoryChild() {
  return (
    <div className="space-y-2 text-sm text-foreground">
      <p className="font-semibold">🟢 왜 버튼을 눌러도 화면이 안 바뀔까요?</p>
      <p className="text-muted-foreground">
        일반 변수(<code className="rounded bg-zinc-800 px-1 text-xs">let count = 0</code>)에
        값을 넣어도 <strong>React는 전혀 몰라요.</strong>
      </p>
      <p className="text-muted-foreground">
        React한테 알리려면 <code className="rounded bg-zinc-800 px-1 text-xs">useState</code>를
        써야 해요. <code className="rounded bg-zinc-800 px-1 text-xs">setCount()</code>를
        부르면 React가 &ldquo;앗, 바뀌었다!&rdquo; 하고 화면을 다시 그려요.
      </p>
    </div>
  )
}

function PrimitiveTheoryDev() {
  return (
    <div className="space-y-2 text-sm text-foreground">
      <p className="font-semibold">🔵 일반 변수 vs React 상태</p>
      <p className="text-muted-foreground">
        일반 변수는 컴포넌트 함수 재실행 시마다 초기화됩니다.{" "}
        <code className="rounded bg-zinc-800 px-1 text-xs">setXxx</code> 호출이 없으면
        리렌더 미트리거 — React의 상태는 렌더 사이클 밖 Fiber 노드에 저장됩니다.
      </p>
      <p className="text-muted-foreground">
        <code className="rounded bg-zinc-800 px-1 text-xs">useState</code>는 내부적으로
        Fiber 노드에 연결된 상태 큐를 사용하며,{" "}
        <code className="rounded bg-zinc-800 px-1 text-xs">setState</code> 호출 시
        스케줄러에 리렌더 예약이 됩니다.
      </p>
    </div>
  )
}

function ArrayTheoryChild() {
  return (
    <div className="space-y-2 text-sm text-foreground">
      <p className="font-semibold">🟢 React는 택배 주소로 변화를 감지해요</p>
      <p className="text-muted-foreground">
        같은 배열에 <code className="rounded bg-zinc-800 px-1 text-xs">push</code>하면{" "}
        <strong>주소가 그대로</strong> → React가 &ldquo;안 바뀌었네&rdquo; 합니다.
      </p>
      <p className="text-muted-foreground">
        <code className="rounded bg-zinc-800 px-1 text-xs">[...arr, item]</code>으로
        새 배열을 만들어야 <strong>새 주소가 생겨서</strong> React가 알아채요.
      </p>
    </div>
  )
}

function ArrayTheoryDev() {
  return (
    <div className="space-y-2 text-sm text-foreground">
      <p className="font-semibold">🔵 참조 비교와 불변성</p>
      <p className="text-muted-foreground">
        React는 <code className="rounded bg-zinc-800 px-1 text-xs">Object.is(prev, next)</code>{" "}
        참조 비교로 변화를 감지합니다.{" "}
        <code className="rounded bg-zinc-800 px-1 text-xs">push()</code>는 동일 참조 유지 →{" "}
        <code className="rounded bg-zinc-800 px-1 text-xs">false</code> 미반환 → 리렌더 미트리거.
      </p>
      <p className="text-muted-foreground">
        spread(<code className="rounded bg-zinc-800 px-1 text-xs">[...prev, item]</code>)는
        새 배열 생성 → 새 참조 → 리렌더 트리거.
      </p>
    </div>
  )
}

function ImmerTheoryChild() {
  return (
    <div className="space-y-2 text-sm text-foreground">
      <p className="font-semibold">🟢 Immer는 마법사예요</p>
      <p className="text-muted-foreground">
        &ldquo;막 바꿔도 괜찮아~&rdquo; 하면, 뒤에서{" "}
        <strong>새 박스에 복사해서 돌려줘요.</strong> 코드가 훨씬 간결해져요.
      </p>
      <p className="text-muted-foreground">
        중첩 객체도 그냥{" "}
        <code className="rounded bg-zinc-800 px-1 text-xs">draft.address.city = &quot;서울&quot;</code>
        처럼 쓰면 됩니다.
      </p>
    </div>
  )
}

function ImmerTheoryDev() {
  return (
    <div className="space-y-2 text-sm text-foreground">
      <p className="font-semibold">🔵 Immer의 Proxy 메커니즘</p>
      <p className="text-muted-foreground">
        <code className="rounded bg-zinc-800 px-1 text-xs">produce()</code>는 Proxy 기반
        임시 draft를 생성합니다. draft를 직접 변이해도 내부적으로 structural sharing으로
        새 불변 객체를 반환합니다.
      </p>
      <p className="text-muted-foreground">
        중첩 깊이 무관하게 동일 문법 — spread 지옥 없이 가독성과 불변성을 동시에.
      </p>
    </div>
  )
}

// ─── 코드 스니펫 상수 ─────────────────────────────────────────────────────────

const BAD_COUNTER_SNIPPET = `export default function BadCounter() {
  let count = 0  // ❌ 일반 변수 — 렌더마다 0으로 초기화
  return (
    <div>
      <p>카운트: {count}</p>
      <button onClick={() => { count++ }}>
        +1 (화면 안 바뀜)
      </button>
    </div>
  )
}`

const GOOD_COUNTER_SNIPPET = `import { useState } from "react"

export default function GoodCounter() {
  const [count, setCount] = useState(0)  // ✅ React가 추적
  return (
    <div>
      <p>카운트: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  )
}`

const BAD_LIST_SNIPPET = `import { useState } from "react"

export default function BadList() {
  const [items, setItems] = useState<string[]>([])

  function add() {
    items.push("사과")   // ❌ 같은 배열 변이 → React가 변화 감지 못함
    setItems(items)      // 같은 참조 전달
  }

  return (
    <div>
      <button onClick={add}>추가 (화면 안 바뀜)</button>
      <p>{items.length}개</p>
    </div>
  )
}`

const GOOD_LIST_SNIPPET = `import { useState } from "react"

export default function GoodList() {
  const [items, setItems] = useState<string[]>([])

  function add() {
    setItems([...items, "사과"])  // ✅ 새 배열 생성 → 새 참조 → React가 변화 감지
  }

  return (
    <div>
      <button onClick={add}>추가 (즉시 반영)</button>
      <ul>{items.map((item, i) => <li key={i}>{item}</li>)}</ul>
    </div>
  )
}`

const BAD_NESTED_SNIPPET = `import { useState } from "react"

export default function DeepSpread() {
  const [user, setUser] = useState({
    name: "준",
    address: { city: "부산", zip: "48000" },
  })

  function moveToSeoul() {
    // ❌ 중첩 spread 지옥 — 깊이가 깊어질수록 더 심해짐
    setUser({
      ...user,
      address: { ...user.address, city: "서울" },
    })
  }

  return <button onClick={moveToSeoul}>서울로 이사 (spread 지옥)</button>
}`

const GOOD_IMMER_SNIPPET = `import { useState } from "react"
import { produce } from "immer"

export default function ImmerExample() {
  const [user, setUser] = useState({
    name: "준",
    address: { city: "부산", zip: "48000" },
  })

  function moveToSeoul() {
    // ✅ Immer — 직접 수정처럼 보이지만 새 불변 객체 반환
    setUser(produce(draft => {
      draft.address.city = "서울"
    }))
  }

  return <button onClick={moveToSeoul}>서울로 이사 (Immer)</button>
}`

// ─── TOPICS 배열 ──────────────────────────────────────────────────────────────

const TOPICS: TopicTab[] = [
  {
    id: "primitive",
    label: "일반 변수",
    icon: "🔢",
    theory: {
      child: <PrimitiveTheoryChild />,
      dev: <PrimitiveTheoryDev />,
    },
    demo: <PrimitiveDemo />,
    code: [
      { label: "❌ 일반 변수", snippet: BAD_COUNTER_SNIPPET, useClient: true },
      { label: "✅ useState", snippet: GOOD_COUNTER_SNIPPET, useClient: true },
    ],
  },
  {
    id: "array-object",
    label: "배열/객체",
    icon: "📦",
    theory: {
      child: <ArrayTheoryChild />,
      dev: <ArrayTheoryDev />,
    },
    demo: <ArrayObjectDemo />,
    code: [
      { label: "❌ push", snippet: BAD_LIST_SNIPPET, useClient: true },
      { label: "✅ spread", snippet: GOOD_LIST_SNIPPET, useClient: true },
    ],
  },
  {
    id: "immer",
    label: "Immer",
    icon: "✨",
    theory: {
      child: <ImmerTheoryChild />,
      dev: <ImmerTheoryDev />,
    },
    demo: <ImmerDemo />,
    code: [
      { label: "❌ 중첩 spread", snippet: BAD_NESTED_SNIPPET, useClient: true },
      { label: "✅ produce()", snippet: GOOD_IMMER_SNIPPET, useClient: true },
    ],
  },
]

// ─── Export ───────────────────────────────────────────────────────────────────

export function Stage01Combined() {
  return <CombinedStageView tabs={TOPICS} />
}
