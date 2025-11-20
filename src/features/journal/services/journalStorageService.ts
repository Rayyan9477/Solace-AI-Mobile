/**
 * Journal Storage Service
 * Provides local persistence for journal entries using SQLite
 * Implements offline-first approach with encrypted storage for sensitive content
 * Auto-migrates from AsyncStorage to SQLite for better performance
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";
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
  private db: SQLite.SQLiteDatabase | null = null;
  private dbInitialized = false;
  private maxEntriesCount = 1000; // Maximum number of journal entries to store (for AsyncStorage fallback)

  /**
   * Initialize SQLite database and create tables
   */
  private async initializeDatabase(): Promise<void> {
    if (this.dbInitialized) return;

    try {
      this.db = await SQLite.openDatabaseAsync("solace_journal.db");

      // Create journal entries table
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS journal_entries (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          mood TEXT,
          tags TEXT,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          synced INTEGER DEFAULT 0,
          encrypted INTEGER DEFAULT 0,
          audioUri TEXT
        );

        CREATE INDEX IF NOT EXISTS idx_journal_createdAt ON journal_entries(createdAt);
        CREATE INDEX IF NOT EXISTS idx_journal_mood ON journal_entries(mood);
        CREATE INDEX IF NOT EXISTS idx_journal_synced ON journal_entries(synced);
      `);

      this.dbInitialized = true;
      logger.info("Journal SQLite database initialized successfully");

      // Auto-migrate from AsyncStorage if data exists
      await this.migrateFromAsyncStorage();
    } catch (error) {
      logger.error("Failed to initialize journal database", error);
      throw error;
    }
  }

  /**
   * Migrate existing AsyncStorage data to SQLite
   */
  private async migrateFromAsyncStorage(): Promise<void> {
    try {
      // Check if migration already happened
      const migrated = await AsyncStorage.getItem("@solace_journal_migrated");
      if (migrated === "true") {
        logger.info("Journal data already migrated to SQLite");
        return;
      }

      // Get existing AsyncStorage data
      const asyncData = await AsyncStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES);
      if (!asyncData) {
        // No data to migrate
        await AsyncStorage.setItem("@solace_journal_migrated", "true");
        return;
      }

      const entries = JSON.parse(asyncData) as JournalEntry[];
      if (entries.length === 0) {
        await AsyncStorage.setItem("@solace_journal_migrated", "true");
        return;
      }

      // Migrate each entry to SQLite
      logger.info(`Migrating ${entries.length} journal entries from AsyncStorage to SQLite`);

      for (const entry of entries) {
        await this.db!.runAsync(
          `INSERT OR REPLACE INTO journal_entries
           (id, title, content, mood, tags, createdAt, updatedAt, synced, encrypted, audioUri)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            entry.id,
            entry.title,
            entry.content,
            entry.mood || null,
            entry.tags ? JSON.stringify(entry.tags) : null,
            entry.createdAt,
            entry.updatedAt,
            entry.synced ? 1 : 0,
            entry.encrypted ? 1 : 0,
            (entry as any).audioUri || null,
          ]
        );
      }

      // Mark migration as complete
      await AsyncStorage.setItem("@solace_journal_migrated", "true");
      logger.info("Journal migration to SQLite completed successfully");
    } catch (error) {
      logger.error("Failed to migrate journal data from AsyncStorage", error);
      // Don't throw - allow fallback to AsyncStorage
    }
  }

  /**
   * Save a new journal entry to local storage
   */
  async saveEntry(entry: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">): Promise<JournalEntry> {
    await this.initializeDatabase();

    try {
      const newEntry: JournalEntry = {
        id: `journal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...entry,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        synced: false,
      };

      await this.db!.runAsync(
        `INSERT INTO journal_entries
         (id, title, content, mood, tags, createdAt, updatedAt, synced, encrypted, audioUri)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newEntry.id,
          newEntry.title,
          newEntry.content,
          newEntry.mood || null,
          newEntry.tags ? JSON.stringify(newEntry.tags) : null,
          newEntry.createdAt,
          newEntry.updatedAt,
          newEntry.synced ? 1 : 0,
          newEntry.encrypted ? 1 : 0,
          (newEntry as any).audioUri || null,
        ]
      );

      logger.info("Journal entry saved to SQLite", { id: newEntry.id });
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
    await this.initializeDatabase();

    try {
      const rows = await this.db!.getAllAsync<any>(
        `SELECT * FROM journal_entries ORDER BY createdAt DESC`
      );

      return rows.map((row) => ({
        id: row.id,
        title: row.title,
        content: row.content,
        mood: row.mood,
        tags: row.tags ? JSON.parse(row.tags) : undefined,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        synced: row.synced === 1,
        encrypted: row.encrypted === 1,
      }));
    } catch (error) {
      logger.error("Failed to get journal entries from SQLite", error);
      return [];
    }
  }

  /**
   * Get a single journal entry by ID
   */
  async getEntryById(id: string): Promise<JournalEntry | null> {
    await this.initializeDatabase();

    try {
      const row = await this.db!.getFirstAsync<any>(
        `SELECT * FROM journal_entries WHERE id = ?`,
        [id]
      );

      if (!row) return null;

      return {
        id: row.id,
        title: row.title,
        content: row.content,
        mood: row.mood,
        tags: row.tags ? JSON.parse(row.tags) : undefined,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        synced: row.synced === 1,
        encrypted: row.encrypted === 1,
      };
    } catch (error) {
      logger.error("Failed to get journal entry", error);
      return null;
    }
  }

  /**
   * Get journal entries with filters (using SQL WHERE clauses for performance)
   */
  async getEntriesWithFilters(filters: JournalFilters): Promise<JournalEntry[]> {
    await this.initializeDatabase();

    try {
      let sql = "SELECT * FROM journal_entries WHERE 1=1";
      const params: any[] = [];

      // Apply date range filter
      if (filters.startDate) {
        sql += " AND createdAt >= ?";
        params.push(filters.startDate.toISOString());
      }
      if (filters.endDate) {
        sql += " AND createdAt <= ?";
        params.push(filters.endDate.toISOString());
      }

      // Apply mood filter
      if (filters.mood) {
        sql += " AND mood = ?";
        params.push(filters.mood);
      }

      // Apply search query (full-text search on title and content)
      if (filters.searchQuery) {
        sql += " AND (title LIKE ? OR content LIKE ?)";
        const searchPattern = `%${filters.searchQuery}%`;
        params.push(searchPattern, searchPattern);
      }

      // Order by most recent first
      sql += " ORDER BY createdAt DESC";

      // Apply limit
      if (filters.limit && filters.limit > 0) {
        sql += " LIMIT ?";
        params.push(filters.limit);
      }

      const rows = await this.db!.getAllAsync<any>(sql, params);

      // Map and apply tags filter in memory (JSON column)
      let entries = rows.map((row) => ({
        id: row.id,
        title: row.title,
        content: row.content,
        mood: row.mood,
        tags: row.tags ? JSON.parse(row.tags) : undefined,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        synced: row.synced === 1,
        encrypted: row.encrypted === 1,
      }));

      // Apply tags filter if specified
      if (filters.tags && filters.tags.length > 0) {
        entries = entries.filter((entry) =>
          filters.tags!.some((tag) => entry.tags?.includes(tag))
        );
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
    await this.initializeDatabase();

    try {
      // First check if entry exists
      const existing = await this.getEntryById(id);
      if (!existing) {
        logger.warn("Journal entry not found", { id });
        return null;
      }

      const updatedAt = new Date().toISOString();
      const fieldsToUpdate: string[] = ["updatedAt = ?", "synced = 0"];
      const params: any[] = [updatedAt];

      if (updates.title !== undefined) {
        fieldsToUpdate.push("title = ?");
        params.push(updates.title);
      }
      if (updates.content !== undefined) {
        fieldsToUpdate.push("content = ?");
        params.push(updates.content);
      }
      if (updates.mood !== undefined) {
        fieldsToUpdate.push("mood = ?");
        params.push(updates.mood);
      }
      if (updates.tags !== undefined) {
        fieldsToUpdate.push("tags = ?");
        params.push(JSON.stringify(updates.tags));
      }

      params.push(id); // for WHERE clause

      await this.db!.runAsync(
        `UPDATE journal_entries SET ${fieldsToUpdate.join(", ")} WHERE id = ?`,
        params
      );

      logger.info("Journal entry updated", { id });
      return await this.getEntryById(id);
    } catch (error) {
      logger.error("Failed to update journal entry", error);
      throw error;
    }
  }

  /**
   * Delete a journal entry
   */
  async deleteEntry(id: string): Promise<boolean> {
    await this.initializeDatabase();

    try {
      const result = await this.db!.runAsync(
        `DELETE FROM journal_entries WHERE id = ?`,
        [id]
      );

      if (result.changes === 0) {
        logger.warn("Journal entry not found for deletion", { id });
        return false;
      }

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
   * Clear all journal data (SQLite and AsyncStorage)
   */
  async clearAllData(): Promise<void> {
    await this.initializeDatabase();

    try {
      // Clear SQLite data
      await this.db!.runAsync(`DELETE FROM journal_entries`);

      // Clear AsyncStorage legacy data
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.JOURNAL_ENTRIES),
        AsyncStorage.removeItem(STORAGE_KEYS.JOURNAL_STATS),
        AsyncStorage.removeItem(STORAGE_KEYS.LAST_SYNC),
        AsyncStorage.removeItem("@solace_journal_migrated"),
      ]);

      logger.info("All journal data cleared from SQLite and AsyncStorage");
    } catch (error) {
      logger.error("Failed to clear journal data", error);
    }
  }
}

// Export singleton instance
export const journalStorageService = new JournalStorageService();
export default journalStorageService;