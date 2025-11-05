import { getTherapeuticColor } from "@theme/ColorPalette";
import { useTheme } from "@theme/ThemeProvider";
import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  PanGestureHandler,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
} from "react-native";

// For React Native without Reanimated, we'll use a simpler implementation
const { width: screenWidth } = Dimensions.get("window");

const Slider = ({
  value = 50,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  onValueChange = () => {},
  onSlidingComplete = () => {},
  therapeuticColor = "calming",
  size = "medium",
  showLabels = true,
  showValue = true,
  minimumLabel = "",
  maximumLabel = "",
  formatValue = (val) => val.toString(),
  disabled = false,
  style = {},
  trackStyle = {},
  thumbStyle = {},
  fillStyle = {},
  labelStyle = {},
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const { theme, isDarkMode } = useTheme();
  const [currentValue, setCurrentValue] = useState(value);
  const [isSliding, setIsSliding] = useState(false);
  const sliderWidth = useRef(200);

  const therapeuticColors = getTherapeuticColor(
    therapeuticColor,
    500,
    isDarkMode,
  );

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          trackHeight: 4,
          thumbSize: 16,
          fontSize: 12,
          padding: 16,
        };
      case "large":
        return {
          trackHeight: 8,
          thumbSize: 28,
          fontSize: 16,
          padding: 24,
        };
      default: // medium
        return {
          trackHeight: 6,
          thumbSize: 20,
          fontSize: 14,
          padding: 20,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const normalizedValue = Math.max(
    minimumValue,
    Math.min(maximumValue, currentValue),
  );
  const percentage =
    ((normalizedValue - minimumValue) / (maximumValue - minimumValue)) * 100;

  const handleValueChange = useCallback(
    (newValue) => {
      if (disabled) return;

      const steppedValue =
        step > 0 ? Math.round(newValue / step) * step : newValue;

      const clampedValue = Math.max(
        minimumValue,
        Math.min(maximumValue, steppedValue),
      );

      if (clampedValue !== currentValue) {
        setCurrentValue(clampedValue);
        onValueChange(clampedValue);
      }
    },
    [currentValue, step, minimumValue, maximumValue, disabled, onValueChange],
  );

  const renderLabels = () => {
    if (!showLabels) return null;

    return (
      <View style={styles.labelsContainer}>
        <Text
          style={[
            styles.label,
            {
              color: theme.colors.text.secondary,
              fontSize: sizeStyles.fontSize - 2,
            },
            labelStyle,
          ]}
        >
          {minimumLabel || minimumValue}
        </Text>

        <Text
          style={[
            styles.label,
            {
              color: theme.colors.text.secondary,
              fontSize: sizeStyles.fontSize - 2,
            },
            labelStyle,
          ]}
        >
          {maximumLabel || maximumValue}
        </Text>
      </View>
    );
  };

  const renderValue = () => {
    if (!showValue) return null;

    return (
      <View style={styles.valueContainer}>
        <Text
          style={[
            styles.valueText,
            {
              color: therapeuticColors,
              fontSize: sizeStyles.fontSize + 2,
              fontWeight: "600",
            },
          ]}
        >
          {formatValue(currentValue)}
        </Text>
      </View>
    );
  };

  const renderTrack = () => {
    return (
      <View
        style={[
          styles.track,
          {
            height: sizeStyles.trackHeight,
            backgroundColor: theme.colors.background.secondary,
            borderRadius: sizeStyles.trackHeight / 2,
          },
          trackStyle,
        ]}
        onLayout={(event) => {
          sliderWidth.current = event.nativeEvent.layout.width;
        }}
      >
        {/* Fill Track */}
        <View
          style={[
            styles.fill,
            {
              width: `${percentage}%`,
              height: sizeStyles.trackHeight,
              backgroundColor: therapeuticColors,
              borderRadius: sizeStyles.trackHeight / 2,
            },
            fillStyle,
          ]}
        />

        {/* Thumb */}
        <View
          style={[
            styles.thumb,
            {
              width: sizeStyles.thumbSize,
              height: sizeStyles.thumbSize,
              backgroundColor: therapeuticColors,
              borderRadius: sizeStyles.thumbSize / 2,
              left: `${percentage}%`,
              marginLeft: -(sizeStyles.thumbSize / 2),
              shadowColor: therapeuticColors,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isSliding ? 0.3 : 0.2,
              shadowRadius: 4,
              elevation: isSliding ? 6 : 4,
            },
            thumbStyle,
          ]}
        />
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: sizeStyles.padding,
          paddingVertical: sizeStyles.padding / 2,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityValue={{
        min: minimumValue,
        max: maximumValue,
        now: currentValue,
        text: formatValue(currentValue),
      }}
      testID={testID}
    >
      {renderValue()}
      {renderTrack()}
      {renderLabels()}
    </View>
  );
};

// Range Slider Component (for selecting a range)
export const RangeSlider = ({
  minimumValue = 0,
  maximumValue = 100,
  lowValue = 25,
  highValue = 75,
  step = 1,
  onValueChange = () => {},
  therapeuticColor = "calming",
  size = "medium",
  showLabels = true,
  showValues = true,
  disabled = false,
  style = {},
  ...props
}) => {
  const { theme, isDarkMode } = useTheme();
  const [currentLow, setCurrentLow] = useState(lowValue);
  const [currentHigh, setCurrentHigh] = useState(highValue);

  const therapeuticColors = getTherapeuticColor(
    therapeuticColor,
    500,
    isDarkMode,
  );
  const sizeStyles = getSizeStyles(size);

  const lowPercentage =
    ((currentLow - minimumValue) / (maximumValue - minimumValue)) * 100;
  const highPercentage =
    ((currentHigh - minimumValue) / (maximumValue - minimumValue)) * 100;
  const rangePercentage = highPercentage - lowPercentage;

  const renderValues = () => {
    if (!showValues) return null;

    return (
      <View style={styles.rangeValuesContainer}>
        <Text
          style={[
            styles.rangeValue,
            {
              color: therapeuticColors,
              fontSize: sizeStyles.fontSize,
              fontWeight: "600",
            },
          ]}
        >
          {currentLow}
        </Text>
        <Text
          style={[
            styles.rangeValue,
            {
              color: theme.colors.text.secondary,
              fontSize: sizeStyles.fontSize - 2,
            },
          ]}
        >
          —
        </Text>
        <Text
          style={[
            styles.rangeValue,
            {
              color: therapeuticColors,
              fontSize: sizeStyles.fontSize,
              fontWeight: "600",
            },
          ]}
        >
          {currentHigh}
        </Text>
      </View>
    );
  };

  const renderRangeTrack = () => {
    return (
      <View
        style={[
          styles.track,
          {
            height: sizeStyles.trackHeight,
            backgroundColor: theme.colors.background.secondary,
            borderRadius: sizeStyles.trackHeight / 2,
          },
        ]}
      >
        {/* Range Fill */}
        <View
          style={[
            styles.rangeFill,
            {
              left: `${lowPercentage}%`,
              width: `${rangePercentage}%`,
              height: sizeStyles.trackHeight,
              backgroundColor: therapeuticColors,
              borderRadius: sizeStyles.trackHeight / 2,
            },
          ]}
        />

        {/* Low Thumb */}
        <View
          style={[
            styles.thumb,
            {
              width: sizeStyles.thumbSize,
              height: sizeStyles.thumbSize,
              backgroundColor: therapeuticColors,
              borderRadius: sizeStyles.thumbSize / 2,
              left: `${lowPercentage}%`,
              marginLeft: -(sizeStyles.thumbSize / 2),
            },
          ]}
        />

        {/* High Thumb */}
        <View
          style={[
            styles.thumb,
            {
              width: sizeStyles.thumbSize,
              height: sizeStyles.thumbSize,
              backgroundColor: therapeuticColors,
              borderRadius: sizeStyles.thumbSize / 2,
              left: `${highPercentage}%`,
              marginLeft: -(sizeStyles.thumbSize / 2),
            },
          ]}
        />
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: sizeStyles.padding,
          paddingVertical: sizeStyles.padding / 2,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {renderValues()}
      {renderRangeTrack()}
      {showLabels && (
        <View style={styles.labelsContainer}>
          <Text
            style={[
              styles.label,
              {
                color: theme.colors.text.secondary,
                fontSize: sizeStyles.fontSize - 2,
              },
            ]}
          >
            {minimumValue}
          </Text>
          <Text
            style={[
              styles.label,
              {
                color: theme.colors.text.secondary,
                fontSize: sizeStyles.fontSize - 2,
              },
            ]}
          >
            {maximumValue}
          </Text>
        </View>
      )}
    </View>
  );
};

// Therapeutic Slider Variants
export const CalmingSlider = (props) => (
  <Slider {...props} therapeuticColor="calming" />
);

export const NurturingSlider = (props) => (
  <Slider {...props} therapeuticColor="nurturing" />
);

export const PeacefulSlider = (props) => (
  <Slider {...props} therapeuticColor="peaceful" />
);

export const GroundingSlider = (props) => (
  <Slider {...props} therapeuticColor="grounding" />
);

// Utility function for size styles
const getSizeStyles = (size) => {
  switch (size) {
    case "small":
      return {
        trackHeight: 4,
        thumbSize: 16,
        fontSize: 12,
        padding: 16,
      };
    case "large":
      return {
        trackHeight: 8,
        thumbSize: 28,
        fontSize: 16,
        padding: 24,
      };
    default: // medium
      return {
        trackHeight: 6,
        thumbSize: 20,
        fontSize: 14,
        padding: 20,
      };
  }
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    minHeight: 60,
  },
  track: {
    position: "relative",
    width: "100%",
    justifyContent: "center",
  },
  fill: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  rangeFill: {
    position: "absolute",
    top: 0,
  },
  thumb: {
    position: "absolute",
    top: 0,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  valueContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  valueText: {
    fontWeight: "600",
  },
  rangeValuesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  rangeValue: {
    fontWeight: "600",
  },
  labelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  label: {
    fontWeight: "500",
  },
});

export default Slider;
