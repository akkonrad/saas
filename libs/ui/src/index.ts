// Export components
export * from './lib/button/button.component';
export * from './lib/card/card.component';
export * from './lib/card/card-header.component';
export * from './lib/card/card-content.component';
export * from './lib/card/card-footer.component';
export * from './lib/section/section.component';
export * from './lib/theme-toggle/theme-toggle.component';
export * from './lib/header/header.component';
export * from './lib/input/input.component';
export * from './lib/textarea/textarea.component';
export * from './lib/label/label.component';
export * from './lib/language-switcher/language-switcher.component';
export * from './lib/language-switcher/language-toggle.component';
export * from './lib/language-switcher/language-group.component';
export * from './lib/language-switcher/language-dropdown.component';

// Export types
export type { ButtonVariant, ButtonSize } from './lib/button/button.component';
export type { SectionVariant } from './lib/section/section.component';
export type {
  Theme,
  ThemeToggleVariant,
} from './lib/theme-toggle/theme-toggle.component';
export type {
  Language,
  LanguageSwitcherVariant,
} from './lib/language-switcher/types';
export type { LanguageToggleVariant } from './lib/language-switcher/language-toggle.component';
