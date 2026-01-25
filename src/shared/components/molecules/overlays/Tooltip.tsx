/**
 * Tooltip Component
 * @description Contextual help tooltip with arrow pointing to trigger
 * @task Task 2.5.4: Tooltip Component (Sprint 2.5 - Molecules Overlay)
 *
 * Features:
 * - Arrow indicator pointing to trigger
 * - Multiple placement options (top, bottom, left, right)
 * - Dismissible on press
 * - Configurable max width
 * - Full accessibility support
 */

import React, { useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  type ViewStyle,
} from "react-native";
import type { TooltipProps, TooltipPlacement } from "./Tooltip.types";

/**
 * Color tokens (dark mode first)
 */
const colors = {
  background: "#374151",
  text: "#F9FAFB",
  overlay: "transparent",
};

/**
 * Arrow size configuration
 */
const ARROW_SIZE = 8;

/**
 * Get arrow styles based on placement
 */
const getArrowStyle = (placement: TooltipPlacement): ViewStyle => {
  const baseArrow: ViewStyle = {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
  };

  switch (placement) {
    case "top":
      return {
        ...baseArrow,
        borderLeftWidth: ARROW_SIZE,
        borderRightWidth: ARROW_SIZE,
        borderTopWidth: ARROW_SIZE,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: colors.background,
        alignSelf: "center",
        marginTop: -1,
      };
    case "bottom":
      return {
        ...baseArrow,
        borderLeftWidth: ARROW_SIZE,
        borderRightWidth: ARROW_SIZE,
        borderBottomWidth: ARROW_SIZE,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: colors.background,
        alignSelf: "center",
        marginBottom: -1,
      };
    case "left":
      return {
        ...baseArrow,
        borderTopWidth: ARROW_SIZE,
        borderBottomWidth: ARROW_SIZE,
        borderLeftWidth: ARROW_SIZE,
        borderTopColor: "transparent",
        borderBottomColor: "transparent",
        borderLeftColor: colors.background,
        alignSelf: "center",
        marginLeft: -1,
      };
    case "right":
      return {
        ...baseArrow,
        borderTopWidth: ARROW_SIZE,
        borderBottomWidth: ARROW_SIZE,
        borderRightWidth: ARROW_SIZE,
        borderTopColor: "transparent",
        borderBottomColor: "transparent",
        borderRightColor: colors.background,
        alignSelf: "center",
        marginRight: -1,
      };
    default:
      return baseArrow;
  }
};

/**
 * Get container layout based on placement
 */
const getContainerLayout = (placement: TooltipPlacement): ViewStyle => {
  switch (placement) {
    case "top":
      return { flexDirection: "column" };
    case "bottom":
      return { flexDirection: "column-reverse" };
    case "left":
      return { flexDirection: "row" };
    case "right":
      return { flexDirection: "row-reverse" };
    default:
      return { flexDirection: "column" };
  }
};

/**
 * Tooltip Component
 *
 * @example
 * ```tsx
 * // Basic tooltip
 * <Tooltip
 *   visible={showTooltip}
 *   content="This explains the feature"
 *   onDismiss={() => setShowTooltip(false)}
 * >
 *   <HelpIcon onPress={() => setShowTooltip(true)} />
 * </Tooltip>
 *
 * // With placement
 * <Tooltip
 *   visible={showTooltip}
 *   content="Tap to edit"
 *   placement="right"
 *   onDismiss={() => setShowTooltip(false)}
 * >
 *   <EditButton />
 * </Tooltip>
 * ```
 */
export function Tooltip({
  visible,
  content,
  placement = "top",
  onDismiss,
  children,
  maxWidth = 200,
  dismissOnPress = true,
  testID,
  accessibilityLabel,
  style,
  contentStyle,
}: TooltipProps): React.ReactElement {
  // Handle overlay press
  const handleOverlayPress = () => {
    if (dismissOnPress && onDismiss) {
      onDismiss();
    }
  };

  // Compute arrow styles
  const arrowStyle = useMemo(() => getArrowStyle(placement), [placement]);

  // Compute container layout
  const containerLayout = useMemo(
    () => getContainerLayout(placement),
    [placement]
  );

  // Determine accessibility label
  const tooltipAccessibilityLabel = accessibilityLabel || content;

  return (
    <View testID={testID} style={[styles.wrapper, style]}>
      {/* Trigger Children */}
      {children}

      {/* Tooltip Content */}
      {visible && (
        <>
          {/* Overlay for dismiss */}
          <Pressable
            testID={testID ? `${testID}-overlay` : "tooltip-overlay"}
            style={styles.overlay}
            onPress={handleOverlayPress}
          />

          {/* Tooltip Bubble */}
          <View style={[styles.tooltipContainer, containerLayout]}>
            {/* Content */}
            <View
              testID={testID ? `${testID}-content` : "tooltip-content"}
              style={[styles.content, { maxWidth }, contentStyle]}
              accessibilityRole="text"
              accessibilityLabel={tooltipAccessibilityLabel}
            >
              <Text style={styles.text}>{content}</Text>
            </View>

            {/* Arrow */}
            <View
              testID={testID ? `${testID}-arrow` : "tooltip-arrow"}
              style={arrowStyle}
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
    zIndex: 999,
  },
  tooltipContainer: {
    position: "absolute",
    zIndex: 1000,
    alignItems: "center",
    top: "100%",
    left: 0,
    marginTop: 4,
  },
  content: {
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  text: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.text,
    lineHeight: 18,
  },
});

export default Tooltip;
