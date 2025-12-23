import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  RegisterSchema,
  LoginDto,
  LoginSchema,
  LoginPasswordlessDto,
  LoginPasswordlessSchema
} from './dto';
import { ZodValidationPipe } from './pipes/zod-validation.pipe';

/**
 * Authentication controller handling registration and login
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user
   * POST /auth/register
   */
  @Post('register')
  @UsePipes(new ZodValidationPipe(RegisterSchema))
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /**
   * Login with email and password
   * POST /auth/login
   */
  @Post('login')
  @UsePipes(new ZodValidationPipe(LoginSchema))
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /**
   * Send passwordless login email (magic link)
   * POST /auth/login-passwordless
   */
  @Post('login-passwordless')
  @UsePipes(new ZodValidationPipe(LoginPasswordlessSchema))
  async loginPasswordless(@Body() dto: LoginPasswordlessDto) {
    return this.authService.loginPasswordless(dto);
  }
}
