import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { STRIPE_CLIENT } from '../stripe.constants';
import {
  CreateCustomer,
  UpdateCustomer,
  CustomerResponse,
  CreateCustomerSchema,
  UpdateCustomerSchema,
} from '@saas/shared/util-schema';

@Injectable()
export class StripeCustomerService {
  constructor(@Inject(STRIPE_CLIENT) private readonly stripe: Stripe) {}

  async create(data: CreateCustomer): Promise<CustomerResponse> {
    const validated = CreateCustomerSchema.parse(data);

    const customer = await this.stripe.customers.create({
      email: validated.email,
      name: validated.name,
      metadata: validated.metadata as Stripe.MetadataParam,
    });

    return this.mapCustomerResponse(customer);
  }

  async findById(customerId: string): Promise<CustomerResponse> {
    const customer = await this.stripe.customers.retrieve(customerId);

    if ((customer as Stripe.DeletedCustomer).deleted) {
      throw new NotFoundException(`Customer ${customerId} has been deleted`);
    }

    return this.mapCustomerResponse(customer as Stripe.Customer);
  }

  async findByEmail(email: string): Promise<CustomerResponse | null> {
    const customers = await this.stripe.customers.list({ email, limit: 1 });

    if (customers.data.length === 0) {
      return null;
    }

    return this.mapCustomerResponse(customers.data[0]);
  }

  async update(
    customerId: string,
    data: UpdateCustomer
  ): Promise<CustomerResponse> {
    const validated = UpdateCustomerSchema.parse(data);

    const customer = await this.stripe.customers.update(customerId, {
      email: validated.email,
      name: validated.name,
      metadata: validated.metadata as Stripe.MetadataParam,
    });

    return this.mapCustomerResponse(customer);
  }

  async delete(customerId: string): Promise<{ deleted: boolean }> {
    const result = await this.stripe.customers.del(customerId);
    return { deleted: result.deleted };
  }

  async list(options?: { limit?: number; startingAfter?: string }): Promise<{
    customers: CustomerResponse[];
    hasMore: boolean;
  }> {
    const customers = await this.stripe.customers.list({
      limit: options?.limit || 10,
      starting_after: options?.startingAfter,
    });

    return {
      customers: customers.data.map((c) => this.mapCustomerResponse(c)),
      hasMore: customers.has_more,
    };
  }

  private mapCustomerResponse(customer: Stripe.Customer): CustomerResponse {
    return {
      id: customer.id,
      email: customer.email ?? null,
      name: customer.name ?? null,
      metadata: customer.metadata as Record<string, string>,
      created: customer.created,
    };
  }
}
