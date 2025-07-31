import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import {
  Icon,
  NavigationIcon,
  MentalHealthIcon,
  ActionIcon,
  StatusIcon,
  IconVariants,
  IconSizes,
  IconPresets,
} from '../components/icons';
import { colors, typography, spacing, borderRadius } from '../styles/theme';

const IconTestScreen = () => {
  const { theme } = useTheme();

  const IconSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
        {title}
      </Text>
      <View style={styles.iconGrid}>
        {children}
      </View>
    </View>
  );

  const IconItem = ({ label, icon }) => (
    <View style={styles.iconItem}>
      {icon}
      <Text style={[styles.iconLabel, { color: theme.colors.text.secondary }]}>
        {label}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Icon System Test
        </Text>

        <IconSection title="Navigation Icons">
          <IconItem
            label="Home"
            icon={<NavigationIcon name="Home" size="lg" />}
          />
          <IconItem
            label="Chat"
            icon={<NavigationIcon name="Chat" size="lg" />}
          />
          <IconItem
            label="Mood"
            icon={<NavigationIcon name="Mood" size="lg" />}
          />
          <IconItem
            label="Assessment"
            icon={<NavigationIcon name="Assessment" size="lg" />}
          />
          <IconItem
            label="Profile"
            icon={<NavigationIcon name="Profile" size="lg" />}
          />
          <IconItem
            label="Welcome"
            icon={<NavigationIcon name="Welcome" size="lg" />}
          />
        </IconSection>

        <IconSection title="Mental Health Icons">
          <IconItem
            label="Brain"
            icon={<MentalHealthIcon name="Brain" size="lg" />}
          />
          <IconItem
            label="Heart"
            icon={<MentalHealthIcon name="Heart" size="lg" />}
          />
          <IconItem
            label="Mindfulness"
            icon={<MentalHealthIcon name="Mindfulness" size="lg" />}
          />
          <IconItem
            label="Therapy"
            icon={<MentalHealthIcon name="Therapy" size="lg" />}
          />
          <IconItem
            label="Meditation"
            icon={<MentalHealthIcon name="Meditation" size="lg" />}
          />
          <IconItem
            label="Journal"
            icon={<MentalHealthIcon name="Journal" size="lg" />}
          />
          <IconItem
            label="Insights"
            icon={<MentalHealthIcon name="Insights" size="lg" />}
          />
        </IconSection>

        <IconSection title="Action Icons">
          <IconItem
            label="Add"
            icon={<ActionIcon name="Add" size="lg" />}
          />
          <IconItem
            label="Next"
            icon={<ActionIcon name="Next" size="lg" />}
          />
          <IconItem
            label="Expand"
            icon={<ActionIcon name="Expand" size="lg" />}
          />
          <IconItem
            label="Close"
            icon={<ActionIcon name="Close" size="lg" />}
          />
          <IconItem
            label="Settings"
            icon={<ActionIcon name="Settings" size="lg" />}
          />
        </IconSection>

        <IconSection title="Status Icons">
          <IconItem
            label="Success"
            icon={<StatusIcon name="Success" size="lg" colorScheme="success" />}
          />
          <IconItem
            label="Warning"
            icon={<StatusIcon name="Warning" size="lg" colorScheme="warning" />}
          />
          <IconItem
            label="Info"
            icon={<StatusIcon name="Info" size="lg" colorScheme="primary" />}
          />
        </IconSection>

        <IconSection title="Icon Variants">
          <IconItem
            label="Outline"
            icon={<Icon name="heart" size="lg" variant={IconVariants.OUTLINE} />}
          />
          <IconItem
            label="Filled"
            icon={<Icon name="heart" size="lg" variant={IconVariants.FILLED} />}
          />
          <IconItem
            label="Duotone"
            icon={<Icon name="heart" size="lg" variant={IconVariants.DUOTONE} />}
          />
        </IconSection>

        <IconSection title="Icon Sizes">
          <IconItem
            label="XS (16px)"
            icon={<Icon name="brain" size="xs" />}
          />
          <IconItem
            label="SM (20px)"
            icon={<Icon name="brain" size="sm" />}
          />
          <IconItem
            label="MD (24px)"
            icon={<Icon name="brain" size="md" />}
          />
          <IconItem
            label="LG (32px)"
            icon={<Icon name="brain" size="lg" />}
          />
          <IconItem
            label="XL (40px)"
            icon={<Icon name="brain" size="xl" />}
          />
          <IconItem
            label="2XL (48px)"
            icon={<Icon name="brain" size="2xl" />}
          />
        </IconSection>

        <IconSection title="Therapeutic Color Schemes">
          <IconItem
            label="Calming"
            icon={<MentalHealthIcon name="Mindfulness" size="lg" colorScheme="calming" />}
          />
          <IconItem
            label="Nurturing"
            icon={<MentalHealthIcon name="Heart" size="lg" colorScheme="nurturing" />}
          />
          <IconItem
            label="Peaceful"
            icon={<MentalHealthIcon name="Meditation" size="lg" colorScheme="peaceful" />}
          />
          <IconItem
            label="Grounding"
            icon={<MentalHealthIcon name="Brain" size="lg" colorScheme="grounding" />}
          />
          <IconItem
            label="Energizing"
            icon={<MentalHealthIcon name="Insights" size="lg" colorScheme="energizing" />}
          />
        </IconSection>
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
  content: {
    padding: spacing[4],
    paddingBottom: spacing[8],
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    textAlign: 'center',
    marginBottom: spacing[6],
  },
  section: {
    marginBottom: spacing[6],
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semiBold,
    marginBottom: spacing[4],
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[4],
  },
  iconItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    paddingVertical: spacing[3],
  },
  iconLabel: {
    fontSize: typography.sizes.xs,
    textAlign: 'center',
    marginTop: spacing[2],
    fontWeight: typography.weights.medium,
  },
});

export default IconTestScreen;