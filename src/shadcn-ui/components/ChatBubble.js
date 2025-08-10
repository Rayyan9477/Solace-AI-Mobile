/**
 * Solace AI Mobile - shadcn UI Chat Bubble Component
 * 
 * A comprehensive chat bubble component following shadcn UI patterns,
 * designed specifically for therapeutic AI chat interactions.
 * 
 * Features:
 * - User and AI message variants with distinct styling
 * - Therapeutic color schemes for calming conversations
 * - Typing indicators and message states
 * - Accessibility-first design with screen reader support
 * - Gentle animations for message appearance
 * - Emotion indicators and therapeutic responses
 */

import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import PropTypes from 'prop-types';

import { shadcnConfig } from '../config';
import { 
  colorUtils, 
  styleUtils, 
  animationUtils, 
  accessibilityUtils,
  platformUtils 
} from '../utils';
import { useTheme } from '../../contexts/ThemeContext';
import { MentalHealthIcon } from '../../components/icons';

const ShadcnChatBubble = ({
  message,
  sender = 'user', // 'user', 'ai', 'system'
  timestamp,
  isTyping = false,
  emotionIndicator,
  therapeuticResponse = false,
  variant = 'default',
  animated = true,
  onPress,
  onLongPress,
  accessibilityLabel,
  testID,
  style,
  ...props
}) => {
  const { theme, isReducedMotionEnabled } = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  
  // Animation refs
  const slideAnimation = useRef(new Animated.Value(50)).current;
  const opacityAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(0.9)).current;
  const typingDots = useRef([
    new Animated.Value(0.3),
    new Animated.Value(0.3),
    new Animated.Value(0.3),
  ]).current;
  
  useEffect(() => {
    if (animated && !isReducedMotionEnabled) {
      // Entry animation
      const entryAnimation = Animated.parallel([
        Animated.timing(slideAnimation, {
          toValue: 0,
          duration: shadcnConfig.animations.gentle.duration,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnimation, {
          toValue: 1,
          duration: shadcnConfig.animations.gentle.duration,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnimation, {
          toValue: 1,
          duration: shadcnConfig.animations.gentle.duration,
          useNativeDriver: true,
        }),
      ]);
      
      entryAnimation.start();
    } else {
      // Set final values immediately
      slideAnimation.setValue(0);
      opacityAnimation.setValue(1);
      scaleAnimation.setValue(1);
    }
    
    // Typing animation
    if (isTyping && !isReducedMotionEnabled) {
      const createTypingAnimation = () => {
        const animations = typingDots.map((dot, index) =>
          Animated.loop(
            Animated.sequence([
              Animated.timing(dot, {
                toValue: 1,
                duration: 600,
                delay: index * 200,
                useNativeDriver: true,
              }),
              Animated.timing(dot, {
                toValue: 0.3,
                duration: 600,
                useNativeDriver: true,
              }),
            ])
          )
        );
        
        return Animated.stagger(100, animations);
      };
      
      const typingAnimation = createTypingAnimation();
      typingAnimation.start();
      
      return () => typingAnimation.stop();
    }
  }, [animated, isTyping, isReducedMotionEnabled]);
  
  // Get bubble configuration based on sender
  const getBubbleConfig = () => {
    const configs = {
      user: {
        alignment: 'flex-end',
        backgroundColor: shadcnConfig.colors.primary[500],
        textColor: shadcnConfig.colors.primary.foreground,
        borderRadius: {
          borderTopLeftRadius: shadcnConfig.borderRadius.xl,
          borderTopRightRadius: shadcnConfig.borderRadius.sm,
          borderBottomLeftRadius: shadcnConfig.borderRadius.xl,
          borderBottomRightRadius: shadcnConfig.borderRadius.xl,
        },
        marginLeft: 60,
        marginRight: 0,
      },
      ai: {
        alignment: 'flex-start',
        backgroundColor: therapeuticResponse 
          ? colorUtils.resolveColor('therapeutic.calming.50')
          : shadcnConfig.colors.background.muted,
        textColor: shadcnConfig.colors.foreground.primary,
        borderColor: therapeuticResponse 
          ? colorUtils.resolveColor('therapeutic.calming.200')
          : shadcnConfig.colors.border.primary,
        borderWidth: 1,
        borderRadius: {
          borderTopLeftRadius: shadcnConfig.borderRadius.sm,
          borderTopRightRadius: shadcnConfig.borderRadius.xl,
          borderBottomLeftRadius: shadcnConfig.borderRadius.xl,
          borderBottomRightRadius: shadcnConfig.borderRadius.xl,
        },
        marginLeft: 0,
        marginRight: 60,
      },
      system: {
        alignment: 'center',
        backgroundColor: shadcnConfig.colors.background.subtle,
        textColor: shadcnConfig.colors.foreground.muted,
        borderRadius: {
          borderRadius: shadcnConfig.borderRadius.full,
        },
        marginLeft: 40,
        marginRight: 40,
      },
    };
    
    return configs[sender] || configs.user;
  };
  
  const bubbleConfig = getBubbleConfig();
  
  // Get therapeutic gradient for AI responses
  const getTherapeuticGradient = () => {
    if (sender !== 'ai' || !therapeuticResponse) return null;
    
    return colorUtils.getTherapeuticGradient('calming', 0);
  };
  
  const gradientColors = getTherapeuticGradient();
  
  // Handle press interactions
  const handlePressIn = () => {
    setIsPressed(true);
    
    if (onPress && !isReducedMotionEnabled) {
      Animated.timing(scaleAnimation, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };
  
  const handlePressOut = () => {
    setIsPressed(false);
    
    if (onPress && !isReducedMotionEnabled) {
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };
  
  const handlePress = () => {
    if (onPress) {
      if (platformUtils.supportsHaptics()) {
        Haptics.selectionAsync();
      }
      onPress();
    }
  };
  
  const handleLongPress = () => {
    if (onLongPress) {
      if (platformUtils.supportsHaptics()) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      onLongPress();
    }
  };
  
  // Render AI avatar
  const renderAIAvatar = () => {
    if (sender !== 'ai') return null;
    
    return (
      <View style={{
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colorUtils.resolveColor('therapeutic.calming.100'),
        borderWidth: 1,
        borderColor: colorUtils.resolveColor('therapeutic.calming.300'),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: shadcnConfig.spacing[3],
        marginTop: shadcnConfig.spacing[1],
      }}>
        <MentalHealthIcon
          name="Brain"
          size="sm"
          colorScheme="calming"
        />
      </View>
    );
  };
  
  // Render emotion indicator
  const renderEmotionIndicator = () => {
    if (!emotionIndicator) return null;
    
    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: shadcnConfig.spacing[2],
        paddingHorizontal: shadcnConfig.spacing[2],
      }}>
        <View style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: colorUtils.getTherapeuticColor(emotionIndicator.mood),
          marginRight: shadcnConfig.spacing[2],
        }} />
        <Text style={{
          fontSize: shadcnConfig.typography.sizes.xs.fontSize,
          color: shadcnConfig.colors.foreground.muted,
          fontStyle: 'italic',
        }}>
          {emotionIndicator.label}
        </Text>
      </View>
    );
  };
  
  // Render timestamp
  const renderTimestamp = () => {
    if (!timestamp) return null;
    
    return (
      <Text style={{
        fontSize: shadcnConfig.typography.sizes.xs.fontSize,
        color: shadcnConfig.colors.foreground.muted,
        marginTop: shadcnConfig.spacing[1],
        textAlign: sender === 'user' ? 'right' : 'left',
      }}>
        {timestamp}
      </Text>
    );
  };
  
  // Render typing indicator
  const renderTypingIndicator = () => (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: shadcnConfig.spacing[4],
      paddingVertical: shadcnConfig.spacing[3],
    }}>
      {typingDots.map((dot, index) => (
        <Animated.View
          key={index}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: shadcnConfig.colors.foreground.muted,
            marginRight: index < 2 ? shadcnConfig.spacing[1] : 0,
            opacity: dot,
          }}
        />
      ))}
    </View>
  );
  
  // Render message content
  const renderMessageContent = () => {
    if (isTyping) {
      return renderTypingIndicator();
    }
    
    return (
      <View style={{
        paddingHorizontal: shadcnConfig.spacing[4],
        paddingVertical: shadcnConfig.spacing[3],
      }}>
        <Text style={{
          fontSize: shadcnConfig.typography.sizes.base.fontSize,
          lineHeight: shadcnConfig.typography.sizes.base.lineHeight * 1.2,
          color: bubbleConfig.textColor,
          fontWeight: sender === 'system' 
            ? shadcnConfig.typography.weights.medium
            : shadcnConfig.typography.weights.normal,
          textAlign: sender === 'system' ? 'center' : 'left',
        }}>
          {message}
        </Text>
        {renderEmotionIndicator()}
        {renderTimestamp()}
      </View>
    );
  };
  
  // Build accessibility props
  const accessibilityProps = accessibilityUtils.getAccessibilityProps({
    label: accessibilityLabel || `${sender} message: ${message}`,
    hint: onPress ? 'Double tap to interact with message' : undefined,
    role: onPress ? 'button' : 'text',
    testID: testID || `chat-bubble-${sender}`,
  });
  
  // Build container style
  const containerStyle = [
    {
      alignSelf: bubbleConfig.alignment,
      marginLeft: bubbleConfig.marginLeft,
      marginRight: bubbleConfig.marginRight,
      marginVertical: shadcnConfig.spacing[2],
    },
    style,
  ];
  
  const bubbleStyle = [
    {
      backgroundColor: gradientColors ? 'transparent' : bubbleConfig.backgroundColor,
      borderColor: bubbleConfig.borderColor,
      borderWidth: bubbleConfig.borderWidth || 0,
      ...bubbleConfig.borderRadius,
      ...platformUtils.getPlatformShadow({
        shadowOpacity: sender === 'user' ? 0.1 : 0.05,
        shadowRadius: 4,
        elevation: sender === 'user' ? 3 : 1,
      }),
    },
  ];
  
  const animatedStyle = {
    transform: [
      { translateX: slideAnimation },
      { scale: scaleAnimation },
    ],
    opacity: opacityAnimation,
  };
  
  // Render component
  const BubbleWrapper = onPress ? TouchableOpacity : View;
  const wrapperProps = onPress ? {
    activeOpacity: 0.8,
    onPress: handlePress,
    onLongPress: handleLongPress,
    onPressIn: handlePressIn,
    onPressOut: handlePressOut,
    ...accessibilityProps,
  } : {
    ...accessibilityProps,
  };
  
  return (
    <Animated.View style={[containerStyle, animatedStyle]}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
      }}>
        {renderAIAvatar()}
        
        <BubbleWrapper {...wrapperProps}>
          {gradientColors ? (
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={bubbleStyle}
            >
              {renderMessageContent()}
            </LinearGradient>
          ) : (
            <View style={bubbleStyle}>
              {renderMessageContent()}
            </View>
          )}
        </BubbleWrapper>
      </View>
    </Animated.View>
  );
};

