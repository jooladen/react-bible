import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getStageBySlug, STAGES } from "@/lib/stages"
import { StageLayout } from "@/components/layout/stage-layout"

type Props = {
  params: Promise<{ slug: string }>
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

  return (
    <div className="h-full">
      <StageLayout
        stage={stage}
        // theory, playground, code 콘텐츠는 각 Stage 구현 시 주입됩니다.
        // 예: theory={<Stage01Theory />}
      />
    </div>
  )
}
