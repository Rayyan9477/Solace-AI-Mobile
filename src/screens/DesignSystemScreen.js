import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import { DesignSystemProvider } from '../design-system/DesignSystemContext';
import ColorCustomizer from '../design-system/ColorCustomizer';
import ComponentCustomizer from '../design-system/ComponentCustomizer';
import { MentalHealthIcon, ActionIcon } from '../components/icons';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';

const { width } = Dimensions.get('window');

const DesignSystemScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('colors');

  const tabs = [
    {
      id: 'colors',
      label: 'Colors',
      icon: 'Heart',
      description: 'Customize color palettes',
    },
    {
      id: 'components',
      label: 'Components',
      icon: 'Brain',
      description: 'Adjust spacing & typography',
    },
  ];

  const TabButton = ({ tab, isActive, onPress }) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        {
          backgroundColor: isActive 
            ? theme.colors.primary[500] 
            : theme.colors.background.secondary,
          borderColor: isActive 
            ? theme.colors.primary[500] 
            : theme.colors.border.primary,
        },
      ]}
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={`${tab.label} customization tab`}
    >
      <MentalHealthIcon 
        name={tab.icon} 
        size="md" 
        color={isActive ? theme.colors.text.inverse : theme.colors.text.primary}
      />
      <Text
        style={[
          styles.tabButtonText,
          {
            color: isActive ? theme.colors.text.inverse : theme.colors.text.primary,
          },
        ]}
      >
        {tab.label}
      </Text>
      <Text
        style={[
          styles.tabButtonDescription,
          {
            color: isActive ? theme.colors.text.inverse : theme.colors.text.secondary,
          },
        ]}
      >
        {tab.description}
      </Text>
    </TouchableOpacity>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'colors':
        return <ColorCustomizer />;
      case 'components':
        return <ComponentCustomizer />;
      default:
        return <ColorCustomizer />;
    }
  };

  return (
    <DesignSystemProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
        <StatusBar 
          barStyle={theme.colors.statusBar} 
          backgroundColor={theme.colors.background.primary} 
        />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[
              styles.backButton,
              { backgroundColor: theme.colors.background.secondary },
            ]}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ActionIcon name="ArrowLeft" size="md" color={theme.colors.text.primary} />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <LinearGradient
              colors={[
                theme.colors.primary[400],
                theme.colors.primary[600],
              ]}
              style={styles.headerIcon}
            >
              <MentalHealthIcon name="Brain" size="lg" color={theme.colors.text.inverse} />
            </LinearGradient>
            
            <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
              Design System
            </Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.text.secondary }]}>
              Personalize your mental wellness experience
            </Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <View style={styles.tabBar}>
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                tab={tab}
                isActive={activeTab === tab.id}
                onPress={() => setActiveTab(tab.id)}
              />
            ))}
          </View>
        </View>

        {/* Content Area */}
        <View style={styles.contentContainer}>
          {renderContent()}
        </View>
      </SafeAreaView>
    </DesignSystemProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[6],
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[4],
    ...shadows.sm,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[3],
    ...shadows.md,
  },
  headerTitle: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    marginBottom: spacing[1],
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    lineHeight: typography.lineHeights.lg,
  },
  tabContainer: {
    paddingHorizontal: spacing[4],
    marginBottom: spacing[2],
  },
  tabBar: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  tabButton: {
    flex: 1,
    padding: spacing[4],
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
    ...shadows.sm,
  },
  tabButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semiBold,
    marginTop: spacing[2],
    textAlign: 'center',
  },
  tabButtonDescription: {
    fontSize: typography.sizes.xs,
    marginTop: spacing[1],
    textAlign: 'center',
    lineHeight: typography.lineHeights.sm,
  },
  contentContainer: {
    flex: 1,
  },
});

export default DesignSystemScreen;