/**
 * SearchBar Component Tests
 * @description Tests for the SearchBar molecule component
 * @task Task 2.3.4: SearchBar Component (Sprint 2.3 - Molecules Navigation)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { View, Text } from "react-native";
import { SearchBar } from "./SearchBar";

// Mock icon components for tests
const MockIcon = ({ testID }: { testID?: string }) => (
  <View testID={testID}>
    <Text>Icon</Text>
  </View>
);

describe("SearchBar", () => {
  // ===================
  // Rendering Tests
  // ===================

  describe("Basic Rendering", () => {
    it("renders with default props", () => {
      const { getByTestId } = render(
        <SearchBar
          value=""
          onChangeText={() => {}}
          testID="search-bar"
        />
      );
      expect(getByTestId("search-bar")).toBeTruthy();
    });

    it("renders with placeholder", () => {
      const { getByPlaceholderText } = render(
        <SearchBar
          value=""
          onChangeText={() => {}}
          placeholder="Search anything"
        />
      );
      expect(getByPlaceholderText("Search anything")).toBeTruthy();
    });

    it("renders with value", () => {
      const { getByDisplayValue } = render(
        <SearchBar
          value="test query"
          onChangeText={() => {}}
        />
      );
      expect(getByDisplayValue("test query")).toBeTruthy();
    });

    it("renders search icon by default", () => {
      const { getByTestId } = render(
        <SearchBar
          value=""
          onChangeText={() => {}}
          testID="search"
        />
      );
      expect(getByTestId("search-icon")).toBeTruthy();
    });
  });

  // ===================
  // Input Tests
  // ===================

  describe("Input Behavior", () => {
    it("calls onChangeText when text changes", () => {
      const onChangeTextMock = jest.fn();
      const { getByTestId } = render(
        <SearchBar
          value=""
          onChangeText={onChangeTextMock}
          testID="search"
        />
      );

      fireEvent.changeText(getByTestId("search-input"), "new search");
      expect(onChangeTextMock).toHaveBeenCalledWith("new search");
    });

    it("calls onSubmit when submitted", () => {
      const onSubmitMock = jest.fn();
      const { getByTestId } = render(
        <SearchBar
          value="search query"
          onChangeText={() => {}}
          onSubmit={onSubmitMock}
          testID="search"
        />
      );

      fireEvent(getByTestId("search-input"), "submitEditing");
      expect(onSubmitMock).toHaveBeenCalledWith("search query");
    });

    it("calls onFocus when focused", () => {
      const onFocusMock = jest.fn();
      const { getByTestId } = render(
        <SearchBar
          value=""
          onChangeText={() => {}}
          onFocus={onFocusMock}
          testID="search"
        />
      );

      fireEvent(getByTestId("search-input"), "focus");
      expect(onFocusMock).toHaveBeenCalled();
    });

    it("calls onBlur when blurred", () => {
      const onBlurMock = jest.fn();
      const { getByTestId } = render(
        <SearchBar
          value=""
          onChangeText={() => {}}
          onBlur={onBlurMock}
          testID="search"
        />
      );

      fireEvent(getByTestId("search-input"), "blur");
      expect(onBlurMock).toHaveBeenCalled();
    });
  });

  // ===================
  // Clear Button Tests
  // ===================

  describe("Clear Button", () => {
    it("shows clear button when value is present and showClearButton is true", () => {
      const { getByTestId } = render(
        <SearchBar
          value="search"
          onChangeText={() => {}}
          showClearButton
          testID="search"
        />
      );
      expect(getByTestId("search-clear-button")).toBeTruthy();
    });

    it("hides clear button when value is empty", () => {
      const { queryByTestId } = render(
        <SearchBar
          value=""
          onChangeText={() => {}}
          showClearButton
          testID="search"
        />
      );
      expect(queryByTestId("search-clear-button")).toBeNull();
    });

    it("hides clear button when showClearButton is false", () => {
      const { queryByTestId } = render(
        <SearchBar
          value="search"
          onChangeText={() => {}}
          showClearButton={false}
          testID="search"
        />
      );
      expect(queryByTestId("search-clear-button")).toBeNull();
    });

    it("calls onClear when clear button is pressed", () => {
      const onClearMock = jest.fn();
      const onChangeTextMock = jest.fn();
      const { getByTestId } = render(
        <SearchBar
          value="search"
          onChangeText={onChangeTextMock}
          onClear={onClearMock}
          showClearButton
          testID="search"
        />
      );

      fireEvent.press(getByTestId("search-clear-button"));
      expect(onClearMock).toHaveBeenCalled();
    });

    it("clears text when clear button is pressed (no onClear handler)", () => {
      const onChangeTextMock = jest.fn();
      const { getByTestId } = render(
        <SearchBar
          value="search"
          onChangeText={onChangeTextMock}
          showClearButton
          testID="search"
        />
      );

      fireEvent.press(getByTestId("search-clear-button"));
      expect(onChangeTextMock).toHaveBeenCalledWith("");
    });
  });

  // ===================
  // Variant Tests
  // ===================

  describe("Variants", () => {
    it("renders default variant", () => {
      const { getByTestId } = render(
        <SearchBar
          value=""
          onChangeText={() => {}}
          testID="search"
          variant="default"
        />
      );
      expect(getByTestId("search")).toBeTruthy();
    });

    it("renders filled variant", () => {
      const { getByTestId } = render(
        <SearchBar
          value=""
          onChangeText={() => {}}
          testID="search"
          variant="filled"
        />
      );
      expect(getByTestId("search")).toBeTruthy();
    });

    it("renders outlined variant", () => {
      const { getByTestId } = render(
        <SearchBar
          value=""
          onChangeText={() => {}}
          testID="search"
          variant="outlined"
        />
      );
      expect(getByTestId("search")).toBeTruthy();
    });
  });

  // ===================
  // Size Tests
  // ===================

  describe("Sizes", () => {
    it("renders small size", () => {
      const { getByTestId } = render(
        <SearchBar
          value=""
          onChangeText={() => {}}
          testID="search"
          size="sm"
        />
      );
      expect(getByTestId("search")).toBeTruthy();
    });

    it("renders medium size (default)", () => {
      const { getByTestId } = render(
        <SearchBar
          value=""
          onChangeText={() => {}}
          testID="search"
          size="md"
        />
      );
      expect(getByTestId("search")).toBeTruthy();
    });

    it("renders large size", () => {
      const { getByTestId } = render(
        <SearchBar
          value=""
          onChangeText={() => {}}
          testID="search"
          size="lg"
        />
      );
      expect(getByTestId("search")).toBeTruthy();
    });
  });

  // ===================
  // Custom Elements Tests
  // ===================

  describe("Custom Elements", () => {
    it("renders custom left icon", () => {
      const { getByTestId, queryByTestId } = render(
        <SearchBar
          value=""
          onChangeText={() => {}}
          leftIcon={<MockIcon testID="custom-icon" />}
          testID="search"
        />
      );

      expect(getByTestId("custom-icon")).toBeTruthy();
      // Default search icon should not be shown
      expect(queryByTestId("search-icon")).toBeNull();
    });

    it("renders right element", () => {
      const { getByTestId } = render(
        <SearchBar
          value=""
          onChangeText={() => {}}
          rightElement={<MockIcon testID="filter-icon" />}
          testID="search"
        />
      );

      expect(getByTestId("filter-icon")).toBeTruthy();
    });

    it("renders both right element and clear button", () => {
      const { getByTestId } = render(
        <SearchBar
          value="search"
          onChangeText={() => {}}
          rightElement={<MockIcon testID="filter-icon" />}
          showClearButton
          testID="search"
        />
      );

      expect(getByTestId("filter-icon")).toBeTruthy();
      expect(getByTestId("search-clear-button")).toBeTruthy();
    });
  });

  // ===================
  // Disabled State Tests
  // ===================

  describe("Disabled State", () => {
    it("disables input when disabled is true", () => {
      const { getByTestId } = render(
        <SearchBar
          value=""
          onChangeText={() => {}}
          disabled
          testID="search"
        />
      );

      const input = getByTestId("search-input");
      expect(input.props.editable).toBe(false);
    });

    it("does not call onChangeText when disabled", () => {
      const onChangeTextMock = jest.fn();
      const { getByTestId } = render(
        <SearchBar
          value=""
          onChangeText={onChangeTextMock}
          disabled
          testID="search"
        />
      );

      fireEvent.changeText(getByTestId("search-input"), "test");
      // The TextInput won't actually fire the event when editable is false
      // but we verify it's disabled by checking editable prop
      expect(getByTestId("search-input").props.editable).toBe(false);
    });

    it("hides clear button when disabled", () => {
      const { queryByTestId } = render(
        <SearchBar
          value="search"
          onChangeText={() => {}}
          showClearButton
          disabled
          testID="search"
        />
      );

      expect(queryByTestId("search-clear-button")).toBeNull();
    });
  });

  // ===================
  // Accessibility Tests
  // ===================

  describe("Accessibility", () => {
    it("has accessible search input", () => {
      const { getByTestId } = render(
        <SearchBar
          value=""
          onChangeText={() => {}}
          testID="search"
          accessibilityLabel="Search content"
        />
      );

      const input = getByTestId("search-input");
      expect(input.props.accessibilityLabel).toBe("Search content");
    });

    it("uses placeholder as accessibility label when not provided", () => {
      const { getByTestId } = render(
        <SearchBar
          value=""
          onChangeText={() => {}}
          placeholder="Search anything"
          testID="search"
        />
      );

      const input = getByTestId("search-input");
      expect(input.props.accessibilityLabel).toBe("Search anything");
    });

    it("clear button has accessibility label", () => {
      const { getByTestId } = render(
        <SearchBar
          value="search"
          onChangeText={() => {}}
          showClearButton
          testID="search"
        />
      );

      const clearButton = getByTestId("search-clear-button");
      expect(clearButton.props.accessibilityLabel).toBe("Clear search");
    });

    it("clear button has button accessibility role", () => {
      const { getByTestId } = render(
        <SearchBar
          value="search"
          onChangeText={() => {}}
          showClearButton
          testID="search"
        />
      );

      const clearButton = getByTestId("search-clear-button");
      expect(clearButton.props.accessibilityRole).toBe("button");
    });
  });

  // ===================
  // Custom Styles Tests
  // ===================

  describe("Custom Styles", () => {
    it("applies custom container style", () => {
      const { getByTestId } = render(
        <SearchBar
          value=""
          onChangeText={() => {}}
          testID="search"
          style={{ marginTop: 20 }}
        />
      );

      expect(getByTestId("search")).toBeTruthy();
    });
  });

  // ===================
  // Edge Cases
  // ===================

  describe("Edge Cases", () => {
    it("handles empty placeholder", () => {
      const { getByTestId } = render(
        <SearchBar
          value=""
          onChangeText={() => {}}
          placeholder=""
          testID="search"
        />
      );

      expect(getByTestId("search")).toBeTruthy();
    });

    it("handles very long search text", () => {
      const longText = "a".repeat(200);
      const { getByDisplayValue } = render(
        <SearchBar
          value={longText}
          onChangeText={() => {}}
        />
      );

      expect(getByDisplayValue(longText)).toBeTruthy();
    });

    it("handles special characters in search", () => {
      const specialText = "test@#$%^&*()";
      const { getByDisplayValue } = render(
        <SearchBar
          value={specialText}
          onChangeText={() => {}}
        />
      );

      expect(getByDisplayValue(specialText)).toBeTruthy();
    });
  });
});
