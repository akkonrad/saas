# 002: Stripe Payments API Library

## Overview

Build a production-ready Stripe payments API library for NestJS following the domain-driven architecture pattern. The library provides a configurable dynamic module with Stripe account setup, subscription plans management, and webhook handling with proper signature verification.

## Architecture Context

- **Library location**: `libs/api/billing/stripe/`
- **Import path**: `@saas/api/billing-stripe`
- **Tags**: `type:data-access,platform:node,scope:shared,domain:billing`
- **Pattern reference**: See `libs/api/supabase/core/` for dynamic module pattern

## Environment Variables Required

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_API_VERSION=2024-12-18.acacia  # Optional
```

---

## Tasks

### T1. Create Shared Stripe Schemas

**Status**: `pending`

**Description**:
Define Zod schemas for all Stripe-related DTOs and types in the shared library. These schemas serve as the single source of truth for validation on backend and type safety on frontend.

**Location**: `libs/shared/util-schema/src/lib/stripe.schemas.ts`

**Requirements**: None (can start immediately)

**Detailed Implementation**:

1. Create `libs/shared/util-schema/src/lib/stripe.schemas.ts`
2. Define the following Zod schemas:

```typescript
import { z } from 'zod';

// Customer schemas
export const CreateCustomerSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  metadata: z.record(z.string()).optional(),
});

export const UpdateCustomerSchema = CreateCustomerSchema.partial();

export const CustomerResponseSchema = z.object({
  id: z.string(),
  email: z.string().email().nullable(),
  name: z.string().nullable(),
  metadata: z.record(z.string()),
  created: z.number(),
  deleted: z.boolean().optional(),
});

// Price/Product schemas
export const PriceIntervalSchema = z.enum(['day', 'week', 'month', 'year']);

export const PriceConfigSchema = z.object({
  amount: z.number().int().positive(),
  currency: z.string().length(3).default('usd'),
  interval: PriceIntervalSchema,
  intervalCount: z.number().int().positive().default(1),
});

export const PlanConfigSchema = z.object({
  productId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  metadata: z.record(z.string()).optional(),
  prices: z.array(PriceConfigSchema),
});

// Subscription schemas
export const SubscriptionStatusSchema = z.enum([
  'active',
  'canceled',
  'incomplete',
  'incomplete_expired',
  'past_due',
  'paused',
  'trialing',
  'unpaid',
]);

export const CreateSubscriptionSchema = z.object({
  customerId: z.string(),
  priceId: z.string(),
  paymentMethodId: z.string().optional(),
  trialDays: z.number().int().positive().optional(),
  metadata: z.record(z.string()).optional(),
});

export const UpdateSubscriptionSchema = z.object({
  priceId: z.string().optional(),
  cancelAtPeriodEnd: z.boolean().optional(),
  metadata: z.record(z.string()).optional(),
});

export const SubscriptionResponseSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  status: SubscriptionStatusSchema,
  currentPeriodStart: z.number(),
  currentPeriodEnd: z.number(),
  cancelAtPeriodEnd: z.boolean(),
  canceledAt: z.number().nullable(),
  items: z.array(z.object({
    id: z.string(),
    priceId: z.string(),
    quantity: z.number(),
  })),
  metadata: z.record(z.string()),
});

// Payment Method schemas
export const PaymentMethodTypeSchema = z.enum(['card', 'sepa_debit', 'us_bank_account']);

export const AttachPaymentMethodSchema = z.object({
  paymentMethodId: z.string(),
  customerId: z.string(),
  setAsDefault: z.boolean().default(false),
});

// Webhook schemas
export const WebhookEventTypeSchema = z.enum([
  'customer.created',
  'customer.updated',
  'customer.deleted',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
  'payment_method.attached',
  'payment_method.detached',
]);

export const WebhookEventSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.object({
    object: z.record(z.unknown()),
  }),
  created: z.number(),
  livemode: z.boolean(),
});

// Export TypeScript types
export type CreateCustomer = z.infer<typeof CreateCustomerSchema>;
export type UpdateCustomer = z.infer<typeof UpdateCustomerSchema>;
export type CustomerResponse = z.infer<typeof CustomerResponseSchema>;
export type PriceInterval = z.infer<typeof PriceIntervalSchema>;
export type PriceConfig = z.infer<typeof PriceConfigSchema>;
export type PlanConfig = z.infer<typeof PlanConfigSchema>;
export type SubscriptionStatus = z.infer<typeof SubscriptionStatusSchema>;
export type CreateSubscription = z.infer<typeof CreateSubscriptionSchema>;
export type UpdateSubscription = z.infer<typeof UpdateSubscriptionSchema>;
export type SubscriptionResponse = z.infer<typeof SubscriptionResponseSchema>;
export type PaymentMethodType = z.infer<typeof PaymentMethodTypeSchema>;
export type AttachPaymentMethod = z.infer<typeof AttachPaymentMethodSchema>;
export type WebhookEventType = z.infer<typeof WebhookEventTypeSchema>;
export type WebhookEvent = z.infer<typeof WebhookEventSchema>;
```

3. Export from `libs/shared/util-schema/src/index.ts`:
```typescript
export * from './lib/stripe.schemas';
```

**Artifacts**:
- `T1.stripe-schemas`: `libs/shared/util-schema/src/lib/stripe.schemas.ts`
- `T1.stripe-types`: TypeScript types exported via `z.infer`

**Acceptance Criteria**:
- [ ] All schemas defined with proper Zod validation
- [ ] TypeScript types exported for each schema
- [ ] Schemas exported from index.ts
- [ ] No runtime dependencies on Stripe SDK

---

### T2. Generate billing-stripe Library

**Status**: `pending`

**Description**:
Create the NestJS library structure using Nx generator with proper tags and module boundary configuration.

**Requirements**: None (can start immediately, parallel with T1)

**Detailed Implementation**:

1. Run the Nx generator:
```bash
npx nx generate @nx/nest:lib \
  --name=billing-stripe \
  --directory=libs/api/billing/stripe \
  --importPath=@saas/api/billing-stripe \
  --tags=type:data-access,platform:node,scope:shared,domain:billing \
  --strict \
  --unitTestRunner=jest
