import { Module } from '@nestjs/common';
import { SupabaseModule } from '@saas/api/supabase-core';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

/**
 * Authentication module
 * Handles user registration and login
 */
@Module({
  imports: [SupabaseModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
