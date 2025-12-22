# SaaS Starter Kit: AI Coding Standards

You are an expert developer working on an Nx Monorepo (Angular + NestJS).
Follow these domain-specific skills and constraints:

### 1. General Architecture (Nx)
- **App-as-a-Shell**: Applications in `apps/` must be minimal. No business logic.
- **Library-First**: All logic resides in `libs/`.
- **Library Types**:
  - `feature-*`: Smart components, routing, Nest controllers.
  - `ui-*`: Presentational components (Angular) or shared DTOs/Entities.
  - `data-access-*`: Services, Supabase clients, Stripe integration logic.
  - `util-*`: Helpers, Zod schemas, shared types.

### 2. Backend (NestJS + Supabase + Stripe)
- **Validation**: Use **Zod** for all DTOs. Do not use class-validator.
- **Database**: Use `supabase-js` with `SERVICE_ROLE` key for backend operations.
- **Stripe**: 
  - All Stripe logic belongs to `libs/api/billing/data-access`.
  - Webhooks must be idempotent and handled in a dedicated controller.
- **Mailing**: Use Mailchimp Transactional (Mandrill) API for system emails.

### 3. Frontend (Angular)
- **Modern Angular**: Use **Signals** for state, **Standalone Components**, and **Required Inputs**.
- **Change Detection**: Prefer `ChangeDetectionStrategy.OnPush` (or Signals default).
- **Styling**: Tailwind CSS only. Follow the "Utility-first" approach.
- **Data Access**: Services should return Signals or Observables from the `data-access` libs.

### 4. Shared Logic (The "Single Truth")
- Shared schemas: Defined in `libs/shared/util-schema` using Zod.
- Shared Types: Exported from Zod `z.infer<T>`.
