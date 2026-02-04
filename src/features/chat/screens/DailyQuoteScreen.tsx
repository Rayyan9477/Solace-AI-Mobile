/**
 * DailyQuoteScreen Component
 * @description Daily inspirational quote screen for mental wellness
 * @task Task 3.7.11: Daily Quote Screen (Screen 63)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { palette } from "../../../shared/theme";

interface DailyQuoteScreenProps {
  quote: string;
  author: string;
  category: string;
  isSaved: boolean;
  dateDisplayed: Date;
  onBack: () => void;
  onShare: () => void;
  onSave: () => void;
  onNewQuote: () => void;
  onContinue: () => void;
}

export function DailyQuoteScreen({
  quote,
  author,
  category,
  isSaved,
  onBack,
  onShare,
  onSave,
  onNewQuote,
  onContinue,
}: DailyQuoteScreenProps): React.ReactElement {
  return (
    <View testID="daily-quote-screen" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backButtonIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daily Quote</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Quote Icon */}
        <View testID="quote-icon" style={styles.quoteIconContainer}>
          <Text style={styles.quoteIcon}>"</Text>
        </View>

        {/* Quote Card */}
        <View style={styles.quoteCard}>
          {/* Category Badge */}
          <View testID="category-badge" style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>

          {/* Quote Text */}
          <Text testID="quote-text" style={styles.quoteText}>
            {quote}
          </Text>

          {/* Author */}
          <Text testID="quote-author" style={styles.authorText}>
            — {author}
          </Text>

          {/* Saved Indicator */}
          {isSaved && (
            <View testID="saved-indicator" style={styles.savedIndicator}>
              <Text style={styles.savedIcon}>💜</Text>
              <Text style={styles.savedText}>Saved to favorites</Text>
            </View>
          )}
        </View>

        {/* Action Buttons Row */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            testID="share-button"
            style={styles.actionButton}
            onPress={onShare}
            accessibilityRole="button"
            accessibilityLabel="Share quote"
          >
            <Text style={styles.actionIcon}>📤</Text>
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="save-button"
            style={[styles.actionButton, isSaved && styles.actionButtonActive]}
            onPress={onSave}
            accessibilityRole="button"
            accessibilityLabel="Save quote"
          >
            <Text style={styles.actionIcon}>{isSaved ? "💜" : "🤍"}</Text>
            <Text style={styles.actionText}>{isSaved ? "Saved" : "Save"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="new-quote-button"
            style={styles.actionButton}
            onPress={onNewQuote}
            accessibilityRole="button"
            accessibilityLabel="Get new quote"
          >
            <Text style={styles.actionIcon}>🔄</Text>
            <Text style={styles.actionText}>New</Text>
          </TouchableOpacity>
        </View>

        {/* Solace Branding */}
        <Text style={styles.brandingText}>
          Curated by Solace AI for your wellness journey
        </Text>
      </View>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          testID="continue-button"
          style={styles.continueButton}
          onPress={onContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue"
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 6,
    minHeight: 44,
    paddingVertical: 12,
  },
  actionButtonActive: {
    backgroundColor: palette.brown[700],
    borderColor: palette.olive[500],
    borderWidth: 1,
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  actionRow: {
    flexDirection: "row",
    marginTop: 24,
    paddingHorizontal: 24,
  },
  actionText: {
    color: palette.gray[400],
    fontSize: 12,
    fontWeight: "500",
  },
  authorText: {
    color: palette.tan[500],
    fontSize: 16,
    fontStyle: "italic",
    fontWeight: "500",
    marginTop: 20,
    textAlign: "right",
  },
  backButton: {
    alignItems: "center",
    borderColor: palette.brown[700],
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 40,
  },
  backButtonIcon: {
    color: palette.white,
    fontSize: 20,
    fontWeight: "600",
  },
  brandingText: {
    color: palette.gray[500],
    fontSize: 12,
    marginTop: 32,
    textAlign: "center",
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: palette.brown[700],
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryText: {
    color: palette.tan[500],
    fontSize: 12,
    fontWeight: "600",
  },
  container: {
    backgroundColor: palette.brown[900],
    flex: 1,
    paddingTop: 60,
  },
  content: {
    alignItems: "center",
    flex: 1,
    paddingTop: 20,
  },
  continueButton: {
    alignItems: "center",
    backgroundColor: palette.olive[500],
    borderRadius: 28,
    justifyContent: "center",
    minHeight: 56,
    paddingVertical: 16,
  },
  continueButtonText: {
    color: palette.white,
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    paddingBottom: 32,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  headerSpacer: {
    width: 40,
  },
  headerTitle: {
    color: palette.white,
    fontSize: 18,
    fontWeight: "700",
  },
  quoteCard: {
    backgroundColor: palette.brown[800],
    borderRadius: 20,
    marginHorizontal: 24,
    marginTop: 16,
    padding: 24,
    width: "100%",
    maxWidth: 350,
  },
  quoteIcon: {
    color: palette.olive[500],
    fontSize: 60,
    fontWeight: "700",
    lineHeight: 60,
  },
  quoteIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  quoteText: {
    color: palette.white,
    fontSize: 20,
    fontStyle: "italic",
    fontWeight: "500",
    lineHeight: 32,
  },
  savedIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  savedIndicator: {
    alignItems: "center",
    backgroundColor: palette.brown[700],
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  savedText: {
    color: palette.olive[500],
    fontSize: 12,
    fontWeight: "500",
  },
});

export default DailyQuoteScreen;
