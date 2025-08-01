import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../contexts/ThemeContext';

const Button = ({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  withHaptics = true,
  loading = false,
  icon,
  iconPosition = 'left',
  animationDuration = 150,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const { theme, isReducedMotionEnabled } = useTheme();
  const [scaleValue] = React.useState(new Animated.Value(1));

  const handlePressIn = () => {
    if (!isReducedMotionEnabled) {
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: animationDuration,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!isReducedMotionEnabled) {
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      if (withHaptics) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      onPress?.();
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: theme.colors.secondary[500],
          borderColor: theme.colors.border.secondary,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: theme.colors.primary[500],
          borderWidth: 2,
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          elevation: 0,
          shadowOpacity: 0,
        };
      default:
        return {
          backgroundColor: theme.colors.primary[500],
          borderColor: theme.colors.border.primary,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: theme.borderRadius?.sm || 8,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: theme.borderRadius?.lg || 16,
        };
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: theme.borderRadius?.md || 12,
        };
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      style={[
        styles.button,
        { shadowColor: theme.colors.gray[900] },
        getVariantStyles(),
        getSizeStyles(),
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        { minWidth: 44, minHeight: 44 }
      ]}
      accessible={true}
      accessibilityRole="button"
      testID={testID || `button-${title}`}
      accessibilityLabel={accessibilityLabel || `${title} button`}
      accessibilityHint={accessibilityHint || 'Double tap to activate'}
      accessibilityState={{ 
        disabled,
        busy: loading,
      }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        {loading ? (
          <ActivityIndicator size="small" color={theme.colors.text.inverse} />
        ) : (
          icon && iconPosition === 'left' && icon
        )}
        <Text
          style={[
            styles.text,
            { color: variant === 'text' ? theme.colors.primary[500] : theme.colors.text.inverse },
            disabled && styles.textDisabled,
          ]}
        >
          {loading ? 'Loading...' : title}
        </Text>
        {loading ? null : icon && iconPosition === 'right' && icon}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  textDisabled: {
    opacity: 0.5,
  },
});

Button.propTypes = {
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'text']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  withHaptics: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  animationDuration: PropTypes.number,
  accessibilityLabel: PropTypes.string,
  accessibilityHint: PropTypes.string,
  testID: PropTypes.string,
};

Button.defaultProps = {
  variant: 'primary',
  size: 'medium',
  disabled: false,
  fullWidth: false,
  withHaptics: true,
  loading: false,
  icon: null,
  iconPosition: 'left',
  animationDuration: 150,
  accessibilityLabel: null,
  accessibilityHint: null,
  testID: null,
};

export default Button;
