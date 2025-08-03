import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import styled from "styled-components/native";

import { useTheme } from "../../contexts/ThemeContext";
import {
  MentalHealthAccessibility,
  announceForAccessibility,
} from "../../utils/accessibility";

const BubbleContainer = styled(View)`
  flex-direction: ${(props) => (props.isUser ? "row-reverse" : "row")};
  margin-bottom: 16px;
  padding-horizontal: 4px;
`;

const BubbleWrapper = styled(View)`
  max-width: 80%;
  flex-direction: ${(props) => (props.isUser ? "row-reverse" : "row")};
  align-items: flex-end;
`;

const MessageBubbleStyled = styled(View)`
  background-color: ${(props) => props.backgroundColor};
  padding: 12px 16px;
  border-radius: 20px;
  border-bottom-left-radius: ${(props) => (props.isUser ? "20px" : "8px")};
  border-bottom-right-radius: ${(props) => (props.isUser ? "8px" : "20px")};
  shadow-color: ${(props) => props.shadowColor};
  shadow-offset: 0px 1px;
  shadow-opacity: 0.1;
  shadow-radius: 2px;
  elevation: 2;
`;

const MessageText = styled(Text)`
  font-size: 16px;
  line-height: 22px;
  color: ${(props) => props.textColor};
`;

const MessageTime = styled(Text)`
  font-size: 11px;
  color: ${(props) => props.color};
  margin-top: 4px;
  opacity: 0.7;
`;

const Avatar = styled(View)`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: ${(props) => props.backgroundColor};
  justify-content: center;
  align-items: center;
  margin: ${(props) => (props.isUser ? "0 8px 0 0" : "0 0 0 8px")};
`;

const AvatarText = styled(Text)`
  font-size: 16px;
  color: ${(props) => props.color};
`;

const EmotionBadge = styled(View)`
  position: absolute;
  top: -8px;
  right: ${(props) => (props.isUser ? "auto" : "-8px")};
  left: ${(props) => (props.isUser ? "-8px" : "auto")};
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: ${(props) => props.backgroundColor};
  justify-content: center;
  align-items: center;
  border: 2px solid ${(props) => props.borderColor};
`;

const MessageActions = styled(View)`
  flex-direction: row;
  margin-top: 8px;
  justify-content: ${(props) => (props.isUser ? "flex-end" : "flex-start")};
`;

const ActionButton = styled(TouchableOpacity)`
  padding: 4px 8px;
  margin-horizontal: 4px;
  border-radius: 12px;
  background-color: ${(props) => props.backgroundColor};
`;

const ActionText = styled(Text)`
  font-size: 12px;
  color: ${(props) => props.color};
`;

const MessageBubble = ({ message, isLast, onPress, onLongPress }) => {
  const { theme, isScreenReaderEnabled } = useTheme();
  const isUser = message.type === "user";

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleMessagePress = () => {
    if (onPress) {
      onPress(message);
    }

    // Announce message details for screen reader users
    if (isScreenReaderEnabled) {
      const timeString = formatTime(message.timestamp);
      const emotionString = message.emotion
        ? `, emotion: ${message.emotion}`
        : "";
      announceForAccessibility(
        `${isUser ? "Your message" : "AI therapist message"} sent at ${timeString}${emotionString}: ${message.text}`,
      );
    }
  };

  const handleActionPress = (action) => {
    if (isScreenReaderEnabled) {
      announceForAccessibility(`${action} action selected for AI message`);
    }
  };

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

  return (
    <BubbleContainer
      isUser={isUser}
      accessibilityRole="group"
      {...MentalHealthAccessibility.chat.message(isUser, message.text)}
    >
      <BubbleWrapper isUser={isUser}>
        {!isUser && (
          <Avatar
            backgroundColor={theme.colors.primary[500]}
            isUser={isUser}
            accessibilityElementsHidden
          >
            <AvatarText color={theme.colors.text.inverse}>🧠</AvatarText>
          </Avatar>
        )}

        <TouchableOpacity
          style={[{ flex: 1, minWidth: 44, minHeight: 44 }]}
          onPress={handleMessagePress}
          onLongPress={onLongPress}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={`${isUser ? "Your" : "AI therapist"} message: ${message.text}`}
          accessibilityHint={`Sent at ${formatTime(message.timestamp)}${message.emotion ? `, emotion detected: ${message.emotion}` : ""}. Double tap for options`}
        >
          <MessageBubbleStyled
            backgroundColor={
              isUser
                ? theme.colors.primary[500]
                : theme.colors.background.primary
            }
            isUser={isUser}
            shadowColor={theme.colors.text.primary}
          >
            <MessageText
              textColor={
                isUser ? theme.colors.text.inverse : theme.colors.text.primary
              }
              accessibilityRole="text"
            >
              {message.text}
            </MessageText>

            <MessageTime
              color={
                isUser ? theme.colors.text.inverse : theme.colors.text.tertiary
              }
              accessibilityRole="text"
              accessibilityLabel={`Message sent at ${formatTime(message.timestamp)}`}
            >
              {formatTime(message.timestamp)}
            </MessageTime>

            {/* Emotion Badge */}
            {message.emotion && (
              <EmotionBadge
                backgroundColor={getEmotionColor(message.emotion)}
                borderColor={theme.colors.background.primary}
                isUser={isUser}
                accessibilityRole="text"
                accessibilityLabel={`Message emotion: ${message.emotion}`}
                accessibilityElementsHidden={false}
              >
                <Text style={{ fontSize: 10 }} accessibilityElementsHidden>
                  {getEmotionIcon(message.emotion)}
                </Text>
              </EmotionBadge>
            )}
          </MessageBubbleStyled>
        </TouchableOpacity>

        {/* Message Actions for AI messages */}
        {!isUser && (
          <MessageActions
            isUser={isUser}
            accessibilityRole="group"
            accessibilityLabel="Message actions"
          >
            <ActionButton
              backgroundColor={theme.colors.background.secondary}
              onPress={() => handleActionPress("Helpful")}
              accessibilityRole="button"
              accessibilityLabel="Mark as helpful"
              accessibilityHint="Double tap to mark this AI response as helpful"
            >
              <ActionText color={theme.colors.text.secondary}>
                👍 Helpful
              </ActionText>
            </ActionButton>

            <ActionButton
              backgroundColor={theme.colors.background.secondary}
              onPress={() => handleActionPress("Clarify")}
              accessibilityRole="button"
              accessibilityLabel="Ask for clarification"
              accessibilityHint="Double tap to request clarification on this response"
            >
              <ActionText color={theme.colors.text.secondary}>
                💬 Clarify
              </ActionText>
            </ActionButton>
          </MessageActions>
        )}

        {isUser && (
          <Avatar
            backgroundColor={theme.colors.secondary[500]}
            isUser={isUser}
            accessibilityElementsHidden
          >
            <AvatarText color={theme.colors.text.inverse}>👤</AvatarText>
          </Avatar>
        )}
      </BubbleWrapper>
    </BubbleContainer>
  );
};

export default MessageBubble;
