import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message?: string;
  recaptchaToken: string;
}

export interface ContactFormResponse {
  success: boolean;
  message?: string;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);
  private apiUrl = environment.contactFunctionUrl;

  submitContactForm(data: ContactFormData): Observable<ContactFormResponse> {
    return this.http.post<ContactFormResponse>(this.apiUrl, data).pipe(
      catchError((error) => {
        console.error('Contact form submission error:', error);
        return of({
          success: false,
          error: error.error?.error || 'network_error',
        });
      })
    );
  }
}
