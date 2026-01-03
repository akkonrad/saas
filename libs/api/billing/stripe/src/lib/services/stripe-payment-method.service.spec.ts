import { Test, TestingModule } from '@nestjs/testing';
import { StripePaymentMethodService } from './stripe-payment-method.service';
import { STRIPE_CLIENT } from '../stripe.constants';

describe('StripePaymentMethodService', () => {
  let service: StripePaymentMethodService;
  let mockStripe: {
    paymentMethods: {
      attach: jest.Mock;
      detach: jest.Mock;
      list: jest.Mock;
      retrieve: jest.Mock;
    };
    customers: {
      update: jest.Mock;
      retrieve: jest.Mock;
    };
  };

  const mockPaymentMethod = {
    id: 'pm_123',
    type: 'card',
    card: {
      brand: 'visa',
      last4: '4242',
      exp_month: 12,
      exp_year: 2025,
    },
  };

  beforeEach(async () => {
    mockStripe = {
      paymentMethods: {
        attach: jest.fn(),
        detach: jest.fn(),
        list: jest.fn(),
        retrieve: jest.fn(),
      },
      customers: {
        update: jest.fn(),
        retrieve: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StripePaymentMethodService,
        { provide: STRIPE_CLIENT, useValue: mockStripe },
      ],
    }).compile();

    service = module.get<StripePaymentMethodService>(
      StripePaymentMethodService
    );
  });

  describe('attach', () => {
    it('should attach payment method to customer', async () => {
      mockStripe.paymentMethods.attach.mockResolvedValue(mockPaymentMethod);

      const result = await service.attach({
        paymentMethodId: 'pm_123',
        customerId: 'cus_123',
      });

      expect(result.id).toBe('pm_123');
      expect(result.type).toBe('card');
      expect(result.card?.brand).toBe('visa');
      expect(mockStripe.paymentMethods.attach).toHaveBeenCalledWith('pm_123', {
        customer: 'cus_123',
      });
    });

    it('should set as default when requested', async () => {
      mockStripe.paymentMethods.attach.mockResolvedValue(mockPaymentMethod);
      mockStripe.customers.update.mockResolvedValue({});

      await service.attach({
        paymentMethodId: 'pm_123',
        customerId: 'cus_123',
        setAsDefault: true,
      });

      expect(mockStripe.customers.update).toHaveBeenCalledWith('cus_123', {
        invoice_settings: {
          default_payment_method: 'pm_123',
        },
      });
    });
  });

  describe('detach', () => {
    it('should detach payment method', async () => {
      mockStripe.paymentMethods.detach.mockResolvedValue({
        id: 'pm_123',
      });

      const result = await service.detach('pm_123');

      expect(result.detached).toBe(true);
      expect(mockStripe.paymentMethods.detach).toHaveBeenCalledWith('pm_123');
    });
  });

  describe('listByCustomer', () => {
    it('should list customer payment methods', async () => {
      mockStripe.customers.retrieve.mockResolvedValue({
        id: 'cus_123',
        invoice_settings: { default_payment_method: 'pm_123' },
      });
      mockStripe.paymentMethods.list.mockResolvedValue({
        data: [mockPaymentMethod],
      });

      const result = await service.listByCustomer('cus_123');

      expect(result).toHaveLength(1);
      expect(result[0].isDefault).toBe(true);
    });

    it('should mark non-default payment methods correctly', async () => {
      mockStripe.customers.retrieve.mockResolvedValue({
        id: 'cus_123',
        invoice_settings: { default_payment_method: 'pm_other' },
      });
      mockStripe.paymentMethods.list.mockResolvedValue({
        data: [mockPaymentMethod],
      });

      const result = await service.listByCustomer('cus_123');

      expect(result[0].isDefault).toBe(false);
    });
  });

  describe('retrieve', () => {
    it('should retrieve payment method', async () => {
      mockStripe.paymentMethods.retrieve.mockResolvedValue(mockPaymentMethod);

      const result = await service.retrieve('pm_123');

      expect(result.id).toBe('pm_123');
      expect(result.card?.last4).toBe('4242');
    });
  });
});
