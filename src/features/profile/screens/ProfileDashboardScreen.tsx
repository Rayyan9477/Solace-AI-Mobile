/**
 * ProfileDashboardScreen — prototype v4.2 #09 reskin (Sprint 8).
 *
 * Visual ref: prototypes/screens/09-profile.js
 * - Centered avatar with sage→aurora→peach gradient ring + camera badge
 * - Fraunces light name, Premium chip
 * - 3 stats GlassCard tiles (streak / sessions / mindful)
 * - Account + Support SettingsSection groups
 * - Sign-out card + monospace v4.2.0 footer
 */

import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "@/app/AuthContext";
import { AppIcon } from "@/shared/components/atoms/display/AppIcon";
import { ScreenContainer } from "@/shared/components/atoms/layout";
import { SettingsRow } from "@/shared/components/molecules/lists/SettingsRow";
import { SettingsSection } from "@/shared/components/molecules/lists/SettingsSection";
import {
  AvatarRing,
  BracketLabel,
  GlassCard,
} from "@/shared/components/primitives";
import { useTheme } from "@/shared/theme/useTheme";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ProfileDashboardScreenProps {
  userName?: string;
  userInitial?: string;
  isPremium?: boolean;
  streakDays?: number;
  sessionCount?: number;
  mindfulHours?: number;
  unreadNotifications?: number;
  language?: string;
  onChangePhoto: () => void;
  onPersonalInfo: () => void;
  onNotifications: () => void;
  onPrivacy: () => void;
  onLanguage: () => void;
  onHelp: () => void;
  onFeedback: () => void;
  onInvite: () => void;
  onSignOut?: () => void;
  testID?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProfileDashboardScreen({
  userName = "Rayyan Ahmed",
  userInitial,
  isPremium = true,
  streakDays = 23,
  sessionCount = 142,
  mindfulHours = 12,
  unreadNotifications = 3,
  language = "English",
  onChangePhoto,
  onPersonalInfo,
  onNotifications,
  onPrivacy,
  onLanguage,
  onHelp,
  onFeedback,
  onInvite,
  onSignOut,
  testID = "profile-dashboard-screen",
}: ProfileDashboardScreenProps): React.ReactElement {
  const { palette } = useTheme();
  const { signOut } = useAuth();

  const initial = userInitial ?? userName.charAt(0).toUpperCase();

  const handleSignOut = (): void => {
    if (onSignOut) {
      onSignOut();
      return;
    }
    signOut();
  };

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ---------------------------------------------------------------- */}
        {/* Profile header                                                    */}
        {/* ---------------------------------------------------------------- */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrap} testID="profile-avatar">
            <AvatarRing size={96} ringWidth={3} variant="sage-aurora-peach">
              <View
                style={[
                  styles.avatarInner,
                  { backgroundColor: palette.midnight[800] },
                ]}
              >
                <Text
                  testID="avatar-initial"
                  style={[styles.avatarInitial, { color: palette.warm[50] }]}
                  accessibilityRole="text"
                >
                  {initial}
                </Text>
              </View>
            </AvatarRing>

            <TouchableOpacity
              testID="change-photo-button"
              onPress={onChangePhoto}
              accessibilityRole="button"
              accessibilityLabel="Change photo"
              hitSlop={{ bottom: 6, left: 6, right: 6, top: 6 }}
              style={[
                styles.cameraBadge,
                {
                  backgroundColor: palette.peach[300],
                  borderColor: palette.midnight[950],
                },
              ]}
            >
              <AppIcon name="camera" size={16} color={palette.midnight[950]} />
            </TouchableOpacity>
          </View>

          <Text
            testID="profile-name"
            accessibilityRole="header"
            style={[styles.name, { color: palette.warm[50] }]}
          >
            {userName}
          </Text>

          {isPremium ? (
            <View
              testID="premium-chip"
              style={[
                styles.premiumChip,
                {
                  backgroundColor: palette.midnight[800],
                  borderColor: palette.midnight[600],
                },
              ]}
              accessibilityRole="text"
              accessibilityLabel="Premium member"
            >
              <AppIcon name="sparkles" size={11} color={palette.peach[300]} />
              <BracketLabel variant="peach" announceAsLabel={false}>
                Premium member
              </BracketLabel>
            </View>
          ) : null}
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* Stats grid                                                         */}
        {/* ---------------------------------------------------------------- */}
        <View
          style={styles.statsRow}
          accessibilityRole="none"
          accessibilityLabel="Your stats"
          testID="stats-grid"
        >
          <StatTile
            testID="stat-streak"
            iconName="flame"
            iconColor={palette.peach[300]}
            value={String(streakDays)}
            unit="d"
            label="Streak"
          />
          <StatTile
            testID="stat-sessions"
            iconName="message-circle"
            iconColor={palette.sage[300]}
            value={String(sessionCount)}
            unit=""
            label="Sessions"
          />
          <StatTile
            testID="stat-mindful"
            iconName="wind"
            iconColor={palette.aurora[300]}
            value={String(mindfulHours)}
            unit="h"
            label="Mindful"
          />
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* Account section                                                    */}
        {/* ---------------------------------------------------------------- */}
        <SettingsSection title="Account" testID="account-section">
          <SettingsRow
            testID="row-personal-info"
            iconName="user"
            iconHue="sage"
            label="Personal information"
            onPress={onPersonalInfo}
          />
          <SettingsRow
            testID="row-notifications"
            iconName="bell"
            iconHue="sage"
            label="Notifications"
            badgeCount={unreadNotifications}
            onPress={onNotifications}
          />
          <SettingsRow
            testID="row-privacy"
            iconName="shield"
            iconHue="sage"
            label="Privacy & security"
            onPress={onPrivacy}
          />
          <SettingsRow
            testID="row-language"
            iconName="globe"
            iconHue="sage"
            label="Language"
            value={language}
            onPress={onLanguage}
          />
        </SettingsSection>

        {/* ---------------------------------------------------------------- */}
        {/* Support section                                                    */}
        {/* ---------------------------------------------------------------- */}
        <View style={styles.supportSpacer} />
        <SettingsSection title="Support" testID="support-section">
          <SettingsRow
            testID="row-help"
            iconName="life-buoy"
            iconHue="aurora"
            label="Help center"
            onPress={onHelp}
          />
          <SettingsRow
            testID="row-feedback"
            iconName="message-square"
            iconHue="aurora"
            label="Send feedback"
            onPress={onFeedback}
          />
          <SettingsRow
            testID="row-invite"
            iconName="gift"
            iconHue="aurora"
            label="Invite friends"
            onPress={onInvite}
          />
        </SettingsSection>

        {/* ---------------------------------------------------------------- */}
        {/* Sign out + footer                                                  */}
        {/* ---------------------------------------------------------------- */}
        <TouchableOpacity
          testID="sign-out-button"
          onPress={handleSignOut}
          accessibilityRole="button"
          accessibilityLabel="Sign out"
          activeOpacity={0.85}
          style={styles.signOutTouch}
        >
          <GlassCard radius={20} style={styles.signOutCard}>
            <View style={styles.signOutInner}>
              <AppIcon name="log-out" size={16} color={palette.peach[300]} />
              <Text
                style={[styles.signOutLabel, { color: palette.peach[300] }]}
              >
                Sign out
              </Text>
            </View>
          </GlassCard>
        </TouchableOpacity>

        <Text
          testID="version-footer"
          style={[styles.footer, { color: palette.warm[500] }]}
          accessibilityRole="text"
        >
          Solace v4.2.0 · Made with care
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}

