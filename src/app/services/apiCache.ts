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
   * HIGH-006 FIX: Use hash-based key generation to prevent collisions
   */
  private getCacheKey(url: string, options?: any): string {
    const method = options?.method || "GET";

    // HIGH-006 FIX: Normalize body to string safely
    let bodyKey = "";
    if (options?.body) {
      try {
        // If body is already a string, use it directly
        if (typeof options.body === "string") {
          bodyKey = options.body;
        } else {
          // Stringify with sorted keys for consistent hashing
          bodyKey = JSON.stringify(options.body, Object.keys(options.body).sort());
        }
      } catch {
        // If stringify fails, use a timestamp to ensure no collision
        bodyKey = `_unstringifiable_${Date.now()}`;
      }
    }

    // HIGH-006 FIX: Include query params and headers that affect response
    const queryParams = url.includes("?") ? url.split("?")[1] : "";
    const acceptHeader = options?.headers?.Accept || "";

    // Create a deterministic key
    return `${method}:${url}:${bodyKey}:${acceptHeader}`;
  }

  /**
   * Simple hash function for longer keys (djb2 algorithm)
   * HIGH-006 FIX: Reduce key length while maintaining uniqueness
   */
  private hashKey(key: string): string {
    if (key.length < 200) return key;

    let hash = 5381;
    for (let i = 0; i < key.length; i++) {
      hash = ((hash << 5) + hash) ^ key.charCodeAt(i);
    }
    return `hashed:${hash.toString(36)}:${key.substring(0, 50)}`;
  }

  /**
   * Get cached response if valid
   */
  get(url: string, options?: any): any | null {
    const rawKey = this.getCacheKey(url, options);
    const key = this.hashKey(rawKey);
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
    const rawKey = this.getCacheKey(url, options);
    const key = this.hashKey(rawKey);
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
    const rawKey = this.getCacheKey(url, options);
    const key = this.hashKey(rawKey);
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
if (typeof setInterval !== "undefined") {
  setInterval(() => apiCache.cleanup(), 10 * 60 * 1000);
}

export default apiCache;
