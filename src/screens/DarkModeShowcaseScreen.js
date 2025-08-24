import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';

// Import components and themes
import { useTheme } from '../shared/theme/ThemeContext';
import { freudDarkTheme } from '../shared/theme/freudDarkTheme';
import DarkModeToggle from '../components/ui/DarkModeToggle';
import DarkModeNavigator from '../navigation/DarkModeNavigator';

const Stack = createStackNavigator();

const DarkModeShowcaseScreen = () => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [showDemo, setShowDemo] = useState(false);

  const demoSections = [
    {
      title: "🌙 Dark Mode Splash Screens",
      description: "4 beautiful splash screen variations with animations",
      screens: ["Logo", "Progress", "Quote", "Loading"],
      color: isDarkMode ? freudDarkTheme.colors.accent.primary : theme.colors.primary[500],
    },
    {
      title: "👋 Welcome Onboarding",
      description: "6-step guided introduction with smooth transitions",
      screens: ["Step 1-6"],
      color: isDarkMode ? freudDarkTheme.colors.header.primary : theme.colors.secondary[500],
    },
    {
      title: "🔐 Authentication Flow",
      description: "Sign in, sign up, and password recovery",
      screens: ["Sign In", "Sign Up", "Forgot Password"],
      color: isDarkMode ? "#E67E22" : theme.colors.warning[500],
    },
    {
      title: "📊 Mental Health Assessment",
      description: "Comprehensive 14-step psychological evaluation",
      screens: ["14 Questions", "Interactive", "Analysis"],
      color: isDarkMode ? "#8B9F6F" : theme.colors.success[500],
    },
  ];

  const features = [
    {
      icon: "🎨",
      title: "Freud Dark Theme",
      description: "Custom dark theme based on UI design references with therapeutic brown colors",
    },
    {
      icon: "🌙",
      title: "Smart Transitions", 
      description: "Smooth animations and transitions optimized for dark mode viewing",
    },
    {
      icon: "♿",
      title: "Accessibility First",
      description: "WCAG 2.1 compliant with proper contrast ratios and screen reader support",
    },
    {
      icon: "📱",
      title: "Cross Platform",
      description: "Consistent experience across iOS, Android, and Web platforms",
    },
    {
      icon: "🧠",
      title: "Mental Health Focus",
      description: "UI patterns specifically designed for mental health applications",
    },
    {
      icon: "🎯",
      title: "Pixel Perfect",
      description: "Implementation matches design references exactly with attention to detail",
    },
  ];

  const handleStartDemo = () => {
    setShowDemo(true);
  };

  const handleAuthComplete = (credentials) => {
    Alert.alert(
      "Authentication Complete",
      `Welcome! Credentials: ${JSON.stringify(credentials, null, 2)}`,
      [
        { text: "Continue", onPress: () => setShowDemo(false) }
      ]
    );
  };

  const handleAssessmentComplete = (assessmentData) => {
    Alert.alert(
      "Assessment Complete", 
      `Assessment data collected: ${Object.keys(assessmentData).length} responses`,
      [
        { text: "View Results", onPress: () => console.log(assessmentData) },
        { text: "Continue", onPress: () => setShowDemo(false) }
      ]
    );
  };

  if (showDemo) {
    return (
      <NavigationContainer independent={true}>
        <DarkModeNavigator 
          onAuthComplete={handleAuthComplete}
          onAssessmentComplete={handleAssessmentComplete}
          startScreen="DarkSplash"
        />
      </NavigationContainer>
    );
  }

  const currentTheme = isDarkMode ? freudDarkTheme : theme;
  const backgroundColor = isDarkMode 
    ? freudDarkTheme.colors.background.primary 
    : theme.colors.background.primary;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[
              styles.title, 
              { color: currentTheme.colors.text?.primary || currentTheme.colors.text.primary }
            ]}>
              Dark Mode Showcase
            </Text>
            <Text style={[
              styles.subtitle,
              { color: currentTheme.colors.text?.secondary || currentTheme.colors.text.secondary }
            ]}>
              Complete implementation of dark mode UI based on design references
            </Text>
          </View>
          
          <DarkModeToggle size="large" />
        </View>

        {/* Demo Sections */}
        <View style={styles.sectionsContainer}>
          <Text style={[
            styles.sectionTitle,
            { color: currentTheme.colors.text?.primary || currentTheme.colors.text.primary }
          ]}>
            🎯 What's Included
          </Text>

          {demoSections.map((section, index) => (
            <View 
              key={index}
              style={[
                styles.sectionCard,
                { 
                  backgroundColor: currentTheme.colors.background?.card || currentTheme.colors.card?.background || '#FFFFFF',
                  borderLeftColor: section.color,
                  ...currentTheme.shadows?.sm || {},
                }
              ]}
            >
              <Text style={[
                styles.cardTitle,
                { color: currentTheme.colors.text?.primary || currentTheme.colors.text.primary }
              ]}>
                {section.title}
              </Text>
              <Text style={[
                styles.cardDescription,
                { color: currentTheme.colors.text?.secondary || currentTheme.colors.text.secondary }
              ]}>
                {section.description}
              </Text>
              <View style={styles.screensContainer}>
                {section.screens.map((screen, screenIndex) => (
                  <View 
                    key={screenIndex}
                    style={[
                      styles.screenTag,
                      { backgroundColor: `${section.color}20` }
                    ]}
                  >
                    <Text style={[
                      styles.screenTagText,
                      { color: section.color }
                    ]}>
                      {screen}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <Text style={[
            styles.sectionTitle,
            { color: currentTheme.colors.text?.primary || currentTheme.colors.text.primary }
          ]}>
            ✨ Key Features
          </Text>

          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View 
                key={index}
                style={[
                  styles.featureCard,
                  { 
                    backgroundColor: currentTheme.colors.background?.card || currentTheme.colors.card?.background || '#FFFFFF',
                    ...currentTheme.shadows?.sm || {},
                  }
                ]}
              >
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <Text style={[
                  styles.featureTitle,
                  { color: currentTheme.colors.text?.primary || currentTheme.colors.text.primary }
                ]}>
                  {feature.title}
                </Text>
                <Text style={[
                  styles.featureDescription,
                  { color: currentTheme.colors.text?.secondary || currentTheme.colors.text.secondary }
                ]}>
                  {feature.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Start Demo Button */}
        <View style={styles.demoButtonContainer}>
          <TouchableOpacity 
            style={[
              styles.demoButton,
              { 
                backgroundColor: currentTheme.colors.accent?.primary || 
                  currentTheme.colors.primary?.[500] || 
                  '#926247'
              }
            ]}
            onPress={handleStartDemo}
          >
            <Text style={styles.demoButtonText}>
              🚀 Start Dark Mode Demo
            </Text>
          </TouchableOpacity>

          <Text style={[
            styles.demoNote,
            { color: currentTheme.colors.text?.tertiary || currentTheme.colors.text.tertiary }
          ]}>
            Experience all screens in sequence starting with splash screens
          </Text>
        </View>

        {/* Theme Info */}
        <View style={styles.themeInfoContainer}>
          <Text style={[
            styles.themeInfoTitle,
            { color: currentTheme.colors.text?.primary || currentTheme.colors.text.primary }
          ]}>
            Current Theme: {isDarkMode ? 'Freud Dark' : 'Light Mode'}
          </Text>
          <Text style={[
            styles.themeInfoText,
            { color: currentTheme.colors.text?.secondary || currentTheme.colors.text.secondary }
          ]}>
            {isDarkMode 
              ? 'Using custom Freud dark theme with therapeutic brown color palette'
              : 'Using standard light theme with Freud design system colors'
            }
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    maxWidth: 250,
  },

  // Sections
  sectionsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  sectionCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  screensContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  screenTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  screenTagText: {
    fontSize: 12,
    fontWeight: '500',
  },

  // Features
  featuresContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  featuresGrid: {
    gap: 16,
  },
  featureCard: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    textAlign: 'center',
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },

  // Demo button
  demoButtonContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  demoButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  demoButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  demoNote: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // Theme info
  themeInfoContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    marginHorizontal: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(100, 100, 100, 0.1)',
  },
  themeInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  themeInfoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default DarkModeShowcaseScreen;