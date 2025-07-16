import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import Icon from '../common/Icon';
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
    icon: 'emoticon-outline',
    activeIcon: 'emoticon',
  },
  {
    id: 'chat',
    label: 'Chat',
    icon: 'message-text-outline',
    activeIcon: 'message-text',
  },
  {
    id: 'journal',
    label: 'Journal',
    icon: 'book-outline',
    activeIcon: 'book',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: 'account-outline',
    activeIcon: 'account',
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
            onPress={() =
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="{tabItem.label}"
        accessibilityHint="Double tap to activate"
      > handlePress(route, isFocused)}
            style={styles.tab}
            accessibilityRole="tab"
            accessibilityLabel={options.tabBarAccessibilityLabel}
            accessibilityState={{ selected: isFocused }}
          >
            <Icon
              name={isFocused ? tabItem.activeIcon : tabItem.icon}
              size={24}
              color={isFocused ? theme.colors.primary.main : theme.colors.text.secondary}
            />
            <Text
              style={[
                styles.label,
                {
                  color: isFocused ? theme.colors.primary.main : theme.colors.text.secondary,
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
    paddingBottom: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});

export default BottomTabBar;
