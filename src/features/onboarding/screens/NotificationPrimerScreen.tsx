/**
 * NotificationPrimerScreen — prototype v4.2 #17 (Sprint 7).
 *
 * Consent-first notification opt-in. Stacked preview cards convey value;
 * copy emphasises user control. midnight[950] bg.
 *
 * Maps to `prototypes/screens/17-notif-primer.js`.
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
import { BracketLabel } from "@/shared/components/primitives";
import { StackedNotificationCards } from "@/shared/components/molecules/feedback/StackedNotificationCards";
import type { StackedNotification } from "@/shared/components/molecules/feedback/StackedNotificationCards";

// ─── Public API ──────────────────────────────────────────────────────────────

export interface NotificationPrimerScreenProps {
  onAllow: () => void;
  onSkip: () => void;
  onBack?: () => void;
  testID?: string;
}

// ─── Sample notification data ─────────────────────────────────────────────────

const SAMPLE_NOTIFICATIONS: StackedNotification[] = [
  {
    id: "daily-checkin",
    iconName: "sparkles",
    iconHue: "aurora",
    title: "[ DAILY · 8:30 AM ]",
    message: "Time for your check-in",
  },
  {
    id: "streak",
    iconName: "flame",
    iconHue: "peach",
    title: "[ STREAK · 3 DAYS ]",
    message: "Keep your momentum going",
  },
  {
    id: "insight",
    iconName: "moon",
    iconHue: "lavender",
    title: "[ INSIGHT ]",
    message: "You sleep better after journaling",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export function NotificationPrimerScreen({
  onAllow,
  onSkip,
  onBack,
  testID = "notification-primer-screen",
}: NotificationPrimerScreenProps): React.ReactElement {
  const { palette } = useTheme();

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={styles.screen}
    >
      {/* Header row: back button · bracket · spacer */}
      <View style={styles.headerRow}>
        {onBack ? (
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
        ) : (
          <View style={styles.headerSpacer} />
        )}

        <BracketLabel variant="peach" style={styles.headerLabel}>
          STAY CONNECTED
        </BracketLabel>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero: stacked cards + headline */}
        <View style={styles.hero}>
          <StackedNotificationCards
            testID="stacked-notification-cards"
            cards={SAMPLE_NOTIFICATIONS}
            width={320}
          />

          {/* Headline */}
          <Text
            testID="headline"
            accessibilityRole="header"
            style={[styles.headline, { color: palette.warm[50] }]}
          >
            Stay connected with{" "}
            <Text style={styles.headlineItalic}>your wellness.</Text>
          </Text>

          {/* Subtitle */}
          <Text
            style={[styles.subtitle, { color: palette.warm[400] }]}
            accessibilityRole="text"
          >
            {"We'll only ping you for things that matter — daily check-ins, milestones, gentle reminders. You're in control."}
          </Text>
        </View>
      </ScrollView>

      {/* Sticky bottom CTAs */}
      <View style={styles.bottomActions}>
        <Button
          testID="allow-button"
          label="Allow notifications"
          variant="primary"
          fullWidth
          onPress={onAllow}
          accessibilityLabel="Allow notifications"
          style={{ ...styles.allowButton, backgroundColor: palette.sage[500] }}
          labelStyle={{ color: palette.midnight[950] }}
        />

        <TouchableOpacity
          testID="skip-link"
          style={styles.skipLink}
          onPress={onSkip}
          accessibilityRole="button"
          accessibilityLabel="Not now, skip notifications"
          hitSlop={{ top: 8, bottom: 8, left: 16, right: 16 }}
        >
          <Text style={[styles.skipText, { color: palette.warm[400] }]}>
            Not now
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  allowButton: {
    borderRadius: 28,
    marginBottom: 4,
  },
  backButton: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  bottomActions: {
    paddingBottom: 24,
    paddingHorizontal: 24,
    paddingTop: 8,
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
    fontSize: 28,
    lineHeight: 34,
    marginBottom: 12,
    marginTop: 32,
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
    paddingBottom: 16,
    paddingTop: 32,
  },
  screen: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
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

export default NotificationPrimerScreen;
