/**
 * Enhanced Chat Bubble Component
 * Expo-compatible with Material Design 3 and therapeutic styling
 */

import { useTheme } from "@theme/ThemeProvider";
import * as Speech from "expo-speech";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Card, Surface, IconButton } from "react-native-paper";

// Mock imports for now

import { platform } from "../../../shared/utils/platform";
// Mock FreudColors for now
const FreudColors = {
  serenityGreen: {
    60: "#34C759",
  },
  optimisticGray: {
    10: "#F7FAFC",
    40: "#A0AEC0",
    60: "#718096",
    90: "#2D3748",
  },
};

const AnimatedCard = motion(Card);

export interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp: string;
  onLongPress?: () => void;
  accessibilityLabel?: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  isUser,
  timestamp,
  onLongPress,
  accessibilityLabel,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { isDark: isDarkMode } = useTheme();

  // Handle speech synthesis with Expo compatibility
  const handleSpeak = async () => {
    if (!Speech || isLoading || isSpeaking) {
      return;
    }

    setIsLoading(true);
    try {
      const currentlySpeaking = await Speech.isSpeakingAsync();
      if (currentlySpeaking) {
        await Speech.stop();
        setIsSpeaking(false);
      } else {
        setIsSpeaking(true);
        await Promise.resolve(
          Speech.speak(message, {
            language: "en",
            pitch: 1,
            rate: 0.9,
          }),
        );
        // Reset speaking state after a short delay (speech duration estimate)
        setTimeout(() => setIsSpeaking(false), 1000);
      }
    } catch (error) {
      console.error("Error in handleSpeak:", error);
      setIsSpeaking(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Get therapeutic colors based on user/assistant role
  const getBubbleColors = () => {
    if (isUser) {
      return {
        backgroundColor: FreudColors.serenityGreen[60],
        textColor: "#FFFFFF",
        timestampColor: "rgba(255, 255, 255, 0.8)",
      };
    } else {
      return {
        backgroundColor: isDarkMode
          ? FreudColors.optimisticGray[90]
          : "#FFFFFF",
        textColor: isDarkMode
          ? FreudColors.optimisticGray[10]
          : FreudColors.optimisticGray[90],
        timestampColor: isDarkMode
          ? FreudColors.optimisticGray[40]
          : FreudColors.optimisticGray[60],
      };
    }
  };

  const colors = getBubbleColors();
  const formattedTime = new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Platform-specific animation configuration
  const animationProps = platform.select({
    ios: {
      initial: { opacity: 0, y: 20, scale: 0.9 },
      animate: { opacity: 1, y: 0, scale: 1 },
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
        delay: 0.1,
      },
    },
    android: {
      initial: { opacity: 0, x: isUser ? 50 : -50 },
      animate: { opacity: 1, x: 0 },
      transition: {
        type: "spring" as const,
        stiffness: 250,
        damping: 25,
        delay: 0.1,
      },
    },
    web: {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, delay: 0.1 },
    },
    default: {
      initial: { opacity: 0, y: 20, scale: 0.9 },
      animate: { opacity: 1, y: 0, scale: 1 },
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
        delay: 0.1,
      },
    },
  });

  return (
    <AnimatedCard
      mode="contained"
      {...animationProps}
      style={
        [
          styles.container,
          isUser ? styles.userContainer : styles.botContainer,
        ] as any
      }
    >
      <Surface
        mode="flat"
        elevation={platform.isWeb ? 1 : 2}
        style={[
          styles.bubble,
          {
            backgroundColor: colors.backgroundColor,
          },
          isUser ? styles.userBubble : styles.assistantBubble,
        ]}
      >
        <Pressable
          onLongPress={onLongPress}
          style={styles.bubbleContent}
          accessibilityLabel={
            accessibilityLabel ||
            `${isUser ? "Your" : "Assistant"} message: ${message}`
          }
          accessibilityRole="text"
          accessibilityHint="Double tap to hear message spoken aloud"
        >
          <Text
            style={[
              styles.message,
              {
                color: colors.textColor,
              },
            ]}
          >
            {message}
          </Text>

          <View style={styles.footer}>
            <Text
              style={[
                styles.timestamp,
                {
                  color: colors.timestampColor,
                },
              ]}
            >
              {formattedTime}
            </Text>

            {Speech && (
              <IconButton
                icon="volume-high"
                size={16}
                iconColor={colors.timestampColor}
                onPress={handleSpeak}
                disabled={isLoading}
                accessibilityLabel="Speak message aloud"
                style={styles.speakButton}
              />
            )}
          </View>
        </Pressable>
      </Surface>
    </AnimatedCard>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    marginHorizontal: 12,
    maxWidth: "85%",
  },
  userContainer: {
    alignSelf: "flex-end",
  },
  botContainer: {
    alignSelf: "flex-start",
  },
  bubble: {
    borderRadius: 20,
    overflow: "hidden",
  },
  userBubble: {
    borderBottomRightRadius: 8,
  },
  assistantBubble: {
    borderBottomLeftRadius: 8,
  },
  bubbleContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  message: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "400",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  timestamp: {
    fontSize: 11,
    fontWeight: "500",
  },
  speakButton: {
    margin: 0,
  },
});

export default ChatBubble;
