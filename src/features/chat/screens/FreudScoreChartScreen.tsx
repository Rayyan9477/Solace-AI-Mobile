import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { palette } from "../../../shared/theme";

export function FreudScoreChartScreen(): React.ReactElement {
  const navigation = useNavigation();
  return (
    <View testID="freud-score-chart-screen" style={styles.container}>
      <TouchableOpacity
        testID="back-button"
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Freud Score Chart</Text>
      <Text style={styles.subtitle}>Coming Soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    borderColor: palette.brown[700],
    borderRadius: 20,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 44,
  },
  backIcon: { color: palette.white, fontSize: 20 },
  container: {
    backgroundColor: palette.brown[900],
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  subtitle: { color: palette.gray[400], fontSize: 16, marginTop: 8 },
  title: { color: palette.white, fontSize: 24, fontWeight: "700", marginTop: 20 },
});

export default FreudScoreChartScreen;
