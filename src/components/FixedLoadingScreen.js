import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";

import { useFixedTheme } from "./FixedThemeProvider";

const FixedLoadingScreen = ({ text = "Loading..." }) => {
  const { theme } = useFixedTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <ActivityIndicator 
        size="large" 
        color={theme.colors.primary || "#926247"} 
      />
      <Text style={[styles.text, { color: theme.colors.text?.secondary || "#6B7280" }]}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
  },
});

export default FixedLoadingScreen;