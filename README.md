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

## 🚦 Getting Started

### 1. Prerequisites
- Node.js v20+
- PNPM or NPM
- Supabase Account & Stripe Account

### 2. Environment Variables
Copy `.env.example` to `.env` and fill in:
- `SUPABASE_URL` / `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE`
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET`
- `SENTRY_DSN`

### 3. Installation & Run
```bash
pnpm install
# Start API
npx nx serve api
# Start Frontend
npx nx serve web
