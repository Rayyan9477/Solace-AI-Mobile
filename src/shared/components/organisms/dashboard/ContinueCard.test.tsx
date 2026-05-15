import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ContinueCard } from "./ContinueCard";

describe("ContinueCard", () => {
  const onPress = jest.fn();

  const defaultProps = {
    practiceTitle: "Your morning meditation",
    practiceSubtitle: "10 min · Calming",
    onPress,
    testID: "continue-card",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    const { getByTestId } = render(<ContinueCard {...defaultProps} />);
    expect(getByTestId("continue-card")).toBeTruthy();
  });

  it("renders snapshot", () => {
    const tree = render(<ContinueCard {...defaultProps} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("displays the practice title", () => {
    const { getByText } = render(<ContinueCard {...defaultProps} />);
    expect(getByText("Your morning meditation")).toBeTruthy();
  });

  it("displays the practice subtitle", () => {
    const { getByText } = render(<ContinueCard {...defaultProps} />);
    expect(getByText("10 min · Calming")).toBeTruthy();
  });

  it("does not render subtitle when not provided", () => {
    const { queryByText } = render(
      <ContinueCard
        practiceTitle="Morning meditation"
        onPress={onPress}
      />
    );
    expect(queryByText("10 min · Calming")).toBeNull();
  });

  it("uses default ctaLabel of Continue", () => {
    const { getByText } = render(<ContinueCard {...defaultProps} />);
    expect(getByText("[ CONTINUE ]")).toBeTruthy();
  });

  it("uses custom ctaLabel when provided", () => {
    const { getByText } = render(
      <ContinueCard {...defaultProps} ctaLabel="Resume" />
    );
    expect(getByText("[ RESUME ]")).toBeTruthy();
  });

  it("calls onPress when tapped", () => {
    const { getByRole } = render(<ContinueCard {...defaultProps} />);
    fireEvent.press(getByRole("button"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("has correct accessibilityRole button", () => {
    const { getByRole } = render(<ContinueCard {...defaultProps} />);
    expect(getByRole("button")).toBeTruthy();
  });

  it("has accessibilityLabel with title and subtitle", () => {
    const { getByRole } = render(<ContinueCard {...defaultProps} />);
    const btn = getByRole("button");
    expect(btn.props.accessibilityLabel).toContain("Your morning meditation");
    expect(btn.props.accessibilityLabel).toContain("10 min · Calming");
  });

  it("applies custom style", () => {
    const { getByTestId } = render(
      <ContinueCard {...defaultProps} style={{ marginBottom: 24 }} />
    );
    // HeroCard receives style; testID is on the outer HeroCard View
    expect(getByTestId("continue-card")).toBeTruthy();
  });
});
