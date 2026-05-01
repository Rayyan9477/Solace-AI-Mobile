/**
 * AssessmentIntroScreen — prototype v4.2 #18 AssessmentIntro (Sprint 7 reskin).
 *
 * Pre-assessment trust moment. Explains the flow before the user begins.
 * midnight[950] bg with centered hero. Preserves existing public API.
 *
 * Maps to `prototypes/screens/18-assessment-intro.js`.
 */

import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "@/shared/theme/useTheme";
import { ScreenContainer } from "@/shared/components/atoms/layout";
import { Button } from "@/shared/components/atoms/buttons/Button";
import { AppIcon } from "@/shared/components/atoms/display/AppIcon";
import { BracketLabel, IconTile } from "@/shared/components/primitives";

// ─── Public API ──────────────────────────────────────────────────────────────

export interface AssessmentIntroScreenProps {
  onBack: () => void;
  onStart: () => void;
  onSkip?: () => void;
  testID?: string;
}

// ─── Metadata chips ───────────────────────────────────────────────────────────

interface MetaChip {
  id: string;
  iconName: string;
  label: string;
}

const META_CHIPS: MetaChip[] = [
  { id: "duration", iconName: "clock", label: "5 minutes" },
  { id: "privacy", iconName: "lock", label: "Confidential" },
  { id: "optional", iconName: "check-circle", label: "Optional questions" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export function AssessmentIntroScreen({
  onBack,
  onStart,
  onSkip,
  testID = "assessment-intro-screen",
}: AssessmentIntroScreenProps): React.ReactElement {
  const { palette } = useTheme();

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={styles.screen}
    >
      {/* Header row: back · bracket · spacer */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          testID="back-button"
          style={[
            styles.backButton,
            {
              backgroundColor: palette.midnight[800],
              borderColor: palette.midnight[600],
            },
          ]}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <AppIcon name="arrow-left" size={18} color={palette.warm[400]} />
        </TouchableOpacity>

        <BracketLabel variant="peach" style={styles.headerLabel}>
          ASSESSMENT
        </BracketLabel>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Centered hero */}
        <View style={styles.hero}>
          {/* 80×80 shield-check icon tile */}
          <IconTile
            testID="hero-icon"
            iconName="shield-check"
            size={80}
            hue="sage"
            variant="soft"
            shape="circle"
            accessibilityLabel="Assessment shield"
          />

          {/* Metadata kicker */}
          <BracketLabel variant="muted" style={styles.metaKicker}>
            5 MIN · CONFIDENTIAL · OPTIONAL
          </BracketLabel>

          {/* Headline */}
          <Text
            testID="headline"
            accessibilityRole="header"
            style={[styles.headline, { color: palette.warm[50] }]}
          >
            {"Let's understand "}
            <Text style={styles.headlineItalic}>where you are.</Text>
          </Text>

          {/* Subtitle */}
          <Text
            style={[styles.subtitle, { color: palette.warm[400] }]}
            accessibilityRole="text"
          >
            A short check-in to help Solace personalize your experience. There are no wrong answers.
          </Text>

          {/* Metadata chips row */}
          <View testID="meta-chips" style={styles.chipsRow}>
            {META_CHIPS.map((chip) => (
              <View
                key={chip.id}
                testID={`meta-chip-${chip.id}`}
                style={[
                  styles.chip,
                  {
                    backgroundColor: palette.midnight[800],
                    borderColor: palette.midnight[600],
                  },
                ]}
              >
                <IconTile
                  iconName={chip.iconName}
                  size={32}
                  hue="sage"
                  variant="soft"
                />
                <Text
                  style={[styles.chipLabel, { color: palette.warm[400] }]}
                  numberOfLines={2}
                >
                  {chip.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Sticky bottom CTAs */}
      <View style={styles.bottomActions}>
        <Button
          testID="begin-button"
          label="Begin assessment"
          variant="primary"
          fullWidth
          onPress={onStart}
          accessibilityLabel="Begin mental health assessment"
          style={{ ...styles.beginButton, backgroundColor: palette.sage[500] }}
          labelStyle={{ color: palette.midnight[950] }}
        />

        {onSkip && (
          <TouchableOpacity
            testID="skip-link"
            style={styles.skipLink}
            onPress={onSkip}
            accessibilityRole="button"
            accessibilityLabel="Skip assessment for now"
            hitSlop={{ top: 8, bottom: 8, left: 16, right: 16 }}
          >
            <Text style={[styles.skipText, { color: palette.warm[400] }]}>
              Skip for now
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScreenContainer>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  beginButton: {
    borderRadius: 28,
    marginBottom: 4,
  },
  bottomActions: {
    paddingBottom: 28,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  chip: {
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: "30%",
  },
  chipLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    lineHeight: 14,
    textAlign: "center",
  },
  chipsRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: 24,
    width: "100%",
  },
  headerLabel: {
    textAlign: "center",
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  headerSpacer: {
    height: 44,
    width: 44,
  },
  headline: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 30,
    lineHeight: 36,
    marginBottom: 12,
    marginTop: 16,
    textAlign: "center",
  },
  headlineItalic: {
    fontFamily: "Fraunces_400Regular_Italic",
    fontStyle: "italic",
  },
  hero: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  metaKicker: {
    marginTop: 20,
    textAlign: "center",
  },
  screen: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  skipLink: {
    alignItems: "center",
    minHeight: 44,
    paddingVertical: 10,
  },
  skipText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 300,
    textAlign: "center",
  },
});

export default AssessmentIntroScreen;
