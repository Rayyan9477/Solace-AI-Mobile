/**
 * SolaceNoticedCard Tests — Sprint 5 (prototype v4.2)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SolaceNoticedCard } from "./SolaceNoticedCard";

const defaultInsight =
  "You have journaled 5 days in a row — that consistency correlates with lower stress scores.";

describe("SolaceNoticedCard", () => {
  it("renders without crashing", () => {
    const { getByTestId } = render(
      <SolaceNoticedCard insight={defaultInsight} testID="ai-card" />,
    );
    expect(getByTestId("ai-card")).toBeTruthy();
  });

  it("matches snapshot", () => {
    const { toJSON } = render(
      <SolaceNoticedCard insight={defaultInsight} testID="ai-card" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it("renders the insight text", () => {
    const { getByText } = render(<SolaceNoticedCard insight={defaultInsight} />);
    expect(getByText(defaultInsight)).toBeTruthy();
  });

  it("renders the title 'Solace noticed...'", () => {
    const { getByText } = render(<SolaceNoticedCard insight={defaultInsight} />);
    expect(getByText("Solace noticed...")).toBeTruthy();
  });

  it("renders the AI INSIGHT kicker", () => {
    const { getByText } = render(<SolaceNoticedCard insight={defaultInsight} />);
    expect(getByText("[ AI INSIGHT ]")).toBeTruthy();
  });

  it("does not render dismiss button when onDismiss is absent", () => {
    const { queryByTestId } = render(
      <SolaceNoticedCard insight={defaultInsight} testID="ai-card" />,
    );
    expect(queryByTestId("ai-card-dismiss")).toBeNull();
  });

  it("renders dismiss button when onDismiss is provided", () => {
    const mockDismiss = jest.fn();
    const { getByTestId } = render(
      <SolaceNoticedCard
        insight={defaultInsight}
        onDismiss={mockDismiss}
        testID="ai-card"
      />,
    );
    expect(getByTestId("ai-card-dismiss")).toBeTruthy();
  });

  it("calls onDismiss when dismiss button is pressed", () => {
    const mockDismiss = jest.fn();
    const { getByTestId } = render(
      <SolaceNoticedCard
        insight={defaultInsight}
        onDismiss={mockDismiss}
        testID="ai-card"
      />,
    );
    fireEvent.press(getByTestId("ai-card-dismiss"));
    expect(mockDismiss).toHaveBeenCalledTimes(1);
  });

  it("has correct accessibilityRole and label on inner view", () => {
    const { UNSAFE_getByProps } = render(
      <SolaceNoticedCard insight={defaultInsight} />,
    );
    const inner = UNSAFE_getByProps({ accessibilityRole: "text" });
    expect(inner.props.accessibilityLabel).toBe(`AI insight: ${defaultInsight}`);
  });

  it("dismiss button has correct accessibilityRole", () => {
    const { getByTestId } = render(
      <SolaceNoticedCard
        insight={defaultInsight}
        onDismiss={jest.fn()}
        testID="ai-card"
      />,
    );
    const dismiss = getByTestId("ai-card-dismiss");
    expect(dismiss.props.accessibilityRole).toBe("button");
  });
});
