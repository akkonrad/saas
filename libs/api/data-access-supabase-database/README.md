# @saas/api/data-access-supabase-database

Database access library for NestJS applications using Supabase. Provides a base repository pattern with CRUD operations and direct database access utilities.

## Overview

This library provides:
- `BaseRepository<T>` - Abstract repository class with common CRUD operations
- `SupabaseDatabaseService` - Service for RPC calls and direct table access
- Type-safe database operations
- Query options for pagination, filtering, and ordering

## Installation

This library is already part of the monorepo. Import it in your NestJS application:

```typescript
import {
  BaseRepository,
  SupabaseDatabaseService
} from '@saas/api/data-access-supabase-database';
```

## Quick Start

### 1. Import Module

```typescript
import { Module } from '@nestjs/common';
import { SupabaseDatabaseModule } from '@saas/api/data-access-supabase-database';

@Module({
  imports: [SupabaseDatabaseModule],
})
export class AppModule {}
```

### 2. Create a Repository

```typescript
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@saas/api/data-access-supabase-database';

interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  protected tableName = 'users';

  // Add custom methods
  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email } as Partial<User>);
  }
}
```

### 3. Use in Your Service

```typescript
import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private users: UsersRepository) {}

  async getAllUsers() {
    return this.users.findAll({ limit: 100, orderBy: 'created_at' });
  }

  async getUserById(id: string) {
    return this.users.findById(id);
  }

  async createUser(data: Partial<User>) {
    return this.users.create(data);
  }
}
```

## API Reference

### BaseRepository<T>

Abstract base class for database repositories.

#### Properties

```typescript
protected abstract tableName: string;
```

#### Methods

##### findAll(options?: QueryOptions): Promise<T[]>

Find all records with optional pagination and ordering.

```typescript
const users = await this.users.findAll({
  limit: 50,
  offset: 0,
  orderBy: 'created_at',
  ascending: false
});
```

**QueryOptions:**
- `limit?: number` - Number of records to return
- `offset?: number` - Number of records to skip
- `orderBy?: string` - Column to order by
- `ascending?: boolean` - Order direction (default: true)

##### findById(id: string): Promise<T | null>

Find a single record by ID.

```typescript
const user = await this.users.findById('user-uuid');
```

##### findOne(criteria: Partial<T>): Promise<T | null>

Find a single record by criteria.

```typescript
const user = await this.users.findOne({ email: 'user@example.com' });
```

##### create(data: Partial<T>): Promise<T>

Create a new record.

```typescript
const newUser = await this.users.create({
  email: 'new@example.com',
  name: 'John Doe'
});
```

##### update(id: string, data: Partial<T>): Promise<T>

Update a record by ID.

```typescript
const updated = await this.users.update('user-uuid', {
  name: 'Jane Doe'
});
```

##### delete(id: string): Promise<boolean>

Delete a record by ID.

```typescript
await this.users.delete('user-uuid');
```

##### count(criteria?: Partial<T>): Promise<number>

Count records in the table.

```typescript
// Count all users
const total = await this.users.count();

// Count with criteria
const activeUsers = await this.users.count({ status: 'active' });
```

### SupabaseDatabaseService

Service for direct database access and RPC calls.

#### rpc<T>(functionName: string, params?: Record<string, unknown>): Promise<T>

Call a Supabase Remote Procedure Call (RPC) function.

```typescript
@Injectable()
export class MyService {
  constructor(private db: SupabaseDatabaseService) {}

  async callCustomFunction() {
    const result = await this.db.rpc<{ total: number }>('calculate_total', {
      user_id: 'uuid'
    });
    return result;
  }
}
```

#### getTable(tableName: string)

Get a table query builder for direct database access.

```typescript
const query = this.db.getTable('users')
  .select('*')
  .eq('status', 'active')
  .order('created_at', { ascending: false });

const { data, error } = await query;
```

#### getClient(): SupabaseClient

Get the Supabase client instance.

```typescript
const client = this.db.getClient();
```

## Complete Example

```typescript
// users.repository.ts
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@saas/api/data-access-supabase-database';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at?: string;
}

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  protected tableName = 'users';

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email } as Partial<User>);
  }

  async findByRole(role: string): Promise<User[]> {
    const query = this.supabase
      .from(this.tableName)
      .select('*')
      .eq('role', role);

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data as User[];
  }

  async updateProfile(id: string, name: string): Promise<User> {
    return this.update(id, { name } as Partial<User>);
  }
}

// users.service.ts
import { Injectable } from '@nestjs/common';
import { UsersRepository, User } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private users: UsersRepository) {}

  async getAll(page = 1, pageSize = 20) {
    const offset = (page - 1) * pageSize;
    const [data, total] = await Promise.all([
      this.users.findAll({
        limit: pageSize,
        offset,
        orderBy: 'created_at',
        ascending: false
      }),
      this.users.count()
    ]);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    };
  }

  async getById(id: string) {
    const user = await this.users.findById(id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  async create(data: Omit<User, 'id' | 'created_at'>) {
    return this.users.create(data);
  }

  async updateProfile(id: string, name: string) {
    return this.users.updateProfile(id, name);
  }

  async delete(id: string) {
    await this.users.delete(id);
  }
}

// users.module.ts
import { Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  providers: [UsersRepository, UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
```

## Advanced Usage

### Custom Queries

Extend BaseRepository with custom query methods:

```typescript
@Injectable()
export class PostsRepository extends BaseRepository<Post> {
  protected tableName = 'posts';

  async findPublished(): Promise<Post[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as Post[];
  }

  async findByAuthor(authorId: string): Promise<Post[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('author_id', authorId);

    if (error) throw new Error(error.message);
    return data as Post[];
  }
}
```

### Using RPC Functions

```typescript
@Injectable()
export class AnalyticsService {
  constructor(private db: SupabaseDatabaseService) {}

  async getDashboardStats(userId: string) {
    return this.db.rpc('get_dashboard_stats', { user_id: userId });
  }

  async aggregateMetrics(startDate: string, endDate: string) {
    return this.db.rpc('aggregate_metrics', {
      start_date: startDate,
      end_date: endDate
    });
  }
}
```

## Best Practices

1. **Extend BaseRepository** for all entity-specific repositories
2. **Define interfaces** for your entities with proper TypeScript types
3. **Handle errors** appropriately - BaseRepository throws errors on failures
4. **Use pagination** for large result sets with `limit` and `offset`
5. **Leverage Supabase features** like RLS (Row Level Security) for data access control
6. **Create custom methods** for complex queries in your repository classes
7. **Return typed results** - Use generics and interfaces for type safety

## Error Handling

BaseRepository throws errors for failed operations:

```typescript
try {
  const user = await this.users.findById('invalid-id');
} catch (error) {
  // Handle error
  console.error('Failed to fetch user:', error.message);
}
```

## Testing

Mock repositories in your tests:

```typescript
const mockRepository = {
  findAll: jest.fn().mockResolvedValue([]),
  findById: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockResolvedValue(mockUser),
};

const module = await Test.createTestingModule({
  providers: [
    UsersService,
    {
      provide: UsersRepository,
      useValue: mockRepository,
    },
  ],
}).compile();
```

## License

MIT
