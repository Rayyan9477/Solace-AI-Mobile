jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () => jest.requireActual("@/shared/theme/useTheme"));

import React from "react";
import { render } from "@testing-library/react-native";

import { WaveformBars } from "./WaveformBars";
import { ThemeProvider } from "@/shared/theme/useTheme";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("WaveformBars", () => {
  it("renders without crashing", () => {
    const { toJSON } = renderWithTheme(
      <WaveformBars width={320} height={64} />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it("renders a stable snapshot", () => {
    const { toJSON } = renderWithTheme(
      <WaveformBars width={320} height={64} count={8} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  describe("count prop", () => {
    it("renders the default count of 34 bars", () => {
      const { getAllByTestId } = renderWithTheme(
        <WaveformBars width={320} height={64} />,
      );
      const bars: ReturnType<typeof getAllByTestId> = [];
      for (let i = 0; i < 34; i++) {
        const found = getAllByTestId(`bar-${i}`, { includeHiddenElements: true });
        expect(found.length).toBeGreaterThanOrEqual(1);
        bars.push(...found);
      }
      expect(bars.length).toBe(34);
    });

    it("renders exactly count bars when count=5", () => {
      const { getAllByTestId, queryAllByTestId } = renderWithTheme(
        <WaveformBars width={320} height={64} count={5} />,
      );
      for (let i = 0; i < 5; i++) {
        expect(getAllByTestId(`bar-${i}`, { includeHiddenElements: true }).length).toBeGreaterThanOrEqual(1);
      }
      expect(queryAllByTestId("bar-5", { includeHiddenElements: true })).toHaveLength(0);
    });

    it("renders exactly count bars when count=10", () => {
      const { getAllByTestId, queryAllByTestId } = renderWithTheme(
        <WaveformBars width={320} height={64} count={10} />,
      );
      for (let i = 0; i < 10; i++) {
        expect(getAllByTestId(`bar-${i}`, { includeHiddenElements: true }).length).toBeGreaterThanOrEqual(1);
      }
      expect(queryAllByTestId("bar-10", { includeHiddenElements: true })).toHaveLength(0);
    });
  });

  describe("active prop", () => {
    it("renders in idle state when active=false", () => {
      const { toJSON } = renderWithTheme(
        <WaveformBars width={320} height={64} active={false} count={4} />,
      );
      expect(toJSON()).toBeTruthy();
    });
  });

  describe("accessibility", () => {
    it("is decorative by default (hidden from screen readers)", () => {
      const { getByTestId } = renderWithTheme(
        <WaveformBars testID="waveform" width={320} height={64} />,
      );
      const node = getByTestId("waveform", { includeHiddenElements: true });
      expect(node.props.accessibilityElementsHidden).toBe(true);
      expect(node.props.importantForAccessibility).toBe("no");
      expect(node.props.accessibilityRole).toBeUndefined();
    });

    it("is announced as image when accessibilityLabel is provided", () => {
      const { getByLabelText } = renderWithTheme(
        <WaveformBars
          width={320}
          height={64}
          accessibilityLabel="Voice waveform"
        />,
      );
      const node = getByLabelText("Voice waveform");
      expect(node.props.accessibilityRole).toBe("image");
    });

    it("uses default label when none provided and role image is omitted", () => {
      const { getByTestId } = renderWithTheme(
        <WaveformBars testID="waveform" width={320} height={64} />,
      );
      const node = getByTestId("waveform", { includeHiddenElements: true });
      expect(node.props.accessibilityRole).toBeUndefined();
    });
  });
});
