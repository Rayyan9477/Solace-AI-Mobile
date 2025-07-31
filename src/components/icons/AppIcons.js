import React from 'react';
import { View, Text, Platform } from 'react-native';
import Icon, { IconVariants, IconSizes } from './IconSystem';
import { useTheme } from '../../contexts/ThemeContext';

// App-specific icon presets with therapeutic colors
const AppIcons = {
  // Navigation icons with semantic meanings
  Navigation: {
    Home: (props) => (
      <Icon name="home" {...props} />
    ),
    Chat: (props) => (
      <Icon name="chat" {...props} />
    ),
    Mood: (props) => (
      <Icon name="mood" {...props} />
    ),
    Assessment: (props) => (
      <Icon name="assessment" {...props} />
    ),
    Profile: (props) => (
      <Icon name="profile" {...props} />
    ),
    Welcome: (props) => (
      <Icon name="brain" {...props} />
    ),
  },

  // Mental Health specific icons with therapeutic intent
  MentalHealth: {
    Brain: (props) => (
      <Icon name="brain" {...props} />
    ),
    Heart: (props) => (
      <Icon name="heart" {...props} />
    ),
    Mindfulness: (props) => (
      <Icon name="mindfulness" {...props} />
    ),
    Therapy: (props) => (
      <Icon name="therapy" {...props} />
    ),
    Meditation: (props) => (
      <Icon name="meditation" {...props} />
    ),
    Journal: (props) => (
      <Icon name="journal" {...props} />
    ),
    Insights: (props) => (
      <Icon name="insights" {...props} />
    ),
  },

  // Action icons for user interactions
  Actions: {
    Add: (props) => (
      <Icon name="plus" {...props} />
    ),
    Next: (props) => (
      <Icon name="chevronRight" {...props} />
    ),
    Expand: (props) => (
      <Icon name="chevronDown" {...props} />
    ),
    Close: (props) => (
      <Icon name="close" {...props} />
    ),
    Settings: (props) => (
      <Icon name="settings" {...props} />
    ),
  },

  // Status and feedback icons
  Status: {
    Success: (props) => (
      <Icon name="check" {...props} />
    ),
    Warning: (props) => (
      <Icon name="alert" {...props} />
    ),
    Info: (props) => (
      <Icon name="info" {...props} />
    ),
  },
};

// Themed icon component with automatic color assignment
const ThemedIcon = ({ 
  category, 
  name, 
  variant = IconVariants.OUTLINE,
  size = 'md',
  colorScheme = 'default',
  ...props 
}) => {
  const { theme } = useTheme();

  // Color schemes for different contexts
  const colorSchemes = {
    default: theme.colors.text.primary,
    primary: theme.colors.primary[500],
    secondary: theme.colors.secondary[500],
    success: theme.colors.success[500],
    warning: theme.colors.warning[500],
    error: theme.colors.error[500],
    muted: theme.colors.text.secondary,
    inverse: theme.colors.text.inverse,
    // Therapeutic color schemes
    calming: theme.colors.therapeutic.calming[500],
    nurturing: theme.colors.therapeutic.nurturing[500],
    peaceful: theme.colors.therapeutic.peaceful[500],
    grounding: theme.colors.therapeutic.grounding[500],
    energizing: theme.colors.therapeutic.energizing[500],
  };

  const color = props.color || colorSchemes[colorScheme];
  const IconComponent = AppIcons[category]?.[name];

  if (!IconComponent) {
    return <Icon name="info" size={size} color={color} variant={variant} {...props} />;
  }

  return (
    <IconComponent
      size={size}
      color={color}
      variant={variant}
      {...props}
    />
  );
};

// Quick access components for common patterns
export const NavigationIcon = (props) => (
  <ThemedIcon category="Navigation" {...props} />
);

export const MentalHealthIcon = (props) => (
  <ThemedIcon category="MentalHealth" colorScheme="calming" {...props} />
);

export const ActionIcon = (props) => (
  <ThemedIcon category="Actions" colorScheme="primary" {...props} />
);

export const StatusIcon = (props) => (
  <ThemedIcon category="Status" {...props} />
);

// Icon with badge for notifications/counts
export const BadgedIcon = ({ 
  badge, 
  badgeColor, 
  badgeTextColor,
  children,
  ...props 
}) => {
  const { theme } = useTheme();
  
  return (
    <View style={{ position: 'relative' }}>
      {children}
      {badge && (
        <View
          style={{
            position: 'absolute',
            top: -6,
            right: -6,
            backgroundColor: badgeColor || theme.colors.error[500],
            borderRadius: 10,
            minWidth: 20,
            height: 20,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 4,
          }}
        >
          <Text
            style={{
              color: badgeTextColor || theme.colors.text.inverse,
              fontSize: 12,
              fontWeight: '600',
              textAlign: 'center',
            }}
          >
            {badge > 99 ? '99+' : badge}
          </Text>
        </View>
      )}
    </View>
  );
};

// Animated icon wrapper (for future use)
export const AnimatedIcon = ({ 
  animation = 'pulse',
  duration = 1000,
  children,
  ...props 
}) => {
  // TODO: Implement animations
  return children;
};

export default ThemedIcon;
export { AppIcons, IconVariants, IconSizes };