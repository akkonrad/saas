import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-flow-diagram',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flow-diagram.component.html',
  styleUrl: './flow-diagram.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowDiagramComponent {
  steps = input.required<string[]>();
}
