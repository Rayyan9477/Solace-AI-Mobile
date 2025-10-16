/**
 * Avatar Component
 * A user avatar component with initials, status indicators, and accessibility features
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { useTheme } from '../../shared/theme/ThemeContext';

const Avatar = ({
  name = '',
  size = 40,
  status,
  badge,
  fallbackIcon = '👤',
  onPress,
  style,
  accessibilityLabel,
  testID,
  ...props
}) => {
  const { theme } = useTheme();

  const getInitials = (fullName) => {
    if (!fullName || fullName.trim() === '') {
      return '';
    }

    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }

    return (names[0].charAt(0) + names.at(-1).charAt(0)).toUpperCase();
  };

  const getStatusColor = (statusType) => {
    switch (statusType) {
      case 'online':
        return theme.colors.success?.main || '#4CAF50';
      case 'away':
        return theme.colors.warning?.main || '#FF9800';
      case 'offline':
        return theme.colors.gray?.[400] || '#BDBDBD';
      case 'busy':
        return theme.colors.error?.main || '#F44336';
      default:
        return theme.colors.gray?.[400] || '#BDBDBD';
    }
  };

  const initials = getInitials(name);
  const displayText = initials || fallbackIcon;

  const avatarContent = (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Text style={[styles.text, { fontSize: size * 0.4 }]}>
        {displayText}
      </Text>

      {status && (
        <View
          style={[
            styles.statusIndicator,
            {
              backgroundColor: getStatusColor(status),
              borderColor: theme.colors.background?.surface || '#FFFFFF',
            },
          ]}
          accessibilityLabel={`Status: ${status}`}
          testID="avatar-status"
        />
      )}

      {badge && badge.count > 0 && (
        <View
          style={[
            styles.badge,
            {
              backgroundColor: theme.colors.error?.main || '#F44336',
              minWidth: Math.max(size * 0.3, 16),
            },
          ]}
          accessibilityLabel={`Badge: ${badge.count}`}
          testID="avatar-badge"
        >
          <Text style={[styles.badgeText, { fontSize: size * 0.2 }]}>
            {badge.count > 99 ? '99+' : badge.count.toString()}
          </Text>
        </View>
      )}
    </View>
  );

  const accessibilityProps = {
    accessibilityLabel: accessibilityLabel || `${name || 'User'}'s avatar${status ? `, status: ${status}` : ''}`,
    accessibilityRole: onPress ? 'button' : 'image',
    accessible: true,
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={styles.touchable}
        testID={testID}
        {...accessibilityProps}
        {...props}
      >
        {avatarContent}
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={styles.touchable}
      testID={testID}
      {...accessibilityProps}
      {...props}
    >
      {avatarContent}
    </View>
  );
};

const styles = StyleSheet.create({
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  text: {
    color: '#1976D2',
    fontWeight: '600',
    textAlign: 'center',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

Avatar.propTypes = {
  name: PropTypes.string,
  size: PropTypes.number,
  status: PropTypes.oneOf(['online', 'away', 'offline', 'busy']),
  badge: PropTypes.shape({
    count: PropTypes.number,
  }),
  fallbackIcon: PropTypes.string,
  onPress: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  accessibilityLabel: PropTypes.string,
  testID: PropTypes.string,
};

export default Avatar;