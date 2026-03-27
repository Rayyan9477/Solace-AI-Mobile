import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { palette } from "../../../shared/theme";

interface MoodAnalyticsScreenProps {
  onBack?: () => void;
}

export function MoodAnalyticsScreen({
  onBack,
}: MoodAnalyticsScreenProps = {}): React.ReactElement {
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View testID="mood-analytics-screen" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Icon name="chevron-back-outline" size={22} color={palette.white} />
        </TouchableOpacity>
      </View>

      {/* Under Development Content */}
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon name="analytics-outline" size={72} color={palette.tan[400]} />
        </View>
        <Text style={styles.title}>Mood Analytics</Text>
        <Text style={styles.subtitle}>
          This feature is being built and will be available in a future update.
        </Text>
      </View>

      {/* Go Back Button */}
      <TouchableOpacity
        testID="go-back-button"
        style={styles.goBackButton}
        onPress={handleBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Text style={styles.goBackText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.brown[900],
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: "flex-start",
    marginBottom: 8,
  },
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
  content: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  iconContainer: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderRadius: 48,
    height: 120,
    justifyContent: "center",
    marginBottom: 28,
    width: 120,
  },
  title: {
    color: palette.white,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    color: palette.gray[400],
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  goBackButton: {
    alignItems: "center",
    backgroundColor: palette.tan[500],
    borderRadius: 12,
    marginBottom: 40,
    minHeight: 52,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  goBackText: {
    color: palette.brown[900],
    fontSize: 16,
    fontWeight: "600",
  },
});

export default MoodAnalyticsScreen;
