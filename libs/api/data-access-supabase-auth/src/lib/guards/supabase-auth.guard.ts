import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '@saas/api/data-access-supabase';
import { JwtPayloadSchema } from '@saas/shared/util-schema';

/**
 * Guard that verifies Supabase JWT authentication
 * Validates the Bearer token from Authorization header
 * and attaches the decoded user to the request
 */
@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(@Inject(SUPABASE_CLIENT) private supabase: SupabaseClient) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException('Missing access token');
    }

    try {
      // Verify the JWT token with Supabase
      const {
        data: { user },
        error,
      } = await this.supabase.auth.getUser(token);

      if (error || !user) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      // Validate and attach JWT payload to request
      const jwtPayload = JwtPayloadSchema.parse({
        sub: user.id,
        email: user.email,
        phone: user.phone,
        app_metadata: user.app_metadata,
        user_metadata: user.user_metadata,
        role: user.role,
      });

      // Attach user to request for use in decorators
      request.user = jwtPayload;
      request.supabaseUser = user;

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
