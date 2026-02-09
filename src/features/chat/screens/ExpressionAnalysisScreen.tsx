/**
 * ExpressionAnalysisScreen Component
 * @description Facial expression analysis results interface showing detected emotions and insights
 * @task Task 3.7.7: Expression Analysis Screen (Screen 59)
 * @phase Phase 3D: Integrated CrisisModal for low mood scores
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { CrisisModal } from "../../../shared/components/organisms/crisis";
import { palette } from "../../../shared/theme";

interface EmotionData {
  emotion: string;
  confidence: number;
  color: string;
}

interface Insight {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface ExpressionAnalysisScreenProps {
  capturedImageUri: string;
  analysisComplete: boolean;
  overallMoodScore: number;
  emotionData: EmotionData[];
  insights: Insight[];
  analysisTimestamp: Date;
  onBack: () => void;
  onRetake: () => void;
  onContinue: () => void;
  onSaveAnalysis: () => void;
}

export function ExpressionAnalysisScreen({
  capturedImageUri,
  analysisComplete,
  overallMoodScore,
  emotionData,
  insights,
  onBack,
  onRetake,
  onContinue,
  onSaveAnalysis,
}: ExpressionAnalysisScreenProps): React.ReactElement {
  const [showCrisisModal, setShowCrisisModal] = useState(false);

  // Crisis detection: Mood score < 30 indicates severe emotional distress
  const isCriticalMoodScore = overallMoodScore < 30;

  const handleAccessCrisisSupport = (): void => {
    setShowCrisisModal(true);
  };

  const getInsightIcon = (iconType: string): string => {
    switch (iconType) {
      case "peaceful":
        return "🧘";
      case "eye":
        return "👁️";
      case "smile":
        return "😊";
      case "energy":
        return "⚡";
      default:
        return "💡";
    }
  };

  if (!analysisComplete) {
    return (
      <View testID="expression-analysis-screen" style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            testID="back-button"
            style={styles.backButton}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backButtonIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Expression Analysis</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Loading State */}
        <View testID="analysis-loading" style={styles.loadingContainer}>
          <View style={styles.imagePreviewContainer}>
            <Image
              testID="captured-image-preview"
              source={{ uri: capturedImageUri }}
              style={styles.imagePreview}
              resizeMode="cover"
            />
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={palette.olive[500]} />
            </View>
          </View>
          <Text style={styles.loadingText}>Analyzing your expression...</Text>
          <Text style={styles.loadingSubtext}>
            Solace AI is processing your facial features
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View testID="expression-analysis-screen" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backButtonIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Expression Analysis</Text>
        <TouchableOpacity
          testID="save-button"
          style={styles.saveButton}
          onPress={onSaveAnalysis}
          accessibilityRole="button"
          accessibilityLabel="Save analysis"
        >
          <Text style={styles.saveIcon}>💾</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Captured Image Preview */}
        <View style={styles.imagePreviewContainer}>
          <Image
            testID="captured-image-preview"
            source={{ uri: capturedImageUri }}
            style={styles.imagePreview}
            resizeMode="cover"
          />
        </View>

        {/* Overall Mood Score */}
        <View testID="overall-mood-score" style={styles.moodScoreContainer}>
          <View style={styles.moodScoreCircle}>
            <Text style={styles.moodScoreValue}>{overallMoodScore}</Text>
            <Text style={styles.moodScoreLabel}>Mood Score</Text>
          </View>
          <View style={styles.moodScoreInfo}>
            <Text style={styles.moodScoreTitle}>Solace Expression Score</Text>
            <Text style={styles.moodScoreDescription}>
              Your facial expression indicates a{" "}
              {overallMoodScore >= 70
                ? "positive"
                : overallMoodScore >= 40
                  ? "neutral"
                  : "low"}{" "}
              emotional state
            </Text>
          </View>
        </View>

        {/* Emotion Breakdown */}
        <View testID="emotion-breakdown" style={styles.emotionSection}>
          <Text style={styles.sectionTitle}>Detected Emotions</Text>
          {emotionData.map((emotion, index) => (
            <View
              key={emotion.emotion}
              testID={`emotion-item-${index}`}
              style={styles.emotionItem}
            >
              <View style={styles.emotionInfo}>
                <View
                  style={[
                    styles.emotionIndicator,
                    { backgroundColor: emotion.color },
                  ]}
                />
                <Text style={styles.emotionName}>{emotion.emotion}</Text>
              </View>
              <View style={styles.emotionBarContainer}>
                <View
                  style={[
                    styles.emotionBar,
                    {
                      width: `${emotion.confidence}%`,
                      backgroundColor: emotion.color,
                    },
                  ]}
                />
              </View>
              <Text style={styles.emotionConfidence}>{emotion.confidence}%</Text>
            </View>
          ))}
        </View>

        {/* Insights Section */}
        <View testID="insights-section" style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>Insights</Text>
          {insights.map((insight) => (
            <View
              key={insight.id}
              testID={`insight-card-${insight.id}`}
              style={styles.insightCard}
            >
              <View style={styles.insightIcon}>
                <Text style={styles.insightIconText}>
                  {getInsightIcon(insight.icon)}
                </Text>
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>{insight.title}</Text>
                <Text style={styles.insightDescription}>
                  {insight.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          testID="retake-button"
          style={styles.retakeButton}
          onPress={onRetake}
          accessibilityRole="button"
          accessibilityLabel="Retake photo"
        >
          <Text style={styles.retakeButtonText}>Retake</Text>
        </TouchableOpacity>

        {/* Crisis Support Button - Shows when mood score is critical (< 30) */}
        {isCriticalMoodScore && (
          <TouchableOpacity
            testID="crisis-support-button"
            style={styles.crisisButton}
            onPress={handleAccessCrisisSupport}
            accessibilityRole="button"
            accessibilityLabel="Access crisis support resources"
          >
            <Text style={styles.crisisButtonText}>Crisis Support</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          testID="continue-button"
          style={styles.continueButton}
          onPress={onContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue"
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>

      {/* Crisis Modal */}
      <CrisisModal
        visible={showCrisisModal}
        onDismiss={() => setShowCrisisModal(false)}
        triggerSource="assessment"
        requireAcknowledge={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  actionContainer: {
    backgroundColor: palette.brown[900],
    flexDirection: "row",
    paddingBottom: 32,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  backButton: {
    alignItems: "center",
    borderColor: palette.brown[700],
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 40,
  },
  backButtonIcon: {
    color: palette.white,
    fontSize: 20,
    fontWeight: "600",
  },
  container: {
    backgroundColor: palette.brown[900],
    flex: 1,
    paddingTop: 60,
  },
  continueButton: {
    alignItems: "center",
    backgroundColor: palette.olive[500],
    borderRadius: 12,
    flex: 1,
    justifyContent: "center",
    marginLeft: 12,
    minHeight: 44,
    paddingVertical: 14,
  },
  continueButtonText: {
    color: palette.white,
    fontSize: 16,
    fontWeight: "600",
  },
  crisisButton: {
    alignItems: "center",
    backgroundColor: palette.red[500],
    borderRadius: 12,
    justifyContent: "center",
    marginLeft: 12,
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  crisisButtonText: {
    color: palette.white,
    fontSize: 16,
    fontWeight: "600",
  },
  emotionBar: {
    borderRadius: 4,
    height: "100%",
  },
  emotionBarContainer: {
    backgroundColor: palette.brown[800],
    borderRadius: 4,
    flex: 1,
    height: 8,
    marginHorizontal: 12,
  },
  emotionConfidence: {
    color: palette.white,
    fontSize: 14,
    fontWeight: "600",
    minWidth: 45,
    textAlign: "right",
  },
  emotionIndicator: {
    borderRadius: 4,
    height: 8,
    marginRight: 8,
    width: 8,
  },
  emotionInfo: {
    alignItems: "center",
    flexDirection: "row",
    minWidth: 100,
  },
  emotionItem: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 12,
  },
  emotionName: {
    color: palette.white,
    fontSize: 14,
  },
  emotionSection: {
    backgroundColor: palette.brown[800],
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  headerSpacer: {
    width: 40,
  },
  headerTitle: {
    color: palette.white,
    fontSize: 18,
    fontWeight: "700",
  },
  imagePreview: {
    borderRadius: 16,
    height: "100%",
    width: "100%",
  },
  imagePreviewContainer: {
    borderRadius: 16,
    height: 200,
    marginBottom: 20,
    overflow: "hidden",
    width: "100%",
  },
  insightCard: {
    backgroundColor: palette.brown[700],
    borderRadius: 12,
    flexDirection: "row",
    marginBottom: 12,
    padding: 16,
  },
  insightContent: {
    flex: 1,
  },
  insightDescription: {
    color: palette.gray[400],
    fontSize: 13,
    lineHeight: 20,
    marginTop: 4,
  },
  insightIcon: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderRadius: 12,
    height: 44,
    justifyContent: "center",
    marginRight: 12,
    width: 44,
  },
  insightIconText: {
    fontSize: 20,
  },
  insightTitle: {
    color: palette.white,
    fontSize: 15,
    fontWeight: "600",
  },
  insightsSection: {
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  loadingOverlay: {
    alignItems: "center",
    backgroundColor: "rgba(28, 20, 16, 0.7)",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  loadingSubtext: {
    color: palette.gray[400],
    fontSize: 14,
    marginTop: 8,
  },
  loadingText: {
    color: palette.white,
    fontSize: 18,
    fontWeight: "600",
    marginTop: 24,
  },
  moodScoreCircle: {
    alignItems: "center",
    backgroundColor: palette.olive[500],
    borderRadius: 40,
    height: 80,
    justifyContent: "center",
    width: 80,
  },
  moodScoreContainer: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderRadius: 16,
    flexDirection: "row",
    marginBottom: 16,
    padding: 16,
  },
  moodScoreDescription: {
    color: palette.gray[400],
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  moodScoreInfo: {
    flex: 1,
    marginLeft: 16,
  },
  moodScoreLabel: {
    color: palette.white,
    fontSize: 10,
    opacity: 0.8,
  },
  moodScoreTitle: {
    color: palette.white,
    fontSize: 16,
    fontWeight: "600",
  },
  moodScoreValue: {
    color: palette.white,
    fontSize: 28,
    fontWeight: "700",
  },
  retakeButton: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderColor: palette.brown[700],
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  retakeButtonText: {
    color: palette.white,
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  saveIcon: {
    fontSize: 20,
  },
  scrollContent: {
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    color: palette.white,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
});

export default ExpressionAnalysisScreen;
