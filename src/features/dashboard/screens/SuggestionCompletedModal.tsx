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
    borderColor: "#3D2E23",
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 40,
  },
  backButtonIcon: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  container: {
    backgroundColor: "#1C1410",
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
    backgroundColor: "#C4A574",
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 56,
    paddingHorizontal: 24,
    paddingVertical: 16,
    width: "100%",
  },
  dismissButtonIcon: {
    color: "#1C1410",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  dismissButtonText: {
    color: "#1C1410",
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
    backgroundColor: "#2A1F19",
    borderColor: "#C4A574",
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
    color: "#9AAD5C",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  scoreUpdate: {
    color: "#94A3B8",
    fontSize: 14,
    textAlign: "center",
  },
  successTitle: {
    color: "#FFFFFF",
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
    color: "#94A3B8",
    fontSize: 16,
    fontWeight: "600",
  },
  swipeIcon: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  swipeIndicator: {
    alignItems: "center",
    backgroundColor: "#2A1F19",
    borderRadius: 24,
    flexDirection: "row",
    marginBottom: 32,
    marginHorizontal: 24,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  swipeText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
});

export default SuggestionCompletedModal;
