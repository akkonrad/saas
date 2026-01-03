import { Test, TestingModule } from '@nestjs/testing';
import { StripePlansService } from './stripe-plans.service';
import { STRIPE_CLIENT } from '../stripe.constants';
import { PlanConfig } from '@saas/shared/util-schema';

describe('StripePlansService', () => {
  let service: StripePlansService;
  let mockStripe: {
    products: {
      create: jest.Mock;
      search: jest.Mock;
      list: jest.Mock;
    };
    prices: {
      create: jest.Mock;
      search: jest.Mock;
      list: jest.Mock;
    };
  };

  beforeEach(async () => {
    mockStripe = {
      products: {
        create: jest.fn(),
        search: jest.fn(),
        list: jest.fn(),
      },
      prices: {
        create: jest.fn(),
        search: jest.fn(),
        list: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StripePlansService,
        { provide: STRIPE_CLIENT, useValue: mockStripe },
      ],
    }).compile();

    service = module.get<StripePlansService>(StripePlansService);
  });

  describe('syncPlans', () => {
    const testPlan: PlanConfig = {
      productId: 'test_plan',
      name: 'Test Plan',
      description: 'A test plan',
      prices: [{ amount: 999, interval: 'month' }],
    };

    it('should create new product if not exists', async () => {
      mockStripe.products.search.mockResolvedValue({ data: [] });
      mockStripe.products.create.mockResolvedValue({
        id: 'prod_123',
        name: 'Test Plan',
        metadata: { productId: 'test_plan' },
      });
      mockStripe.prices.search.mockResolvedValue({ data: [] });
      mockStripe.prices.create.mockResolvedValue({
        id: 'price_123',
        unit_amount: 999,
        currency: 'usd',
      });

      const result = await service.syncPlans([testPlan]);

      expect(result.created).toBe(1);
      expect(result.plans).toHaveLength(1);
      expect(result.plans[0].stripeProductId).toBe('prod_123');
      expect(mockStripe.products.create).toHaveBeenCalled();
    });

    it('should use existing product if found', async () => {
      mockStripe.products.search.mockResolvedValue({
        data: [
          {
            id: 'prod_existing',
            name: 'Test Plan',
            metadata: { productId: 'test_plan' },
          },
        ],
      });
      mockStripe.prices.search.mockResolvedValue({
        data: [{ id: 'price_existing', unit_amount: 999 }],
      });

      const result = await service.syncPlans([testPlan]);

      expect(result.unchanged).toBe(1);
      expect(result.created).toBe(0);
      expect(mockStripe.products.create).not.toHaveBeenCalled();
    });

    it('should create price if not exists', async () => {
      mockStripe.products.search.mockResolvedValue({
        data: [{ id: 'prod_123', metadata: { productId: 'test_plan' } }],
      });
      mockStripe.prices.search.mockResolvedValue({ data: [] });
      mockStripe.prices.create.mockResolvedValue({
        id: 'price_new',
        unit_amount: 999,
      });

      const result = await service.syncPlans([testPlan]);

      expect(mockStripe.prices.create).toHaveBeenCalled();
      expect(result.plans[0].prices[0].stripePriceId).toBe('price_new');
    });
  });

  describe('getActivePlans', () => {
    it('should return active plans with prices', async () => {
      mockStripe.products.list.mockResolvedValue({
        data: [
          {
            id: 'prod_1',
            metadata: { productId: 'plan_1' },
          },
          {
            id: 'prod_2',
            metadata: {}, // No productId, should be skipped
          },
        ],
      });
      mockStripe.prices.list.mockResolvedValue({
        data: [
          {
            id: 'price_1',
            unit_amount: 999,
            currency: 'usd',
            recurring: { interval: 'month' },
          },
        ],
      });

      const result = await service.getActivePlans();

      expect(result).toHaveLength(1);
      expect(result[0].productId).toBe('plan_1');
      expect(result[0].prices).toHaveLength(1);
    });
  });
});
