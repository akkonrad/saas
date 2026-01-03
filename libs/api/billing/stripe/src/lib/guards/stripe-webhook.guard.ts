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
import { StripeModuleOptions } from '../interfaces/stripe-module-options.interface';

@Injectable()
export class StripeWebhookGuard implements CanActivate {
  private readonly logger = new Logger(StripeWebhookGuard.name);

  constructor(
    @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
    @Inject(STRIPE_MODULE_OPTIONS) private readonly options: StripeModuleOptions
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<RawBodyRequest<Request>>();
    const signature = request.headers['stripe-signature'] as string;

    if (!signature) {
      this.logger.warn('Missing stripe-signature header');
      throw new UnauthorizedException('Missing stripe-signature header');
    }

    const rawBody = request.rawBody;
    if (!rawBody) {
      this.logger.error(
        'Raw body not available - ensure raw body parsing is enabled'
      );
      throw new UnauthorizedException('Raw body not available');
    }

    try {
      const event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        this.options.webhookSecret
      );

      (request as Request & { stripeEvent: Stripe.Event }).stripeEvent = event;

      this.logger.debug(`Webhook verified: ${event.type} (${event.id})`);
      return true;
    } catch (error) {
      this.logger.warn(
        `Webhook signature verification failed: ${(error as Error).message}`
      );
      throw new UnauthorizedException('Invalid webhook signature');
    }
  }
}
