/**
 * SoundscapesScreen — prototype v4.2 #34 reskin (Sprint 8 Batch C).
 *
 * Night-sky LinearGradient backdrop with lavender SmokeBlob, mini "[ Sounds ]"
 * header, "[ Ambient ]" + Fraunces "Drift off gently" headline, a glass
 * now-playing mini-row with a 5-bar waveform thumbnail, and a 2-column grid
 * of 6 gradient sound tiles (active tile gets a lavender ring outline).
 *
 * Maps to `prototypes/screens/34-soundscapes.js`.
 */

import React from "react";
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
import { AppIcon } from "@/shared/components/atoms/display/AppIcon";
import { ScreenContainer } from "@/shared/components/atoms/layout";
import {
  BracketLabel,
  GlassCard,
  SmokeBlob,
} from "@/shared/components/primitives";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SoundscapeGradientKey =
  | "lavender"
  | "sage"
  | "forest"
  | "warm"
  | "peach"
  | "lavenderSoft";

export interface Soundscape {
  id: string;
  title: string;
  /** Display duration string (e.g., "60m", "∞"). */
  duration: string;
  iconName: string;
  gradient: SoundscapeGradientKey;
}

export interface NowPlayingState {
  id: string;
  title: string;
  /** Total minutes played for the current session. */
  minutes: number;
}

