# @saas/api/data-access-supabase

Core Supabase client library for NestJS applications. Provides a configurable Supabase client factory with support for both synchronous and asynchronous module initialization.

## Overview

This library provides:
- Dynamic NestJS module with flexible configuration
- Supabase client factory with service methods
- Support for service role (full permissions) and user-context clients
- Global module registration for easy access across your application

## Installation

This library is already part of the monorepo. Import it in your NestJS application:

```typescript
import { SupabaseModule, SupabaseService } from '@saas/api/data-access-supabase';
```

## Quick Start

### 1. Configure Environment Variables

```bash
# .env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SECRET_KEY=your-secret-key
```

### 2. Register Module (Async Configuration)

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SupabaseModule } from '@saas/api/data-access-supabase';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SupabaseModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        url: config.get('SUPABASE_URL'),
        publishableKey: config.get('SUPABASE_PUBLISHABLE_KEY'),
        secretKey: config.get('SUPABASE_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

### 3. Use in Your Services

```typescript
import { Injectable } from '@nestjs/common';
import { SupabaseService } from '@saas/api/data-access-supabase';

@Injectable()
export class MyService {
  constructor(private supabase: SupabaseService) {}

  async getUsers() {
    const client = this.supabase.getClient();
    const { data, error } = await client.from('users').select('*');
    return data;
  }
}
```

## API Reference

### SupabaseModule

Dynamic module for configuring Supabase client.

#### forRoot(config: SupabaseConfig)

Register module with synchronous configuration.

```typescript
SupabaseModule.forRoot({
  url: 'https://your-project.supabase.co',
  publishableKey: 'your-publishable-key',
  secretKey: 'your-secret-key',
})
```

#### forRootAsync(options: SupabaseAsyncOptions)

Register module with asynchronous configuration (recommended).

```typescript
SupabaseModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    url: configService.get('SUPABASE_URL'),
    publishableKey: configService.get('SUPABASE_PUBLISHABLE_KEY'),
    secretKey: configService.get('SUPABASE_SECRET_KEY'),
  }),
  inject: [ConfigService],
})
```

### SupabaseService

Service for creating and managing Supabase clients.

#### getClient(): SupabaseClient

Get the default Supabase client with secret key (full permissions).

```typescript
const client = this.supabase.getClient();
const { data } = await client.from('users').select('*');
```

#### createClient(): SupabaseClient

Create a new Supabase client with secret key.

```typescript
const client = this.supabase.createClient();
```

#### createClientWithToken(accessToken: string): SupabaseClient

Create a Supabase client for a specific user (respects RLS).

```typescript
const userClient = this.supabase.createClientWithToken(userJwt);
const { data } = await userClient.from('posts').select('*');
// Respects Row Level Security policies for this user
```

## Injection Tokens

You can inject the Supabase client directly using the provided tokens:

```typescript
import { Inject } from '@nestjs/common';
import { SUPABASE_CLIENT } from '@saas/api/data-access-supabase';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class MyService {
  constructor(
    @Inject(SUPABASE_CLIENT) private client: SupabaseClient
  ) {}
}
```

Available tokens:
- `SUPABASE_CLIENT` - The Supabase client instance
- `SUPABASE_CONFIG` - The configuration object

## Configuration

### SupabaseConfig Interface

```typescript
interface SupabaseConfig {
  url: string;           // Supabase project URL
  publishableKey: string; // Safe for client-side, respects RLS
  secretKey: string;     // Server-side only, full permissions
}
```

### Key Differences

- **Publishable Key**: Safe for client-side use, respects Row Level Security (RLS)
- **Secret Key**: Server-side only, bypasses RLS, full admin permissions

## Use Cases

### Admin Operations (Full Permissions)

```typescript
async deleteUser(userId: string) {
  const client = this.supabase.getClient(); // Uses secret key
  await client.from('users').delete().eq('id', userId);
}
```

### User-Specific Operations (Respects RLS)

```typescript
async getUserPosts(userToken: string) {
  const client = this.supabase.createClientWithToken(userToken);
  const { data } = await client.from('posts').select('*');
  // Only returns posts the user has access to via RLS
  return data;
}
```

## Best Practices

1. **Always use async configuration** with ConfigModule for environment variables
2. **Use secret key** (default client) for admin/service operations
3. **Use publishable key** with user tokens for user-specific operations that respect RLS
4. **Register as global module** (default) to avoid importing in every module
5. **Never expose secret key** to client-side code

## License

MIT
