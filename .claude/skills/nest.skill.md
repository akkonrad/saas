# NestJS Best Practices

## Description
Reviews NestJS code and ensures it follows project best practices and conventions.

## Instructions

You are a NestJS expert reviewing code in this monorepo. Follow these strict guidelines:

### Validation
- **ALWAYS use Zod** for validation, NEVER class-validator
- Import schemas from `@saas/shared/util-schema`
- Parse request bodies with Zod schemas: `const data = UserSchema.parse(body);`
- Export types from Zod schemas: `export type User = z.infer<typeof UserSchema>;`

### Module Organization
- ONE module per library in `libs/api/*`
- Libraries use tags: `type:*,platform:node,scope:*`
- Use dynamic modules for configuration (forRoot, forRootAsync patterns)
- Export services, controllers, and providers from modules

### Dependency Injection
- Use `@Injectable()` decorator for all services
- Inject dependencies via constructor
- Use injection tokens for clients: `@Inject(SUPABASE_CLIENT)`
- Prefer interface-based injection for testability

### Guards & Decorators
- Use `@UseGuards()` for route protection
- Create custom parameter decorators for extracting data
- Guards implement `CanActivate` interface
- Extract JWT payloads with custom decorators: `@CurrentUser()`

### Repository Pattern
- Extend `BaseRepository` from `@saas/api/data-access-supabase-database`
- Repository per entity/table
- Keep repositories in `data-access-*` libraries
- Repositories handle database operations only

### Error Handling
- Use NestJS built-in exceptions: `HttpException`, `NotFoundException`, etc.
- Don't leak internal errors to clients
- Log errors with proper context
- Validate input at controller level

### Testing
- Use Jest for all tests
- Mock external dependencies (Supabase, Stripe, etc.)
- Test services in isolation
- Use `Test.createTestingModule()` for integration tests

### Library Structure
```
libs/api/data-access-users/
├── src/
│   ├── lib/
│   │   ├── users.repository.ts
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   └── index.ts
│   └── index.ts
└── project.json (tags: type:data-access,platform:node,scope:*)
```

### Common Patterns to Check

**Dynamic Module Pattern:**
```typescript
export class MyModule {
  static forRoot(config: Config): DynamicModule {
    return {
      module: MyModule,
      providers: [
        { provide: CONFIG_TOKEN, useValue: config },
        MyService
      ],
      exports: [MyService]
    };
  }
}
```

**Custom Decorator:**
```typescript
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);
```

**Repository Extension:**
```typescript
@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(@Inject(SUPABASE_CLIENT) supabase: SupabaseClient) {
    super(supabase, 'users');
  }
}
```

## Review Checklist

When reviewing NestJS code, verify:
- [ ] No class-validator imports (use Zod)
- [ ] Schemas imported from shared library
- [ ] Proper dependency injection
- [ ] Guards used for protected routes
- [ ] Repository pattern for database access
- [ ] Proper error handling
- [ ] Tests included
- [ ] Module exports correct providers
- [ ] Library has correct tags
