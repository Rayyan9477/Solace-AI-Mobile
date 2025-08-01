import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import { MentalHealthIcon } from '../components/icons';

const { width, height } = Dimensions.get('window');

// Welcome flow steps matching the design
const WELCOME_STEPS = [
  {
    id: 1,
    title: 'Welcome to the ultimate\nfreud UI Kit!',
    subtitle: 'Your mindful mental health AI companion\nfor everyone, anywhere ✓',
    backgroundColor: theme => theme.isDark ? '#2D1B0F' : '#F8F4F0',
    illustration: 'welcome',
    showGetStarted: true,
  },
  {
    id: 2,
    title: 'Personalize Your Mental\nHealth State With AI',
    subtitle: 'Get personalized insights and recommendations based on your unique mental health journey',
    backgroundColor: theme => theme.isDark ? '#1A3B2E' : '#E8F5E8',
    illustration: 'personalize',
    stepLabel: 'Step One'
  },
  {
    id: 3,
    title: 'Intelligent Mood Tracking\n& AI Emotion Insights',
    subtitle: 'Track your emotional patterns and receive AI-powered insights to understand your mental state',
    backgroundColor: theme => theme.isDark ? '#4A2E1A' : '#FFF2E6',
    illustration: 'mood',
    stepLabel: 'Step Two'
  },
  {
    id: 4,
    title: 'AI Mental Journaling &\nAI Therapy Chatbot',
    subtitle: 'Express yourself through guided journaling and get support from our therapeutic AI chatbot',
    backgroundColor: theme => theme.isDark ? '#2A2A2A' : '#F5F5F5',
    illustration: 'journal',
    stepLabel: 'Step Three'
  },
  {
    id: 5,
    title: 'Mindful Resources That\nMakes You Happy',
    subtitle: 'Discover curated mindfulness exercises, meditations, and wellness resources',
    backgroundColor: theme => theme.isDark ? '#4A3A1A' : '#FFF8E6',
    illustration: 'mindful',
    stepLabel: 'Step Four'
  },
  {
    id: 6,
    title: 'Loving & Supportive\nCommunity',
    subtitle: 'Connect with others on similar journeys in a safe, supportive environment',
    backgroundColor: theme => theme.isDark ? '#3A2A4A' : '#F5F0FF',
    illustration: 'community',
    stepLabel: 'Step Five'
  }
];

const WelcomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const titleFadeAnim = useRef(new Animated.Value(0)).current;
  const illustrationAnim = useRef(new Animated.Value(0)).current;

  const currentStepData = WELCOME_STEPS[currentStep];
  
  useEffect(() => {
    animateStepEntrance();
  }, [currentStep]);
  
  const animateStepEntrance = () => {
    // Reset animations
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    scaleAnim.setValue(0.8);
    titleFadeAnim.setValue(0);
    illustrationAnim.setValue(0);
    
    // Start entrance sequence
    Animated.sequence([
      // Background and illustration fade in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      // Content slides up
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(titleFadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Illustration animation
      Animated.timing(illustrationAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNext = () => {
    if (isAnimating) return;
    
    if (currentStep < WELCOME_STEPS.length - 1) {
      setIsAnimating(true);
      
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      });
    } else {
      navigation.navigate('Register');
    }
  };
  
  const handleGetStarted = () => {
    setCurrentStep(1);
  };
  
  const handleSignIn = () => {
    navigation.navigate('Login');
  };
  
  const handleSkip = () => {
    navigation.navigate('Register');
  };
  
  const renderIllustration = (type) => {
    const illustrationStyle = {
      transform: [
        { scale: illustrationAnim },
        {
          rotateY: illustrationAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['45deg', '0deg'],
          }),
        },
      ],
    };
    
    switch (type) {
      case 'welcome':
        return (
          <Animated.View style={[styles.illustrationContainer, illustrationStyle]}>
            <View style={styles.logoGrid}>
              <View style={[styles.logoCircle, { backgroundColor: theme.isDark ? '#8B4513' : '#CD853F' }]} />
              <View style={[styles.logoCircle, { backgroundColor: theme.isDark ? '#A0522D' : '#8B4513' }]} />
              <View style={[styles.logoCircle, { backgroundColor: theme.isDark ? '#A0522D' : '#8B4513' }]} />
              <View style={[styles.logoCircle, { backgroundColor: theme.isDark ? '#8B4513' : '#CD853F' }]} />
            </View>
            <View style={styles.welcomeIcons}>
              <View style={[styles.iconBadge, { backgroundColor: '#FF8C00' }]}>
                <MentalHealthIcon name="brain" size={16} color="#FFFFFF" />
              </View>
              <View style={[styles.iconBadge, { backgroundColor: '#32CD32' }]}>
                <Text style={styles.iconText}>✓</Text>
              </View>
              <View style={[styles.iconBadge, { backgroundColor: '#FF6B6B' }]}>
                <MentalHealthIcon name="heart" size={16} color="#FFFFFF" />
              </View>
            </View>
          </Animated.View>
        );
      case 'personalize':
        return (
          <Animated.View style={[styles.illustrationContainer, illustrationStyle]}>
            <View style={[styles.personIllustration, { backgroundColor: theme.isDark ? '#4A5568' : '#90CDB0' }]}>
              <View style={styles.personHead} />
              <View style={styles.personBody} />
            </View>
          </Animated.View>
        );
      case 'mood':
        return (
          <Animated.View style={[styles.illustrationContainer, illustrationStyle]}>
            <View style={styles.moodContainer}>
              <View style={[styles.moodFace, { backgroundColor: '#FF8C00' }]}>
                <Text style={styles.moodEmoji}>😊</Text>
              </View>
              <View style={[styles.moodFace, { backgroundColor: '#FFB84D' }]}>
                <Text style={styles.moodEmoji}>😐</Text>
              </View>
            </View>
          </Animated.View>
        );
      case 'journal':
        return (
          <Animated.View style={[styles.illustrationContainer, illustrationStyle]}>
            <View style={[styles.journalContainer, { backgroundColor: theme.isDark ? '#4A5568' : '#E2E8F0' }]}>
              <View style={styles.journalPages} />
              <View style={styles.journalBinding} />
            </View>
          </Animated.View>
        );
      case 'mindful':
        return (
          <Animated.View style={[styles.illustrationContainer, illustrationStyle]}>
            <View style={styles.mindfulContainer}>
              <View style={[styles.meditationPerson, { backgroundColor: '#FFB84D' }]} />
              <View style={styles.mindfulElements}>
                <Text style={styles.mindfulEmoji}>🧘</Text>
              </View>
            </View>
          </Animated.View>
        );
      case 'community':
        return (
          <Animated.View style={[styles.illustrationContainer, illustrationStyle]}>
            <View style={styles.communityContainer}>
              <View style={[styles.heartShape, { backgroundColor: '#E91E63' }]} />
              <View style={styles.communityHands}>
                <View style={[styles.hand, { backgroundColor: theme.isDark ? '#8D6E63' : '#FFAB91' }]} />
                <View style={[styles.hand, { backgroundColor: theme.isDark ? '#6D4C41' : '#FFCC02' }]} />
              </View>
            </View>
          </Animated.View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle={theme.isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      
      <LinearGradient
        colors={[
          currentStepData.backgroundColor(theme),
          currentStepData.backgroundColor(theme),
        ]}
        style={styles.container}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Step Indicator */}
          {currentStep > 0 && (
            <Animated.View style={[styles.stepHeader, { opacity: titleFadeAnim }]}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => setCurrentStep(Math.max(0, currentStep - 1))}
              >
                <Text style={[styles.backIcon, { color: theme.isDark ? '#FFFFFF' : '#2D3436' }]}>←</Text>
              </TouchableOpacity>
              
              <View style={[styles.stepIndicator, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }]}>
                <Text style={[styles.stepLabel, { color: theme.isDark ? '#FFFFFF' : '#2D3436' }]}>
                  {currentStepData.stepLabel}
                </Text>
              </View>
            </Animated.View>
          )}
          
          {/* Main Content */}
          <Animated.View 
            style={[
              styles.mainContent, 
              { 
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }] 
              }
            ]}
          >
            {/* Illustration */}
            <View style={styles.illustrationSection}>
              {renderIllustration(currentStepData.illustration)}
            </View>
            
            {/* Text Content */}
            <Animated.View style={[styles.textContent, { opacity: titleFadeAnim }]}>
              <Text style={[styles.stepTitle, { color: theme.isDark ? '#FFFFFF' : '#2D3436' }]}>
                {currentStepData.title}
              </Text>
              <Text style={[styles.stepSubtitle, { color: theme.isDark ? '#B2BEB5' : '#636E72' }]}>
                {currentStepData.subtitle}
              </Text>
            </Animated.View>
          </Animated.View>
          
          {/* Bottom Actions */}
          <Animated.View style={[styles.bottomSection, { opacity: titleFadeAnim }]}>
            {currentStep === 0 ? (
              // Welcome screen buttons
              <View style={styles.welcomeActions}>
                <TouchableOpacity
                  style={[styles.primaryButton, { backgroundColor: theme.isDark ? '#8B4513' : '#CD853F' }]}
                  onPress={handleGetStarted}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.primaryButtonText, { color: '#FFFFFF' }]}>
                    Get Started →
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={handleSignIn}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.secondaryButtonText, { color: theme.isDark ? '#FF8C00' : '#8B4513' }]}>
                    Already have an account? Sign In
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Onboarding flow buttons
              <View style={styles.onboardingActions}>
                <TouchableOpacity
                  style={styles.skipButton}
                  onPress={handleSkip}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.skipButtonText, { color: theme.isDark ? '#B2BEB5' : '#636E72' }]}>
                    Skip
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.nextButton, { backgroundColor: theme.isDark ? '#8B4513' : '#CD853F' }]}
                  onPress={handleNext}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.nextButtonText, { color: '#FFFFFF' }]}>
                    →
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            
            {/* Progress Dots */}
            {currentStep > 0 && (
              <View style={styles.progressDots}>
                {WELCOME_STEPS.slice(1).map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.progressDot,
                      {
                        backgroundColor: index + 1 <= currentStep
                          ? (theme.isDark ? '#8B4513' : '#CD853F')
                          : (theme.isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'),
                      },
                    ]}
                  />
                ))}
              </View>
            )}
          </Animated.View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 60,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  stepIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  illustrationSection: {
    height: 200,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 60,
    height: 60,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logoCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginBottom: 4,
  },
  welcomeIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  personIllustration: {
    width: 120,
    height: 150,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  personHead: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFCC8F',
    marginBottom: 8,
  },
  personBody: {
    width: 60,
    height: 80,
    borderRadius: 30,
    backgroundColor: '#90CDB0',
  },
  moodContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  moodFace: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodEmoji: {
    fontSize: 24,
  },
  journalContainer: {
    width: 100,
    height: 120,
    borderRadius: 8,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  journalPages: {
    width: 80,
    height: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  journalBinding: {
    position: 'absolute',
    left: 10,
    top: 10,
    bottom: 10,
    width: 4,
    backgroundColor: '#8B4513',
    borderRadius: 2,
  },
  mindfulContainer: {
    alignItems: 'center',
  },
  meditationPerson: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  mindfulElements: {
    alignItems: 'center',
  },
  mindfulEmoji: {
    fontSize: 32,
  },
  communityContainer: {
    alignItems: 'center',
  },
  heartShape: {
    width: 60,
    height: 54,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    transform: [{ rotate: '45deg' }],
    marginBottom: 20,
  },
  communityHands: {
    flexDirection: 'row',
    gap: 16,
  },
  hand: {
    width: 40,
    height: 50,
    borderRadius: 20,
  },
  textContent: {
    alignItems: 'center',
    marginBottom: 40,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
  },
  stepSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  welcomeActions: {
    alignItems: 'center',
  },
  onboardingActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  primaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    marginBottom: 16,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    paddingVertical: 12,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  nextButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default WelcomeScreen;