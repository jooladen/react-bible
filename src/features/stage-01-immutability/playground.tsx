"use client"

// Design Ref: §5.2 — Bad/Good/Immer 3섹션 + 메모리 주소 mock 시각화
import { useState, useRef, useEffect } from "react"
import { produce } from "immer"

const ITEM_LABEL = "사과"

function genMockAddress(): string {
  return `0x${Math.floor(Math.random() * 0xffff)
    .toString(16)
    .toUpperCase()
    .padStart(4, "0")}`
}

// ── Bad Case ──────────────────────────────────────────────────────────────────
function BadCasePanel() {
  const actualRef = useRef<string[]>([])
  const [displayed, setDisplayed] = useState<string[]>([])
  const [actualCount, setActualCount] = useState(0) // debug panel 강제 갱신용
  const [fixedAddress, setFixedAddress] = useState("0x????")

  useEffect(() => {
    setFixedAddress(genMockAddress())
  }, [])

  function badAdd() {
    actualRef.current.push(ITEM_LABEL)
    setActualCount(actualRef.current.length) // debug panel만 갱신
    // setDisplayed 호출 안 함 → React가 변화 감지 못함
  }

  function reset() {
    actualRef.current = []
    setActualCount(0)
    setDisplayed([])
    setFixedAddress(genMockAddress())
  }

  return (
    <div className="rounded-lg border border-red-900/50 bg-red-950/10 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="flex items-center gap-2 font-semibold text-red-400">
          <span>🔴</span> Bad Case: 직접 변이 (push)
        </h4>
        <button
          onClick={reset}
          className="rounded px-2 py-0.5 text-xs text-zinc-600 hover:bg-zinc-800 hover:text-zinc-300"
        >
          초기화
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* 인터랙션 영역 */}
        <div className="space-y-3">
          <button
            onClick={badAdd}
            className="rounded-md bg-red-900/40 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-900/60"
          >
            + 추가 (push)
          </button>
          <div className="space-y-1 text-sm">
            <p className="text-zinc-500">화면 목록 (displayed):</p>
            <p className="font-mono text-zinc-300">
              [{displayed.map((i) => `"${i}"`).join(", ")}]
            </p>
            <p className="mt-2 text-zinc-500">실제 배열 (ref):</p>
            <p className="font-mono text-zinc-300">
              [{Array(actualCount).fill(`"${ITEM_LABEL}"`).join(", ")}]
            </p>
          </div>
          {actualCount > 0 && displayed.length === 0 && (
            <div className="rounded-md bg-red-950/40 border border-red-800/40 p-2 text-xs text-red-300">
              ⚠️ 배열은 바뀌었는데 화면이 안 바뀌었어요!
            </div>
          )}
        </div>

        {/* 메모리 주소 패널 */}
        <div className="rounded-md bg-zinc-900 p-3 text-xs font-mono">
          <p className="mb-2 text-zinc-500">메모리 주소</p>
          <p className="text-zinc-400">
            Before:{" "}
            <span className="text-amber-400">{fixedAddress}</span>
          </p>
          <p className="text-zinc-400">
            After:{" "}
            <span className="text-amber-400">{fixedAddress}</span>
          </p>
          {actualCount > 0 && (
            <p className="mt-2 text-red-400">⚠️ 동일 주소! React가 변화를 못 느낌</p>
          )}
        </div>
      </div>

      <p className="mt-3 text-xs text-zinc-600">
        `arr.push()` → 같은 배열 객체 변이 → 참조 주소 동일 → Object.is() → true →
        리렌더 없음
      </p>
    </div>
  )
}

