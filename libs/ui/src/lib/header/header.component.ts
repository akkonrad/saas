import {
  Component,
  ChangeDetectionStrategy,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiHeaderComponent {
  /**
   * Fixed position at the top
   */
  fixed = input<boolean>(true);

  /**
   * Custom CSS classes to apply
   */
  customClass = input<string>('');

  /**
   * Mobile menu open state
   */
  protected mobileMenuOpen = signal(false);

  /**
   * Toggle mobile menu
   */
  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.update((value) => !value);
  }

  /**
   * Close mobile menu
   */
  protected closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  /**
   * Generate header classes
   */
  protected get headerClasses(): string {
    const baseClasses = [
      'navbar',
      'bg-base-100',
      'bg-opacity-60',
      'backdrop-blur-2xl',
      'border-b',
      'border-base-300',
      'border-opacity-10',
      'shadow-sm',
      'z-50',
    ];

    if (this.fixed()) {
      baseClasses.push('fixed', 'top-0', 'left-0', 'right-0');
    }

    if (this.customClass()) {
      baseClasses.push(this.customClass());
    }

    return baseClasses.join(' ');
  }

  /**
   * Container classes
   */
  protected get containerClasses(): string {
    return 'container mx-auto px-4 md:px-6';
  }
}
