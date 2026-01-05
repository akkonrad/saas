# 003: OpenAPI/Swagger API Documentation

## Overview

Add OpenAPI/Swagger interactive documentation to the face-api NestJS application. The key challenge is integrating Zod schemas (used for validation) with OpenAPI spec generation, since NestJS Swagger typically works with class-validator decorators.

**Solution:** Use `@anatine/zod-nestjs` + `@anatine/zod-openapi` packages to bridge Zod and Swagger.

**Swagger UI will be served at:** `http://localhost:3020/api/docs`

## Environment Variables

```bash
# Optional - defaults shown
SWAGGER_ENABLED=true  # Set to 'false' in production to disable
```

---

## Tasks

### T1. Install Dependencies

**Status**: `pending`

**Description**:
Install NestJS Swagger and Zod-OpenAPI integration packages.

**Requirements**: None (can start immediately)

**Detailed Implementation**:

```bash
yarn add @nestjs/swagger swagger-ui-express @anatine/zod-nestjs @anatine/zod-openapi
yarn add -D @types/swagger-ui-express
```

**Artifacts**:
- `T1.dependencies`: Updated `package.json`

**Acceptance Criteria**:
- [ ] All packages installed
- [ ] No version conflicts

---

### T2. Create Auth Request DTOs with Swagger Support

**Status**: `pending`

**Description**:
Update existing Zod schemas to use `createZodDto` for Swagger compatibility and add OpenAPI metadata.

**Location**: `apps/faceless/api/src/auth/dto/`

**Requirements**: T1.dependencies

**Detailed Implementation**:

Update `apps/faceless/api/src/auth/dto/register.dto.ts`:
```typescript
import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const RegisterSchema = extendApi(
  z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    fullName: z.string().min(1, 'Full name is required').optional(),
  }),
  {
    description: 'User registration payload',
    example: {
      email: 'user@example.com',
      password: 'securepass123',
      fullName: 'John Doe'
    }
  }
);

export class RegisterDto extends createZodDto(RegisterSchema) {}
export type RegisterInput = z.infer<typeof RegisterSchema>;
```

Apply same pattern to:
- `apps/faceless/api/src/auth/dto/login.dto.ts`
- `apps/faceless/api/src/auth/dto/login-passwordless.dto.ts`

**Artifacts**:
- `T2.register-dto`: Updated register DTO
- `T2.login-dto`: Updated login DTO
- `T2.passwordless-dto`: Updated passwordless DTO

**Acceptance Criteria**:
- [ ] All DTOs extend `createZodDto`
- [ ] OpenAPI examples included
- [ ] Existing validation logic preserved

---

### T3. Create Auth Response DTOs

**Status**: `pending`

**Description**:
Create response DTOs for auth endpoints to document API responses.

**Location**: `apps/faceless/api/src/auth/dto/auth-response.dto.ts` (new file)

**Requirements**: T1.dependencies

**Detailed Implementation**:

```typescript
import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const AuthResponseSchema = extendApi(
  z.object({
    message: z.string(),
    user: z.object({
      id: z.string().uuid(),
      email: z.string().email().nullable(),
      created_at: z.string().datetime().optional(),
    }).nullable(),
    session: z.object({
      access_token: z.string(),
      refresh_token: z.string(),
      expires_in: z.number(),
    }).nullable(),
  }),
  {
    description: 'Authentication response with user and session data',
  }
);

export class AuthResponseDto extends createZodDto(AuthResponseSchema) {}

export const PasswordlessResponseSchema = extendApi(
  z.object({
    message: z.string(),
  }),
  {
    description: 'Passwordless login response',
    example: { message: 'Magic link sent to your email' }
  }
);

export class PasswordlessResponseDto extends createZodDto(PasswordlessResponseSchema) {}
```

Update `apps/faceless/api/src/auth/dto/index.ts` to export new DTOs.

**Artifacts**:
- `T3.auth-response-dtos`: New auth response DTOs file
- `T3.dto-index`: Updated DTO index exports

**Acceptance Criteria**:
- [ ] Response DTOs created for all auth endpoints
- [ ] DTOs exported from index

---

### T4. Create App Response DTOs

**Status**: `pending`

