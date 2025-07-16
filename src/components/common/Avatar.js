import React, { useCallback, useMemo, useState } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const Avatar = ({
  source,
  name,
  size = 'medium',
  variant = 'circle',
  style,
  accessibilityLabel,
  onPress,
  status,
  badge,
  borderColor,
  borderWidth = 0,
  animated = false,
  showInitials = true,
  backgroundColor,
  fallbackIcon = '👤',
}) => {
  const { theme } = useTheme();
  const [scaleValue] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    if (animated) {
      Animated.spring(scaleValue, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (animated) {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return theme.colors.success.main;
      case 'away':
        return theme.colors.warning.main;
      case 'busy':
        return theme.colors.error.main;
      case 'offline':
        return theme.colors.gray[400];
      default:
        return null;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          width: 44, height: 44,
          fontSize: 14,
        };
      case 'large':
        return {
          width: 64,
          height: 64,
          fontSize: 24,
        };
      case 'xlarge':
        return {
          width: 96,
          height: 96,
          fontSize: 36,
        };
      default: // medium
        return {
          width: 48,
          height: 48,
          fontSize: 18,
        };
    }
  };

  const sizeStyle = getSizeStyle();
  const borderRadius = variant === 'square' 
    ? theme.borderRadius.medium 
    : sizeStyle.width / 2;

  const getInitials = (name) => {
    if (!name) return fallbackIcon;
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const Container = onPress ? TouchableOpacity : View;
  const statusColor = getStatusColor();

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <Container
        style={[
          styles.container,
          {
            width: sizeStyle.width,
            height: sizeStyle.height,
            borderRadius,
            backgroundColor: backgroundColor || (source ? 'transparent' : theme.colors.primary.light),
            borderColor: borderColor,
            borderWidth: borderWidth,
          },
          style,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityLabel={accessibilityLabel || `${name}'s avatar${status ? `, status: ${status}` : ''}`}
        accessibilityRole={onPress ? 'button' : 'image'}
        accessibilityHint={onPress ? 'Double tap to view profile' : undefined}
      >
        {source ? (
          <Image
            source={source}
            style={[
              styles.image,
              { borderRadius },
            ]}
            accessibilityRole="none"
          / resizeMode="cover">
        ) : (
          <Text
            style={[
              styles.initials,
              {
                fontSize: sizeStyle.fontSize,
                color: theme.colors.primary.dark,
              },
            ]}
          >
            {showInitials ? getInitials(name) : fallbackIcon}
          </Text>
        )}

        {/* Status Indicator */}
        {status && statusColor && (
          <View
            style={[
              styles.statusIndicator,
              {
                backgroundColor: statusColor,
                width: sizeStyle.width * 0.25,
                height: sizeStyle.width * 0.25,
                borderRadius: (sizeStyle.width * 0.25) / 2,
                borderWidth: 2,
                borderColor: theme.colors.background.primary,
              },
            ]}
            accessibilityRole="text"
            accessibilityLabel={`Status: ${status}`}
          />
        )}

        {/* Badge */}
        {badge && (
          <View
            style={[
              styles.badge,
              {
                backgroundColor: badge.backgroundColor || theme.colors.error.main,
                minWidth: sizeStyle.width * 0.3,
                height: sizeStyle.width * 0.3,
                borderRadius: (sizeStyle.width * 0.3) / 2,
              },
            ]}
            accessibilityRole="text"
            accessibilityLabel={badge.accessibilityLabel || `Badge: ${badge.text || badge.count}`}
          >
            <Text
              style={[
                styles.badgeText,
                {
                  fontSize: sizeStyle.fontSize * 0.5,
                  color: badge.textColor || theme.colors.text.onPrimary,
                },
              ]}
            >
              {badge.text || badge.count}
            </Text>
          </View>
        )}
      </Container>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    fontWeight: '600',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Avatar;
