import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { useFixedTheme } from "./FixedThemeProvider";
import Card from "./common/Card";

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  color, 
  onPress,
  style = {},
  ...props 
}) => {
  const { theme } = useFixedTheme();

  return (
    <Card
      style={[styles.card, style]}
      onPress={onPress}
      animated={!!onPress}
      {...props}
    >
      <View
        style={[
          styles.iconContainer,
          { 
            backgroundColor: (color || theme.colors.primary) + "20" 
          },
        ]}
      >
        <Text style={styles.icon}>{icon}</Text>
      </View>

      <Text
        style={[
          styles.title,
          { color: theme.colors.text?.primary || "#111827" },
        ]}
      >
        {title}
      </Text>

      <Text
        style={[
          styles.description,
          { color: theme.colors.text?.secondary || "#6B7280" },
        ]}
      >
        {description}
      </Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    padding: 24,
    margin: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
});

export default FeatureCard;