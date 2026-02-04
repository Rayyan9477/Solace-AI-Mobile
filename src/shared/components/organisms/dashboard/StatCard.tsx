/**
 * StatCard Component
 * @description Dashboard stat card with date, title, description, and circular progress
 * @task Task 2.10.3: StatCard Component
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import type { StatCardProps } from "./StatCard.types";
import { formatStatDate, calculateProgressPercentage } from "./StatCard.types";
import { palette } from "../../../theme";

export function StatCard({
  id,
  date,
  title,
  description,
  score,
  maxScore = 100,
  progressColor,
  onPress,
  style,
  testID,
  accessibilityLabel,
}: StatCardProps): React.ReactElement {
  const dateLabel = formatStatDate(date);
  const progressPercentage = calculateProgressPercentage(score, maxScore);
  const handlePress = () => onPress?.(id);

  const Container = onPress ? TouchableOpacity : View;
  const containerProps = onPress
    ? {
        onPress: handlePress,
        accessibilityRole: "button" as const,
        activeOpacity: 0.7,
      }
    : {};

  return (
    <Container
      testID={testID}
      accessibilityLabel={accessibilityLabel || `Stat: ${title}, Score: ${score}`}
      style={[styles.container, style]}
      {...containerProps}
    >
      {/* Date Badge */}
      <View testID="date-badge" style={styles.dateBadge}>
        <Text style={styles.dateText}>{dateLabel}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.description} numberOfLines={1}>
          {description}
        </Text>
      </View>

      {/* Circular Progress */}
      <View testID="progress-circle" style={styles.progressContainer}>
        <View style={[styles.progressCircle, { borderColor: progressColor, borderWidth: 4 }]}>
          <Text style={styles.scoreText}>{score}</Text>
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: palette.gray[600],
    borderRadius: 16,
    flexDirection: "row",
    padding: 12,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  dateBadge: {
    alignItems: "center",
    backgroundColor: palette.gray[700],
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 8,
    width: 56,
  },
  dateText: {
    color: palette.white,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 16,
    textAlign: "center",
  },
  description: {
    color: palette.gray[400],
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  progressCircle: {
    alignItems: "center",
    borderRadius: 32,
    height: 64,
    justifyContent: "center",
    width: 64,
  },
  progressContainer: {
    marginLeft: 12,
  },
  scoreText: {
    color: palette.white,
    fontSize: 20,
    fontWeight: "700",
  },
  title: {
    color: palette.white,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 18,
  },
});

export default StatCard;
