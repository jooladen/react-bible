"use client"

// Design Ref: §더 깊이 — fiber2.md 원문 100% 그대로, 스타일링만 적용
import type { TopicTab } from "@/types/combined-stage"

// ─── 스타일 헬퍼 ──────────────────────────────────────────────────────────────

function Em({ children }: { children: React.ReactNode }) {
  return <strong className="text-indigo-300 light:text-teal-700 font-semibold">{children}</strong>
}

function Warn({ children }: { children: React.ReactNode }) {
  return <strong className="text-amber-400 light:text-amber-600 font-semibold">{children}</strong>
}

function Good({ children }: { children: React.ReactNode }) {
  return <strong className="text-green-400 light:text-green-600 font-semibold">{children}</strong>
}

// ─── 초딩용 콘텐츠 (fiber2.md 원문 그대로) ────────────────────────────────────

function DeepDiveChild() {
  return (
    <div className="space-y-8 text-sm text-foreground max-w-3xl pb-8">

      {/* 도입 */}
      {/* <p className="text-muted-foreground leading-relaxed">
        20년 경력의 시니어 시선과 초보자의 눈높이를 모두 만족시키도록,{" "}
        <Em>'누가 누구에게 어떤 행동을 왜 하는지'</Em> 주어와 목적어를 아주 빵빵하게 채워 넣었습니다.
        특히 <Em>"이런 문제(고통) 때문에 이렇게 동작한다"</Em>는 인과관계를 추가해
        리액트의 설계를 완벽히 이해할 수 있게 보완했습니다.
      </p> */}

      {/* ── 1. 리액트 엔진 분석 소스 ── */}
      <section className="space-y-3 pt-4">
        <h3 className="text-base font-bold text-foreground border-b border-border pb-2">
          1. 리액트 엔진 분석 소스 (The Action Script)
        </h3>
        <div className="rounded-md bg-zinc-900 light:bg-zinc-50 p-4 font-mono text-xs leading-7 text-zinc-100 light:text-zinc-800 overflow-auto">
          <div><span className="text-zinc-500">01:</span> <span className="text-purple-400">import</span> React, {"{ useState }"} <span className="text-purple-400">from</span> <span className="text-green-400">'react'</span>;</div>
          <div><span className="text-zinc-500">02:</span> </div>
          <div><span className="text-zinc-500">03:</span> <span className="text-purple-400">export default function</span> <span className="text-yellow-400">Counter</span>() {"{"}</div>
          <div><span className="text-zinc-500">04:</span>   <span className="text-zinc-400">{"// [A. 최초 로딩] Fiber야, 장부를 펴고 초기값 '0'을 첫 번째 칸에 기록해둬."}</span></div>
          <div><span className="text-zinc-500">05:</span>   <span className="text-blue-400">const</span> [count, setCount] = <span className="text-yellow-400">useState</span>(<span className="text-orange-400">0</span>);</div>
          <div><span className="text-zinc-500">06:</span> </div>
          <div><span className="text-zinc-500">07:</span>   <span className="text-blue-400">const</span> <span className="text-yellow-400">handleLevelUp</span> = () =&gt; {"{"}</div>
          <div><span className="text-zinc-500">08:</span>     <span className="text-zinc-400">{"// [B. 업데이트 발생] Scheduler야, 사용자가 클릭했어! 지금 바쁘니? 순서 정해서 보고해!"}</span></div>
          <div><span className="text-zinc-500">09:</span>     <span className="text-yellow-400">setCount</span>(count + <span className="text-orange-400">1</span>);</div>
          <div><span className="text-zinc-500">10:</span>   {"}"};</div>
          <div><span className="text-zinc-500">11:</span> </div>
          <div><span className="text-zinc-500">12:</span>   <span className="text-zinc-400">{"// [C. 재조정/렌더링] Reconciler야, 내가 새로 그린 '설계도(Element)'랑 네 '장부(Fiber)'를 비교해봐."}</span></div>
          <div><span className="text-zinc-500">13:</span>   <span className="text-purple-400">return</span> (</div>
          <div><span className="text-zinc-500">14:</span>     &lt;<span className="text-red-400">div</span> className=<span className="text-green-400">"p-4"</span>&gt;</div>
          <div><span className="text-zinc-500">15:</span>       &lt;<span className="text-red-400">h1</span> className=<span className="text-green-400">"text-2xl"</span>&gt;레벨: {"{count}"}&lt;/<span className="text-red-400">h1</span>&gt;</div>
          <div><span className="text-zinc-500">16:</span>       &lt;<span className="text-red-400">button</span> onClick={"{handleLevelUp}"}&gt;레벨업!&lt;/<span className="text-red-400">button</span>&gt;</div>
          <div><span className="text-zinc-500">17:</span>     &lt;/<span className="text-red-400">div</span>&gt;</div>
          <div><span className="text-zinc-500">18:</span>   );</div>
          <div><span className="text-zinc-500">19:</span> {"}"}</div>
        </div>
      </section>

      {/* ── 2. 리액트 마을의 4인방 ── */}
      <section className="space-y-4 pt-4">
        <h3 className="text-base font-bold text-foreground border-b border-border pb-2">
          2. 리액트 마을의 4인방: "누가, 무엇을, 왜?"
        </h3>

        {/* ① 파이버 */}
        <div className="rounded-lg border border-indigo-500/30 bg-indigo-950/10 light:bg-indigo-50 light:border-indigo-200 p-4 space-y-2">
          <p className="font-bold text-foreground">① 파이버 (Fiber): <Em>"장부를 든 만능 기록관"</Em></p>
          <p className="leading-relaxed">
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">행동 (누가 무엇을): </span>
            <Em>파이버</Em>가 <Em>컴포넌트의 상태(State)</Em>를 자신의 <Em>메모리 장부</Em>에 저장하고 유지합니다.
          </p>
          <p className="leading-relaxed">
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">왜 이렇게 하나 (고통 해결): </span>
            일반 자바스크립트 함수는 실행이 끝나면 내부 변수가 메모리에서 사라집니다.
            만약 파이버가 없다면, 버튼을 누를 때마다 <Warn>count는 매번 0으로 초기화</Warn>될 것입니다.{" "}
            <Good>"데이터를 기억해야 하기 때문에"</Good> 파이버라는 별도의 객체가 장부 역할을 하며 데이터를 붙들고 있는 것입니다.
          </p>
        </div>

        {/* ② 스케줄러 */}
        <div className="rounded-lg border border-amber-500/30 bg-amber-950/10 light:bg-amber-50 light:border-amber-200 p-4 space-y-2">
          <p className="font-bold text-foreground">② 스케줄러 (Scheduler): <Em>"교통정리를 하는 순경"</Em></p>
          <p className="leading-relaxed">
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">행동 (누가 무엇을): </span>
            <Em>스케줄러</Em>가 <Em>setCount 요청</Em>을 받아서 <Em>실행 타이밍의 우선순위</Em>를 결정합니다.
          </p>
          <p className="leading-relaxed">
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">왜 이렇게 하나 (고통 해결): </span>
            사용자가 버튼을 초당 100번 누르거나, 아주 무거운 데이터 처리를 하고 있다고 가정해 봅시다.
            그때마다 화면을 즉시 그리려 하면 <Warn>브라우저가 과부하로 멈춰버립니다</Warn>.{" "}
            <Good>"화면 끊김(Jank)을 방지하기 위해"</Good> 스케줄러가 작업을 쪼개고 적절한 타이밍에 몰아서 처리하는 것입니다.
          </p>
        </div>

        {/* ③ 리컨실러 */}
        <div className="rounded-lg border border-green-500/30 bg-green-950/10 light:bg-green-50 light:border-green-200 p-4 space-y-2">
          <p className="font-bold text-foreground">③ 리컨실러 (Reconciler): <Em>"틀린 그림 찾기의 달인"</Em></p>
          <p className="leading-relaxed">
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">행동 (누가 무엇을): </span>
            <Em>리컨실러</Em>가 <Em>새로 생성된 설계도(Element)</Em>와 <Em>기존 파이버 장부</Em>를 대조하여{" "}
            <Em>실제 변경된 최소 단위</Em>를 찾아냅니다.
          </p>
          <p className="leading-relaxed">
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">왜 이렇게 하나 (고통 해결): </span>
            브라우저의 실제 DOM을 통째로 갈아엎는 것은 아주 느리고 비용이 많이 드는 작업입니다.{" "}
            <Good>"성능 저하를 막기 위해"</Good> 리컨실러가 메모리상에서 미리 계산하여,{" "}
            <Em>"딱 숫자 부분만 바꿔!"</Em>라고 최소한의 공사 리스트를 뽑아주는 것입니다.
          </p>
        </div>

        {/* ④ 렌더러 */}
        <div className="rounded-lg border border-purple-500/30 bg-purple-950/10 light:bg-purple-50 light:border-purple-200 p-4 space-y-2">
          <p className="font-bold text-foreground">④ 렌더러 (Renderer): <Em>"망치를 든 현장 일꾼"</Em></p>
          <p className="leading-relaxed">
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">행동 (누가 무엇을): </span>
            <Em>렌더러</Em>가 <Em>리컨실러의 지시</Em>를 받아 <Em>실제 브라우저 화면(DOM)</Em>의 특정 노드를 수정합니다.
          </p>
          <p className="leading-relaxed">
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">왜 이렇게 하나 (고통 해결): </span>
            개발자가 수동으로 <code className="rounded bg-zinc-800 light:bg-zinc-100 px-1 text-xs">document.getElementById('count').innerText = 1</code> 같은 코드를
            수천 개 작성하다 보면 <Warn>반드시 실수가 생기고 관리가 안 됩니다</Warn>.{" "}
            <Good>"사람의 실수를 줄이고 선언적으로 화면을 그리기 위해"</Good> 렌더러가 기계적으로 정확하게 화면을 바꿔주는 것입니다.
          </p>
        </div>
      </section>

      {/* ── 3. 전체 흐름 ── */}
      <section className="space-y-4 pt-4">
        <h3 className="text-base font-bold text-foreground border-b border-border pb-2">
          3. 전체 흐름: 최초 로딩부터 업데이트까지 (The Lifecycle)
        </h3>

        <div className="rounded-lg border border-border bg-card p-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-400 light:text-indigo-600">Phase 1: 최초 로딩 (건물 짓기)</p>
          <ol className="space-y-1.5 list-decimal list-inside leading-relaxed">
            <li><Em>구조 파악:</Em> 리액트 엔진이 전체 코드를 읽고 <Em>파이버 트리(지도)</Em>를 그립니다.</li>
            <li><Em>초기 기록:</Em> <Em>파이버</Em>가 자신의 장부 1번 칸에 <Good>count = 0</Good>이라고 <Em>초기 상태를 기록</Em>합니다. (Line 05)</li>
            <li><Em>실제 건설:</Em> <Em>렌더러</Em>가 브라우저에 실제 HTML 태그들을 만듭니다. 이때 <Em>파이버</Em>는 나중에 찾아갈 수 있도록 각 태그의 <Em>실제 주소(메모리 참조)</Em>를 장부에 같이 적어둡니다.</li>
          </ol>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-400 light:text-amber-600">Phase 2: 업데이트 (인테리어 수정)</p>
          <ol className="space-y-1.5 list-decimal list-inside leading-relaxed">
            <li><Warn>사건 발생:</Warn> 사용자가 버튼 클릭! <code className="rounded bg-zinc-800 light:bg-zinc-100 px-1 text-xs">setCount(0 + 1)</code>이 호출됩니다.</li>
            <li><Em>승인 대기:</Em> <Em>스케줄러</Em>가 "지금 브라우저가 한가하네, 지금 실행해!"라고 신호를 줍니다.</li>
            <li><Em>설계도 재작성:</Em> 컴포넌트 함수가 재실행되며 <Em>새로운 설계도(Element)</Em>를 리턴합니다. (Line 13~17)</li>
            <li><Good>틀린 그림 찾기:</Good> <Em>리컨실러</Em>가 <Good>"장부에는 0인데 새 설계도는 1이네? 글자만 바꿔!"</Good>라고 판정을 내립니다.</li>
            <li><Good>현장 수정:</Good> <Em>렌더러</Em>가 장부에 적힌 주소를 보고 브라우저의 해당 숫자만 <Good>'1'로 톡 수정</Good>합니다.</li>
          </ol>
        </div>
      </section>

      {/* ── 4. 시니어의 통찰 ── */}
      <section className="space-y-4 pt-4">
        <h3 className="text-base font-bold text-foreground border-b border-border pb-2">
          4. 시니어의 통찰: "이래서 리액트가 꼬였던 겁니다"
        </h3>

        <div className="rounded-lg border border-amber-500/20 bg-amber-950/10 light:bg-amber-50 light:border-amber-200 p-4 space-y-2">
          <p className="text-xs font-semibold text-amber-400 light:text-amber-600">꼬임 포인트 1 (비동기)</p>
          <p className="leading-relaxed">
            <Warn>"왜 setCount 바로 밑에서 console.log(count)를 찍으면 이전 값이 나오죠?"</Warn>
          </p>
          <p className="leading-relaxed text-muted-foreground">
            → <Em>스케줄러</Em>가 효율을 위해 작업을 뒤로 미뤘기 때문입니다.
            장부 수정은 아직 시작도 안 했는데 개발자가 먼저 장부를 확인하려 한 것입니다.
          </p>
        </div>

        <div className="rounded-lg border border-amber-500/20 bg-amber-950/10 light:bg-amber-50 light:border-amber-200 p-4 space-y-4">
          <p className="text-xs font-semibold text-amber-400 light:text-amber-600">꼬임 포인트 2 (훅의 규칙)</p>
          <p className="leading-relaxed">
            <Warn>"왜 useState를 조건문이나 반복문 안에 쓰면 안 되나요?"</Warn>
          </p>
          <p className="leading-relaxed text-muted-foreground">
            → <Em>파이버</Em>는 장부에 이름을 적지 않고 <Em>'순서(1번 칸, 2번 칸...)'</Em>로 데이터를 관리합니다.
            조건문에 따라 호출 순서가 바뀌면{" "}
            <Warn>1번 칸(이름)에 적힌 데이터를 2번 칸(나이) 데이터로 착각해서 읽어오는 대참사</Warn>가 발생하기 때문입니다.
          </p>

          {/* ── 파이버 수첩 ── */}
          <div className="border-t border-amber-500/20 pt-4 space-y-2">
            <p className="font-semibold text-foreground">파이버(Fiber)의 수첩: <Em>"이름표가 없는 칸막이"</Em></p>
            <p className="leading-relaxed text-muted-foreground">
              리액트 파이버 객체 내부에는 훅의 상태를 저장하는 <Em>memoizedState</Em>라는 공간이 있습니다.
              중요한 건, <Warn>리액트는 우리가 쓴 변수명(count, text 등)을 전혀 모른다</Warn>는 것입니다.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              <Em>동작 원리:</Em> 리액트는 훅이 호출되는 <Em>'순서'</Em>대로 장부의 칸을 하나씩 넘기며 데이터를 읽거나 씁니다.
            </p>
            <div className="space-y-1 text-sm">
              <p>첫 번째 useState 호출 → <Good>장부 1번 칸 확인</Good></p>
              <p>두 번째 useState 호출 → <Good>장부 2번 칸 확인</Good></p>
            </div>
          </div>

          {/* ── 대참사 예제 ── */}
          <div className="border-t border-amber-500/20 pt-4 space-y-3">
            <p className="font-semibold text-foreground">대참사 예제: <Warn>"데이터가 옆 칸으로 이사 가는 상황"</Warn></p>
            <p className="text-muted-foreground leading-relaxed">만약 조건문에 따라 훅 호출이 생략되면 어떤 일이 벌어지는지 소스로 보겠습니다.</p>

            <div>
              <p className="text-xs font-semibold text-green-400 light:text-green-600 mb-1">정상적인 상황 (최초 로딩)</p>
              <div className="rounded-md bg-zinc-900 light:bg-zinc-100 p-3 font-mono text-xs leading-6 text-zinc-100 light:text-zinc-800">
                <div><span className="text-zinc-500">01:</span> <span className="text-purple-400">function</span> <span className="text-yellow-400">Profile</span>() {"{"}</div>
                <div><span className="text-zinc-500">02:</span>   <span className="text-blue-400">const</span> [name, setName] = <span className="text-yellow-400">useState</span>(<span className="text-green-400">"홍길동"</span>); <span className="text-zinc-500">// [1번 칸]에 "홍길동" 저장</span></div>
                <div><span className="text-zinc-500">03:</span>   <span className="text-blue-400">const</span> [age, setAge] = <span className="text-yellow-400">useState</span>(<span className="text-orange-400">20</span>);        <span className="text-zinc-500">// [2번 칸]에 20 저장</span></div>
                <div><span className="text-zinc-500">04:</span>   <span className="text-blue-400">const</span> [isVip, setIsVip] = <span className="text-yellow-400">useState</span>(<span className="text-orange-400">true</span>);   <span className="text-zinc-500">// [3번 칸]에 true 저장</span></div>
                <div><span className="text-zinc-500">05:</span> {"}"}</div>
              </div>
              <p className="mt-1 text-xs text-muted-foreground font-mono">파이버 장부 상태: [1: "홍길동"] → [2: 20] → [3: true]</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-red-400 light:text-red-600 mb-1">대참사 발생 (두 번째 렌더링 - 조건문 사용)</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-2">누군가 "나이는 비밀로 해주세요!"라고 해서 코드를 다음과 같이 짰다고 가정해 봅시다.</p>
              <div className="rounded-md bg-zinc-900 light:bg-zinc-100 p-3 font-mono text-xs leading-6 text-zinc-100 light:text-zinc-800">
                <div><span className="text-zinc-500">01:</span> <span className="text-purple-400">function</span> <span className="text-yellow-400">Profile</span>({"{ showAge }"}) {"{"}</div>
                <div><span className="text-zinc-500">02:</span>   <span className="text-blue-400">const</span> [name, setName] = <span className="text-yellow-400">useState</span>(<span className="text-green-400">"홍길동"</span>);</div>
                <div><span className="text-zinc-500">03:</span>   <span className="text-purple-400">if</span> (showAge) {"{"} <span className="text-zinc-500">// 만약 showAge가 false가 된다면?</span></div>
                <div><span className="text-zinc-500">04:</span>     <span className="text-blue-400">const</span> [age, setAge] = <span className="text-yellow-400">useState</span>(<span className="text-orange-400">20</span>);</div>
                <div><span className="text-zinc-500">05:</span>   {"}"}</div>
                <div><span className="text-zinc-500">06:</span>   <span className="text-blue-400">const</span> [isVip, setIsVip] = <span className="text-yellow-400">useState</span>(<span className="text-orange-400">true</span>);</div>
                <div><span className="text-zinc-500">07:</span> {"}"}</div>
              </div>
            </div>

            <div className="space-y-1.5 text-sm leading-relaxed">
              <p className="text-xs font-semibold text-amber-400 light:text-amber-600">showAge가 false가 되는 순간의 리액트 엔진 내부:</p>
              <p className="text-muted-foreground">리액트: "자, 첫 번째 useState 호출됐네? 장부 1번 칸 열어봐. 오케이, <Good>'홍길동'이네."</Good> (정상)</p>
              <p className="text-muted-foreground">리액트: "<Warn>어? 다음 호출은 바로 isVip네? 그럼 장부 2번 칸 열어봐. 어라? 여기 '20'이라고 써있는데?</Warn>"</p>
              <p className="rounded bg-red-950/30 light:bg-red-50 px-3 py-2 border border-red-500/20">
                <Warn>결과: isVip 변수에 숫자 20이 들어가는 대참사가 발생합니다.</Warn> 불리언(true/false)이 있어야 할 자리에 정수(20)가 들어오니 후속 로직은 모두 에러가 나거나 꼬이게 됩니다.
              </p>
            </div>
          </div>

          {/* ── 왜 순서로 관리하나 ── */}
          <div className="border-t border-amber-500/20 pt-4 space-y-2">
            <p className="font-semibold text-foreground"><Em>"왜 이렇게 고통스럽게 순서로 관리하나?"</Em></p>
            <ul className="space-y-1.5 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
              <li><Em>성능:</Em> 매번 "이름이 age인 상태를 찾아라"라고 검색(Lookup)하는 것보다, 포인터만 다음 칸으로 옮기는 방식이 압도적으로 빠릅니다.</li>
              <li><Em>충돌 방지:</Em> 개발자가 실수로 같은 이름을 가진 변수를 여러 컴포넌트에서 써도, 순서 기반이면 절대 데이터가 섞이지 않습니다.</li>
            </ul>
            <p className="text-xs font-semibold text-muted-foreground mt-2 mb-1">이런 고통 때문에 리액트가 하는 행동:</p>
            <ul className="space-y-1.5 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
              <li><Em>Linter 도입:</Em> eslint-plugin-react-hooks를 통해 "조건문/반복문 안에 훅 쓰지 마!"라고 코딩 시점에 빨간 줄을 긋습니다.</li>
              <li><Em>순서 보장 정책:</Em> "모든 렌더링에서 훅의 호출 순서는 반드시 같아야 한다"는 철칙을 세웠습니다.</li>
            </ul>
          </div>

          {/* ── 시니어 조언 ── */}
          <div className="border-t border-amber-500/20 pt-4 space-y-3">
            <p className="font-semibold text-foreground">시니어의 조언: <Good>"조건문이 필요할 땐 이렇게 하세요"</Good></p>
            <p className="text-muted-foreground leading-relaxed">훅 자체를 조건문에 넣지 말고, 값을 조건부로 처리해야 합니다.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-red-400 mb-1">Bad (꼬이는 코드)</p>
                <div className="rounded-md bg-zinc-900 light:bg-zinc-100 p-3 font-mono text-xs leading-6 text-zinc-100 light:text-zinc-800">
                  <div><span className="text-purple-400">if</span> (isLoggedIn) {"{"}</div>
                  <div>  <span className="text-blue-400">const</span> [user] = <span className="text-yellow-400">useState</span>(<span className="text-green-400">'Kim'</span>);</div>
                  <div>  <span className="text-red-400">{"// 순서 꼬임의 주범"}</span></div>
                  <div>{"}"}</div>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-green-400 mb-1">Good (안전한 코드)</p>
                <div className="rounded-md bg-zinc-900 light:bg-zinc-100 p-3 font-mono text-xs leading-6 text-zinc-100 light:text-zinc-800">
                  <div><span className="text-blue-400">const</span> [user] = <span className="text-yellow-400">useState</span>(</div>
                  <div>  isLoggedIn ? <span className="text-green-400">'Kim'</span> : <span className="text-orange-400">null</span></div>
                  <div>); <span className="text-green-500">{"// 순서 항상 유지"}</span></div>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              요약하자면: 파이버는 <Em>'눈먼 관리자'</Em>입니다. 누가 호출했는지 이름은 안 보고,
              오직 <Em>'몇 번째로 문을 두드리는지'</Em>만 보고 장부의 칸을 내어줍니다.
              그래서 우리가 문 두드리는 순서를 단 한 번이라도 어기면{" "}
              <Warn>리액트라는 공장은 엉뚱한 데이터를 내뱉으며 멈춰버리는 것</Warn>입니다.
            </p>
          </div>
        </div>
      </section>

      {/* 최종 정리 */}
      <div className="rounded-lg border border-indigo-800/40 light:border-zinc-200 bg-indigo-950/20 light:bg-zinc-50 p-5 text-center">
        <p className="text-lg">💡</p>
        <p className="mt-2 text-sm font-semibold text-indigo-300 light:text-teal-700 leading-relaxed">
          <Em>최종 정리:</Em> 리액트는{" "}
          <Em>"개발자의 실수와 성능 저하라는 고통을 해결하기 위해,</Em>
          <br />
          <Em>파이버(장부)와 스케줄러(순경)를 동원해 브라우저를 지능적으로 컨트롤하는 엔진"</Em>입니다.
        </p>
      </div>

    </div>
  )
}

