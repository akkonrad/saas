# @saas/api/data-access-supabase-auth

Authentication library for NestJS applications using Supabase. Provides guards and decorators for JWT-based authentication.

## Overview

This library provides:
- `SupabaseAuthGuard` - Route guard for JWT verification
- `@CurrentUser()` - Decorator to extract JWT payload
- `@CurrentSupabaseUser()` - Decorator to extract full Supabase user object
- Automatic user attachment to request context

## Installation

This library is already part of the monorepo. Import it in your NestJS application:

```typescript
import {
  SupabaseAuthGuard,
  CurrentUser,
  CurrentSupabaseUser
} from '@saas/api/data-access-supabase-auth';
```

## Quick Start

### 1. Import Module

```typescript
import { Module } from '@nestjs/common';
import { SupabaseAuthModule } from '@saas/api/data-access-supabase-auth';

@Module({
  imports: [SupabaseAuthModule],
})
export class AppModule {}
```

### 2. Protect Routes

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard, CurrentUser } from '@saas/api/data-access-supabase-auth';
import { JwtPayload } from '@saas/shared/util-schema';

@Controller('posts')
export class PostsController {
  @Get('my-posts')
  @UseGuards(SupabaseAuthGuard)
  getMyPosts(@CurrentUser() user: JwtPayload) {
    return { userId: user.sub, email: user.email };
  }
}
```

## API Reference

### SupabaseAuthGuard

Route guard that verifies Supabase JWT tokens from the Authorization header.

#### Usage

```typescript
@Get('protected')
@UseGuards(SupabaseAuthGuard)
async protectedRoute() {
  return { message: 'You are authenticated!' };
}
```

#### How It Works

1. Extracts `Bearer` token from `Authorization` header
2. Verifies token with Supabase
3. Validates JWT payload with Zod schema
4. Attaches user to request object
5. Throws `UnauthorizedException` if verification fails

### @CurrentUser() Decorator

Extracts the JWT payload from the request.

#### Usage

```typescript
@Get('profile')
@UseGuards(SupabaseAuthGuard)
getProfile(@CurrentUser() user: JwtPayload) {
  return {
    id: user.sub,
    email: user.email,
    role: user.role,
  };
}
```

#### Returns

`JwtPayload` object with fields:
- `sub` - User ID (UUID)
- `email` - User email (optional)
- `phone` - User phone (optional)
- `role` - User role (optional)
- `app_metadata` - App metadata (optional)
- `user_metadata` - User metadata (optional)

### @CurrentSupabaseUser() Decorator

Extracts the full Supabase user object from the request.

#### Usage

```typescript
@Get('full-profile')
@UseGuards(SupabaseAuthGuard)
getFullProfile(@CurrentSupabaseUser() user: SupabaseUser) {
  return {
    id: user.id,
    email: user.email,
    created_at: user.created_at,
    last_sign_in_at: user.last_sign_in_at,
  };
}
```

## Examples

### Basic Protected Route

```typescript
@Controller('api')
export class ApiController {
  @Get('protected')
  @UseGuards(SupabaseAuthGuard)
  protected() {
    return { message: 'This route is protected' };
  }
}
```

### Access User Information

```typescript
@Controller('users')
export class UsersController {
  @Get('me')
  @UseGuards(SupabaseAuthGuard)
  getCurrentUser(@CurrentUser() user: JwtPayload) {
    return {
      userId: user.sub,
      email: user.email,
      metadata: user.user_metadata,
    };
  }
}
```

### Use in Service

```typescript
@Injectable()
export class PostsService {
  async createPost(user: JwtPayload, data: CreatePostDto) {
    return this.db.posts.create({
      ...data,
      authorId: user.sub,
    });
  }
}

@Controller('posts')
export class PostsController {
  constructor(private posts: PostsService) {}

  @Post()
  @UseGuards(SupabaseAuthGuard)
  create(
    @CurrentUser() user: JwtPayload,
    @Body() data: CreatePostDto
  ) {
    return this.posts.createPost(user, data);
  }
}
```

### Global Guard (All Routes Protected)

```typescript
import { APP_GUARD } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: SupabaseAuthGuard,
    },
  ],
})
export class AppModule {}
```

Then use `@Public()` decorator for public routes (you'll need to implement this).

## Client-Side Usage

Send the Supabase JWT token in the Authorization header:

```typescript
// Angular example
const token = await supabase.auth.getSession();

this.http.get('/api/protected', {
  headers: {
    Authorization: `Bearer ${token.session.access_token}`
  }
});
```

```typescript
// Fetch API example
fetch('/api/protected', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

## Error Handling

The guard throws `UnauthorizedException` in these cases:
- Missing `Authorization` header
- Missing or invalid token
- Token verification fails
- User not found

```typescript
// Example error response
{
  "statusCode": 401,
  "message": "Invalid or expired token",
  "error": "Unauthorized"
}
```

## Testing

Mock the guard in your tests:

```typescript
describe('PostsController', () => {
  it('should return user posts', async () => {
    const mockGuard = {
      canActivate: jest.fn(() => true),
    };

    const module = await Test.createTestingModule({
      controllers: [PostsController],
    })
      .overrideGuard(SupabaseAuthGuard)
      .useValue(mockGuard)
      .compile();

    // Test your controller
  });
});
```

## Best Practices

1. **Always use with SupabaseModule** - Requires core Supabase module
2. **Validate token on every request** - Don't cache authentication state
3. **Use typed decorators** - Leverage `JwtPayload` and `SupabaseUser` types
4. **Handle errors gracefully** - Catch `UnauthorizedException` in filters
5. **Refresh tokens client-side** - Handle expired tokens in your frontend

## License

MIT
