/**
 * Mood Storage Service
 * Provides local persistence for mood entries using SQLite
 * Implements offline-first approach with local data caching
 * Auto-migrates from AsyncStorage to SQLite for better performance
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";
import { logger } from "@shared/utils/logger";

// Storage keys
const STORAGE_KEYS = {
  MOOD_HISTORY: "@solace_mood_history",
  MOOD_STATS: "@solace_mood_stats",
  MOOD_INSIGHTS: "@solace_mood_insights",
  LAST_SYNC: "@solace_mood_last_sync",
};

// TypeScript interfaces
export interface MoodEntry {
  id: string;
  mood: string;
  notes?: string;
  intensity: number;
  activities?: string[];
  timestamp: string | number;
  createdAt?: string;
  synced?: boolean;
}

interface WeeklyStats {
  averageIntensity: number;
  mostCommonMood: string | null;
  totalEntries: number;
  lastUpdated?: string;
}

interface Insight {
  id: string;
  type: string;
  title: string;
  message: string;
  icon: string;
  createdAt?: string;
}

interface MoodData {
  history: MoodEntry[];
  stats: WeeklyStats;
  insights: Insight[];
  lastSync?: string;
}

class MoodStorageService {
  private db: SQLite.SQLiteDatabase | null = null;
  private dbInitialized = false;
  private maxHistorySize = 1000; // Maximum number of mood entries to store (for AsyncStorage fallback)
  private cacheExpiry = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

  /**
   * Initialize SQLite database and create tables
   */
  private async initializeDatabase(): Promise<void> {
    if (this.dbInitialized) return;

    try {
      this.db = await SQLite.openDatabaseAsync("solace_mood.db");

      // Create mood entries table
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS mood_entries (
          id TEXT PRIMARY KEY,
          mood TEXT NOT NULL,
          notes TEXT,
          intensity INTEGER NOT NULL,
          activities TEXT,
          timestamp TEXT NOT NULL,
          createdAt TEXT NOT NULL,
          synced INTEGER DEFAULT 0
        );

        CREATE INDEX IF NOT EXISTS idx_mood_timestamp ON mood_entries(timestamp);
        CREATE INDEX IF NOT EXISTS idx_mood_mood ON mood_entries(mood);
        CREATE INDEX IF NOT EXISTS idx_mood_synced ON mood_entries(synced);
      `);

      this.dbInitialized = true;
      logger.info("Mood SQLite database initialized successfully");

      // Auto-migrate from AsyncStorage if data exists
      await this.migrateFromAsyncStorage();
    } catch (error) {
      logger.error("Failed to initialize mood database", error);
      throw error;
    }
  }

  /**
   * Migrate existing AsyncStorage data to SQLite
   */
  private async migrateFromAsyncStorage(): Promise<void> {
    try {
      // Check if migration already happened
      const migrated = await AsyncStorage.getItem("@solace_mood_migrated");
      if (migrated === "true") {
        logger.info("Mood data already migrated to SQLite");
        return;
      }

      // Get existing AsyncStorage data
      const asyncData = await AsyncStorage.getItem(STORAGE_KEYS.MOOD_HISTORY);
      if (!asyncData) {
        await AsyncStorage.setItem("@solace_mood_migrated", "true");
        return;
      }

      const entries = JSON.parse(asyncData) as MoodEntry[];
      if (entries.length === 0) {
        await AsyncStorage.setItem("@solace_mood_migrated", "true");
        return;
      }

      // Migrate each entry to SQLite
      logger.info(`Migrating ${entries.length} mood entries from AsyncStorage to SQLite`);

      for (const entry of entries) {
        const timestamp = typeof entry.timestamp === "string"
          ? entry.timestamp
          : new Date(entry.timestamp).toISOString();

        await this.db!.runAsync(
          `INSERT OR REPLACE INTO mood_entries
           (id, mood, notes, intensity, activities, timestamp, createdAt, synced)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            entry.id,
            entry.mood,
            entry.notes || null,
            entry.intensity,
            entry.activities ? JSON.stringify(entry.activities) : null,
            timestamp,
            entry.createdAt || timestamp,
            entry.synced ? 1 : 0,
          ]
        );
      }

      // Mark migration as complete
      await AsyncStorage.setItem("@solace_mood_migrated", "true");
      logger.info("Mood migration to SQLite completed successfully");
    } catch (error) {
      logger.error("Failed to migrate mood data from AsyncStorage", error);
      // Don't throw - allow fallback to AsyncStorage
    }
  }

  /**
   * Save a new mood entry to local storage
   */
  async saveMoodEntry(entry: MoodEntry): Promise<MoodEntry> {
    await this.initializeDatabase();

    try {
      const newEntry = {
        ...entry,
        id: entry.id || `mood_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: entry.createdAt || new Date().toISOString(),
        synced: false,
      };

      const timestamp = typeof newEntry.timestamp === "string"
        ? newEntry.timestamp
        : new Date(newEntry.timestamp).toISOString();

      await this.db!.runAsync(
        `INSERT INTO mood_entries
         (id, mood, notes, intensity, activities, timestamp, createdAt, synced)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newEntry.id,
          newEntry.mood,
          newEntry.notes || null,
          newEntry.intensity,
          newEntry.activities ? JSON.stringify(newEntry.activities) : null,
          timestamp,
          newEntry.createdAt,
          newEntry.synced ? 1 : 0,
        ]
      );

      logger.info("Mood entry saved to SQLite", { id: newEntry.id });
      return newEntry;
    } catch (error) {
      logger.error("Failed to save mood entry", error);
      throw error;
    }
  }

  /**
   * Get mood history from local storage
   */
  async getMoodHistory(limit?: number): Promise<MoodEntry[]> {
    await this.initializeDatabase();

    try {
      let sql = "SELECT * FROM mood_entries ORDER BY timestamp DESC";
      const params: any[] = [];

      if (limit && limit > 0) {
        sql += " LIMIT ?";
        params.push(limit);
      }

      const rows = await this.db!.getAllAsync<any>(sql, params);

      return rows.map((row) => ({
        id: row.id,
        mood: row.mood,
        notes: row.notes,
        intensity: row.intensity,
        activities: row.activities ? JSON.parse(row.activities) : undefined,
        timestamp: row.timestamp,
        createdAt: row.createdAt,
        synced: row.synced === 1,
      }));
    } catch (error) {
      logger.error("Failed to get mood history from SQLite", error);
      return [];
    }
  }

  /**
   * Get mood entries for a specific date range (using SQL WHERE for performance)
   */
  async getMoodEntriesByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<MoodEntry[]> {
    await this.initializeDatabase();

    try {
      const rows = await this.db!.getAllAsync<any>(
        `SELECT * FROM mood_entries
         WHERE timestamp >= ? AND timestamp <= ?
         ORDER BY timestamp DESC`,
        [startDate.toISOString(), endDate.toISOString()]
      );

      return rows.map((row) => ({
        id: row.id,
        mood: row.mood,
        notes: row.notes,
        intensity: row.intensity,
        activities: row.activities ? JSON.parse(row.activities) : undefined,
        timestamp: row.timestamp,
        createdAt: row.createdAt,
        synced: row.synced === 1,
      }));
    } catch (error) {
      logger.error("Failed to get mood entries by date range", error);
      return [];
    }
  }

  /**
   * Update an existing mood entry
   */
  async updateMoodEntry(
    entryId: string,
    updates: Partial<MoodEntry>
  ): Promise<MoodEntry | null> {
    await this.initializeDatabase();

    try {
      const fieldsToUpdate: string[] = ["synced = 0"];
      const params: any[] = [];

      if (updates.mood !== undefined) {
        fieldsToUpdate.push("mood = ?");
        params.push(updates.mood);
      }
      if (updates.notes !== undefined) {
        fieldsToUpdate.push("notes = ?");
        params.push(updates.notes);
      }
      if (updates.intensity !== undefined) {
        fieldsToUpdate.push("intensity = ?");
        params.push(updates.intensity);
      }
      if (updates.activities !== undefined) {
        fieldsToUpdate.push("activities = ?");
        params.push(JSON.stringify(updates.activities));
      }

      params.push(entryId); // for WHERE clause

      const result = await this.db!.runAsync(
        `UPDATE mood_entries SET ${fieldsToUpdate.join(", ")} WHERE id = ?`,
        params
      );

      if (result.changes === 0) {
        logger.warn("Mood entry not found", { entryId });
        return null;
      }

      // Return updated entry
      const row = await this.db!.getFirstAsync<any>(
        `SELECT * FROM mood_entries WHERE id = ?`,
        [entryId]
      );

      if (!row) return null;

      logger.info("Mood entry updated", { entryId });
      return {
        id: row.id,
        mood: row.mood,
        notes: row.notes,
        intensity: row.intensity,
        activities: row.activities ? JSON.parse(row.activities) : undefined,
        timestamp: row.timestamp,
        createdAt: row.createdAt,
        synced: row.synced === 1,
      };
    } catch (error) {
      logger.error("Failed to update mood entry", error);
      throw error;
    }
  }

  /**
   * Delete a mood entry
   */
  async deleteMoodEntry(entryId: string): Promise<boolean> {
    await this.initializeDatabase();

    try {
      const result = await this.db!.runAsync(
        `DELETE FROM mood_entries WHERE id = ?`,
        [entryId]
      );

      if (result.changes === 0) {
        logger.warn("Mood entry not found for deletion", { entryId });
        return false;
      }

      logger.info("Mood entry deleted", { entryId });
      return true;
    } catch (error) {
      logger.error("Failed to delete mood entry", error);
      return false;
    }
  }

  /**
   * Save weekly stats
   */
  async saveWeeklyStats(stats: WeeklyStats): Promise<void> {
    try {
      const statsWithTimestamp = {
        ...stats,
        lastUpdated: new Date().toISOString(),
      };

      await AsyncStorage.setItem(
        STORAGE_KEYS.MOOD_STATS,
        JSON.stringify(statsWithTimestamp)
      );

      logger.info("Weekly stats saved");
    } catch (error) {
      logger.error("Failed to save weekly stats", error);
    }
  }

  /**
   * Get weekly stats
   */
  async getWeeklyStats(): Promise<WeeklyStats | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.MOOD_STATS);
      if (!data) {
        return null;
      }

      return JSON.parse(data) as WeeklyStats;
    } catch (error) {
      logger.error("Failed to get weekly stats", error);
      return null;
    }
  }

  /**
   * Save insights
   */
  async saveInsights(insights: Insight[]): Promise<void> {
    try {
      const insightsWithTimestamp = insights.map((insight) => ({
        ...insight,
        createdAt: insight.createdAt || new Date().toISOString(),
      }));

      await AsyncStorage.setItem(
        STORAGE_KEYS.MOOD_INSIGHTS,
        JSON.stringify(insightsWithTimestamp)
      );

      logger.info("Insights saved", { count: insights.length });
    } catch (error) {
      logger.error("Failed to save insights", error);
    }
  }

  /**
   * Get insights
   */
  async getInsights(): Promise<Insight[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.MOOD_INSIGHTS);
      if (!data) {
        return [];
      }

      return JSON.parse(data) as Insight[];
    } catch (error) {
      logger.error("Failed to get insights", error);
      return [];
    }
  }

  /**
   * Get all mood data
   */
  async getAllMoodData(): Promise<MoodData> {
    try {
      const [history, stats, insights, lastSync] = await Promise.all([
        this.getMoodHistory(),
        this.getWeeklyStats(),
        this.getInsights(),
        AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC),
      ]);

      return {
        history,
        stats: stats || {
          averageIntensity: 0,
          mostCommonMood: null,
          totalEntries: 0,
        },
        insights,
        lastSync: lastSync || undefined,
      };
    } catch (error) {
      logger.error("Failed to get all mood data", error);
      return {
        history: [],
        stats: {
          averageIntensity: 0,
          mostCommonMood: null,
          totalEntries: 0,
        },
        insights: [],
      };
    }
  }

  /**
   * Get unsynced entries (for future backend sync)
   */
  async getUnsyncedEntries(): Promise<MoodEntry[]> {
    try {
      const history = await this.getMoodHistory();
      return history.filter((entry) => !entry.synced);
    } catch (error) {
      logger.error("Failed to get unsynced entries", error);
      return [];
    }
  }

  /**
   * Mark entries as synced
   * CRIT-005 FIX: Use SQLite atomic UPDATE instead of read-modify-write to prevent race conditions
   */
  async markEntriesAsSynced(entryIds: string[]): Promise<void> {
    if (!entryIds || entryIds.length === 0) {
      return;
    }

    await this.initializeDatabase();

    try {
      // CRIT-005 FIX: Use SQLite transaction for atomic batch update
      // This prevents race conditions when multiple sync operations run concurrently
      const placeholders = entryIds.map(() => "?").join(", ");

      await this.db!.runAsync(
        `UPDATE mood_entries SET synced = 1 WHERE id IN (${placeholders})`,
        entryIds
      );

      // Update last sync timestamp
      await AsyncStorage.setItem(
        STORAGE_KEYS.LAST_SYNC,
        new Date().toISOString()
      );

      logger.info("Entries marked as synced in SQLite", { count: entryIds.length });
    } catch (error) {
      logger.error("Failed to mark entries as synced", error);
      throw error; // Re-throw so caller knows sync marking failed
    }
  }

  /**
   * Clear all mood data (SQLite and AsyncStorage)
   */
  async clearAllData(): Promise<void> {
    await this.initializeDatabase();

    try {
      // Clear SQLite data
      await this.db!.runAsync(`DELETE FROM mood_entries`);

      // Clear AsyncStorage legacy data
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.MOOD_HISTORY),
        AsyncStorage.removeItem(STORAGE_KEYS.MOOD_STATS),
        AsyncStorage.removeItem(STORAGE_KEYS.MOOD_INSIGHTS),
        AsyncStorage.removeItem(STORAGE_KEYS.LAST_SYNC),
        AsyncStorage.removeItem("@solace_mood_migrated"),
      ]);

      logger.info("All mood data cleared from SQLite and AsyncStorage");
    } catch (error) {
      logger.error("Failed to clear mood data", error);
    }
  }

  /**
   * Export mood data (for backup or sharing)
   */
  async exportMoodData(): Promise<string> {
    try {
      const data = await this.getAllMoodData();
      return JSON.stringify(data, null, 2);
    } catch (error) {
      logger.error("Failed to export mood data", error);
      throw error;
    }
  }

  /**
   * Import mood data (from backup)
   */
  async importMoodData(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData) as MoodData;

      // Validate data structure
      if (!data.history || !Array.isArray(data.history)) {
        throw new Error("Invalid mood data structure");
      }

      // Save imported data
      await Promise.all([
        AsyncStorage.setItem(
          STORAGE_KEYS.MOOD_HISTORY,
          JSON.stringify(data.history)
        ),
        data.stats &&
          AsyncStorage.setItem(
            STORAGE_KEYS.MOOD_STATS,
            JSON.stringify(data.stats)
          ),
        data.insights &&
          AsyncStorage.setItem(
            STORAGE_KEYS.MOOD_INSIGHTS,
            JSON.stringify(data.insights)
          ),
      ]);

      logger.info("Mood data imported successfully");
      return true;
    } catch (error) {
      logger.error("Failed to import mood data", error);
      return false;
    }
  }

  /**
   * Get storage statistics
   */
  async getStorageStats(): Promise<{
    entryCount: number;
    oldestEntry: Date | null;
    newestEntry: Date | null;
    storageSize: number;
  }> {
    try {
      const history = await this.getMoodHistory();

      if (history.length === 0) {
        return {
          entryCount: 0,
          oldestEntry: null,
          newestEntry: null,
          storageSize: 0,
        };
      }

      // Calculate storage size
      const dataString = JSON.stringify(history);
      const storageSize = new Blob([dataString]).size;

      // Get oldest and newest entries
      const timestamps = history.map((entry) =>
        typeof entry.timestamp === "string"
          ? new Date(entry.timestamp)
          : new Date(entry.timestamp)
      );

      return {
        entryCount: history.length,
        oldestEntry: new Date(Math.min(...timestamps.map((d) => d.getTime()))),
        newestEntry: new Date(Math.max(...timestamps.map((d) => d.getTime()))),
        storageSize,
      };
    } catch (error) {
      logger.error("Failed to get storage stats", error);
      return {
        entryCount: 0,
        oldestEntry: null,
        newestEntry: null,
        storageSize: 0,
      };
    }
  }
}

// Export singleton instance
export const moodStorageService = new MoodStorageService();
export default moodStorageService;