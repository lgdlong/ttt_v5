# Code Standards

## General Principles

Follow YAGNI, KISS, and DRY principles:
- **YAGNI**: Write code when actually needed
- **KISS**: Keep solutions simple
- **DRY**: Don't repeat yourself

## File Naming

| Language | Convention | Example |
|----------|------------|---------|
| Go | snake_case | `user_service.go` |
| React/TypeScript | kebab-case | `user-profile.tsx` |
| CSS | kebab-case | `app-styles.css` |
| Configuration | kebab-case | `docker-compose.yml` |

## Go Patterns

### Project Structure

```
backend/
├── cmd/server/           # Entry points
│   └── main.go
├── config/               # Configuration
│   └── config.go
├── internal/            # Private packages
│   ├── delivery/        # HTTP handlers
│   │   ├── middleware/
│   │   └── router/
│   └── repository/      # Data access
└── pkg/               # Public packages
```

### Naming Conventions

- **Packages**: lowercase, short, descriptive
- **Functions**: PascalCase (exported), camelCase (unexported)
- **Constants**: PascalCase
- **Interfaces**: `er` suffix (e.g., `Reader`, `Writer`)
- **Errors**: prefix with "failed to" (e.g., `ErrFailedToLoadConfig`)

### Error Handling

```go
// Always handle errors explicitly
if err != nil {
    return fmt.Errorf("failed to load config: %w", err)
}
```

## React/TypeScript Conventions

### Component Structure

```tsx
// 1. Imports (React, then third-party, then local)
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// 2. Props interface
interface ButtonProps {
  variant?: 'default' | 'outline'
  children: React.ReactNode
}

// 3. Component
export function Button({ variant = 'default', children }: ButtonProps) {
  return <button className={cn('btn', variant)}>{children}</button>
}
```

### Naming

- **Components**: PascalCase (e.g., `UserProfile`)
- **Hooks**: `use` prefix (e.g., `useAuth`)
- **Utilities**: camelCase (e.g., `formatDate`)
- **Types/Interfaces**: PascalCase

### Styling

- Use Tailwind CSS v4 with CSS variables
- Avoid hardcoded colors (use semantic tokens)
- Prefer composition over custom CSS

## Git Workflow

### Commit Messages

Use conventional format:

```
type(scope): description

[optional body]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```
feat(auth): add user login endpoint

Implements JWT-based authentication with refresh tokens.
```

### Branch Naming

```
type/description
```

Examples:
- `feat/user-authentication`
- `fix/docker-build-error`
- `docs/update-readme`

### Rules

- Never commit secrets (API keys, credentials)
- Run lint before commit
- Run tests before push

## Code Quality

- No syntax errors
- Code is compilable
- Handle edge cases
- Add meaningful comments for complex logic
- Write self-documenting code

## Pre-commit Checklist

1. Run linting
2. Run tests
3. Verify no secrets in commit
4. Check commit message format