/**
 * NoInternetScreen — prototype v4.2 #41 reskin (Sprint 9 Batch B).
 *
 * Cosmic offline state — friendly, not alarming. Warm SmokeBlob top, dashed
 * ring with `wifi-off` glyph, editorial Fraunces "You're / offline." headline,
 * primary "Try again" Button, ghost "Continue offline" link, plus a
 * "Still available offline" GlassCard listing chips for Journal / Breathing /
 * Sounds.
 *
 * Maps to `prototypes/screens/41-offline.js`.
 */

import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AppIcon } from "@/shared/components/atoms/display/AppIcon";
import { Button } from "@/shared/components/atoms/buttons/Button";
import { ScreenContainer } from "@/shared/components/atoms/layout";
import {
  BracketLabel,
  GlassCard,
  SmokeBlob,
} from "@/shared/components/primitives";
import { useTheme } from "@/shared/theme/useTheme";

// ─── Public API ──────────────────────────────────────────────────────────────

export interface NoInternetScreenProps {
  onRetry: () => void;
  onContinueOffline: () => void;
  testID?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function NoInternetScreen({
  onRetry,
  onContinueOffline,
  testID = "no-internet-screen",
}: NoInternetScreenProps): React.ReactElement {
  const { palette } = useTheme();

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={styles.screen}
    >
      <SmokeBlob
        tint="peach"
        size={320}
        opacity={0.32}
        style={styles.smokeBlob}
        testID="offline-smoke-blob"
      />

      {/* Header: spacer · bracket · spacer */}
      <View style={styles.headerRow}>
        <View style={styles.headerSpacer} />
        <View testID="offline-header-bracket">
          <BracketLabel variant="muted" style={styles.headerLabel}>
            Connection
          </BracketLabel>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Dashed wifi-off ring */}
        <View
          style={[
            styles.dashedRing,
            { borderColor: palette.warm[500] },
          ]}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          testID="offline-dashed-ring"
        >
          <AppIcon
            name="wifi-off"
            size={56}
            color={palette.warm[400]}
          />
        </View>

        {/* Bracket */}
        <View testID="offline-bracket">
          <BracketLabel variant="muted" style={styles.bracketLabel}>
            No connection
          </BracketLabel>
        </View>

        {/* Headline */}
        <Text
          testID="offline-headline"
          accessibilityRole="header"
          style={[styles.headline, { color: palette.warm[50] }]}
        >
          {"You're\n"}
          <Text style={styles.headlineItalic}>offline.</Text>
        </Text>

        {/* Subtitle */}
        <Text
          testID="offline-subtitle"
          style={[styles.subtitle, { color: palette.warm[400] }]}
          accessibilityRole="text"
        >
          {
            "No worries — your journal and recent sessions are saved locally. They'll sync when you're back."
          }
        </Text>

        {/* Try again CTA */}
        <Button
          testID="offline-retry-button"
          label="Try again"
          variant="primary"
          fullWidth
          onPress={onRetry}
          accessibilityLabel="Try again"
          leftIcon={
            <AppIcon
              name="refresh-cw"
              size={16}
              color={palette.warm[50]}
            />
          }
          style={{
            ...styles.retryButton,
            backgroundColor: palette.aurora[500],
          }}
          labelStyle={{ color: palette.warm[50] }}
        />

        {/* Continue offline link */}
        <TouchableOpacity
          testID="offline-continue-link"
          style={styles.continueLink}
          onPress={onContinueOffline}
          accessibilityRole="button"
          accessibilityLabel="Continue offline"
          hitSlop={{ top: 8, bottom: 8, left: 16, right: 16 }}
        >
          <Text style={[styles.continueText, { color: palette.warm[400] }]}>
            Continue offline
          </Text>
        </TouchableOpacity>

        {/* Still available offline */}
        <GlassCard
          testID="offline-available-card"
          style={styles.availableCard}
        >
          <View testID="offline-available-header">
            <BracketLabel variant="muted" style={styles.availableHeader}>
              Still available offline
            </BracketLabel>
          </View>
          <View style={styles.chipRow}>
            <OfflineChip
              testID="offline-chip-journal"
              iconName="pen-line"
              iconColor={palette.sage[300]}
              label="Journal"
              labelColor={palette.warm[100]}
              backgroundColor={palette.midnight[800]}
              borderColor={palette.midnight[600]}
            />
            <OfflineChip
              testID="offline-chip-breathing"
              iconName="wind"
              iconColor={palette.sage[300]}
              label="Breathing"
              labelColor={palette.warm[100]}
              backgroundColor={palette.midnight[800]}
              borderColor={palette.midnight[600]}
            />
            <OfflineChip
              testID="offline-chip-sounds"
              iconName="moon"
              iconColor={palette.lavender[300]}
              label="Sounds"
              labelColor={palette.warm[100]}
              backgroundColor={palette.midnight[800]}
              borderColor={palette.midnight[600]}
            />
          </View>
        </GlassCard>
      </ScrollView>
    </ScreenContainer>
  );
}

// ─── Internal: chip ──────────────────────────────────────────────────────────

interface OfflineChipProps {
  iconName: string;
  iconColor: string;
  label: string;
  labelColor: string;
  backgroundColor: string;
  borderColor: string;
  testID?: string;
}

function OfflineChip({
  iconName,
  iconColor,
  label,
  labelColor,
  backgroundColor,
  borderColor,
  testID,
}: OfflineChipProps): React.ReactElement {
  return (
    <View
      testID={testID}
      style={[styles.chip, { backgroundColor, borderColor }]}
      accessibilityRole="text"
      accessibilityLabel={label}
    >
      <AppIcon name={iconName} size={12} color={iconColor} />
      <Text style={[styles.chipText, { color: labelColor }]}>{label}</Text>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  availableCard: {
    marginTop: 24,
    maxWidth: 320,
    paddingHorizontal: 16,
    paddingVertical: 16,
    width: "100%",
  },
  availableHeader: {
    marginBottom: 10,
    textAlign: "center",
  },
  bracketLabel: {
    marginBottom: 8,
    textAlign: "center",
  },
  chip: {
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  chipText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
  },
  continueLink: {
    alignItems: "center",
    marginTop: 12,
    minHeight: 44,
    paddingVertical: 10,
  },
  continueText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
  },
  dashedRing: {
    alignItems: "center",
    borderRadius: 64,
    borderStyle: "dashed",
    borderWidth: 2,
    height: 128,
    justifyContent: "center",
    marginBottom: 24,
    width: 128,
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
    fontFamily: "Fraunces_300Light",
    fontSize: 30,
    lineHeight: 32,
    marginBottom: 12,
    textAlign: "center",
  },
  headlineItalic: {
    fontFamily: "Fraunces_400Regular_Italic",
    fontStyle: "italic",
  },
  retryButton: {
    borderRadius: 28,
    marginTop: 8,
    maxWidth: 320,
    width: "100%",
  },
  screen: {
    flex: 1,
  },
  scroll: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 40,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  smokeBlob: {
    left: -40,
    position: "absolute",
    top: -40,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 24,
    maxWidth: 260,
    textAlign: "center",
  },
});

export default NoInternetScreen;
