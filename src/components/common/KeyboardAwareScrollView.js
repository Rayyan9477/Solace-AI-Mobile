/**
 * Universal KeyboardAwareScrollView Component
 * 
 * Provides consistent keyboard avoidance behavior across iOS and Android
 * with enhanced accessibility and mental health form support.
 * 
 * Features:
 * - Cross-platform keyboard handling
 * - Accessibility-first design
 * - Mental health form optimizations
 * - Smooth animations and transitions
 * - Automatic scroll to focused inputs
 */

import React, { useRef, useEffect, useState } from 'react';
import {
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../contexts/ThemeContext';
import { FocusManagement } from '../../utils/accessibility';

const { height: screenHeight } = Dimensions.get('window');

const KeyboardAwareScrollView = ({
  children,
  contentContainerStyle,
  style,
  enableAutomaticScroll = true,
  enableResetScrollToCoords = true,
  extraHeight = 75,
  extraScrollHeight = 0,
  keyboardOpeningTime = 250,
  keyboardShouldPersistTaps = 'handled',
  showsVerticalScrollIndicator = false,
  scrollEnabled = true,
  nestedScrollEnabled = false,
  // Mental health specific props
  isTherapyForm = false,
  isMoodTracker = false,
  isAssessment = false,
  // Accessibility props
  accessibilityLabel,
  accessibilityHint,
  testID,
  // Animation props
  animateOnKeyboard = true,
  resetScrollPositionOnKeyboardHide = false,
  // Custom callbacks
  onKeyboardShow,
  onKeyboardHide,
  onFocusChange,
  ...props
}) => {
  const { theme, isReducedMotionEnabled } = useTheme();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef(null);
  const contentOffsetY = useRef(0);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [currentFocusedInput, setCurrentFocusedInput] = useState(null);
  const keyboardAnimValue = useRef(new Animated.Value(0)).current;

  // Calculate keyboard avoiding behavior based on platform
  const getKeyboardVerticalOffset = () => {
    if (Platform.OS === 'ios') {
      return insets.top + StatusBar.currentHeight || 0;
    }
    return 0;
  };

  const getKeyboardBehavior = () => {
    if (Platform.OS === 'ios') {
      return 'padding';
    }
    return 'height';
  };

  // Enhanced keyboard event handlers
  useEffect(() => {
    const keyboardShowEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const keyboardHideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const handleKeyboardShow = (event) => {
      const { height: kbHeight, duration } = event;
      
      setKeyboardHeight(kbHeight);
      
      // Animate keyboard appearance
      if (animateOnKeyboard && !isReducedMotionEnabled) {
        Animated.timing(keyboardAnimValue, {
          toValue: 1,
          duration: duration || keyboardOpeningTime,
          useNativeDriver: false,
        }).start();
      }

      // Announce keyboard appearance for screen readers
      if (isTherapyForm || isMoodTracker || isAssessment) {
        FocusManagement.announceForScreenReader(
          'Keyboard opened. You can now enter your response.',
          'polite'
        );
      }

      onKeyboardShow?.(event);
    };

    const handleKeyboardHide = (event) => {
      setKeyboardHeight(0);
      
      // Animate keyboard disappearance
      if (animateOnKeyboard && !isReducedMotionEnabled) {
        Animated.timing(keyboardAnimValue, {
          toValue: 0,
          duration: event.duration || keyboardOpeningTime,
          useNativeDriver: false,
        }).start();
      }

      // Reset scroll position if configured
      if (resetScrollPositionOnKeyboardHide && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
      }

      // Announce keyboard disappearance
      if (isTherapyForm || isMoodTracker || isAssessment) {
        FocusManagement.announceForScreenReader(
          'Keyboard closed.',
          'polite'
        );
      }

      onKeyboardHide?.(event);
    };

    const keyboardShowListener = Keyboard.addListener(keyboardShowEvent, handleKeyboardShow);
    const keyboardHideListener = Keyboard.addListener(keyboardHideEvent, handleKeyboardHide);

    return () => {
      keyboardShowListener?.remove();
      keyboardHideListener?.remove();
    };
  }, [
    animateOnKeyboard,
    isReducedMotionEnabled,
    keyboardOpeningTime,
    resetScrollPositionOnKeyboardHide,
    isTherapyForm,
    isMoodTracker,
    isAssessment,
    onKeyboardShow,
    onKeyboardHide,
  ]);

  // Auto-scroll to focused input
  const scrollToInput = (inputRef, extraOffset = 0) => {
    if (!enableAutomaticScroll || !scrollViewRef.current || !inputRef) {
      return;
    }

    setTimeout(() => {
      inputRef.measureInWindow((x, y, width, height) => {
        const scrollOffset = Math.max(
          0,
          y + height + extraHeight + extraOffset - (screenHeight - keyboardHeight)
        );

        if (scrollOffset > 0) {
          scrollViewRef.current?.scrollTo({
            x: 0,
            y: contentOffsetY.current + scrollOffset,
            animated: true,
          });
        }
      });
    }, keyboardOpeningTime);
  };

  // Handle focus changes for mental health forms
  const handleFocusChange = (inputRef, isFocused) => {
    if (isFocused) {
      setCurrentFocusedInput(inputRef);
      scrollToInput(inputRef);
      
      // Mental health specific announcements
      if (isTherapyForm) {
        FocusManagement.announceForScreenReader(
          'Therapy form input focused. Take your time to share your thoughts.',
          'polite'
        );
      } else if (isMoodTracker) {
        FocusManagement.announceForScreenReader(
          'Mood tracking input focused. Describe how you\'re feeling.',
          'polite'
        );
      } else if (isAssessment) {
        FocusManagement.announceForScreenReader(
          'Assessment question focused. Please provide your response.',
          'polite'
        );
      }
    } else {
      if (currentFocusedInput === inputRef) {
        setCurrentFocusedInput(null);
      }
    }

    onFocusChange?.(inputRef, isFocused);
  };

  // Enhanced scroll handler
  const handleScroll = (event) => {
    contentOffsetY.current = event.nativeEvent.contentOffset.y;
  };

  // Get mental health specific styling
  const getMentalHealthStyles = () => {
    if (isTherapyForm) {
      return {
        backgroundColor: theme.colors.therapeutic?.calm || theme.colors.background.primary,
        paddingHorizontal: 20,
        paddingVertical: 16,
      };
    }
    
    if (isMoodTracker) {
      return {
        backgroundColor: theme.colors.therapeutic?.nurturing || theme.colors.background.primary,
        paddingHorizontal: 16,
        paddingVertical: 12,
      };
    }
    
    if (isAssessment) {
      return {
        backgroundColor: theme.colors.therapeutic?.peaceful || theme.colors.background.primary,
        paddingHorizontal: 24,
        paddingVertical: 20,
      };
    }

    return {};
  };

  // Enhanced content container style with mental health considerations
  const enhancedContentContainerStyle = [
    {
      flexGrow: 1,
      paddingBottom: Math.max(insets.bottom, 20) + extraScrollHeight,
    },
    getMentalHealthStyles(),
    contentContainerStyle,
  ];

  // Animated container for smooth keyboard transitions
  const AnimatedContainer = ({ children }) => {
    if (!animateOnKeyboard || isReducedMotionEnabled) {
      return children;
    }

    const animatedStyle = {
      paddingBottom: keyboardAnimValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, extraHeight],
      }),
    };

    return (
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        {children}
      </Animated.View>
    );
  };

  // Provide focus handler to child components
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        onFocusChange: handleFocusChange,
        keyboardHeight,
        currentFocusedInput,
        scrollToInput,
      });
    }
    return child;
  });

  return (
    <KeyboardAvoidingView
      style={[{ flex: 1 }, style]}
      behavior={getKeyboardBehavior()}
      keyboardVerticalOffset={getKeyboardVerticalOffset()}
      enabled={Platform.OS === 'ios'}
    >
      <AnimatedContainer>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={enhancedContentContainerStyle}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          scrollEnabled={scrollEnabled}
          nestedScrollEnabled={nestedScrollEnabled}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          // Accessibility props
          accessible={true}
          accessibilityLabel={
            accessibilityLabel || 
            `${isTherapyForm ? 'Therapy' : isMoodTracker ? 'Mood tracking' : isAssessment ? 'Assessment' : ''} form container`
          }
          accessibilityHint={
            accessibilityHint || 
            'Scrollable container with form inputs. Swipe up or down to navigate.'
          }
          accessibilityRole="scrollview"
          testID={testID}
          {...props}
        >
          {childrenWithProps}
        </ScrollView>
      </AnimatedContainer>
    </KeyboardAvoidingView>
  );
};

// Enhanced Input wrapper for automatic keyboard handling
export const KeyboardAwareInput = React.forwardRef(({
  onFocus,
  onBlur,
  onFocusChange,
  children,
  ...props
}, ref) => {
  const inputRef = useRef(ref);

  const handleFocus = (event) => {
    onFocus?.(event);
    onFocusChange?.(inputRef.current, true);
  };

  const handleBlur = (event) => {
    onBlur?.(event);
    onFocusChange?.(inputRef.current, false);
  };

  return React.cloneElement(children, {
    ref: inputRef,
    onFocus: handleFocus,
    onBlur: handleBlur,
    ...props,
  });
});

KeyboardAwareInput.displayName = 'KeyboardAwareInput';

export default KeyboardAwareScrollView;