import type { Meta, StoryObj } from '@storybook/angular';
import { UiCookieConsentComponent } from './cookie-consent.component';

const meta: Meta<UiCookieConsentComponent> = {
  title: 'Components/CookieConsent',
  component: UiCookieConsentComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    gaTrackingId: {
      control: 'text',
      description: 'Google Analytics Measurement ID (e.g., G-XXXXXXXXXX)',
    },
    message: {
      control: 'text',
      description: 'Main message displayed in the banner',
    },
    acceptButtonText: {
      control: 'text',
      description: 'Text for accept button',
    },
    rejectButtonText: {
      control: 'text',
      description: 'Text for reject button',
    },
    privacyPolicyUrl: {
      control: 'text',
      description: 'URL to privacy policy page',
    },
    privacyPolicyText: {
      control: 'text',
      description: 'Text for privacy policy link',
    },
    storageKey: {
      control: 'text',
      description: 'localStorage key for storing consent',
    },
  },
  decorators: [
    (story) => {
      // Clear localStorage for each story
      localStorage.removeItem('cookie-consent');
      return story();
    },
  ],
};

export default meta;
type Story = StoryObj<UiCookieConsentComponent>;

export const Default: Story = {
  args: {
    gaTrackingId: 'G-XXXXXXXXXX',
  },
};

export const CustomMessage: Story = {
  args: {
    gaTrackingId: 'G-XXXXXXXXXX',
    message:
      'We use cookies to analyze website traffic and optimize your experience. Your data helps us improve our services.',
    acceptButtonText: 'Accept',
    rejectButtonText: 'Decline',
  },
};

export const WithPrivacyPolicy: Story = {
  args: {
    gaTrackingId: 'G-XXXXXXXXXX',
    message: 'Ta strona używa plików cookie do analizy ruchu.',
    privacyPolicyUrl: 'https://example.com/privacy',
    privacyPolicyText: 'Dowiedz się więcej',
  },
};

export const EnglishVersion: Story = {
  args: {
    gaTrackingId: 'G-XXXXXXXXXX',
    message:
      'This website uses cookies for analytics (Google Analytics). Your data helps us improve our service.',
    acceptButtonText: 'Accept',
    rejectButtonText: 'Decline',
    privacyPolicyUrl: 'https://example.com/privacy',
    privacyPolicyText: 'Privacy Policy',
  },
};

export const MinimalMessage: Story = {
  args: {
    gaTrackingId: 'G-XXXXXXXXXX',
    message: 'Używamy cookies.',
    acceptButtonText: 'OK',
    rejectButtonText: 'Nie',
  },
};
