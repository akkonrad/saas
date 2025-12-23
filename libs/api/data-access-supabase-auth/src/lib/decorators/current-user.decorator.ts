import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload, SupabaseUser } from '@saas/shared/util-schema';

/**
 * Decorator to extract the current JWT payload from the request
 * Must be used with SupabaseAuthGuard
 * @example
 * @Get('profile')
 * @UseGuards(SupabaseAuthGuard)
 * async getProfile(@CurrentUser() user: JwtPayload) {
 *   return user;
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);

/**
 * Decorator to extract the full Supabase user from the request
 * Must be used with SupabaseAuthGuard
 * @example
 * @Get('profile')
 * @UseGuards(SupabaseAuthGuard)
 * async getProfile(@CurrentSupabaseUser() user: SupabaseUser) {
 *   return user;
 * }
 */
export const CurrentSupabaseUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): SupabaseUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.supabaseUser;
  }
);
