/**
 * Avatar Component
 * Common avatar component for backwards compatibility with tests
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../shared/theme/ThemeContext';

const Avatar = ({
  source,
  size = 'medium',
  label,
  backgroundColor,
  textColor,
  style,
  testID,
}) => {
  const { theme } = useTheme();

  const getSizeValue = () => {
    switch (size) {
      case 'small':
        return 32;
      case 'large':
        return 64;
      case 'xlarge':
        return 96;
      default:
        return 48;
    }
  };

  const sizeValue = getSizeValue();
  const fontSize = sizeValue * 0.4;

  const containerStyle = {
    width: sizeValue,
    height: sizeValue,
    borderRadius: sizeValue / 2,
    backgroundColor: backgroundColor || theme.colors.primary?.light || '#E3F2FD',
  };

  const renderContent = () => {
    if (source) {
      return (
        <Image
          source={source}
          style={[styles.image, { width: sizeValue, height: sizeValue, borderRadius: sizeValue / 2 }]}
          testID={`${testID}-image`}
        />
      );
    }

    if (label) {
      const initials = label
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      return (
        <Text
          style={[
            styles.text,
            {
              fontSize,
              color: textColor || theme.colors.text?.inverse || '#FFFFFF',
            },
          ]}
          testID={`${testID}-text`}
        >
          {initials}
        </Text>
      );
    }

    return null;
  };

  return (
    <View style={[styles.container, containerStyle, style]} testID={testID || 'avatar'}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  text: {
    fontWeight: '600',
  },
});

export default Avatar;
