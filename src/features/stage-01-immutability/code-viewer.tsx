"use client"

// Design Ref: §5.3 — shadcn Tabs 3개 + 수동 span 강조 (Prism 없이)
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"

type Snippet = {
  id: string
  label: string
  badge: string
  description: string
  when: string
  code: React.ReactNode
}

const SNIPPETS: Snippet[] = [
  {
    id: "mutation",
    label: "직접 변이",
    badge: "❌",
    description: "배열/객체를 직접 수정 — React가 변화를 감지하지 못합니다.",
    when: "절대 사용하지 마세요. useState와 함께 쓰면 화면이 갱신되지 않습니다.",
    code: (
      <pre className="overflow-x-auto rounded-lg bg-zinc-900 p-4 font-mono text-sm leading-relaxed">
        <span className="text-zinc-500">{"// ❌ 배열 직접 변이"}</span>{"\n"}
        <span className="text-indigo-400">{"const"}</span>
        {" [items, setItems] = "}
        <span className="text-yellow-400">{"useState"}</span>
        {"([])"}{"\n\n"}
        <span className="text-zinc-500">{"// 같은 배열 참조를 mutate"}</span>{"\n"}
        <span className="text-indigo-400">{"function"}</span>
        {" addItem(item) {"}{"\n"}
        {"  "}
        <span className="text-red-400">{"items.push(item)"}</span>
        {"  "}
        <span className="text-zinc-600">{"// ← 직접 변이!"}</span>{"\n"}
        {"  "}
        <span className="text-zinc-600">{"// setItems 호출 없음 → 리렌더 없음"}</span>{"\n"}
        {"}"}{"\n\n"}
        <span className="text-zinc-500">{"// Object.is(items, items) → true"}</span>{"\n"}
        <span className="text-zinc-500">{"// React: '안 바뀌었군' → 리렌더 스킵"}</span>
      </pre>
    ),
  },
  {
    id: "spread",
    label: "스프레드 연산자",
    badge: "✅",
    description: "새 배열/객체를 생성해 참조를 교체 — React가 변화를 감지합니다.",
    when:
      "배열/객체의 얕은(shallow) 업데이트에 사용하세요. 중첩이 1~2 레벨 이하일 때 적합합니다.",
    code: (
      <pre className="overflow-x-auto rounded-lg bg-zinc-900 p-4 font-mono text-sm leading-relaxed">
        <span className="text-zinc-500">{"// ✅ 새 참조 생성 (배열)"}</span>{"\n"}
        <span className="text-indigo-400">{"function"}</span>
        {" addItem(item) {"}{"\n"}
        {"  "}
        <span className="text-yellow-400">{"setItems"}</span>
        {"(prev => "}
        <span className="text-green-400">{"[...prev, item]"}</span>
        {")"}
        {"  "}
        <span className="text-zinc-600">{"// 새 배열!"}</span>{"\n"}
        {"}"}{"\n\n"}
        <span className="text-zinc-500">{"// ✅ 새 참조 생성 (객체)"}</span>{"\n"}
        <span className="text-indigo-400">{"function"}</span>
        {" updateName(name) {"}{"\n"}
        {"  "}
        <span className="text-yellow-400">{"setState"}</span>
        {"(prev => "}
        <span className="text-green-400">{"({ ...prev, name })"}</span>
        {")"}
        {"\n"}{"}"}{"\n\n"}
        <span className="text-zinc-500">{"// Object.is(prev, [...prev, item]) → false"}</span>{"\n"}
        <span className="text-zinc-500">{"// React: '바뀌었군!' → 리렌더 트리거"}</span>
      </pre>
    ),
  },
  {
    id: "immer",
    label: "Immer produce",
    badge: "✨",
    description: "draft를 직접 수정하듯 작성 — Immer가 새 불변 객체를 반환합니다.",
    when:
      "중첩이 깊은 객체(3레벨 이상)나 복잡한 배열 업데이트에 사용하세요. 스프레드보다 코드가 훨씬 간결해집니다.",
    code: (
      <pre className="overflow-x-auto rounded-lg bg-zinc-900 p-4 font-mono text-sm leading-relaxed">
        <span className="text-green-400">{"import"}</span>
        {" { produce } "}
        <span className="text-green-400">{"from"}</span>
        {" "}
        <span className="text-amber-400">{'"immer"'}</span>{"\n\n"}
        <span className="text-zinc-500">{"// ✨ 직접 수정처럼 보이지만 새 참조 반환"}</span>{"\n"}
        <span className="text-indigo-400">{"function"}</span>
        {" addTodo(text) {"}{"\n"}
        {"  "}
        <span className="text-yellow-400">{"setState"}</span>
        {"("}
        <span className="text-indigo-400">{"produce"}</span>
        {"(draft => {"}{"\n"}
        {"    "}
        <span className="text-amber-400">{"draft"}</span>
        {".todos.push({ text, done: "}
        <span className="text-indigo-400">{"false"}</span>
        {" })"}
        {"\n"}
        {"  "}{"}))"}
        {"\n"}{"}"}{"\n\n"}
        <span className="text-zinc-500">{"// 중첩 객체도 한 줄로:"}</span>{"\n"}
        <span className="text-indigo-400">{"produce"}</span>
        {"(state, draft => {"}{"\n"}
        {"  "}
        <span className="text-amber-400">{"draft"}</span>
        {".a.b.c.d = newValue  "}
        <span className="text-zinc-600">{"// 스프레드라면 4레벨..."}</span>{"\n"}
        {"})"}
      </pre>
    ),
  },
]

export function Stage01CodeViewer() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">코드 뷰어</h3>
        <p className="mt-1 text-sm text-zinc-500">
          불변성 업데이트 3가지 패턴을 코드로 비교해보세요.
        </p>
      </div>

      <Tabs defaultValue="mutation">
        <TabsList className="mb-4 bg-zinc-900">
          {SNIPPETS.map((s) => (
            <TabsTrigger
              key={s.id}
              value={s.id}
              className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100"
            >
              {s.badge} {s.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {SNIPPETS.map((s) => (
          <TabsContent key={s.id} value={s.id}>
            <div className="space-y-4">
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
                <p className="text-sm font-medium text-zinc-200">
                  {s.badge} {s.label}
                </p>
                <p className="mt-1 text-sm text-zinc-400">{s.description}</p>
              </div>

              {s.code}

              <div className="rounded-lg border border-zinc-800 p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  언제 쓰면 좋은가
                </p>
                <p className="mt-1 text-sm text-zinc-400">{s.when}</p>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
