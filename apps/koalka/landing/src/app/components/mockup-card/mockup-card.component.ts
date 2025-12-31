import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowDiagramComponent } from '../flow-diagram/flow-diagram.component';

@Component({
  selector: 'app-mockup-card',
  standalone: true,
  imports: [CommonModule, FlowDiagramComponent],
  templateUrl: './mockup-card.component.html',
  styleUrl: './mockup-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MockupCardComponent {
  title = input.required<string>();
  description = input.required<string>();
  flowSteps = input.required<string[]>();
}
