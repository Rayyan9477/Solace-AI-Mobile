import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import * as Speech from 'expo-speech';
import { useTheme } from '../../contexts/ThemeContext';
import { hapticUtils, styleUtils } from '../../utils/platformOptimizations';
import Icon from '../common/Icon';

const TherapeuticIndicator = ({ type = 'listening' }) => {
  const { theme } = useTheme();
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };

    if (type === 'listening' || type === 'thinking') {
      pulse();
    }

    return () => pulseAnim.stopAnimation();
  }, [type, pulseAnim]);

  const getIndicatorConfig = () => {
    switch (type) {
      case 'listening':
        return {
          color: theme.colors.therapeutic.calming[500],
          icon: '👂',
          text: 'Listening with care'
        };
      case 'thinking':
        return {
          color: theme.colors.therapeutic.peaceful[500],
          icon: '💭',
          text: 'Thinking thoughtfully'
        };
      case 'supportive':
        return {
          color: theme.colors.therapeutic.nurturing[500],
          icon: '🤝',
          text: 'Here to support you'
        };
      default:
        return {
          color: theme.colors.primary[500],
          icon: '🤖',
          text: 'AI Therapist'
        };
    }
  };

  const config = getIndicatorConfig();

  return (
    <Animated.View 
      style={[
        styles.therapeuticIndicator,
        { 
          backgroundColor: config.color + '20',
          transform: [{ scale: pulseAnim }]
        }
      ]}
    >
      <Text style={styles.indicatorIcon}>{config.icon}</Text>
      <Text style={[styles.indicatorText, { color: config.color }]}>
        {config.text}
      </Text>
    </Animated.View>
  );
};

const EmotionalContext = ({ userMood, intensity }) => {
  const { theme } = useTheme();
  
  if (!userMood) return null;

  const getMoodColor = (mood) => {
    const moodColors = {
      happy: theme.colors.mood.happy,
      sad: theme.colors.mood.sad,
      anxious: theme.colors.mood.anxious,
      angry: theme.colors.mood.angry,
      calm: theme.colors.mood.calm,
      neutral: theme.colors.mood.neutral,
    };
    return moodColors[mood] || theme.colors.gray[400];
  };

  return (
    <View style={styles.emotionalContext}>
      <View style={[
        styles.moodIndicator,
        { backgroundColor: getMoodColor(userMood) + '20' }
      ]}>
        <Text style={[styles.contextText, { color: getMoodColor(userMood) }]}>
          Responding to your {userMood} mood
          {intensity && ` (${intensity}/5)`}
        </Text>
      </View>
    </View>
  );
};

