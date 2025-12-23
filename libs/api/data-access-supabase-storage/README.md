# @saas/api/data-access-supabase-storage

File storage library for NestJS applications using Supabase Storage. Provides comprehensive file management operations including upload, download, signed URLs, and file manipulation.

## Overview

This library provides:
- File upload with configurable options
- File download and deletion
- Public and signed URL generation
- File listing and management
- File move and copy operations

## Installation

This library is already part of the monorepo. Import it in your NestJS application:

```typescript
import {
  SupabaseStorageService,
  UploadOptions
} from '@saas/api/data-access-supabase-storage';
```

## Quick Start

### 1. Import Module

```typescript
import { Module } from '@nestjs/common';
import { SupabaseStorageModule } from '@saas/api/data-access-supabase-storage';

@Module({
  imports: [SupabaseStorageModule],
})
export class AppModule {}
```

### 2. Use in Your Service

```typescript
import { Injectable } from '@nestjs/common';
import { SupabaseStorageService } from '@saas/api/data-access-supabase-storage';

@Injectable()
export class AvatarService {
  constructor(private storage: SupabaseStorageService) {}

  async uploadAvatar(userId: string, file: Buffer) {
    return this.storage.uploadFile(
      'avatars',
      `${userId}/avatar.jpg`,
      file,
      { contentType: 'image/jpeg' }
    );
  }

  async getAvatarUrl(userId: string) {
    return this.storage.getPublicUrl('avatars', `${userId}/avatar.jpg`);
  }
}
```

## API Reference

### SupabaseStorageService

Service for file storage operations.

#### uploadFile(bucket, path, file, options?): Promise<UploadResult>

Upload a file to a storage bucket.

```typescript
const result = await this.storage.uploadFile(
  'documents',
  'folder/file.pdf',
  fileBuffer,
  {
    contentType: 'application/pdf',
    cacheControl: '3600',
    upsert: true
  }
);
```

**Parameters:**
- `bucket: string` - Name of the storage bucket
- `path: string` - Path where the file should be stored
- `file: Buffer | Blob | File` - File data
- `options?: UploadOptions` - Upload configuration

**UploadOptions:**
- `contentType?: string` - MIME type of the file
- `cacheControl?: string` - Cache control header (default: '3600')
- `upsert?: boolean` - Overwrite existing files (default: false)

#### downloadFile(bucket, path): Promise<Blob>

Download a file from a storage bucket.

```typescript
const fileBlob = await this.storage.downloadFile('documents', 'folder/file.pdf');
```

#### deleteFile(bucket, paths): Promise<boolean>

Delete one or more files from a storage bucket.

```typescript
// Delete single file
await this.storage.deleteFile('documents', ['folder/file.pdf']);

// Delete multiple files
await this.storage.deleteFile('documents', [
  'folder/file1.pdf',
  'folder/file2.pdf'
]);
```

#### getPublicUrl(bucket, path): string

Get the public URL for a file.

```typescript
const url = this.storage.getPublicUrl('avatars', 'user/avatar.jpg');
// Returns: https://[project].supabase.co/storage/v1/object/public/avatars/user/avatar.jpg
```

#### createSignedUrl(bucket, path, expiresIn?): Promise<string>

Create a signed URL for temporary access to a file.

```typescript
// URL expires in 1 hour (default)
const url = await this.storage.createSignedUrl('private', 'document.pdf');

// Custom expiration (in seconds)
const url = await this.storage.createSignedUrl('private', 'document.pdf', 7200);
```

#### listFiles(bucket, path?): Promise<FileObject[]>

List all files in a bucket folder.

```typescript
// List all files in bucket
const files = await this.storage.listFiles('documents');

// List files in specific folder
const files = await this.storage.listFiles('documents', 'user-123');
```

#### moveFile(bucket, fromPath, toPath): Promise<MoveResult>

Move a file to a new location within the same bucket.

```typescript
await this.storage.moveFile(
  'documents',
  'temp/file.pdf',
  'permanent/file.pdf'
);
```

#### copyFile(bucket, fromPath, toPath): Promise<CopyResult>

Copy a file to a new location within the same bucket.

```typescript
await this.storage.copyFile(
  'documents',
  'original/file.pdf',
  'backup/file.pdf'
);
```

## Complete Examples

### Avatar Upload Service

