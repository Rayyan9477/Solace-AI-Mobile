/**
 * SettingsSection — grouped settings rows molecule (prototype v4.2)
 *
 * Used on screens 09 Profile and 37 Account Settings. Wraps SettingsRow
 * children inside a midnight[800] container with a BracketLabel header and
 * AuroraHairline separators between rows.
 */

import React from "react";
import { View, StyleSheet } from "react-native";

import { useTheme } from "@/shared/theme/useTheme";
import { BracketLabel } from "@/shared/components/primitives/BracketLabel";
import { AuroraHairline } from "@/shared/components/primitives/AuroraHairline";

export interface SettingsSectionProps {
  /** Bracket-style header e.g. "ACCOUNT" (brackets added by BracketLabel) */
  title: string;
  children: React.ReactNode;
  testID?: string;
}

export function SettingsSection({
  title,
  children,
  testID,
}: SettingsSectionProps): React.ReactElement {
  const { palette } = useTheme();

  // Intersperse hairlines between child rows
  const childArray = React.Children.toArray(children);
  const childrenWithDividers = childArray.reduce<React.ReactNode[]>(
    (acc, child, idx) => {
      acc.push(child);
      if (idx < childArray.length - 1) {
        acc.push(<AuroraHairline key={`hairline-${idx}`} inset={16} />);
      }
      return acc;
    },
    [],
  );

  return (
    <View
      testID={testID}
      accessibilityRole="list"
      accessibilityLabel={title}
      style={[
        styles.container,
        { backgroundColor: palette.midnight[800] },
      ]}
    >
      {/* Section header */}
      <View style={styles.header}>
        <BracketLabel variant="muted">{title}</BracketLabel>
      </View>

      {/* Rows with hairlines interspersed */}
      {childrenWithDividers}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: "hidden",
  },
  header: {
    paddingBottom: 10,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
});

export default SettingsSection;
