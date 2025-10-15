/**
 * Mood Tracking Workflow Integration Tests
 * Tests complete user journeys for mood tracking functionality
 * Ensures proper data flow and user experience
 */

import { NavigationContainer } from "@react-navigation/native";
import { configureStore } from "@reduxjs/toolkit";
import {
  render,
  fireEvent,
  waitFor,
  act,
  screen,
} from "@testing-library/react-native";
import React from "react";
import { Provider } from "react-redux";

import MoodCheckIn from "../../components/dashboard/MoodCheckIn";
import MainAppScreen from "../../src/screens/MainAppScreen";
import EnhancedMoodTrackerScreen from "../../src/screens/mood/EnhancedMoodTrackerScreen";
import { ThemeProvider } from "../../src/shared/theme/ThemeContext";
import enhancedMoodSlice from "../../src/store/slices/enhancedMoodSlice";
import moodSlice from "../../src/store/slices/moodSlice";

// Mock dependencies
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: ({ children }) => children,
}));

jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

// Create test store
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      mood: moodSlice.reducer,
      enhancedMood: enhancedMoodSlice.reducer,
    },
    preloadedState: {
      mood: {
        currentMood: null,
        moodHistory: [],
        loading: false,
        error: null,
        ...initialState.mood,
      },
      enhancedMood: {
        currentStep: 1,
        selectedMood: null,
        intensity: 5,
        activities: [],
        notes: "",
        triggers: [],
        isSubmitting: false,
        ...initialState.enhancedMood,
      },
    },
  });
};