const SupportOptions = ({ onBreakSuggested, onResourcesRequested, onClarification }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.supportOptions}>
      <TouchableOpacity 
        style={[styles.supportOption, { backgroundColor: theme.colors.therapeutic.calming[50] }]}
        onPress={onBreakSuggested}
      >
        <Text style={[styles.supportOptionText, { color: theme.colors.therapeutic.calming[700] }]}>
          💆‍♀️ Take a break
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.supportOption, { backgroundColor: theme.colors.therapeutic.nurturing[50] }]}
        onPress={onResourcesRequested}
      >
        <Text style={[styles.supportOptionText, { color: theme.colors.therapeutic.nurturing[700] }]}>
          📚 Resources
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.supportOption, { backgroundColor: theme.colors.therapeutic.peaceful[50] }]}
        onPress={onClarification}
      >
        <Text style={[styles.supportOptionText, { color: theme.colors.therapeutic.peaceful[700] }]}>
          ❓ Clarify
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const TherapeuticChatBubble = ({
  message,
  isUser = false,
  timestamp,
  type = 'message',
  userMood,
  moodIntensity,
  confidence = 1,
  onLongPress,
  onBreakSuggested,
  onResourcesRequested,
  onClarification,
  supportLevel = 'standard',
  showSupportOptions = false,
  accessibilityLabel,
}) => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleSpeak = async () => {
    setIsLoading(true);
    hapticUtils.impact('light');
    
    try {
      const isSpeaking = await Speech.isSpeakingAsync();
      if (isSpeaking) {
        await Speech.stop();
      } else {
        // Use therapeutic speech settings
        await Speech.speak(message, {
          language: 'en',
          pitch: 0.9,  // Slightly lower, more calming
          rate: 0.85,  // Slower for comprehension
          voice: 'com.apple.voice.compact.en-US.Samantha', // iOS
        });
      }
    } catch (error) {
      console.error('Error in therapeutic speech:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getBubbleStyle = () => {
    const baseStyle = {
      ...styleUtils.createShadow(1),
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 12,
      maxWidth: '80%',
      minWidth: 48,
      minHeight: 44,
    };

    if (isUser) {
      return {
        ...baseStyle,
        backgroundColor: theme.colors.primary[500],
        alignSelf: 'flex-end',
        marginLeft: 40,
      };
    }

    // AI therapeutic bubble styling
    const supportColors = {
      standard: theme.colors.background.surface,
      supportive: theme.colors.therapeutic.nurturing[50],
      calming: theme.colors.therapeutic.calming[50],
      crisis: theme.colors.therapeutic.grounding[50],
    };

    return {
      ...baseStyle,
      backgroundColor: supportColors[supportLevel] || supportColors.standard,
      alignSelf: 'flex-start',
      marginRight: 40,
      borderColor: theme.colors.therapeutic.calming[200],
      borderWidth: 1,
    };
  };

  const getTextStyle = () => {
    const baseStyle = {
      fontSize: 16,
      lineHeight: 24,
      ...styleUtils.createTextStyle('body'),
    };

    if (isUser) {
      return {
        ...baseStyle,
        color: theme.colors.text.inverse,
      };
    }

    return {
      ...baseStyle,
      color: theme.colors.text.primary,
      // Slightly larger for therapeutic readability
      fontSize: 17,
      lineHeight: 26,
    };
  };

  const formatTime = () => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getConfidenceIndicator = () => {
    if (isUser || confidence >= 0.9) return null;
    
    return (
      <View style={[styles.confidenceIndicator, { borderTopColor: theme.colors.border.primary }]}>
        <Text style={[styles.confidenceText, { color: theme.colors.text.tertiary }]}>
          Let me know if this helps, or if you'd like me to explain differently
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* AI Therapeutic Indicator */}
      {!isUser && type === 'thinking' && (
        <TherapeuticIndicator type="thinking" />
      )}
      
      {!isUser && type === 'listening' && (
        <TherapeuticIndicator type="listening" />
      )}

      {/* Emotional Context */}
      {!isUser && userMood && (
        <EmotionalContext userMood={userMood} intensity={moodIntensity} />
      )}

      {/* Main Chat Bubble */}
      <TouchableOpacity
        style={getBubbleStyle()}
        onLongPress={onLongPress}
        onPress={() => !isUser && setShowOptions(!showOptions)}
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel={
          accessibilityLabel || 
          `${isUser ? 'Your' : 'AI therapist'} message: ${message}`
        }
        accessibilityHint={
          isUser 
            ? "Long press for message options" 
            : "Tap for support options, long press to hear message spoken aloud"
        }
      >
        {/* Therapeutic Indicator for AI messages */}
        {!isUser && (
          <TherapeuticIndicator type="supportive" />
        )}

        {/* Message Text */}
        <Text style={getTextStyle()}>
          {message}
        </Text>

        {/* Message Footer */}
        <View style={styles.messageFooter}>
          <Text style={[styles.timestamp, { 
            color: isUser ? theme.colors.text.onPrimary : theme.colors.text.secondary 
          }]}>
            {formatTime()}
          </Text>

          {/* Voice Button */}
          <TouchableOpacity
            style={styles.voiceButton}
            onPress={handleSpeak}
            accessible={true}
            accessibilityLabel="Speak message aloud"
            accessibilityRole="button"
          >
            <Icon
              name="volume-high"
              size={16}
              color={isUser ? theme.colors.text.onPrimary : theme.colors.text.secondary}
            />
          </TouchableOpacity>
        </View>

        {/* Confidence Indicator */}
        {getConfidenceIndicator()}
      </TouchableOpacity>

      {/* Support Options for AI messages */}
      {!isUser && (showOptions || showSupportOptions) && (
        <SupportOptions
          onBreakSuggested={onBreakSuggested}
          onResourcesRequested={onResourcesRequested}
          onClarification={onClarification}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    paddingHorizontal: 12,
  },
  therapeuticIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  indicatorIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  indicatorText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emotionalContext: {
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  moodIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  contextText: {
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.8,
  },
  voiceButton: {
    padding: 4,
    minWidth: 24,
    minHeight: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confidenceIndicator: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  confidenceText: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  supportOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  supportOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 44,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportOptionText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default TherapeuticChatBubble;
export { TherapeuticIndicator, EmotionalContext, SupportOptions };