// Specialized chat bubble variants
export const UserChatBubble = (props) => (
  <ShadcnChatBubble sender="user" {...props} />
);

export const AIChatBubble = (props) => (
  <ShadcnChatBubble sender="ai" therapeuticResponse {...props} />
);

export const SystemChatBubble = (props) => (
  <ShadcnChatBubble sender="system" {...props} />
);

export const TherapeuticChatBubble = (props) => (
  <ShadcnChatBubble 
    sender="ai" 
    therapeuticResponse 
    variant="therapeutic"
    {...props} 
  />
);

export const TypingChatBubble = (props) => (
  <ShadcnChatBubble 
    sender="ai" 
    isTyping 
    message="AI is typing..."
    therapeuticResponse
    {...props} 
  />
);

// PropTypes
ShadcnChatBubble.propTypes = {
  message: PropTypes.string.isRequired,
  sender: PropTypes.oneOf(['user', 'ai', 'system']),
  timestamp: PropTypes.string,
  isTyping: PropTypes.bool,
  emotionIndicator: PropTypes.shape({
    mood: PropTypes.string,
    label: PropTypes.string,
  }),
  therapeuticResponse: PropTypes.bool,
  variant: PropTypes.oneOf(['default', 'therapeutic']),
  animated: PropTypes.bool,
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
  accessibilityLabel: PropTypes.string,
  testID: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default ShadcnChatBubble;