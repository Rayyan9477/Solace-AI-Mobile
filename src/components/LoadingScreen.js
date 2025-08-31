import React from "react";
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Platform,
} from "react-native";

import { useTheme } from "../shared/theme/ThemeContext";

// Web-safe styled components using regular React Native styles
const createStyles = (theme) =>
  StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background.primary,
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: theme.colors.text.secondary,
      textAlign: "center",
    },
  });

const LoadingScreen = ({ text = "Loading..." }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary[500]} />
      <Text style={styles.loadingText}>{text}</Text>
    </View>
  );
};

export default LoadingScreen;
