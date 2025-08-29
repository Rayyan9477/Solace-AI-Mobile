import { useNavigation } from "@react-navigation/native";
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Vibration,
  ActivityIndicator,
  BackHandler,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";

import ChatTopicSidebar from "../../components/chat/ChatTopicSidebar";
import EmotionIndicator from "../../components/chat/EmotionIndicator";
import MessageBubble from "../../components/chat/MessageBubble";
import TypingIndicator from "../../components/chat/TypingIndicator";
import VoiceRecorder from "../../components/chat/VoiceRecorder";
import { MentalHealthIcon } from "../../components/icons/MentalHealthIcons";
import { useTheme } from "../../shared/theme/ThemeContext";
import { spacing, typography, borderRadius, shadows } from "../../shared/theme/theme";
import {
  addMessage,
  setTyping,
  toggleVoice,
} from "../../store/slices/chatSlice";

const ChatContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${(props) => props.backgroundColor};
`;

const Header = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.borderColor};
  background-color: ${(props) => props.backgroundColor};
`;

const HeaderTitle = styled(View)`
  flex: 1;
  align-items: center;
`;

const AIName = styled(Text)`
  font-size: 18px;
  font-weight: 600;
  color: ${(props) => props.color};
`;

const AIStatus = styled(Text)`
  font-size: 12px;
  color: ${(props) => props.color};
  margin-top: 2px;
`;

const HeaderButton = styled(TouchableOpacity)`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: ${(props) => props.backgroundColor};
  justify-content: center;
  align-items: center;
`;

const MessagesContainer = styled(View)`
  flex: 1;
  background-color: ${(props) => props.backgroundColor};
`;

const MessagesList = styled(FlatList)`
  flex: 1;
  padding: 16px;
`;

const InputContainer = styled(KeyboardAvoidingView)`
  background-color: ${(props) => props.backgroundColor};
  border-top-width: 1px;
  border-top-color: ${(props) => props.borderColor};
  padding: 16px 20px;
`;

const InputWrapper = styled(View)`
  flex-direction: row;
  align-items: flex-end;
  background-color: ${(props) => props.backgroundColor};
  border-radius: 25px;
  padding: 8px 16px;
  max-height: 120px;
  border: 1px solid ${(props) => props.borderColor};
`;

const MessageInput = styled(TextInput)`
  flex: 1;
  max-height: 100px;
  min-height: 40px;
  font-size: 16px;
  color: ${(props) => props.textColor};
  padding: 8px 0;
  text-align-vertical: top;
`;

const SendButton = styled(Animated.View)`
  margin-left: 12px;
`;

const ActionButton = styled(TouchableOpacity)`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: ${(props) => props.backgroundColor};
  justify-content: center;
  align-items: center;
`;

const VoiceButton = styled(TouchableOpacity)`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: ${(props) => props.backgroundColor};
  justify-content: center;
  align-items: center;
  margin-left: 8px;
`;

const EmotionContainer = styled(View)`
  padding: 12px 20px;
  background-color: ${(props) => props.backgroundColor};
  border-top-width: 1px;
  border-top-color: ${(props) => props.borderColor};
`;

