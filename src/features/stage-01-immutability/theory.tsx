"use client"

// Design Ref: §5.1 — 이중 설명 (초딩/개발자) + shadcn Card 3분할 레이아웃
import { useExplanationStore } from "@/stores/explanation-store"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

type ConceptCard = {
  title: string
  icon: string
  child: React.ReactNode
  dev: React.ReactNode
}

const CONCEPTS: ConceptCard[] = [
  {
    title: "불변성이란?",
    icon: "📦",
    child: (
      <div className="space-y-2 text-sm text-zinc-300">
        <p>
          택배 박스를 생각해봐요. React는 택배를{" "}
          <span className="font-semibold text-amber-400">주소</span>로 구별해요.
        </p>
        <p>
          같은 박스에 물건을 넣으면 주소가 그대로예요.{" "}
          <span className="text-red-400">React가 변화를 못 느껴요!</span>
        </p>
        <p>
          새 박스를 만들어서 물건을 옮겨야{" "}
          <span className="text-green-400">새 주소 = 새 택배</span>가 돼요.
        </p>
        <div className="mt-3 rounded-md bg-zinc-900 p-3 font-mono text-xs">
          <span className="text-red-400">// ❌ 같은 주소</span>
          {"\n"}arr.push(item){"\n\n"}
          <span className="text-green-400">// ✅ 새 주소</span>
          {"\n"}[...arr, item]
        </div>
      </div>
    ),
    dev: (
      <div className="space-y-2 text-sm text-zinc-300">
        <p>
          <span className="font-semibold text-indigo-400">불변성(Immutability)</span>
          {" "}— 데이터를 직접 수정하지 않고 새 값을 만드는 원칙.
        </p>
        <p>
          JavaScript에서 객체/배열은{" "}
          <span className="text-amber-400">참조 타입</span>이라 변수에 저장되는 건
          메모리 주소입니다.
        </p>
        <div className="mt-3 rounded-md bg-zinc-900 p-3 font-mono text-xs leading-relaxed">
          <span className="text-zinc-500">// 직접 변이: 주소 불변</span>
          {"\n"}
          <span className="text-red-400">arr.push(item) </span>
          <span className="text-zinc-500">// 0xA3F2 → 0xA3F2</span>
          {"\n\n"}
          <span className="text-zinc-500">// 새 참조: 주소 변경</span>
          {"\n"}
          <span className="text-green-400">[...arr, item] </span>
          <span className="text-zinc-500">// 0xA3F2 → 0xB71C</span>
        </div>
      </div>
    ),
  },
  {
    title: "React에서 왜 중요한가?",
    icon: "⚛️",
    child: (
      <div className="space-y-2 text-sm text-zinc-300">
        <p>
          React는 화면을 다시 그릴지 말지{" "}
          <span className="text-amber-400">주소를 비교해서</span> 결정해요.
        </p>
        <p>
          같은 박스(주소)면 <span className="text-red-400">"어, 안 바뀌었네"</span>{" "}
          하고 화면을 안 바꿔요.
        </p>
        <p>
          새 박스(새 주소)여야{" "}
          <span className="text-green-400">"새 택배 왔다!"</span> 하고 화면을
          다시 그려요.
        </p>
        <div className="mt-3 rounded-md bg-amber-950/30 border border-amber-800/40 p-3 text-xs text-amber-300">
          💡 그래서 useState에서 배열을 수정할 때 반드시 새 배열을 만들어야 해요!
        </div>
      </div>
    ),
    dev: (
      <div className="space-y-2 text-sm text-zinc-300">
        <p>
          React는{" "}
          <span className="font-mono text-indigo-400">Object.is(prev, next)</span>
          {" "}로 이전/다음 상태를 비교합니다.
        </p>
        <p>
          직접 변이(mutation)는 참조 동일성을 깨지 않아{" "}
          <span className="text-red-400">리렌더가 트리거되지 않습니다.</span>
        </p>
        <div className="mt-3 rounded-md bg-zinc-900 p-3 font-mono text-xs leading-relaxed">
          <span className="text-zinc-500">// Object.is 비교</span>
          {"\n"}
          <span className="text-red-400">Object.is(arr, arr) </span>
          <span className="text-zinc-500">// true → 리렌더 없음</span>
          {"\n"}
          <span className="text-green-400">Object.is(arr, newArr) </span>
          <span className="text-zinc-500">// false → 리렌더</span>
        </div>
        <p className="text-xs text-zinc-500">
          → useMemo, React.memo도 동일 원리로 메모이제이션 판단
        </p>
      </div>
    ),
  },
  {
    title: "Immer란?",
    icon: "✨",
    child: (
      <div className="space-y-2 text-sm text-zinc-300">
        <p>
          Immer는{" "}
          <span className="text-amber-400">마법사 같은 도구</span>예요.
        </p>
        <p>
          "그냥 막 고쳐봐~" 하면 Immer가 뒤에서{" "}
          <span className="text-green-400">새 박스에 복사</span>해서 돌려줘요.
        </p>
        <div className="mt-3 rounded-md bg-zinc-900 p-3 font-mono text-xs leading-relaxed">
          <span className="text-zinc-500">// 마음대로 수정해도 OK!</span>
          {"\n"}
          <span className="text-green-400">produce</span>(state,{" "}
          <span className="text-amber-400">draft</span> {"=>"} {"{"}
          {"\n"}{"  "}
          <span className="text-amber-400">draft</span>.todos.push(item)
          {"\n"}{"}"})
        </div>
      </div>
    ),
    dev: (
      <div className="space-y-2 text-sm text-zinc-300">
        <p>
          Immer는 <span className="font-mono text-indigo-400">produce()</span>
          {" "}함수로 Proxy 기반의 임시 draft를 생성합니다.
        </p>
        <p>
          draft를 직접 변이해도{" "}
          <span className="text-green-400">내부적으로 구조적 공유(structural sharing)</span>를
          통해 새 불변 객체를 반환합니다.
        </p>
        <div className="mt-3 rounded-md bg-zinc-900 p-3 font-mono text-xs leading-relaxed">
          <span className="text-green-400">import</span>{" "}
          {"{ produce }"}
          <span className="text-green-400"> from</span>{" "}
          <span className="text-amber-400">"immer"</span>
          {"\n\n"}
          <span className="text-zinc-500">// Proxy draft → 새 불변 객체 반환</span>
          {"\n"}
          <span className="text-indigo-400">const</span> next ={" "}
          <span className="text-green-400">produce</span>(state, draft {"=>"} {"{"}
          {"\n"}{"  "}draft.todos.push(item){"\n"}
          {"}"})
        </div>
        <p className="text-xs text-zinc-500">
          → 중첩 객체 업데이트에서 스프레드 연산자 대비 코드량 대폭 감소
        </p>
      </div>
    ),
  },
]

