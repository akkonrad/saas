# Koalka Landing Page

## Overview

Koalka Landing is an Angular 21 SSR (Server-Side Rendered) landing page application. It serves as a static marketing/landing page with internationalization support.

**Project name:** `koalka-landing`
**Port:** `4320`
**URL:** http://localhost:4320

## Tech Stack

- **Angular 21** with SSR (prerendering enabled)
- **Tailwind CSS** for styling
- **DaisyUI** for component library
- **i18n** - Custom language service with JSON translation files

## Commands

```bash
# Development server
npx nx serve koalka-landing

# Build for production
npx nx build koalka-landing

# Run tests
npx nx test koalka-landing

# Lint
npx nx lint koalka-landing
```

## Project Structure

```
apps/koalka/landing/
├── src/
│   ├── app/
│   │   ├── components/          # Reusable presentational components
│   │   │   ├── language-switcher/
│   │   │   ├── contact-form/
│   │   │   ├── theme-toggle/
│   │   │   ├── feature-card/
│   │   │   ├── stats-card/
│   │   │   ├── step-card/
│   │   │   ├── mockup-card/
│   │   │   └── flow-diagram/
│   │   ├── pages/               # Route-level page components
│   │   │   └── home/
│   │   ├── sections/            # Landing page sections
│   │   │   ├── header/
│   │   │   ├── hero/
│   │   │   ├── problem/
│   │   │   ├── solution/
│   │   │   ├── how-it-works/
│   │   │   ├── for-who/
│   │   │   ├── why-me/
│   │   │   ├── team/
│   │   │   ├── contact/
│   │   │   └── footer/
│   │   └── services/
│   │       └── language.service.ts
│   ├── public/
│   │   ├── i18n/                # Translation files
│   │   │   ├── en.json
│   │   │   └── pl.json
│   │   └── [images and assets]
│   ├── styles.css               # Global styles
│   └── themes.css               # Theme definitions
└── project.json
```

## Architecture Patterns

### Component Organization

| Type | Location | Purpose |
|------|----------|---------|
| **Pages** | `pages/` | Route-level components, minimal logic |
| **Sections** | `sections/` | Full-width landing page sections |
| **Components** | `components/` | Reusable presentational components |
| **Services** | `services/` | Business logic and state management |

### Internationalization (i18n)

Uses a custom `LanguageService` for runtime language switching:

```typescript
// Inject the service
languageService = inject(LanguageService);

// Get translation
languageService.t('hero.title')

// Switch language
languageService.setLanguage('pl');

// Current language signal
languageService.currentLang()
```

Translation files are in `public/i18n/{lang}.json`.

### Theming

Supports light/dark themes via:
- `themes.css` - Theme variable definitions
- DaisyUI theme classes
- `ThemeToggleComponent` for user switching

## Code Conventions

Follow the root `CLAUDE.md` Angular guidelines, specifically:

### Modern Angular (21+)
- **Standalone components** (default, don't set `standalone: true`)
- **Signals** for state management
- **`inject()`** function, not constructor injection
- **`input.required<T>()`** for required inputs
- **`output<T>()`** for outputs
- **OnPush change detection**
- **Native control flow** (`@if`, `@for`, `@switch`)

### Styling
- **Tailwind CSS only** - no custom CSS unless necessary
- **DaisyUI components** - use existing component classes
- Follow responsive patterns: `sm:`, `md:`, `lg:`, `xl:`

### SSR Considerations
- Avoid `window`, `document`, `localStorage` directly
- Use `isPlatformBrowser()` / `isPlatformServer()` checks when needed
- Ensure components work without JavaScript for prerendering

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `HomeComponent` | Main landing page (Polish default) |
| `/en` | `HomeComponent` | English version |
| `**` | Redirect to `/` | Catch-all redirect |

## Adding New Sections

1. Create section component:
```bash
npx nx g @nx/angular:component sections/new-section --project=koalka-landing --standalone --changeDetection=OnPush
```

2. Add translations to `public/i18n/en.json` and `public/i18n/pl.json`

3. Include in `HomeComponent` template

## Adding New Components

```bash
npx nx g @nx/angular:component components/my-component --project=koalka-landing --standalone --changeDetection=OnPush
```

## Environment

No environment variables required for the landing page (static site).

For local development, assets are served from `public/`.

## Build Output

Production build outputs to `dist/apps/koalka/landing/`:
- `browser/` - Client-side assets (deployed to production)
- `server/` - SSR server bundle

The build uses **prerendering** (`prerender: true`) and **static output mode** for optimal performance.

## Deployment

The application is automatically deployed to OVH hosting via SFTP when changes are pushed to `main` branch.

### Manual Deployment

```bash
# Build and deploy
npx nx deploy koalka-landing
```

### CI/CD Workflow

GitHub Actions workflow (`.github/workflows/deploy-koalka-landing.yml`) handles:
1. Building koalka-landing with production configuration
2. Uploading `dist/apps/koalka/landing/browser/` to OVH SFTP server
3. Only deploys if koalka-landing is affected by the commit

The deployment uses environment secrets configured in GitHub (koalka environment):
- `PROD_HOST` - SFTP server hostname
- `PROD_PORT` - SFTP port (22)
- `PROD_USER` - SFTP username
- `PROD_PASSWORD` - SFTP password
- `PROD_REMOTE_PATH` - Remote directory path
