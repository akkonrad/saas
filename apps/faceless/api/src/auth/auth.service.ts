import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '@saas/api/supabase-core';
import { RegisterDto, LoginDto, LoginPasswordlessDto } from './dto';

/**
 * Authentication service handling user registration and login
 */
@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Register a new user with email and password
   */
  async register(dto: RegisterDto) {
    const client = this.supabaseService.getClient();

    const { data, error } = await client.auth.signUp({
      email: dto.email,
      password: dto.password,
      options: {
        data: {
          full_name: dto.fullName,
        },
      },
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      message: 'Registration successful. Please check your email for verification.',
      user: data.user,
      session: data.session,
    };
  }

  /**
   * Login with email and password
   */
  async login(dto: LoginDto) {
    const client = this.supabaseService.getClient();

    const { data, error } = await client.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (error) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      message: 'Login successful',
      user: data.user,
      session: data.session,
      accessToken: data.session?.access_token,
      refreshToken: data.session?.refresh_token,
    };
  }

  /**
   * Send passwordless login email (magic link)
   */
  async loginPasswordless(dto: LoginPasswordlessDto) {
    const client = this.supabaseService.getClient();

    const { data, error } = await client.auth.signInWithOtp({
      email: dto.email,
      options: {
        emailRedirectTo: dto.redirectTo,
      },
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      message: 'Magic link sent successfully. Please check your email.',
      data,
    };
  }
}
