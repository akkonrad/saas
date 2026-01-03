import { Injectable, Inject } from '@nestjs/common';
import Stripe from 'stripe';
import { STRIPE_CLIENT } from '../stripe.constants';
import {
  AttachPaymentMethod,
  AttachPaymentMethodSchema,
  PaymentMethodResponse,
} from '@saas/shared/util-schema';

@Injectable()
export class StripePaymentMethodService {
  constructor(@Inject(STRIPE_CLIENT) private readonly stripe: Stripe) {}

  async attach(data: AttachPaymentMethod): Promise<PaymentMethodResponse> {
    const validated = AttachPaymentMethodSchema.parse(data);

    const paymentMethod = await this.stripe.paymentMethods.attach(
      validated.paymentMethodId,
      { customer: validated.customerId }
    );

    const setAsDefault = validated.setAsDefault ?? false;
    if (setAsDefault) {
      await this.setDefault(validated.customerId, validated.paymentMethodId);
    }

    return this.mapPaymentMethodResponse(paymentMethod, setAsDefault);
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
    const defaultPaymentMethodId = (customer as Stripe.Customer)
      .invoice_settings?.default_payment_method;

    const paymentMethods = await this.stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    return paymentMethods.data.map((pm) =>
      this.mapPaymentMethodResponse(pm, pm.id === defaultPaymentMethodId)
    );
  }

  async retrieve(paymentMethodId: string): Promise<PaymentMethodResponse> {
    const paymentMethod =
      await this.stripe.paymentMethods.retrieve(paymentMethodId);
    return this.mapPaymentMethodResponse(paymentMethod, false);
  }

  private mapPaymentMethodResponse(
    pm: Stripe.PaymentMethod,
    isDefault: boolean
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
