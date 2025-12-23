import { Module } from '@nestjs/common';
import { SupabaseAuthGuard } from './guards';

/**
 * Authentication module for Supabase
 * Provides guards and decorators for JWT-based authentication
 */
@Module({
  providers: [SupabaseAuthGuard],
  exports: [SupabaseAuthGuard],
})
export class SupabaseAuthModule {}
