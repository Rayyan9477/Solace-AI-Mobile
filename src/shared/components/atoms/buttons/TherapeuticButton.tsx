/**
 * TherapeuticButton - Comprehensive button system for mental health apps
 *
 * This component provides a complete button system with therapeutic design principles:
 * - Calming color palettes
 * - Accessibility-first design
 * - Crisis-appropriate styling
 * - Multiple variants for different emotional contexts
 */

import { useAccessibility, useMentalHealth } from "@app/providers/AppProvider";
import { useTheme } from "@theme/ThemeProvider";
import * as Haptics from "expo-haptics";
import React, { useCallback, useMemo } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";

// Button variant configurations
const BUTTON_VARIANTS = {
  primary: {
    name: "Primary",
    therapeutic: "balanced",
    priority: "high",
  },
  secondary: {
    name: "Secondary",
    therapeutic: "calming",
    priority: "medium",
  },
  ghost: {
    name: "Ghost",
    therapeutic: "peaceful",
    priority: "low",
  },
  crisis: {
    name: "Crisis",
    therapeutic: "crisis",
    priority: "critical",
  },
  success: {
    name: "Success",
    therapeutic: "nurturing",
    priority: "positive",
  },
  calming: {
    name: "Calming",
    therapeutic: "zen",
    priority: "low",
  },
};

// Size configurations
const BUTTON_SIZES = {
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    minHeight: 36,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    minHeight: 44,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    fontSize: 18,
    minHeight: 52,
  },
};

/**
 * TherapeuticButton - Main button component
 */
export const TherapeuticButton = ({
  children,
  title,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  fullWidth = false,
  onPress,
  onLongPress,
  testID,
  accessibilityLabel,
  accessibilityHint,
  style,
  textStyle,
  ...props
}) => {
  const { theme: themeObj } = useTheme();
  const { announceForAccessibility, isScreenReaderEnabled, fontScale } =
    useAccessibility();
  const { isCrisisMode } = useMentalHealth();

  // Get variant configuration
  const variantConfig = BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.primary;
  const sizeConfig = BUTTON_SIZES[size];

  // Therapeutic color system
  const therapeuticColors = useMemo(() => {
    const colors = themeObj?.colors || {};

    return {
      balanced: {
        background: colors.primary,
        backgroundPressed: colors.primaryDark,
        backgroundDisabled: colors.disabled,
        text: colors.onPrimary,
        textDisabled: colors.onDisabled,
      },
      calming: {
        background: colors.success,
        backgroundPressed: colors.successDark,
        backgroundDisabled: colors.disabled,
        text: colors.onSuccess,
        textDisabled: colors.onDisabled,
      },
      peaceful: {
        background: "transparent",
        backgroundPressed: colors.surfaceVariant,
        backgroundDisabled: "transparent",
        text: colors.primary,
        textDisabled: colors.onDisabled,
        border: colors.outline,
      },
      crisis: {
        background: colors.error,
        backgroundPressed: colors.errorDark,
        backgroundDisabled: colors.disabled,
        text: colors.onError,
        textDisabled: colors.onDisabled,
      },
      nurturing: {
        background: colors.tertiary,
        backgroundPressed: colors.tertiaryDark,
        backgroundDisabled: colors.disabled,
        text: colors.onTertiary,
        textDisabled: colors.onDisabled,
      },
      zen: {
        background: colors.surface,
        backgroundPressed: colors.surfaceVariant,
        backgroundDisabled: colors.disabled,
        text: colors.onSurface,
        textDisabled: colors.onDisabled,
        border: colors.primary,
      },
    };
  }, [themeObj?.colors]);

  const variantColors =
    therapeuticColors[variantConfig.therapeutic] || therapeuticColors.balanced;

  // Handle press with accessibility announcement
  const handlePress = useCallback(
    (event) => {
      if (disabled || loading) return;

      // Announce action for screen readers
      if (isScreenReaderEnabled && accessibilityLabel) {
        announceForAccessibility(`${accessibilityLabel} activated`);
      }

      // Haptics feedback for better UX
      try {
        Haptics.impactAsync?.(Haptics.ImpactFeedbackStyle?.Medium);
      } catch {}

      onPress?.(event);
    },
    [
      disabled,
      loading,
      onPress,
      announceForAccessibility,
      isScreenReaderEnabled,
      accessibilityLabel,
    ],
  );

  // Button styles
  const buttonStyles = useMemo(
    () => [
      styles.button,
      {
        backgroundColor: disabled
          ? variantColors.backgroundDisabled
          : variantColors.background,
        paddingVertical: sizeConfig.paddingVertical,
        paddingHorizontal: sizeConfig.paddingHorizontal,
        minHeight: sizeConfig.minHeight,
        borderWidth: variantColors.border ? 1 : 0,
        borderColor: variantColors.border,
        width: fullWidth ? "100%" : "auto",
        opacity: disabled ? 0.6 : 1,
      },
      // Crisis mode gets special treatment
      isCrisisMode &&
        variant !== "crisis" && {
          borderWidth: 2,
          borderColor: themeObj?.colors?.error,
        },
      style,
    ],
    [
      disabled,
      variantColors,
      sizeConfig,
      fullWidth,
      isCrisisMode,
      variant,
      themeObj?.colors?.error,
      style,
    ],
  );

  // Text styles
  const buttonTextStyles = useMemo(
    () => [
      styles.buttonText,
      {
        color: disabled ? variantColors.textDisabled : variantColors.text,
        fontSize: sizeConfig.fontSize * fontScale,
        fontWeight: variantConfig.priority === "critical" ? "700" : "600",
      },
      textStyle,
    ],
    [
      disabled,
      variantColors,
      sizeConfig.fontSize,
      fontScale,
      variantConfig.priority,
      textStyle,
    ],
  );

  // Flatten styles so consumers/tests see a resolved object (not a mix of IDs/arrays)
  const mergedButtonStyle = useMemo(
    () => StyleSheet.flatten(buttonStyles),
    [buttonStyles],
  );

  return (
    <TouchableOpacity
      style={mergedButtonStyle}
      onPress={handlePress}
      onLongPress={onLongPress}
      disabled={disabled || loading}
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{
        disabled: disabled || loading,
        busy: loading,
      }}
      testID={testID || (title ? `button-${title}` : undefined)}
      {...props}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            color={variantColors.text}
            size="small"
            style={styles.loadingIndicator}
          />
          {children && (
            <Text style={[buttonTextStyles, styles.loadingText]}>
              {children}
            </Text>
          )}
        </View>
      ) : (
        <Text style={buttonTextStyles}>{children || title}</Text>
      )}
    </TouchableOpacity>
  );
};