```

2. Verify `libs/api/billing/stripe/project.json` contains:
```json
{
  "name": "api-billing-stripe",
  "tags": ["type:data-access", "platform:node", "scope:shared", "domain:billing"]
}
```

3. Verify `tsconfig.base.json` has path mapping:
```json
{
  "compilerOptions": {
    "paths": {
      "@saas/api/billing-stripe": ["libs/api/billing/stripe/src/index.ts"]
    }
  }
}
```

4. Create folder structure:
```
libs/api/billing/stripe/
├── src/
│   ├── index.ts
│   └── lib/
│       ├── controllers/
│       ├── decorators/
│       ├── guards/
│       ├── interfaces/
│       ├── services/
│       └── stripe.module.ts
├── project.json
├── tsconfig.json
├── tsconfig.lib.json
├── tsconfig.spec.json
├── jest.config.ts
└── README.md
```

5. Install Stripe SDK (if not already installed):
```bash
npm install stripe
```

**Artifacts**:
- `T2.library-structure`: `libs/api/billing/stripe/`
- `T2.project-config`: `libs/api/billing/stripe/project.json`
- `T2.tsconfig-path`: Updated `tsconfig.base.json`

**Acceptance Criteria**:
- [ ] Library generated successfully
- [ ] Tags configured correctly in project.json
- [ ] Import path `@saas/api/billing-stripe` works
- [ ] Stripe SDK installed
- [ ] Folder structure created

---

### T3. Implement Stripe Configuration Module

**Status**: `pending`

**Description**:
Create NestJS dynamic module with `forRoot`/`forRootAsync` pattern for Stripe client initialization. Follow the existing pattern from `SupabaseCoreModule`.

**Location**: `libs/api/billing/stripe/src/lib/`

**Requirements**: T2.library-structure

**Reference Pattern**: `libs/api/supabase/core/src/lib/supabase-core.module.ts`

**Detailed Implementation**:

1. Create `libs/api/billing/stripe/src/lib/stripe.constants.ts`:
```typescript
export const STRIPE_CLIENT = 'STRIPE_CLIENT';
export const STRIPE_MODULE_OPTIONS = 'STRIPE_MODULE_OPTIONS';
```

2. Create `libs/api/billing/stripe/src/lib/interfaces/stripe-module-options.ts`:
```typescript
import { PlanConfig } from '@saas/shared/util-schema';

export interface StripeModuleOptions {
  apiKey: string;
  webhookSecret: string;
  apiVersion?: string;
  plans?: PlanConfig[];
}

