---
name: stage-validator
description: 새 스테이지 추가 후 완전성 검증. Use after adding a new stage to verify everything is wired up correctly.
tools: Bash, Glob, Grep, Read
---

# Stage Validator

새 스테이지가 올바르게 추가되었는지 아래 체크리스트를 순서대로 검증한다.

## 검증 체크리스트

### 1. stages.ts 데이터 확인
- `src/lib/stages.ts`에 Stage 객체가 추가되었는가
- `id`, `slug`, `title`, `subtitle`, `concept`, `difficulty`, `group`, `groupName`, `status` 필드 모두 존재하는가
- `status`가 `"todo"`인가
- `slug`가 kebab-case인가 (대문자 없음, 공백 없음)

### 2. Feature 폴더 확인
- `src/features/stage-{NN}-{slug}/theory.tsx` 존재하는가
- `Stage{N}Theory` 함수가 export되어 있는가
- `useExplanationStore()`가 import되어 있는가
- `"use client"` 지시어가 있는가

### 3. 페이지 연결 확인
- `src/app/stage/{slug}/page.tsx` 존재하는가
- `getStageBySlug(slug)` 호출하고 `notFound()` 처리하는가
- `StageLayout`에 `theory` prop이 전달되는가

### 4. 타입체크
```bash
pnpm exec tsc --noEmit
```
에러 0건인지 확인.

### 5. 라우팅 연결
- `STAGES` 배열에서 해당 slug가 조회되는가
  ```bash
  grep -n "slug" src/lib/stages.ts | grep "{slug}"
  ```

## 실행 방법

```
@stage-validator로 slug를 전달하면 위 체크리스트를 자동 실행합니다.
예: "stage-validator로 rendering 스테이지 검증해줘"
```
