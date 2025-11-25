/**
 * Caching Utility
 * Provides in-memory caching with TTL, LRU eviction, and persistence
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from './logger';

// ==================== TYPES ====================

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt?: number;
  accessCount: number;
  lastAccessed: number;
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of entries
  persistKey?: string; // AsyncStorage key for persistence
  serialize?: (data: any) => string;
  deserialize?: (data: string) => any;
}

export interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  hitRate: number;
  evictions: number;
}

// ==================== CACHE CLASS ====================

export class Cache<T = any> {
  private cache: Map<string, CacheEntry<T>>;
  private options: Required<Omit<CacheOptions, 'persistKey'>> & { persistKey?: string };
  private stats: CacheStats;

  constructor(options: CacheOptions = {}) {
    this.cache = new Map();
    this.options = {
      ttl: options.ttl || 5 * 60 * 1000, // Default 5 minutes
      maxSize: options.maxSize || 100,
      persistKey: options.persistKey,
      serialize: options.serialize || JSON.stringify,
      deserialize: options.deserialize || JSON.parse,
    };
    this.stats = {
      size: 0,
      hits: 0,
      misses: 0,
      hitRate: 0,
      evictions: 0,
    };

    // Load persisted cache if enabled
    if (this.options.persistKey) {
      this.loadFromStorage();
    }
  }

  /**
   * Set a value in the cache
   */
  set(key: string, data: T, customTtl?: number): void {
    const ttl = customTtl || this.options.ttl;
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: ttl > 0 ? Date.now() + ttl : undefined,
      accessCount: 0,
      lastAccessed: Date.now(),
    };

    // Check if we need to evict entries
    if (this.cache.size >= this.options.maxSize && !this.cache.has(key)) {
      this.evictLRU();
    }

    this.cache.set(key, entry);
    this.stats.size = this.cache.size;

    // Persist if enabled
    if (this.options.persistKey) {
      this.persistToStorage();
    }
  }

  /**
   * Get a value from the cache
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    // Check if expired
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.stats.size = this.cache.size;
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    // Update access info
    entry.accessCount++;
    entry.lastAccessed = Date.now();

    this.stats.hits++;
    this.updateHitRate();

    return entry.data;
  }

  /**
   * Check if a key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.stats.size = this.cache.size;
      return false;
    }

    return true;
  }

  /**
   * Delete a specific key
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.stats.size = this.cache.size;

      if (this.options.persistKey) {
        this.persistToStorage();
      }
    }
    return deleted;
  }

  /**
   * Clear all cached entries
   */
  clear(): void {
    this.cache.clear();
    this.stats = {
      size: 0,
      hits: 0,
      misses: 0,
      hitRate: 0,
      evictions: 0,
    };

    if (this.options.persistKey) {
      this.clearStorage();
    }
  }

  /**
   * Get all keys in the cache
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Remove expired entries
   */
  prune(): number {
    let pruned = 0;
    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt && now > entry.expiresAt) {
        this.cache.delete(key);
        pruned++;
      }
    }

    this.stats.size = this.cache.size;

    if (pruned > 0 && this.options.persistKey) {
      this.persistToStorage();
    }

    return pruned;
  }

  /**
   * Evict least recently used entry (LRU)
   */
  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.stats.evictions++;
      logger.debug(`[Cache] Evicted LRU entry: ${oldestKey}`);
    }
  }

  /**
   * Update hit rate statistics
   */
  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0;
  }

  /**
   * Persist cache to AsyncStorage
   */
  private async persistToStorage(): Promise<void> {
    if (!this.options.persistKey) return;

    try {
      const cacheData: Record<string, CacheEntry<T>> = {};

      for (const [key, entry] of this.cache.entries()) {
        // Only persist non-expired entries
        if (!entry.expiresAt || Date.now() < entry.expiresAt) {
          cacheData[key] = entry;
        }
      }

      const serialized = this.options.serialize(cacheData);
      await AsyncStorage.setItem(this.options.persistKey, serialized);
    } catch (error) {
      logger.error('[Cache] Failed to persist to storage:', error);
    }
  }

  /**
   * Load cache from AsyncStorage
   */
  private async loadFromStorage(): Promise<void> {
    if (!this.options.persistKey) return;

    try {
      const serialized = await AsyncStorage.getItem(this.options.persistKey);
      if (!serialized) return;

      const cacheData: Record<string, CacheEntry<T>> = this.options.deserialize(serialized);

      for (const [key, entry] of Object.entries(cacheData)) {
        // Only load non-expired entries
        if (!entry.expiresAt || Date.now() < entry.expiresAt) {
          this.cache.set(key, entry);
        }
      }

      this.stats.size = this.cache.size;
      logger.info(`[Cache] Loaded ${this.cache.size} entries from storage`);
    } catch (error) {
      logger.error('[Cache] Failed to load from storage:', error);
    }
  }

  /**
   * Clear persisted cache from AsyncStorage
   */
  private async clearStorage(): Promise<void> {
    if (!this.options.persistKey) return;

    try {
      await AsyncStorage.removeItem(this.options.persistKey);
    } catch (error) {
      logger.error('[Cache] Failed to clear storage:', error);
    }
  }
}

