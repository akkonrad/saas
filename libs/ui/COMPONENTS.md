# UI Library Components

This document lists all available components in the UI library.

## Components

### 1. Button (`ui-button`)
A versatile button component with multiple variants and sizes.

**Variants:** `primary`, `secondary`, `accent`, `neutral`, `ghost`, `link`
**Sizes:** `xs`, `sm`, `md`, `lg`

```html
<ui-button variant="primary" size="md">Click me</ui-button>
```

---

### 2. Card (`ui-card`)
A flexible, composable card component with header, content, and footer sections.

**Subcomponents:**
- `ui-card` - Main card container
- `ui-card-header` - Card header section (optional)
- `ui-card-content` - Card content section
- `ui-card-footer` - Card footer section (optional)

```html
<!-- Complete Card with Header, Content, and Footer -->
<ui-card>
  <ui-card-header>
    <h2 class="text-xl font-semibold">Card Title</h2>
    <p class="text-sm text-base-content text-opacity-60">Subtitle</p>
  </ui-card-header>
  <ui-card-content>
    <p>Main content goes here</p>
  </ui-card-content>
  <ui-card-footer>
    <div class="flex justify-end gap-2">
      <button class="btn btn-ghost">Cancel</button>
      <button class="btn btn-primary">Save</button>
    </div>
  </ui-card-footer>
</ui-card>

<!-- Card with only Content -->
<ui-card>
  <ui-card-content>
    <p>Simple card with just content</p>
  </ui-card-content>
</ui-card>

<!-- Pricing Card Example -->
<ui-card>
  <ui-card-header>
    <div class="text-center">
      <h3>Pro Plan</h3>
      <div class="text-4xl font-bold">$29<span class="text-sm">/mo</span></div>
    </div>
  </ui-card-header>
  <ui-card-content>
    <ul class="space-y-2">
      <li>✓ Unlimited projects</li>
      <li>✓ Advanced analytics</li>
      <li>✓ Priority support</li>
    </ul>
  </ui-card-content>
  <ui-card-footer>
    <button class="btn btn-primary btn-block">Get Started</button>
  </ui-card-footer>
</ui-card>
```

**Custom Styling:**
Each subcomponent accepts a `customClass` input for additional styling:

```html
<ui-card [customClass]="'bg-gradient-to-br from-primary/10'">
  <ui-card-header [customClass]="'bg-primary/5'">
    <!-- header content -->
  </ui-card-header>
  <ui-card-content [customClass]="'py-8'">
    <!-- content -->
  </ui-card-content>
  <ui-card-footer [customClass]="'bg-base-200'">
    <!-- footer -->
  </ui-card-footer>
</ui-card>
```

---

### 3. Section (`ui-section`)
A page section wrapper with consistent padding and optional background.

**Variants:**
- `default` - Standard section with no background
- `muted` - Section with subtle background color and borders

```html
<ui-section variant="default" id="hero">
  <h2>Hero Section</h2>
  <p>Content goes here</p>
</ui-section>

<ui-section variant="muted" id="features">
  <h2>Features Section</h2>
  <p>This section has a subtle background</p>
</ui-section>
```

---

### 4. ThemeToggle (`ui-theme-toggle`)
A theme switcher component with light/dark mode icons.

```html
<ui-theme-toggle
  [theme]="currentTheme()"
  (themeChange)="handleThemeChange($event)"
></ui-theme-toggle>
```

```typescript
currentTheme = signal<Theme>('light');

handleThemeChange(theme: Theme) {
  this.currentTheme.set(theme);
  // Update your app theme here
}
```

---

### 5. Header (`ui-header`)
A responsive header/navbar component with mobile menu support.

**Features:**
- Fixed or static positioning
- Desktop navigation
- Mobile hamburger menu
- Support for logo, nav links, and action buttons
- Glass effect support via `customClass`

```html
<ui-header [fixed]="true" customClass="ui-glass-100">
  <!-- Logo -->
  <div logo class="flex items-center gap-2">
    <div class="w-9 h-9 bg-primary rounded-xl">
      <span class="text-primary-content font-bold">L</span>
    </div>
    <span class="font-semibold text-lg">Logo</span>
  </div>

  <!-- Desktop Navigation -->
  <div nav class="flex items-center gap-8">
    <a href="#home">Home</a>
    <a href="#features">Features</a>
    <a href="#pricing">Pricing</a>
  </div>

  <!-- Desktop Actions -->
  <div actions class="flex items-center gap-2">
    <ui-theme-toggle [theme]="theme()"></ui-theme-toggle>
    <button class="btn btn-primary">Sign Up</button>
  </div>

  <!-- Mobile Navigation -->
  <div mobile-nav class="flex flex-col gap-4">
    <a href="#home">Home</a>
    <a href="#features">Features</a>
    <a href="#pricing">Pricing</a>
    <button class="btn btn-primary w-full">Sign Up</button>
  </div>
</ui-header>
```

---

## Glass Effect Utilities

The library includes glass morphism utility classes that can be applied to any component:

### Light Glass Effects
- `ui-glass-50` - Light glass effect (50% opacity, 8px blur)
- `ui-glass-100` - Medium glass effect (60% opacity, 12px blur)
- `ui-glass-150` - Strong glass effect (70% opacity, 16px blur)
- `ui-glass-200` - Extra strong glass effect (80% opacity, 20px blur)

### Dark Glass Effects
- `ui-glass-dark-50` - Light dark glass
- `ui-glass-dark-100` - Medium dark glass
- `ui-glass-dark-150` - Strong dark glass
- `ui-glass-dark-200` - Extra strong dark glass

### Adaptive Glass Effects (Uses DaisyUI Theme Colors)
- `ui-glass-adaptive` - Adaptive glass that works with any theme
- `ui-glass-adaptive-strong` - Stronger adaptive glass effect

### Usage Example
```html
<!-- Header with glass effect -->
<ui-header customClass="ui-glass-100">
  <!-- header content -->
</ui-header>

<!-- Card with dark glass effect -->
<ui-card customClass="ui-glass-dark-100">
  <!-- card content -->
</ui-card>

<!-- Section with adaptive glass -->
<ui-section customClass="ui-glass-adaptive">
  <!-- section content -->
</ui-section>
```

---

## Importing Components

All components are exported from the main `@ui` package:

```typescript
import {
  UiButtonComponent,
  UiCardComponent,
  UiCardHeaderComponent,
  UiCardContentComponent,
  UiCardFooterComponent,
  UiSectionComponent,
  UiThemeToggleComponent,
  UiHeaderComponent,
  // Types
  type ButtonVariant,
  type SectionVariant,
  type Theme,
} from '@ui';
```

---

## Viewing in Storybook

All components have Storybook stories. Run Storybook to see interactive examples:

```bash
npx nx storybook ui
```

Then navigate to:
- UI/Button
- UI/Card
- UI/Section
- UI/ThemeToggle
- UI/Header

---

## Design System

All components use:
- **DaisyUI** for theming and base styles
- **Tailwind CSS** for utility classes
- **Signals** for reactive state management
- **OnPush** change detection for performance
- **Standalone** components (no NgModules)
