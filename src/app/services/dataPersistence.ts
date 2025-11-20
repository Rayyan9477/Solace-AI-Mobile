/**
 * Data Persistence Service
 * Handles offline data storage, caching, and synchronization
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "@shared/utils/logger";

// ==================== TYPES ====================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt?: number;
}

interface SyncQueueItem {
  id: string;
  type: "create" | "update" | "delete";
  endpoint: string;
  data: any;
  timestamp: number;
  retryCount: number;
}

// ==================== CONSTANTS ====================

const STORAGE_KEYS = {
  USER_PROFILE: "@solace/user_profile",
  MOOD_ENTRIES: "@solace/mood_entries",
  JOURNAL_ENTRIES: "@solace/journal_entries",
  ASSESSMENT_RESULTS: "@solace/assessment_results",
  DASHBOARD_CACHE: "@solace/dashboard_cache",
  THERAPY_SESSIONS: "@solace/therapy_sessions",
  COMMUNITY_POSTS: "@solace/community_posts",
  MINDFULNESS_DATA: "@solace/mindfulness_data",
  SYNC_QUEUE: "@solace/sync_queue",
  LAST_SYNC: "@solace/last_sync",
  SETTINGS: "@solace/settings",
} as const;

const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000,      // 5 minutes
  MEDIUM: 30 * 60 * 1000,    // 30 minutes
  LONG: 60 * 60 * 1000,      // 1 hour
  DAY: 24 * 60 * 60 * 1000,  // 1 day
  WEEK: 7 * 24 * 60 * 60 * 1000, // 1 week
} as const;

// ==================== HELPER FUNCTIONS ====================

/**
 * Wrap data with cache metadata
 */
function wrapWithCache<T>(data: T, duration?: number): CacheEntry<T> {
  const now = Date.now();
  return {
    data,
    timestamp: now,
    expiresAt: duration ? now + duration : undefined,
  };
}

/**
 * Check if cache entry is still valid
 */
function isCacheValid<T>(entry: CacheEntry<T>): boolean {
  if (!entry.expiresAt) return true;
  return Date.now() < entry.expiresAt;
}

// ==================== CORE PERSISTENCE SERVICE ====================

class DataPersistenceService {
  private syncQueue: SyncQueueItem[] = [];
  private isSyncing = false;

  constructor() {
    this.loadSyncQueue();
  }

  // ==================== GENERIC STORAGE METHODS ====================

  /**
   * Store data with optional caching
   */
  async setItem<T>(key: string, data: T, cacheDuration?: number): Promise<void> {
    try {
      const wrapped = wrapWithCache(data, cacheDuration);
      const jsonValue = JSON.stringify(wrapped);
      await AsyncStorage.setItem(key, jsonValue);
      logger.debug(`Stored data for key: ${key}`);
    } catch (error) {
      logger.error(`Failed to store data for key: ${key}`, error);
      throw error;
    }
  }

  /**
   * Retrieve data with cache validation
   */
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (!jsonValue) return null;

      const wrapped: CacheEntry<T> = JSON.parse(jsonValue);

      if (!isCacheValid(wrapped)) {
        logger.debug(`Cache expired for key: ${key}`);
        await this.removeItem(key);
        return null;
      }

