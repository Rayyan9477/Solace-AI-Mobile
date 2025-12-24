/**
 * Assessment Results Screen
 * Shows mental health score and analysis
 */

import { MentalHealthIcon } from "@components/icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
} from "react-native";
import {
  calculateAssessmentScore,
  getCategoryLabel,
  getCategoryDescription,
  validateAssessmentAnswers,
  type AssessmentAnswers
} from "../services/scoringAlgorithm";

const { width } = Dimensions.get("window");

// LOW-NEW-003 FIX: Define proper props type instead of any
interface AssessmentResultsScreenProps {
  route?: {
    params?: {
      answers?: Record<string, unknown>;
      [key: string]: unknown;
    };
  };
}

export const AssessmentResultsScreen: React.FC<AssessmentResultsScreenProps> = ({ route }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  // CRIT-NEW-004 FIX: Validate and sanitize route params before use
  const validationResult = validateAssessmentAnswers(route?.params);
  const answers: AssessmentAnswers = validationResult.sanitizedAnswers;

  // Show error state if validation failed
  if (!validationResult.valid) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.isDark ? "#2D1B0E" : "#1A1108" }}>
        <StatusBar barStyle="light-content" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <Text style={{ color: '#D97F52', fontSize: 18, fontWeight: '600', marginBottom: 12 }}>
            Unable to Display Results
          </Text>
          <Text style={{ color: '#E8D4B8', fontSize: 14, textAlign: 'center', marginBottom: 24 }}>
            {validationResult.error || 'Assessment data is missing or invalid.'}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              backgroundColor: '#8B7355',
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '500' }}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Calculate real score based on validated assessment answers
  const result = calculateAssessmentScore(answers);
  const score = result.overallScore;

  const getScoreCategory = (score: number) => {
    if (score >= 85)
      return {
        label: "Excellent",
        color: "#8FBC8F",
        description: "You are doing great!",
      };
    if (score >= 70)
      return {
        label: "Good",
        color: "#B8976B",
        description: "Mentally stable with room for growth",
      };
    if (score >= 50)
      return {
        label: "Fair",
        color: "#E8A872",
        description: "Some areas need attention",
      };
    return {
      label: "Needs Attention",
      color: "#D97F52",
      description: "Consider seeking support",
    };
  };

  const category = getScoreCategory(score);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.isDark ? "#2D1B0E" : "#1A1108",
    },
    header: {
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 20,
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    scoreContainer: {
      alignItems: "center",
      marginTop: 40,
      marginBottom: 40,
    },
    scoreCircle: {
      width: 200,
      height: 200,
      borderRadius: 100,
      borderWidth: 12,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 24,
    },
    scoreValue: {
      fontSize: 72,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    scoreLabel: {
      fontSize: 18,
      fontWeight: "600",
      color: "#FFFFFF",
      marginBottom: 8,
    },
    scoreDescription: {
      fontSize: 14,
      color: "#B8A99A",
      textAlign: "center",
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: "#FFFFFF",
      marginBottom: 16,
    },
    card: {
      backgroundColor: "rgba(45, 27, 14, 0.5)",
      borderRadius: 20,
      padding: 20,
      borderWidth: 1.5,
      borderColor: "#6B5444",
      marginBottom: 12,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    cardIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(143, 188, 143, 0.2)",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    cardTitle: {
      flex: 1,
      fontSize: 16,
      fontWeight: "600",
      color: "#FFFFFF",
    },
    cardValue: {
      fontSize: 16,
      fontWeight: "700",
      color: "#8FBC8F",
    },
    cardDescription: {
      fontSize: 14,
      color: "#B8A99A",
      lineHeight: 20,
    },
    progressBar: {
      height: 8,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderRadius: 4,
      overflow: "hidden",
      marginTop: 12,
    },
    progressFill: {
      height: "100%",
      borderRadius: 4,
    },
    recommendation: {
      backgroundColor: "rgba(143, 188, 143, 0.1)",
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: "#8FBC8F",
      marginBottom: 12,
    },
    recommendationText: {
      fontSize: 14,
      color: "#E5DDD5",
      lineHeight: 20,
    },
    bottomContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: 24,
      paddingBottom: 32,
      backgroundColor: theme.isDark ? "#2D1B0E" : "#1A1108",
    },
    button: {
      backgroundColor: "#A67C52",
      borderRadius: 24,
      paddingVertical: 16,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: 12,
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
      marginRight: 8,
    },
    secondaryButton: {
      backgroundColor: "transparent",
      borderWidth: 1.5,
      borderColor: "#6B5444",
    },
    secondaryButtonText: {
      color: "#E5DDD5",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Mental Health Score</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
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
                <MentalHealthIcon name="Brain" size={20} color={result.categories.mentalClarity.color} style={{}} />
              </View>
              <Text style={styles.cardTitle}>Mental Clarity</Text>
              <Text style={[styles.cardValue, { color: result.categories.mentalClarity.color }]}>
                {result.categories.mentalClarity.score}%
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${result.categories.mentalClarity.score}%`,
                    backgroundColor: result.categories.mentalClarity.color,
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <MentalHealthIcon name="Heart" size={20} color={result.categories.emotionalBalance.color} style={{}} />
              </View>
              <Text style={styles.cardTitle}>Emotional Balance</Text>
              <Text style={[styles.cardValue, { color: result.categories.emotionalBalance.color }]}>
                {result.categories.emotionalBalance.score}%
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${result.categories.emotionalBalance.score}%`,
                    backgroundColor: result.categories.emotionalBalance.color,
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <MentalHealthIcon name="Activity" size={20} color={result.categories.stressManagement.color} style={{}} />
              </View>
              <Text style={styles.cardTitle}>Stress Management</Text>
              <Text style={[styles.cardValue, { color: result.categories.stressManagement.color }]}>
                {result.categories.stressManagement.score}%
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${result.categories.stressManagement.score}%`,
                    backgroundColor: result.categories.stressManagement.color,
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <MentalHealthIcon name="Activity" size={20} color={result.categories.sleepQuality.color} style={{}} />
              </View>
              <Text style={styles.cardTitle}>Sleep Quality</Text>
              <Text style={[styles.cardValue, { color: result.categories.sleepQuality.color }]}>
                {result.categories.sleepQuality.score}%
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${result.categories.sleepQuality.score}%`,
                    backgroundColor: result.categories.sleepQuality.color,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommendations</Text>

          {/* LOW-NEW-002 FIX: Use recommendation text as stable key instead of index */}
          {result.recommendations.map((recommendation) => (
            <View key={`rec-${recommendation.substring(0, 20).replace(/\s/g, '-')}`} style={styles.recommendation}>
              <Text style={styles.recommendationText}>
                • {recommendation}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Dashboard" as never)}
        >
          <Text style={styles.buttonText}>Continue to Dashboard</Text>
          <Text style={{ color: "#FFFFFF", fontSize: 18 }}>→</Text>
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

// LOW-NEW-001 FIX: Add displayName for debugging
AssessmentResultsScreen.displayName = 'AssessmentResultsScreen';

export default AssessmentResultsScreen;
