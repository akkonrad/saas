import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type Theme = 'light' | 'dark';
export type ThemeToggleVariant = 'buttons' | 'toggle-switch' | 'icon-button';

@Component({
  selector: 'ui-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiThemeToggleComponent {
  /**
   * Current theme
   */
  theme = input<Theme>('light');

  /**
   * Visual variant of the toggle
   */
  variant = input<ThemeToggleVariant>('buttons');

  /**
   * Theme change event
   */
  themeChange = output<Theme>();

  /**
   * Custom CSS classes to apply
   */
  customClass = input<string>('');

  /**
   * Internal theme state
   */
  protected currentTheme = signal<Theme>('light');

  constructor() {
    // Sync input with internal state
    effect(() => {
      this.currentTheme.set(this.theme());
    });
  }

  /**
   * Toggle theme
   */
  protected toggleTheme(newTheme: Theme): void {
    this.currentTheme.set(newTheme);
    this.themeChange.emit(newTheme);
  }

  /**
   * Get toggle button classes
   */
  protected get toggleClasses(): string {
    const baseClasses = ['join'];

    if (this.customClass()) {
      baseClasses.push(this.customClass());
    }

    return baseClasses.join(' ');
  }

  /**
   * Get button classes for a specific theme option
   */
  protected getButtonClasses(themeOption: Theme): string {
    const classes = ['join-item', 'btn', 'btn-sm'];

    if (this.currentTheme() === themeOption) {
      classes.push('btn-active');
    } else {
      classes.push('btn-ghost');
    }

    return classes.join(' ');
  }
}
