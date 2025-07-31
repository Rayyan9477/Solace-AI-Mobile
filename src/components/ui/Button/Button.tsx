import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../../shared/contexts/ThemeContext';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  fullWidth?: boolean;
  withHaptics?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  animationDuration?: number;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

const Button: React.FC<ButtonProps> = ({
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
          backgroundColor: theme.colors.secondary.main,
          borderColor: theme.colors.secondary.border,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: theme.colors.primary.main,
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
          backgroundColor: theme.colors.primary.main,
          borderColor: theme.colors.primary.border,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: theme.colors.borderRadius?.small || 8,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: theme.colors.borderRadius?.large || 16,
        };
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: theme.colors.borderRadius?.medium || 12,
        };
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      style={[
        styles.button,
        { shadowColor: theme.colors.shadow || theme.colors.gray[900] },
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
          <ActivityIndicator size="small" color={theme.colors.text.onPrimary} />
        ) : (
          icon && iconPosition === 'left' && icon
        )}
        <Text
          style={[
            styles.text,
            { color: variant === 'text' ? theme.colors.primary.main : theme.colors.text.onPrimary },
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

export default Button;