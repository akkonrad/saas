import { z } from 'zod';

// ============================================================================
// Contact Form Schemas
// ============================================================================

export const ContactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  message: z.string().optional(),
});

export const ContactFormRequestSchema = ContactFormSchema.extend({
  recaptchaToken: z.string().min(1, 'reCAPTCHA token is required'),
});

export const ContactFormResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  error: z.string().optional(),
});

// ============================================================================
// reCAPTCHA Verification Schema
// ============================================================================

export const RecaptchaVerifyResponseSchema = z.object({
  success: z.boolean(),
  challenge_ts: z.string().optional(),
  hostname: z.string().optional(),
  score: z.number().optional(),
  action: z.string().optional(),
  'error-codes': z.array(z.string()).optional(),
});

// ============================================================================
// TypeScript Types (inferred from schemas)
// ============================================================================

export type ContactForm = z.infer<typeof ContactFormSchema>;
export type ContactFormRequest = z.infer<typeof ContactFormRequestSchema>;
export type ContactFormResponse = z.infer<typeof ContactFormResponseSchema>;
export type RecaptchaVerifyResponse = z.infer<typeof RecaptchaVerifyResponseSchema>;
