# Report: React Heartbeat Lab

**Feature**: react-heartbeat-lab  
**완료일**: 2026-04-01  
**Phase**: completed  
**Match Rate**: 97%  
**반복 횟수**: 0 (1회 통과)

---

## 1. Executive Summary

### 1.1 Feature 개요

| 항목 | 내용 |
|------|------|
| **Feature** | react-heartbeat-lab (프로젝트 뼈대) |
| **기간** | 2026-04-01 (2세션) |
| **Match Rate** | 97% |
| **빌드** | ✅ 에러 0건 (24페이지 정적 생성) |

### 1.2 Value Delivered (4-Perspective)

| 관점 | 계획 | 실제 결과 |
|------|------|-----------|
| **Problem** | 리액트 핵심 원리 20단계 학습 플랫폼 없음 | 20개 Stage 라우트 + 탭 기반 학습 구조 완성 |
| **Solution** | 초딩🟢/개발자🔵 이중 설명 + 3-패널 학습 앱 | Zustand persist 토글 + theory/playground/code 탭 구현 |
| **Function UX Effect** | 토글 하나로 설명 깊이 전환, 사이드바 진행 추적 | 사이드바 토글 + 키보드 ←/→ 이동 + 마지막 방문 복귀 구현 |
| **Core Value** | 전자책 예제 + Dev-Nexus 포트폴리오 메인 콘텐츠 | pnpm build 통과, 배포 가능한 뼈대 완성 |

### 1.3 성공 기준 최종 상태

| 기준 | 상태 | 근거 |
|------|------|------|
| `pnpm build` 에러 0건 | ✅ Met | 빌드 성공 (24페이지) |
| 20개 Stage 라우트 정상 동작 | ✅ Met | generateStaticParams 20 slugs |
| 설명 모드 토글 → localStorage 유지 | ✅ Met | zustand persist, key: "react-bible-explanation-mode" |
| TypeScript strict 에러 0건 | ✅ Met | TypeScript pass |
| `docs/stages/PROGRESS.md` 완비 | ✅ Met | 20개 Stage 체크리스트 완성 |
| Stage 01~20 콘텐츠 구현 | ⏳ Next | 명시적 스코프 아웃 (다음 세션부터) |

**성공률: 5/5 (이번 세션 범위 기준 100%)**

---

## 2. PDCA 사이클 요약

### 2.1 흐름

```
[Plan ✅] → [Design ✅] → [Do ✅] → [Check ✅ 97%] → [Report ✅]
```

| Phase | 결과 | 핵심 산출물 |
|-------|------|------------|
| Plan | ✅ | 20단계 로드맵, 기술 스택 확정, Context Anchor |
| Design | ✅ | Option C (Pragmatic Balance) 선택, 컴포넌트 계층 설계 |
| Do | ✅ | 16개 파일 구현, 2세션 (뼈대 + UX 개선) |
| Check | ✅ 97% | 1 Low Gap (HintTooltip 인라인화) |
| Report | ✅ | 이 문서 |

### 2.2 세션 이력

| 세션 | 작업 내용 |
|------|-----------|
| 세션 1 | Next.js 16.2.2 초기화, 레이아웃 뼈대, 20개 Stage placeholder, pnpm build 통과 |
| 세션 2 | UX 개선: concept 인라인, 그룹 서브타이틀, 사이드바 토글, ? 힌트 tooltip, 키보드 이동, 마지막 방문 기억 |

---

## 3. 구현 결과

### 3.1 생성된 파일 (16개)

