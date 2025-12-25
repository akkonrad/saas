# UI Library Quick Start

## What You Have Now

✅ **Angular UI library** at `libs/ui` with custom import path `@ui`
✅ **DaisyUI integration** - components automatically themed
✅ **Example button component** with full theming support
✅ **Comprehensive tests** (all passing)
✅ **TypeScript types** for all component props
✅ **Proper Nx tags** for module boundaries

## Import & Use Components

```typescript
import { UiButtonComponent } from '@ui';

@Component({
  imports: [UiButtonComponent],
  template: `
    <ui-button variant="primary">Click Me</ui-button>
  `
})
```

## How Theming Works

1. **Define theme** in `apps/faceless/web/tailwind.config.js`
2. **Set theme** using `data-theme` attribute on HTML element
3. **Components adapt automatically** - no code changes needed!

```html
<!-- Light theme -->
<div data-theme="light">
  <ui-button variant="primary">Light Button</ui-button>
</div>

<!-- Dark theme -->
<div data-theme="dark">
  <ui-button variant="primary">Dark Button</ui-button>
</div>
```

## Available Components

### UiButtonComponent (`<ui-button>`)

```typescript
import { UiButtonComponent } from '@ui';

// Basic usage
<ui-button>Default</ui-button>

// Variants (automatically use theme colors)
<ui-button variant="primary">Primary</ui-button>
<ui-button variant="secondary">Secondary</ui-button>
<ui-button variant="accent">Accent</ui-button>
<ui-button variant="neutral">Neutral</ui-button>
<ui-button variant="ghost">Ghost</ui-button>

// Sizes
<ui-button size="xs">Extra Small</ui-button>
<ui-button size="sm">Small</ui-button>
<ui-button size="md">Medium</ui-button>
<ui-button size="lg">Large</ui-button>

// Modifiers
<ui-button outline>Outlined</ui-button>
<ui-button wide>Wide</ui-button>
<ui-button block>Block</ui-button>
<ui-button loading>Loading</ui-button>
<ui-button disabled>Disabled</ui-button>

// With event handler
<ui-button (clicked)="handleClick($event)">
  Handle Click
</ui-button>
```

## Add New Components

### 1. Create Component Files

```bash
mkdir libs/ui/src/lib/my-component
```

### 2. Component TypeScript

```typescript
// my-component.component.ts
import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'ui-my-component',
  standalone: true,
  templateUrl: './my-component.component.html',
  styleUrl: './my-component.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiMyComponent {
  variant = input<'primary' | 'secondary'>('primary');
  changed = output<string>();

  protected get classes(): string {
    return this.variant() === 'primary'
      ? 'bg-primary text-primary-content'
      : 'bg-secondary text-secondary-content';
  }
}
```

### 3. Component Template

```html
<!-- my-component.component.html -->
<div [class]="classes">
  <ng-content></ng-content>
</div>
```

### 4. Component Styles (Use Theme Variables!)

```scss
// my-component.component.scss

// ✅ GOOD - Uses theme variables
:host {
  display: block;

  .custom-style {
    background-color: oklch(var(--b1)); // base-100
    color: oklch(var(--bc)); // base-content
    border: 1px solid oklch(var(--p)); // primary
  }
}

// ❌ BAD - Hardcoded colors
// .custom-style {
//   background-color: #1a1a1a;
//   color: #ffffff;
// }
```

### 5. Export from Index

```typescript
// libs/ui/src/index.ts
export * from './lib/my-component/my-component.component';
```

### 6. Write Tests

```typescript
// my-component.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiMyComponent } from './my-component.component';

describe('UiMyComponent', () => {
  let component: UiMyComponent;
  let fixture: ComponentFixture<UiMyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiMyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiMyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply variant class', () => {
    fixture.componentRef.setInput('variant', 'primary');
    fixture.detectChanges();
    expect(component.classes).toContain('bg-primary');
  });
});
```

## DaisyUI CSS Variables Reference

Use these in your component styles:

```scss
// Base colors
oklch(var(--b1))  // base-100 (main background)
oklch(var(--b2))  // base-200 (slightly darker)
oklch(var(--b3))  // base-300 (even darker)
oklch(var(--bc))  // base-content (text)

// Theme colors
oklch(var(--p))   // primary
oklch(var(--pc))  // primary-content
oklch(var(--s))   // secondary
oklch(var(--sc))  // secondary-content
oklch(var(--a))   // accent
oklch(var(--ac))  // accent-content
oklch(var(--n))   // neutral
oklch(var(--nc))  // neutral-content

// Status colors
oklch(var(--in))  // info
oklch(var(--su))  // success
oklch(var(--wa))  // warning
oklch(var(--er))  // error
```

## Common DaisyUI Classes

Use these in your templates:

### Layout
- `container` - Responsive container
- `flex`, `grid` - Layout utilities
- `card`, `card-body`, `card-title` - Card component

### Components
- `btn`, `btn-primary`, `btn-secondary` - Buttons
- `input`, `textarea`, `select` - Form inputs
- `badge`, `badge-primary` - Badges
- `alert`, `alert-info` - Alerts
- `modal`, `modal-box` - Modals
- `navbar`, `menu` - Navigation
- `drawer`, `drawer-side` - Drawers

### Colors (Auto-themed!)
- `bg-primary`, `bg-secondary`, `bg-accent` - Backgrounds
- `text-primary`, `text-secondary` - Text colors
- `bg-base-100`, `bg-base-200`, `bg-base-300` - Base backgrounds
- `text-base-content` - Base text color

## Testing

```bash
# Run all UI library tests
yarn nx test ui

# Run tests in watch mode
yarn nx test ui --watch

# Run with coverage
yarn nx test ui --coverage
```

## Next Steps

1. **Add more components** (Input, Card, Modal, etc.)
2. **Create a component showcase** page in your app
3. **Build multiple themes** for different apps
4. **Share components** across all Angular apps in monorepo

## Documentation

- `README.md` - Full component API documentation
- `THEMING_GUIDE.md` - Comprehensive theming guide
- `QUICK_START.md` - This file

## Need Help?

Check the existing button component (`libs/ui/src/lib/button/`) for a complete example of how to build themeable components.
