# UI Library Documentation

## Overview

The UI library (`@ui`) is a shared component library for building consistent user interfaces across all applications in the monorepo. It provides:

- **Reusable Angular Components**: Buttons, Cards, Headers, Sections, and more
- **Glass Effect Utilities**: Pre-built CSS classes for glassmorphism effects
- **DaisyUI Integration**: Theme-aware components using DaisyUI's design tokens
- **Tailwind CSS**: Utility-first CSS framework
- **Storybook**: Interactive component documentation and testing

**Location:** `libs/ui/`
**Import Path:** `@ui`
**Storybook:** Run `npx nx storybook ui` (port 4400)

---

## Architecture

### Design Principles

1. **Standalone Components**: All components use Angular's standalone API (no NgModules)
2. **OnPush Change Detection**: Optimized for performance
3. **Signals-First**: Modern reactive state management with Angular Signals
4. **Theme-Aware**: Components use DaisyUI CSS variables for automatic theming
5. **Composable**: Components are designed to be combined and customized

### Tech Stack

- **Angular 21**: Latest Angular features (Signals, Standalone Components)
- **Tailwind CSS v4**: Utility-first CSS framework
- **DaisyUI**: Component classes and theming system
- **Storybook 8**: Component documentation and development environment

---

## Using the UI Library in Applications

### 1. Importing Components

Components are imported from the `@ui` package:

```typescript
// app.component.ts or any component
import {
  UiButtonComponent,
  UiCardComponent,
  UiCardHeaderComponent,
  UiCardContentComponent,
  UiCardFooterComponent,
  UiHeaderComponent,
  UiSectionComponent,
  UiThemeToggleComponent,
} from '@ui';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    UiButtonComponent,
    UiCardComponent,
    // ... other components
  ],
  template: `
    <ui-button variant="primary">Click me</ui-button>
  `
})
export class AppComponent {}
```

### 2. Importing Styles (Glass Effects)

The UI library provides glass effect utilities that need to be imported separately in your application's main stylesheet.

**Option A: Import in application styles (Recommended)**

In your application's `styles.scss` or `styles.css`:

```scss
// apps/your-app/src/styles.scss

// Import Tailwind and DaisyUI
@import 'tailwindcss';
@plugin 'daisyui';

// Import UI library glass effects and utilities
@import '../../libs/ui/src/lib/styles.scss';
```

**Option B: Using Tailwind v4 CSS imports**

If using Tailwind CSS v4 with the new `@import` syntax:

```css
/* apps/your-app/src/styles.css */
@import 'tailwindcss';
@plugin 'daisyui';

/* Import UI library utilities */
@layer utilities {
  /* Copy the glass effect utilities from libs/ui/src/lib/styles.scss */
  /* Or import the file if your build supports it */
}
```

**Option C: Direct SCSS import (if supported)**

```scss
// Import the entire UI library styles
@use '~@ui/styles' as ui;
```

### 3. Using Glass Effect Classes

Once styles are imported, glass effect utilities are available throughout your application:

```html
<!-- Light glass effects -->
<ui-header customClass="ui-glass-100">
  <!-- Header with medium glass effect -->
</ui-header>

<div class="ui-glass-50">
  <!-- Light glass effect -->
</div>

<!-- Dark glass effects -->
<div class="ui-glass-dark-150">
  <!-- Strong dark glass effect -->
</div>

<!-- Adaptive glass (uses DaisyUI theme colors) -->
<ui-card customClass="ui-glass-adaptive">
  <!-- Theme-aware glass effect -->
</ui-card>
```

**Available Glass Classes:**

| Class | Opacity | Blur | Use Case |
|-------|---------|------|----------|
| `ui-glass-50` | 50% white | 8px | Subtle light glass |
| `ui-glass-100` | 60% white | 12px | Medium light glass (recommended) |
| `ui-glass-150` | 70% white | 16px | Strong light glass |
| `ui-glass-200` | 80% white | 20px | Extra strong light glass |
| `ui-glass-dark-50` | 50% black | 8px | Subtle dark glass |
| `ui-glass-dark-100` | 60% black | 12px | Medium dark glass |
| `ui-glass-dark-150` | 70% black | 16px | Strong dark glass |
| `ui-glass-dark-200` | 80% black | 20px | Extra strong dark glass |
| `ui-glass-adaptive` | 60% theme | 12px | Theme-aware glass (recommended) |
| `ui-glass-adaptive-strong` | 80% theme | 16px | Strong theme-aware glass |

---

## Component Reference

### Button (`ui-button`)

A versatile button component with multiple variants and sizes.

