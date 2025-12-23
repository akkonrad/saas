import { Module } from '@nestjs/common';
import { SupabaseDatabaseService } from './supabase-database.service';

/**
 * Database module for Supabase
 * Provides database access utilities and base repository
 */
@Module({
  providers: [SupabaseDatabaseService],
  exports: [SupabaseDatabaseService],
})
export class SupabaseDatabaseModule {}