// ─── 개발자용 콘텐츠 (fiber2_dev.md 원문 그대로) ────────────────────────────

function DeepDiveDev() {
  return (
    <div className="space-y-8 text-sm text-foreground max-w-3xl pb-8">

      {/* 도입 */}
      <p className="text-muted-foreground leading-relaxed">
        OS 레벨의 추상화와 실무적 통찰이 결합된 <Em>React Engine: The Concurrent Specs</Em> 버전입니다.
        이 버전은 리액트를 단순한 UI 라이브러리가 아닌,{" "}
        <Em>"싱글 스레드 환경에서 동작하는 가상 스케줄링 운영체제"</Em>로 정의합니다.
      </p>

      {/* ── 1. 리액트 엔진 분석 소스 ── */}
      <section className="space-y-3 pt-4">
        <h3 className="text-base font-bold text-foreground border-b border-border pb-2">
          1. 리액트 엔진 분석 소스 (The System Call)
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          실무에서 리액트 컴포넌트는 커널에 의해 실행되는 <Em>작업 단위(Unit of Work)</Em>이며,{" "}
          <code className="rounded bg-zinc-800 light:bg-zinc-100 px-1 text-xs">useTransition</code>은
          이 작업의 <Em>선점(Preemption) 가능 여부</Em>를 결정하는 스위치입니다.
        </p>
        <div className="rounded-md bg-zinc-900 light:bg-zinc-50 p-4 font-mono text-xs leading-7 text-zinc-100 light:text-zinc-800 overflow-auto">
          <div><span className="text-zinc-500">01:</span> <span className="text-purple-400">import</span> React, {"{ useState, useTransition }"} <span className="text-purple-400">from</span> <span className="text-green-400">'react'</span>;</div>
          <div><span className="text-zinc-500">02:</span> </div>
          <div><span className="text-zinc-500">03:</span> <span className="text-purple-400">export default function</span> <span className="text-yellow-400">ConcurrentThread</span>() {"{"}</div>
          <div><span className="text-zinc-500">04:</span>   <span className="text-zinc-400">{"// [A. Fiber Allocation] Persistent 데이터 구조인 Fiber 노드에 힙 메모리 할당"}</span></div>
          <div><span className="text-zinc-500">05:</span>   <span className="text-blue-400">const</span> [data, setData] = <span className="text-yellow-400">useState</span>(<span className="text-orange-400">0</span>);</div>
          <div><span className="text-zinc-500">06:</span>   <span className="text-zinc-400">{"// [B. Concurrency Control] 중단 가능한 렌더링을 위한 가상 스레드 분리"}</span></div>
          <div><span className="text-zinc-500">07:</span>   <span className="text-blue-400">const</span> [isPending, startTransition] = <span className="text-yellow-400">useTransition</span>();</div>
          <div><span className="text-zinc-500">08:</span> </div>
          <div><span className="text-zinc-500">09:</span>   <span className="text-blue-400">const</span> <span className="text-yellow-400">handleUpdate</span> = () =&gt; {"{"}</div>
          <div><span className="text-zinc-500">10:</span>     <span className="text-zinc-400">{"// [C. Interruptible Update]"}</span></div>
          <div><span className="text-zinc-500">11:</span>     <span className="text-zinc-400">{"// Scheduler야, 이 작업은 낮은 우선순위(Transition Lane)로 설정해."}</span></div>
          <div><span className="text-zinc-500">12:</span>     <span className="text-zinc-400">{"// 더 급한 I/O(클릭 등)가 오면 언제든 이 작업을 'Pause(똥 끊기)' 해도 좋아."}</span></div>
          <div><span className="text-zinc-500">13:</span>     <span className="text-yellow-400">startTransition</span>(() =&gt; {"{"}</div>
          <div><span className="text-zinc-500">14:</span>       <span className="text-yellow-400">setData</span>(prev =&gt; prev + <span className="text-orange-400">1</span>);</div>
          <div><span className="text-zinc-500">15:</span>     {"}"});</div>
          <div><span className="text-zinc-500">16:</span>   {"}"};</div>
          <div><span className="text-zinc-500">17:</span> </div>
          <div><span className="text-zinc-500">18:</span>   <span className="text-zinc-400">{"// [D. Reconcile] Reconciler야, Work-in-Progress 트리를 Current 트리와 비교해봐."}</span></div>
          <div><span className="text-zinc-500">19:</span>   <span className="text-purple-400">return</span> (</div>
          <div><span className="text-zinc-500">20:</span>     &lt;<span className="text-red-400">div</span> className=<span className="text-green-400">"p-4"</span>&gt;</div>
          <div><span className="text-zinc-500">21:</span>       &lt;<span className="text-red-400">h1</span> className=<span className="text-green-400">"text-2xl"</span>&gt;데이터 일관성(Consistency): {"{data}"}&lt;/<span className="text-red-400">h1</span>&gt;</div>
          <div><span className="text-zinc-500">22:</span>       &lt;<span className="text-red-400">button</span> onClick={"{handleUpdate}"}&gt;Non-blocking Update&lt;/<span className="text-red-400">button</span>&gt;</div>
          <div><span className="text-zinc-500">23:</span>     &lt;/<span className="text-red-400">div</span>&gt;</div>
          <div><span className="text-zinc-500">24:</span>   );</div>
          <div><span className="text-zinc-500">25:</span>{"}"}</div>
        </div>
      </section>

      {/* ── 2. 리액트 커널의 4대 핵심 모듈 ── */}
      <section className="space-y-4 pt-4">
        <h3 className="text-base font-bold text-foreground border-b border-border pb-2">
          2. 리액트 커널의 4대 핵심 모듈 (Architectural Deep-Dive)
        </h3>

        {/* ① 파이버 */}
        <div className="rounded-lg border border-indigo-500/30 bg-indigo-950/10 light:bg-indigo-50 light:border-indigo-200 p-4 space-y-2">
          <p className="font-bold text-foreground">① 파이버 (Fiber): <Em>"가상 스택 프레임 (Virtual Stack Frame)"</Em></p>
          <p className="leading-relaxed">
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">행동: </span>
            JS의 콜 스택은 멈출 수 없지만, 파이버는 실행 컨텍스트를 객체로 만들어 힙(Heap)에 저장합니다.
            이것이 리액트만의 <Em>코루틴(Coroutine)</Em> 구현체입니다.
          </p>
          <p className="leading-relaxed">
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">실무적 통찰: </span>
            컴포넌트가 사라져도 데이터가 유지되는 이유는 파이버가{" "}
            <Em>Persistent Data Structure</Em>로서 메모리 포인터를 유지하기 때문입니다.
          </p>
        </div>

        {/* ② 스케줄러 */}
        <div className="rounded-lg border border-amber-500/30 bg-amber-950/10 light:bg-amber-50 light:border-amber-200 p-4 space-y-2">
          <p className="font-bold text-foreground">② 스케줄러 (Scheduler): <Em>"우선순위 기반 선점형 커널 (Preemptive Kernel)"</Em></p>
          <p className="leading-relaxed">
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">행동: </span>
            모든 업데이트에 <Em>Lane(비트마스크)</Em>을 부여합니다.{" "}
            <code className="rounded bg-zinc-800 light:bg-zinc-100 px-1 text-xs">useTransition</code>은
            이 Lane의 우선순위를 낮춰 <Em>Time Slicing</Em>이 가능하게 만듭니다.
          </p>
          <p className="leading-relaxed">
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">실무적 통찰: </span>
            사용자의 인터랙션(High Priority)이 대규모 리스트 렌더링(Low Priority)보다 먼저 CPU 타임을 점유하도록
            보장하여 <Warn>Jank(화면 끊김)</Warn>를 원천 차단합니다.
          </p>
        </div>

        {/* ③ 리컨실러 */}
        <div className="rounded-lg border border-green-500/30 bg-green-950/10 light:bg-green-50 light:border-green-200 p-4 space-y-2">
          <p className="font-bold text-foreground">③ 리컨실러 (Reconciler): <Em>"더블 버퍼링 엔진 (Double Buffering Engine)"</Em></p>
          <p className="leading-relaxed">
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">행동: </span>
            메모리상에서만 존재하는 <Em>Work-in-Progress</Em> 트리와 현재 화면인 <Em>Current</Em> 트리를 대조합니다.
          </p>
          <p className="leading-relaxed">
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">실무적 통찰: </span>
            렌더링 도중 데이터가 오염되는 것을 막기 위해, 작업이 완전히 끝날 때까지 브라우저 DOM에 반영하지 않는{" "}
            <Em>트랜잭션(Transaction)</Em> 격리 수준을 유지합니다.
          </p>
        </div>

        {/* ④ 렌더러 */}
        <div className="rounded-lg border border-purple-500/30 bg-purple-950/10 light:bg-purple-50 light:border-purple-200 p-4 space-y-2">
          <p className="font-bold text-foreground">④ 렌더러 (Renderer): <Em>"플랫폼 추상화 레이어 (PAL)"</Em></p>
          <p className="leading-relaxed">
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">행동: </span>
            리컨실러가 확정한 <Em>Commit Phase</Em>의 변경분만 실제 호스트(DOM)에 투사(Project)합니다.
          </p>
          <p className="leading-relaxed">
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">실무적 통찰: </span>
            선언적 프로그래밍의 핵심인 <Em>추상화</Em>를 담당하여,
            개발자가 직접적인 명령형 DOM 조작(Side Effect)에서 해방되게 합니다.
          </p>
        </div>
      </section>

      {/* ── 3. 전체 흐름 ── */}
      <section className="space-y-4 pt-4">
        <h3 className="text-base font-bold text-foreground border-b border-border pb-2">
          3. 전체 흐름: 가상 런타임의 라이프사이클
        </h3>

        <div className="rounded-lg border border-border bg-card p-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-400 light:text-indigo-600">Phase 1: Mount (Bootstrapping)</p>
          <ul className="space-y-1.5 list-disc list-inside leading-relaxed text-muted-foreground text-sm">
            <li><Em>구조화:</Em> 리액트가 컴포넌트 트리를 순회하며 <Em>파이버 지도</Em>를 메모리에 올립니다.</li>
            <li><Em>할당:</Em> 각 훅(useState)은 파이버의 <Em>memoizedState</Em> 내부에{" "}
              <Em>연결 리스트(Linked List)</Em> 형태로 슬롯을 할당받습니다. (Line 05)</li>
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-400 light:text-amber-600">Phase 2: Update (Interruptible Rendering)</p>
          <ul className="space-y-1.5 list-disc list-inside leading-relaxed text-muted-foreground text-sm">
            <li>
              <Em>인터럽트:</Em>{" "}
              <code className="rounded bg-zinc-800 light:bg-zinc-100 px-1 text-xs">startTransition</code> 내부의{" "}
              <code className="rounded bg-zinc-800 light:bg-zinc-100 px-1 text-xs">setData</code>가 호출되면,
              스케줄러는 이를 <Em>'언제든 끊어도 되는 작업'</Em>으로 표시합니다.
            </li>
            <li>
              <Em>똥 끊기(Yielding):</Em> 리컨실러가 작업을 하다가도 브라우저에 더 급한 이벤트가 들어오면{" "}
              <Em>제어권을 양보(Yielding)</Em>하고 나중에 다시 복귀합니다.
            </li>
            <li>
              <Good>커밋:</Good> 모든 계산이 끝나면 렌더러가 <Em>원자적(Atomic)</Em>으로 화면을 갱신합니다.
            </li>
          </ul>
        </div>
      </section>

      {/* ── 4. 시니어의 통찰 ── */}
      <section className="space-y-4 pt-4">
        <h3 className="text-base font-bold text-foreground border-b border-border pb-2">
          4. 시니어의 통찰: "엔진의 내부 결합도를 이해하라"
        </h3>

        <div className="rounded-lg border border-amber-500/20 bg-amber-950/10 light:bg-amber-50 light:border-amber-200 p-4 space-y-3">
          <p className="text-xs font-semibold text-amber-400 light:text-amber-600">📌 꼬임 포인트: Hook의 인덱스 기반 정적 디스패치 (Static Dispatch)</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            파이버는 훅을 관리할 때 Key가 아닌 <Em>메모리 오프셋(순서)</Em>을 사용합니다.
          </p>
          <ul className="space-y-1.5 list-disc list-inside text-sm text-muted-foreground leading-relaxed">
            <li>
              <Em>왜?</Em> 런타임 오버헤드를 극소화하기 위해 해시 맵 검색을 포기하고{" "}
              <Em>포인터 이동</Em>을 선택한 것입니다.
            </li>
            <li>
              <Warn>참사:</Warn> 조건문 내 훅 사용은 이 <Warn>포인터 주소를 오염(Memory Corruption)</Warn>시킵니다.
              1번 주소(Name)를 읽어야 할 포인터가 밀려 2번 주소(Age)를 가리키게 되면 시스템은 붕괴됩니다.
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-amber-500/20 bg-amber-950/10 light:bg-amber-50 light:border-amber-200 p-4 space-y-2">
          <p className="text-xs font-semibold text-amber-400 light:text-amber-600">📌 useTransition의 진정한 의미</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            단순한 로딩 처리가 아닙니다. 이는{" "}
            <Em>"상태 업데이트의 우선순위를 강제로 낮추어, 메인 스레드의 점유권을 사용자에게 양보하겠다"</Em>는
            고도의 자원 관리 선언입니다.
          </p>
        </div>
      </section>

      {/* 최종 아키텍처 요약 */}
      <div className="rounded-lg border border-indigo-800/40 light:border-zinc-200 bg-indigo-950/20 light:bg-zinc-50 p-5 text-center">
        <p className="text-lg">💡</p>
        <p className="mt-2 text-sm font-semibold text-indigo-300 light:text-teal-700 leading-relaxed">
          <Em>최종 아키텍처 요약:</Em>{" "}
          리액트는 "개발자의 선언적 의도를 파이버(장부)와 스케줄러(순경)를 통해<br />
          브라우저 하드웨어에 가장 효율적으로 스케줄링하는 <Em>가상 운영체제</Em>"입니다.<br />
          이 메커니즘을 이해하는 순간, 단순한 코딩이 아닌{" "}
          <Em>시스템 설계</Em>의 영역으로 리액트를 다루게 될 것입니다.
        </p>
      </div>

    </div>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export const IMMUTABILITY_DEEP_DIVE: TopicTab = {
  id: "react-internals",
  label: "더 깊이",
  icon: "🌊",
  variant: "deepdive",
  theory: {
    child: <DeepDiveChild />,
    dev: <DeepDiveDev />,
  },
}
