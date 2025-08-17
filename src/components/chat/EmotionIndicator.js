import React from "react";
import { View, Text, StyleSheet } from "react-native";
import styled from "styled-components/native";

import { useTheme } from "../../shared/theme/ThemeContext";

const Container = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
`;

const EmotionBadge = styled(View)`
  flex-direction: row;
  align-items: center;
  padding: 8px 12px;
  border-radius: 20px;
  background-color: ${(props) => props.backgroundColor};
`;

const EmotionText = styled(Text)`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.textColor};
  margin-left: 6px;
`;

const EmotionIndicator = ({ emotion }) => {
  const { theme } = useTheme();

  const getEmotionColor = (emotion) => {
    const emotionColors = {
      happy: theme.colors.mood.happy,
      sad: theme.colors.mood.sad,
      anxious: theme.colors.mood.anxious,
      angry: theme.colors.mood.angry,
      calm: theme.colors.mood.calm,
      supportive: theme.colors.success[500],
      neutral: theme.colors.mood.neutral,
    };
    return emotionColors[emotion] || theme.colors.gray[400];
  };

  const getEmotionIcon = (emotion) => {
    const emotionIcons = {
      happy: "😊",
      sad: "😔",
      anxious: "😰",
      angry: "😠",
      calm: "😌",
      supportive: "🤗",
      neutral: "😐",
    };
    return emotionIcons[emotion] || "😐";
  };

  const getEmotionText = (emotion) => {
    return emotion.charAt(0).toUpperCase() + emotion.slice(1);
  };

  // Get appropriate text color (light or dark) based on background color
  const getTextColor = (backgroundColor) => {
    // For lighter colors use dark text, for darker colors use light text
    const lightColorEmotions = ["happy", "calm", "neutral"];
    return lightColorEmotions.includes(emotion)
      ? theme.colors.text.primary
      : theme.colors.text.inverse;
  };

  const backgroundColor = getEmotionColor(emotion);
  const textColor = getTextColor(backgroundColor);

  return (
    <Container
      accessibilityRole="text"
      accessibilityLabel={`Current emotion detected: ${getEmotionText(emotion)}`}
    >
      <EmotionBadge backgroundColor={backgroundColor}>
        <Text style={styles.emotionIcon}>{getEmotionIcon(emotion)}</Text>
        <EmotionText textColor={textColor}>
          {getEmotionText(emotion)} emotion detected
        </EmotionText>
      </EmotionBadge>
    </Container>
  );
};

const styles = StyleSheet.create({
  emotionIcon: {
    fontSize: 16,
  },
});

export default EmotionIndicator;