// ── Good Case ─────────────────────────────────────────────────────────────────
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
    <div className="rounded-lg border border-green-900/50 bg-green-950/10 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="flex items-center gap-2 font-semibold text-green-400">
          <span>🟢</span> Good Case: 스프레드 연산자
        </h4>
        <button
          onClick={reset}
          className="rounded px-2 py-0.5 text-xs text-zinc-600 hover:bg-zinc-800 hover:text-zinc-300"
        >
          초기화
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* 인터랙션 영역 */}
        <div className="space-y-3">
          <button
            onClick={goodAdd}
            className="rounded-md bg-green-900/40 px-4 py-2 text-sm font-medium text-green-300 transition-colors hover:bg-green-900/60"
          >
            + 추가 ([...prev, item])
          </button>
          <div className="space-y-1 text-sm">
            <p className="text-zinc-500">화면 목록:</p>
            <p className="font-mono text-zinc-300">
              [{items.map((i) => `"${i}"`).join(", ")}]
            </p>
          </div>
          {items.length > 0 && (
            <div className="rounded-md bg-green-950/40 border border-green-800/40 p-2 text-xs text-green-300">
              ✅ 새 배열 → 새 주소 → 화면 즉시 갱신!
            </div>
          )}
        </div>

        {/* 메모리 주소 패널 */}
        <div className="rounded-md bg-zinc-900 p-3 text-xs font-mono">
          <p className="mb-2 text-zinc-500">메모리 주소</p>
          <p className="text-zinc-400">
            Before:{" "}
            <span className="text-zinc-400">{prevAddress.current}</span>
          </p>
          <p className="text-zinc-400">
            After:{" "}
            <span className="text-green-400">{curAddress}</span>
          </p>
          {items.length > 0 && (
            <p className="mt-2 text-green-400">✅ 새 주소! React가 변화를 감지함</p>
          )}
        </div>
      </div>

      <p className="mt-3 text-xs text-zinc-600">
        `[...prev, item]` → 새 배열 생성 → 새 참조 주소 → Object.is() → false →
        리렌더 트리거
      </p>
    </div>
  )
}

// ── Immer Case ────────────────────────────────────────────────────────────────
type ImmerState = {
  user: { name: string; scores: number[] }
}

function ImmerPanel() {
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
    <div className="rounded-lg border border-indigo-900/50 bg-indigo-950/10 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="flex items-center gap-2 font-semibold text-indigo-400">
          <span>✨</span> Immer 체험: produce()
        </h4>
        <button
          onClick={reset}
          className="rounded px-2 py-0.5 text-xs text-zinc-600 hover:bg-zinc-800 hover:text-zinc-300"
        >
          초기화
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <button
            onClick={addScore}
            className="rounded-md bg-indigo-900/40 px-4 py-2 text-sm font-medium text-indigo-300 transition-colors hover:bg-indigo-900/60"
          >
            + 점수 추가
          </button>
          <div className="space-y-1 text-sm text-zinc-300">
            <p>
              <span className="text-zinc-500">이름:</span> {state.user.name}
            </p>
            <p>
              <span className="text-zinc-500">점수:</span>{" "}
              <span className="font-mono">[{state.user.scores.join(", ")}]</span>
            </p>
            {state.user.scores.length > 0 && (
              <p>
                <span className="text-zinc-500">평균:</span>{" "}
                <span className="text-indigo-300 font-semibold">{avg}점</span>
              </p>
            )}
          </div>
        </div>

        <div className="rounded-md bg-zinc-900 p-3 text-xs font-mono leading-relaxed">
          <p className="mb-2 text-zinc-500">코드</p>
          <p>
            <span className="text-indigo-400">produce</span>(state, draft {"=>"} {"{"}
          </p>
          <p className="pl-3 text-amber-400">draft.user.scores</p>
          <p className="pl-5 text-amber-400">.push(score)</p>
          <p>{"}"})</p>
          {state.user.scores.length > 0 && (
            <p className="mt-2 text-green-400">
              ✅ 중첩 객체도 직접 수정 가능!
            </p>
          )}
        </div>
      </div>

      <p className="mt-3 text-xs text-zinc-600">
        `draft.user.scores.push(score)` — 직접 변이처럼 보이지만 Immer가 새 불변
        객체를 반환함
      </p>
    </div>
  )
}

// ── Main Export ───────────────────────────────────────────────────────────────
export function Stage01Playground() {
  return (
    <div className="space-y-4 p-6">
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-white">실험실</h3>
        <p className="mt-1 text-sm text-zinc-500">
          직접 버튼을 눌러 불변성 위반이 어떤 결과를 낳는지 체험해보세요.
        </p>
      </div>
      <BadCasePanel />
      <GoodCasePanel />
      <ImmerPanel />
    </div>
  )
}
