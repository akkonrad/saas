# Supabase Integration Implementation Tasks

**Project:** Faceless API Supabase Integration
**Date:** 2025-12-22
**Architecture:** Modular Supabase integration with separate libraries for Auth, Database, and Storage

## Overview

This document outlines the implementation tasks for integrating Supabase into the Faceless API following the Library-First architecture pattern. The integration is split into 5 core libraries to ensure modularity, testability, and reusability.

**Core Modules:**
1. `@saas/shared/util-schema` - Shared Zod schemas and types
2. `@saas/api/data-access-supabase` - Core Supabase client factory
3. `@saas/api/data-access-supabase-auth` - Authentication guards and decorators
4. `@saas/api/data-access-supabase-database` - Database operations and repositories
5. `@saas/api/data-access-supabase-storage` - File storage operations

---

## Major Tasks

### T0. Project Setup and Dependencies
Install required npm packages for Supabase integration and validation.
- Install Supabase JavaScript client library
- Install Zod validation library
- Install NestJS configuration module
- Verify installations in package.json
Requirements: None
Artifacts:
- T0.package-dependencies
- T0.env-example

---

### T1. Shared Schema Library (`@saas/shared/util-schema`)
Create the utility library for shared Zod schemas and TypeScript types that serve as the single source of truth for data contracts between frontend and backend.
- Generate Nx library with correct tags
- Create directory structure for schema organization
- Implement user and authentication schemas
- Export schemas through barrel files
Requirements: T0.package-dependencies
Artifacts:
- T1.util-schema-lib
- T1.user-schema
- T1.jwt-schema
- T1.session-schema
- T1.schema-exports

---

### T2. Core Supabase Client Library (`@saas/api/data-access-supabase`)
Create the foundational library that provides Supabase client factory and configuration management.
- Generate Nx library with correct tags
- Define configuration interfaces
- Implement Supabase service with client factory
- Create dynamic module with sync/async configuration
- Export constants and public API
Requirements: T0.package-dependencies, T1.util-schema-lib
Artifacts:
- T2.data-access-supabase-lib
- T2.supabase-config-interface
- T2.supabase-service
- T2.supabase-module
- T2.supabase-constants
- T2.supabase-exports

---

### T3. Authentication Library (`@saas/api/data-access-supabase-auth`)
Create the authentication library with JWT verification guards and user extraction decorators.
- Generate Nx library with correct tags
- Implement Supabase authentication guard
- Create current user decorator
- Create Supabase user decorator
- Create authentication module
- Export guards and decorators
Requirements: T2.data-access-supabase-lib, T2.supabase-module, T1.jwt-schema
Artifacts:
- T3.data-access-supabase-auth-lib
- T3.auth-guard
- T3.current-user-decorator
- T3.supabase-user-decorator
- T3.auth-module
- T3.auth-exports

---

### T4. Database Library (`@saas/api/data-access-supabase-database`)
Create the database access library with base repository pattern and query utilities.
- Generate Nx library with correct tags
- Implement base repository class with CRUD operations
- Implement database service with RPC support
- Create database module
- Export repository and service
Requirements: T2.data-access-supabase-lib, T2.supabase-module, T1.util-schema-lib
Artifacts:
- T4.data-access-supabase-database-lib
- T4.base-repository
- T4.database-service
- T4.database-module
- T4.database-exports

---

### T5. Storage Library (`@saas/api/data-access-supabase-storage`)
Create the storage library for file upload, download, and management operations.
- Generate Nx library with correct tags
- Implement storage service with upload/download methods
- Add signed URL generation methods
- Add file management methods (move, copy, delete)
- Create storage module
- Export storage service
Requirements: T2.data-access-supabase-lib, T2.supabase-module, T1.util-schema-lib
Artifacts:
- T5.data-access-supabase-storage-lib
- T5.storage-service
- T5.storage-module
- T5.storage-exports

---

### T6. Faceless API Integration
Integrate all Supabase modules into the Faceless API application.
- Update environment configuration files
- Configure Supabase module in app.module.ts
- Import auth, database, and storage modules
- Create protected endpoint examples
- Update app controller with authentication
Requirements: T2.supabase-module, T3.auth-module, T4.database-module, T5.storage-module
Artifacts:
- T6.env-configuration
- T6.app-module-integration
- T6.protected-endpoints
- T6.app-controller-updates

---