export interface StripeModuleAsyncOptions {
  useFactory: (...args: unknown[]) => Promise<StripeModuleOptions> | StripeModuleOptions;
  inject?: unknown[];
}
```

3. Create `libs/api/billing/stripe/src/lib/stripe.module.ts`:
```typescript
import { DynamicModule, Module, OnModuleInit, Inject, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { STRIPE_CLIENT, STRIPE_MODULE_OPTIONS } from './stripe.constants';
import { StripeModuleOptions, StripeModuleAsyncOptions } from './interfaces/stripe-module-options';

@Module({})
export class StripeModule implements OnModuleInit {
  private readonly logger = new Logger(StripeModule.name);

  constructor(
    @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
    @Inject(STRIPE_MODULE_OPTIONS) private readonly options: StripeModuleOptions,
  ) {}

  async onModuleInit() {
    // Verify connection
    try {
      await this.stripe.balance.retrieve();
      this.logger.log('Stripe connection verified');
    } catch (error) {
      this.logger.error('Failed to connect to Stripe', error);
      throw error;
    }

    // Initialize plans if configured (T11 will expand this)
  }

  static forRoot(options: StripeModuleOptions): DynamicModule {
    const stripeProvider = {
      provide: STRIPE_CLIENT,
      useFactory: (): Stripe => {
        return new Stripe(options.apiKey, {
          apiVersion: options.apiVersion as Stripe.LatestApiVersion || '2024-12-18.acacia',
        });
      },
    };

    const optionsProvider = {
      provide: STRIPE_MODULE_OPTIONS,
      useValue: options,
    };

    return {
      module: StripeModule,
      providers: [stripeProvider, optionsProvider],
      exports: [stripeProvider, optionsProvider],
      global: true,
    };
  }

  static forRootAsync(options: StripeModuleAsyncOptions): DynamicModule {
    const stripeProvider = {
      provide: STRIPE_CLIENT,
      useFactory: async (...args: unknown[]): Promise<Stripe> => {
        const config = await options.useFactory(...args);
        return new Stripe(config.apiKey, {
          apiVersion: config.apiVersion as Stripe.LatestApiVersion || '2024-12-18.acacia',
        });
      },
      inject: options.inject || [],
    };

    const optionsProvider = {
      provide: STRIPE_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };

    return {
      module: StripeModule,
      providers: [stripeProvider, optionsProvider],
      exports: [stripeProvider, optionsProvider],
      global: true,
    };
  }
}
```

**Artifacts**:
- `T3.module-options`: `libs/api/billing/stripe/src/lib/interfaces/stripe-module-options.ts`
- `T3.stripe-module`: `libs/api/billing/stripe/src/lib/stripe.module.ts`
- `T3.stripe-constants`: `libs/api/billing/stripe/src/lib/stripe.constants.ts`

**Acceptance Criteria**:
- [ ] `forRoot` method accepts StripeModuleOptions
- [ ] `forRootAsync` method accepts factory function
- [ ] STRIPE_CLIENT token provides Stripe instance
- [ ] Module is global (single instance across app)
- [ ] Connection verification on module init

---

### T4. Create Stripe Plans Configuration Service

**Status**: `pending`

**Description**:
Build a service to initialize and manage Stripe products/prices on module startup. The service supports idempotent plan synchronization using metadata lookup.

**Location**: `libs/api/billing/stripe/src/lib/services/stripe-plans.service.ts`

**Requirements**: T1.stripe-schemas, T3.stripe-module

**Detailed Implementation**:

1. Create `libs/api/billing/stripe/src/lib/interfaces/plans-config.ts`:
```typescript
export interface SyncedPlan {
  productId: string;
  stripeProductId: string;
  prices: {
    interval: string;
    stripePriceId: string;
    amount: number;
    currency: string;
  }[];
}

export interface PlansSyncResult {
  created: number;
  updated: number;
  unchanged: number;
  plans: SyncedPlan[];
}
```

2. Create `libs/api/billing/stripe/src/lib/services/stripe-plans.service.ts`:
```typescript
import { Injectable, Inject, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { STRIPE_CLIENT } from '../stripe.constants';
import { PlanConfig } from '@saas/shared/util-schema';
import { SyncedPlan, PlansSyncResult } from '../interfaces/plans-config';

@Injectable()
export class StripePlansService {
  private readonly logger = new Logger(StripePlansService.name);

  constructor(@Inject(STRIPE_CLIENT) private readonly stripe: Stripe) {}

  async syncPlans(plans: PlanConfig[]): Promise<PlansSyncResult> {
    const result: PlansSyncResult = {
      created: 0,
      updated: 0,
      unchanged: 0,
      plans: [],
    };

    for (const plan of plans) {
      const syncedPlan = await this.syncPlan(plan);
      result.plans.push(syncedPlan);
    }

    this.logger.log(`Plans synced: ${result.created} created, ${result.updated} updated, ${result.unchanged} unchanged`);
    return result;
  }

  private async syncPlan(plan: PlanConfig): Promise<SyncedPlan> {
    // Find or create product by metadata.productId
    let product = await this.findProductByMetadata(plan.productId);

    if (!product) {
      product = await this.stripe.products.create({
        name: plan.name,
        description: plan.description,
        metadata: { productId: plan.productId, ...plan.metadata },
      });
      this.logger.log(`Created product: ${plan.name} (${product.id})`);
    }

    const syncedPrices = [];
    for (const priceConfig of plan.prices) {
      const price = await this.syncPrice(product.id, plan.productId, priceConfig);
      syncedPrices.push({
        interval: priceConfig.interval,
        stripePriceId: price.id,
        amount: priceConfig.amount,
        currency: priceConfig.currency,
      });
    }

    return {
      productId: plan.productId,
      stripeProductId: product.id,
      prices: syncedPrices,
    };
  }

  private async findProductByMetadata(productId: string): Promise<Stripe.Product | null> {
    const products = await this.stripe.products.search({
      query: `metadata['productId']:'${productId}'`,
    });
    return products.data[0] || null;
  }

  private async syncPrice(
    stripeProductId: string,
    productId: string,
    priceConfig: PlanConfig['prices'][0],
  ): Promise<Stripe.Price> {
    // Search for existing price with matching metadata
    const existingPrices = await this.stripe.prices.search({
      query: `product:'${stripeProductId}' AND metadata['interval']:'${priceConfig.interval}' AND metadata['productId']:'${productId}'`,
    });

    if (existingPrices.data[0]) {
      return existingPrices.data[0];
    }

    // Create new price
    return this.stripe.prices.create({
      product: stripeProductId,
      unit_amount: priceConfig.amount,
      currency: priceConfig.currency,
      recurring: {
        interval: priceConfig.interval,
        interval_count: priceConfig.intervalCount || 1,
      },
      metadata: {
        productId,
        interval: priceConfig.interval,
      },
    });
  }

  async getActivePlans(): Promise<SyncedPlan[]> {
    const products = await this.stripe.products.list({ active: true });
    const plans: SyncedPlan[] = [];

    for (const product of products.data) {
      if (!product.metadata.productId) continue;

      const prices = await this.stripe.prices.list({
        product: product.id,
        active: true,
      });

      plans.push({
        productId: product.metadata.productId,
        stripeProductId: product.id,
        prices: prices.data.map(p => ({
          interval: p.recurring?.interval || 'month',
          stripePriceId: p.id,
          amount: p.unit_amount || 0,
          currency: p.currency,
        })),
      });
    }

    return plans;
  }
}
```

**Artifacts**:
- `T4.plans-config-interface`: `libs/api/billing/stripe/src/lib/interfaces/plans-config.ts`
- `T4.plans-service`: `libs/api/billing/stripe/src/lib/services/stripe-plans.service.ts`

**Acceptance Criteria**:
- [ ] Service finds existing products by metadata
- [ ] Service creates new products if not found
- [ ] Prices synced with idempotency via metadata
- [ ] getActivePlans returns current plans
- [ ] Proper logging of sync operations

---

### T5. Implement Customer Management Service

**Status**: `pending`

**Description**:
Create service for Stripe customer CRUD operations with Zod validation.

**Location**: `libs/api/billing/stripe/src/lib/services/stripe-customer.service.ts`

**Requirements**: T1.stripe-schemas, T3.stripe-module

**Detailed Implementation**:

```typescript
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { STRIPE_CLIENT } from '../stripe.constants';
import {
  CreateCustomer,
  UpdateCustomer,
  CustomerResponse,
  CreateCustomerSchema,
  UpdateCustomerSchema,
} from '@saas/shared/util-schema';

@Injectable()
export class StripeCustomerService {
  constructor(@Inject(STRIPE_CLIENT) private readonly stripe: Stripe) {}

  async create(data: CreateCustomer): Promise<CustomerResponse> {
    const validated = CreateCustomerSchema.parse(data);

    const customer = await this.stripe.customers.create({
      email: validated.email,
      name: validated.name,
      metadata: validated.metadata,
    });

    return this.mapCustomerResponse(customer);
  }

  async findById(customerId: string): Promise<CustomerResponse> {
    const customer = await this.stripe.customers.retrieve(customerId);

    if ((customer as Stripe.DeletedCustomer).deleted) {
      throw new NotFoundException(`Customer ${customerId} has been deleted`);
    }

    return this.mapCustomerResponse(customer as Stripe.Customer);
  }

  async findByEmail(email: string): Promise<CustomerResponse | null> {
    const customers = await this.stripe.customers.list({ email, limit: 1 });

    if (customers.data.length === 0) {
      return null;
    }

    return this.mapCustomerResponse(customers.data[0]);
  }

  async update(customerId: string, data: UpdateCustomer): Promise<CustomerResponse> {
    const validated = UpdateCustomerSchema.parse(data);

    const customer = await this.stripe.customers.update(customerId, {
      email: validated.email,
      name: validated.name,
      metadata: validated.metadata,
    });

    return this.mapCustomerResponse(customer);
  }

  async delete(customerId: string): Promise<{ deleted: boolean }> {
    const result = await this.stripe.customers.del(customerId);
    return { deleted: result.deleted };
  }

  async list(options?: { limit?: number; startingAfter?: string }): Promise<{
    customers: CustomerResponse[];
    hasMore: boolean;
  }> {
    const customers = await this.stripe.customers.list({
      limit: options?.limit || 10,
      starting_after: options?.startingAfter,
    });

    return {
      customers: customers.data.map(c => this.mapCustomerResponse(c)),
      hasMore: customers.has_more,
    };
  }

  private mapCustomerResponse(customer: Stripe.Customer): CustomerResponse {
    return {
      id: customer.id,
      email: customer.email,
      name: customer.name,
      metadata: customer.metadata,
      created: customer.created,
    };
  }
}
```

**Artifacts**:
- `T5.customer-service`: `libs/api/billing/stripe/src/lib/services/stripe-customer.service.ts`

**Acceptance Criteria**:
- [ ] Create customer with Zod validation
- [ ] Find customer by ID and email
- [ ] Update customer with partial data
- [ ] Delete customer
- [ ] List customers with pagination
- [ ] Proper response mapping

---

### T6. Implement Subscription Management Service

**Status**: `pending`

**Description**:
Create service for Stripe subscription lifecycle operations.

**Location**: `libs/api/billing/stripe/src/lib/services/stripe-subscription.service.ts`

**Requirements**: T1.stripe-schemas, T3.stripe-module, T4.plans-service

**Detailed Implementation**:

```typescript
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { STRIPE_CLIENT } from '../stripe.constants';
import {
  CreateSubscription,
  UpdateSubscription,
  SubscriptionResponse,
  CreateSubscriptionSchema,
  UpdateSubscriptionSchema,
} from '@saas/shared/util-schema';

@Injectable()
export class StripeSubscriptionService {
  constructor(@Inject(STRIPE_CLIENT) private readonly stripe: Stripe) {}

  async create(data: CreateSubscription): Promise<SubscriptionResponse> {
    const validated = CreateSubscriptionSchema.parse(data);

    const subscriptionData: Stripe.SubscriptionCreateParams = {
      customer: validated.customerId,
      items: [{ price: validated.priceId }],
      metadata: validated.metadata,
    };

    if (validated.paymentMethodId) {
      subscriptionData.default_payment_method = validated.paymentMethodId;
    }

    if (validated.trialDays) {
      subscriptionData.trial_period_days = validated.trialDays;
    }

    const subscription = await this.stripe.subscriptions.create(subscriptionData);
    return this.mapSubscriptionResponse(subscription);
  }

  async findById(subscriptionId: string): Promise<SubscriptionResponse> {
    const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
    return this.mapSubscriptionResponse(subscription);
  }

  async findByCustomerId(customerId: string): Promise<SubscriptionResponse[]> {
    const subscriptions = await this.stripe.subscriptions.list({
      customer: customerId,
    });
    return subscriptions.data.map(s => this.mapSubscriptionResponse(s));
  }

  async update(subscriptionId: string, data: UpdateSubscription): Promise<SubscriptionResponse> {
    const validated = UpdateSubscriptionSchema.parse(data);
    const updateData: Stripe.SubscriptionUpdateParams = {};

    if (validated.priceId) {
      // Get current subscription to find item ID
      const current = await this.stripe.subscriptions.retrieve(subscriptionId);
      updateData.items = [{
        id: current.items.data[0].id,
        price: validated.priceId,
      }];
    }

    if (validated.cancelAtPeriodEnd !== undefined) {
      updateData.cancel_at_period_end = validated.cancelAtPeriodEnd;
    }

    if (validated.metadata) {
      updateData.metadata = validated.metadata;
    }

    const subscription = await this.stripe.subscriptions.update(subscriptionId, updateData);
    return this.mapSubscriptionResponse(subscription);
  }

  async cancel(subscriptionId: string, immediately = false): Promise<SubscriptionResponse> {
    if (immediately) {
      const subscription = await this.stripe.subscriptions.cancel(subscriptionId);
      return this.mapSubscriptionResponse(subscription);
    }

    return this.update(subscriptionId, { cancelAtPeriodEnd: true });
  }

  async resume(subscriptionId: string): Promise<SubscriptionResponse> {
    const subscription = await this.stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });
    return this.mapSubscriptionResponse(subscription);
  }

  private mapSubscriptionResponse(subscription: Stripe.Subscription): SubscriptionResponse {
    return {
      id: subscription.id,
      customerId: subscription.customer as string,
      status: subscription.status,
      currentPeriodStart: subscription.current_period_start,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at,
      items: subscription.items.data.map(item => ({
        id: item.id,
        priceId: item.price.id,
        quantity: item.quantity || 1,
      })),
      metadata: subscription.metadata,
    };
  }
}
```

**Artifacts**:
- `T6.subscription-service`: `libs/api/billing/stripe/src/lib/services/stripe-subscription.service.ts`

**Acceptance Criteria**:
- [ ] Create subscription with plan selection
- [ ] Support trial periods
- [ ] Upgrade/downgrade via price change
- [ ] Cancel immediately or at period end
- [ ] Resume canceled subscription
- [ ] List customer subscriptions

---

### T7. Create Webhook Verification Guard

**Status**: `pending`

**Description**:
Implement NestJS guard for Stripe webhook signature verification to ensure webhook authenticity.

**Location**: `libs/api/billing/stripe/src/lib/guards/`

**Requirements**: T3.stripe-module

**Detailed Implementation**:

1. Create `libs/api/billing/stripe/src/lib/decorators/stripe-event.decorator.ts`:
```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import Stripe from 'stripe';

