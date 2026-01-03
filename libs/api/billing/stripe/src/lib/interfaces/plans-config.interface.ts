export interface SyncedPlan {
  productId: string;
  stripeProductId: string;
  prices: {
    interval: string;
    stripePriceId: string;
    amount: number;
    currency: string;
  }[];
}

export interface PlansSyncResult {
  created: number;
  updated: number;
  unchanged: number;
  plans: SyncedPlan[];
}
