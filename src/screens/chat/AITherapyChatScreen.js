import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  SafeAreaView,
} from "react-native";

import { MentalHealthIcon, NavigationIcon } from "../../components/icons";
import { useTheme } from "../../contexts/ThemeContext";

const AITherapyChatScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionMode, setSessionMode] = useState("general"); // general, crisis, guided
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const therapyModes = [
    {
      id: "general",
      title: "General Support",
      description: "Open conversation for any concerns",
      icon: "Heart",
      color: theme.colors.therapeutic.nurturing[500],
    },
    {
      id: "anxiety",
      title: "Anxiety Support",
      description: "Focused help for anxiety management",
      icon: "Mindfulness",
      color: theme.colors.therapeutic.calming[500],
    },
    {
      id: "depression",
      title: "Mood Support",
      description: "Support for low mood and depression",
      icon: "Brain",
      color: theme.colors.therapeutic.peaceful[500],
    },
    {
      id: "crisis",
      title: "Crisis Support",
      description: "Immediate support for difficult times",
      icon: "Therapy",
      color: theme.colors.error[400],
    },
  ];

  const quickResponses = [
    "I'm feeling anxious",
    "I had a difficult day",
    "I need someone to talk to",
    "I'm feeling overwhelmed",
    "I want to practice coping skills",
    "I'm having trouble sleeping",
  ];

  const initialMessages = [
    {
      id: "1",
      text: "Hello! I'm Solace, your AI therapy companion. I'm here to provide support, listen without judgment, and help you work through whatever you're experiencing.",
      sender: "ai",
      timestamp: new Date(),
      type: "welcome",
    },
    {
      id: "2",
      text: "How are you feeling today? You can share anything that's on your mind, or select one of the quick responses below to get started.",
      sender: "ai",
      timestamp: new Date(),
      type: "prompt",
    },
  ];

  useEffect(() => {
    setMessages(initialMessages);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const generateAIResponse = (userMessage) => {
    // Simulated AI responses based on keywords and context
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("anxious") || lowerMessage.includes("anxiety")) {
      return {
        text: "I understand you're feeling anxious. That's a very common experience, and you're not alone. Let's try a grounding technique together. Can you name 5 things you can see around you right now?",
        suggestions: [
          "Yes, let's try that",
          "I need something else",
          "Tell me more about anxiety",
        ],
      };
    }

    if (
      lowerMessage.includes("sad") ||
      lowerMessage.includes("depressed") ||
      lowerMessage.includes("down")
    ) {
      return {
        text: "I hear that you're going through a difficult time. It takes courage to reach out when you're feeling down. Your feelings are valid, and it's okay to not be okay sometimes. What's been weighing on your mind lately?",
        suggestions: ["Work stress", "Relationship issues", "I don't know"],
      };
    }

    if (lowerMessage.includes("overwhelmed")) {
      return {
        text: "Feeling overwhelmed can be really challenging. It sounds like you have a lot on your plate right now. Sometimes breaking things down into smaller, manageable pieces can help. What feels most overwhelming to you at the moment?",
        suggestions: [
          "Too many tasks",
          "Emotional stress",
          "Everything feels too much",
        ],
      };
    }

    if (lowerMessage.includes("sleep") || lowerMessage.includes("tired")) {
      return {
        text: "Sleep difficulties can really impact how we feel during the day. Good sleep hygiene is so important for mental health. Have you noticed any patterns in what might be affecting your sleep?",
        suggestions: ["Racing thoughts", "Stress", "No specific reason"],
      };
    }

    if (
      lowerMessage.includes("crisis") ||
      lowerMessage.includes("harm") ||
      lowerMessage.includes("hurt")
    ) {
      return {
        text: "I'm concerned about what you're going through. If you're having thoughts of harming yourself, please reach out to a crisis helpline or emergency services immediately. You matter, and there are people who want to help. Would you like me to provide some crisis resources?",
        suggestions: [
          "Yes, provide resources",
          "I'm safe for now",
          "I need immediate help",
        ],
        urgent: true,
      };
    }

    // Default supportive response
    const defaultResponses = [
      "Thank you for sharing that with me. It sounds like you're dealing with something important. Can you tell me more about how this is affecting you?",
      "I appreciate you opening up. It's not always easy to put our feelings into words. What would be most helpful for you right now?",
      "I'm here to listen and support you. What you're experiencing matters. How long have you been feeling this way?",
    ];

    return {
      text: defaultResponses[
        Math.floor(Math.random() * defaultResponses.length)
      ],
      suggestions: [
        "Tell me more",
        "I need coping strategies",
        "I want to change topics",
      ],
    };
  };

  const sendMessage = async (messageText = inputText) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: messageText.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(
      () => {
        const aiResponse = generateAIResponse(messageText);

        const aiMessage = {
          id: (Date.now() + 1).toString(),
          text: aiResponse.text,
          sender: "ai",
          timestamp: new Date(),
          suggestions: aiResponse.suggestions,
          urgent: aiResponse.urgent,
        };

        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);
      },
      1500 + Math.random() * 1000,
    ); // Variable response time
  };

  const handleQuickResponse = (response) => {
    sendMessage(response);
  };

  const handleSuggestion = (suggestion) => {
    sendMessage(suggestion);
  };

  const handleModeChange = (mode) => {
    setSessionMode(mode);

    const modeMessage = {
      id: Date.now().toString(),
      text: `I've switched to ${mode} mode. I'm here to provide focused support for your ${mode} concerns. How can I help you today?`,
      sender: "ai",
      timestamp: new Date(),
      type: "mode_change",
    };

    setMessages((prev) => [...prev, modeMessage]);
  };

  const renderMessage = (message) => {
    const isUser = message.sender === "user";
    const isUrgent = message.urgent;

    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.aiMessageContainer,
        ]}
      >
        {!isUser && (
          <View
            style={[
              styles.aiAvatar,
              { backgroundColor: theme.colors.therapeutic.calming[500] },
            ]}
          >
            <MentalHealthIcon
              name="Brain"
              size={16}
              color={theme.colors.text.inverse}
              variant="filled"
            />
          </View>
        )}

        <View
          style={[
            styles.messageBubble,
            isUser
              ? [
                  styles.userMessage,
                  { backgroundColor: theme.colors.therapeutic.calming[500] },
                ]
              : [
                  styles.aiMessage,
                  {
                    backgroundColor: isUrgent
                      ? theme.colors.error[50]
                      : theme.colors.background.primary,
                    borderColor: isUrgent
                      ? theme.colors.error[200]
                      : theme.colors.gray[200],
                  },
                ],
          ]}
          accessible={true}
          accessibilityRole="text"
          accessibilityLabel={isUser 
            ? `Your message: ${message.text}` 
            : `AI therapist message: ${message.text}`}
          accessibilityHint={isUser 
            ? undefined 
            : "AI response to your message"}
        >
          <Text
            style={[
              styles.messageText,
              {
                color: isUser
                  ? theme.colors.text.inverse
                  : isUrgent
                    ? theme.colors.error[700]
                    : theme.colors.text.primary,
              },
            ]}
            accessibilityElementsHidden={true}
          >
            {message.text}
          </Text>

          {message.suggestions && (
            <View style={styles.suggestionsContainer}>
              {message.suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.suggestionButton,
                    {
                      backgroundColor: isUrgent
                        ? theme.colors.error[100]
                        : theme.colors.therapeutic.calming[100],
                      borderColor: isUrgent
                        ? theme.colors.error[300]
                        : theme.colors.therapeutic.calming[300],
                    },
                  ]}
                  onPress={() => handleSuggestion(suggestion)}
                >
                  <Text
                    style={[
                      styles.suggestionText,
                      {
                        color: isUrgent
                          ? theme.colors.error[700]
                          : theme.colors.therapeutic.calming[700],
                      },
                    ]}
                  >
                    {suggestion}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <Text style={[styles.timestamp, { color: theme.colors.text.tertiary }]}>
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    );
  };

  const renderTypingIndicator = () => (
    <View style={[styles.messageContainer, styles.aiMessageContainer]}>
      <View
        style={[
          styles.aiAvatar,
          { backgroundColor: theme.colors.therapeutic.calming[500] },
        ]}
      >
        <MentalHealthIcon
          name="Brain"
          size={16}
          color={theme.colors.text.inverse}
          variant="filled"
        />
      </View>

      <View
        style={[
          styles.messageBubble,
          styles.aiMessage,
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
        <View style={styles.typingContainer}>
          <TypingDots theme={theme} />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[
          theme.colors.therapeutic.calming[50],
          theme.colors.therapeutic.peaceful[50],
          theme.colors.therapeutic.nurturing[50],
        ]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <NavigationIcon
              name="Home"
              size={24}
              color={theme.colors.text.primary}
              variant="outline"
            />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <Text
              style={[styles.headerTitle, { color: theme.colors.text.primary }]}
            >
              Solace AI Therapist
            </Text>
            <Text
              style={[
                styles.headerSubtitle,
                { color: theme.colors.text.secondary },
              ]}
            >
              {therapyModes.find((m) => m.id === sessionMode)?.title}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.modeButton}
            onPress={() => {
              /* Show mode selector */
            }}
          >
            <MentalHealthIcon
              name="Heart"
              size={24}
              color={theme.colors.text.primary}
              variant="outline"
            />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <Animated.View
          style={[styles.messagesContainer, { opacity: fadeAnim }]}
        >
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesScroll}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map(renderMessage)}
            {isTyping && renderTypingIndicator()}
          </ScrollView>
        </Animated.View>

        {/* Quick Responses */}
        {messages.length <= 2 && (
          <View style={styles.quickResponsesContainer}>
            <Text
              style={[
                styles.quickResponsesTitle,
                { color: theme.colors.text.secondary },
              ]}
            >
              Quick responses:
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.quickResponsesScroll}
            >
              {quickResponses.map((response, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.quickResponseButton,
                    { backgroundColor: theme.colors.background.primary },
                  ]}
                  onPress={() => handleQuickResponse(response)}
                >
                  <Text
                    style={[
                      styles.quickResponseText,
                      { color: theme.colors.text.primary },
                    ]}
                  >
                    {response}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Input Area */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.inputContainer}
        >
          <View style={styles.inputRow}>
            <TouchableOpacity
              style={[
                styles.attachButton,
                { backgroundColor: theme.colors.background.secondary },
              ]}
              onPress={() => {
                /* Show options like mood, voice note, etc. */
              }}
            >
              <MentalHealthIcon
                name="Heart"
                size={20}
                color={theme.colors.text.secondary}
                variant="outline"
              />
            </TouchableOpacity>

            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.colors.background.primary,
                  borderColor: theme.colors.gray[300],
                  color: theme.colors.text.primary,
                },
              ]}
              placeholder="Share what's on your mind..."
              placeholderTextColor={theme.colors.text.tertiary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />

            <TouchableOpacity
              style={[
                styles.sendButton,
                {
                  backgroundColor: inputText.trim()
                    ? theme.colors.therapeutic.calming[500]
                    : theme.colors.gray[300],
                },
              ]}
              onPress={() => sendMessage()}
              disabled={!inputText.trim() || isTyping}
            >
              <MentalHealthIcon
                name="Heart"
                size={20}
                color={theme.colors.text.inverse}
                variant="filled"
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const TypingDots = ({ theme }) => {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animateDots = () => {
      Animated.sequence([
        Animated.timing(dot1, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dot1, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        Animated.sequence([
          Animated.timing(dot2, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot2, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }, 100);

      setTimeout(() => {
        Animated.sequence([
          Animated.timing(dot3, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot3, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }, 200);
    };

    const interval = setInterval(animateDots, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.typingDots}>
      <Animated.View
        style={[
          styles.typingDot,
          { opacity: dot1, backgroundColor: theme.colors.text.secondary },
        ]}
      />
      <Animated.View
        style={[
          styles.typingDot,
          { opacity: dot2, backgroundColor: theme.colors.text.secondary },
        ]}
      />
      <Animated.View
        style={[
          styles.typingDot,
          { opacity: dot3, backgroundColor: theme.colors.text.secondary },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  headerInfo: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  modeButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  messagesContainer: {
    flex: 1,
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  messageContainer: {
    marginBottom: 16,
    alignItems: "flex-end",
  },
  userMessageContainer: {
    alignItems: "flex-end",
  },
  aiMessageContainer: {
    alignItems: "flex-start",
    flexDirection: "row",
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    marginTop: 4,
  },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: 16,
    padding: 12,
  },
  userMessage: {
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    flex: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  suggestionsContainer: {
    marginTop: 12,
    gap: 6,
  },
  suggestionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  suggestionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    marginHorizontal: 4,
  },
  typingContainer: {
    paddingVertical: 4,
  },
  typingDots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  quickResponsesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  quickResponsesTitle: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 8,
  },
  quickResponsesScroll: {
    marginHorizontal: -4,
  },
  quickResponseButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  quickResponseText: {
    fontSize: 14,
    fontWeight: "500",
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  attachButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    minHeight: 44,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AITherapyChatScreen;
