import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Animated,
  Dimensions,
  BackHandler,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { freudDarkTheme } from '../../shared/theme/freudDarkTheme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Error types and their configurations
const ERROR_TYPES = {
  NOT_FOUND: {
    id: 'not_found',
    title: 'Not Found',
    description: 'Whoops! Dr. F can\'t find this page :(',
    illustration: '🔍',
    statusCode: '404',
    statusText: 'Status Code: 404',
    primaryAction: 'Take Me Home',
    illustrationBg: ['#22C55E', '#16A34A'], // Green gradient
  },
  NO_INTERNET: {
    id: 'no_internet',
    title: 'No Internet!',
    description: 'It seems you don\'t have active internet',
    illustration: '📶',
    statusCode: null,
    statusText: null,
    primaryAction: 'Refresh or Try Again',
    illustrationBg: ['#3B82F6', '#2563EB'], // Blue gradient
  },
  INTERNAL_ERROR: {
    id: 'internal_error',
    title: 'Internal Error',
    description: 'Whoops! Our server seems in error :(',
    illustration: '⚠️',
    statusCode: '500',
    statusText: 'Status Code: 500',
    primaryAction: 'Take Me Home',
    illustrationBg: ['#F59E0B', '#D97706'], // Orange gradient
  },
  MAINTENANCE: {
    id: 'maintenance',
    title: 'Maintenance',
    description: 'We\'re undergoing maintenance',
    illustration: '🔧',
    statusCode: null,
    statusText: 'Come back in 9h 12m',
    primaryAction: 'Take Me Home',
    illustrationBg: ['#8B5CF6', '#7C3AED'], // Purple gradient
  },
  NOT_ALLOWED: {
    id: 'not_allowed',
    title: 'Not Allowed',
    description: 'Hey, you don\'t have permission',
    illustration: '🛑',
    statusCode: null,
    statusText: 'Contact Admin',
    primaryAction: 'Take Me Home',
    illustrationBg: ['#EF4444', '#DC2626'], // Red gradient
  },
};

export default function DarkErrorUtilityScreens({ 
  errorType = 'NOT_FOUND', 
  onHomePress, 
  onRetry,
  customMessage,
  customTitle,
}) {
  const [currentError, setCurrentError] = useState(ERROR_TYPES[errorType] || ERROR_TYPES.NOT_FOUND);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Update current error when errorType prop changes
    setCurrentError(ERROR_TYPES[errorType] || ERROR_TYPES.NOT_FOUND);
  }, [errorType]);

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for illustration
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    // Handle hardware back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleHomePress();
      return true;
    });

    return () => {
      pulseAnimation.stop();
      backHandler.remove();
    };
  }, [currentError]);

  const handleHomePress = () => {
    if (onHomePress) {
      onHomePress();
    } else {
      // Default navigation to home
      console.log('Navigate to home');
    }
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else if (currentError.id === 'no_internet') {
      // Default retry logic for no internet
      console.log('Retry connection');
    } else {
      handleHomePress();
    }
  };

  const renderIllustration = () => {
    let illustrationContent;
    
    switch (currentError.id) {
      case 'not_found':
        illustrationContent = (
          <View style={styles.illustrationContent}>
            <Text style={styles.illustrationEmoji}>🕵️‍♂️</Text>
            <View style={styles.pathLines}>
              <View style={[styles.pathLine, { transform: [{ rotate: '45deg' }] }]} />
              <View style={[styles.pathLine, { transform: [{ rotate: '-45deg' }] }]} />
              <View style={[styles.pathLine, { transform: [{ rotate: '0deg' }] }]} />
            </View>
          </View>
        );
        break;
      case 'no_internet':
        illustrationContent = (
          <View style={styles.illustrationContent}>
            <Text style={styles.illustrationEmoji}>📱</Text>
            <View style={styles.wifiLines}>
              <View style={[styles.wifiLine, styles.wifiLine1]} />
              <View style={[styles.wifiLine, styles.wifiLine2]} />
              <View style={[styles.wifiLine, styles.wifiLine3]} />
            </View>
          </View>
        );
        break;
      case 'internal_error':
        illustrationContent = (
          <View style={styles.illustrationContent}>
            <Text style={styles.illustrationEmoji}>👩‍⚕️</Text>
            <View style={styles.errorSymbol}>
              <Text style={styles.warningIcon}>⚠️</Text>
            </View>
          </View>
        );
        break;
      case 'maintenance':
        illustrationContent = (
          <View style={styles.illustrationContent}>
            <Text style={styles.illustrationEmoji}>👨‍🔧</Text>
            <View style={styles.toolsContainer}>
              <Text style={styles.toolIcon}>🔧</Text>
              <Text style={styles.toolIcon}>🔨</Text>
            </View>
          </View>
        );
        break;
      case 'not_allowed':
        illustrationContent = (
          <View style={styles.illustrationContent}>
            <Text style={styles.illustrationEmoji}>👮‍♀️</Text>
            <View style={styles.stopSign}>
              <Text style={styles.stopText}>STOP</Text>
            </View>
          </View>
        );
        break;
      default:
        illustrationContent = (
          <Text style={styles.illustrationEmoji}>🤖</Text>
        );
    }

    return (
      <Animated.View 
        style={[
          styles.illustrationContainer,
          { 
            transform: [
              { scale: bounceAnim },
              { scale: pulseAnim }
            ]
          }
        ]}
      >
        <LinearGradient
          colors={currentError.illustrationBg}
          style={styles.illustrationGradient}
        >
          {illustrationContent}
        </LinearGradient>
      </Animated.View>
    );
  };

  const renderContent = () => (
    <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleHomePress}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      {/* Illustration */}
      {renderIllustration()}

      {/* Title */}
      <Text style={styles.title}>
        {customTitle || currentError.title}
      </Text>

      {/* Description */}
      <Text style={styles.description}>
        {customMessage || currentError.description}
      </Text>

      {/* Status Info */}
      {(currentError.statusCode || currentError.statusText) && (
        <View style={styles.statusContainer}>
          <LinearGradient
            colors={[freudDarkTheme.colors.accent.primary, '#F97316']}
            style={styles.statusGradient}
          >
            <Text style={styles.statusText}>
              {currentError.statusCode ? 
                currentError.statusText : 
                currentError.statusText
              }
            </Text>
          </LinearGradient>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleRetry}>
          <LinearGradient
            colors={currentError.illustrationBg}
            style={styles.primaryButtonGradient}
          >
            <Text style={styles.primaryButtonText}>
              {currentError.primaryAction}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={handleHomePress}>
          <Text style={styles.secondaryButtonText}>Take Me Home 🏠</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <LinearGradient
      colors={[freudDarkTheme.colors.background.primary, freudDarkTheme.colors.background.secondary]}
      style={styles.screenContainer}
    >
      <StatusBar barStyle="light-content" backgroundColor={freudDarkTheme.colors.background.primary} />
      <SafeAreaView style={styles.safeArea}>
        {renderContent()}
      </SafeAreaView>
    </LinearGradient>
  );
}

