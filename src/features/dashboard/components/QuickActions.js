import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const ACTIONS = [
  { id: "therapy", label: "Therapy" },
  { id: "journal", label: "Journal" },
  { id: "mindful", label: "Mindfulness" },
  { id: "crisis", label: "Crisis" },
];

const QuickActions = ({ onActionPress = () => {}, testID = "quick-actions" }) => {
  return (
    <View testID={testID} style={styles.container}>
      {ACTIONS.map((a) => (
        <TouchableOpacity
          key={a.id}
          testID={`action-card-${a.id}`}
          style={styles.card}
          onPress={() => onActionPress(a.id)}
        >
          <Text>{a.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 12 },
  card: { minHeight: 44, borderWidth: 1, borderColor: "#e5e7eb", padding: 12, borderRadius: 8, marginBottom: 8 },
});

export default QuickActions;
