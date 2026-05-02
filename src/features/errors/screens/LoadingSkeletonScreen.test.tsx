/**
 * LoadingSkeletonScreen Tests — prototype v4.2 #39 (Sprint 9 Batch B).
 */

jest.mock("expo-linear-gradient", () => {
  const { View } = require("react-native");
  return { LinearGradient: View };
});

import React from "react";
import { render } from "@testing-library/react-native";

import { LoadingSkeletonScreen } from "./LoadingSkeletonScreen";

const mockUseReducedMotion = jest.fn(() => false);
jest.mock("@/shared/hooks/useReducedMotion", () => ({
  useReducedMotion: () => mockUseReducedMotion(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockUseReducedMotion.mockReturnValue(false);
});

describe("LoadingSkeletonScreen", () => {
  // 1
  it("renders the screen container", () => {
    const { getByTestId } = render(<LoadingSkeletonScreen />);
    expect(getByTestId("loading-skeleton-screen")).toBeTruthy();
  });

  // 2
  it("matches snapshot", () => {
    const tree = render(<LoadingSkeletonScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // 3
  it("renders the header row skeletons (bracket + bell)", () => {
    const { getByTestId } = render(<LoadingSkeletonScreen />);
    expect(
      getByTestId("skel-header-bracket", { includeHiddenElements: true }),
    ).toBeTruthy();
    expect(
      getByTestId("skel-header-bell", { includeHiddenElements: true }),
    ).toBeTruthy();
  });

  // 4
  it("renders both headline placeholder lines", () => {
    const { getByTestId } = render(<LoadingSkeletonScreen />);
    expect(
      getByTestId("skel-headline-line-1", { includeHiddenElements: true }),
    ).toBeTruthy();
    expect(
      getByTestId("skel-headline-line-2", { includeHiddenElements: true }),
    ).toBeTruthy();
  });

  // 5
  it("renders the hero card with left column + circular orb skeleton", () => {
    const { getByTestId } = render(<LoadingSkeletonScreen />);
    expect(getByTestId("skel-hero-card")).toBeTruthy();
    expect(
      getByTestId("skel-hero-orb", { includeHiddenElements: true }),
    ).toBeTruthy();
    expect(
      getByTestId("skel-hero-bar-1", { includeHiddenElements: true }),
    ).toBeTruthy();
    expect(
      getByTestId("skel-hero-bar-2", { includeHiddenElements: true }),
    ).toBeTruthy();
  });

  // 6
  it("renders all four stat-grid cells (2x2)", () => {
    const { getByTestId } = render(<LoadingSkeletonScreen />);
    expect(getByTestId("skel-stat-a")).toBeTruthy();
    expect(getByTestId("skel-stat-b")).toBeTruthy();
    expect(getByTestId("skel-stat-c")).toBeTruthy();
    expect(getByTestId("skel-stat-d")).toBeTruthy();
  });

  // 7
  it("renders the list card placeholder row", () => {
    const { getByTestId } = render(<LoadingSkeletonScreen />);
    expect(getByTestId("skel-list-card")).toBeTruthy();
    expect(
      getByTestId("skel-list-thumb", { includeHiddenElements: true }),
    ).toBeTruthy();
    expect(
      getByTestId("skel-list-title", { includeHiddenElements: true }),
    ).toBeTruthy();
  });

  // 8
  it("renders the breathing orb loader inside concentric rings", () => {
    const { getByTestId } = render(<LoadingSkeletonScreen />);
    expect(
      getByTestId("loading-rings", { includeHiddenElements: true }),
    ).toBeTruthy();
    expect(
      getByTestId("loading-orb", { includeHiddenElements: true }),
    ).toBeTruthy();
  });

  // 9
  it("renders the default 'Preparing your space...' caption", () => {
    const { getAllByText } = render(<LoadingSkeletonScreen />);
    expect(getAllByText(/PREPARING YOUR SPACE/i).length).toBeGreaterThan(0);
  });

  // 10
  it("respects custom label prop", () => {
    const { getAllByText } = render(
      <LoadingSkeletonScreen label="Loading data" />,
    );
    expect(getAllByText(/LOADING DATA/i).length).toBeGreaterThan(0);
  });

  // 11
  it("loading progress flag exposes accessibilityRole=progressbar with busy state", () => {
    const { getByTestId } = render(<LoadingSkeletonScreen />);
    const flag = getByTestId("loading-progress-flag");
    expect(flag.props.accessibilityRole).toBe("progressbar");
    expect(flag.props.accessibilityLabel).toBe("Loading your space");
    expect(flag.props.accessibilityState).toEqual({ busy: true });
  });

  // 12
  it("includes a polite live region announcing progress to screen readers", () => {
    const { getByTestId } = render(<LoadingSkeletonScreen />);
    const live = getByTestId("loading-live-region");
    expect(live.props.accessibilityLiveRegion).toBe("polite");
  });

  // 13
  it("respects reduced motion (orb still mounts statically)", () => {
    mockUseReducedMotion.mockReturnValue(true);
    const { getByTestId } = render(<LoadingSkeletonScreen />);
    expect(
      getByTestId("loading-orb", { includeHiddenElements: true }),
    ).toBeTruthy();
  });

  // 14
  it("uses cosmic midnight-950 background, not legacy hex", () => {
    const { getByTestId } = render(<LoadingSkeletonScreen />);
    const flat = Object.assign(
      {},
      ...[]
        .concat(getByTestId("loading-skeleton-screen").props.style as never[])
        .filter(Boolean),
    ) as { backgroundColor?: string };
    expect(flat.backgroundColor).toBe("#040818");
  });

  // 15
  it("has zero call-to-action / interactive elements (purely informational)", () => {
    const { queryAllByRole } = render(<LoadingSkeletonScreen />);
    // No buttons or links — this is a pure loading state
    expect(queryAllByRole("button")).toHaveLength(0);
    expect(queryAllByRole("link")).toHaveLength(0);
  });

  // 16
  it("renders ambient SmokeBlob top-of-screen (decorative)", () => {
    const { getByTestId } = render(<LoadingSkeletonScreen />);
    expect(
      getByTestId("loading-smoke-blob", { includeHiddenElements: true }),
    ).toBeTruthy();
  });
});
