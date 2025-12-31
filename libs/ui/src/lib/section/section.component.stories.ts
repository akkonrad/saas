import type { Meta, StoryObj } from '@storybook/angular';
import { UiSectionComponent } from './section.component';

const meta: Meta<UiSectionComponent> = {
  component: UiSectionComponent,
  title: 'UI/Section',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'muted'],
      description: 'Section variant style',
    },
    id: {
      control: 'text',
      description: 'Section ID for anchor links',
    },
    customClass: {
      control: 'text',
      description: 'Custom CSS classes to apply',
    },
  },
};

export default meta;
type Story = StoryObj<UiSectionComponent>;

// Default section
export const Default: Story = {
  args: {
    variant: 'default',
    id: 'default-section',
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-section [variant]="variant" [id]="id">
        <h2 class="text-3xl md:text-4xl font-bold mb-6 text-center">Default Section</h2>
        <p class="text-base-content text-opacity-60 text-center max-w-2xl mx-auto">
          This is a default section with standard padding and no background color.
          Perfect for content that needs breathing room.
        </p>
      </ui-section>
    `,
  }),
};

// Muted section
export const Muted: Story = {
  args: {
    variant: 'muted',
    id: 'muted-section',
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-section [variant]="variant" [id]="id">
        <h2 class="text-3xl md:text-4xl font-bold mb-6 text-center">Muted Section</h2>
        <p class="text-base-content text-opacity-60 text-center max-w-2xl mx-auto">
          This section has a subtle background color and borders to separate it from adjacent content.
          Great for alternating sections on a landing page.
        </p>
      </ui-section>
    `,
  }),
};

// Multiple sections showcase
export const MultipleSections: Story = {
  render: () => ({
    template: `
      <div>
        <ui-section variant="default" id="section-1">
          <h2 class="text-3xl font-bold mb-4 text-center">Section 1 - Default</h2>
          <p class="text-base-content text-opacity-60 text-center max-w-2xl mx-auto">
            Default section with no background.
          </p>
        </ui-section>

        <ui-section variant="muted" id="section-2">
          <h2 class="text-3xl font-bold mb-4 text-center">Section 2 - Muted</h2>
          <p class="text-base-content text-opacity-60 text-center max-w-2xl mx-auto">
            Muted section with subtle background.
          </p>
        </ui-section>

        <ui-section variant="default" id="section-3">
          <h2 class="text-3xl font-bold mb-4 text-center">Section 3 - Default</h2>
          <p class="text-base-content text-opacity-60 text-center max-w-2xl mx-auto">
            Another default section.
          </p>
        </ui-section>

        <ui-section variant="muted" id="section-4">
          <h2 class="text-3xl font-bold mb-4 text-center">Section 4 - Muted</h2>
          <p class="text-base-content text-opacity-60 text-center max-w-2xl mx-auto">
            Alternating sections create visual rhythm.
          </p>
        </ui-section>
      </div>
    `,
  }),
};

// With custom classes
export const WithCustomClass: Story = {
  args: {
    variant: 'default',
    customClass: 'bg-gradient-to-r from-primary to-secondary',
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-section [variant]="variant" [customClass]="customClass">
        <h2 class="text-3xl font-bold mb-4 text-center text-primary-content">Custom Styled Section</h2>
        <p class="text-primary-content text-opacity-80 text-center max-w-2xl mx-auto">
          You can apply custom classes to create unique section styles.
        </p>
      </ui-section>
    `,
  }),
};

// Landing page example
export const LandingPageExample: Story = {
  render: () => ({
    template: `
      <div>
        <!-- Hero Section -->
        <ui-section variant="default" id="hero">
          <div class="text-center space-y-6">
            <h1 class="text-5xl md:text-6xl font-bold">Welcome to Our Product</h1>
            <p class="text-xl text-base-content text-opacity-60 max-w-3xl mx-auto">
              Build amazing things with our platform. Fast, reliable, and easy to use.
            </p>
            <div class="flex gap-4 justify-center">
              <button class="btn btn-primary btn-lg">Get Started</button>
              <button class="btn btn-outline btn-lg">Learn More</button>
            </div>
          </div>
        </ui-section>

        <!-- Features Section -->
        <ui-section variant="muted" id="features">
          <h2 class="text-4xl font-bold mb-12 text-center">Features</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center">
              <div class="text-4xl mb-4">⚡</div>
              <h3 class="text-xl font-semibold mb-2">Fast</h3>
              <p class="text-base-content text-opacity-60">Lightning-fast performance</p>
            </div>
            <div class="text-center">
              <div class="text-4xl mb-4">🔒</div>
              <h3 class="text-xl font-semibold mb-2">Secure</h3>
              <p class="text-base-content text-opacity-60">Enterprise-grade security</p>
            </div>
            <div class="text-center">
              <div class="text-4xl mb-4">🎨</div>
              <h3 class="text-xl font-semibold mb-2">Beautiful</h3>
              <p class="text-base-content text-opacity-60">Stunning design</p>
            </div>
          </div>
        </ui-section>

        <!-- CTA Section -->
        <ui-section variant="default" id="cta">
          <div class="text-center space-y-6">
            <h2 class="text-4xl font-bold">Ready to get started?</h2>
            <p class="text-xl text-base-content text-opacity-60 max-w-2xl mx-auto">
              Join thousands of users already building amazing things.
            </p>
            <button class="btn btn-primary btn-lg">Start Free Trial</button>
          </div>
        </ui-section>
      </div>
    `,
  }),
};
