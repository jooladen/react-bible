// Learn Sandbox Layout
// 샌드박스 전용 레이아웃 — 사이드바 없는 단순 래퍼
// 이 파일과 learn/ 폴더를 통째로 삭제해도 나머지 앱에 영향 없음
export default function LearnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen" style={{ padding: '2rem', paddingLeft: '3.5rem' }}>
      <div className="mb-4 text-xs text-muted-foreground font-mono">
        🧪 learn sandbox — 테스트용 페이지
      </div>
      <style>{`.learn-sandbox, .learn-sandbox * { all: revert; }`}</style>
      <div className="learn-sandbox">
        {children}
      </div>
    </div>
  )
}
