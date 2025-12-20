import { logger } from "@shared/utils/logger";

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

import { platform } from "../../../shared/utils/platform";

// UI/DESIGN FIX: Correct Freud Design System V1.2 colors
// User messages use mindfulBrown (warm, grounding)
// AI messages use serenityGreen (calming, therapeutic)
const FreudColors = {
  mindfulBrown: {
    10: '#F7F4F2',
    20: '#E5DDD8',
    30: '#DDC2B8',
    40: '#C0A091',
    50: '#B07F6D',
    60: '#926247',
    70: '#704A33',
    80: '#5D4037',
    90: '#4A3229',
    100: '#372315',
  },
  serenityGreen: {
    40: '#B3C98D',
    50: '#98B068',
    60: '#7D944D',
    70: '#627537',
  },
  optimisticGray: {
    10: '#F5F5F5',
    20: '#EEEEEE',
    30: '#E0E0E0',
    40: '#BDBDBD',
    50: '#9E9E9E',
    60: '#757575',
    90: '#424242',
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
      logger.error("Error in handleSpeak:", error);
      setIsSpeaking(false);
    } finally {
      setIsLoading(false);
    }
  };

  // UI/DESIGN FIX: Get therapeutic colors based on user/assistant role
  // Using Freud Design System V1.2 color palette
  // User: mindfulBrown (warm, grounding - fosters safety)
  // AI: serenityGreen (calming, therapeutic - encourages openness)
  const getBubbleColors = () => {
    if (isUser) {
      // User messages: mindfulBrown tones for grounding
      return {
        backgroundColor: FreudColors.mindfulBrown[60], // #926247 - warm brown
        textColor: FreudColors.mindfulBrown[10], // #F7F4F2 - light cream for contrast
        timestampColor: FreudColors.mindfulBrown[30], // #DDC2B8 - lighter for secondary info
      };
    } else {
      // AI messages: serenityGreen tones for therapeutic calming effect
      return {
        backgroundColor: isDarkMode
          ? FreudColors.serenityGreen[70] // #627537 - darker green for dark mode
          : FreudColors.serenityGreen[50], // #98B068 - calming green
        textColor: isDarkMode
          ? FreudColors.optimisticGray[10] // #F5F5F5 - light text for dark mode
          : FreudColors.optimisticGray[90], // #424242 - dark text for light mode
        timestampColor: isDarkMode
          ? FreudColors.optimisticGray[40] // #BDBDBD
          : FreudColors.optimisticGray[60], // #757575
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
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.botContainer,
      ]}
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
