# Lint

ESLint를 실행합니다.

```bash
# 검사만
pnpm lint

# 자동 수정
pnpm exec eslint --fix src/
```

eslint-config-next 규칙이 적용됩니다.
커밋 전 lint 에러 0건 확인 필수.
