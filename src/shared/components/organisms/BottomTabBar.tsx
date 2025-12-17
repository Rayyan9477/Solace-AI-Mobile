/**
 * BottomTabBar Component
 * Simple tab bar for navigation
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

// LOW-002 FIX: Replace PropTypes with TypeScript interfaces
interface TabRoute {
  key: string;
  name: string;
}

interface TabState {
  index: number;
  routes: TabRoute[];
}

interface NavigationProp {
  navigate: (name: string) => void;
}

interface BottomTabBarProps {
  state: TabState;
  navigation: NavigationProp;
}

const BottomTabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const { index, routes } = state;

  const handleTabPress = (route: TabRoute) => {
    navigation.navigate(route.name);
  };

  return (
    <View style={styles.container} testID="bottom-tab-bar">
      {routes.map((route, routeIndex) => (
        <TouchableOpacity
          key={route.key}
          style={[styles.tab, index === routeIndex && styles.activeTab]}
          onPress={() => handleTabPress(route)}
          testID={`tab-${route.key}`}
          accessibilityRole="tab"
          accessibilityState={{ selected: index === routeIndex }}
          accessibilityLabel={`${route.name} tab`}
          // LOW-003 FIX: Add accessibilityHint for better screen reader support
          accessibilityHint={`Double tap to navigate to ${route.name}`}
        >
          <Text
            style={[
              styles.tabText,
              index === routeIndex && styles.activeTabText,
            ]}
          >
            {route.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// LOW-002 FIX: Add displayName for debugging
BottomTabBar.displayName = "BottomTabBar";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingBottom: 20, // Account for safe area
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    backgroundColor: "#F3F4F6",
  },
  tabText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#2563EB",
    fontWeight: "600",
  },
});

export default BottomTabBar;