**Props:**
- `variant`: `'primary' | 'secondary' | 'accent' | 'neutral' | 'ghost' | 'link'` (default: `'primary'`)
- `size`: `'xs' | 'sm' | 'md' | 'lg'` (default: `'md'`)
- `customClass`: Additional CSS classes

**Usage:**
```html
<ui-button variant="primary" size="md">Save Changes</ui-button>
<ui-button variant="ghost" size="sm">Cancel</ui-button>
```

---

### Card (`ui-card`, `ui-card-header`, `ui-card-content`, `ui-card-footer`)

A composable card component with optional header, content, and footer sections.

**Components:**
- `ui-card`: Main container
- `ui-card-header`: Header section (optional)
- `ui-card-content`: Content section
- `ui-card-footer`: Footer section (optional)

**Props (all components):**
- `customClass`: Additional CSS classes

**Usage:**
```html
<!-- Complete card -->
<ui-card>
  <ui-card-header>
    <h2 class="text-xl font-semibold">Card Title</h2>
  </ui-card-header>
  <ui-card-content>
    <p>Card content goes here</p>
  </ui-card-content>
  <ui-card-footer>
    <button class="btn btn-primary">Action</button>
  </ui-card-footer>
</ui-card>

<!-- Simple card (content only) -->
<ui-card>
  <ui-card-content>
    <p>Simple card</p>
  </ui-card-content>
</ui-card>

<!-- Card with glass effect -->
<ui-card [customClass]="'ui-glass-adaptive'">
  <ui-card-content>
    Glassmorphic card
  </ui-card-content>
</ui-card>
```

---

### Header (`ui-header`)

A responsive navigation header with mobile menu support.

**Props:**
- `fixed`: Boolean - whether to fix header to top of page (default: `false`)
- `customClass`: Additional CSS classes

**Content Projection Slots:**
- `logo`: Logo/brand section
- `nav`: Desktop navigation links
- `actions`: Desktop action buttons
- `mobile-nav`: Mobile navigation content

**Usage:**
```html
<ui-header [fixed]="true" customClass="ui-glass-100">
  <!-- Logo -->
  <div logo class="flex items-center gap-2">
    <span class="font-bold text-xl">MyApp</span>
  </div>

  <!-- Desktop nav -->
  <div nav class="flex gap-6">
    <a href="#home">Home</a>
    <a href="#features">Features</a>
  </div>

  <!-- Desktop actions -->
  <div actions class="flex gap-2">
    <ui-theme-toggle [theme]="theme()"></ui-theme-toggle>
    <ui-button variant="primary">Sign Up</ui-button>
  </div>

  <!-- Mobile nav -->
  <div mobile-nav class="flex flex-col gap-4">
    <a href="#home">Home</a>
    <a href="#features">Features</a>
    <ui-button variant="primary" customClass="w-full">Sign Up</ui-button>
  </div>
</ui-header>
```

---

### Section (`ui-section`)

A page section wrapper with consistent padding and optional background.

**Props:**
- `variant`: `'default' | 'muted'` (default: `'default'`)
- `id`: Section ID for anchor links
- `customClass`: Additional CSS classes

**Usage:**
```html
<ui-section variant="default" id="hero">
  <h1>Welcome to Our App</h1>
</ui-section>

<ui-section variant="muted" id="features">
  <h2>Features</h2>
  <!-- Features content -->
</ui-section>
```

---

### Theme Toggle (`ui-theme-toggle`)

A theme switcher component for light/dark mode.

**Props:**
- `theme`: Current theme (`'light' | 'dark'`)
- `variant`: `'icon' | 'button'` (default: `'icon'`)

**Events:**
- `themeChange`: Emits new theme when changed

**Usage:**
```typescript
// Component
import { signal } from '@angular/core';
import { UiThemeToggleComponent, type Theme } from '@ui';

@Component({
  // ...
  imports: [UiThemeToggleComponent],
  template: `
    <ui-theme-toggle
      [theme]="currentTheme()"
      (themeChange)="handleThemeChange($event)"
    />
  `
})
export class AppComponent {
  currentTheme = signal<Theme>('dark');

  handleThemeChange(theme: Theme) {
    this.currentTheme.set(theme);
    // Update HTML attribute for DaisyUI
    document.documentElement.setAttribute('data-theme', theme);
  }
}
```

---

## Storybook

Storybook is an interactive development environment for viewing and testing components in isolation.

### Running Storybook

```bash
# Start Storybook development server
npx nx storybook ui
```

This will start Storybook at `http://localhost:4400`

### Building Storybook (Static)

```bash
# Build static Storybook site
npx nx build-storybook ui

# Output: dist/storybook/ui
```

