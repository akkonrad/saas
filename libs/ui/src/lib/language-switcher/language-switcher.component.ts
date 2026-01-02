import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
} from '@angular/core';
import { Language, LanguageSwitcherVariant } from './types';
import { UiLanguageToggleComponent } from './language-toggle.component';
import { UiLanguageGroupComponent } from './language-group.component';
import { UiLanguageDropdownComponent } from './language-dropdown.component';

@Component({
  selector: 'ui-language-switcher',
  standalone: true,
  imports: [
    UiLanguageToggleComponent,
    UiLanguageGroupComponent,
    UiLanguageDropdownComponent,
  ],
  template: `
    @switch (effectiveVariant()) {
      @case ('toggle') {
        <ui-language-toggle
          [languages]="languages()"
          [currentLanguage]="currentLanguage()"
          variant="buttons"
          (languageChange)="onLanguageChange($event)"
        />
      }
      @case ('toggle-switch') {
        <ui-language-toggle
          [languages]="languages()"
          [currentLanguage]="currentLanguage()"
          variant="toggle-switch"
          (languageChange)="onLanguageChange($event)"
        />
      }
      @case ('group') {
        <ui-language-group
          [languages]="languages()"
          [currentLanguage]="currentLanguage()"
          (languageChange)="onLanguageChange($event)"
        />
      }
      @case ('dropdown') {
        <ui-language-dropdown
          [languages]="languages()"
          [currentLanguage]="currentLanguage()"
          (languageChange)="onLanguageChange($event)"
        />
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiLanguageSwitcherComponent {
  languages = input.required<Language[]>();
  currentLanguage = input.required<string>();
  variant = input<LanguageSwitcherVariant | 'auto'>('auto');
  languageChange = output<string>();

  protected effectiveVariant = computed<LanguageSwitcherVariant>(() => {
    const v = this.variant();
    if (v !== 'auto') return v;

    // Auto-select: toggle-switch for 2 languages, dropdown for 3+
    return this.languages().length === 2 ? 'toggle-switch' : 'dropdown';
  });

  protected onLanguageChange(code: string): void {
    this.languageChange.emit(code);
  }
}
