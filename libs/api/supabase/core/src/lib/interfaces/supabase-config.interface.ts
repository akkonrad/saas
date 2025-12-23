/**
 * Supabase configuration interface
 */
export interface SupabaseConfig {
  /**
   * Supabase project URL
   */
  url: string;

  /**
   * Supabase publishable key (formerly "anon key")
   * Safe to use in client-side code, respects Row Level Security (RLS)
   */
  publishableKey: string;

  /**
   * Supabase secret key (formerly "service_role key")
   * Server-side only! Has full permissions, bypasses Row Level Security
   */
  secretKey: string;
}
