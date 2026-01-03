import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { StripeCustomerService } from './stripe-customer.service';
import { STRIPE_CLIENT } from '../stripe.constants';

describe('StripeCustomerService', () => {
  let service: StripeCustomerService;
  let mockStripe: {
    customers: {
      create: jest.Mock;
      retrieve: jest.Mock;
      update: jest.Mock;
      del: jest.Mock;
      list: jest.Mock;
    };
  };

  beforeEach(async () => {
    mockStripe = {
      customers: {
        create: jest.fn(),
        retrieve: jest.fn(),
        update: jest.fn(),
        del: jest.fn(),
        list: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StripeCustomerService,
        { provide: STRIPE_CLIENT, useValue: mockStripe },
      ],
    }).compile();

    service = module.get<StripeCustomerService>(StripeCustomerService);
  });

  describe('create', () => {
    it('should create a customer', async () => {
      const mockCustomer = {
        id: 'cus_123',
        email: 'test@example.com',
        name: 'Test User',
        metadata: {},
        created: 1234567890,
      };
      mockStripe.customers.create.mockResolvedValue(mockCustomer);

      const result = await service.create({
        email: 'test@example.com',
        name: 'Test User',
      });

      expect(result.id).toBe('cus_123');
      expect(result.email).toBe('test@example.com');
      expect(mockStripe.customers.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'Test User',
        metadata: undefined,
      });
    });

    it('should throw on invalid email', async () => {
      await expect(
        service.create({ email: 'invalid-email' })
      ).rejects.toThrow();
    });
  });

  describe('findById', () => {
    it('should find a customer by ID', async () => {
      const mockCustomer = {
        id: 'cus_123',
        email: 'test@example.com',
        name: 'Test User',
        metadata: {},
        created: 1234567890,
      };
      mockStripe.customers.retrieve.mockResolvedValue(mockCustomer);

      const result = await service.findById('cus_123');

      expect(result.id).toBe('cus_123');
      expect(mockStripe.customers.retrieve).toHaveBeenCalledWith('cus_123');
    });

    it('should throw NotFoundException for deleted customer', async () => {
      mockStripe.customers.retrieve.mockResolvedValue({
        id: 'cus_123',
        deleted: true,
      });

      await expect(service.findById('cus_123')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('findByEmail', () => {
    it('should find a customer by email', async () => {
      const mockCustomer = {
        id: 'cus_123',
        email: 'test@example.com',
        name: 'Test User',
        metadata: {},
        created: 1234567890,
      };
      mockStripe.customers.list.mockResolvedValue({
        data: [mockCustomer],
      });

      const result = await service.findByEmail('test@example.com');

      expect(result?.id).toBe('cus_123');
    });

    it('should return null when customer not found', async () => {
      mockStripe.customers.list.mockResolvedValue({ data: [] });

      const result = await service.findByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      const mockCustomer = {
        id: 'cus_123',
        email: 'updated@example.com',
        name: 'Updated User',
        metadata: {},
        created: 1234567890,
      };
      mockStripe.customers.update.mockResolvedValue(mockCustomer);

      const result = await service.update('cus_123', {
        email: 'updated@example.com',
        name: 'Updated User',
      });

      expect(result.email).toBe('updated@example.com');
      expect(result.name).toBe('Updated User');
    });
  });

  describe('delete', () => {
    it('should delete a customer', async () => {
      mockStripe.customers.del.mockResolvedValue({ deleted: true });

      const result = await service.delete('cus_123');

      expect(result.deleted).toBe(true);
      expect(mockStripe.customers.del).toHaveBeenCalledWith('cus_123');
    });
  });

  describe('list', () => {
    it('should list customers with pagination', async () => {
      const mockCustomers = {
        data: [
          {
            id: 'cus_1',
            email: 'a@example.com',
            name: 'A',
            metadata: {},
            created: 1234567890,
          },
          {
            id: 'cus_2',
            email: 'b@example.com',
            name: 'B',
            metadata: {},
            created: 1234567890,
          },
        ],
        has_more: true,
      };
      mockStripe.customers.list.mockResolvedValue(mockCustomers);

      const result = await service.list({ limit: 10 });

      expect(result.customers).toHaveLength(2);
      expect(result.hasMore).toBe(true);
    });
  });
});