// Individual error screen exports for easier usage
export const NotFoundScreen = (props) => (
  <DarkErrorUtilityScreens {...props} errorType="NOT_FOUND" />
);

export const NoInternetScreen = (props) => (
  <DarkErrorUtilityScreens {...props} errorType="NO_INTERNET" />
);

export const InternalErrorScreen = (props) => (
  <DarkErrorUtilityScreens {...props} errorType="INTERNAL_ERROR" />
);

export const MaintenanceScreen = (props) => (
  <DarkErrorUtilityScreens {...props} errorType="MAINTENANCE" />
);

export const NotAllowedScreen = (props) => (
  <DarkErrorUtilityScreens {...props} errorType="NOT_ALLOWED" />
);

// Utility screen showcase component
export function DarkErrorShowcaseScreen() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const screens = Object.keys(ERROR_TYPES);

  const nextScreen = () => {
    setCurrentScreen((prev) => (prev + 1) % screens.length);
  };

  const prevScreen = () => {
    setCurrentScreen((prev) => (prev - 1 + screens.length) % screens.length);
  };

  return (
    <View style={styles.showcaseContainer}>
      <DarkErrorUtilityScreens 
        errorType={screens[currentScreen]}
        onHomePress={nextScreen}
        onRetry={nextScreen}
      />
      
      {/* Screen Navigation */}
      <View style={styles.showcaseNavigation}>
        <TouchableOpacity style={styles.navButton} onPress={prevScreen}>
          <Text style={styles.navButtonText}>← Previous</Text>
        </TouchableOpacity>
        
        <Text style={styles.screenIndicator}>
          {currentScreen + 1} of {screens.length}
        </Text>
        
        <TouchableOpacity style={styles.navButton} onPress={nextScreen}>
          <Text style={styles.navButtonText}>Next →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: freudDarkTheme.colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: freudDarkTheme.colors.text.primary,
    fontWeight: '600',
  },
  illustrationContainer: {
    marginBottom: 40,
  },
  illustrationGradient: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  illustrationContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationEmoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  pathLines: {
    position: 'absolute',
    width: 60,
    height: 60,
  },
  pathLine: {
    position: 'absolute',
    width: 40,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 1,
    top: 30,
    left: 10,
  },
  wifiLines: {
    position: 'absolute',
    width: 40,
    height: 30,
    top: 80,
  },
  wifiLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 1,
  },
  wifiLine1: {
    width: 40,
    top: 0,
    left: 0,
  },
  wifiLine2: {
    width: 30,
    top: 8,
    left: 5,
  },
  wifiLine3: {
    width: 20,
    top: 16,
    left: 10,
  },
  errorSymbol: {
    position: 'absolute',
    top: 70,
    right: -10,
  },
  warningIcon: {
    fontSize: 30,
  },
  toolsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 80,
    left: -20,
  },
  toolIcon: {
    fontSize: 25,
    marginHorizontal: 5,
  },
  stopSign: {
    position: 'absolute',
    top: 85,
    right: -15,
    width: 50,
    height: 20,
    backgroundColor: '#DC2626',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: freudDarkTheme.colors.text.primary,
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: freudDarkTheme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    opacity: 0.9,
  },
  statusContainer: {
    marginBottom: 40,
  },
  statusGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  actionsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
    marginBottom: 15,
  },
  primaryButtonGradient: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: freudDarkTheme.colors.background.tertiary,
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: freudDarkTheme.colors.text.primary,
  },
  
  // Showcase styles
  showcaseContainer: {
    flex: 1,
  },
  showcaseNavigation: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: freudDarkTheme.colors.accent.primary,
    borderRadius: 12,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  screenIndicator: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});