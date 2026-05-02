/**
 * LoadingSkeletonScreen — prototype v4.2 #39 (Sprint 9 Batch B).
 *
 * Cosmic shimmering skeleton mirroring the home dashboard layout while
 * data is being prepared after auth. Aurora SmokeBlob ambient top, header
 * row skeleton, hero card placeholder, 2x2 stats grid, list card row,
 * and a centered ConcentricRings + BreathingOrb progress hero.
 *
 * Maps to `prototypes/screens/39-loading.js`.
 */

import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenContainer } from "@/shared/components/atoms/layout";
import {
  BracketLabel,
  BreathingOrb,
  ConcentricRings,
  GlassCard,
  SkeletonShimmer,
  SmokeBlob,
} from "@/shared/components/primitives";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { useTheme } from "@/shared/theme/useTheme";

// ─── Public API ──────────────────────────────────────────────────────────────

export interface LoadingSkeletonScreenProps {
  /** Caption shown beneath the breathing orb. Defaults to "Preparing your space..." */
  label?: string;
  testID?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function LoadingSkeletonScreen({
  label = "Preparing your space...",
  testID = "loading-skeleton-screen",
}: LoadingSkeletonScreenProps): React.ReactElement {
  const { palette } = useTheme();
  const reducedMotion = useReducedMotion();

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={styles.screen}
    >
      <View
        accessibilityRole="progressbar"
        accessibilityLabel="Loading your space"
        accessibilityState={{ busy: true }}
        style={styles.progressFlag}
        testID="loading-progress-flag"
      />

      {/* Ambient depth top */}
      <SmokeBlob
        tint="aurora"
        size={320}
        opacity={0.18}
        style={styles.smokeBlob}
        testID="loading-smoke-blob"
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      >
        {/* Header row: bracket-shaped skel + 44 round */}
        <View style={styles.headerRow}>
          <SkeletonShimmer
            testID="skel-header-bracket"
            width={128}
            height={12}
            borderRadius={4}
          />
          <SkeletonShimmer
            testID="skel-header-bell"
            width={44}
            height={44}
            borderRadius={22}
          />
        </View>

        {/* Headline: 36x192 + 36x160 */}
        <View style={styles.headlineColumn}>
          <SkeletonShimmer
            testID="skel-headline-line-1"
            width={192}
            height={36}
            borderRadius={6}
          />
          <SkeletonShimmer
            testID="skel-headline-line-2"
            width={160}
            height={36}
            borderRadius={6}
            style={styles.headlineLine2}
          />
        </View>

        {/* Hero card */}
        <GlassCard testID="skel-hero-card" style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View style={styles.heroLeft}>
              <SkeletonShimmer
                testID="skel-hero-label"
                width={80}
                height={12}
                borderRadius={4}
              />
              <SkeletonShimmer
                testID="skel-hero-value"
                width={112}
                height={36}
                borderRadius={6}
                style={styles.heroLabelGap}
              />
              <SkeletonShimmer
                testID="skel-hero-meta"
                width={96}
                height={8}
                borderRadius={4}
                style={styles.heroLabelGap}
              />
            </View>
            <SkeletonShimmer
              testID="skel-hero-orb"
              width={80}
              height={80}
              borderRadius={40}
            />
          </View>
          <SkeletonShimmer
            testID="skel-hero-bar-1"
            width="100%"
            height={8}
            borderRadius={4}
            style={styles.heroBar}
          />
          <SkeletonShimmer
            testID="skel-hero-bar-2"
            width={220}
            height={8}
            borderRadius={4}
            style={styles.heroBarShort}
          />
        </GlassCard>

        {/* Stats grid 2x2 */}
        <View style={styles.statsGrid}>
          {STAT_KEYS.map((key) => (
            <GlassCard
              key={key}
              testID={`skel-stat-${key}`}
              style={styles.statCell}
            >
              <SkeletonShimmer
                testID={`skel-stat-icon-${key}`}
                width={16}
                height={16}
                borderRadius={8}
              />
              <SkeletonShimmer
                testID={`skel-stat-number-${key}`}
                width={64}
                height={28}
                borderRadius={6}
                style={styles.statGap}
              />
              <SkeletonShimmer
                testID={`skel-stat-bar-${key}`}
                width="100%"
                height={4}
                borderRadius={2}
                style={styles.statGap}
              />
            </GlassCard>
          ))}
        </View>

        {/* List card */}
        <GlassCard testID="skel-list-card" style={styles.listCard}>
          <View style={styles.listRow}>
            <SkeletonShimmer
              testID="skel-list-thumb"
              width={48}
              height={48}
              borderRadius={12}
            />
            <View style={styles.listText}>
              <SkeletonShimmer
                testID="skel-list-title"
                width={180}
                height={12}
                borderRadius={4}
              />
              <SkeletonShimmer
                testID="skel-list-meta"
                width={120}
                height={8}
                borderRadius={4}
                style={styles.listGap}
              />
            </View>
          </View>
        </GlassCard>

        {/* Breathing orb loader */}
        <View style={styles.loaderWrap} testID="loading-orb-wrap">
          <ConcentricRings
            size={64}
            rings={3}
            tint="aurora"
            testID="loading-rings"
          >
            <BreathingOrb
              testID="loading-orb"
              size={32}
              tint="cool"
              pulsing={!reducedMotion}
            />
          </ConcentricRings>
        </View>

        <BracketLabel variant="muted" style={styles.loaderLabel}>
          {label}
        </BracketLabel>

        {/* Live region for screen reader announcement */}
        <Text
          accessibilityLiveRegion="polite"
          style={[styles.srOnly, { color: palette.warm[50] }]}
          testID="loading-live-region"
        >
          {label}
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}

// ─── Constants ───────────────────────────────────────────────────────────────

const STAT_KEYS = ["a", "b", "c", "d"] as const;

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headlineColumn: {
    marginBottom: 24,
  },
  headlineLine2: {
    marginTop: 8,
  },
  heroBar: {
    marginTop: 16,
  },
  heroBarShort: {
    marginTop: 8,
  },
  heroCard: {
    marginBottom: 16,
    padding: 20,
  },
  heroLabelGap: {
    marginTop: 10,
  },
  heroLeft: {
    flex: 1,
  },
  heroRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  listCard: {
    marginBottom: 16,
    padding: 20,
  },
  listGap: {
    marginTop: 8,
  },
  listRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  listText: {
    flex: 1,
  },
  loaderLabel: {
    marginTop: 16,
    textAlign: "center",
  },
  loaderWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
  },
  progressFlag: {
    height: 0,
    width: 0,
  },
  screen: {
    flex: 1,
  },
  scroll: {
    paddingBottom: 40,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  smokeBlob: {
    left: -40,
    position: "absolute",
    top: -40,
  },
  srOnly: {
    height: 0,
    opacity: 0,
    width: 0,
  },
  statCell: {
    flexBasis: "48%",
    flexGrow: 1,
    padding: 16,
  },
  statGap: {
    marginTop: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
});

export default LoadingSkeletonScreen;
