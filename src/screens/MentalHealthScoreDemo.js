import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

import {
  MentalHealthScoreWidget,
  CompactMentalHealthScoreWidget,
  DetailedMentalHealthScoreWidget,
  MinimalMentalHealthScoreWidget,
  Button,
} from "../components/ui";
import { useTheme } from "../shared/theme/ThemeContext";

/**
 * Mental Health Score Widget Demo Screen
 *
 * Showcases all variants of the Mental Health Score Widget
 * with different scores and interactive controls.
 */
const MentalHealthScoreDemo = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const [currentScore, setCurrentScore] = useState(80);
  const [isAnimated, setIsAnimated] = useState(true);

  const testScores = [95, 85, 75, 65, 55, 45, 25];

  const handleScoreChange = (score) => {
    setCurrentScore(score);
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            Mental Health Score Widget
          </Text>
          <Text
            style={[styles.subtitle, { color: theme.colors.text.secondary }]}
          >
            Professional mental health scoring interface
          </Text>
        </View>

        {/* Main Widget Display */}
        <View style={styles.mainWidgetContainer}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
          >
            Default Widget
          </Text>
          <MentalHealthScoreWidget
            score={currentScore}
            animated={isAnimated}
            style={[
              styles.widgetCard,
              { backgroundColor: theme.colors.background.card },
            ]}
          />
        </View>

        {/* Controls */}
        <View style={styles.controlsContainer}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
          >
            Test Different Scores
          </Text>
          <View style={styles.scoreButtons}>
            {testScores.map((score) => (
              <TouchableOpacity
                key={score}
                style={[
                  styles.scoreButton,
                  {
                    backgroundColor:
                      currentScore === score
                        ? "#00A878"
                        : theme.colors.background.secondary,
                    borderColor: theme.colors.border.primary,
                  },
                ]}
                onPress={() => handleScoreChange(score)}
              >
                <Text
                  style={[
                    styles.scoreButtonText,
                    {
                      color:
                        currentScore === score
                          ? "#FFFFFF"
                          : theme.colors.text.primary,
                    },
                  ]}
                >
                  {score}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.animationToggle,
              {
                backgroundColor: isAnimated
                  ? "#00A878"
                  : theme.colors.background.secondary,
                borderColor: theme.colors.border.primary,
              },
            ]}
            onPress={() => setIsAnimated(!isAnimated)}
          >
            <Text
              style={[
                styles.animationToggleText,
                {
                  color: isAnimated ? "#FFFFFF" : theme.colors.text.primary,
                },
              ]}
            >
              Animation: {isAnimated ? "ON" : "OFF"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Widget Variants */}
        <View style={styles.variantsContainer}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
          >
            Widget Variants
          </Text>

          {/* Detailed Widget */}
          <View style={styles.variantSection}>
            <Text
              style={[
                styles.variantTitle,
                { color: theme.colors.text.secondary },
              ]}
            >
              Detailed Widget
            </Text>
            <DetailedMentalHealthScoreWidget
              score={currentScore}
              animated={isAnimated}
              style={[
                styles.widgetCard,
                { backgroundColor: theme.colors.background.card },
              ]}
            />
          </View>

          {/* Compact and Minimal in Row */}
          <View style={styles.smallWidgetsRow}>
            <View style={styles.smallWidgetContainer}>
              <Text
                style={[
                  styles.variantTitle,
                  { color: theme.colors.text.secondary },
                ]}
              >
                Compact
              </Text>
              <CompactMentalHealthScoreWidget
                score={currentScore}
                animated={isAnimated}
                style={[
                  styles.widgetCard,
                  { backgroundColor: theme.colors.background.card },
                ]}
              />
            </View>

            <View style={styles.smallWidgetContainer}>
              <Text
                style={[
                  styles.variantTitle,
                  { color: theme.colors.text.secondary },
                ]}
              >
                Minimal
              </Text>
              <MinimalMentalHealthScoreWidget
                score={currentScore}
                animated={isAnimated}
                style={[
                  styles.widgetCard,
                  { backgroundColor: theme.colors.background.card },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Usage Examples */}
        <View style={styles.examplesContainer}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
          >
            Score Range Examples
          </Text>

          <View style={styles.exampleGrid}>
            {[
              { score: 95, label: "Excellent" },
              { score: 80, label: "Stable" },
              { score: 65, label: "Fair" },
              { score: 45, label: "At Risk" },
            ].map((example) => (
              <View key={example.score} style={styles.exampleItem}>
                <Text
                  style={[
                    styles.exampleLabel,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  {example.label}
                </Text>
                <MinimalMentalHealthScoreWidget
                  score={example.score}
                  animated={false}
                  style={[
                    styles.exampleWidget,
                    { backgroundColor: theme.colors.background.card },
                  ]}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Integration Guide */}
        <View style={styles.integrationContainer}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
          >
            Integration Example
          </Text>
          <View
            style={[
              styles.codeContainer,
              { backgroundColor: theme.colors.background.secondary },
            ]}
          >
            <Text
              style={[
                styles.codeText,
                { color: theme.colors.text.primary, fontFamily: "monospace" },
              ]}
            >
              {`import { MentalHealthScoreWidget } from '../components/ui';

<MentalHealthScoreWidget
  score={80}
  maxScore={100}
  size={160}
  animated={true}
  showEmoji={true}
  showDescription={true}
  showDetails={true}
/>`}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Button
            title="Back to Dashboard"
            onPress={() => navigation.goBack()}
            therapeuticColor="calming"
            style={styles.backButton}
          />
        </View>
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
  contentContainer: {
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.8,
  },
  mainWidgetContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  widgetCard: {
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  controlsContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  scoreButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginBottom: 16,
  },
  scoreButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 50,
    alignItems: "center",
  },
  scoreButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  animationToggle: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
  },
  animationToggleText: {
    fontSize: 14,
    fontWeight: "600",
  },
  variantsContainer: {
    marginBottom: 32,
  },
  variantSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  variantTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 12,
    textAlign: "center",
  },
  smallWidgetsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  smallWidgetContainer: {
    alignItems: "center",
    flex: 1,
  },
  examplesContainer: {
    marginBottom: 32,
  },
  exampleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  exampleItem: {
    alignItems: "center",
    width: "48%",
    marginBottom: 16,
  },
  exampleLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 8,
    textAlign: "center",
  },
  exampleWidget: {
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  integrationContainer: {
    marginBottom: 32,
  },
  codeContainer: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  codeText: {
    fontSize: 12,
    lineHeight: 18,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  backButton: {
    minWidth: 200,
  },
});

export default MentalHealthScoreDemo;
