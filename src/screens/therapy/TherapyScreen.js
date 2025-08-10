import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useSelector, useDispatch } from 'react-redux';

import { MentalHealthIcon, NavigationIcon } from '../../components/icons';
import { useTheme } from '../../contexts/ThemeContext';
import TherapySessionRecorder from '../../components/therapy/TherapySessionRecorder';
import ChatInput from '../../components/chat/ChatInput';
import TherapeuticChatBubble from '../../components/chat/TherapeuticChatBubble';
import { Button } from '../../components/common';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const TherapyScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const scrollViewRef = useRef(null);
  
  // Screen state
  const [sessionState, setSessionState] = useState('idle'); // idle, active, paused, completed
  const [interactionMode, setInteractionMode] = useState('text'); // text, voice, guided
  const [messages, setMessages] = useState([]);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isAIResponding, setIsAIResponding] = useState(false);
  const [sessionId] = useState(() => `therapy_${Date.now()}`);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;
  
  // Session timer
  const sessionTimer = useRef(null);
  
  // Therapy exercises and prompts
  const therapyExercises = [
    {
      id: 'grounding_5_4_3_2_1',
      title: '5-4-3-2-1 Grounding',
      description: 'A mindfulness technique to help you feel present',
      icon: 'Mindfulness',
      color: theme.colors.therapeutic.calming[500],
      prompts: [
        "Let's try the 5-4-3-2-1 grounding technique. Name 5 things you can see around you.",
        "Now, tell me 4 things you can touch or feel.",
        "What are 3 things you can hear right now?",
        "Can you identify 2 things you can smell?",
        "Finally, name 1 thing you can taste."
      ]
    },
    {
      id: 'breathing_exercise',
      title: 'Mindful Breathing',
      description: 'Guided breathing to reduce stress and anxiety',
      icon: 'Heart',
      color: theme.colors.therapeutic.peaceful[500],
      prompts: [
        "Let's practice mindful breathing together. Take a slow, deep breath in through your nose for 4 counts.",
        "Hold that breath for 4 counts.",
        "Now slowly exhale through your mouth for 6 counts.",
        "How do you feel after that breath? Let's do a few more cycles together."
      ]
    },
    {
      id: 'thought_challenging',
      title: 'Thought Challenging',
      description: 'Examine and reframe negative thoughts',
      icon: 'Brain',
      color: theme.colors.therapeutic.focus[500],
      prompts: [
        "What's a thought that's been bothering you lately?",
        "What evidence do you have that this thought is true?",
        "What evidence contradicts this thought?",
        "What would you tell a good friend if they had this thought?",
        "How can we reframe this thought in a more balanced way?"
      ]
    },
    {
      id: 'mood_exploration',
      title: 'Mood Check-In',
      description: 'Explore and understand your current emotions',
      icon: 'Heart',
      color: theme.colors.therapeutic.nurturing[500],
      prompts: [
        "How are you feeling right now, on a scale of 1-10?",
        "What emotions are you experiencing? Can you name them specifically?",
        "Where do you feel these emotions in your body?",
        "What might have contributed to feeling this way today?",
        "What would help you feel a little better right now?"
      ]
    }
  ];

  const initialWelcomeMessages = [
    {
      id: '1',
      text: "Welcome to your personal therapy space. I'm here to provide a safe, judgment-free environment where you can explore your thoughts and feelings.",
      sender: 'ai',
      timestamp: new Date(),
      type: 'welcome'
    },
    {
      id: '2', 
      text: "You can interact with me through text or voice - whatever feels most comfortable for you. We can have an open conversation, or I can guide you through specific therapeutic exercises.",
      sender: 'ai',
      timestamp: new Date(),
      type: 'info'
    },
    {
      id: '3',
      text: "How would you like to begin today? You can share what's on your mind, choose a guided exercise, or simply tell me how you're feeling.",
      sender: 'ai',
      timestamp: new Date(),
      type: 'prompt'
    }
  ];

  useEffect(() => {
    // Initialize session
    setMessages(initialWelcomeMessages);
    setSessionState('active');
    
    // Start entrance animations
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
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Start session timer
    sessionTimer.current = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);

    return () => {
      if (sessionTimer.current) {
        clearInterval(sessionTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (scrollViewRef.current && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const generateAIResponse = useCallback((userInput, context = {}) => {
    const input = userInput.toLowerCase();
    
    // Crisis detection
    if (input.includes('harm') || input.includes('suicide') || input.includes('kill') || input.includes('end it')) {
      return {
        text: "I'm very concerned about what you're sharing with me. If you're having thoughts of hurting yourself, please reach out for immediate help. You can contact the 988 Suicide & Crisis Lifeline (call or text 988) or go to your nearest emergency room. Your life has value, and there are people who want to help you.",
        urgent: true,
        suggestions: [
          "I need immediate help",
          "I'm safe for now",
          "Tell me about other resources"
        ]
      };
    }

    // Exercise completion
    if (currentExercise && context.exerciseStep !== undefined) {
      const exercise = therapyExercises.find(ex => ex.id === currentExercise);
      if (exercise && context.exerciseStep < exercise.prompts.length - 1) {
        return {
          text: exercise.prompts[context.exerciseStep + 1],
          type: 'exercise_prompt',
          exerciseStep: context.exerciseStep + 1
        };
      } else if (exercise) {
        return {
          text: "That was wonderful work on this exercise. How are you feeling now? Would you like to continue our conversation or try another exercise?",
          type: 'exercise_complete'
        };
      }
    }

    // Contextual responses based on keywords
    if (input.includes('anxious') || input.includes('anxiety') || input.includes('worried')) {
      return {
        text: "I hear that you're feeling anxious. Anxiety can be really challenging to deal with. Your feelings are completely valid. Would you like to try a grounding exercise that can help manage anxiety, or would you prefer to talk more about what's making you feel this way?",
        suggestions: [
          "Let's try grounding exercise",
          "I want to talk about it",
          "What helps with anxiety?"
        ]
      };
    }

    if (input.includes('sad') || input.includes('depressed') || input.includes('down') || input.includes('lonely')) {
      return {
        text: "Thank you for sharing that you're feeling down. It takes courage to reach out when we're struggling. These feelings are real and important. Sometimes when we're feeling this way, it can help to talk through what's contributing to these feelings. What's been weighing on you lately?",
        suggestions: [
          "Work/school stress",
          "Relationship issues", 
          "I don't know why"
        ]
      };
    }

    if (input.includes('angry') || input.includes('frustrated') || input.includes('mad')) {
      return {
        text: "Anger and frustration are normal emotions, though they can feel overwhelming sometimes. It sounds like something has really upset you. Anger often signals that something important to us has been threatened or violated. What's been triggering these feelings for you?",
        suggestions: [
          "Someone hurt me",
          "Things aren't fair",
          "I can't control things"
        ]
      };
    }

    if (input.includes('stress') || input.includes('overwhelmed') || input.includes('too much')) {
      return {
        text: "Feeling overwhelmed is so common, especially when life feels like it's moving too fast or there's too much on your plate. Sometimes breaking things down into smaller, manageable pieces can help. What feels most overwhelming to you right now?",
        suggestions: [
          "Too many responsibilities",
          "Emotional stress",
          "Everything feels chaotic"
        ]
      };
    }

    // Default supportive responses
    const supportiveResponses = [
      "Thank you for sharing that with me. I can hear that this is important to you. Can you tell me more about how this is affecting you?",
      "I appreciate you opening up. It's not always easy to put our feelings into words. What would feel most helpful for you right now?",
      "That sounds really significant. I'm here to listen and support you through this. How long have you been dealing with this?",
      "I hear what you're saying, and I want you to know that your feelings matter. What's been the hardest part about this for you?"
    ];

    return {
      text: supportiveResponses[Math.floor(Math.random() * supportiveResponses.length)],
      suggestions: [
        "Tell me more",
        "I need coping strategies", 
        "How can I feel better?"
      ]
    };
  }, [currentExercise]);

  const handleSendMessage = useCallback(async (messageText) => {
    if (!messageText.trim() || isAIResponding) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: messageText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsAIResponding(true);

    // Haptic feedback
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Simulate AI processing time
    const processingTime = 1500 + Math.random() * 1000;
    
    setTimeout(() => {
      const context = currentExercise ? { 
        exerciseStep: messages.filter(m => m.type === 'exercise_prompt').length 
      } : {};
      
      const aiResponse = generateAIResponse(messageText, context);

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.text,
        sender: 'ai',
        timestamp: new Date(),
        suggestions: aiResponse.suggestions,
        urgent: aiResponse.urgent,
        type: aiResponse.type
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsAIResponding(false);

      // Update exercise state if needed
      if (aiResponse.type === 'exercise_complete') {
        setCurrentExercise(null);
      }
    }, processingTime);
  }, [isAIResponding, generateAIResponse, currentExercise, messages]);

  const handleVoiceRecordingComplete = useCallback((recordingData) => {
    // For now, we'll convert voice to a text placeholder
    // In a real app, this would be processed by speech-to-text
    const voiceMessage = {
      id: Date.now().toString(),
      text: `[Voice message - ${Math.floor(recordingData.duration)}s]`,
      sender: 'user',
      timestamp: new Date(),
      isVoiceMessage: true,
      recordingData
    };

    setMessages(prev => [...prev, voiceMessage]);

    // Simulate processing voice and generate response
    setTimeout(() => {
      handleSendMessage("I shared something through voice recording");
    }, 500);
  }, [handleSendMessage]);

  const startGuidedExercise = useCallback((exerciseId) => {
    const exercise = therapyExercises.find(ex => ex.id === exerciseId);
    if (!exercise) return;

    setCurrentExercise(exerciseId);
    
    const exerciseMessage = {
      id: Date.now().toString(),
      text: `Let's begin the ${exercise.title} exercise. ${exercise.prompts[0]}`,
      sender: 'ai',
      timestamp: new Date(),
      type: 'exercise_prompt',
      exerciseStep: 0
    };

    setMessages(prev => [...prev, exerciseMessage]);
  }, []);

  const handleSuggestionPress = useCallback((suggestion) => {
    handleSendMessage(suggestion);
  }, [handleSendMessage]);

  const handleEndSession = useCallback(() => {
    Alert.alert(
      'End Therapy Session',
      'Are you sure you want to end this session? Your progress will be saved.',
      [
        { text: 'Continue Session', style: 'cancel' },
        { 
          text: 'End Session', 
          style: 'destructive',
          onPress: () => {
            setSessionState('completed');
            navigation.goBack();
          }
        }
      ]
    );
  }, [navigation]);

  const formatSessionDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderMessage = (message) => {
    return (
      <TherapeuticChatBubble
        key={message.id}
        message={message}
        onSuggestionPress={handleSuggestionPress}
        theme={theme}
        data-testid={message.sender === 'user' ? 'user-message' : 'ai-message'}
      />
    );
  };

  const renderModeSelector = () => (
    <View style={styles.modeSelector} data-testid="mode-selector">
      <TouchableOpacity
        style={[
          styles.modeButton,
          interactionMode === 'text' && styles.modeButtonActive,
          { backgroundColor: interactionMode === 'text' 
            ? theme.colors.therapeutic.calming[500] 
            : theme.colors.background.secondary 
          }
        ]}
        onPress={() => setInteractionMode('text')}
        data-testid="text-mode-button"
      >
        <MentalHealthIcon
          name="Journal"
          size={20}
          color={interactionMode === 'text' ? theme.colors.text.inverse : theme.colors.text.secondary}
          variant={interactionMode === 'text' ? 'filled' : 'outline'}
        />
        <Text style={[
          styles.modeButtonText,
          { color: interactionMode === 'text' ? theme.colors.text.inverse : theme.colors.text.secondary }
        ]}>
          Text
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.modeButton,
          interactionMode === 'voice' && styles.modeButtonActive,
          { backgroundColor: interactionMode === 'voice' 
            ? theme.colors.therapeutic.calming[500] 
            : theme.colors.background.secondary 
          }
        ]}
        onPress={() => setInteractionMode('voice')}
        data-testid="voice-mode-button"
      >
        <MentalHealthIcon
          name="Mindfulness"
          size={20}
          color={interactionMode === 'voice' ? theme.colors.text.inverse : theme.colors.text.secondary}
          variant={interactionMode === 'voice' ? 'filled' : 'outline'}
        />
        <Text style={[
          styles.modeButtonText,
          { color: interactionMode === 'voice' ? theme.colors.text.inverse : theme.colors.text.secondary }
        ]}>
          Voice
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.modeButton,
          interactionMode === 'guided' && styles.modeButtonActive,
          { backgroundColor: interactionMode === 'guided' 
            ? theme.colors.therapeutic.calming[500] 
            : theme.colors.background.secondary 
          }
        ]}
        onPress={() => setInteractionMode('guided')}
        data-testid="guided-mode-button"
      >
        <MentalHealthIcon
          name="Therapy"
          size={20}
          color={interactionMode === 'guided' ? theme.colors.text.inverse : theme.colors.text.secondary}
          variant={interactionMode === 'guided' ? 'filled' : 'outline'}
        />
        <Text style={[
          styles.modeButtonText,
          { color: interactionMode === 'guided' ? theme.colors.text.inverse : theme.colors.text.secondary }
        ]}>
          Guided
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderGuidedExercises = () => (
    <View style={styles.exercisesContainer} data-testid="exercises-container">
      <Text 
        style={[styles.exercisesTitle, { color: theme.colors.text.primary }]}
        data-testid="exercises-title"
      >
        Guided Exercises
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.exercisesScroll}>
        {therapyExercises.map((exercise) => (
          <TouchableOpacity
            key={exercise.id}
            style={[styles.exerciseCard, { backgroundColor: theme.colors.background.primary }]}
            onPress={() => startGuidedExercise(exercise.id)}
            data-testid="exercise-card"
          >
            <LinearGradient
              colors={[exercise.color + '20', exercise.color + '10']}
              style={styles.exerciseGradient}
            >
              <MentalHealthIcon
                name={exercise.icon}
                size={28}
                color={exercise.color}
                variant="filled"
              />
              <Text style={[styles.exerciseTitle, { color: theme.colors.text.primary }]}>
                {exercise.title}
              </Text>
              <Text style={[styles.exerciseDescription, { color: theme.colors.text.secondary }]}>
                {exercise.description}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: theme.colors.background.primary }]}
      data-testid="therapy-screen"
    >
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
        <Animated.View 
          style={[
            styles.header,
            { 
              borderBottomColor: theme.colors.gray[200],
              opacity: headerAnim 
            }
          ]}
          data-testid="therapy-header"
        >
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
            accessibilityRole="button"
            data-testid="back-button"
          >
            <NavigationIcon
              name="Home"
              size={24}
              color={theme.colors.text.primary}
              variant="outline"
            />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text 
              style={[styles.headerTitle, { color: theme.colors.text.primary }]}
              data-testid="therapy-title"
            >
              Therapy Session
            </Text>
            <Text 
              style={[styles.headerSubtitle, { color: theme.colors.text.secondary }]}
              data-testid="session-timer"
            >
              {formatSessionDuration(sessionDuration)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleEndSession}
            accessibilityLabel="End session"
            accessibilityRole="button"
            data-testid="end-session-button"
          >
            <MentalHealthIcon
              name="Heart"
              size={24}
              color={theme.colors.text.primary}
              variant="outline"
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Mode Selector */}
        <Animated.View 
          style={[
            styles.modeSelectorContainer,
            { 
              transform: [{ translateY: slideAnim }],
              opacity: fadeAnim 
            }
          ]}
          data-testid="mode-selector-container"
        >
          {renderModeSelector()}
        </Animated.View>

        {/* Messages */}
        <Animated.View 
          style={[
            styles.messagesContainer,
            { opacity: fadeAnim }
          ]}
          data-testid="messages-container"
        >
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesScroll}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map(renderMessage)}
            {isAIResponding && (
              <View style={styles.typingIndicator} data-testid="typing-indicator">
                <Text style={[styles.typingText, { color: theme.colors.text.secondary }]}>
                  Therapist is responding...
                </Text>
              </View>
            )}
          </ScrollView>
        </Animated.View>

        {/* Guided Exercises */}
        {interactionMode === 'guided' && (
          <Animated.View style={{ opacity: fadeAnim }} data-testid="guided-exercises">
            {renderGuidedExercises()}
          </Animated.View>
        )}

        {/* Input Area */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputContainer}
          data-testid="input-container"
        >
          {interactionMode === 'text' && (
            <ChatInput
              onSendMessage={handleSendMessage}
              placeholder="Share your thoughts and feelings..."
              disabled={isAIResponding}
              theme={theme}
              data-testid="chat-input"
            />
          )}

          {interactionMode === 'voice' && (
            <TherapySessionRecorder
              onRecordingComplete={handleVoiceRecordingComplete}
              sessionId={sessionId}
              maxDuration={300}
              disabled={isAIResponding}
              data-testid="therapy-recorder"
            />
          )}
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  modeSelectorContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
    minHeight: 44,
  },
  modeButtonActive: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '500',
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
    minHeight: screenHeight * 0.6,
  },
  typingIndicator: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  typingText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  exercisesContainer: {
    paddingVertical: 16,
  },
  exercisesTitle: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  exercisesScroll: {
    paddingLeft: 20,
  },
  exerciseCard: {
    width: 160,
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  exerciseGradient: {
    padding: 16,
    alignItems: 'center',
    minHeight: 120,
  },
  exerciseTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  exerciseDescription: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
});

export default TherapyScreen;