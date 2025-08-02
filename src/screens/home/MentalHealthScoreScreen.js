import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { MentalHealthIcon, NavigationIcon } from '../../components/icons';

const { width } = Dimensions.get('window');

const MentalHealthScoreScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const scoreAnim = useRef(new Animated.Value(0)).current;

  // Mock data - in real app this would come from API/state
  const mentalHealthData = {
    currentScore: 72,
    trend: '+5',
    week: {
      score: 72,
      mood: { average: 6.2, trend: '+0.8' },
      anxiety: { average: 4.1, trend: '-0.5' },
      sleep: { average: 7.1, trend: '+0.3' },
      energy: { average: 5.8, trend: '+0.6' },
      social: { average: 6.5, trend: '+1.2' },
    },
    month: {
      score: 68,
      mood: { average: 5.9, trend: '+0.3' },
      anxiety: { average: 4.8, trend: '-0.2' },
      sleep: { average: 6.8, trend: '+0.1' },
      energy: { average: 5.5, trend: '+0.4' },
      social: { average: 6.0, trend: '+0.8' },
    },
    year: {
      score: 65,
      mood: { average: 5.5, trend: '+1.2' },
      anxiety: { average: 5.2, trend: '-0.8' },
      sleep: { average: 6.5, trend: '+0.5' },
      energy: { average: 5.2, trend: '+0.9' },
      social: { average: 5.5, trend: '+1.5' },
    },
  };

  const periods = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'year', label: 'This Year' },
  ];

  const currentData = mentalHealthData[selectedPeriod];

  const categories = [
    {
      id: 'mood',
      name: 'Mood',
      icon: 'Heart',
      color: theme.colors.therapeutic.nurturing[500],
      data: currentData.mood,
    },
    {
      id: 'anxiety',
      name: 'Anxiety',
      icon: 'Mindfulness',
      color: theme.colors.therapeutic.calming[500],
      data: currentData.anxiety,
    },
    {
      id: 'sleep',
      name: 'Sleep',
      icon: 'Brain',
      color: theme.colors.therapeutic.peaceful[500],
      data: currentData.sleep,
    },
    {
      id: 'energy',
      name: 'Energy',
      icon: 'Therapy',
      color: theme.colors.therapeutic.energizing[500],
      data: currentData.energy,
    },
    {
      id: 'social',
      name: 'Social',
      icon: 'Journal',
      color: theme.colors.therapeutic.grounding[500],
      data: currentData.social,
    },
  ];

  const insights = [
    {
      type: 'positive',
      title: 'Great Progress!',
      description: 'Your mood has improved significantly this week. Keep up the good work!',
      icon: 'Heart',
      color: theme.colors.therapeutic.nurturing[500],
    },
    {
      type: 'suggestion',
      title: 'Sleep Optimization',
      description: 'Consider establishing a consistent bedtime routine to improve sleep quality.',
      icon: 'Brain',
      color: theme.colors.therapeutic.peaceful[500],
    },
    {
      type: 'achievement',
      title: 'Milestone Reached',
      description: 'You\'ve completed 7 days of mood tracking. Consistency is key!',
      icon: 'Therapy',
      color: theme.colors.therapeutic.calming[500],
    },
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate score
    Animated.timing(scoreAnim, {
      toValue: currentData.score,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  }, [selectedPeriod]);

  const getScoreColor = (score) => {
    if (score >= 80) return theme.colors.therapeutic.nurturing[500];
    if (score >= 60) return theme.colors.therapeutic.calming[500];
    if (score >= 40) return theme.colors.warning[400];
    return theme.colors.error[400];
  };

  const getScoreDescription = (score) => {
    if (score >= 80) return { level: 'Excellent', description: 'You\'re doing great!' };
    if (score >= 60) return { level: 'Good', description: 'You\'re on the right track.' };
    if (score >= 40) return { level: 'Fair', description: 'There\'s room for improvement.' };
    return { level: 'Needs Attention', description: 'Consider seeking additional support.' };
  };

  const scoreDescription = getScoreDescription(currentData.score);
  const scoreColor = getScoreColor(currentData.score);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[
          theme.colors.therapeutic.calming[50],
          theme.colors.therapeutic.peaceful[50],
          theme.colors.therapeutic.nurturing[50],
        ]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <NavigationIcon
              name="Home"
              size={24}
              color={theme.colors.text.primary}
              variant="outline"
            />
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
            Mental Health Score
          </Text>
          
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => {/* Show score explanation */}}
          >
            <NavigationIcon
              name="Home"
              size={24}
              color={theme.colors.text.primary}
              variant="outline"
            />
          </TouchableOpacity>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.id}
              style={[
                styles.periodButton,
                {
                  backgroundColor: selectedPeriod === period.id
                    ? theme.colors.therapeutic.calming[500]
                    : theme.colors.background.secondary,
                },
              ]}
              onPress={() => setSelectedPeriod(period.id)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  {
                    color: selectedPeriod === period.id
                      ? theme.colors.text.inverse
                      : theme.colors.text.primary,
                  },
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View
            style={[
              styles.animatedContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {/* Score Overview */}
            <View style={[styles.scoreCard, { backgroundColor: theme.colors.background.primary }]}>
              <Text style={[styles.scoreTitle, { color: theme.colors.text.primary }]}>
                Overall Mental Health Score
              </Text>
              
              <View style={styles.scoreContainer}>
                <View style={styles.scoreCircle}>
                  <Animated.View
                    style={[
                      styles.scoreProgress,
                      {
                        backgroundColor: scoreColor,
                        transform: [
                          {
                            rotate: scoreAnim.interpolate({
                              inputRange: [0, 100],
                              outputRange: ['0deg', '360deg'],
                            }),
                          },
                        ],
                      },
                    ]}
                  />
                  <View style={[styles.scoreInner, { backgroundColor: theme.colors.background.primary }]}>
                    <Animated.Text
                      style={[
                        styles.scoreNumber,
                        { color: scoreColor },
                      ]}
                    >
                      {scoreAnim.interpolate({
                        inputRange: [0, 100],
                        outputRange: [0, currentData.score],
                        extrapolate: 'clamp',
                      }).interpolate((value) => Math.round(value))}
                    </Animated.Text>
                    <Text style={[styles.scoreOutOf, { color: theme.colors.text.secondary }]}>
                      /100
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.scoreInfo}>
                <Text style={[styles.scoreLevel, { color: scoreColor }]}>
                  {scoreDescription.level}
                </Text>
                <Text style={[styles.scoreDescription, { color: theme.colors.text.secondary }]}>
                  {scoreDescription.description}
                </Text>
                <Text style={[styles.scoreTrend, { color: theme.colors.therapeutic.nurturing[500] }]}>
                  {mentalHealthData.trend} from last period
                </Text>
              </View>
            </View>

            {/* Categories Breakdown */}
            <View style={[styles.section, { backgroundColor: theme.colors.background.primary }]}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
                Category Breakdown
              </Text>
              
              <View style={styles.categoriesGrid}>
                {categories.map((category, index) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    theme={theme}
                    delay={index * 100}
                  />
                ))}
              </View>
            </View>

            {/* Insights & Recommendations */}
            <View style={[styles.section, { backgroundColor: theme.colors.background.primary }]}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
                Insights & Recommendations
              </Text>
              
              {insights.map((insight, index) => (
                <InsightCard
                  key={index}
                  insight={insight}
                  theme={theme}
                  delay={index * 150}
                />
              ))}
            </View>

            {/* Action Items */}
            <View style={[styles.section, { backgroundColor: theme.colors.background.primary }]}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
                Recommended Actions
              </Text>
              
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.colors.therapeutic.calming[500] }]}
                onPress={() => navigation.navigate('MoodTracker')}
              >
                <MentalHealthIcon
                  name="Heart"
                  size={20}
                  color={theme.colors.text.inverse}
                  variant="filled"
                />
                <Text style={[styles.actionButtonText, { color: theme.colors.text.inverse }]}>
                  Log Today's Mood
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.colors.therapeutic.nurturing[500] }]}
                onPress={() => navigation.navigate('StressManagement')}
              >
                <MentalHealthIcon
                  name="Mindfulness"
                  size={20}
                  color={theme.colors.text.inverse}
                  variant="filled"
                />
                <Text style={[styles.actionButtonText, { color: theme.colors.text.inverse }]}>
                  Practice Stress Relief
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.colors.therapeutic.peaceful[500] }]}
                onPress={() => navigation.navigate('Journal')}
              >
                <MentalHealthIcon
                  name="Journal"
                  size={20}
                  color={theme.colors.text.inverse}
                  variant="filled"
                />
                <Text style={[styles.actionButtonText, { color: theme.colors.text.inverse }]}>
                  Write in Journal
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const CategoryCard = ({ category, theme, delay }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay,
      useNativeDriver: true,
    }).start();
  }, [delay]);

  const trendColor = category.data.trend.startsWith('+')
    ? theme.colors.therapeutic.nurturing[500]
    : theme.colors.error[400];

  return (
    <Animated.View
      style={[
        styles.categoryCard,
        {
          backgroundColor: theme.colors.background.secondary,
          opacity: fadeAnim,
        },
      ]}
    >
      <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
        <MentalHealthIcon
          name={category.icon}
          size={20}
          color={theme.colors.text.inverse}
          variant="filled"
        />
      </View>
      
      <Text style={[styles.categoryName, { color: theme.colors.text.primary }]}>
        {category.name}
      </Text>
      
      <Text style={[styles.categoryScore, { color: category.color }]}>
        {category.data.average}
      </Text>
      
      <Text style={[styles.categoryTrend, { color: trendColor }]}>
        {category.data.trend}
      </Text>
    </Animated.View>
  );
};

