# UI Library (@ui)

A themeable Angular component library built with DaisyUI and Tailwind CSS.

## Installation

The library is already configured in your workspace. Import components using:

```typescript
import { UiButtonComponent } from '@ui';
```

## Usage

### Button Component

```typescript
import { Component } from '@angular/core';
import { UiButtonComponent } from '@ui';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UiButtonComponent],
  template: `
    <!-- Basic button -->
    <ui-button>Click me</ui-button>

    <!-- Different variants (automatically use active theme colors) -->
    <ui-button variant="primary">Primary</ui-button>
    <ui-button variant="secondary">Secondary</ui-button>
    <ui-button variant="accent">Accent</ui-button>
    <ui-button variant="neutral">Neutral</ui-button>
    <ui-button variant="ghost">Ghost</ui-button>

    <!-- Sizes -->
    <ui-button size="xs">Extra Small</ui-button>
    <ui-button size="sm">Small</ui-button>
    <ui-button size="md">Medium (default)</ui-button>
    <ui-button size="lg">Large</ui-button>

    <!-- Modifiers -->
    <ui-button outline>Outlined</ui-button>
    <ui-button wide>Wide</ui-button>
    <ui-button block>Block</ui-button>
    <ui-button loading>Loading...</ui-button>
    <ui-button disabled>Disabled</ui-button>

    <!-- With click handler -->
    <ui-button (clicked)="handleClick($event)">
      Handle Click
    </ui-button>
  `,
})
export class ExampleComponent {
  handleClick(event: MouseEvent) {
    console.log('Button clicked!', event);
  }
}
```

### Button API

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'accent' \| 'neutral' \| 'ghost' \| 'link'` | `'primary'` | Button color variant using theme colors |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `disabled` | `boolean` | `false` | Disabled state |
| `loading` | `boolean` | `false` | Loading state (shows spinner) |
| `block` | `boolean` | `false` | Full width button |
| `outline` | `boolean` | `false` | Outlined style |
| `wide` | `boolean` | `false` | Extra horizontal padding |

**Outputs:**

| Output | Type | Description |
|--------|------|-------------|
| `clicked` | `EventEmitter<MouseEvent>` | Emitted when button is clicked (unless disabled or loading) |

## Theming

This library uses DaisyUI for theming. Components automatically adapt to the active theme configured in your app's `tailwind.config.js`.

### How Theming Works

1. **DaisyUI CSS Variables**: All components use DaisyUI's CSS custom properties (e.g., `--color-primary`, `--color-base-100`)
2. **Automatic Theme Switching**: When you change the theme in your app, all UI components automatically update
3. **No JavaScript Required**: Theme switching is pure CSS using DaisyUI's theme system

### Configuring Themes

Themes are configured in your application's `tailwind.config.js`:

```javascript
module.exports = {
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        'my-custom-theme': {
          'primary': 'oklch(58% 0.233 277.117)',
          'secondary': 'oklch(65% 0.241 354.308)',
          'accent': 'oklch(77% 0.152 181.912)',
          'neutral': 'oklch(14% 0.005 285.823)',
          'base-100': 'oklch(25.33% 0.016 252.42)',
          'base-200': 'oklch(23.26% 0.014 253.1)',
          'base-300': 'oklch(21.15% 0.012 254.09)',
          // ... more colors
        },
      },
      'light',
      'dark',
    ],
  },
};
```

### Switching Themes at Runtime

Add the `data-theme` attribute to your HTML element:

```html
<!-- In your app component or layout -->
<html data-theme="dark">
  <!-- All UI components will use dark theme -->
</html>

<!-- Or switch dynamically -->
<html [attr.data-theme]="currentTheme">
  <button (click)="currentTheme = 'light'">Light</button>
  <button (click)="currentTheme = 'dark'">Dark</button>
</html>
```

## Building New Components

When creating new themeable components, follow these guidelines:

### 1. Use DaisyUI Classes

Prefer DaisyUI's built-in classes which automatically use theme variables:

```typescript
@Component({
  template: `
    <!-- Good: Uses DaisyUI classes -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-primary">Title</h2>
        <p class="text-base-content">Content</p>
      </div>
    </div>
  `
})
```

### 2. Use Theme CSS Variables

When you need custom styles, reference DaisyUI's CSS variables:

```scss
// component.scss
.custom-component {
  // Use theme colors via oklch() function
  background-color: oklch(var(--b1)); // base-100
  color: oklch(var(--bc)); // base-content
  border-color: oklch(var(--p)); // primary

  &:hover {
    background-color: oklch(var(--b2)); // base-200
  }
}
```

### 3. Common DaisyUI CSS Variables

```scss
// Base colors
--b1  // base-100 (background)
--b2  // base-200 (slightly darker background)
--b3  // base-300 (even darker background)
--bc  // base-content (text on base colors)

// Theme colors
--p   // primary
--pc  // primary-content (text on primary)
--s   // secondary
--sc  // secondary-content
--a   // accent
--ac  // accent-content
--n   // neutral
--nc  // neutral-content

// Status colors
--in  // info
--inc // info-content
--su  // success
--suc // success-content
--wa  // warning
--wac // warning-content
--er  // error
--erc // error-content
```

### 4. Component Structure

Follow this pattern for all UI components:

```typescript
import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'ui-my-component',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './my-component.component.scss',
  template: `
    <div [class]="computedClasses">
      <ng-content></ng-content>
    </div>
  `,
})
export class UiMyComponent {
  // Use signals for inputs
  variant = input<'primary' | 'secondary'>('primary');

  // Use output for events
  changed = output<string>();

  // Compute DaisyUI classes dynamically
  protected get computedClasses(): string {
    const classes = ['base-class'];

    if (this.variant() === 'primary') {
      classes.push('bg-primary', 'text-primary-content');
    }

    return classes.join(' ');
  }
}
```

### 5. Export Components

Add new components to `src/index.ts`:

```typescript
// Export components
export * from './lib/my-component/my-component.component';

// Export types
export type { MyComponentVariant } from './lib/my-component/my-component.component';
```

## Testing

Run tests for the UI library:

```bash
# Run all tests
yarn nx test ui

# Run tests in watch mode
yarn nx test ui --watch

# Run tests with coverage
yarn nx test ui --coverage
```

## Contributing

When adding new components:

1. **Follow Angular best practices** (Signals, Standalone, OnPush)
2. **Use DaisyUI classes** whenever possible
3. **Make components themeable** by using theme CSS variables
4. **Write comprehensive tests** for all variants and states
5. **Document the API** in this README
6. **Export from index.ts** to make components available

## Examples

See `apps/faceless/web` for real-world usage examples of UI components.
