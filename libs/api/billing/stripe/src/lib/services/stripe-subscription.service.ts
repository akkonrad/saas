import { Injectable, Inject } from '@nestjs/common';
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
      metadata: validated.metadata as Stripe.MetadataParam,
    };

    if (validated.paymentMethodId) {
      subscriptionData.default_payment_method = validated.paymentMethodId;
    }

    if (validated.trialDays) {
      subscriptionData.trial_period_days = validated.trialDays;
    }

    const subscription =
      await this.stripe.subscriptions.create(subscriptionData);
    return this.mapSubscriptionResponse(subscription);
  }

  async findById(subscriptionId: string): Promise<SubscriptionResponse> {
    const subscription =
      await this.stripe.subscriptions.retrieve(subscriptionId);
    return this.mapSubscriptionResponse(subscription);
  }

  async findByCustomerId(customerId: string): Promise<SubscriptionResponse[]> {
    const subscriptions = await this.stripe.subscriptions.list({
      customer: customerId,
    });
    return subscriptions.data.map((s) => this.mapSubscriptionResponse(s));
  }

  async update(
    subscriptionId: string,
    data: UpdateSubscription
  ): Promise<SubscriptionResponse> {
    const validated = UpdateSubscriptionSchema.parse(data);
    const updateData: Stripe.SubscriptionUpdateParams = {};

    if (validated.priceId) {
      const current =
        await this.stripe.subscriptions.retrieve(subscriptionId);
      updateData.items = [
        {
          id: current.items.data[0].id,
          price: validated.priceId,
        },
      ];
    }

    if (validated.cancelAtPeriodEnd !== undefined) {
      updateData.cancel_at_period_end = validated.cancelAtPeriodEnd;
    }

    if (validated.metadata) {
      updateData.metadata = validated.metadata as Stripe.MetadataParam;
    }

    const subscription = await this.stripe.subscriptions.update(
      subscriptionId,
      updateData
    );
    return this.mapSubscriptionResponse(subscription);
  }

  async cancel(
    subscriptionId: string,
    immediately = false
  ): Promise<SubscriptionResponse> {
    if (immediately) {
      const subscription =
        await this.stripe.subscriptions.cancel(subscriptionId);
      return this.mapSubscriptionResponse(subscription);
    }

    return this.update(subscriptionId, { cancelAtPeriodEnd: true });
  }

  async resume(subscriptionId: string): Promise<SubscriptionResponse> {
    const subscription = await this.stripe.subscriptions.update(
      subscriptionId,
      {
        cancel_at_period_end: false,
      }
    );
    return this.mapSubscriptionResponse(subscription);
  }

  private mapSubscriptionResponse(
    subscription: Stripe.Subscription
  ): SubscriptionResponse {
    return {
      id: subscription.id,
      customerId: subscription.customer as string,
      status: subscription.status,
      currentPeriodStart:
        (subscription as unknown as { current_period_start: number })
          .current_period_start ?? 0,
      currentPeriodEnd:
        (subscription as unknown as { current_period_end: number })
          .current_period_end ?? 0,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at,
      items: subscription.items.data.map((item) => ({
        id: item.id,
        priceId: item.price.id,
        quantity: item.quantity || 1,
      })),
      metadata: subscription.metadata as Record<string, string>,
    };
  }
}
