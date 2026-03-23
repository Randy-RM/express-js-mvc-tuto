[← Back to README](../README.md)

# Commit Conventions

This project enforces [Conventional Commits](https://www.conventionalcommits.org/) via **commitlint** and **Husky** git hooks. Every commit message is validated automatically before being accepted.

---

## Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

| Part | Required | Description |
|---|---|---|
| **type** | ✅ | Category of the change |
| **scope** | ❌ | Module or area affected (e.g. `auth`, `articles`, `config`) |
| **description** | ✅ | Short summary in imperative mood, lowercase, no period at the end |
| **body** | ❌ | Detailed explanation of *what* and *why* |
| **footer** | ❌ | Breaking changes, issue references |

---

## Allowed Types

| Type | When to Use |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only changes |
| `style` | Code style (formatting, semicolons…) — no logic change |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `build` | Changes to build system or dependencies |
| `ci` | CI/CD configuration changes |
| `chore` | Maintenance tasks (tooling, config…) |
| `revert` | Reverts a previous commit |

---

## Examples

### Simple commits

```bash
# New feature
git commit -m "feat: add article pagination"

# Bug fix
git commit -m "fix: handle expired JWT token gracefully"

# Documentation
git commit -m "docs: add API rate limiting section to README"

# Code style
git commit -m "style: fix indentation in user controller"

# Refactor
git commit -m "refactor: extract token validation into utility function"

# Performance
git commit -m "perf: add database index on article.createdAt"

# Tests
git commit -m "test: add unit tests for auth service"

# Build / Dependencies
git commit -m "build: update mongoose to v9.4"

# CI
git commit -m "ci: add Node.js 22 to GitHub Actions matrix"

# Chore
git commit -m "chore: configure lint-staged and husky"
```

### Commits with scope

```bash
git commit -m "feat(auth): implement refresh token rotation"

git commit -m "fix(articles): return 404 when article not found"

git commit -m "refactor(middlewares): simplify error handler logic"

git commit -m "docs(swagger): add missing response schemas"
```

### Commits with body and footer

```bash
git commit -m "feat(users): add email verification on registration

Users now receive a verification email after signing up.
The account remains inactive until the email link is clicked.

Closes #42"
```

```bash
git commit -m "refactor(services): reorganize service layer exports

Barrel exports now follow a consistent pattern across all services.
This reduces circular dependency issues when importing.

BREAKING CHANGE: import paths for services have changed"
```

---

## What Gets Rejected

```bash
# ❌ No type
git commit -m "updated the user model"

# ❌ Unknown type
git commit -m "update: changed article schema"

# ❌ Empty subject
git commit -m "feat:"

# ❌ Subject starts with uppercase
git commit -m "feat: Add new endpoint"
```

---

## Pre-commit Checks

In addition to commit message validation, each commit automatically triggers:

| Hook | Tool | Action |
|---|---|---|
| `pre-commit` | **lint-staged** | Runs ESLint (with auto-fix) and Prettier on staged `.ts` files |
| `commit-msg` | **commitlint** | Validates the commit message format |

This means your code is always linted and formatted before it enters the git history.

---

## Tips

- Write the description in **imperative mood**: "add feature" not "added feature" or "adds feature"
- Keep the description under **100 characters**
- Use the **body** to explain *why*, not *what* (the diff shows what changed)
- Reference issues in the **footer**: `Closes #12`, `Fixes #34`
- One commit = one logical change — avoid mixing unrelated changes

---

> **Tools used:** [Husky](https://typicode.github.io/husky/) · [commitlint](https://commitlint.js.org/) · [lint-staged](https://github.com/lint-staged/lint-staged) · [Conventional Commits](https://www.conventionalcommits.org/)

[← Back to README](../README.md)