// Preset button variants
export const PrimaryButton = (props) => (
  <TherapeuticButton variant="primary" {...props} />
);

export const SecondaryButton = (props) => (
  <TherapeuticButton variant="secondary" {...props} />
);

export const GhostButton = (props) => (
  <TherapeuticButton variant="ghost" {...props} />
);

export const CrisisButton = (props) => (
  <TherapeuticButton
    variant="crisis"
    accessibilityLabel="Crisis support button"
    accessibilityHint="Activates crisis intervention features"
    {...props}
  />
);

export const SuccessButton = (props) => (
  <TherapeuticButton variant="success" {...props} />
);

export const CalmingButton = (props) => (
  <TherapeuticButton
    variant="calming"
    accessibilityLabel="Calming action button"
    {...props}
  />
);

export const TherapeuticActionButton = (props) => (
  <TherapeuticButton
    variant="primary"
    accessibilityLabel="Therapeutic action"
    {...props}
  />
);

// Button group component
export const ButtonGroup = ({
  children,
  direction = "row",
  spacing = 12,
  fullWidth = false,
  style,
}) => {
  const groupStyles = [
    styles.buttonGroup,
    {
      flexDirection: direction,
      gap: spacing,
      width: fullWidth ? "100%" : "auto",
    },
    style,
  ];

  return (
    <View style={groupStyles}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            fullWidth: fullWidth && direction === "column",
            key: index,
          });
        }
        return child;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        cursor: "pointer",
      },
    }),
  },
  buttonText: {
    textAlign: "center",
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingIndicator: {
    marginRight: 8,
  },
  loadingText: {
    opacity: 0.7,
  },
  buttonGroup: {
    alignItems: "center",
  },
});

// Default export for convenience
export default TherapeuticButton;