export interface SoundscapesScreenProps {
  nowPlaying?: NowPlayingState | null;
  sounds?: Soundscape[];
  onBack?: () => void;
  onSelectSound: (_id: string) => void;
  onTogglePlayback: () => void;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const DEFAULT_NOW_PLAYING: NowPlayingState = {
  id: "rain",
  title: "Gentle rain",
  minutes: 24,
};

const DEFAULT_SOUNDS: Soundscape[] = [
  { id: "rain", title: "Gentle rain", duration: "∞", iconName: "cloud-rain", gradient: "lavender" },
  { id: "ocean", title: "Ocean waves", duration: "∞", iconName: "waves", gradient: "sage" },
  { id: "forest", title: "Forest night", duration: "60m", iconName: "trees", gradient: "forest" },
  { id: "white-noise", title: "White noise", duration: "∞", iconName: "radio", gradient: "warm" },
  { id: "fire", title: "Crackling fire", duration: "45m", iconName: "flame", gradient: "peach" },
  { id: "bowl", title: "Tibetan bowl", duration: "20m", iconName: "circle-dot", gradient: "lavenderSoft" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SoundscapesScreen({
  nowPlaying = DEFAULT_NOW_PLAYING,
  sounds = DEFAULT_SOUNDS,
  onBack,
  onSelectSound,
  onTogglePlayback,
  testID = "soundscapes-screen",
  style,
}: SoundscapesScreenProps): React.ReactElement {
  const { palette, typography } = useTheme();

  const gradientFor = (key: SoundscapeGradientKey): [string, string] => {
    switch (key) {
      case "lavender":
        return [palette.lavender[300], palette.lavender[500]];
      case "lavenderSoft":
        return [palette.lavender[300], palette.lavender[500]];
      case "sage":
        return [palette.sage[300], palette.sage[700]];
      case "forest":
        return [palette.sage[700], palette.midnight[800]];
      case "warm":
        return [palette.warm[200], palette.warm[500]];
      case "peach":
        return [palette.peach[300], palette.peach[500]];
      default:
        return [palette.sage[300], palette.sage[700]];
    }
  };

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={[styles.container, style]}
    >
      {/* Night sky gradient */}
      <LinearGradient
        testID="night-sky-gradient"
        colors={[palette.midnight[700], palette.midnight[950]]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* Lavender smoke */}
      <View
        style={styles.smokeWrap}
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <SmokeBlob size={180} tint="lavender" opacity={0.5} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Mini header */}
        <View style={styles.header}>
          <TouchableOpacity
            testID="back-button"
            style={[
              styles.iconBtn,
              { backgroundColor: palette.midnight[800], borderColor: palette.midnight[600] },
            ]}
            onPress={onBack}
            disabled={!onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <AppIcon name="arrow-left" size={18} color={palette.warm[100]} />
          </TouchableOpacity>
          <BracketLabel variant="muted">Sounds</BracketLabel>
          <View style={styles.headerSpacer} />
        </View>

        <BracketLabel variant="default" style={styles.kicker}>
          Ambient
        </BracketLabel>
        <Text
          accessibilityRole="header"
          style={[
            styles.headline,
            {
              color: palette.warm[50],
              fontFamily: typography.fontFamily.displayRegular,
            },
          ]}
        >
          Drift off gently
        </Text>

        {/* Now playing mini */}
        {nowPlaying ? (
          <GlassCard
            variant="strong"
            radius={20}
            style={styles.nowCard}
            testID="now-playing-card"
          >
            <View style={styles.nowRow}>
              <View
                style={styles.nowArt}
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
              >
                <LinearGradient
                  colors={[palette.lavender[300], palette.lavender[500]]}
                  start={{ x: 0.2, y: 0.2 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                <View style={styles.nowArtBars}>
                  {[8, 14, 10, 16, 12].map((h, i) => (
                    <View
                      key={i}
                      style={[
                        styles.nowArtBar,
                        { backgroundColor: palette.warm[50], height: h },
                      ]}
                    />
                  ))}
                </View>
              </View>

              <View style={styles.nowText}>
                <Text
                  testID="now-playing-title"
                  style={[
                    styles.nowTitle,
                    { color: palette.warm[50], fontFamily: typography.fontFamily.sansMedium },
                  ]}
                >
                  {nowPlaying.title}
                </Text>
                <Text
                  testID="now-playing-meta"
                  style={[
                    styles.nowMeta,
                    { color: palette.warm[500], fontFamily: typography.fontFamily.mono },
                  ]}
                >
                  {`Playing · ${nowPlaying.minutes} min`}
                </Text>
              </View>

              <TouchableOpacity
                testID="now-playing-toggle"
                style={[styles.nowPlayBtn, { backgroundColor: palette.warm[50] }]}
                onPress={onTogglePlayback}
                accessibilityRole="button"
                accessibilityLabel={`Pause ${nowPlaying.title}`}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <AppIcon name="pause" size={16} color={palette.midnight[950]} />
              </TouchableOpacity>
            </View>
          </GlassCard>
        ) : null}

        {/* Sound grid */}
        <View testID="soundscapes-grid" style={styles.grid} accessibilityRole="list">
          {sounds.map((sound) => {
            const isActive = nowPlaying?.id === sound.id;
            const colors = gradientFor(sound.gradient);
            return (
              <TouchableOpacity
                key={sound.id}
                testID={`sound-${sound.id}`}
                onPress={() => onSelectSound(sound.id)}
                accessibilityRole="button"
                accessibilityLabel={`${sound.title}, ${sound.duration}`}
                accessibilityState={{ selected: isActive }}
                activeOpacity={0.85}
                style={[
                  styles.tile,
                  isActive && {
                    borderColor: palette.lavender[300],
                    borderWidth: 2,
                  },
                ]}
              >
                <LinearGradient
                  colors={colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                <View
                  style={[
                    styles.tileGloss,
                    { backgroundColor: `${palette.warm[50]}${palette.alpha[10]}` },
                  ]}
                  pointerEvents="none"
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants"
                />

                <AppIcon
                  name={sound.iconName}
                  size={22}
                  color={palette.warm[50]}
                />

                <View style={styles.tileFooter}>
                  <Text
                    style={[
                      styles.tileTitle,
                      { color: palette.warm[50], fontFamily: typography.fontFamily.sansMedium },
                    ]}
                  >
                    {sound.title}
                  </Text>
                  <Text
                    style={[
                      styles.tileDuration,
                      { color: palette.warm[100], fontFamily: typography.fontFamily.mono },
                    ]}
                  >
                    {sound.duration}
                  </Text>
                </View>

                {isActive ? (
                  <View
                    testID={`sound-active-indicator-${sound.id}`}
                    style={styles.activeIcon}
                    accessibilityElementsHidden
                    importantForAccessibility="no-hide-descendants"
                  >
                    <AppIcon name="volume-2" size={14} color={palette.warm[50]} />
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  activeIcon: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  container: {
    flex: 1,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    rowGap: 12,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  headerSpacer: {
    height: 44,
    width: 44,
  },
  headline: {
    fontSize: 30,
    lineHeight: 34,
    marginBottom: 24,
    marginTop: 4,
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
  kicker: {
    marginBottom: 4,
  },
  nowArt: {
    borderRadius: 12,
    height: 48,
    overflow: "hidden",
    width: 48,
  },
  nowArtBar: {
    borderRadius: 1,
    width: 2,
  },
  nowArtBars: {
    alignItems: "center",
    flexDirection: "row",
    gap: 2,
    height: "100%",
    justifyContent: "center",
  },
  nowCard: {
    marginBottom: 24,
    padding: 14,
  },
  nowMeta: {
    fontSize: 10,
    marginTop: 2,
  },
  nowPlayBtn: {
    alignItems: "center",
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 44,
  },
  nowRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  nowText: {
    flex: 1,
    minWidth: 0,
  },
  nowTitle: {
    fontSize: 13,
  },
  scroll: {
    paddingBottom: 40,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  smokeWrap: {
    left: 10,
    position: "absolute",
    top: 30,
  },
  tile: {
    borderRadius: 18,
    height: 132,
    overflow: "hidden",
    padding: 14,
    position: "relative",
    width: "48%",
  },
  tileDuration: {
    fontSize: 10,
    marginTop: 2,
  },
  tileFooter: {
    bottom: 14,
    left: 14,
    position: "absolute",
    right: 14,
  },
  tileGloss: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  tileTitle: {
    fontSize: 13,
  },
});

export default SoundscapesScreen;
