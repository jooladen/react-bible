"use client"

// Design Ref: §5.1 — 9단계 스토리텔링 내러티브 흐름 (공감→깨달음→습관 교정)
import { useExplanationStore } from "@/stores/explanation-store"

type NarrativeStep = {
  id: string
  emoji: string
  label: string
  child: React.ReactNode
  dev: React.ReactNode
}

const code = (content: React.ReactNode) => (
  <div className="mt-2 rounded-md bg-zinc-900 p-3 font-mono text-xs leading-relaxed text-zinc-100 whitespace-pre-wrap">
    {content}
  </div>
)

const STEPS: NarrativeStep[] = [
  {
    id: "failure",
    emoji: "❌",
    label: "이거 왜 화면이 안 바뀌지?",
    child: (
      <div className="space-y-3 text-sm text-foreground">
        <p>이 코드, 한 번쯤 써본 적 있죠?</p>
        {code(
          <>
            <span className="text-zinc-500">// 할 일 추가하고 싶어서</span>
            {"\n"}
            <span className="text-red-400">todos.push("할 일")</span>
            {"\n"}
            <span className="text-red-400">setTodos(todos)</span>
            {"\n\n"}
            <span className="text-zinc-500">// 이름 바꾸고 싶어서</span>
            {"\n"}
            <span className="text-red-400">user.name = "철수"</span>
            {"\n"}
            <span className="text-red-400">setUser(user)</span>
          </>
        )}
        <p className="text-red-400 font-medium">근데 화면이 안 바뀐다.</p>
      </div>
    ),
    dev: (
      <div className="space-y-3 text-sm text-foreground">
        <p>흔히 저지르는 mutation 실수 두 가지:</p>
        {code(
          <>
            <span className="text-zinc-500">// 배열 직접 변이</span>
            {"\n"}
            <span className="text-red-400">todos.push("할 일")</span>
            {"\n"}
            <span className="text-red-400">setTodos(todos) </span>
            <span className="text-zinc-500">// 같은 참조 전달</span>
            {"\n\n"}
            <span className="text-zinc-500">// 객체 직접 변이</span>
            {"\n"}
            <span className="text-red-400">user.name = "철수"</span>
            {"\n"}
            <span className="text-red-400">setUser(user) </span>
            <span className="text-zinc-500">// 동일 참조</span>
          </>
        )}
        <p>setState를 호출했는데 리렌더가 안 된다.</p>
      </div>
    ),
  },
  {
    id: "question",
    emoji: "💭",
    label: "잠깐, 왜 안 바뀔까요?",
    child: (
      <div className="rounded-lg border border-amber-800/40 light:border-zinc-300 bg-amber-950/20 light:bg-zinc-50 p-4 text-sm">
        <p className="font-medium text-amber-300 light:text-zinc-700">분명히 값을 바꿨는데...</p>
        <p className="mt-2 text-foreground">
          setTodos도 불렀고, push로 넣기도 했는데 왜 화면이 그대로일까요?
        </p>
        <p className="mt-2 text-muted-foreground text-xs">잠깐 생각해보세요.</p>
      </div>
    ),
    dev: (
      <div className="rounded-lg border border-amber-800/40 light:border-zinc-300 bg-amber-950/20 light:bg-zinc-50 p-4 text-sm">
        <p className="font-medium text-amber-300 light:text-zinc-700">setState를 호출했는데 리렌더가 트리거되지 않는 이유는?</p>
        <p className="mt-2 text-foreground">
          React의 변경 감지 메커니즘을 이해하면 답이 보입니다.
        </p>
        <p className="mt-2 text-muted-foreground text-xs">힌트: React는 "값"을 보지 않습니다.</p>
      </div>
    ),
  },
  {
    id: "analogy",
    emoji: "📦",
    label: "택배 박스 비유",
    child: (
      <div className="space-y-3 text-sm text-foreground">
        <p>React는 택배를 <span className="font-semibold text-amber-400">주소</span>로 구별해요.</p>
        <p>
          같은 박스에 물건을 넣으면 <span className="text-red-400">주소가 그대로</span>예요.
          React가 "어, 안 바뀌었네" 하고 화면을 안 고쳐요.
        </p>
        <p>
          <span className="text-green-400">새 박스를 만들어서</span> 물건을 담아야
          새 주소가 생겨요. 그때 React가 화면을 다시 그려요.
        </p>
        {code(
          <>
            <span className="text-red-400">todos.push(item) </span>
            <span className="text-zinc-500">// 같은 박스 → 주소 그대로</span>
            {"\n"}
            <span className="text-green-400">[...todos, item] </span>
            <span className="text-zinc-500">// 새 박스 → 새 주소!</span>
          </>
        )}
      </div>
    ),
    dev: (
      <div className="space-y-3 text-sm text-foreground">
        <p>
          JavaScript에서 객체/배열은 <span className="text-amber-400">참조 타입</span>입니다.
          변수에 저장되는 건 메모리 주소(참조)예요.
        </p>
        <p>
          <code className="rounded bg-zinc-800 px-1 text-xs text-indigo-300">push()</code>는
          배열 내용을 바꾸지만 <span className="text-red-400">참조는 동일합니다.</span>
        </p>
        {code(
          <>
            <span className="text-zinc-500">// push: 참조 불변</span>
            {"\n"}
            <span className="text-red-400">todos.push(item) </span>
            <span className="text-zinc-500">// 0xA3F2 → 0xA3F2</span>
            {"\n\n"}
            <span className="text-zinc-500">// spread: 새 참조</span>
            {"\n"}
            <span className="text-green-400">[...todos, item] </span>
            <span className="text-zinc-500">// 0xA3F2 → 0xB71C</span>
          </>
        )}
      </div>
    ),
  },
  {
    id: "principle",
    emoji: "⚛️",
    label: "React의 진짜 동작 원리",
    child: (
      <div className="space-y-3 text-sm text-foreground">
        <p>
          React는 화면을 다시 그릴지 말지{" "}
          <span className="text-amber-400">주소를 비교해서</span> 결정해요.
        </p>
        <p>
          같은 주소면 <span className="text-red-400">"안 바뀌었네"</span> → 화면 유지
          {"\n"}새 주소면 <span className="text-green-400">"바뀌었다!"</span> → 화면 업데이트
        </p>
        {code(
          <>
            <span className="text-zinc-500">// 같은 주소 → 리렌더 없음</span>
            {"\n"}
            <span className="text-red-400">같은 배열 → 화면 안 바뀜</span>
            {"\n\n"}
            <span className="text-zinc-500">// 새 주소 → 리렌더!</span>
            {"\n"}
            <span className="text-green-400">새 배열 → 화면 바뀜</span>
          </>
        )}
      </div>
    ),
    dev: (
      <div className="space-y-3 text-sm text-foreground">
        <p>
          React는{" "}
          <code className="rounded bg-zinc-800 px-1 text-xs text-indigo-300 light:text-zinc-700">
            Object.is(prevState, nextState)
          </code>
          로 이전/다음 상태를 비교합니다.
        </p>
        <p>
          직접 변이(mutation)는 참조 동일성을 깨지 않아{" "}
          <span className="text-red-400">리렌더가 트리거되지 않습니다.</span>
        </p>
        {code(
          <>
            <span className="text-zinc-500">// Object.is 비교</span>
            {"\n"}
            <span className="text-red-400">Object.is(arr, arr) </span>
            <span className="text-zinc-500">// true → 리렌더 없음</span>
            {"\n"}
            <span className="text-green-400">Object.is(arr, newArr) </span>
            <span className="text-zinc-500">// false → 리렌더</span>
          </>
        )}
        <p className="text-xs text-muted-foreground">
          → useMemo, React.memo도 동일 원리로 메모이제이션 판단
        </p>
      </div>
    ),
  },
  {
    id: "solution",
    emoji: "✅",
    label: "해결법 — 항상 새 참조를",
    child: (
      <div className="space-y-3 text-sm text-foreground">
        <p>항상 <span className="text-green-400">새 박스(새 배열/객체)</span>를 만들어서 전달해요.</p>
        {code(
          <>
            <span className="text-zinc-500">// 배열에 추가</span>
            {"\n"}
            <span className="text-green-400">setTodos([...todos, "할 일"])</span>
            {"\n\n"}
            <span className="text-zinc-500">// 객체 필드 변경</span>
            {"\n"}
            <span className="text-green-400">{"setUser({ ...user, name: \"철수\" })"}</span>
          </>
        )}
      </div>
    ),
    dev: (
      <div className="space-y-3 text-sm text-foreground">
        <p>새 참조를 생성하는 방법들:</p>
        {code(
          <>
            <span className="text-zinc-500">// 배열 — spread</span>
            {"\n"}
            <span className="text-green-400">setTodos([...todos, newItem])</span>
            {"\n\n"}
            <span className="text-zinc-500">// 배열 — map/filter (새 배열 반환)</span>
            {"\n"}
            <span className="text-green-400">{"setTodos(todos.map(t => t.id === id ? { ...t, done: true } : t))"}</span>
            {"\n\n"}
            <span className="text-zinc-500">// 객체 — spread</span>
            {"\n"}
            <span className="text-green-400">{"setUser({ ...user, name: \"철수\" })"}</span>
          </>
        )}
      </div>
    ),
  },
  {
    id: "problem",
    emoji: "😩",
    label: "근데 중첩 객체면 귀찮음",
    child: (
      <div className="space-y-3 text-sm text-foreground">
        <p>주소 안에 주소가 또 있으면...</p>
        {code(
          <>
            <span className="text-zinc-500">// 도시 이름 하나 바꾸는데</span>
            {"\n"}
            <span className="text-amber-400">{"setUser({"}</span>
            {"\n"}
            <span className="text-amber-400">{"  ...user,"}</span>
            {"\n"}
            <span className="text-amber-400">{"  address: {"}</span>
            {"\n"}
            <span className="text-amber-400">{"    ...user.address,"}</span>
            {"\n"}
            <span className="text-amber-400">{"    city: \"서울\""}</span>
            {"\n"}
            <span className="text-amber-400">{"  }"}</span>
            {"\n"}
            <span className="text-amber-400">{"})"})</span>
          </>
        )}
        <p className="text-amber-400 font-medium">…이거 너무 길다.</p>
      </div>
    ),
    dev: (
      <div className="space-y-3 text-sm text-foreground">
        <p>중첩 구조에서 불변 업데이트는 각 레벨을 모두 spread해야 합니다.</p>
        {code(
          <>
            <span className="text-zinc-500">// depth 2 — 이미 장황</span>
            {"\n"}
            <span className="text-amber-400">{"setUser({ ...user, address: { ...user.address, city: \"서울\" } })"}</span>
            {"\n\n"}
            <span className="text-zinc-500">// depth 3 — 실무에서 자주 발생</span>
            {"\n"}
            <span className="text-amber-400">{"setData({ ...data, user: { ...data.user, address: { ...data.user.address, city: \"서울\" } } })"}</span>
          </>
        )}
        <p className="text-amber-400 text-xs">가독성 저하 + 오타 위험 증가</p>
      </div>
    ),
  },
  {
    id: "immer",
    emoji: "✨",
    label: "그래서 나온 게 Immer",
    child: (
      <div className="space-y-3 text-sm text-foreground">
        <p>Immer는 <span className="text-amber-400">마법사 같은 도구</span>예요.</p>
        <p>"그냥 막 고쳐봐~" 하면 Immer가 뒤에서 새 박스 만들어서 돌려줘요.</p>
        {code(
          <>
            <span className="text-zinc-500">// before: 장황한 spread</span>
            {"\n"}
            <span className="text-red-400">{"setUser({ ...user, address: { ...user.address, city: \"서울\" } })"}</span>
            {"\n\n"}
            <span className="text-zinc-500">// after: Immer로 직접 수정</span>
            {"\n"}
            <span className="text-green-400">{"setUser(produce(draft => { draft.address.city = \"서울\" }))"}</span>
          </>
        )}
        <p className="text-green-400 font-medium">이제 그냥 바꾸면 된다.</p>
      </div>
    ),
    dev: (
      <div className="space-y-3 text-sm text-foreground">
        <p>
          Immer의{" "}
          <code className="rounded bg-zinc-800 px-1 text-xs text-indigo-300 light:text-zinc-700">produce()</code>
          는 Proxy 기반 임시 draft를 생성합니다.
          draft를 직접 변이해도 <span className="text-green-400">구조적 공유(structural sharing)</span>로
          새 불변 객체를 반환합니다.
        </p>
        {code(
          <>
            <span className="text-green-400">import</span>
            {" { produce } "}
            <span className="text-green-400">from</span>
            {" "}
            <span className="text-amber-400">"immer"</span>
            {"\n\n"}
            <span className="text-zinc-500">// 배열도 동일하게 직관적</span>
            {"\n"}
            <span className="text-green-400">{"setTodos(produce(draft => { draft.find(t => t.id === id).done = true }))"}</span>
          </>
        )}
        <p className="text-xs text-muted-foreground">
          → Zustand의 immer middleware, Redux Toolkit도 내부적으로 Immer 사용
        </p>
      </div>
    ),
  },
  {
    id: "habit",
    emoji: "🔁",
    label: "실무에서 자주 쓰는 패턴",
    child: (
      <div className="space-y-3 text-sm text-foreground">
        <p>이 세 가지만 기억하면 돼요:</p>
        {code(
          <>
            <span className="text-zinc-500">// 추가</span>
            {"\n"}
            <span className="text-green-400">{"setTodos(produce(draft => { draft.push(item) }))"}</span>
            {"\n\n"}
            <span className="text-zinc-500">// 수정</span>
            {"\n"}
            <span className="text-green-400">{"setTodos(produce(draft => { draft.find(t => t.id === id).done = true }))"}</span>
            {"\n\n"}
            <span className="text-zinc-500">// 삭제</span>
            {"\n"}
            <span className="text-green-400">{"setTodos(produce(draft => draft.filter(t => t.id !== id)))"}</span>
          </>
        )}
      </div>
    ),
    dev: (
      <div className="space-y-3 text-sm text-foreground">
        <p>Immer 없이 vs Immer 사용 전체 비교:</p>
        {code(
          <>
            <span className="text-zinc-500">// 추가 (vanilla)</span>
            {"\n"}
            <span className="text-amber-400">{"setTodos([...todos, item])"}</span>
            {"\n"}
            <span className="text-zinc-500">// 추가 (immer)</span>
            {"\n"}
            <span className="text-green-400">{"setTodos(produce(d => { d.push(item) }))"}</span>
            {"\n\n"}
            <span className="text-zinc-500">// 수정 (vanilla)</span>
            {"\n"}
            <span className="text-amber-400">{"setTodos(todos.map(t => t.id === id ? { ...t, done: true } : t))"}</span>
            {"\n"}
            <span className="text-zinc-500">// 수정 (immer)</span>
            {"\n"}
            <span className="text-green-400">{"setTodos(produce(d => { d.find(t => t.id === id).done = true }))"}</span>
          </>
        )}
        <p className="text-xs text-muted-foreground">중첩이 깊어질수록 Immer의 이점이 커짐</p>
      </div>
    ),
  },
  {
    id: "summary",
    emoji: "💡",
    label: "한 줄 핵심 요약",
    child: null,
    dev: null,
  },
]

