/**
 * Mood Storage Service
 * Provides local persistence for mood entries using AsyncStorage
 * Implements offline-first approach with local data caching
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "@shared/utils/logger";

// Storage keys
const STORAGE_KEYS = {
  MOOD_HISTORY: "@solace_mood_history",
  MOOD_STATS: "@solace_mood_stats",
  MOOD_INSIGHTS: "@solace_mood_insights",
  LAST_SYNC: "@solace_mood_last_sync",
};

// TypeScript interfaces
interface MoodEntry {
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
  private maxHistorySize = 1000; // Maximum number of mood entries to store
  private cacheExpiry = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

  /**
   * Save a new mood entry to local storage
   */
  async saveMoodEntry(entry: MoodEntry): Promise<MoodEntry> {
    try {
      // Get existing history
      const history = await this.getMoodHistory();

      // Add new entry with unique ID if not present
      const newEntry = {
        ...entry,
        id: entry.id || `mood_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: entry.createdAt || new Date().toISOString(),
        synced: false, // Mark as unsynced for future backend sync
      };

      // Add to beginning of array (most recent first)
      history.unshift(newEntry);

      // Limit history size
      if (history.length > this.maxHistorySize) {
        history.pop();
      }

      // Save updated history
      await AsyncStorage.setItem(
        STORAGE_KEYS.MOOD_HISTORY,
        JSON.stringify(history)
      );

      logger.info("Mood entry saved locally", { id: newEntry.id });
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
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.MOOD_HISTORY);
      if (!data) {
        return [];
      }

      const history = JSON.parse(data) as MoodEntry[];

      // Apply limit if specified
      if (limit && limit > 0) {
        return history.slice(0, limit);
      }

      return history;
    } catch (error) {
      logger.error("Failed to get mood history", error);
      return [];
    }
  }

  /**
   * Get mood entries for a specific date range
   */
  async getMoodEntriesByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<MoodEntry[]> {
    try {
      const history = await this.getMoodHistory();

      const start = startDate.getTime();
      const end = endDate.getTime();

      return history.filter((entry) => {
        const entryTime =
          typeof entry.timestamp === "string"
            ? new Date(entry.timestamp).getTime()
            : entry.timestamp;
        return entryTime >= start && entryTime <= end;
      });
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
    try {
      const history = await this.getMoodHistory();
      const index = history.findIndex((entry) => entry.id === entryId);

      if (index === -1) {
        logger.warn("Mood entry not found", { entryId });
        return null;
      }

      // Update entry
      history[index] = {
        ...history[index],
        ...updates,
        synced: false, // Mark as unsynced
      };

      // Save updated history
      await AsyncStorage.setItem(
        STORAGE_KEYS.MOOD_HISTORY,
        JSON.stringify(history)
      );

      logger.info("Mood entry updated", { entryId });
      return history[index];
    } catch (error) {
      logger.error("Failed to update mood entry", error);
      throw error;
    }
  }

  /**
   * Delete a mood entry
   */
  async deleteMoodEntry(entryId: string): Promise<boolean> {
    try {
      const history = await this.getMoodHistory();
      const filteredHistory = history.filter((entry) => entry.id !== entryId);

      if (filteredHistory.length === history.length) {
        logger.warn("Mood entry not found for deletion", { entryId });
        return false;
      }

      await AsyncStorage.setItem(
        STORAGE_KEYS.MOOD_HISTORY,
        JSON.stringify(filteredHistory)
      );

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
   */
  async markEntriesAsSynced(entryIds: string[]): Promise<void> {
    try {
      const history = await this.getMoodHistory();

      const updatedHistory = history.map((entry) => {
        if (entryIds.includes(entry.id)) {
          return { ...entry, synced: true };
        }
        return entry;
      });

      await AsyncStorage.setItem(
        STORAGE_KEYS.MOOD_HISTORY,
        JSON.stringify(updatedHistory)
      );

      // Update last sync timestamp
      await AsyncStorage.setItem(
        STORAGE_KEYS.LAST_SYNC,
        new Date().toISOString()
      );

      logger.info("Entries marked as synced", { count: entryIds.length });
    } catch (error) {
      logger.error("Failed to mark entries as synced", error);
    }
  }

  /**
   * Clear all mood data (use with caution)
   */
  async clearAllData(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.MOOD_HISTORY),
        AsyncStorage.removeItem(STORAGE_KEYS.MOOD_STATS),
        AsyncStorage.removeItem(STORAGE_KEYS.MOOD_INSIGHTS),
        AsyncStorage.removeItem(STORAGE_KEYS.LAST_SYNC),
      ]);

      logger.info("All mood data cleared");
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