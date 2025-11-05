/**
 * Assessment History Screen - Previous Assessment Results
 * Based on ui-designs/Dark-mode/Mental Health Assessment.png
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

interface Assessment {
  id: string;
  date: string;
  score: number;
  status: string;
  color: string;
  categories: {
    anxiety: number;
    depression: number;
    stress: number;
    sleep: number;
  };
}

export const AssessmentHistoryScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const assessments: Assessment[] = [
    {
      id: "1",
      date: "Oct 15, 2024",
      score: 80,
      status: "Mentally Stable",
      color: theme.colors.green["60"],
      categories: {
        anxiety: 75,
        depression: 82,
        stress: 78,
        sleep: 85,
      },
    },
    {
      id: "2",
      date: "Sep 15, 2024",
      score: 72,
      status: "Good",
      color: theme.colors.blue["60"],
      categories: {
        anxiety: 70,
        depression: 75,
        stress: 68,
        sleep: 75,
      },
    },
    {
      id: "3",
      date: "Aug 15, 2024",
      score: 65,
      status: "Moderate",
      color: theme.colors.orange["60"],
      categories: {
        anxiety: 60,
        depression: 68,
        stress: 62,
        sleep: 70,
      },
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.gray["20"],
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    newButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      flex: 1,
    },
    progressCard: {
      backgroundColor: theme.colors.green["20"],
      marginHorizontal: 20,
      marginTop: 20,
      borderRadius: 20,
      padding: 20,
    },
    progressTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 12,
    },
    progressValue: {
      fontSize: 48,
      fontWeight: "800",
      color: theme.colors.green["80"],
      textAlign: "center",
      marginBottom: 8,
    },
    progressLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.secondary,
      textAlign: "center",
    },
    section: {
      paddingHorizontal: 20,
      paddingTop: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    assessmentCard: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
    },
    assessmentHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    assessmentDate: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    assessmentScore: {
      fontSize: 32,
      fontWeight: "800",
    },
    assessmentStatus: {
      fontSize: 14,
      fontWeight: "700",
      marginBottom: 12,
    },
    categoriesGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    categoryItem: {
      width: "48%",
      backgroundColor: theme.colors.background.primary,
      borderRadius: 8,
      padding: 8,
    },
    categoryName: {
      fontSize: 11,
      fontWeight: "700",
      color: theme.colors.text.secondary,
      textTransform: "uppercase",
      marginBottom: 4,
    },
    categoryScore: {
      fontSize: 16,
      fontWeight: "800",
      color: theme.colors.text.primary,
    },
    viewButton: {
      backgroundColor: theme.colors.purple["60"],
      borderRadius: 12,
      paddingVertical: 10,
      marginTop: 12,
      alignItems: "center",
    },
    viewButtonText: {
      fontSize: 13,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    newAssessmentButton: {
      backgroundColor: theme.colors.green["60"],
      borderRadius: 16,
      paddingVertical: 16,
      marginHorizontal: 20,
      marginVertical: 24,
      alignItems: "center",
    },
    newAssessmentButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#FFFFFF",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessible
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assessment History</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Your Progress</Text>
          <Text style={styles.progressValue}>+8</Text>
          <Text style={styles.progressLabel}>
            Points improvement since last month
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Previous Assessments</Text>

          {assessments.map((assessment) => (
            <View key={assessment.id} style={styles.assessmentCard}>
              <View style={styles.assessmentHeader}>
                <Text style={styles.assessmentDate}>{assessment.date}</Text>
                <Text
                  style={[styles.assessmentScore, { color: assessment.color }]}
                >
                  {assessment.score}
                </Text>
              </View>

              <Text
                style={[styles.assessmentStatus, { color: assessment.color }]}
              >
                {assessment.status}
              </Text>

              <View style={styles.categoriesGrid}>
                <View style={styles.categoryItem}>
                  <Text style={styles.categoryName}>Anxiety</Text>
                  <Text style={styles.categoryScore}>
                    {assessment.categories.anxiety}
                  </Text>
                </View>
                <View style={styles.categoryItem}>
                  <Text style={styles.categoryName}>Depression</Text>
                  <Text style={styles.categoryScore}>
                    {assessment.categories.depression}
                  </Text>
                </View>
                <View style={styles.categoryItem}>
                  <Text style={styles.categoryName}>Stress</Text>
                  <Text style={styles.categoryScore}>
                    {assessment.categories.stress}
                  </Text>
                </View>
                <View style={styles.categoryItem}>
                  <Text style={styles.categoryName}>Sleep</Text>
                  <Text style={styles.categoryScore}>
                    {assessment.categories.sleep}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.viewButton}
                onPress={() =>
                  navigation.navigate("AssessmentResults", {
                    id: assessment.id,
                  })
                }
              >
                <Text style={styles.viewButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.newAssessmentButton}
          onPress={() => navigation.navigate("Assessment")}
        >
          <Text style={styles.newAssessmentButtonText}>
            Take New Assessment 📋
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AssessmentHistoryScreen;
