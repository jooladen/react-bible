---
name: react-bible-testing
description: react-bible 테스트 전략 — 현재 테스트 없음, 추가 시 가이드. Use when setting up or writing tests.
type: project
---

# react-bible Testing Skill

## 현재 상태
테스트 도구 미설치. 테스트 파일 없음.

## 테스트 추가 시 권장 스택

### 단위/통합 테스트
```bash
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/user-event
```

### E2E 테스트
```bash
pnpm add -D @playwright/test
```

## 테스트 우선순위 (구현 시)

### 1순위: 스토어 단위 테스트
```
stores/progress-store.ts
  - markDone: 중복 slug 방지 검증
  - isCompleted: 완료/미완료 상태 검증
  - persist: rehydrate 후 상태 복원 검증

stores/explanation-store.ts
  - toggle: child ↔ dev 모드 전환 검증
```

### 2순위: 유틸 함수 단위 테스트
```
lib/stages.ts
  - getStageBySlug: 유효한 slug → Stage 반환
  - getStageBySlug: 없는 slug → undefined 반환
  - getStagesByGroup: 그룹별 필터링 검증

lib/stage-utils.ts
  - 각 유틸 함수 입출력 검증
```

### 3순위: 컴포넌트 통합 테스트
```
StageLayout: 이전/다음 내비게이션 버튼 렌더링
StageLayout: 학습 완료 버튼 → markDone 호출 → "완료됨" 표시
```

### 4순위: E2E
```
/stage/immutability → 이론 탭 콘텐츠 표시
초딩/개발자 모드 전환 → 컨텐츠 변경 확인
```

## vitest 설정 예시 (추가 시)
```ts
// vitest.config.ts
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom" },
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
})
```

## package.json scripts 추가 (추가 시)
```json
"test": "vitest",
"test:ui": "vitest --ui",
"test:e2e": "playwright test"
```
