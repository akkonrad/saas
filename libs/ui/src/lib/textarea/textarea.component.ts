import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  forwardRef,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'ui-textarea',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiTextareaComponent),
      multi: true,
    },
  ],
})
export class UiTextareaComponent implements ControlValueAccessor {
  placeholder = input<string>('');
  disabled = input<boolean>(false);
  id = input<string>('');
  rows = input<number>(4);
  hasError = input<boolean>(false);
  customClass = input<string>('');

  valueChanged = output<string>();

  value = signal<string>('');

  // ControlValueAccessor implementation
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value.set(value || '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Handled via disabled input
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    const newValue = target.value;
    this.value.set(newValue);
    this.onChange(newValue);
    this.valueChanged.emit(newValue);
  }

  onBlur(): void {
    this.onTouched();
  }
}
