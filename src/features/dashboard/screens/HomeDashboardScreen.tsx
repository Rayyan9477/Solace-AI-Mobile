/**
 * HomeDashboardScreen — prototype v4.2 #20 Home v2 reskin (Sprint 6).
 *
 * Emotional check-in–first layout: bracket date, greeting headline,
 * 5-face mood selector, 2-up stats tiles, ContinueCard, and a
 * horizontal practice carousel. Maps to `prototypes/screens/20-home-v2.js`.
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

import { AppIcon } from "@/shared/components/atoms/display/AppIcon";
import { ScreenContainer } from "@/shared/components/atoms/layout";
import {
  ArticleCardV2,
  ContinueCard,
} from "@/shared/components/organisms/dashboard";
import {
  BracketLabel,
  GlassCard,
  MoodFace,
  MOOD_LEVELS,
  type MoodLevel,
} from "@/shared/components/primitives";
import { useTheme } from "@/shared/theme/useTheme";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns "Good morning", "Good afternoon", or "Good evening". */
export const computeGreeting = (date = new Date()): string => {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const computeDateLabel = (date = new Date()): string => {
  const day = DAY_NAMES[date.getDay()];
  const month = MONTH_NAMES[date.getMonth()];
  const d = date.getDate();
  return `${day} · ${month} ${d}`;
};

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface HomeArticle {
  id: string;
  title: string;
  category: string;
  readMinutes: number;
  thumbnailGradient?: "sage" | "aurora" | "peach" | "lavender";
}

export interface HomeDashboardScreenProps {
  /** User's first name for the greeting */
  userName: string;
  /** Today's check-in mood (1–5 or null) */
  todayMood: MoodLevel | null;
  onMoodChange: (_m: MoodLevel | null) => void;
  /** Solace score (0-100) */
  solaceScore: number;
  /** Score delta from last week (e.g., +5) */
  solaceDelta?: number;
  /** Streak days */
  streakDays: number;
  /** Current Continue card (if any practice in-progress) */
  continueCard?: {
    title: string;
    subtitle: string;
    onPress: () => void;
  } | null;
  /** Today's practice list */
  articles: HomeArticle[];
  onArticlePress: (_id: string) => void;
  onAllPracticesPress: () => void;
  onNotificationsPress: () => void;
  /** Date label override; defaults to computed today */
  dateLabel?: string;
  /**
   * Time-of-day greeting override; defaults to computeGreeting() based on
   * system time.
   */
  greeting?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Default articles export
// ---------------------------------------------------------------------------

export const DEFAULT_ARTICLES: HomeArticle[] = [
  {
    id: "breathing-4-7-8",
    title: "4-7-8 calming breath",
    category: "Breathing",
    readMinutes: 4,
    thumbnailGradient: "sage",
  },
  {
    id: "movement-body-scan",
    title: "Full body scan release",
    category: "Movement",
    readMinutes: 10,
    thumbnailGradient: "peach",
  },
  {
    id: "meditation-loving-kindness",
    title: "Loving-kindness meditation",
    category: "Meditation",
    readMinutes: 8,
    thumbnailGradient: "lavender",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function HomeDashboardScreen({
  userName,
  todayMood,
  onMoodChange,
  solaceScore,
  solaceDelta,
  streakDays,
  continueCard,
  articles,
  onArticlePress,
  onAllPracticesPress,
  onNotificationsPress,
  dateLabel,
  greeting,
  testID = "home-dashboard-screen",
  style,
}: HomeDashboardScreenProps): React.ReactElement {
  const { palette, typography } = useTheme();

  const resolvedGreeting = greeting ?? computeGreeting();
  const resolvedDateLabel = dateLabel ?? computeDateLabel();

  const deltaLabel = useMemo(() => {
    if (solaceDelta === undefined) return null;
    return solaceDelta >= 0 ? `+${solaceDelta} this week` : `${solaceDelta} this week`;
  }, [solaceDelta]);

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
        {/* ---------------------------------------------------------------- */}
        {/* Header: date bracket + notification bell                          */}
        {/* ---------------------------------------------------------------- */}
        <View style={styles.header}>
          <BracketLabel variant="muted">
            {resolvedDateLabel}
          </BracketLabel>

          <TouchableOpacity
            testID="notifications-button"
            style={[
              styles.bellButton,
              {
                backgroundColor: palette.midnight[800],
                borderColor: palette.midnight[600],
              },
            ]}
            onPress={onNotificationsPress}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <AppIcon name="bell" size={18} color={palette.warm[100]} />
            <View
              testID="notification-dot"
              style={[styles.notifDot, { backgroundColor: palette.peach[300] }]}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            />
          </TouchableOpacity>
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* Greeting headline                                                 */}
        {/* ---------------------------------------------------------------- */}
        <Text
          testID="greeting-text"
          accessibilityRole="header"
          style={[styles.greeting, { color: palette.warm[50] }]}
        >
          {`${resolvedGreeting},\n`}
          <Text
            style={[
              styles.greetingName,
              { color: palette.warm[50], fontFamily: typography.fontFamily.displayItalic },
            ]}
          >
            {`${userName}.`}
          </Text>
        </Text>

        {/* ---------------------------------------------------------------- */}
        {/* Check-in card                                                     */}
        {/* ---------------------------------------------------------------- */}
        <GlassCard
          testID="checkin-card"
          style={styles.checkinCard}
        >
          <Text
            style={[
              styles.checkinQuestion,
              {
                color: palette.warm[50],
                fontFamily: typography.fontFamily.display,
              },
            ]}
          >
            How are you right now?
          </Text>

          <View
            testID="mood-selector"
            accessibilityRole="radiogroup"
            accessibilityLabel="Current mood"
            style={styles.moodRow}
          >
            {MOOD_LEVELS.map((level) => {
              const isSelected = todayMood === level;
              return (
                <TouchableOpacity
                  key={level}
                  testID={`mood-face-${level}`}
                  onPress={() => onMoodChange(level)}
                  accessibilityRole="radio"
                  accessibilityLabel={`Mood level ${level}`}
                  accessibilityState={{ selected: isSelected }}
                  style={[
                    styles.moodTouchable,
                    { borderColor: isSelected ? palette.aurora[300] : palette.midnight[950] },
                  ]}
                >
                  <MoodFace
                    level={level}
                    size={56}
                    selected={isSelected}
                    interactive
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </GlassCard>

        {/* ---------------------------------------------------------------- */}
        {/* Stats row: Solace score + streak                                  */}
        {/* ---------------------------------------------------------------- */}
        <View style={styles.statsRow}>
          {/* Solace tile */}
          <GlassCard
            testID="solace-tile"
            style={styles.statsTile}
            accessibilityRole="text"
            accessibilityLabel={`Solace score ${solaceScore} out of 100${deltaLabel ? `, ${deltaLabel}` : ""}`}
          >
            <View style={styles.statsTileHeader}>
              <BracketLabel variant="muted">Solace</BracketLabel>
              <AppIcon
                name="trending-up"
                size={14}
                color={palette.sage[300]}
                accessibilityLabel="Trending up"
              />
            </View>

            <Text
              testID="solace-score-value"
              style={[
                styles.statsNumber,
                {
                  color: palette.warm[50],
                  fontFamily: typography.fontFamily.display,
                },
              ]}
            >
              {String(solaceScore)}
              <Text
                style={[
                  styles.statsUnit,
                  {
                    color: palette.warm[400],
                    fontFamily: typography.fontFamily.mono,
                  },
                ]}
              >
                /100
              </Text>
            </Text>

            {deltaLabel ? (
              <Text
                testID="solace-delta"
                style={[styles.statsDelta, { color: palette.sage[300] }]}
              >
                {deltaLabel}
              </Text>
            ) : null}
          </GlassCard>

          {/* Streak tile */}
          <GlassCard
            testID="streak-tile"
            style={styles.statsTile}
            accessibilityRole="text"
            accessibilityLabel={`${streakDays} day streak`}
          >
            <View style={styles.statsTileHeader}>
              <BracketLabel variant="muted">Streak</BracketLabel>
              <AppIcon
                name="flame"
                size={14}
                color={palette.peach[300]}
                accessibilityLabel="Flame"
              />
            </View>

            <Text
              testID="streak-value"
              style={[
                styles.statsNumber,
                {
                  color: palette.warm[50],
                  fontFamily: typography.fontFamily.display,
                },
              ]}
            >
              {String(streakDays)}
              <Text
                style={[
                  styles.statsUnit,
                  {
                    color: palette.warm[400],
                    fontFamily: typography.fontFamily.mono,
                  },
                ]}
              >
                d
              </Text>
            </Text>
          </GlassCard>
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* ContinueCard (optional)                                           */}
        {/* ---------------------------------------------------------------- */}
        {continueCard ? (
          <ContinueCard
            testID="continue-card"
            practiceTitle={continueCard.title}
            practiceSubtitle={continueCard.subtitle}
            ctaLabel="Pick up where you left off"
            onPress={continueCard.onPress}
            style={styles.continueCard}
          />
        ) : null}

        {/* ---------------------------------------------------------------- */}
        {/* Today's practice section                                          */}
        {/* ---------------------------------------------------------------- */}
        <View style={styles.practiceHeader}>
          <Text
            testID="practice-heading"
            accessibilityRole="header"
            style={[
              styles.practiceTitle,
              {
                color: palette.warm[50],
                fontFamily: typography.fontFamily.display,
              },
            ]}
          >
            Today&apos;s practice
          </Text>

          <TouchableOpacity
            testID="all-practices-link"
            onPress={onAllPracticesPress}
            accessibilityRole="link"
            accessibilityLabel="All practices"
            style={styles.allPracticesButton}
          >
            <Text
              style={[
                styles.allPracticesText,
                { color: palette.aurora[300] },
              ]}
            >
              All practices →
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.practiceScroll}
          testID="practice-scroll"
          accessibilityRole="list"
        >
          {articles.map((article) => (
            <ArticleCardV2
              key={article.id}
              testID={`article-card-${article.id}`}
              title={article.title}
              category={article.category}
              readMinutes={article.readMinutes}
              thumbnailGradient={article.thumbnailGradient ?? "sage"}
              onPress={() => onArticlePress(article.id)}
            />
          ))}
        </ScrollView>
      </ScrollView>
    </ScreenContainer>
  );
}

// ---------------------------------------------------------------------------
// Styles (properties alphabetically sorted)
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  allPracticesButton: {
    minHeight: 44,
    paddingVertical: 8,
  },
  allPracticesText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
  },
  bellButton: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  checkinCard: {
    marginTop: 20,
    padding: 20,
  },
  checkinQuestion: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
  },
  continueCard: {
    marginTop: 16,
  },
  greeting: {
    fontFamily: "Fraunces_300Light",
    fontSize: 30,
    lineHeight: 34,
    marginTop: 8,
  },
  greetingName: {
    fontFamily: "Fraunces_400Regular_Italic",
    fontSize: 30,
    fontStyle: "italic",
    lineHeight: 34,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  moodRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
  },
  moodTouchable: {
    alignItems: "center",
    borderRadius: 32,
    borderWidth: 2,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    padding: 2,
  },
  notifDot: {
    borderRadius: 5,
    height: 8,
    position: "absolute",
    right: 9,
    top: 9,
    width: 8,
  },
  practiceHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    marginTop: 24,
  },
  practiceScroll: {
    paddingRight: 8,
  },
  practiceTitle: {
    fontSize: 18,
    lineHeight: 22,
  },
  scroll: {
    paddingBottom: 40,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  statsDelta: {
    fontFamily: "FiraCode_400Regular",
    fontSize: 10,
    marginTop: 6,
  },
  statsNumber: {
    fontSize: 28,
    lineHeight: 32,
    marginTop: 6,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  statsTile: {
    flex: 1,
    padding: 16,
  },
  statsTileHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statsUnit: {
    fontSize: 14,
  },
});

export default HomeDashboardScreen;
