/**
 * SuggestionCompletedModal Component
 * @description Success modal shown after completing an AI suggestion
 * @task Task 3.5.7: Suggestion Completed Modal (Screen 46)
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { palette } from "../../../shared/theme";

interface SuggestionCompletedModalProps {
  isVisible: boolean;
  pointsAdded: number;
  newScore: number;
  suggestionTitle: string;
  hasMoreSuggestions: boolean;
  onBack: () => void;
  onDismiss: () => void;
  onSwipeToNext: () => void;
}

export function SuggestionCompletedModal({
  isVisible,
  pointsAdded,
  newScore,
  hasMoreSuggestions,
  onBack,
  onDismiss,
  onSwipeToNext,
}: SuggestionCompletedModalProps): React.ReactElement | null {
  if (!isVisible) {
    return null;
  }

  return (
    <View testID="suggestion-completed-modal" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backButtonIcon}>{"<"}</Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <View style={styles.contentArea}>
        {/* Illustration Card */}
        <View testID="illustration-card" style={styles.illustrationCard}>
          <View style={styles.illustration}>
            <Text style={styles.illustrationEmoji}>🎉</Text>
            <Text style={styles.illustrationSubEmoji}>✨</Text>
          </View>
        </View>

        {/* Success Messages */}
        <Text style={styles.successTitle}>AI Suggestion Completed.</Text>
        <Text style={styles.scoreIncrease}>
          +{pointsAdded} Solace Score Added.
        </Text>
        <Text style={styles.scoreUpdate}>
          Your Solace score has increased to {newScore}!
        </Text>
      </View>

      {/* Action Area */}
      <View style={styles.actionArea}>
        <TouchableOpacity
          testID="dismiss-button"
          style={styles.dismissButton}
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel="Dismiss and continue"
        >
          <Text style={styles.dismissButtonText}>Great, Thanks!</Text>
          <Text style={styles.dismissButtonIcon}>✓</Text>
        </TouchableOpacity>
      </View>

      {/* Swipe Indicator */}
      {hasMoreSuggestions && (
        <View testID="swipe-indicator" style={styles.swipeIndicator}>
          <TouchableOpacity
            testID="swipe-next-button"
            style={styles.swipeButton}
            onPress={onSwipeToNext}
            accessibilityRole="button"
            accessibilityLabel="Swipe to next suggestion"
          >
            <Text style={styles.swipeIcon}>》</Text>
            <Text style={styles.swipeText}>Swipe for more suggestions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="swipe-dismiss-button"
            style={styles.swipeDismissButton}
            onPress={onDismiss}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <Text style={styles.swipeDismissIcon}>✕</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  actionArea: {
    paddingHorizontal: 24,
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
    fontSize: 18,
    fontWeight: "600",
  },
  container: {
    backgroundColor: palette.brown[900],
    flex: 1,
    paddingTop: 60,
  },
  contentArea: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  dismissButton: {
    alignItems: "center",
    backgroundColor: palette.tan[500],
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 56,
    paddingHorizontal: 24,
    paddingVertical: 16,
    width: "100%",
  },
  dismissButtonIcon: {
    color: palette.brown[900],
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  dismissButtonText: {
    color: palette.brown[900],
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    paddingHorizontal: 24,
  },
  illustration: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  illustrationCard: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderColor: palette.tan[500],
    borderRadius: 24,
    borderWidth: 2,
    height: 200,
    justifyContent: "center",
    marginBottom: 32,
    width: 200,
  },
  illustrationEmoji: {
    fontSize: 80,
  },
  illustrationSubEmoji: {
    fontSize: 32,
    position: "absolute",
    right: -10,
    top: -10,
  },
  scoreIncrease: {
    color: palette.olive[500],
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  scoreUpdate: {
    color: palette.gray[400],
    fontSize: 14,
    textAlign: "center",
  },
  successTitle: {
    color: palette.white,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  swipeButton: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  swipeDismissButton: {
    alignItems: "center",
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  swipeDismissIcon: {
    color: palette.gray[400],
    fontSize: 16,
    fontWeight: "600",
  },
  swipeIcon: {
    color: palette.white,
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  swipeIndicator: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderRadius: 24,
    flexDirection: "row",
    marginBottom: 32,
    marginHorizontal: 24,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  swipeText: {
    color: palette.white,
    fontSize: 14,
  },
});

export default SuggestionCompletedModal;
