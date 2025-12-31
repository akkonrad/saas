import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'ui-card',
  standalone: true,
  template: `
    <div [class]="cardClasses">
      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiCardComponent {
  /**
   * Custom CSS classes to apply to the card
   */
  customClass = input<string>('');

  /**
   * Generate card classes
   */
  protected get cardClasses(): string {
    const baseClasses = [
      'card',
      'bg-base-100',
      'shadow-xl',
      'border',
      'border-base-300',
      'rounded-2xl',
      'overflow-hidden',
    ];

    if (this.customClass()) {
      baseClasses.push(this.customClass());
    }

    return baseClasses.join(' ');
  }
}
