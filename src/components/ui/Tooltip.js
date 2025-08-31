import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
  Dimensions,
} from "react-native";

import { useTheme } from "../../shared/theme/ThemeContext";

const { width: screenWidth } = Dimensions.get("window");

const Tooltip = ({
  children,
  content = "",
  position = "top",
  backgroundColor,
  textColor,
  disabled = false,
  accessibilityLabel,
}) => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const triggerRef = useRef();

  const showTooltip = () => {
    if (disabled || !content) return;

    // Measure trigger position
    triggerRef.current?.measure((fx, fy, width, height, px, py) => {
      let top, left;

      switch (position) {
        case "bottom":
          top = py + height + 8;
          left = px + width / 2;
          break;
        case "left":
          top = py + height / 2;
          left = px - 8;
          break;
        case "right":
          top = py + height / 2;
          left = px + width + 8;
          break;
        default: // top
          top = py - 8;
          left = px + width / 2;
      }

      // Ensure tooltip stays within screen bounds
      left = Math.max(16, Math.min(left, screenWidth - 16));

      setTooltipPosition({ top, left });
      setIsVisible(true);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const hideTooltip = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
    });
  };

  const getTooltipStyle = () => {
    const baseStyle = {
      position: "absolute",
      backgroundColor: backgroundColor || theme.colors.background.modal,
      borderColor: theme.colors.border.primary,
      ...tooltipPosition,
    };

    switch (position) {
      case "bottom":
        return {
          ...baseStyle,
          transform: [{ translateX: -75 }], // Center horizontally
        };
      case "left":
        return {
          ...baseStyle,
          transform: [{ translateX: -150 }, { translateY: -20 }],
        };
      case "right":
        return {
          ...baseStyle,
          transform: [{ translateY: -20 }],
        };
      default: // top
        return {
          ...baseStyle,
          transform: [{ translateX: -75 }, { translateY: -40 }],
        };
    }
  };

  const getArrowStyle = () => {
    const arrowSize = 6;
    const arrowColor = backgroundColor || theme.colors.background.modal;

    switch (position) {
      case "bottom":
        return {
          position: "absolute",
          top: -arrowSize,
          left: 75 - arrowSize,
          width: 0,
          height: 0,
          borderLeftWidth: arrowSize,
          borderRightWidth: arrowSize,
          borderBottomWidth: arrowSize,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderBottomColor: arrowColor,
        };
      case "left":
        return {
          position: "absolute",
          top: 20 - arrowSize,
          right: -arrowSize,
          width: 0,
          height: 0,
          borderTopWidth: arrowSize,
          borderBottomWidth: arrowSize,
          borderLeftWidth: arrowSize,
          borderTopColor: "transparent",
          borderBottomColor: "transparent",
          borderLeftColor: arrowColor,
        };
      case "right":
        return {
          position: "absolute",
          top: 20 - arrowSize,
          left: -arrowSize,
          width: 0,
          height: 0,
          borderTopWidth: arrowSize,
          borderBottomWidth: arrowSize,
          borderRightWidth: arrowSize,
          borderTopColor: "transparent",
          borderBottomColor: "transparent",
          borderRightColor: arrowColor,
        };
      default: // top
        return {
          position: "absolute",
          bottom: -arrowSize,
          left: 75 - arrowSize,
          width: 0,
          height: 0,
          borderLeftWidth: arrowSize,
          borderRightWidth: arrowSize,
          borderTopWidth: arrowSize,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderTopColor: arrowColor,
        };
    }
  };

  return (
    <>
      <TouchableOpacity
        ref={triggerRef}
        onPress={showTooltip}
        onLongPress={showTooltip}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || `Show tooltip: ${content}`}
        accessibilityHint="Double tap to show help information"
      >
        {children}
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="none"
        onRequestClose={hideTooltip}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={hideTooltip}
        >
          <Animated.View
            style={[
              styles.tooltip,
              getTooltipStyle(),
              {
                opacity: fadeAnim,
                transform: [
                  ...(getTooltipStyle().transform || []),
                  { scale: scaleAnim },
                ],
              },
            ]}
            pointerEvents="none"
          >
            <View style={getArrowStyle()} />
            <Text
              style={[
                styles.tooltipText,
                { color: textColor || theme.colors.text.primary },
              ]}
            >
              {content}
            </Text>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  tooltip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    maxWidth: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tooltipText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
});

export default Tooltip;
