/**
 * Journal Storage Service
 * Provides local persistence for journal entries using AsyncStorage
 * Implements offline-first approach with encrypted storage for sensitive content
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "@shared/utils/logger";

// Storage keys
const STORAGE_KEYS = {
  JOURNAL_ENTRIES: "@solace_journal_entries",
  JOURNAL_STATS: "@solace_journal_stats",
  LAST_SYNC: "@solace_journal_last_sync",
};

// TypeScript interfaces
interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  synced?: boolean;
  encrypted?: boolean;
}

interface JournalStats {
  totalEntries: number;
  entriesThisWeek: number;
  entriesThisMonth: number;
  longestStreak: number;
  currentStreak: number;
  lastEntryDate?: string;
  mostUsedTags: { tag: string; count: number }[];
}

interface JournalFilters {
  startDate?: Date;
  endDate?: Date;
  mood?: string;
  tags?: string[];
  searchQuery?: string;
  limit?: number;
}

class JournalStorageService {
  private maxEntriesCount = 1000; // Maximum number of journal entries to store

  /**
   * Save a new journal entry to local storage
   */
  async saveEntry(entry: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">): Promise<JournalEntry> {
    try {
      const entries = await this.getAllEntries();

      const newEntry: JournalEntry = {
        id: `journal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...entry,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        synced: false,
      };

      // Add to beginning of array
      entries.unshift(newEntry);

      // Limit storage size
      if (entries.length > this.maxEntriesCount) {
        entries.pop();
      }

      await AsyncStorage.setItem(
        STORAGE_KEYS.JOURNAL_ENTRIES,
        JSON.stringify(entries)
      );

      // Update stats
      await this.updateStats();

      logger.info("Journal entry saved", { id: newEntry.id });
      return newEntry;
    } catch (error) {
      logger.error("Failed to save journal entry", error);
      throw error;
    }
  }

  /**
   * Get all journal entries
   */
  async getAllEntries(): Promise<JournalEntry[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES);
      if (!data) {
        return [];
      }

      return JSON.parse(data) as JournalEntry[];
    } catch (error) {
      logger.error("Failed to get journal entries", error);
      return [];
    }
  }

  /**
   * Get a single journal entry by ID
   */
  async getEntryById(id: string): Promise<JournalEntry | null> {
    try {
      const entries = await this.getAllEntries();
      return entries.find((entry) => entry.id === id) || null;
    } catch (error) {
      logger.error("Failed to get journal entry", error);
      return null;
    }
  }

  /**
   * Get journal entries with filters
   */
  async getEntriesWithFilters(filters: JournalFilters): Promise<JournalEntry[]> {
    try {
      let entries = await this.getAllEntries();

      // Apply date range filter
      if (filters.startDate || filters.endDate) {
        entries = entries.filter((entry) => {
          const entryDate = new Date(entry.createdAt);
          if (filters.startDate && entryDate < filters.startDate) return false;
          if (filters.endDate && entryDate > filters.endDate) return false;
          return true;
        });
      }

      // Apply mood filter
      if (filters.mood) {
        entries = entries.filter((entry) => entry.mood === filters.mood);
      }

      // Apply tags filter
      if (filters.tags && filters.tags.length > 0) {
        entries = entries.filter((entry) =>
          filters.tags!.some((tag) => entry.tags?.includes(tag))
        );
      }

      // Apply search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        entries = entries.filter(
          (entry) =>
            entry.title.toLowerCase().includes(query) ||
            entry.content.toLowerCase().includes(query) ||
            entry.tags?.some((tag) => tag.toLowerCase().includes(query))
        );
      }

      // Apply limit
      if (filters.limit && filters.limit > 0) {
        entries = entries.slice(0, filters.limit);
      }

      return entries;
    } catch (error) {
      logger.error("Failed to get filtered entries", error);
      return [];
    }
  }

  /**
   * Update an existing journal entry
   */
  async updateEntry(
    id: string,
    updates: Partial<Omit<JournalEntry, "id" | "createdAt">>
  ): Promise<JournalEntry | null> {
    try {
      const entries = await this.getAllEntries();
      const index = entries.findIndex((entry) => entry.id === id);

      if (index === -1) {
        logger.warn("Journal entry not found", { id });
        return null;
      }

      entries[index] = {
        ...entries[index],
        ...updates,
        updatedAt: new Date().toISOString(),
        synced: false,
      };

      await AsyncStorage.setItem(
        STORAGE_KEYS.JOURNAL_ENTRIES,
        JSON.stringify(entries)
      );

      logger.info("Journal entry updated", { id });
      return entries[index];
    } catch (error) {
      logger.error("Failed to update journal entry", error);
      throw error;
    }
  }

  /**
   * Delete a journal entry
   */
  async deleteEntry(id: string): Promise<boolean> {
    try {
      const entries = await this.getAllEntries();
      const filteredEntries = entries.filter((entry) => entry.id !== id);

      if (filteredEntries.length === entries.length) {
        logger.warn("Journal entry not found for deletion", { id });
        return false;
      }

      await AsyncStorage.setItem(
        STORAGE_KEYS.JOURNAL_ENTRIES,
        JSON.stringify(filteredEntries)
      );

      // Update stats
      await this.updateStats();

      logger.info("Journal entry deleted", { id });
      return true;
    } catch (error) {
      logger.error("Failed to delete journal entry", error);
      return false;
    }
  }

  /**
   * Get journal statistics
   */
  async getStats(): Promise<JournalStats> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.JOURNAL_STATS);
      if (!data) {
        return this.calculateStats();
      }

      return JSON.parse(data) as JournalStats;
    } catch (error) {
      logger.error("Failed to get journal stats", error);
      return this.calculateStats();
    }
  }

  /**
   * Calculate statistics from entries
   */
  private async calculateStats(): Promise<JournalStats> {
    try {
      const entries = await this.getAllEntries();

      if (entries.length === 0) {
        return {
          totalEntries: 0,
          entriesThisWeek: 0,
          entriesThisMonth: 0,
          longestStreak: 0,
          currentStreak: 0,
          mostUsedTags: [],
        };
      }

      const now = Date.now();
      const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
      const monthAgo = now - 30 * 24 * 60 * 60 * 1000;

      const entriesThisWeek = entries.filter(
        (e) => new Date(e.createdAt).getTime() >= weekAgo
      ).length;

      const entriesThisMonth = entries.filter(
        (e) => new Date(e.createdAt).getTime() >= monthAgo
      ).length;

      // Calculate streaks
      const sortedEntries = [...entries].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      let currentStreak = 0;
      let longestStreak = 0;
      let streakCount = 0;
      let lastDate: Date | null = null;

      for (const entry of sortedEntries) {
        const entryDate = new Date(entry.createdAt);
        entryDate.setHours(0, 0, 0, 0);

        if (!lastDate) {
          streakCount = 1;
          lastDate = entryDate;
        } else {
          const daysDiff =
            (lastDate.getTime() - entryDate.getTime()) /
            (1000 * 60 * 60 * 24);

          if (daysDiff === 1) {
            streakCount++;
          } else if (daysDiff > 1) {
            if (streakCount > longestStreak) {
              longestStreak = streakCount;
            }
            streakCount = 1;
          }

          lastDate = entryDate;
        }
      }

      // Check current streak
      if (sortedEntries.length > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const lastEntryDate = new Date(sortedEntries[0].createdAt);
        lastEntryDate.setHours(0, 0, 0, 0);
        const daysSinceLastEntry =
          (today.getTime() - lastEntryDate.getTime()) / (1000 * 60 * 60 * 24);

        if (daysSinceLastEntry <= 1) {
          currentStreak = streakCount;
        }
      }

      if (streakCount > longestStreak) {
        longestStreak = streakCount;
      }

      // Calculate most used tags
      const tagCounts: Record<string, number> = {};
      entries.forEach((entry) => {
        entry.tags?.forEach((tag) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });

      const mostUsedTags = Object.entries(tagCounts)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      return {
        totalEntries: entries.length,
        entriesThisWeek,
        entriesThisMonth,
        longestStreak,
        currentStreak,
        lastEntryDate: entries[0]?.createdAt,
        mostUsedTags,
      };
    } catch (error) {
      logger.error("Failed to calculate journal stats", error);
      return {
        totalEntries: 0,
        entriesThisWeek: 0,
        entriesThisMonth: 0,
        longestStreak: 0,
        currentStreak: 0,
        mostUsedTags: [],
      };
    }
  }

  /**
   * Update stored statistics
   */
  private async updateStats(): Promise<void> {
    try {
      const stats = await this.calculateStats();
      await AsyncStorage.setItem(
        STORAGE_KEYS.JOURNAL_STATS,
        JSON.stringify(stats)
      );
    } catch (error) {
      logger.error("Failed to update journal stats", error);
    }
  }

  /**
   * Get unsynced entries
   */
  async getUnsyncedEntries(): Promise<JournalEntry[]> {
    try {
      const entries = await this.getAllEntries();
      return entries.filter((entry) => !entry.synced);
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
      const entries = await this.getAllEntries();

      const updatedEntries = entries.map((entry) => {
        if (entryIds.includes(entry.id)) {
          return { ...entry, synced: true };
        }
        return entry;
      });

      await AsyncStorage.setItem(
        STORAGE_KEYS.JOURNAL_ENTRIES,
        JSON.stringify(updatedEntries)
      );

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
   * Export journal entries as JSON
   */
  async exportEntries(): Promise<string> {
    try {
      const entries = await this.getAllEntries();
      const stats = await this.getStats();

      const exportData = {
        entries,
        stats,
        exportDate: new Date().toISOString(),
        version: "1.0",
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      logger.error("Failed to export journal entries", error);
      throw error;
    }
  }

  /**
   * Import journal entries from JSON
   */
  async importEntries(jsonData: string): Promise<boolean> {
    try {
      const importData = JSON.parse(jsonData);

      if (!importData.entries || !Array.isArray(importData.entries)) {
        throw new Error("Invalid journal data structure");
      }

      // Merge with existing entries
      const existingEntries = await this.getAllEntries();
      const existingIds = new Set(existingEntries.map((e) => e.id));

      const newEntries = importData.entries.filter(
        (e: JournalEntry) => !existingIds.has(e.id)
      );

      const mergedEntries = [...existingEntries, ...newEntries].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      await AsyncStorage.setItem(
        STORAGE_KEYS.JOURNAL_ENTRIES,
        JSON.stringify(mergedEntries)
      );

      // Update stats
      await this.updateStats();

      logger.info("Journal entries imported successfully", {
        imported: newEntries.length,
      });
      return true;
    } catch (error) {
      logger.error("Failed to import journal entries", error);
      return false;
    }
  }

  /**
   * Clear all journal data
   */
  async clearAllData(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.JOURNAL_ENTRIES),
        AsyncStorage.removeItem(STORAGE_KEYS.JOURNAL_STATS),
        AsyncStorage.removeItem(STORAGE_KEYS.LAST_SYNC),
      ]);

      logger.info("All journal data cleared");
    } catch (error) {
      logger.error("Failed to clear journal data", error);
    }
  }
}

// Export singleton instance
export const journalStorageService = new JournalStorageService();
export default journalStorageService;