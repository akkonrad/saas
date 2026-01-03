import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseConfig, SupabaseModule } from '@saas/api/supabase-core';
import { SupabaseAuthModule } from '@saas/api/supabase-auth';
import { SupabaseDatabaseModule } from '@saas/api/supabase-database';
import { SupabaseStorageModule } from '@saas/api/supabase-storage';
import { StripeModule } from '@saas/api/billing-stripe';
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
    // Configure Stripe billing module
    StripeModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get<string>('STRIPE_SECRET_KEY') || '',
        webhookSecret: configService.get<string>('STRIPE_WEBHOOK_SECRET') || '',
        plans: [
          {
            productId: 'faceless_starter',
            name: 'Starter',
            description: 'Perfect for individuals getting started',
            prices: [
              { amount: 999, currency: 'usd', interval: 'month' as const },
              { amount: 9990, currency: 'usd', interval: 'year' as const },
            ],
          },
          {
            productId: 'faceless_pro',
            name: 'Pro',
            description: 'For professionals and growing teams',
            prices: [
              { amount: 2999, currency: 'usd', interval: 'month' as const },
              { amount: 29990, currency: 'usd', interval: 'year' as const },
            ],
          },
        ],
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
