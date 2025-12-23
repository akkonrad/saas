import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { SupabaseAuthGuard, CurrentUser, CurrentSupabaseUser } from '@saas/api/supabase-auth';
import { JwtPayload, SupabaseUser } from '@saas/shared/util-schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  /**
   * Protected endpoint that requires authentication
   * Returns a message confirming access
   */
  @Get('protected')
  @UseGuards(SupabaseAuthGuard)
  getProtected() {
    return {
      message: 'You have access to this protected route!',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Returns the current user's JWT payload
   * Demonstrates using the @CurrentUser decorator
   */
  @Get('me')
  @UseGuards(SupabaseAuthGuard)
  getCurrentUser(@CurrentUser() user: JwtPayload) {
    return {
      message: 'Current user information',
      user,
    };
  }

  /**
   * Returns the full Supabase user object
   * Demonstrates using the @CurrentSupabaseUser decorator
   */
  @Get('me/full')
  @UseGuards(SupabaseAuthGuard)
  getFullUser(@CurrentSupabaseUser() user: SupabaseUser) {
    return {
      message: 'Full Supabase user information',
      user,
    };
  }
}
