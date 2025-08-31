import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";

import { useTheme } from "../../shared/theme/ThemeContext";
import { freudDarkTheme } from "../../shared/theme/freudDarkTheme";

const { width, height } = Dimensions.get("window");

const DarkAITherapyChatScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();

  // Chat state
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      text: "Hi there! I'm here to support you. How are you feeling today?",
      timestamp: new Date(),
      avatar: "🤖",
    },
    {
      id: 2,
      type: "user",
      text: "I've been feeling a bit anxious lately.",
      timestamp: new Date(),
    },
    {
      id: 3,
      type: "ai",
      text: "I understand anxiety can be challenging. Can you tell me more about what's been making you feel this way?",
      timestamp: new Date(),
      avatar: "🤖",
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const typingAnim = useRef(new Animated.Value(0)).current;

  // Scroll ref
  const scrollViewRef = useRef(null);

  // Quick reply suggestions
  const [quickReplies] = useState([
    { id: 1, text: "I'm feeling anxious", emoji: "😰" },
    { id: 2, text: "I need support", emoji: "🤗" },
    { id: 3, text: "How to cope with stress?", emoji: "💭" },
    { id: 4, text: "I'm having trouble sleeping", emoji: "😴" },
    { id: 5, text: "Tell me about mindfulness", emoji: "🧘" },
  ]);

  // Chat tools/features
  const [chatTools] = useState([
    { id: "voice", icon: "🎤", label: "Voice Chat", active: false },
    { id: "mood", icon: "😊", label: "Mood Check", active: false },
    { id: "journal", icon: "📝", label: "Journal", active: false },
    { id: "resources", icon: "📚", label: "Resources", active: false },
  ]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate typing indicator
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }
  }, [isTyping]);

  const sendMessage = async (text = inputText) => {
    if (!text.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setShowSuggestions(false);
    setIsTyping(true);

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: "ai",
        text: getAIResponse(text),
        timestamp: new Date(),
        avatar: "🤖",
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 2000);
  };

  const getAIResponse = (userText) => {
    const responses = [
      "I hear you. Those feelings are valid. Let's explore some coping strategies together.",
      "Thank you for sharing that with me. How long have you been experiencing these feelings?",
      "That sounds challenging. What usually helps you feel better in these situations?",
      "I'm here to support you through this. Would you like to try a breathing exercise?",
      "It's brave of you to reach out. Let's work together to understand these feelings better.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleQuickReply = (reply) => {
    sendMessage(reply.text);
  };

  const handleToolPress = (tool) => {
    switch (tool.id) {
      case "voice":
        Alert.alert("Voice Chat", "Voice chat feature coming soon!");
        break;
      case "mood":
        navigation.navigate("Mood");
        break;
      case "journal":
        navigation.navigate("MentalHealthJournal");
        break;
      case "resources":
        navigation.navigate("MindfulResources");
        break;
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <View style={styles.headerInfo}>
        <View style={styles.aiAvatar}>
          <Text style={styles.aiAvatarText}>🤖</Text>
        </View>
        <View>
          <Text style={styles.headerTitle}>AI Therapist</Text>
          <Text style={styles.headerSubtitle}>
            Online • Always here for you
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.moreButton}>
        <Text style={styles.moreButtonText}>⋯</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMessage = (message) => {
    const isUser = message.type === "user";

    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.aiMessageContainer,
        ]}
      >
        {!isUser && (
          <View style={styles.messageAvatar}>
            <Text style={styles.messageAvatarText}>{message.avatar}</Text>
          </View>
        )}

        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userMessageBubble : styles.aiMessageBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              {
                color: isUser ? "#FFFFFF" : freudDarkTheme.colors.text.primary,
              },
            ]}
          >
            {message.text}
          </Text>
          <Text
            style={[
              styles.messageTime,
              {
                color: isUser
                  ? "rgba(255, 255, 255, 0.7)"
                  : freudDarkTheme.colors.text.tertiary,
              },
            ]}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>

        {isUser && (
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>👤</Text>
          </View>
        )}
      </View>
    );
  };

  const renderTypingIndicator = () => (
    <View style={[styles.messageContainer, styles.aiMessageContainer]}>
      <View style={styles.messageAvatar}>
        <Text style={styles.messageAvatarText}>🤖</Text>
      </View>
      <View style={[styles.messageBubble, styles.aiMessageBubble]}>
        <Animated.View
          style={[styles.typingIndicator, { opacity: typingAnim }]}
        >
          <View style={styles.typingDots}>
            <View style={styles.typingDot} />
            <View style={styles.typingDot} />
            <View style={styles.typingDot} />
          </View>
        </Animated.View>
      </View>
    </View>
  );

  const renderQuickReplies = () =>
    showSuggestions && (
      <View style={styles.quickRepliesContainer}>
        <Text style={styles.quickRepliesTitle}>Quick replies:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickRepliesScroll}
        >
          {quickReplies.map((reply) => (
            <TouchableOpacity
              key={reply.id}
              style={styles.quickReplyButton}
              onPress={() => handleQuickReply(reply)}
            >
              <Text style={styles.quickReplyEmoji}>{reply.emoji}</Text>
              <Text style={styles.quickReplyText}>{reply.text}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );

  const renderChatTools = () => (
    <View style={styles.chatToolsContainer}>
      {chatTools.map((tool) => (
        <TouchableOpacity
          key={tool.id}
          style={styles.chatTool}
          onPress={() => handleToolPress(tool)}
        >
          <Text style={styles.chatToolIcon}>{tool.icon}</Text>
          <Text style={styles.chatToolLabel}>{tool.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderInputArea = () => (
    <View style={styles.inputContainer}>
      {renderChatTools()}

      <View style={styles.inputRow}>
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type your message..."
            placeholderTextColor={freudDarkTheme.colors.text.placeholder}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.sendButton,
            inputText.trim()
              ? styles.sendButtonActive
              : styles.sendButtonInactive,
          ]}
          onPress={() => sendMessage()}
          disabled={!inputText.trim()}
        >
          <Text style={styles.sendButtonText}>
            {inputText.trim() ? "📤" : "🎤"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* Header */}
        {renderHeader()}

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }}
        >
          <Animated.View
            style={[
              styles.messagesList,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {messages.map(renderMessage)}
            {isTyping && renderTypingIndicator()}
          </Animated.View>
        </ScrollView>

        {/* Quick Replies */}
        {renderQuickReplies()}

        {/* Input Area */}
        {renderInputArea()}
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: freudDarkTheme.colors.background.primary,
  },
  keyboardContainer: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: freudDarkTheme.spacing[6],
    paddingTop: 60,
    paddingBottom: freudDarkTheme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: freudDarkTheme.colors.border.primary,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: freudDarkTheme.colors.card.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: freudDarkTheme.spacing[4],
  },
  backButtonText: {
    fontSize: 20,
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.bold,
  },
  headerInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  aiAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: freudDarkTheme.colors.accent.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: freudDarkTheme.spacing[3],
  },
  aiAvatarText: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: freudDarkTheme.typography.sizes.lg,
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.semibold,
  },
  headerSubtitle: {
    fontSize: freudDarkTheme.typography.sizes.sm,
    color: freudDarkTheme.colors.status.success,
    fontWeight: freudDarkTheme.typography.weights.medium,
    marginTop: freudDarkTheme.spacing[1],
  },
  moreButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  moreButtonText: {
    fontSize: 20,
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.bold,
  },

  // Messages
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: freudDarkTheme.spacing[4],
    paddingBottom: freudDarkTheme.spacing[6],
  },
  messagesList: {
    paddingHorizontal: freudDarkTheme.spacing[6],
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: freudDarkTheme.spacing[4],
    alignItems: "flex-end",
  },
  userMessageContainer: {
    justifyContent: "flex-end",
  },
  aiMessageContainer: {
    justifyContent: "flex-start",
  },
  messageAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: freudDarkTheme.colors.accent.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: freudDarkTheme.spacing[3],
  },
  messageAvatarText: {
    fontSize: 18,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: freudDarkTheme.colors.header.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: freudDarkTheme.spacing[3],
  },
  userAvatarText: {
    fontSize: 18,
  },
  messageBubble: {
    maxWidth: width * 0.7,
    padding: freudDarkTheme.spacing[4],
    borderRadius: freudDarkTheme.borderRadius.lg,
  },
  aiMessageBubble: {
    backgroundColor: freudDarkTheme.colors.card.background,
    borderBottomLeftRadius: freudDarkTheme.borderRadius.sm,
  },
  userMessageBubble: {
    backgroundColor: freudDarkTheme.colors.accent.primary,
    borderBottomRightRadius: freudDarkTheme.borderRadius.sm,
  },
  messageText: {
    fontSize: freudDarkTheme.typography.sizes.base,
    lineHeight: freudDarkTheme.typography.sizes.base * 1.4,
    marginBottom: freudDarkTheme.spacing[2],
  },
  messageTime: {
    fontSize: freudDarkTheme.typography.sizes.xs,
    textAlign: "right",
  },

  // Typing Indicator
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    padding: freudDarkTheme.spacing[2],
  },
  typingDots: {
    flexDirection: "row",
    alignItems: "center",
    gap: freudDarkTheme.spacing[1],
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: freudDarkTheme.colors.text.tertiary,
  },

  // Quick Replies
  quickRepliesContainer: {
    paddingHorizontal: freudDarkTheme.spacing[6],
    paddingVertical: freudDarkTheme.spacing[4],
    borderTopWidth: 1,
    borderTopColor: freudDarkTheme.colors.border.primary,
  },
  quickRepliesTitle: {
    fontSize: freudDarkTheme.typography.sizes.sm,
    color: freudDarkTheme.colors.text.secondary,
    fontWeight: freudDarkTheme.typography.weights.medium,
    marginBottom: freudDarkTheme.spacing[3],
  },
  quickRepliesScroll: {
    flexGrow: 0,
  },
  quickReplyButton: {
    backgroundColor: freudDarkTheme.colors.card.background,
    paddingHorizontal: freudDarkTheme.spacing[4],
    paddingVertical: freudDarkTheme.spacing[3],
    borderRadius: freudDarkTheme.borderRadius.full,
    marginRight: freudDarkTheme.spacing[3],
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: freudDarkTheme.colors.border.primary,
  },
  quickReplyEmoji: {
    fontSize: 16,
    marginRight: freudDarkTheme.spacing[2],
  },
  quickReplyText: {
    fontSize: freudDarkTheme.typography.sizes.sm,
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.medium,
  },

  // Chat Tools
  chatToolsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: freudDarkTheme.spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: freudDarkTheme.colors.border.primary,
  },
  chatTool: {
    alignItems: "center",
    padding: freudDarkTheme.spacing[2],
    minWidth: 60,
  },
  chatToolIcon: {
    fontSize: 20,
    marginBottom: freudDarkTheme.spacing[1],
  },
  chatToolLabel: {
    fontSize: freudDarkTheme.typography.sizes.xs,
    color: freudDarkTheme.colors.text.tertiary,
    textAlign: "center",
  },

  // Input Area
  inputContainer: {
    backgroundColor: freudDarkTheme.colors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: freudDarkTheme.colors.border.primary,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: freudDarkTheme.spacing[6],
    paddingVertical: freudDarkTheme.spacing[4],
    gap: freudDarkTheme.spacing[3],
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: freudDarkTheme.colors.input.background,
    borderRadius: freudDarkTheme.borderRadius.lg,
    borderWidth: 1,
    borderColor: freudDarkTheme.colors.input.border,
    paddingHorizontal: freudDarkTheme.spacing[4],
    paddingVertical: freudDarkTheme.spacing[3],
    minHeight: 44,
    maxHeight: 120,
  },
  textInput: {
    fontSize: freudDarkTheme.typography.sizes.base,
    color: freudDarkTheme.colors.input.text,
    textAlignVertical: "top",
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonActive: {
    backgroundColor: freudDarkTheme.colors.accent.primary,
  },
  sendButtonInactive: {
    backgroundColor: freudDarkTheme.colors.card.background,
  },
  sendButtonText: {
    fontSize: 20,
  },
});

export default DarkAITherapyChatScreen;