export const StripeEvent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Stripe.Event => {
    const request = ctx.switchToHttp().getRequest();
    return request.stripeEvent;
  },
);
```

2. Create `libs/api/billing/stripe/src/lib/guards/stripe-webhook.guard.ts`:
```typescript
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
  Logger,
  RawBodyRequest,
} from '@nestjs/common';
import Stripe from 'stripe';
import { Request } from 'express';
import { STRIPE_CLIENT, STRIPE_MODULE_OPTIONS } from '../stripe.constants';
import { StripeModuleOptions } from '../interfaces/stripe-module-options';

@Injectable()
export class StripeWebhookGuard implements CanActivate {
  private readonly logger = new Logger(StripeWebhookGuard.name);

  constructor(
    @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
    @Inject(STRIPE_MODULE_OPTIONS) private readonly options: StripeModuleOptions,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RawBodyRequest<Request>>();
    const signature = request.headers['stripe-signature'] as string;

    if (!signature) {
      this.logger.warn('Missing stripe-signature header');
      throw new UnauthorizedException('Missing stripe-signature header');
    }

    const rawBody = request.rawBody;
    if (!rawBody) {
      this.logger.error('Raw body not available - ensure raw body parsing is enabled');
      throw new UnauthorizedException('Raw body not available');
    }

    try {
      const event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        this.options.webhookSecret,
      );

      // Attach verified event to request for controller access
      (request as Request & { stripeEvent: Stripe.Event }).stripeEvent = event;

      this.logger.debug(`Webhook verified: ${event.type} (${event.id})`);
      return true;
    } catch (error) {
      this.logger.warn(`Webhook signature verification failed: ${error.message}`);
      throw new UnauthorizedException('Invalid webhook signature');
    }
  }
}
```

3. Note: Requires raw body parsing in main.ts:
```typescript
// apps/faceless/api/src/main.ts
app.useGlobalPrefix('api');
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));
```

**Artifacts**:
- `T7.webhook-guard`: `libs/api/billing/stripe/src/lib/guards/stripe-webhook.guard.ts`
- `T7.webhook-decorator`: `libs/api/billing/stripe/src/lib/decorators/stripe-event.decorator.ts`

**Acceptance Criteria**:
- [ ] Guard extracts stripe-signature header
- [ ] Guard verifies signature using webhook secret
- [ ] Guard attaches parsed event to request
- [ ] Guard rejects invalid signatures with 401
- [ ] @StripeEvent decorator retrieves event in controller

---

### T8. Implement Webhook Handler Service

**Status**: `pending`

**Description**:
Create service with idempotent webhook event handlers. Idempotency prevents duplicate processing of webhook events (Stripe may retry failed webhooks).

**Location**: `libs/api/billing/stripe/src/lib/services/stripe-webhook.service.ts`

**Requirements**: T1.stripe-schemas, T5.customer-service, T6.subscription-service

**Detailed Implementation**:

1. Create `libs/api/billing/stripe/src/lib/interfaces/webhook-idempotency.ts`:
```typescript
export interface IdempotencyStore {
  has(eventId: string): Promise<boolean>;
  add(eventId: string, ttlSeconds?: number): Promise<void>;
}

