import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const TabButton = ({ label, active, onPress, testID }) => (
  <TouchableOpacity onPress={onPress} testID={testID} style={styles.tab}>
    <Text testID={`icon-${label.toLowerCase()}`} style={[styles.label, active && styles.active]}>
      {label}
    </Text>
    {active ? <View testID={`tab-${label.toLowerCase()}-active`} style={styles.indicator} /> : null}
  </TouchableOpacity>
);

const BottomTabBar = ({ state = { index: 0, routes: [] }, navigation = {} }) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => (
        <TabButton
          key={route.key || route.name}
          label={route.name}
          active={state.index === index}
          onPress={() => navigation?.navigate?.(route.name)}
          testID={`tab-${route.name.toLowerCase()}`}
        />)
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", borderTopWidth: 1, borderTopColor: "#e5e7eb" },
  tab: { flex: 1, padding: 10, alignItems: "center" },
  label: { fontWeight: "600" },
  active: { color: "#2563eb" },
  indicator: { marginTop: 4, width: 24, height: 3, borderRadius: 2, backgroundColor: "#2563eb" },
});

export default BottomTabBar;
