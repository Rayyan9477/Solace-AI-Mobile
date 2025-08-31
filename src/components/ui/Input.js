import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from "react-native";

import { getTherapeuticColor } from "../../shared/theme/ColorPalette";
import { useTheme } from "../../shared/theme/ThemeContext";
import { MentalHealthIcon } from "../icons";

const { width: screenWidth } = Dimensions.get("window");

const Input = ({
  label = "",
  placeholder = "",
  value = "",
  onChangeText = () => {},
  onFocus = () => {},
  onBlur = () => {},
  variant = "default",
  size = "medium",
  therapeuticColor = "calming",
  disabled = false,
  error = false,
  errorMessage = "",
  helperText = "",
  required = false,
  multiline = false,
  numberOfLines = 4,
  maxLength,
  keyboardType = "default",
  secureTextEntry = false,
  autoCapitalize = "sentences",
  leftIcon = null,
  rightIcon = null,
  onRightIconPress = null,
  style = {},
  inputStyle = {},
  containerStyle = {},
  accessibilityLabel,
  accessibilityHint,
  testID,
  ...props
}) => {
  const { theme, isDarkMode } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isSecureVisible, setIsSecureVisible] = useState(false);
  const [animatedValue] = useState(new Animated.Value(value ? 1 : 0));
  const inputRef = useRef(null);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur(e);
  };

  const toggleSecureEntry = () => {
    setIsSecureVisible(!isSecureVisible);
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const getContainerStyles = () => {
    const therapeuticColors = getTherapeuticColor(
      therapeuticColor,
      500,
      isDarkMode,
    );

    let borderColor = theme.colors.border.primary;
    let backgroundColor = theme.colors.background.card;

    if (error) {
      borderColor = theme.colors.error[500];
    } else if (isFocused) {
      borderColor = therapeuticColors;
    }

    if (disabled) {
      backgroundColor = theme.colors.background.secondary;
    }

    const baseStyle = {
      backgroundColor,
      borderColor,
      borderWidth: variant === "outline" || variant === "default" ? 1.5 : 0,
      borderRadius: getSizeStyles().borderRadius,
      ...getSizeStyles().container,
    };

    switch (variant) {
      case "filled":
        baseStyle.backgroundColor = isFocused
          ? theme.colors.background.card
          : theme.colors.background.secondary;
        baseStyle.borderWidth = 0;
        break;

      case "underline":
        baseStyle.backgroundColor = "transparent";
        baseStyle.borderWidth = 0;
        baseStyle.borderBottomWidth = 2;
        baseStyle.borderRadius = 0;
        break;

      case "none":
        baseStyle.backgroundColor = "transparent";
        baseStyle.borderWidth = 0;
        break;
    }

    return [styles.container, baseStyle, containerStyle];
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          container: {
            minHeight: 36,
            paddingHorizontal: 12,
            paddingVertical: 8,
          },
          borderRadius: 8,
          fontSize: 14,
          iconSize: 16,
        };

      case "large":
        return {
          container: {
            minHeight: 56,
            paddingHorizontal: 16,
            paddingVertical: 16,
          },
          borderRadius: 12,
          fontSize: 18,
          iconSize: 20,
        };

      default: // medium
        return {
          container: {
            minHeight: 44, // WCAG minimum
            paddingHorizontal: 14,
            paddingVertical: 12,
          },
          borderRadius: 10,
          fontSize: 16,
          iconSize: 18,
        };
    }
  };

  const getInputStyles = () => {
    const sizeStyles = getSizeStyles();

    return [
      styles.input,
      {
        fontSize: sizeStyles.fontSize,
        color: disabled
          ? theme.colors.text.tertiary
          : theme.colors.text.primary,
        paddingVertical: multiline ? 8 : 0,
        textAlignVertical: multiline ? "top" : "center",
        minHeight: multiline ? sizeStyles.fontSize * numberOfLines : undefined,
      },
      inputStyle,
    ];
  };

  const renderFloatingLabel = () => {
    if (!label || variant === "none") return null;

    const therapeuticColors = getTherapeuticColor(
      therapeuticColor,
      500,
      isDarkMode,
    );
    const sizeStyles = getSizeStyles();

    const labelTop = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [
        sizeStyles.container.paddingVertical + sizeStyles.fontSize / 2,
        -10,
      ],
    });

    const labelFontSize = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [sizeStyles.fontSize, sizeStyles.fontSize * 0.8],
    });

    let labelColor = theme.colors.text.secondary;
    if (error) {
      labelColor = theme.colors.error[500];
    } else if (isFocused) {
      labelColor = therapeuticColors;
    }

    return (
      <Animated.View
        style={[
          styles.floatingLabelContainer,
          {
            top: labelTop,
            left: leftIcon
              ? sizeStyles.iconSize + 20
              : sizeStyles.container.paddingHorizontal,
          },
        ]}
        pointerEvents="none"
      >
        <Animated.Text
          style={[
            styles.floatingLabel,
            {
              fontSize: labelFontSize,
              color: labelColor,
              backgroundColor: theme.colors.background.card,
            },
          ]}
        >
          {label}
          {required && " *"}
        </Animated.Text>
      </Animated.View>
    );
  };

  const renderLabel = () => {
    if (!label || variant === "floating") return null;

    const therapeuticColors = getTherapeuticColor(
      therapeuticColor,
      500,
      isDarkMode,
    );
    let labelColor = theme.colors.text.secondary;

    if (error) {
      labelColor = theme.colors.error[500];
    } else if (isFocused) {
      labelColor = therapeuticColors;
    }

    return (
      <Text style={[styles.label, { color: labelColor }]}>
        {label}
        {required && " *"}
      </Text>
    );
  };

  const renderLeftIcon = () => {
    if (!leftIcon) return null;

    const sizeStyles = getSizeStyles();
    const iconColor = error
      ? theme.colors.error[500]
      : isFocused
        ? getTherapeuticColor(therapeuticColor, 500, isDarkMode)
        : theme.colors.text.tertiary;

    if (typeof leftIcon === "string") {
      return (
        <MentalHealthIcon
          name={leftIcon}
          size={sizeStyles.iconSize}
          color={iconColor}
          style={styles.leftIcon}
        />
      );
    }

    return React.cloneElement(leftIcon, {
      size: sizeStyles.iconSize,
      color: iconColor,
      style: [leftIcon.props.style, styles.leftIcon],
    });
  };

  const renderRightIcon = () => {
    const sizeStyles = getSizeStyles();
    const iconColor = error
      ? theme.colors.error[500]
      : theme.colors.text.tertiary;

    // Security toggle for password fields
    if (secureTextEntry) {
      return (
        <TouchableOpacity
          onPress={toggleSecureEntry}
          style={styles.rightIcon}
          accessibilityRole="button"
          accessibilityLabel={
            isSecureVisible ? "Hide password" : "Show password"
          }
        >
          <MentalHealthIcon
            name={isSecureVisible ? "Heart" : "Brain"}
            size={sizeStyles.iconSize}
            color={iconColor}
          />
        </TouchableOpacity>
      );
    }

    if (!rightIcon) return null;

    const IconComponent =
      typeof rightIcon === "string" ? (
        <MentalHealthIcon
          name={rightIcon}
          size={sizeStyles.iconSize}
          color={iconColor}
        />
      ) : (
        React.cloneElement(rightIcon, {
          size: sizeStyles.iconSize,
          color: iconColor,
        })
      );

    if (onRightIconPress) {
      return (
        <TouchableOpacity
          onPress={onRightIconPress}
          style={styles.rightIcon}
          accessibilityRole="button"
        >
          {IconComponent}
        </TouchableOpacity>
      );
    }

    return <View style={styles.rightIcon}>{IconComponent}</View>;
  };

  const renderHelperText = () => {
    if (!helperText && !errorMessage) return null;

    const text = error ? errorMessage : helperText;
    const color = error ? theme.colors.error[500] : theme.colors.text.tertiary;

    return <Text style={[styles.helperText, { color }]}>{text}</Text>;
  };

  const renderCharacterCount = () => {
    if (!maxLength || !value) return null;

    const count = value.length;
    const isNearLimit = count / maxLength > 0.8;
    const color = isNearLimit
      ? theme.colors.warning[500]
      : theme.colors.text.tertiary;

    return (
      <Text style={[styles.characterCount, { color }]}>
        {count}/{maxLength}
      </Text>
    );
  };

  return (
    <View style={[styles.wrapper, style]}>
      {variant !== "floating" && renderLabel()}

      <TouchableOpacity
        style={getContainerStyles()}
        onPress={focusInput}
        activeOpacity={1}
      >
        {renderLeftIcon()}

        <View style={styles.inputWrapper}>
          <TextInput
            ref={inputRef}
            style={getInputStyles()}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={
              variant === "floating" && (isFocused || !value) ? "" : placeholder
            }
            placeholderTextColor={theme.colors.text.placeholder}
            editable={!disabled}
            multiline={multiline}
            numberOfLines={multiline ? numberOfLines : 1}
            maxLength={maxLength}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry && !isSecureVisible}
            autoCapitalize={autoCapitalize}
            accessibilityLabel={accessibilityLabel || label}
            accessibilityHint={accessibilityHint}
            testID={testID}
            {...props}
          />
        </View>

        {renderRightIcon()}

        {variant === "floating" && renderFloatingLabel()}
      </TouchableOpacity>

      <View style={styles.bottomSection}>
        {renderHelperText()}
        {renderCharacterCount()}
      </View>
    </View>
  );
};