export class InMemoryIdempotencyStore implements IdempotencyStore {
  private processed = new Map<string, number>();

  async has(eventId: string): Promise<boolean> {
    const expiry = this.processed.get(eventId);
    if (!expiry) return false;
    if (Date.now() > expiry) {
      this.processed.delete(eventId);
      return false;
    }
    return true;
  }

  async add(eventId: string, ttlSeconds = 86400): Promise<void> {
    this.processed.set(eventId, Date.now() + ttlSeconds * 1000);
  }
}
```

2. Create `libs/api/billing/stripe/src/lib/services/stripe-webhook.service.ts`:
```typescript
import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { IdempotencyStore, InMemoryIdempotencyStore } from '../interfaces/webhook-idempotency';

export interface WebhookHandlerResult {
  handled: boolean;
  skipped: boolean;
  eventId: string;
  eventType: string;
}

@Injectable()
export class StripeWebhookService {
  private readonly logger = new Logger(StripeWebhookService.name);
  private readonly idempotencyStore: IdempotencyStore;

  constructor() {
    // TODO: Replace with Redis-based store in production
    this.idempotencyStore = new InMemoryIdempotencyStore();
  }

  async handleEvent(event: Stripe.Event): Promise<WebhookHandlerResult> {
    // Check idempotency
    if (await this.idempotencyStore.has(event.id)) {
      this.logger.debug(`Skipping duplicate event: ${event.id}`);
      return {
        handled: false,
        skipped: true,
        eventId: event.id,
        eventType: event.type,
      };
    }

    try {
      await this.processEvent(event);
      await this.idempotencyStore.add(event.id);

      return {
        handled: true,
        skipped: false,
        eventId: event.id,
        eventType: event.type,
      };
    } catch (error) {
      this.logger.error(`Failed to process event ${event.id}: ${error.message}`);
      throw error;
    }
  }

  private async processEvent(event: Stripe.Event): Promise<void> {
    this.logger.log(`Processing event: ${event.type} (${event.id})`);

    switch (event.type) {
      case 'customer.created':
        await this.handleCustomerCreated(event.data.object as Stripe.Customer);
        break;

      case 'customer.updated':
        await this.handleCustomerUpdated(event.data.object as Stripe.Customer);
        break;

      case 'customer.deleted':
        await this.handleCustomerDeleted(event.data.object as Stripe.Customer);
        break;

      case 'customer.subscription.created':
        await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        this.logger.debug(`Unhandled event type: ${event.type}`);
    }
  }

  // Override these methods in application to add business logic
  protected async handleCustomerCreated(customer: Stripe.Customer): Promise<void> {
    this.logger.debug(`Customer created: ${customer.id}`);
  }

  protected async handleCustomerUpdated(customer: Stripe.Customer): Promise<void> {
    this.logger.debug(`Customer updated: ${customer.id}`);
  }

  protected async handleCustomerDeleted(customer: Stripe.Customer): Promise<void> {
    this.logger.debug(`Customer deleted: ${customer.id}`);
  }

