import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

import { MentalHealthIcon } from "../components/icons";
import { useTheme } from "../shared/theme/ThemeContext";

const DesignSystemScreen = ({ navigation }) => {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <View style={styles.content}>
        <MentalHealthIcon
          name="Brain"
          size={48}
          color={theme.colors.primary[500]}
          style={styles.icon}
        />
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Design System
        </Text>
        <Text
          style={[styles.description, { color: theme.colors.text.secondary }]}
        >
          The design system components have been consolidated into the shared
          theme system. All design tokens and styling are now managed through
          the unified theme provider.
        </Text>
        <TouchableOpacity
          style={[
            styles.backButton,
            { backgroundColor: theme.colors.primary[500] },
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text
            style={[
              styles.backButtonText,
              { color: theme.colors.text.inverse },
            ]}
          >
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 32,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default DesignSystemScreen;
