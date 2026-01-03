import {
  Controller,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import Stripe from 'stripe';
import { StripeWebhookGuard } from '../guards/stripe-webhook.guard';
import { StripeEvent } from '../decorators/stripe-event.decorator';
import {
  StripeWebhookService,
  WebhookHandlerResult,
} from '../services/stripe-webhook.service';

@Controller('webhooks/stripe')
export class StripeWebhookController {
  private readonly logger = new Logger(StripeWebhookController.name);

  constructor(private readonly webhookService: StripeWebhookService) {}

  @Post()
  @UseGuards(StripeWebhookGuard)
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @StripeEvent() event: Stripe.Event
  ): Promise<WebhookHandlerResult> {
    this.logger.log(`Received webhook: ${event.type} (${event.id})`);
    return this.webhookService.handleEvent(event);
  }
}
