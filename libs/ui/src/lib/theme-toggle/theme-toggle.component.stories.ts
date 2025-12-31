import type { Meta, StoryObj } from '@storybook/angular';
import {
  UiThemeToggleComponent,
  Theme,
  ThemeToggleVariant,
} from './theme-toggle.component';
import { signal } from '@angular/core';

const meta: Meta<UiThemeToggleComponent> = {
  component: UiThemeToggleComponent,
  title: 'UI/ThemeToggle',
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'Current theme',
    },
    variant: {
      control: 'select',
      options: ['buttons', 'toggle-switch', 'icon-button'],
      description: 'Visual variant of the toggle',
    },
    customClass: {
      control: 'text',
      description: 'Custom CSS classes to apply',
    },
  },
};

export default meta;
type Story = StoryObj<UiThemeToggleComponent>;

// Default theme toggle
export const Default: Story = {
  args: {
    theme: 'light',
  },
  render: (args) => ({
    props: {
      ...args,
      handleThemeChange: (theme: Theme) => {
        console.log('Theme changed to:', theme);
      },
    },
    template: `
      <ui-theme-toggle
        [theme]="theme"
        (themeChange)="handleThemeChange($event)"
      ></ui-theme-toggle>
    `,
  }),
};

// Light theme
export const Light: Story = {
  args: {
    theme: 'light',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-4">
        <p class="mb-4 text-base-content">Current theme: Light</p>
        <ui-theme-toggle [theme]="theme"></ui-theme-toggle>
      </div>
    `,
  }),
};

// Dark theme
export const Dark: Story = {
  args: {
    theme: 'dark',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-4">
        <p class="mb-4 text-base-content">Current theme: Dark</p>
        <ui-theme-toggle [theme]="theme"></ui-theme-toggle>
      </div>
    `,
  }),
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const currentTheme = signal<Theme>('light');

    return {
      props: {
        currentTheme,
        handleThemeChange: (theme: Theme) => {
          currentTheme.set(theme);
          // In a real app, you would also update the document theme here
          console.log('Theme changed to:', theme);
        },
      },
      template: `
        <div class="p-6 space-y-4">
          <div class="flex items-center gap-4">
            <span class="text-base-content font-medium">Theme:</span>
            <ui-theme-toggle
              [theme]="currentTheme()"
              (themeChange)="handleThemeChange($event)"
            ></ui-theme-toggle>
            <span class="text-base-content text-opacity-60">
              Current: {{ currentTheme() }}
            </span>
          </div>

          <div class="card bg-base-200 p-4">
            <p class="text-base-content">
              This content adapts to the selected theme.
              Try toggling between light and dark modes!
            </p>
          </div>
        </div>
      `,
    };
  },
};

// In header context
export const InHeader: Story = {
  render: () => ({
    props: {
      currentTheme: signal<Theme>('light'),
      handleThemeChange: (theme: Theme) => {
        console.log('Theme changed to:', theme);
      },
    },
    template: `
      <header class="navbar bg-base-100 shadow-lg">
        <div class="flex-1">
          <a class="btn btn-ghost text-xl">Logo</a>
        </div>
        <div class="flex-none gap-2">
          <ui-theme-toggle
            [theme]="currentTheme()"
            (themeChange)="handleThemeChange($event)"
          ></ui-theme-toggle>
          <button class="btn btn-primary">Sign In</button>
        </div>
      </header>
    `,
  }),
};

// With custom styling
export const CustomStyling: Story = {
  args: {
    theme: 'light',
    customClass: 'shadow-lg',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-4">
        <p class="mb-4 text-base-content">With custom shadow</p>
        <ui-theme-toggle
          [theme]="theme"
          [customClass]="customClass"
        ></ui-theme-toggle>
      </div>
    `,
  }),
};

// All states
export const AllStates: Story = {
  render: () => ({
    template: `
      <div class="space-y-8 p-6">
        <div>
          <h3 class="text-lg font-semibold mb-3">Light Theme Active</h3>
          <ui-theme-toggle theme="light"></ui-theme-toggle>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-3">Dark Theme Active</h3>
          <ui-theme-toggle theme="dark"></ui-theme-toggle>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-3">With Custom Class</h3>
          <ui-theme-toggle theme="light" customClass="border border-primary"></ui-theme-toggle>
        </div>
      </div>
    `,
  }),
};

// Toggle Switch - Light
export const ToggleSwitchLight: Story = {
  args: {
    theme: 'light',
    variant: 'toggle-switch',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-4">
        <p class="mb-4 text-base-content">Toggle Switch - Light Theme</p>
        <ui-theme-toggle [theme]="theme" [variant]="variant"></ui-theme-toggle>
      </div>
    `,
  }),
};

