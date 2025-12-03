import { logger } from "@shared/utils/logger";

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
  Share,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenErrorBoundary } from "@shared/components/ErrorBoundaryWrapper";

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

interface SuggestedPrompt {
  id: string;
  text: string;
  category: 'greeting' | 'feelings' | 'support' | 'wellness';
}

// Suggested prompts for quick replies
const INITIAL_PROMPTS: SuggestedPrompt[] = [
  { id: '1', text: "I'm feeling anxious today", category: 'feelings' },
  { id: '2', text: "Can you help me relax?", category: 'support' },
  { id: '3', text: "Tell me about mindfulness", category: 'wellness' },
  { id: '4', text: "I need someone to talk to", category: 'support' },
];

const ONGOING_PROMPTS: SuggestedPrompt[] = [
  { id: '5', text: "Tell me more", category: 'support' },
  { id: '6', text: "How can I improve?", category: 'wellness' },
  { id: '7', text: "What should I do next?", category: 'support' },
  { id: '8', text: "I'm feeling better now", category: 'feelings' },
];

const ChatScreenComponent = ({ navigation, route }: any) => {
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
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const [suggestedPrompts, setSuggestedPrompts] = useState<SuggestedPrompt[]>(INITIAL_PROMPTS);
  const [showSessionSummary, setShowSessionSummary] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [sessionStartTime] = useState(new Date());
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const crisisManagerRef = useRef<typeof CrisisManager | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // CRIT-003 FIX: Flag to prevent concurrent crisis handling race conditions
  const [isHandlingCrisis, setIsHandlingCrisis] = useState(false);
  const crisisHandlingRef = useRef(false); // Use ref for immediate access in async context

  useEffect(() => {
    const initCrisisManager = async () => {
      // CrisisManager is exported as a singleton instance, not a class
      crisisManagerRef.current = CrisisManager;
      await crisisManagerRef.current.loadConfiguration();
    };
    initCrisisManager();

    // Check if disclaimer has been shown
    const checkDisclaimer = async () => {
      try {
        const disclaimerShown = await AsyncStorage.getItem('chat_disclaimer_shown');
        if (!disclaimerShown) {
          setShowDisclaimer(true);
        }
      } catch (error) {
        // If error, show disclaimer to be safe
        setShowDisclaimer(true);
      }
    };
    checkDisclaimer();

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
    promptsContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.main,
      backgroundColor: theme.colors.background.primary,
    },
    promptsTitle: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.secondary,
      marginBottom: 8,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    promptsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    promptChip: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.border.main,
      backgroundColor: theme.colors.background.secondary,
    },
    promptText: {
      fontSize: 14,
      color: theme.colors.text.primary,
    },
    modalOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    summaryModal: {
      width: "85%",
      maxWidth: 400,
      backgroundColor: theme.colors.background.primary,
      borderRadius: 24,
      padding: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    summaryHeader: {
      alignItems: "center",
      marginBottom: 24,
    },
    summaryTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 8,
    },
    summarySubtitle: {
      fontSize: 14,
      color: theme.colors.text.secondary,
      textAlign: "center",
    },
    summaryStats: {
      gap: 16,
      marginBottom: 24,
    },
    statRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: theme.colors.background.secondary,
      borderRadius: 16,
    },
    statIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.green["20"],
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    statContent: {
      flex: 1,
    },
    statLabel: {
      fontSize: 12,
      color: theme.colors.text.secondary,
      marginBottom: 2,
    },
    statValue: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    summaryActions: {
      gap: 12,
    },
    summaryButton: {
      paddingVertical: 14,
      borderRadius: 24,
      alignItems: "center",
    },
    summaryButtonPrimary: {
      backgroundColor: theme.colors.orange["40"],
    },
    summaryButtonSecondary: {
      backgroundColor: theme.colors.background.secondary,
      borderWidth: 1,
      borderColor: theme.colors.border.main,
    },
    summaryButtonText: {
      fontSize: 16,
      fontWeight: "600",
    },
    summaryButtonTextPrimary: {
      color: "#FFFFFF",
    },
    summaryButtonTextSecondary: {
      color: theme.colors.text.primary,
    },
    disclaimerModal: {
      width: "90%",
      maxWidth: 450,
      backgroundColor: theme.colors.background.primary,
      borderRadius: 24,
      padding: 28,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    disclaimerIcon: {
      alignSelf: "center",
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: theme.colors.orange["20"],
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },
    disclaimerTitle: {
      fontSize: 22,
      fontWeight: "700",
      color: theme.colors.text.primary,
      textAlign: "center",
      marginBottom: 12,
    },
    disclaimerText: {
      fontSize: 15,
      color: theme.colors.text.secondary,
      textAlign: "center",
      lineHeight: 22,
      marginBottom: 8,
    },
    disclaimerHighlight: {
      fontWeight: "600",
      color: theme.colors.text.primary,
    },
    disclaimerPoints: {
      marginTop: 16,
      marginBottom: 20,
      gap: 12,
    },
    disclaimerPoint: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    disclaimerBullet: {
      fontSize: 18,
      marginRight: 12,
      marginTop: 2,
    },
    disclaimerPointText: {
      flex: 1,
      fontSize: 14,
      color: theme.colors.text.secondary,
      lineHeight: 20,
    },
  });

  const handlePromptSelect = (prompt: SuggestedPrompt) => {
    setInputText(prompt.text);
    setShowPrompts(false);
    // Auto-send the message
    setTimeout(() => {
      sendMessage(prompt.text);
    }, 100);
  };

  const exportChatAsText = async () => {
    try {
      // Format conversation as text
      const header = `Freud AI Therapy Session
Session Date: ${sessionStartTime.toLocaleDateString()} ${sessionStartTime.toLocaleTimeString()}
Duration: ${calculateSessionDuration()}
Messages: ${messages.length}
${"=".repeat(50)}

`;

      const conversationText = messages
        .map((msg) => {
          const sender = msg.isUser ? "You" : "Dr. Freud AI";
          const time = msg.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          return `[${time}] ${sender}:\n${msg.text}\n`;
        })
        .join("\n");

      const fullText = header + conversationText;

      // Share the text using native share dialog
      await Share.share({
        message: fullText,
        title: "Freud AI Chat Export",
      });

      Alert.alert(
        "Export Complete",
        "Your conversation has been prepared for sharing.",
        [{ text: "OK" }]
      );
    } catch (error: any) {
      Alert.alert(
        "Export Failed",
        error.message || "Could not export conversation. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const sendMessage = async (customText?: string) => {
    const messageToSend = customText || inputText.trim();
    if (messageToSend || !isSendingMessage) {
      const messageText = sanitizeText(messageToSend, 5000);

      // Prevent sending while another message is processing
      if (isSendingMessage) return;

      setIsSendingMessage(true);
      setErrorMessage(null);

      // CRIT-003 FIX: Guard against concurrent crisis handling with ref for immediate check
      if (crisisManagerRef.current && !crisisHandlingRef.current) {
        const crisisAnalysis =
          await crisisManagerRef.current.analyzeCrisisRisk(messageText);

        if (
          (crisisAnalysis.risk === "critical" ||
          crisisAnalysis.risk === "high") &&
          !crisisHandlingRef.current // Double-check after async operation
        ) {
          // Set both state and ref to prevent race conditions
          crisisHandlingRef.current = true;
          setIsHandlingCrisis(true);

          try {
            const crisisResponse = await crisisManagerRef.current.handleCrisis(
              crisisAnalysis,
              { id: route.params?.userId || "anonymous" },
            );

            Alert.alert(
              "Support Available",
              crisisResponse?.message || "Support resources are available",
              [
                ...(crisisResponse?.actions || []).map((action: any) => ({
                  text: action.label,
                  onPress: async () => {
                    if (action.type === "call" && action.number) {
                      await crisisManagerRef.current?.makeEmergencyCall(
                        action.number,
                      );
                    } else if (action.type === "text" && action.number) {
                      await crisisManagerRef.current?.sendCrisisText();
                    }
                  },
                  style: (action.urgent ? "destructive" : "default") as "destructive" | "default",
                })),
                { text: "Continue Talking", style: "cancel" as "cancel", onPress: () => {
                  // Reset crisis handling flag when alert is dismissed
                  crisisHandlingRef.current = false;
                  setIsHandlingCrisis(false);
                }},
              ],
              { cancelable: true, onDismiss: () => {
                // Reset on dismiss as well (Android)
                crisisHandlingRef.current = false;
                setIsHandlingCrisis(false);
              }},
            );
          } catch (crisisError) {
            logger.error("Crisis handling failed:", crisisError);
            crisisHandlingRef.current = false;
            setIsHandlingCrisis(false);
          }
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

      // Update prompts to ongoing ones after first user message
      if (messages.length <= 1) {
        setSuggestedPrompts(ONGOING_PROMPTS);
      }

      // Simulate typing delay
      const isJest =
        typeof process !== "undefined" && !!process.env?.JEST_WORKER_ID;
      const delay = isJest ? 50 : Math.random() * 1500 + 1500; // 1.5-3 seconds

      // HIGH-014 FIX: Wrap async setTimeout callback with proper error handling
      // Unhandled promise rejections in setTimeout can crash the app
      setTimeout(() => {
        (async () => {
          try {
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

            // Show prompts again after AI response
            setShowPrompts(true);

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
        } catch (error) {
            logger.error("Failed to generate response:", error);
            setErrorMessage("Unable to generate response. Please try again.");

            // Add error message to chat
            const errorResponse: Message = {
              id: (Date.now() + 1).toString(),
              text: "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
              isUser: false,
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorResponse]);
          } finally {
            setIsSendingMessage(false);
          }
        })().catch((err) => {
          // HIGH-014 FIX: Catch any unhandled promise rejection from IIFE
          logger.error("Unhandled chat response error:", err);
          setIsTyping(false);
          setIsSendingMessage(false);
        });
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

  const renderSuggestedPrompts = () => {
    if (!showPrompts || inputText.length > 0 || isTyping) {
      return null;
    }

    return (
      <View style={styles.promptsContainer}>
        <Text style={styles.promptsTitle}>Suggested Topics</Text>
        <View style={styles.promptsRow}>
          {suggestedPrompts.map((prompt) => (
            <TouchableOpacity
              key={prompt.id}
              style={styles.promptChip}
              onPress={() => handlePromptSelect(prompt)}
              accessible
              accessibilityRole="button"
              accessibilityLabel={prompt.text}
            >
              <Text style={styles.promptText}>{prompt.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const handleAcceptDisclaimer = async () => {
    try {
      await AsyncStorage.setItem('chat_disclaimer_shown', 'true');
      setShowDisclaimer(false);
    } catch (error) {
      // Even if storage fails, close the disclaimer
      setShowDisclaimer(false);
    }
  };

  const calculateSessionDuration = () => {
    const now = new Date();
    const durationMs = now.getTime() - sessionStartTime.getTime();
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  };

  const renderDisclaimer = () => {
    if (!showDisclaimer) {
      return null;
    }

    return (
      <View style={styles.modalOverlay}>
        <View style={styles.disclaimerModal}>
          <View style={styles.disclaimerIcon}>
            <MentalHealthIcon name="AlertCircle" size={36} color={theme.colors.orange["40"]} style={{}} />
          </View>

          <Text style={styles.disclaimerTitle}>
            Important Disclaimer
          </Text>

          <Text style={styles.disclaimerText}>
            Dr. Freud AI is an <Text style={styles.disclaimerHighlight}>AI-powered support tool</Text> designed to provide emotional support and guidance.
          </Text>

          <View style={styles.disclaimerPoints}>
            <View style={styles.disclaimerPoint}>
              <Text style={styles.disclaimerBullet}>⚠️</Text>
              <Text style={styles.disclaimerPointText}>
                This is <Text style={styles.disclaimerHighlight}>not a replacement</Text> for professional medical advice, diagnosis, or treatment.
              </Text>
            </View>

            <View style={styles.disclaimerPoint}>
              <Text style={styles.disclaimerBullet}>🏥</Text>
              <Text style={styles.disclaimerPointText}>
                If you're experiencing a <Text style={styles.disclaimerHighlight}>mental health crisis</Text>, please contact emergency services or a crisis hotline immediately.
              </Text>
            </View>

            <View style={styles.disclaimerPoint}>
              <Text style={styles.disclaimerBullet}>👨‍⚕️</Text>
              <Text style={styles.disclaimerPointText}>
                Always consult with qualified healthcare professionals for medical advice and treatment plans.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.summaryButton, styles.summaryButtonPrimary]}
            onPress={handleAcceptDisclaimer}
            accessible
            accessibilityRole="button"
            accessibilityLabel="I understand and accept"
          >
            <Text style={[styles.summaryButtonText, styles.summaryButtonTextPrimary]}>
              I Understand & Accept
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderSessionSummary = () => {
    if (!showSessionSummary) {
      return null;
    }

    const userMessages = messages.filter(m => m.isUser).length;
    const aiMessages = messages.filter(m => !m.isUser).length;
    const duration = calculateSessionDuration();

    return (
      <View style={styles.modalOverlay}>
        <View style={styles.summaryModal}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Session Summary</Text>
            <Text style={styles.summarySubtitle}>
              Here's what we covered in this conversation
            </Text>
          </View>

          <View style={styles.summaryStats}>
            <View style={styles.statRow}>
              <View style={styles.statIcon}>
                <MentalHealthIcon name="MessageCircle" size={20} color={theme.colors.green["60"]} style={{}} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Messages Exchanged</Text>
                <Text style={styles.statValue}>{userMessages + aiMessages}</Text>
              </View>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statIcon}>
                <MentalHealthIcon name="Clock" size={20} color={theme.colors.green["60"]} style={{}} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Session Duration</Text>
                <Text style={styles.statValue}>{duration}</Text>
              </View>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statIcon}>
                <Text style={{ fontSize: 20 }}>💚</Text>
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Support Provided</Text>
                <Text style={styles.statValue}>Excellent</Text>
              </View>
            </View>
          </View>

          <View style={styles.summaryActions}>
            <TouchableOpacity
              style={[styles.summaryButton, styles.summaryButtonSecondary]}
              onPress={async () => {
                await exportChatAsText();
                setShowSessionSummary(false);
              }}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Export conversation"
            >
              <Text style={[styles.summaryButtonText, styles.summaryButtonTextSecondary]}>
                📤 Export Conversation
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.summaryButton, styles.summaryButtonPrimary]}
              onPress={() => setShowSessionSummary(false)}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Continue conversation"
            >
              <Text style={[styles.summaryButtonText, styles.summaryButtonTextPrimary]}>
                Continue Conversation
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.summaryButton, styles.summaryButtonSecondary]}
              onPress={() => {
                setShowSessionSummary(false);
                navigation.goBack();
              }}
              accessible
              accessibilityRole="button"
              accessibilityLabel="End session"
            >
              <Text style={[styles.summaryButtonText, styles.summaryButtonTextSecondary]}>
                End Session
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

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
          onPress={() => setShowSessionSummary(true)}
          accessibilityRole="button"
          accessibilityLabel="View session summary"
        >
          <MentalHealthIcon
            name="MoreVertical"
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

        {/* Suggested Prompts */}
        {renderSuggestedPrompts()}

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
              (!inputText.trim() || isSendingMessage) && styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isSendingMessage}
            accessibilityRole="button"
            accessibilityLabel={isSendingMessage ? "Sending message" : "Send message"}
            testID="send-button"
          >
            {isSendingMessage ? (
              <View style={{ width: 20, height: 20 }}>
                <Text style={{ color: "#FFFFFF", fontSize: 10 }}>...</Text>
              </View>
            ) : (
              <MentalHealthIcon
                name="Send"
                size={20}
                color="#FFFFFF"
                style={{}}
              />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Professional Disclaimer Modal */}
      {renderDisclaimer()}

      {/* Session Summary Modal */}
      {renderSessionSummary()}
    </SafeAreaView>
  );
};

export const ChatScreen = (props: any) => (
  <ScreenErrorBoundary screenName="Chat">
    <ChatScreenComponent {...props} />
  </ScreenErrorBoundary>
);

export default ChatScreen;
