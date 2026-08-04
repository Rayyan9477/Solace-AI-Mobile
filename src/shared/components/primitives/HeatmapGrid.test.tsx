jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () => jest.requireActual("@/shared/theme/useTheme"));

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import { HeatmapGrid, type HeatmapCell } from "./HeatmapGrid";
import { ThemeProvider } from "@/shared/theme/useTheme";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

/** Generate a 5×7 (35 cells) array for April 2026. */
function makeAprilCells(): HeatmapCell[] {
  const cells: HeatmapCell[] = [];
  for (let i = 1; i <= 35; i++) {
    const day = i <= 30 ? i : null;
    const date = day ? `2026-04-${String(day).padStart(2, "0")}` : `2026-04-${i}`;
    const moodLevel = day
      ? ((day % 5) as 0 | 1 | 2 | 3 | 4)
      : null;
    cells.push({
      date,
      moodLevel,
      isToday: day === 5,
    });
  }
  return cells;
}

const APRIL_CELLS = makeAprilCells();

describe("HeatmapGrid", () => {
  it("renders without crashing", () => {
    const { getByTestId } = renderWithTheme(
      <HeatmapGrid
        testID="heatmap"
        cells={APRIL_CELLS}
        weeks={5}
        accessibilityLabel="April 2026 mood calendar"
      />,
    );
    expect(getByTestId("heatmap")).toBeTruthy();
  });

  it("has accessibilityRole='img'", () => {
    const { getByTestId } = renderWithTheme(
      <HeatmapGrid
        testID="heatmap"
        cells={APRIL_CELLS}
        weeks={5}
        accessibilityLabel="April mood calendar"
      />,
    );
    expect(getByTestId("heatmap").props.accessibilityRole).toBe("image");
  });

  it("exposes the required accessibilityLabel on the container", () => {
    const label = "April 2026 mood calendar heatmap";
    const { getByLabelText } = renderWithTheme(
      <HeatmapGrid
        cells={APRIL_CELLS}
        weeks={5}
        accessibilityLabel={label}
      />,
    );
    expect(getByLabelText(label)).toBeTruthy();
  });

  it("renders cells as buttons when onCellPress is provided", () => {
    const onPress = jest.fn();
    const { getAllByRole } = renderWithTheme(
      <HeatmapGrid
        cells={APRIL_CELLS}
        weeks={5}
        accessibilityLabel="April calendar"
        onCellPress={onPress}
      />,
    );
    const buttons = getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("calls onCellPress with the correct cell when a cell is pressed", () => {
    const onPress = jest.fn();
    const { getAllByRole } = renderWithTheme(
      <HeatmapGrid
        cells={APRIL_CELLS}
        weeks={5}
        accessibilityLabel="April calendar"
        onCellPress={onPress}
      />,
    );
    const buttons = getAllByRole("button");
    fireEvent.press(buttons[0]);
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onPress).toHaveBeenCalledWith(APRIL_CELLS[0]);
  });

  it("does not render button roles when onCellPress is not provided", () => {
    const { queryAllByRole } = renderWithTheme(
      <HeatmapGrid
        cells={APRIL_CELLS}
        weeks={5}
        accessibilityLabel="April calendar static"
      />,
    );
    expect(queryAllByRole("button")).toHaveLength(0);
  });

  it("renders with all 5 mood levels in cells", () => {
    const cells: HeatmapCell[] = [0, 1, 2, 3, 4].map((level, i) => ({
      date: `2026-04-0${i + 1}`,
      moodLevel: level as 0 | 1 | 2 | 3 | 4,
    }));
    // Pad to 7 cols
    while (cells.length < 7) {
      cells.push({ date: `2026-04-${cells.length + 1}`, moodLevel: null });
    }
    const { getByTestId } = renderWithTheme(
      <HeatmapGrid
        testID="heatmap"
        cells={cells}
        weeks={1}
        accessibilityLabel="All mood levels heatmap"
      />,
    );
    expect(getByTestId("heatmap")).toBeTruthy();
  });

  it("renders with null (empty) cells", () => {
    const emptyCells: HeatmapCell[] = Array.from({ length: 35 }, (_, i) => ({
      date: `2026-04-${String(i + 1).padStart(2, "0")}`,
      moodLevel: null,
    }));
    const { getByTestId } = renderWithTheme(
      <HeatmapGrid
        testID="heatmap"
        cells={emptyCells}
        weeks={5}
        accessibilityLabel="Empty month"
      />,
    );
    expect(getByTestId("heatmap")).toBeTruthy();
  });

  it("applies a custom cellSize", () => {
    const { getByTestId } = renderWithTheme(
      <HeatmapGrid
        testID="heatmap"
        cells={APRIL_CELLS}
        weeks={5}
        cellSize={40}
        accessibilityLabel="Large cells"
      />,
    );
    expect(getByTestId("heatmap")).toBeTruthy();
  });

  it("renders a stable snapshot", () => {
    // Small grid for a concise snapshot
    const shortCells: HeatmapCell[] = [
      { date: "2026-04-01", moodLevel: 3 },
      { date: "2026-04-02", moodLevel: 1 },
      { date: "2026-04-03", moodLevel: 4 },
      { date: "2026-04-04", moodLevel: null },
      { date: "2026-04-05", moodLevel: 2, isToday: true },
      { date: "2026-04-06", moodLevel: 0 },
      { date: "2026-04-07", moodLevel: 3 },
    ];
    const { toJSON } = renderWithTheme(
      <HeatmapGrid
        cells={shortCells}
        weeks={1}
        accessibilityLabel="Snapshot heatmap"
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
