import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'neutral' | 'ghost' | 'link';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiButtonComponent {
  /**
   * Button variant using DaisyUI theme colors
   * These automatically adapt to the active theme
   */
  variant = input<ButtonVariant>('primary');

  /**
   * Button size
   */
  size = input<ButtonSize>('md');

  /**
   * Disabled state
   */
  disabled = input<boolean>(false);

  /**
   * Loading state (shows spinner)
   */
  loading = input<boolean>(false);

  /**
   * Full width button
   */
  block = input<boolean>(false);

  /**
   * Outlined style
   */
  outline = input<boolean>(false);

  /**
   * Wide button (extra padding)
   */
  wide = input<boolean>(false);

  /**
   * Click event
   */
  clicked = output<MouseEvent>();

  /**
   * Generate DaisyUI classes based on inputs
   */
  protected get buttonClasses(): string {
    const classes = ['btn'];

    // Variant classes (use DaisyUI theme colors)
    if (this.variant() !== 'neutral') {
      classes.push(`btn-${this.variant()}`);
    }

    // Size classes
    if (this.size() !== 'md') {
      classes.push(`btn-${this.size()}`);
    }

    // Modifier classes
    if (this.outline()) {
      classes.push('btn-outline');
    }

    if (this.wide()) {
      classes.push('btn-wide');
    }

    if (this.block()) {
      classes.push('btn-block');
    }

    if (this.loading()) {
      classes.push('loading loading-spinner');
    }

    return classes.join(' ');
  }

  protected handleClick(event: MouseEvent): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit(event);
    }
  }
}
