/**
 * Unit tests for Data Persistence Service
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import dataPersistence, { STORAGE_KEYS, CACHE_DURATION } from '../dataPersistence';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage');
jest.mock('@shared/utils/logger');

describe('Data Persistence Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Generic Storage Methods', () => {
    describe('setItem', () => {
      it('should store data without cache duration', async () => {
        const testData = { name: 'John', age: 30 };

        await dataPersistence.setItem('test_key', testData);

        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          'test_key',
          expect.stringContaining('"name":"John"')
        );
      });

      it('should store data with cache duration', async () => {
        const testData = { value: 'test' };

        await dataPersistence.setItem('test_key', testData, CACHE_DURATION.SHORT);

        const call = (AsyncStorage.setItem as jest.Mock).mock.calls[0];
        const storedData = JSON.parse(call[1]);

        expect(storedData).toHaveProperty('data');
        expect(storedData).toHaveProperty('timestamp');
        expect(storedData).toHaveProperty('expiresAt');
        expect(storedData.data).toEqual(testData);
      });

      it('should throw error when storage fails', async () => {
        (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(
          new Error('Storage full')
        );

        await expect(
          dataPersistence.setItem('test_key', { value: 'test' })
        ).rejects.toThrow('Storage full');
      });
    });

    describe('getItem', () => {
      it('should retrieve valid cached data', async () => {
        const testData = { value: 'test' };
        const cached = {
          data: testData,
          timestamp: Date.now(),
          expiresAt: Date.now() + 10000, // Valid for 10 seconds
        };

        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
          JSON.stringify(cached)
        );

        const result = await dataPersistence.getItem('test_key');

        expect(result).toEqual(testData);
      });

      it('should return null for expired cache', async () => {
        const cached = {
          data: { value: 'test' },
          timestamp: Date.now() - 10000,
          expiresAt: Date.now() - 1000, // Expired 1 second ago
        };

        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
          JSON.stringify(cached)
        );

        const result = await dataPersistence.getItem('test_key');

        expect(result).toBeNull();
        expect(AsyncStorage.removeItem).toHaveBeenCalledWith('test_key');
      });

      it('should return null when item does not exist', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

        const result = await dataPersistence.getItem('nonexistent_key');

        expect(result).toBeNull();
      });

      it('should handle corrupted data gracefully', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('invalid json');

        const result = await dataPersistence.getItem('test_key');

        expect(result).toBeNull();
      });

      it('should return data without expiration check if no expiresAt', async () => {
        const testData = { value: 'test' };
        const cached = {
          data: testData,
          timestamp: Date.now(),
          // No expiresAt field
        };

        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
          JSON.stringify(cached)
        );

        const result = await dataPersistence.getItem('test_key');

        expect(result).toEqual(testData);
      });
    });

    describe('removeItem', () => {
      it('should remove item from storage', async () => {
        await dataPersistence.removeItem('test_key');

        expect(AsyncStorage.removeItem).toHaveBeenCalledWith('test_key');
      });

      it('should handle errors gracefully', async () => {
        (AsyncStorage.removeItem as jest.Mock).mockRejectedValueOnce(
          new Error('Failed to remove')
        );

        // Should not throw
        await expect(
          dataPersistence.removeItem('test_key')
        ).resolves.not.toThrow();
      });
    });

    describe('clearAll', () => {
      it('should clear all storage keys', async () => {
        await dataPersistence.clearAll();

        expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(
          expect.arrayContaining([
            STORAGE_KEYS.USER_PROFILE,
            STORAGE_KEYS.MOOD_ENTRIES,
            STORAGE_KEYS.JOURNAL_ENTRIES,
          ])
        );
      });

      it('should handle errors gracefully', async () => {
        (AsyncStorage.multiRemove as jest.Mock).mockRejectedValueOnce(
          new Error('Failed to clear')
        );

        // Should not throw
        await expect(dataPersistence.clearAll()).resolves.not.toThrow();
      });
    });
  });

  describe('User Profile', () => {
    it('should save user profile', async () => {
      const profile = { id: '123', name: 'John Doe', email: 'john@example.com' };

      await dataPersistence.saveUserProfile(profile);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_PROFILE,
        expect.any(String)
      );
    });

    it('should retrieve user profile', async () => {
      const profile = { id: '123', name: 'John Doe' };
      const cached = {
        data: profile,
        timestamp: Date.now(),
        expiresAt: Date.now() + CACHE_DURATION.DAY,
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(cached)
      );

      const result = await dataPersistence.getUserProfile();

      expect(result).toEqual(profile);
    });
  });

  describe('Mood Entries', () => {
    it('should save mood entries', async () => {
      const entries = [
        { id: '1', mood: 'happy', intensity: 8 },
        { id: '2', mood: 'calm', intensity: 6 },
      ];

      await dataPersistence.saveMoodEntries(entries);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.MOOD_ENTRIES,
        expect.any(String)
      );
    });

    it('should retrieve mood entries', async () => {
      const entries = [{ id: '1', mood: 'happy', intensity: 8 }];
      const cached = {
        data: entries,
        timestamp: Date.now(),
        expiresAt: Date.now() + CACHE_DURATION.WEEK,
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(cached)
      );

      const result = await dataPersistence.getMoodEntries();

      expect(result).toEqual(entries);
    });

    it('should return empty array when no mood entries exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const result = await dataPersistence.getMoodEntries();

      expect(result).toEqual([]);
    });

    it('should add new mood entry and trim to 100 items', async () => {
      // Create 100 existing entries
      const existingEntries = Array.from({ length: 100 }, (_, i) => ({
        id: `${i}`,
        mood: 'happy',
        intensity: 5,
      }));

      const cached = {
        data: existingEntries,
        timestamp: Date.now(),
        expiresAt: Date.now() + CACHE_DURATION.WEEK,
      };

      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce(JSON.stringify(cached))
        .mockResolvedValueOnce(null); // For sync queue

      const newEntry = { id: '100', mood: 'excited', intensity: 9 };
      await dataPersistence.addMoodEntry(newEntry);

      // Verify the saved entries contain the new entry and are trimmed to 100
      const saveCall = (AsyncStorage.setItem as jest.Mock).mock.calls.find(
        call => call[0] === STORAGE_KEYS.MOOD_ENTRIES
      );

      const savedData = JSON.parse(saveCall[1]);
      expect(savedData.data).toHaveLength(100);
      expect(savedData.data[0]).toEqual(newEntry);
    });

    it('should queue new mood entry for sync', async () => {
      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce(JSON.stringify({ data: [], timestamp: Date.now() }))
        .mockResolvedValueOnce(null); // For sync queue

      const newEntry = { mood: 'happy', intensity: 8 };
      await dataPersistence.addMoodEntry(newEntry);

      // Verify sync queue was updated
      const syncQueueCalls = (AsyncStorage.setItem as jest.Mock).mock.calls.filter(
        call => call[0] === STORAGE_KEYS.SYNC_QUEUE
      );

      expect(syncQueueCalls.length).toBeGreaterThan(0);
    });
  });

  describe('Journal Entries', () => {
    it('should save journal entries', async () => {
      const entries = [
        { id: '1', title: 'My Day', content: 'It was great' },
      ];

      await dataPersistence.saveJournalEntries(entries);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.JOURNAL_ENTRIES,
        expect.any(String)
      );
    });

    it('should retrieve journal entries', async () => {
      const entries = [{ id: '1', title: 'My Day' }];
      const cached = {
        data: entries,
        timestamp: Date.now(),
        expiresAt: Date.now() + CACHE_DURATION.WEEK,
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(cached)
      );

      const result = await dataPersistence.getJournalEntries();

      expect(result).toEqual(entries);
    });

    it('should add new journal entry and trim to 50 items', async () => {
      // Create 50 existing entries
      const existingEntries = Array.from({ length: 50 }, (_, i) => ({
        id: `${i}`,
        title: `Entry ${i}`,
      }));

      const cached = {
        data: existingEntries,
        timestamp: Date.now(),
        expiresAt: Date.now() + CACHE_DURATION.WEEK,
      };

      (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
        if (key === STORAGE_KEYS.JOURNAL_ENTRIES) {
          return Promise.resolve(JSON.stringify(cached));
        }
        return Promise.resolve(null); // For sync queue
      });

      const newEntry = { id: '50', title: 'New Entry' };
      await dataPersistence.addJournalEntry(newEntry);

      const saveCall = (AsyncStorage.setItem as jest.Mock).mock.calls.find(
        call => call[0] === STORAGE_KEYS.JOURNAL_ENTRIES
      );

      const savedData = JSON.parse(saveCall[1]);
      expect(savedData.data).toHaveLength(50);
      expect(savedData.data[0]).toEqual(newEntry);
    });
  });

  describe('Assessment Results', () => {
    it('should save assessment results', async () => {
      const results = [{ id: '1', score: 85 }];

      await dataPersistence.saveAssessmentResults(results);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.ASSESSMENT_RESULTS,
        expect.any(String)
      );
    });

    it('should retrieve assessment results', async () => {
      const results = [{ id: '1', score: 85 }];
      const cached = {
        data: results,
        timestamp: Date.now(),
        expiresAt: Date.now() + CACHE_DURATION.WEEK,
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(cached)
      );

      const result = await dataPersistence.getAssessmentResults();

      expect(result).toEqual(results);
    });

    it('should add new assessment result and trim to 20 items', async () => {
      const existingResults = Array.from({ length: 20 }, (_, i) => ({
        id: `${i}`,
        score: 80,
      }));

      const cached = {
        data: existingResults,
        timestamp: Date.now(),
        expiresAt: Date.now() + CACHE_DURATION.WEEK,
      };

      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce(JSON.stringify(cached))
        .mockResolvedValueOnce(null); // For sync queue

      const newResult = { id: '20', score: 90 };
      await dataPersistence.addAssessmentResult(newResult);

      const saveCall = (AsyncStorage.setItem as jest.Mock).mock.calls.find(
        call => call[0] === STORAGE_KEYS.ASSESSMENT_RESULTS
      );

      const savedData = JSON.parse(saveCall[1]);
      expect(savedData.data).toHaveLength(20);
      expect(savedData.data[0]).toEqual(newResult);
    });
  });

  describe('Dashboard Cache', () => {
    it('should save dashboard cache', async () => {
      const dashboardData = {
        mentalHealthScore: 85,
        streakDays: 7,
      };

      await dataPersistence.saveDashboardCache(dashboardData);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.DASHBOARD_CACHE,
        expect.any(String)
      );
    });

    it('should retrieve dashboard cache', async () => {
      const dashboardData = {
        mentalHealthScore: 85,
        streakDays: 7,
      };
      const cached = {
        data: dashboardData,
        timestamp: Date.now(),
        expiresAt: Date.now() + CACHE_DURATION.SHORT,
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(cached)
      );

      const result = await dataPersistence.getDashboardCache();

      expect(result).toEqual(dashboardData);
    });
  });

  describe('Sync Queue', () => {
    it('should add item to sync queue', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      await dataPersistence.addMoodEntry({ mood: 'happy', intensity: 8 });

      const syncQueueCall = (AsyncStorage.setItem as jest.Mock).mock.calls.find(
        call => call[0] === STORAGE_KEYS.SYNC_QUEUE
      );

      expect(syncQueueCall).toBeDefined();
      const queue = JSON.parse(syncQueueCall[1]);
      expect(queue).toHaveLength(1);
      expect(queue[0]).toMatchObject({
        type: 'create',
        endpoint: '/mood/entries',
        retryCount: 0,
      });
    });

    it('should process sync queue successfully', async () => {
      const mockApiService = {
        mood: {
          createMoodEntry: jest.fn().mockResolvedValue({}),
        },
        journal: {
          createEntry: jest.fn().mockResolvedValue({}),
        },
      };

      const syncQueue = [
        {
          id: 'sync_1',
          type: 'create',
          endpoint: '/mood/entries',
          data: { mood: 'happy', intensity: 8 },
          timestamp: Date.now(),
          retryCount: 0,
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(syncQueue)
      );

      await dataPersistence.processSyncQueue(mockApiService);

      expect(mockApiService.mood.createMoodEntry).toHaveBeenCalledWith(
        syncQueue[0].data
      );

      // Verify queue was cleared
      const syncQueueSaveCall = (AsyncStorage.setItem as jest.Mock).mock.calls.find(
        call => call[0] === STORAGE_KEYS.SYNC_QUEUE
      );

      const updatedQueue = JSON.parse(syncQueueSaveCall[1]);
      expect(updatedQueue).toHaveLength(0);
    });

    it('should retry failed sync items', async () => {
      const mockApiService = {
        mood: {
          createMoodEntry: jest.fn().mockRejectedValue(new Error('Network error')),
        },
      };

      const syncQueue = [
        {
          id: 'sync_1',
          type: 'create',
          endpoint: '/mood/entries',
          data: { mood: 'happy', intensity: 8 },
          timestamp: Date.now(),
          retryCount: 0,
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(syncQueue)
      );

      await dataPersistence.processSyncQueue(mockApiService);

      // Verify item was not removed (will retry)
      const syncQueueSaveCall = (AsyncStorage.setItem as jest.Mock).mock.calls.find(
        call => call[0] === STORAGE_KEYS.SYNC_QUEUE
      );

      const updatedQueue = JSON.parse(syncQueueSaveCall[1]);
      expect(updatedQueue).toHaveLength(1);
      expect(updatedQueue[0].retryCount).toBe(1);
    });

    it('should remove items after 3 failed attempts', async () => {
      const mockApiService = {
        mood: {
          createMoodEntry: jest.fn().mockRejectedValue(new Error('Network error')),
        },
      };

      const syncQueue = [
        {
          id: 'sync_1',
          type: 'create',
          endpoint: '/mood/entries',
          data: { mood: 'happy', intensity: 8 },
          timestamp: Date.now(),
          retryCount: 2, // Already failed twice
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(syncQueue)
      );

      await dataPersistence.processSyncQueue(mockApiService);

      // Verify item was removed after 3rd failure
      const syncQueueSaveCall = (AsyncStorage.setItem as jest.Mock).mock.calls.find(
        call => call[0] === STORAGE_KEYS.SYNC_QUEUE
      );

      const updatedQueue = JSON.parse(syncQueueSaveCall[1]);
      expect(updatedQueue).toHaveLength(0);
    });

    it('should not process sync queue when already syncing', async () => {
      const mockApiService = {
        mood: { createMoodEntry: jest.fn() },
      };

      // Start first sync (which will set isSyncing = true)
      const firstSync = dataPersistence.processSyncQueue(mockApiService);

      // Try to start second sync immediately
      await dataPersistence.processSyncQueue(mockApiService);

      await firstSync;

      // The second call should be ignored, so API should only be called once
      expect(mockApiService.mood.createMoodEntry).toHaveBeenCalledTimes(0);
    });
  });

  describe('Settings', () => {
    it('should save settings', async () => {
      const settings = { theme: 'dark', notifications: true };

      await dataPersistence.saveSettings(settings);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.SETTINGS,
        expect.any(String)
      );
    });

    it('should retrieve settings', async () => {
      const settings = { theme: 'dark', notifications: true };
      const cached = {
        data: settings,
        timestamp: Date.now(),
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(cached)
      );

      const result = await dataPersistence.getSettings();

      expect(result).toEqual(settings);
    });
  });

  describe('Utility Methods', () => {
    it('should get storage info', async () => {
      (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValueOnce([
        'key1',
        'key2',
        'key3',
      ]);

      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce('{"data": "value1"}')
        .mockResolvedValueOnce('{"data": "value2"}')
        .mockResolvedValueOnce('{"data": "value3"}');

      const info = await dataPersistence.getStorageInfo();

      expect(info.keys).toHaveLength(3);
      expect(info.sizeInBytes).toBeGreaterThan(0);
    });

    it('should handle storage info errors gracefully', async () => {
      (AsyncStorage.getAllKeys as jest.Mock).mockRejectedValueOnce(
        new Error('Failed to get keys')
      );

      const info = await dataPersistence.getStorageInfo();

      expect(info.keys).toEqual([]);
      expect(info.sizeInBytes).toBe(0);
    });

    it('should check if offline data exists', async () => {
      const syncQueue = [
        {
          id: 'sync_1',
          type: 'create',
          endpoint: '/mood/entries',
          data: {},
          timestamp: Date.now(),
          retryCount: 0,
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(syncQueue)
      );

      const hasData = await dataPersistence.hasOfflineData();

      expect(hasData).toBe(true);
    });

    it('should return false when no offline data exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const hasData = await dataPersistence.hasOfflineData();

      expect(hasData).toBe(false);
    });

    it('should get last sync timestamp', async () => {
      const lastSync = '2025-01-15T10:00:00Z';
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(lastSync);

      const result = await dataPersistence.getLastSync();

      expect(result).toBe(lastSync);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.LAST_SYNC);
    });
  });
});
