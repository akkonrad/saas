import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
  ElementRef,
  inject,
  HostListener,
} from '@angular/core';
import { Language } from './types';

@Component({
  selector: 'ui-language-dropdown',
  standalone: true,
  template: `
    <div class="relative">
      <button
        type="button"
        class="btn btn-ghost btn-sm gap-1"
        [attr.aria-expanded]="isOpen()"
        aria-haspopup="listbox"
        (click)="toggleDropdown()"
      >
        @if (currentLang(); as lang) {
          @if (lang.flag) {
            <span class="text-lg">{{ lang.flag }}</span>
          }
          <span class="text-xs font-semibold uppercase">{{ lang.code }}</span>
        }
        <svg
          class="h-3 w-3 transition-transform"
          [class.rotate-180]="isOpen()"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      @if (isOpen()) {
        <ul
          class="absolute right-0 top-full mt-2 menu bg-base-200 rounded-box z-[100] w-40 p-2 shadow-lg"
          role="listbox"
          [attr.aria-activedescendant]="'lang-' + currentLanguage()"
        >
          @for (lang of languages(); track lang.code) {
            <li>
              <button
                type="button"
                [id]="'lang-' + lang.code"
                role="option"
                [attr.aria-selected]="lang.code === currentLanguage()"
                class="flex items-center gap-2"
                [class.active]="lang.code === currentLanguage()"
                (click)="selectLanguage(lang.code)"
              >
                @if (lang.flag) {
                  <span class="text-lg">{{ lang.flag }}</span>
                }
                <span>{{ lang.label }}</span>
              </button>
            </li>
          }
        </ul>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiLanguageDropdownComponent {
  private elementRef = inject(ElementRef);

  languages = input.required<Language[]>();
  currentLanguage = input.required<string>();
  languageChange = output<string>();

  protected isOpen = signal(false);

  protected currentLang = computed(() =>
    this.languages().find((l) => l.code === this.currentLanguage())
  );

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  protected toggleDropdown(): void {
    this.isOpen.update((v) => !v);
  }

  protected selectLanguage(code: string): void {
    this.languageChange.emit(code);
    this.isOpen.set(false);
  }
}