### T7. Verification and Testing
Verify that all modules are correctly integrated and functional.
- Verify library generation and structure
- Check tsconfig.base.json path mappings
- Run linting on all libraries
- Build the faceless API application
- Start the application and test endpoints
- Test authentication flow with JWT tokens
Requirements: T1.util-schema-lib, T2.data-access-supabase-lib, T3.data-access-supabase-auth-lib, T4.data-access-supabase-database-lib, T5.data-access-supabase-storage-lib, T6.app-module-integration
Artifacts:
- T7.library-verification
- T7.tsconfig-validation
- T7.lint-results
- T7.build-success
- T7.endpoint-tests
- T7.auth-flow-test

---

### T8. Documentation
Create comprehensive documentation for each library and usage examples.
- Create README for util-schema library
- Create README for data-access-supabase library
- Create README for data-access-supabase-auth library
- Create README for data-access-supabase-database library
- Create README for data-access-supabase-storage library
- Document environment variables
Requirements: T1.util-schema-lib, T2.data-access-supabase-lib, T3.data-access-supabase-auth-lib, T4.data-access-supabase-database-lib, T5.data-access-supabase-storage-lib
Artifacts:
- T8.util-schema-readme
- T8.data-access-supabase-readme
- T8.auth-readme
- T8.database-readme
- T8.storage-readme
- T8.env-documentation

---

### T9. Example Feature Implementation
Create a complete example feature demonstrating the full integration with a Users module.
- Generate data-access-users library
- Create users repository extending base repository
- Generate feature-users library
- Create users controller with protected endpoints
- Create users module
- Integrate users module into app.module.ts
- Test users endpoints
Requirements: T4.base-repository, T3.auth-guard, T6.app-module-integration
Artifacts:
- T9.data-access-users-lib
- T9.users-repository
- T9.feature-users-lib
- T9.users-controller
- T9.users-module
- T9.users-integration
- T9.users-endpoint-tests

---

### T10. Unit and Integration Tests
Create comprehensive test coverage for all libraries and features.
- Create unit tests for base repository
- Create unit tests for users repository
- Create unit tests for authentication guard
- Create unit tests for storage service
- Create unit tests for database service
- Create integration tests for users endpoints
- Verify test coverage meets standards
Requirements: T4.base-repository, T9.users-repository, T3.auth-guard, T5.storage-service, T4.database-service, T9.users-controller
Artifacts:
- T10.base-repository-tests
- T10.users-repository-tests
- T10.auth-guard-tests
- T10.storage-service-tests
- T10.database-service-tests
- T10.users-integration-tests
- T10.coverage-report

---

## Minor Tasks (Detailed Breakdown)

### T0 Minor Tasks

#### T0.1 Install Supabase Client
Install @supabase/supabase-js package for Supabase client functionality.
```bash
yarn add @supabase/supabase-js
```
Requirements: None
Artifacts: T0.1.supabase-js-installed

#### T0.2 Install Zod Validation
Install zod package for schema validation.
```bash
yarn add zod
```
Requirements: None
Artifacts: T0.2.zod-installed

#### T0.3 Install NestJS Config
Install @nestjs/config for environment configuration management.
```bash
yarn add @nestjs/config
```
Requirements: None
Artifacts: T0.3.nestjs-config-installed

#### T0.4 Verify Package Installation
Check package.json to ensure all dependencies are correctly installed.
```bash
cat /Users/konrad/www/saas/package.json | grep -E "(supabase|zod|@nestjs/config)"
```
Requirements: T0.1.supabase-js-installed, T0.2.zod-installed, T0.3.nestjs-config-installed
Artifacts: T0.4.package-verification

#### T0.5 Create Environment Example File
Update .env.example with Supabase configuration variables.
- Add SUPABASE_URL
- Add SUPABASE_ANON_KEY
- Add SUPABASE_SERVICE_ROLE
Requirements: None
Artifacts: T0.5.env-example-updated

---

### T1 Minor Tasks

#### T1.1 Generate Shared Schema Library
Generate the Nx library for shared schemas with proper tags.
```bash
npx nx generate @nx/js:library \
  --name=util-schema \
  --directory=libs/shared/util-schema \
  --importPath=@saas/shared/util-schema \
  --projectNameAndRootFormat=as-provided \
  --bundler=tsc \
  --unitTestRunner=jest \
  --tags=type:util,platform:shared,scope:shared \
  --strict
```
Requirements: None
Artifacts: T1.1.schema-lib-generated

