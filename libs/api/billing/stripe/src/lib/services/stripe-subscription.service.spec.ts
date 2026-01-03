import { Test, TestingModule } from '@nestjs/testing';
import { StripeSubscriptionService } from './stripe-subscription.service';
import { STRIPE_CLIENT } from '../stripe.constants';

describe('StripeSubscriptionService', () => {
  let service: StripeSubscriptionService;
  let mockStripe: {
    subscriptions: {
      create: jest.Mock;
      retrieve: jest.Mock;
      update: jest.Mock;
      cancel: jest.Mock;
      list: jest.Mock;
    };
  };

  const mockSubscription = {
    id: 'sub_123',
    customer: 'cus_123',
    status: 'active',
    current_period_start: 1234567890,
    current_period_end: 1234567890,
    cancel_at_period_end: false,
    canceled_at: null,
    items: {
      data: [{ id: 'si_123', price: { id: 'price_123' }, quantity: 1 }],
    },
    metadata: {},
  };

  beforeEach(async () => {
    mockStripe = {
      subscriptions: {
        create: jest.fn(),
        retrieve: jest.fn(),
        update: jest.fn(),
        cancel: jest.fn(),
        list: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StripeSubscriptionService,
        { provide: STRIPE_CLIENT, useValue: mockStripe },
      ],
    }).compile();

    service = module.get<StripeSubscriptionService>(StripeSubscriptionService);
  });

  describe('create', () => {
    it('should create a subscription', async () => {
      mockStripe.subscriptions.create.mockResolvedValue(mockSubscription);

      const result = await service.create({
        customerId: 'cus_123',
        priceId: 'price_123',
      });

      expect(result.id).toBe('sub_123');
      expect(result.customerId).toBe('cus_123');
      expect(result.status).toBe('active');
      expect(mockStripe.subscriptions.create).toHaveBeenCalled();
    });

    it('should create subscription with trial days', async () => {
      mockStripe.subscriptions.create.mockResolvedValue(mockSubscription);

      await service.create({
        customerId: 'cus_123',
        priceId: 'price_123',
        trialDays: 14,
      });

      expect(mockStripe.subscriptions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          trial_period_days: 14,
        })
      );
    });
  });

  describe('findById', () => {
    it('should retrieve a subscription', async () => {
      mockStripe.subscriptions.retrieve.mockResolvedValue(mockSubscription);

      const result = await service.findById('sub_123');

      expect(result.id).toBe('sub_123');
      expect(mockStripe.subscriptions.retrieve).toHaveBeenCalledWith('sub_123');
    });
  });

  describe('findByCustomerId', () => {
    it('should list customer subscriptions', async () => {
      mockStripe.subscriptions.list.mockResolvedValue({
        data: [mockSubscription],
      });

      const result = await service.findByCustomerId('cus_123');

      expect(result).toHaveLength(1);
      expect(result[0].customerId).toBe('cus_123');
    });
  });

  describe('update', () => {
    it('should update subscription price', async () => {
      mockStripe.subscriptions.retrieve.mockResolvedValue(mockSubscription);
      mockStripe.subscriptions.update.mockResolvedValue({
        ...mockSubscription,
        items: {
          data: [{ id: 'si_123', price: { id: 'price_new' }, quantity: 1 }],
        },
      });

      const result = await service.update('sub_123', { priceId: 'price_new' });

      expect(mockStripe.subscriptions.update).toHaveBeenCalledWith(
        'sub_123',
        expect.objectContaining({
          items: [{ id: 'si_123', price: 'price_new' }],
        })
      );
    });

    it('should set cancel at period end', async () => {
      mockStripe.subscriptions.update.mockResolvedValue({
        ...mockSubscription,
        cancel_at_period_end: true,
      });

      await service.update('sub_123', { cancelAtPeriodEnd: true });

      expect(mockStripe.subscriptions.update).toHaveBeenCalledWith(
        'sub_123',
        expect.objectContaining({
          cancel_at_period_end: true,
        })
      );
    });
  });

  describe('cancel', () => {
    it('should cancel immediately', async () => {
      mockStripe.subscriptions.cancel.mockResolvedValue({
        ...mockSubscription,
        status: 'canceled',
      });

      const result = await service.cancel('sub_123', true);

      expect(result.status).toBe('canceled');
      expect(mockStripe.subscriptions.cancel).toHaveBeenCalledWith('sub_123');
    });

    it('should cancel at period end', async () => {
      mockStripe.subscriptions.update.mockResolvedValue({
        ...mockSubscription,
        cancel_at_period_end: true,
      });

      const result = await service.cancel('sub_123', false);

      expect(result.cancelAtPeriodEnd).toBe(true);
    });
  });

  describe('resume', () => {
    it('should resume a subscription', async () => {
      mockStripe.subscriptions.update.mockResolvedValue({
        ...mockSubscription,
        cancel_at_period_end: false,
      });

      const result = await service.resume('sub_123');

      expect(result.cancelAtPeriodEnd).toBe(false);
      expect(mockStripe.subscriptions.update).toHaveBeenCalledWith('sub_123', {
        cancel_at_period_end: false,
      });
    });
  });
});
