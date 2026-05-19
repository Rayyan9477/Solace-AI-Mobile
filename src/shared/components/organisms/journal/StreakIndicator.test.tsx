import React from "react";
import { render } from "@testing-library/react-native";
import { StreakIndicator } from "./StreakIndicator";
import type { StreakIndicatorSize } from "./StreakIndicator";

describe("StreakIndicator", () => {
  it("renders without crashing", () => {
    const { getByTestId } = render(
      <StreakIndicator count={7} testID="streak" />
    );
    expect(getByTestId("streak")).toBeTruthy();
  });

  it("renders snapshot — md size", () => {
    const tree = render(
      <StreakIndicator count={7} size="md" testID="streak" />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders snapshot — sm size", () => {
    const tree = render(
      <StreakIndicator count={23} size="sm" testID="streak" />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("displays the streak count", () => {
    const { getByText } = render(<StreakIndicator count={7} />);
    expect(getByText("7")).toBeTruthy();
  });

  it("displays count 0", () => {
    const { getByText } = render(<StreakIndicator count={0} />);
    expect(getByText("0")).toBeTruthy();
  });

  it("displays large streak count", () => {
    const { getByText } = render(<StreakIndicator count={365} />);
    expect(getByText("365")).toBeTruthy();
  });

  it.each<StreakIndicatorSize>(["sm", "md"])(
    "renders correctly for size: %s",
    (size) => {
      const { getByTestId } = render(
        <StreakIndicator count={7} size={size} testID={`streak-${size}`} />
      );
      expect(getByTestId(`streak-${size}`)).toBeTruthy();
    }
  );

  it("has accessibilityRole text", () => {
    const { getByTestId } = render(
      <StreakIndicator count={7} testID="streak" />
    );
    expect(getByTestId("streak").props.accessibilityRole).toBe("text");
  });

  it("has accessibilityLabel with count and day streak", () => {
    const { getByTestId } = render(
      <StreakIndicator count={7} testID="streak" />
    );
    expect(getByTestId("streak").props.accessibilityLabel).toBe("7 day streak");
  });

  it("accessibilityLabel uses correct count for different values", () => {
    const { getByTestId } = render(
      <StreakIndicator count={30} testID="streak" />
    );
    expect(getByTestId("streak").props.accessibilityLabel).toBe("30 day streak");
  });

  it("applies custom style", () => {
    const { getByTestId } = render(
      <StreakIndicator count={7} testID="streak" style={{ marginTop: 8 }} />
    );
    const el = getByTestId("streak");
    expect(el.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ marginTop: 8 })])
    );
  });

  it("has border styling applied", () => {
    const { getByTestId } = render(
      <StreakIndicator count={7} testID="streak" />
    );
    const el = getByTestId("streak");
    // The style array should contain borderWidth: 1
    const flatStyle = el.props.style?.flat ? el.props.style.flat() : [el.props.style].flat();
    const hasBorder = flatStyle.some(
      (s: Record<string, unknown>) => s && s.borderWidth === 1
    );
    expect(hasBorder).toBe(true);
  });
});
