import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SectionVariant = 'default' | 'muted';

@Component({
  selector: 'ui-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section.component.html',
  styleUrl: './section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSectionComponent {
  /**
   * Section variant
   * - default: Standard section with no background
   * - muted: Section with subtle background color and borders
   */
  variant = input<SectionVariant>('default');

  /**
   * Section ID for anchor links
   */
  id = input<string>();

  /**
   * Custom CSS classes to apply
   */
  customClass = input<string>('');

  /**
   * Generate section classes based on variant
   */
  protected get sectionClasses(): string {
    const baseClasses = ['py-20', 'md:py-28', 'lg:py-36'];

    if (this.variant() === 'muted') {
      baseClasses.push(
        'bg-base-200',
        'bg-opacity-20',
        'border-y',
        'border-base-300',
        'border-opacity-30'
      );
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
