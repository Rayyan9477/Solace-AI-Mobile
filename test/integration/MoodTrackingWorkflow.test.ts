/**
 * Mood Tracking Workflow Integration Tests
 * Tests complete user journeys for mood tracking functionality
 * Ensures proper data flow and user experience
 */

import { NavigationContainer } from "@react-navigation/native";
import { configureStore, Store } from "@reduxjs/toolkit";
import {
  render,
  fireEvent,
  waitFor,
  RenderAPI,
} from "@testing-library/react-native";
import React from "react";
import { Provider } from "react-redux";

import MoodCheckIn from "../../src/features/dashboard/components/MoodCheckIn";
import MainAppScreen from "../../src/screens/MainAppScreen";
import EnhancedMoodTrackerScreen from "../../src/screens/mood/EnhancedMoodTrackerScreen";
import { ThemeProvider } from "../../src/shared/theme/ThemeContext";
import moodSlice from "../../src/store/slices/moodSlice";

// Mock dependencies
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: ({ children }: any) => children,
}));

jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

interface MoodEntry {
  mood: string;
  timestamp: number;
  intensity: number;
  // Placeholder: migrated to .tsx version. Keeping this file to avoid legacy runners referencing it.
  describe('MoodTrackingWorkflow (migrated)', () => {
    it('placeholder', () => {
      expect(true).toBe(true);
    });
  });
      });
    });
  });

  describe("Enhanced Mood Tracking Flow", () => {
    it("completes full 4-step mood tracking process", async () => {
      const { getByTestId, getByText } = render(
        <TestWrapper store={store}>
          <EnhancedMoodTrackerScreen />
        </TestWrapper>,
      );

      expect(getByText(/select.*mood/i)).toBeTruthy();

      const happyMood = getByTestId("mood-option-happy") || getByText(/happy/i);
      fireEvent.press(happyMood);

      const nextButton = getByTestId("next-button") || getByText(/next/i);
      fireEvent.press(nextButton);

      await waitFor(() => {
        expect(getByText(/intensity/i) || getByText(/scale/i)).toBeTruthy();
      });

      const intensitySlider = getByTestId("intensity-slider");
      fireEvent(intensitySlider, "valueChange", 8);

      fireEvent.press(getByTestId("next-button") || getByText(/next/i));

      await waitFor(() => {
        expect(getByText(/activit/i)).toBeTruthy();
      });

      const exerciseActivity =
        getByTestId("activity-exercise") || getByText(/exercise/i);
      fireEvent.press(exerciseActivity);

      fireEvent.press(getByTestId("next-button") || getByText(/next/i));

      await waitFor(() => {
        expect(getByText(/notes/i) || getByText(/trigger/i)).toBeTruthy();
      });

      const notesInput = getByTestId("notes-input");
      fireEvent.changeText(notesInput, "Had a great workout today!");

      const saveButton = getByTestId("save-button") || getByText(/save/i);
      fireEvent.press(saveButton);

      await waitFor(() => {
        const state = store.getState() as any;
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

      const nextButton = getByTestId("next-button") || getByText(/next/i);
      fireEvent.press(nextButton);

      await waitFor(() => {
        expect(
          getByText(/select.*mood/i) ||
            getByText(/required/i)
        ).toBeTruthy();
      });

      const state = store.getState() as any;
      expect(state.enhancedMood.currentStep).toBe(1);
    });
  });

  describe("Error Handling and Recovery", () => {
    it("handles save failures gracefully", async () => {
      const failingStore = createTestStore();
      const originalDispatch = failingStore.dispatch;
      failingStore.dispatch = jest.fn(() => {
        throw new Error("Save failed");
      }) as any;

      const { getByTestId, getByText } = render(
        <TestWrapper store={failingStore}>
          <EnhancedMoodTrackerScreen />
        </TestWrapper>,
      );

      const happyMood = getByTestId("mood-option-happy") || getByText(/happy/i);
      fireEvent.press(happyMood);

      const saveButton = getByTestId("save-button") || getByText(/save/i);
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(
          getByText(/error/i) ||
            getByText(/failed/i) ||
            getByText(/try.*again/i),
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

      const buttons = getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);

      buttons.forEach((button) => {
        expect(button.props.accessibilityLabel).toBeTruthy();
      });
    });
  });
});
