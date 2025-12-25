# DaisyUI Theming Guide for UI Components

## Quick Start

Your UI components are now configured to work with DaisyUI themes. Here's how it all works:

## How Theming Works

```
┌─────────────────────────────────────────────────────────────┐
│  Application (tailwind.config.js)                           │
│  Defines themes with CSS custom properties                  │
│  --color-primary, --color-base-100, etc.                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  DaisyUI Plugin                                             │
│  Converts theme config to CSS variables                     │
│  Sets up data-theme attribute switching                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  UI Components (@ui)                                        │
│  Use DaisyUI classes (btn, card, etc.)                      │
│  Classes automatically reference CSS variables              │
│  Components adapt to active theme instantly                 │
└─────────────────────────────────────────────────────────────┘
```

## Creating a Custom Theme

In your app's `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    './apps/faceless/web/src/**/*.{html,ts}',
    './libs/ui/**/*.{html,ts}', // ← UI library is already included!
  ],
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        'my-app-theme': {
          // Primary color (buttons, links, etc.)
          'primary': 'oklch(58% 0.233 277.117)',
          'primary-content': 'oklch(96% 0.018 272.314)',

          // Secondary color
          'secondary': 'oklch(65% 0.241 354.308)',
          'secondary-content': 'oklch(94% 0.028 342.258)',

          // Accent color
          'accent': 'oklch(77% 0.152 181.912)',
          'accent-content': 'oklch(38% 0.063 188.416)',

          // Neutral/gray
          'neutral': 'oklch(14% 0.005 285.823)',
          'neutral-content': 'oklch(92% 0.004 286.32)',

          // Base backgrounds
          'base-100': 'oklch(25.33% 0.016 252.42)', // Main background
          'base-200': 'oklch(23.26% 0.014 253.1)',  // Slightly darker
          'base-300': 'oklch(21.15% 0.012 254.09)', // Even darker
          'base-content': 'oklch(97.807% 0.029 256.847)', // Text color

          // Status colors
          'info': 'oklch(74% 0.16 232.661)',
          'success': 'oklch(76% 0.177 163.223)',
          'warning': 'oklch(82% 0.189 84.429)',
          'error': 'oklch(71% 0.194 13.428)',

          // Border radius
          '--rounded-box': '0.5rem',
          '--rounded-btn': '0.25rem',
          '--rounded-badge': '1rem',

          // Animations
          '--animation-btn': '0.25s',
          '--animation-input': '0.2s',
        },
      },
      'light', // Built-in light theme
      'dark',  // Built-in dark theme
    ],
    darkTheme: 'dark', // Theme to use when prefers-color-scheme: dark
    base: true,        // Apply base styles
    styled: true,      // Include component styles
    utils: true,       // Include utility classes
    prefix: '',        // No prefix for DaisyUI classes
    logs: true,        // Show info in console
    themeRoot: ':root', // Where to apply theme variables
  },
};
```

## Switching Themes in Your App

### Method 1: Static Theme

Set theme on root HTML element:

```typescript
// app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div data-theme="dark">
      <!-- All UI components use dark theme -->
      <ui-button variant="primary">Dark Theme Button</ui-button>
    </div>
  `,
})
export class AppComponent {}
```

### Method 2: Dynamic Theme Switching

```typescript
// app.component.ts
import { Component, signal } from '@angular/core';
import { UiButtonComponent } from '@ui';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UiButtonComponent],
  template: `
    <div [attr.data-theme]="currentTheme()">
      <!-- Theme switcher -->
      <div class="navbar bg-base-200">
        <div class="flex-1">
          <span class="text-xl">My App</span>
        </div>
        <div class="flex-none gap-2">
          <ui-button
            variant="ghost"
            size="sm"
            (clicked)="toggleTheme()"
          >
            {{ currentTheme() === 'light' ? '🌙 Dark' : '☀️ Light' }}
          </ui-button>
        </div>
      </div>

      <!-- Your app content - all UI components adapt automatically -->
      <div class="container mx-auto p-4">
        <ui-button variant="primary">Primary Button</ui-button>
        <ui-button variant="secondary">Secondary Button</ui-button>
        <ui-button variant="accent">Accent Button</ui-button>
      </div>
    </div>
  `,
})
export class AppComponent {
  currentTheme = signal<string>('light');

  toggleTheme() {
    this.currentTheme.update(theme => theme === 'light' ? 'dark' : 'light');
  }
}
```

### Method 3: Global Theme Service

