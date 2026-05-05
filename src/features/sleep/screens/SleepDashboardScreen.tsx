/**
 * SleepDashboardScreen — prototype v4.2 #11 reskin (Sprint 8 Batch C).
 *
 * Night-sky LinearGradient backdrop with StarField + lavender SmokeBlob,
 * mini-header (back / "[ Sleep ]" / more), HeroCard "Last night" duration,
 * GlassCard with SleepStagesBar + 4-col stage grid, GlassAuroraCard insight,
 * GlassCard 7-day HistoryBars, and a primary "Log tonight's sleep" CTA.
 *
 * Maps to `prototypes/screens/11-sleep.js`.
 */

import React, { useMemo } from "react";
import {
  ScrollView,
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
  GlassAuroraCard,
  GlassCard,
  HeroCard,
  SmokeBlob,
  StarField,
} from "@/shared/components/primitives";
import {
  HistoryBars,
  SleepStagesBar,
  type SleepHistoryDay,
} from "@/shared/components/organisms/sleep";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SleepEntry {
  /** Total sleep duration in minutes */
  durationMinutes: number;
  /** Quality percentage 0-100 */
  qualityPercent: number;
  /** Bedtime display string e.g. "11:14 PM" */
  bedtime: string;
  /** Wake time display string e.g. "7:02 AM" */
  wakeTime: string;
  /** Stage breakdown in minutes */
  stages: {
    deep: number;
    core: number;
    rem: number;
    awake: number;
  };
}

