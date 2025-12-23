import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '@saas/api/supabase-core';

/**
 * Query options for pagination and filtering
 */
export interface QueryOptions {
  /**
   * Number of records to return
   */
  limit?: number;
  /**
   * Number of records to skip
   */
  offset?: number;
  /**
   * Column to order by
   */
  orderBy?: string;
  /**
   * Order direction (ascending or descending)
   */
  ascending?: boolean;
}

/**
 * Abstract base repository for database operations
 * Provides common CRUD operations for Supabase tables
 * @template T - Entity type
 */
@Injectable()
export abstract class BaseRepository<T> {
  protected abstract tableName: string;

  constructor(@Inject(SUPABASE_CLIENT) protected supabase: SupabaseClient) {}

  /**
   * Find all records in the table
   * @param options - Query options for pagination and ordering
   * @returns Array of entities
   */
  async findAll(options?: QueryOptions): Promise<T[]> {
    let query = this.supabase.from(this.tableName).select('*');

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(
        options.offset,
        options.offset + (options.limit || 10) - 1
      );
    }

    if (options?.orderBy) {
      query = query.order(options.orderBy, {
        ascending: options.ascending ?? true,
      });
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch records: ${error.message}`);
    }

    return (data as T[]) || [];
  }

  /**
   * Find a single record by ID
   * @param id - Record ID
   * @returns Entity or null if not found
   */
  async findById(id: string): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch record: ${error.message}`);
    }

    return data as T;
  }

  /**
   * Find a single record by criteria
   * @param criteria - Query criteria as key-value pairs
   * @returns Entity or null if not found
   */
  async findOne(criteria: Partial<T>): Promise<T | null> {
    let query = this.supabase.from(this.tableName).select('*');

    // Apply each criterion as an eq filter
    Object.entries(criteria).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    const { data, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch record: ${error.message}`);
    }

    return data as T;
  }

  /**
   * Create a new record
   * @param data - Data to insert
   * @returns Created entity
   */
  async create(data: Partial<T>): Promise<T> {
    const { data: created, error } = await this.supabase
      .from(this.tableName)
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create record: ${error.message}`);
    }

    return created as T;
  }

  /**
   * Update a record by ID
   * @param id - Record ID
   * @param data - Data to update
   * @returns Updated entity
   */
  async update(id: string, data: Partial<T>): Promise<T> {
    const { data: updated, error } = await this.supabase
      .from(this.tableName)
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update record: ${error.message}`);
    }

    return updated as T;
  }

  /**
   * Delete a record by ID
   * @param id - Record ID
   * @returns true if deleted successfully
   */
  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete record: ${error.message}`);
    }

    return true;
  }

  /**
   * Count records in the table
   * @param criteria - Optional filter criteria
   * @returns Number of records
   */
  async count(criteria?: Partial<T>): Promise<number> {
    let query = this.supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true });

    if (criteria) {
      Object.entries(criteria).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    const { count, error } = await query;

    if (error) {
      throw new Error(`Failed to count records: ${error.message}`);
    }

    return count || 0;
  }
}
