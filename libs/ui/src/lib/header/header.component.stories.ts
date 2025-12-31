import type { Meta, StoryObj } from '@storybook/angular';
import { UiHeaderComponent } from './header.component';

const meta: Meta<UiHeaderComponent> = {
  component: UiHeaderComponent,
  title: 'UI/Header',
  tags: ['autodocs'],
  argTypes: {
    fixed: {
      control: 'boolean',
      description: 'Fixed position at the top',
    },
    customClass: {
      control: 'text',
      description: 'Custom CSS classes to apply',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<UiHeaderComponent>;

// Default header
export const Default: Story = {
  args: {
    fixed: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-header [fixed]="fixed">
        <div logo class="flex items-center gap-2">
          <div class="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
            <span class="text-primary-content font-bold text-sm">L</span>
          </div>
          <span class="font-semibold text-lg">Logo</span>
        </div>

        <div nav class="flex items-center gap-8">
          <a href="#" class="text-sm text-base-content text-opacity-60 hover:text-opacity-100 transition-colors">Home</a>
          <a href="#" class="text-sm text-base-content text-opacity-60 hover:text-opacity-100 transition-colors">Features</a>
          <a href="#" class="text-sm text-base-content text-opacity-60 hover:text-opacity-100 transition-colors">Pricing</a>
          <a href="#" class="text-sm text-base-content text-opacity-60 hover:text-opacity-100 transition-colors">About</a>
        </div>

        <div actions class="flex items-center gap-2">
          <button class="btn btn-ghost btn-sm">Sign In</button>
          <button class="btn btn-primary btn-sm">Get Started</button>
        </div>

        <div mobile-nav class="flex flex-col gap-4">
          <a href="#" class="text-sm text-base-content text-opacity-60 hover:text-opacity-100 transition-colors">Home</a>
          <a href="#" class="text-sm text-base-content text-opacity-60 hover:text-opacity-100 transition-colors">Features</a>
          <a href="#" class="text-sm text-base-content text-opacity-60 hover:text-opacity-100 transition-colors">Pricing</a>
          <a href="#" class="text-sm text-base-content text-opacity-60 hover:text-opacity-100 transition-colors">About</a>
          <button class="btn btn-primary w-full mt-2">Get Started</button>
        </div>
      </ui-header>

      <div class="pt-20 p-8">
        <h1 class="text-4xl font-bold mb-4">Page Content</h1>
        <p class="text-base-content text-opacity-60">
          This is the main page content. The header is not fixed in this example.
        </p>
      </div>
    `,
  }),
};

// Fixed header
export const Fixed: Story = {
  args: {
    fixed: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-header [fixed]="fixed">
        <div logo class="flex items-center gap-2">
          <div class="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
            <span class="text-primary-content font-bold text-sm">L</span>
          </div>
          <span class="font-semibold text-lg">Logo</span>
        </div>

        <div nav class="flex items-center gap-8">
          <a href="#" class="text-sm text-base-content text-opacity-60 hover:text-opacity-100 transition-colors">Home</a>
          <a href="#" class="text-sm text-base-content text-opacity-60 hover:text-opacity-100 transition-colors">Features</a>
          <a href="#" class="text-sm text-base-content text-opacity-60 hover:text-opacity-100 transition-colors">Pricing</a>
          <a href="#" class="text-sm text-base-content text-opacity-60 hover:text-opacity-100 transition-colors">About</a>
        </div>

        <div actions class="flex items-center gap-2">
          <button class="btn btn-ghost btn-sm">Sign In</button>
          <button class="btn btn-primary btn-sm">Get Started</button>
        </div>

        <div mobile-nav class="flex flex-col gap-4">
          <a href="#" class="text-sm text-base-content text-opacity-60 hover:text-opacity-100 transition-colors">Home</a>
          <a href="#" class="text-sm text-base-content text-opacity-60 hover:text-opacity-100 transition-colors">Features</a>
          <a href="#" class="text-sm text-base-content text-opacity-60 hover:text-opacity-100 transition-colors">Pricing</a>
          <a href="#" class="text-sm text-base-content text-opacity-60 hover:text-opacity-100 transition-colors">About</a>
          <button class="btn btn-primary w-full mt-2">Get Started</button>
        </div>
      </ui-header>

      <div class="pt-24 p-8 min-h-screen">
        <h1 class="text-4xl font-bold mb-4">Page Content</h1>
        <p class="text-base-content text-opacity-60 mb-4">
          Scroll down to see the fixed header in action.
        </p>
        <div class="space-y-4">
          <p class="text-base-content text-opacity-60">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <p class="text-base-content text-opacity-60">Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <p class="text-base-content text-opacity-60">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
        </div>
      </div>
    `,
  }),
};

// With glass effect
export const GlassEffect: Story = {
  args: {
    fixed: true,
    customClass: 'ui-glass-100',
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-header [fixed]="fixed" [customClass]="customClass">
        <div logo class="flex items-center gap-2">
          <div class="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
            <span class="text-primary-content font-bold text-sm">G</span>
          </div>
          <span class="font-semibold text-lg">Glassy</span>
        </div>

        <div nav class="flex items-center gap-8">
          <a href="#" class="text-sm text-base-content text-opacity-60 hover:text-opacity-100 transition-colors">Home</a>
          <a href="#" class="text-sm text-base-content text-opacity-60 hover:text-opacity-100 transition-colors">Features</a>
          <a href="#" class="text-sm text-base-content text-opacity-60 hover:text-opacity-100 transition-colors">Pricing</a>
        </div>

        <div actions class="flex items-center gap-2">
          <button class="btn btn-ghost btn-sm">🌙</button>
          <button class="btn btn-primary btn-sm">Get Started</button>
        </div>

        <div mobile-nav class="flex flex-col gap-4">
          <a href="#" class="text-sm text-base-content text-opacity-60">Home</a>
          <a href="#" class="text-sm text-base-content text-opacity-60">Features</a>
          <a href="#" class="text-sm text-base-content text-opacity-60">Pricing</a>
          <button class="btn btn-primary w-full mt-2">Get Started</button>
        </div>
      </ui-header>

      <div class="pt-24 bg-gradient-to-br from-primary to-secondary min-h-screen p-8">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-5xl font-bold mb-6 text-primary-content">Glass Effect Header</h1>
          <p class="text-primary-content text-opacity-90 text-xl mb-8">
            Notice how the header blurs the content behind it, creating a beautiful glass effect.
          </p>
          <div class="space-y-4 text-primary-content text-opacity-80">
            <p>Scroll to see the header stay fixed at the top with the glass blur effect.</p>
            <p>This works great with colorful backgrounds and gradients.</p>
            <p>The backdrop-blur creates a modern, sleek appearance.</p>
          </div>
        </div>
      </div>
    `,
  }),
};

// Simple header
export const Simple: Story = {
  args: {
    fixed: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-header [fixed]="fixed">
        <div logo class="font-bold text-xl">MyApp</div>

        <div nav class="flex items-center gap-6">
          <a href="#" class="text-sm hover:text-primary transition-colors">Home</a>
          <a href="#" class="text-sm hover:text-primary transition-colors">About</a>
          <a href="#" class="text-sm hover:text-primary transition-colors">Contact</a>
        </div>

        <div actions>
          <button class="btn btn-sm btn-primary">Login</button>
        </div>

        <div mobile-nav class="flex flex-col gap-3">
          <a href="#" class="text-sm">Home</a>
          <a href="#" class="text-sm">About</a>
          <a href="#" class="text-sm">Contact</a>
          <button class="btn btn-primary w-full">Login</button>
        </div>
      </ui-header>
    `,
  }),
};

// With theme toggle
export const WithThemeToggle: Story = {
  args: {
    fixed: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-header [fixed]="fixed">
        <div logo class="flex items-center gap-2">
          <div class="w-9 h-9 bg-accent rounded-xl flex items-center justify-center">
            <span class="text-accent-content font-bold">A</span>
          </div>
          <span class="font-semibold text-lg">App Name</span>
        </div>

        <div nav class="flex items-center gap-8">
          <a href="#" class="text-sm text-base-content text-opacity-60 hover:text-opacity-100">Dashboard</a>
          <a href="#" class="text-sm text-base-content text-opacity-60 hover:text-opacity-100">Projects</a>
          <a href="#" class="text-sm text-base-content text-opacity-60 hover:text-opacity-100">Team</a>
        </div>

        <div actions class="flex items-center gap-2">
          <!-- Theme toggle placeholder (would be ui-theme-toggle component) -->
          <div class="join">
            <button class="join-item btn btn-sm">☀️</button>
            <button class="join-item btn btn-sm btn-active">🌙</button>
          </div>
          <button class="btn btn-primary btn-sm">Upgrade</button>
        </div>

        <div mobile-actions>
          <!-- Mobile theme toggle -->
          <div class="join">
            <button class="join-item btn btn-sm">☀️</button>
            <button class="join-item btn btn-sm btn-active">🌙</button>
          </div>
        </div>

        <div mobile-nav class="flex flex-col gap-4">
          <a href="#" class="text-sm">Dashboard</a>
          <a href="#" class="text-sm">Projects</a>
          <a href="#" class="text-sm">Team</a>
          <button class="btn btn-primary w-full mt-2">Upgrade</button>
        </div>
      </ui-header>

      <div class="pt-24 p-8 min-h-screen">
        <h1 class="text-4xl font-bold mb-4">Dashboard</h1>
        <p class="text-base-content text-opacity-60">
          Header with theme toggle and action buttons.
        </p>
      </div>
    `,
  }),
};
