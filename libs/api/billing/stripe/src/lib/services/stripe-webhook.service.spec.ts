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
        object: 'event',
        api_version: '2024-12-18.acacia',
        pending_webhooks: 0,
        request: null,
      } as Stripe.Event;

      const result = await service.handleEvent(event);

      expect(result.handled).toBe(true);
      expect(result.skipped).toBe(false);
      expect(result.eventId).toBe('evt_123');
      expect(result.eventType).toBe('customer.created');
    });

    it('should skip duplicate events (idempotency)', async () => {
      const event = {
        id: 'evt_duplicate',
        type: 'customer.created',
        data: { object: { id: 'cus_123' } },
        created: 1234567890,
        livemode: false,
        object: 'event',
        api_version: '2024-12-18.acacia',
        pending_webhooks: 0,
        request: null,
      } as Stripe.Event;

      await service.handleEvent(event);
      const result = await service.handleEvent(event);

      expect(result.handled).toBe(false);
      expect(result.skipped).toBe(true);
    });

    it('should handle subscription events', async () => {
      const event = {
        id: 'evt_sub_123',
        type: 'customer.subscription.created',
        data: {
          object: {
            id: 'sub_123',
            customer: 'cus_123',
            status: 'active',
          },
        },
        created: 1234567890,
        livemode: false,
        object: 'event',
        api_version: '2024-12-18.acacia',
        pending_webhooks: 0,
        request: null,
      } as Stripe.Event;

      const result = await service.handleEvent(event);

      expect(result.handled).toBe(true);
      expect(result.eventType).toBe('customer.subscription.created');
    });

    it('should handle payment events', async () => {
      const event = {
        id: 'evt_payment_123',
        type: 'invoice.payment_succeeded',
        data: {
          object: {
            id: 'in_123',
            customer: 'cus_123',
          },
        },
        created: 1234567890,
        livemode: false,
        object: 'event',
        api_version: '2024-12-18.acacia',
        pending_webhooks: 0,
        request: null,
      } as Stripe.Event;

      const result = await service.handleEvent(event);

      expect(result.handled).toBe(true);
    });

    it('should handle unknown event types gracefully', async () => {
      const event = {
        id: 'evt_unknown_123',
        type: 'unknown.event.type',
        data: { object: {} },
        created: 1234567890,
        livemode: false,
        object: 'event',
        api_version: '2024-12-18.acacia',
        pending_webhooks: 0,
        request: null,
      } as unknown as Stripe.Event;

      const result = await service.handleEvent(event);

      expect(result.handled).toBe(true);
      expect(result.skipped).toBe(false);
    });
  });
});