#### T1.2 Create Schema Directory Structure
Create organized directory structure for different schema types.
- Create `lib/auth/` directory
- Create `lib/database/` directory
- Create `lib/storage/` directory
Requirements: T1.1.schema-lib-generated
Artifacts: T1.2.schema-directories

#### T1.3 Implement User Schema
Create Zod schema for Supabase user entity.
File: `/Users/konrad/www/saas/libs/shared/util-schema/src/lib/auth/user.schema.ts`
- Define SupabaseUserSchema
- Export SupabaseUser type
Requirements: T1.2.schema-directories, T0.2.zod-installed
Artifacts: T1.3.user-schema-file

#### T1.4 Implement JWT Payload Schema
Create Zod schema for JWT payload validation.
File: `/Users/konrad/www/saas/libs/shared/util-schema/src/lib/auth/user.schema.ts`
- Define JwtPayloadSchema
- Export JwtPayload type
Requirements: T1.2.schema-directories, T0.2.zod-installed
Artifacts: T1.4.jwt-schema-file

#### T1.5 Implement Session Schema
Create Zod schema for session data.
File: `/Users/konrad/www/saas/libs/shared/util-schema/src/lib/auth/user.schema.ts`
- Define SessionSchema
- Export Session type
Requirements: T1.2.schema-directories, T1.3.user-schema-file
Artifacts: T1.5.session-schema-file

#### T1.6 Create Auth Barrel Export
Export all auth schemas from auth directory.
File: `/Users/konrad/www/saas/libs/shared/util-schema/src/lib/auth/index.ts`
Requirements: T1.3.user-schema-file, T1.4.jwt-schema-file, T1.5.session-schema-file
Artifacts: T1.6.auth-barrel-export

#### T1.7 Create Library Barrel Exports
Export all schemas from lib directory.
File: `/Users/konrad/www/saas/libs/shared/util-schema/src/lib/index.ts`
Requirements: T1.6.auth-barrel-export
Artifacts: T1.7.lib-barrel-export

#### T1.8 Create Root Barrel Export
Export library API from root index.
File: `/Users/konrad/www/saas/libs/shared/util-schema/src/index.ts`
Requirements: T1.7.lib-barrel-export
Artifacts: T1.8.root-barrel-export

---

### T2 Minor Tasks

#### T2.1 Generate Core Supabase Library
Generate the Nx library for core Supabase client.
```bash
npx nx generate @nx/js:library \
  --name=data-access-supabase \
  --directory=libs/api/data-access-supabase \
  --importPath=@saas/api/data-access-supabase \
  --projectNameAndRootFormat=as-provided \
  --bundler=tsc \
  --unitTestRunner=jest \
  --tags=type:data-access,platform:node,scope:shared \
  --strict
```
Requirements: None
Artifacts: T2.1.supabase-lib-generated

#### T2.2 Create Constants File
Define Supabase injection tokens.
File: `/Users/konrad/www/saas/libs/api/data-access-supabase/src/lib/supabase.constants.ts`
- Define SUPABASE_CLIENT constant
- Define SUPABASE_CONFIG constant
Requirements: T2.1.supabase-lib-generated
Artifacts: T2.2.constants-file

#### T2.3 Create Interfaces Directory
Create directory for TypeScript interfaces.
Requirements: T2.1.supabase-lib-generated
Artifacts: T2.3.interfaces-directory

#### T2.4 Implement Config Interface
Define SupabaseConfig interface.
File: `/Users/konrad/www/saas/libs/api/data-access-supabase/src/lib/interfaces/supabase-config.interface.ts`
Requirements: T2.3.interfaces-directory
Artifacts: T2.4.config-interface

#### T2.5 Create Interface Barrel Export
Export all interfaces from interfaces directory.
File: `/Users/konrad/www/saas/libs/api/data-access-supabase/src/lib/interfaces/index.ts`
Requirements: T2.4.config-interface
Artifacts: T2.5.interface-exports

#### T2.6 Implement Supabase Service
Create service with client factory methods.
File: `/Users/konrad/www/saas/libs/api/data-access-supabase/src/lib/supabase.service.ts`
- Implement createClient method
- Implement getClient method
- Implement createClientWithToken method
Requirements: T2.1.supabase-lib-generated, T2.4.config-interface, T0.1.supabase-js-installed
Artifacts: T2.6.supabase-service

