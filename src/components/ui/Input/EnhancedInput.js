import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  I18nManager,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../../contexts/ThemeContext';
import { BaseDesignTokens } from '../../../design-system/DesignTokens';

const EnhancedInput = ({
  label,
  value,
  onChangeText,
  onBlur,
  onFocus,
  placeholder,
  placeholderTextColor,
  variant = 'default',
  size = 'medium',
  disabled = false,
  readOnly = false,
  required = false,
  error,
  success,
  helperText,
  maxLength,
  multiline = false,
  numberOfLines = 1,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
  autoFocus = false,
  returnKeyType = 'done',
  leftIcon,
  rightIcon,
  onLeftIconPress,
  onRightIconPress,
  clearable = false,
  onClear,
  therapeuticTheme,
  withAnimation = true,
  animationDuration = 200,
  borderRadius,
  backgroundColor,
  borderColor,
  focusColor,
  textColor,
  labelColor,
  style,
  inputStyle,
  labelStyle,
  helperTextStyle,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const { theme, isReducedMotionEnabled } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef(null);
  const focusAnim = useRef(new Animated.Value(0)).current;
  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Animate focus state
  useEffect(() => {
    if (!isReducedMotionEnabled && withAnimation) {
      Animated.timing(focusAnim, {
        toValue: isFocused ? 1 : 0,
        duration: animationDuration,
        useNativeDriver: false,
      }).start();

      // Label animation
      if (label && variant === 'floating') {
        Animated.timing(labelAnim, {
          toValue: isFocused || value ? 1 : 0,
          duration: animationDuration,
          useNativeDriver: false,
        }).start();
      }
    }
  }, [isFocused, value, isReducedMotionEnabled, withAnimation]);

  const handleFocus = (e) => {
    setIsFocused(true);
    
    if (withAnimation && !isReducedMotionEnabled) {
      Animated.timing(scaleAnim, {
        toValue: 1.02,
        duration: animationDuration / 2,
        useNativeDriver: true,
      }).start();
    }
    
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    
    if (withAnimation && !isReducedMotionEnabled) {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: animationDuration / 2,
        useNativeDriver: true,
      }).start();
    }
    
    onBlur?.(e);
  };

  const handleClear = () => {
    onChangeText?.('');
    onClear?.();
    
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const getVariantStyles = () => {
    const tokens = BaseDesignTokens;
    
    if (therapeuticTheme) {
      const therapeuticColors = tokens.colors.therapeutic[therapeuticTheme];
      return {
        borderColor: error 
          ? tokens.colors.error[500]
          : success
          ? tokens.colors.success[500]
          : isFocused
          ? therapeuticColors?.[500] || tokens.colors.primary[500]
          : therapeuticColors?.[200] || tokens.colors.border.primary,
        backgroundColor: backgroundColor || therapeuticColors?.[50] || tokens.colors.background.input,
      };
    }

    switch (variant) {
      case 'outline':
        return {
          borderWidth: 2,
          borderColor: error 
            ? tokens.colors.error[500]
            : success
            ? tokens.colors.success[500]
            : isFocused
            ? focusColor || tokens.colors.primary[500]
            : borderColor || tokens.colors.border.primary,
          backgroundColor: backgroundColor || 'transparent',
        };
      case 'filled':
        return {
          borderWidth: 0,
          backgroundColor: error
            ? tokens.colors.error[50]
            : success
            ? tokens.colors.success[50]
            : backgroundColor || tokens.colors.background.input,
          borderBottomWidth: 2,
          borderBottomColor: error
            ? tokens.colors.error[500]
            : success
            ? tokens.colors.success[500]
            : isFocused
            ? focusColor || tokens.colors.primary[500]
            : 'transparent',
        };
      case 'underlined':
        return {
          borderWidth: 0,
          backgroundColor: 'transparent',
          borderBottomWidth: isFocused ? 2 : 1,
          borderBottomColor: error
            ? tokens.colors.error[500]
            : success
            ? tokens.colors.success[500]
            : isFocused
            ? focusColor || tokens.colors.primary[500]
            : borderColor || tokens.colors.border.primary,
        };
      case 'floating':
        return {
          borderWidth: 1,
          borderColor: error 
            ? tokens.colors.error[500]
            : success
            ? tokens.colors.success[500]
            : isFocused
            ? focusColor || tokens.colors.primary[500]
            : borderColor || tokens.colors.border.primary,
          backgroundColor: backgroundColor || tokens.colors.background.input,
        };
      default:
        return {
          borderWidth: 1,
          borderColor: error 
            ? tokens.colors.error[500]
            : success
            ? tokens.colors.success[500]
            : isFocused
            ? focusColor || tokens.colors.primary[500]
            : borderColor || tokens.colors.border.primary,
          backgroundColor: backgroundColor || tokens.colors.background.input,
        };
    }
  };

  const getSizeStyles = () => {
    const tokens = BaseDesignTokens;
    
    switch (size) {
      case 'small':
        return {
          paddingVertical: tokens.spacing[2],
          paddingHorizontal: tokens.spacing[3],
          fontSize: tokens.typography.sizes.sm,
          minHeight: 36,
          borderRadius: borderRadius || tokens.borderRadius.sm,
        };
      case 'large':
        return {
          paddingVertical: tokens.spacing[4],
          paddingHorizontal: tokens.spacing[4],
          fontSize: tokens.typography.sizes.lg,
          minHeight: 52,
          borderRadius: borderRadius || tokens.borderRadius.lg,
        };
      default:
        return {
          paddingVertical: tokens.spacing[3],
          paddingHorizontal: tokens.spacing[4],
          fontSize: tokens.typography.sizes.base,
          minHeight: 44,
          borderRadius: borderRadius || tokens.borderRadius.base,
        };
    }
  };

  const getTextColor = () => {
    const tokens = BaseDesignTokens;
    
    if (disabled) {
      return tokens.colors.text.disabled;
    }
    
    if (textColor) {
      return textColor;
    }
    
    if (therapeuticTheme) {
      return tokens.colors.therapeutic[therapeuticTheme]?.[800] || tokens.colors.text.primary;
    }
    
    return tokens.colors.text.primary;
  };

  const getLabelColor = () => {
    const tokens = BaseDesignTokens;
    
    if (error) {
      return tokens.colors.error[600];
    }
    
    if (success) {
      return tokens.colors.success[600];
    }
    
    if (labelColor) {
      return labelColor;
    }
    
    if (therapeuticTheme) {
      return isFocused 
        ? tokens.colors.therapeutic[therapeuticTheme]?.[600] || tokens.colors.primary[600]
        : tokens.colors.text.secondary;
    }
    
    return isFocused 
      ? tokens.colors.primary[600] 
      : tokens.colors.text.secondary;
  };

  const getPlaceholderColor = () => {
    const tokens = BaseDesignTokens;
    
    if (placeholderTextColor) {
      return placeholderTextColor;
    }
    
    if (therapeuticTheme) {
      return tokens.colors.therapeutic[therapeuticTheme]?.[400] || tokens.colors.text.placeholder;
    }
    
    return tokens.colors.text.placeholder;
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const inputTextColor = getTextColor();
  const inputPlaceholderColor = getPlaceholderColor();

  const containerStyle = [
    styles.container,
    style,
  ];

  const inputContainerStyle = [
    styles.inputContainer,
    variantStyles,
    sizeStyles,
    disabled && styles.disabled,
    error && styles.error,
    success && styles.success,
  ];

  const textInputStyle = [
    styles.textInput,
    {
      color: inputTextColor,
      fontSize: sizeStyles.fontSize,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    multiline && {
      height: numberOfLines * 20 + sizeStyles.paddingVertical * 2,
      textAlignVertical: 'top',
    },
    inputStyle,
  ];

  const animatedInputStyle = withAnimation && !isReducedMotionEnabled ? {
    transform: [{ scale: scaleAnim }],
  } : {};

  const renderLabel = () => {
    if (!label) return null;

    if (variant === 'floating') {
      return (
        <Animated.Text
          style={[
            styles.floatingLabel,
            {
              color: getLabelColor(),
              transform: [
                {
                  translateY: labelAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -24],
                  }),
                },
                {
                  scale: labelAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0.85],
                  }),
                },
              ],
              left: sizeStyles.paddingHorizontal,
            },
            labelStyle,
          ]}
        >
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Animated.Text>
      );
    }

    return (
      <Text
        style={[
          styles.label,
          { color: getLabelColor() },
          labelStyle,
        ]}
      >
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
    );
  };

  const renderRightAccessory = () => {
    const accessories = [];

    // Clear button
    if (clearable && value && !disabled && !readOnly) {
      accessories.push(
        <TouchableOpacity
          key="clear"
          onPress={handleClear}
          style={styles.accessory}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          testID={`${testID}-clear-button`}
        >
          <Text style={styles.clearButton}>×</Text>
        </TouchableOpacity>
      );
    }

    // Password visibility toggle
    if (secureTextEntry) {
      accessories.push(
        <TouchableOpacity
          key="password"
          onPress={togglePasswordVisibility}
          style={styles.accessory}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          testID={`${testID}-password-toggle`}
        >
          <Text style={styles.passwordToggle}>
            {showPassword ? '🙈' : '👁️'}
          </Text>
        </TouchableOpacity>
      );
    }

    // Right icon
    if (rightIcon) {
      accessories.push(
        <TouchableOpacity
          key="right-icon"
          onPress={onRightIconPress}
          style={styles.accessory}
          disabled={!onRightIconPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          testID={`${testID}-right-icon`}
        >
          {rightIcon}
        </TouchableOpacity>
      );
    }

    return accessories.length > 0 ? (
      <View style={styles.rightAccessories}>
        {accessories}
      </View>
    ) : null;
  };

  const renderHelperText = () => {
    if (!helperText && !error && !success) return null;

    const text = error || success || helperText;
    const textColor = error 
      ? BaseDesignTokens.colors.error[600]
      : success 
      ? BaseDesignTokens.colors.success[600]
      : BaseDesignTokens.colors.text.secondary;

    return (
      <Text
        style={[
          styles.helperText,
          { color: textColor },
          helperTextStyle,
        ]}
      >
        {text}
      </Text>
    );
  };

  return (
    <View style={containerStyle}>
      {renderLabel()}
      
      <Animated.View style={[inputContainerStyle, animatedInputStyle]}>
        {leftIcon && (
          <TouchableOpacity
            onPress={onLeftIconPress}
            style={styles.leftAccessory}
            disabled={!onLeftIconPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            testID={`${testID}-left-icon`}
          >
            {leftIcon}
          </TouchableOpacity>
        )}
        
        <TextInput
          ref={inputRef}
          style={textInputStyle}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={variant === 'floating' && (isFocused || value) ? '' : placeholder}
          placeholderTextColor={inputPlaceholderColor}
          editable={!disabled && !readOnly}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          autoFocus={autoFocus}
          returnKeyType={returnKeyType}
          accessible={true}
          accessibilityLabel={accessibilityLabel || label}
          accessibilityHint={accessibilityHint}
          accessibilityState={{
            disabled: disabled,
          }}
          testID={testID || `input-${label}`}
        />
        
        {renderRightAccessory()}
      </Animated.View>
      
      {maxLength && (
        <Text style={styles.charCount}>
          {value?.length || 0}/{maxLength}
        </Text>
      )}
      
      {renderHelperText()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  floatingLabel: {
    position: 'absolute',
    fontSize: 14,
    fontWeight: '500',
    zIndex: 1,
    paddingHorizontal: 4,
    backgroundColor: 'transparent',
    top: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  textInput: {
    flex: 1,
    fontWeight: '400',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  leftAccessory: {
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightAccessories: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accessory: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
  clearButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
  },
  passwordToggle: {
    fontSize: 16,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 2,
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  required: {
    color: '#FF4444',
  },
  disabled: {
    opacity: 0.6,
  },
  error: {
    // Error styles handled in getVariantStyles
  },
  success: {
    // Success styles handled in getVariantStyles
  },
});

EnhancedInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChangeText: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  placeholder: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'outline', 'filled', 'underlined', 'floating']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.string,
  success: PropTypes.string,
  helperText: PropTypes.string,
  maxLength: PropTypes.number,
  multiline: PropTypes.bool,
  numberOfLines: PropTypes.number,
  secureTextEntry: PropTypes.bool,
  keyboardType: PropTypes.string,
  autoCapitalize: PropTypes.string,
  autoCorrect: PropTypes.bool,
  autoFocus: PropTypes.bool,
  returnKeyType: PropTypes.string,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  onLeftIconPress: PropTypes.func,
  onRightIconPress: PropTypes.func,
  clearable: PropTypes.bool,
  onClear: PropTypes.func,
  therapeuticTheme: PropTypes.oneOf([
    'calming', 'nurturing', 'peaceful', 'grounding', 
    'energizing', 'focus', 'mindful', 'balance'
  ]),
  withAnimation: PropTypes.bool,
  animationDuration: PropTypes.number,
  borderRadius: PropTypes.number,
  backgroundColor: PropTypes.string,
  borderColor: PropTypes.string,
  focusColor: PropTypes.string,
  textColor: PropTypes.string,
  labelColor: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  inputStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  labelStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  helperTextStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  accessibilityLabel: PropTypes.string,
  accessibilityHint: PropTypes.string,
  testID: PropTypes.string,
};

export default EnhancedInput;