import Button from "@shared/components/atoms/buttons/TherapeuticButton";
import { MentalHealthIcon } from "@shared/components/icons";
import { getTherapeuticColor } from "@theme/ColorPalette";
import { useTheme } from "@theme/ThemeProvider";
import React, { useState, useEffect, useRef } from "react";
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  BackHandler,
} from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const Modal = ({
  visible = false,
  onClose = () => {},
  title = "",
  subtitle = "",
  children,
  size = "medium",
  variant = "default",
  therapeuticColor = "calming",
  showCloseButton = true,
  closeOnOverlayPress = true,
  closeOnBackPress = true,
  animationType = "fade",
  position = "center",
  style = {},
  overlayStyle = {},
  contentStyle = {},
  headerStyle = {},
  bodyStyle = {},
  footerStyle = {},
  scrollable = true,
  keyboardAvoidingView = true,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const { theme, isDarkMode } = useTheme();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.9));

  // HIGH-016 FIX: Use ref to avoid listener churn when onClose changes
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // HIGH-016 FIX: Use ref to prevent listener churn when onClose changes
  useEffect(() => {
    if (closeOnBackPress && visible) {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          // HIGH-016 FIX: Use ref to get current onClose without dependency
          onCloseRef.current?.();
          return true;
        },
      );

      return () => backHandler.remove();
    }
  }, [visible, closeOnBackPress]); // Removed onClose from deps - using ref instead

  const getModalStyles = () => {
    const therapeuticColors = getTherapeuticColor(
      therapeuticColor,
      500,
      isDarkMode,
    );
    const sizeStyles = getSizeStyles();

    let backgroundColor = theme.colors.background.card;
    let borderColor = "transparent";

    switch (variant) {
      case "therapeutic":
        borderColor = therapeuticColors;
        backgroundColor = isDarkMode
          ? `${therapeuticColors}10`
          : theme.colors.background.card;
        break;
      case "filled":
        backgroundColor = theme.colors.background.secondary;
        break;
      case "bordered":
        borderColor = theme.colors.border.primary;
        break;
    }

    return {
      backgroundColor,
      borderColor,
      borderWidth: borderColor !== "transparent" ? 1 : 0,
      ...sizeStyles,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    };
  };

  const getSizeStyles = () => {
    const padding = 24;

    switch (size) {
      case "small":
        return {
          width: Math.min(screenWidth * 0.8, 320),
          maxHeight: screenHeight * 0.6,
          borderRadius: 12,
          padding: 16,
        };

      case "large":
        return {
          width: Math.min(screenWidth * 0.95, 600),
          maxHeight: screenHeight * 0.9,
          borderRadius: 16,
          padding: 32,
        };

      case "fullscreen":
        return {
          width: screenWidth,
          height: screenHeight,
          borderRadius: 0,
          padding,
          maxHeight: screenHeight,
        };

      default: // medium
        return {
          width: Math.min(screenWidth * 0.9, 400),
          maxHeight: screenHeight * 0.8,
          borderRadius: 14,
          padding,
        };
    }
  };

  const getContainerStyles = () => {
    switch (position) {
      case "top":
        return {
          justifyContent: "flex-start",
          paddingTop: 60,
        };

      case "bottom":
        return {
          justifyContent: "flex-end",
          paddingBottom: 60,
        };

      default: // center
        return {
          justifyContent: "center",
          alignItems: "center",
        };
    }
  };

  const renderHeader = () => {
    if (!title && !showCloseButton) return null;

    const therapeuticColors = getTherapeuticColor(
      therapeuticColor,
      500,
      isDarkMode,
    );

    return (
      <View style={[styles.header, headerStyle]}>
        <View style={styles.headerLeft}>
          {title && (
            <Text
              style={[
                styles.title,
                {
                  color:
                    variant === "therapeutic"
                      ? therapeuticColors
                      : theme.colors.text.primary,
                  fontSize: size === "small" ? 18 : size === "large" ? 24 : 20,
                },
              ]}
            >
              {title}
            </Text>
          )}

          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                {
                  color: theme.colors.text.secondary,
                  fontSize: size === "small" ? 14 : size === "large" ? 16 : 15,
                },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>

        {showCloseButton && (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel="Close modal"
          >
            <MentalHealthIcon
              name="Heart"
              size={size === "small" ? 20 : size === "large" ? 28 : 24}
              color={theme.colors.text.secondary}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderContent = () => {
    const ContentWrapper = scrollable ? ScrollView : View;
    const wrapperProps = scrollable
      ? {
          showsVerticalScrollIndicator: false,
          contentContainerStyle: { flexGrow: 1 },
          keyboardShouldPersistTaps: "handled",
        }
      : {};

    return (
      <ContentWrapper style={[styles.body, bodyStyle]} {...wrapperProps}>
        {children}
      </ContentWrapper>
    );
  };

  const ModalContent = () => (
    <Animated.View
      style={[
        styles.modal,
        getModalStyles(),
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
        style,
      ]}
      accessibilityRole="dialog"
      accessibilityModal
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      testID={testID}
    >
      {renderHeader()}
      {renderContent()}
    </Animated.View>
  );

  const KeyboardWrapper = keyboardAvoidingView ? KeyboardAvoidingView : View;
  const keyboardProps = keyboardAvoidingView
    ? {
        behavior: Platform.OS === "ios" ? "padding" : "height",
        keyboardVerticalOffset: Platform.OS === "ios" ? 0 : 20,
      }
    : {};

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none" // We handle animations manually
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardWrapper style={styles.container} {...keyboardProps}>
        <Animated.View
          style={[
            styles.overlay,
            getContainerStyles(),
            {
              opacity: fadeAnim,
              backgroundColor: "rgba(0,0,0,0.5)",
            },
            overlayStyle,
          ]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={closeOnOverlayPress ? onClose : undefined}
            activeOpacity={1}
          />

          <ModalContent />
        </Animated.View>
      </KeyboardWrapper>
    </RNModal>
  );
};

// Modal Header Component
export const ModalHeader = ({
  title,
  subtitle,
  icon,
  onClose,
  showCloseButton = true,
  therapeuticColor = "calming",
  style = {},
}) => {
  const { theme, isDarkMode } = useTheme();
  const therapeuticColors = getTherapeuticColor(
    therapeuticColor,
    500,
    isDarkMode,
  );

  return (
    <View style={[styles.modalHeader, style]}>
      <View style={styles.modalHeaderContent}>
        {icon && (
          <View style={styles.modalHeaderIcon}>
            {typeof icon === "string" ? (
              <MentalHealthIcon
                name={icon}
                size={24}
                color={therapeuticColors}
              />
            ) : (
              icon
            )}
          </View>
        )}

        <View style={styles.modalHeaderText}>
          {title && (
            <Text
              style={[styles.modalHeaderTitle, { color: therapeuticColors }]}
            >
              {title}
            </Text>
          )}

          {subtitle && (
            <Text
              style={[
                styles.modalHeaderSubtitle,
                { color: theme.colors.text.secondary },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {showCloseButton && (
        <TouchableOpacity
          style={styles.modalHeaderClose}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
        >
          <MentalHealthIcon
            name="Heart"
            size={20}
            color={theme.colors.text.secondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

// Modal Footer Component
export const ModalFooter = ({
  children,
  primaryAction,
  secondaryAction,
  orientation = "horizontal",
  style = {},
}) => {
  const renderActions = () => {
    if (primaryAction || secondaryAction) {
      return (
        <View
          style={[
            styles.modalFooterActions,
            {
              flexDirection: orientation === "horizontal" ? "row" : "column",
              gap: orientation === "horizontal" ? 12 : 8,
            },
          ]}
        >
          {secondaryAction && (
            <Button
              {...secondaryAction}
              variant={secondaryAction.variant || "outline"}
              style={[
                orientation === "vertical" && { width: "100%" },
                secondaryAction.style,
              ]}
            />
          )}
          {primaryAction && (
            <Button
              {...primaryAction}
              variant={primaryAction.variant || "primary"}
              style={[
                orientation === "vertical" && { width: "100%" },
                primaryAction.style,
              ]}
            />
          )}
        </View>
      );
    }

    return children;
  };

  return <View style={[styles.modalFooter, style]}>{renderActions()}</View>;
};

// Specialized Modal Components

// Confirmation Modal
export const ConfirmModal = ({
  visible,
  onConfirm,
  onCancel,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  therapeuticColor = "energizing",
  ...props
}) => (
  <Modal
    visible={visible}
    onClose={onCancel}
    title={title}
    therapeuticColor={therapeuticColor}
    size="small"
    {...props}
  >
    <Text
      style={{
        fontSize: 16,
        lineHeight: 24,
        textAlign: "center",
        marginVertical: 16,
      }}
    >
      {message}
    </Text>

    <ModalFooter
      primaryAction={{
        title: confirmText,
        onPress: onConfirm,
        therapeuticColor,
      }}
      secondaryAction={{
        title: cancelText,
        onPress: onCancel,
      }}
      orientation="horizontal"
    />
  </Modal>
);

// Info Modal
export const InfoModal = ({
  visible,
  onClose,
  title = "Information",
  message,
  buttonText = "Got it",
  therapeuticColor = "calming",
  ...props
}) => (
  <Modal
    visible={visible}
    onClose={onClose}
    title={title}
    therapeuticColor={therapeuticColor}
    size="small"
    {...props}
  >
    <Text
      style={{
        fontSize: 16,
        lineHeight: 24,
        textAlign: "center",
        marginVertical: 16,
      }}
    >
      {message}
    </Text>

    <ModalFooter
      primaryAction={{
        title: buttonText,
        onPress: onClose,
        therapeuticColor,
        fullWidth: true,
      }}
    />
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modal: {
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontWeight: "400",
    lineHeight: 20,
  },
  closeButton: {
    padding: 4,
    marginLeft: 16,
    marginTop: -4,
  },
  body: {
    flex: 1,
    paddingVertical: 16,
  },

  // Modal Header Component Styles
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  modalHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  modalHeaderIcon: {
    marginRight: 12,
  },
  modalHeaderText: {
    flex: 1,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 2,
  },
  modalHeaderSubtitle: {
    fontSize: 14,
    fontWeight: "400",
  },
  modalHeaderClose: {
    padding: 4,
    marginLeft: 12,
  },

  // Modal Footer Component Styles
  modalFooter: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  modalFooterActions: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
});

export default Modal;
