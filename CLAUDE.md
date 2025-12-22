# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is an Nx monorepo for building SaaS applications with Angular (frontend) and NestJS (backend). The project follows a strict "Library-First" approach where applications are minimal shells and all business logic lives in libraries.

**Tech Stack:** Angular 21 (Signals, Standalone), NestJS 11, Supabase (Auth & DB), Stripe (Payments), Zod (Validation), Tailwind CSS

## Common Commands

### Development
```bash
# Start backend API (runs on http://localhost:3000/api)
npx nx serve api

# Start frontend (runs on http://localhost:4200, proxies /api to backend)
npx nx serve web

# Run both (web target depends on api:serve)
npx nx serve web
```

### Testing
```bash
# Run all tests
npx nx run-many -t test

# Run tests for specific project
npx nx test api
npx nx test web

# Run E2E tests for API
npx nx e2e api-e2e

# Run tests in CI mode with coverage
npx nx test api --configuration=ci
```

### Building
```bash
# Build API for production
npx nx build api

# Build web app for production
npx nx build web

# Build all projects
npx nx run-many -t build
```

### Linting & Formatting
```bash
# Lint all projects
npx nx run-many -t lint

# Lint specific project
npx nx lint web

# Format with Prettier
npx prettier --write .
```

## Architecture Principles

### App-as-a-Shell Pattern
- **Applications** (`api/`, `web/`) are minimal entry points with NO business logic
- **Libraries** (`libs/`) contain ALL features, services, components, and utilities
- This ensures maximum code reuse and maintainability

### Library Naming Conventions
When creating new libraries, follow these patterns:

- **`feature-*`**: Smart components with routing (Angular) or controllers (NestJS)
  - Example: `libs/web/feature-dashboard`, `libs/api/feature-billing`

- **`ui-*`**: Presentational components (Angular) or DTOs/Entities (NestJS)
  - Example: `libs/web/ui-kit`, `libs/shared/ui-common`

- **`data-access-*`**: Services, API clients, database access
  - Example: `libs/api/data-access-stripe`, `libs/web/data-access-auth`

- **`util-*`**: Pure functions, helpers, schemas, shared types
  - Example: `libs/shared/util-schema`, `libs/api/util-logger`

### Module Boundaries
The project enforces Nx module boundaries via ESLint. Respect these constraints:
- Backend code (`libs/api/**`) cannot import frontend code (`libs/web/**`)
- Shared code (`libs/shared/**`) can be imported by both frontend and backend
- Applications import from libraries, never the reverse

## Backend (NestJS) Guidelines

### Validation
- **ALWAYS use Zod** for DTOs and validation, NOT class-validator
- Define schemas in `libs/shared/util-schema` for shared validation
- Export TypeScript types via `z.infer<typeof Schema>`

### Database (Supabase)
- Use `supabase-js` client with `SERVICE_ROLE` key for backend operations
- Auth guards should use Supabase JWT verification
- Database logic belongs in `data-access-*` libraries

### Stripe Integration
- All Stripe logic goes in `libs/api/data-access-billing` (or similar)
- Webhooks MUST be idempotent
- Handle webhooks in dedicated controller with proper signature verification

### Mailing
- Use Mailchimp Transactional (Mandrill) API for emails
- Email templates and logic in `libs/api/data-access-mailing`

## Frontend (Angular) Guidelines

### Modern Angular Patterns
- **Signals**: Use Signals for state management instead of RxJS where possible
- **Standalone Components**: All components are standalone (no NgModules)
- **Required Inputs**: Use `input.required<T>()` for mandatory inputs
- **OnPush Change Detection**: Prefer `ChangeDetectionStrategy.OnPush` or leverage Signals' automatic change detection

### Styling
- **Tailwind CSS only**: Use utility-first approach
- Avoid custom CSS unless absolutely necessary
- Component styles should be minimal

### Data Access
- Services in `data-access-*` libraries return Signals or Observables
- Keep components lean - business logic in services

### Routing
- Main routing configuration in `libs/web/feature-shell`
- Feature modules define their own child routes

## Shared Code ("Single Truth")

The `libs/shared/util-schema` library is the **single source of truth** for:
- Validation schemas (Zod)
- Shared TypeScript types (via `z.infer`)
- Data contracts between frontend and backend

When adding new entities or DTOs:
1. Define Zod schema in `libs/shared/util-schema`
2. Export TypeScript type: `export type User = z.infer<typeof UserSchema>`
3. Use schema for validation on backend
4. Use type for type safety on frontend

## Project Structure

```
saas/
├── apps/               # NestJS backend application (minimal shell)
    ├── api/            # NestJS backend application (minimal shell)
    └── web/            # Angular frontend application (minimal shell)
├── libs/               # All business logic lives here (to be created)
│   ├── api/            # Backend-specific libraries
│   ├── web/            # Frontend-specific libraries
│   └── shared/         # Code shared between frontend and backend
```

Note: The `libs/` directory structure will be built out as features are added following the library naming conventions above.

## Environment Configuration

Required environment variables depend on what is required in a given app.
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `SENTRY_DSN`

Copy `.env.example` to `.env` and configure before running.

## Development Workflow

1. Backend runs on port 3000 with `/api` prefix
2. Frontend runs on port 4200 and proxies `/api/*` requests to backend (see `web/proxy.conf.json`)
3. When running `npx nx serve web`, the API is automatically started first (see `web/project.json` dependsOn)
4. Tests use Jest across all projects
