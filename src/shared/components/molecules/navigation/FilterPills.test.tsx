/**
 * FilterPills Tests (prototype v4.2)
 */

jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () =>
  jest.requireActual("@/shared/theme/useTheme"),
);

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import { FilterPills } from "./FilterPills";
import type { FilterPill } from "./FilterPills";
import { ThemeProvider } from "@/shared/theme/useTheme";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const defaultPills: FilterPill[] = [
  { id: "all", label: "All", count: 12 },
  { id: "unread", label: "Unread", count: 3 },
  { id: "archived", label: "Archived" },
];

describe("FilterPills", () => {
  it("renders without crashing", () => {
    const { toJSON } = renderWithTheme(
      <FilterPills
        pills={defaultPills}
        activeId="all"
        onChange={() => {}}
        testID="filter-pills"
      />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it("matches snapshot", () => {
    const { toJSON } = renderWithTheme(
      <FilterPills pills={defaultPills} activeId="all" onChange={() => {}} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it("renders all pill labels", () => {
    const { getByText } = renderWithTheme(
      <FilterPills pills={defaultPills} activeId="all" onChange={() => {}} />,
    );
    expect(getByText(/All/)).toBeTruthy();
    expect(getByText(/Unread/)).toBeTruthy();
    expect(getByText(/Archived/)).toBeTruthy();
  });

  it("calls onChange when a pill is pressed", () => {
    const onChange = jest.fn();
    const { getByText } = renderWithTheme(
      <FilterPills pills={defaultPills} activeId="all" onChange={onChange} />,
    );
    fireEvent.press(getByText(/Unread/));
    expect(onChange).toHaveBeenCalledWith("unread");
  });

  it("calls onChange with correct id for third pill", () => {
    const onChange = jest.fn();
    const { getByText } = renderWithTheme(
      <FilterPills pills={defaultPills} activeId="all" onChange={onChange} />,
    );
    fireEvent.press(getByText(/Archived/));
    expect(onChange).toHaveBeenCalledWith("archived");
  });

  it("renders with underline variant", () => {
    const { toJSON } = renderWithTheme(
      <FilterPills
        pills={defaultPills}
        activeId="unread"
        onChange={() => {}}
        variant="underline"
      />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it("renders with pill variant explicitly", () => {
    const { toJSON } = renderWithTheme(
      <FilterPills
        pills={defaultPills}
        activeId="all"
        onChange={() => {}}
        variant="pill"
      />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it("renders count when provided", () => {
    const { getAllByText } = renderWithTheme(
      <FilterPills pills={defaultPills} activeId="all" onChange={() => {}} />,
    );
    // Count "(12)" appears inline in the label text
    const allMatches = getAllByText(/ \(12\)/);
    expect(allMatches.length).toBeGreaterThan(0);
  });

  it("does not render count when not provided", () => {
    const pillsNoCount: FilterPill[] = [
      { id: "a", label: "Alpha" },
      { id: "b", label: "Beta" },
    ];
    const { getByText } = renderWithTheme(
      <FilterPills pills={pillsNoCount} activeId="a" onChange={() => {}} />,
    );
    expect(getByText("Alpha")).toBeTruthy();
  });

  describe("accessibility", () => {
    it("each pill has accessibilityRole=tab", () => {
      const { getAllByRole } = renderWithTheme(
        <FilterPills pills={defaultPills} activeId="all" onChange={() => {}} />,
      );
      const tabs = getAllByRole("tab");
      expect(tabs.length).toBe(defaultPills.length);
    });

    it("active pill has accessibilityState selected=true", () => {
      const { getAllByRole } = renderWithTheme(
        <FilterPills pills={defaultPills} activeId="unread" onChange={() => {}} />,
      );
      const tabs = getAllByRole("tab");
      const unreadTab = tabs.find(
        (t) => t.props.accessibilityLabel?.includes("Unread"),
      );
      expect(unreadTab?.props.accessibilityState?.selected).toBe(true);
    });

    it("inactive pill has accessibilityState selected=false", () => {
      const { getAllByRole } = renderWithTheme(
        <FilterPills pills={defaultPills} activeId="unread" onChange={() => {}} />,
      );
      const tabs = getAllByRole("tab");
      const allTab = tabs.find(
        (t) => t.props.accessibilityLabel?.includes("All"),
      );
      expect(allTab?.props.accessibilityState?.selected).toBe(false);
    });
  });
});