#### T2.7 Implement Supabase Module
Create dynamic NestJS module with sync/async configuration.
File: `/Users/konrad/www/saas/libs/api/data-access-supabase/src/lib/supabase.module.ts`
- Implement forRoot method
- Implement forRootAsync method
- Configure providers and exports
Requirements: T2.6.supabase-service, T2.2.constants-file
Artifacts: T2.7.supabase-module

#### T2.8 Create Library Barrel Export
Export all library components.
File: `/Users/konrad/www/saas/libs/api/data-access-supabase/src/lib/index.ts`
Requirements: T2.7.supabase-module, T2.6.supabase-service, T2.2.constants-file, T2.5.interface-exports
Artifacts: T2.8.lib-exports

#### T2.9 Create Root Barrel Export
Export library API from root index.
File: `/Users/konrad/www/saas/libs/api/data-access-supabase/src/index.ts`
Requirements: T2.8.lib-exports
Artifacts: T2.9.root-exports

---

### T3 Minor Tasks

#### T3.1 Generate Auth Library
Generate the Nx library for authentication.
```bash
npx nx generate @nx/js:library \
  --name=data-access-supabase-auth \
  --directory=libs/api/data-access-supabase-auth \
  --importPath=@saas/api/data-access-supabase-auth \
  --projectNameAndRootFormat=as-provided \
  --bundler=tsc \
  --unitTestRunner=jest \
  --tags=type:data-access,platform:node,scope:shared \
  --strict
```
Requirements: None
Artifacts: T3.1.auth-lib-generated

#### T3.2 Create Guards Directory
Create directory for authentication guards.
Requirements: T3.1.auth-lib-generated
Artifacts: T3.2.guards-directory

#### T3.3 Implement Auth Guard
Create Supabase JWT authentication guard.
File: `/Users/konrad/www/saas/libs/api/data-access-supabase-auth/src/lib/guards/supabase-auth.guard.ts`
- Implement CanActivate interface
- Add JWT verification logic
- Attach user to request context
Requirements: T3.2.guards-directory, T2.2.constants-file, T1.4.jwt-schema-file
Artifacts: T3.3.auth-guard-file

#### T3.4 Create Guards Barrel Export
Export all guards from guards directory.
File: `/Users/konrad/www/saas/libs/api/data-access-supabase-auth/src/lib/guards/index.ts`
Requirements: T3.3.auth-guard-file
Artifacts: T3.4.guards-exports

#### T3.5 Create Decorators Directory
Create directory for parameter decorators.
Requirements: T3.1.auth-lib-generated
Artifacts: T3.5.decorators-directory

#### T3.6 Implement Current User Decorator
Create decorator to extract JWT payload from request.
File: `/Users/konrad/www/saas/libs/api/data-access-supabase-auth/src/lib/decorators/current-user.decorator.ts`
- Implement CurrentUser decorator
- Implement CurrentSupabaseUser decorator
Requirements: T3.5.decorators-directory, T1.4.jwt-schema-file
Artifacts: T3.6.current-user-decorator

#### T3.7 Create Decorators Barrel Export
Export all decorators from decorators directory.
File: `/Users/konrad/www/saas/libs/api/data-access-supabase-auth/src/lib/decorators/index.ts`
Requirements: T3.6.current-user-decorator
Artifacts: T3.7.decorators-exports

#### T3.8 Implement Auth Module
Create NestJS module for authentication.
File: `/Users/konrad/www/saas/libs/api/data-access-supabase-auth/src/lib/supabase-auth.module.ts`
- Configure providers
- Export auth guard
Requirements: T3.4.guards-exports
Artifacts: T3.8.auth-module-file

#### T3.9 Create Library Barrel Export
Export all library components.
File: `/Users/konrad/www/saas/libs/api/data-access-supabase-auth/src/lib/index.ts`
Requirements: T3.8.auth-module-file, T3.4.guards-exports, T3.7.decorators-exports
Artifacts: T3.9.auth-lib-exports

#### T3.10 Create Root Barrel Export
Export library API from root index.
File: `/Users/konrad/www/saas/libs/api/data-access-supabase-auth/src/index.ts`
Requirements: T3.9.auth-lib-exports
Artifacts: T3.10.auth-root-exports

---

### T4 Minor Tasks