| 파일 | 역할 |
|------|------|
| `src/lib/utils.ts` | cn() 유틸리티 |
| `src/types/stage.ts` | Stage, Difficulty, ExplanationMode 타입 |
| `src/lib/stages.ts` | 20개 Stage 메타데이터 단일 진실 공급원 |
| `src/stores/explanation-store.ts` | 설명 모드 전역 상태 (localStorage persist) |
| `src/components/ui/badge.tsx` | DifficultyBadge + StatusBadge |
| `src/components/layout/explanation-toggle.tsx` | 🟢/🔵 토글 + ? 힌트 tooltip + pulse |
| `src/components/layout/sidebar.tsx` | Phase별 20단계 사이드바 (그룹 서브타이틀 포함) |
| `src/components/layout/stage-layout.tsx` | 탭 레이아웃 + 이전/다음 + 키보드 이동 |
| `src/components/layout/main-layout.tsx` | 사이드바 토글 클라이언트 컴포넌트 |
| `src/components/layout/home-redirect.tsx` | 마지막 방문 Stage 복귀 리다이렉트 |
| `src/components/providers/query-provider.tsx` | TanStack Query 프로바이더 |
| `src/app/globals.css` | 글로벌 스타일 |
| `src/app/layout.tsx` | RootLayout (QueryProvider + Header + MainLayout) |
| `src/app/page.tsx` | HomeRedirect 진입점 |
| `src/app/stage/[slug]/page.tsx` | 동적 Stage 라우트 (Next.js 15+ async params) |
| `docs/stages/PROGRESS.md` | 세션 간 Stage 진행 체크리스트 |

---

## 4. Key Decisions & Outcomes

| 결정 사항 | 선택 | 결과 |
|-----------|------|------|
| 아키텍처 패턴 | Option C — Pragmatic Balance | 파일 구조 간결, 과잉 추상화 없음 |
| 상태 관리 | Zustand persist | localStorage 자동 동기화, boilerplate 최소 |
| 라우팅 | Next.js App Router + generateStaticParams | 24페이지 정적 생성, SEO 가능 |
| 스타일 | Tailwind v4, zinc-950 다크 테마 | VSCode 계열 개발자 도구 느낌 달성 |
| 설명 이중 구조 | useExplanationStore() 분기 패턴 | 각 Stage theory.tsx에서 재사용 가능한 패턴 확립 |
| params 처리 | Promise<{ slug }> (Next.js 15+ async) | 최신 Next.js 16.2.2 호환 |

---

## 5. Gap Analysis 결과

**Match Rate: 97%**

| # | 심각도 | 항목 | 판단 |
|---|--------|------|------|
| 1 | Low | HintTooltip 별도 컴포넌트 vs 인라인 | 허용 — 기능 동일, 50줄 미만 |

스코프 아웃: Stage 01~20 콘텐츠 (`src/features/stage-0X/`) — 다음 세션 작업

---

## 6. 다음 세션 가이드

```
세션 시작:
  1. docs/stages/PROGRESS.md 확인 → Stage 01 (immutability) 시작
  2. /pdca plan stage-01-immutability

구현 패턴 (Stage마다 반복):
  3. src/features/stage-01-immutability/ 폴더 생성
  4. theory.tsx — 초딩🟢/개발자🔵 이중 설명 (useExplanationStore 분기)
  5. playground.tsx — 인터렉티브 실험 UI
  6. code-viewer.tsx — 핵심 코드 + 문법 강조
  7. src/app/stage/[slug]/page.tsx 에 import + StageLayout 주입

검증:
  8. /pdca analyze stage-01-immutability
  9. Match Rate ≥ 90% → PROGRESS.md [x] + stages.ts status: 'done'
```

---

## 7. 학습된 패턴 (다음 PDCA에 활용)

1. **Next.js 15+ async params**: `params: Promise<{ slug: string }>` 패턴 확립 — 이후 모든 동적 라우트에 적용
2. **Zustand persist 패턴**: `persist(set => ({}), { name: 'key' })` — localStorage 연동 스토어 표준
3. **이중 설명 컴포넌트 패턴**: `mode === "child" ? <ChildExplanation /> : <DevExplanation />` — Stage 01~20 공통 패턴
4. **세션 범위 분리**: 뼈대 세션과 콘텐츠 세션 분리 → 컨텍스트 집중 효과
