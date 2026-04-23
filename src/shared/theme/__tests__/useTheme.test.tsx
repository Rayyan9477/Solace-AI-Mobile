// jest.setup.js globally mocks `./src/shared/theme/useTheme` to replace
// `ThemeProvider` with a passthrough ({ children } => children). That mock
// serves the rest of the test suite (which doesn't care about runtime
// theme state), but this file needs the REAL implementation — unmock.
jest.unmock("../useTheme");
jest.mock("../useTheme", () => jest.requireActual("../useTheme"));

import React from "react";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ThemeProvider, useTheme } from "../useTheme";
import { presets, DEFAULT_THEME_ID } from "../presets";

const STORAGE_KEY = "@solace/theme";

const wrapper = ({ children }: { children: React.ReactNode }): React.ReactElement =>
  React.createElement(ThemeProvider, null, children);

describe("ThemeProvider + useTheme", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it("renders the cosmic default when nothing is persisted", async () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    // Give mount effects a chance to run (they resolve immediately on mock)
    await act(async () => { await Promise.resolve(); });
    expect(result.current.id).toBe(DEFAULT_THEME_ID);
    expect(result.current.palette.midnight[950]).toBe(presets.cosmic.palette.midnight[950]);
  });

  it("hydrates the persisted preset id on mount", async () => {
    await AsyncStorage.setItem(STORAGE_KEY, "oceanCalm");
    const { result } = renderHook(() => useTheme(), { wrapper });
    await waitFor(
      () => expect(result.current.id).toBe("oceanCalm"),
      { timeout: 3000 },
    );
    expect(result.current.palette.midnight[950]).toBe(presets.oceanCalm.palette.midnight[950]);
  });

  it("ignores an invalid persisted value and falls back to the default", async () => {
    await AsyncStorage.setItem(STORAGE_KEY, "neonWhatever");
    const { result } = renderHook(() => useTheme(), { wrapper });
    await new Promise((r) => setTimeout(r, 100));
    expect(result.current.id).toBe(DEFAULT_THEME_ID);
  });

  it("setTheme switches the active preset AND persists the new id", async () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    await act(async () => { await Promise.resolve(); });

    await act(async () => {
      await result.current.setTheme("softRose");
    });

    expect(result.current.id).toBe("softRose");
    expect(result.current.palette.midnight[950]).toBe(presets.softRose.palette.midnight[950]);
    expect(await AsyncStorage.getItem(STORAGE_KEY)).toBe("softRose");
  });

  it("setTheme rejects an unknown id without mutating state or storage", async () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    await act(async () => { await Promise.resolve(); });

    await act(async () => {
      await result.current.setTheme("notARealPreset" as any);
    });

    expect(result.current.id).toBe(DEFAULT_THEME_ID);
    expect(await AsyncStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("rebuilds semantic colors against the active preset's palette", async () => {
    await AsyncStorage.setItem(STORAGE_KEY, "deepForest");
    const { result } = renderHook(() => useTheme(), { wrapper });
    await waitFor(
      () => expect(result.current.id).toBe("deepForest"),
      { timeout: 3000 },
    );
    // text.primary is always warm-50 — shared across all presets
    expect(result.current.colors.text.primary).toBe(presets.deepForest.palette.warm[50]);
  });

  it("useTheme outside a provider returns the default static theme", async () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.id).toBe(DEFAULT_THEME_ID);
    expect(result.current.palette.midnight[950]).toBe(presets.cosmic.palette.midnight[950]);
  });
});
