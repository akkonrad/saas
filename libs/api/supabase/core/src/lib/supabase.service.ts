import { Injectable, Inject } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from './supabase.constants';
import { SupabaseConfig } from './interfaces';

/**
 * Supabase service for creating and managing Supabase clients
 */
@Injectable()
export class SupabaseService {
  private client: SupabaseClient;

  constructor(@Inject(SUPABASE_CONFIG) private config: SupabaseConfig) {
    this.client = this.createClient();
  }

  /**
   * Creates a new Supabase client with secret key (full permissions)
   * @returns Supabase client instance
   */
  createClient(): SupabaseClient {
    return createClient(this.config.url, this.config.secretKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  /**
   * Gets the default Supabase client instance
   * @returns Supabase client instance
   */
  getClient(): SupabaseClient {
    return this.client;
  }

  /**
   * Creates a Supabase client with a specific access token
   * Useful for performing operations on behalf of a specific user
   * Uses publishable key to respect Row Level Security
   * @param accessToken - User's access token
   * @returns Supabase client instance with user context
   */
  createClientWithToken(accessToken: string): SupabaseClient {
    return createClient(this.config.url, this.config.publishableKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
}
