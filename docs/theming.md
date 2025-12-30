# Theming Guide

This document explains how to configure custom themes for applications in this monorepo using **Tailwind CSS v4** and **DaisyUI v5**.

## Overview

The project uses:
- **Tailwind CSS v4** - CSS-first configuration approach
- **DaisyUI v5** - Component library with theme support
- **OKLCH color format** - Modern color space for theme colors

## File Structure

```
apps/{your-app}/
├── src/
│   ├── styles.scss      # Main stylesheet (imports themes)
│   └── _themes.scss     # Theme definitions
├── tailwind.config.js   # Content paths
└── .postcssrc.json      # PostCSS config
```

## Configuration Files

### 1. PostCSS Configuration

Create `.postcssrc.json`:

```json
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

### 2. Tailwind Configuration

Create `tailwind.config.js` with content paths:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './apps/{your-app}/src/**/*.{html,ts}',
    './libs/ui/**/*.{html,ts}',
  ],
  theme: {
    extend: {},
  },
};
```

### 3. Main Stylesheet

Create `styles.scss`:

```scss
@import "tailwindcss";
@config "../tailwind.config.js";
@plugin "daisyui";
@import "./themes";
```

### 4. Theme Definitions

Create `_themes.scss` with your custom themes:

```scss
@plugin "daisyui/theme" {
  name: "your-theme-light";
  default: true;
  color-scheme: light;

  --color-primary: oklch(70% 0.25 350);
  --color-primary-content: oklch(100% 0 0);
  --color-secondary: oklch(75% 0.20 340);
  --color-secondary-content: oklch(100% 0 0);
  // ... other colors
}

@plugin "daisyui/theme" {
  name: "your-theme-dark";
  prefersdark: true;
  color-scheme: dark;

  --color-primary: oklch(75% 0.30 350);
  --color-primary-content: oklch(15% 0.03 280);
  // ... other colors
}
```

### 5. Project Configuration

Update `project.json` styles array:

```json
{
  "styles": ["apps/{your-app}/src/styles.scss"]
}
```

**Do NOT include** `node_modules/daisyui/daisyui.css`.

## Theme Color Variables

### Required Colors

| Variable | Description |
|----------|-------------|
| `--color-primary` | Primary brand color |
| `--color-primary-content` | Text on primary background |
| `--color-secondary` | Secondary brand color |
| `--color-secondary-content` | Text on secondary background |
| `--color-accent` | Accent color for highlights |
| `--color-accent-content` | Text on accent background |
| `--color-neutral` | Neutral/gray color |
| `--color-neutral-content` | Text on neutral background |
| `--color-base-100` | Main background color |
| `--color-base-200` | Slightly darker background |
| `--color-base-300` | Even darker background |
| `--color-base-content` | Main text color |
| `--color-info` | Info/blue color |
| `--color-success` | Success/green color |
| `--color-warning` | Warning/yellow color |
| `--color-error` | Error/red color |

### Design Tokens

| Variable | Description | Example |
|----------|-------------|---------|
| `--rounded-box` | Border radius for cards | `1rem` |
| `--rounded-btn` | Border radius for buttons | `0.5rem` |
| `--rounded-badge` | Border radius for badges | `1.9rem` |
| `--animation-btn` | Button animation duration | `0.25s` |
| `--animation-input` | Input animation duration | `0.2s` |
| `--btn-focus-scale` | Button scale on focus | `0.95` |
| `--border-btn` | Button border width | `1px` |

## Theme Flags

| Flag | Description |
|------|-------------|
| `default: true` | Sets as default theme |
| `prefersdark: true` | Uses when user prefers dark mode |
| `color-scheme: light` | Light color scheme |
| `color-scheme: dark` | Dark color scheme |

## Applying Themes

### Root Component Setup

```typescript
@Component({
  template: `<div class="min-h-screen bg-base-100 text-base-content">...</div>`
})
export class App {
  currentTheme = signal<string>('your-theme-light');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      effect(() => {
        document.documentElement.setAttribute('data-theme', this.currentTheme());
      });
    }
  }

  toggleTheme(): void {
    const newTheme = this.currentTheme() === 'your-theme-light'
      ? 'your-theme-dark' : 'your-theme-light';
    this.currentTheme.set(newTheme);
    localStorage.setItem('theme', newTheme);
  }
}
```

### System Preference Detection

```typescript
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = savedTheme || (prefersDark ? 'your-theme-dark' : 'your-theme-light');
```

## Example

See `apps/koalka/landing/src/_themes.scss` for a complete example.

## References

- [DaisyUI Themes](https://daisyui.com/docs/themes/)
- [DaisyUI v5 Guide](https://daisyui.com/docs/v5/)
- [OKLCH Color Picker](https://oklch.com/)
