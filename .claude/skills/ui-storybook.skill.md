# UI Component with Storybook

## Description
Ensures that when creating new UI components in `libs/ui`, a corresponding Storybook story file is also created. This skill should be used whenever adding new components to the UI library.

## Instructions

When creating a new UI component in `libs/ui/src/lib/`, you **MUST** also create a corresponding Storybook story file.

### Required Files for Each UI Component

For a component named `my-component`:
```
libs/ui/src/lib/my-component/
├── my-component.component.ts      # Component implementation
├── my-component.component.stories.ts  # REQUIRED: Storybook stories
├── my-component.component.spec.ts # Optional: Unit tests
└── my-component.component.scss    # Optional: Styles (if needed)
```

### Story File Structure

Use this template for creating Storybook stories:

```typescript
import type { Meta, StoryObj } from '@storybook/angular';
import { signal } from '@angular/core';
import { MyComponent } from './my-component.component';

const meta: Meta<MyComponent> = {
  component: MyComponent,
  title: 'UI/MyComponent',  // Use 'UI/' prefix for all UI library components
  tags: ['autodocs'],       // Enable automatic documentation
  argTypes: {
    // Define controls for each input
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
      description: 'Visual variant of the component',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled',
    },
  },
};

export default meta;
type Story = StoryObj<MyComponent>;

// 1. Default story - shows basic usage
export const Default: Story = {
  args: {
    // Default input values
  },
};

// 2. Interactive story - shows component with state management
export const Interactive: Story = {
  render: () => {
    const someState = signal('initial');

    return {
      props: {
        someState,
        handleChange: (value: string) => {
          someState.set(value);
          console.log('Changed to:', value);
        },
      },
      template: `
        <my-component
          [value]="someState()"
          (valueChange)="handleChange($event)"
        ></my-component>
        <p class="mt-2 text-sm">Current: {{ someState() }}</p>
      `,
    };
  },
};

// 3. Variant stories - show different visual variants
export const Primary: Story = {
  args: {
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};

// 4. In-context story - shows component in a realistic context
export const InHeader: Story = {
  render: () => ({
    template: `
      <header class="navbar bg-base-100 shadow-lg">
        <div class="flex-1">Logo</div>
        <div class="flex-none">
          <my-component></my-component>
        </div>
      </header>
    `,
  }),
};

// 5. All variants comparison story
export const CompareVariants: Story = {
  render: () => ({
    template: `
      <div class="space-y-4 p-4">
        <div>
          <h3 class="font-semibold mb-2">Primary</h3>
          <my-component variant="primary"></my-component>
        </div>
        <div>
          <h3 class="font-semibold mb-2">Secondary</h3>
          <my-component variant="secondary"></my-component>
        </div>
      </div>
    `,
  }),
};
```

### Required Stories

Every UI component MUST have at least these stories:

1. **Default** - Basic component with default props
2. **Interactive** - Component with working state (if it has outputs)
3. **Variant stories** - One story per visual variant
4. **In-context** - Component shown in a realistic usage context (e.g., in a header, form, card)

### Best Practices

1. **Use signals for interactive stories** - This allows state to update in Storybook
2. **Add `tags: ['autodocs']`** - Enables automatic documentation generation
3. **Define argTypes** - Provides better controls in Storybook UI
4. **Use DaisyUI classes** - Maintain consistency with the rest of the UI library
5. **Log events** - Add `console.log` in event handlers for debugging
6. **Show all states** - Include stories for loading, error, disabled states if applicable

### Running Storybook

```bash
npx nx storybook ui
```

### Verification Checklist

Before marking a UI component as complete, verify:
- [ ] Component file created: `*.component.ts`
- [ ] Story file created: `*.component.stories.ts`
- [ ] Default story exists
- [ ] Interactive story exists (if component has outputs)
- [ ] All variants have stories
- [ ] Component exported in `libs/ui/src/index.ts`
- [ ] Storybook builds without errors: `npx nx build-storybook ui`

### Example Components with Stories

Reference these existing components for patterns:
- `libs/ui/src/lib/theme-toggle/theme-toggle.component.stories.ts`
- `libs/ui/src/lib/button/button.component.stories.ts`
- `libs/ui/src/lib/card/card.component.stories.ts`
- `libs/ui/src/lib/language-switcher/language-switcher.component.stories.ts`
