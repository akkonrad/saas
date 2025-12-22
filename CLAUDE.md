# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is an Nx monorepo for building SaaS applications with Angular (frontend) and NestJS (backend). The project follows a strict "Library-First" approach where applications are minimal shells and all business logic lives in libraries.

**Tech Stack:** Angular 21 (Signals, Standalone), NestJS 11, Supabase (Auth & DB), Stripe (Payments), Zod (Validation), Tailwind CSS

## Common Commands

### Development
```bash
# Faceless App
yarn start:face          # Start faceless web (auto-starts API)
yarn start:face:web      # Start faceless web only
yarn start:face:api      # Start faceless API only

# Direct Nx commands
yarn nx serve face-web       # Faceless web (runs on http://localhost:4200)
yarn nx serve face-api       # Faceless API (runs on http://localhost:3000/api)
```

### Testing
```bash
# Run all tests
yarn nx run-many -t test

# Run tests for specific project
yarn nx test face-api
yarn nx test face-web

# Run E2E tests for API
yarn nx e2e face-api-e2e

# Run tests in CI mode with coverage
yarn nx test face-api --configuration=ci
```

### Building
```bash
# Build faceless API for production
yarn nx build face-api

# Build faceless web app for production
yarn nx build face-web

# Build all projects
yarn nx run-many -t build
```

### Linting & Formatting
```bash
# Lint all projects
yarn nx run-many -t lint

# Lint specific project
yarn nx lint face-web

# Format with Prettier
yarn prettier --write .
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

### Nx Tags System
Projects and libraries use tags to enforce architectural constraints. Tags are defined in each `project.json` file and validated by ESLint.

**Tag Categories:**

1. **Type Tags** (what kind of project):
   - `type:app` - Applications (minimal shells)
   - `type:feature` - Feature libraries (smart components with routing/controllers)
   - `type:ui` - UI/presentational libraries (components, DTOs, entities)
   - `type:data-access` - Data access libraries (services, API clients, database)
   - `type:util` - Utility libraries (pure functions, helpers, schemas)

2. **Platform Tags** (where it runs):
   - `platform:web` - Angular/frontend code
   - `platform:node` - NestJS/backend code
   - `platform:shared` - Code shared between frontend and backend

3. **Scope Tags** (which product/domain):
   - `scope:faceless` - Faceless product
   - `scope:shared` - Shared across all products

**Dependency Rules:**
- `platform:web` can only depend on `platform:web` or `platform:shared`
- `platform:node` can only depend on `platform:node` or `platform:shared`
- `platform:shared` can only depend on other `platform:shared`
- `type:app` can depend on any library type
- `type:feature` can depend on `type:ui`, `type:data-access`, `type:util`
- `type:ui` can only depend on `type:ui` and `type:util`
- `type:data-access` can only depend on `type:data-access` and `type:util`
- `type:util` can only depend on other `type:util`

**Example Tags:**
```json
// apps/faceless/web/project.json
"tags": ["type:app", "platform:web", "scope:faceless"]

// libs/web/feature-dashboard/project.json
"tags": ["type:feature", "platform:web", "scope:shared"]

// libs/shared/util-schema/project.json
"tags": ["type:util", "platform:shared", "scope:shared"]
```

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

## Generating Libraries

Use Nx generators with proper tags to create new libraries:

### API/NestJS Libraries
```bash
npx nx generate @nx/nest:lib \
  --name=data-access-supabase \
  --directory=libs/api/data-access-supabase \
  --importPath=@saas/api/data-access-supabase \
  --projectNameAndRootFormat=as-provided \
  --tags=type:data-access,platform:node,scope:shared \
  --strict \
  --unitTestRunner=jest
```

### Web/Angular Libraries
```bash
npx nx generate @nx/angular:lib \
  --name=feature-dashboard \
  --directory=libs/web/feature-dashboard \
  --importPath=@saas/web/feature-dashboard \
  --projectNameAndRootFormat=as-provided \
  --tags=type:feature,platform:web,scope:faceless \
  --strict \
  --standalone
```

### Shared/JS Libraries
```bash
npx nx generate @nx/js:library \
  --name=util-schema \
  --directory=libs/shared/util-schema \
  --importPath=@saas/shared/util-schema \
  --projectNameAndRootFormat=as-provided \
  --bundler=tsc \
  --tags=type:util,platform:shared,scope:shared \
  --strict \
  --unitTestRunner=jest
```

**Remember:** Always specify all three tag types: `type:*`, `platform:*`, `scope:*`

## Shared Code ("Single Truth")

Shared libraries (`libs/shared/**`) contain code used by BOTH frontend and backend:

### What Goes in Shared Libraries:
- **Zod Schemas** (`util-schema`) - Validation schemas shared between frontend and backend
- **TypeScript Types/Interfaces** - Inferred from Zod schemas via `z.infer<typeof Schema>`
- **Constants & Enums** - Shared configuration values, status codes, etc.
- **Pure Utility Functions** - Functions that work in both browser and Node.js (no platform-specific APIs)
- **DTO Definitions** - Data Transfer Objects used in API contracts

### What Does NOT Go in Shared Libraries:
- HTTP clients (Angular HttpClient, Axios) → `libs/web/data-access-*` or `libs/api/data-access-*`
- Database queries → `libs/api/data-access-*`
- Components → `libs/web/ui-*` or `libs/web/feature-*`
- NestJS services → `libs/api/data-access-*`
- Platform-specific code (DOM, Node.js APIs)

### Example: Shared Schema Library
The `libs/shared/util-schema` library is the **single source of truth** for:
- Validation schemas (Zod)
- Shared TypeScript types (via `z.infer`)
- Data contracts between frontend and backend

When adding new entities or DTOs:
1. Define Zod schema in `libs/shared/util-schema`
2. Export TypeScript type: `export type User = z.infer<typeof UserSchema>`
3. Use schema for validation on backend (NestJS)
4. Use type for type safety on frontend (Angular)

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

## Available Skills

This project includes custom skills to help with development. Skills are located in `.claude/skills/`:

- `/nest` - NestJS development best practices reviewer and helper
- `/ng` - Angular development best practices reviewer and helper

Run these skills when working with NestJS or Angular code to ensure best practices are followed.

## Tasks Template

Follow this template when defining tasks that you will follow when executing:

```
T1. Task title
Task description
- sub task 1 (if needed)
- sub task 2 (if needed)
Requirements: T0.artifact1, T0.artifact2, T5.artifact4
Artifacts:
- T1.artifact1 (use descriptive names, e.g., T1.data-access-service)
```

