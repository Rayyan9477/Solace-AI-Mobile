import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const LightModeDemo = () => {
  const { theme } = useTheme();

  const MoodCard = ({ mood, color, emoji, description }) => (
    <TouchableOpacity 
      style={[
        styles.moodCard,
        { 
          backgroundColor: color,
          borderColor: theme.colors.border.muted,
          minWidth: 44, 
          minHeight: 44,
        }
      ]}
      activeOpacity={0.8}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${mood} mood: ${emoji}`}
      accessibilityHint="Double tap to select this mood"
    >
      <Text style={styles.moodEmoji}>{emoji}</Text>
      <Text style={[styles.moodTitle, { color: theme.colors.text.primary }]}>
        {mood}
      </Text>
      <Text style={[styles.moodDescription, { color: theme.colors.text.secondary }]}>
        {description}
      </Text>
    </TouchableOpacity>
  );

  const TherapeuticSection = ({ title, subtitle, children }) => (
    <View style={[styles.section, { backgroundColor: theme.colors.background.card }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
        {title}
      </Text>
      <Text style={[styles.sectionSubtitle, { color: theme.colors.text.secondary }]}>
        {subtitle}
      </Text>
      {children}
    </View>
  );

  const ActionButton = ({ title, type = 'primary', onPress }) => {
    const getButtonStyle = () => {
      switch (type) {
        case 'secondary':
          return { backgroundColor: theme.colors.secondary[500] };
        case 'therapeutic':
          return { backgroundColor: theme.colors.therapeutic.calming[500] };
        case 'outline':
          return { 
            backgroundColor: 'transparent', 
            borderWidth: 1, 
            borderColor: theme.colors.border.primary 
          };
        default:
          return { backgroundColor: theme.colors.primary[500] };
      }
    };

    const getTextColor = () => {
      return type === 'outline' ? theme.colors.text.primary : theme.colors.text.inverse;
    };

    return (
      <TouchableOpacity 
        style={[
          styles.actionButton, 
          getButtonStyle(),
          { minWidth: 44, minHeight: 44 }
        ]}
        onPress={onPress}
        activeOpacity={0.8}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityHint="Double tap to activate"
      >
        <Text style={[styles.actionButtonText, { color: getTextColor() }]}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
            Freud UI Kit Light Mode
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.text.secondary }]}>
            Mental Health App Design System
          </Text>
        </View>

        {/* Daily Check-in Card */}
        <View style={[styles.checkInCard, { backgroundColor: theme.colors.background.card }]}>
          <Text style={[styles.checkInTitle, { color: theme.colors.text.primary }]}>
            Daily Check-in
          </Text>
          <Text style={[styles.checkInSubtitle, { color: theme.colors.text.secondary }]}>
            How are you feeling today?
          </Text>
          
          <View style={styles.moodGrid}>
            <MoodCard 
              mood="Happy" 
              color={theme.colors.mood.happy} 
              emoji="😊" 
              description="Feeling positive"
            />
            <MoodCard 
              mood="Calm" 
              color={theme.colors.mood.calm} 
              emoji="😌" 
              description="Peaceful state"
            />
            <MoodCard 
              mood="Anxious" 
              color={theme.colors.mood.anxious} 
              emoji="😰" 
              description="Feeling worried"
            />
            <MoodCard 
              mood="Content" 
              color={theme.colors.mood.content} 
              emoji="😊" 
              description="Satisfied"
            />
          </View>
        </View>

        {/* Therapeutic Actions */}
        <TherapeuticSection 
          title="Therapeutic Tools"
          subtitle="Explore mindfulness and wellness activities"
        >
          <View style={styles.therapeuticGrid}>
            <View style={[
              styles.therapeuticItem,
              { backgroundColor: theme.colors.therapeutic.calming[50] }
            ]}>
              <Text style={styles.therapeuticEmoji}>🧘‍♀️</Text>
              <Text style={[styles.therapeuticTitle, { color: theme.colors.text.primary }]}>
                Meditation
              </Text>
              <Text style={[styles.therapeuticDescription, { color: theme.colors.text.secondary }]}>
                Guided sessions for inner peace
              </Text>
            </View>
            
            <View style={[
              styles.therapeuticItem,
              { backgroundColor: theme.colors.therapeutic.energizing[50] }
            ]}>
              <Text style={styles.therapeuticEmoji}>💪</Text>
              <Text style={[styles.therapeuticTitle, { color: theme.colors.text.primary }]}>
                Exercise
              </Text>
              <Text style={[styles.therapeuticDescription, { color: theme.colors.text.secondary }]}>
                Physical wellness activities
              </Text>
            </View>
            
            <View style={[
              styles.therapeuticItem,
              { backgroundColor: theme.colors.therapeutic.nurturing[50] }
            ]}>
              <Text style={styles.therapeuticEmoji}>📝</Text>
              <Text style={[styles.therapeuticTitle, { color: theme.colors.text.primary }]}>
                Journaling
              </Text>
              <Text style={[styles.therapeuticDescription, { color: theme.colors.text.secondary }]}>
                Express your thoughts
              </Text>
            </View>
            
            <View style={[
              styles.therapeuticItem,
              { backgroundColor: theme.colors.therapeutic.peaceful[50] }
            ]}>
              <Text style={styles.therapeuticEmoji}>🌱</Text>
              <Text style={[styles.therapeuticTitle, { color: theme.colors.text.primary }]}>
                Growth
              </Text>
              <Text style={[styles.therapeuticDescription, { color: theme.colors.text.secondary }]}>
                Personal development
              </Text>
            </View>
          </View>
        </TherapeuticSection>

        {/* Progress Summary */}
        <View style={[styles.progressCard, { backgroundColor: theme.colors.background.card }]}>
          <Text style={[styles.progressTitle, { color: theme.colors.text.primary }]}>
            Weekly Progress
          </Text>
          <View style={styles.progressStats}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.therapeutic.calming[500] }]}>
                7
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
                Meditations
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.therapeutic.energizing[500] }]}>
                5
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
                Workouts
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.therapeutic.nurturing[500] }]}>
                3
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
                Journal Entries
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <ActionButton title="Start Session" type="primary" />
          <ActionButton title="View Progress" type="secondary" />
          <ActionButton title="Get Support" type="therapeutic" />
          <ActionButton title="Learn More" type="outline" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  checkInCard: {
    padding: 20,
    borderRadius: 22,
    marginBottom: 24,
    shadowColor: theme.colors.shadows?.primary || theme.colors.black || theme.colors.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  checkInTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  checkInSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  moodCard: {
    width: '47%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  moodTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  moodDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    padding: 20,
    borderRadius: 22,
    marginBottom: 24,
    shadowColor: theme.colors.shadows?.primary || theme.colors.black || theme.colors.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  therapeuticGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  therapeuticItem: {
    width: '47%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  therapeuticEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  therapeuticTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  therapeuticDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
  progressCard: {
    padding: 20,
    borderRadius: 22,
    marginBottom: 24,
    shadowColor: theme.colors.shadows?.primary || theme.colors.black || theme.colors.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  actionSection: {
    gap: 12,
  },
  actionButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: theme.colors.shadows?.primary || theme.colors.black || theme.colors.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LightModeDemo;
