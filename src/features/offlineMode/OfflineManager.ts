import { logger } from "@shared/utils/logger";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform, Alert } from "react-native";

// TypeScript type declarations
declare const __DEV__: boolean;

// Conditionally import NetInfo for native platforms only
let NetInfo: any;
if (Platform.OS !== "web") {
  NetInfo = require("@react-native-community/netinfo").default;
}

// TypeScript interfaces for Offline Manager

interface ConnectivityState {
  isOnline: boolean;
  connectionType: string;
  wasOnline: boolean;
}

interface ConnectivityListener {
  (state: ConnectivityState): void;
}

interface OfflineDataItem {
  id: string;
  timestamp: string;
  offline?: boolean;
  synced?: boolean;
  serverSyncedAt?: string;
  lastModified?: string;
  [key: string]: any;
}

interface OfflineData {
  moodEntries: OfflineDataItem[];
  therapySessions: OfflineDataItem[];
  journalEntries: OfflineDataItem[];
  preferences: Record<string, any>;
  crisisEvents: OfflineDataItem[];
}

interface SyncQueueOperation {
  type: "CREATE" | "UPDATE" | "DELETE";
  dataType: string;
  data?: OfflineDataItem;
  id?: string;
  updates?: Partial<OfflineDataItem>;
  timestamp: string;
  queuedAt?: string;
  attempts?: number;
  status?: "pending" | "completed" | "failed" | "retry";
  lastError?: string;
  completedAt?: string;
}

interface SyncResults {
  successful: number;
  failed: number;
  errors: {
    operation: string;
    dataType: string;
    error: string;
  }[];
}

interface OfflineDataFilters {
  limit?: number;
  since?: string;
  synced?: boolean;
}

interface TherapyExercise {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  duration: string;
  category: string;
}

interface CrisisResource {
  name: string;
  number: string;
  keyword?: string;
  description: string;
  type: string;
}

interface EssentialData {
  cachedAt: string;
  recentMoods: any[];
  therapyExercises: TherapyExercise[];
  crisisResources: CrisisResource[];
  userPreferences: Record<string, any>;
}

interface StorageInfo {
  hasSpace: boolean;
  currentSize?: number;
  maxSize?: number;
  usagePercentage?: number;
  error?: string;
}

interface OfflineStatus {
  isOnline: boolean;
  connectionType: string;
  offlineDataCount: {
    moodEntries: number;
    therapySessions: number;
    journalEntries: number;
    crisisEvents: number;
  };
  syncQueueLength: number;
  pendingSync: number;
  storage: StorageInfo;
  dataSize: number;
  unsyncedCount: number;
}

interface ForceSyncResults {
  success: boolean;
  queueResults: SyncResults;
  dataResults: { successful: number; failed: number };
  totalSuccessful: number;
  totalFailed: number;
}

/**
 * Offline Mode Manager for Mental Health App
 * Handles offline functionality, data synchronization, and connectivity management
 */

class OfflineManager {
  private isOnline: boolean;
  private connectionType: string;
  private listeners: ConnectivityListener[];
  private syncQueue: SyncQueueOperation[];
  private offlineData: OfflineData;
  private networkUnsubscribe?: () => void;

  constructor() {
    this.isOnline = true;
    this.connectionType = "unknown";
    this.listeners = [];
    this.syncQueue = [];
    this.offlineData = {
      moodEntries: [],
      therapySessions: [],
      journalEntries: [],
      preferences: {},
      crisisEvents: [],
    };

    this.setupNetworkListener();
    this.loadOfflineData();
  }

