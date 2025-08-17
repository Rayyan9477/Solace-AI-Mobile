import React, { createContext, useContext, useEffect, useCallback, useMemo } from 'react';
import { Platform, Alert, Linking, Vibration } from 'react-native';
import * as Haptics from 'expo-haptics';

// CRITICAL PERFORMANCE: Crisis mode context for immediate emergency response
const CrisisContext = createContext({
  showEmergencyAlert: () => {},
  callEmergencyHotline: () => {},
  textCrisisLine: () => {},
  isEmergencyResourcesReady: false,
});

export const useCrisisMode = () => {
  const context = useContext(CrisisContext);
  if (!context) {
    throw new Error('useCrisisMode must be used within a CrisisProvider');
  }
  return context;
};

// CRITICAL PERFORMANCE: Pre-load emergency resources immediately
const EMERGENCY_RESOURCES = {
  // US Crisis resources - customize for different regions
  hotlines: {
    suicide: { number: '988', name: 'Suicide & Crisis Lifeline' },
    crisis: { number: '741741', name: 'Crisis Text Line', textPrefix: 'HOME' },
    emergency: { number: '911', name: 'Emergency Services' },
  },
  
  // International resources (add based on user location)
  international: {
    uk: { number: '116123', name: 'Samaritans' },
    canada: { number: '1-833-456-4566', name: 'Talk Suicide Canada' },
    australia: { number: '13-11-14', name: 'Lifeline Australia' },
  },
};

export const CrisisProvider = ({ children }) => {
  const [emergencyResourcesReady, setEmergencyResourcesReady] = React.useState(false);

  // CRITICAL PERFORMANCE: Pre-validate emergency capabilities on app start
  useEffect(() => {
    const preloadEmergencyCapabilities = async () => {
      try {
        // Check emergency calling capabilities immediately
        const [canMakePhoneCalls, canSendTexts] = await Promise.all([
          Linking.canOpenURL('tel:988'),
          Linking.canOpenURL('sms:741741'),
        ]);

        // Pre-import emergency screens for instant access
        await Promise.all([
          import('../../screens/emergency/CrisisScreen').catch(() => null),
          import('../../screens/emergency/EmergencyContactsScreen').catch(() => null),
        ]);

        console.log('Emergency resources ready:', { canMakePhoneCalls, canSendTexts });
        setEmergencyResourcesReady(true);
      } catch (error) {
        console.error('Failed to preload emergency capabilities:', error);
        // Still mark as ready - we'll handle errors during actual emergency calls
        setEmergencyResourcesReady(true);
      }
    };

    preloadEmergencyCapabilities();
  }, []);

  // CRITICAL PERFORMANCE: Immediate emergency alert with no delays
  const showEmergencyAlert = useCallback(() => {
    // Immediate haptic/vibration feedback for acknowledgment
    if (Platform.OS !== 'web') {
      try {
        if (Haptics.impactAsync) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        } else if (Vibration.vibrate) {
          Vibration.vibrate([0, 100, 50, 100]); // Emergency pattern
        }
      } catch (error) {
        console.warn('Could not provide haptic feedback:', error);
      }
    }

    // Immediate alert with no animation delays
    Alert.alert(
      '🆘 Emergency Support',
      'If you are in immediate danger or having thoughts of self-harm, please reach out for help right now.',
      [
        {
          text: '📞 Call 988 (Suicide & Crisis Lifeline)',
          onPress: () => callEmergencyHotline('988'),
          style: 'default',
        },
        {
          text: '💬 Text Crisis Line (741741)',
          onPress: () => textCrisisLine(),
          style: 'default',
        },
        {
          text: '🚨 Call 911 (Emergency)',
          onPress: () => callEmergencyHotline('911'),
          style: 'destructive',
        },
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
      ],
      { 
        cancelable: false, // Prevent accidental dismissal in crisis
        userInterfaceStyle: 'light', // Ensure visibility
      }
    );
  }, []);

  // CRITICAL PERFORMANCE: Direct emergency hotline calling
  const callEmergencyHotline = useCallback(async (number = '988') => {
    try {
      const phoneUrl = `tel:${number}`;
      const canCall = await Linking.canOpenURL(phoneUrl);
      
      if (canCall) {
        await Linking.openURL(phoneUrl);
      } else {
        // Fallback alert with manual dialing instructions
        Alert.alert(
          'Unable to Make Call',
          `Your device cannot make phone calls automatically. Please dial ${number} manually for immediate assistance.`,
          [
            {
              text: 'Copy Number',
              onPress: () => {
                // Copy to clipboard if available
                if (Platform.OS === 'web' && navigator.clipboard) {
                  navigator.clipboard.writeText(number);
                }
              },
            },
            { text: 'OK', style: 'default' },
          ]
        );
      }
    } catch (error) {
      console.error('Error making emergency call:', error);
      
      // Critical fallback - always show manual dialing option
      Alert.alert(
        'Emergency Call Error',
        `Unable to place call automatically. Please dial ${number} manually for immediate assistance.\n\n${number === '988' ? 'Suicide & Crisis Lifeline' : 'Emergency Services'}`,
        [{ text: 'OK', style: 'default' }]
      );
    }
  }, []);

  // CRITICAL PERFORMANCE: Direct crisis text line access
  const textCrisisLine = useCallback(async () => {
    try {
      const textUrl = 'sms:741741?body=HOME';
      const canText = await Linking.canOpenURL(textUrl);
      
      if (canText) {
        await Linking.openURL(textUrl);
      } else {
        // Fallback with manual texting instructions
        Alert.alert(
          'Unable to Open Messaging',
          'Your device cannot send text messages automatically. Please text "HOME" to 741741 manually for crisis support.',
          [
            {
              text: 'Copy Details',
              onPress: () => {
                if (Platform.OS === 'web' && navigator.clipboard) {
                  navigator.clipboard.writeText('Text "HOME" to 741741');
                }
              },
            },
            { text: 'OK', style: 'default' },
          ]
        );
      }
    } catch (error) {
      console.error('Error opening text messaging:', error);
      
      // Critical fallback
      Alert.alert(
        'Text Messaging Error',
        'Unable to open messaging automatically. Please text "HOME" to 741741 manually for crisis support.',
        [{ text: 'OK', style: 'default' }]
      );
    }
  }, []);

  // CRITICAL PERFORMANCE: Memoize context value to prevent re-renders during crisis
  const contextValue = useMemo(() => ({
    showEmergencyAlert,
    callEmergencyHotline,
    textCrisisLine,
    isEmergencyResourcesReady: emergencyResourcesReady,
    emergencyResources: EMERGENCY_RESOURCES,
  }), [
    showEmergencyAlert,
    callEmergencyHotline,
    textCrisisLine,
    emergencyResourcesReady,
  ]);

  return (
    <CrisisContext.Provider value={contextValue}>
      {children}
    </CrisisContext.Provider>
  );
};

