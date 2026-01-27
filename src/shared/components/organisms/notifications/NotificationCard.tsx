/**
 * NotificationCard Component
 * @description Notification card with icon, title, description, and metadata
 * @task Task 2.10.1: NotificationCard Component
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import type { NotificationCardProps } from "./NotificationCard.types";
import { formatNotificationTime } from "./NotificationCard.types";

export function NotificationCard({
  id,
  type,
  icon,
  iconColor,
  title,
  description,
  timestamp,
  badge,
  isRead = true,
  onPress,
  style,
  testID,
  accessibilityLabel,
}: NotificationCardProps): React.ReactElement {
  const timeLabel = formatNotificationTime(timestamp);
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
      accessibilityLabel={accessibilityLabel || `Notification: ${title}`}
      style={[styles.container, style]}
      {...containerProps}
    >
      {/* Icon Container */}
      <View testID="icon-container" style={[styles.iconContainer, { backgroundColor: iconColor }]}>
        {icon}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {badge && <Text style={styles.badge}>{badge}</Text>}
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
        <Text style={styles.timestamp}>{timeLabel}</Text>
      </View>

      {/* Unread Indicator */}
      {!isRead && <View testID="unread-indicator" style={styles.unreadIndicator} />}
    </Container>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "#475569",
    borderRadius: 8,
    color: "#FFFFFF",
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  container: {
    backgroundColor: "#334155",
    borderRadius: 12,
    flexDirection: "row",
    padding: 12,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  description: {
    color: "#94A3B8",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  iconContainer: {
    alignItems: "center",
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  timestamp: {
    color: "#64748B",
    fontSize: 11,
    marginTop: 4,
  },
  title: {
    color: "#FFFFFF",
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  unreadIndicator: {
    backgroundColor: "#9AAD5C",
    borderRadius: 4,
    height: 8,
    width: 8,
  },
});

export default NotificationCard;
