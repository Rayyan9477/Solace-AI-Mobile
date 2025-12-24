/**
 * Course Completion Screen - Course/Lesson Completion Celebration
 * Based on ui-designs/Dark-mode/Mindful Resources.png
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

export const CourseCompletionScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const ratingEmojis = ["😢", "😕", "😐", "😊", "😄"];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 40,
    },
    illustration: {
      width: 200,
      height: 200,
      backgroundColor: theme.colors.green["20"],
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 32,
    },
    illustrationEmoji: {
      fontSize: 80,
    },
    title: {
      fontSize: 28,
      fontWeight: "800",
      color: theme.colors.text.primary,
      textAlign: "center",
      marginBottom: 12,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text.secondary,
      textAlign: "center",
      marginBottom: 32,
    },
    ratingSection: {
      width: "100%",
      marginBottom: 32,
    },
    ratingLabel: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
      textAlign: "center",
      marginBottom: 20,
    },
    ratingRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 12,
    },
    ratingButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.brown["10"],
      justifyContent: "center",
      alignItems: "center",
    },
    ratingEmoji: {
      fontSize: 28,
    },
    actionButton: {
      width: "100%",
      backgroundColor: theme.colors.brown["60"],
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: "center",
      marginBottom: 12,
    },
    actionButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    closeButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.gray["20"],
      justifyContent: "center",
      alignItems: "center",
    },
    closeIcon: {
      fontSize: 24,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.illustration}>
          <Text style={styles.illustrationEmoji}>🎉</Text>
        </View>

        <Text style={styles.title}>Course Done!</Text>
        <Text style={styles.subtitle}>
          Congrats! Do you feel Enlightened now?
        </Text>

        {/* Rating */}
        <View style={styles.ratingSection}>
          <Text style={styles.ratingLabel}>Rate this course!</Text>
          <View style={styles.ratingRow}>
            {/* LOW-NEW-002 FIX: Use emoji as stable key instead of index */}
            {ratingEmojis.map((emoji) => (
              <TouchableOpacity key={`rating-${emoji}`} style={styles.ratingButton}>
                <Text style={styles.ratingEmoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Actions */}
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Rate Session +</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeIcon}>×</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// LOW-NEW-001 FIX: Add displayName for debugging
CourseCompletionScreen.displayName = 'CourseCompletionScreen';

export default CourseCompletionScreen;
