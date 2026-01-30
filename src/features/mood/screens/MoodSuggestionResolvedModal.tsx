/**
 * MoodSuggestionResolvedModal Component
 * @description Success celebration modal for completing AI mood suggestions with gamification
 * @task Task 3.8.7: Mood Suggestion Resolved Modal (Screen 77)
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface MoodSuggestionResolvedModalProps {
  visible: boolean;
  scoreReward: number;
  onClose: () => void;
  onConfirm: () => void;
}

const CALENDAR_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function MoodSuggestionResolvedModal({
  visible,
  scoreReward,
  onClose,
  onConfirm,
}: MoodSuggestionResolvedModalProps): React.ReactElement | null {
  if (!visible) return null;

  return (
    <View testID="mood-suggestion-resolved-modal" style={styles.overlay}>
      {/* Backdrop */}
      <View testID="modal-backdrop" style={styles.backdrop} />

      {/* Success Card */}
      <View testID="success-card" style={styles.successCard}>
        {/* Close Button */}
        <TouchableOpacity
          testID="close-button"
          style={styles.closeButton}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close modal"
        >
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>

        {/* Transformation Illustration */}
        <View
          testID="transformation-illustration"
          style={styles.illustrationContainer}
        >
          <View style={styles.illustrationRow}>
            <View style={styles.sadFigure}>
              <Text style={styles.figureEmoji}>😢</Text>
            </View>
            <View style={styles.arrowContainer}>
              <Text style={styles.arrow}>→</Text>
            </View>
            <View style={styles.happyFigure}>
              <Text style={styles.figureEmoji}>😄</Text>
            </View>
          </View>
          <View style={styles.maskContainer}>
            <Text style={styles.maskEmoji}>🎭</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Mood Suggestion Resolved!</Text>

        {/* Score Reward */}
        <Text style={styles.scoreReward}>
          +{scoreReward} Solace Score received.
        </Text>

        {/* Congratulatory Message */}
        <View style={styles.congratsContainer}>
          <Text style={styles.congratsText}>
            Great job on completing the suggestion! Keep up the positive
            momentum.
          </Text>
          <Text style={styles.celebrationEmoji}>🙌</Text>
        </View>

        {/* Calendar Strip */}
        <View testID="calendar-strip" style={styles.calendarStrip}>
          {CALENDAR_DAYS.map((day) => (
            <View key={day} style={styles.calendarDay}>
              <Text style={styles.calendarDayText}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          testID="confirm-button"
          style={styles.confirmButton}
          onPress={onConfirm}
          accessibilityRole="button"
          accessibilityLabel="Confirm and close"
        >
          <Text style={styles.confirmButtonText}>Great, thanks!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  arrow: {
    color: "#C4A574",
    fontSize: 24,
  },
  arrowContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
  },
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.6)",
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  calendarDay: {
    alignItems: "center",
    flex: 1,
  },
  calendarDayText: {
    color: "#94A3B8",
    fontSize: 11,
  },
  calendarStrip: {
    borderColor: "#3D2E23",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    marginTop: 20,
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  celebrationEmoji: {
    fontSize: 24,
    marginTop: 8,
  },
  closeButton: {
    alignItems: "center",
    height: 32,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    position: "absolute",
    right: 16,
    top: 16,
    width: 32,
    zIndex: 1,
  },
  closeIcon: {
    color: "#94A3B8",
    fontSize: 18,
    fontWeight: "600",
  },
  confirmButton: {
    alignItems: "center",
    backgroundColor: "#E8853A",
    borderRadius: 12,
    marginTop: 20,
    minHeight: 44,
    paddingVertical: 14,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  congratsContainer: {
    alignItems: "center",
    marginTop: 12,
  },
  congratsText: {
    color: "#94A3B8",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
  },
  figureEmoji: {
    fontSize: 36,
  },
  happyFigure: {
    alignItems: "center",
    backgroundColor: "rgba(154, 173, 92, 0.2)",
    borderRadius: 24,
    height: 64,
    justifyContent: "center",
    width: 64,
  },
  illustrationContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 16,
  },
  illustrationRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  maskContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  maskEmoji: {
    fontSize: 24,
  },
  overlay: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  sadFigure: {
    alignItems: "center",
    backgroundColor: "rgba(232, 133, 58, 0.2)",
    borderRadius: 24,
    height: 64,
    justifyContent: "center",
    width: 64,
  },
  scoreReward: {
    color: "#9AAD5C",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
  },
  successCard: {
    backgroundColor: "#1C1410",
    borderColor: "#3D2E23",
    borderRadius: 24,
    borderWidth: 1,
    marginHorizontal: 32,
    padding: 24,
    width: "85%",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
});

export default MoodSuggestionResolvedModal;
