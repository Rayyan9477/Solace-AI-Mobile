/**
 * API Response Cache
 * Simple in-memory cache for API responses
 */

interface CacheEntry {
  data: any;
  timestamp: number;
  expiresAt: number;
}

/**
 * MED-NEW-007 FIX: Recursively sort object keys for consistent JSON stringification
 * This ensures {b: 1, a: 2} and {a: 2, b: 1} produce the same string
 */
function sortObjectKeys(obj: unknown): unknown {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }

  const sortedObj: Record<string, unknown> = {};
  const keys = Object.keys(obj as Record<string, unknown>).sort();

  for (const key of keys) {
    sortedObj[key] = sortObjectKeys((obj as Record<string, unknown>)[key]);
  }

  return sortedObj;
}

class APICache {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly defaultTTL: number = 5 * 60 * 1000; // 5 minutes
  // MED-008 FIX: Add maximum cache size to prevent memory issues
  private readonly maxCacheSize: number = 100;
  // MED-NEW-008 FIX: Track last cleanup time for periodic expired entry removal
  private lastCleanupTime: number = Date.now();
  private readonly cleanupInterval: number = 60 * 1000; // 1 minute

  /**
   * MED-007 FIX: Sort query parameters for consistent cache key generation
   * URLs like ?b=2&a=1 and ?a=1&b=2 should produce the same cache key
   */
  private normalizeUrl(url: string): string {
    if (!url.includes("?")) {
      return url;
    }

    const [baseUrl, queryString] = url.split("?");
    if (!queryString) {
      return baseUrl;
    }

    // Parse and sort query params
    const params = new URLSearchParams(queryString);
    const sortedParams = new URLSearchParams();

    // Sort parameter names alphabetically
    const paramNames = Array.from(params.keys()).sort();
    for (const name of paramNames) {
      const values = params.getAll(name).sort();
      for (const value of values) {
        sortedParams.append(name, value);
      }
    }

    const sortedQueryString = sortedParams.toString();
    return sortedQueryString ? `${baseUrl}?${sortedQueryString}` : baseUrl;
  }

  /**
   * Generate cache key from URL and options
   * HIGH-006 FIX: Use hash-based key generation to prevent collisions
   * MED-007 FIX: Normalize URL with sorted query params
   */
  private getCacheKey(url: string, options?: any): string {
    const method = options?.method || "GET";
    // MED-007 FIX: Normalize URL to sort query params
    const normalizedUrl = this.normalizeUrl(url);

    // HIGH-006 FIX: Normalize body to string safely
    // MED-NEW-007 FIX: Use recursive key sorting for nested objects
    let bodyKey = "";
    if (options?.body) {
      try {
        // If body is already a string, use it directly
        if (typeof options.body === "string") {
          bodyKey = options.body;
        } else {
          // MED-NEW-007 FIX: Recursively sort all nested object keys for consistent hashing
          const sortedBody = sortObjectKeys(options.body);
          bodyKey = JSON.stringify(sortedBody);
        }
      } catch {
        // If stringify fails, use a timestamp to ensure no collision
        bodyKey = `_unstringifiable_${Date.now()}`;
      }
    }

    // HIGH-006 FIX: Include headers that affect response
    const acceptHeader = options?.headers?.Accept || "";

    // Create a deterministic key
    return `${method}:${normalizedUrl}:${bodyKey}:${acceptHeader}`;
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
   * MED-008 FIX: Enforce cache size limit with LRU eviction
   * MED-NEW-008 FIX: Added periodic cleanup and stricter enforcement
   */
  set(url: string, data: any, options?: any, ttl?: number): void {
    const rawKey = this.getCacheKey(url, options);
    const key = this.hashKey(rawKey);
    const now = Date.now();
    const cacheTTL = ttl || this.defaultTTL;

    // MED-NEW-008 FIX: Run periodic cleanup of expired entries
    if (now - this.lastCleanupTime > this.cleanupInterval) {
      this.cleanupExpiredEntries();
      this.lastCleanupTime = now;
    }

    // MED-008 FIX: Evict oldest entries if cache is at capacity
    // MED-NEW-008 FIX: Evict multiple entries to maintain headroom (10% below max)
    if (this.cache.size >= this.maxCacheSize && !this.cache.has(key)) {
      const entriesToEvict = Math.max(1, Math.floor(this.maxCacheSize * 0.1));
      this.evictOldestEntries(entriesToEvict);
    }

    // MED-NEW-008 FIX: Final safety check - refuse to add if still at capacity
    // This prevents any edge case where cache could exceed maxCacheSize
    if (this.cache.size >= this.maxCacheSize && !this.cache.has(key)) {
      // Cache is full and eviction failed - skip caching this entry
      return;
    }

    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + cacheTTL,
    });
  }

  /**
   * MED-NEW-008 FIX: Remove all expired entries from cache
   */
  private cleanupExpiredEntries(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * MED-008 FIX: Evict oldest entries by timestamp (LRU-like eviction)
   */
  private evictOldestEntries(count: number): void {
    if (count <= 0) return;

    // Find entries sorted by timestamp (oldest first)
    const entries = Array.from(this.cache.entries())
      .map(([key, entry]) => ({ key, timestamp: entry.timestamp }))
      .sort((a, b) => a.timestamp - b.timestamp);

    // Remove the oldest entries
    for (let i = 0; i < Math.min(count, entries.length); i++) {
      this.cache.delete(entries[i].key);
    }
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
