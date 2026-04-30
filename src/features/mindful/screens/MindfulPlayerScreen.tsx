/**
 * MindfulPlayerScreen — prototype v4.2 #31 Meditation Player reskin.
 *
 * Cosmic gradient artwork tile, scrub bar, 5-button TransportControls,
 * and 4 bottom action buttons. Maps to `prototypes/screens/31-mindful-player.js`.
 *
 * Backwards-compatible: the legacy API (soundName / instruction / elapsedTime /
 * totalTime / progress) has been replaced by the richer v4.2 prop surface;
 * consumers should migrate to the new MindfulPlayerScreenProps interface.
 *
 * @task Task 31: Mindful Player Screen v4.2 reskin
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

import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { useTheme } from "@/shared/theme/useTheme";
import { AppIcon } from "@/shared/components/atoms/display/AppIcon";
import { ScreenContainer } from "@/shared/components/atoms/layout";
import { TransportControls } from "@/shared/components/molecules/controls/TransportControls";
import { BracketLabel, BreathingOrb } from "@/shared/components/primitives";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ArtworkVariant = "sage-aurora" | "aurora-lavender" | "peach-aurora";

export interface MindfulPlayerScreenProps {
  /** Session title — e.g., "Morning calm" */
  title: string;
  /** Total duration in seconds */
  durationSeconds: number;
  /** Current playback position in seconds */
  positionSeconds: number;
  /** Whether playback is active */
  isPlaying: boolean;
  /** Optional category bracket (e.g., "MEDITATION") */
  category?: string;
  /** Optional narrator/author bracket (e.g., "MAYA WONG") */
  narrator?: string;
  /** Optional cover artwork variant */
  artworkVariant?: ArtworkVariant;
  onClose: () => void;
  onPlayPause: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  /** Skip back 15 seconds */
  onRewind?: () => void;
  /** Skip forward 15 seconds */
  onForward?: () => void;
  onSpeedToggle?: () => void;
  onLikeToggle?: () => void;
  liked?: boolean;
  onLoopToggle?: () => void;
  looping?: boolean;
  onDownload?: () => void;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const formatMMSS = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-unused-vars
