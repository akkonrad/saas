export interface Language {
  code: string;
  label: string;
  flag?: string;
}

export type LanguageSwitcherVariant = 'toggle' | 'toggle-switch' | 'group' | 'dropdown';
