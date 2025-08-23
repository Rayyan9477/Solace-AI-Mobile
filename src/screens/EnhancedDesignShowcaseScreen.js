import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../shared/theme/ThemeContext';
import {
  EnhancedCard,
  EnhancedButton,
  EnhancedShadersContainer,
} from '../components/enhanced';
import { MentalHealthIcon } from '../components/icons';
import {
  enhancedSpacing as spacing,
  enhancedBorderRadius as borderRadius,
  enhancedTypography as typography,
} from '../shared/theme/enhancedTheme';

// Showcase screen demonstrating the enhanced design system
// Features Paper Design shader effects and shadcn/ui principles
const EnhancedDesignShowcaseScreen = () => {
  const { theme } = useTheme();
  const [selectedVariant, setSelectedVariant] = useState('glass');
  const [selectedShader, setSelectedShader] = useState('mesh');

  const shaderVariants = ['mesh', 'waves', 'dots', 'glass', 'grain'];
  const cardVariants = ['default', 'therapeutic', 'glass', 'gradient', 'minimal'];
  const buttonVariants = ['primary', 'therapeutic', 'secondary', 'glass', 'outline'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <EnhancedCard
          variant="therapeutic"
          size="medium"
          animated={true}
          shaderVariant="waves"
          shaderIntensity={0.3}
          style={styles.headerCard}
        >
          <View style={styles.headerContent}>
            <MentalHealthIcon
              name="Brain"
              size="lg"
              colorScheme="therapeutic"
              style={styles.headerIcon}
            />
            <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
              Enhanced Design System
            </Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.text.secondary }]}>
              Paper Design Shaders × shadcn/ui Principles
            </Text>
          </View>
        </EnhancedCard>

        {/* Shader Variants Demo */}
        <EnhancedCard
          title="Shader Effects"
          subtitle="Dynamic visual backgrounds"
          variant="glass"
          size="medium"
          animated={true}
          shaderVariant={selectedShader}
          shaderIntensity={0.4}
          style={styles.demoCard}
        >
          <Text style={[styles.sectionDescription, { color: theme.colors.text.tertiary }]}>
            Choose a shader variant to see the effect in real-time
          </Text>
          
          <View style={styles.variantGrid}>
            {shaderVariants.map((variant) => (
              <EnhancedButton
                key={variant}
                title={variant}
                variant={selectedShader === variant ? 'therapeutic' : 'outline'}
                size="small"
                animated={true}
                onPress={() => setSelectedShader(variant)}
                style={styles.variantButton}
              />
            ))}
          </View>
        </EnhancedCard>

        {/* Card Variants Demo */}
        <EnhancedCard
          title="Card Variants"
          subtitle="Multiple visual styles"
          variant="gradient"
          size="medium"
          animated={true}
          shaderVariant="dots"
          shaderIntensity={0.2}
        >
          <View style={styles.cardVariantsContainer}>
            {cardVariants.map((variant, index) => (
              <EnhancedCard
                key={variant}
                title={`${variant} Card`}
                subtitle={`Example of ${variant} styling`}
                variant={variant}
                size="small"
                animated={true}
                shaderVariant="glass"
                shaderIntensity={0.2}
                style={[styles.miniCard, { animationDelay: index * 100 }]}
              >
                <Text style={[styles.miniCardText, { color: theme.colors.text.primary }]}>
                  Enhanced with shader effects and therapeutic design principles
                </Text>
              </EnhancedCard>
            ))}
          </View>
        </EnhancedCard>

        {/* Button Variants Demo */}
        <EnhancedCard
          title="Button Variants"
          subtitle="Interactive elements"
          variant="minimal"
          size="medium"
          animated={true}
          shaderVariant="grain"
          shaderIntensity={0.3}
        >
          <View style={styles.buttonGrid}>
            {buttonVariants.map((variant) => (
              <EnhancedButton
                key={variant}
                title={`${variant} Button`}
                variant={variant}
                size="medium"
                animated={true}
                shaderEffect={variant === 'therapeutic' || variant === 'primary'}
                shaderVariant="mesh"
                icon="Heart"
                style={styles.demoButton}
                onPress={() => console.log(`${variant} button pressed`)}
              />
            ))}
          </View>
        </EnhancedCard>

        {/* Interactive Shader Container Demo */}
        <EnhancedCard
          title="Interactive Effects"
          subtitle="Touch-responsive shaders"
          variant="therapeutic"
          size="large"
          animated={true}
          shaderVariant="waves"
          shaderIntensity={0.2}
        >
          <EnhancedShadersContainer
            variant="mesh"
            intensity={0.5}
            animated={true}
            interactive={true}
            style={styles.interactiveContainer}
          >
            <View style={styles.interactiveContent}>
              <MentalHealthIcon
                name="Mindfulness"
                size="xl"
                colorScheme="therapeutic"
                style={styles.interactiveIcon}
              />
              <Text style={[styles.interactiveTitle, { color: theme.colors.text.primary }]}>
                Touch to Interact
              </Text>
              <Text style={[styles.interactiveDescription, { color: theme.colors.text.secondary }]}>
                This container responds to touch events with dynamic shader effects
              </Text>
            </View>
          </EnhancedShadersContainer>
        </EnhancedCard>

        {/* Therapeutic Color Palette */}
        <EnhancedCard
          title="Therapeutic Colors"
          subtitle="Mental health-focused palette"
          variant="default"
          size="medium"
          animated={true}
          shaderVariant="dots"
          shaderIntensity={0.1}
        >
          <View style={styles.colorPalette}>
            <View style={styles.colorRow}>
              <View style={[styles.colorSwatch, { backgroundColor: theme.colors.therapeutic.calming[500] }]} />
              <View style={styles.colorInfo}>
                <Text style={[styles.colorName, { color: theme.colors.text.primary }]}>Calming</Text>
                <Text style={[styles.colorDescription, { color: theme.colors.text.tertiary }]}>Peace & Tranquility</Text>
              </View>
            </View>
            
            <View style={styles.colorRow}>
              <View style={[styles.colorSwatch, { backgroundColor: theme.colors.therapeutic.nurturing[500] }]} />
              <View style={styles.colorInfo}>
                <Text style={[styles.colorName, { color: theme.colors.text.primary }]}>Nurturing</Text>
                <Text style={[styles.colorDescription, { color: theme.colors.text.tertiary }]}>Growth & Healing</Text>
              </View>
            </View>
            
            <View style={styles.colorRow}>
              <View style={[styles.colorSwatch, { backgroundColor: theme.colors.therapeutic.peaceful[500] }]} />
              <View style={styles.colorInfo}>
                <Text style={[styles.colorName, { color: theme.colors.text.primary }]}>Peaceful</Text>
                <Text style={[styles.colorDescription, { color: theme.colors.text.tertiary }]}>Serenity & Balance</Text>
              </View>
            </View>
            
            <View style={styles.colorRow}>
              <View style={[styles.colorSwatch, { backgroundColor: theme.colors.therapeutic.grounding[500] }]} />
              <View style={styles.colorInfo}>
                <Text style={[styles.colorName, { color: theme.colors.text.primary }]}>Grounding</Text>
                <Text style={[styles.colorDescription, { color: theme.colors.text.tertiary }]}>Stability & Wisdom</Text>
              </View>
            </View>
          </View>
        </EnhancedCard>

        {/* Footer Spacing */}
        <View style={styles.footerSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[6],
  },
  headerCard: {
    marginBottom: spacing[6],
  },
  headerContent: {
    alignItems: 'center',
    paddingVertical: spacing[4],
  },
  headerIcon: {
    marginBottom: spacing[3],
  },
  headerTitle: {
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.bold,
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  headerSubtitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    textAlign: 'center',
    opacity: 0.8,
  },
  demoCard: {
    marginBottom: spacing[6],
  },
  sectionDescription: {
    fontSize: typography.sizes.sm,
    lineHeight: typography.lineHeights.sm,
    marginBottom: spacing[4],
    opacity: 0.8,
  },
  variantGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    justifyContent: 'center',
  },
  variantButton: {
    marginHorizontal: spacing[1],
    marginVertical: spacing[1],
  },
  cardVariantsContainer: {
    gap: spacing[3],
  },
  miniCard: {
    marginVertical: spacing[2],
  },
  miniCardText: {
    fontSize: typography.sizes.xs,
    lineHeight: typography.lineHeights.xs,
    opacity: 0.8,
  },
  buttonGrid: {
    gap: spacing[3],
  },
  demoButton: {
    marginVertical: spacing[1],
  },
  interactiveContainer: {
    minHeight: 200,
    borderRadius: borderRadius.xl,
    marginVertical: spacing[4],
  },
  interactiveContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[8],
  },
  interactiveIcon: {
    marginBottom: spacing[4],
  },
  interactiveTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semiBold,
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  interactiveDescription: {
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    opacity: 0.8,
    paddingHorizontal: spacing[4],
  },
  colorPalette: {
    gap: spacing[3],
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    marginRight: spacing[3],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  colorInfo: {
    flex: 1,
  },
  colorName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semiBold,
    marginBottom: spacing[0.5],
  },
  colorDescription: {
    fontSize: typography.sizes.sm,
    opacity: 0.7,
  },
  footerSpacing: {
    height: spacing[8],
  },
});

export default EnhancedDesignShowcaseScreen;