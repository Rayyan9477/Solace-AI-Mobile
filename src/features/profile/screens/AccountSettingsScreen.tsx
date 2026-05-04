/**
 * AccountSettingsScreen — prototype v4.2 #37 reskin (Sprint 9).
 *
 * Cosmic v4.2 settings surface. miniHeader "Settings" only, Fraunces "Account"
 * h1, HeroCard profile row (avatar + name + email + Plus chip), three
 * SettingsSection groups (Account / Preferences / Privacy & safety), full-width
 * peach Sign out card, and the Solace v4.2.0 monospace footer.
 *
 * Maps to `prototypes/screens/37-account-settings.js`.
 */

import React from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { AppIcon } from "@/shared/components/atoms/display/AppIcon";
import { ScreenContainer } from "@/shared/components/atoms/layout";
import { SettingsRow } from "@/shared/components/molecules/lists/SettingsRow";
import { SettingsSection } from "@/shared/components/molecules/lists/SettingsSection";
import {
  AvatarRing,
  BracketLabel,
  GlassCard,
  HeroCard,
} from "@/shared/components/primitives";
import { useTheme } from "@/shared/theme/useTheme";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface AccountSettingsScreenProps {
  userName?: string;
  userEmail?: string;
  userInitial?: string;
  subscriptionLabel?: string;
  notificationsEnabled?: boolean;
  themeLabel?: string;
  languageLabel?: string;
  checkInTime?: string;
  faceIdEnabled?: boolean;

  onBack: () => void;
  onPersonalInfo?: () => void;
  onEmail?: () => void;
  onChangePassword?: () => void;
  onSubscription?: () => void;
  onNotifications?: () => void;
  onAppearance?: () => void;
  onLanguage?: () => void;
  onCheckInTime?: () => void;
  onPrivacy?: () => void;
  onFaceIdToggle?: (enabled: boolean) => void;
  onExportData?: () => void;
  onDeleteAccount?: () => void;
  onSignOut?: () => void;

  /** @deprecated legacy stack — ignored. */
  sections?: unknown;
  /** @deprecated legacy stack — ignored. */
  onItemPress?: (id: string) => void;
  /** @deprecated legacy stack — ignored. */
  onToggle?: (id: string, value: boolean) => void;

  testID?: string;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AccountSettingsScreen({
  userName = "Rayyan Ahmed",
  userEmail = "rayyan@solace.ai",
  userInitial,
  subscriptionLabel = "Plus Annual",
  notificationsEnabled = true,
  themeLabel = "Dark",
  languageLabel = "English",
  checkInTime = "9:00 AM",
  faceIdEnabled = true,

  onBack,
  onPersonalInfo,
  onEmail,
  onChangePassword,
  onSubscription,
  onNotifications,
  onAppearance,
  onLanguage,
  onCheckInTime,
  onPrivacy,
  onFaceIdToggle,
  onExportData,
  onDeleteAccount,
  onSignOut,

  testID = "account-settings-screen",
  style,
}: AccountSettingsScreenProps): React.ReactElement {
  const { palette, typography } = useTheme();

  const initial = userInitial ?? userName.charAt(0).toUpperCase();

  const handleFaceIdToggle = (value: boolean): void => {
    onFaceIdToggle?.(value);
  };

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={style as ViewStyle | undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* miniHeader: back + "Settings" centered */}
        <View style={styles.miniHeader}>
          <TouchableOpacity
            testID="back-button"
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
            style={[
              styles.iconButton,
              {
                backgroundColor: palette.midnight[800],
                borderColor: palette.midnight[600],
              },
            ]}
          >
            <AppIcon name="arrow-left" size={16} color={palette.warm[400]} />
          </TouchableOpacity>

          <BracketLabel variant="muted">Settings</BracketLabel>

          <View style={styles.miniHeaderSpacer} />
        </View>

        {/* Account headline */}
        <Text
          testID="account-headline"
          accessibilityRole="header"
          style={[
            styles.headline,
            {
              color: palette.warm[50],
              fontFamily: typography.fontFamily.displayRegular,
            },
          ]}
        >
          Account
        </Text>

        {/* Profile card */}
        <HeroCard testID="profile-card" radius={20} style={styles.profileCard}>
          <View
            style={[
              styles.profileInner,
              { backgroundColor: palette.midnight[800] },
            ]}
          >
            <AvatarRing
              size={48}
              ringWidth={2}
              variant="sage-aurora-peach"
              glow={false}
            >
              <View
                style={[
                  styles.avatarInner,
                  { backgroundColor: palette.midnight[800] },
                ]}
              >
                <Text
                  testID="profile-avatar-initial"
                  style={[
                    styles.avatarInitial,
                    {
                      color: palette.warm[50],
                      fontFamily: typography.fontFamily.displayRegular,
                    },
                  ]}
                  accessibilityRole="text"
                >
                  {initial}
                </Text>
              </View>
            </AvatarRing>

            <View style={styles.profileBody}>
              <Text
                testID="profile-name"
                style={[
                  styles.profileName,
                  {
                    color: palette.warm[50],
                    fontFamily: typography.fontFamily.sansMedium,
                  },
                ]}
                numberOfLines={1}
              >
                {userName}
              </Text>
              <Text
                testID="profile-email"
                style={[
                  styles.profileEmail,
                  {
                    color: palette.warm[500],
                    fontFamily: typography.fontFamily.mono,
                  },
                ]}
                numberOfLines={1}
              >
                {userEmail}
              </Text>
            </View>

            <View
              testID="plus-chip"
              style={[
                styles.plusChip,
                {
                  backgroundColor: palette.opacity.white08,
                  borderColor: palette.sage[300],
                },
              ]}
              accessibilityRole="text"
              accessibilityLabel="Plus subscriber"
            >
              <AppIcon name="plus" size={11} color={palette.sage[300]} />
              <Text
                style={[
                  styles.plusChipText,
                  {
                    color: palette.sage[300],
                    fontFamily: typography.fontFamily.sansMedium,
                  },
                ]}
              >
                Plus
              </Text>
            </View>
          </View>
        </HeroCard>

        {/* Account section */}
        <View style={styles.sectionSpacer} />
        <SettingsSection title="Account" testID="account-section">
          <SettingsRow
            testID="row-personal-info"
            iconName="user"
            iconHue="sage"
            label="Personal information"
            onPress={onPersonalInfo}
          />
          <SettingsRow
            testID="row-email"
            iconName="mail"
            iconHue="sage"
            label="Email address"
            value={userEmail}
            onPress={onEmail}
          />
          <SettingsRow
            testID="row-change-password"
            iconName="lock"
            iconHue="sage"
            label="Change password"
            onPress={onChangePassword}
          />
          <SettingsRow
            testID="row-subscription"
            iconName="credit-card"
            iconHue="sage"
            label="Subscription"
            value={subscriptionLabel}
            onPress={onSubscription}
          />
        </SettingsSection>

        {/* Preferences section */}
        <View style={styles.sectionSpacer} />
        <SettingsSection title="Preferences" testID="preferences-section">
          <SettingsRow
            testID="row-notifications"
            iconName="bell"
            iconHue="sage"
            label="Notifications"
            value={notificationsEnabled ? "On" : "Off"}
            onPress={onNotifications}
          />
          <SettingsRow
            testID="row-appearance"
            iconName="moon"
            iconHue="sage"
            label="Appearance"
            value={themeLabel}
            onPress={onAppearance}
          />
          <SettingsRow
            testID="row-language"
            iconName="globe"
            iconHue="sage"
            label="Language"
            value={languageLabel}
            onPress={onLanguage}
          />
          <SettingsRow
            testID="row-checkin-time"
            iconName="clock"
            iconHue="sage"
            label="Daily check-in"
            value={checkInTime}
            onPress={onCheckInTime}
          />
        </SettingsSection>

        {/* Privacy & safety section */}
        <View style={styles.sectionSpacer} />
        <SettingsSection title="Privacy & safety" testID="privacy-section">
          <SettingsRow
            testID="row-privacy"
            iconName="shield"
            iconHue="sage"
            label="Privacy & security"
            onPress={onPrivacy}
          />
          <SettingsRow
            testID="row-face-id"
            iconName="scan-face"
            iconHue="sage"
            label="Face ID"
            rightSlot={
              <Switch
                testID="face-id-switch"
                value={faceIdEnabled}
                onValueChange={handleFaceIdToggle}
                accessibilityLabel="Toggle Face ID"
                accessibilityRole="switch"
                accessibilityState={{ checked: faceIdEnabled }}
                trackColor={{
                  false: palette.midnight[600],
                  true: palette.sage[300],
                }}
                thumbColor={palette.warm[50]}
              />
            }
          />
          <SettingsRow
            testID="row-export-data"
            iconName="download"
            iconHue="sage"
            label="Export my data"
            onPress={onExportData}
          />
          <SettingsRow
            testID="row-delete-account"
            iconName="trash-2"
            label="Delete account"
            destructive
            onPress={onDeleteAccount}
          />
        </SettingsSection>

        {/* Sign out card */}
        <TouchableOpacity
          testID="sign-out-button"
          onPress={onSignOut}
          accessibilityRole="button"
          accessibilityLabel="Sign out"
          activeOpacity={0.85}
          style={styles.signOutTouch}
        >
          <GlassCard radius={20} style={styles.signOutCard}>
            <View style={styles.signOutInner}>
              <AppIcon name="log-out" size={16} color={palette.peach[300]} />
              <Text
                style={[
                  styles.signOutLabel,
                  {
                    color: palette.peach[300],
                    fontFamily: typography.fontFamily.sansMedium,
                  },
                ]}
              >
                Sign out
              </Text>
            </View>
          </GlassCard>
        </TouchableOpacity>

        {/* Footer */}
        <Text
          testID="version-footer"
          style={[
            styles.footer,
            {
              color: palette.warm[500],
              fontFamily: typography.fontFamily.mono,
            },
          ]}
          accessibilityRole="text"
        >
          Solace v4.2.0 · Made with care
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}

// ---------------------------------------------------------------------------
// Styles (alphabetically sorted)
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  avatarInitial: {
    fontSize: 18,
    lineHeight: 22,
  },
  avatarInner: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  footer: {
    fontSize: 9,
    marginTop: 16,
    textAlign: "center",
  },
  headline: {
    fontSize: 30,
    fontWeight: "300",
    lineHeight: 34,
    marginBottom: 16,
    marginTop: 12,
  },
  iconButton: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  miniHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  miniHeaderSpacer: {
    height: 44,
    width: 44,
  },
  plusChip: {
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  plusChipText: {
    fontSize: 11,
  },
  profileBody: {
    flex: 1,
    marginLeft: 12,
    minWidth: 0,
  },
  profileCard: {
    marginTop: 4,
  },
  profileEmail: {
    fontSize: 10,
    marginTop: 2,
  },
  profileInner: {
    alignItems: "center",
    borderRadius: 19,
    flexDirection: "row",
    minHeight: 64,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  profileName: {
    fontSize: 13,
    lineHeight: 17,
  },
  scroll: {
    paddingBottom: 40,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  sectionSpacer: {
    height: 16,
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
    fontSize: 13,
  },
  signOutTouch: {
    marginTop: 16,
  },
});

export default AccountSettingsScreen;