  protected async handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
    this.logger.debug(`Subscription created: ${subscription.id}`);
  }

  protected async handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
    this.logger.debug(`Subscription updated: ${subscription.id} - status: ${subscription.status}`);
  }

  protected async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    this.logger.debug(`Subscription deleted: ${subscription.id}`);
  }

  protected async handlePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    this.logger.debug(`Payment succeeded: ${invoice.id}`);
  }

  protected async handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    this.logger.warn(`Payment failed: ${invoice.id}`);
  }
}
```

**Artifacts**:
- `T8.webhook-service`: `libs/api/billing/stripe/src/lib/services/stripe-webhook.service.ts`
- `T8.idempotency-interface`: `libs/api/billing/stripe/src/lib/interfaces/webhook-idempotency.ts`

**Acceptance Criteria**:
- [ ] Idempotency check prevents duplicate processing
- [ ] All key event types have handlers
- [ ] Handlers are overridable for app-specific logic
- [ ] Proper logging for debugging
- [ ] TTL-based cleanup of processed events

---

### T9. Create Webhook Controller

**Status**: `pending`

**Description**:
Implement REST controller for Stripe webhook endpoint with guard protection.

**Location**: `libs/api/billing/stripe/src/lib/controllers/stripe-webhook.controller.ts`

**Requirements**: T1.stripe-schemas, T7.webhook-guard, T8.webhook-service

**Detailed Implementation**:

```typescript
import { Controller, Post, UseGuards, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { StripeWebhookGuard } from '../guards/stripe-webhook.guard';
import { StripeEvent } from '../decorators/stripe-event.decorator';
import { StripeWebhookService, WebhookHandlerResult } from '../services/stripe-webhook.service';

@Controller('webhooks/stripe')
export class StripeWebhookController {
  private readonly logger = new Logger(StripeWebhookController.name);

  constructor(private readonly webhookService: StripeWebhookService) {}

  @Post()
  @UseGuards(StripeWebhookGuard)
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@StripeEvent() event: Stripe.Event): Promise<WebhookHandlerResult> {
    this.logger.log(`Received webhook: ${event.type} (${event.id})`);
    return this.webhookService.handleEvent(event);
  }
}
```

**Artifacts**:
- `T9.webhook-controller`: `libs/api/billing/stripe/src/lib/controllers/stripe-webhook.controller.ts`

**Acceptance Criteria**:
- [ ] POST /webhooks/stripe endpoint exists
- [ ] Guard protects endpoint
- [ ] Event passed to webhook service
- [ ] Returns 200 on success
- [ ] Proper logging

---

### T10. Create Payment Method Service

**Status**: `pending`

**Description**:
Implement service for payment method operations (attach, detach, set default, list).

**Location**: `libs/api/billing/stripe/src/lib/services/stripe-payment-method.service.ts`

**Requirements**: T1.stripe-schemas, T3.stripe-module, T5.customer-service

**Detailed Implementation**:

```typescript
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';
import { STRIPE_CLIENT } from '../stripe.constants';
import { AttachPaymentMethod, AttachPaymentMethodSchema } from '@saas/shared/util-schema';

export interface PaymentMethodResponse {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  isDefault: boolean;
}

@Injectable()
export class StripePaymentMethodService {
  constructor(@Inject(STRIPE_CLIENT) private readonly stripe: Stripe) {}

  async attach(data: AttachPaymentMethod): Promise<PaymentMethodResponse> {
    const validated = AttachPaymentMethodSchema.parse(data);

    const paymentMethod = await this.stripe.paymentMethods.attach(
      validated.paymentMethodId,
      { customer: validated.customerId },
    );

    if (validated.setAsDefault) {
      await this.setDefault(validated.customerId, validated.paymentMethodId);
    }

    return this.mapPaymentMethodResponse(paymentMethod, validated.setAsDefault);
  }

  async detach(paymentMethodId: string): Promise<{ detached: boolean }> {
    await this.stripe.paymentMethods.detach(paymentMethodId);
    return { detached: true };
  }

  async setDefault(customerId: string, paymentMethodId: string): Promise<void> {
    await this.stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
  }

  async listByCustomer(customerId: string): Promise<PaymentMethodResponse[]> {
    const customer = await this.stripe.customers.retrieve(customerId);
    const defaultPaymentMethodId =
      (customer as Stripe.Customer).invoice_settings?.default_payment_method;

    const paymentMethods = await this.stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    return paymentMethods.data.map(pm =>
      this.mapPaymentMethodResponse(pm, pm.id === defaultPaymentMethodId)
    );
  }

  async retrieve(paymentMethodId: string): Promise<PaymentMethodResponse> {
    const paymentMethod = await this.stripe.paymentMethods.retrieve(paymentMethodId);
    return this.mapPaymentMethodResponse(paymentMethod, false);
  }

