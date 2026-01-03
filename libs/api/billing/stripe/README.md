# @saas/api/billing-stripe

Production-ready Stripe payments API library for NestJS with dynamic module configuration, subscription management, and webhook handling.

## Installation

The library is part of the monorepo. Ensure the Stripe SDK is installed:

```bash
npm install stripe
```

## Configuration

### Environment Variables

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Module Setup

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StripeModule } from '@saas/api/billing-stripe';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    StripeModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        apiKey: config.get<string>('STRIPE_SECRET_KEY') || '',
        webhookSecret: config.get<string>('STRIPE_WEBHOOK_SECRET') || '',
        plans: [
          {
            productId: 'starter',
            name: 'Starter Plan',
            description: 'For individuals',
            prices: [
              { amount: 999, currency: 'usd', interval: 'month' },
              { amount: 9990, currency: 'usd', interval: 'year' },
            ],
          },
        ],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

### Webhook Raw Body Parsing

Add raw body parsing for the webhook endpoint in `main.ts`:

```typescript
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Must be before setGlobalPrefix
  app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));

  app.setGlobalPrefix('api');
  await app.listen(3000);
}
```

## Services

### StripeCustomerService

```typescript
import { StripeCustomerService } from '@saas/api/billing-stripe';

@Injectable()
export class BillingService {
  constructor(private readonly customers: StripeCustomerService) {}

  async createCustomer(email: string, name?: string) {
    return this.customers.create({ email, name });
  }

  async getCustomer(customerId: string) {
    return this.customers.findById(customerId);
  }

  async findByEmail(email: string) {
    return this.customers.findByEmail(email);
  }
}
```

### StripeSubscriptionService

```typescript
import { StripeSubscriptionService } from '@saas/api/billing-stripe';

@Injectable()
export class SubscriptionService {
  constructor(private readonly subscriptions: StripeSubscriptionService) {}

  async subscribe(customerId: string, priceId: string) {
    return this.subscriptions.create({
      customerId,
      priceId,
      trialDays: 14,
    });
  }

  async cancel(subscriptionId: string) {
    return this.subscriptions.cancel(subscriptionId, false); // At period end
  }

  async cancelImmediately(subscriptionId: string) {
    return this.subscriptions.cancel(subscriptionId, true);
  }

  async upgrade(subscriptionId: string, newPriceId: string) {
    return this.subscriptions.update(subscriptionId, { priceId: newPriceId });
  }
}
```

### StripePaymentMethodService

```typescript
import { StripePaymentMethodService } from '@saas/api/billing-stripe';

@Injectable()
export class PaymentService {
  constructor(private readonly paymentMethods: StripePaymentMethodService) {}

  async attachCard(customerId: string, paymentMethodId: string) {
    return this.paymentMethods.attach({
      customerId,
      paymentMethodId,
      setAsDefault: true,
    });
  }

  async listCards(customerId: string) {
    return this.paymentMethods.listByCustomer(customerId);
  }
}
```

### StripePlansService

```typescript
import { StripePlansService } from '@saas/api/billing-stripe';

@Injectable()
export class PlansService {
  constructor(private readonly plans: StripePlansService) {}

  async getAvailablePlans() {
    return this.plans.getActivePlans();
  }
}
```

## Webhook Handling

The module includes a webhook controller at `POST /api/webhooks/stripe` with signature verification.

### Extending Webhook Handlers

Create a custom service extending `StripeWebhookService`:

```typescript
import { Injectable } from '@nestjs/common';
import { StripeWebhookService } from '@saas/api/billing-stripe';
import Stripe from 'stripe';

@Injectable()
export class CustomWebhookService extends StripeWebhookService {
  protected async handleSubscriptionCreated(subscription: Stripe.Subscription) {
    // Your custom logic
    await this.activateUserFeatures(subscription.customer as string);
  }

  protected async handlePaymentFailed(invoice: Stripe.Invoice) {
    // Your custom logic
    await this.notifyPaymentFailure(invoice.customer as string);
  }
}
```

Then provide it in your module:

```typescript
@Module({
  providers: [
    {
      provide: StripeWebhookService,
      useClass: CustomWebhookService,
    },
  ],
})
export class BillingModule {}
```

## Exported Types

All types are available from `@saas/shared/util-schema`:

```typescript
import {
  CreateCustomer,
  CustomerResponse,
  CreateSubscription,
  SubscriptionResponse,
  SubscriptionStatus,
  PlanConfig,
  AttachPaymentMethod,
  PaymentMethodResponse,
} from '@saas/shared/util-schema';
```

## API Reference

### StripeCustomerService

| Method | Description |
|--------|-------------|
| `create(data)` | Create a new customer |
| `findById(id)` | Get customer by ID |
| `findByEmail(email)` | Get customer by email |
| `update(id, data)` | Update customer |
| `delete(id)` | Delete customer |
| `list(options)` | List customers with pagination |

### StripeSubscriptionService

| Method | Description |
|--------|-------------|
| `create(data)` | Create subscription with optional trial |
| `findById(id)` | Get subscription by ID |
| `findByCustomerId(id)` | List customer's subscriptions |
| `update(id, data)` | Update subscription (upgrade/downgrade) |
| `cancel(id, immediately)` | Cancel subscription |
| `resume(id)` | Resume canceled subscription |

### StripePaymentMethodService

| Method | Description |
|--------|-------------|
| `attach(data)` | Attach payment method to customer |
| `detach(id)` | Detach payment method |
| `setDefault(customerId, paymentMethodId)` | Set default payment method |
| `listByCustomer(customerId)` | List customer's payment methods |
| `retrieve(id)` | Get payment method details |

### StripePlansService

| Method | Description |
|--------|-------------|
| `syncPlans(plans)` | Sync plans to Stripe (idempotent) |
| `getActivePlans()` | Get all active plans |

## Testing

```bash
npx nx test billing-stripe
```

## Module Boundary Tags

- `type:data-access`
- `platform:node`
- `scope:shared`
- `domain:billing`