// ---------------------------------------------------------------------------
// Sub-component — StatTile
// ---------------------------------------------------------------------------

interface StatTileProps {
  testID?: string;
  iconName: string;
  iconColor: string;
  value: string;
  unit: string;
  label: string;
}

function StatTile({
  testID,
  iconName,
  iconColor,
  value,
  unit,
  label,
}: StatTileProps): React.ReactElement {
  const { palette } = useTheme();

  return (
    <GlassCard
      testID={testID}
      radius={20}
      style={styles.statTile}
      accessibilityRole="text"
      accessibilityLabel={`${label}: ${value}${unit}`}
    >
      <AppIcon name={iconName} size={14} color={iconColor} />
      <Text style={[styles.statValue, { color: palette.warm[50] }]}>
        {value}
        {unit ? (
          <Text style={[styles.statUnit, { color: palette.warm[400] }]}>
            {unit}
          </Text>
        ) : null}
      </Text>
      <BracketLabel variant="muted">{label}</BracketLabel>
    </GlassCard>
  );
}

// ---------------------------------------------------------------------------
// Styles (alphabetically sorted)
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  avatarInitial: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 30,
    lineHeight: 34,
  },
  avatarInner: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  avatarWrap: {
    position: "relative",
  },
  cameraBadge: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 2,
    bottom: -4,
    height: 36,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    position: "absolute",
    right: -8,
    width: 36,
  },
  container: {
    flex: 1,
  },
  footer: {
    fontFamily: "FiraCode_400Regular",
    fontSize: 9,
    marginTop: 12,
    textAlign: "center",
  },
  name: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 26,
    lineHeight: 30,
    marginTop: 16,
    textAlign: "center",
  },
  premiumChip: {
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    gap: 5,
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  profileHeader: {
    alignItems: "center",
    paddingTop: 8,
  },
  scroll: {
    paddingBottom: 40,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  signOutCard: {
    minHeight: 52,
  },
  signOutInner: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: 16,
  },
  signOutLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
  },
  signOutTouch: {
    marginTop: 16,
  },
  statTile: {
    alignItems: "center",
    flex: 1,
    gap: 6,
    padding: 14,
  },
  statUnit: {
    fontFamily: "FiraCode_400Regular",
    fontSize: 10,
  },
  statValue: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 22,
    lineHeight: 24,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 24,
  },
  supportSpacer: {
    height: 16,
  },
});

export default ProfileDashboardScreen;
