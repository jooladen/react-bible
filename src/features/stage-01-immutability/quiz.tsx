"use client"

// Design Ref: §4.6 — Stage 01 퀴즈 탭 (불변성 자가 점검 4문제)
import { useState } from "react"
import type { TopicTab } from "@/types/combined-stage"

// ─── Types ────────────────────────────────────────────────────────────────────

type QuizOption = {
  label: string
  code: string
  correct: boolean
  explanation: string
}

type QuizQuestion = {
  id: string
  question: string
  hint: string
  options: QuizOption[]
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const QUIZ_DATA: QuizQuestion[] = [
  {
    id: "q1",
    question: "Q1. 배열에 항목을 추가하려면?",
    hint: "새 배열을 만들어야 새 주소가 생깁니다",
    options: [
      {
        label: "A",
        code: `items.push("사과")\nsetItems(items)`,
        correct: false,
        explanation:
          "❌ push()는 원본 배열을 변이합니다. 주소가 그대로라서 React가 변화를 감지 못해요.",
      },
      {
        label: "B",
        code: `setItems([...items, "사과"])`,
        correct: true,
        explanation:
          "✅ spread로 새 배열을 만들면 새 주소가 생겨서 React가 리렌더 합니다.",
      },
      {
        label: "C",
        code: `items[items.length] = "사과"\nsetItems(items)`,
        correct: false,
        explanation:
          "❌ 직접 인덱스 할당도 원본 배열을 변이합니다. B처럼 spread로 새 배열을 만드세요.",
      },
    ],
  },
  {
    id: "q2",
    question: "Q2. 배열에서 특정 항목을 삭제하려면?",
    hint: "원본 배열을 바꾸지 않고 새 배열을 반환하는 메서드는?",
    options: [
      {
        label: "A",
        code: `items.splice(index, 1)\nsetItems(items)`,
        correct: false,
        explanation:
          "❌ splice()는 원본 배열을 변이합니다. 같은 참조 → React 감지 불가.",
      },
      {
        label: "B",
        code: `setItems(items.filter(item => item !== target))`,
        correct: true,
        explanation:
          "✅ filter()는 조건에 맞는 새 배열을 반환합니다. 원본 유지 + 새 참조 생성.",
      },
      {
        label: "C",
        code: `delete items[index]\nsetItems(items)`,
        correct: false,
        explanation:
          "❌ delete는 배열에 빈 구멍(undefined)을 만듭니다. 길이도 그대로고 원본도 변이돼요.",
      },
    ],
  },
  {
    id: "q3",
    question: "Q3. 객체의 name 필드만 바꾸려면?",
    hint: "객체도 배열처럼 새 참조를 만들어야 합니다",
    options: [
      {
        label: "A",
        code: `user.name = "홍길동"\nsetUser(user)`,
        correct: false,
        explanation:
          "❌ 직접 할당은 원본 객체를 변이합니다. 같은 참조 → 리렌더 없음.",
      },
      {
        label: "B",
        code: `setUser(Object.assign(user, { name: "홍길동" }))`,
        correct: false,
        explanation:
          "❌ Object.assign(target, ...)은 target(첫 번째 인자)을 직접 변이합니다. 새 객체 반환이 아니에요.",
      },
      {
        label: "C",
        code: `setUser({ ...user, name: "홍길동" })`,
        correct: true,
        explanation:
          "✅ spread로 새 객체를 만들면 새 참조 → React가 변화를 감지하고 리렌더합니다.",
      },
    ],
  },
  {
    id: "q4",
    question: "Q4. 3레벨 중첩 객체를 수정할 때 실무 권장 방식은?",
    hint: "A도 동작하지만, 중첩이 깊어지면 어떻게 될까요?",
    options: [
      {
        label: "A",
        code: `setData({\n  ...data,\n  user: {\n    ...data.user,\n    profile: { ...data.user.profile, city: "서울" }\n  }\n})`,
        correct: false,
        explanation:
          "⚠️ 동작은 합니다. 하지만 중첩이 깊어질수록 spread 지옥이 돼요. depth 4부터 코드가 폭발합니다.",
      },
      {
        label: "B",
        code: `setData(produce(draft => {\n  draft.user.profile.city = "서울"\n}))`,
        correct: true,
        explanation:
          "✅ Immer produce()는 depth 무관하게 직관적. 내부적으론 완벽한 불변 객체 반환.",
      },
      {
        label: "C",
        code: `data.user.profile.city = "서울"\nsetData(data)`,
        correct: false,
        explanation:
          "❌ 직접 변이입니다. 같은 참조 → 리렌더 없음. A처럼 spread 쓰거나 B처럼 Immer 쓰세요.",
      },
    ],
  },
]

// ─── Quiz Component ────────────────────────────────────────────────────────────

function ImmutabilityQuiz() {
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [showResult, setShowResult] = useState(false)

  const question = QUIZ_DATA[currentQ]
  const isAnswered = selected !== null
  const score = answers.filter(Boolean).length

  function handleSelect(index: number) {
    if (isAnswered) return
    const correct = QUIZ_DATA[currentQ].options[index].correct
    setSelected(index)
    setAnswers((prev) => [...prev, correct])
  }

  function handleNext() {
    if (currentQ < QUIZ_DATA.length - 1) {
      setCurrentQ((prev) => prev + 1)
      setSelected(null)
    } else {
      setShowResult(true)
    }
  }

  function handleReset() {
    setCurrentQ(0)
    setSelected(null)
    setAnswers([])
    setShowResult(false)
  }

  if (showResult) {
    const perfect = score === QUIZ_DATA.length
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <div className="text-5xl">{perfect ? "🎉" : "📚"}</div>
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">
            {score} / {QUIZ_DATA.length}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {perfect
              ? "완벽해요! 불변성을 제대로 이해했습니다."
              : score >= 3
              ? "거의 다 맞았어요! 틀린 문제를 다시 복습해보세요."
              : "조금 더 연습이 필요해요. 데모를 다시 보고 도전해보세요!"}
          </p>
        </div>
        <div className="flex gap-2">
          {answers.map((correct, i) => (
            <div
              key={i}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                correct
                  ? "bg-green-900/60 text-green-300 light:bg-green-100 light:text-green-700"
                  : "bg-red-900/60 text-red-300 light:bg-red-100 light:text-red-700"
              }`}
            >
              {correct ? "✓" : "✗"}
            </div>
          ))}
        </div>
        <button
          onClick={handleReset}
          className="rounded-lg bg-indigo-900/50 px-5 py-2 text-sm font-medium text-indigo-300 hover:bg-indigo-900/70 light:bg-indigo-100 light:text-indigo-700 light:hover:bg-indigo-200"
        >
          다시 도전
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 진행률 */}
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 rounded-full bg-zinc-800 light:bg-zinc-200">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${(currentQ / QUIZ_DATA.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {currentQ + 1} / {QUIZ_DATA.length}
        </span>
      </div>

      {/* 질문 */}
      <div className="rounded-lg border border-zinc-700/50 bg-zinc-900/30 p-4 light:border-zinc-200 light:bg-zinc-50">
        <p className="font-semibold text-foreground">{question.question}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          💡 힌트: {question.hint}
        </p>
      </div>

      {/* 선택지 */}
      <div className="space-y-2">
        {question.options.map((opt, i) => {
          const isSelected = selected === i
          const showFeedback = isAnswered

          let borderClass = "border-zinc-700/50 light:border-zinc-200"
          let bgClass =
            "bg-zinc-900/20 hover:bg-zinc-800/40 light:bg-white light:hover:bg-zinc-50"

          if (showFeedback) {
            if (opt.correct) {
              borderClass = "border-green-700/70 light:border-green-400"
              bgClass = "bg-green-950/30 light:bg-green-50"
            } else if (isSelected) {
              borderClass = "border-red-700/70 light:border-red-400"
              bgClass = "bg-red-950/30 light:bg-red-50"
            }
          }

          return (
            <button
              key={opt.label}
              onClick={() => handleSelect(i)}
              disabled={isAnswered}
              className={`w-full rounded-lg border p-3 text-left transition-colors disabled:cursor-default ${borderClass} ${bgClass}`}
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-xs font-bold text-zinc-300 light:bg-zinc-200 light:text-zinc-600">
                  {opt.label}
                </span>
                <pre className="flex-1 whitespace-pre-wrap font-mono text-xs leading-relaxed text-foreground">
                  {opt.code}
                </pre>
                {showFeedback && (
                  <span className="text-base">
                    {opt.correct ? "✅" : isSelected ? "❌" : ""}
                  </span>
                )}
              </div>
              {showFeedback && (opt.correct || isSelected) && (
                <p
                  className={`mt-2 pl-8 text-xs ${
                    opt.correct
                      ? "text-green-400 light:text-green-700"
                      : "text-red-400 light:text-red-700"
                  }`}
                >
                  {opt.explanation}
                </p>
              )}
            </button>
          )
        })}
      </div>

      {/* 다음 버튼 */}
      {isAnswered && (
        <button
          onClick={handleNext}
          className="w-full rounded-lg bg-indigo-900/50 py-2 text-sm font-medium text-indigo-300 hover:bg-indigo-900/70 light:bg-indigo-100 light:text-indigo-700 light:hover:bg-indigo-200"
        >
          {currentQ < QUIZ_DATA.length - 1 ? "다음 문제 →" : "결과 보기 🎯"}
        </button>
      )}
    </div>
  )
}

// ─── Theory (TopicTab 필수 필드) ──────────────────────────────────────────────

function QuizTheoryChild() {
  return (
    <div className="space-y-2 text-sm text-foreground">
      <p className="font-semibold">🟢 배운 내용을 직접 확인해봐요</p>
      <p className="text-muted-foreground">
        보는 것과 직접 해보는 건 달라요. 4문제로 불변성 개념이 진짜 내 것인지
        확인해보세요. 틀려도 괜찮아요 — 왜 틀렸는지 바로 알 수 있어요!
      </p>
    </div>
  )
}

function QuizTheoryDev() {
  return (
    <div className="space-y-2 text-sm text-foreground">
      <p className="font-semibold">🔵 불변성 패턴 자가 점검</p>
      <p className="text-muted-foreground">
        push/splice/직접할당 vs spread/filter/Immer — 4개 케이스로 참조
        동등성 이해를 검증합니다. Q4는 A도 정답이지만 실무 권장 패턴(Immer)을
        이해하는 것이 목적입니다.
      </p>
    </div>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export const IMMUTABILITY_QUIZ: TopicTab = {
  id: "quiz",
  label: "🧪 퀴즈",
  variant: "demo",
  theory: {
    child: <QuizTheoryChild />,
    dev: <QuizTheoryDev />,
  },
  demo: <ImmutabilityQuiz />,
}
