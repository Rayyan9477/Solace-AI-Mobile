/**
 * Avatar Component
 * @description User avatar with image, initials fallback, and status indicator
 * @task Task 2.2.3: Avatar Component
 *
 * Features:
 * - Image with initials fallback
 * - Multiple sizes (sm, md, lg, xl)
 * - Status indicator (online, offline, away, busy)
 * - Full accessibility support
 */

import React, { useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import type { AvatarProps, AvatarSize, AvatarStatus } from "./Avatar.types";

/**
 * Color tokens (dark mode first)
 */
const colors = {
  background: "#334155",
  initials: "#E2E8F0",
  border: "#1E293B",
  // Status colors
  online: "#22C55E",
  offline: "#64748B",
  away: "#F59E0B",
  busy: "#EF4444",
};

/**
 * Size configurations
 */
const sizeConfig: Record<AvatarSize, { size: number; fontSize: number; statusSize: number }> = {
  sm: { size: 32, fontSize: 12, statusSize: 8 },
  md: { size: 40, fontSize: 14, statusSize: 10 },
  lg: { size: 56, fontSize: 18, statusSize: 12 },
  xl: { size: 80, fontSize: 24, statusSize: 16 },
};

/**
 * Get status color
 */
function getStatusColor(status: AvatarStatus): string {
  const statusColors: Record<AvatarStatus, string> = {
    online: colors.online,
    offline: colors.offline,
    away: colors.away,
    busy: colors.busy,
  };
  return statusColors[status];
}

/**
 * Get initials from name
 */
function getInitials(name: string): string {
  if (!name || name.trim() === "") return "";

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Avatar Component
 *
 * @example
 * ```tsx
 * // With image
 * <Avatar
 *   source={{ uri: "https://example.com/avatar.jpg" }}
 *   name="John Doe"
 *   size="lg"
 * />
 *
 * // Initials fallback
 * <Avatar
 *   name="Jane Smith"
 *   size="md"
 * />
 *
 * // With status indicator
 * <Avatar
 *   name="John Doe"
 *   status="online"
 *   showStatus
 * />
 * ```
 */
export function Avatar({
  source,
  name,
  size = "md",
  status = "offline",
  showStatus = false,
  testID,
  accessibilityLabel,
  style,
}: AvatarProps): React.ReactElement {
  const [imageError, setImageError] = useState(false);
  const config = sizeConfig[size];
  const initials = getInitials(name || "");
  const showImage = source && !imageError;

  return (
    <View
      testID={testID}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel || name || "Avatar"}
      style={[
        styles.container,
        {
          width: config.size,
          height: config.size,
          borderRadius: config.size / 2,
        },
        style,
      ]}
    >
      {/* Background with initials fallback */}
      <View
        style={[
          styles.background,
          {
            width: config.size,
            height: config.size,
            borderRadius: config.size / 2,
          },
        ]}
      >
        {initials ? (
          <Text
            style={[
              styles.initials,
              { fontSize: config.fontSize },
            ]}
          >
            {initials}
          </Text>
        ) : null}
      </View>

      {/* Image overlay */}
      {showImage && (
        <Image
          source={source}
          onError={() => setImageError(true)}
          style={[
            styles.image,
            {
              width: config.size,
              height: config.size,
              borderRadius: config.size / 2,
            },
          ]}
        />
      )}

      {/* Status indicator */}
      {showStatus && (
        <View
          testID={testID ? `${testID}-status` : "avatar-status"}
          style={[
            styles.status,
            {
              width: config.statusSize,
              height: config.statusSize,
              borderRadius: config.statusSize / 2,
              backgroundColor: getStatusColor(status),
              borderWidth: config.statusSize > 10 ? 2 : 1.5,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  background: {
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    color: colors.initials,
    fontWeight: "600",
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  status: {
    position: "absolute",
    bottom: 0,
    right: 0,
    borderColor: colors.border,
  },
});

export default Avatar;
