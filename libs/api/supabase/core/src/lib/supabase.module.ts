import { DynamicModule, Module, Provider, InjectionToken, OptionalFactoryDependency } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { SUPABASE_CLIENT, SUPABASE_CONFIG } from './supabase.constants';
import { SupabaseConfig } from './interfaces';

/**
 * Options for asynchronous Supabase module configuration
 */
export interface SupabaseAsyncOptions {
  /**
   * Factory function that returns Supabase configuration
   */
  useFactory: (...args: unknown[]) => Promise<SupabaseConfig> | SupabaseConfig;
  /**
   * Dependencies to inject into the factory function
   */
  inject?: (InjectionToken | OptionalFactoryDependency)[];
}

/**
 * Supabase module for NestJS
 * Provides dynamic configuration for Supabase client
 */
@Module({})
export class SupabaseModule {
  /**
   * Register the Supabase module with synchronous configuration
   * @param config - Supabase configuration
   * @returns Dynamic module
   */
  static forRoot(config: SupabaseConfig): DynamicModule {
    return {
      module: SupabaseModule,
      providers: [
        {
          provide: SUPABASE_CONFIG,
          useValue: config,
        },
        SupabaseService,
        {
          provide: SUPABASE_CLIENT,
          useFactory: (supabaseService: SupabaseService) =>
            supabaseService.getClient(),
          inject: [SupabaseService],
        },
      ],
      exports: [SupabaseService, SUPABASE_CLIENT, SUPABASE_CONFIG],
      global: true,
    };
  }

  /**
   * Register the Supabase module with asynchronous configuration
   * @param options - Async configuration options
   * @returns Dynamic module
   */
  static forRootAsync(options: SupabaseAsyncOptions): DynamicModule {
    const configProvider: Provider = {
      provide: SUPABASE_CONFIG,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };

    return {
      module: SupabaseModule,
      providers: [
        configProvider,
        SupabaseService,
        {
          provide: SUPABASE_CLIENT,
          useFactory: (supabaseService: SupabaseService) =>
            supabaseService.getClient(),
          inject: [SupabaseService],
        },
      ],
      exports: [SupabaseService, SUPABASE_CLIENT, SUPABASE_CONFIG],
      global: true,
    };
  }
}
