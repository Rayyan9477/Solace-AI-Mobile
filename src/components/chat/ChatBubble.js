import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as Speech from 'expo-speech';
import { useTheme } from '../../contexts/ThemeContext';
import Icon from '../common/Icon';

const ChatBubble = ({
  message,
  isUser,
  timestamp,
  onLongPress,
  accessibilityLabel,
}) => {
  const { theme } = useTheme();

  const handleSpeak = async () => {
    const isSpeaking = await Speech.isSpeakingAsync();
    if (isSpeaking) {
      await Speech.stop();
    } else {
      await Speech.speak(message, {
        language: 'en',
        pitch: 1.0,
        rate: 0.9,
      });
    }
  };

  const formattedTime = new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
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
        accessibilityLabel={accessibilityLabel || `${isUser ? 'Your' : 'Assistant'} message: ${message}`}
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
              color={isUser
                ? theme.colors.text.onPrimary
                : theme.colors.text.secondary}
            />
          </Pressable>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 8,
    maxWidth: '80%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  botContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    marginRight: 8,
  },
  speakButton: {
    padding: 4,
  },
});

export default ChatBubble;
