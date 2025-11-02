/**
 * API Response Cache
 * Simple in-memory cache for API responses
 */

interface CacheEntry {
  data: any;
  timestamp: number;
  expiresAt: number;
}

class APICache {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly defaultTTL: number = 5 * 60 * 1000; // 5 minutes

  /**
   * Generate cache key from URL and options
   */
  private getCacheKey(url: string, options?: any): string {
    const method = options?.method || 'GET';
    const body = options?.body ? JSON.stringify(options.body) : '';
    return `${method}:${url}:${body}`;
  }

  /**
   * Get cached response if valid
   */
  get(url: string, options?: any): any | null {
    const key = this.getCacheKey(url, options);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set cache entry
   */
  set(url: string, data: any, options?: any, ttl?: number): void {
    const key = this.getCacheKey(url, options);
    const now = Date.now();
    const cacheTTL = ttl || this.defaultTTL;

    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + cacheTTL,
    });
  }

  /**
   * Invalidate cache entry
   */
  invalidate(url: string, options?: any): void {
    const key = this.getCacheKey(url, options);
    this.cache.delete(key);
  }

  /**
   * Invalidate all cache entries matching pattern
   */
  invalidatePattern(pattern: RegExp): void {
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Cleanup expired entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

export const apiCache = new APICache();

// Cleanup expired entries every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => apiCache.cleanup(), 10 * 60 * 1000);
}

export default apiCache;
