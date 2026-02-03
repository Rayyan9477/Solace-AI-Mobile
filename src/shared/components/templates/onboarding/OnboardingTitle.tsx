/**
 * OnboardingTitle Component
 * @description Title text with support for highlighting specific words
 */

import React from "react";
import { Text, StyleSheet } from "react-native";
import type { OnboardingTitleProps } from "./OnboardingCarouselCard.types";

/**
 * Split text into parts and identify which parts should be highlighted
 */
function parseTextWithHighlights(
  text: string,
  highlightedWords: string[]
): Array<{ text: string; highlighted: boolean }> {
  const parts: Array<{ text: string; highlighted: boolean }> = [];

  // Split by spaces to get individual words
  const words = text.split(" ");

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const isHighlighted = highlightedWords.some((hw) =>
      word.toLowerCase().includes(hw.toLowerCase())
    );

    parts.push({
      text: word + (i < words.length - 1 ? " " : ""),
      highlighted: isHighlighted,
    });
  }

  return parts;
}

/**
 * OnboardingTitle Component
 * Displays title text with optional word highlighting
 *
 * @example
 * ```tsx
 * <OnboardingTitle
 *   text="Personalize Your Mental Health State With AI"
 *   highlightedWords={["Health State"]}
 *   highlightColor="#C4A574"
 * />
 * ```
 */
export function OnboardingTitle({
  text,
  highlightedWords,
  highlightColor = "#C4A574",
  testID,
  style,
}: OnboardingTitleProps): React.ReactElement {
  const parts = parseTextWithHighlights(text, highlightedWords);

  return (
    <Text
      testID={testID}
      accessibilityRole="header"
      accessibilityLabel={text}
      style={[styles.container, style]}
    >
      {parts.map((part, index) => (
        <Text
          key={`part-${index}`}
          style={[
            styles.text,
            part.highlighted && { color: highlightColor },
          ]}
        >
          {part.text}
        </Text>
      ))}
    </Text>
  );
}

const styles = StyleSheet.create({
  container: {
    textAlign: "center",
  },
  text: {
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 36,
    color: "#FFFFFF",
  },
});

export default OnboardingTitle;
