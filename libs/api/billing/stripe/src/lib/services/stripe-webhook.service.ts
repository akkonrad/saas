import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import {
  IdempotencyStore,
  InMemoryIdempotencyStore,
} from '../interfaces/webhook-idempotency.interface';

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
    this.idempotencyStore = new InMemoryIdempotencyStore();
  }

  async handleEvent(event: Stripe.Event): Promise<WebhookHandlerResult> {
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
      this.logger.error(
        `Failed to process event ${event.id}: ${(error as Error).message}`
      );
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
        await this.handleSubscriptionCreated(
          event.data.object as Stripe.Subscription
        );
        break;

      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription
        );
        break;

      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
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

  protected async handleCustomerCreated(
    customer: Stripe.Customer
  ): Promise<void> {
    this.logger.debug(`Customer created: ${customer.id}`);
  }

  protected async handleCustomerUpdated(
    customer: Stripe.Customer
  ): Promise<void> {
    this.logger.debug(`Customer updated: ${customer.id}`);
  }

  protected async handleCustomerDeleted(
    customer: Stripe.Customer
  ): Promise<void> {
    this.logger.debug(`Customer deleted: ${customer.id}`);
  }

  protected async handleSubscriptionCreated(
    subscription: Stripe.Subscription
  ): Promise<void> {
    this.logger.debug(`Subscription created: ${subscription.id}`);
  }

  protected async handleSubscriptionUpdated(
    subscription: Stripe.Subscription
  ): Promise<void> {
    this.logger.debug(
      `Subscription updated: ${subscription.id} - status: ${subscription.status}`
    );
  }

  protected async handleSubscriptionDeleted(
    subscription: Stripe.Subscription
  ): Promise<void> {
    this.logger.debug(`Subscription deleted: ${subscription.id}`);
  }

  protected async handlePaymentSucceeded(
    invoice: Stripe.Invoice
  ): Promise<void> {
    this.logger.debug(`Payment succeeded: ${invoice.id}`);
  }

  protected async handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    this.logger.warn(`Payment failed: ${invoice.id}`);
  }
}
