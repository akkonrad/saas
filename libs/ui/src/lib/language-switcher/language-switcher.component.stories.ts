import type { Meta, StoryObj } from '@storybook/angular';
import { signal } from '@angular/core';
import { UiLanguageSwitcherComponent } from './language-switcher.component';
import { Language } from './types';

const meta: Meta<UiLanguageSwitcherComponent> = {
  component: UiLanguageSwitcherComponent,
  title: 'UI/LanguageSwitcher',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['auto', 'toggle', 'toggle-switch', 'group', 'dropdown'],
      description:
        'Visual variant of the switcher. "auto" selects toggle-switch for 2 languages, dropdown for 3+',
    },
  },
};

export default meta;
type Story = StoryObj<UiLanguageSwitcherComponent>;

const twoLanguages: Language[] = [
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

const threeLanguages: Language[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

// Default (auto mode with 2 languages -> toggle-switch)
export const Default: Story = {
  render: () => {
    const currentLang = signal('pl');

    return {
      props: {
        languages: twoLanguages,
        currentLang,
        handleLanguageChange: (code: string) => {
          currentLang.set(code);
          console.log('Language changed to:', code);
        },
      },
      template: `
        <ui-language-switcher
          [languages]="languages"
          [currentLanguage]="currentLang()"
          (languageChange)="handleLanguageChange($event)"
        ></ui-language-switcher>
      `,
    };
  },
};

// Toggle variant (buttons)
export const Toggle: Story = {
  render: () => {
    const currentLang = signal('en');

    return {
      props: {
        languages: twoLanguages,
        currentLang,
        handleLanguageChange: (code: string) => {
          currentLang.set(code);
          console.log('Language changed to:', code);
        },
      },
      template: `
        <div class="p-4 space-y-4">
          <div class="flex items-center gap-4">
            <span class="text-base-content font-medium">Language Toggle (Buttons):</span>
            <ui-language-switcher
              [languages]="languages"
              [currentLanguage]="currentLang()"
              variant="toggle"
              (languageChange)="handleLanguageChange($event)"
            ></ui-language-switcher>
            <span class="text-base-content text-opacity-60">
              Current: {{ currentLang() }}
            </span>
          </div>
          <div class="card bg-base-200 p-4">
            <p class="text-base-content">
              The toggle (buttons) variant shows two buttons side by side.
              Click a button to switch language.
            </p>
          </div>
        </div>
      `,
    };
  },
};

// Toggle Switch variant (like theme toggle)
export const ToggleSwitch: Story = {
  render: () => {
    const currentLang = signal('en');

    return {
      props: {
        languages: twoLanguages,
        currentLang,
        handleLanguageChange: (code: string) => {
          currentLang.set(code);
          console.log('Language changed to:', code);
        },
      },
      template: `
        <div class="p-4 space-y-4">
          <div class="flex items-center gap-4">
            <span class="text-base-content font-medium">Language Toggle Switch:</span>
            <ui-language-switcher
              [languages]="languages"
              [currentLanguage]="currentLang()"
              variant="toggle-switch"
              (languageChange)="handleLanguageChange($event)"
            ></ui-language-switcher>
            <span class="text-base-content text-opacity-60">
              Current: {{ currentLang() }}
            </span>
          </div>
          <div class="card bg-base-200 p-4">
            <p class="text-base-content">
              The toggle-switch variant looks like the theme toggle.
              It's the default variant for 2 languages.
            </p>
          </div>
        </div>
      `,
    };
  },
};

// Group variant
export const Group: Story = {
  render: () => {
    const currentLang = signal('en');

    return {
      props: {
        languages: threeLanguages,
        currentLang,
        handleLanguageChange: (code: string) => {
          currentLang.set(code);
          console.log('Language changed to:', code);
        },
      },
      template: `
        <div class="p-4 space-y-4">
          <div class="flex items-center gap-4">
            <span class="text-base-content font-medium">Language Group:</span>
            <ui-language-switcher
              [languages]="languages"
              [currentLanguage]="currentLang()"
              variant="group"
              (languageChange)="handleLanguageChange($event)"
            ></ui-language-switcher>
            <span class="text-base-content text-opacity-60">
              Current: {{ currentLang() }}
            </span>
          </div>
          <div class="card bg-base-200 p-4">
            <p class="text-base-content">
              The group variant displays all languages as buttons in a row.
              Works well for 2-4 languages.
            </p>
          </div>
        </div>
      `,
    };
  },
};

// Dropdown variant
export const Dropdown: Story = {
  render: () => {
    const currentLang = signal('en');

    return {
      props: {
        languages: threeLanguages,
        currentLang,
        handleLanguageChange: (code: string) => {
          currentLang.set(code);
          console.log('Language changed to:', code);
        },
      },
      template: `
        <div class="p-4 space-y-4">
          <div class="flex items-center gap-4">
            <span class="text-base-content font-medium">Language Dropdown:</span>
            <ui-language-switcher
              [languages]="languages"
              [currentLanguage]="currentLang()"
              variant="dropdown"
              (languageChange)="handleLanguageChange($event)"
            ></ui-language-switcher>
            <span class="text-base-content text-opacity-60">
              Current: {{ currentLang() }}
            </span>
          </div>
          <div class="card bg-base-200 p-4">
            <p class="text-base-content">
              The dropdown variant is compact and works well for any number of languages.
              Click to open the menu.
            </p>
          </div>
        </div>
      `,
    };
  },
};

// In Header context
export const InHeader: Story = {
  render: () => {
    const currentLang = signal('pl');

    return {
      props: {
        languages: twoLanguages,
        currentLang,
        handleLanguageChange: (code: string) => {
          currentLang.set(code);
          console.log('Language changed to:', code);
        },
      },
      template: `
        <header class="navbar bg-base-100 shadow-lg">
          <div class="flex-1">
            <a class="btn btn-ghost text-xl">Logo</a>
          </div>
          <div class="flex-none gap-2">
            <ui-language-switcher
              [languages]="languages"
              [currentLanguage]="currentLang()"
              variant="toggle-switch"
              (languageChange)="handleLanguageChange($event)"
            ></ui-language-switcher>
            <button class="btn btn-primary">Sign In</button>
          </div>
        </header>
      `,
    };
  },
};

// Compare all variants
export const CompareVariants: Story = {
  render: () => {
    const currentLang = signal('en');

    return {
      props: {
        twoLanguages,
        threeLanguages,
        currentLang,
        handleLanguageChange: (code: string) => {
          currentLang.set(code);
          console.log('Language changed to:', code);
        },
      },
      template: `
        <div class="p-6 space-y-8">
          <div>
            <h3 class="text-lg font-semibold mb-3">Toggle Switch Variant (2 languages) - Default</h3>
            <ui-language-switcher
              [languages]="twoLanguages"
              [currentLanguage]="currentLang()"
              variant="toggle-switch"
              (languageChange)="handleLanguageChange($event)"
            ></ui-language-switcher>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-3">Toggle Buttons Variant (2 languages)</h3>
            <ui-language-switcher
              [languages]="twoLanguages"
              [currentLanguage]="currentLang()"
              variant="toggle"
              (languageChange)="handleLanguageChange($event)"
            ></ui-language-switcher>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-3">Group Variant (3 languages)</h3>
            <ui-language-switcher
              [languages]="threeLanguages"
              [currentLanguage]="currentLang()"
              variant="group"
              (languageChange)="handleLanguageChange($event)"
            ></ui-language-switcher>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-3">Dropdown Variant (3 languages)</h3>
            <ui-language-switcher
              [languages]="threeLanguages"
              [currentLanguage]="currentLang()"
              variant="dropdown"
              (languageChange)="handleLanguageChange($event)"
            ></ui-language-switcher>
          </div>

          <div class="text-base-content text-sm text-opacity-60">
            Current language: {{ currentLang() }}
          </div>
        </div>
      `,
    };
  },
};

// Without flags (code only)
export const WithoutFlags: Story = {
  render: () => {
    const currentLang = signal('en');
    const languagesNoFlags: Language[] = [
      { code: 'en', label: 'English' },
      { code: 'pl', label: 'Polski' },
    ];

    return {
      props: {
        languages: languagesNoFlags,
        currentLang,
        handleLanguageChange: (code: string) => {
          currentLang.set(code);
          console.log('Language changed to:', code);
        },
      },
      template: `
        <div class="p-4 space-y-4">
          <h3 class="text-lg font-semibold mb-3">Without Flags (uses language codes)</h3>
          <div class="flex items-center gap-8">
            <div>
              <p class="text-sm mb-2">Toggle:</p>
              <ui-language-switcher
                [languages]="languages"
                [currentLanguage]="currentLang()"
                variant="toggle"
                (languageChange)="handleLanguageChange($event)"
              ></ui-language-switcher>
            </div>
            <div>
              <p class="text-sm mb-2">Group:</p>
              <ui-language-switcher
                [languages]="languages"
                [currentLanguage]="currentLang()"
                variant="group"
                (languageChange)="handleLanguageChange($event)"
              ></ui-language-switcher>
            </div>
          </div>
        </div>
      `,
    };
  },
};
