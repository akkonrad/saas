import { z } from 'zod';

// ============================================================================
// Customer Schemas
// ============================================================================

export const CreateCustomerSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  metadata: z.record(z.string(), z.string()).optional(),
});

export const UpdateCustomerSchema = CreateCustomerSchema.partial();

export const CustomerResponseSchema = z.object({
  id: z.string(),
  email: z.string().email().nullable(),
  name: z.string().nullable(),
  metadata: z.record(z.string(), z.string()),
  created: z.number(),
  deleted: z.boolean().optional(),
});

// ============================================================================
// Price/Product Schemas
// ============================================================================

export const PriceIntervalSchema = z.enum(['day', 'week', 'month', 'year']);

export const PriceConfigSchema = z.object({
  amount: z.number().int().positive(),
  currency: z.string().length(3).optional(),
  interval: PriceIntervalSchema,
  intervalCount: z.number().int().positive().optional(),
});

export const PlanConfigSchema = z.object({
  productId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  metadata: z.record(z.string(), z.string()).optional(),
  prices: z.array(PriceConfigSchema),
});

// ============================================================================
// Subscription Schemas
// ============================================================================

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
  metadata: z.record(z.string(), z.string()).optional(),
});

export const UpdateSubscriptionSchema = z.object({
  priceId: z.string().optional(),
  cancelAtPeriodEnd: z.boolean().optional(),
  metadata: z.record(z.string(), z.string()).optional(),
});

export const SubscriptionItemSchema = z.object({
  id: z.string(),
  priceId: z.string(),
  quantity: z.number(),
});

export const SubscriptionResponseSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  status: SubscriptionStatusSchema,
  currentPeriodStart: z.number(),
  currentPeriodEnd: z.number(),
  cancelAtPeriodEnd: z.boolean(),
  canceledAt: z.number().nullable(),
  items: z.array(SubscriptionItemSchema),
  metadata: z.record(z.string(), z.string()),
});

// ============================================================================
// Payment Method Schemas
// ============================================================================

export const PaymentMethodTypeSchema = z.enum([
  'card',
  'sepa_debit',
  'us_bank_account',
]);

export const AttachPaymentMethodSchema = z.object({
  paymentMethodId: z.string(),
  customerId: z.string(),
  setAsDefault: z.boolean().optional(),
});

export const CardDetailsSchema = z.object({
  brand: z.string(),
  last4: z.string(),
  expMonth: z.number(),
  expYear: z.number(),
});

export const PaymentMethodResponseSchema = z.object({
  id: z.string(),
  type: z.string(),
  card: CardDetailsSchema.optional(),
  isDefault: z.boolean(),
});

// ============================================================================
// Webhook Schemas
// ============================================================================

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
    object: z.record(z.string(), z.unknown()),
  }),
  created: z.number(),
  livemode: z.boolean(),
});

// ============================================================================
// TypeScript Types (inferred from schemas)
// ============================================================================

export type CreateCustomer = z.infer<typeof CreateCustomerSchema>;
export type UpdateCustomer = z.infer<typeof UpdateCustomerSchema>;
export type CustomerResponse = z.infer<typeof CustomerResponseSchema>;

export type PriceInterval = z.infer<typeof PriceIntervalSchema>;
export type PriceConfig = z.infer<typeof PriceConfigSchema>;
export type PlanConfig = z.infer<typeof PlanConfigSchema>;

export type SubscriptionStatus = z.infer<typeof SubscriptionStatusSchema>;
export type CreateSubscription = z.infer<typeof CreateSubscriptionSchema>;
export type UpdateSubscription = z.infer<typeof UpdateSubscriptionSchema>;
export type SubscriptionItem = z.infer<typeof SubscriptionItemSchema>;
export type SubscriptionResponse = z.infer<typeof SubscriptionResponseSchema>;

export type PaymentMethodType = z.infer<typeof PaymentMethodTypeSchema>;
export type AttachPaymentMethod = z.infer<typeof AttachPaymentMethodSchema>;
export type CardDetails = z.infer<typeof CardDetailsSchema>;
export type PaymentMethodResponse = z.infer<typeof PaymentMethodResponseSchema>;

export type WebhookEventType = z.infer<typeof WebhookEventTypeSchema>;
export type WebhookEvent = z.infer<typeof WebhookEventSchema>;
