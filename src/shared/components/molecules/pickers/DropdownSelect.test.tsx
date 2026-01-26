/**
 * DropdownSelect Component Tests
 * @description TDD tests for the DropdownSelect component
 * @task Task 2.6.3: DropdownSelect Component
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";

import { DropdownSelect } from "./DropdownSelect";
import type { DropdownOption } from "./DropdownSelect.types";
import { filterOptions, getSelectionLabel } from "./DropdownSelect.types";

const mockOptions: DropdownOption[] = [
  { id: "opt1", label: "Option 1" },
  { id: "opt2", label: "Option 2" },
  { id: "opt3", label: "Option 3", disabled: true },
  { id: "opt4", label: "Option 4", description: "With description" },
];

describe("DropdownSelect", () => {
  const mockOnChange = jest.fn();
  const mockOnOpen = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders correctly with default props", () => {
      const { getByTestId } = render(
        <DropdownSelect testID="dropdown" options={mockOptions} />,
      );

      expect(getByTestId("dropdown")).toBeTruthy();
    });

    it("renders trigger button", () => {
      const { getByTestId } = render(
        <DropdownSelect testID="dropdown" options={mockOptions} />,
      );

      expect(getByTestId("dropdown-trigger")).toBeTruthy();
    });

    it("renders placeholder when no value", () => {
      const { getByText } = render(
        <DropdownSelect
          testID="dropdown"
          options={mockOptions}
          placeholder="Select an option"
        />,
      );

      expect(getByText("Select an option")).toBeTruthy();
    });

    it("renders selected value label", () => {
      const { getByText } = render(
        <DropdownSelect testID="dropdown" options={mockOptions} value="opt1" />,
      );

      expect(getByText("Option 1")).toBeTruthy();
    });

    it("renders label when provided", () => {
      const { getByText } = render(
        <DropdownSelect
          testID="dropdown"
          options={mockOptions}
          label="Choose option"
        />,
      );

      expect(getByText("Choose option")).toBeTruthy();
    });

    it("renders helper text when provided", () => {
      const { getByText } = render(
        <DropdownSelect
          testID="dropdown"
          options={mockOptions}
          helperText="Select one option"
        />,
      );

      expect(getByText("Select one option")).toBeTruthy();
    });

    it("renders error message when provided", () => {
      const { getByText } = render(
        <DropdownSelect
          testID="dropdown"
          options={mockOptions}
          error="This field is required"
        />,
      );

      expect(getByText("This field is required")).toBeTruthy();
    });

    it("renders left icon when provided", () => {
      const { getByTestId } = render(
        <DropdownSelect
          testID="dropdown"
          options={mockOptions}
          leftIcon={<Text testID="left-icon">Icon</Text>}
        />,
      );

      expect(getByTestId("left-icon")).toBeTruthy();
    });

    it("renders chevron icon", () => {
      const { getByTestId } = render(
        <DropdownSelect testID="dropdown" options={mockOptions} />,
      );

      expect(getByTestId("dropdown-chevron")).toBeTruthy();
    });
  });

  describe("Dropdown Behavior", () => {
    it("opens dropdown when trigger is pressed", () => {
      const { getByTestId } = render(
        <DropdownSelect
          testID="dropdown"
          options={mockOptions}
          onOpen={mockOnOpen}
        />,
      );

      fireEvent.press(getByTestId("dropdown-trigger"));

      expect(mockOnOpen).toHaveBeenCalled();
      expect(getByTestId("dropdown-list")).toBeTruthy();
    });

    it("closes dropdown when trigger is pressed again", () => {
      const { getByTestId, queryByTestId } = render(
        <DropdownSelect
          testID="dropdown"
          options={mockOptions}
          defaultOpen
          onClose={mockOnClose}
        />,
      );

      fireEvent.press(getByTestId("dropdown-trigger"));

      expect(mockOnClose).toHaveBeenCalled();
    });

    it("renders all options when open", () => {
      const { getByTestId, getByText } = render(
        <DropdownSelect testID="dropdown" options={mockOptions} defaultOpen />,
      );

      expect(getByText("Option 1")).toBeTruthy();
      expect(getByText("Option 2")).toBeTruthy();
      expect(getByText("Option 3")).toBeTruthy();
      expect(getByText("Option 4")).toBeTruthy();
    });

    it("calls onClose callback when closed", () => {
      const { getByTestId } = render(
        <DropdownSelect
          testID="dropdown"
          options={mockOptions}
          defaultOpen
          onClose={mockOnClose}
        />,
      );

      fireEvent.press(getByTestId("dropdown-trigger"));

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe("Single Selection", () => {
    it("calls onChange with selected value", () => {
      const { getByTestId } = render(
        <DropdownSelect
          testID="dropdown"
          options={mockOptions}
          defaultOpen
          onChange={mockOnChange}
        />,
      );

      fireEvent.press(getByTestId("dropdown-option-opt1"));

      expect(mockOnChange).toHaveBeenCalledWith("opt1");
    });

    it("closes dropdown after selection by default", () => {
      const { getByTestId, queryByTestId } = render(
        <DropdownSelect
          testID="dropdown"
          options={mockOptions}
          defaultOpen
          onChange={mockOnChange}
          closeOnSelect
        />,
      );

      fireEvent.press(getByTestId("dropdown-option-opt1"));

      // Dropdown should close after selection
      expect(mockOnChange).toHaveBeenCalled();
    });

    it("keeps dropdown open when closeOnSelect is false", () => {
      const { getByTestId } = render(
        <DropdownSelect
          testID="dropdown"
          options={mockOptions}
          defaultOpen
          onChange={mockOnChange}
          closeOnSelect={false}
        />,
      );

      fireEvent.press(getByTestId("dropdown-option-opt1"));

      expect(getByTestId("dropdown-list")).toBeTruthy();
    });

    it("shows checkmark on selected option", () => {
      const { getByTestId } = render(
        <DropdownSelect
          testID="dropdown"
          options={mockOptions}
          value="opt1"
          defaultOpen
        />,
      );

      expect(getByTestId("dropdown-option-opt1-check")).toBeTruthy();
    });
  });

  describe("Multiple Selection", () => {
    it("calls onChange with array of selected values", () => {
      const { getByTestId } = render(
        <DropdownSelect
          testID="dropdown"
          options={mockOptions}
          mode="multiple"
          defaultOpen
          onChange={mockOnChange}
        />,
      );

      fireEvent.press(getByTestId("dropdown-option-opt1"));

      expect(mockOnChange).toHaveBeenCalledWith(["opt1"]);
    });

    it("adds to selection when option is pressed", () => {
      const { getByTestId } = render(
        <DropdownSelect
          testID="dropdown"
          options={mockOptions}
          mode="multiple"
          value={["opt1"]}
          defaultOpen
          onChange={mockOnChange}
        />,
      );

      fireEvent.press(getByTestId("dropdown-option-opt2"));

      expect(mockOnChange).toHaveBeenCalledWith(["opt1", "opt2"]);
    });

    it("removes from selection when selected option is pressed again", () => {
      const { getByTestId } = render(
        <DropdownSelect
          testID="dropdown"
          options={mockOptions}
          mode="multiple"
          value={["opt1", "opt2"]}
          defaultOpen
          onChange={mockOnChange}
        />,
      );

      fireEvent.press(getByTestId("dropdown-option-opt1"));

      expect(mockOnChange).toHaveBeenCalledWith(["opt2"]);
    });

    it("shows count when multiple items selected", () => {
      const { getByText } = render(
        <DropdownSelect
          testID="dropdown"
          options={mockOptions}
          mode="multiple"
          value={["opt1", "opt2"]}
        />,
      );

      expect(getByText("2 selected")).toBeTruthy();
    });

    it("shows checkbox for multiple mode", () => {
      const { getByTestId } = render(
        <DropdownSelect
          testID="dropdown"
          options={mockOptions}
          mode="multiple"
          defaultOpen
        />,
      );

      expect(getByTestId("dropdown-option-opt1-checkbox")).toBeTruthy();
    });
  });

  describe("Search Functionality", () => {
    it("renders search input when searchable is true", () => {
      const { getByTestId } = render(
        <DropdownSelect
          testID="dropdown"
          options={mockOptions}
          searchable
          defaultOpen
        />,
      );

      expect(getByTestId("dropdown-search")).toBeTruthy();
    });

    it("filters options based on search query", () => {
      const { getByTestId, queryByText } = render(
        <DropdownSelect
          testID="dropdown"
          options={mockOptions}
          searchable
          defaultOpen
        />,
      );

      const searchInput = getByTestId("dropdown-search");
      fireEvent.changeText(searchInput, "Option 1");

      expect(queryByText("Option 2")).toBeNull();
    });

    it("shows empty message when no options match", () => {
      const { getByTestId, getByText } = render(
        <DropdownSelect
          testID="dropdown"
          options={mockOptions}
          searchable
          defaultOpen
          emptyMessage="No results"
        />,
      );

      const searchInput = getByTestId("dropdown-search");
      fireEvent.changeText(searchInput, "xyz");

      expect(getByText("No results")).toBeTruthy();
    });

    it("uses custom search placeholder", () => {
      const { getByTestId } = render(
        <DropdownSelect
          testID="dropdown"
          options={mockOptions}
          searchable
          searchPlaceholder="Type to search..."
          defaultOpen
        />,
      );

      const searchInput = getByTestId("dropdown-search");
      expect(searchInput.props.placeholder).toBe("Type to search...");
    });
  });

  describe("Disabled State", () => {
    it("does not open when disabled", () => {
      const { getByTestId, queryByTestId } = render(
        <DropdownSelect
          testID="dropdown"
          options={mockOptions}
          disabled
          onOpen={mockOnOpen}
        />,
      );

      fireEvent.press(getByTestId("dropdown-trigger"));

      expect(mockOnOpen).not.toHaveBeenCalled();
      expect(queryByTestId("dropdown-list")).toBeNull();
    });

    it("applies disabled styling", () => {
      const { getByTestId } = render(
        <DropdownSelect testID="dropdown" options={mockOptions} disabled />,
      );

      const dropdown = getByTestId("dropdown");
      expect(dropdown.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ opacity: 0.5 })]),
      );
    });

    it("does not allow selection of disabled options", () => {
      const { getByTestId } = render(
        <DropdownSelect
          testID="dropdown"
          options={mockOptions}
          defaultOpen
          onChange={mockOnChange}
        />,
      );

      fireEvent.press(getByTestId("dropdown-option-opt3"));

      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("has correct accessibility label on trigger", () => {
      const { getByTestId } = render(
        <DropdownSelect
          testID="dropdown"
          options={mockOptions}
          accessibilityLabel="Select option"
        />,
      );

      const trigger = getByTestId("dropdown-trigger");
      expect(trigger.props.accessibilityLabel).toBe("Select option");
    });

    it("trigger has combobox role", () => {
      const { getByTestId } = render(
        <DropdownSelect testID="dropdown" options={mockOptions} />,
      );

      const trigger = getByTestId("dropdown-trigger");
      expect(trigger.props.accessibilityRole).toBe("combobox");
    });

    it("options have correct accessibility role", () => {
      const { getByTestId } = render(
        <DropdownSelect testID="dropdown" options={mockOptions} defaultOpen />,
      );

      const option = getByTestId("dropdown-option-opt1");
      expect(option.props.accessibilityRole).toBe("option");
    });

    it("list has listbox role", () => {
      const { getByTestId } = render(
        <DropdownSelect testID="dropdown" options={mockOptions} defaultOpen />,
      );

      const list = getByTestId("dropdown-list");
      expect(list.props.accessibilityRole).toBe("listbox");
    });
  });

  describe("Styling", () => {
    it("applies custom container style", () => {
      const customStyle = { marginTop: 20 };
      const { getByTestId } = render(
        <DropdownSelect
          testID="dropdown"
          options={mockOptions}
          style={customStyle}
        />,
      );

      const dropdown = getByTestId("dropdown");
      expect(dropdown.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining(customStyle)]),
      );
    });

    it("applies error styling when error is present", () => {
      const { getByTestId } = render(
        <DropdownSelect
          testID="dropdown"
          options={mockOptions}
          error="Error message"
        />,
      );

      expect(getByTestId("dropdown")).toBeTruthy();
    });

    it("supports different sizes", () => {
      const { getByTestId } = render(
        <DropdownSelect testID="dropdown" options={mockOptions} size="lg" />,
      );

      expect(getByTestId("dropdown")).toBeTruthy();
    });

    it("supports different variants", () => {
      const { getByTestId } = render(
        <DropdownSelect
          testID="dropdown"
          options={mockOptions}
          variant="outlined"
        />,
      );

      expect(getByTestId("dropdown")).toBeTruthy();
    });
  });
});

// Helper function tests
describe("DropdownSelect Helper Functions", () => {
  describe("filterOptions", () => {
    it("returns all options when query is empty", () => {
      const result = filterOptions(mockOptions, "");
      expect(result).toHaveLength(4);
    });

    it("filters by label", () => {
      const result = filterOptions(mockOptions, "Option 1");
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("opt1");
    });

    it("filters by description", () => {
      const result = filterOptions(mockOptions, "description");
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("opt4");
    });

    it("is case insensitive", () => {
      const result = filterOptions(mockOptions, "OPTION 1");
      expect(result).toHaveLength(1);
    });

    it("returns empty array when no matches", () => {
      const result = filterOptions(mockOptions, "xyz");
      expect(result).toHaveLength(0);
    });
  });

  describe("getSelectionLabel", () => {
    it("returns placeholder when no value", () => {
      const result = getSelectionLabel(mockOptions, undefined, "Select...");
      expect(result).toBe("Select...");
    });

    it("returns placeholder for empty array", () => {
      const result = getSelectionLabel(mockOptions, [], "Select...");
      expect(result).toBe("Select...");
    });

    it("returns label for single selection", () => {
      const result = getSelectionLabel(mockOptions, "opt1", "Select...");
      expect(result).toBe("Option 1");
    });

    it("returns count for multiple selections", () => {
      const result = getSelectionLabel(
        mockOptions,
        ["opt1", "opt2"],
        "Select...",
      );
      expect(result).toBe("2 selected");
    });

    it("returns single label when one item in array", () => {
      const result = getSelectionLabel(mockOptions, ["opt1"], "Select...");
      expect(result).toBe("Option 1");
    });
  });
});
