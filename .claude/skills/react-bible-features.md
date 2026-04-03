---
name: react-bible-features
description: react-bible 스테이지 추가 패턴 — features/ 구조, theory/playground/code-viewer 컨벤션. Use when adding or modifying a stage.
type: project
---

# react-bible Features Skill

## 스테이지 구조

각 스테이지는 `src/features/stage-{NN}-{slug}/` 폴더에 위치:
- `theory.tsx` — 이론 컴포넌트 (필수)
- `playground.tsx` — 인터랙티브 실습 (선택)
- `code-viewer.tsx` — 코드 뷰어 (선택)

## Theory 컴포넌트 패턴

### 명명 규칙
- export 함수명: `Stage{N}Theory` (예: `Stage01Theory`, `Stage12Theory`)
- 파일 내 데이터 배열: `CONCEPTS: ConceptCard[]`

### ConceptCard 타입
```ts
type ConceptCard = {
  title: string
  icon: string          // 이모지
  child: React.ReactNode  // 초딩 설명
  dev: React.ReactNode    // 개발자 설명
}
```

### 이중 설명 렌더링
```tsx
const { mode } = useExplanationStore()
// mode === "child" → 초딩 설명 / mode === "dev" → 개발자 설명
{mode === "child" ? concept.child : concept.dev}
```

### 레이아웃 구조
```tsx
<div className="p-6">
  {/* 헤더 */}
  <div className="mb-6">
    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    <p className="mt-1 text-sm text-muted-foreground">
      {mode === "child" ? "🟢 초딩 모드 — ..." : "🔵 개발자 모드 — ..."}
    </p>
  </div>

  {/* 컨셉 카드 그리드 */}
  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
    {CONCEPTS.map((concept) => (
      <Card key={concept.title} className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <span>{concept.icon}</span>
            <span className="text-foreground">{concept.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mode === "child" ? concept.child : concept.dev}
        </CardContent>
      </Card>
    ))}
  </div>

  {/* 핵심 요약 박스 */}
  <div className="mt-6 rounded-lg border border-indigo-800/40 light:border-zinc-200 bg-indigo-950/20 light:bg-zinc-50 p-4">
    <p className="text-sm font-medium text-indigo-300 light:text-zinc-700">
      {mode === "child" ? "🎯 핵심 요약" : "🎯 핵심 원칙"}
    </p>
    <p className="mt-1 text-sm text-foreground">
      {mode === "child" ? "초딩 요약..." : "개발자 요약..."}
    </p>
  </div>
</div>
```

### 코드 블록 스타일 (인라인)
```tsx
<div className="mt-3 rounded-md bg-zinc-900 p-3 font-mono text-xs leading-relaxed text-zinc-100 whitespace-pre-wrap">
  <span className="text-red-400">// ❌ 나쁜 예</span>
  {"\n"}arr.push(item){"\n\n"}
  <span className="text-green-400">// ✅ 좋은 예</span>
  {"\n"}[...arr, item]
</div>
```

### 강조 색상 컨벤션
- 다크: `text-indigo-400` (개념/코드), `text-amber-400` (중요), `text-red-400` (나쁜예), `text-green-400` (좋은예)
- 라이트: `light:text-zinc-700`, `light:text-teal-700`

## 페이지 연결

⚠️ 개별 `page.tsx` 파일을 새로 만들지 말 것.
`src/app/stage/[slug]/page.tsx` 하나가 전체 스테이지를 처리한다.
`generateStaticParams()`가 이미 STAGES 전체를 정적 경로로 등록해놓았다.

**할 일: `STAGE_CONTENT` 맵에 항목 1개 추가**

```tsx
// src/app/stage/[slug]/page.tsx 의 STAGE_CONTENT 객체
const STAGE_CONTENT: Record<string, { Theory, Playground, CodeViewer }> = {
  immutability: { ... },  // 기존

  // 새 스테이지 추가 — 이 한 항목만 추가하면 됨
  "{slug}": {
    Theory: dynamic(() =>
      import("@/features/stage-{NN}-{slug}/theory").then((m) => ({
        default: m.Stage{N}Theory,
      }))
    ),
    Playground: dynamic(() =>
      import("@/features/stage-{NN}-{slug}/playground").then((m) => ({
        default: m.Stage{N}Playground,
      }))
    ),
    CodeViewer: dynamic(() =>
      import("@/features/stage-{NN}-{slug}/code-viewer").then((m) => ({
        default: m.Stage{N}CodeViewer,
      }))
    ),
  },
}
```

playground/code-viewer가 미구현이면 해당 키 생략 가능.
StageLayout이 없는 탭에 자동으로 🚧 "다음 세션에서 구현" UI를 표시한다.

## `lib/stages.ts`에 스테이지 추가

```ts
{
  id: N,
  slug: "slug-name",       // URL 경로, kebab-case
  title: "제목",
  subtitle: "부제목",
  concept: "한 줄 개념 설명.",
  difficulty: "easy" | "medium" | "hard",
  group: 1 | 2 | 3 | 4,
  groupName: "그룹명",
  status: "todo",          // 초기값 항상 "todo"
}
```

## 미구현 탭 처리
playground나 code를 prop으로 전달하지 않으면 StageLayout이 자동으로 🚧 "다음 세션에서 구현" UI를 표시합니다.
