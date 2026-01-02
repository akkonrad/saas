import { Component, ChangeDetectionStrategy, input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

export type IconType = 'clipboard' | 'envelope' | 'box' | 'database' | 'check' | 'cog' | 'handshake' | 'target' | 'link' | 'plug' | 'muscle';

@Component({
  selector: 'app-feature-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feature-card.component.html',
  styleUrl: './feature-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class FeatureCardComponent {
  icon = input<string>();
  iconType = input<IconType>();
  title = input.required<string>();
  description = input.required<string>();
}
