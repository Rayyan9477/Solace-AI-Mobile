/**
 * SessionCompleteScreen Tests — prototype v4.2 #32
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import { SessionCompleteScreen } from "./SessionCompleteScreen";

const baseProps = {
  onClose: jest.fn(),
  onCheckIn: jest.fn(),
  onBack: jest.fn(),
};

function renderScreen(overrides: Record<string, unknown> = {}) {
  return render(<SessionCompleteScreen {...baseProps} {...overrides} />);
}

describe("SessionCompleteScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("session-complete-screen")).toBeTruthy();
  });

  it("renders the celebration radial gradient", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("session-complete-gradient")).toBeTruthy();
  });

  it("renders the wave illustration", () => {
    const { UNSAFE_root } = renderScreen();
    const found = UNSAFE_root.findAll(
      (n: { props: { testID?: string } }) => n.props.testID === "wave-illustration",
    );
    expect(found.length).toBeGreaterThan(0);
  });

  it("renders the success ring with image role", () => {
    const { getByTestId } = renderScreen();
    const ring = getByTestId("success-ring");
    expect(ring.props.accessibilityRole).toBe("image");
    expect(ring.props.accessibilityLabel).toBe("Session completed successfully");
  });

  it("renders the close button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("close-button").props.accessibilityRole).toBe("button");
  });

  it("invokes onClose when close pressed", () => {
    const onClose = jest.fn();
    const { getByTestId } = renderScreen({ onClose });
    fireEvent.press(getByTestId("close-button"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("displays the hero title with default minutes", () => {
    const { getByTestId } = renderScreen();
    const title = getByTestId("hero-title");
    expect(title.props.children).toBeTruthy();
  });

  it("includes the session title in the subtitle copy", () => {
    const { getByText } = renderScreen();
    expect(
      getByText(/You completed the Monday reset meditation/),
    ).toBeTruthy();
  });

  it("includes a custom session title in the subtitle", () => {
    const { getByText } = renderScreen({ sessionTitle: "evening wind-down" });
    expect(getByText(/You completed the evening wind-down/)).toBeTruthy();
  });

  it("renders the three stat cards", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("stat-total")).toBeTruthy();
    expect(getByTestId("stat-streak")).toBeTruthy();
    expect(getByTestId("stat-mood")).toBeTruthy();
  });

  type TestNode = {
    props: { testID?: string; children?: unknown };
    find: (_predicate: (_n: TestNode) => boolean) => TestNode;
  };

  function findText(root: TestNode, id: string): string {
    const node = root.find(
      (n: TestNode) => n.props.testID === id,
    );
    const { children } = node.props;
    if (typeof children === "string") return children;
    if (Array.isArray(children)) {
      return children
        .map((c: unknown) => (typeof c === "string" ? c : ""))
        .join("");
    }
    return String(children);
  }

  it("renders default total minutes 24", () => {
    const { UNSAFE_root } = renderScreen();
    expect(findText(UNSAFE_root, "stat-total-value")).toBe("24");
  });

  it("renders default streak days 23", () => {
    const { UNSAFE_root } = renderScreen();
    expect(findText(UNSAFE_root, "stat-streak-value")).toContain("23");
  });

  it("renders mood points with leading + sign", () => {
    const { UNSAFE_root } = renderScreen();
    expect(findText(UNSAFE_root, "stat-mood-value")).toBe("+2");
  });

  it("supports negative mood points without doubling sign", () => {
    const { UNSAFE_root } = renderScreen({ moodPoints: -3 });
    expect(findText(UNSAFE_root, "stat-mood-value")).toBe("-3");
  });

  it("renders the primary check-in button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("check-in-button")).toBeTruthy();
  });

  it("invokes onCheckIn when primary CTA pressed", () => {
    const onCheckIn = jest.fn();
    const { getByTestId } = renderScreen({ onCheckIn });
    fireEvent.press(getByTestId("check-in-button"));
    expect(onCheckIn).toHaveBeenCalledTimes(1);
  });

  it("renders the back link with link role", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-link").props.accessibilityRole).toBe("link");
  });

  it("invokes onBack when back link pressed", () => {
    const onBack = jest.fn();
    const { getByTestId } = renderScreen({ onBack });
    fireEvent.press(getByTestId("back-link"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("close button meets 44pt touch target", () => {
    const { getByTestId } = renderScreen();
    const flat = Object.assign({}, ...[].concat(getByTestId("close-button").props.style));
    expect(flat.minHeight).toBeGreaterThanOrEqual(44);
    expect(flat.minWidth).toBeGreaterThanOrEqual(44);
  });

  it("does not contain Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });

  it("renders custom totalMinutes", () => {
    const { UNSAFE_root } = renderScreen({ totalMinutes: 99 });
    expect(findText(UNSAFE_root, "stat-total-value")).toBe("99");
  });
});
