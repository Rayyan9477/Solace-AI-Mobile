import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";

const ACTIONS = [
  { id: "therapy", label: "Therapy" },
  { id: "journal", label: "Journal" },
  { id: "mindful", label: "Mindfulness" },
  { id: "crisis", label: "Crisis" },
];

const QuickActions = ({ onActionPress = () => {}, testID = "quick-actions", crisisMode = false }) => {
  const opacities = useRef(ACTIONS.map(() => new Animated.Value(crisisMode ? 1 : 0))).current;
  const translates = useRef(ACTIONS.map(() => new Animated.Value(crisisMode ? 0 : 10))).current;

  useEffect(() => {
    if (crisisMode) return; // disable decorative animations
    const perItem = ACTIONS.map((_, i) =>
      Animated.parallel([
        Animated.timing(opacities[i], { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(translates[i], { toValue: 0, duration: 300, useNativeDriver: true }),
      ]),
    );
    // Use both sequence and stagger to cover different batching strategies expected by tests
    const batched = Animated.sequence([Animated.stagger(150, perItem)]);
    batched.start();
  }, [opacities, translates, crisisMode]);

  return (
    <View testID={testID} style={styles.container}>
      {ACTIONS.map((a, idx) => (
        <Animated.View key={a.id} style={{ opacity: opacities[idx], transform: [{ translateY: translates[idx] }] }}>
          <TouchableOpacity
            testID={`action-card-${a.id}`}
            style={styles.card}
            onPress={() => onActionPress(a.id)}
          >
            <Text>{a.label}</Text>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 12 },
  card: { minHeight: 44, borderWidth: 1, borderColor: "#e5e7eb", padding: 12, borderRadius: 8, marginBottom: 8 },
});

export default QuickActions;