#### T4.1 Generate Database Library
Generate the Nx library for database access.
```bash
npx nx generate @nx/js:library \
  --name=data-access-supabase-database \
  --directory=libs/api/data-access-supabase-database \
  --importPath=@saas/api/data-access-supabase-database \
  --projectNameAndRootFormat=as-provided \
  --bundler=tsc \
  --unitTestRunner=jest \
  --tags=type:data-access,platform:node,scope:shared \
  --strict
```
Requirements: None
Artifacts: T4.1.database-lib-generated

#### T4.2 Create Repositories Directory
Create directory for repository classes.
Requirements: T4.1.database-lib-generated
Artifacts: T4.2.repositories-directory

#### T4.3 Implement Base Repository
Create abstract base repository with CRUD operations.
File: `/Users/konrad/www/saas/libs/api/data-access-supabase-database/src/lib/repositories/base.repository.ts`
- Implement findAll method
- Implement findById method
- Implement findOne method
- Implement create method
- Implement update method
- Implement delete method
- Implement count method
Requirements: T4.2.repositories-directory, T2.2.constants-file
Artifacts: T4.3.base-repository-file

#### T4.4 Create Repositories Barrel Export
Export all repositories from repositories directory.
File: `/Users/konrad/www/saas/libs/api/data-access-supabase-database/src/lib/repositories/index.ts`
Requirements: T4.3.base-repository-file
Artifacts: T4.4.repositories-exports

#### T4.5 Implement Database Service
Create service for database utilities and RPC calls.
File: `/Users/konrad/www/saas/libs/api/data-access-supabase-database/src/lib/supabase-database.service.ts`
- Implement rpc method
- Implement getTable method
Requirements: T4.1.database-lib-generated, T2.2.constants-file
Artifacts: T4.5.database-service-file

#### T4.6 Implement Database Module
Create NestJS module for database access.
File: `/Users/konrad/www/saas/libs/api/data-access-supabase-database/src/lib/supabase-database.module.ts`
- Configure providers
- Export database service
Requirements: T4.5.database-service-file
Artifacts: T4.6.database-module-file

#### T4.7 Create Library Barrel Export
Export all library components.
File: `/Users/konrad/www/saas/libs/api/data-access-supabase-database/src/lib/index.ts`
Requirements: T4.6.database-module-file, T4.5.database-service-file, T4.4.repositories-exports
Artifacts: T4.7.database-lib-exports

#### T4.8 Create Root Barrel Export
Export library API from root index.
File: `/Users/konrad/www/saas/libs/api/data-access-supabase-database/src/index.ts`
Requirements: T4.7.database-lib-exports
Artifacts: T4.8.database-root-exports

---

### T5 Minor Tasks

#### T5.1 Generate Storage Library
Generate the Nx library for storage operations.
```bash
npx nx generate @nx/js:library \
  --name=data-access-supabase-storage \
  --directory=libs/api/data-access-supabase-storage \
  --importPath=@saas/api/data-access-supabase-storage \
  --projectNameAndRootFormat=as-provided \
  --bundler=tsc \
  --unitTestRunner=jest \
  --tags=type:data-access,platform:node,scope:shared \
  --strict
```
Requirements: None
Artifacts: T5.1.storage-lib-generated

#### T5.2 Implement Storage Service
Create service for file storage operations.
File: `/Users/konrad/www/saas/libs/api/data-access-supabase-storage/src/lib/supabase-storage.service.ts`
- Implement uploadFile method
- Implement downloadFile method
- Implement deleteFile method
- Implement getPublicUrl method
- Implement createSignedUrl method
- Implement listFiles method
- Implement moveFile method
- Implement copyFile method
Requirements: T5.1.storage-lib-generated, T2.2.constants-file
Artifacts: T5.2.storage-service-file

#### T5.3 Implement Storage Module
Create NestJS module for storage operations.
File: `/Users/konrad/www/saas/libs/api/data-access-supabase-storage/src/lib/supabase-storage.module.ts`
- Configure providers
- Export storage service
Requirements: T5.2.storage-service-file
Artifacts: T5.3.storage-module-file

#### T5.4 Create Library Barrel Export
Export all library components.
File: `/Users/konrad/www/saas/libs/api/data-access-supabase-storage/src/lib/index.ts`
Requirements: T5.3.storage-module-file, T5.2.storage-service-file
Artifacts: T5.4.storage-lib-exports

#### T5.5 Create Root Barrel Export
Export library API from root index.
File: `/Users/konrad/www/saas/libs/api/data-access-supabase-storage/src/index.ts`
Requirements: T5.4.storage-lib-exports
Artifacts: T5.5.storage-root-exports

