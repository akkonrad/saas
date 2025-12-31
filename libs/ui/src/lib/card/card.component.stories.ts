import type { Meta, StoryObj } from '@storybook/angular';
import { UiCardComponent } from './card.component';
import { UiCardHeaderComponent } from './card-header.component';
import { UiCardContentComponent } from './card-content.component';
import { UiCardFooterComponent } from './card-footer.component';

const meta: Meta<UiCardComponent> = {
  component: UiCardComponent,
  title: 'UI/Card',
  tags: ['autodocs'],
  argTypes: {
    customClass: {
      control: 'text',
      description: 'Custom CSS classes to apply to the card',
    },
  },
};

export default meta;
type Story = StoryObj<UiCardComponent>;

// Basic card with header, content, and footer
export const Complete: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        UiCardComponent,
        UiCardHeaderComponent,
        UiCardContentComponent,
        UiCardFooterComponent,
      ],
    },
    template: `
      <ui-card>
        <ui-card-header>
          <h2 class="text-xl font-semibold">Card Title</h2>
          <p class="text-sm text-base-content text-opacity-60 mt-1">Card subtitle or description</p>
        </ui-card-header>
        <ui-card-content>
          <p class="text-base-content text-opacity-80">
            This is the main content area of the card. You can put any content here,
            including text, images, forms, or other components.
          </p>
        </ui-card-content>
        <ui-card-footer>
          <div class="flex justify-end gap-2">
            <button class="btn btn-ghost btn-sm">Cancel</button>
            <button class="btn btn-primary btn-sm">Save</button>
          </div>
        </ui-card-footer>
      </ui-card>
    `,
  }),
};

// Card with only header and content
export const WithoutFooter: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        UiCardComponent,
        UiCardHeaderComponent,
        UiCardContentComponent,
      ],
    },
    template: `
      <ui-card>
        <ui-card-header>
          <h2 class="text-xl font-semibold">Product Features</h2>
        </ui-card-header>
        <ui-card-content>
          <ul class="list-disc list-inside space-y-2 text-base-content text-opacity-80">
            <li>Advanced analytics and reporting</li>
            <li>Real-time collaboration tools</li>
            <li>Customizable dashboards</li>
            <li>24/7 customer support</li>
          </ul>
        </ui-card-content>
      </ui-card>
    `,
  }),
};

// Card with only content
export const ContentOnly: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [UiCardComponent, UiCardContentComponent],
    },
    template: `
      <ui-card>
        <ui-card-content>
          <div class="text-center py-8">
            <div class="text-4xl mb-4">🎉</div>
            <h3 class="text-lg font-semibold mb-2">Welcome!</h3>
            <p class="text-base-content text-opacity-60">
              Get started by exploring our features.
            </p>
          </div>
        </ui-card-content>
      </ui-card>
    `,
  }),
};

// Card with custom styling
export const CustomStyling: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        UiCardComponent,
        UiCardHeaderComponent,
        UiCardContentComponent,
        UiCardFooterComponent,
      ],
    },
    template: `
      <ui-card [customClass]="'bg-gradient-to-br from-primary/10 to-secondary/10'">
        <ui-card-header [customClass]="'bg-primary/5'">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-content">
              <span class="text-lg">🔔</span>
            </div>
            <div>
              <h3 class="font-semibold">Notification Settings</h3>
              <p class="text-xs text-base-content text-opacity-60">Manage your preferences</p>
            </div>
          </div>
        </ui-card-header>
        <ui-card-content>
          <div class="space-y-4">
            <label class="flex items-center justify-between cursor-pointer">
              <span class="text-sm">Email notifications</span>
              <input type="checkbox" class="toggle toggle-primary" checked />
            </label>
            <label class="flex items-center justify-between cursor-pointer">
              <span class="text-sm">Push notifications</span>
              <input type="checkbox" class="toggle toggle-primary" />
            </label>
            <label class="flex items-center justify-between cursor-pointer">
              <span class="text-sm">SMS notifications</span>
              <input type="checkbox" class="toggle toggle-primary" />
            </label>
          </div>
        </ui-card-content>
        <ui-card-footer [customClass]="'bg-base-200/50'">
          <button class="btn btn-primary btn-sm btn-block">Save Changes</button>
        </ui-card-footer>
      </ui-card>
    `,
  }),
};

