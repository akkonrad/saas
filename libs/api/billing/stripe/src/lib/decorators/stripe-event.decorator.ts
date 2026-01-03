import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import Stripe from 'stripe';

export const StripeEvent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Stripe.Event => {
    const request = ctx.switchToHttp().getRequest();
    return request.stripeEvent;
  }
);
