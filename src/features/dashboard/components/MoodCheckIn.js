import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const MoodCheckIn = ({ currentMood, onCheckIn = () => {}, testID = "mood-check-in", accessibilityLabel, accessibilityHint }) => {
  return (
    <View
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || "Mood check-in component"}
      accessibilityHint={accessibilityHint || "Select your current mood to track your emotional state"}
      accessibilityValue={{ text: currentMood || "" }}
      style={styles.container}
    >
      <Text style={styles.title}>How are you feeling?</Text>
      <TouchableOpacity
        testID="mood-check-in-button"
        onPress={() => onCheckIn(currentMood || "happy")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Log Mood</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  button: { minWidth: 44, minHeight: 44, backgroundColor: "#2196F3", borderRadius: 8, alignItems: "center", justifyContent: "center" },
  buttonText: { color: "#fff", fontWeight: "600" },
});

export default MoodCheckIn;