  private mapPaymentMethodResponse(
    pm: Stripe.PaymentMethod,
    isDefault: boolean,
  ): PaymentMethodResponse {
    const response: PaymentMethodResponse = {
      id: pm.id,
      type: pm.type,
      isDefault,
    };

    if (pm.card) {
      response.card = {
        brand: pm.card.brand,
        last4: pm.card.last4,
        expMonth: pm.card.exp_month,
        expYear: pm.card.exp_year,
      };
    }

    return response;
  }
}
```

**Artifacts**:
- `T10.payment-method-service`: `libs/api/billing/stripe/src/lib/services/stripe-payment-method.service.ts`

**Acceptance Criteria**:
- [ ] Attach payment method to customer
- [ ] Detach payment method
- [ ] Set default payment method
- [ ] List customer payment methods
- [ ] Card details mapped properly

---

### T11. Implement Module Initialization Lifecycle

**Status**: `pending`

**Description**:
Enhance the Stripe module with OnModuleInit hook to initialize plans on startup.

**Location**: Update `libs/api/billing/stripe/src/lib/stripe.module.ts`

**Requirements**: T3.stripe-module, T4.plans-service

**Detailed Implementation**:

Update `stripe.module.ts`:
```typescript
import { DynamicModule, Module, OnModuleInit, Inject, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { STRIPE_CLIENT, STRIPE_MODULE_OPTIONS } from './stripe.constants';
import { StripeModuleOptions, StripeModuleAsyncOptions } from './interfaces/stripe-module-options';
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
    @Inject(STRIPE_MODULE_OPTIONS) private readonly options: StripeModuleOptions,
    private readonly plansService: StripePlansService,
  ) {}

  async onModuleInit() {
    // Verify Stripe connection
    try {
      await this.stripe.balance.retrieve();
      this.logger.log('Stripe connection verified');
    } catch (error) {
      this.logger.error('Failed to connect to Stripe', error);
      throw error;
    }

    // Initialize plans if configured
    if (this.options.plans && this.options.plans.length > 0) {
      this.logger.log(`Syncing ${this.options.plans.length} subscription plans...`);
      const result = await this.plansService.syncPlans(this.options.plans);
      this.logger.log(`Plans sync complete: ${result.plans.length} plans available`);
    }
  }

  static forRoot(options: StripeModuleOptions): DynamicModule {
    return this.createModule(options);
  }

  static forRootAsync(options: StripeModuleAsyncOptions): DynamicModule {
    return this.createAsyncModule(options);
  }

  private static createModule(options: StripeModuleOptions): DynamicModule {
    const stripeProvider = {
      provide: STRIPE_CLIENT,
      useFactory: (): Stripe => {
        return new Stripe(options.apiKey, {
          apiVersion: options.apiVersion as Stripe.LatestApiVersion || '2024-12-18.acacia',
        });
      },
    };

    const optionsProvider = {
      provide: STRIPE_MODULE_OPTIONS,
      useValue: options,
    };

    return {
      module: StripeModule,
      controllers: [StripeWebhookController],
      providers: [
        stripeProvider,
        optionsProvider,
        StripePlansService,
        StripeCustomerService,
        StripeSubscriptionService,
        StripePaymentMethodService,
        StripeWebhookService,
        StripeWebhookGuard,
      ],
      exports: [
        stripeProvider,
        optionsProvider,
        StripePlansService,
        StripeCustomerService,
        StripeSubscriptionService,
        StripePaymentMethodService,
        StripeWebhookService,
      ],
      global: true,
    };
  }

  private static createAsyncModule(options: StripeModuleAsyncOptions): DynamicModule {
    const stripeProvider = {
      provide: STRIPE_CLIENT,
      useFactory: async (...args: unknown[]): Promise<Stripe> => {
        const config = await options.useFactory(...args);
        return new Stripe(config.apiKey, {
          apiVersion: config.apiVersion as Stripe.LatestApiVersion || '2024-12-18.acacia',
        });
      },
      inject: options.inject || [],
    };

    const optionsProvider = {
      provide: STRIPE_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };

    return {
      module: StripeModule,
      controllers: [StripeWebhookController],
      providers: [
        stripeProvider,
        optionsProvider,
        StripePlansService,
        StripeCustomerService,
        StripeSubscriptionService,
        StripePaymentMethodService,
        StripeWebhookService,
        StripeWebhookGuard,
      ],
      exports: [
        stripeProvider,
        optionsProvider,
        StripePlansService,
        StripeCustomerService,
        StripeSubscriptionService,
        StripePaymentMethodService,
        StripeWebhookService,
      ],
      global: true,
    };
  }
}
```

**Artifacts**:
- `T11.module-lifecycle`: Updated `libs/api/billing/stripe/src/lib/stripe.module.ts`

**Acceptance Criteria**:
- [ ] Connection verified on startup
- [ ] Plans synced if configured
- [ ] All services registered
- [ ] All services exported
- [ ] Webhook controller included

---

### T12. Create Comprehensive Module Exports

**Status**: `pending`

**Description**:
Export all public APIs via index.ts for clean external consumption.

**Location**: `libs/api/billing/stripe/src/index.ts`

**Requirements**: All service tasks (T3-T11)

**Detailed Implementation**:

```typescript
// Module
export { StripeModule } from './lib/stripe.module';

// Constants
export { STRIPE_CLIENT, STRIPE_MODULE_OPTIONS } from './lib/stripe.constants';

// Interfaces
export { StripeModuleOptions, StripeModuleAsyncOptions } from './lib/interfaces/stripe-module-options';
export { SyncedPlan, PlansSyncResult } from './lib/interfaces/plans-config';
export { IdempotencyStore, InMemoryIdempotencyStore } from './lib/interfaces/webhook-idempotency';

// Services
export { StripePlansService } from './lib/services/stripe-plans.service';
export { StripeCustomerService } from './lib/services/stripe-customer.service';
export { StripeSubscriptionService } from './lib/services/stripe-subscription.service';
export { StripePaymentMethodService, PaymentMethodResponse } from './lib/services/stripe-payment-method.service';
export { StripeWebhookService, WebhookHandlerResult } from './lib/services/stripe-webhook.service';