**Description**:
Create response DTOs for AppController endpoints.

**Location**: `apps/faceless/api/src/app/dto/app-response.dto.ts` (new file)

**Requirements**: T1.dependencies

**Detailed Implementation**:

```typescript
import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';
import { JwtPayloadSchema, SupabaseUserSchema } from '@saas/shared/util-schema';

export const HealthCheckResponseSchema = extendApi(
  z.object({
    message: z.string(),
  }),
  {
    description: 'API health check response',
    example: { message: 'Hello API' }
  }
);

export class HealthCheckResponseDto extends createZodDto(HealthCheckResponseSchema) {}

export const ProtectedResponseSchema = extendApi(
  z.object({
    message: z.string(),
    timestamp: z.string().datetime(),
  }),
  { description: 'Protected endpoint response' }
);

export class ProtectedResponseDto extends createZodDto(ProtectedResponseSchema) {}

export const CurrentUserResponseSchema = extendApi(
  z.object({
    message: z.string(),
    user: JwtPayloadSchema,
  }),
  { description: 'Current user JWT payload response' }
);

export class CurrentUserResponseDto extends createZodDto(CurrentUserResponseSchema) {}

export const FullUserResponseSchema = extendApi(
  z.object({
    message: z.string(),
    user: SupabaseUserSchema,
  }),
  { description: 'Full Supabase user response' }
);

export class FullUserResponseDto extends createZodDto(FullUserResponseSchema) {}
```

**Artifacts**:
- `T4.app-response-dtos`: New app response DTOs file

**Acceptance Criteria**:
- [ ] DTOs for all AppController endpoints
- [ ] Uses shared schemas from util-schema

---

### T5. Create Webhook Response DTO

**Status**: `pending`

**Description**:
Create response DTO for Stripe webhook controller.

**Location**: `libs/api/billing/stripe/src/lib/dto/webhook-response.dto.ts` (new file)

**Requirements**: T1.dependencies

**Detailed Implementation**:

```typescript
import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const WebhookHandlerResultSchema = extendApi(
  z.object({
    handled: z.boolean(),
    skipped: z.boolean(),
    eventId: z.string(),
    eventType: z.string(),
  }),
  {
    description: 'Stripe webhook handler result',
    example: {
      handled: true,
      skipped: false,
      eventId: 'evt_1234567890',
      eventType: 'customer.subscription.created'
    }
  }
);

export class WebhookHandlerResultDto extends createZodDto(WebhookHandlerResultSchema) {}
```

Update `libs/api/billing/stripe/src/index.ts` to export the DTO.

**Artifacts**:
- `T5.webhook-response-dto`: New webhook response DTO

**Acceptance Criteria**:
- [ ] DTO matches WebhookHandlerResult interface
- [ ] DTO exported from library index

---

### T6. Decorate AppController with Swagger

**Status**: `pending`

**Description**:
Add Swagger decorators to AppController for API documentation.

**Location**: `apps/faceless/api/src/app/app.controller.ts`

**Requirements**: T4.app-response-dtos

