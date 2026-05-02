/**
 * SessionCompleteScreen — prototype v4.2 #32 (Sprint 8 Batch C, NEW).
 *
 * Celebration modal for end-of-session: radial midnight backdrop, decorative
 * BreathingOrb + peach blob, ConcentricRings hosting a sage→aurora gradient
 * checkmark orb, "[ Well done ]" bracket, Fraunces hero copy with italic
 * second line, 3-up stats grid (minutes / streak / mood points), and primary
 * "How do you feel now?" CTA + ghost "Back to library" link.
 *
 * Maps to `prototypes/screens/32-session-complete.js`.
 */

import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { useTheme } from "@/shared/theme/useTheme";
import { Button } from "@/shared/components/atoms/buttons/Button";
import { AppIcon } from "@/shared/components/atoms/display/AppIcon";
import { ScreenContainer } from "@/shared/components/atoms/layout";
import {
  BracketLabel,
  BreathingOrb,
  ConcentricRings,
  GlassCard,
  SmokeBlob,
} from "@/shared/components/primitives";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SessionCompleteScreenProps {
  /** Minutes for this session. Default 10. */
  sessionMinutes?: number;
  /** Title displayed in the body copy. Default "Monday reset meditation". */
  sessionTitle?: string;
  /** Total minutes practiced today (for the stat tile). Default 24. */
  totalMinutes?: number;
  /** Total streak days. Default 23. */
  streakDays?: number;
  /** Mood points earned. Default 2. */
  moodPoints?: number;
  onClose: () => void;
  onCheckIn: () => void;
  onBack: () => void;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SessionCompleteScreen({
  sessionMinutes = 10,
  sessionTitle = "Monday reset meditation",
  totalMinutes = 24,
  streakDays = 23,
  moodPoints = 2,
  onClose,
  onCheckIn,
  onBack,
  testID = "session-complete-screen",
  style,
}: SessionCompleteScreenProps): React.ReactElement {
  const { palette, typography } = useTheme();

  const moodLabel = moodPoints >= 0 ? `+${moodPoints}` : `${moodPoints}`;

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={[styles.container, style]}
    >
      {/* Radial midnight gradient backdrop */}
      <LinearGradient
        testID="session-complete-gradient"
        colors={[palette.midnight[700], palette.midnight[950]]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* Decorative blobs */}
      <View
        style={[styles.decoBlobWrap, styles.decoBlobLeft]}
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <BreathingOrb size={260} tint="cool" />
      </View>
      <View
        style={[styles.decoBlobWrap, styles.decoBlobRight]}
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <SmokeBlob size={180} tint="peach" opacity={0.5} />
      </View>

      {/* Top-right close */}
      <View style={styles.topRow}>
        <TouchableOpacity
          testID="close-button"
          style={[
            styles.iconBtn,
            { backgroundColor: palette.midnight[800], borderColor: palette.midnight[600] },
          ]}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close celebration"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <AppIcon name="x" size={16} color={palette.warm[400]} />
        </TouchableOpacity>
      </View>

      {/* Centered celebration */}
      <View style={styles.center}>
        {/* Decorative wave bars */}
        <View
          testID="wave-illustration"
          style={styles.waveWrap}
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          {[0.6, 0.85, 1, 0.85, 0.6].map((h, i) => (
            <View
              key={i}
              style={[
                styles.waveBar,
                {
                  backgroundColor: i % 2 === 0 ? palette.sage[300] : palette.aurora[300],
                  height: 28 * h,
                  opacity: 0.65 + h * 0.2,
                },
              ]}
            />
          ))}
        </View>

        {/* Success ring */}
        <View
          testID="success-ring"
          accessibilityRole="image"
          accessibilityLabel="Session completed successfully"
          style={styles.ringWrap}
        >
          <ConcentricRings size={160} rings={3} tint="sage">
            <View style={styles.checkOrb}>
              <LinearGradient
                colors={[palette.sage[300], palette.aurora[300], palette.lavender[300]]}
                start={{ x: 0.2, y: 0.2 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <AppIcon name="check" size={36} color={palette.midnight[950]} />
            </View>
          </ConcentricRings>

          {/* Sparkles */}
          <View
            style={[styles.sparkle, styles.sparkleTopRight]}
            pointerEvents="none"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <AppIcon name="sparkles" size={14} color={palette.peach[300]} />
          </View>
          <View
            style={[styles.sparkle, styles.sparkleBottomLeft]}
            pointerEvents="none"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <AppIcon name="sparkles" size={12} color={palette.aurora[300]} />
          </View>
          <View
            style={[styles.sparkle, styles.sparkleMidRight]}
            pointerEvents="none"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <AppIcon name="sparkles" size={10} color={palette.lavender[300]} />
          </View>
        </View>

        <BracketLabel variant="sage" style={styles.wellDone}>
          Well done
        </BracketLabel>

        <Text
          testID="hero-title"
          accessibilityRole="header"
          style={[
            styles.heroTitle,
            { color: palette.warm[50], fontFamily: typography.fontFamily.displayRegular },
          ]}
        >
          {`That's ${sessionMinutes} minutes\n`}
          <Text
            style={[
              styles.heroItalic,
              { color: palette.warm[50], fontFamily: typography.fontFamily.displayItalic },
            ]}
          >
            for yourself.
          </Text>
        </Text>

        <Text
          style={[
            styles.subtitle,
            { color: palette.warm[400], fontFamily: typography.fontFamily.sans },
          ]}
        >
          {`You completed the ${sessionTitle}. Small actions compound.`}
        </Text>

        {/* Stats grid */}
        <View style={styles.statsRow} accessibilityRole="text">
          <GlassCard radius={16} style={styles.statCard} testID="stat-total">
            <Text
              testID="stat-total-value"
              style={[
                styles.statValue,
                { color: palette.warm[50], fontFamily: typography.fontFamily.displayRegular },
              ]}
            >
              {String(totalMinutes)}
            </Text>
            <BracketLabel variant="muted" style={styles.statLabel}>
              Total min
            </BracketLabel>
          </GlassCard>

          <GlassCard radius={16} style={styles.statCard} testID="stat-streak">
            <Text
              testID="stat-streak-value"
              style={[
                styles.statValue,
                { color: palette.warm[50], fontFamily: typography.fontFamily.displayRegular },
              ]}
            >
              {String(streakDays)}
              <Text
                style={[
                  styles.statUnit,
                  { color: palette.warm[400], fontFamily: typography.fontFamily.mono },
                ]}
              >
                d
              </Text>
            </Text>
            <BracketLabel variant="muted" style={styles.statLabel}>
              Streak
            </BracketLabel>
          </GlassCard>

          <GlassCard radius={16} style={styles.statCard} testID="stat-mood">
            <Text
              testID="stat-mood-value"
              style={[
                styles.statValue,
                { color: palette.warm[50], fontFamily: typography.fontFamily.displayRegular },
              ]}
            >
              {moodLabel}
            </Text>
            <BracketLabel variant="muted" style={styles.statLabel}>
              Mood points
            </BracketLabel>
          </GlassCard>
        </View>
      </View>

      {/* Bottom CTAs */}
      <View style={styles.ctaRow}>
        <Button
          testID="check-in-button"
          label="How do you feel now?"
          variant="primary"
          fullWidth
          onPress={onCheckIn}
          accessibilityLabel="How do you feel now?"
          style={styles.primaryBtn}
        />
        <TouchableOpacity
          testID="back-link"
          onPress={onBack}
          accessibilityRole="link"
          accessibilityLabel="Back to library"
          style={styles.backLink}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text
            style={[
              styles.backLinkText,
              { color: palette.warm[400], fontFamily: typography.fontFamily.sans },
            ]}
          >
            Back to library
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  backLink: {
    alignItems: "center",
    minHeight: 44,
    paddingVertical: 12,
  },
  backLinkText: {
    fontSize: 12,
  },
  center: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  checkOrb: {
    alignItems: "center",
    borderRadius: 48,
    height: 96,
    justifyContent: "center",
    overflow: "hidden",
    width: 96,
  },
  container: {
    flex: 1,
    overflow: "hidden",
  },
  ctaRow: {
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  decoBlobLeft: {
    left: -40,
    top: 60,
  },
  decoBlobRight: {
    right: -20,
    top: 100,
  },
  decoBlobWrap: {
    position: "absolute",
  },
  heroItalic: {
    fontSize: 32,
    fontStyle: "italic",
    lineHeight: 36,
  },
  heroTitle: {
    fontSize: 32,
    lineHeight: 36,
    marginBottom: 12,
    textAlign: "center",
  },
  iconBtn: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 44,
  },
  primaryBtn: {
    marginBottom: 4,
  },
  ringWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    position: "relative",
  },
  sparkle: {
    position: "absolute",
  },
  sparkleBottomLeft: {
    bottom: 16,
    left: -4,
  },
  sparkleMidRight: {
    right: -2,
    top: 36,
  },
  sparkleTopRight: {
    right: 4,
    top: -2,
  },
  statCard: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  statLabel: {
    fontSize: 9,
    marginTop: 4,
    textAlign: "center",
  },
  statUnit: {
    fontSize: 10,
  },
  statValue: {
    fontSize: 22,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 24,
    width: "100%",
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
    maxWidth: 300,
    textAlign: "center",
  },
  topRow: {
    alignItems: "flex-end",
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  waveBar: {
    borderRadius: 2,
    width: 4,
  },
  waveWrap: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: 4,
    height: 36,
    marginBottom: 16,
  },
  wellDone: {
    marginBottom: 8,
  },
});

export default SessionCompleteScreen;
