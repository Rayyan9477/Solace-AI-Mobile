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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";

import EmotionIndicator from "../../components/chat/EmotionIndicator";
import MessageBubble from "../../components/chat/MessageBubble";
import TypingIndicator from "../../components/chat/TypingIndicator";
import VoiceRecorder from "../../components/chat/VoiceRecorder";
import { useTheme } from "../../shared/theme/ThemeContext";
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
  const { theme } = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { messages, isTyping, voiceEnabled } = useSelector(
    (state) => state.chat,
  );

  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);

  const flatListRef = useRef(null);
  const sendButtonScale = useRef(new Animated.Value(0)).current;
  const inputHeight = useRef(new Animated.Value(40)).current;

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
    <ChatContainer backgroundColor={theme.colors.background.primary}>
      {/* Header */}
      <Header
        backgroundColor={theme.colors.background.primary}
        borderColor={theme.colors.gray[200]}
      >
        <HeaderButton
          backgroundColor={theme.colors.background.secondary}
          onPress={() => {}}
        >
          <Icon name="menu" size={24} color={theme.colors.text.primary} />
        </HeaderButton>

        <HeaderTitle>
          <AIName color={theme.colors.text.primary}>Solace AI</AIName>
          <AIStatus color={theme.colors.success[500]}>
            {isTyping ? "Typing..." : "Online"}
          </AIStatus>
        </HeaderTitle>

        <HeaderButton
          backgroundColor={theme.colors.background.secondary}
          onPress={() => {}}
        >
          <Icon name="more-vert" size={24} color={theme.colors.text.primary} />
        </HeaderButton>
      </Header>

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
  );
};

export default ChatScreen;
