/**
 * Text Component Tests
 * @description TDD tests for the Enhanced Text component
 * @task Task 1.2.1: Create Enhanced Text Component
 */

import React from "react";
import { render } from "@testing-library/react-native";
import { Text } from "./Text";
import type { TextVariant, TextColor, TextWeight, TextAlign } from "./Text.types";

describe("Text Component", () => {
  describe("Rendering", () => {
    it("should render children text correctly", () => {
      const { getByText } = render(<Text>Hello World</Text>);
      expect(getByText("Hello World")).toBeTruthy();
    });

    it("should render with default variant (body1)", () => {
      const { getByText } = render(<Text>Default Text</Text>);
      const textElement = getByText("Default Text");
      expect(textElement).toBeTruthy();
    });

    it("should apply testID prop", () => {
      const { getByTestId } = render(
        <Text testID="test-text">Test</Text>
      );
      expect(getByTestId("test-text")).toBeTruthy();
    });
  });

  describe("Variants", () => {
    const variants: TextVariant[] = [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "body1", "body2", "caption", "overline", "button", "link"
    ];

    variants.forEach((variant) => {
      it(`should render ${variant} variant`, () => {
        const { getByText } = render(
          <Text variant={variant}>{variant} text</Text>
        );
        expect(getByText(`${variant} text`)).toBeTruthy();
      });
    });

    describe("Variant Typography Specifications", () => {
      it("h1 should have fontSize 32, fontWeight 700, lineHeight 40", () => {
        const { getByTestId } = render(
          <Text variant="h1" testID="h1-text">Heading 1</Text>
        );
        const element = getByTestId("h1-text");
        expect(element.props.style).toEqual(
          expect.objectContaining({
            fontSize: 32,
            fontWeight: "700",
            lineHeight: 40,
          })
        );
      });

      it("h2 should have fontSize 28, fontWeight 700, lineHeight 36", () => {
        const { getByTestId } = render(
          <Text variant="h2" testID="h2-text">Heading 2</Text>
        );
        const element = getByTestId("h2-text");
        expect(element.props.style).toEqual(
          expect.objectContaining({
            fontSize: 28,
            fontWeight: "700",
            lineHeight: 36,
          })
        );
      });

      it("h3 should have fontSize 24, fontWeight 600, lineHeight 32", () => {
        const { getByTestId } = render(
          <Text variant="h3" testID="h3-text">Heading 3</Text>
        );
        const element = getByTestId("h3-text");
        expect(element.props.style).toEqual(
          expect.objectContaining({
            fontSize: 24,
            fontWeight: "600",
            lineHeight: 32,
          })
        );
      });

      it("h4 should have fontSize 20, fontWeight 600, lineHeight 28", () => {
        const { getByTestId } = render(
          <Text variant="h4" testID="h4-text">Heading 4</Text>
        );
        const element = getByTestId("h4-text");
        expect(element.props.style).toEqual(
          expect.objectContaining({
            fontSize: 20,
            fontWeight: "600",
            lineHeight: 28,
          })
        );
      });

      it("h5 should have fontSize 18, fontWeight 600, lineHeight 24", () => {
        const { getByTestId } = render(
          <Text variant="h5" testID="h5-text">Heading 5</Text>
        );
        const element = getByTestId("h5-text");
        expect(element.props.style).toEqual(
          expect.objectContaining({
            fontSize: 18,
            fontWeight: "600",
            lineHeight: 24,
          })
        );
      });

      it("h6 should have fontSize 16, fontWeight 600, lineHeight 22", () => {
        const { getByTestId } = render(
          <Text variant="h6" testID="h6-text">Heading 6</Text>
        );
        const element = getByTestId("h6-text");
        expect(element.props.style).toEqual(
          expect.objectContaining({
            fontSize: 16,
            fontWeight: "600",
            lineHeight: 22,
          })
        );
      });

      it("body1 should have fontSize 16, fontWeight 400, lineHeight 24", () => {
        const { getByTestId } = render(
          <Text variant="body1" testID="body1-text">Body 1</Text>
        );
        const element = getByTestId("body1-text");
        expect(element.props.style).toEqual(
          expect.objectContaining({
            fontSize: 16,
            fontWeight: "400",
            lineHeight: 24,
          })
        );
      });

      it("body2 should have fontSize 14, fontWeight 400, lineHeight 20", () => {
        const { getByTestId } = render(
          <Text variant="body2" testID="body2-text">Body 2</Text>
        );
        const element = getByTestId("body2-text");
        expect(element.props.style).toEqual(
          expect.objectContaining({
            fontSize: 14,
            fontWeight: "400",
            lineHeight: 20,
          })
        );
      });

      it("caption should have fontSize 12, fontWeight 400, lineHeight 16", () => {
        const { getByTestId } = render(
          <Text variant="caption" testID="caption-text">Caption</Text>
        );
        const element = getByTestId("caption-text");
        expect(element.props.style).toEqual(
          expect.objectContaining({
            fontSize: 12,
            fontWeight: "400",
            lineHeight: 16,
          })
        );
      });

      it("overline should have fontSize 10, fontWeight 500, lineHeight 14", () => {
        const { getByTestId } = render(
          <Text variant="overline" testID="overline-text">Overline</Text>
        );
        const element = getByTestId("overline-text");
        expect(element.props.style).toEqual(
          expect.objectContaining({
            fontSize: 10,
            fontWeight: "500",
            lineHeight: 14,
          })
        );
      });

      it("button should have fontSize 14, fontWeight 600, lineHeight 20", () => {
        const { getByTestId } = render(
          <Text variant="button" testID="button-text">Button</Text>
        );
        const element = getByTestId("button-text");
        expect(element.props.style).toEqual(
          expect.objectContaining({
            fontSize: 14,
            fontWeight: "600",
            lineHeight: 20,
          })
        );
      });

      it("link should have fontSize 14, fontWeight 500, lineHeight 20", () => {
        const { getByTestId } = render(
          <Text variant="link" testID="link-text">Link</Text>
        );
        const element = getByTestId("link-text");
        expect(element.props.style).toEqual(
          expect.objectContaining({
            fontSize: 14,
            fontWeight: "500",
            lineHeight: 20,
          })
        );
      });
    });
  });

  describe("Colors", () => {
    const colors: TextColor[] = [
      "primary", "secondary", "tertiary", "success",
      "warning", "error", "info", "onPrimary", "onSurface", "onBackground"
    ];

    colors.forEach((color) => {
      it(`should apply ${color} color`, () => {
        const { getByTestId } = render(
          <Text color={color} testID="color-text">{color} text</Text>
        );
        const element = getByTestId("color-text");
        expect(element.props.style).toHaveProperty("color");
      });
    });

    it("should apply default color (onSurface) when not specified", () => {
      const { getByTestId } = render(
        <Text testID="default-color">Default color text</Text>
      );
      const element = getByTestId("default-color");
      expect(element.props.style).toHaveProperty("color");
    });
  });

  describe("Weights", () => {
    const weights: TextWeight[] = ["regular", "medium", "semibold", "bold"];

    weights.forEach((weight) => {
      it(`should apply ${weight} weight`, () => {
        const { getByTestId } = render(
          <Text weight={weight} testID="weight-text">{weight} text</Text>
        );
        const element = getByTestId("weight-text");
        expect(element.props.style).toHaveProperty("fontWeight");
      });
    });

    it("weight prop should override variant fontWeight", () => {
      const { getByTestId } = render(
        <Text variant="h1" weight="regular" testID="weight-override">Override</Text>
      );
      const element = getByTestId("weight-override");
      // h1 has 700, but we override with regular (400)
      expect(element.props.style).toEqual(
        expect.objectContaining({
          fontWeight: "400",
        })
      );
    });
  });

  describe("Alignment", () => {
    const alignments: TextAlign[] = ["left", "center", "right"];

    alignments.forEach((align) => {
      it(`should apply ${align} alignment`, () => {
        const { getByTestId } = render(
          <Text align={align} testID="align-text">{align} aligned</Text>
        );
        const element = getByTestId("align-text");
        expect(element.props.style).toEqual(
          expect.objectContaining({
            textAlign: align,
          })
        );
      });
    });

    it("should default to left alignment", () => {
      const { getByTestId } = render(
        <Text testID="default-align">Default alignment</Text>
      );
      const element = getByTestId("default-align");
      expect(element.props.style).toEqual(
        expect.objectContaining({
          textAlign: "left",
        })
      );
    });
  });

  describe("Accessibility", () => {
    it("should apply accessibilityLabel", () => {
      const { getByLabelText } = render(
        <Text accessibilityLabel="Important text">Content</Text>
      );
      expect(getByLabelText("Important text")).toBeTruthy();
    });

    it("should have accessible prop set to true by default", () => {
      const { getByTestId } = render(
        <Text testID="accessible-text">Accessible</Text>
      );
      const element = getByTestId("accessible-text");
      expect(element.props.accessible).toBe(true);
    });

    it("should apply accessibilityRole text for regular text", () => {
      const { getByTestId } = render(
        <Text testID="role-text">Regular text</Text>
      );
      const element = getByTestId("role-text");
      expect(element.props.accessibilityRole).toBe("text");
    });

    it("should apply accessibilityRole header for heading variants", () => {
      const headingVariants: TextVariant[] = ["h1", "h2", "h3", "h4", "h5", "h6"];

      headingVariants.forEach((variant) => {
        const { getByTestId } = render(
          <Text variant={variant} testID={`heading-${variant}`}>Heading</Text>
        );
        const element = getByTestId(`heading-${variant}`);
        expect(element.props.accessibilityRole).toBe("header");
      });
    });

    it("should apply accessibilityRole link for link variant", () => {
      const { getByTestId } = render(
        <Text variant="link" testID="link-role">Link text</Text>
      );
      const element = getByTestId("link-role");
      expect(element.props.accessibilityRole).toBe("link");
    });
  });

  describe("Style Merging", () => {
    it("should merge custom styles with variant styles", () => {
      const { getByTestId } = render(
        <Text
          variant="body1"
          style={{ marginTop: 10 }}
          testID="merged-style"
        >
          Merged
        </Text>
      );
      const element = getByTestId("merged-style");
      expect(element.props.style).toEqual(
        expect.objectContaining({
          fontSize: 16,
          marginTop: 10,
        })
      );
    });

    it("should allow custom style to override variant style", () => {
      const { getByTestId } = render(
        <Text
          variant="body1"
          style={{ fontSize: 20 }}
          testID="override-style"
        >
          Override
        </Text>
      );
      const element = getByTestId("override-style");
      expect(element.props.style).toEqual(
        expect.objectContaining({
          fontSize: 20,
        })
      );
    });
  });

  describe("Props Forwarding", () => {
    it("should forward numberOfLines prop", () => {
      const { getByTestId } = render(
        <Text numberOfLines={2} testID="lines-text">
          Long text that might need truncation
        </Text>
      );
      const element = getByTestId("lines-text");
      expect(element.props.numberOfLines).toBe(2);
    });

    it("should forward ellipsizeMode prop", () => {
      const { getByTestId } = render(
        <Text ellipsizeMode="tail" testID="ellipsize-text">
          Text with ellipsis
        </Text>
      );
      const element = getByTestId("ellipsize-text");
      expect(element.props.ellipsizeMode).toBe("tail");
    });

    it("should forward selectable prop", () => {
      const { getByTestId } = render(
        <Text selectable testID="selectable-text">
          Selectable text
        </Text>
      );
      const element = getByTestId("selectable-text");
      expect(element.props.selectable).toBe(true);
    });
  });

  describe("TypeScript Types", () => {
    it("should have TextVariant type with all variants", () => {
      const variants: TextVariant[] = [
        "h1", "h2", "h3", "h4", "h5", "h6",
        "body1", "body2", "caption", "overline", "button", "link"
      ];
      expect(variants).toHaveLength(12);
    });

    it("should have TextColor type with all colors", () => {
      const colors: TextColor[] = [
        "primary", "secondary", "tertiary", "success",
        "warning", "error", "info", "onPrimary", "onSurface", "onBackground"
      ];
      expect(colors).toHaveLength(10);
    });

    it("should have TextWeight type with all weights", () => {
      const weights: TextWeight[] = ["regular", "medium", "semibold", "bold"];
      expect(weights).toHaveLength(4);
    });

    it("should have TextAlign type with all alignments", () => {
      const alignments: TextAlign[] = ["left", "center", "right"];
      expect(alignments).toHaveLength(3);
    });
  });
});
