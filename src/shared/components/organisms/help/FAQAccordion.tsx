/**
 * FAQAccordion Component
 * @description Expandable/collapsible FAQ accordion item
 * @task Task 2.10.2: FAQAccordion Component
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import type { FAQAccordionProps } from "./FAQAccordion.types";
import { palette } from "../../../theme";

export function FAQAccordion({
  id,
  question,
  answer,
  isExpanded = false,
  onPress,
  style,
  testID,
  accessibilityLabel,
}: FAQAccordionProps): React.ReactElement {
  const handlePress = () => onPress?.(id);

  return (
    <TouchableOpacity
      testID={testID}
      accessibilityLabel={accessibilityLabel || `FAQ: ${question}`}
      accessibilityRole="button"
      accessibilityState={{ expanded: isExpanded }}
      style={[styles.container, style]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Question Row */}
      <View style={styles.questionRow}>
        <Text style={styles.question}>{question}</Text>
        <Text style={styles.chevron}>{isExpanded ? "⌃" : "⌄"}</Text>
      </View>

      {/* Answer (only visible when expanded) */}
      {isExpanded && (
        <View style={styles.answerContainer}>
          <Text testID="answer-text" style={styles.answer}>
            {answer}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  answer: {
    color: palette.gray[200],
    fontSize: 14,
    lineHeight: 20,
  },
  answerContainer: {
    marginTop: 12,
  },
  chevron: {
    color: palette.white,
    fontSize: 20,
  },
  container: {
    backgroundColor: palette.gray[600],
    borderRadius: 12,
    padding: 16,
  },
  question: {
    color: palette.white,
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 21,
  },
  questionRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
});

export default FAQAccordion;
