import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'ui-card-header',
  standalone: true,
  template: `
    <div [class]="headerClasses">
      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiCardHeaderComponent {
  /**
   * Custom CSS classes to apply to the header
   */
  customClass = input<string>('');

  protected get headerClasses(): string {
    const baseClasses = ['card-header', 'p-6', 'border-b', 'border-base-300'];

    if (this.customClass()) {
      baseClasses.push(this.customClass());
    }

    return baseClasses.join(' ');
  }
}
