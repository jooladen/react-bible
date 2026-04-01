import { notFound } from "next/navigation"
import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { getStageBySlug, STAGES } from "@/lib/stages"
import { StageLayout } from "@/components/layout/stage-layout"

type Props = {
  params: Promise<{ slug: string }>
}

// Design Ref: §4.4 — slug별 dynamic import 맵. 새 Stage 추가 시 여기에만 한 항목 추가
const STAGE_CONTENT: Record<
  string,
  {
    Theory: React.ComponentType
    Playground: React.ComponentType
    CodeViewer: React.ComponentType
  }
> = {
  immutability: {
    Theory: dynamic(() =>
      import("@/features/stage-01-immutability/theory").then((m) => ({
        default: m.Stage01Theory,
      }))
    ),
    Playground: dynamic(() =>
      import("@/features/stage-01-immutability/playground").then((m) => ({
        default: m.Stage01Playground,
      }))
    ),
    CodeViewer: dynamic(() =>
      import("@/features/stage-01-immutability/code-viewer").then((m) => ({
        default: m.Stage01CodeViewer,
      }))
    ),
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const stage = getStageBySlug(slug)
  if (!stage) return { title: "Stage Not Found" }
  return {
    title: `${String(stage.id).padStart(2, "0")}. ${stage.title} — React Bible`,
    description: stage.concept,
  }
}

export function generateStaticParams() {
  return STAGES.map((stage) => ({ slug: stage.slug }))
}

export default async function StagePage({ params }: Props) {
  const { slug } = await params
  const stage = getStageBySlug(slug)

  if (!stage) notFound()

  const content = STAGE_CONTENT[slug]

  return (
    <div className="h-full">
      <StageLayout
        stage={stage}
        theory={content ? <content.Theory /> : undefined}
        playground={content ? <content.Playground /> : undefined}
        code={content ? <content.CodeViewer /> : undefined}
      />
    </div>
  )
}