// Input Variants
export const FloatingLabelInput = (props) => (
  <Input {...props} variant="floating" />
);

export const FilledInput = (props) => <Input {...props} variant="filled" />;

export const OutlineInput = (props) => <Input {...props} variant="outline" />;

export const UnderlineInput = (props) => (
  <Input {...props} variant="underline" />
);

// Therapeutic Input Variants
export const TherapeuticInput = (props) => (
  <Input {...props} therapeuticColor={props.therapeuticColor || "calming"} />
);

export const CalmingInput = (props) => (
  <Input {...props} therapeuticColor="calming" />
);

export const NurturingInput = (props) => (
  <Input {...props} therapeuticColor="nurturing" />
);

// Specialized Input Types
export const PasswordInput = (props) => (
  <Input
    {...props}
    secureTextEntry
    keyboardType="default"
    autoCapitalize="none"
  />
);

export const EmailInput = (props) => (
  <Input
    {...props}
    keyboardType="email-address"
    autoCapitalize="none"
    autoCorrect={false}
  />
);

export const PhoneInput = (props) => (
  <Input {...props} keyboardType="phone-pad" autoCapitalize="none" />
);

export const SearchInput = (props) => (
  <Input {...props} leftIcon="Heart" placeholder="Search..." variant="filled" />
);

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  inputWrapper: {
    flex: 1,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    margin: 0,
    ...Platform.select({
      web: {
        outline: "none",
      },
    }),
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  floatingLabelContainer: {
    position: "absolute",
    paddingHorizontal: 4,
    zIndex: 1,
  },
  floatingLabel: {
    fontWeight: "500",
  },
  leftIcon: {
    marginRight: 12,
  },
  rightIcon: {
    marginLeft: 12,
    padding: 4,
  },
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    flex: 1,
  },
  characterCount: {
    fontSize: 12,
    marginLeft: 8,
  },
});

export default Input;