### Storybook Features

1. **Component Playground**: Interact with components and change props in real-time
2. **Theme Switcher**: Test components across all 32 DaisyUI themes
3. **Responsive Preview**: Test components at different viewport sizes
4. **Documentation**: Auto-generated docs from component types and JSDoc comments
5. **Stories**: Pre-built examples for each component variant

### Available Stories

- **UI/Button**: All button variants and sizes
- **UI/Card**: Complete cards, pricing cards, profile cards, and more
- **UI/Header**: Fixed/static headers with glass effects
- **UI/Section**: Section variants with different backgrounds
- **UI/ThemeToggle**: Theme switcher variants

---

## Development Workflow

### Adding a New Component

1. **Generate the component:**
```bash
npx nx generate @nx/angular:component \
  --name=my-component \
  --directory=libs/ui/src/lib/my-component \
  --standalone \
  --changeDetection=OnPush \
  --style=scss \
  --skipTests=false
```

2. **Implement the component:**
```typescript
// my-component.component.ts
import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ui-my-component',
  standalone: true,
  template: `
    <div [class]="classes">
      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiMyComponentComponent {
  customClass = input<string>('');

  protected get classes(): string {
    const base = ['my-component', 'base-classes'];
    if (this.customClass()) {
      base.push(this.customClass());
    }
    return base.join(' ');
  }
}
```

3. **Export from index.ts:**
```typescript
// libs/ui/src/index.ts
export * from './lib/my-component/my-component.component';
```

4. **Create Storybook story:**
```typescript
// my-component.component.stories.ts
import type { Meta, StoryObj } from '@storybook/angular';
import { UiMyComponentComponent } from './my-component.component';

