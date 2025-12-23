import { z } from 'zod';

/**
 * Schema for user registration
 */
export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(1, 'Full name is required').optional(),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
