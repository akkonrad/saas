import { Module } from '@nestjs/common';
import { SupabaseStorageService } from './supabase-storage.service';

/**
 * Storage module for Supabase
 * Provides file storage operations
 */
@Module({
  providers: [SupabaseStorageService],
  exports: [SupabaseStorageService],
})
export class SupabaseStorageModule {}
