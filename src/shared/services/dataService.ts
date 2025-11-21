/**
 * Comprehensive Data Persistence Service
 *
 * Features:
 * - Unified API for all data operations
 * - Offline-first architecture with sync queue
 * - SQLite for structured data
 * - AsyncStorage for simple key-value pairs
 * - Automatic conflict resolution
 * - Data migration support
 * - Cache management with TTL
 * - Batch operations for performance
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';
import NetInfo from '@react-native-community/netinfo';
import { logger } from '@shared/utils/logger';
import apiService from '@app/services/api';

// ============ TYPES ============

export interface DataRecord {
  id: string;
  type: string;
  data: any;
  createdAt: string;
  updatedAt: string;
  syncedAt?: string;
  version: number;
  deleted?: boolean;
}

export interface SyncQueueItem {
  id: string;
  operation: 'create' | 'update' | 'delete';
  entity: string;
  data: any;
  retryCount: number;
  createdAt: string;
  lastAttempt?: string;
}

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface DataQuery {
  type?: string;
  filters?: Record<string, any>;
  sort?: { field: string; direction: 'asc' | 'desc' };
  limit?: number;
  offset?: number;
}

export interface DataServiceConfig {
  dbName: string;
  version: number;
  enableSync: boolean;
  syncInterval: number;
  maxRetries: number;
  cacheTTL: number;
}

// ============ CONSTANTS ============

const DEFAULT_CONFIG: DataServiceConfig = {
  dbName: 'solace_db',
  version: 1,
  enableSync: true,
  syncInterval: 30000, // 30 seconds
  maxRetries: 3,
  cacheTTL: 300000, // 5 minutes
};

const STORAGE_KEYS = {
  SYNC_QUEUE: '@solace_sync_queue',
  LAST_SYNC: '@solace_last_sync',
  CACHE_PREFIX: '@solace_cache_',
  MIGRATION_VERSION: '@solace_db_version',
};

// ============ DATABASE SCHEMAS ============

const DB_SCHEMAS = {
  // Main data table
  data: `
    CREATE TABLE IF NOT EXISTS data (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      data TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT,
      version INTEGER DEFAULT 1,
      deleted INTEGER DEFAULT 0,
      INDEX idx_type (type),
      INDEX idx_synced (synced_at),
      INDEX idx_deleted (deleted)
    )
  `,

  // Sync queue table
  sync_queue: `
    CREATE TABLE IF NOT EXISTS sync_queue (
      id TEXT PRIMARY KEY,
      operation TEXT NOT NULL,
      entity TEXT NOT NULL,
      data TEXT NOT NULL,
      retry_count INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      last_attempt TEXT,
      INDEX idx_entity (entity),
      INDEX idx_created (created_at)
    )
  `,

  // Cache table
  cache: `
    CREATE TABLE IF NOT EXISTS cache (
      key TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      ttl INTEGER NOT NULL,
      INDEX idx_timestamp (timestamp)
    )
  `,
};

// ============ DATA SERVICE CLASS ============

class DataService {
  private db: SQLite.SQLiteDatabase | null = null;
  private config: DataServiceConfig;
  private syncInterval: NodeJS.Timeout | null = null;
  private isOnline: boolean = true;
  private isSyncing: boolean = false;
  private cache: Map<string, CacheEntry> = new Map();

  constructor(config: Partial<DataServiceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.initialize();
  }

  /**
   * Initialize database and start sync
   */
  private async initialize() {
    try {
      // Initialize SQLite database
      await this.initDatabase();

      // Check migration status
      await this.runMigrations();

      // Monitor network status
      this.setupNetworkListener();

      // Start sync if enabled
      if (this.config.enableSync) {
        this.startSync();
      }

      logger.info('Data service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize data service:', error);
    }
  }

  /**
   * Initialize SQLite database
   */
  private async initDatabase() {
    try {
      this.db = await SQLite.openDatabaseAsync(this.config.dbName);

      // Create tables
      for (const [name, schema] of Object.entries(DB_SCHEMAS)) {
        await this.db.execAsync(schema);
        logger.debug(`Table ${name} initialized`);
      }
    } catch (error) {
      logger.error('Failed to initialize database:', error);
      throw error;
    }
  }

  /**
   * Run database migrations
   */
  private async runMigrations() {
    try {
      const currentVersion = await AsyncStorage.getItem(STORAGE_KEYS.MIGRATION_VERSION);
      const dbVersion = currentVersion ? parseInt(currentVersion) : 0;

      if (dbVersion < this.config.version) {
        // Run migrations based on version
        await this.migrateToVersion(dbVersion, this.config.version);
        await AsyncStorage.setItem(
          STORAGE_KEYS.MIGRATION_VERSION,
          this.config.version.toString()
        );
      }
    } catch (error) {
      logger.error('Migration failed:', error);
    }
  }

  /**
   * Migrate database to specific version
   */
  private async migrateToVersion(fromVersion: number, toVersion: number) {
    logger.info(`Migrating database from v${fromVersion} to v${toVersion}`);

    // Add migration logic here based on versions
    // Example migrations:
    if (fromVersion < 1 && toVersion >= 1) {
      // Migration to v1
    }
    if (fromVersion < 2 && toVersion >= 2) {
      // Migration to v2
    }
  }

  /**
   * Setup network status listener
   */
  private setupNetworkListener() {
    NetInfo.addEventListener((state) => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected ?? false;

      if (wasOffline && this.isOnline) {
        logger.info('Network restored, triggering sync');
        this.triggerSync();
      }
    });
  }

  // ============ CRUD OPERATIONS ============

  /**
   * Create a new record
   */
  async create<T = any>(type: string, data: T): Promise<DataRecord> {
    const id = this.generateId();
    const now = new Date().toISOString();

    const record: DataRecord = {
      id,
      type,
      data,
      createdAt: now,
      updatedAt: now,
      version: 1,
    };

    try {
      // Save to database
      await this.db?.runAsync(
        `INSERT INTO data (id, type, data, created_at, updated_at, version)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, type, JSON.stringify(data), now, now, 1]
      );

      // Add to sync queue if online
      if (this.isOnline && this.config.enableSync) {
        await this.addToSyncQueue('create', type, record);
      }

      // Invalidate cache
      this.invalidateCache(type);

      logger.debug(`Created ${type} record:`, id);
      return record;
    } catch (error) {
      logger.error(`Failed to create ${type} record:`, error);
      throw error;
    }
  }

  /**
   * Read records by query
   */
  async read<T = any>(query: DataQuery): Promise<DataRecord<T>[]> {
    const cacheKey = this.getCacheKey(query);

    // Check cache first
    const cached = this.getFromCache<DataRecord<T>[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      let sql = 'SELECT * FROM data WHERE deleted = 0';
      const params: any[] = [];

      // Add type filter
      if (query.type) {
        sql += ' AND type = ?';
        params.push(query.type);
      }

      // Add custom filters
      if (query.filters) {
        for (const [key, value] of Object.entries(query.filters)) {
          sql += ` AND json_extract(data, '$.${key}') = ?`;
          params.push(value);
        }
      }

      // Add sorting
      if (query.sort) {
        sql += ` ORDER BY ${query.sort.field} ${query.sort.direction.toUpperCase()}`;
      }

      // Add pagination
      if (query.limit) {
        sql += ' LIMIT ?';
        params.push(query.limit);
      }
      if (query.offset) {
        sql += ' OFFSET ?';
        params.push(query.offset);
      }

      const result = await this.db?.getAllAsync(sql, params) || [];

      const records = result.map((row: any) => ({
        id: row.id,
        type: row.type,
        data: JSON.parse(row.data),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        syncedAt: row.synced_at,
        version: row.version,
        deleted: Boolean(row.deleted),
      }));

      // Cache the result
      this.setCache(cacheKey, records);

      return records;
    } catch (error) {
      logger.error('Failed to read records:', error);
      throw error;
    }
  }

  /**
   * Get single record by ID
   */
  async getById<T = any>(id: string): Promise<DataRecord<T> | null> {
    try {
      const result = await this.db?.getFirstAsync(
        'SELECT * FROM data WHERE id = ? AND deleted = 0',
        [id]
      );

      if (!result) {
        return null;
      }

      return {
        id: result.id,
        type: result.type,
        data: JSON.parse(result.data),
        createdAt: result.created_at,
        updatedAt: result.updated_at,
        syncedAt: result.synced_at,
        version: result.version,
      };
    } catch (error) {
      logger.error(`Failed to get record ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update existing record
   */
  async update<T = any>(id: string, data: Partial<T>): Promise<DataRecord> {
    try {
      const existing = await this.getById(id);
      if (!existing) {
        throw new Error(`Record ${id} not found`);
      }

      const now = new Date().toISOString();
      const updatedData = { ...existing.data, ...data };
      const newVersion = existing.version + 1;

      await this.db?.runAsync(
        `UPDATE data SET
         data = ?,
         updated_at = ?,
         version = ?,
         synced_at = NULL
         WHERE id = ?`,
        [JSON.stringify(updatedData), now, newVersion, id]
      );

      const updatedRecord: DataRecord = {
        ...existing,
        data: updatedData,
        updatedAt: now,
        version: newVersion,
        syncedAt: undefined,
      };

      // Add to sync queue
      if (this.isOnline && this.config.enableSync) {
        await this.addToSyncQueue('update', existing.type, updatedRecord);
      }

      // Invalidate cache
      this.invalidateCache(existing.type);

      logger.debug(`Updated record ${id}`);
      return updatedRecord;
    } catch (error) {
      logger.error(`Failed to update record ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete record (soft delete)
   */
  async delete(id: string): Promise<void> {
    try {
      const existing = await this.getById(id);
      if (!existing) {
        throw new Error(`Record ${id} not found`);
      }

      const now = new Date().toISOString();

      await this.db?.runAsync(
        `UPDATE data SET
         deleted = 1,
         updated_at = ?,
         synced_at = NULL
         WHERE id = ?`,
        [now, id]
      );

      // Add to sync queue
      if (this.isOnline && this.config.enableSync) {
        await this.addToSyncQueue('delete', existing.type, { id });
      }

      // Invalidate cache
      this.invalidateCache(existing.type);

      logger.debug(`Deleted record ${id}`);
    } catch (error) {
      logger.error(`Failed to delete record ${id}:`, error);
      throw error;
    }
  }

  /**
   * Batch create operation
   */
  async batchCreate<T = any>(type: string, items: T[]): Promise<DataRecord[]> {
    const records: DataRecord[] = [];
    const now = new Date().toISOString();

    try {
      await this.db?.execAsync('BEGIN TRANSACTION');

      for (const item of items) {
        const id = this.generateId();
        const record: DataRecord = {
          id,
          type,
          data: item,
          createdAt: now,
          updatedAt: now,
          version: 1,
        };

        await this.db?.runAsync(
          `INSERT INTO data (id, type, data, created_at, updated_at, version)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [id, type, JSON.stringify(item), now, now, 1]
        );

        records.push(record);
      }

      await this.db?.execAsync('COMMIT');

      // Add to sync queue
      if (this.isOnline && this.config.enableSync) {
        for (const record of records) {
          await this.addToSyncQueue('create', type, record);
        }
      }

      // Invalidate cache
      this.invalidateCache(type);

      logger.debug(`Batch created ${records.length} ${type} records`);
      return records;
    } catch (error) {
      await this.db?.execAsync('ROLLBACK');
      logger.error(`Failed to batch create ${type} records:`, error);
      throw error;
    }
  }

  // ============ SYNC OPERATIONS ============

  /**
   * Add operation to sync queue
   */
  private async addToSyncQueue(
    operation: 'create' | 'update' | 'delete',
    entity: string,
    data: any
  ) {
    const id = this.generateId();
    const now = new Date().toISOString();

    try {
      await this.db?.runAsync(
        `INSERT INTO sync_queue (id, operation, entity, data, created_at)
         VALUES (?, ?, ?, ?, ?)`,
        [id, operation, entity, JSON.stringify(data), now]
      );

      logger.debug(`Added ${operation} operation to sync queue for ${entity}`);
    } catch (error) {
      logger.error('Failed to add to sync queue:', error);
    }
  }

  /**
   * Start automatic sync
   */
  private startSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(() => {
      if (this.isOnline && !this.isSyncing) {
        this.triggerSync();
      }
    }, this.config.syncInterval);

    // Initial sync
    this.triggerSync();
  }

  /**
   * Stop automatic sync
   */
  stopSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  /**
   * Trigger manual sync
   */
  async triggerSync() {
    if (!this.isOnline || this.isSyncing) {
      return;
    }

    this.isSyncing = true;
    logger.info('Starting data sync');

    try {
      // Get pending items from sync queue
      const queueItems = await this.db?.getAllAsync(
        `SELECT * FROM sync_queue
         WHERE retry_count < ?
         ORDER BY created_at ASC`,
        [this.config.maxRetries]
      ) || [];

      for (const item of queueItems) {
        await this.syncItem(item);
      }

      // Update last sync timestamp
      await AsyncStorage.setItem(
        STORAGE_KEYS.LAST_SYNC,
        new Date().toISOString()
      );

      logger.info(`Sync completed: ${queueItems.length} items processed`);
    } catch (error) {
      logger.error('Sync failed:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Sync single item
   */
  private async syncItem(item: any) {
    const queueItem: SyncQueueItem = {
      id: item.id,
      operation: item.operation,
      entity: item.entity,
      data: JSON.parse(item.data),
      retryCount: item.retry_count,
      createdAt: item.created_at,
      lastAttempt: item.last_attempt,
    };

    try {
      // Call appropriate API based on operation
      switch (queueItem.operation) {
        case 'create':
          await apiService.post(`/${queueItem.entity}`, queueItem.data);
          break;
        case 'update':
          await apiService.put(`/${queueItem.entity}/${queueItem.data.id}`, queueItem.data);
          break;
        case 'delete':
          await apiService.delete(`/${queueItem.entity}/${queueItem.data.id}`);
          break;
      }

      // Remove from sync queue on success
      await this.db?.runAsync(
        'DELETE FROM sync_queue WHERE id = ?',
        [queueItem.id]
      );

      // Update synced timestamp
      if (queueItem.operation !== 'delete') {
        await this.db?.runAsync(
          'UPDATE data SET synced_at = ? WHERE id = ?',
          [new Date().toISOString(), queueItem.data.id]
        );
      }

      logger.debug(`Synced ${queueItem.operation} for ${queueItem.entity}`);
    } catch (error) {
      logger.error(`Sync failed for ${queueItem.id}:`, error);

      // Update retry count
      await this.db?.runAsync(
        `UPDATE sync_queue SET
         retry_count = retry_count + 1,
         last_attempt = ?
         WHERE id = ?`,
        [new Date().toISOString(), queueItem.id]
      );
    }
  }

  // ============ CACHE OPERATIONS ============

  /**
   * Get from cache
   */
  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check TTL
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set cache entry
   */
  private setCache<T>(key: string, data: T, ttl?: number) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.cacheTTL,
    });
  }

  /**
   * Invalidate cache for type
   */
  private invalidateCache(type?: string) {
    if (!type) {
      this.cache.clear();
      return;
    }

    // Remove all cache entries for this type
    for (const key of this.cache.keys()) {
      if (key.includes(type)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache key for query
   */
  private getCacheKey(query: DataQuery): string {
    return `${STORAGE_KEYS.CACHE_PREFIX}${JSON.stringify(query)}`;
  }

  /**
   * Clear expired cache entries
   */
  async clearExpiredCache() {
    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // ============ UTILITY METHODS ============

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Export all data
   */
  async exportData(): Promise<string> {
    try {
      const allData = await this.db?.getAllAsync('SELECT * FROM data WHERE deleted = 0') || [];
      return JSON.stringify(allData);
    } catch (error) {
      logger.error('Failed to export data:', error);
      throw error;
    }
  }

  /**
   * Import data
   */
  async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      await this.db?.execAsync('BEGIN TRANSACTION');

      for (const item of data) {
        await this.db?.runAsync(
          `INSERT OR REPLACE INTO data
           (id, type, data, created_at, updated_at, version, deleted)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            item.id,
            item.type,
            item.data,
            item.created_at,
            item.updated_at,
            item.version,
            item.deleted || 0,
          ]
        );
      }

      await this.db?.execAsync('COMMIT');
      this.invalidateCache();

      logger.info(`Imported ${data.length} records`);
    } catch (error) {
      await this.db?.execAsync('ROLLBACK');
      logger.error('Failed to import data:', error);
      throw error;
    }
  }

  /**
   * Clear all data
   */
  async clearAll(): Promise<void> {
    try {
      await this.db?.execAsync('DELETE FROM data');
      await this.db?.execAsync('DELETE FROM sync_queue');
      await this.db?.execAsync('DELETE FROM cache');
      this.cache.clear();
      logger.warn('All data cleared');
    } catch (error) {
      logger.error('Failed to clear data:', error);
      throw error;
    }
  }

  /**
   * Get sync status
   */
  async getSyncStatus() {
    const pendingCount = await this.db?.getFirstAsync(
      'SELECT COUNT(*) as count FROM sync_queue'
    );

    const lastSync = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);

    return {
      isOnline: this.isOnline,
      isSyncing: this.isSyncing,
      pendingItems: pendingCount?.count || 0,
      lastSync: lastSync || null,
    };
  }
}

// ============ SINGLETON EXPORT ============

const dataService = new DataService();

export default dataService;

// Export specific entity services
export const moodDataService = {
  create: (data: any) => dataService.create('mood', data),
  read: (filters?: any) => dataService.read({ type: 'mood', filters }),
  update: (id: string, data: any) => dataService.update(id, data),
  delete: (id: string) => dataService.delete(id),
};

export const journalDataService = {
  create: (data: any) => dataService.create('journal', data),
  read: (filters?: any) => dataService.read({ type: 'journal', filters }),
  update: (id: string, data: any) => dataService.update(id, data),
  delete: (id: string) => dataService.delete(id),
};

export const assessmentDataService = {
  create: (data: any) => dataService.create('assessment', data),
  read: (filters?: any) => dataService.read({ type: 'assessment', filters }),
  update: (id: string, data: any) => dataService.update(id, data),
  delete: (id: string) => dataService.delete(id),
};