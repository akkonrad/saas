import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '@saas/api/data-access-supabase';

/**
 * Database service for direct Supabase database operations
 * Provides access to RPC functions and table queries
 */
@Injectable()
export class SupabaseDatabaseService {
  constructor(@Inject(SUPABASE_CLIENT) private supabase: SupabaseClient) {}

  /**
   * Call a Supabase Remote Procedure Call (RPC) function
   * @param functionName - Name of the RPC function
   * @param params - Parameters to pass to the function
   * @returns Result of the RPC call
   */
  async rpc<T>(functionName: string, params?: Record<string, unknown>): Promise<T> {
    const { data, error } = await this.supabase.rpc(functionName, params);

    if (error) {
      throw new Error(`RPC call failed: ${error.message}`);
    }

    return data as T;
  }

  /**
   * Get a table query builder for direct database access
   * @param tableName - Name of the table
   * @returns Supabase table query builder
   */
  getTable(tableName: string) {
    return this.supabase.from(tableName);
  }

  /**
   * Get the Supabase client instance
   * @returns Supabase client
   */
  getClient(): SupabaseClient {
    return this.supabase;
  }
}
