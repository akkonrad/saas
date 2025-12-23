import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '@saas/api/supabase-core';

/**
 * Options for uploading files
 */
export interface UploadOptions {
  /**
   * Content type of the file
   */
  contentType?: string;
  /**
   * Cache control header
   */
  cacheControl?: string;
  /**
   * Whether to overwrite existing files
   */
  upsert?: boolean;
}

/**
 * Storage service for Supabase file operations
 * Provides methods for uploading, downloading, and managing files
 */
@Injectable()
export class SupabaseStorageService {
  constructor(@Inject(SUPABASE_CLIENT) private supabase: SupabaseClient) {}

  /**
   * Upload a file to a storage bucket
   * @param bucket - Name of the storage bucket
   * @param path - Path where the file should be stored
   * @param file - File data (Buffer, Blob, or File)
   * @param options - Upload options
   * @returns Upload result with path
   */
  async uploadFile(
    bucket: string,
    path: string,
    file: Buffer | Blob | File,
    options?: UploadOptions
  ) {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType: options?.contentType,
        cacheControl: options?.cacheControl || '3600',
        upsert: options?.upsert || false,
      });

    if (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    return data;
  }

  /**
   * Download a file from a storage bucket
   * @param bucket - Name of the storage bucket
   * @param path - Path to the file
   * @returns File data as Blob
   */
  async downloadFile(bucket: string, path: string): Promise<Blob> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .download(path);

    if (error) {
      throw new Error(`Failed to download file: ${error.message}`);
    }

    return data;
  }

  /**
   * Delete a file from a storage bucket
   * @param bucket - Name of the storage bucket
   * @param paths - Array of file paths to delete
   * @returns true if deleted successfully
   */
  async deleteFile(bucket: string, paths: string[]): Promise<boolean> {
    const { error } = await this.supabase.storage.from(bucket).remove(paths);

    if (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }

    return true;
  }

  /**
   * Get the public URL for a file
   * @param bucket - Name of the storage bucket
   * @param path - Path to the file
   * @returns Public URL
   */
  getPublicUrl(bucket: string, path: string): string {
    const { data } = this.supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  /**
   * Create a signed URL for temporary access to a file
   * @param bucket - Name of the storage bucket
   * @param path - Path to the file
   * @param expiresIn - Expiration time in seconds (default: 3600)
   * @returns Signed URL
   */
  async createSignedUrl(
    bucket: string,
    path: string,
    expiresIn = 3600
  ): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      throw new Error(`Failed to create signed URL: ${error.message}`);
    }

    return data.signedUrl;
  }

  /**
   * List all files in a bucket folder
   * @param bucket - Name of the storage bucket
   * @param path - Folder path (optional)
   * @returns Array of file objects
   */
  async listFiles(bucket: string, path?: string) {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .list(path);

    if (error) {
      throw new Error(`Failed to list files: ${error.message}`);
    }

    return data;
  }

  /**
   * Move a file to a new location within the same bucket
   * @param bucket - Name of the storage bucket
   * @param fromPath - Current file path
   * @param toPath - New file path
   * @returns Move result
   */
  async moveFile(bucket: string, fromPath: string, toPath: string) {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .move(fromPath, toPath);

    if (error) {
      throw new Error(`Failed to move file: ${error.message}`);
    }

    return data;
  }

  /**
   * Copy a file to a new location within the same bucket
   * @param bucket - Name of the storage bucket
   * @param fromPath - Source file path
   * @param toPath - Destination file path
   * @returns Copy result
   */
  async copyFile(bucket: string, fromPath: string, toPath: string) {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .copy(fromPath, toPath);

    if (error) {
      throw new Error(`Failed to copy file: ${error.message}`);
    }

    return data;
  }
}
