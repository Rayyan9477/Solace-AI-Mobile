import React from 'react';
import { Platform, View, TouchableOpacity } from 'react-native';
import Icon, { IconVariants, IconSizes } from './IconSystem';
import { useTheme } from '../../contexts/ThemeContext';

// Platform-specific icon configurations
const PlatformConfig = {
  ios: {
    defaultStrokeWidth: 1.5,
    cornerRadius: 'rounded',
    defaultVariant: IconVariants.OUTLINE,
    tabBarIconSize: 28,
    headerIconSize: 22,
  },
  android: {
    defaultStrokeWidth: 2,
    cornerRadius: 'sharp',
    defaultVariant: IconVariants.FILLED,
    tabBarIconSize: 24,
    headerIconSize: 20,
  },
  web: {
    defaultStrokeWidth: 1.5,
    cornerRadius: 'rounded',
    defaultVariant: IconVariants.OUTLINE,
    tabBarIconSize: 24,
    headerIconSize: 20,
  },
};

// Get platform-specific configuration
const getPlatformConfig = () => {
  return PlatformConfig[Platform.OS] || PlatformConfig.web;
};

// Platform-optimized icon component
const PlatformIcon = ({ 
  name,
  size,
  variant,
  strokeWidth,
  adaptToPlatform = true,
  ...props 
}) => {
  const { theme } = useTheme();
  const config = getPlatformConfig();

  // Apply platform-specific defaults if adaptation is enabled
  const finalProps = {
    name,
    size: size || 'md',
    variant: adaptToPlatform ? (variant || config.defaultVariant) : variant,
    strokeWidth: adaptToPlatform ? (strokeWidth || config.defaultStrokeWidth) : strokeWidth,
    ...props,
  };

  return <Icon {...finalProps} />;
};

// Platform-specific tab bar icon
export const TabBarIcon = ({ focused, ...props }) => {
  const { theme } = useTheme();
  const config = getPlatformConfig();

  return (
    <PlatformIcon
      size={config.tabBarIconSize}
      color={focused ? theme.colors.primary[500] : theme.colors.text.secondary}
      variant={focused ? IconVariants.FILLED : IconVariants.OUTLINE}
      {...props}
    />
  );
};

// Platform-specific header icon
export const HeaderIcon = (props) => {
  const config = getPlatformConfig();

  return (
    <PlatformIcon
      size={config.headerIconSize}
      colorScheme="muted"
      {...props}
    />
  );
};

// Accessibility-enhanced icon
export const AccessibleIcon = ({ 
  accessibilityLabel,
  accessibilityHint,
  children,
  ...props 
}) => {
  return (
    <View
      accessible={true}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
    >
      <PlatformIcon {...props} />
    </View>
  );
};

// Touchable icon for interactive elements
export const TouchableIcon = ({ 
  onPress,
  accessibilityLabel,
  accessibilityHint,
  style,
  ...props 
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          padding: 8,
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
          minWidth: 44,
          minHeight: 44,
        },
        style,
      ]}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      activeOpacity={0.7}
    >
      <PlatformIcon {...props} />
    </TouchableOpacity>
  );
};

// Icon with platform-specific loading state
export const LoadingIcon = ({ isLoading, loadingColor, ...props }) => {
  const { theme } = useTheme();

  if (isLoading) {
    // Show a simple loading indicator
    return (
      <PlatformIcon
        name="mindfulness"
        variant={IconVariants.OUTLINE}
        color={loadingColor || theme.colors.text.secondary}
        {...props}
      />
    );
  }

  return <PlatformIcon {...props} />;
};

export default PlatformIcon;
export { getPlatformConfig, PlatformConfig };