      return wrapped.data;
    } catch (error) {
      logger.error(`Failed to retrieve data for key: ${key}`, error);
      return null;
    }
  }

  /**
   * Remove item from storage
   */
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
      logger.debug(`Removed data for key: ${key}`);
    } catch (error) {
      logger.error(`Failed to remove data for key: ${key}`, error);
    }
  }

  /**
   * Clear all app data
   */
  async clearAll(): Promise<void> {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);
      logger.info("Cleared all app data");
    } catch (error) {
      logger.error("Failed to clear app data", error);
    }
  }

  // ==================== USER DATA ====================

  async saveUserProfile(profile: any): Promise<void> {
    await this.setItem(STORAGE_KEYS.USER_PROFILE, profile, CACHE_DURATION.DAY);
  }

  async getUserProfile(): Promise<any> {
    return await this.getItem(STORAGE_KEYS.USER_PROFILE);
  }

  // ==================== MOOD DATA ====================

  async saveMoodEntries(entries: any[]): Promise<void> {
    await this.setItem(STORAGE_KEYS.MOOD_ENTRIES, entries, CACHE_DURATION.WEEK);
  }

  async getMoodEntries(): Promise<any[]> {
    const entries = await this.getItem<any[]>(STORAGE_KEYS.MOOD_ENTRIES);
    return entries || [];
  }

  async addMoodEntry(entry: any): Promise<void> {
    const entries = await this.getMoodEntries();
    entries.unshift(entry); // Add to beginning

    // Keep only last 100 entries
    const trimmed = entries.slice(0, 100);
    await this.saveMoodEntries(trimmed);

    // Queue for sync
    await this.addToSyncQueue("create", "/mood/entries", entry);
  }

  // ==================== JOURNAL DATA ====================

  async saveJournalEntries(entries: any[]): Promise<void> {
    await this.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, entries, CACHE_DURATION.WEEK);
  }

  async getJournalEntries(): Promise<any[]> {
    const entries = await this.getItem<any[]>(STORAGE_KEYS.JOURNAL_ENTRIES);
    return entries || [];
  }

  async addJournalEntry(entry: any): Promise<void> {
    const entries = await this.getJournalEntries();
    entries.unshift(entry);

    // Keep only last 50 entries
    const trimmed = entries.slice(0, 50);
    await this.saveJournalEntries(trimmed);

    // Queue for sync
    await this.addToSyncQueue("create", "/journal/entries", entry);
  }

  // ==================== ASSESSMENT DATA ====================

  async saveAssessmentResults(results: any[]): Promise<void> {
    await this.setItem(STORAGE_KEYS.ASSESSMENT_RESULTS, results, CACHE_DURATION.WEEK);
  }

  async getAssessmentResults(): Promise<any[]> {
    const results = await this.getItem<any[]>(STORAGE_KEYS.ASSESSMENT_RESULTS);
    return results || [];
  }

  async addAssessmentResult(result: any): Promise<void> {
    const results = await this.getAssessmentResults();
    results.unshift(result);

    // Keep only last 20 assessments
    const trimmed = results.slice(0, 20);
    await this.saveAssessmentResults(trimmed);

    // Queue for sync
    await this.addToSyncQueue("create", "/assessments", result);
  }

  // ==================== DASHBOARD CACHE ====================

  async saveDashboardCache(data: any): Promise<void> {
    await this.setItem(STORAGE_KEYS.DASHBOARD_CACHE, data, CACHE_DURATION.SHORT);
  }

  async getDashboardCache(): Promise<any> {
    return await this.getItem(STORAGE_KEYS.DASHBOARD_CACHE);
  }

  // ==================== OFFLINE SYNC QUEUE ====================

  /**
   * Add item to sync queue for later processing
   */
  async addToSyncQueue(
    type: "create" | "update" | "delete",
    endpoint: string,
    data: any
  ): Promise<void> {
    const item: SyncQueueItem = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      endpoint,
      data,
      timestamp: Date.now(),
      retryCount: 0,
    };

    this.syncQueue.push(item);
    await this.saveSyncQueue();
    logger.debug(`Added item to sync queue: ${item.id}`);
  }

  /**
   * Save sync queue to storage
   */
  private async saveSyncQueue(): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(this.syncQueue));
  }

  /**
   * Load sync queue from storage
   */
  private async loadSyncQueue(): Promise<void> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
      if (jsonValue) {
        this.syncQueue = JSON.parse(jsonValue);
        logger.debug(`Loaded ${this.syncQueue.length} items from sync queue`);
      }
    } catch (error) {
      logger.error("Failed to load sync queue", error);
      this.syncQueue = [];
    }
  }

  /**
   * Process sync queue when online
   */
  async processSyncQueue(apiService: any): Promise<void> {
    if (this.isSyncing || this.syncQueue.length === 0) return;

    this.isSyncing = true;
    logger.info(`Processing sync queue with ${this.syncQueue.length} items`);

    const processedIds: string[] = [];

    for (const item of this.syncQueue) {
      try {
        // Call appropriate API method based on type and endpoint
        switch (item.type) {
          case "create":
            await this.syncCreate(apiService, item);
            break;
          case "update":
            await this.syncUpdate(apiService, item);
            break;
          case "delete":
            await this.syncDelete(apiService, item);
            break;
        }

        processedIds.push(item.id);
        logger.debug(`Successfully synced item: ${item.id}`);
      } catch (error) {
        logger.error(`Failed to sync item: ${item.id}`, error);
        item.retryCount++;

        // Remove from queue if max retries exceeded
        if (item.retryCount >= 3) {
          processedIds.push(item.id);
          logger.warn(`Removing item from sync queue after 3 failed attempts: ${item.id}`);
        }
      }
    }

    // Remove processed items from queue
    this.syncQueue = this.syncQueue.filter(item => !processedIds.includes(item.id));
    await this.saveSyncQueue();

    // Update last sync timestamp
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());

    this.isSyncing = false;
    logger.info(`Sync queue processing complete. ${processedIds.length} items processed`);
  }

  /**
   * Sync create operation
   */
  private async syncCreate(apiService: any, item: SyncQueueItem): Promise<void> {
    const endpoint = item.endpoint;

    // Map endpoints to API methods
    if (endpoint.includes("/mood/entries")) {
      await apiService.mood.createMoodEntry(item.data);
    } else if (endpoint.includes("/journal/entries")) {
      await apiService.journal.createEntry(item.data);
    } else if (endpoint.includes("/assessments")) {
      await apiService.assessment.submitAssessment(item.data);
    } else {
      throw new Error(`Unknown endpoint: ${endpoint}`);
    }
  }

  /**
   * Sync update operation
   */
  private async syncUpdate(apiService: any, item: SyncQueueItem): Promise<void> {
    const endpoint = item.endpoint;
    const { id, ...data } = item.data;

    if (endpoint.includes("/mood/entries")) {
      await apiService.mood.updateMoodEntry(id, data);
    } else if (endpoint.includes("/journal/entries")) {
      await apiService.journal.updateEntry(id, data);
    } else {
      throw new Error(`Unknown endpoint: ${endpoint}`);
    }
  }

  /**
   * Sync delete operation
   */
  private async syncDelete(apiService: any, item: SyncQueueItem): Promise<void> {
    const endpoint = item.endpoint;
    const { id } = item.data;

    if (endpoint.includes("/mood/entries")) {
      await apiService.mood.deleteMoodEntry(id);
    } else if (endpoint.includes("/journal/entries")) {
      await apiService.journal.deleteEntry(id);
    } else {
      throw new Error(`Unknown endpoint: ${endpoint}`);
    }
  }

  // ==================== SETTINGS ====================

  async saveSettings(settings: any): Promise<void> {
    await this.setItem(STORAGE_KEYS.SETTINGS, settings);
  }

  async getSettings(): Promise<any> {
    return await this.getItem(STORAGE_KEYS.SETTINGS);
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Get storage info (size, keys)
   */
  async getStorageInfo(): Promise<{
    keys: string[];
    sizeInBytes: number;
  }> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      let totalSize = 0;

      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += new Blob([value]).size;
        }
      }

      return {
        keys,
        sizeInBytes: totalSize,
      };
    } catch (error) {
      logger.error("Failed to get storage info", error);
      return {
        keys: [],
        sizeInBytes: 0,
      };
    }
  }

  /**
   * Check if we have offline data that needs syncing
   */
  async hasOfflineData(): Promise<boolean> {
    await this.loadSyncQueue();
    return this.syncQueue.length > 0;
  }

  /**
   * Get last sync timestamp
   */
  async getLastSync(): Promise<string | null> {
    return await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
  }
}

// Export singleton instance
const dataPersistence = new DataPersistenceService();
export default dataPersistence;

// Export types
export { STORAGE_KEYS, CACHE_DURATION };
export type { CacheEntry, SyncQueueItem };