const InsightCard = ({ insight, theme, delay }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay,
      useNativeDriver: true,
    }).start();
  }, [delay]);

  return (
    <Animated.View
      style={[
        styles.insightCard,
        {
          backgroundColor: `${insight.color}20`,
          opacity: fadeAnim,
        },
      ]}
    >
      <View style={[styles.insightIcon, { backgroundColor: insight.color }]}>
        <MentalHealthIcon
          name={insight.icon}
          size={20}
          color={theme.colors.text.inverse}
          variant="filled"
        />
      </View>
      
      <View style={styles.insightContent}>
        <Text style={[styles.insightTitle, { color: theme.colors.text.primary }]}>
          {insight.title}
        </Text>
        <Text style={[styles.insightDescription, { color: theme.colors.text.secondary }]}>
          {insight.description}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  infoButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  animatedContainer: {
    paddingBottom: 20,
  },
  scoreCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreProgress: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 60,
    opacity: 0.2,
  },
  scoreInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  scoreOutOf: {
    fontSize: 14,
    marginTop: -4,
  },
  scoreInfo: {
    alignItems: 'center',
  },
  scoreLevel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  scoreDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  scoreTrend: {
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: (width - 64) / 2,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  categoryScore: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  categoryTrend: {
    fontSize: 12,
    fontWeight: '500',
  },
  insightCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MentalHealthScoreScreen;