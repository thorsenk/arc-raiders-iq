# Agent workflow

## Auto-commit policy

- After completing each requested task, create a git commit for the changes made (no auto-push).
- Prefer one commit per logical change; avoid mixing docs/data/UI when practical.
- Use Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`).

## Verification

- Prefer `npm run build` to verify changes (non-interactive).
- Avoid `npm run lint` unless ESLint is already configured non-interactively.