// Guards & Decorators
export { StripeWebhookGuard } from './lib/guards/stripe-webhook.guard';
export { StripeEvent } from './lib/decorators/stripe-event.decorator';
```

**Artifacts**:
- `T12.module-exports`: `libs/api/billing/stripe/src/index.ts`

**Acceptance Criteria**:
- [ ] All public types exported
- [ ] All services exported
- [ ] Guards and decorators exported
- [ ] Clean API surface

---

### T13. Add Integration to face-api Application

**Status**: `pending`

**Description**:
Integrate the Stripe module into the Faceless API application with configuration.

**Location**: `apps/faceless/api/`

**Requirements**: T12.module-exports

**Detailed Implementation**:

1. Update `apps/faceless/api/src/app/app.module.ts`:
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SupabaseCoreModule } from '@saas/api/supabase-core';
import { StripeModule } from '@saas/api/billing-stripe';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SupabaseCoreModule.forRoot({
      supabaseUrl: process.env['SUPABASE_URL'] || '',
      supabaseKey: process.env['SUPABASE_SERVICE_ROLE'] || '',
    }),
    StripeModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        apiKey: config.get<string>('STRIPE_SECRET_KEY', ''),
        webhookSecret: config.get<string>('STRIPE_WEBHOOK_SECRET', ''),
        plans: [
          {
            productId: 'faceless_starter',
            name: 'Starter',
            description: 'Perfect for individuals getting started',
            prices: [
              { amount: 999, currency: 'usd', interval: 'month' },
              { amount: 9990, currency: 'usd', interval: 'year' },
            ],
          },
          {
            productId: 'faceless_pro',
            name: 'Pro',
            description: 'For professionals and growing teams',
            prices: [
              { amount: 2999, currency: 'usd', interval: 'month' },
              { amount: 29990, currency: 'usd', interval: 'year' },
            ],
          },
        ],
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

2. Update `apps/faceless/api/src/main.ts` for raw body parsing:
```typescript
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';

  // Raw body parsing for Stripe webhooks (must be before other middleware)
  app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));

  app.setGlobalPrefix(globalPrefix);

  const port = process.env.PORT || 3020;
  await app.listen(port);
  Logger.log(`Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
```

3. Create/Update `apps/faceless/api/.env.example`:
```bash
# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE=eyJ...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Artifacts**:
- `T13.app-integration`: `apps/faceless/api/src/app/app.module.ts`
- `T13.main-update`: `apps/faceless/api/src/main.ts`
- `T13.env-example`: `apps/faceless/api/.env.example`

**Acceptance Criteria**:
- [ ] StripeModule configured in AppModule
- [ ] Raw body parsing enabled for webhooks
- [ ] Environment variables documented
- [ ] Plans configured
- [ ] Application starts without errors

---

### T14. Create Unit Tests for Services

**Status**: `pending`

**Description**:
Implement Jest unit tests for all services with mocked Stripe client.

**Location**: `libs/api/billing/stripe/src/lib/services/*.spec.ts`

**Requirements**: T4, T5, T6, T8, T10 (all services)

**Detailed Implementation**:

Create test files with mocked Stripe client:

1. `stripe-customer.service.spec.ts`:
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { StripeCustomerService } from './stripe-customer.service';
import { STRIPE_CLIENT } from '../stripe.constants';

describe('StripeCustomerService', () => {
  let service: StripeCustomerService;
  let mockStripe: any;

  beforeEach(async () => {
    mockStripe = {
      customers: {
        create: jest.fn(),
        retrieve: jest.fn(),
        update: jest.fn(),
        del: jest.fn(),
        list: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StripeCustomerService,
        { provide: STRIPE_CLIENT, useValue: mockStripe },
      ],
    }).compile();

    service = module.get<StripeCustomerService>(StripeCustomerService);
  });

  describe('create', () => {
    it('should create a customer', async () => {
      const mockCustomer = {
        id: 'cus_123',
        email: 'test@example.com',
        name: 'Test User',
        metadata: {},
        created: 1234567890,
      };
      mockStripe.customers.create.mockResolvedValue(mockCustomer);

      const result = await service.create({ email: 'test@example.com', name: 'Test User' });

      expect(result.id).toBe('cus_123');
      expect(result.email).toBe('test@example.com');
    });

    it('should throw on invalid email', async () => {
      await expect(service.create({ email: 'invalid' })).rejects.toThrow();
    });
  });
});
```

2. `stripe-webhook.service.spec.ts`:
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { StripeWebhookService } from './stripe-webhook.service';
import Stripe from 'stripe';

describe('StripeWebhookService', () => {
  let service: StripeWebhookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StripeWebhookService],
    }).compile();

    service = module.get<StripeWebhookService>(StripeWebhookService);
  });

  describe('handleEvent', () => {
    it('should process new events', async () => {
      const event = {
        id: 'evt_123',
        type: 'customer.created',
        data: { object: { id: 'cus_123' } },
        created: 1234567890,
        livemode: false,
      } as Stripe.Event;

      const result = await service.handleEvent(event);

      expect(result.handled).toBe(true);
      expect(result.skipped).toBe(false);
    });

    it('should skip duplicate events (idempotency)', async () => {
      const event = {
        id: 'evt_duplicate',
        type: 'customer.created',
        data: { object: { id: 'cus_123' } },
        created: 1234567890,
        livemode: false,
      } as Stripe.Event;

      await service.handleEvent(event);
      const result = await service.handleEvent(event);

      expect(result.handled).toBe(false);
      expect(result.skipped).toBe(true);
    });
  });
});
```

**Artifacts**:
- `T14.customer-tests`: `libs/api/billing/stripe/src/lib/services/stripe-customer.service.spec.ts`
- `T14.subscription-tests`: `libs/api/billing/stripe/src/lib/services/stripe-subscription.service.spec.ts`
- `T14.webhook-tests`: `libs/api/billing/stripe/src/lib/services/stripe-webhook.service.spec.ts`
- `T14.plans-tests`: `libs/api/billing/stripe/src/lib/services/stripe-plans.service.spec.ts`
- `T14.payment-method-tests`: `libs/api/billing/stripe/src/lib/services/stripe-payment-method.service.spec.ts`

**Acceptance Criteria**:
- [ ] All services have test files
- [ ] Stripe client properly mocked
- [ ] Idempotency tested for webhooks
- [ ] Validation errors tested
- [ ] Tests pass: `npx nx test api-billing-stripe`

---

## Dependency Graph

```
T1 (schemas) ─────────┬──────────────────────────────────────────┐
                      │                                          │
T2 (generate lib) ────┼─► T3 (module) ─┬─► T4 (plans) ──────────┼─► T11 (lifecycle)
                      │                │                         │        │
                      │                ├─► T5 (customer) ────────┤        │
                      │                │                         │        │
                      │                ├─► T6 (subscription) ◄───┤        │
                      │                │                         │        │
                      │                ├─► T7 (guard) ───────────┼────────┤
                      │                │                         │        │
                      │                └─► T10 (payment) ────────┤        │
                      │                                          │        │
                      └─► T8 (webhook svc) ◄─────────────────────┘        │
                               │                                          │
                               └─► T9 (webhook ctrl) ─────────────────────┤
                                                                          │
                                                                          ▼
                                                             T12 (exports) ─► T13 (integration)
                                                                          │
T4, T5, T6, T8, T10 ──────────────────────────────────────────────────► T14 (tests)
```

## Parallel Execution Groups

**Group 1** (can start immediately):
- T1 (schemas)
- T2 (generate library)

**Group 2** (after T2):
- T3 (module)

**Group 3** (after T1 + T3):
- T4 (plans)
- T5 (customer)
- T7 (guard)
- T10 (payment method)

**Group 4** (after Group 3):
- T6 (subscription) - needs T4
- T8 (webhook service) - needs T5

**Group 5** (after Group 4):
- T9 (webhook controller)
- T11 (lifecycle)

**Group 6** (after T11):
- T12 (exports)

**Group 7** (after T12):
- T13 (integration)
- T14 (tests) - can start after services complete

## Critical Path

`T2 → T3 → T4 → T6 → T8 → T9 → T11 → T12 → T13`
