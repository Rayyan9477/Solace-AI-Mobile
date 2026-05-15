/**
 * BottomSheet Component
 * @description Reusable bottom sheet overlay with drag handle and content
 * @task Task 2.5.2: BottomSheet Component (Sprint 2.5 - Molecules Overlay)
 * @phase Phase 3C: Refactored to use theme tokens
 *
 * Features:
 * - Drag handle indicator
 * - Title header with optional right element
 * - Customizable height
 * - Backdrop press dismiss
 * - Full accessibility support
 */

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  type ViewStyle,
} from "react-native";
import type { BottomSheetProps } from "./BottomSheet.types";
import { palette } from "../../../theme";

/**
 * Color tokens from theme
 */
const colors = {
  // Backdrop
  backdrop: `${palette.midnight[950]}${palette.alpha[60]}`,

  // Sheet
  background: palette.midnight[950],
  border: palette.midnight[800],

  // Drag handle
  dragHandle: palette.warm[500],

  // Text
  title: palette.warm[100],
};

/**
 * BottomSheet Component
 *
 * @example
 * ```tsx
 * // Basic bottom sheet
 * <BottomSheet
 *   visible={isOpen}
 *   onDismiss={() => setIsOpen(false)}
 *   title="Options"
 * >
 *   <Text>Sheet content</Text>
 * </BottomSheet>
 *
 * // With header right element
 * <BottomSheet
 *   visible={isOpen}
 *   onDismiss={() => setIsOpen(false)}
 *   title="Filter Freud Score"
 *   headerRight={<HelpButton />}
 *   height="60%"
 * >
 *   <FilterContent />
 * </BottomSheet>
 * ```
 */
export function BottomSheet({
  visible,
  onDismiss,
  children,
  title,
  showDragHandle = true,
  height = "50%",
  dismissOnBackdropPress = true,
  testID,
  accessibilityLabel,
  style,
  contentStyle,
  headerRight,
}: BottomSheetProps): React.ReactElement | null {
  // Determine accessibility label
  const sheetAccessibilityLabel = accessibilityLabel || title || "Bottom sheet";

  // Compute sheet height style
  const sheetHeightStyle: ViewStyle = {
    height: height as ViewStyle["height"],
  };

  // Keep the RN Modal mounted until its slide exit animation completes.
  const [internalVisible, setInternalVisible] = useState(visible);

  useEffect(() => {
    if (visible) {
      setInternalVisible(true);
    }
  }, [visible]);

  const handleDismiss = () => {
    if (!visible) {
      setInternalVisible(false);
    }
    onDismiss();
  };

  // Handle backdrop press
  const handleBackdropPress = () => {
    if (dismissOnBackdropPress) {
      handleDismiss();
    }
  };

  if (!internalVisible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleDismiss}
      onDismiss={() => {
        if (!visible) {
          setInternalVisible(false);
        }
      }}
      testID={testID}
    >
      <View style={styles.overlay}>
        {/* Backdrop */}
        <Pressable accessibilityRole="button"
          testID={testID ? `${testID}-backdrop` : "sheet-backdrop"}
          style={styles.backdrop}
          onPress={handleBackdropPress}
        />

        {/* Sheet Container */}
        <View
          testID={testID ? `${testID}-container` : "sheet-container"}
          style={[styles.sheet, sheetHeightStyle, style]}
          accessible
          accessibilityLabel={sheetAccessibilityLabel}
          accessibilityViewIsModal
        >
          {/* Drag Handle */}
          {showDragHandle && (
            <View
              testID={testID ? `${testID}-drag-handle` : "sheet-drag-handle"}
              style={styles.dragHandleContainer}
            >
              <View style={styles.dragHandle} />
            </View>
          )}

          {/* Header */}
          {(title || headerRight) && (
            <View style={styles.header}>
              {title ? (
                <Text style={styles.title} numberOfLines={2}>
                  {title}
                </Text>
              ) : (
                <View style={styles.titleSpacer} />
              )}
              {headerRight && (
                <View style={styles.headerRight}>{headerRight}</View>
              )}
            </View>
          )}

          {/* Content */}
          {children && (
            <View style={[styles.content, contentStyle]}>{children}</View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.backdrop,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dragHandle: {
    backgroundColor: colors.dragHandle,
    borderRadius: 2,
    height: 4,
    width: 40,
  },
  dragHandleContainer: {
    alignItems: "center",
    paddingVertical: 12,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 12,
    paddingHorizontal: 20,
  },
  headerRight: {
    marginLeft: 8,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 24,
  },
  title: {
    color: colors.title,
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    marginRight: 8,
  },
  titleSpacer: {
    flex: 1,
  },
});

export default BottomSheet;