  /**
   * Setup network connectivity listener
   */
  setupNetworkListener(): void {
    // For web platform, use navigator.onLine
    if (Platform.OS === "web") {
      this.isOnline = navigator.onLine;
      this.connectionType = navigator.onLine ? "wifi" : "none";

      // Listen for online/offline events on web
      window.addEventListener("online", () => {
        const wasOnline = this.isOnline;
        this.isOnline = true;
        this.connectionType = "wifi";
        this.notifyListeners({
          isOnline: this.isOnline,
          connectionType: this.connectionType,
          wasOnline,
        });
        if (!wasOnline && this.isOnline) {
          this.handleOnlineTransition();
        }
      });

      window.addEventListener("offline", () => {
        const wasOnline = this.isOnline;
        this.isOnline = false;
        this.connectionType = "none";
        this.notifyListeners({
          isOnline: this.isOnline,
          connectionType: this.connectionType,
          wasOnline,
        });
        if (wasOnline && !this.isOnline) {
          this.handleOfflineTransition();
        }
      });
      return;
    }

    // For native platforms, use NetInfo
    if (NetInfo) {
      this.networkUnsubscribe = NetInfo.addEventListener((state: any) => {
        const wasOnline = this.isOnline;
        this.isOnline = state.isConnected && state.isInternetReachable;
        this.connectionType = state.type;

        // Notify listeners of connectivity change
        this.notifyListeners({
          isOnline: this.isOnline,
          connectionType: this.connectionType,
          wasOnline,
        });

        // Handle online/offline transitions
        if (!wasOnline && this.isOnline) {
          this.handleOnlineTransition();
        } else if (wasOnline && !this.isOnline) {
          this.handleOfflineTransition();
        }
      });
    }
  }