export function Stage01Theory() {
  const { mode } = useExplanationStore()

  return (
    <div className="p-6">
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-foreground">불변성 & Immer</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "child"
            ? "🟢 초딩 모드 — 공감부터 시작하는 이야기"
            : "🔵 개발자 모드 — 참조 동일성과 React 내부 원리"}
        </p>
      </div>

      <div className="relative space-y-0">
        {STEPS.filter(step => step.id !== "summary").map((step, i) => (
          <div key={step.id} className="flex gap-4">
            {/* 좌측 타임라인 */}
            <div className="flex flex-col items-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-base">
                {step.emoji}
              </div>
              {i < STEPS.length - 2 && (
                <div className="w-px flex-1 bg-border my-1 min-h-[1rem]" />
              )}
            </div>

            {/* 우측 내용 */}
            <div className="flex-1 pb-6">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {step.label}
              </p>
              <div className="rounded-lg border border-border bg-card p-4">
                {mode === "child" ? step.child : step.dev}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 한 줄 요약 */}
      <div className="mt-2 rounded-lg border border-indigo-800/40 light:border-zinc-200 bg-indigo-950/20 light:bg-zinc-50 p-5 text-center">
        <p className="text-lg">💡</p>
        <p className="mt-2 text-base font-semibold text-indigo-300 light:text-teal-700">
          "React는 데이터를 보는 게 아니라, 주소가 바뀌었는지를 본다"
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          {mode === "child"
            ? "같은 박스면 화면 안 바뀜. 항상 새 박스(새 배열/객체)를 만들 것."
            : "mutation은 참조 동일성을 깨지 않아 리렌더 미트리거. 항상 새 참조 반환 필요. Immer로 ergonomic하게 해결."}
        </p>
      </div>
    </div>
  )
}