export interface SleepDashboardScreenProps {
  /** Last night's sleep entry — defaults provided for empty/test render. */
  lastNight?: SleepEntry;
  /** Weekly history (must be 7 days when provided). */
  weekHistory?: SleepHistoryDay[];
  onBack: () => void;
  onLogSleep: () => void;
  onMore?: () => void;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Defaults / fixtures
// ---------------------------------------------------------------------------

const DEFAULT_ENTRY: SleepEntry = {
  durationMinutes: 7 * 60 + 48,
  qualityPercent: 86,
  bedtime: "11:14 PM",
  wakeTime: "7:02 AM",
  stages: { deep: 112, core: 225, rem: 66, awake: 65 },
};

const DEFAULT_HISTORY: SleepHistoryDay[] = [
  { label: "M", hours: 5.2 },
  { label: "T", hours: 6.8 },
  { label: "W", hours: 7.4 },
  { label: "T", hours: 6.5 },
  { label: "F", hours: 7.8 },
  { label: "S", hours: 8.1 },
  { label: "S", hours: 7.8, isToday: true },
];

const formatHM = (mins: number): { h: number; m: number } => ({
  h: Math.floor(mins / 60),
  m: mins % 60,
});

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SleepDashboardScreen({
  lastNight = DEFAULT_ENTRY,
  weekHistory = DEFAULT_HISTORY,
  onBack,
  onLogSleep,
  onMore,
  testID = "sleep-dashboard-screen",
  style,
}: SleepDashboardScreenProps): React.ReactElement {
  const { palette, typography } = useTheme();

  const { h, m } = formatHM(lastNight.durationMinutes);
  const stageRows = useMemo(
    () => [
      { id: "deep", label: "Deep", value: lastNight.stages.deep, color: palette.lavender[300] },
      { id: "core", label: "Core", value: lastNight.stages.core, color: palette.sage[300] },
      { id: "rem", label: "REM", value: lastNight.stages.rem, color: palette.peach[300] },
      { id: "awake", label: "Awake", value: lastNight.stages.awake, color: palette.warm[200] },
    ],
    [
      lastNight.stages.deep,
      lastNight.stages.core,
      lastNight.stages.rem,
      lastNight.stages.awake,
      palette.lavender,
      palette.sage,
      palette.peach,
      palette.warm,
    ],
  );

  const formatStageLabel = (mins: number): string => {
    const mh = Math.floor(mins / 60);
    const mm = mins % 60;
    return mh > 0 ? `${mh}h ${String(mm).padStart(2, "0")}m` : `${mm}m`;
  };

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={[styles.container, style]}
    >
      {/* Night sky gradient backdrop */}
      <LinearGradient
        testID="night-sky-gradient"
        colors={[palette.midnight[700], palette.midnight[800], palette.midnight[950]]}
        locations={[0, 0.35, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* Stars + lavender smoke */}
      <View
        testID="star-field"
        style={styles.starField}
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <StarField count={24} width={380} height={320} seed={11} />
      </View>
      <View
        style={styles.smokeWrap}
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <SmokeBlob size={200} tint="lavender" opacity={0.5} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Mini-header */}
        <View style={styles.header}>
          <TouchableOpacity
            testID="back-button"
            style={[
              styles.iconBtn,
              { backgroundColor: palette.midnight[800], borderColor: palette.midnight[600] },
            ]}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <AppIcon name="arrow-left" size={18} color={palette.warm[100]} />
          </TouchableOpacity>

          <BracketLabel variant="muted">Sleep</BracketLabel>

          <TouchableOpacity
            testID="more-button"
            style={[
              styles.iconBtn,
              { backgroundColor: palette.midnight[800], borderColor: palette.midnight[600] },
            ]}
            onPress={onMore}
            disabled={!onMore}
            accessibilityRole="button"
            accessibilityLabel="Sleep options"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <AppIcon name="more-horizontal" size={18} color={palette.warm[100]} />
          </TouchableOpacity>
        </View>

        {/* Hero last-night card */}
        <HeroCard radius={24} style={styles.heroCard}>
          <GlassCard variant="strong" radius={23} style={styles.heroInner}>
            <View
              style={styles.heroBlobWrap}
              pointerEvents="none"
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            >
              <SmokeBlob size={180} tint="lavender" opacity={0.45} />
            </View>

            <View style={styles.heroBracketRow}>
              <AppIcon name="moon" size={14} color={palette.lavender[300]} />
              <BracketLabel variant="default" style={styles.heroBracket}>
                Last night
              </BracketLabel>
            </View>

            <Text
              testID="duration-display"
              accessibilityRole="text"
              accessibilityLabel={`${h} hours ${m} minutes`}
              style={[
                styles.heroDuration,
                { color: palette.warm[50], fontFamily: typography.fontFamily.displayRegular },
              ]}
            >
              <Text>{`${h}`}</Text>
              <Text
                style={[
                  styles.heroUnit,
                  { color: palette.warm[400], fontFamily: typography.fontFamily.mono },
                ]}
              >
                h
              </Text>
              <Text>{` ${String(m).padStart(2, "0")}`}</Text>
              <Text
                style={[
                  styles.heroUnit,
                  { color: palette.warm[400], fontFamily: typography.fontFamily.mono },
                ]}
              >
                m
              </Text>
            </Text>

            <View style={styles.heroMetaRow}>
              <View
                style={[
                  styles.qualityChip,
                  { backgroundColor: `${palette.sage[300]}${palette.alpha[15]}` },
                ]}
              >
                <Text
                  testID="quality-text"
                  style={[
                    styles.qualityChipText,
                    { color: palette.sage[300], fontFamily: typography.fontFamily.sansMedium },
                  ]}
                >
                  Quality
                  <Text style={{ fontFamily: typography.fontFamily.mono }}>{` ${lastNight.qualityPercent}%`}</Text>
                </Text>
              </View>
              <Text
                style={[
                  styles.heroSchedule,
                  { color: palette.warm[500], fontFamily: typography.fontFamily.mono },
                ]}
              >
                {`${lastNight.bedtime} — ${lastNight.wakeTime}`}
              </Text>
            </View>
          </GlassCard>
        </HeroCard>

        {/* Sleep stages */}
        <GlassCard radius={20} style={styles.stagesCard} testID="sleep-stages-card">
          <View style={styles.stagesHeader}>
            <Text
              style={[
                styles.cardTitle,
                { color: palette.warm[50], fontFamily: typography.fontFamily.sansMedium },
              ]}
            >
              Sleep stages
            </Text>
            <BracketLabel variant="muted">Per hypnogram</BracketLabel>
          </View>

          <SleepStagesBar
            testID="sleep-stages-bar"
            stages={[
              { type: "deep", durationMinutes: lastNight.stages.deep },
              { type: "light", durationMinutes: lastNight.stages.core, label: "Core" },
              { type: "rem", durationMinutes: lastNight.stages.rem },
              { type: "awake", durationMinutes: lastNight.stages.awake },
            ]}
            showLabels={false}
          />

          <View style={styles.stagesGrid}>
            {stageRows.map((row) => (
              <View key={row.id} style={styles.stageCell}>
                <View style={styles.stageDotRow}>
                  <View style={[styles.stageDot, { backgroundColor: row.color }]} />
                  <BracketLabel variant="muted" style={styles.stageDotLabel}>
                    {row.label}
                  </BracketLabel>
                </View>
                <Text
                  style={[
                    styles.stageValue,
                    { color: palette.warm[50], fontFamily: typography.fontFamily.mono },
                  ]}
                >
                  {formatStageLabel(row.value)}
                </Text>
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Insight */}
        <GlassAuroraCard radius={20} style={styles.insightCard}>
          <View style={styles.insightRow}>
            <View
              style={[
                styles.insightIconWrap,
                {
                  backgroundColor: `${palette.sage[300]}${palette.alpha[15]}`,
                  borderColor: `${palette.sage[300]}${palette.alpha[30]}`,
                },
              ]}
            >
              <AppIcon name="sparkles" size={16} color={palette.sage[300]} />
            </View>
            <View style={styles.insightTextWrap}>
              <Text
                style={[
                  styles.insightTitle,
                  { color: palette.warm[50], fontFamily: typography.fontFamily.sansMedium },
                ]}
              >
                Your best sleep this week
              </Text>
              <Text
                style={[
                  styles.insightSubtitle,
                  { color: palette.warm[500], fontFamily: typography.fontFamily.sans },
                ]}
              >
                You went to bed 30 min earlier — keep it up.
              </Text>
            </View>
          </View>
        </GlassAuroraCard>

        {/* Weekly history */}
        <GlassCard radius={20} style={styles.historyCard} testID="weekly-history-card">
          <View style={styles.stagesHeader}>
            <Text
              style={[
                styles.cardTitle,
                { color: palette.warm[50], fontFamily: typography.fontFamily.sansMedium },
              ]}
            >
              7-day history
            </Text>
            <Text
              style={[
                styles.historyAvg,
                { color: palette.warm[500], fontFamily: typography.fontFamily.sans },
              ]}
            >
              Avg
              <Text style={{ color: palette.warm[200], fontFamily: typography.fontFamily.mono }}>
                {" 7.2h"}
              </Text>
            </Text>
          </View>
          <View style={styles.historyBarsWrap}>
            <HistoryBars days={weekHistory} goalHours={8} height={120} />
          </View>
        </GlassCard>

        {/* CTA */}
        <Button
          testID="log-sleep-button"
          label="Log tonight's sleep"
          variant="primary"
          fullWidth
          onPress={onLogSleep}
          accessibilityLabel="Log tonight's sleep"
          leftIcon={<AppIcon name="moon" size={16} color={palette.warm[50]} />}
          style={styles.cta}
        />
      </ScrollView>
    </ScreenContainer>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  cardTitle: {
    fontSize: 14,
  },
  container: {
    flex: 1,
  },
  cta: {
    marginTop: 24,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  heroBlobWrap: {
    position: "absolute",
    right: -40,
    top: -40,
  },
  heroBracket: {
    marginLeft: 6,
  },
  heroBracketRow: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 12,
  },
  heroCard: {
    marginBottom: 16,
  },
  heroDuration: {
    fontSize: 60,
    letterSpacing: -1.2,
    lineHeight: 64,
  },
  heroInner: {
    overflow: "hidden",
    padding: 24,
  },
  heroMetaRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  heroSchedule: {
    fontSize: 10,
  },
  heroUnit: {
    fontSize: 28,
  },
  historyAvg: {
    fontSize: 10,
  },
  historyBarsWrap: {
    alignItems: "center",
    marginTop: 12,
  },
  historyCard: {
    marginTop: 16,
    padding: 20,
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
  insightCard: {
    marginTop: 16,
    padding: 16,
  },
  insightIconWrap: {
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  insightRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  insightSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  insightTextWrap: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 13,
  },
  qualityChip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  qualityChipText: {
    fontSize: 11,
  },
  scroll: {
    paddingBottom: 40,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  smokeWrap: {
    position: "absolute",
    right: -20,
    top: 40,
  },
  stageCell: {
    flex: 1,
  },
  stageDot: {
    borderRadius: 4,
    height: 6,
    marginRight: 6,
    width: 6,
  },
  stageDotLabel: {
    fontSize: 9,
  },
  stageDotRow: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 4,
  },
  stageValue: {
    fontSize: 11,
  },
  stagesCard: {
    padding: 20,
  },
  stagesGrid: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  stagesHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  starField: {
    height: 320,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
});

export default SleepDashboardScreen;
