/**
 * Toast Component
 * @description Temporary notification message with auto-dismiss and actions
 * @task Task 2.5.3: Toast Component (Sprint 2.5 - Molecules Overlay)
 * @phase Phase 3C: Refactored to use theme tokens
 *
 * Features:
 * - Multiple variants (info, success, warning, error)
 * - Auto-dismiss with configurable duration
 * - Optional action button
 * - Close button option
 * - Top or bottom positioning
 * - Full accessibility support
 */

import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  type ViewStyle,
} from "react-native";
import type { ToastProps, ToastVariant } from "./Toast.types";
import { palette } from "../../../theme";

/**
 * Color tokens per variant from theme
 */
const variantColors: Record<
  ToastVariant,
  { background: string; border: string; text: string; icon: string }
> = {
  info: {
    background: palette.blue[900],
    border: palette.blue[500],
    text: palette.blue[200],
    icon: palette.blue[400],
  },
  success: {
    background: palette.green[900],
    border: palette.green[500],
    text: palette.green[200],
    icon: palette.green[400],
  },
  warning: {
    background: palette.amber[900],
    border: palette.amber[500],
    text: palette.amber[200],
    icon: palette.amber[400],
  },
  error: {
    background: palette.red[900],
    border: palette.red[500],
    text: palette.red[200],
    icon: palette.red[400],
  },
};

/**
 * Default icons per variant
 */
const variantIcons: Record<ToastVariant, string> = {
  info: "ℹ",
  success: "✓",
  warning: "⚠",
  error: "✕",
};

/**
 * Toast Component
 *
 * @example
 * ```tsx
 * // Basic toast
 * <Toast
 *   visible={showToast}
 *   message="Changes saved"
 *   onDismiss={() => setShowToast(false)}
 * />
 *
 * // Success with action
 * <Toast
 *   visible={showToast}
 *   message="Item deleted"
 *   variant="success"
 *   action={{ label: "Undo", onPress: handleUndo }}
 *   duration={5000}
 *   onDismiss={() => setShowToast(false)}
 * />
 *
 * // Error with close button
 * <Toast
 *   visible={showToast}
 *   message="Failed to save"
 *   variant="error"
 *   showCloseButton
 *   duration={0}
 *   onDismiss={() => setShowToast(false)}
 * />
 * ```
 */
export function Toast({
  visible,
  message,
  variant = "info",
  position = "bottom",
  duration = 4000,
  onDismiss,
  action,
  icon,
  showCloseButton = false,
  testID,
  accessibilityLabel,
  style,
}: ToastProps): React.ReactElement | null {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const colors = variantColors[variant];

  // Auto-dismiss effect
  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Set new timer if visible and duration > 0
    if (visible && duration > 0 && onDismiss) {
      timerRef.current = setTimeout(() => {
        onDismiss();
      }, duration);
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [visible, duration, onDismiss]);

  // Handle close button press
  const handleClose = () => {
    if (onDismiss) {
      onDismiss();
    }
  };

  // Compute position styles
  const positionStyle: ViewStyle =
    position === "top" ? { top: 60 } : { bottom: 60 };

  // Compute container styles
  const containerStyle: ViewStyle = {
    backgroundColor: colors.background,
    borderColor: colors.border,
  };

  // Determine accessibility label
  const toastAccessibilityLabel = accessibilityLabel || message;

  if (!visible) {
    return null;
  }

  return (
    <View
      testID={testID}
      style={[styles.container, positionStyle, containerStyle, style]}
      accessibilityRole="alert"
      accessibilityLabel={toastAccessibilityLabel}
      accessibilityLiveRegion="polite"
    >
      {/* Icon */}
      {icon ? (
        icon
      ) : (
        <Text
          testID={testID ? `${testID}-icon` : "toast-icon"}
          style={[styles.icon, { color: colors.icon }]}
        >
          {variantIcons[variant]}
        </Text>
      )}

      {/* Message */}
      <Text
        style={[styles.message, { color: colors.text }]}
        numberOfLines={2}
      >
        {message}
      </Text>

      {/* Action Button */}
      {action && (
        <Pressable
          testID={testID ? `${testID}-action` : "toast-action"}
          onPress={action.onPress}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionButtonPressed,
          ]}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
        >
          <Text style={[styles.actionText, { color: colors.icon }]}>
            {action.label}
          </Text>
        </Pressable>
      )}

      {/* Close Button */}
      {showCloseButton && (
        <Pressable
          testID={testID ? `${testID}-close-button` : "toast-close-button"}
          onPress={handleClose}
          accessibilityRole="button"
          accessibilityLabel="Dismiss notification"
          style={({ pressed }) => [
            styles.closeButton,
            pressed && styles.closeButtonPressed,
          ]}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
        >
          <Text style={[styles.closeButtonText, { color: colors.text }]}>
            ✕
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 48,
    elevation: 6,
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  icon: {
    fontSize: 18,
    fontWeight: "600",
    marginRight: 12,
    width: 20,
    textAlign: "center",
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  actionButton: {
    marginLeft: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionButtonPressed: {
    opacity: 0.7,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  closeButton: {
    marginLeft: 8,
    padding: 4,
  },
  closeButtonPressed: {
    opacity: 0.7,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default Toast;
