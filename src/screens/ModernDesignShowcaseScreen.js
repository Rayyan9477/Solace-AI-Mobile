import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Animated,
  StatusBar,
} from 'react-native';
import { useTheme } from '../shared/theme/ThemeContext';

// Modern Components
import AdvancedShadersContainer from '../components/advanced/AdvancedShadersContainer';
import ModernCard from '../components/modern/ModernCard';
import ModernButton from '../components/modern/ModernButton';

// Icons
import { MentalHealthIcon } from '../components/icons';

// Theme
import {
  modernDarkColors,
  modernTypography,
  modernSpacing,
  modernBorderRadius,
  modernShadows,
  modernAnimations,
} from '../shared/theme/darkTheme';

// Modern Design Showcase - Dark, Elegant, Premium
// Features all advanced components and design system elements
const ModernDesignShowcaseScreen = () => {
  const { theme } = useTheme();
  const [selectedShader, setSelectedShader] = useState('neon');
  const [selectedCard, setSelectedCard] = useState('glass');
  const [selectedButton, setSelectedButton] = useState('primary');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.stagger(200, [
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: modernAnimations.timing.slow,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        ...modernAnimations.spring.gentle,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const shaderVariants = ['neon', 'aurora', 'holographic', 'neural', 'quantum', 'plasma', 'void'];
  const cardVariants = ['glass', 'neon', 'void', 'neural', 'holographic', 'minimal'];
  const buttonVariants = ['primary', 'ghost', 'glass', 'neon', 'void', 'neural', 'outline'];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Background Shader */}
      <AdvancedShadersContainer
        variant="aurora"
        intensity={0.2}
        animated={true}
        interactive={false}
        style={styles.backgroundShader}
      />

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Header */}
        <Animated.View
          style={[
            styles.heroSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <AdvancedShadersContainer
            variant="holographic"
            intensity={0.6}
            animated={true}
            interactive={true}
            glowEffect={true}
            style={styles.heroContainer}
          >
            <View style={styles.heroContent}>
              <View style={styles.heroIcon}>
                <MentalHealthIcon
                  name="Brain"
                  size="4xl"
                  color={modernDarkColors.accent.primary}
                  variant="outline"
                />
              </View>
              <Text style={styles.heroTitle}>Modern Dark Design</Text>
              <Text style={styles.heroSubtitle}>
                Elegant • Sophisticated • Engaging
              </Text>
              <Text style={styles.heroDescription}>
                Premium visual effects with advanced shaders, glassmorphism, and therapeutic design principles
              </Text>
            </View>
          </AdvancedShadersContainer>
        </Animated.View>

        {/* Shader Variants Demo */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <ModernCard
            title="Advanced Shader Effects"
            subtitle="Paper Design inspired visual elements"
            variant="neural"
            elevation="high"
            animated={true}
            glowEffect={true}
            shaderVariant={selectedShader}
          >
            <Text style={styles.sectionDescription}>
              Select a shader variant to experience real-time visual effects
            </Text>
            
            <View style={styles.variantGrid}>
              {shaderVariants.map((variant) => (
                <ModernButton
                  key={variant}
                  title={variant}
                  variant={selectedShader === variant ? 'neon' : 'ghost'}
                  size="small"
                  animated={true}
                  glowEffect={selectedShader === variant}
                  onPress={() => setSelectedShader(variant)}
                  style={styles.variantButton}
                />
              ))}
            </View>

            {/* Interactive Shader Demo */}
            <View style={styles.shaderDemo}>
              <AdvancedShadersContainer
                variant={selectedShader}
                intensity={0.8}
                animated={true}
                interactive={true}
                glowEffect={true}
                morphEffect={true}
                style={styles.interactiveShader}
              >
                <View style={styles.shaderContent}>
                  <Text style={styles.shaderText}>Touch to Interact</Text>
                  <Text style={styles.shaderSubtext}>
                    Experience {selectedShader} shader effects
                  </Text>
                </View>
              </AdvancedShadersContainer>
            </View>
          </ModernCard>
        </Animated.View>

        {/* Card Variants Demo */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <ModernCard
            title="Premium Card Components"
            subtitle="Glassmorphism and modern design"
            variant="void"
            elevation="floating"
            animated={true}
            shaderVariant="quantum"
          >
            <View style={styles.cardVariantsContainer}>
              {cardVariants.map((variant, index) => (
                <ModernCard
                  key={variant}
                  title={`${variant.charAt(0).toUpperCase() + variant.slice(1)} Card`}
                  subtitle={`Premium ${variant} styling`}
                  variant={variant}
                  elevation="medium"
                  animated={true}
                  glowEffect={variant === 'neon' || variant === 'neural'}
                  interactive={true}
                  onPress={() => setSelectedCard(variant)}
                  style={[
                    styles.miniCard,
                    selectedCard === variant && styles.selectedCard,
                  ]}
                >
                  <Text style={styles.miniCardText}>
                    Advanced visual effects with sophisticated design patterns
                  </Text>
                </ModernCard>
              ))}
            </View>
          </ModernCard>
        </Animated.View>

        {/* Button Variants Demo */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <ModernCard
            title="Interactive Button System"
            subtitle="Micro-animations and premium feedback"
            variant="holographic"
            elevation="high"
            animated={true}
            glowEffect={true}
            shaderVariant="holographic"
          >
            <View style={styles.buttonGrid}>
              {buttonVariants.map((variant) => (
                <ModernButton
                  key={variant}
                  title={`${variant} Button`}
                  variant={variant}
                  size="medium"
                  animated={true}
                  glowEffect={variant === 'neon' || variant === 'neural'}
                  shaderEffect={variant === 'primary' || variant === 'neon'}
                  morphEffect={variant === 'neural'}
                  icon={variant === 'primary' ? 'Heart' : variant === 'neural' ? 'Brain' : undefined}
                  onPress={() => setSelectedButton(variant)}
                  style={styles.demoButton}
                />
              ))}
            </View>
          </ModernCard>
        </Animated.View>

        {/* Color Palette Demo */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <ModernCard
            title="Therapeutic Dark Palette"
            subtitle="Sophisticated colors for mental wellness"
            variant="minimal"
            elevation="medium"
            animated={true}
            shaderVariant="void"
          >
            <View style={styles.colorPalette}>
              <View style={styles.colorSection}>
                <Text style={styles.colorSectionTitle}>Primary Accents</Text>
                <View style={styles.colorRow}>
                  <View style={[styles.colorSwatch, { backgroundColor: modernDarkColors.accent.primary }]} />
                  <View style={styles.colorInfo}>
                    <Text style={styles.colorName}>Electric Purple</Text>
                    <Text style={styles.colorHex}>#7C3AED</Text>
                    <Text style={styles.colorDescription}>Primary interactive elements</Text>
                  </View>
                </View>
                <View style={styles.colorRow}>
                  <View style={[styles.colorSwatch, { backgroundColor: modernDarkColors.accent.secondary }]} />
                  <View style={styles.colorInfo}>
                    <Text style={styles.colorName}>Electric Blue</Text>
                    <Text style={styles.colorHex}>#3B82F6</Text>
                    <Text style={styles.colorDescription}>Secondary highlights</Text>
                  </View>
                </View>
              </View>

              <View style={styles.colorSection}>
                <Text style={styles.colorSectionTitle}>Therapeutic Colors</Text>
                <View style={styles.colorRow}>
                  <View style={[styles.colorSwatch, { backgroundColor: modernDarkColors.therapeutic.calming.primary }]} />
                  <View style={styles.colorInfo}>
                    <Text style={styles.colorName}>Midnight Calming</Text>
                    <Text style={styles.colorDescription}>Deep blues for peace & tranquility</Text>
                  </View>
                </View>
                <View style={styles.colorRow}>
                  <View style={[styles.colorSwatch, { backgroundColor: modernDarkColors.therapeutic.nurturing.primary }]} />
                  <View style={styles.colorInfo}>
                    <Text style={styles.colorName}>Deep Nurturing</Text>
                    <Text style={styles.colorDescription}>Rich emerald for growth & healing</Text>
                  </View>
                </View>
                <View style={styles.colorRow}>
                  <View style={[styles.colorSwatch, { backgroundColor: modernDarkColors.therapeutic.peaceful.primary }]} />
                  <View style={styles.colorInfo}>
                    <Text style={styles.colorName}>Sophisticated Peaceful</Text>
                    <Text style={styles.colorDescription}>Elegant purples for serenity</Text>
                  </View>
                </View>
              </View>
            </View>
          </ModernCard>
        </Animated.View>

        {/* Typography Demo */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <ModernCard
            title="Modern Typography System"
            subtitle="Premium fonts and sophisticated hierarchy"
            variant="glass"
            elevation="medium"
            animated={true}
            shaderVariant="neural"
          >
            <View style={styles.typographyDemo}>
              <Text style={styles.displayText}>Display Heading</Text>
              <Text style={styles.headingText}>Section Heading</Text>
              <Text style={styles.bodyText}>
                Body text with perfect readability and sophisticated character spacing.
                Designed for premium user experiences with mental health focus.
              </Text>
              <Text style={styles.captionText}>Caption • Metadata • Supporting Information</Text>
            </View>
          </ModernCard>
        </Animated.View>

        {/* Performance Metrics */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <ModernCard
            title="Design System Metrics"
            subtitle="Technical excellence and performance"
            variant="neural"
            elevation="high"
            animated={true}
            glowEffect={true}
            shaderVariant="quantum"
          >
            <View style={styles.metricsGrid}>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>60fps</Text>
                <Text style={styles.metricLabel}>Native Animations</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>7</Text>
                <Text style={styles.metricLabel}>Shader Variants</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>WCAG 2.1</Text>
                <Text style={styles.metricLabel}>Accessibility</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>Dark First</Text>
                <Text style={styles.metricLabel}>Theme Design</Text>
              </View>
            </View>
          </ModernCard>
        </Animated.View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: modernDarkColors.background.primary,
  },
  backgroundShader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  scrollView: {
    flex: 1,
    zIndex: 5,
  },
  scrollContent: {
    paddingHorizontal: modernSpacing[4],
    paddingVertical: modernSpacing[8],
  },
  heroSection: {
    marginBottom: modernSpacing[8],
  },
  heroContainer: {
    minHeight: 200,
  },
  heroContent: {
    alignItems: 'center',
    paddingVertical: modernSpacing[8],
  },
  heroIcon: {
    marginBottom: modernSpacing[6],
  },
  heroTitle: {
    fontSize: modernTypography.sizes['5xl'],
    fontWeight: modernTypography.weights.black,
    fontFamily: modernTypography.fontFamily.display,
    color: modernDarkColors.text.primary,
    textAlign: 'center',
    marginBottom: modernSpacing[3],
    letterSpacing: modernTypography.letterSpacing.tight,
  },
  heroSubtitle: {
    fontSize: modernTypography.sizes.xl,
    fontWeight: modernTypography.weights.medium,
    fontFamily: modernTypography.fontFamily.sans,
    color: modernDarkColors.accent.primary,
    textAlign: 'center',
    marginBottom: modernSpacing[4],
    letterSpacing: modernTypography.letterSpacing.wide,
  },
  heroDescription: {
    fontSize: modernTypography.sizes.base,
    fontWeight: modernTypography.weights.normal,
    fontFamily: modernTypography.fontFamily.sans,
    color: modernDarkColors.text.secondary,
    textAlign: 'center',
    lineHeight: modernTypography.lineHeights.base,
    paddingHorizontal: modernSpacing[4],
    opacity: 0.9,
  },
  section: {
    marginBottom: modernSpacing[8],
  },
  sectionDescription: {
    fontSize: modernTypography.sizes.sm,
    fontFamily: modernTypography.fontFamily.sans,
    color: modernDarkColors.text.tertiary,
    marginBottom: modernSpacing[6],
    opacity: 0.8,
    lineHeight: modernTypography.lineHeights.sm,
  },
  variantGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: modernSpacing[2],
    marginBottom: modernSpacing[6],
  },
  variantButton: {
    marginHorizontal: modernSpacing[1],
  },
  shaderDemo: {
    marginTop: modernSpacing[4],
  },
  interactiveShader: {
    minHeight: 150,
    borderRadius: modernBorderRadius.xl,
  },
  shaderContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shaderText: {
    fontSize: modernTypography.sizes.xl,
    fontWeight: modernTypography.weights.bold,
    fontFamily: modernTypography.fontFamily.display,
    color: modernDarkColors.text.primary,
    marginBottom: modernSpacing[2],
  },
  shaderSubtext: {
    fontSize: modernTypography.sizes.sm,
    fontFamily: modernTypography.fontFamily.sans,
    color: modernDarkColors.text.secondary,
    opacity: 0.8,
  },
  cardVariantsContainer: {
    gap: modernSpacing[4],
  },
  miniCard: {
    marginVertical: modernSpacing[2],
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: modernDarkColors.accent.primary,
  },
  miniCardText: {
    fontSize: modernTypography.sizes.xs,
    fontFamily: modernTypography.fontFamily.sans,
    color: modernDarkColors.text.secondary,
    lineHeight: modernTypography.lineHeights.xs,
    opacity: 0.8,
  },
  buttonGrid: {
    gap: modernSpacing[3],
  },
  demoButton: {
    marginVertical: modernSpacing[1],
  },
  colorPalette: {
    gap: modernSpacing[6],
  },
  colorSection: {
    gap: modernSpacing[3],
  },
  colorSectionTitle: {
    fontSize: modernTypography.sizes.lg,
    fontWeight: modernTypography.weights.semiBold,
    fontFamily: modernTypography.fontFamily.display,
    color: modernDarkColors.text.primary,
    marginBottom: modernSpacing[2],
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: modernSpacing[2],
  },
  colorSwatch: {
    width: 48,
    height: 48,
    borderRadius: modernBorderRadius.lg,
    marginRight: modernSpacing[4],
    borderWidth: 1,
    borderColor: modernDarkColors.border.glass,
    ...modernShadows.sm,
  },
  colorInfo: {
    flex: 1,
  },
  colorName: {
    fontSize: modernTypography.sizes.base,
    fontWeight: modernTypography.weights.semiBold,
    fontFamily: modernTypography.fontFamily.sans,
    color: modernDarkColors.text.primary,
    marginBottom: modernSpacing[0.5],
  },
  colorHex: {
    fontSize: modernTypography.sizes.sm,
    fontWeight: modernTypography.weights.medium,
    fontFamily: modernTypography.fontFamily.mono,
    color: modernDarkColors.text.accent,
    marginBottom: modernSpacing[0.5],
  },
  colorDescription: {
    fontSize: modernTypography.sizes.sm,
    fontFamily: modernTypography.fontFamily.sans,
    color: modernDarkColors.text.tertiary,
    opacity: 0.8,
  },
  typographyDemo: {
    gap: modernSpacing[4],
  },
  displayText: {
    fontSize: modernTypography.sizes['4xl'],
    fontWeight: modernTypography.weights.black,
    fontFamily: modernTypography.fontFamily.display,
    color: modernDarkColors.text.primary,
    letterSpacing: modernTypography.letterSpacing.tight,
  },
  headingText: {
    fontSize: modernTypography.sizes['2xl'],
    fontWeight: modernTypography.weights.bold,
    fontFamily: modernTypography.fontFamily.display,
    color: modernDarkColors.text.primary,
  },
  bodyText: {
    fontSize: modernTypography.sizes.base,
    fontWeight: modernTypography.weights.normal,
    fontFamily: modernTypography.fontFamily.sans,
    color: modernDarkColors.text.secondary,
    lineHeight: modernTypography.lineHeights.base,
  },
  captionText: {
    fontSize: modernTypography.sizes.sm,
    fontWeight: modernTypography.weights.medium,
    fontFamily: modernTypography.fontFamily.sans,
    color: modernDarkColors.text.tertiary,
    letterSpacing: modernTypography.letterSpacing.wide,
    opacity: 0.8,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: modernSpacing[4],
  },
  metric: {
    flex: 1,
    minWidth: 120,
    alignItems: 'center',
    paddingVertical: modernSpacing[4],
    paddingHorizontal: modernSpacing[3],
    backgroundColor: modernDarkColors.glass.light,
    borderRadius: modernBorderRadius.lg,
    borderWidth: 1,
    borderColor: modernDarkColors.border.glass,
  },
  metricValue: {
    fontSize: modernTypography.sizes['2xl'],
    fontWeight: modernTypography.weights.black,
    fontFamily: modernTypography.fontFamily.display,
    color: modernDarkColors.accent.primary,
    marginBottom: modernSpacing[1],
    textAlign: 'center',
  },
  metricLabel: {
    fontSize: modernTypography.sizes.xs,
    fontWeight: modernTypography.weights.medium,
    fontFamily: modernTypography.fontFamily.sans,
    color: modernDarkColors.text.secondary,
    textAlign: 'center',
    opacity: 0.8,
  },
  bottomSpacing: {
    height: modernSpacing[12],
  },
});

export default ModernDesignShowcaseScreen;