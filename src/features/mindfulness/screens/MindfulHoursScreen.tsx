/**
 * Mindful Hours Screen - Exercise tracking
 * Based on ui-designs/Dark-mode/Mindful Hours.png
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Svg, Circle } from "react-native-svg";

interface Exercise {
  id: string;
  name: string;
  duration: string;
  percentage: number;
  color: string;
  icon: string;
}

const EXERCISES: Exercise[] = [
  {
    id: "1",
    name: "Breathing",
    duration: "2.1h",
    percentage: 20,
    color: "#98B068",
    icon: "🫁",
  },
  {
    id: "2",
    name: "Mindfulness",
    duration: "1.7h",
    percentage: 17,
    color: "#C96100",
    icon: "🧘",
  },
  {
    id: "3",
    name: "Relax",
    duration: "0h",
    percentage: 40,
    color: "#704A33",
    icon: "😌",
  },
  {
    id: "4",
    name: "Sleep",
    duration: "0h",
    percentage: 80,
    color: "#6B5FC8",
    icon: "😴",
  },
];

const HISTORY = [
  {
    id: "1",
    name: "Deep Meditation",
    duration: "00:05",
    date: "20:00",
    color: "#98B068",
  },
  {
    id: "2",
    name: "Balanced Sleep",
    duration: "08:00",
    date: "22:00",
    color: "#6B5FC8",
  },
];

export const MindfulHoursScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const totalHours = 5.21;

  const renderDonutChart = () => {
    const size = 200;
    const strokeWidth = 30;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    let currentOffset = 0;

    return (
      <View style={styles.chartContainer}>
        <Svg width={size} height={size}>
          {EXERCISES.map((exercise, index) => {
            const segmentLength = (exercise.percentage / 100) * circumference;
            const strokeDashoffset = circumference - currentOffset;
            currentOffset += segmentLength;

            return (
              <Circle
                key={exercise.id}
                cx={center}
                cy={center}
                r={radius}
                stroke={exercise.color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                strokeDashoffset={-strokeDashoffset}
                rotation="-90"
                origin={`${center}, ${center}`}
              />
            );
          })}
        </Svg>
        <View style={styles.chartCenter}>
          <Text
            style={[styles.chartValue, { color: theme.colors.text.primary }]}
          >
            {totalHours}h
          </Text>
          <Text
            style={[styles.chartLabel, { color: theme.colors.text.secondary }]}
          >
            Total
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text
            style={[styles.backButton, { color: theme.colors.text.primary }]}
          >
            ←
          </Text>
        </TouchableOpacity>
        <Text
          style={[styles.headerTitle, { color: theme.colors.text.primary }]}
        >
          Mindful Hours Stats
        </Text>
        <TouchableOpacity>
          <Text
            style={[styles.downloadIcon, { color: theme.colors.text.primary }]}
          >
            ↓
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Donut Chart */}
        <View style={styles.chartSection}>{renderDonutChart()}</View>

        {/* Exercise Breakdown */}
        <View style={styles.exerciseList}>
          {EXERCISES.map((exercise) => (
            <TouchableOpacity
              key={exercise.id}
              style={styles.exerciseItem}
              onPress={() => navigation.navigate("ExerciseCreate")}
            >
              <View style={styles.exerciseLeft}>
                <View
                  style={[
                    styles.exerciseIcon,
                    { backgroundColor: `${exercise.color}20` },
                  ]}
                >
                  <Text style={styles.exerciseEmoji}>{exercise.icon}</Text>
                </View>
                <View>
                  <Text
                    style={[
                      styles.exerciseName,
                      { color: theme.colors.text.primary },
                    ]}
                  >
                    {exercise.name}
                  </Text>
                  <Text
                    style={[
                      styles.exerciseDuration,
                      { color: theme.colors.text.secondary },
                    ]}
                  >
                    {exercise.duration}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.exercisePercentage,
                  { color: theme.colors.text.secondary },
                ]}
              >
                {exercise.percentage}%
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* History Section */}
        <View style={styles.historySection}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
          >
            Mindful Hour History
          </Text>

          {HISTORY.map((item) => (
            <View
              key={item.id}
              style={[
                styles.historyCard,
                { backgroundColor: theme.colors.brown["10"] },
              ]}
            >
              <View style={styles.historyLeft}>
                <View
                  style={[styles.historyDot, { backgroundColor: item.color }]}
                />
                <View>
                  <Text
                    style={[
                      styles.historyName,
                      { color: theme.colors.text.primary },
                    ]}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={[
                      styles.historyTime,
                      { color: theme.colors.text.secondary },
                    ]}
                  >
                    {item.date}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.historyDuration,
                  { color: theme.colors.text.primary },
                ]}
              >
                {item.duration}
              </Text>
            </View>
          ))}
        </View>

        {/* Add Exercise Button */}
        <TouchableOpacity
          style={[
            styles.addButton,
            { backgroundColor: theme.colors.brown["70"] },
          ]}
          onPress={() => navigation.navigate("ExerciseCreate")}
        >
          <Text style={styles.addButtonText}>+ New Meditation</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    fontSize: 28,
    width: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    flex: 1,
    textAlign: "center",
  },
  downloadIcon: {
    fontSize: 24,
    width: 40,
    textAlign: "right",
  },
  chartSection: {
    alignItems: "center",
    paddingVertical: 32,
  },
  chartContainer: {
    position: "relative",
  },
  chartCenter: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  chartValue: {
    fontSize: 36,
    fontWeight: "800",
  },
  chartLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  exerciseList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  exerciseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  exerciseLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  exerciseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  exerciseEmoji: {
    fontSize: 20,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
  },
  exerciseDuration: {
    fontSize: 14,
    marginTop: 2,
  },
  exercisePercentage: {
    fontSize: 16,
    fontWeight: "600",
  },
  historySection: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  historyCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  historyLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  historyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  historyName: {
    fontSize: 16,
    fontWeight: "600",
  },
  historyTime: {
    fontSize: 14,
    marginTop: 2,
  },
  historyDuration: {
    fontSize: 16,
    fontWeight: "700",
  },
  addButton: {
    marginHorizontal: 20,
    marginBottom: 32,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default MindfulHoursScreen;
