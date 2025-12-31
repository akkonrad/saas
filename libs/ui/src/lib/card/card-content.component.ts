import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'ui-card-content',
  standalone: true,
  template: `
    <div [class]="contentClasses">
      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiCardContentComponent {
  /**
   * Custom CSS classes to apply to the content
   */
  customClass = input<string>('');

  protected get contentClasses(): string {
    const baseClasses = ['card-body', 'p-6'];

    if (this.customClass()) {
      baseClasses.push(this.customClass());
    }

    return baseClasses.join(' ');
  }
}
