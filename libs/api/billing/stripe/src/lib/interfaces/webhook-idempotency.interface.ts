export interface IdempotencyStore {
  has(eventId: string): Promise<boolean>;
  add(eventId: string, ttlSeconds?: number): Promise<void>;
}

export class InMemoryIdempotencyStore implements IdempotencyStore {
  private processed = new Map<string, number>();

  async has(eventId: string): Promise<boolean> {
    const expiry = this.processed.get(eventId);
    if (!expiry) return false;
    if (Date.now() > expiry) {
      this.processed.delete(eventId);
      return false;
    }
    return true;
  }

  async add(eventId: string, ttlSeconds = 86400): Promise<void> {
    this.processed.set(eventId, Date.now() + ttlSeconds * 1000);
  }
}
