/**
 * Modal Component
 * @description Reusable modal overlay with title, content, and actions
 * @task Task 2.5.1: Modal Component (Sprint 2.5 - Molecules Overlay)
 * @phase Phase 3C: Refactored to use theme tokens
 *
 * Features:
 * - Title header with optional close button
 * - Customizable content area
 * - Action buttons (primary/secondary)
 * - Backdrop press dismiss
 * - Size variants (sm, md, lg)
 * - Full accessibility support
 */

import React, { useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  Modal as RNModal,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import type { ModalProps, ModalSize } from "./Modal.types";
import { palette } from "../../../theme";

/**
 * Color tokens from theme
 */
const colors = {
  // Backdrop
  backdrop: `${palette.black}${palette.alpha[60]}`,

  // Modal
  background: palette.brown[900],
  border: palette.brown[800],

  // Text
  title: palette.gray[100],
  content: palette.gray[300],

  // Buttons
  primaryButton: palette.indigo[400],
  primaryButtonText: palette.white,
  secondaryButton: "transparent",
  secondaryButtonText: palette.indigo[400],
  disabledButton: palette.brown[800],
  disabledButtonText: palette.gray[500],

  // Close button
  closeButton: palette.gray[400],
};

/**
 * Size configurations
 */
const sizeConfig: Record<ModalSize, { width: string; padding: number }> = {
  sm: { width: "75%", padding: 16 },
  md: { width: "85%", padding: 20 },
  lg: { width: "95%", padding: 24 },
};

/**
 * Modal Component
 *
 * @example
 * ```tsx
 * // Basic modal
 * <Modal
 *   visible={isOpen}
 *   onDismiss={() => setIsOpen(false)}
 *   title="Confirm Action"
 * >
 *   <Text>Are you sure?</Text>
 * </Modal>
 *
 * // With actions
 * <Modal
 *   visible={isOpen}
 *   onDismiss={() => setIsOpen(false)}
 *   title="Delete Item"
 *   showCloseButton
 *   actions={[
 *     { label: "Cancel", onPress: handleCancel, variant: "secondary" },
 *     { label: "Delete", onPress: handleDelete, variant: "primary" },
 *   ]}
 * >
 *   <Text>This action cannot be undone.</Text>
 * </Modal>
 * ```
 */
export function Modal({
  visible,
  onDismiss,
  title,
  children,
  actions,
  showCloseButton = false,
  size = "md",
  dismissOnBackdropPress = true,
  isAlert = false,
  testID,
  accessibilityLabel,
  style,
  contentStyle,
}: ModalProps): React.ReactElement | null {
  const config = sizeConfig[size];

  // Compute container styles
  const containerStyle = useMemo((): ViewStyle => ({
    width: config.width as any,
    padding: config.padding,
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: "80%",
  }), [config]);

  // Handle backdrop press
  const handleBackdropPress = () => {
    if (dismissOnBackdropPress) {
      onDismiss();
    }
  };

  // Determine accessibility label
  const modalAccessibilityLabel = accessibilityLabel || title || "Modal";

  if (!visible) {
    return null;
  }

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
      testID={testID}
    >
      <View style={styles.overlay}>
        {/* Backdrop */}
        <Pressable
          testID={testID ? `${testID}-backdrop` : "modal-backdrop"}
          style={styles.backdrop}
          onPress={handleBackdropPress}
        />

        {/* Modal Container */}
        <View
          testID={testID ? `${testID}-container` : "modal-container"}
          style={[containerStyle, style]}
          accessible
          accessibilityLabel={modalAccessibilityLabel}
          accessibilityViewIsModal
          accessibilityState={{ expanded: true }}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <View style={styles.header}>
              {title ? (
                <Text style={styles.title} numberOfLines={2}>
                  {title}
                </Text>
              ) : (
                <View style={styles.titleSpacer} />
              )}
              {showCloseButton && (
                <Pressable
                  testID={testID ? `${testID}-close-button` : "modal-close-button"}
                  onPress={onDismiss}
                  accessibilityRole="button"
                  accessibilityLabel="Close modal"
                  style={({ pressed }) => [
                    styles.closeButton,
                    pressed && styles.closeButtonPressed,
                  ]}
                  hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </Pressable>
              )}
            </View>
          )}

          {/* Content */}
          {children && (
            <View style={[styles.content, contentStyle]}>{children}</View>
          )}

          {/* Actions */}
          {actions && actions.length > 0 && (
            <View
              testID={testID ? `${testID}-actions` : "modal-actions"}
              style={styles.actions}
            >
              {actions.map((action, index) => {
                const isPrimary = action.variant === "primary";
                const isDisabled = action.disabled;

                return (
                  <Pressable
                    key={`action-${index}`}
                    testID={testID ? `${testID}-action-${index}` : `modal-action-${index}`}
                    onPress={action.onPress}
                    disabled={isDisabled}
                    accessibilityRole="button"
                    accessibilityLabel={action.label}
                    accessibilityState={{ disabled: isDisabled }}
                    style={({ pressed }) => [
                      styles.actionButton,
                      isPrimary ? styles.primaryButton : styles.secondaryButton,
                      isDisabled && styles.disabledButton,
                      pressed && !isDisabled && styles.actionButtonPressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.actionButtonText,
                        isPrimary ? styles.primaryButtonText : styles.secondaryButtonText,
                        isDisabled && styles.disabledButtonText,
                      ]}
                    >
                      {action.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.backdrop,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
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
  closeButton: {
    padding: 4,
    borderRadius: 4,
  },
  closeButtonPressed: {
    opacity: 0.7,
  },
  closeButtonText: {
    fontSize: 18,
    color: colors.closeButton,
    fontWeight: "500",
  },
  content: {
    marginBottom: 16,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  actionButtonPressed: {
    opacity: 0.8,
  },
  primaryButton: {
    backgroundColor: colors.primaryButton,
  },
  secondaryButton: {
    backgroundColor: colors.secondaryButton,
    borderWidth: 1,
    borderColor: colors.primaryButton,
  },
  disabledButton: {
    backgroundColor: colors.disabledButton,
    borderColor: colors.disabledButton,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  primaryButtonText: {
    color: colors.primaryButtonText,
  },
  secondaryButtonText: {
    color: colors.secondaryButtonText,
  },
  disabledButtonText: {
    color: colors.disabledButtonText,
  },
});

export default Modal;
