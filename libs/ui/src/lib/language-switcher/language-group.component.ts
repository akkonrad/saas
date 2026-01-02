import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from '@angular/core';
import { Language } from './types';

@Component({
  selector: 'ui-language-group',
  standalone: true,
  template: `
    <div class="join" role="group" aria-label="Language selection">
      @for (lang of languages(); track lang.code) {
        <button
          type="button"
          class="join-item btn btn-sm"
          [class.btn-active]="lang.code === currentLanguage()"
          [class.btn-ghost]="lang.code !== currentLanguage()"
          [attr.aria-pressed]="lang.code === currentLanguage()"
          [attr.aria-label]="lang.label"
          (click)="selectLanguage(lang.code)"
        >
          @if (lang.flag) {
            <span class="text-base">{{ lang.flag }}</span>
          } @else {
            <span class="text-xs font-semibold uppercase">{{ lang.code }}</span>
          }
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiLanguageGroupComponent {
  languages = input.required<Language[]>();
  currentLanguage = input.required<string>();
  languageChange = output<string>();

  protected selectLanguage(code: string): void {
    if (code !== this.currentLanguage()) {
      this.languageChange.emit(code);
    }
  }
}
