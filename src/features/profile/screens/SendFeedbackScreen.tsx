/**
 * SendFeedbackScreen Component
 * @description Feedback form with multi-select category chips
 * @task Task 3.17.14: Send Feedback Screen (Screen 153)
 * @audit-fix "Which of the area" → "Which area" (Issue #41)
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

interface CategoryChip {
  id: string;
  label: string;
  selected: boolean;
}

interface SendFeedbackScreenProps {
  categories: CategoryChip[];
  onBack: () => void;
  onCategoryToggle: (id: string) => void;
  onSubmit: () => void;
}

const colors = {
  heroBg: "#6B7A3D",
  background: "#1C1410",
  white: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.6)",
  chipBg: "#2A1F18",
  chipSelected: "#9AAD5C",
  ctaButtonBg: "#C4A574",
  ctaButtonText: "#1C1410",
} as const;

export function SendFeedbackScreen({
  categories,
  onBack,
  onCategoryToggle,
  onSubmit,
}: SendFeedbackScreenProps): React.ReactElement {
  return (
    <View testID="send-feedback-screen" style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroHeader}>
            <TouchableOpacity
              testID="back-button"
              style={styles.backButton}
              onPress={onBack}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Text style={styles.backIcon}>{"\u2190"}</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Send Feedback</Text>
          </View>
          <View testID="emoji-indicator" style={styles.emojiIndicator}>
            <Text style={styles.emojiText}>{"\uD83D\uDE10"}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentSection}>
          <Text style={styles.questionText}>Which area needs improvement?</Text>

          {/* Category Chips Grid */}
          <View style={styles.chipsGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                testID={`chip-${cat.id}`}
                style={[styles.chip, cat.selected && styles.chipSelected]}
                onPress={() => onCategoryToggle(cat.id)}
                accessibilityRole="button"
                accessibilityLabel={cat.label}
              >
                <Text
                  style={[
                    styles.chipText,
                    cat.selected && styles.chipTextSelected,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            testID="submit-button"
            style={styles.submitButton}
            onPress={onSubmit}
            accessibilityRole="button"
            accessibilityLabel="Submit Feedback"
          >
            <Text style={styles.submitButtonText}>
              Submit Feedback {"\u2192"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
  backIcon: { color: colors.white, fontSize: 24 },
  chip: {
    backgroundColor: colors.chipBg,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  chipSelected: { backgroundColor: colors.chipSelected },
  chipText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "600",
  },
  chipTextSelected: { color: colors.white },
  chipsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
  },
  container: { backgroundColor: colors.background, flex: 1 },
  contentSection: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  emojiIndicator: {
    alignItems: "center",
    alignSelf: "center",
    marginTop: 16,
  },
  emojiText: { fontSize: 48 },
  footer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 12,
  },
  hero: {
    backgroundColor: colors.heroBg,
    paddingBottom: 32,
    paddingTop: 16,
  },
  heroHeader: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  questionText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "700",
  },
  scrollContent: { paddingBottom: 48 },
  submitButton: {
    alignItems: "center",
    backgroundColor: colors.ctaButtonBg,
    borderRadius: 28,
    justifyContent: "center",
    minHeight: 44,
    paddingVertical: 16,
    width: "100%",
  },
  submitButtonText: {
    color: colors.ctaButtonText,
    fontSize: 16,
    fontWeight: "700",
  },
});

export default SendFeedbackScreen;
