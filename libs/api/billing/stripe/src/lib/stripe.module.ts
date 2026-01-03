import {
  DynamicModule,
  Module,
  Provider,
  OnModuleInit,
  Inject,
  Logger,
  Optional,
} from '@nestjs/common';
import Stripe from 'stripe';
import { STRIPE_CLIENT, STRIPE_MODULE_OPTIONS } from './stripe.constants';
import {
  StripeModuleOptions,
  StripeModuleAsyncOptions,
} from './interfaces/stripe-module-options.interface';
import { StripePlansService } from './services/stripe-plans.service';
import { StripeCustomerService } from './services/stripe-customer.service';
import { StripeSubscriptionService } from './services/stripe-subscription.service';
import { StripePaymentMethodService } from './services/stripe-payment-method.service';
import { StripeWebhookService } from './services/stripe-webhook.service';
import { StripeWebhookController } from './controllers/stripe-webhook.controller';
import { StripeWebhookGuard } from './guards/stripe-webhook.guard';

@Module({})
export class StripeModule implements OnModuleInit {
  private readonly logger = new Logger(StripeModule.name);

  constructor(
    @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
    @Inject(STRIPE_MODULE_OPTIONS)
    private readonly options: StripeModuleOptions,
    @Optional() private readonly plansService?: StripePlansService
  ) {}

  async onModuleInit() {
    try {
      await this.stripe.balance.retrieve();
      this.logger.log('Stripe connection verified');
    } catch (error) {
      this.logger.error('Failed to connect to Stripe', error);
      throw error;
    }

    if (this.options.plans && this.options.plans.length > 0 && this.plansService) {
      this.logger.log(
        `Syncing ${this.options.plans.length} subscription plans...`
      );
      const result = await this.plansService.syncPlans(this.options.plans);
      this.logger.log(
        `Plans sync complete: ${result.plans.length} plans available`
      );
    }
  }

  private static getProviders(): Provider[] {
    return [
      StripePlansService,
      StripeCustomerService,
      StripeSubscriptionService,
      StripePaymentMethodService,
      StripeWebhookService,
      StripeWebhookGuard,
    ];
  }

  private static getExports(): (string | symbol | Provider)[] {
    return [
      STRIPE_CLIENT,
      STRIPE_MODULE_OPTIONS,
      StripePlansService,
      StripeCustomerService,
      StripeSubscriptionService,
      StripePaymentMethodService,
      StripeWebhookService,
    ];
  }

  static forRoot(options: StripeModuleOptions): DynamicModule {
    const stripeClientProvider: Provider = {
      provide: STRIPE_CLIENT,
      useFactory: (): Stripe => {
        return new Stripe(options.apiKey, {
          apiVersion:
            (options.apiVersion as Stripe.LatestApiVersion) ||
            '2024-12-18.acacia',
        });
      },
    };

    const optionsProvider: Provider = {
      provide: STRIPE_MODULE_OPTIONS,
      useValue: options,
    };

    return {
      module: StripeModule,
      controllers: [StripeWebhookController],
      providers: [
        stripeClientProvider,
        optionsProvider,
        ...this.getProviders(),
      ],
      exports: this.getExports(),
      global: true,
    };
  }

  static forRootAsync(options: StripeModuleAsyncOptions): DynamicModule {
    const stripeClientProvider: Provider = {
      provide: STRIPE_CLIENT,
      useFactory: async (...args: unknown[]): Promise<Stripe> => {
        const config = await options.useFactory(...args);
        return new Stripe(config.apiKey, {
          apiVersion:
            (config.apiVersion as Stripe.LatestApiVersion) ||
            '2024-12-18.acacia',
        });
      },
      inject: options.inject || [],
    };

    const optionsProvider: Provider = {
      provide: STRIPE_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };

    return {
      module: StripeModule,
      controllers: [StripeWebhookController],
      providers: [
        stripeClientProvider,
        optionsProvider,
        ...this.getProviders(),
      ],
      exports: this.getExports(),
      global: true,
    };
  }
}
