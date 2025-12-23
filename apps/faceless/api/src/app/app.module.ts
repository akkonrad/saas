import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseConfig, SupabaseModule } from '@saas/api/supabase-core';
import { SupabaseAuthModule } from '@saas/api/supabase-auth';
import { SupabaseDatabaseModule } from '@saas/api/supabase-database';
import { SupabaseStorageModule } from '@saas/api/supabase-storage';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    // Configure Supabase with async configuration from environment
    SupabaseModule.forRootAsync({
      useFactory: (configService: ConfigService): SupabaseConfig => ({
        url: configService.get<string>('SUPABASE_URL') || '',
        publishableKey:
          configService.get<string>('SUPABASE_PUBLISHABLE_KEY') || '',
        secretKey: configService.get<string>('SUPABASE_SECRET_KEY') || '',
      }),
      inject: [ConfigService],
    }),
    // Import authentication, database, and storage modules
    SupabaseAuthModule,
    SupabaseDatabaseModule,
    SupabaseStorageModule,
    // Application auth module
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