const mockTheme = {
  colors: {
    calming: ["#2196F3", "#64B5F6"],
    nurturing: ["#4CAF50", "#81C784"],
    peaceful: ["#607D8B", "#90A4AE"],
    background: "#FFFFFF",
    text: "#000000",
    surface: "#F5F5F5",
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  borderRadius: { sm: 4, md: 8, lg: 12, xl: 16 },
  typography: {
    h1: { fontSize: 32, fontWeight: "bold" },
    h2: { fontSize: 24, fontWeight: "bold" },
    body: { fontSize: 16, fontWeight: "normal" },
  },
};

const TestWrapper = ({ children, store, theme = mockTheme }) => (
  <Provider store={store}>
    <ThemeProvider
      value={{
        theme,
        isReducedMotionEnabled: false,
        colors: theme.colors,
      }}
    >
      <NavigationContainer>{children}</NavigationContainer>
    </ThemeProvider>
  </Provider>
);

describe("Mood Tracking Workflow Integration", () => {
  let store;

  beforeEach(() => {
    store = createTestStore();
    jest.clearAllMocks();
  });

  describe("Quick Mood Check-In Flow", () => {
    it("completes basic mood check-in from dashboard", async () => {
      const { getByTestId, getByText } = render(
        <TestWrapper store={store}>
          <MainAppScreen />
        </TestWrapper>,
      );

      // Find mood check-in component
      const moodCheckIn = getByTestId("mood-check-in");
      expect(moodCheckIn).toBeTruthy();

      // Select a mood - find button by text instead of testID
      const checkInButton = getByText("Log Mood");
      fireEvent.press(checkInButton);

      await waitFor(() => {
        // Should update mood state
        const state = store.getState();
        expect(state.mood.currentMood).toBeTruthy();
      });
    });

    it("persists mood data after check-in", async () => {
      const { getByTestId } = render(
        <TestWrapper store={store}>
          <MoodCheckIn
            testID="mood-check-in"
            onCheckIn={(mood) => {
              store.dispatch({ type: "mood/setCurrentMood", payload: mood });
            }}
          />
        </TestWrapper>,
      );

      const checkInButton = getByTestId("mood-check-in-button");
      fireEvent.press(checkInButton);

      await waitFor(() => {
        const state = store.getState();
        expect(state.mood.moodHistory).toHaveLength(1);
      });
    });

    it("shows mood history and trends", async () => {
      // Pre-populate mood history
      const storeWithHistory = createTestStore({
        mood: {
          moodHistory: [
            { mood: "happy", timestamp: Date.now() - 86400000, intensity: 8 },
            { mood: "calm", timestamp: Date.now() - 43200000, intensity: 7 },
            { mood: "anxious", timestamp: Date.now(), intensity: 3 },
          ],
        },
      });

      const { getByText } = render(
        <TestWrapper store={storeWithHistory}>
          <MainAppScreen />
        </TestWrapper>,
      );

      // Should display mood trends
      await waitFor(() => {
        expect(getByText(/trend/i) || getByText(/history/i)).toBeTruthy();
      });
    });
  });

  describe("Enhanced Mood Tracking Flow", () => {
    it("completes full 4-step mood tracking process", async () => {
      const { getByTestId, getByText, queryByText } = render(
        <TestWrapper store={store}>
          <EnhancedMoodTrackerScreen />
        </TestWrapper>,
      );

      // Step 1: Mood Selection
      expect(getByText(/select.*mood/i)).toBeTruthy();

      const happyMood = getByTestId("mood-option-happy") || getByText(/happy/i);
      fireEvent.press(happyMood);

      const nextButton = getByTestId("next-button") || getByText(/next/i);
      fireEvent.press(nextButton);

      await waitFor(() => {
        // Step 2: Intensity Rating
        expect(getByText(/intensity/i) || getByText(/scale/i)).toBeTruthy();
      });

      // Set intensity
      const intensitySlider = getByTestId("intensity-slider");
      fireEvent(intensitySlider, "valueChange", 8);

      fireEvent.press(getByTestId("next-button") || getByText(/next/i));

      await waitFor(() => {
        // Step 3: Activity Selection
        expect(getByText(/activit/i)).toBeTruthy();
      });

      // Select activities
      const exerciseActivity =
        getByTestId("activity-exercise") || getByText(/exercise/i);
      fireEvent.press(exerciseActivity);

      fireEvent.press(getByTestId("next-button") || getByText(/next/i));

      await waitFor(() => {
        // Step 4: Notes and Triggers
        expect(getByText(/notes/i) || getByText(/trigger/i)).toBeTruthy();
      });

      // Add notes
      const notesInput = getByTestId("notes-input");
      fireEvent.changeText(notesInput, "Had a great workout today!");

      // Save mood entry
      const saveButton = getByTestId("save-button") || getByText(/save/i);
      fireEvent.press(saveButton);

      await waitFor(() => {
        const state = store.getState();
        expect(state.enhancedMood.selectedMood).toBe("happy");
        expect(state.enhancedMood.intensity).toBe(8);
        expect(state.enhancedMood.activities).toContain("exercise");
        expect(state.enhancedMood.notes).toBe("Had a great workout today!");
      });
    });

    it("validates required fields before progression", async () => {
      const { getByTestId, getByText } = render(
        <TestWrapper store={store}>
          <EnhancedMoodTrackerScreen />
        </TestWrapper>,
      );

      // Try to proceed without selecting mood
      const nextButton = getByTestId("next-button") || getByText(/next/i);
      fireEvent.press(nextButton);

      await waitFor(() => {
        // Should show validation error
        expect(
          getByText(/select.*mood/i) ||
            getByText(/required/i) ||
            screen.queryByText(/please.*select/i),
        ).toBeTruthy();
      });

      // Should remain on step 1
      const state = store.getState();
      expect(state.enhancedMood.currentStep).toBe(1);
    });

    it("allows going back to previous steps", async () => {
      const { getByTestId, getByText } = render(
        <TestWrapper store={store}>
          <EnhancedMoodTrackerScreen />
        </TestWrapper>,
      );

      // Complete step 1
      const happyMood = getByTestId("mood-option-happy") || getByText(/happy/i);
      fireEvent.press(happyMood);

      const nextButton = getByTestId("next-button") || getByText(/next/i);
      fireEvent.press(nextButton);

      await waitFor(() => {
        expect(store.getState().enhancedMood.currentStep).toBe(2);
      });

      // Go back to step 1
      const backButton = getByTestId("back-button") || getByText(/back/i);
      fireEvent.press(backButton);

      await waitFor(() => {
        expect(store.getState().enhancedMood.currentStep).toBe(1);
        expect(getByText(/select.*mood/i)).toBeTruthy();
      });
    });

    it("preserves data when navigating between steps", async () => {
      const { getByTestId, getByText } = render(
        <TestWrapper store={store}>
          <EnhancedMoodTrackerScreen />
        </TestWrapper>,
      );

      // Select mood and go to step 2
      const calmMood = getByTestId("mood-option-calm") || getByText(/calm/i);
      fireEvent.press(calmMood);

      fireEvent.press(getByTestId("next-button") || getByText(/next/i));

      // Set intensity and go back
      const intensitySlider = getByTestId("intensity-slider");
      fireEvent(intensitySlider, "valueChange", 6);

      fireEvent.press(getByTestId("back-button") || getByText(/back/i));

      // Go forward again
      fireEvent.press(getByTestId("next-button") || getByText(/next/i));

      await waitFor(() => {
        const state = store.getState();
        expect(state.enhancedMood.selectedMood).toBe("calm");
        expect(state.enhancedMood.intensity).toBe(6);
      });
    });
  });

  describe("Data Integration and Analytics", () => {
    it("aggregates mood data for insights", async () => {
      const storeWithData = createTestStore({
        mood: {
          moodHistory: [
            { mood: "happy", timestamp: Date.now() - 604800000, intensity: 8 },
            {
              mood: "anxious",
              timestamp: Date.now() - 518400000,
              intensity: 4,
            },
            { mood: "calm", timestamp: Date.now() - 432000000, intensity: 7 },
            { mood: "happy", timestamp: Date.now() - 345600000, intensity: 9 },
            { mood: "sad", timestamp: Date.now() - 259200000, intensity: 3 },
          ],
        },
      });

      const { getByText } = render(
        <TestWrapper store={storeWithData}>
          <MainAppScreen />
        </TestWrapper>,
      );

      await waitFor(() => {
        // Should show mood insights
        expect(
          getByText(/insight/i) || getByText(/trend/i) || getByText(/pattern/i),
        ).toBeTruthy();
      });
    });

    it("tracks mood patterns over time", async () => {
      const weeklyData = Array.from({ length: 7 }, (_, i) => ({
        mood: i % 2 === 0 ? "happy" : "anxious",
        timestamp: Date.now() - i * 86400000,
        intensity: i % 2 === 0 ? 8 : 4,
      }));

      const storeWithPatterns = createTestStore({
        mood: { moodHistory: weeklyData },
      });

      const { getByText } = render(
        <TestWrapper store={storeWithPatterns}>
          <MainAppScreen />
        </TestWrapper>,
      );

      await waitFor(() => {
        // Should detect alternating pattern
        expect(
          getByText(/pattern/i) || getByText(/weekly/i) || getByText(/trend/i),
        ).toBeTruthy();
      });
    });

    it("provides mood-based recommendations", async () => {
      const storeWithLowMood = createTestStore({
        mood: {
          currentMood: "sad",
          moodHistory: [
            { mood: "sad", timestamp: Date.now(), intensity: 2 },
            { mood: "anxious", timestamp: Date.now() - 3600000, intensity: 3 },
          ],
        },
      });

      const { getByText } = render(
        <TestWrapper store={storeWithLowMood}>
          <MainAppScreen />
        </TestWrapper>,
      );

      await waitFor(() => {
        // Should show supportive recommendations
        expect(
          getByText(/recommend/i) ||
            getByText(/suggest/i) ||
            getByText(/might help/i) ||
            getByText(/support/i),
        ).toBeTruthy();
      });
    });
  });

  describe("Crisis Detection Integration", () => {
    it("detects concerning mood patterns", async () => {
      const concerningData = Array.from({ length: 5 }, (_, i) => ({
        mood: "depressed",
        timestamp: Date.now() - i * 86400000,
        intensity: 2,
        notes: i === 0 ? "feeling hopeless" : "",
      }));

      const storeWithConcern = createTestStore({
        mood: { moodHistory: concerningData },
        enhancedMood: {
          notes: "feeling hopeless and worthless",
          selectedMood: "depressed",
          intensity: 1,
        },
      });

      const { getByText, getByTestId } = render(
        <TestWrapper store={storeWithConcern}>
          <EnhancedMoodTrackerScreen />
        </TestWrapper>,
      );

      // Complete mood tracking with concerning data
      const saveButton = getByTestId("save-button") || getByText(/save/i);
      fireEvent.press(saveButton);

      await waitFor(() => {
        // Should trigger support resources
        expect(
          getByText(/support/i) || getByText(/help/i) || getByText(/resource/i),
        ).toBeTruthy();
      });
    });

    it("provides immediate crisis support when needed", async () => {
      const { getByTestId, getByText } = render(
        <TestWrapper store={store}>
          <EnhancedMoodTrackerScreen />
        </TestWrapper>,
      );

      // Navigate to notes step
      // ... (navigation steps)

      // Add crisis-related note
      const notesInput = getByTestId("notes-input");
      fireEvent.changeText(notesInput, "I want to hurt myself");

      await waitFor(() => {
        // Should immediately show crisis resources
        expect(
          getByText(/crisis/i) ||
            getByText(/emergency/i) ||
            getByText(/988/i) ||
            getByText(/help.*now/i),
        ).toBeTruthy();
      });
    });
  });

  describe("Error Handling and Recovery", () => {
    it("handles save failures gracefully", async () => {
      // Mock save failure
      const failingStore = createTestStore();
      const originalDispatch = failingStore.dispatch;
      failingStore.dispatch = jest.fn(() => {
        throw new Error("Save failed");
      });

      const { getByTestId, getByText } = render(
        <TestWrapper store={failingStore}>
          <EnhancedMoodTrackerScreen />
        </TestWrapper>,
      );

      // Complete mood tracking
      const happyMood = getByTestId("mood-option-happy") || getByText(/happy/i);
      fireEvent.press(happyMood);

      const saveButton = getByTestId("save-button") || getByText(/save/i);
      fireEvent.press(saveButton);

      await waitFor(() => {
        // Should show error message
        expect(
          getByText(/error/i) ||
            getByText(/failed/i) ||
            getByText(/try.*again/i),
        ).toBeTruthy();
      });
    });

    it("recovers from network connectivity issues", async () => {
      // Mock network failure
      global.fetch = jest.fn(() => Promise.reject(new Error("Network error")));

      const { getByTestId, getByText } = render(
        <TestWrapper store={store}>
          <EnhancedMoodTrackerScreen />
        </TestWrapper>,
      );

      // Complete mood tracking
      const calmMood = getByTestId("mood-option-calm") || getByText(/calm/i);
      fireEvent.press(calmMood);

      const saveButton = getByTestId("save-button") || getByText(/save/i);
      fireEvent.press(saveButton);

      await waitFor(() => {
        // Should save locally and show sync pending
        expect(
          getByText(/saved.*locally/i) ||
            getByText(/sync.*later/i) ||
            getByText(/offline/i),
        ).toBeTruthy();
      });
    });

    it("validates data integrity", async () => {
      const { getByTestId, getByText } = render(
        <TestWrapper store={store}>
          <EnhancedMoodTrackerScreen />
        </TestWrapper>,
      );

      // Try to save with invalid intensity
      const intensitySlider = getByTestId("intensity-slider");
      fireEvent(intensitySlider, "valueChange", -1); // Invalid value

      const saveButton = getByTestId("save-button") || getByText(/save/i);
      fireEvent.press(saveButton);

      await waitFor(() => {
        // Should show validation error
        expect(
          getByText(/invalid/i) || getByText(/valid.*range/i),
        ).toBeTruthy();
      });
    });
  });

  describe("Accessibility in Workflow", () => {
    it("supports screen reader navigation through all steps", async () => {
      const { getAllByRole } = render(
        <TestWrapper store={store}>
          <EnhancedMoodTrackerScreen />
        </TestWrapper>,
      );

      // All interactive elements should have proper roles
      const buttons = getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);

      buttons.forEach((button) => {
        expect(button.props.accessibilityLabel).toBeTruthy();
      });
    });

    it("provides progress indication for screen readers", async () => {
      const { getByTestId } = render(
        <TestWrapper store={store}>
          <EnhancedMoodTrackerScreen />
        </TestWrapper>,
      );

      const progressIndicator = getByTestId("progress-indicator");
      expect(progressIndicator.props.accessibilityLabel).toContain("step");
      expect(progressIndicator.props.accessibilityValue).toBeTruthy();
    });
  });

  describe("Performance", () => {
    it("handles large mood history datasets efficiently", async () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        mood: ["happy", "sad", "anxious", "calm"][i % 4],
        timestamp: Date.now() - i * 3600000,
        intensity: Math.floor(Math.random() * 10) + 1,
      }));

      const storeWithLargeData = createTestStore({
        mood: { moodHistory: largeDataset },
      });

      const startTime = Date.now();

      const { getByTestId } = render(
        <TestWrapper store={storeWithLargeData}>
          <MainAppScreen />
        </TestWrapper>,
      );

      const endTime = Date.now();
      const renderTime = endTime - startTime;

      // Should render quickly even with large dataset
      expect(renderTime).toBeLessThan(1000);
      expect(getByTestId("main-app-screen")).toBeTruthy();
    });
  });
});