// CRITICAL PERFORMANCE: Optimized emergency button component
export const EmergencyButton = React.memo(({ 
  style, 
  textStyle, 
  variant = 'primary',
  size = 'large',
  disabled = false 
}) => {
  const { showEmergencyAlert } = useCrisisMode();

  // CRITICAL PERFORMANCE: Immediate response button
  const handleEmergencyPress = useCallback(() => {
    if (disabled) return;
    
    // No animation delays - immediate response
    showEmergencyAlert();
  }, [showEmergencyAlert, disabled]);

  const buttonStyles = useMemo(() => {
    const baseStyle = {
      backgroundColor: '#dc2626', // Emergency red
      paddingVertical: size === 'large' ? 16 : 12,
      paddingHorizontal: size === 'large' ? 24 : 16,
      borderRadius: 8,
      minHeight: 44, // WCAG touch target
      justifyContent: 'center',
      alignItems: 'center',
      opacity: disabled ? 0.6 : 1,
    };

    if (variant === 'secondary') {
      baseStyle.backgroundColor = '#ef4444';
    }

    return [baseStyle, style];
  }, [style, variant, size, disabled]);

  const textStyles = useMemo(() => ({
    color: '#ffffff',
    fontSize: size === 'large' ? 16 : 14,
    fontWeight: '600',
    textAlign: 'center',
    ...textStyle,
  }), [textStyle, size]);

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={handleEmergencyPress}
      activeOpacity={0.8}
      disabled={disabled}
      accessible
      accessibilityRole="button"
      accessibilityLabel="Emergency Help"
      accessibilityHint="Double tap for immediate crisis support"
      testID="emergency-button"
    >
      <Text style={textStyles}>🆘 Emergency Help</Text>
    </TouchableOpacity>
  );
});

EmergencyButton.displayName = 'EmergencyButton';

// CRITICAL PERFORMANCE: Quick access emergency floating button
export const EmergencyFloatingButton = React.memo(({ bottom = 100, right = 20 }) => {
  const { showEmergencyAlert } = useCrisisMode();

  const handlePress = useCallback(() => {
    showEmergencyAlert();
  }, [showEmergencyAlert]);

  return (
    <TouchableOpacity
      style={{
        position: 'absolute',
        bottom,
        right,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#dc2626',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        zIndex: 1000, // Always on top
      }}
      onPress={handlePress}
      activeOpacity={0.8}
      accessible
      accessibilityRole="button"
      accessibilityLabel="Emergency Crisis Support"
      testID="emergency-floating-button"
    >
      <Text style={{ fontSize: 24, color: '#ffffff' }}>🆘</Text>
    </TouchableOpacity>
  );
});

EmergencyFloatingButton.displayName = 'EmergencyFloatingButton';

// CRITICAL PERFORMANCE: Crisis detection hook for automatic intervention
export const useCrisisDetection = () => {
  const { showEmergencyAlert } = useCrisisMode();

  // Monitor for crisis keywords or patterns
  const detectCrisisInText = useCallback((text) => {
    const crisisKeywords = [
      'kill myself', 'end it all', 'want to die', 'suicide', 'hurt myself',
      'can\'t go on', 'no point living', 'self harm', 'end my life'
    ];

    const lowerText = text.toLowerCase();
    return crisisKeywords.some(keyword => lowerText.includes(keyword));
  }, []);

  // Automatic crisis intervention when keywords detected
  const handleCrisisDetection = useCallback((detectedText) => {
    console.log('Crisis keywords detected, offering help');
    
    Alert.alert(
      'We\'re Here to Help',
      'It sounds like you might be going through a difficult time. Would you like to connect with crisis support resources?',
      [
        {
          text: 'Yes, Get Help',
          onPress: showEmergencyAlert,
          style: 'default',
        },
        {
          text: 'Not Now',
          style: 'cancel',
        },
      ]
    );
  }, [showEmergencyAlert]);

  return {
    detectCrisisInText,
    handleCrisisDetection,
  };
};

export default {
  CrisisProvider,
  useCrisisMode,
  EmergencyButton,
  EmergencyFloatingButton,
  useCrisisDetection,
};