type ArtworkGradientMap = Record<ArtworkVariant, (p: any) => [string, string, string]>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ARTWORK_GRADIENTS: ArtworkGradientMap = {
  "sage-aurora": (p) => [p.sage[300], p.aurora[300], p.lavender[300]],
  "aurora-lavender": (p) => [p.aurora[300], p.lavender[300], p.aurora[500]],
  "peach-aurora": (p) => [p.peach[300], p.aurora[300], p.lavender[300]],
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MindfulPlayerScreen({
  title,
  durationSeconds,
  positionSeconds,
  isPlaying,
  category = "MEDITATION",
  narrator,
  artworkVariant = "sage-aurora",
  onClose,
  onPlayPause,
  onNext,
  onPrev,
  onRewind,
  onForward,
  onSpeedToggle,
  onLikeToggle,
  liked = false,
  onLoopToggle,
  looping = false,
  onDownload,
  testID = "mindful-player-screen",
  style: _style,
}: MindfulPlayerScreenProps): React.ReactElement {
  const { palette } = useTheme();
  const reducedMotion = useReducedMotion();

  const progressRatio = useMemo(
    () =>
      durationSeconds > 0
        ? Math.min(positionSeconds / durationSeconds, 1)
        : 0,
    [positionSeconds, durationSeconds],
  );

  const currentTimeLabel = formatMMSS(positionSeconds);
  const totalTimeLabel = formatMMSS(durationSeconds);

  const durationMinutes = Math.round(durationSeconds / 60);
  const categoryBracket = `${category} · ${durationMinutes} MIN`;
  const artworkColors = ARTWORK_GRADIENTS[artworkVariant](palette);

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
        {/* ── Header ──────────────────────────────────────────────── */}
        <View style={styles.header}>
          <BracketLabel variant="aurora" style={styles.headerLabel}>
            NOW PLAYING
          </BracketLabel>
          <TouchableOpacity
            testID="close-button"
            style={[
              styles.iconButton,
              { backgroundColor: palette.midnight[800], borderColor: palette.midnight[600] },
            ]}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close player"
          >
            <AppIcon name="x" size={16} color={palette.warm[400]} />
          </TouchableOpacity>
        </View>

        {/* ── Artwork tile ─────────────────────────────────────────── */}
        <View style={styles.artworkWrapper}>
          <LinearGradient
            testID="artwork-tile"
            colors={artworkColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.artworkTile}
            accessibilityRole="image"
            accessibilityLabel={`${title} cover art`}
          >
            <BreathingOrb
              size={160}
              tint="cool"
              pulsing={!reducedMotion}
              accessibilityLabel={undefined}
            />
          </LinearGradient>
        </View>

        {/* ── Session info ─────────────────────────────────────────── */}
        <View style={styles.infoSection}>
          <BracketLabel variant="aurora" style={styles.categoryLabel}>
            {categoryBracket}
          </BracketLabel>
          <Text
            testID="session-title"
            accessibilityRole="header"
            style={[styles.sessionTitle, { color: palette.warm[50] }]}
          >
            {title}
          </Text>
          {narrator ? (
            <BracketLabel variant="muted" style={styles.narratorLabel}>
              {`NARRATED BY · ${narrator}`}
            </BracketLabel>
          ) : null}
        </View>

        {/* ── Progress bar ─────────────────────────────────────────── */}
        <View
          testID="progress-section"
          style={styles.progressSection}
          accessibilityRole="none"
        >
          <View
            testID="progress-track"
            style={[styles.progressTrack, { backgroundColor: palette.midnight[700] }]}
            accessibilityRole="progressbar"
            accessibilityLabel="Playback progress"
            accessibilityValue={{ min: 0, max: 100, now: Math.round(progressRatio * 100) }}
          >
            <LinearGradient
              testID="progress-fill"
              colors={[palette.sage[300], palette.aurora[300]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${progressRatio * 100}%` as `${number}%` }]}
            />
          </View>
          <View style={styles.timeRow}>
            <Text
              testID="current-time"
              style={[styles.timeText, { color: palette.warm[200] }]}
            >
              {currentTimeLabel}
            </Text>
            <Text
              testID="total-time"
              style={[styles.timeText, { color: palette.warm[500] }]}
            >
              {totalTimeLabel}
            </Text>
          </View>
        </View>

        {/* ── Transport controls ───────────────────────────────────── */}
        <TransportControls
          testID="transport-controls"
          isPlaying={isPlaying}
          onPlayPause={onPlayPause}
          onPrev={onPrev}
          onNext={onNext}
          onRewind={onRewind}
          onForward={onForward}
          style={styles.transport}
        />

        {/* ── Bottom action buttons ────────────────────────────────── */}
        <View style={styles.actionsRow}>
          {/* Speed */}
          <TouchableOpacity
            testID="speed-button"
            style={styles.actionButton}
            onPress={onSpeedToggle}
            disabled={!onSpeedToggle}
            accessibilityRole="button"
            accessibilityLabel="Playback speed"
          >
            <View style={[styles.actionIcon, { backgroundColor: palette.midnight[800] }]}>
              <AppIcon name="gauge" size={20} color={palette.warm[400]} />
            </View>
            <BracketLabel variant="muted" style={styles.actionLabel}>
              1.0×
            </BracketLabel>
          </TouchableOpacity>

          {/* Like */}
          <TouchableOpacity
            testID="like-button"
            style={styles.actionButton}
            onPress={onLikeToggle}
            disabled={!onLikeToggle}
            accessibilityRole="button"
            accessibilityLabel={liked ? "Unlike session" : "Like session"}
            accessibilityState={{ selected: liked }}
          >
            <View style={[styles.actionIcon, { backgroundColor: palette.midnight[800] }]}>
              <AppIcon
                name="heart"
                size={20}
                color={liked ? palette.peach[300] : palette.warm[400]}
              />
            </View>
            <BracketLabel variant={liked ? "peach" : "muted"} style={styles.actionLabel}>
              LIKE
            </BracketLabel>
          </TouchableOpacity>

          {/* Loop */}
          <TouchableOpacity
            testID="loop-button"
            style={styles.actionButton}
            onPress={onLoopToggle}
            disabled={!onLoopToggle}
            accessibilityRole="button"
            accessibilityLabel={looping ? "Disable loop" : "Enable loop"}
            accessibilityState={{ selected: looping }}
          >
            <View style={[styles.actionIcon, { backgroundColor: palette.midnight[800] }]}>
              <AppIcon
                name="repeat"
                size={20}
                color={looping ? palette.aurora[300] : palette.warm[400]}
              />
            </View>
            <BracketLabel variant={looping ? "aurora" : "muted"} style={styles.actionLabel}>
              LOOP
            </BracketLabel>
          </TouchableOpacity>

          {/* Download */}
          <TouchableOpacity
            testID="download-button"
            style={styles.actionButton}
            onPress={onDownload}
            disabled={!onDownload}
            accessibilityRole="button"
            accessibilityLabel="Download session"
          >
            <View style={[styles.actionIcon, { backgroundColor: palette.midnight[800] }]}>
              <AppIcon name="download" size={20} color={palette.warm[400]} />
            </View>
            <BracketLabel variant="muted" style={styles.actionLabel}>
              SAVE
            </BracketLabel>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: "center",
    minHeight: 56,
    minWidth: 56,
  },
  actionIcon: {
    alignItems: "center",
    borderRadius: 16,
    height: 56,
    justifyContent: "center",
    width: 56,
  },
  actionLabel: {
    marginTop: 6,
    textAlign: "center",
  },
  actionsRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 32,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  artworkTile: {
    alignItems: "center",
    borderRadius: 24,
    height: 320,
    justifyContent: "center",
    overflow: "hidden",
    width: 320,
  },
  artworkWrapper: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 8,
  },
  categoryLabel: {
    marginBottom: 8,
    textAlign: "center",
  },
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  headerLabel: {
    flex: 1,
  },
  iconButton: {
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  infoSection: {
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  narratorLabel: {
    marginTop: 4,
    textAlign: "center",
  },
  progressFill: {
    borderRadius: 2,
    height: 4,
  },
  progressSection: {
    marginBottom: 28,
    paddingHorizontal: 24,
  },
  progressTrack: {
    borderRadius: 2,
    height: 4,
    marginBottom: 8,
    overflow: "hidden",
  },
  scroll: {
    paddingBottom: 16,
  },
  sessionTitle: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 28,
    lineHeight: 32,
    marginBottom: 4,
    textAlign: "center",
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeText: {
    fontFamily: "FiraCode_400Regular",
    fontSize: 12,
  },
  transport: {
    marginBottom: 20,
  },
});

export default MindfulPlayerScreen;
