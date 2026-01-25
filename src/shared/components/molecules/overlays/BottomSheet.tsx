/**
 * BottomSheet Component
 * @description Reusable bottom sheet overlay with drag handle and content
 * @task Task 2.5.2: BottomSheet Component (Sprint 2.5 - Molecules Overlay)
 *
 * Features:
 * - Drag handle indicator
 * - Title header with optional right element
 * - Customizable height
 * - Backdrop press dismiss
 * - Full accessibility support
 */

import React from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  type ViewStyle,
} from "react-native";
import type { BottomSheetProps } from "./BottomSheet.types";

/**
 * Color tokens (dark mode first)
 */
const colors = {
  // Backdrop
  backdrop: "rgba(0, 0, 0, 0.6)",

  // Sheet
  background: "#2A2220",
  border: "#3D3533",

  // Drag handle
  dragHandle: "#6B7280",

  // Text
  title: "#F1F5F9",
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
  // Handle backdrop press
  const handleBackdropPress = () => {
    if (dismissOnBackdropPress) {
      onDismiss();
    }
  };

  // Determine accessibility label
  const sheetAccessibilityLabel = accessibilityLabel || title || "Bottom sheet";

  // Compute sheet height style
  const sheetHeightStyle: ViewStyle = {
    height: height as ViewStyle["height"],
  };

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}
      testID={testID}
    >
      <View style={styles.overlay}>
        {/* Backdrop */}
        <Pressable
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
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.backdrop,
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 24,
  },
  dragHandleContainer: {
    alignItems: "center",
    paddingVertical: 12,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.dragHandle,
    borderRadius: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.title,
    flex: 1,
    marginRight: 8,
  },
  titleSpacer: {
    flex: 1,
  },
  headerRight: {
    marginLeft: 8,
  },
  content: {
    paddingHorizontal: 20,
    flex: 1,
  },
});

export default BottomSheet;
