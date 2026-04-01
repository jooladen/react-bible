# React Bible — Stage 진행 현황

> 세션 시작 시 이 파일을 읽어 어느 Stage까지 완료했는지 확인하세요.
> 완료 후 `[ ]` → `[x]`로 변경하고, Stage Status도 `'todo'` → `'done'`으로 업데이트하세요.

## 작업 패턴 (반복)

```
1. 이 파일 열어 미완료 Stage 확인
2. /pdca do stage-0X-[name] 실행
3. features/stage-0X/ 구현 (theory.tsx + playground.tsx + code-viewer.tsx)
4. /pdca analyze stage-0X (Gap analysis)
5. Match Rate ≥ 90% → [x] 표시 + stages.ts status 'done'으로 변경
```

---

## Phase 1: 입력과 기초 (데이터의 본질)

- [ ] **Stage 01** — 불변성 & Immer `slug: immutability` 🟢 쉬움
- [ ] **Stage 02** — Rendering & Reconciliation `slug: rendering` 🟡 보통
- [ ] **Stage 03** — Component Lifecycle `slug: lifecycle` 🟢 쉬움
- [ ] **Stage 04** — Hooks 기초 (useState/useEffect) `slug: hooks-basic` 🟢 쉬움
- [ ] **Stage 05** — Event Bubbling & Capture `slug: event-bubbling` 🟡 보통

## Phase 2: 가공과 최적화 (불필요한 연산 걷어내기)

- [ ] **Stage 06** — Hooks & Closure `slug: hooks-closure` 🔴 어려움
- [ ] **Stage 07** — Memoization (useMemo/useCallback) `slug: memoization` 🟡 보통
- [ ] **Stage 08** — Design Systems (Headless UI) `slug: design-systems` 🟡 보통
- [ ] **Stage 09** — CSS-in-JS vs Tailwind `slug: css-strategies` 🟢 쉬움
- [ ] **Stage 10** — Performance Profiling `slug: profiling` 🔴 어려움

## Phase 3: 확장과 연결 (덩치가 커지는 단계)

- [ ] **Stage 11** — Context & Prop Drilling `slug: context` 🟡 보통
- [ ] **Stage 12** — State Management (Zustand) `slug: state-management` 🟡 보통
- [ ] **Stage 13** — Async State Handling (Race Condition) `slug: async-state` 🔴 어려움
- [ ] **Stage 14** — Server State & Caching (TanStack Query) `slug: server-state` 🟡 보통
- [ ] **Stage 15** — Fine-grained Reactivity (Signals) `slug: signals` 🔴 어려움

## Phase 4: 운영과 인프라 (장인의 마무리)

- [ ] **Stage 16** — Testing Strategy (Jest/Playwright) `slug: testing` 🟡 보통
- [ ] **Stage 17** — Hydration & SSR `slug: hydration` 🔴 어려움
- [ ] **Stage 18** — Bundle Optimization `slug: bundle-optimization` 🔴 어려움
- [ ] **Stage 19** — Web Workers `slug: web-workers` 🔴 어려움
- [ ] **Stage 20** — Micro Frontends (MFE) `slug: mfe` 🔴 어려움

---

## 진행 요약

| Phase | 완료 | 전체 | 진행률 |
|-------|------|------|--------|
| Phase 1: 입력과 기초 | 0 | 5 | 0% |
| Phase 2: 가공과 최적화 | 0 | 5 | 0% |
| Phase 3: 확장과 연결 | 0 | 5 | 0% |
| Phase 4: 운영과 인프라 | 0 | 5 | 0% |
| **전체** | **0** | **20** | **0%** |

---

## Stage 콘텐츠 파일 구조 (각 Stage 구현 시)

```
src/features/stage-XX-[name]/
├── theory.tsx          # 이론 패널 (초딩/개발자 이중 설명)
├── playground.tsx      # 인터렉티브 실험실
└── code-viewer.tsx     # 핵심 코드 + 문법 강조
```

`theory.tsx` 내부 패턴:
```tsx
import { useExplanationStore } from "@/stores/explanation-store"

export function Stage01Theory() {
  const { mode } = useExplanationStore()
  return mode === "child" ? <ChildExplanation /> : <DevExplanation />
}
```
