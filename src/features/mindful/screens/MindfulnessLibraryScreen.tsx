/**
 * MindfulnessLibraryScreen — prototype v4.2 #30 (Sprint 8 Batch C, NEW).
 *
 * Replaces MindfulHoursDashboardScreen. Header bracket + Fraunces "Find your
 * calm", a sage→aurora→lavender featured hero card with a play button,
 * horizontal category pills (sage active), and a 2-column grid of practice
 * tiles with hue-tinted icon cards.
 *
 * Maps to `prototypes/screens/30-mindful-library.js`.
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

export type SessionHue = "sage" | "aurora" | "peach" | "lavender";

export interface SessionItem {
  id: string;
  title: string;
  durationMinutes: number;
  hue: SessionHue;
  iconName: string;
}

export interface FeaturedSession {
  id: string;
  title: string;
  italicLine: string;
  durationMinutes: number;
  category: string;
}

export interface MindfulnessLibraryScreenProps {
  /** Selected category id. Defaults to "for-you". */
  selectedCategory?: string;
  /** Sessions grid items. Defaults provided. */
  sessions?: SessionItem[];
  /** Featured hero. Defaults provided. */
  featured?: FeaturedSession;
  onSearch: () => void;
  onCategoryChange: (_id: string) => void;
  onSelectSession: (_id: string) => void;
  onFeatured: () => void;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

interface CategoryOption {
  id: string;
  label: string;
}

const CATEGORIES: CategoryOption[] = [
  { id: "for-you", label: "For you" },
  { id: "quick", label: "Quick" },
  { id: "sleep", label: "Sleep" },
  { id: "anxiety", label: "Anxiety" },
  { id: "focus", label: "Focus" },
  { id: "body-scan", label: "Body scan" },
  { id: "loving-kindness", label: "Loving-kindness" },
];

const DEFAULT_FEATURED: FeaturedSession = {
  id: "monday-reset",
  title: "Monday reset",
  italicLine: "meditation",
  durationMinutes: 10,
  category: "Featured",
};

const DEFAULT_SESSIONS: SessionItem[] = [
  { id: "breath-478", title: "4-7-8 breath", durationMinutes: 4, hue: "sage", iconName: "wind" },
  { id: "body-scan", title: "Body scan", durationMinutes: 10, hue: "lavender", iconName: "user-round" },
  { id: "loving-kindness", title: "Loving kindness", durationMinutes: 12, hue: "peach", iconName: "heart" },
  { id: "noting", title: "Noting practice", durationMinutes: 15, hue: "aurora", iconName: "feather" },
  { id: "wind-down", title: "Sleep wind-down", durationMinutes: 20, hue: "lavender", iconName: "moon" },
  { id: "quick-reset", title: "Quick reset", durationMinutes: 2, hue: "peach", iconName: "zap" },
];