---

### T6 Minor Tasks

#### T6.1 Update Environment Example
Add Supabase environment variables to .env.example.
File: `/Users/konrad/www/saas/.env.example`
- Add SUPABASE_URL
- Add SUPABASE_ANON_KEY
- Add SUPABASE_SERVICE_ROLE
- Add NODE_ENV
- Add PORT
Requirements: None
Artifacts: T6.1.env-example-updated

#### T6.2 Update App Module Imports
Import all Supabase modules into the application.
File: `/Users/konrad/www/saas/apps/faceless/api/src/app/app.module.ts`
- Import ConfigModule
- Import SupabaseModule with async config
- Import SupabaseAuthModule
- Import SupabaseDatabaseModule
- Import SupabaseStorageModule
Requirements: T2.7.supabase-module, T3.8.auth-module-file, T4.6.database-module-file, T5.3.storage-module-file
Artifacts: T6.2.app-module-updated

#### T6.3 Create Protected Endpoint
Add protected endpoint to app controller.
File: `/Users/konrad/www/saas/apps/faceless/api/src/app/app.controller.ts`
- Add @UseGuards(SupabaseAuthGuard) decorator
- Create /protected endpoint
- Create /me endpoint
- Use @CurrentUser decorator
Requirements: T3.3.auth-guard-file, T3.6.current-user-decorator
Artifacts: T6.3.protected-endpoints-added

---

### T7 Minor Tasks

#### T7.1 Verify Library Structure
Check that all library directories exist.
```bash
ls -la /Users/konrad/www/saas/libs/shared/util-schema
ls -la /Users/konrad/www/saas/libs/api/data-access-supabase
ls -la /Users/konrad/www/saas/libs/api/data-access-supabase-auth
ls -la /Users/konrad/www/saas/libs/api/data-access-supabase-database
ls -la /Users/konrad/www/saas/libs/api/data-access-supabase-storage
```
Requirements: T1.1.schema-lib-generated, T2.1.supabase-lib-generated, T3.1.auth-lib-generated, T4.1.database-lib-generated, T5.1.storage-lib-generated
Artifacts: T7.1.library-structure-verified

#### T7.2 Verify TypeScript Path Mappings
Check tsconfig.base.json for correct path mappings.
```bash
cat /Users/konrad/www/saas/tsconfig.base.json | grep -A10 "paths"
```
Requirements: T1.1.schema-lib-generated, T2.1.supabase-lib-generated, T3.1.auth-lib-generated, T4.1.database-lib-generated, T5.1.storage-lib-generated
Artifacts: T7.2.tsconfig-paths-verified

#### T7.3 Run Linting
Lint all libraries to verify module boundaries.
```bash
yarn nx run-many -t lint
```
Requirements: T1.8.root-barrel-export, T2.9.root-exports, T3.10.auth-root-exports, T4.8.database-root-exports, T5.5.storage-root-exports
Artifacts: T7.3.lint-passed

#### T7.4 Build Application
Build the faceless API application.
```bash
yarn nx build face-api
```
Requirements: T6.2.app-module-updated, T7.3.lint-passed
Artifacts: T7.4.build-successful

#### T7.5 Start Application
Start the faceless API server.
```bash
yarn nx serve face-api
```
Requirements: T7.4.build-successful
Artifacts: T7.5.app-running

#### T7.6 Test Public Endpoint
Test the public endpoint returns correct response.
```bash
curl http://localhost:3000/api
```
Requirements: T7.5.app-running
Artifacts: T7.6.public-endpoint-tested

#### T7.7 Test Protected Endpoint Without Token
Verify protected endpoint requires authentication.
```bash
curl http://localhost:3000/api/protected
```
Requirements: T7.5.app-running, T6.3.protected-endpoints-added
Artifacts: T7.7.auth-required-verified

#### T7.8 Test Protected Endpoint With Token
Test protected endpoint with valid JWT token.
```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:3000/api/protected
```
Requirements: T7.5.app-running, T6.3.protected-endpoints-added
Artifacts: T7.8.auth-success-verified

---

### T8 Minor Tasks

#### T8.1 Create Util Schema README
Document the shared schema library usage.
File: `/Users/konrad/www/saas/libs/shared/util-schema/README.md`
Requirements: T1.8.root-barrel-export
Artifacts: T8.1.schema-readme-created