```typescript
// theme.service.ts
import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly THEME_KEY = 'app-theme';

  // Available themes
  readonly themes = ['light', 'dark', 'my-app-theme'] as const;
  type Theme = typeof this.themes[number];

  // Current theme (persisted to localStorage)
  currentTheme = signal<Theme>(this.loadTheme());

  constructor() {
    // Auto-save theme changes to localStorage
    effect(() => {
      const theme = this.currentTheme();
      localStorage.setItem(this.THEME_KEY, theme);
      document.documentElement.setAttribute('data-theme', theme);
    });
  }

  private loadTheme(): Theme {
    const saved = localStorage.getItem(this.THEME_KEY);
    return (saved as Theme) || 'light';
  }

  setTheme(theme: Theme) {
    this.currentTheme.set(theme);
  }

  toggleTheme() {
    const current = this.currentTheme();
    const next = current === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }
}

// app.component.ts
import { Component } from '@angular/core';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  template: `
    <!-- Theme is automatically applied to <html> by service -->
    <ui-button (clicked)="themeService.toggleTheme()">
      Toggle Theme
    </ui-button>
  `,
})
export class AppComponent {
  constructor(public themeService: ThemeService) {}
}
```

## Understanding DaisyUI Color System

DaisyUI uses **OKLCH** color space (better than HSL/RGB for perceptual uniformity):

```
oklch(Lightness% Chroma Hue)
│      │         │      │
│      │         │      └─ Hue (0-360 degrees)
│      │         └──────── Chroma (saturation, 0-0.4)
│      └────────────────── Lightness (0-100%)
└───────────────────────── Color function
```

### Example Colors

```javascript
'primary': 'oklch(58% 0.233 277.117)'
//               │    │     │
//               │    │     └─ Hue: 277° (purple-blue)
//               │    └─────── Chroma: 0.233 (moderately saturated)
//               └────────────Lightness: 58% (medium brightness)
```

## Testing Your Theme

After creating a custom theme:

1. **Visual Test**: Use the UI components showcase page
2. **Contrast Test**: Ensure text is readable on backgrounds
3. **Dark Mode Test**: Check both light and dark themes
4. **Accessibility Test**: Use browser DevTools to check contrast ratios

## Common Patterns

### Conditional Theming

```typescript
@Component({
  template: `
    <!-- Different theme for admin section -->
    <div data-theme="admin-theme">
      <ui-button>Admin Button</ui-button>
    </div>

    <!-- Different theme for user section -->
    <div data-theme="user-theme">
      <ui-button>User Button</ui-button>
    </div>
  `,
})
```

### Theme Per Route

```typescript
// route.component.ts
export class DashboardComponent implements OnInit {
  ngOnInit() {
    document.documentElement.setAttribute('data-theme', 'dashboard-theme');
  }

  ngOnDestroy() {
    document.documentElement.setAttribute('data-theme', 'default-theme');
  }
}
```

## Building Custom Themeable Components

When creating new UI components, follow these rules:

### ✅ DO: Use DaisyUI Classes

```typescript
@Component({
  template: `
    <button class="btn btn-primary">
      <!-- Automatically themed! -->
    </button>
  `
})
```

### ✅ DO: Reference CSS Variables

```scss
.my-component {
  background-color: oklch(var(--b1));
  color: oklch(var(--bc));
  border: 1px solid oklch(var(--p));
}
```

### ❌ DON'T: Use Hardcoded Colors

```typescript
// ❌ BAD - Won't respect theme
@Component({
  template: `<button class="bg-blue-500">Not Themed</button>`
})

// ✅ GOOD - Respects theme
@Component({
  template: `<button class="bg-primary">Themed!</button>`
})
```

### ❌ DON'T: Duplicate Theme Logic

```typescript
// ❌ BAD - Reinventing the wheel
const buttonColors = {
  primary: '#3B82F6',
  secondary: '#10B981',
  // ...
};

// ✅ GOOD - Let DaisyUI handle it
<ui-button variant="primary">Uses Theme</ui-button>
```

## Resources

- [DaisyUI Themes Documentation](https://daisyui.com/docs/themes/)
- [DaisyUI Component List](https://daisyui.com/components/)
- [OKLCH Color Picker](https://oklch.com/)
- [Contrast Checker](https://webaim.org/resources/contrastchecker/)

## Troubleshooting

### Theme Not Applying

1. Check `data-theme` attribute is set on parent element
2. Verify theme name matches `tailwind.config.js`
3. Ensure DaisyUI plugin is loaded
4. Check browser DevTools for CSS variable values

### Colors Look Wrong

1. Verify OKLCH values are in correct range
2. Check lightness is appropriate (0-100%)
3. Ensure chroma isn't too high (usually < 0.4)
4. Test in different browsers

### Components Not Themed

1. Confirm component uses DaisyUI classes or CSS variables
2. Check Tailwind content paths include your files
3. Rebuild Tailwind CSS
4. Clear browser cache
