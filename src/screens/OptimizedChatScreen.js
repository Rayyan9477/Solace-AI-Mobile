import React, { memo, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  InteractionManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';

// Optimized imports with lazy loading
import { LazyComponentWrapper, withLazyWrapper } from '../components/common/LazyComponentWrapper';
import { useMemoryOptimization, useVirtualList } from '../hooks/useMemoryOptimization';
import { useDebouncedCallback, usePerformanceMonitor } from '../hooks/useRenderOptimization';
import { useMemoizedStyles } from '../hooks/useMemoizedStyles';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Container, 
  Card, 
  HeaderText, 
  BodyText,
  Button,
  Row,
  Column 
} from '../styles/OptimizedStyledComponents';

// Lazy load heavy components
const LazyVoiceRecorder = withLazyWrapper(
  () => import('../components/chat/VoiceRecorder'),
  { componentType: 'chat', loadingMessage: 'Loading voice recorder...' }
);

const LazyEmotionIndicator = withLazyWrapper(
  () => import('../components/chat/EmotionIndicator'),
  { componentType: 'default', size: 'small' }
);

/**
 * Highly optimized ChatScreen demonstrating all performance techniques:
 * 1. Code splitting with lazy loading
 * 2. Memory management with virtualization
 * 3. Minimal re-renders with memoization
 * 4. Optimized styled-components
 * 5. Performance monitoring
 */

// Memoized message bubble component
const MessageBubble = memo(({ message, index, theme }) => {
  const memoizedStyles = useMemoizedStyles(() => ({
    container: {
      marginVertical: 4,
      marginHorizontal: 16,
    },
    userBubble: {
      alignSelf: 'flex-end',
      backgroundColor: theme.colors.therapeutic.calming[500],
      borderRadius: 16,
      borderBottomRightRadius: 4,
      padding: 12,
      maxWidth: '80%',
    },
    aiBubble: {
      alignSelf: 'flex-start',
      backgroundColor: theme.colors.background.secondary,
      borderRadius: 16,
      borderBottomLeftRadius: 4,
      padding: 12,
      maxWidth: '80%',
      borderWidth: 1,
      borderColor: theme.colors.gray[200],
    },
    messageText: {
      fontSize: 16,
      lineHeight: 22,
    },
    userText: {
      color: theme.colors.text.inverse,
    },
    aiText: {
      color: theme.colors.text.primary,
    },
    timestamp: {
      fontSize: 11,
      marginTop: 4,
      opacity: 0.7,
    },
  }), [theme]);

  const isUser = message.sender === 'user';
  
  return (
    <View style={memoizedStyles.container}>
      <View style={isUser ? memoizedStyles.userBubble : memoizedStyles.aiBubble}>
        <BodyText 
          style={isUser ? memoizedStyles.userText : memoizedStyles.aiText}
        >
          {message.text}
        </BodyText>
        <BodyText 
          variant="tertiary"
          style={memoizedStyles.timestamp}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </BodyText>
      </View>
    </View>
  );
}, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  return (
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.text === nextProps.message.text &&
    prevProps.index === nextProps.index
  );
});

MessageBubble.displayName = 'MessageBubble';

// Memoized input component
const ChatInput = memo(({ onSendMessage, disabled, theme }) => {
  const [inputText, setInputText] = useState('');
  
  const memoizedStyles = useMemoizedStyles(() => ({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: theme.colors.background.primary,
      borderTopWidth: 1,
      borderTopColor: theme.colors.gray[200],
    },
    textInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.colors.gray[300],
      borderRadius: 22,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      maxHeight: 100,
      minHeight: 44,
      color: theme.colors.text.primary,
      backgroundColor: theme.colors.background.secondary,
    },
    sendButton: {
      marginLeft: 8,
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: inputText.trim() 
        ? theme.colors.therapeutic.calming[500] 
        : theme.colors.gray[300],
      alignItems: 'center',
      justifyContent: 'center',
    },
  }), [theme, inputText]);

  // Debounced send to prevent spam
  const debouncedSend = useDebouncedCallback(() => {
    if (inputText.trim() && !disabled) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  }, 300, [inputText, disabled]);

  return (
    <View style={memoizedStyles.container}>
      <TextInput
        style={memoizedStyles.textInput}
        value={inputText}
        onChangeText={setInputText}
        placeholder="Type your message..."
        placeholderTextColor={theme.colors.text.tertiary}
        multiline
        disabled={disabled}
      />
      <Button 
        style={memoizedStyles.sendButton}
        onPress={debouncedSend}
        disabled={!inputText.trim() || disabled}
      >
        <Text style={{ color: theme.colors.text.inverse }}>Send</Text>
      </Button>
    </View>
  );
}, (prevProps, nextProps) => {
  return prevProps.disabled === nextProps.disabled;
});

ChatInput.displayName = 'ChatInput';

