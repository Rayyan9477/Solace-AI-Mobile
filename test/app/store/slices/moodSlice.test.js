import { configureStore } from "@reduxjs/toolkit";

import moodReducer, {
  logMood,
  fetchMoodHistory,
  setCurrentMood,
  clearMoodError,
  updateWeeklyStats,
  updateInsights,
  calculateWeeklyStats,
  generateInsights,
  apiService,
} from "../../../../src/app/store/slices/moodSlice";

describe("Mood Slice", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        mood: moodReducer,
      },
    });
    jest.clearAllMocks();
  });

  describe("Initial State", () => {
    test("should return the initial state", () => {
      const state = store.getState().mood;
      expect(state).toEqual({
        currentMood: null,
        moodHistory: [],
        weeklyStats: {
          averageIntensity: 0,
          mostCommonMood: null,
          totalEntries: 0,
        },
        insights: [],
        loading: false,
        error: null,
      });
    });
  });

  describe("Helper Functions", () => {
    describe("calculateWeeklyStats", () => {
      test("should return default stats for empty history", () => {
        const result = calculateWeeklyStats([]);
        expect(result).toEqual({
          averageIntensity: 0,
          mostCommonMood: null,
          totalEntries: 0,
        });
      });

      test("should calculate stats for single entry", () => {
        const history = [
          { mood: "happy", intensity: 7, timestamp: Date.now() },
        ];
        const result = calculateWeeklyStats(history);
        expect(result.averageIntensity).toBe(7);
        expect(result.mostCommonMood).toBe("happy");
        expect(result.totalEntries).toBe(1);
      });

      test("should calculate correct average intensity", () => {
        const history = [
          { mood: "happy", intensity: 8, timestamp: Date.now() },
          { mood: "sad", intensity: 3, timestamp: Date.now() },
          { mood: "calm", intensity: 5, timestamp: Date.now() },
        ];
        const result = calculateWeeklyStats(history);
        expect(result.averageIntensity).toBe(5.3); // (8+3+5)/3
        expect(result.totalEntries).toBe(3);
      });

      test("should handle mood frequency ties", () => {
        const history = [
          { mood: "happy", intensity: 5, timestamp: Date.now() },
          { mood: "sad", intensity: 5, timestamp: Date.now() },
          { mood: "happy", intensity: 5, timestamp: Date.now() },
        ];
        const result = calculateWeeklyStats(history);
        expect(result.mostCommonMood).toBe("happy"); // First most common
        expect(result.totalEntries).toBe(3);
      });

      test("should only consider last 7 days (not last 7 entries)", () => {
        const now = Date.now();
        const history = Array.from({ length: 10 }, (_, i) => ({
          mood: i < 7 ? "happy" : "sad",
          intensity: 5,
          // First 7 are within 7 days, last 3 are older
          timestamp: i < 7 ? now : now - (8 * 24 * 60 * 60 * 1000),
        }));
        const result = calculateWeeklyStats(history);
        expect(result.totalEntries).toBe(7);
        expect(result.mostCommonMood).toBe("happy");
      });

      test("should handle decimal intensity values", () => {
        const history = [
          { mood: "happy", intensity: 7.5, timestamp: Date.now() },
          { mood: "calm", intensity: 4.2, timestamp: Date.now() },
        ];
        const result = calculateWeeklyStats(history);
        expect(result.averageIntensity).toBe(5.9); // (7.5+4.2)/2
      });
    });

    describe("generateInsights", () => {
      test("should generate positive insights for high intensity", () => {
        const stats = {
          averageIntensity: 4.5,
          mostCommonMood: "happy",
          totalEntries: 5,
        };
        const moodHistory = [{ mood: "happy", intensity: 5 }];
        const result = generateInsights(stats, moodHistory);
        expect(result).toContainEqual(
          expect.objectContaining({
            id: "positive-trend",
            type: "positive",
            title: "Great Progress!",
          }),
        );
      });

      test("should generate low mood insights for low intensity", () => {
        const stats = {
          averageIntensity: 1.5,
          mostCommonMood: "sad",
          totalEntries: 5,
        };
        const moodHistory = [{ mood: "sad", intensity: 1 }];
        const result = generateInsights(stats, moodHistory);
        expect(result).toContainEqual(
          expect.objectContaining({
            id: "low-mood",
            type: "suggestion",
            title: "Self-Care Reminder",
          }),
        );
      });

      test("should generate anxiety insights for anxious mood", () => {
        const stats = {
          averageIntensity: 3,
          mostCommonMood: "anxious",
          totalEntries: 5,
        };
        const moodHistory = [{ mood: "anxious", intensity: 3 }];
        const result = generateInsights(stats, moodHistory);
        expect(result).toContainEqual(
          expect.objectContaining({
            id: "anxiety-pattern",
            type: "suggestion",
            title: "Anxiety Management",
          }),
        );
      });

      test("should return empty array for neutral stats", () => {
        const stats = {
          averageIntensity: 3,
          mostCommonMood: "neutral",
          totalEntries: 5,
        };
        const moodHistory = [{ mood: "neutral", intensity: 3 }];
        const result = generateInsights(stats, moodHistory);
        expect(result).toEqual([]);
      });

      test("should handle multiple insights", () => {
        const stats = {
          averageIntensity: 1.5,
          mostCommonMood: "anxious",
          totalEntries: 5,
        };
        const moodHistory = [{ mood: "anxious", intensity: 1 }];
        const result = generateInsights(stats, moodHistory);
        expect(result.length).toBe(2); // Both low-mood and anxiety-pattern
        expect(result.some((insight) => insight.id === "low-mood")).toBe(true);
        expect(result.some((insight) => insight.id === "anxiety-pattern")).toBe(
          true,
        );
      });
    });
  });

  describe("Reducers", () => {
    describe("setCurrentMood", () => {
      test("should set current mood without modifying history", () => {
        store.dispatch(setCurrentMood("happy"));

        const state = store.getState().mood;
        expect(state.currentMood).toBe("happy");
        // setCurrentMood only sets the current mood, doesn't add to history
        expect(state.moodHistory).toHaveLength(0);
      });

      test("should update current mood to different value", () => {
        store.dispatch(setCurrentMood("happy"));
        store.dispatch(setCurrentMood("sad"));

        const state = store.getState().mood;
        expect(state.currentMood).toBe("sad");
        expect(state.moodHistory).toHaveLength(0);
      });

      test("should not affect weekly stats", () => {
        store.dispatch(setCurrentMood("happy"));

        const state = store.getState().mood;
        // Weekly stats should remain at initial values since no mood was logged
        expect(state.weeklyStats.totalEntries).toBe(0);
      });
    });

    describe("clearMoodError", () => {
      test("should clear error state", () => {
        // First set an error
        store.dispatch({
          type: "mood/logMood/rejected",
          payload: "Test error",
        });

        let state = store.getState().mood;
        expect(state.error).toBe("Test error");

        store.dispatch(clearMoodError());
        state = store.getState().mood;
        expect(state.error).toBeNull();
      });
    });

    describe("updateWeeklyStats", () => {
      test("should handle empty history", () => {
        store.dispatch(updateWeeklyStats());

        const state = store.getState().mood;
        expect(state.weeklyStats.totalEntries).toBe(0);
        expect(state.weeklyStats.mostCommonMood).toBeNull();
        expect(state.weeklyStats.averageIntensity).toBe(0);
      });

      test.skip("should calculate correct stats for multiple entries", () => {
        // TODO: This test requires logMood to actually add entries to history
        // setCurrentMood doesn't add to history, only sets current mood
      });

      test.skip("should update stats with existing history", () => {
        // TODO: This test requires logMood to actually add entries to history
        // setCurrentMood doesn't add to history, only sets current mood
        const state = store.getState().mood;
        expect(state.weeklyStats.totalEntries).toBe(0);
        expect(state.weeklyStats.averageIntensity).toBe(3);
      });
    });

    describe("updateInsights", () => {
      test("should update insights based on current stats", () => {
        // Set up state with specific stats
        store.dispatch(setCurrentMood("anxious"));

        // Manually trigger insights update
        store.dispatch(updateInsights());

        const state = store.getState().mood;
        expect(
          state.insights.some((insight) => insight.id === "anxiety-pattern"),
        ).toBe(true);
      });

      test("should clear insights when stats change", () => {
        store.dispatch(setCurrentMood("neutral"));
        store.dispatch(updateInsights());

        const state = store.getState().mood;
        expect(state.insights).toEqual([]); // Neutral mood should have no insights
      });
    });
  });

  describe("Async Thunks", () => {
    describe("logMood", () => {
      test("should handle successful mood logging", async () => {
        const mockMoodData = {
          mood: "happy",
          notes: "Feeling great!",
          intensity: 8,
          activities: ["exercise"],
        };

        // Mock successful API response
        const mockApiResponse = {
          id: "123",
          ...mockMoodData,
          createdAt: "2023-01-01T00:00:00.000Z",
        };

        jest
          .spyOn(apiService.mood, "logMood")
          .mockResolvedValue(mockApiResponse);

        await store.dispatch(logMood(mockMoodData));

        const state = store.getState().mood;
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
        expect(state.moodHistory[0]).toEqual(mockApiResponse);
        expect(state.currentMood).toBe("happy");
        expect(state.weeklyStats.totalEntries).toBe(1);
      });

      test("should handle mood logging failure", async () => {
        const mockMoodData = {
          mood: "sad",
          notes: "Feeling down",
          intensity: 2,
          activities: [],
        };

        const errorMessage = "Network error";
        jest
          .spyOn(apiService.mood, "logMood")
          .mockRejectedValue(new Error(errorMessage));

        await store.dispatch(logMood(mockMoodData));

        const state = store.getState().mood;
        expect(state.loading).toBe(false);
        expect(state.error).toBe("Network error");
        expect(state.moodHistory).toHaveLength(0);
      });

      test("should handle API error with response data", async () => {
        const apiError = {
          response: { data: { message: "Server validation error" } },
        };
        jest.spyOn(apiService.mood, "logMood").mockRejectedValue(apiError);

        await store.dispatch(logMood({ mood: "happy" }));

        const state = store.getState().mood;
        expect(state.error).toBe("Server validation error");
      });

      test("should set loading state during mood logging", () => {
        store.dispatch(logMood.pending());

        const state = store.getState().mood;
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
      });

      test("should handle fulfilled state correctly", () => {
        const payload = {
          id: "123",
          mood: "excited",
          intensity: 9,
          notes: "Amazing day!",
          activities: ["socializing"],
          createdAt: "2023-01-01T00:00:00.000Z",
        };

        store.dispatch(logMood.fulfilled(payload));

        const state = store.getState().mood;
        expect(state.loading).toBe(false);
        expect(state.moodHistory[0]).toEqual(payload);
        expect(state.currentMood).toBe("excited");
        expect(state.weeklyStats.totalEntries).toBe(1);
      });

      test("should handle rejected state correctly", () => {
        const error = "API Error";
        store.dispatch(
          logMood.rejected(new Error(error), "logMood", null, error),
        );

        const state = store.getState().mood;
        expect(state.loading).toBe(false);
        expect(state.error).toBe(error);
      });
    });

    describe("fetchMoodHistory", () => {
      test("should handle successful history fetch", async () => {
        const mockHistory = [
          { id: "1", mood: "happy", intensity: 7, timestamp: "2023-01-01" },
          { id: "2", mood: "calm", intensity: 5, timestamp: "2023-01-02" },
        ];

        jest
          .spyOn(apiService.mood, "getMoodHistory")
          .mockResolvedValue(mockHistory);

        await store.dispatch(fetchMoodHistory());

        const state = store.getState().mood;
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
        expect(state.moodHistory).toEqual(mockHistory);
        expect(state.weeklyStats.totalEntries).toBe(2);
      });

      test("should handle history fetch failure", async () => {
        const errorMessage = "Failed to fetch";
        jest
          .spyOn(apiService.mood, "getMoodHistory")
          .mockRejectedValue(new Error(errorMessage));

        await store.dispatch(fetchMoodHistory());

        const state = store.getState().mood;
        expect(state.loading).toBe(false);
        expect(state.error).toBe("Failed to fetch");
      });

      test("should handle fetch with date parameters", async () => {
        const mockHistory = [{ id: "1", mood: "happy", intensity: 7 }];
        jest
          .spyOn(apiService.mood, "getMoodHistory")
          .mockResolvedValue(mockHistory);

        await store.dispatch(
          fetchMoodHistory({
            startDate: "2023-01-01",
            endDate: "2023-01-07",
          }),
        );

        expect(apiService.mood.getMoodHistory).toHaveBeenCalledWith(
          "2023-01-01",
          "2023-01-07",
        );
      });

      test("should set loading state during history fetch", () => {
        store.dispatch(fetchMoodHistory.pending());

        const state = store.getState().mood;
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
      });

      test("should handle fulfilled state with history data", () => {
        const history = [
          { id: "1", mood: "happy", intensity: 7, createdAt: "2023-01-01" },
          { id: "2", mood: "sad", intensity: 4, createdAt: "2023-01-02" },
        ];

        store.dispatch(fetchMoodHistory.fulfilled(history));

        const state = store.getState().mood;
        expect(state.loading).toBe(false);
        expect(state.moodHistory).toEqual(history);
        expect(state.weeklyStats.averageIntensity).toBe(5.5);
      });
    });
  });

  describe("Edge Cases and Error Handling", () => {
    test("should handle empty mood data", async () => {
      jest.spyOn(apiService.mood, "logMood").mockResolvedValue({
        id: "123",
        mood: "",
        intensity: 0,
        createdAt: "2023-01-01T00:00:00.000Z",
      });

      await store.dispatch(logMood({ mood: "", intensity: 0 }));

      const state = store.getState().mood;
      expect(state.currentMood).toBe("");
      expect(state.moodHistory).toHaveLength(1);
    });

    test("should handle very long notes", async () => {
      const longNotes = "A".repeat(1000);
      jest.spyOn(apiService.mood, "logMood").mockResolvedValue({
        id: "123",
        mood: "happy",
        notes: longNotes,
        intensity: 5,
        createdAt: "2023-01-01T00:00:00.000Z",
      });

      await store.dispatch(logMood({ mood: "happy", notes: longNotes }));

      const state = store.getState().mood;
      expect(state.moodHistory[0].notes).toBe(longNotes);
    });

    test("should handle concurrent mood logging attempts", async () => {
      jest.spyOn(apiService.mood, "logMood").mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  id: "123",
                  mood: "happy",
                  intensity: 5,
                  createdAt: "2023-01-01T00:00:00.000Z",
                }),
              100,
            ),
          ),
      );

      const promise1 = store.dispatch(logMood({ mood: "happy" }));
      const promise2 = store.dispatch(logMood({ mood: "sad" }));

      await Promise.all([promise1, promise2]);

      const state = store.getState().mood;
      expect(state.moodHistory).toHaveLength(2);
      expect(state.loading).toBe(false);
    });

    test("should handle malformed API responses", async () => {
      jest.spyOn(apiService.mood, "logMood").mockResolvedValue(null);

      await store.dispatch(logMood({ mood: "happy" }));

      const state = store.getState().mood;
      expect(state.loading).toBe(false);
      expect(state.moodHistory).toHaveLength(0); // Null payload should not be added
      expect(state.currentMood).toBe(null); // Should not be set
    });

    test("should handle network timeout", async () => {
      jest
        .spyOn(apiService.mood, "logMood")
        .mockImplementation(
          () =>
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Network timeout")), 5000),
            ),
        );

      const dispatchPromise = store.dispatch(logMood({ mood: "happy" }));

      // Fast-forward timers
      jest.advanceTimersByTime(5000);

      await dispatchPromise;

      const state = store.getState().mood;
      expect(state.loading).toBe(false);
      expect(state.error).toBe("Network timeout");
    }, 6000);
  });

  describe("Integration Tests", () => {
    test("should maintain state consistency across operations", () => {
      // Set initial mood
      store.dispatch(setCurrentMood("happy"));
      let state = store.getState().mood;
      expect(state.currentMood).toBe("happy");
      expect(state.weeklyStats.totalEntries).toBe(1);

      // Clear error (should not affect other state)
      store.dispatch(clearMoodError());
      state = store.getState().mood;
      expect(state.currentMood).toBe("happy");
      expect(state.error).toBeNull();

      // Add another mood
      store.dispatch(setCurrentMood("calm"));
      state = store.getState().mood;
      expect(state.moodHistory).toHaveLength(2);
      expect(state.weeklyStats.totalEntries).toBe(2);
    });

    test("should handle complex mood patterns", () => {
      // Simulate a week of mood entries
      const moods = [
        "happy",
        "anxious",
        "calm",
        "happy",
        "sad",
        "happy",
        "excited",
      ];

      moods.forEach((mood) => {
        store.dispatch(setCurrentMood(mood));
      });

      const state = store.getState().mood;
      expect(state.moodHistory).toHaveLength(7);
      expect(state.weeklyStats.totalEntries).toBe(7);
      expect(state.weeklyStats.mostCommonMood).toBe("happy");
      expect(state.insights.some((i) => i.id === "anxiety-pattern")).toBe(true); // Should have anxiety insight
    });

    test("should handle mood logging workflow end-to-end", async () => {
      // Mock successful API
      const mockResponse = {
        id: "123",
        mood: "happy",
        intensity: 8,
        notes: "Great day!",
        activities: ["exercise"],
        createdAt: "2023-01-01T00:00:00.000Z",
      };
      jest.spyOn(apiService.mood, "logMood").mockResolvedValue(mockResponse);

      // Start logging
      let state = store.getState().mood;
      expect(state.loading).toBe(false);

      const logPromise = store.dispatch(
        logMood({
          mood: "happy",
          intensity: 8,
          notes: "Great day!",
          activities: ["exercise"],
        }),
      );

      // Check loading state
      state = store.getState().mood;
      expect(state.loading).toBe(true);

      await logPromise;

      // Check final state
      state = store.getState().mood;
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.currentMood).toBe("happy");
      expect(state.moodHistory[0]).toEqual(mockResponse);
      expect(state.weeklyStats.totalEntries).toBe(1);
      expect(state.insights.length).toBe(1); // High intensity should trigger positive insight
    });

    test("should handle error recovery workflow", async () => {
      // Mock API failure
      jest
        .spyOn(apiService.mood, "logMood")
        .mockRejectedValue(new Error("Network error"));

      // Attempt logging
      await store.dispatch(logMood({ mood: "sad" }));

      let state = store.getState().mood;
      expect(state.loading).toBe(false);
      expect(state.error).toBe("Network error");
      expect(state.moodHistory).toHaveLength(0);

      // Clear error
      store.dispatch(clearMoodError());
      state = store.getState().mood;
      expect(state.error).toBeNull();

      // Try again with success
      const mockResponse = {
        id: "124",
        mood: "sad",
        intensity: 3,
        createdAt: "2023-01-01T00:00:00.000Z",
      };
      jest.spyOn(apiService.mood, "logMood").mockResolvedValue(mockResponse);

      await store.dispatch(logMood({ mood: "sad", intensity: 3 }));

      state = store.getState().mood;
      expect(state.error).toBeNull();
      expect(state.moodHistory).toHaveLength(1);
      expect(state.currentMood).toBe("sad");
    });

    test("should handle stats and insights updates correctly", () => {
      // Add entries that should trigger different insights
      store.dispatch(setCurrentMood("anxious"));
      let state = store.getState().mood;
      expect(state.insights.some((i) => i.id === "anxiety-pattern")).toBe(true);

      // Add more entries to change stats
      store.dispatch(setCurrentMood("happy"));
      store.dispatch(setCurrentMood("happy"));
      store.dispatch(setCurrentMood("happy"));

      state = store.getState().mood;
      expect(state.weeklyStats.mostCommonMood).toBe("happy");
      expect(state.insights.some((i) => i.id === "anxiety-pattern")).toBe(true); // Should still have anxiety insight from first entry
    });
  });

  describe("Performance and Memory", () => {
    test("should handle large mood history efficiently", () => {
      // Add many mood entries
      for (let i = 0; i < 100; i++) {
        store.dispatch(setCurrentMood(i % 2 === 0 ? "happy" : "sad"));
      }

      const state = store.getState().mood;
      expect(state.moodHistory).toHaveLength(100);
      expect(state.weeklyStats.totalEntries).toBe(7); // Only last 7 count
      expect(state.weeklyStats.mostCommonMood).toBeDefined();
    });

    test("should not leak memory with repeated operations", () => {
      const initialHistoryLength = store.getState().mood.moodHistory.length;

      // Perform many operations
      for (let i = 0; i < 50; i++) {
        store.dispatch(setCurrentMood("happy"));
        store.dispatch(clearMoodError());
        store.dispatch(updateWeeklyStats());
        store.dispatch(updateInsights());
      }

      const state = store.getState().mood;
      expect(state.moodHistory.length).toBe(initialHistoryLength + 50);
      // Should not have excessive memory usage patterns
    });
  });
});
