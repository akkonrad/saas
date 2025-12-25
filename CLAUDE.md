# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is an Nx monorepo for building SaaS applications with Angular (frontend) and NestJS (backend). The project follows a strict "Library-First" approach where applications are minimal shells and all business logic lives in libraries.

**Tech Stack:** Angular 21 (Signals, Standalone), NestJS 11, Supabase (Auth & DB), Stripe (Payments), Zod (Validation), Tailwind CSS

## Architecture Principles

### App-as-a-Shell Pattern
- **Applications** (`api/`, `web/`, `landing/`) are minimal entry points with minimal and specific business logic
- **Libraries** (`libs/`) contain most features, services, components, and utilities

### Domain-Driven Library Organization

This monorepo follows a **domain-driven** approach where libraries are organized by business domain rather than technical type. This aligns with Domain-Driven Design (DDD) principles and scales better as the project grows.

**Structure Pattern:**
```
libs/
├── api/
│   ├── {domain}/          # Domain grouping (e.g., supabase, billing, users)
│   │   ├── {library}/     # Specific library (e.g., auth, core, storage)
│   └── ...
├── web/
│   ├── {domain}/          # Domain grouping (e.g., supabase, billing, users)
│   │   ├── {library}/     # Specific library (e.g., auth, forms)
│   └── ...
└── shared/
    └── {library}/         # Shared across all domains
```

**Library Types** (enforced via tags, not folder names):

- **`type:feature`**: Smart components with routing (Angular) or controllers (NestJS)
- **`type:ui`**: Presentational components (Angular) or DTOs/Entities (NestJS)
- **`type:data-access`**: Services, API clients, database access
- **`type:util`**: Pure functions, helpers, schemas, shared types

**Real Examples:**
```
libs/api/supabase/core       → @saas/api/supabase-core (type:data-access)
libs/api/supabase/auth       → @saas/api/supabase-auth (type:data-access)
libs/api/supabase/database   → @saas/api/supabase-database (type:data-access)
libs/api/supabase/storage    → @saas/api/supabase-storage (type:data-access)
libs/web/supabase/auth       → @saas/web/supabase-auth (type:data-access)
libs/web/supabase/forms      → @saas/web/supabase-forms (type:data-access)
libs/shared/util-schema      → @saas/shared/util-schema (type:util)
```

**Naming Conventions:**
- Library names should be **concise and domain-focused**
- No technical prefixes in names (e.g., `supabase-core` NOT `data-access-supabase-core`)
- Import paths are short: `@saas/{platform}/{library-name}`, eg. `@saas/api/supabase-auth`
- Project names must be unique across all libraries (use platform prefix if needed)
- Exception is ui library - this should be `@ui/<component-name>`

### UI Components 
- Use `@ui` prefix for UI components
- All UI components should be in `libs/ui` folder
- Use `@ui/<component-name>` import paths
- UI components should be standalone, on-push change detection, and have no business logic


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

4. **Domain Tags** (business domain - optional but recommended):
   - `domain:supabase` - Supabase-related libraries
   - `domain:billing` - Billing and payment libraries
   - `domain:users` - User management libraries
   - etc.

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

// libs/api/supabase/core/project.json
"tags": ["type:data-access", "platform:node", "scope:shared", "domain:supabase"]

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
- Database logic belongs in domain-specific libraries (e.g., `libs/api/supabase/*`)

### Stripe Integration
- All Stripe logic goes in `libs/api/billing/stripe`
- Webhooks MUST be idempotent
- Handle webhooks in dedicated controller with proper signature verification

### Mailing
- Use Mailchimp Transactional (Mandrill) API for emails
- Email templates and logic in `libs/api/mailing/*` (domain-specific libraries)

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
- Services in domain-specific libraries (e.g., `libs/web/supabase/*`) return Signals or Observables
- Keep components lean - business logic in services

### Routing
- Main routing configuration in `libs/web/shell/*` or app routing
- Feature modules define their own child routes

## Generating Libraries

Use Nx generators with proper tags to create new libraries. Follow the **domain-driven** structure:

