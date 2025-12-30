import { Component, PLATFORM_ID, inject, signal, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UiButtonComponent } from '@ui';

type Theme = 'koalka-light' | 'koalka-dark';

@Component({
  imports: [RouterModule, UiButtonComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  protected title = 'koalka-landing';
  protected currentTheme = signal<Theme>('koalka-light');

  constructor() {
    // Initialize theme from localStorage or system preference (browser only)
    if (this.isBrowser) {
      const savedTheme = localStorage.getItem('koalka-theme') as Theme | null;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = savedTheme || (prefersDark ? 'koalka-dark' : 'koalka-light');
      this.currentTheme.set(initialTheme);

      // Apply theme to HTML element
      effect(() => {
        document.documentElement.setAttribute('data-theme', this.currentTheme());
      });
    }
  }

  protected toggleTheme(): void {
    if (!this.isBrowser) return;

    const newTheme: Theme = this.currentTheme() === 'koalka-light'
      ? 'koalka-dark'
      : 'koalka-light';

    this.currentTheme.set(newTheme);
    localStorage.setItem('koalka-theme', newTheme);
  }

  protected get isDark(): boolean {
    return this.currentTheme() === 'koalka-dark';
  }
}
