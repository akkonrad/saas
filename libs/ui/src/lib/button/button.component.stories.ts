import type { Meta, StoryObj } from '@storybook/angular';
import { UiButtonComponent } from './button.component';

const meta: Meta<UiButtonComponent> = {
  component: UiButtonComponent,
  title: 'UI/Button',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'accent', 'neutral', 'ghost', 'link'],
      description: 'Button variant using DaisyUI theme colors',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Button size',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state (shows spinner)',
    },
    block: {
      control: 'boolean',
      description: 'Full width button',
    },
    outline: {
      control: 'boolean',
      description: 'Outlined style',
    },
    wide: {
      control: 'boolean',
      description: 'Wide button (extra padding)',
    },
  },
  render: (args) => ({
    props: args,
    template: `<ui-button
      [variant]="variant"
      [size]="size"
      [disabled]="disabled"
      [loading]="loading"
      [block]="block"
      [outline]="outline"
      [wide]="wide"
    >Button</ui-button>`,
  }),
};

export default meta;
type Story = StoryObj<UiButtonComponent>;

// Default story
export const Default: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    block: false,
    outline: false,
    wide: false,
  },
};

// Variants
export const Variants: Story = {
  args: {
    variant: 'primary',
    size: 'sm',
    loading: true,
    disabled: true,
  },

  render: () => ({
    template: `
      <div class="flex flex-wrap gap-2">
        <ui-button variant="primary">Primary</ui-button>
        <ui-button variant="secondary">Secondary</ui-button>
        <ui-button variant="accent">Accent</ui-button>
        <ui-button variant="neutral">Neutral</ui-button>
        <ui-button variant="ghost">Ghost</ui-button>
        <ui-button variant="link">Link</ui-button>
      </div>
    `,
  }),
};

// Sizes
export const Sizes: Story = {
  args: {
    loading: true,
    block: false,
    variant: 'secondary',
    size: 'md',
  },

  render: () => ({
    template: `
      <div class="flex flex-wrap items-center gap-2">
        <ui-button size="xs">Extra Small</ui-button>
        <ui-button size="sm">Small</ui-button>
        <ui-button size="md">Medium</ui-button>
        <ui-button size="lg">Large</ui-button>
      </div>
    `,
  }),
};

// Outlined
export const Outlined: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap gap-2">
        <ui-button variant="primary" [outline]="true">Primary</ui-button>
        <ui-button variant="secondary" [outline]="true">Secondary</ui-button>
        <ui-button variant="accent" [outline]="true">Accent</ui-button>
        <ui-button variant="neutral" [outline]="true">Neutral</ui-button>
      </div>
    `,
  }),
};

// States
export const States: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap gap-2">
        <ui-button>Normal</ui-button>
        <ui-button [disabled]="true">Disabled</ui-button>
        <ui-button [loading]="true">Loading</ui-button>
      </div>
    `,
  }),
};

// Modifiers
export const Modifiers: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    block: false,
    outline: false,
    wide: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="flex flex-col gap-4">
        <ui-button
          [variant]="variant"
          [size]="size"
          [disabled]="disabled"
          [loading]="loading"
          [block]="block"
          [outline]="outline"
          [wide]="wide"
        >Interactive Button (use controls)</ui-button>
        <ui-button [wide]="true">Wide Button (always)</ui-button>
        <ui-button [block]="true">Block Button (always)</ui-button>
      </div>
    `,
  }),
};
