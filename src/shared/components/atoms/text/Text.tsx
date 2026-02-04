/**
 * Enhanced Text Component
 * @description Typography component with semantic variants and accessibility
 * @task Task 1.2.1: Create Enhanced Text Component
 * @phase Phase 3C: Refactored to use theme tokens
 *
 * Provides consistent typography across the application with:
 * - 12 semantic variants (h1-h6, body1-2, caption, overline, button, link)
 * - 10 semantic color tokens
 * - 4 font weights
 * - 3 text alignments
 * - Full accessibility support
 */

import React, { useMemo } from "react";
import { Text as RNText, StyleSheet, type TextStyle } from "react-native";
import type {
  TextProps,
  TextVariant,
  TextColor,
  TextWeight,
  VariantStyle,
} from "./Text.types";
import { palette } from "../../../theme";

/**
 * Variant typography specifications
 * Based on 4px grid system for consistent spacing
 */
const variantStyles: Record<TextVariant, VariantStyle> = {
  h1: { fontSize: 32, fontWeight: "700", lineHeight: 40 },
  h2: { fontSize: 28, fontWeight: "700", lineHeight: 36 },
  h3: { fontSize: 24, fontWeight: "600", lineHeight: 32 },
  h4: { fontSize: 20, fontWeight: "600", lineHeight: 28 },
  h5: { fontSize: 18, fontWeight: "600", lineHeight: 24 },
  h6: { fontSize: 16, fontWeight: "600", lineHeight: 22 },
  body1: { fontSize: 16, fontWeight: "400", lineHeight: 24 },
  body2: { fontSize: 14, fontWeight: "400", lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: "400", lineHeight: 16 },
  overline: { fontSize: 10, fontWeight: "500", lineHeight: 14 },
  button: { fontSize: 14, fontWeight: "600", lineHeight: 20 },
  link: { fontSize: 14, fontWeight: "500", lineHeight: 20 },
};

/**
 * Weight to fontWeight mapping
 */
const weightMap: Record<TextWeight, TextStyle["fontWeight"]> = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
};

/**
 * Semantic color tokens from theme
 */
const colorTokens: Record<TextColor, string> = {
  primary: palette.indigo[400],
  secondary: palette.indigo[300],
  tertiary: palette.gray[400],
  success: palette.green[400],
  warning: palette.amber[400],
  error: palette.red[400],
  info: palette.blue[400],
  onPrimary: palette.white,
  onSurface: palette.gray[100],
  onBackground: palette.gray[200],
};

/**
 * Heading variants for accessibility role
 */
const headingVariants: TextVariant[] = ["h1", "h2", "h3", "h4", "h5", "h6"];

/**
 * Get accessibility role based on variant
 */
function getAccessibilityRole(
  variant: TextVariant
): "header" | "link" | "text" {
  if (headingVariants.includes(variant)) {
    return "header";
  }
  if (variant === "link") {
    return "link";
  }
  return "text";
}

/**
 * Enhanced Text Component
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Text>Hello World</Text>
 *
 * // With variant
 * <Text variant="h1">Heading 1</Text>
 *
 * // With color and weight
 * <Text variant="body1" color="primary" weight="bold">
 *   Bold primary text
 * </Text>
 *
 * // With alignment
 * <Text align="center">Centered text</Text>
 * ```
 */
export function Text({
  children,
  variant = "body1",
  color = "onSurface",
  weight,
  align = "left",
  testID,
  accessibilityLabel,
  style,
  ...props
}: TextProps): React.ReactElement {
  // Memoize computed styles for performance
  const computedStyle = useMemo((): TextStyle => {
    const variantStyle = variantStyles[variant];

    const baseStyle: TextStyle = {
      fontSize: variantStyle.fontSize,
      fontWeight: weight ? weightMap[weight] : variantStyle.fontWeight,
      lineHeight: variantStyle.lineHeight,
      color: colorTokens[color],
      textAlign: align,
    };

    // Merge with custom style (custom style takes precedence)
    if (style) {
      return { ...baseStyle, ...style };
    }

    return baseStyle;
  }, [variant, color, weight, align, style]);

  const accessibilityRole = getAccessibilityRole(variant);

  return (
    <RNText
      testID={testID}
      accessible={true}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      style={computedStyle}
      {...props}
    >
      {children}
    </RNText>
  );
}

export default Text;