**Detailed Implementation**:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { SupabaseAuthGuard, CurrentUser, CurrentSupabaseUser } from '@saas/api/supabase-auth';
import { JwtPayload, SupabaseUser } from '@saas/shared/util-schema';
import {
  HealthCheckResponseDto,
  ProtectedResponseDto,
  CurrentUserResponseDto,
  FullUserResponseDto
} from './dto/app-response.dto';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health check', description: 'Returns API status' })
  @ApiResponse({ status: 200, description: 'API is healthy', type: HealthCheckResponseDto })
  getData() {
    return this.appService.getData();
  }

  @Get('protected')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Protected endpoint', description: 'Requires JWT authentication' })
  @ApiResponse({ status: 200, description: 'Access granted', type: ProtectedResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing JWT token' })
  getProtected() {
    return {
      message: 'You have access to this protected route!',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('me')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user', description: 'Returns JWT payload of authenticated user' })
  @ApiResponse({ status: 200, description: 'Current user info', type: CurrentUserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing JWT token' })
  getCurrentUser(@CurrentUser() user: JwtPayload) {
    return { message: 'Current user information', user };
  }

  @Get('me/full')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get full user profile', description: 'Returns complete Supabase user object' })
  @ApiResponse({ status: 200, description: 'Full user info', type: FullUserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing JWT token' })
  getFullUser(@CurrentSupabaseUser() user: SupabaseUser) {
    return { message: 'Full Supabase user information', user };
  }
}
```

**Artifacts**:
- `T6.app-controller`: Decorated AppController

**Acceptance Criteria**:
- [ ] All endpoints have @ApiOperation
- [ ] All endpoints have @ApiResponse with type
- [ ] Protected endpoints have @ApiBearerAuth
- [ ] Error responses documented

---

### T7. Decorate AuthController with Swagger

**Status**: `pending`

**Description**:
Add Swagger decorators to AuthController.

**Location**: `apps/faceless/api/src/auth/auth.controller.ts`

**Requirements**: T2.auth-request-dtos, T3.auth-response-dtos

**Detailed Implementation**:

```typescript
import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiBadRequestResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  RegisterSchema,
  LoginDto,
  LoginSchema,
  LoginPasswordlessDto,
  LoginPasswordlessSchema,
  AuthResponseDto,
  PasswordlessResponseDto,
} from './dto';
import { ZodValidationPipe } from './pipes/zod-validation.pipe';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(RegisterSchema))
  @ApiOperation({ summary: 'Register new user', description: 'Creates a new user account with email and password' })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({ description: 'User registered successfully', type: AuthResponseDto })
  @ApiBadRequestResponse({ description: 'Validation error or email already exists' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(LoginSchema))
  @ApiOperation({ summary: 'Login', description: 'Authenticate with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful', type: AuthResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('login-passwordless')
  @UsePipes(new ZodValidationPipe(LoginPasswordlessSchema))
  @ApiOperation({ summary: 'Passwordless login', description: 'Send magic link to email' })
  @ApiBody({ type: LoginPasswordlessDto })
  @ApiResponse({ status: 200, description: 'Magic link sent', type: PasswordlessResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid email' })
  async loginPasswordless(@Body() dto: LoginPasswordlessDto) {
    return this.authService.loginPasswordless(dto);
  }
}
```

**Artifacts**:
- `T7.auth-controller`: Decorated AuthController

**Acceptance Criteria**:
- [ ] All endpoints documented
- [ ] Request bodies documented with @ApiBody
- [ ] Success and error responses documented

---

### T8. Decorate StripeWebhookController with Swagger

**Status**: `pending`

**Description**:
Add Swagger decorators to StripeWebhookController.

**Location**: `libs/api/billing/stripe/src/lib/controllers/stripe-webhook.controller.ts`

**Requirements**: T5.webhook-response-dto

**Detailed Implementation**:

```typescript
import {
  Controller,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiBadRequestResponse } from '@nestjs/swagger';
import Stripe from 'stripe';
import { StripeWebhookGuard } from '../guards/stripe-webhook.guard';
import { StripeEvent } from '../decorators/stripe-event.decorator';
import {
  StripeWebhookService,
  WebhookHandlerResult,
} from '../services/stripe-webhook.service';
import { WebhookHandlerResultDto } from '../dto/webhook-response.dto';

@ApiTags('Webhooks')
@Controller('webhooks/stripe')
export class StripeWebhookController {
  private readonly logger = new Logger(StripeWebhookController.name);

  constructor(private readonly webhookService: StripeWebhookService) {}

  @Post()
  @UseGuards(StripeWebhookGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Handle Stripe webhook',
    description: 'Receives and processes Stripe webhook events. Called by Stripe, not end users.'
  })
  @ApiHeader({ name: 'stripe-signature', description: 'Stripe webhook signature', required: true })
  @ApiResponse({ status: 200, description: 'Webhook processed', type: WebhookHandlerResultDto })
  @ApiBadRequestResponse({ description: 'Invalid signature or payload' })
  async handleWebhook(
    @StripeEvent() event: Stripe.Event
  ): Promise<WebhookHandlerResult> {
    this.logger.log(`Received webhook: ${event.type} (${event.id})`);
    return this.webhookService.handleEvent(event);
  }
}
```

**Artifacts**:
- `T8.webhook-controller`: Decorated StripeWebhookController

**Acceptance Criteria**:
- [ ] Endpoint documented
- [ ] Stripe-signature header documented
- [ ] Response type documented

---

### T9. Configure Swagger in main.ts

**Status**: `pending`

**Description**:
Set up Swagger document builder and UI in application bootstrap.

**Location**: `apps/faceless/api/src/main.ts`

**Requirements**: T6.app-controller, T7.auth-controller, T8.webhook-controller

**Detailed Implementation**:

```typescript
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestjsSwagger } from '@anatine/zod-nestjs';
import * as express from 'express';
import { AppModule } from './app/app.module';

async function bootstrap() {
  // Patch Swagger to work with Zod DTOs - must be called before app creation
  patchNestjsSwagger();

  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';

  // Raw body parsing for Stripe webhooks (must be before other middleware)
  app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));

  app.setGlobalPrefix(globalPrefix);

  // Swagger Configuration (only in non-production or when explicitly enabled)
  if (process.env.SWAGGER_ENABLED !== 'false') {
    const config = new DocumentBuilder()
      .setTitle('Faceless API')
      .setDescription('API documentation for the Faceless application')
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Supabase JWT access token',
        },
        'bearer'
      )
      .addServer(`http://localhost:${process.env.PORT || 3020}`, 'Local Development')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    Logger.log(`Swagger docs available at: http://localhost:${process.env.PORT || 3020}/api/docs`);
  }

  const port = process.env.PORT || 3020;
  await app.listen(port);
  Logger.log(`Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
```

**Artifacts**:
- `T9.main-ts`: Updated main.ts with Swagger setup

**Acceptance Criteria**:
- [ ] `patchNestjsSwagger()` called before app creation
- [ ] Swagger UI served at `/api/docs`
- [ ] Bearer auth configured for JWT
- [ ] Environment toggle works (SWAGGER_ENABLED)
- [ ] `persistAuthorization` enabled for better UX

---

## Critical Files

| File | Action | Description |
|------|--------|-------------|
| `package.json` | Modify | Add Swagger dependencies |
| `apps/faceless/api/src/main.ts` | Modify | Bootstrap Swagger |
| `apps/faceless/api/src/app/app.controller.ts` | Modify | Add decorators |
| `apps/faceless/api/src/auth/auth.controller.ts` | Modify | Add decorators |
| `apps/faceless/api/src/auth/dto/register.dto.ts` | Modify | Convert to class DTO |
| `apps/faceless/api/src/auth/dto/login.dto.ts` | Modify | Convert to class DTO |
| `apps/faceless/api/src/auth/dto/login-passwordless.dto.ts` | Modify | Convert to class DTO |
| `apps/faceless/api/src/auth/dto/auth-response.dto.ts` | Create | Response DTOs |
| `apps/faceless/api/src/app/dto/app-response.dto.ts` | Create | Response DTOs |
| `libs/api/billing/stripe/src/lib/controllers/stripe-webhook.controller.ts` | Modify | Add decorators |
| `libs/api/billing/stripe/src/lib/dto/webhook-response.dto.ts` | Create | Response DTO |

---

## Dependency Graph

```
T1 (Install deps)
 ├─> T2 (Auth request DTOs)  ─┐
 ├─> T3 (Auth response DTOs) ─┼─> T7 (Auth controller)
 ├─> T4 (App response DTOs)  ─────> T6 (App controller)  ─┐
 └─> T5 (Webhook response)   ─────> T8 (Webhook ctrl)    ─┼─> T9 (main.ts)
```

## Parallel Execution Groups

**Group 1** (can start immediately):
- T1 (Install dependencies)

**Group 2** (after T1):
- T2 (Auth request DTOs)
- T3 (Auth response DTOs)
- T4 (App response DTOs)
- T5 (Webhook response DTO)

**Group 3** (after Group 2):
- T6 (App controller) - needs T4
- T7 (Auth controller) - needs T2, T3
- T8 (Webhook controller) - needs T5

**Group 4** (after Group 3):
- T9 (main.ts) - needs T6, T7, T8

## Critical Path

`T1 → T2/T3 → T7 → T9`
