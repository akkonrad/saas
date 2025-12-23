import { z } from 'zod';

/**
 * Schema for passwordless login (magic link)
 */
export const LoginPasswordlessSchema = z.object({
  email: z.string().email('Invalid email address'),
  redirectTo: z.string().url('Invalid redirect URL').optional(),
});

export type LoginPasswordlessDto = z.infer<typeof LoginPasswordlessSchema>;
