import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const SimpleCoverScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌟 Solace AI</Text>
      <Text style={styles.subtitle}>Your empathetic digital confidant</Text>
      <Text style={styles.description}>
        Welcome to your mental health companion app
      </Text>

      <View style={styles.featuresContainer}>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>🧠</Text>
          <Text style={styles.featureText}>AI-Powered Support</Text>
        </View>

        <View style={styles.feature}>
          <Text style={styles.featureIcon}>💚</Text>
          <Text style={styles.featureText}>Mental Wellness</Text>
        </View>

        <View style={styles.feature}>
          <Text style={styles.featureIcon}>🔒</Text>
          <Text style={styles.featureText}>Privacy First</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0f9ff",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#64748b",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 24,
  },
  featuresContainer: {
    width: "100%",
    marginBottom: 32,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SimpleCoverScreen;
