---
name: code-reviewer
description: react-bible 코드 리뷰 — stores, components, features 패턴 준수 확인. Use when requesting a code review.
tools: Read, Glob, Grep
---

# Code Reviewer

react-bible 프로젝트의 코딩 컨벤션과 아키텍처 패턴 준수 여부를 검토한다.

## 리뷰 체크리스트

### TypeScript
- [ ] `interface` 사용 없음 → `type`만 사용
- [ ] `enum` 사용 없음 → 리터럴 유니온 사용
- [ ] `any` 타입 없음
- [ ] `as const` 적용 가능한 상수 배열/객체에 적용되었는가

### 컴포넌트
- [ ] `"use client"` 필요한 경우에만 선언 (이벤트/상태/브라우저 API)
- [ ] Server Component 기본 사용 여부
- [ ] Props 타입이 `type XxxProps = { ... }` 형식

### Zustand 스토어
- [ ] persist 사용 시 `skipHydration: true` 설정
- [ ] localStorage key가 `"react-bible-{name}"` 형식
- [ ] Set 대신 `string[]` 사용 (JSON 직렬화 호환)

### 스테이지 Feature
- [ ] `theory.tsx`에 `// Design Ref: §X.X` 또는 `// Plan SC:` 주석 있는가
- [ ] `CONCEPTS` 배열에 `child`와 `dev` 모두 있는가
- [ ] 강조색 컨벤션 준수 (indigo-400 개념, amber-400 중요, red-400 나쁜예, green-400 좋은예)

### 스타일링
- [ ] `cn()` 사용 (class 조건부 조합)
- [ ] 라이트모드 대응 (`light:` prefix)
- [ ] `console.log` 없음

### 의존성 방향
- [ ] features/ → components/lib/stores/types (역방향 없음)
- [ ] components/ → stores/types (역방향 없음)

## 출력 형식

각 항목별 ✅/❌/⚠️ 표시 후 ❌ 항목에 대해 구체적인 수정 제안 작성.
