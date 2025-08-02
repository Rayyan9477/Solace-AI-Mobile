import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { MentalHealthIcon, NavigationIcon } from '../../components/icons';

const { width } = Dimensions.get('window');

const ComprehensiveAssessmentScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const assessmentSections = [
    {
      id: 'demographics',
      title: 'Personal Information',
      icon: 'Brain',
      description: 'Basic information to personalize your experience',
      questions: [
        {
          id: 'age',
          type: 'multiple',
          question: 'What is your age range?',
          options: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
        },
        {
          id: 'gender',
          type: 'multiple',
          question: 'How do you identify?',
          options: ['Woman', 'Man', 'Non-binary', 'Prefer not to say', 'Other'],
        },
        {
          id: 'support_system',
          type: 'multiple',
          question: 'How would you describe your support system?',
          options: ['Very strong', 'Strong', 'Moderate', 'Limited', 'Very limited'],
        },
      ],
    },
    {
      id: 'mood_baseline',
      title: 'Mood & Emotional Wellbeing',
      icon: 'Heart',
      description: 'Understanding your current emotional state',
      questions: [
        {
          id: 'current_mood',
          type: 'scale',
          question: 'How would you rate your overall mood today?',
          scale: { min: 1, max: 10, labels: ['Very low', 'Excellent'] },
        },
        {
          id: 'mood_stability',
          type: 'multiple',
          question: 'Over the past month, how stable has your mood been?',
          options: ['Very stable', 'Mostly stable', 'Somewhat unstable', 'Very unstable'],
        },
        {
          id: 'emotional_regulation',
          type: 'scale',
          question: 'How well do you feel you manage difficult emotions?',
          scale: { min: 1, max: 10, labels: ['Very poorly', 'Very well'] },
        },
      ],
    },
    {
      id: 'anxiety_assessment',
      title: 'Anxiety & Stress',
      icon: 'Mindfulness',
      description: 'Evaluating anxiety levels and stress factors',
      questions: [
        {
          id: 'anxiety_frequency',
          type: 'multiple',
          question: 'How often do you experience anxiety?',
          options: ['Rarely', 'Sometimes', 'Often', 'Most days', 'Daily'],
        },
        {
          id: 'anxiety_impact',
          type: 'scale',
          question: 'When you do feel anxious, how much does it impact your daily life?',
          scale: { min: 1, max: 10, labels: ['Not at all', 'Significantly'] },
        },
        {
          id: 'stress_sources',
          type: 'multiple',
          question: 'What are your main sources of stress? (Select all that apply)',
          options: ['Work/School', 'Relationships', 'Finances', 'Health', 'Family', 'Future uncertainty'],
          multiple: true,
        },
      ],
    },
    {
      id: 'depression_screening',
      title: 'Depression Screening',
      icon: 'Therapy',
      description: 'Assessing symptoms related to depression',
      questions: [
        {
          id: 'energy_levels',
          type: 'scale',
          question: 'How would you rate your energy levels over the past two weeks?',
          scale: { min: 1, max: 10, labels: ['Extremely low', 'Very high'] },
        },
        {
          id: 'interest_activities',
          type: 'multiple',
          question: 'How has your interest in activities you usually enjoy been?',
          options: ['Much higher than usual', 'Higher', 'About the same', 'Lower', 'Much lower'],
        },
        {
          id: 'sleep_patterns',
          type: 'multiple',
          question: 'How have your sleep patterns been lately?',
          options: ['Sleeping too much', 'Normal sleep', 'Trouble falling asleep', 'Waking up early', 'Very restless sleep'],
        },
      ],
    },
    {
      id: 'coping_strategies',
      title: 'Coping & Resources',
      icon: 'Journal',
      description: 'Understanding your current coping mechanisms',
      questions: [
        {
          id: 'coping_methods',
          type: 'multiple',
          question: 'What methods do you currently use to cope with stress? (Select all that apply)',
          options: ['Exercise', 'Meditation', 'Talking to friends/family', 'Therapy', 'Journaling', 'Creative activities', 'Other'],
          multiple: true,
        },
        {
          id: 'professional_help',
          type: 'multiple',
          question: 'Have you sought professional mental health support before?',
          options: ['Never', 'Currently in therapy', 'Previously in therapy', 'Considering it', 'Not interested'],
        },
        {
          id: 'support_interest',
          type: 'multiple',
          question: 'What type of support are you most interested in?',
          options: ['AI-guided conversations', 'Peer support groups', 'Professional therapy', 'Self-help resources', 'Crisis support'],
          multiple: true,
        },
      ],
    },
  ];

  const currentSection = assessmentSections[currentStep];
  const progress = ((currentStep + 1) / assessmentSections.length) * 100;

  useEffect(() => {
    // Animate in when component mounts or step changes
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStep]);

  const handleResponse = (questionId, answer) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (currentStep < assessmentSections.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    // Process assessment results
    const score = calculateAssessmentScore(responses);
    const recommendations = generateRecommendations(responses);
    
    Alert.alert(
      'Assessment Complete!',
      'Thank you for completing your mental health assessment. Your results will help us provide personalized support.',
      [
        {
          text: 'View Results',
          onPress: () => navigation.navigate('AssessmentResults', { 
            responses, 
            score, 
            recommendations 
          }),
        },
      ]
    );
  };

  const calculateAssessmentScore = (responses) => {
    // Simplified scoring logic
    let totalScore = 0;
    let maxScore = 0;
    
    Object.values(responses).forEach(response => {
      if (typeof response === 'number') {
        totalScore += response;
        maxScore += 10;
      } else if (Array.isArray(response)) {
        totalScore += response.length * 2;
        maxScore += 10;
      }
    });
    
    return Math.round((totalScore / Math.max(maxScore, 1)) * 100);
  };

  const generateRecommendations = (responses) => {
    const recommendations = [];
    
    if (responses.anxiety_frequency === 'Daily' || responses.anxiety_frequency === 'Most days') {
      recommendations.push('Consider daily mindfulness or breathing exercises');
    }
    
    if (responses.energy_levels && responses.energy_levels <= 3) {
      recommendations.push('Focus on sleep hygiene and gentle movement');
    }
    
    if (responses.professional_help === 'Considering it') {
      recommendations.push('Explore our therapy connection resources');
    }
    
    return recommendations;
  };

  const isStepComplete = () => {
    if (!currentSection) return false;
    
    return currentSection.questions.every(question => {
      const response = responses[question.id];
      return response !== undefined && response !== null && response !== '';
    });
  };

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
            Mental Health Assessment
          </Text>
          
          <View style={styles.placeholder} />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: theme.colors.gray[200] }]}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                  backgroundColor: theme.colors.therapeutic.calming[500],
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: theme.colors.text.secondary }]}>
            {currentStep + 1} of {assessmentSections.length}
          </Text>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View
            style={[
              styles.sectionContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Section Header */}
            <View style={styles.sectionHeader}>
              <View style={[styles.iconContainer, { backgroundColor: theme.colors.therapeutic.calming[500] }]}>
                <MentalHealthIcon
                  name={currentSection?.icon || 'Brain'}
                  size={28}
                  color={theme.colors.text.inverse}
                  variant="filled"
                />
              </View>
              <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
                {currentSection?.title}
              </Text>
              <Text style={[styles.sectionDescription, { color: theme.colors.text.secondary }]}>
                {currentSection?.description}
              </Text>
            </View>

            {/* Questions */}
            {currentSection?.questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                response={responses[question.id]}
                onResponse={(answer) => handleResponse(question.id, answer)}
                theme={theme}
                delay={index * 100}
              />
            ))}
          </Animated.View>
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          {currentStep > 0 && (
            <TouchableOpacity
              style={[styles.navButton, styles.previousButton, { borderColor: theme.colors.gray[300] }]}
              onPress={handlePrevious}
            >
              <Text style={[styles.navButtonText, { color: theme.colors.text.primary }]}>
                Previous
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[
              styles.navButton,
              styles.nextButton,
              {
                backgroundColor: isStepComplete()
                  ? theme.colors.therapeutic.calming[500]
                  : theme.colors.gray[300],
              },
            ]}
            onPress={handleNext}
            disabled={!isStepComplete()}
          >
            <Text style={[styles.navButtonText, { color: theme.colors.text.inverse }]}>
              {currentStep === assessmentSections.length - 1 ? 'Complete' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const QuestionCard = ({ question, response, onResponse, theme, delay }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      delay,
      useNativeDriver: true,
    }).start();
  }, [delay]);

  const renderQuestion = () => {
    switch (question.type) {
      case 'multiple':
        return (
          <View style={styles.optionsContainer}>
            {question.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: (question.multiple 
                      ? response?.includes(option)
                      : response === option)
                      ? theme.colors.therapeutic.calming[100]
                      : theme.colors.background.secondary,
                    borderColor: (question.multiple 
                      ? response?.includes(option)
                      : response === option)
                      ? theme.colors.therapeutic.calming[500]
                      : theme.colors.gray[300],
                  },
                ]}
                onPress={() => {
                  if (question.multiple) {
                    const currentResponses = response || [];
                    const newResponses = currentResponses.includes(option)
                      ? currentResponses.filter(r => r !== option)
                      : [...currentResponses, option];
                    onResponse(newResponses);
                  } else {
                    onResponse(option);
                  }
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      color: (question.multiple 
                        ? response?.includes(option)
                        : response === option)
                        ? theme.colors.therapeutic.calming[700]
                        : theme.colors.text.primary,
                    },
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'scale':
        return (
          <View style={styles.scaleContainer}>
            <View style={styles.scaleLabels}>
              <Text style={[styles.scaleLabel, { color: theme.colors.text.secondary }]}>
                {question.scale.labels[0]}
              </Text>
              <Text style={[styles.scaleLabel, { color: theme.colors.text.secondary }]}>
                {question.scale.labels[1]}
              </Text>
            </View>
            <View style={styles.scaleButtons}>
              {Array.from({ length: question.scale.max }, (_, i) => i + 1).map((value) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.scaleButton,
                    {
                      backgroundColor: response === value
                        ? theme.colors.therapeutic.calming[500]
                        : theme.colors.background.secondary,
                      borderColor: response === value
                        ? theme.colors.therapeutic.calming[500]
                        : theme.colors.gray[300],
                    },
                  ]}
                  onPress={() => onResponse(value)}
                >
                  <Text
                    style={[
                      styles.scaleButtonText,
                      {
                        color: response === value
                          ? theme.colors.text.inverse
                          : theme.colors.text.primary,
                      },
                    ]}
                  >
                    {value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Animated.View
      style={[
        styles.questionCard,
        {
          backgroundColor: theme.colors.background.primary,
          opacity: fadeAnim,
        },
      ]}
    >
      <Text style={[styles.questionText, { color: theme.colors.text.primary }]}>
        {question.question}
      </Text>
      {renderQuestion()}
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
  placeholder: {
    width: 44,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  questionCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
    lineHeight: 22,
  },
  optionsContainer: {
    gap: 8,
  },
  optionButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  scaleContainer: {
    alignItems: 'center',
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  scaleLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  scaleButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  scaleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  scaleButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  navigationContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  navButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  previousButton: {
    borderWidth: 1,
  },
  nextButton: {
    // backgroundColor set dynamically
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ComprehensiveAssessmentScreen;