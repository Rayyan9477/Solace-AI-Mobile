import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../shared/theme/ThemeContext';
import { NavigationIcon } from '../icons';
import { typography, spacing } from '../../shared/theme/theme';
import * as Haptics from 'expo-haptics';

const TAB_ITEMS = [
  {
    id: 'home',
    label: 'Home',
    icon: 'home',
    activeIcon: 'home',
  },
  {
    id: 'mood',
    label: 'Mood',
    icon: 'heart',
    activeIcon: 'heart',
  },
  {
    id: 'chat',
    label: 'Chat',
    icon: 'chat',
    activeIcon: 'chat',
  },
  {
    id: 'journal',
    label: 'Journal',
    icon: 'journal',
    activeIcon: 'journal',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: 'profile',
    activeIcon: 'profile',
  },
];

const BottomTabBar = ({
  state,
  descriptors,
  navigation,
}) => {
  const { theme } = useTheme();

  const handlePress = (route, isFocused) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      navigation.navigate(route.name);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background.surface,
          borderTopColor: theme.colors.border.main,
        },
      ]}
      accessibilityRole="tablist"
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const tabItem = TAB_ITEMS.find(item => item.id === route.name.toLowerCase()) || TAB_ITEMS[0];

        return (
          <Pressable
            key={route.key}
            onPress={() => handlePress(route, isFocused)}
            accessible={true}
            accessibilityRole="tab"
            accessibilityLabel={tabItem.label}
            accessibilityHint={`Navigate to ${tabItem.label} screen`}
            accessibilityState={{ selected: isFocused }}
            style={[styles.tab, { minWidth: 44, minHeight: 44 }]}
          >
            <NavigationIcon
              name={isFocused ? tabItem.activeIcon : tabItem.icon}
              size={24}
              variant={isFocused ? "filled" : "outline"}
              color={isFocused ? theme.colors.primary.main : theme.colors.text.secondary}
            />
            <Text
              style={[
                styles.label,
                {
                  color: isFocused ? theme.colors.primary.main : theme.colors.text.secondary,
                  fontSize: typography.sizes.xs,
                  fontWeight: isFocused ? typography.weights.semiBold : typography.weights.medium,
                },
              ]}
            >
              {tabItem.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingBottom: spacing[2],
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  label: {
    marginTop: spacing[1],
  },
});

export default BottomTabBar;
