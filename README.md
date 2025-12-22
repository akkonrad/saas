# 🚀 Ultimate SaaS Starter Kit (Nx, Angular, NestJS)

Professional, scalable starter kit for building SaaS applications. Built with a "Library-First" approach to ensure maximum code reuse and maintainability.

## 🛠 Tech Stack

- **Monorepo:** [Nx](https://nx.dev)
- **Frontend:** [Angular](https://angular.io) (Signals, Standalone, Tailwind CSS)
- **Backend:** [NestJS](https://nestjs.com) (Fastify)
- **Auth & Database:** [Supabase](https://supabase.com)
- **Payments:** [Stripe](https://stripe.com)
- **Error Tracking:** [Sentry](https://sentry.io)
- **Mailing:** [Mailchimp](https://mailchimp.com)
- **Validation:** [Zod](https://zod.dev)

---

## 📁 Project Structure

This project follows the **App-as-a-Shell** pattern. Logic is strictly separated into libraries.

### 📱 Applications (`apps/`)
- `web`: Angular frontend entry point (Shell).
- `api`: NestJS backend entry point (API Gateway).

### 📦 Libraries (`libs/`)

#### 🔹 Shared (`libs/shared/`)
Common code used by both Frontend and Backend.
- `util-schema`: **The Single Truth.** Zod schemas for validation and shared TypeScript types.
- `ui-common`: Basic UI primitives (buttons, inputs) - framework agnostic logic if possible.

#### 🔹 Backend Modules (`libs/api/`)
- `api-core`: Global configuration, Sentry init, and Supabase Module setup.
- `api-auth`: Supabase Auth guards and user session management.
- `api-billing`: Stripe integration, checkout sessions, and webhook handlers.
- `api-mailing`: Mailchimp API integration.

#### 🔹 Frontend Modules (`libs/web/`)
- `web-shell`: Main routing, layouts (Sidebar, Navbar).
- `web-auth`: Login/Register pages and Supabase Auth services.
- `web-billing`: Pricing tables and Stripe Customer Portal integration.
- `web-ui-kit`: Reusable Angular UI components (Tailwind-based).

---

## 🏗 Architecture & Tags

This project uses **Nx tags** to enforce strict architectural boundaries via ESLint. Each project/library has tags in its `project.json` file.

### Tag Categories

1. **Type Tags** (what it is):
   - `type:app` - Applications
   - `type:feature` - Feature libraries
   - `type:ui` - UI/presentational libraries
   - `type:data-access` - Data access libraries
   - `type:util` - Utility libraries

2. **Platform Tags** (where it runs):
   - `platform:web` - Angular/frontend
   - `platform:node` - NestJS/backend
   - `platform:shared` - Shared code

3. **Scope Tags** (product domain):
   - `scope:faceless` - Faceless product
   - `scope:shared` - Shared across products

### Dependency Rules

- `platform:web` ➜ only `platform:web` or `platform:shared`
- `platform:node` ➜ only `platform:node` or `platform:shared`
- `type:feature` ➜ `type:ui`, `type:data-access`, `type:util`
- `type:ui` ➜ only `type:ui` and `type:util`
- `type:util` ➜ only other `type:util`

These rules are enforced by `@nx/enforce-module-boundaries` in `eslint.config.mjs`.

---

## 🚦 Getting Started

### 1. Prerequisites
- Node.js v20+
- Yarn
- Supabase Account & Stripe Account

### 2. Environment Variables
Copy `.env.example` to `.env` and fill in:
- `SUPABASE_URL` / `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE`
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET`
- `SENTRY_DSN`

### 3. Installation & Run
```bash
yarn install

# Faceless App
yarn start:face          # Start faceless web (auto-starts API)
yarn start:face:web      # Start faceless web only
yarn start:face:api      # Start faceless API only
