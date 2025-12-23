# @saas/shared/util-schema

Shared Zod schemas and TypeScript types for the SaaS platform. This library serves as the single source of truth for data contracts between frontend and backend.

## Overview

This library provides validated schemas using Zod for:
- Authentication entities (users, JWT tokens, sessions)
- Database entities (to be added as needed)
- Shared DTOs and types

## Installation

This library is already part of the monorepo. Import it in any project:

```typescript
import { SupabaseUser, JwtPayload, Session } from '@saas/shared/util-schema';
```

## Available Schemas

### Authentication Schemas

#### SupabaseUserSchema

Represents a Supabase user entity.

```typescript
import { SupabaseUserSchema, SupabaseUser } from '@saas/shared/util-schema';

// Validate user data
const user = SupabaseUserSchema.parse(userData);

// Type
type SupabaseUser = {
  id: string;
  aud: string;
  role?: string;
  email?: string;
  email_confirmed_at?: string;
  phone?: string;
  confirmed_at?: string;
  last_sign_in_at?: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
  identities?: Array<Record<string, unknown>>;
  created_at: string;
  updated_at?: string;
}
```

#### JwtPayloadSchema

Represents the decoded JWT token payload from Supabase.

```typescript
import { JwtPayloadSchema, JwtPayload } from '@saas/shared/util-schema';

// Validate JWT payload
const payload = JwtPayloadSchema.parse(decodedToken);

// Type
type JwtPayload = {
  sub: string;
  email?: string;
  phone?: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
  role?: string;
  aal?: string;
  amr?: Array<Record<string, unknown>>;
  session_id?: string;
  iss?: string;
  aud?: string | string[];
  exp?: number;
  iat?: number;
  nbf?: number;
}
```

#### SessionSchema

Represents a Supabase authentication session.

```typescript
import { SessionSchema, Session } from '@saas/shared/util-schema';

// Validate session data
const session = SessionSchema.parse(sessionData);

// Type
type Session = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: string;
  user: SupabaseUser;
}
```

## Usage in Backend (NestJS)

```typescript
import { JwtPayloadSchema } from '@saas/shared/util-schema';

export class AuthService {
  validateToken(token: string) {
    const decoded = jwt.decode(token);
    // Validate with Zod
    const payload = JwtPayloadSchema.parse(decoded);
    return payload;
  }
}
```

## Usage in Frontend (Angular)

```typescript
import { JwtPayload } from '@saas/shared/util-schema';

@Injectable()
export class AuthService {
  getCurrentUser(): JwtPayload | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const decoded = this.decodeToken(token);
    return decoded as JwtPayload; // Type-safe
  }
}
```

## Benefits

- **Single Source of Truth**: Define schemas once, use everywhere
- **Type Safety**: Inferred TypeScript types from Zod schemas
- **Runtime Validation**: Validate data at runtime with Zod
- **No Duplication**: Share types between frontend and backend
- **Maintainability**: Update in one place, changes propagate everywhere

## Adding New Schemas

1. Create a new schema file in the appropriate directory:
   - `lib/auth/` - Authentication-related schemas
   - `lib/database/` - Database entity schemas
   - `lib/storage/` - Storage-related schemas

2. Define your schema:

```typescript
import { z } from 'zod';

export const MyEntitySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  createdAt: z.string(),
});

export type MyEntity = z.infer<typeof MyEntitySchema>;
```

3. Export from the directory's `index.ts`:

```typescript
export * from './my-entity.schema';
```

## License

MIT
