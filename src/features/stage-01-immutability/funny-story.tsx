"use client"

// Design Ref: §1 — fiber3.md 원문 100% 그대로, 스타일링만 적용
// Design Ref: §2 — deepdive variant 재사용, theory.child = theory.dev 동일 콘텐츠
import type { TopicTab } from "@/types/combined-stage"

// ─── 스타일 헬퍼 (deep-dive.tsx와 동일) ──────────────────────────────────────

function Em({ children }: { children: React.ReactNode }) {
  return <strong className="text-indigo-300 light:text-teal-700 font-semibold">{children}</strong>
}

function Warn({ children }: { children: React.ReactNode }) {
  return <strong className="text-amber-400 light:text-amber-600 font-semibold">{children}</strong>
}

function Good({ children }: { children: React.ReactNode }) {
  return <strong className="text-green-400 light:text-green-600 font-semibold">{children}</strong>
}

// ─── 질문 박스 ────────────────────────────────────────────────────────────────

function QuestionBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-amber-500/40 bg-amber-950/20 light:bg-amber-50 light:border-amber-300 p-4">
      <p className="text-xs font-semibold text-amber-400 light:text-amber-600 mb-2">🙋 질문</p>
      <p className="text-sm font-medium text-foreground leading-relaxed">{children}</p>
    </div>
  )
}

// ─── 비교표 공통 스타일 ───────────────────────────────────────────────────────