// ==================== GLOBAL CACHE INSTANCES ====================

// API response cache (5 minutes TTL)
export const apiCache = new Cache({
  ttl: 5 * 60 * 1000,
  maxSize: 50,
  persistKey: '@cache/api',
});

// Image/asset cache (30 minutes TTL)
export const assetCache = new Cache({
  ttl: 30 * 60 * 1000,
  maxSize: 100,
  persistKey: '@cache/assets',
});

// User data cache (15 minutes TTL)
export const userDataCache = new Cache({
  ttl: 15 * 60 * 1000,
  maxSize: 20,
  persistKey: '@cache/user_data',
});

// Component data cache (no TTL, manual management)
export const componentCache = new Cache({
  ttl: 0, // No automatic expiration
  maxSize: 50,
});

// ==================== HELPER FUNCTIONS ====================

/**
 * Memoize an async function with caching
 */
export function memoizeAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  cache: Cache = apiCache,
  keyGenerator?: (...args: Parameters<T>) => string
): T {
  return (async (...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);

    // Check cache first
    const cached = cache.get(key);
    if (cached !== null) {
      return cached;
    }

    // Execute function and cache result
    const result = await fn(...args);
    cache.set(key, result);

    return result;
  }) as T;
}

/**
 * Memoize a sync function with caching
 */
export function memoizeSync<T extends (...args: any[]) => any>(
  fn: T,
  cache: Cache = componentCache,
  keyGenerator?: (...args: Parameters<T>) => string
): T {
  return ((...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);

    // Check cache first
    const cached = cache.get(key);
    if (cached !== null) {
      return cached;
    }

    // Execute function and cache result
    const result = fn(...args);
    cache.set(key, result);

    return result;
  }) as T;
}

/**
 * Clear all caches
 */
export function clearAllCaches(): void {
  apiCache.clear();
  assetCache.clear();
  userDataCache.clear();
  componentCache.clear();
  logger.info('[Cache] All caches cleared');
}

/**
 * Get statistics for all caches
 */
export function getAllCacheStats() {
  return {
    api: apiCache.getStats(),
    asset: assetCache.getStats(),
    userData: userDataCache.getStats(),
    component: componentCache.getStats(),
  };
}

// ==================== AUTO PRUNING ====================

// Prune expired entries every 5 minutes
setInterval(() => {
  const apiPruned = apiCache.prune();
  const assetPruned = assetCache.prune();
  const userDataPruned = userDataCache.prune();
  const componentPruned = componentCache.prune();

  const totalPruned = apiPruned + assetPruned + userDataPruned + componentPruned;

  if (totalPruned > 0) {
    logger.info(`[Cache] Auto-pruned ${totalPruned} expired entries`);
  }
}, 5 * 60 * 1000);

// ==================== EXPORT ====================

export default {
  Cache,
  apiCache,
  assetCache,
  userDataCache,
  componentCache,
  memoizeAsync,
  memoizeSync,
  clearAllCaches,
  getAllCacheStats,
};
