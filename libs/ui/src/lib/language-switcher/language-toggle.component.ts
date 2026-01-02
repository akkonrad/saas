import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
} from '@angular/core';
import { Language } from './types';

export type LanguageToggleVariant = 'buttons' | 'toggle-switch';

@Component({
  selector: 'ui-language-toggle',
  standalone: true,
  template: `
    @if (variant() === 'toggle-switch') {
      <!-- Toggle switch variant (like theme toggle) -->
      <label class="toggle text-base-content">
        <input
          type="checkbox"
          [checked]="isSecondLanguage()"
          (change)="toggle()"
          [attr.aria-label]="ariaLabel()"
        />
        @if (firstLanguage(); as lang) {
          <span class="lang-flag" [attr.aria-label]="lang.label">
            {{ lang.flag || lang.code.toUpperCase() }}
          </span>
        }
        @if (secondLanguage(); as lang) {
          <span class="lang-flag" [attr.aria-label]="lang.label">
            {{ lang.flag || lang.code.toUpperCase() }}
          </span>
        }
      </label>
    } @else {
      <!-- Buttons variant (default) -->
      <div class="join bg-base-200 rounded-lg" role="group" [attr.aria-label]="ariaLabel()">
        @if (firstLanguage(); as lang) {
          <button
            type="button"
            class="join-item btn btn-sm border-0"
            [class.bg-base-100]="!isSecondLanguage()"
            [class.bg-transparent]="isSecondLanguage()"
            [attr.aria-pressed]="!isSecondLanguage()"
            [attr.aria-label]="lang.label"
            (click)="selectLanguage(lang.code)"
          >
            @if (lang.flag) {
              <span class="text-xl leading-none">{{ lang.flag }}</span>
            } @else {
              <span class="text-xs font-semibold uppercase">{{ lang.code }}</span>
            }
          </button>
        }
        @if (secondLanguage(); as lang) {
          <button
            type="button"
            class="join-item btn btn-sm border-0"
            [class.bg-base-100]="isSecondLanguage()"
            [class.bg-transparent]="!isSecondLanguage()"
            [attr.aria-pressed]="isSecondLanguage()"
            [attr.aria-label]="lang.label"
            (click)="selectLanguage(lang.code)"
          >
            @if (lang.flag) {
              <span class="text-xl leading-none">{{ lang.flag }}</span>
            } @else {
              <span class="text-xs font-semibold uppercase">{{ lang.code }}</span>
            }
          </button>
        }
      </div>
    }
  `,
  styles: `
    .lang-flag {
      font-size: 1rem;
      line-height: 1;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiLanguageToggleComponent {
  languages = input.required<Language[]>();
  currentLanguage = input.required<string>();
  variant = input<LanguageToggleVariant>('buttons');
  languageChange = output<string>();

  protected firstLanguage = computed(() => this.languages()[0]);
  protected secondLanguage = computed(() => this.languages()[1]);

  protected isSecondLanguage = computed(
    () => this.currentLanguage() === this.secondLanguage()?.code
  );

  protected ariaLabel = computed(() => {
    const current = this.languages().find(
      (l) => l.code === this.currentLanguage()
    );
    const other = this.languages().find(
      (l) => l.code !== this.currentLanguage()
    );
    return `Current: ${current?.label}. Switch to ${other?.label}`;
  });

  protected toggle(): void {
    const newLang = this.isSecondLanguage()
      ? this.firstLanguage()?.code
      : this.secondLanguage()?.code;
    if (newLang) {
      this.languageChange.emit(newLang);
    }
  }

  protected selectLanguage(code: string): void {
    if (code !== this.currentLanguage()) {
      this.languageChange.emit(code);
    }
  }
}
