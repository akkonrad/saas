import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UiInputComponent, UiTextareaComponent, UiLabelComponent, UiButtonComponent } from '@ui';
import { firstValueFrom } from 'rxjs';
import { RecaptchaService } from '../../services/recaptcha.service';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    UiInputComponent,
    UiTextareaComponent,
    UiLabelComponent,
    UiButtonComponent,
  ],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactFormComponent {
  private fb = new FormBuilder();
  private recaptchaService = inject(RecaptchaService);
  private contactService = inject(ContactService);

  contactForm: FormGroup;
  isSubmitting = signal(false);
  submitSuccess = signal(false);
  submitError = signal<string | null>(null);

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      company: [''],
      message: [''],
    });
  }

  get nameControl() {
    return this.contactForm.get('name');
  }

  get emailControl() {
    return this.contactForm.get('email');
  }

  get companyControl() {
    return this.contactForm.get('company');
  }

  get messageControl() {
    return this.contactForm.get('message');
  }

  hasError(fieldName: string): boolean {
    const control = this.contactForm.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }

  async onSubmit(): Promise<void> {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(null);

    try {
      const recaptchaToken = await this.recaptchaService.execute('contact_form');

      const formData = {
        ...this.contactForm.value,
        recaptchaToken,
      };

      const response = await firstValueFrom(
        this.contactService.submitContactForm(formData)
      );

      if (response.success) {
        this.submitSuccess.set(true);
        this.contactForm.reset();

        setTimeout(() => {
          this.submitSuccess.set(false);
        }, 5000);
      } else {
        this.submitError.set(response.error || 'submission_error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      this.submitError.set('network_error');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
