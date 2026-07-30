jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () => jest.requireActual("@/shared/theme/useTheme"));

import React from "react";
import { render } from "@testing-library/react-native";

import { SkeletonShimmer } from "./SkeletonShimmer";
import { ThemeProvider } from "@/shared/theme/useTheme";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("SkeletonShimmer", () => {
  it("renders without crashing", () => {
    const { toJSON } = renderWithTheme(
      <SkeletonShimmer width={240} height={18} />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it("renders a stable snapshot", () => {
    const { toJSON } = renderWithTheme(
      <SkeletonShimmer width={240} height={18} borderRadius={4} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  describe("dimensions", () => {
    it("applies numeric width and height", () => {
      const { getByTestId } = renderWithTheme(
        <SkeletonShimmer testID="skeleton" width={200} height={24} />,
      );
      const node = getByTestId("skeleton");
      const style = Array.isArray(node.props.style)
        ? Object.assign({}, ...node.props.style.filter(Boolean))
        : node.props.style;
      expect(style.width).toBe(200);
      expect(style.height).toBe(24);
    });

    it("accepts width='100%'", () => {
      const { getByTestId } = renderWithTheme(
        <SkeletonShimmer testID="skeleton" width="100%" height={16} />,
      );
      const node = getByTestId("skeleton");
      const style = Array.isArray(node.props.style)
        ? Object.assign({}, ...node.props.style.filter(Boolean))
        : node.props.style;
      expect(style.width).toBe("100%");
    });

    it("defaults borderRadius to 8", () => {
      const { getByTestId } = renderWithTheme(
        <SkeletonShimmer testID="skeleton" width={100} height={20} />,
      );
      const node = getByTestId("skeleton");
      const style = Array.isArray(node.props.style)
        ? Object.assign({}, ...node.props.style.filter(Boolean))
        : node.props.style;
      expect(style.borderRadius).toBe(8);
    });

    it("applies custom borderRadius", () => {
      const { getByTestId } = renderWithTheme(
        <SkeletonShimmer testID="skeleton" width={100} height={20} borderRadius={16} />,
      );
      const node = getByTestId("skeleton");
      const style = Array.isArray(node.props.style)
        ? Object.assign({}, ...node.props.style.filter(Boolean))
        : node.props.style;
      expect(style.borderRadius).toBe(16);
    });
  });

  describe("accessibility", () => {
    it("uses progressbar role", () => {
      const { getByTestId } = renderWithTheme(
        <SkeletonShimmer testID="skeleton" width={100} height={20} />,
      );
      const node = getByTestId("skeleton");
      expect(node.props.accessibilityRole).toBe("progressbar");
    });

    it("has busy=true in accessibilityState", () => {
      const { getByTestId } = renderWithTheme(
        <SkeletonShimmer testID="skeleton" width={100} height={20} />,
      );
      const node = getByTestId("skeleton");
      expect(node.props.accessibilityState).toEqual({ busy: true });
    });

    it("defaults accessibilityLabel to 'Loading'", () => {
      const { getByLabelText } = renderWithTheme(
        <SkeletonShimmer width={100} height={20} />,
      );
      expect(getByLabelText("Loading")).toBeTruthy();
    });

    it("accepts a custom accessibilityLabel", () => {
      const { getByLabelText } = renderWithTheme(
        <SkeletonShimmer
          width={100}
          height={20}
          accessibilityLabel="Loading profile"
        />,
      );
      expect(getByLabelText("Loading profile")).toBeTruthy();
    });
  });
});