### API/NestJS Libraries (Domain-Driven)
```bash
# Example: Creating a Supabase auth library
npx nx generate @nx/nest:lib \
  --name=supabase-auth \
  --directory=libs/api/supabase/auth \
  --importPath=@saas/api/supabase-auth \
  --tags=type:data-access,platform:node,scope:shared,domain:supabase \
  --strict \
  --unitTestRunner=jest

# Example: Creating a billing Stripe library
npx nx generate @nx/nest:lib \
  --name=billing-stripe \
  --directory=libs/api/billing/stripe \
  --importPath=@saas/api/billing-stripe \
  --tags=type:data-access,platform:node,scope:shared,domain:billing \
  --strict \
  --unitTestRunner=jest
```

### Web/Angular Libraries (Domain-Driven)
```bash
# Example: Creating a Supabase auth library for web
npx nx generate @nx/angular:lib \
  --name=web-supabase-auth \
  --directory=libs/web/supabase/auth \
  --importPath=@saas/web/supabase-auth \
  --tags=type:data-access,platform:web,scope:faceless,domain:supabase \
  --strict \
  --standalone

# Example: Creating a dashboard feature
npx nx generate @nx/angular:lib \
  --name=dashboard-feature \
  --directory=libs/web/dashboard/feature \
  --importPath=@saas/web/dashboard-feature \
  --tags=type:feature,platform:web,scope:faceless,domain:dashboard \
  --strict \
  --standalone
```

### Shared/JS Libraries
```bash
npx nx generate @nx/js:library \
  --name=util-schema \
  --directory=libs/shared/util-schema \
  --importPath=@saas/shared/util-schema \
  --bundler=tsc \
  --tags=type:util,platform:shared,scope:shared \
  --strict \
  --unitTestRunner=jest
```

**Key Principles:**
- **Always** specify required tags: `type:*`, `platform:*`, `scope:*`
- **Optionally** add `domain:*` tag for better organization
- Use **domain-driven directory structure**: `libs/{platform}/{domain}/{library}`
- Keep **library names short** and domain-focused (no technical prefixes)
- **Import paths** should be concise: `@saas/{platform}/{library-name}`

## Shared Code ("Single Truth")

Shared libraries (`libs/shared/**`) contain code used by BOTH frontend and backend:

### What Goes in Shared Libraries:
- **Zod Schemas** (`util-schema`) - Validation schemas shared between frontend and backend
- **TypeScript Types/Interfaces** - Inferred from Zod schemas via `z.infer<typeof Schema>`
- **Constants & Enums** - Shared configuration values, status codes, etc.
- **Pure Utility Functions** - Functions that work in both browser and Node.js (no platform-specific APIs)
- **DTO Definitions** - Data Transfer Objects used in API contracts

### What Does NOT Go in Shared Libraries:
- HTTP clients (Angular HttpClient, Axios) → `libs/web/{domain}/*`
- Database queries → `libs/api/{domain}/*`
- Components → `libs/web/{domain}/*`
- NestJS services → `libs/api/{domain}/*`
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
├── apps/
│   ├── faceless/
│   │   ├── api/            # NestJS backend (minimal shell)
│   │   └── web/            # Angular frontend (minimal shell)
├── libs/                   # All business logic lives here
│   ├── api/                # Backend-specific libraries (domain-driven)
│   │   ├── supabase/       # Supabase domain
│   │   │   ├── core/       # @saas/api/supabase-core
│   │   │   ├── auth/       # @saas/api/supabase-auth
│   │   │   ├── database/   # @saas/api/supabase-database
│   │   │   └── storage/    # @saas/api/supabase-storage
│   │   ├── billing/        # Billing domain (future)
│   │   └── ...
│   ├── web/                # Frontend-specific libraries (domain-driven)
│   │   ├── supabase/       # Supabase domain
│   │   │   └── auth/       # @saas/web/supabase-auth
│   │   ├── dashboard/      # Dashboard domain (future)
│   │   └── ...
│   └── shared/             # Code shared between frontend and backend
│       └── util-schema/    # @saas/shared/util-schema
```

**Key Points:**
- Libraries are organized by **business domain** (supabase, billing, users, etc.)
- Each domain can contain multiple libraries with specific responsibilities
- Import paths are short and domain-focused
- This structure scales well as the monorepo grows

## Environment Configuration

Required environment variables depend on what is required in a given app, eg: 
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

