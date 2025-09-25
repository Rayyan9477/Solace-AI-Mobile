import * as Speech from "expo-speech";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Card, Surface, IconButton } from "react-native-paper";
import { motion } from "framer-motion";

import { useTheme } from "../../design-system/theme/ThemeProvider";
import Icon from "../common/Icon";

const AnimatedCard = motion(Card);
const AnimatedSurface = motion(Surface);

const ChatBubble = ({
  message,
  isUser,
  timestamp,
  onLongPress,
  accessibilityLabel,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { theme, isDarkMode } = useTheme();

  const handleSpeak = async () => {
    setIsLoading(true);
    try {
      const isSpeaking = await Speech.isSpeakingAsync();
      if (isSpeaking) {
        await Speech.stop();
      } else {
        await Speech.speak(message, {
          language: "en",
          pitch: 1.0,
          rate: 0.9,
        });
      }
    } catch (error) {
      console.error("Error in handleSpeak:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formattedTime = new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Get therapeutic colors based on user/assistant role
  const getBubbleColors = () => {
    if (isUser) {
      return {
        backgroundColor: theme.palette.therapeutic.growth,
        textColor: '#FFFFFF',
        timestampColor: 'rgba(255, 255, 255, 0.8)',
      };
    } else {
      return {
        backgroundColor: isDarkMode
          ? theme.colors.background.secondary
          : '#FFFFFF',
        textColor: theme.colors.text.primary,
        timestampColor: theme.colors.text.tertiary,
      };
    }
  };

  const colors = getBubbleColors();

  return (
    <>
      {isLoading && (
        <View
          style={[
            styles.loadingOverlay,
            { backgroundColor: 'rgba(0,0,0,0.4)' },
          ]}
        >
          <ActivityIndicator size="large" color={theme.palette.therapeutic.growth} />
        </View>
      )}
      <AnimatedCard
        mode="contained"
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
          delay: 0.1
        }}
        style={[
          styles.container,
          isUser ? styles.userContainer : styles.botContainer,
        ]}
      >
        <Surface
          mode="flat"
          elevation={2}
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

              <IconButton
                icon="volume-high"
                size={16}
                iconColor={colors.timestampColor}
                onPress={handleSpeak}
                accessibilityLabel="Speak message aloud"
                style={styles.speakButton}
              />
            </View>
          </Pressable>
        </Surface>
      </AnimatedCard>
    </>
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
    overflow: 'hidden',
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
    fontWeight: '400',
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  timestamp: {
    fontSize: 11,
    fontWeight: '500',
  },
  speakButton: {
    margin: 0,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
});

export default ChatBubble;
