/**
 * NewJournalTypeSelectorScreen Component
 * @screen Screen 80: New Journal Type Selector
 * @audit batch-17-journal-continued.md
 * @phase Phase 3C: Refactored to use theme tokens
 * @fixes "Automaticly" → "Automatically", "ealth" → "health"
 *
 * Visual ref: Mental_Health_Journal_Screen_03.png
 * - "New Mental Health Journal" title (large, bold)
 * - Voice Journal card (green mic icon, bordered, chevron)
 * - Text Journal card (orange doc icon, bordered, chevron)
 * - "Create Journal +" brown CTA button
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { palette } from "../../../shared/theme";

interface NewJournalTypeSelectorScreenProps {
  selectedType: "voice" | "text" | null;
  onBack: () => void;
  onSelectVoice: () => void;
  onSelectText: () => void;
  onCreate: () => void;
}

export function NewJournalTypeSelectorScreen({
  selectedType,
  onBack,
  onSelectVoice,
  onSelectText,
  onCreate,
}: NewJournalTypeSelectorScreenProps): React.ReactElement {
  return (
    <View testID="new-journal-type-screen" style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        testID="back-button"
        style={styles.backButton}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Text style={styles.backIcon}>☽</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>New Mental{"\n"}Health Journal</Text>

      {/* Voice Journal Card */}
      <TouchableOpacity
        testID="voice-journal-card"
        style={[
          styles.card,
          selectedType === "voice" && styles.cardSelected,
        ]}
        onPress={onSelectVoice}
        accessibilityRole="button"
        accessibilityLabel="Select voice journal"
      >
        <View style={[styles.iconCircle, { backgroundColor: palette.olive[500] }]}>
          <Text style={styles.iconEmoji}>🎙</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Voice Journal</Text>
          <Text style={styles.cardDescription}>
            Automatically create health journal by Voice & Face detection with AI
          </Text>
        </View>
        <Text testID="voice-card-chevron" style={styles.chevron}>
          ›
        </Text>
      </TouchableOpacity>

      {/* Text Journal Card */}
      <TouchableOpacity
        testID="text-journal-card"
        style={[
          styles.card,
          selectedType === "text" && styles.cardSelected,
        ]}
        onPress={onSelectText}
        accessibilityRole="button"
        accessibilityLabel="Select text journal"
      >
        <View style={[styles.iconCircle, { backgroundColor: palette.onboarding.step2 }]}>
          <Text style={styles.iconEmoji}>📝</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Text journal</Text>
          <Text style={styles.cardDescription}>
            Set up manual text journal based on your current mood & conditions
          </Text>
        </View>
        <Text testID="text-card-chevron" style={styles.chevron}>
          ›
        </Text>
      </TouchableOpacity>

      {/* Spacer */}
      <View style={styles.spacer} />

      {/* Create Journal Button */}
      <TouchableOpacity
        testID="create-journal-button"
        style={styles.ctaButton}
        onPress={onCreate}
        accessibilityRole="button"
        accessibilityLabel="Create journal"
      >
        <Text style={styles.ctaText}>Create Journal  +</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    borderColor: `${palette.white}${palette.alpha[30]}`,
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 44,
  },
  backIcon: {
    color: palette.white,
    fontSize: 22,
  },
  card: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderColor: palette.brown[700],
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    marginTop: 16,
    minHeight: 44,
    padding: 20,
  },
  cardContent: {
    flex: 1,
    marginLeft: 16,
  },
  cardDescription: {
    color: palette.gray[400],
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  cardSelected: {
    borderColor: palette.tan[500],
  },
  cardTitle: {
    color: palette.white,
    fontSize: 16,
    fontWeight: "600",
  },
  chevron: {
    color: palette.gray[400],
    fontSize: 24,
    marginLeft: 8,
  },
  container: {
    backgroundColor: palette.brown[900],
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  ctaButton: {
    alignItems: "center",
    backgroundColor: palette.tan[600],
    borderRadius: 16,
    marginBottom: 40,
    minHeight: 44,
    paddingVertical: 16,
  },
  ctaText: {
    color: palette.white,
    fontSize: 16,
    fontWeight: "700",
  },
  iconCircle: {
    alignItems: "center",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  iconEmoji: {
    fontSize: 20,
  },
  spacer: {
    flex: 1,
  },
  title: {
    color: palette.white,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
    marginTop: 24,
  },
});

export default NewJournalTypeSelectorScreen;
