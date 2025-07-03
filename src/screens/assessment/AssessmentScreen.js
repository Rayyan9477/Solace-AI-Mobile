import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { colors, typography, spacing, borderRadius, shadows } from '../../styles/theme';
import { startAssessment } from '../../store/slices/assessmentSlice';
import AssessmentCard from '../../components/assessment/AssessmentCard';
import AssessmentHistory from '../../components/assessment/AssessmentHistory';

const AssessmentScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  
  const { availableAssessments, assessmentHistory, loading } = useSelector(state => state.assessment);
  
  

  const handleStartAssessment = async (assessmentType) => {
    try {
      await dispatch(startAssessment(assessmentType)).unwrap();
      navigation.navigate('AssessmentQuestions');
    } catch (error) {
      Alert.alert('Error', 'Failed to start assessment. Please try again.');
    }
  };

  const handleViewHistory = () => {
    navigation.navigate('AssessmentHistory');
  };

  const handleLearnMore = (assessmentType) => {
    const assessmentInfo = {
      phq9: {
        title: 'PHQ-9 Depression Assessment',
        description: 'The Patient Health Questionnaire-9 (PHQ-9) is a validated tool for screening and measuring the severity of depression symptoms. It consists of 9 questions based on depression diagnostic criteria.',
        duration: '5-10 minutes',
        frequency: 'Recommended every 2 weeks',
        scoring: 'Scores range from 0-27:\n• 0-4: Minimal depression\n• 5-9: Mild depression\n• 10-14: Moderate depression\n• 15-19: Moderately severe\n• 20-27: Severe depression'
      },
      gad7: {
        title: 'GAD-7 Anxiety Assessment',
        description: 'The Generalized Anxiety Disorder-7 (GAD-7) is a validated screening tool for measuring anxiety symptoms. It helps identify and assess the severity of generalized anxiety disorder.',
        duration: '3-5 minutes',
        frequency: 'Recommended every 2 weeks',
        scoring: 'Scores range from 0-21:\n• 0-4: Minimal anxiety\n• 5-9: Mild anxiety\n• 10-14: Moderate anxiety\n• 15-21: Severe anxiety'
      }
    };

    const info = assessmentInfo[assessmentType];
    if (info) {
      Alert.alert(
        info.title,
        `${info.description}\n\nDuration: ${info.duration}\nFrequency: ${info.frequency}\n\nScoring:\n${info.scoring}`,
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            Mental Health Assessments
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
            Regular assessments help track your mental health progress
          </Text>
        </View>

        <View style={styles.assessmentsContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Available Assessments
          </Text>
          
          {availableAssessments.map((assessment) => (
            <AssessmentCard
              key={assessment.id}
              title={assessment.title}
              description={assessment.description}
              duration={assessment.duration}
              icon={assessment.icon}
              onStart={() => handleStartAssessment(assessment.id)}
              onLearnMore={() => handleLearnMore(assessment.id)}
              loading={loading}
            />
          ))}
        </View>

        {assessmentHistory.length > 0 && (
          <View style={styles.historyContainer}>
            <View style={styles.historyHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
                Recent Results
              </Text>
              <TouchableOpacity onPress={handleViewHistory}>
                <Text style={[styles.viewAllText, { color: theme.colors.primary[500] }]}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>
            
            <AssessmentHistory 
              history={assessmentHistory.slice(0, 3)} 
              onViewDetails={(result) => {
                navigation.navigate('AssessmentResult', { result });
              }}
            />
          </View>
        )}

        <View style={styles.infoContainer}>
          <View style={[styles.infoCard, { backgroundColor: theme.colors.primary[50] }]}>
            <Text style={styles.infoIcon}>💡</Text>
            <Text style={[styles.infoTitle, { color: theme.colors.primary[700] }]}>
              Assessment Tips
            </Text>
            <Text style={[styles.infoText, { color: theme.colors.primary[600] }]}>
              • Answer honestly for accurate results{'\n'}
              • Take assessments in a quiet space{'\n'}
              • Consider your feelings over the past 2 weeks{'\n'}
              • Results are not a diagnosis - consult a professional for clinical assessment
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: theme.spacing[4],
  },
  header: {
    paddingVertical: theme.spacing[6],
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.sizes['3xl'],
    fontWeight: '700',
    lineHeight: theme.typography.lineHeights['3xl'],
    marginBottom: theme.spacing[2],
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: '400',
    lineHeight: theme.typography.lineHeights.base,
    textAlign: 'center',
    paddingHorizontal: theme.spacing[4],
  },
  assessmentsContainer: {
    marginBottom: theme.spacing[6],
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: '600',
    lineHeight: theme.typography.lineHeights.xl,
    marginBottom: theme.spacing[4],
  },
  historyContainer: {
    marginBottom: theme.spacing[6],
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  viewAllText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '500',
  },
  infoContainer: {
    marginBottom: theme.spacing[8],
  },
  infoCard: {
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.base,
  },
  infoIcon: {
    fontSize: theme.typography.sizes['2xl'],
    textAlign: 'center',
    marginBottom: theme.spacing[2],
  },
  infoTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '600',
    lineHeight: theme.typography.lineHeights.lg,
    marginBottom: theme.spacing[2],
    textAlign: 'center',
  },
  infoText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '400',
    lineHeight: theme.typography.lineHeights.base,
  },
});

export default AssessmentScreen;
