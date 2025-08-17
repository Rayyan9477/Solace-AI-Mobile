import * as Speech from "expo-speech";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useTheme } from "../../shared/theme/ThemeContext";
import Icon from "../common/Icon";

const ChatBubble = ({
  message,
  isUser,
  timestamp,
  onLongPress,
  accessibilityLabel,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { theme } = useTheme();

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

  return (
    <>
      {isLoading && (
        <View
          style={[
            styles.loadingOverlay,
            { backgroundColor: theme.colors.background.overlay },
          ]}
        >
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
        </View>
      )}
      <View
        style={[
          styles.container,
          isUser ? styles.userContainer : styles.botContainer,
        ]}
      >
        <Pressable
          onLongPress={onLongPress}
          style={[
            styles.bubble,
            {
              backgroundColor: isUser
                ? theme.colors.primary.main
                : theme.colors.background.surface,
              borderColor: isUser
                ? theme.colors.primary.main
                : theme.colors.border.main,
            },
          ]}
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
                color: isUser
                  ? theme.colors.text.onPrimary
                  : theme.colors.text.primary,
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
                  color: isUser
                    ? theme.colors.text.onPrimary
                    : theme.colors.text.secondary,
                },
              ]}
            >
              {formattedTime}
            </Text>

            <Pressable
              onPress={handleSpeak}
              style={styles.speakButton}
              accessibilityLabel="Speak message aloud"
              accessibilityRole="button"
            >
              <Icon
                name="volume-high"
                size={16}
                color={
                  isUser
                    ? theme.colors.text.onPrimary
                    : theme.colors.text.secondary
                }
              />
            </Pressable>
          </View>
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 8,
    maxWidth: "80%",
  },
  userContainer: {
    alignSelf: "flex-end",
  },
  botContainer: {
    alignSelf: "flex-start",
  },
  bubble: {
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    marginRight: 8,
  },
  speakButton: {
    padding: 4,
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
