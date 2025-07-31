import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Keyboard, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../contexts/ThemeContext';
import Icon from '../common/Icon';

const ChatInput = ({
  onSendMessage,
  onStartVoiceInput,
  onStopVoiceInput,
  isVoiceInputActive = false,
  placeholder = 'Type a message...',
  accessibilityLabel = 'Message input',
  accessibilityHint = 'Type your message and press send',
}) => {
  const { theme } = useTheme();
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onSendMessage(message.trim());
      setMessage('');
      Keyboard.dismiss();
    }
  };

  const handleVoiceButton = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isVoiceInputActive) {
      onStopVoiceInput();
    } else {
      onStartVoiceInput();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: theme.colors.background.surface },
        ]}
      >
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: theme.colors.background.input,
              borderColor: theme.colors.border.main,
            },
          ]}
        >
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text.placeholder}
          style={[
            styles.input,
            { color: theme.colors.text.primary },
          ]}
          multiline
          maxLength={1000}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
        />

        <View style={styles.actions}>
          <Pressable
            onPress={handleVoiceButton}
            style={[
              styles.iconButton,
              isVoiceInputActive && {
                backgroundColor: theme.colors.primary.main,
              },
            ]}
            accessibilityLabel={isVoiceInputActive ? 'Stop voice input' : 'Start voice input'}
            accessibilityRole="button"
          >
            <Icon
              name={isVoiceInputActive ? 'microphone' : 'microphone-outline'}
              size={24}
              color={isVoiceInputActive ? theme.colors.text.onPrimary : theme.colors.text.secondary}
            />
          </Pressable>

          <Pressable
            onPress={handleSend}
            disabled={!message.trim()}
            style={[
              styles.iconButton,
              {
                backgroundColor: message.trim()
                  ? theme.colors.primary.main
                  : theme.colors.background.disabled,
              },
            ]}
            accessibilityLabel="Send message"
            accessibilityRole="button"
            accessibilityState={{ disabled: !message.trim() }}
          >
            <Icon
              name="send"
              size={24}
              color={message.trim()
                ? theme.colors.text.onPrimary
                : theme.colors.text.disabled}
            />
          </Pressable>
        </View>
      </View>
    </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderTopWidth: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 1,
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 8,
    paddingTop: 8,
    paddingBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 44, height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});

export default ChatInput;
