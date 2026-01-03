import { Injectable, Inject, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { STRIPE_CLIENT } from '../stripe.constants';
import { PlanConfig, PriceConfig } from '@saas/shared/util-schema';
import {
  SyncedPlan,
  PlansSyncResult,
} from '../interfaces/plans-config.interface';

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
      const syncedPlan = await this.syncPlan(plan, result);
      result.plans.push(syncedPlan);
    }

    this.logger.log(
      `Plans synced: ${result.created} created, ${result.updated} updated, ${result.unchanged} unchanged`
    );
    return result;
  }

  private async syncPlan(
    plan: PlanConfig,
    result: PlansSyncResult
  ): Promise<SyncedPlan> {
    let product = await this.findProductByMetadata(plan.productId);

    if (!product) {
      product = await this.stripe.products.create({
        name: plan.name,
        description: plan.description,
        metadata: {
          productId: plan.productId,
          ...(plan.metadata as Stripe.MetadataParam),
        },
      });
      result.created++;
      this.logger.log(`Created product: ${plan.name} (${product.id})`);
    } else {
      result.unchanged++;
    }

    const syncedPrices = [];
    for (const priceConfig of plan.prices) {
      const price = await this.syncPrice(
        product.id,
        plan.productId,
        priceConfig
      );
      syncedPrices.push({
        interval: priceConfig.interval,
        stripePriceId: price.id,
        amount: priceConfig.amount,
        currency: priceConfig.currency || 'usd',
      });
    }

    return {
      productId: plan.productId,
      stripeProductId: product.id,
      prices: syncedPrices,
    };
  }

  private async findProductByMetadata(
    productId: string
  ): Promise<Stripe.Product | null> {
    const products = await this.stripe.products.search({
      query: `metadata['productId']:'${productId}'`,
    });
    return products.data[0] || null;
  }

  private async syncPrice(
    stripeProductId: string,
    productId: string,
    priceConfig: PriceConfig
  ): Promise<Stripe.Price> {
    const existingPrices = await this.stripe.prices.search({
      query: `product:'${stripeProductId}' AND metadata['interval']:'${priceConfig.interval}' AND metadata['productId']:'${productId}'`,
    });

    if (existingPrices.data[0]) {
      return existingPrices.data[0];
    }

    return this.stripe.prices.create({
      product: stripeProductId,
      unit_amount: priceConfig.amount,
      currency: priceConfig.currency || 'usd',
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
      const productId = product.metadata['productId'];
      if (!productId) continue;

      const prices = await this.stripe.prices.list({
        product: product.id,
        active: true,
      });

      plans.push({
        productId,
        stripeProductId: product.id,
        prices: prices.data.map((p) => ({
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