```typescript
import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseStorageService } from '@saas/api/data-access-supabase-storage';

@Injectable()
export class AvatarService {
  private readonly BUCKET = 'avatars';
  private readonly MAX_SIZE = 5 * 1024 * 1024; // 5MB

  constructor(private storage: SupabaseStorageService) {}

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    // Validate file size
    if (file.size > this.MAX_SIZE) {
      throw new BadRequestException('File too large');
    }

    // Validate file type
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('File must be an image');
    }

    const path = `${userId}/avatar.${this.getExtension(file.mimetype)}`;

    // Upload with upsert to replace existing avatar
    await this.storage.uploadFile(
      this.BUCKET,
      path,
      file.buffer,
      {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: true
      }
    );

    return this.storage.getPublicUrl(this.BUCKET, path);
  }

  async deleteAvatar(userId: string) {
    // List all avatar files for this user
    const files = await this.storage.listFiles(this.BUCKET, userId);

    if (files.length > 0) {
      const paths = files.map(f => `${userId}/${f.name}`);
      await this.storage.deleteFile(this.BUCKET, paths);
    }
  }

  private getExtension(mimeType: string): string {
    const map: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
    };
    return map[mimeType] || 'jpg';
  }
}
```

### Document Storage Service

```typescript
import { Injectable } from '@nestjs/common';
import { SupabaseStorageService } from '@saas/api/data-access-supabase-storage';

@Injectable()
export class DocumentService {
  private readonly BUCKET = 'documents';

  constructor(private storage: SupabaseStorageService) {}

  async uploadDocument(userId: string, file: Express.Multer.File) {
    const timestamp = Date.now();
    const path = `${userId}/${timestamp}-${file.originalname}`;

    await this.storage.uploadFile(
      this.BUCKET,
      path,
      file.buffer,
      {
        contentType: file.mimetype,
        cacheControl: '86400' // 24 hours
      }
    );

    return { path, url: this.storage.getPublicUrl(this.BUCKET, path) };
  }

  async getDocument(userId: string, filename: string) {
    const path = `${userId}/${filename}`;
    return this.storage.downloadFile(this.BUCKET, path);
  }

  async createShareLink(userId: string, filename: string, expiresIn = 3600) {
    const path = `${userId}/${filename}`;
    return this.storage.createSignedUrl(this.BUCKET, path, expiresIn);
  }

  async listUserDocuments(userId: string) {
    return this.storage.listFiles(this.BUCKET, userId);
  }

  async deleteDocument(userId: string, filename: string) {
    const path = `${userId}/${filename}`;
    await this.storage.deleteFile(this.BUCKET, [path]);
  }

  async archiveDocument(userId: string, filename: string) {
    const fromPath = `${userId}/${filename}`;
    const toPath = `${userId}/archive/${filename}`;
    await this.storage.moveFile(this.BUCKET, fromPath, toPath);
  }
}
```

### File Upload Controller

```typescript
import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SupabaseAuthGuard, CurrentUser } from '@saas/api/data-access-supabase-auth';
import { JwtPayload } from '@saas/shared/util-schema';
import { DocumentService } from './document.service';

@Controller('documents')
@UseGuards(SupabaseAuthGuard)
export class DocumentController {
  constructor(private documents: DocumentService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @CurrentUser() user: JwtPayload,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.documents.uploadDocument(user.sub, file);
  }

  @Get()
  async list(@CurrentUser() user: JwtPayload) {
    return this.documents.listUserDocuments(user.sub);
  }

  @Get(':filename/share')
  async createShareLink(
    @CurrentUser() user: JwtPayload,
    @Param('filename') filename: string
  ) {
    const url = await this.documents.createShareLink(user.sub, filename, 3600);
    return { url, expiresIn: 3600 };
  }

  @Delete(':filename')
  async delete(
    @CurrentUser() user: JwtPayload,
    @Param('filename') filename: string
  ) {
    await this.documents.deleteDocument(user.sub, filename);
    return { message: 'Document deleted' };
  }
}
```

## Storage Bucket Setup

Before using the storage service, create buckets in Supabase:

1. Go to **Storage** in your Supabase dashboard
2. Create a new bucket (e.g., `avatars`, `documents`)
3. Configure bucket settings:
   - **Public bucket**: Files accessible via public URL
   - **Private bucket**: Requires signed URLs or authentication
4. Set up Row Level Security (RLS) policies for access control

## Best Practices

1. **Organize files by user** - Use `userId/filename` pattern
2. **Validate file types** - Check MIME types before upload
3. **Limit file sizes** - Enforce maximum file size
4. **Use signed URLs** for private files
5. **Set appropriate cache headers** for performance
6. **Clean up unused files** regularly
7. **Use upsert carefully** - Only when you want to replace existing files
8. **Handle errors** - Wrap storage calls in try-catch blocks

## Security Considerations

1. **Never trust client input** - Validate all file uploads
2. **Use private buckets** for sensitive data
3. **Implement RLS policies** to control access
4. **Set short expiration** for signed URLs (1-24 hours)
5. **Sanitize file names** to prevent path traversal
6. **Limit file types** based on your requirements

## Error Handling

```typescript
try {
  await this.storage.uploadFile('bucket', 'path', file);
} catch (error) {
  if (error.message.includes('already exists')) {
    // Handle duplicate file
  } else if (error.message.includes('size')) {
    // Handle file too large
  } else {
    // Handle other errors
  }
}
```

## License

MIT
