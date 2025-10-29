/**
 * Assessment Results Screen
 * Shows mental health score and analysis
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@theme/ThemeProvider';
import { MentalHealthIcon } from '@components/icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export const AssessmentResultsScreen = ({ route }: any) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const answers = route?.params?.answers || {};

  // Calculate score based on answers (simplified)
  const calculateScore = () => {
    // This would be a complex algorithm in production
    return Math.floor(Math.random() * 30) + 70; // 70-100 range
  };

  const score = calculateScore();

  const getScoreCategory = (score: number) => {
    if (score >= 85) return { label: 'Excellent', color: '#8FBC8F', description: 'You are doing great!' };
    if (score >= 70) return { label: 'Good', color: '#B8976B', description: 'Mentally stable with room for growth' };
    if (score >= 50) return { label: 'Fair', color: '#E8A872', description: 'Some areas need attention' };
    return { label: 'Needs Attention', color: '#D97F52', description: 'Consider seeking support' };
  };

  const category = getScoreCategory(score);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.isDark ? '#2D1B0E' : '#1A1108',
    },
    header: {
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 20,
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    scoreContainer: {
      alignItems: 'center',
      marginTop: 40,
      marginBottom: 40,
    },
    scoreCircle: {
      width: 200,
      height: 200,
      borderRadius: 100,
      borderWidth: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
    },
    scoreValue: {
      fontSize: 72,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    scoreLabel: {
      fontSize: 18,
      fontWeight: '600',
      color: '#FFFFFF',
      marginBottom: 8,
    },
    scoreDescription: {
      fontSize: 14,
      color: '#B8A99A',
      textAlign: 'center',
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#FFFFFF',
      marginBottom: 16,
    },
    card: {
      backgroundColor: 'rgba(45, 27, 14, 0.5)',
      borderRadius: 20,
      padding: 20,
      borderWidth: 1.5,
      borderColor: '#6B5444',
      marginBottom: 12,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    cardIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(143, 188, 143, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    cardTitle: {
      flex: 1,
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    cardValue: {
      fontSize: 16,
      fontWeight: '700',
      color: '#8FBC8F',
    },
    cardDescription: {
      fontSize: 14,
      color: '#B8A99A',
      lineHeight: 20,
    },
    progressBar: {
      height: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 4,
      overflow: 'hidden',
      marginTop: 12,
    },
    progressFill: {
      height: '100%',
      borderRadius: 4,
    },
    recommendation: {
      backgroundColor: 'rgba(143, 188, 143, 0.1)',
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: '#8FBC8F',
      marginBottom: 12,
    },
    recommendationText: {
      fontSize: 14,
      color: '#E5DDD5',
      lineHeight: 20,
    },
    bottomContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: 24,
      paddingBottom: 32,
      backgroundColor: theme.isDark ? '#2D1B0E' : '#1A1108',
    },
    button: {
      backgroundColor: '#A67C52',
      borderRadius: 24,
      paddingVertical: 16,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 12,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      marginRight: 8,
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: '#6B5444',
    },
    secondaryButtonText: {
      color: '#E5DDD5',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Mental Health Score</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.scoreContainer}>
          <View style={[styles.scoreCircle, { borderColor: category.color }]}>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>
          <Text style={[styles.scoreLabel, { color: category.color }]}>
            {category.label}
          </Text>
          <Text style={styles.scoreDescription}>{category.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Score Breakdown</Text>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <MentalHealthIcon name="Brain" size={20} color="#8FBC8F" />
              </View>
              <Text style={styles.cardTitle}>Mental Clarity</Text>
              <Text style={styles.cardValue}>85%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '85%', backgroundColor: '#8FBC8F' }]} />
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <MentalHealthIcon name="Heart" size={20} color="#B8976B" />
              </View>
              <Text style={styles.cardTitle}>Emotional Balance</Text>
              <Text style={styles.cardValue}>72%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '72%', backgroundColor: '#B8976B' }]} />
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <MentalHealthIcon name="Activity" size={20} color="#E8A872' />
              </View>
              <Text style={styles.cardTitle}>Stress Management</Text>
              <Text style={styles.cardValue}>68%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '68%', backgroundColor: '#E8A872' }]} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommendations</Text>

          <View style={styles.recommendation}>
            <Text style={styles.recommendationText}>
              • Practice daily mindfulness meditation for 10-15 minutes
            </Text>
          </View>

          <View style={styles.recommendation}>
            <Text style={styles.recommendationText}>
              • Maintain a consistent sleep schedule of 7-8 hours
            </Text>
          </View>

          <View style={styles.recommendation}>
            <Text style={styles.recommendationText}>
              • Engage in regular physical activity 3-4 times per week
            </Text>
          </View>

          <View style={styles.recommendation}>
            <Text style={styles.recommendationText}>
              • Consider joining support groups or therapy sessions
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Dashboard' as never)}
        >
          <Text style={styles.buttonText}>Continue to Dashboard</Text>
          <Text style={{ color: '#FFFFFF', fontSize: 18 }}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Retake Assessment
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AssessmentResultsScreen;