#### T8.2 Create Core Supabase README
Document the core Supabase client library.
File: `/Users/konrad/www/saas/libs/api/data-access-supabase/README.md`
Requirements: T2.9.root-exports
Artifacts: T8.2.supabase-readme-created

#### T8.3 Create Auth README
Document the authentication library usage.
File: `/Users/konrad/www/saas/libs/api/data-access-supabase-auth/README.md`
Requirements: T3.10.auth-root-exports
Artifacts: T8.3.auth-readme-created

#### T8.4 Create Database README
Document the database library usage.
File: `/Users/konrad/www/saas/libs/api/data-access-supabase-database/README.md`
Requirements: T4.8.database-root-exports
Artifacts: T8.4.database-readme-created

#### T8.5 Create Storage README
Document the storage library usage.
File: `/Users/konrad/www/saas/libs/api/data-access-supabase-storage/README.md`
Requirements: T5.5.storage-root-exports
Artifacts: T8.5.storage-readme-created

---

### T9 Minor Tasks

#### T9.1 Generate Users Data Access Library
Generate library for users repository.
```bash
npx nx generate @nx/js:library \
  --name=data-access-users \
  --directory=libs/api/data-access-users \
  --importPath=@saas/api/data-access-users \
  --projectNameAndRootFormat=as-provided \
  --bundler=tsc \
  --unitTestRunner=jest \
  --tags=type:data-access,platform:node,scope:faceless \
  --strict
```
Requirements: None
Artifacts: T9.1.users-data-lib-generated

#### T9.2 Implement Users Repository
Create users repository extending base repository.
File: `/Users/konrad/www/saas/libs/api/data-access-users/src/lib/users.repository.ts`
- Define User interface
- Extend BaseRepository
- Implement findByEmail method
- Implement updateProfile method
Requirements: T9.1.users-data-lib-generated, T4.3.base-repository-file
Artifacts: T9.2.users-repository-file

#### T9.3 Implement Users Data Module
Create NestJS module for users data access.
File: `/Users/konrad/www/saas/libs/api/data-access-users/src/lib/users.module.ts`
Requirements: T9.2.users-repository-file
Artifacts: T9.3.users-data-module-file

#### T9.4 Export Users Data Library
Create barrel exports for users data library.
File: `/Users/konrad/www/saas/libs/api/data-access-users/src/lib/index.ts`
File: `/Users/konrad/www/saas/libs/api/data-access-users/src/index.ts`
Requirements: T9.3.users-data-module-file
Artifacts: T9.4.users-data-exports

#### T9.5 Generate Users Feature Library
Generate library for users feature controller.
```bash
npx nx generate @nx/js:library \
  --name=feature-users \
  --directory=libs/api/feature-users \
  --importPath=@saas/api/feature-users \
  --projectNameAndRootFormat=as-provided \
  --bundler=tsc \
  --unitTestRunner=jest \
  --tags=type:feature,platform:node,scope:faceless \
  --strict
```
Requirements: None
Artifacts: T9.5.users-feature-lib-generated

#### T9.6 Implement Users Controller
Create controller with protected endpoints for users.
File: `/Users/konrad/www/saas/libs/api/feature-users/src/lib/users.controller.ts`
- Add @UseGuards(SupabaseAuthGuard)
- Implement GET /users/me endpoint
- Implement PUT /users/me endpoint
Requirements: T9.5.users-feature-lib-generated, T9.2.users-repository-file, T3.3.auth-guard-file
Artifacts: T9.6.users-controller-file

#### T9.7 Implement Users Feature Module
Create NestJS module for users feature.
File: `/Users/konrad/www/saas/libs/api/feature-users/src/lib/users.module.ts`
Requirements: T9.6.users-controller-file, T9.3.users-data-module-file
Artifacts: T9.7.users-feature-module-file

#### T9.8 Export Users Feature Library
Create barrel exports for users feature library.
File: `/Users/konrad/www/saas/libs/api/feature-users/src/lib/index.ts`
File: `/Users/konrad/www/saas/libs/api/feature-users/src/index.ts`
Requirements: T9.7.users-feature-module-file
Artifacts: T9.8.users-feature-exports

#### T9.9 Integrate Users Module
Import users module into app.module.ts.
File: `/Users/konrad/www/saas/apps/faceless/api/src/app/app.module.ts`
Requirements: T9.7.users-feature-module-file, T6.2.app-module-updated
Artifacts: T9.9.users-module-integrated

#### T9.10 Test Users Endpoints
Test the users endpoints with authentication.
```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:3000/api/users/me
curl -X PUT -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" \
  -d '{"full_name":"Test User"}' http://localhost:3000/api/users/me
```
Requirements: T9.9.users-module-integrated, T7.5.app-running
Artifacts: T9.10.users-endpoints-tested

---

### T10 Minor Tasks

#### T10.1 Create Base Repository Tests
Write unit tests for base repository CRUD operations.
File: `/Users/konrad/www/saas/libs/api/data-access-supabase-database/src/lib/repositories/base.repository.spec.ts`
- Test findAll method
- Test findById method
- Test findOne method
- Test create method
- Test update method
- Test delete method
- Test count method
Requirements: T4.3.base-repository-file
Artifacts: T10.1.base-repository-tests-file

#### T10.2 Create Users Repository Tests
Write unit tests for users repository.
File: `/Users/konrad/www/saas/libs/api/data-access-users/src/lib/users.repository.spec.ts`
- Test findByEmail method
- Test updateProfile method
Requirements: T9.2.users-repository-file
Artifacts: T10.2.users-repository-tests-file

#### T10.3 Create Auth Guard Tests
Write unit tests for authentication guard.
File: `/Users/konrad/www/saas/libs/api/data-access-supabase-auth/src/lib/guards/supabase-auth.guard.spec.ts`
- Test canActivate with valid token
- Test canActivate with invalid token
- Test canActivate with missing token
Requirements: T3.3.auth-guard-file
Artifacts: T10.3.auth-guard-tests-file

#### T10.4 Create Storage Service Tests
Write unit tests for storage service.
File: `/Users/konrad/www/saas/libs/api/data-access-supabase-storage/src/lib/supabase-storage.service.spec.ts`
- Test uploadFile method
- Test downloadFile method
- Test deleteFile method
- Test createSignedUrl method
Requirements: T5.2.storage-service-file
Artifacts: T10.4.storage-service-tests-file

#### T10.5 Create Database Service Tests
Write unit tests for database service.
File: `/Users/konrad/www/saas/libs/api/data-access-supabase-database/src/lib/supabase-database.service.spec.ts`
- Test rpc method
- Test getTable method
Requirements: T4.5.database-service-file
Artifacts: T10.5.database-service-tests-file

#### T10.6 Run All Tests
Execute all unit tests across libraries.
```bash
yarn nx run-many -t test
```
Requirements: T10.1.base-repository-tests-file, T10.2.users-repository-tests-file, T10.3.auth-guard-tests-file, T10.4.storage-service-tests-file, T10.5.database-service-tests-file
Artifacts: T10.6.all-tests-passed

#### T10.7 Generate Coverage Report
Generate test coverage report for all libraries.
```bash
yarn nx run-many -t test --coverage
```
Requirements: T10.6.all-tests-passed
Artifacts: T10.7.coverage-report-generated

---

## Execution Order

The recommended execution order follows the dependency chain:

1. **T0** - Install dependencies
2. **T1** - Create shared schema library (foundation for all modules)
3. **T2** - Create core Supabase client library (required by T3, T4, T5)
4. **T3** - Create authentication library (requires T2)
5. **T4** - Create database library (requires T2)
6. **T5** - Create storage library (requires T2)
7. **T6** - Integrate into faceless API (requires T2, T3, T4, T5)
8. **T7** - Verify and test integration (requires T6)
9. **T8** - Create documentation (can run in parallel with T9, T10)
10. **T9** - Create example users feature (requires T4, T3, T6)
11. **T10** - Create comprehensive tests (requires all previous tasks)

---

## Success Criteria

- [ ] All 5 libraries successfully generated with correct Nx tags
- [ ] All libraries pass linting without errors
- [ ] Module boundary rules enforced by ESLint
- [ ] Application builds successfully
- [ ] Application runs and responds to requests
- [ ] Protected endpoints require authentication
- [ ] Authentication flow works with JWT tokens
- [ ] Example users feature demonstrates full integration
- [ ] All unit tests pass with adequate coverage
- [ ] Comprehensive documentation created for each library
- [ ] TypeScript path mappings configured correctly

---

## Notes

- All libraries use Zod for validation instead of class-validator
- Authentication uses Supabase JWT verification
- Base repository pattern enables code reuse
- Modules are designed for maximum testability and reusability
- Environment variables must be configured before running
- Example feature demonstrates real-world usage patterns
