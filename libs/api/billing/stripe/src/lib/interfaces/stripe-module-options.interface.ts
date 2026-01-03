import { InjectionToken, OptionalFactoryDependency } from '@nestjs/common';
import { PlanConfig } from '@saas/shared/util-schema';

export interface StripeModuleOptions {
  apiKey: string;
  webhookSecret: string;
  apiVersion?: string;
  plans?: PlanConfig[];
}

export interface StripeModuleAsyncOptions {
  useFactory: (
    ...args: unknown[]
  ) => Promise<StripeModuleOptions> | StripeModuleOptions;
  inject?: (InjectionToken | OptionalFactoryDependency)[];
}
