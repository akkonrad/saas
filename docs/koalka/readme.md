# Koalka

Koalka is a product within the SaaS monorepo focused on [describe product purpose].

## Applications

| Application | Project Name | Port | Description |
|-------------|--------------|------|-------------|
| Landing | `koalka-landing` | 4320 | Static marketing/landing page with i18n |

## Quick Start

```bash
# Start landing page development server
npx nx serve koalka-landing

# Build for production
npx nx build koalka-landing

# Deploy to production (OVH)
npx nx deploy koalka-landing
```

## Documentation

- [Deployment Guide](./deployment.md) - How to deploy Koalka applications
- [Landing Page README](../../apps/koalka/landing/CLAUDE.md) - Detailed landing page documentation

## Tech Stack

- **Frontend**: Angular 21 with SSR (prerendering)
- **Styling**: Tailwind CSS + DaisyUI
- **i18n**: Custom language service with JSON translation files
- **Hosting**: OVH Web Hosting (SFTP deployment)

## Project Structure

```
apps/koalka/
├── landing/              # Angular SSR landing page
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # Reusable components
│   │   │   ├── pages/        # Route-level pages
│   │   │   ├── sections/     # Landing page sections
│   │   │   └── services/     # Business logic
│   │   └── public/
│   │       └── i18n/         # Translation files
│   └── project.json
```

## Environment Variables

See [Deployment Guide](./deployment.md#environment-variables) for required environment variables.
