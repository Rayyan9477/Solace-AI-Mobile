import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { useFixedTheme } from "./FixedThemeProvider";

const LogoDisplay = ({
  size = "large",
  showText = true,
  style = {},
  logoStyle = {},
  textStyle = {},
}) => {
  const { theme } = useFixedTheme();

  const getSizeConfig = () => {
    switch (size) {
      case "small":
        return { logoSize: 60, fontSize: 20, spacing: 8 };
      case "medium":
        return { logoSize: 80, fontSize: 24, spacing: 12 };
      case "large":
      default:
        return { logoSize: 120, fontSize: 32, spacing: 16 };
    }
  };

  const { logoSize, fontSize, spacing } = getSizeConfig();

  return (
    <View style={[styles.container, style]}>
      {/* Logo - 4 circles in grid pattern */}
      <View
        style={[styles.logoContainer, { marginBottom: spacing }, logoStyle]}
      >
        <LinearGradient
          colors={[
            theme.colors.background?.primary || "#FFFFFF",
            theme.colors.background?.secondary || "#F9FAFB",
          ]}
          style={[
            styles.logoCircle,
            { width: logoSize, height: logoSize, borderRadius: logoSize / 2 },
          ]}
        >
          <View style={styles.logoGrid}>
            <View
              style={[
                styles.gridCircle,
                {
                  backgroundColor:
                    theme.colors.therapeutic?.empathy?.[600] || "#C96100",
                },
              ]}
            />
            <View
              style={[
                styles.gridCircle,
                {
                  backgroundColor:
                    theme.colors.therapeutic?.zen?.[500] || "#EDA600",
                },
              ]}
            />
            <View
              style={[
                styles.gridCircle,
                {
                  backgroundColor:
                    theme.colors.therapeutic?.zen?.[500] || "#EDA600",
                },
              ]}
            />
            <View
              style={[
                styles.gridCircle,
                {
                  backgroundColor:
                    theme.colors.therapeutic?.empathy?.[600] || "#C96100",
                },
              ]}
            />
          </View>
        </LinearGradient>
      </View>

      {showText && (
        <Text
          style={[
            styles.logoText,
            {
              fontSize,
              color: theme.colors.text?.primary || "#111827",
            },
            textStyle,
          ]}
        >
          Solace AI
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  logoCircle: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  logoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 44,
    height: 44,
    justifyContent: "space-between",
  },
  gridCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 4,
  },
  logoText: {
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: -0.5,
  },
});

export default LogoDisplay;