export function Stage01Theory() {
  const { mode } = useExplanationStore()

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">불변성 & Immer 이론</h3>
        <p className="mt-1 text-sm text-zinc-500">
          {mode === "child"
            ? "🟢 초딩 모드 — 쉬운 비유로 핵심 개념 이해"
            : "🔵 개발자 모드 — 참조 동일성과 React 내부 동작 원리"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {CONCEPTS.map((concept) => (
          <Card key={concept.title} className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <span>{concept.icon}</span>
                <span className="text-zinc-100">{concept.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mode === "child" ? concept.child : concept.dev}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-indigo-800/40 bg-indigo-950/20 p-4">
        <p className="text-sm font-medium text-indigo-300">
          {mode === "child" ? "🎯 핵심 요약" : "🎯 핵심 원칙"}
        </p>
        <p className="mt-1 text-sm text-zinc-300">
          {mode === "child"
            ? "React는 주소로 비교해요. 같은 박스면 화면이 안 바뀌어요. 항상 새 박스(새 배열/객체)를 만들어야 해요."
            : "Object.is() 기반 참조 비교 → mutation은 리렌더 트리거 안 함 → 항상 새 참조 반환 필요. Immer는 이를 ergonomic하게 해결."}
        </p>
      </div>
    </div>
  )
}
