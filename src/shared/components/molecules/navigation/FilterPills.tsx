/**
 * FilterPills — horizontal scrollable pill tab row (prototype v4.2)
 *
 * Used on screens 35 Notifications inbox and 36 Search. Renders a scrollable
 * row of pill tabs, each optionally showing a count badge. Supports "pill"
 * (solid bg) and "underline" (border-bottom indicator) variants.
 */

import React from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from "react-native";

import { useTheme } from "@/shared/theme/useTheme";
import { useHaptic } from "@/shared/hooks/useHaptic";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FilterPill {
  id: string;
  label: string;
  /** Optional count shown inline as "(N)" */
  count?: number;
}

export interface FilterPillsProps {
  pills: FilterPill[];
  activeId: string;
  onChange: (id: string) => void;
  variant?: "underline" | "pill";
  testID?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function FilterPills({
  pills,
  activeId,
  onChange,
  variant = "pill",
  testID,
}: FilterPillsProps): React.ReactElement {
  const { palette } = useTheme();
  const haptic = useHaptic();

  const handlePress = (id: string) => {
    haptic.light();
    onChange(id);
  };

  return (
    <ScrollView
      testID={testID}
      horizontal
      showsHorizontalScrollIndicator={false}
      accessibilityRole="tablist"
      contentContainerStyle={styles.contentContainer}
    >
      {pills.map((pill) => {
        const isActive = pill.id === activeId;
        const a11yLabel =
          pill.count !== undefined
            ? `${pill.label}, ${pill.count} items`
            : pill.label;

        if (variant === "underline") {
          return (
            <TouchableOpacity
              key={pill.id}
              onPress={() => handlePress(pill.id)}
              accessibilityRole="tab"
              accessibilityLabel={a11yLabel}
              accessibilityState={{ selected: isActive }}
              hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
              style={[
                styles.underlinePill,
                isActive && {
                  borderBottomColor: palette.aurora[300],
                  borderBottomWidth: 2,
                },
              ]}
            >
              <Text
                style={[
                  styles.label,
                  {
                    color: isActive ? palette.aurora[300] : palette.warm[400],
                    fontWeight: isActive ? "600" : "400",
                  },
                ]}
              >
                {pill.label}
                {pill.count !== undefined && (
                  <Text style={styles.count}>{` (${pill.count})`}</Text>
                )}
              </Text>
            </TouchableOpacity>
          );
        }

        // Default: pill variant
        return (
          <TouchableOpacity
            key={pill.id}
            onPress={() => handlePress(pill.id)}
            accessibilityRole="tab"
            accessibilityLabel={a11yLabel}
            accessibilityState={{ selected: isActive }}
            style={[
              styles.pill,
              {
                backgroundColor: isActive
                  ? palette.aurora[300]
                  : palette.midnight[700],
              },
            ]}
          >
            <Text
              style={[
                styles.label,
                {
                  color: isActive
                    ? palette.midnight[950]
                    : palette.warm[400],
                },
              ]}
            >
              {pill.label}
              {pill.count !== undefined && (
                <Text
                  style={[
                    styles.count,
                    {
                      color: isActive
                        ? palette.midnight[950]
                        : palette.warm[400],
                    },
                  ]}
                >
                  {` (${pill.count})`}
                </Text>
              )}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 4,
  },
  count: {
    fontFamily: "FiraCode_400Regular",
    fontSize: 12,
  },
  label: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  pill: {
    alignItems: "center",
    borderRadius: 999,
    height: 36,
    justifyContent: "center",
    paddingHorizontal: 14,
    // Ensure 44pt minimum touch target via hitSlop
  },
  underlinePill: {
    alignItems: "center",
    borderBottomColor: "transparent",
    borderBottomWidth: 2,
    height: 36,
    justifyContent: "center",
    paddingHorizontal: 14,
  },
});
