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
import enhancedMoodSlice from "../../src/store/slices/enhancedMoodSlice";
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
  notes?: string;
  activities?: string[];
  triggers?: string[];
}

interface MoodState {
  currentMood: string | null;
  moodHistory: MoodEntry[];
  loading: boolean;
  error: string | null;
}

interface EnhancedMoodState {
  currentStep: number;
  selectedMood: string | null;
  intensity: number;
  activities: string[];
  notes: string;
  triggers: string[];
  isSubmitting: boolean;
}

interface TestState {
  mood?: Partial<MoodState>;
  enhancedMood?: Partial<EnhancedMoodState>;
}

// Create test store
const createTestStore = (initialState: TestState = {}): Store => {
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
    } as any,
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
    h1: { fontSize: 32, fontWeight: "bold" as const },
    h2: { fontSize: 24, fontWeight: "bold" as const },
    body: { fontSize: 16, fontWeight: "normal" as const },
  },
};

interface TestWrapperProps {
  children: React.ReactNode;
  store: Store;
  theme?: typeof mockTheme;
}

const TestWrapper: React.FC<TestWrapperProps> = ({ 
  children, 
  store, 
  theme = mockTheme 
}) => (
  <Provider store={store}>
    <ThemeProvider
      value={{
        theme,
        isReducedMotionEnabled: false,
        colors: theme.colors,
      } as any}
    >
      <NavigationContainer>{children}</NavigationContainer>
    </ThemeProvider>
  </Provider>
);

describe("Mood Tracking Workflow Integration", () => {
  let store: Store;

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

      const moodCheckIn = getByTestId("mood-check-in");
      expect(moodCheckIn).toBeTruthy();

      const checkInButton = getByText("How are you feeling?");
      fireEvent.press(checkInButton);

      await waitFor(() => {
        const state = store.getState() as any;
        expect(state.mood.currentMood).toBeTruthy();
      });
    });

    it("shows mood history and trends", async () => {
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

      await waitFor(() => {
        expect(getByText(/trend/i) || getByText(/history/i)).toBeTruthy();
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
