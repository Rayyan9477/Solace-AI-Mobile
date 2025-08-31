/**
 * Emoji Accessibility Utility
 * Provides accessible descriptions for emojis used throughout the mental health app
 * Ensures WCAG 2.1 compliance for non-text content
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Comprehensive emoji to description mapping for mental health context
export const EMOJI_DESCRIPTIONS = {
  // Mood and emotional state emojis
  "😊": "Happy face, expressing joy and contentment",
  "😌": "Relieved face, expressing calm and peace",
  "😰": "Anxious face with sweat, expressing worry and stress",
  "😢": "Crying face, expressing sadness and emotional pain",
  "😠": "Angry face, expressing frustration and anger",
  "😐": "Neutral face, expressing balanced emotional state",
  "🤩": "Star-struck face, expressing excitement and enthusiasm",
  "😴": "Sleeping face, expressing tiredness and fatigue",
  "😤": "Huffing face, expressing stress and overwhelm",

  // Activity and wellness emojis
  "🌱": "Growing seedling, representing personal growth and development",
  "💧": "Water droplet, representing hydration and self-care",
  "🚶": "Person walking, representing physical activity and movement",
  "📖": "Open book, representing learning and reading for wellness",
  "🧘": "Person meditating, representing mindfulness and meditation",
  "🎯": "Target with arrow, representing goals and achievements",
  "💚": "Green heart, representing mental health and wellbeing",
  "🌸": "Cherry blossom, representing beauty and growth",
  "🌈": "Rainbow, representing hope and positivity",
  "☀️": "Sun, representing energy and brightness",
  "🌙": "Crescent moon, representing rest and tranquility",
  "⭐": "Star, representing goals and achievements",

  // Therapy and support emojis
  "💬": "Speech bubble, representing communication and therapy",
  "🤝": "Handshake, representing support and connection",
  "🛡️": "Shield, representing protection and safety",
  "🎨": "Artist palette, representing creativity and expression",
  "📝": "Memo, representing journaling and reflection",
  "🎵": "Musical note, representing music therapy and relaxation",

  // Emergency and crisis emojis
  "🚨": "Police car light, representing emergency and crisis support",
  "📞": "Telephone, representing crisis hotline and communication",
  "🆘": "SOS button, representing emergency help request",
  "❤️": "Red heart, representing love and emotional support",

  // Progress and achievement emojis
  "🏆": "Trophy, representing achievement and success",
  "🌟": "Glowing star, representing excellence and progress",
  "📈": "Upward trending chart, representing improvement and growth",
  "✅": "Check mark, representing completion and success",
  "🎉": "Party popper, representing celebration and milestones",

  // Time-based emojis
  "🌅": "Sunrise, representing new beginnings and morning energy",
  "🌇": "City sunset, representing evening calm and reflection",
  "🌃": "Night with stars, representing rest and peaceful sleep",
};

// Get accessible description for an emoji
export const getEmojiDescription = (emoji) => {
  return EMOJI_DESCRIPTIONS[emoji] || `Decorative emoji: ${emoji}`;
};

// Check if emoji has accessible description
export const hasEmojiDescription = (emoji) => {
  return emoji in EMOJI_DESCRIPTIONS;
};

// AccessibleEmoji component that provides both visual and accessible representations
export const AccessibleEmoji = ({
  emoji,
  style,
  customDescription,
  hideFromScreenReader = false,
  testID,
}) => {
  const description = customDescription || getEmojiDescription(emoji);

  return (
    <View style={[styles.container, style]} testID={testID}>
      <Text
        style={styles.emoji}
        accessibilityElementsHidden
        importantForAccessibility="no"
      >
        {emoji}
      </Text>
      {!hideFromScreenReader && (
        <Text style={styles.screenReaderOnly} accessibilityRole="text">
          {description}
        </Text>
      )}
    </View>
  );
};

// Enhanced AccessibleEmoji with mood context
export const MoodEmoji = ({ emoji, moodName, intensity, style, testID }) => {
  const baseDescription = getEmojiDescription(emoji);
  const moodDescription = `${moodName} mood${intensity ? ` with ${intensity} intensity` : ""}. ${baseDescription}`;

  return (
    <AccessibleEmoji
      emoji={emoji}
      customDescription={moodDescription}
      style={style}
      testID={testID}
    />
  );
};

// WellnessTip emoji with context
export const WellnessTipEmoji = ({ emoji, tipTitle, style, testID }) => {
  const baseDescription = getEmojiDescription(emoji);
  const tipDescription = `Wellness tip icon for "${tipTitle}". ${baseDescription}`;

  return (
    <AccessibleEmoji
      emoji={emoji}
      customDescription={tipDescription}
      style={style}
      testID={testID}
    />
  );
};

// Crisis/Emergency emoji with urgent context
export const EmergencyEmoji = ({
  emoji,
  emergencyType = "crisis support",
  style,
  testID,
}) => {
  const baseDescription = getEmojiDescription(emoji);
  const emergencyDescription = `Emergency ${emergencyType} indicator. ${baseDescription}`;

  return (
    <AccessibleEmoji
      emoji={emoji}
      customDescription={emergencyDescription}
      style={style}
      testID={testID}
    />
  );
};

// Utility to convert emoji-containing text to accessible format
export const makeTextAccessible = (text) => {
  if (typeof text !== "string") return text;

  // Replace emojis with their descriptions in parentheses
  let accessibleText = text;
  Object.entries(EMOJI_DESCRIPTIONS).forEach(([emoji, description]) => {
    const emojiRegex = new RegExp(
      emoji.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "g",
    );
    accessibleText = accessibleText.replace(emojiRegex, `(${description})`);
  });

  return accessibleText;
};

// Hook for emoji accessibility in components
export const useEmojiAccessibility = () => {
  return {
    getEmojiDescription,
    hasEmojiDescription,
    makeTextAccessible,
    AccessibleEmoji,
    MoodEmoji,
    WellnessTipEmoji,
    EmergencyEmoji,
  };
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  emoji: {
    // Emoji styles will be inherited from parent
  },
  screenReaderOnly: {
    position: "absolute",
    left: -10000,
    width: 1,
    height: 1,
    overflow: "hidden",
    opacity: 0,
  },
});

export default {
  EMOJI_DESCRIPTIONS,
  getEmojiDescription,
  hasEmojiDescription,
  AccessibleEmoji,
  MoodEmoji,
  WellnessTipEmoji,
  EmergencyEmoji,
  makeTextAccessible,
  useEmojiAccessibility,
};
