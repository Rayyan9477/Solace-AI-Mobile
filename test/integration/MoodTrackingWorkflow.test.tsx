/**
 * Mood Tracking Workflow Integration (minimized)
 * Keeps a light end-to-end sanity check without redundancy.
 */

import { NavigationContainer } from "@react-navigation/native";
import { configureStore } from "@reduxjs/toolkit";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import React from "react";
import { Provider } from "react-redux";

import MoodCheckIn from "../../src/features/dashboard/components/MoodCheckIn";
import { ThemeProvider } from "../../src/shared/theme/ThemeContext";
import moodSlice from "../../src/store/slices/moodSlice";

jest.mock("expo-linear-gradient", () => ({
  LinearGradient: ({ children }: any) => children,
}));

jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
}));

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

const createStore = () =>
  configureStore({
    reducer: { mood: moodSlice.reducer },
    preloadedState: {
      mood: {
        currentMood: null,
        moodHistory: [],
        weeklyStats: { averageIntensity: 0, mostCommonMood: null, totalEntries: 0 },
        insights: [],
        loading: false,
        error: null,
      },
    } as any,
  });

const Wrapper: React.FC<{ children: React.ReactNode; store: any }> = ({ children, store }) => (
  <Provider store={store}>
    <ThemeProvider value={{ theme: mockTheme as any, isReducedMotionEnabled: false, colors: mockTheme.colors } as any}>
      <NavigationContainer>{children}</NavigationContainer>
    </ThemeProvider>
  </Provider>
);

describe("Mood Tracking Workflow (minimal)", () => {
  it("allows quick mood check-in via title press", async () => {
    const store = createStore();
    const { getByText } = render(
      <Wrapper store={store}>
        <MoodCheckIn />
      </Wrapper>,
    );

    fireEvent.press(getByText("How are you feeling?"));

    await waitFor(() => {
      const state: any = store.getState();
      // Should set a mood (default to "happy" when none selected)
      expect(state.mood.currentMood).toBeTruthy();
    });
  });
});
