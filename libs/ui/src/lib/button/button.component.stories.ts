import type { Meta, StoryObj } from '@storybook/angular';
import { UiButtonComponent } from './button.component';
import { expect } from 'storybook/test';

const meta: Meta<UiButtonComponent> = {
  component: UiButtonComponent,
  title: 'UiButtonComponent',
};
export default meta;

type Story = StoryObj<UiButtonComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/button/gi)).toBeTruthy();
  },
};