  /**
   * Add connectivity listener
   */
  addConnectivityListener(callback: ConnectivityListener): () => void {
    this.listeners.push(callback);

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(
        (listener) => listener !== callback,
      );
    };
  }

  /**
   * Notify all listeners of connectivity changes
   */
  notifyListeners(connectivityState: ConnectivityState): void {
    this.listeners.forEach((callback) => {
      try {
        callback(connectivityState);
      } catch (error) {
        if (__DEV__) {
          logger.error("Error notifying connectivity listener:", error);
        }
      }
    });
  }

  /**
   * Handle transition from offline to online
   */
  async handleOnlineTransition(): Promise<void> {
    if (__DEV__) {
      logger.debug("Device came online - starting sync process");
    }

    // Show user that sync is happening
    this.showSyncNotification("Syncing your data...");

    try {
      // Sync queued operations
      await this.processSyncQueue();

      // Sync offline data
      await this.syncOfflineData();

      this.showSyncNotification("Sync completed successfully", "success");
    } catch (error) {
      if (__DEV__) {
        logger.error("Error during online transition sync:", error);
      }
      this.showSyncNotification(
        "Sync encountered some issues, but your data is safe",
        "warning",
      );
    }
  }

  /**
   * Handle transition from online to offline
   */
  async handleOfflineTransition(): Promise<void> {
    if (__DEV__) {
      logger.debug("Device went offline - enabling offline mode");
    }

    // Notify user about offline mode
    Alert.alert(
      "Offline Mode Activated",
      "You can continue using the app. Your data will be saved locally and synced when you reconnect.",
      [{ text: "OK" }],
    );

    // Save current online data for offline use
    await this.cacheEssentialData();
  }

  /**
   * Load offline data from local storage
   */
  async loadOfflineData(): Promise<void> {
    try {
      const keys = [
        "offline_mood_entries",
        "offline_therapy_sessions",
        "offline_journal_entries",
        "offline_preferences",
        "offline_crisis_events",
        "sync_queue",
      ];

      const values = await AsyncStorage.multiGet(keys);

      values.forEach(([key, value]) => {
        if (value) {
          const parsedValue = JSON.parse(value);

          switch (key) {
            case "offline_mood_entries":
              this.offlineData.moodEntries = parsedValue;
              break;
            case "offline_therapy_sessions":
              this.offlineData.therapySessions = parsedValue;
              break;
            case "offline_journal_entries":
              this.offlineData.journalEntries = parsedValue;
              break;
            case "offline_preferences":
              this.offlineData.preferences = parsedValue;
              break;
            case "offline_crisis_events":
              this.offlineData.crisisEvents = parsedValue;
              break;
            case "sync_queue":
              this.syncQueue = parsedValue;
              break;
          }
        }
      });

      if (__DEV__) {
        logger.debug("Offline data loaded successfully");
      }
    } catch (error) {
      if (__DEV__) {
        logger.error("Error loading offline data:", error);
      }
    }
  }

  /**
   * Save data while offline
   */
  async saveOfflineData(
    dataType: string,
    data: any,
  ): Promise<{ success: boolean; offline: boolean }> {
    try {
      // Add to offline data
      (this.offlineData as any)[dataType].push({
        ...data,
        id: data.id || `offline_${Date.now()}`,
        timestamp: data.timestamp || new Date().toISOString(),
        offline: true,
        synced: false,
      });

      // Save to AsyncStorage
      await AsyncStorage.setItem(
        `offline_${dataType}`,
        JSON.stringify((this.offlineData as any)[dataType]),
      );

      // Add to sync queue
      await this.addToSyncQueue({
        type: "CREATE",
        dataType,
        data: (this.offlineData as any)[dataType][
          (this.offlineData as any)[dataType].length - 1
        ],
        timestamp: new Date().toISOString(),
      });

      return { success: true, offline: true };
    } catch (error) {
      if (__DEV__) {
        logger.error("Error saving offline data:", error);
      }
      throw error;
    }
  }

  /**
   * Get offline data
   */
  async getOfflineData(
    dataType: string,
    filters: OfflineDataFilters = {},
  ): Promise<{ data: OfflineDataItem[]; offline: boolean }> {
    try {
      let data = (this.offlineData as any)[dataType] || [];

      // Apply filters
      if (filters.limit) {
        data = data.slice(0, filters.limit);
      }

      if (filters.since) {
        const sinceDate = new Date(filters.since);
        data = data.filter(
          (item: OfflineDataItem) => new Date(item.timestamp) >= sinceDate,
        );
      }

      if (filters.synced !== undefined) {
        data = data.filter(
          (item: OfflineDataItem) => item.synced === filters.synced,
        );
      }

      return { data, offline: true };
    } catch (error) {
      if (__DEV__) {
        logger.error("Error getting offline data:", error);
      }
      throw error;
    }
  }

  /**
   * Update offline data
   */
  async updateOfflineData(
    dataType: string,
    id: string,
    updates: Partial<OfflineDataItem>,
  ): Promise<{ success: boolean; offline: boolean }> {
    try {
      const dataIndex = (this.offlineData as any)[dataType].findIndex(
        (item: OfflineDataItem) => item.id === id,
      );

      if (dataIndex !== -1) {
        (this.offlineData as any)[dataType][dataIndex] = {
          ...(this.offlineData as any)[dataType][dataIndex],
          ...updates,
          lastModified: new Date().toISOString(),
        };

        // Save to AsyncStorage
        await AsyncStorage.setItem(
          `offline_${dataType}`,
          JSON.stringify((this.offlineData as any)[dataType]),
        );

        // Add to sync queue
        await this.addToSyncQueue({
          type: "UPDATE",
          dataType,
          id,
          updates,
          timestamp: new Date().toISOString(),
        });

        return { success: true, offline: true };
      } else {
        throw new Error("Item not found in offline data");
      }
    } catch (error) {
      if (__DEV__) {
        logger.error("Error updating offline data:", error);
      }
      throw error;
    }
  }

  /**
   * Delete offline data
   */
  async deleteOfflineData(
    dataType: string,
    id: string,
  ): Promise<{ success: boolean; offline: boolean }> {
    try {
      (this.offlineData as any)[dataType] = (this.offlineData as any)[
        dataType
      ].filter((item: OfflineDataItem) => item.id !== id);

      // Save to AsyncStorage
      await AsyncStorage.setItem(
        `offline_${dataType}`,
        JSON.stringify((this.offlineData as any)[dataType]),
      );

      // Add to sync queue
      await this.addToSyncQueue({
        type: "DELETE",
        dataType,
        id,
        timestamp: new Date().toISOString(),
      });

      return { success: true, offline: true };
    } catch (error) {
      if (__DEV__) {
        logger.error("Error deleting offline data:", error);
      }
      throw error;
    }
  }

  /**
   * Add operation to sync queue
   */
  async addToSyncQueue(
    operation: Omit<SyncQueueOperation, "queuedAt" | "attempts" | "status">,
  ): Promise<void> {
    try {
      this.syncQueue.push({
        ...operation,
        queuedAt: new Date().toISOString(),
        attempts: 0,
        status: "pending",
      });

      await AsyncStorage.setItem("sync_queue", JSON.stringify(this.syncQueue));
    } catch (error) {
      if (__DEV__) {
        logger.error("Error adding to sync queue:", error);
      }
    }
  }

  /**
   * Process sync queue when back online
   */
  async processSyncQueue(): Promise<SyncResults | undefined> {
    if (!this.isOnline || this.syncQueue.length === 0) return;

    if (__DEV__) {
      logger.debug(`Processing ${this.syncQueue.length} items in sync queue`);
    }

    const results: SyncResults = {
      successful: 0,
      failed: 0,
      errors: [],
    };

    for (let i = 0; i < this.syncQueue.length; i++) {
      const operation = this.syncQueue[i];

      try {
        await this.syncOperation(operation);
        operation.status = "completed";
        operation.completedAt = new Date().toISOString();
        results.successful++;
      } catch (error) {
        if (__DEV__) {
          logger.error(`Error syncing operation ${i}:`, error);
        }
        operation.attempts = (operation.attempts || 0) + 1;
        operation.lastError =
          error instanceof Error ? error.message : String(error);
        operation.status = operation.attempts >= 3 ? "failed" : "retry";

        if (operation.status === "failed") {
          results.failed++;
          results.errors.push({
            operation: operation.type,
            dataType: operation.dataType,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }
    }

    // Remove completed operations and failed ones (after max attempts)
    this.syncQueue = this.syncQueue.filter(
      (op) => op.status !== "completed" && op.status !== "failed",
    );

    // Save updated queue
    await AsyncStorage.setItem("sync_queue", JSON.stringify(this.syncQueue));

    if (__DEV__) {
      logger.debug("Sync queue processing completed:", results);
    }
    return results;
  }

  /**
   * Sync individual operation
   */
  async syncOperation(
    operation: SyncQueueOperation,
  ): Promise<{ success: boolean }> {
    const { type, dataType, data, id, updates } = operation;

    switch (type) {
      case "CREATE":
        if (!data) throw new Error("Data is required for CREATE operation");
        return await this.syncCreateOperation(dataType, data);
      case "UPDATE":
        if (!id || !updates)
          throw new Error("ID and updates are required for UPDATE operation");
        return await this.syncUpdateOperation(dataType, id, updates);
      case "DELETE":
        if (!id) throw new Error("ID is required for DELETE operation");
        return await this.syncDeleteOperation(dataType, id);
      default:
        throw new Error(`Unknown operation type: ${type}`);
    }
  }

  /**
   * Sync create operation
   */
  async syncCreateOperation(
    dataType: string,
    data: OfflineDataItem,
  ): Promise<{ success: boolean }> {
    // Mock API call - replace with actual API
    if (__DEV__) {
      logger.debug(`Syncing CREATE ${dataType}:`, data.id);
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Update local data to mark as synced
    const localItemIndex = (this.offlineData as any)[dataType].findIndex(
      (item: OfflineDataItem) => item.id === data.id,
    );
    if (localItemIndex !== -1) {
      (this.offlineData as any)[dataType][localItemIndex].synced = true;
      (this.offlineData as any)[dataType][localItemIndex].serverSyncedAt =
        new Date().toISOString();

      await AsyncStorage.setItem(
        `offline_${dataType}`,
        JSON.stringify((this.offlineData as any)[dataType]),
      );
    }

    return { success: true };
  }

  /**
   * Sync update operation
   */
  async syncUpdateOperation(
    dataType: string,
    id: string,
    updates: Partial<OfflineDataItem>,
  ): Promise<{ success: boolean }> {
    // Mock API call - replace with actual API
    if (__DEV__) {
      logger.debug(`Syncing UPDATE ${dataType} ${id}:`, updates);
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    return { success: true };
  }

  /**
   * Sync delete operation
   */
  async syncDeleteOperation(
    dataType: string,
    id: string,
  ): Promise<{ success: boolean }> {
    // Mock API call - replace with actual API
    if (__DEV__) {
      logger.debug(`Syncing DELETE ${dataType} ${id}`);
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 200));

    return { success: true };
  }

  /**
   * Sync all offline data with server
   * HIGH-012 FIX: Implement batched sync to prevent memory exhaustion
   */
  async syncOfflineData(): Promise<
    { successful: number; failed: number } | undefined
  > {
    if (!this.isOnline) return;

    // HIGH-012 FIX: Batch size limit to prevent memory exhaustion
    const BATCH_SIZE = 10;
    let totalSuccessful = 0;
    let totalFailed = 0;

    // Sync each data type with batching
    for (const [dataType, items] of Object.entries(this.offlineData)) {
      if (Array.isArray(items)) {
        const unsyncedItems = items.filter((item) => !item.synced);

        if (unsyncedItems.length > 0) {
          // HIGH-012 FIX: Process in batches to prevent memory exhaustion
          for (let i = 0; i < unsyncedItems.length; i += BATCH_SIZE) {
            const batch = unsyncedItems.slice(i, i + BATCH_SIZE);
            const batchPromises = batch.map((item) =>
              this.syncDataType(dataType, [item])
            );

            const results = await Promise.allSettled(batchPromises);

            totalSuccessful += results.filter(
              (result) => result.status === "fulfilled"
            ).length;
            totalFailed += results.filter(
              (result) => result.status === "rejected"
            ).length;

            // HIGH-012 FIX: Allow event loop to breathe between batches
            if (i + BATCH_SIZE < unsyncedItems.length) {
              await new Promise((resolve) => setTimeout(resolve, 50));
            }
          }
        }
      }
    }

    if (__DEV__) {
      logger.debug(
        `Data sync completed: ${totalSuccessful} successful, ${totalFailed} failed`,
      );
    }

    return { successful: totalSuccessful, failed: totalFailed };
  }

  /**
   * Sync specific data type
   */
  async syncDataType(
    dataType: string,
    items: OfflineDataItem[],
  ): Promise<{ dataType: string; count: number }> {
    if (__DEV__) {
      logger.debug(`Syncing ${items.length} ${dataType} items`);
    }

    for (const item of items) {
      try {
        await this.syncCreateOperation(dataType, item);
      } catch (error) {
        if (__DEV__) {
          logger.error(`Error syncing ${dataType} item ${item.id}:`, error);
        }
        throw error;
      }
    }

    return { dataType, count: items.length };
  }

  /**
   * Cache essential data for offline use
   */
  async cacheEssentialData(): Promise<void> {
    try {
      // Cache recent mood history for offline insights
      // Cache therapy exercises and resources
      // Cache user preferences
      // This would typically fetch from current app state/Redux store

      const essentialData = {
        cachedAt: new Date().toISOString(),
        recentMoods: [], // Would be populated from app state
        therapyExercises: this.getOfflineTherapyExercises(),
        crisisResources: this.getOfflineCrisisResources(),
        userPreferences: {}, // Would be populated from app state
      };

      await AsyncStorage.setItem(
        "offline_cache",
        JSON.stringify(essentialData),
      );

      if (__DEV__) {
        logger.debug("Essential data cached for offline use");
      }
    } catch (error) {
      if (__DEV__) {
        logger.error("Error caching essential data:", error);
      }
    }
  }

  /**
   * Get offline therapy exercises
   */
  getOfflineTherapyExercises(): TherapyExercise[] {
    return [
      {
        id: "breathing_4_7_8",
        title: "4-7-8 Breathing Exercise",
        description: "A calming breathing technique to reduce anxiety",
        instructions: [
          "Exhale completely through your mouth",
          "Inhale through your nose for 4 counts",
          "Hold your breath for 7 counts",
          "Exhale through your mouth for 8 counts",
          "Repeat 3-4 times",
        ],
        duration: "2-3 minutes",
        category: "anxiety",
      },
      {
        id: "grounding_5_4_3_2_1",
        title: "5-4-3-2-1 Grounding Technique",
        description: "A mindfulness exercise to help you feel present",
        instructions: [
          "Name 5 things you can see",
          "Name 4 things you can touch",
          "Name 3 things you can hear",
          "Name 2 things you can smell",
          "Name 1 thing you can taste",
        ],
        duration: "3-5 minutes",
        category: "grounding",
      },
      {
        id: "progressive_relaxation",
        title: "Progressive Muscle Relaxation",
        description: "Systematic relaxation of muscle groups",
        instructions: [
          "Start with your toes and tense them for 5 seconds",
          "Release and notice the relaxation",
          "Move up to your calves and repeat",
          "Continue through each muscle group",
          "End with your face and scalp",
        ],
        duration: "10-15 minutes",
        category: "relaxation",
      },
    ];
  }

  /**
   * Get offline crisis resources
   */
  getOfflineCrisisResources(): CrisisResource[] {
    return [
      {
        name: "988 Suicide & Crisis Lifeline",
        number: "988",
        description: "24/7 free and confidential crisis support",
        type: "phone",
      },
      {
        name: "Crisis Text Line",
        number: "741741",
        keyword: "HOME",
        description: "Text HOME to 741741 for crisis counseling",
        type: "text",
      },
      {
        name: "Emergency Services",
        number: "911",
        description: "For immediate life-threatening emergencies",
        type: "emergency",
      },
    ];
  }

  /**
   * Check if device has sufficient storage for offline mode
   */
  async checkStorageSpace(): Promise<StorageInfo> {
    try {
      // This is a simplified check - in a real app, you'd use a library like
      // react-native-device-info to get actual storage information

      const currentDataSize = await this.calculateOfflineDataSize();
      const maxAllowedSize = 50 * 1024 * 1024; // 50MB limit

      return {
        hasSpace: currentDataSize < maxAllowedSize,
        currentSize: currentDataSize,
        maxSize: maxAllowedSize,
        usagePercentage: (currentDataSize / maxAllowedSize) * 100,
      };
    } catch (error) {
      if (__DEV__) {
        logger.error("Error checking storage space:", error);
      }
      return {
        hasSpace: true,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Calculate size of offline data
   */
  async calculateOfflineDataSize(): Promise<number> {
    try {
      let totalSize = 0;

      for (const dataType of Object.keys(this.offlineData)) {
        const data = await AsyncStorage.getItem(`offline_${dataType}`);
        if (data) {
          totalSize += new Blob([data]).size;
        }
      }

      // Add sync queue size
      const syncQueueData = await AsyncStorage.getItem("sync_queue");
      if (syncQueueData) {
        totalSize += new Blob([syncQueueData]).size;
      }

      return totalSize;
    } catch (error) {
      if (__DEV__) {
        logger.error("Error calculating data size:", error);
      }
      return 0;
    }
  }

  /**
   * Clean up old offline data
   */
  async cleanupOfflineData(
    daysToKeep: number = 30,
  ): Promise<{ cleanedItems: number }> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      let cleanedItems = 0;

      for (const [dataType, items] of Object.entries(this.offlineData)) {
        if (Array.isArray(items)) {
          const beforeCount = items.length;

          (this.offlineData as any)[dataType] = items.filter(
            (item: OfflineDataItem) => {
              const itemDate = new Date(item.timestamp);
              return itemDate >= cutoffDate || !item.synced; // Keep recent items and unsynced items
            },
          );

          const afterCount = (this.offlineData as any)[dataType].length;
          cleanedItems += beforeCount - afterCount;

          // Save cleaned data
          if (beforeCount !== afterCount) {
            await AsyncStorage.setItem(
              `offline_${dataType}`,
              JSON.stringify((this.offlineData as any)[dataType]),
            );
          }
        }
      }

      // Clean up completed sync queue items older than 7 days
      const queueCutoffDate = new Date();
      queueCutoffDate.setDate(queueCutoffDate.getDate() - 7);

      const beforeQueueCount = this.syncQueue.length;
      this.syncQueue = this.syncQueue.filter((item: SyncQueueOperation) => {
        if (!item.queuedAt) return true;
        const itemDate = new Date(item.queuedAt);
        return itemDate >= queueCutoffDate || item.status !== "completed";
      });

      if (beforeQueueCount !== this.syncQueue.length) {
        await AsyncStorage.setItem(
          "sync_queue",
          JSON.stringify(this.syncQueue),
        );
        cleanedItems += beforeQueueCount - this.syncQueue.length;
      }

      if (__DEV__) {
        logger.debug(`Cleanup completed: ${cleanedItems} items removed`);
      }
      return { cleanedItems };
    } catch (error) {
      if (__DEV__) {
        logger.error("Error cleaning up offline data:", error);
      }
      throw error;
    }
  }

  /**
   * Show sync notification to user
   */
  showSyncNotification(message: string, type: string = "info"): void {
    if (__DEV__) {
      logger.debug(`[${type.toUpperCase()}] Sync: ${message}`);
    }

    // In production, this integrates with the app's notification system
    // For now, using Alert as a fallback until toast/banner component is available
    if (type === "error") {
      // Only show alerts for errors to avoid notification fatigue
      import("react-native").then(({ Alert }) => {
        Alert.alert("Sync Status", message);
      });
    }
  }

  /**
   * Get offline mode status and statistics
   */
  async getOfflineStatus(): Promise<OfflineStatus> {
    const storageInfo = await this.checkStorageSpace();
    const dataSize = await this.calculateOfflineDataSize();

    return {
      isOnline: this.isOnline,
      connectionType: this.connectionType,
      offlineDataCount: {
        moodEntries: this.offlineData.moodEntries.length,
        therapySessions: this.offlineData.therapySessions.length,
        journalEntries: this.offlineData.journalEntries.length,
        crisisEvents: this.offlineData.crisisEvents.length,
      },
      syncQueueLength: this.syncQueue.length,
      pendingSync: this.syncQueue.filter((item) => item.status === "pending")
        .length,
      storage: storageInfo,
      dataSize: Math.round(dataSize / 1024), // Size in KB
      unsyncedCount: Object.values(this.offlineData)
        .filter(Array.isArray)
        .reduce(
          (total, items) => total + items.filter((item) => !item.synced).length,
          0,
        ),
    };
  }

  /**
   * Force sync all data
   */
  async forceSyncAll(): Promise<ForceSyncResults> {
    if (!this.isOnline) {
      throw new Error("Device is offline. Cannot force sync.");
    }

    if (__DEV__) {
      logger.debug("Starting forced sync of all data...");
    }

    try {
      const queueResults = (await this.processSyncQueue()) || {
        successful: 0,
        failed: 0,
        errors: [],
      };
      const dataResults = (await this.syncOfflineData()) || {
        successful: 0,
        failed: 0,
      };

      const totalSuccessful = queueResults.successful + dataResults.successful;
      const totalFailed = queueResults.failed + dataResults.failed;

      this.showSyncNotification(
        `Sync completed: ${totalSuccessful} successful, ${totalFailed} failed`,
        totalFailed === 0 ? "success" : "warning",
      );

      return {
        success: totalFailed === 0,
        queueResults,
        dataResults,
        totalSuccessful,
        totalFailed,
      };
    } catch (error) {
      if (__DEV__) {
        logger.error("Error during forced sync:", error);
      }
      this.showSyncNotification(
        "Sync failed: " +
          (error instanceof Error ? error.message : String(error)),
        "error",
      );
      throw error;
    }
  }

  /**
   * Cleanup method - call when app is closing
   */
  cleanup(): void {
    if (this.networkUnsubscribe) {
      this.networkUnsubscribe();
    }
    this.listeners = [];
  }
}

export default new OfflineManager();
