import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const Avatar = ({
  source,
  name,
  size = 'medium',
  variant = 'circle',
  style,
  accessibilityLabel,
}) => {
  const { theme } = useTheme();

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          width: 32,
          height: 32,
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
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: sizeStyle.width,
          height: sizeStyle.height,
          borderRadius,
          backgroundColor: source ? 'transparent' : theme.colors.primary.light,
        },
        style,
      ]}
      accessibilityLabel={accessibilityLabel || `${name}'s avatar`}
      accessibilityRole="image"
    >
      {source ? (
        <Image
          source={source}
          style={[
            styles.image,
            { borderRadius },
          ]}
          accessibilityRole="none"
        />
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
          {getInitials(name)}
        </Text>
      )}
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
    width: '100%',
    height: '100%',
  },
  initials: {
    fontWeight: '600',
  },
});

export default Avatar;