const OptimizedChatScreen = memo(({ navigation, route }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  
  // Performance monitoring
  usePerformanceMonitor('OptimizedChatScreen');
  
  // Memory optimization
  const {
    cacheData,
    getCachedData,
    memoryPressure,
    performCleanup,
  } = useMemoryOptimization({
    maxCacheSize: 50,
    cleanupInterval: 30000,
  });

  // Selective Redux subscription
  const messages = useSelector(
    state => state.chat?.messages || [],
    (left, right) => left.length === right.length && left[left.length - 1]?.id === right[right.length - 1]?.id
  );
  
  const isTyping = useSelector(state => state.chat?.isTyping || false);
  
  // Local state
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [showEmotionIndicator, setShowEmotionIndicator] = useState(false);
  
  // Refs
  const flatListRef = useRef(null);
  const lastMessageIdRef = useRef(null);

  // Virtual list for large message datasets
  const {
    visibleItems: visibleMessages,
    setScrollOffset,
    totalHeight,
  } = useVirtualList(messages, {
    itemHeight: 80, // Average message height
    containerHeight: 600,
    overscan: 5,
  });

  // Memoized callbacks
  const handleSendMessage = useCallback(async (messageText) => {
    const newMessage = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    // Cache the message
    cacheData(newMessage.id, newMessage);
    
    dispatch({
      type: 'chat/addMessage',
      payload: newMessage,
    });

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: `I understand you said: "${messageText}". How can I help you further?`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      
      cacheData(aiMessage.id, aiMessage);
      dispatch({
        type: 'chat/addMessage',
        payload: aiMessage,
      });
    }, 1000);
  }, [dispatch, cacheData]);

  const toggleVoiceMode = useCallback(() => {
    setIsVoiceMode(prev => !prev);
  }, []);

  const toggleEmotionIndicator = useCallback(() => {
    setShowEmotionIndicator(prev => !prev);
  }, []);

  // Memoized render functions
  const renderMessage = useCallback(({ item, index }) => {
    return (
      <MessageBubble
        message={item}
        index={index}
        theme={theme}
      />
    );
  }, [theme]);

  const keyExtractor = useCallback((item) => item.id, []);

  // Auto-scroll to bottom for new messages
  useEffect(() => {
    if (messages.length > 0 && lastMessageIdRef.current !== messages[messages.length - 1].id) {
      lastMessageIdRef.current = messages[messages.length - 1].id;
      
      InteractionManager.runAfterInteractions(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      });
    }
  }, [messages]);

  // Memory cleanup on memory pressure
  useEffect(() => {
    if (memoryPressure === 'high') {
      performCleanup();
    }
  }, [memoryPressure, performCleanup]);

  // Memoized header component
  const HeaderComponent = useMemo(() => (
    <Card style={{ margin: 16, marginBottom: 8 }}>
      <Row>
        <Column style={{ flex: 1 }}>
          <HeaderText size="lg">AI Mental Health Chat</HeaderText>
          <BodyText variant="secondary">
            I'm here to provide support and guidance
            {memoryPressure !== 'normal' && ` (Memory: ${memoryPressure})`}
          </BodyText>
        </Column>
        <Button
          variant="secondary"
          onPress={toggleEmotionIndicator}
          style={{ marginLeft: 12 }}
        >
          <BodyText>Emotions</BodyText>
        </Button>
      </Row>
    </Card>
  ), [memoryPressure, toggleEmotionIndicator]);

  return (
    <Container>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Header */}
          {HeaderComponent}

          {/* Emotion Indicator - Lazy loaded */}
          {showEmotionIndicator && (
            <LazyComponentWrapper
              componentType="default"
              size="small"
              loadingMessage="Loading emotion indicator..."
            >
              <LazyEmotionIndicator />
            </LazyComponentWrapper>
          )}

          {/* Messages List */}
          <FlatList
            ref={flatListRef}
            data={visibleMessages}
            renderItem={renderMessage}
            keyExtractor={keyExtractor}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingVertical: 8 }}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            initialNumToRender={15}
            getItemLayout={(data, index) => ({
              length: 80,
              offset: 80 * index,
              index,
            })}
            onScroll={(event) => {
              setScrollOffset(event.nativeEvent.contentOffset.y);
            }}
            scrollEventThrottle={16}
          />

          {/* Typing Indicator */}
          {isTyping && (
            <View style={{ padding: 16 }}>
              <BodyText variant="secondary">AI is typing...</BodyText>
            </View>
          )}

          {/* Voice Recorder - Lazy loaded */}
          {isVoiceMode && (
            <LazyComponentWrapper
              componentType="chat"
              loadingMessage="Loading voice recorder..."
            >
              <LazyVoiceRecorder
                onRecordingComplete={(data) => {
                  handleSendMessage('[Voice message]');
                  setIsVoiceMode(false);
                }}
                onCancel={() => setIsVoiceMode(false)}
              />
            </LazyComponentWrapper>
          )}

          {/* Input */}
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isTyping}
            theme={theme}
          />

          {/* Voice Mode Toggle */}
          <Row style={{ padding: 16, justifyContent: 'center' }}>
            <Button
              variant={isVoiceMode ? 'primary' : 'secondary'}
              onPress={toggleVoiceMode}
            >
              <BodyText>
                {isVoiceMode ? 'Exit Voice Mode' : 'Voice Mode'}
              </BodyText>
            </Button>
          </Row>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Container>
  );
});

OptimizedChatScreen.displayName = 'OptimizedChatScreen';

export default OptimizedChatScreen;