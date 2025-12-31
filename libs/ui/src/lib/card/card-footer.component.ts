import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'ui-card-footer',
  standalone: true,
  template: `
    <div [class]="footerClasses">
      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiCardFooterComponent {
  /**
   * Custom CSS classes to apply to the footer
   */
  customClass = input<string>('');

  protected get footerClasses(): string {
    const baseClasses = ['card-footer', 'p-6', 'border-t', 'border-base-300'];

    if (this.customClass()) {
      baseClasses.push(this.customClass());
    }

    return baseClasses.join(' ');
  }
}
