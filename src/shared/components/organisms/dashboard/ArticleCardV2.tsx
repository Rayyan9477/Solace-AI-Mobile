/**
 * ArticleCardV2 — Editorial article card for Home v2 (screen 20).
 * Gradient thumbnail + bracket category chip + title + meta row.
 *
 * @phase Sprint 5: prototype-v4.2 organisms
 */

import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { BracketLabel, IconTile } from "@/shared/components/primitives";
import { useTheme } from "@/shared/theme/useTheme";

export type ArticleThumbnailGradient = "sage" | "aurora" | "peach" | "lavender";

export interface ArticleCardV2Props {
  title: string;
  category?: string;
  readMinutes: number;
  thumbnailGradient?: ArticleThumbnailGradient;
  onPress: () => void;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

export function ArticleCardV2({
  title,
  category,
  readMinutes,
  thumbnailGradient = "sage",
  onPress,
  testID,
  style,
}: ArticleCardV2Props): React.ReactElement {
  const { palette, typography } = useTheme();

  const [colorA, colorB] = GRADIENT_STOPS[thumbnailGradient](palette);

  const a11yLabel = `${title}, ${readMinutes} minute read`;

  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="link"
      accessibilityLabel={a11yLabel}
      style={[styles.container, style]}
    >
      {/* Gradient thumbnail */}
      <LinearGradient
        colors={[colorA, colorB]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.thumbnail}
        testID={testID ? `${testID}-thumbnail` : undefined}
      />

      {/* Content below thumbnail */}
      <View style={styles.content}>
        {category ? (
          <BracketLabel variant="sage">{category}</BracketLabel>
        ) : null}

        <Text
          style={[
            styles.title,
            {
              color: palette.warm[50],
              fontFamily: typography.fontFamily.display,
            },
          ]}
          numberOfLines={2}
        >
          {title}
        </Text>

        {/* Meta row: clock icon + read time */}
        <View style={styles.meta} testID={testID ? `${testID}-meta` : undefined}>
          <IconTile
            iconName="clock"
            hue="warm"
            size={16}
            iconSize={10}
            shape="rounded"
          />
          <Text
            style={[
              styles.metaText,
              {
                color: palette.warm[400],
                fontFamily: typography.fontFamily.sans,
              },
            ]}
          >
            {readMinutes} min read
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const GRADIENT_STOPS: Record<
  ArticleThumbnailGradient,
  (p: any) => [string, string]
> = {
  sage: (p) => [p.sage[300], p.aurora[300]],
  peach: (p) => [p.peach[300], p.peach[500]],
  lavender: (p) => [p.lavender[300], p.lavender[500]],
  aurora: (p) => [p.aurora[300], p.aurora[500]],
};

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
    width: 240,
  },
  content: {
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  meta: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    marginTop: 8,
  },
  metaText: {
    fontSize: 12,
  },
  thumbnail: {
    borderRadius: 16,
    height: 140,
    width: "100%",
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
    marginTop: 4,
  },
});

export default ArticleCardV2;