const meta: Meta<UiMyComponentComponent> = {
  component: UiMyComponentComponent,
  title: 'UI/MyComponent',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<UiMyComponentComponent>;

export const Default: Story = {
  args: {},
};
```

5. **Write tests:**
```typescript
// my-component.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiMyComponentComponent } from './my-component.component';

describe('UiMyComponentComponent', () => {
  let component: UiMyComponentComponent;
  let fixture: ComponentFixture<UiMyComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiMyComponentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiMyComponentComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

6. **Run tests and build:**
```bash
# Test the component
npx nx test ui

# Build the library
npx nx build ui

# View in Storybook
npx nx storybook ui
```

---

## Best Practices

### 1. Component Design

- ✅ Use **Signals** for reactive state instead of RxJS where possible
- ✅ Use **OnPush** change detection for performance
- ✅ Make components **standalone** (no NgModules)
- ✅ Use `input.required<T>()` for required inputs
- ✅ Support `customClass` input for styling flexibility
- ✅ Use **DaisyUI CSS variables** for theme-aware styling

**Example:**
```typescript
@Component({
  selector: 'ui-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div [class]="classes">{{content()}}</div>`
})
export class UiExampleComponent {
  content = input.required<string>();  // Required input
  variant = input<'default' | 'accent'>('default');  // Optional with default
  customClass = input<string>('');  // Custom styling support

  protected get classes(): string {
    return ['base', this.variant(), this.customClass()].join(' ');
  }
}
```

### 2. Styling

- ✅ Use **Tailwind utility classes** in templates
- ✅ Use **DaisyUI component classes** (`btn`, `card`, etc.)
- ✅ Minimize custom CSS - only when necessary
- ✅ Use **DaisyUI CSS variables** for colors: `oklch(var(--p))`, `oklch(var(--bc))`

**Example:**
```html
<!-- Good: Tailwind + DaisyUI -->
<button class="btn btn-primary rounded-lg shadow-md">
  Click me
</button>

<!-- Avoid: Custom CSS unless necessary -->
<button class="my-custom-button-class">
  Click me
</button>
```

### 3. Content Projection

Use specific selectors for named slots:

```typescript
@Component({
  selector: 'ui-container',
  template: `
    <header>
      <ng-content select="[header]"></ng-content>
    </header>
    <main>
      <ng-content></ng-content>
    </main>
    <footer>
      <ng-content select="[footer]"></ng-content>
    </footer>
  `
})
```

```html
<ui-container>
  <div header>Header content</div>
  <div>Main content</div>
  <div footer>Footer content</div>
</ui-container>
```

### 4. Testing

- ✅ Test component creation
- ✅ Test prop changes with `fixture.componentRef.setInput()`
- ✅ Test content projection
- ✅ Test custom class application
- ✅ Keep tests simple and focused

### 5. Storybook Stories

- ✅ Create a story for each major variant
- ✅ Use descriptive story names
- ✅ Add controls for interactive props
- ✅ Include real-world examples
- ✅ Document usage with JSDoc comments

---

## Theming

Components use **DaisyUI themes** for automatic styling. Applications can configure themes in `tailwind.config.js`:

```javascript
// tailwind.config.js
export default {
  plugins: [daisyui],
  daisyui: {
    themes: ['light', 'dark', 'cupcake', 'synthwave'], // Enable specific themes
    darkTheme: 'dark', // Default dark theme
  },
};
```

Set theme at runtime:

```typescript
// Change theme
document.documentElement.setAttribute('data-theme', 'dark');
```

**Available DaisyUI Themes:**
- **Light:** light, cupcake, bumblebee, emerald, corporate, retro, valentine, garden, lofi, pastel, fantasy, wireframe, cmyk, autumn, acid, lemonade, winter, nord
- **Dark:** dark, synthwave, halloween, forest, black, luxury, dracula, business, night, coffee, dim, sunset, cyberpunk, aqua

---

## Troubleshooting

### Glass effects not working

**Problem:** Glass effect classes don't apply or styles are missing.

**Solution:** Ensure you've imported the UI library styles in your application's stylesheet:

```scss
// apps/your-app/src/styles.scss
@import '../../libs/ui/src/lib/styles.scss';
```

Or add the glass utilities directly to your application's Tailwind config.

### Components not rendering

**Problem:** Components don't render or throw errors.

**Solution:** Make sure you've imported the component in your component's `imports` array:

```typescript
import { UiButtonComponent } from '@ui';

@Component({
  imports: [UiButtonComponent],  // ← Add here
  // ...
})
```

### Styles not updating in Storybook

**Problem:** Style changes don't reflect in Storybook.

**Solution:** Restart Storybook after making style changes:

```bash
# Stop Storybook (Ctrl+C)
# Start again
npx nx storybook ui
```

### Build errors with @ui import

**Problem:** TypeScript can't find `@ui` module.

**Solution:** Rebuild the UI library:

```bash
npx nx build ui
```

---

## FAQ

### How do I use a component in my app?

1. Import from `@ui`: `import { UiButtonComponent } from '@ui';`
2. Add to component imports: `imports: [UiButtonComponent]`
3. Use in template: `<ui-button>Click me</ui-button>`

### Can I customize component styles?

Yes! All components accept a `customClass` input:

```html
<ui-button customClass="w-full shadow-lg">Full width button</ui-button>
<ui-card customClass="ui-glass-adaptive border-primary">Glass card</ui-card>
```

### How do I add glass effects to my custom elements?

Import the UI library styles in your app's stylesheet, then use the glass classes:

```html
<div class="ui-glass-100 p-6 rounded-lg">
  My glassmorphic container
</div>
```

### Should I use light or dark glass effects?

- Use **light glass** (`ui-glass-*`) on dark backgrounds
- Use **dark glass** (`ui-glass-dark-*`) on light backgrounds
- Use **adaptive glass** (`ui-glass-adaptive`) to automatically match the current theme

### How do I test my changes in Storybook?

```bash
# 1. Make your changes to the component
# 2. Run Storybook
npx nx storybook ui
# 3. Navigate to your component's story
# 4. View changes live (hot reload enabled)
```

---

## Resources

- **Storybook:** `npx nx storybook ui` (http://localhost:4400)
- **Component List:** `libs/ui/COMPONENTS.md`
- **Tailwind CSS:** https://tailwindcss.com/docs
- **DaisyUI:** https://daisyui.com/components
- **Angular Signals:** https://angular.dev/guide/signals

---

## Contributing

When adding new components to the UI library:

1. Follow the [Development Workflow](#development-workflow)
2. Ensure all tests pass: `npx nx test ui`
3. Build the library: `npx nx build ui`
4. Update documentation in `libs/ui/COMPONENTS.md`
5. Create comprehensive Storybook stories
6. Add real-world usage examples

---

## Summary

The UI library provides:
- ✅ Reusable, theme-aware Angular components
- ✅ Glass effect utilities for glassmorphism
- ✅ Storybook for component development and documentation
- ✅ Full integration with Tailwind CSS and DaisyUI
- ✅ Modern Angular patterns (Signals, Standalone, OnPush)

**Quick Start:**
```typescript
// 1. Import components
import { UiButtonComponent, UiCardComponent } from '@ui';

// 2. Import styles in styles.scss
@import '../../libs/ui/src/lib/styles.scss';

// 3. Use in templates
<ui-card customClass="ui-glass-adaptive">
  <ui-card-content>
    <ui-button variant="primary">Hello World</ui-button>
  </ui-card-content>
</ui-card>
```
