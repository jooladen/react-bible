# New Stage — 새 스테이지 추가

react-bible에 새 학습 스테이지를 추가하는 절차입니다.

## 1. `src/lib/stages.ts`에 Stage 데이터 추가

```ts
{
  id: N,                    // 다음 순번
  slug: "slug-name",        // URL 경로 (kebab-case)
  title: "스테이지 제목",
  subtitle: "부제목",
  concept: "핵심 개념 한 줄 요약.",
  difficulty: "easy" | "medium" | "hard",
  group: 1 | 2 | 3 | 4,
  groupName: "그룹 이름",
  status: "todo",           // 초기값은 항상 "todo"
}
```

## 2. Feature 폴더 생성

```
src/features/stage-{NN}-{slug}/
  theory.tsx       # 이론 컴포넌트
  playground.tsx   # 인터랙티브 실습 (선택)
  code-viewer.tsx  # 코드 뷰어 (선택)
```

### theory.tsx 템플릿

```tsx
"use client"

// Design Ref: §X.X — 이중 설명 (초딩/개발자) + shadcn Card 레이아웃
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
    title: "개념 제목",
    icon: "🎯",
    child: <div className="space-y-2 text-sm text-foreground">...</div>,
    dev: <div className="space-y-2 text-sm text-foreground">...</div>,
  },
]

export function Stage{N}Theory() {
  const { mode } = useExplanationStore()
  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">제목</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "child" ? "🟢 초딩 모드 — ..." : "🔵 개발자 모드 — ..."}
        </p>
      </div>
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
    </div>
  )
}
```

## 3. 기존 page.tsx의 STAGE_CONTENT 맵에 항목 추가

⚠️ 개별 page.tsx 파일을 새로 만들지 말 것.
`src/app/stage/[slug]/page.tsx` 하나가 전체 스테이지를 담당한다.

기존 `STAGE_CONTENT` 객체에 항목 1개만 추가:

```tsx
// src/app/stage/[slug]/page.tsx 의 STAGE_CONTENT 객체에 추가
{slug}: {
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
```

playground나 code-viewer를 아직 구현 안 했으면 해당 키를 생략해도 됨.
StageLayout이 prop이 없는 탭에 자동으로 🚧 UI를 표시한다.

## 4. 검증

```bash
pnpm exec tsc --noEmit   # 타입 에러 0건 확인
pnpm dev                  # 브라우저에서 /stage/{slug} 직접 확인
```
