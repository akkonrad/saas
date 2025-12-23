import { z } from 'zod';

/**
 * Supabase User Schema
 * Represents the structure of a Supabase user entity
 */
export const SupabaseUserSchema = z.object({
  id: z.string().uuid(),
  aud: z.string(),
  role: z.string().optional(),
  email: z.string().email().optional(),
  email_confirmed_at: z.string().optional(),
  phone: z.string().optional(),
  confirmed_at: z.string().optional(),
  last_sign_in_at: z.string().optional(),
  app_metadata: z.record(z.string(), z.unknown()).optional(),
  user_metadata: z.record(z.string(), z.unknown()).optional(),
  identities: z.array(z.record(z.string(), z.unknown())).optional(),
  created_at: z.string(),
  updated_at: z.string().optional(),
});

export type SupabaseUser = z.infer<typeof SupabaseUserSchema>;

/**
 * JWT Payload Schema
 * Represents the decoded JWT token payload from Supabase
 */
export const JwtPayloadSchema = z.object({
  sub: z.string().uuid(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  app_metadata: z.record(z.string(), z.unknown()).optional(),
  user_metadata: z.record(z.string(), z.unknown()).optional(),
  role: z.string().optional(),
  aal: z.string().optional(),
  amr: z.array(z.record(z.string(), z.unknown())).optional(),
  session_id: z.string().optional(),
  iss: z.string().optional(),
  aud: z.string().or(z.array(z.string())).optional(),
  exp: z.number().optional(),
  iat: z.number().optional(),
  nbf: z.number().optional(),
});

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;

/**
 * Session Schema
 * Represents a Supabase authentication session
 */
export const SessionSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  expires_in: z.number(),
  expires_at: z.number().optional(),
  token_type: z.string(),
  user: SupabaseUserSchema,
});

export type Session = z.infer<typeof SessionSchema>;
