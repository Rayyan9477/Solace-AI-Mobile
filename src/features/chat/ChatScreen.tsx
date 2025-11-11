/**
 * Chat Screen - AI Therapy Chat Interface
 * Provides supportive conversation with AI therapist
 * Enhanced with avatars, voice input, and message reactions
 */

import { MentalHealthIcon } from "@components/icons";
import { FreudLogo } from "@components/icons/FreudIcons";
import { sanitizeText } from "@shared/utils/sanitization";
import { useTheme } from "@theme/ThemeProvider";
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
  Alert,
} from "react-native";

import CrisisManager from "../crisis/CrisisManager";
import chatResponseService from "./services/chatResponseService";
import voiceInputService from "./services/voiceInputService";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  reaction?: string;
}

export const ChatScreen = ({ navigation, route }: any) => {
  const { theme } = useTheme();

  // Initialize with a greeting message
  const initialGreeting = chatResponseService.generateGreeting(
    route.params?.userName || undefined
  );

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: initialGreeting,
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const crisisManagerRef = useRef<typeof CrisisManager | null>(null);

  useEffect(() => {
    const initCrisisManager = async () => {
      // CrisisManager is exported as a singleton instance, not a class
      crisisManagerRef.current = CrisisManager;
      await crisisManagerRef.current.loadConfiguration();
    };
    initCrisisManager();

    // Cleanup on unmount
    return () => {
      voiceInputService.cleanup();
    };
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      paddingTop: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.main,
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    headerCenter: {
      flex: 1,
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text.primary,
    },
    headerSubtitle: {
      fontSize: 12,
      color: theme.colors.text.secondary,
      marginTop: 2,
    },
    searchButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    chatContainer: {
      flex: 1,
      padding: 16,
    },
    messageWrapper: {
      marginBottom: 20,
    },
    botMessageWrapper: {
      flexDirection: "row",
      alignItems: "flex-start",
      alignSelf: "flex-start", // Ensure bot messages align left
    },
    userMessageWrapper: {
      flexDirection: "row-reverse",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      alignSelf: "flex-end", // Ensure user messages align right
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 8,
    },
    botAvatar: {
      backgroundColor: theme.colors.green["20"],
    },
    userAvatar: {
      backgroundColor: theme.colors.orange["20"],
    },
    messageContent: {
      flex: 1,
    },
    messageBubble: {
      padding: 16,
      borderRadius: 20,
      maxWidth: "85%",
    },
    botBubble: {
      backgroundColor: theme.colors.brown["20"],
      borderTopLeftRadius: 4,
    },
    userBubble: {
      backgroundColor: theme.colors.orange["40"],
      borderTopRightRadius: 4,
      alignSelf: "flex-end",
    },
    messageText: {
      fontSize: 15,
      lineHeight: 22,
    },
    botMessageText: {
      color: theme.colors.text.primary,
    },
    userMessageText: {
      color: "#FFFFFF",
    },
    messageFooter: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 6,
      paddingHorizontal: 4,
    },
    timestamp: {
      fontSize: 11,
      color: theme.colors.text.tertiary,
    },
    reaction: {
      marginLeft: 8,
      fontSize: 14,
    },
    typingIndicator: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 20,
    },
    typingBubble: {
      backgroundColor: theme.colors.brown["20"],
      padding: 16,
      borderRadius: 20,
      borderTopLeftRadius: 4,
      flexDirection: "row",
      gap: 4,
    },
    typingDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.text.tertiary,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.main,
      backgroundColor: theme.colors.background.primary,
      gap: 8,
    },
    voiceButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.background.secondary,
      justifyContent: "center",
      alignItems: "center",
    },
    voiceButtonRecording: {
      backgroundColor: theme.colors.error,
    },
    textInputWrapper: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.border.main,
      borderRadius: 24,
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: theme.colors.background.secondary,
    },
    textInput: {
      flex: 1,
      maxHeight: 100,
      fontSize: 15,
      color: theme.colors.text.primary,
    },
    emojiButton: {
      marginLeft: 8,
    },
    sendButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.orange["40"],
      justifyContent: "center",
      alignItems: "center",
    },
    sendButtonDisabled: {
      opacity: 0.5,
    },
  });

  const sendMessage = async () => {
    if (inputText.trim()) {
      const messageText = sanitizeText(inputText.trim(), 5000);

      if (crisisManagerRef.current) {
        const crisisAnalysis =
          await crisisManagerRef.current.analyzeCrisisRisk(messageText);

        if (
          crisisAnalysis.risk === "critical" ||
          crisisAnalysis.risk === "high"
        ) {
          const crisisResponse = await crisisManagerRef.current.handleCrisis(
            crisisAnalysis,
            { id: route.params?.userId || "anonymous" },
          );

          Alert.alert(
            "Support Available",
            crisisResponse.message,
            [
              ...(crisisResponse.actions || []).map((action: any) => ({
                text: action.label,
                onPress: async () => {
                  if (action.type === "call" && action.number) {
                    await crisisManagerRef.current?.callEmergencyNumber(
                      action.number,
                    );
                  } else if (action.type === "text" && action.number) {
                    await crisisManagerRef.current?.textCrisisLine(
                      action.number,
                      action.keyword,
                    );
                  }
                },
                style: action.urgent ? "destructive" : "default",
              })),
              { text: "Continue Talking", style: "cancel" },
            ],
            { cancelable: true },
          );
        }
      }

      const newMessage: Message = {
        id: Date.now().toString(),
        text: messageText,
        isUser: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);
      setInputText("");
      setIsTyping(true);

      // Simulate typing delay
      const isJest =
        typeof process !== "undefined" && !!process.env?.JEST_WORKER_ID;
      const delay = isJest ? 50 : Math.random() * 1500 + 1500; // 1.5-3 seconds

      setTimeout(() => {
        setIsTyping(false);

        // Generate response using the chat response service
        const { message: responseText, emotion } =
          chatResponseService.generateResponse(messageText);

        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: responseText,
          isUser: false,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiResponse]);

        // Optionally add emotion-based reaction
        if (emotion === "positive" && Math.random() > 0.7) {
          setTimeout(() => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiResponse.id
                  ? { ...msg, reaction: "💚" }
                  : msg
              )
            );
          }, 500);
        }
      }, delay);
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);

      // Stop pulse animation
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);

      // Stop the actual recording
      const { uri, duration } = await voiceInputService.stopRecording();

      if (uri && duration > 500) {
        // Only process if recording was at least 0.5 seconds
        // Show typing indicator while processing
        setIsTyping(true);

        // Simulate speech-to-text (in production, this would use a real API)
        const transcribedText = await voiceInputService.simulateSpeechToText(
          duration
        );

        setIsTyping(false);

        // Set the transcribed text in the input field
        setInputText(transcribedText);

        // Optionally auto-send the message
        if (route.params?.autoSendVoice) {
          // Create a synthetic event to trigger sendMessage
          setTimeout(() => {
            sendMessage();
          }, 500);
        }
      }
    } else {
      // Start recording
      const started = await voiceInputService.startRecording();

      if (started) {
        setIsRecording(true);

        // Start pulse animation
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.2,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
        ).start();
      } else {
        // Failed to start recording - show alert
        Alert.alert(
          "Recording Permission",
          "Please grant microphone permission to use voice input.",
          [{ text: "OK" }]
        );
      }
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageWrapper,
        item.isUser ? styles.userMessageWrapper : styles.botMessageWrapper,
        // Ensure a plain object with alignment is present for test style inspection
        { alignSelf: item.isUser ? "flex-end" : "flex-start" },
      ]}
    >
      {/* Avatar */}
      <View
        style={[
          styles.avatar,
          item.isUser ? styles.userAvatar : styles.botAvatar,
        ]}
      >
        {item.isUser ? (
          <Text style={{ fontSize: 18 }}>👤</Text>
        ) : (
          <FreudLogo size={20} primaryColor={theme.colors.green["60"]} />
        )}
      </View>

      {/* Message Content */}
      <View
        style={[
          styles.messageContent,
          item.isUser ? { alignSelf: "flex-end" } : { alignSelf: "flex-start" },
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            item.isUser ? styles.userBubble : styles.botBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              item.isUser ? styles.userMessageText : styles.botMessageText,
            ]}
          >
            {item.text}
          </Text>
        </View>

        {/* Message Footer */}
        <View style={styles.messageFooter}>
          <Text style={styles.timestamp}>
            {item.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          {item.reaction && (
            <Text style={styles.reaction}>{item.reaction}</Text>
          )}
        </View>
      </View>
    </View>
  );

  const renderTypingIndicator = () => (
    <View style={styles.typingIndicator} testID="typing-indicator">
      <View style={[styles.avatar, styles.botAvatar]}>
        <FreudLogo size={20} primaryColor={theme.colors.green["60"]} />
      </View>
      <View style={styles.typingBubble}>
        <View style={styles.typingDot} />
        <View style={styles.typingDot} />
        <View style={styles.typingDot} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={theme.isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MentalHealthIcon
            name="ChevronLeft"
            size={24}
            color={theme.colors.text.primary}
            style={{}}
          />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Doctor Freud AI</Text>
          <Text style={styles.headerSubtitle}>
            Get Doctor AI with Freud v1.7
          </Text>
        </View>

        <TouchableOpacity
          style={styles.searchButton}
          accessibilityRole="button"
          accessibilityLabel="Search"
        >
          <MentalHealthIcon
            name="Search"
            size={20}
            color={theme.colors.text.primary}
            style={{}}
          />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatContainer}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={isTyping ? renderTypingIndicator : null}
        />

        {/* Input Container */}
        <View style={styles.inputContainer}>
          {/* Voice Button */}
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              style={[
                styles.voiceButton,
                isRecording && styles.voiceButtonRecording,
              ]}
              onPress={toggleRecording}
              accessibilityRole="button"
              accessibilityLabel={
                isRecording ? "Stop voice recording" : "Start voice recording"
              }
            >
              <MentalHealthIcon
                name="Mic"
                size={20}
                color={isRecording ? "#FFFFFF" : theme.colors.text.primary}
                style={{}}
              />
            </TouchableOpacity>
          </Animated.View>

          {/* Text Input */}
          <View style={styles.textInputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type to start chatting..."
              placeholderTextColor={theme.colors.text.tertiary}
              multiline
              maxLength={1000}
              onSubmitEditing={sendMessage}
              accessibilityLabel="Message input"
            />
            <TouchableOpacity style={styles.emojiButton}>
              <Text style={{ fontSize: 20 }}>😊</Text>
            </TouchableOpacity>
          </View>

          {/* Send Button */}
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
            accessibilityRole="button"
            accessibilityLabel="Send message"
            testID="send-button"
          >
            <MentalHealthIcon
              name="Send"
              size={20}
              color="#FFFFFF"
              style={{}}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
