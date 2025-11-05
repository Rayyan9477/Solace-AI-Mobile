/**
 * BottomTabBar Component
 * Simple tab bar for navigation
 */

import PropTypes from "prop-types";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const BottomTabBar = ({ state, navigation }) => {
  const { index, routes } = state;

  const handleTabPress = (route) => {
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

BottomTabBar.propTypes = {
  state: PropTypes.shape({
    index: PropTypes.number.isRequired,
    routes: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

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
