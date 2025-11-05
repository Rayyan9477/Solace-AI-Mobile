interface RateLimitRecord {
  count: number;
  firstAttempt: number;
  resetTime: number;
}

class RateLimiter {
  private attempts: Map<string, RateLimitRecord> = new Map();
  private readonly cleanupInterval: NodeJS.Timeout;

  constructor() {
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.attempts.entries()) {
      if (now > record.resetTime) {
        this.attempts.delete(key);
      }
    }
  }

  async checkLimit(
    key: string,
    maxAttempts: number = 5,
    windowMs: number = 15 * 60 * 1000,
  ): Promise<{ allowed: boolean; waitTime?: number }> {
    const now = Date.now();
    const record = this.attempts.get(key);

    if (!record || now > record.resetTime) {
      this.attempts.set(key, {
        count: 1,
        firstAttempt: now,
        resetTime: now + windowMs,
      });
      return { allowed: true };
    }

    if (record.count >= maxAttempts) {
      const waitTime = Math.ceil((record.resetTime - now) / 1000);
      return { allowed: false, waitTime };
    }

    record.count++;
    return { allowed: true };
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.attempts.clear();
  }
}

export const rateLimiter = new RateLimiter();
export default rateLimiter;