const ChatScreen = () => {
  const { theme, isDarkMode } = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { messages, isTyping, voiceEnabled } = useSelector(
    (state) => state.chat,
  );

  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [currentTopicCount, setCurrentTopicCount] = useState(24);

  const flatListRef = useRef(null);
  const sendButtonScale = useRef(new Animated.Value(0)).current;
  const inputHeight = useRef(new Animated.Value(40)).current;
  const headerAnimation = useRef(new Animated.Value(0)).current;

  // Handle hardware back button on Android
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
          return true;
        }
        return false;
      },
    );

    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    // Animate send button when text is entered
    Animated.spring(sendButtonScale, {
      toValue: inputText.trim() ? 1 : 0,
      useNativeDriver: true,
      tension: 150,
      friction: 8,
    }).start();
  }, [inputText]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || sendingMessage) return;

    try {
      setSendingMessage(true);

      const userMessage = {
        id: Date.now().toString(),
        text: inputText.trim(),
        type: "user",
        timestamp: new Date().toISOString(),
        emotion: currentEmotion,
      };

      dispatch(addMessage(userMessage));
      setInputText("");
      setCurrentEmotion(null);

      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);

      // Simulate AI typing
      dispatch(setTyping(true));

      // Simulate AI response delay
      setTimeout(
        () => {
          const aiResponse = generateAIResponse(userMessage.text);
          dispatch(addMessage(aiResponse));
          dispatch(setTyping(false));
          setSendingMessage(false);

          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 100);
        },
        1500 + Math.random() * 2000,
      );
    } catch (error) {
      console.error("Failed to send message:", error);
      setSendingMessage(false);
      dispatch(setTyping(false));
    }
  };

  const generateAIResponse = (userText) => {
    // Simple AI response simulation - replace with actual AI API
    const responses = [
      "I understand how you're feeling. Can you tell me more about what's on your mind?",
      "Thank you for sharing that with me. It takes courage to open up about difficult emotions.",
      "I hear you. Sometimes it helps to talk through these feelings. What would you like to explore?",
      "That sounds challenging. How are you taking care of yourself during this time?",
      "I'm here to listen and support you. What feels most important to discuss right now?",
    ];

    return {
      id: Date.now().toString() + "_ai",
      text: responses[Math.floor(Math.random() * responses.length)],
      type: "ai",
      timestamp: new Date().toISOString(),
      emotion: "supportive",
    };
  };

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
    Vibration.vibrate(50);
    dispatch(toggleVoice());
  };

  const handleSidebarToggle = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setSidebarVisible(false);
    // Here you would typically load the conversation history for this topic
    console.log('Selected topic:', topic);
  };

  // Header animation on scroll
  useEffect(() => {
    Animated.timing(headerAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const detectEmotion = (text) => {
    // Simple emotion detection - replace with actual emotion API
    const emotions = {
      happy: ["happy", "joy", "great", "awesome", "good", "wonderful"],
      sad: ["sad", "down", "depressed", "awful", "terrible", "bad"],
      anxious: ["anxious", "worried", "nervous", "scared", "fear"],
      angry: ["angry", "mad", "frustrated", "upset", "annoyed"],
      calm: ["calm", "peaceful", "relaxed", "zen", "tranquil"],
    };

    const lowerText = text.toLowerCase();
    for (const [emotion, keywords] of Object.entries(emotions)) {
      if (keywords.some((keyword) => lowerText.includes(keyword))) {
        return emotion;
      }
    }
    return "neutral";
  };

  const handleTextChange = (text) => {
    setInputText(text);
    if (text.trim()) {
      const emotion = detectEmotion(text);
      setCurrentEmotion(emotion);
    } else {
      setCurrentEmotion(null);
    }
  };

  const renderMessage = ({ item, index }) => (
    <MessageBubble
      message={item}
      isLast={index === messages.length - 1}
      onPress={() => {}}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={theme.colors.background.primary}
      />
      
      <ChatContainer backgroundColor={theme.colors.background.primary}>
        {/* Enhanced Professional Header */}
        <Animated.View
          style={[
            styles.professionalHeader,
            {
              backgroundColor: theme.colors.background.primary,
              borderBottomColor: theme.colors.border.primary,
              transform: [{ translateY: headerAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              })}],
              opacity: headerAnimation,
            }
          ]}
        >
          {/* Top Header Row */}
          <View style={styles.topHeaderRow}>
            <TouchableOpacity
              style={[styles.menuButton, { backgroundColor: theme.colors.background.secondary }]}
              onPress={handleSidebarToggle}
              accessibilityRole="button"
              accessibilityLabel="Open chat topics sidebar"
            >
              <MentalHealthIcon name="menu" size={20} color={theme.colors.text.primary} />
            </TouchableOpacity>

            <View style={styles.topicsInfo}>
              <MentalHealthIcon name="grid" size={16} color={theme.colors.therapeutic.empathy[500]} />
              <Text style={[styles.topicsText, { color: theme.colors.text.primary }]}>
                Topics
              </Text>
              <View style={[styles.topicsBadge, { backgroundColor: theme.colors.therapeutic.empathy[500] }]}>
                <Text style={[styles.topicsBadgeText, { color: theme.colors.text.inverse }]}>
                  {currentTopicCount}
                </Text>
              </View>
            </View>

            <View style={styles.brandingHeader}>
              <Text style={[styles.brandingText, { color: theme.colors.text.primary }]}>
                Doctor Freud.ai
              </Text>
              <View style={styles.statusIndicators}>
                <View style={[styles.statusTag, { backgroundColor: theme.colors.success[100] }]}>
                  <Text style={[styles.statusTagText, { color: theme.colors.success[700] }]}>
                    GET A MOBILE
                  </Text>
                </View>
                <View style={[styles.statusTag, { backgroundColor: theme.colors.warning[100] }]}>
                  <Text style={[styles.statusTagText, { color: theme.colors.warning[700] }]}>
                    GET A WEB BETA
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.searchButton}
              accessibilityRole="button"
              accessibilityLabel="Search conversations"
            >
              <MentalHealthIcon name="search" size={18} color={theme.colors.text.secondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingsButton}
              accessibilityRole="button" 
              accessibilityLabel="Settings"
            >
              <MentalHealthIcon name="settings" size={18} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>

          {/* AI Assistant Header */}
          <LinearGradient
            colors={[`${theme.colors.therapeutic.calming[500]}10`, `${theme.colors.therapeutic.nurturing[500]}10`]}
            style={styles.aiHeaderGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.aiHeaderContent}>
              <View style={styles.aiAvatarContainer}>
                <LinearGradient
                  colors={[theme.colors.therapeutic.calming[400], theme.colors.therapeutic.nurturing[400]]}
                  style={styles.aiAvatar}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <MentalHealthIcon name="brain" size={18} color={theme.colors.text.inverse} />
                </LinearGradient>
                {isTyping && (
                  <View style={[styles.typingIndicator, { backgroundColor: theme.colors.success[500] }]} />
                )}
              </View>
              
              <View style={styles.aiInfoContainer}>
                <Text style={[styles.aiName, { color: theme.colors.text.primary }]}>
                  {selectedTopic ? selectedTopic.title : "Dr. Freud AI Assistant"}
                </Text>
                <Text style={[styles.aiStatus, { color: theme.colors.success[600] }]}>
                  {isTyping ? "Analyzing your message..." : "Ready to help • Online"}
                </Text>
                {selectedTopic && (
                  <Text style={[styles.topicSubtitle, { color: theme.colors.text.secondary }]}>
                    {selectedTopic.subtitle}
                  </Text>
                )}
              </View>

              <TouchableOpacity 
                style={[styles.emergencyButton, { backgroundColor: theme.colors.error[50] }]}
                accessibilityRole="button"
                accessibilityLabel="Emergency support"
              >
                <MentalHealthIcon name="heart" size={16} color={theme.colors.error[500]} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>

      {/* Messages */}
      <MessagesContainer backgroundColor={theme.colors.background.secondary}>
        <MessagesList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
        />

        {isTyping && <TypingIndicator />}
      </MessagesContainer>

      {/* Emotion Indicator */}
      {currentEmotion && (
        <EmotionContainer
          backgroundColor={theme.colors.background.primary}
          borderColor={theme.colors.gray[200]}
        >
          <EmotionIndicator emotion={currentEmotion} />
        </EmotionContainer>
      )}

      {/* Input Container */}
      <InputContainer
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        backgroundColor={theme.colors.background.primary}
        borderColor={theme.colors.gray[200]}
      >
        <InputWrapper
          backgroundColor={theme.colors.background.secondary}
          borderColor={theme.colors.gray[300]}
        >
          <MessageInput
            placeholder="Type your message..."
            placeholderTextColor={theme.colors.text.tertiary}
            value={inputText}
            onChangeText={handleTextChange}
            multiline
            textColor={theme.colors.text.primary}
            blurOnSubmit={false}
            onSubmitEditing={handleSendMessage}
          />

          <VoiceButton
            backgroundColor={
              isRecording ? theme.colors.error[500] : theme.colors.primary[500]
            }
            onPress={handleVoiceToggle}
            onLongPress={handleVoiceToggle}
          >
            <Icon
              name={isRecording ? "stop" : "mic"}
              size={20}
              color={theme.colors.text.inverse}
            />
          </VoiceButton>

          <SendButton
            style={{
              transform: [{ scale: sendButtonScale }],
              opacity: sendButtonScale,
            }}
          >
            <ActionButton
              backgroundColor={theme.colors.primary[500]}
              onPress={handleSendMessage}
              disabled={!inputText.trim() || sendingMessage}
            >
              {sendingMessage ? (
                <ActivityIndicator
                  size="small"
                  color={theme.colors.text.inverse}
                />
              ) : (
                <Icon name="send" size={20} color={theme.colors.text.inverse} />
              )}
            </ActionButton>
          </SendButton>
        </InputWrapper>
      </InputContainer>

        {/* Voice Recorder Modal */}
        {isRecording && (
          <VoiceRecorder
            isVisible={isRecording}
            onClose={() => setIsRecording(false)}
            onSend={(voiceMessage) => {
              dispatch(addMessage(voiceMessage));
              setIsRecording(false);
            }}
          />
        )}
      </ChatContainer>

      {/* Chat Topic Sidebar */}
      <ChatTopicSidebar
        isVisible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        onTopicSelect={handleTopicSelect}
        selectedTopicId={selectedTopic?.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  professionalHeader: {
    borderBottomWidth: 1,
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight || 0,
  },
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    justifyContent: 'space-between',
  },
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  topicsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1.5],
    borderRadius: borderRadius.md,
  },
  topicsText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    marginLeft: spacing[2],
    marginRight: spacing[2],
  },
  topicsBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[0.5],
    borderRadius: borderRadius.full,
    minWidth: 24,
    alignItems: 'center',
  },
  topicsBadgeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  brandingHeader: {
    flex: 1,
    alignItems: 'center',
  },
  brandingText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semiBold,
    marginBottom: spacing[1],
  },
  statusIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusTag: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[0.5],
    borderRadius: borderRadius.sm,
    marginHorizontal: spacing[1],
  },
  statusTagText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  searchButton: {
    padding: spacing[2],
    marginLeft: spacing[2],
  },
  settingsButton: {
    padding: spacing[2],
    marginLeft: spacing[1],
  },
  aiHeaderGradient: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
  },
  aiHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiAvatarContainer: {
    position: 'relative',
  },
  aiAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  typingIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  aiInfoContainer: {
    flex: 1,
    marginLeft: spacing[3],
  },
  aiName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semiBold,
    marginBottom: spacing[0.5],
  },
  aiStatus: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    marginBottom: spacing[0.5],
  },
  topicSubtitle: {
    fontSize: typography.sizes.sm,
    fontStyle: 'italic',
  },
  emergencyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing[2],
    ...shadows.sm,
  },
});

export default ChatScreen;