function CompareTable({ headers, rows }: {
  headers: string[]
  rows: string[][]
}) {
  return (
    <div className="overflow-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-indigo-950/30 light:bg-indigo-50">
            {headers.map((h) => (
              <th key={h} className="border border-border px-3 py-2 text-left text-xs font-semibold text-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="even:bg-zinc-900/30 light:even:bg-zinc-50">
              {row.map((cell, j) => (
                <td key={j} className="border border-border px-3 py-2 text-xs text-muted-foreground leading-relaxed">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── 콘텐츠 ──────────────────────────────────────────────────────────────────

function FunnyStoryContent() {
  return (
    <div className="space-y-12 text-sm text-foreground max-w-3xl pb-8">

      {/* ══════════════════════════════════════════════════
          Q1: 파이버는 똥끊기라고 했는데 왜 장부?
      ══════════════════════════════════════════════════ */}
      <div className="space-y-6">
        <QuestionBox>
          파이버는 똥끊기라고 했는데 왜 장부?
        </QuestionBox>

        {/* 도입 */}
        <p className="text-muted-foreground leading-relaxed mt-4">
          오, 아주 날카로운 질문입니다! <Em>"똥 끊기(Incremental Rendering)"</Em>와 <Em>"장부(State Management)"</Em>라는
          두 비유가 서로 안 맞는 것처럼 보일 수 있지만, 사실 <Em>파이버(Fiber)</Em>라는 녀석은 이 두 가지를 동시에
          해내기 위해 탄생한 아주 영리한 구조체입니다.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          시니어의 언어로 비유하자면, 파이버는 <Em>"중간 저장(Checkpoint) 기능이 있는 작업 명세서"</Em>입니다.
          왜 똥을 끊기 위해 장부가 필요한지 그 필연적인 이유를 설명해 드릴게요.
        </p>

        {/* 1. 왜 장부가 필요한가 */}
        <section className="space-y-3 pt-4 mt-4">
          <h3 className="text-base font-bold text-foreground border-b border-border pb-2">
            1. 왜 "똥 끊기"에 "장부"가 필요한가? (The Logic)
          </h3>
          <div className="rounded-lg border border-border bg-card p-4 space-y-2 text-sm text-muted-foreground leading-relaxed">
            <p className="font-semibold text-foreground">고통의 시나리오:</p>
            <p>
              아주 긴 똥(복잡한 화면 업데이트)을 싸고 있는데, 갑자기 급한 전화(사용자의 클릭 이벤트)가 왔습니다.
              리액트는 이 전화를 받기 위해 하던 일을 잠시 <Em>'멈춰야(끊어야)'</Em> 합니다.
            </p>
            <p>
              <Warn>문제:</Warn> 그냥 멈추고 나중에 다시 돌아왔을 때,{" "}
              <Warn>"내가 어디까지 쌌더라? 아까 계산하던 숫자가 뭐였지?"</Warn>를 까먹으면
              처음부터 다시 싸야 합니다.
            </p>
            <p>
              <Good>해결:</Good> 그래서 파이버는 작업을 멈추는 순간, 그때까지의 상태와 진행 상황을{" "}
              <Em>'장부(Fiber 객체)'</Em>에 기록해 둡니다.
            </p>
            <p>
              즉, 파이버가 <Em>'장부'</Em> 역할을 하기 때문에, 안심하고 작업을{" "}
              <Em>'끊었다가(똥 끊기)'</Em> 나중에 그 장부를 보고 다시 시작할 수 있는 것입니다.
            </p>
          </div>
        </section>

        {/* 2. 주어와 목적어로 보는 파이버의 행동 */}
        <section className="space-y-3 pt-4 mt-4">
          <h3 className="text-base font-bold text-foreground border-b border-border pb-2">
            2. 주어와 목적어로 보는 파이버의 행동 (누가 누구에게)
          </h3>

          {/* ① 작업 중단 시 */}
          <div className="rounded-lg border border-indigo-500/30 bg-indigo-950/10 light:bg-indigo-50 light:border-indigo-200 p-4 space-y-2">
            <p className="font-bold text-foreground">① 작업 중단 시 (똥 끊을 때)</p>
            <div className="text-sm text-muted-foreground space-y-1 leading-relaxed">
              <p><span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">주어: </span>파이버가</p>
              <p><span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">목적어: </span>지금까지 계산한 데이터와 다음 작업 위치를</p>
              <p><span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">행동: </span><Em>자신의 메모리(장부)</Em>에 <Em>'일시 정지'</Em> 마크와 함께 저장합니다.</p>
              <p className="text-xs text-muted-foreground mt-1">
                이유: 그래야 스케줄러가 "급한 불 껐으니까 다시 일해!"라고 할 때, 장부를 보고 멈췄던 지점부터 정확히 재개할 수 있기 때문입니다.
              </p>
            </div>
          </div>

          {/* ② 작업 재개 시 */}
          <div className="rounded-lg border border-indigo-500/30 bg-indigo-950/10 light:bg-indigo-50 light:border-indigo-200 p-4 space-y-2">
            <p className="font-bold text-foreground">② 작업 재개 시 (다시 시작할 때)</p>
            <div className="text-sm text-muted-foreground space-y-1 leading-relaxed">
              <p><span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">주어: </span>파이버가</p>
              <p><span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">목적어: </span><Em>장부에 적힌 이전 상태값(memoizedState)</Em>을</p>
              <p><span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">행동: </span>컴포넌트 함수에게 다시 던져주며 "아까 여기까지 했어, 계속해!"라고 시킵니다.</p>
              <p className="text-xs text-muted-foreground mt-1">
                이유: 이 장부가 없으면 리액트는 매번 "최초 로딩"처럼 처음부터 끝까지 다 그려야 해서 화면이 버벅이게 됩니다.
              </p>
            </div>
          </div>
        </section>

        {/* 3. 비교표 */}
        <section className="space-y-3 pt-4 mt-4">
          <h3 className="text-base font-bold text-foreground border-b border-border pb-2">
            3. "장부"가 곧 "똥 끊기"의 핵심 부품인 이유
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            리액트 이전의 가상 돔(V-DOM)은 한 번 시작하면 끝을 봐야 하는 <Warn>'재귀적 구조'</Warn>였습니다.
            하지만 파이버는 이를 <Em>'선형적인 장부(연결 리스트)'</Em> 구조로 바꿨습니다.
          </p>
          <CompareTable
            headers={["구분", "과거 (Stack Reconciler)", "현재 (Fiber Reconciler)"]}
            rows={[
              ["비유", "폭포수: 한 번 떨어지면 중간에 못 멈춤", "체크포인트 게임: 죽어도 저장된 곳부터 시작"],
              ["구조", "함수 호출 스택 (멈추면 정보 날아감)", "객체 기반 장부 (멈춰도 정보 보존)"],
              ["똥 끊기", "불가능 (한 번에 다 싸야 함)", "가능 (끊어서 싸도 장부가 기억함)"],
            ]}
          />
        </section>

        {/* 4. 한 줄 정리 */}
        <div className="rounded-lg border border-indigo-800/40 light:border-zinc-200 bg-indigo-950/20 light:bg-zinc-50 p-5 text-center">
          <p className="text-lg">💡</p>
          <p className="mt-2 text-sm font-semibold text-indigo-300 light:text-teal-700 leading-relaxed">
            <Em>시니어의 한 줄 정리:</Em>{" "}
            "파이버(Fiber)는 작업을 쪼개서 수행(Incremental Rendering)하기 위해,<br />
            각 작업의 진행 상태를 저장하는 <Em>'메모리 보관소(장부)'</Em>입니다.<br />
            장부가 없으면 끊기가 안 되고, 끊기가 안 되면 화면은 버벅입니다."
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          Q2: 그럼 이걸 좀 다르게 써야겠는데...만들어줘
      ══════════════════════════════════════════════════ */}
      <div className="space-y-6">
        <QuestionBox>
          그럼 이걸 좀 다르게 써야 겠는데....만들어줘
        </QuestionBox>

        {/* 도입 */}
        <p className="text-muted-foreground leading-relaxed">
          맞습니다. <Em>"똥 끊기(Incremental Rendering)"</Em>라는 파이버의 핵심 기능을 더 잘 드러내려면,
          단순한 '기록'을 넘어 <Em>'언제든 멈췄다 돌아올 수 있는 체크포인트'</Em>라는 점을 강조해서 표현해야 합니다.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          20년 차 시니어가 주니어에게 코드를 리뷰해 주듯, 파이버의 "일시 정지 및 재개" 능력을 넣어서 문구를 다시 매핑해 드릴게요.
        </p>

        {/* 1. 소스 매핑 */}
        <section className="space-y-3 pt-4 mt-4">
          <h3 className="text-base font-bold text-foreground border-b border-border pb-2">
            1. 파이버의 '똥 끊기' 능력을 강조한 소스 매핑
          </h3>
          <div className="rounded-md bg-zinc-900 light:bg-zinc-50 p-4 font-mono text-xs leading-7 text-zinc-100 light:text-zinc-800 overflow-auto">
            <div><span className="text-zinc-500">01:</span> <span className="text-purple-400">import</span> React, {"{ useState }"} <span className="text-purple-400">from</span> <span className="text-green-400">'react'</span>;</div>
            <div><span className="text-zinc-500">02:</span> </div>
            <div><span className="text-zinc-500">03:</span> <span className="text-purple-400">export default function</span> <span className="text-yellow-400">Counter</span>() {"{"}</div>
            <div><span className="text-zinc-500">04:</span>   <span className="text-zinc-400">{"// [A. 최초 로딩 & 체크포인트 설정]"}</span></div>
            <div><span className="text-zinc-500">05:</span>   <span className="text-zinc-400">{"// '파이버야, 나중에 작업 끊고 돌아와도 길 안 잃게,"}</span></div>
            <div><span className="text-zinc-500">06:</span>   <span className="text-zinc-400">{"// 여기 0번 도로명 주소에 '0'이라는 값을 이정표로 세워둬.'"}</span></div>
            <div><span className="text-zinc-500">07:</span>   <span className="text-blue-400">const</span> [count, setCount] = <span className="text-yellow-400">useState</span>(<span className="text-orange-400">0</span>);</div>
            <div><span className="text-zinc-500">08:</span> </div>
            <div><span className="text-zinc-500">09:</span>   <span className="text-blue-400">const</span> <span className="text-yellow-400">handleLevelUp</span> = () =&gt; {"{"}</div>
            <div><span className="text-zinc-500">10:</span>     <span className="text-zinc-400">{"// [B. 업데이트 & 스케줄링]"}</span></div>
            <div><span className="text-zinc-500">11:</span>     <span className="text-zinc-400">{"// '순경(Scheduler)아, 클릭 들어왔다!"}</span></div>
            <div><span className="text-zinc-500">12:</span>     <span className="text-zinc-400">{"// 지금 똥 싸는 중이면 잠시 끊고(Interrupt), 이 클릭부터 처리한 뒤 다시 돌아와!'"}</span></div>
            <div><span className="text-zinc-500">13:</span>     <span className="text-yellow-400">setCount</span>(count + <span className="text-orange-400">1</span>);</div>
            <div><span className="text-zinc-500">14:</span>   {"}"};</div>
            <div><span className="text-zinc-500">15:</span> </div>
            <div><span className="text-zinc-500">16:</span>   <span className="text-zinc-400">{"// [C. 재조정 & 작업 단위 쪼개기]"}</span></div>
            <div><span className="text-zinc-500">17:</span>   <span className="text-zinc-400">{"// '리컨실러야, 이 설계도를 한 번에 다 그리려고 하지 말고,"}</span></div>
            <div><span className="text-zinc-500">18:</span>   <span className="text-zinc-400">{"// 파이버 장부 보면서 중간중간 쉬엄쉬엄(똥 끊으며) 비교해봐.'"}</span></div>
            <div><span className="text-zinc-500">19:</span>   <span className="text-purple-400">return</span> (</div>
            <div><span className="text-zinc-500">20:</span>     &lt;<span className="text-red-400">div</span> className=<span className="text-green-400">"p-4"</span>&gt;</div>
            <div><span className="text-zinc-500">21:</span>       &lt;<span className="text-red-400">h1</span> className=<span className="text-green-400">"text-2xl"</span>&gt;레벨: {"{count}"}&lt;/<span className="text-red-400">h1</span>&gt;</div>
            <div><span className="text-zinc-500">22:</span>       &lt;<span className="text-red-400">button</span> onClick={"{handleLevelUp}"}&gt;레벨업!&lt;/<span className="text-red-400">button</span>&gt;</div>
            <div><span className="text-zinc-500">23:</span>     &lt;/<span className="text-red-400">div</span>&gt;</div>
            <div><span className="text-zinc-500">24:</span>   );</div>
            <div><span className="text-zinc-500">25:</span>{"}"}</div>
          </div>
        </section>

        {/* 2. 왜 바꿔야 하나 */}
        <section className="space-y-3 pt-4">
          <h3 className="text-base font-bold text-foreground border-b border-border pb-2">
            2. 왜 문구를 이렇게 바꿔야 하나요? (이유와 고통 해결)
          </h3>

          <div className="rounded-lg border border-indigo-500/30 bg-indigo-950/10 light:bg-indigo-50 light:border-indigo-200 p-4 space-y-2">
            <p className="font-bold text-foreground">① "기록" → "이정표(Checkpoint)"로 변경한 이유</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <Em>이유:</Em> 파이버는 단순 저장이 목적이 아닙니다. 작업을 10%만 하고 멈췄을 때,
              나중에 돌아와서 <Em>"아까 10% 지점 이정표가 여기네!"</Em>라고 찾아오기 위한 장치입니다.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <Good>고통 해결:</Good> 예전 리액트는 작업을 시작하면 화면 전체가 다 그려질 때까지 브라우저가
              먹통(화면 멈춤)이 되었습니다. 이제는 파이버가 이정표를 세워두기 때문에, 중간에 일을 멈추고
              사용자의 클릭을 먼저 처리할 수 있습니다.
            </p>
          </div>

          <div className="rounded-lg border border-indigo-500/30 bg-indigo-950/10 light:bg-indigo-50 light:border-indigo-200 p-4 space-y-2">
            <p className="font-bold text-foreground">② "순서 관리" → "도로명 주소"로 변경한 이유</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <Em>이유:</Em> 파이버 수첩의 칸막이는 절대적인 주소와 같습니다.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <Good>고통 해결:</Good> 훅의 순서가 바뀌면 주소가 엉망이 되어버립니다.{" "}
              "강남구 역삼동" 주소에 가야 할 택배(데이터)가 주소가 바뀌어 "종로구"로 가는 꼴이죠.
              그래서 파이버는 <Em>"이정표의 순서(주소)가 바뀌면 안 된다"</Em>는 철칙을 가집니다.
            </p>
          </div>
        </section>

        {/* 3. 초딩용 + 개발자용 통합 설명 */}
        <section className="space-y-3 pt-4 mt-4">
          <h3 className="text-base font-bold text-foreground border-b border-border pb-2">
            3. 초딩용 + 개발자용 통합 설명 (보완판)
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-indigo-500/30 bg-indigo-950/10 light:bg-indigo-50 light:border-indigo-200 p-4 space-y-2">
              <p className="font-bold text-foreground">👦 초딩용: "이어달리기와 세이브 포인트"</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                "옛날 리액트는 운동장을 한 바퀴 다 돌 때까지 아무도 방해 못 하는 무서운 달리기였어.
                근데 파이버는 달리기 중간에 <Em>'깃발(이정표)'</Em>을 꽂아둬. 그래서 엄마가 밥 먹으라고 부르면(클릭 이벤트),
                깃발 자리에 멈춰 서서 밥 먹고 온 다음, 처음부터 다시 안 뛰고 그 깃발부터 다시 뛸 수 있는 거야!"
              </p>
            </div>
            <div className="rounded-lg border border-purple-500/30 bg-purple-950/10 light:bg-purple-50 light:border-purple-200 p-4 space-y-2">
              <p className="font-bold text-foreground">👨‍💻 개발자용: "상태 보존형 가상 스택 (Stateful Virtual Stack)"</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                "파이버는 콜 스택(Call Stack)의 한계를 극복하기 위해 만들어진 가상 스택 프레임입니다.
                함수 실행 컨텍스트를 파이버라는 객체에 힙(Heap) 저장함으로써, 실행 도중 양보(Yield)가 가능해졌습니다.
                최초 로딩 시 설정하는 useState는 이 가상 스택의 특정 인덱스에 데이터를 바인딩하는 행위이며,
                이 주소값이 유지되어야만 비동기적 렌더링(똥 끊기) 상황에서도 데이터 일관성을 유지할 수 있습니다."
              </p>
            </div>
          </div>
        </section>

        {/* 4. 시니어의 팁 */}
        <div className="rounded-lg border border-indigo-800/40 light:border-zinc-200 bg-indigo-950/20 light:bg-zinc-50 p-5 text-center">
          <p className="text-lg">💡</p>
          <p className="mt-2 text-sm font-semibold text-indigo-300 light:text-teal-700 leading-relaxed">
            <Em>시니어의 팁:</Em>{" "}
            파이버를 <Em>'장부'</Em>라고 부르는 이유는 그 안에{" "}
            <Em>'어디까지 일했는지(Work Tag)'</Em>와 <Em>'무슨 데이터로 일했는지(State)'</Em>가 모두 적혀 있기 때문입니다.
            이 장부가 없으면 리액트는 '똥 끊기'라는 마법을 부릴 수 없습니다.
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          Q3: 10분짜리 작업 중이라도 클릭 오면 중단?
      ══════════════════════════════════════════════════ */}
      <div className="space-y-6">
        <QuestionBox>
          그럼 사용자가 이벤트를 누르는 순간....설령 10분짜리 작업중이라도 일단 중지 하고 클릭부터 처리한다는거네?
        </QuestionBox>

        {/* 도입 */}
        <p className="text-muted-foreground leading-relaxed  mt-4">
          네, 정확합니다! 바로 그 지점이 리액트가 <Em>파이버(Fiber)</Em>라는 새로운 엔진을 도입한 핵심 이유입니다.
          20년 차 시니어의 눈으로 보면 이것은 <Em>'협력적 멀티태스킹(Cooperative Multitasking)'</Em>이
          프런트엔드에 구현된 모습입니다.
        </p>

        {/* 1. 3단계 긴급 작전 */}
        <section className="space-y-3 pt-4  mt-4">
          <h3 className="text-base font-bold text-foreground border-b border-border pb-2">
            1. 사용자가 클릭하는 순간의 3단계 긴급 작전
          </h3>

          {/* Step 1 */}
          <div className="rounded-lg border border-amber-500/30 bg-amber-950/10 light:bg-amber-50 light:border-amber-200 p-4 space-y-2">
            <p className="font-bold text-foreground">Step 1: <Em>스케줄러(Scheduler)</Em>의 긴급 제동</p>
            <div className="text-sm text-muted-foreground space-y-1 leading-relaxed">
              <p><span className="text-xs font-semibold uppercase tracking-wide">주어: </span>스케줄러가</p>
              <p><span className="text-xs font-semibold uppercase tracking-wide">목적어: </span>현재 진행 중이던 10분짜리 무거운 작업을</p>
              <p><span className="text-xs font-semibold uppercase tracking-wide">행동: </span>일시 정지(Pause) 시킵니다.</p>
              <p className="text-xs mt-1">
                이유: 옛날 리액트(Stack Reconciler)는 한 번 시작하면 끝날 때까지 브라우저를 꽉 잡고 안 놔줬습니다.
                그래서 10분짜리 작업 중에는 버튼을 눌러도 반응이 없는 <Warn>'프리징(Freezing)'</Warn> 현상이 생겼죠.
                스케줄러는 이를 막기 위해 "잠깐 멈춰! 클릭부터 처리해!"라고 명령합니다.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-lg border border-indigo-500/30 bg-indigo-950/10 light:bg-indigo-50 light:border-indigo-200 p-4 space-y-2">
            <p className="font-bold text-foreground">Step 2: <Em>파이버(Fiber)</Em>의 중간 저장 (똥 끊기)</p>
            <div className="text-sm text-muted-foreground space-y-1 leading-relaxed">
              <p><span className="text-xs font-semibold uppercase tracking-wide">주어: </span>파이버가</p>
              <p><span className="text-xs font-semibold uppercase tracking-wide">목적어: </span>지금까지 계산했던 데이터와 현재 위치를</p>
              <p><span className="text-xs font-semibold uppercase tracking-wide">행동: </span><Em>자신의 장부(메모리)</Em>에 <Em>'세이브 포인트'</Em>로 기록합니다.</p>
              <p className="text-xs mt-1">
                이유: 그냥 멈추기만 하면 나중에 돌아왔을 때 처음부터 다시 계산해야 합니다.
                파이버는 "여기까지는 계산 완료!"라고 장부에 적어두기 때문에,
                클릭 처리가 끝난 후 정확히 그 지점부터 다시 일을 시작할 수 있습니다.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-lg border border-green-500/30 bg-green-950/10 light:bg-green-50 light:border-green-200 p-4 space-y-2">
            <p className="font-bold text-foreground">Step 3: <Em>렌더러(Renderer)</Em>의 빠른 응답</p>
            <div className="text-sm text-muted-foreground space-y-1 leading-relaxed">
              <p><span className="text-xs font-semibold uppercase tracking-wide">주어: </span>렌더러가</p>
              <p><span className="text-xs font-semibold uppercase tracking-wide">목적어: </span>사용자가 누른 클릭 이벤트에 대한 화면 변화를</p>
              <p><span className="text-xs font-semibold uppercase tracking-wide">행동: </span>브라우저에 즉시 반영합니다.</p>
              <p className="text-xs mt-1">
                이유: 사용자는 10분짜리 작업이 뒤에서 돌아가고 있다는 사실을 모른 채,
                버튼을 누르자마자 즉각적인 피드백(버튼 눌림 효과, 팝업 등)을 받게 됩니다.
                앱이 <Good>"살아있다"</Good>고 느끼게 되는 것이죠.
              </p>
            </div>
          </div>
        </section>

        {/* 2. 소스 코드 매핑 */}
        <section className="space-y-3 pt-4  mt-4">
          <h3 className="text-base font-bold text-foreground border-b border-border pb-2">
            2. 소스 코드 매핑 (긴급 중단 상황)
          </h3>
          <div className="rounded-md bg-zinc-900 light:bg-zinc-50 p-4 font-mono text-xs leading-7 text-zinc-100 light:text-zinc-800 overflow-auto">
            <div><span className="text-zinc-500">08:</span> <span className="text-blue-400">const</span> <span className="text-yellow-400">handleLevelUp</span> = () =&gt; {"{"}</div>
            <div><span className="text-zinc-500">09:</span>   <span className="text-zinc-400">{"// [클릭 발생!]"}</span></div>
            <div><span className="text-zinc-500">10:</span>   <span className="text-zinc-400">{"// 1. 스케줄러: '야! 지금 렌더링하던 거 멈춰! 이 함수가 우선순위 더 높아!'"}</span></div>
            <div><span className="text-zinc-500">11:</span>   <span className="text-zinc-400">{"// 2. 파이버: '오케이, 하던 작업 장부에 세이브하고, 이 버튼 클릭 로직부터 실행할게.'"}</span></div>
            <div><span className="text-zinc-500">12:</span>   <span className="text-yellow-400">setCount</span>(count + <span className="text-orange-400">1</span>);</div>
            <div><span className="text-zinc-500">13:</span>{"}"}</div>
            <div><span className="text-zinc-500">14:</span></div>
            <div><span className="text-zinc-500">19:</span> <span className="text-purple-400">return</span> (</div>
            <div><span className="text-zinc-500">20:</span>   <span className="text-zinc-400">{"// [리액트 엔진 내부]"}</span></div>
            <div><span className="text-zinc-500">21:</span>   <span className="text-zinc-400">{"// 리컨실러가 1000개의 목록을 비교하다가 500개쯤에서 멈췄습니다."}</span></div>
            <div><span className="text-zinc-500">22:</span>   <span className="text-zinc-400">{"// 장부에 '500번까지 완료'라고 적고, 사용자의 클릭을 처리하러 떠납니다."}</span></div>
            <div><span className="text-zinc-500">23:</span>   &lt;<span className="text-red-400">div</span> className=<span className="text-green-400">"p-4"</span>&gt; ... &lt;/<span className="text-red-400">div</span>&gt;</div>
            <div><span className="text-zinc-500">24:</span>);</div>
          </div>
        </section>

        {/* 3. 비교표 */}
        <section className="space-y-3 pt-4">
          <h3 className="text-base font-bold text-foreground border-b border-border pb-2">
            3. 왜 이렇게 "고통스럽게" 설계했나요?
          </h3>
          <CompareTable
            headers={["상황", "파이버 이전 (동기적)", "파이버 이후 (동시성)"]}
            rows={[
              ["작업 중 클릭", "화면이 굳어서 아무 반응 없음 (고통)", "클릭에 즉각 반응함 (쾌적)"],
              ["대규모 데이터", "브라우저가 '응답 없음' 팝업을 띄움", "뒤에서 조용히 끊어서 작업함"],
              ["개발자 경험", "최적화를 위해 코드가 지저분해짐", "리액트가 알아서 해주니 비즈니스 로직에 집중"],
            ]}
          />
        </section>

        {/* 4. 최종 정리 배너 */}
        <div className="rounded-lg border border-indigo-800/40 light:border-zinc-200 bg-indigo-950/20 light:bg-zinc-50 p-5 text-center">
          <p className="text-lg">💡</p>
          <p className="mt-2 text-sm font-semibold text-indigo-300 light:text-teal-700 leading-relaxed">
            <Em>초보자를 위한 최종 정리</Em><br />
            파이버는 왜 장부인가? → 멈췄을 때 어디까지 했는지 기억해야 하니까요.<br />
            파이버는 왜 똥끊기인가? → 한 번에 다 하면 브라우저가 힘들어하니까 나눠서 하려고요.<br />
            <br />
            결론: 파이버라는 <Em>'똑똑한 장부 관리자'</Em>가 있기 때문에,<br />
            리액트는 <Em>'아무리 큰 작업 중이라도 사용자의 부름에 즉시 대답할 수 있는 매너 있는 엔진'</Em>이 된 것입니다.
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          Q4: useTransition 안 써도 작동함?
      ══════════════════════════════════════════════════ */}
      <div className="space-y-6">
        <QuestionBox>
          useTransition써야 된다며? 기본 소스에서도 그냥 작동함? useTransition안써도?
        </QuestionBox>

        {/* 도입 */}
        <p className="text-muted-foreground leading-relaxed">
          20년 차 시니어의 날카로운 질문입니다! 결론부터 말씀드리면,{" "}
          <Warn>"기본적으로는 안 됩니다. useTransition을 써야만 진짜 '똥 끊기(중단 가능 렌더링)'가 활성화됩니다."</Warn>
        </p>
        <p className="text-muted-foreground leading-relaxed">
          리액트 엔진(파이버)은 <Em>"능력은 있지만, 평소에는 보수적으로 행동한다"</Em>고 이해하시면 정확합니다.
          왜 그런지, useTransition이 무슨 마법을 부리는지 주어와 목적어를 넣어 팍팍 설명해 드릴게요.
        </p>

        {/* 1. 기본 vs useTransition 차이 */}
        <section className="space-y-3 pt-4 mt-4">
          <h3 className="text-base font-bold text-foreground border-b border-border pb-2">
            1. 기본 소스 vs useTransition 차이 (누가 무엇을?)
          </h3>

          <div className="rounded-lg border border-red-500/30 bg-red-950/10 light:bg-red-50 light:border-red-200 p-4 space-y-2">
            <p className="font-bold text-foreground">[기본 소스] "급해! 무조건 지금 다 해!" (Blocking Mode)</p>
            <div className="text-sm text-muted-foreground space-y-1 leading-relaxed">
              <p><span className="text-xs font-semibold uppercase tracking-wide">주어: </span>리액트 엔진이</p>
              <p><span className="text-xs font-semibold uppercase tracking-wide">목적어: </span>setCount로 발생한 모든 업데이트를</p>
              <p><span className="text-xs font-semibold uppercase tracking-wide">행동: </span>'긴급(Urgent)' 작업으로 간주하고, 끝날 때까지 브라우저를 붙잡고 안 놔줍니다.</p>
              <p className="text-xs mt-1">
                이유: 리액트는 기본적으로 "상태가 바뀌면 화면도 즉시 바뀌어야 한다"고 생각합니다.
                그래서 10분짜리 작업이라도 일단 시작하면 <Warn>'똥을 끊지 않고'</Warn> 끝까지 싸려고 고집을 피웁니다.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-green-500/30 bg-green-950/10 light:bg-green-50 light:border-green-200 p-4 space-y-2">
            <p className="font-bold text-foreground">[useTransition 사용] "천천히 해도 돼, 급한 일 오면 비켜줘." (Concurrent Mode)</p>
            <div className="text-sm text-muted-foreground space-y-1 leading-relaxed">
              <p><span className="text-xs font-semibold uppercase tracking-wide">주어: </span>개발자가 startTransition으로 묶은 작업을</p>
              <p><span className="text-xs font-semibold uppercase tracking-wide">목적어: </span>스케줄러에게 전달하면</p>
              <p><span className="text-xs font-semibold uppercase tracking-wide">행동: </span>스케줄러는 이 작업을 <Em>'낮은 우선순위(Transition)'</Em>로 분류하고, 언제든 <Em>중단 가능(Interruptible)</Em>하게 만듭니다.</p>
              <p className="text-xs mt-1">
                이유: 이제 파이버가 드디어 장부를 챙기며 <Em>'똥 끊기'</Em> 모드에 들어갑니다.
                10분짜리 작업을 하다가 사용자가 클릭을 하면,
                "아! 이건 나중에 해도 되는 일이지?"라며 즉시 클릭부터 처리하러 달려갑니다.
              </p>
            </div>
          </div>
        </section>

        {/* 2. 소스 코드 비교 */}
        <section className="space-y-3 pt-4 mt-4">
          <h3 className="text-base font-bold text-foreground border-b border-border pb-2">
            2. 소스 코드 비교 매핑
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {/* Case A */}
            <div>
              <p className="text-xs font-semibold text-red-400 light:text-red-600 mb-2">Case A: 일반적인 업데이트 (똥 안 끊음)</p>
              <div className="rounded-md bg-zinc-900 light:bg-zinc-50 p-3 font-mono text-xs leading-6 text-zinc-100 light:text-zinc-800 overflow-auto">
                <div><span className="text-blue-400">const</span> [count, setCount] = <span className="text-yellow-400">useState</span>(<span className="text-orange-400">0</span>);</div>
                <div></div>
                <div><span className="text-blue-400">const</span> <span className="text-yellow-400">handleClick</span> = () =&gt; {"{"}</div>
                <div>  <span className="text-zinc-400">{"// 리액트: '이건 긴급 상황이다!"}</span></div>
                <div>  <span className="text-zinc-400">{"// 화면 다 그릴 때까지 아무도 방해 마!'"}</span></div>
                <div>  <span className="text-yellow-400">setCount</span>(prev =&gt; prev + <span className="text-orange-400">1</span>);</div>
                <div>{"}"}</div>
              </div>
            </div>
            {/* Case B */}
            <div>
              <p className="text-xs font-semibold text-green-400 light:text-green-600 mb-2">Case B: useTransition 적용 (진짜 똥 끊기 발동)</p>
              <div className="rounded-md bg-zinc-900 light:bg-zinc-50 p-3 font-mono text-xs leading-6 text-zinc-100 light:text-zinc-800 overflow-auto">
                <div><span className="text-blue-400">const</span> [isPending, startTransition] = <span className="text-yellow-400">useTransition</span>();</div>
                <div><span className="text-blue-400">const</span> [count, setCount] = <span className="text-yellow-400">useState</span>(<span className="text-orange-400">0</span>);</div>
                <div></div>
                <div><span className="text-blue-400">const</span> <span className="text-yellow-400">handleClick</span> = () =&gt; {"{"}</div>
                <div>  <span className="text-zinc-400">{"// '이 작업은 좀 무거우니까,"}</span></div>
                <div>  <span className="text-zinc-400">{"// 급한 일 오면 잠시 멈춰도 돼.'"}</span></div>
                <div>  <span className="text-yellow-400">startTransition</span>(() =&gt; {"{"}</div>
                <div>    <span className="text-zinc-400">{"// 스케줄러: '낮은 우선순위 장부에 적어둘게!'"}</span></div>
                <div>    <span className="text-yellow-400">setCount</span>(prev =&gt; prev + <span className="text-orange-400">1</span>);</div>
                <div>  {"}"});</div>
                <div>{"}"}</div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 왜 써야만 하나 */}
        <section className="space-y-3 pt-4 mt-4">
          <h3 className="text-base font-bold text-foreground border-b border-border pb-2">
            3. 왜 useTransition을 써야만 작동하게 만들었나요?
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            리액트 팀이 머리가 나빠서 기본으로 안 넣어준 게 아닙니다. <Em>"예측 가능성"</Em> 때문입니다.
          </p>
          <div className="space-y-2">
            <div className="rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground leading-relaxed">
              <p className="font-semibold text-foreground mb-1">일관성 문제</p>
              <p>모든 작업이 중간에 끊길 수 있다면, 화면의 A 부분은 새 데이터고 B 부분은 옛날 데이터인 <Warn>'일시적 불일치'</Warn>가 생겨 사용자가 혼란을 느낄 수 있습니다.</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground leading-relaxed">
              <p className="font-semibold text-foreground mb-1">불필요한 오버헤드</p>
              <p>아주 가벼운 작업(단순 숫자 올리기 등)은 그냥 한 번에 처리하는 게 장부 적고 멈추는 것보다 훨씬 빠릅니다.</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground leading-relaxed">
              <p className="font-semibold text-foreground mb-1">개발자의 의도</p>
              <p>리액트는 <Em>"어떤 게 무거운 작업이고 어떤 게 사용자의 반응성을 위한 긴급 작업인지"</Em>를 스스로 완벽히 판단할 수 없습니다. 그래서 개발자에게 useTransition이라는 스위치를 준 것입니다.</p>
            </div>
          </div>
        </section>

        {/* 4. 핵심 요약 배너 */}
        <div className="rounded-lg border border-indigo-800/40 light:border-zinc-200 bg-indigo-950/20 light:bg-zinc-50 p-5 text-center">
          <p className="text-lg">💡</p>
          <p className="mt-2 text-sm font-semibold text-indigo-300 light:text-teal-700 leading-relaxed">
            파이버(Fiber) 엔진은 똥을 끊을 수 있는 <Em>'하드웨어'</Em>입니다.<br />
            <Em>useTransition</Em>은 그 하드웨어의 <Em>'터보 버튼'</Em>입니다.<br />
            <br />
            기본 상태에서는 안전을 위해 터보를 끄고 <Em>동기적(Blocking)</Em>으로 작동하지만,<br />
            개발자가 <Em>startTransition</Em>을 호출하는 순간 파이버의 동시성(Concurrency) 기능을 활성화해<br />
            중단 가능한 렌더링을 시작합니다.<br />
            <br />
            결론: useTransition을 안 쓰면 리액트는 여전히 고집불통 일꾼처럼 굴 것이고,<br />
            useTransition을 쓰는 순간 비로소 사용자의 클릭에 유연하게 대처하는{" "}
            <Em>'매너 있는 엔진'</Em>으로 변신합니다!
          </p>
        </div>
      </div>

    </div>
  )
}

// ─── 개발자용 콘텐츠 (fiber3.dev.md 원문 그대로) ─────────────────────────────

function FunnyStoryDev() {
  return (
    <div className="space-y-12 text-sm text-foreground max-w-3xl pb-8">

      {/* 도입 */}
      <p className="text-muted-foreground leading-relaxed">
        리액트의 아키텍처를 <Em>컴퓨터 과학(CS)과 운영체제(OS)의 관점</Em>에서 재정의한{" "}
        <Em>React Concurrent Engine: High-Level Spec</Em>입니다.
        단순한 비유를 넘어, 왜{" "}
        <code className="rounded bg-zinc-800 light:bg-zinc-100 px-1 text-xs">useTransition</code>이{" "}
        <Em>가상 런타임의 스케줄링 전략</Em>을 결정하는 핵심 레버인지 전문 용어로 분석합니다.
      </p>

      {/* ── 1. Concurrent React ── */}
      <section className="space-y-4 pt-4">
        <h3 className="text-base font-bold text-foreground border-b border-border pb-2">
          1. Concurrent React: 가상 스택과 선점형 스케줄링
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          리액트 파이버(Fiber)는 JS의 호출 스택(Call Stack) 한계를 극복하기 위해 구현된{" "}
          <Em>'가상 스택 프레임(Virtual Stack Frame)'</Em>입니다.
          이 구조가 있기에 리액트는 실행 제어권을 브라우저에 양보(Yielding)할 수 있습니다.
        </p>

        {/* ① 파이버가 장부인 이유 */}
        <div className="rounded-lg border border-indigo-500/30 bg-indigo-950/10 light:bg-indigo-50 light:border-indigo-200 p-4 space-y-2">
          <p className="font-bold text-foreground">① 파이버가 '장부'인 이유: <Em>Stateful Coroutine</Em></p>
          <ul className="space-y-1.5 list-disc list-inside text-sm text-muted-foreground leading-relaxed">
            <li>
              <Em>전문 정의:</Em> 파이버는 컴포넌트의 상태와 작업 단위를 포함하는{" "}
              <Em>힙(Heap) 기반의 객체</Em>입니다.
            </li>
            <li>
              <Em>작동 원리:</Em> 일반 함수는 실행 중 멈추면 로컬 변수가 날아가지만, 파이버는
              실행 컨텍스트를 객체에 보존하는 <Em>코루틴(Coroutine)</Em> 방식을 취합니다.
            </li>
            <li>
              <Em>필연성:</Em> 작업을 중단(Interrupt)했다가 나중에 재개(Resume)하려면,
              중단 시점의 스냅샷을 저장할 <Em>'상태 보존형 장부'</Em>가 반드시 필요합니다.
            </li>
          </ul>
        </div>

        {/* ② 똥 끊기의 정체 */}
        <div className="rounded-lg border border-indigo-500/30 bg-indigo-950/10 light:bg-indigo-50 light:border-indigo-200 p-4 space-y-2">
          <p className="font-bold text-foreground">② '똥 끊기'의 정체: <Em>Incremental Rendering & Time Slicing</Em></p>
          <ul className="space-y-1.5 list-disc list-inside text-sm text-muted-foreground leading-relaxed">
            <li>
              <Em>전문 정의:</Em> 렌더링 작업을 원자적(Atomic) 단위로 쪼개어 브라우저의 프레임 드랍 없이
              수행하는 <Em>시분할(Time Slicing)</Em> 기법입니다.
            </li>
            <li>
              <Em>작동 원리:</Em>{" "}
              <code className="rounded bg-zinc-800 light:bg-zinc-100 px-1 text-xs">RequestIdleCallback</code>과
              유사한 메커니즘으로, 메인 스레드가 유휴 상태일 때만 렌더링을 진행하다가{" "}
              <Warn>I/O 이벤트(클릭 등)</Warn>가 유입되면 즉시 제어권을 반납합니다.
            </li>
          </ul>
        </div>
      </section>

      {/* ── 2. useTransition: Lane 제어 ── */}
      <section className="space-y-4 pt-4">
        <h3 className="text-base font-bold text-foreground border-b border-border pb-2">
          2. useTransition: 렌더링 우선순위의 비트마스크(Lane) 제어
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          리액트 엔진은 모든 업데이트에 우선순위를 부여하며, 이를{" "}
          <Em>Lane 모델(비트마스크 자료구조)</Em>로 관리합니다.
        </p>

        {/* Sync Mode */}
        <div className="rounded-lg border border-red-500/30 bg-red-950/10 light:bg-red-50 light:border-red-200 p-4 space-y-2">
          <p className="font-bold text-foreground">🚨 기본 모드 (Sync/Blocking Mode)</p>
          <ul className="space-y-1.5 list-disc list-inside text-sm text-muted-foreground leading-relaxed">
            <li>
              <Em>메커니즘:</Em> 모든{" "}
              <code className="rounded bg-zinc-800 light:bg-zinc-100 px-1 text-xs">setState</code>는{" "}
              <Em>'Sync Lane(가장 높은 우선순위)'</Em>을 부여받습니다.
            </li>
            <li>
              <Warn>결과:</Warn> 리액트는 이 작업을 긴급(Urgent)으로 간주하고,
              엔진의 '중단 가능' 기능을 강제로 비활성화합니다.
              즉, 파이버 장부를 쓰지 않고 한 번에 밀어붙이는{" "}
              <Warn>Blocking Rendering</Warn>이 발생합니다.
            </li>
          </ul>
        </div>

        {/* Concurrent Mode */}
        <div className="rounded-lg border border-green-500/30 bg-green-950/10 light:bg-green-50 light:border-green-200 p-4 space-y-2">
          <p className="font-bold text-foreground">⚡ useTransition 모드 (Concurrent/Non-blocking Mode)</p>
          <ul className="space-y-1.5 list-disc list-inside text-sm text-muted-foreground leading-relaxed">
            <li>
              <Em>메커니즘:</Em>{" "}
              <code className="rounded bg-zinc-800 light:bg-zinc-100 px-1 text-xs">startTransition</code>으로
              감싸진 업데이트는 <Em>'Transition Lane(낮은 우선순위)'</Em>으로 마킹됩니다.
            </li>
            <li>
              <Good>결과:</Good> 이제 스케줄러가 개입합니다. 이 작업은 <Em>선점 가능(Preemptible)</Em>한
              상태가 되어, 더 높은 우선순위의 Lane(사용자 입력)이 들어오면 하던 작업을 즉시 멈추고
              장부에 체크포인트만 남긴 채 이탈합니다.
            </li>
          </ul>
        </div>
      </section>

      {/* ── 3. 실무 아키텍처 소스 분석 ── */}
      <section className="space-y-3 pt-4">
        <h3 className="text-base font-bold text-foreground border-b border-border pb-2">
          3. 실무 아키텍처 소스 분석 (Advanced Spec)
        </h3>
        <div className="rounded-md bg-zinc-900 light:bg-zinc-50 p-4 font-mono text-xs leading-7 text-zinc-100 light:text-zinc-800 overflow-auto">
          <div><span className="text-zinc-500">01:</span> <span className="text-purple-400">import</span> React, {"{ useState, useTransition }"} <span className="text-purple-400">from</span> <span className="text-green-400">'react'</span>;</div>
          <div><span className="text-zinc-500">02:</span> </div>
          <div><span className="text-zinc-500">03:</span> <span className="text-purple-400">export default function</span> <span className="text-yellow-400">HighPerformanceRuntime</span>() {"{"}</div>
          <div><span className="text-zinc-500">04:</span>   <span className="text-zinc-400">{"// [Fiber Heap Allocation]"}</span></div>
          <div><span className="text-zinc-500">05:</span>   <span className="text-blue-400">const</span> [data, setData] = <span className="text-yellow-400">useState</span>(<span className="text-orange-400">0</span>);</div>
          <div><span className="text-zinc-500">06:</span>   <span className="text-zinc-400">{"// [Concurrency Control Interface]"}</span></div>
          <div><span className="text-zinc-500">07:</span>   <span className="text-blue-400">const</span> [isPending, startTransition] = <span className="text-yellow-400">useTransition</span>();</div>
          <div><span className="text-zinc-500">08:</span> </div>
          <div><span className="text-zinc-500">09:</span>   <span className="text-blue-400">const</span> <span className="text-yellow-400">handleHeavyUpdate</span> = () =&gt; {"{"}</div>
          <div><span className="text-zinc-500">10:</span>     <span className="text-zinc-400">{"// [Scheduling Strategy: Low Priority]"}</span></div>
          <div><span className="text-zinc-500">11:</span>     <span className="text-zinc-400">{"// 이 호출은 'Transition Lane'을 점유하며 렌더링 중단 권한을 커널에 위임함."}</span></div>
          <div><span className="text-zinc-500">12:</span>     <span className="text-yellow-400">startTransition</span>(() =&gt; {"{"}</div>
          <div><span className="text-zinc-500">13:</span>       <span className="text-yellow-400">setData</span>(prev =&gt; prev + <span className="text-orange-400">1</span>);</div>
          <div><span className="text-zinc-500">14:</span>     {"}"});</div>
          <div><span className="text-zinc-500">15:</span>   {"}"};</div>
          <div><span className="text-zinc-500">16:</span> </div>
          <div><span className="text-zinc-500">17:</span>   <span className="text-zinc-400">{"// [Reconciliation Phase: Interruptible Unit of Work]"}</span></div>
          <div><span className="text-zinc-500">18:</span>   <span className="text-zinc-400">{"// 리컨실러가 가상 돔을 비교할 때, 이 컴포넌트는 '언제든 비켜줄 준비'가 된 상태임."}</span></div>
          <div><span className="text-zinc-500">19:</span>   <span className="text-purple-400">return</span> (</div>
          <div><span className="text-zinc-500">20:</span>     &lt;<span className="text-red-400">div</span> className=<span className="text-green-400">"p-4"</span>&gt;</div>
          <div><span className="text-zinc-500">21:</span>       &lt;<span className="text-red-400">h1</span>&gt;Consistency Level: {"{data}"}&lt;/<span className="text-red-400">h1</span>&gt;</div>
          <div><span className="text-zinc-500">22:</span>       &lt;<span className="text-red-400">button</span> onClick={"{handleHeavyUpdate}"}&gt;Trigger Concurrent Task&lt;/<span className="text-red-400">button</span>&gt;</div>
          <div><span className="text-zinc-500">23:</span>       {"{isPending && <p>Background Processing...</p>}"}</div>
          <div><span className="text-zinc-500">24:</span>     &lt;/<span className="text-red-400">div</span>&gt;</div>
          <div><span className="text-zinc-500">25:</span>   );</div>
          <div><span className="text-zinc-500">26:</span>{"}"}</div>
        </div>
      </section>

      {/* ── 4. 시니어의 통찰 ── */}
      <section className="space-y-4 pt-4">
        <h3 className="text-base font-bold text-foreground border-b border-border pb-2">
          4. 시니어의 통찰: 왜 기본값이 아닐까? (Design Trade-off)
        </h3>
        <div className="space-y-2">
          <div className="rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground leading-relaxed">
            <p className="font-semibold text-foreground mb-1">1. UI Data Integrity (데이터 무결성)</p>
            <p>
              모든 것이 비동기로 끊겨서 렌더링되면, 화면의 각 파트가 서로 다른 시점의 데이터를 보여주는{" "}
              <Warn>Tearing(화면 찢어짐)</Warn> 현상이 발생할 수 있습니다.
              리액트는 기본적으로 '안전한 동기적 일관성'을 선택합니다.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground leading-relaxed">
            <p className="font-semibold text-foreground mb-1">2. Scheduling Overhead</p>
            <p>
              작업을 쪼개고 장부에 기록하며 우선순위를 관리하는 행위 자체도 CPU 자원을 소모합니다.
              아주 가벼운 업데이트는 그냥 한 번에 밀어버리는 게 오버헤드가 적습니다.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground leading-relaxed">
            <p className="font-semibold text-foreground mb-1">3. Algebraic Effects 추상화</p>
            <p>
              리액트 팀은 어떤 업데이트가 무거운지 개발자가 가장 잘 안다고 판단했습니다.{" "}
              <code className="rounded bg-zinc-800 light:bg-zinc-100 px-1 text-xs">useTransition</code>은
              개발자가 런타임에 주는 <Em>'우선순위 힌트'</Em>입니다.
            </p>
          </div>
        </div>
      </section>

      {/* 최종 결론 */}
      <div className="rounded-lg border border-indigo-800/40 light:border-zinc-200 bg-indigo-950/20 light:bg-zinc-50 p-5 text-center">
        <p className="text-lg">💡</p>
        <p className="mt-2 text-sm font-semibold text-indigo-300 light:text-teal-700 leading-relaxed">
          <Em>파이버(Fiber)</Em>는 중단과 재개를 가능케 하는 <Em>저수준 데이터 구조(Low-level Structure)</Em>입니다.<br />
          <Em>useTransition</Em>은 이 구조를 활용해 <Em>선점형 멀티태스킹(Preemptive Multitasking)</Em>을
          수행하도록 지시하는 <Em>상위 수준의 제어 로직(High-level Controller)</Em>입니다.<br />
          <br />
          이 버튼을 누르지 않으면 리액트 엔진은 마치 구식 OS처럼 한 번에 하나의 프로세스만 점유하는{" "}
          <Warn>단일 작업 모드</Warn>로 작동하게 됩니다.<br />
          진짜 유연한 앱을 만들고 싶다면, 이 <Em>'동시성 제어 스위치'</Em>를 전략적으로 활용해야 합니다.
        </p>
      </div>

    </div>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export const IMMUTABILITY_FUNNY_STORY: TopicTab = {
  id: "funny-story",
  label: "더 웃긴 이야기",
  icon: "😂",
  variant: "deepdive",
  theory: {
    child: <FunnyStoryContent />,
    dev: <FunnyStoryDev />,
  },
}