// Toggle Switch - Dark
export const ToggleSwitchDark: Story = {
  args: {
    theme: 'dark',
    variant: 'toggle-switch',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-4">
        <p class="mb-4 text-base-content">Toggle Switch - Dark Theme</p>
        <ui-theme-toggle [theme]="theme" [variant]="variant"></ui-theme-toggle>
      </div>
    `,
  }),
};

// Toggle Switch Interactive
export const ToggleSwitchInteractive: Story = {
  render: () => {
    const currentTheme = signal<Theme>('light');

    return {
      props: {
        currentTheme,
        handleThemeChange: (theme: Theme) => {
          currentTheme.set(theme);
          console.log('Theme changed to:', theme);
        },
      },
      template: `
        <div class="p-6 space-y-4">
          <div class="flex items-center gap-4">
            <span class="text-base-content font-medium">Theme Toggle Switch:</span>
            <ui-theme-toggle
              [theme]="currentTheme()"
              variant="toggle-switch"
              (themeChange)="handleThemeChange($event)"
            ></ui-theme-toggle>
            <span class="text-base-content text-opacity-60">
              Current: {{ currentTheme() }}
            </span>
          </div>

          <div class="card bg-base-200 p-4">
            <p class="text-base-content">
              This toggle switch variant features a smooth sliding animation
              with sun and moon icons. Click to toggle between light and dark themes!
            </p>
          </div>
        </div>
      `,
    };
  },
};

// Icon Button - Light
export const IconButtonLight: Story = {
  args: {
    theme: 'light',
    variant: 'icon-button',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-4">
        <p class="mb-4 text-base-content">Icon Button - Light Theme</p>
        <ui-theme-toggle [theme]="theme" [variant]="variant"></ui-theme-toggle>
      </div>
    `,
  }),
};

// Icon Button - Dark
export const IconButtonDark: Story = {
  args: {
    theme: 'dark',
    variant: 'icon-button',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-4">
        <p class="mb-4 text-base-content">Icon Button - Dark Theme</p>
        <ui-theme-toggle [theme]="theme" [variant]="variant"></ui-theme-toggle>
      </div>
    `,
  }),
};

// Icon Button Interactive
export const IconButtonInteractive: Story = {
  render: () => {
    const currentTheme = signal<Theme>('light');

    return {
      props: {
        currentTheme,
        handleThemeChange: (theme: Theme) => {
          currentTheme.set(theme);
          console.log('Theme changed to:', theme);
        },
      },
      template: `
        <div class="p-6 space-y-4">
          <div class="flex items-center gap-4">
            <span class="text-base-content font-medium">Theme Icon Button:</span>
            <ui-theme-toggle
              [theme]="currentTheme()"
              variant="icon-button"
              (themeChange)="handleThemeChange($event)"
            ></ui-theme-toggle>
            <span class="text-base-content text-opacity-60">
              Current: {{ currentTheme() }}
            </span>
          </div>

          <div class="card bg-base-200 p-4">
            <p class="text-base-content">
              This icon button variant shows only the current theme icon.
              Perfect for compact layouts like navigation bars!
            </p>
          </div>
        </div>
      `,
    };
  },
};

// Icon Button in Header
export const IconButtonInHeader: Story = {
  render: () => {
    const currentTheme = signal<Theme>('light');

    return {
      props: {
        currentTheme,
        handleThemeChange: (theme: Theme) => {
          currentTheme.set(theme);
          console.log('Theme changed to:', theme);
        },
      },
      template: `
        <header class="navbar bg-base-100 shadow-lg">
          <div class="flex-1">
            <a class="btn btn-ghost text-xl">Logo</a>
          </div>
          <div class="flex-none gap-2">
            <ui-theme-toggle
              [theme]="currentTheme()"
              variant="icon-button"
              (themeChange)="handleThemeChange($event)"
            ></ui-theme-toggle>
            <button class="btn btn-primary">Sign In</button>
          </div>
        </header>
      `,
    };
  },
};

// Compare Variants
export const CompareVariants: Story = {
  render: () => {
    const currentTheme = signal<Theme>('light');

    return {
      props: {
        currentTheme,
        handleThemeChange: (theme: Theme) => {
          currentTheme.set(theme);
          console.log('Theme changed to:', theme);
        },
      },
      template: `
        <div class="p-6 space-y-8">
          <div>
            <h3 class="text-lg font-semibold mb-3">Buttons Variant (Default)</h3>
            <ui-theme-toggle
              [theme]="currentTheme()"
              variant="buttons"
              (themeChange)="handleThemeChange($event)"
            ></ui-theme-toggle>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-3">Toggle Switch Variant</h3>
            <ui-theme-toggle
              [theme]="currentTheme()"
              variant="toggle-switch"
              (themeChange)="handleThemeChange($event)"
            ></ui-theme-toggle>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-3">Icon Button Variant</h3>
            <ui-theme-toggle
              [theme]="currentTheme()"
              variant="icon-button"
              (themeChange)="handleThemeChange($event)"
            ></ui-theme-toggle>
          </div>

          <div class="text-base-content text-sm text-opacity-60">
            Current theme: {{ currentTheme() }}
          </div>
        </div>
      `,
    };
  },
};
