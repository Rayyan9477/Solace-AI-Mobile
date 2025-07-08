import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const Badge = ({
  label,
  variant = 'primary',
  size = 'medium',
  standalone = false,
  style,
  accessibilityLabel,
  onPress,
  animated = false,
  icon,
  iconPosition = 'left',
  dot = false,
  pulse = false,
  outline = false,
  max = 99,
}) => {
  const { theme } = useTheme();
  const [scaleValue] = useState(new Animated.Value(1));
  const [pulseValue] = useState(new Animated.Value(1));

  React.useEffect(() => {
    if (pulse) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }
  }, [pulse]);

  const handlePressIn = () => {
    if (animated && onPress) {
      Animated.spring(scaleValue, {
        toValue: 0.9,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (animated && onPress) {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  const getVariantStyles = () => {
    const baseColors = {
      success: { bg: theme.colors.success.light, text: theme.colors.success.dark },
      warning: { bg: theme.colors.warning.light, text: theme.colors.warning.dark },
      error: { bg: theme.colors.error.light, text: theme.colors.error.dark },
      info: { bg: theme.colors.info.light, text: theme.colors.info.dark },
      primary: { bg: theme.colors.primary.light, text: theme.colors.primary.dark },
    };

    const colors = baseColors[variant] || baseColors.primary;
    
    if (outline) {
      return {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.bg,
        color: colors.bg,
      };
    }

    return {
      backgroundColor: colors.bg,
      color: colors.text,
    };
  };

  const getSizeStyles = () => {
    if (dot) {
      switch (size) {
        case 'small':
          return { width: 8, height: 8, borderRadius: 4 };
        case 'large':
          return { width: 16, height: 16, borderRadius: 8 };
        default:
          return { width: 12, height: 12, borderRadius: 6 };
      }
    }

    switch (size) {
      case 'small':
        return {
          paddingVertical: 2,
          paddingHorizontal: 6,
          borderRadius: 8,
          minWidth: 16,
          height: 16,
          fontSize: 10,
        };
      case 'large':
        return {
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderRadius: 16,
          minWidth: 32,
          height: 32,
          fontSize: 14,
        };
      default:
        return {
          paddingVertical: 4,
          paddingHorizontal: 8,
          borderRadius: 12,
          minWidth: 24,
          height: 24,
          fontSize: 12,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  // Format label for numeric badges
  const formatLabel = (label) => {
    if (typeof label === 'number' && label > max) {
      return `${max}+`;
    }
    return label?.toString() || '';
  };

  const Container = onPress ? TouchableOpacity : View;
  const displayLabel = formatLabel(label);

  if (dot) {
    return (
      <Animated.View
        style={[
          styles.dot,
          sizeStyles,
          { backgroundColor: variantStyles.backgroundColor },
          standalone && styles.standalone,
          { transform: [{ scale: pulse ? pulseValue : 1 }] },
          style,
        ]}
        accessibilityLabel={accessibilityLabel || 'Status indicator'}
        accessibilityRole="text"
      />
    );
  }

  return (
    <Animated.View
      style={{
        transform: [
          { scale: animated ? scaleValue : 1 },
          { scale: pulse ? pulseValue : 1 },
        ],
      }}
    >
      <Container
        style={[
          styles.container,
          {
            backgroundColor: variantStyles.backgroundColor,
            borderColor: variantStyles.borderColor,
            borderWidth: variantStyles.borderWidth || 0,
          },
          sizeStyles,
          standalone && styles.standalone,
          style,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityLabel={accessibilityLabel || `${displayLabel} badge`}
        accessibilityRole={onPress ? 'button' : 'text'}
        accessibilityHint={onPress ? 'Double tap to interact' : undefined}
      >
        {icon && iconPosition === 'left' && (
          <Text style={[styles.icon, { color: variantStyles.color }]}>
            {icon}
          </Text>
        )}
        
        {!dot && (
          <Text
            style={[
              styles.text,
              {
                color: variantStyles.color,
                fontSize: sizeStyles.fontSize,
              },
            ]}
            numberOfLines={1}
          >
            {displayLabel}
          </Text>
        )}
        
        {icon && iconPosition === 'right' && (
          <Text style={[styles.icon, { color: variantStyles.color }]}>
            {icon}
          </Text>
        )}
      </Container>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  standalone: {
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  icon: {
    marginHorizontal: 2,
  },
  dot: {
    borderRadius: 50,
  },
});

export default Badge;