// Pricing card example
export const PricingCard: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        UiCardComponent,
        UiCardHeaderComponent,
        UiCardContentComponent,
        UiCardFooterComponent,
      ],
    },
    template: `
      <div class="max-w-sm">
        <ui-card>
          <ui-card-header>
            <div class="text-center">
              <h3 class="text-lg font-semibold text-base-content text-opacity-60">Pro Plan</h3>
              <div class="mt-4 flex items-baseline justify-center gap-1">
                <span class="text-5xl font-bold">$29</span>
                <span class="text-base-content text-opacity-60">/month</span>
              </div>
            </div>
          </ui-card-header>
          <ui-card-content>
            <ul class="space-y-3">
              <li class="flex items-center gap-2">
                <span class="text-success">✓</span>
                <span class="text-sm">Unlimited projects</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-success">✓</span>
                <span class="text-sm">Advanced analytics</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-success">✓</span>
                <span class="text-sm">Priority support</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-success">✓</span>
                <span class="text-sm">Custom integrations</span>
              </li>
            </ul>
          </ui-card-content>
          <ui-card-footer>
            <button class="btn btn-primary btn-block">Get Started</button>
          </ui-card-footer>
        </ui-card>
      </div>
    `,
  }),
};

// User profile card
export const UserProfileCard: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        UiCardComponent,
        UiCardHeaderComponent,
        UiCardContentComponent,
        UiCardFooterComponent,
      ],
    },
    template: `
      <div class="max-w-md">
        <ui-card>
          <ui-card-header>
            <div class="flex items-center gap-4">
              <div class="avatar">
                <div class="w-16 h-16 rounded-full bg-primary text-primary-content flex items-center justify-center text-2xl">
                  JD
                </div>
              </div>
              <div>
                <h3 class="font-semibold text-lg">John Doe</h3>
                <p class="text-sm text-base-content text-opacity-60">Product Designer</p>
              </div>
            </div>
          </ui-card-header>
          <ui-card-content>
            <div class="space-y-3">
              <div class="flex items-center gap-2 text-sm">
                <span class="text-base-content text-opacity-60">📧</span>
                <span>john.doe@example.com</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <span class="text-base-content text-opacity-60">📍</span>
                <span>San Francisco, CA</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <span class="text-base-content text-opacity-60">🔗</span>
                <a href="#" class="text-primary hover:underline">johndoe.com</a>
              </div>
            </div>
          </ui-card-content>
          <ui-card-footer>
            <div class="flex gap-2 w-full">
              <button class="btn btn-outline btn-sm flex-1">Message</button>
              <button class="btn btn-primary btn-sm flex-1">Follow</button>
            </div>
          </ui-card-footer>
        </ui-card>
      </div>
    `,
  }),
};

// Multiple cards showcase
export const MultipleCards: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        UiCardComponent,
        UiCardHeaderComponent,
        UiCardContentComponent,
        UiCardFooterComponent,
      ],
    },
    template: `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        <!-- Stats Card -->
        <ui-card>
          <ui-card-content>
            <div class="text-center">
              <div class="text-4xl font-bold text-primary mb-2">1,234</div>
              <div class="text-sm text-base-content text-opacity-60">Active Users</div>
              <div class="text-xs text-success mt-1">↑ 12% from last month</div>
            </div>
          </ui-card-content>
        </ui-card>

        <!-- Feature Card -->
        <ui-card>
          <ui-card-header>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-xl">
                🚀
              </div>
              <h3 class="font-semibold">Fast Performance</h3>
            </div>
          </ui-card-header>
          <ui-card-content>
            <p class="text-sm text-base-content text-opacity-70">
              Lightning-fast load times and optimized for all devices.
            </p>
          </ui-card-content>
        </ui-card>

        <!-- Action Card -->
        <ui-card>
          <ui-card-header>
            <h3 class="font-semibold">Quick Actions</h3>
          </ui-card-header>
          <ui-card-content>
            <div class="space-y-2">
              <button class="btn btn-ghost btn-sm btn-block justify-start">
                <span>📄</span> New Document
              </button>
              <button class="btn btn-ghost btn-sm btn-block justify-start">
                <span>📁</span> New Folder
              </button>
              <button class="btn btn-ghost btn-sm btn-block justify-start">
                <span>⬆️</span> Upload File
              </button>
            </div>
          </ui-card-content>
        </ui-card>
      </div>
    `,
  }),
};