export function MindfulnessLibraryScreen({
  selectedCategory = "for-you",
  sessions = DEFAULT_SESSIONS,
  featured = DEFAULT_FEATURED,
  onSearch,
  onCategoryChange,
  onSelectSession,
  onFeatured,
  testID = "mindfulness-library-screen",
  style,
}: MindfulnessLibraryScreenProps): React.ReactElement {
  const { palette, typography } = useTheme();

  const hueColor = (hue: SessionHue): string => {
    switch (hue) {
      case "sage":
        return palette.sage[300];
      case "aurora":
        return palette.aurora[300];
      case "peach":
        return palette.peach[300];
      case "lavender":
        return palette.lavender[300];
      default:
        return palette.sage[300];
    }
  };

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={[styles.container, style]}
    >
      {/* Top decorative aurora glow */}
      <View
        style={styles.glowWrap}
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <SmokeBlob size={320} tint="aurora" opacity={0.4} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <BracketLabel variant="muted">Mindfulness</BracketLabel>
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
              Find your calm
            </Text>
          </View>

          <TouchableOpacity
            testID="search-button"
            style={[
              styles.iconBtn,
              { backgroundColor: palette.midnight[800], borderColor: palette.midnight[600] },
            ]}
            onPress={onSearch}
            accessibilityRole="button"
            accessibilityLabel="Search practices"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <AppIcon name="search" size={18} color={palette.warm[100]} />
          </TouchableOpacity>
        </View>

        {/* Featured hero */}
        <TouchableOpacity
          testID="featured-card"
          activeOpacity={0.9}
          onPress={onFeatured}
          accessibilityRole="button"
          accessibilityLabel={`Featured ${featured.title} ${featured.italicLine}, ${featured.durationMinutes} minutes`}
          style={styles.featuredCard}
        >
          <LinearGradient
            colors={[palette.sage[300], palette.aurora[300], palette.lavender[300]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View
            style={[
              styles.featuredOverlay,
              { backgroundColor: `${palette.warm[50]}${palette.alpha[5]}` },
            ]}
            pointerEvents="none"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          />

          <View style={styles.featuredContent}>
            <View
              style={[
                styles.featuredChip,
                {
                  backgroundColor: `${palette.warm[50]}${palette.alpha[20]}`,
                  borderColor: `${palette.warm[50]}${palette.alpha[20]}`,
                },
              ]}
            >
              <Text
                style={[
                  styles.featuredChipText,
                  { color: palette.warm[50], fontFamily: typography.fontFamily.sansMedium },
                ]}
              >
                {featured.category}
                <Text style={{ fontFamily: typography.fontFamily.mono }}>
                  {` · ${featured.durationMinutes} min`}
                </Text>
              </Text>
            </View>
            <Text
              style={[
                styles.featuredTitle,
                { color: palette.warm[50], fontFamily: typography.fontFamily.displayRegular },
              ]}
            >
              {featured.title}
            </Text>
            <Text
              style={[
                styles.featuredItalic,
                {
                  color: palette.warm[50],
                  fontFamily: typography.fontFamily.displayItalic,
                },
              ]}
            >
              {featured.italicLine}
            </Text>
          </View>

          <View
            testID="featured-play-button"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={[styles.featuredPlay, { backgroundColor: palette.warm[50] }]}
          >
            <AppIcon name="play" size={20} color={palette.midnight[950]} />
          </View>
        </TouchableOpacity>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
          style={styles.categoriesScroll}
          accessibilityRole="tablist"
          testID="categories-row"
        >
          {CATEGORIES.map((cat) => {
            const active = cat.id === selectedCategory;
            return (
              <TouchableOpacity
                key={cat.id}
                testID={`category-${cat.id}`}
                onPress={() => onCategoryChange(cat.id)}
                accessibilityRole="tab"
                accessibilityLabel={cat.label}
                accessibilityState={{ selected: active }}
                style={[
                  styles.categoryPill,
                  active
                    ? {
                        backgroundColor: `${palette.sage[300]}${palette.alpha[15]}`,
                        borderColor: `${palette.sage[300]}${palette.alpha[40]}`,
                      }
                    : {
                        backgroundColor: palette.midnight[800],
                        borderColor: palette.midnight[600],
                      },
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color: active ? palette.sage[300] : palette.warm[200],
                      fontFamily: typography.fontFamily.sansMedium,
                    },
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Sessions grid */}
        <View testID="sessions-grid" style={styles.sessionsGrid} accessibilityRole="list">
          {sessions.map((session) => {
            const tint = hueColor(session.hue);
            return (
              <TouchableOpacity
                key={session.id}
                testID={`session-${session.id}`}
                onPress={() => onSelectSession(session.id)}
                accessibilityRole="button"
                accessibilityLabel={`${session.title}, ${session.durationMinutes} minutes`}
                style={styles.sessionCardWrap}
                activeOpacity={0.85}
              >
                <GlassCard radius={18} style={styles.sessionCard}>
                  <View
                    style={[
                      styles.sessionIcon,
                      {
                        backgroundColor: `${tint}${palette.alpha[15]}`,
                        borderColor: `${tint}${palette.alpha[20]}`,
                      },
                    ]}
                  >
                    <AppIcon name={session.iconName} size={20} color={tint} />
                  </View>
                  <Text
                    style={[
                      styles.sessionTitle,
                      { color: palette.warm[50], fontFamily: typography.fontFamily.sansMedium },
                    ]}
                    numberOfLines={1}
                  >
                    {session.title}
                  </Text>
                  <Text
                    style={[
                      styles.sessionDuration,
                      { color: palette.warm[500], fontFamily: typography.fontFamily.mono },
                    ]}
                  >
                    {`${session.durationMinutes} min`}
                  </Text>
                </GlassCard>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  categoriesContent: {
    gap: 8,
    paddingRight: 24,
  },
  categoriesScroll: {
    flexGrow: 0,
    marginBottom: 20,
    marginTop: 20,
  },
  categoryPill: {
    borderRadius: 20,
    borderWidth: 1,
    minHeight: 36,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  categoryText: {
    fontSize: 12,
  },
  container: {
    flex: 1,
  },
  featuredCard: {
    borderRadius: 24,
    height: 192,
    marginTop: 20,
    overflow: "hidden",
    position: "relative",
  },
  featuredChip: {
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  featuredChipText: {
    fontSize: 10,
  },
  featuredContent: {
    bottom: 0,
    left: 0,
    padding: 20,
    position: "absolute",
    right: 80,
  },
  featuredItalic: {
    fontSize: 24,
    fontStyle: "italic",
    lineHeight: 28,
  },
  featuredOverlay: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  featuredPlay: {
    alignItems: "center",
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    position: "absolute",
    right: 20,
    top: 20,
    width: 48,
  },
  featuredTitle: {
    fontSize: 24,
    lineHeight: 28,
  },
  glowWrap: {
    left: 20,
    position: "absolute",
    top: -40,
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
  },
  headerText: {
    flex: 1,
    paddingRight: 12,
  },
  headline: {
    fontSize: 30,
    lineHeight: 34,
    marginTop: 6,
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
  scroll: {
    paddingBottom: 40,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  sessionCard: {
    height: 132,
    padding: 14,
  },
  sessionCardWrap: {
    width: "48%",
  },
  sessionDuration: {
    fontSize: 10,
    marginTop: 2,
  },
  sessionIcon: {
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    marginBottom: "auto",
    width: 40,
  },
  sessionTitle: {
    fontSize: 13,
    marginTop: "auto",
  },
  sessionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    rowGap: 12,
  },
});

export default MindfulnessLibraryScreen;
