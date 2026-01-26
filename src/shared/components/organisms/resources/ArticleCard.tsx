import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import type { ArticleCardProps } from "./ArticleCard.types";
import { formatCount } from "./ArticleCard.types";

export function ArticleCard({
  id,
  title,
  category,
  categoryColor,
  imageUrl,
  viewCount,
  likeCount,
  commentCount,
  onPress,
  style,
  testID,
  accessibilityLabel,
}: ArticleCardProps): React.ReactElement {
  const handlePress = () => onPress?.(id);
  const Container = onPress ? TouchableOpacity : View;
  const containerProps = onPress ? { onPress: handlePress, accessibilityRole: "button" as const, activeOpacity: 0.7 } : {};

  return (
    <Container testID={testID} accessibilityLabel={accessibilityLabel || `Article: ${title}`} style={[styles.container, style]} {...containerProps}>
      <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
      <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
        <Text style={styles.categoryText}>{category}</Text>
      </View>
      <Text style={styles.title} numberOfLines={2}>{title}</Text>
      {(viewCount || likeCount || commentCount) && (
        <View style={styles.metrics}>
          {viewCount && <Text style={styles.metricText}>👁 {formatCount(viewCount)}</Text>}
          {likeCount && <Text style={styles.metricText}>♡ {formatCount(likeCount)}</Text>}
          {commentCount && <Text style={styles.metricText}>💬 {formatCount(commentCount)}</Text>}
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  categoryBadge: { alignSelf: "flex-start", borderRadius: 12, marginTop: 8, paddingHorizontal: 10, paddingVertical: 4 },
  categoryText: { color: "#FFFFFF", fontSize: 12, fontWeight: "600" },
  container: { backgroundColor: "#334155", borderRadius: 12, overflow: "hidden", padding: 12 },
  image: { backgroundColor: "#475569", borderRadius: 8, height: 120, width: "100%" },
  metrics: { flexDirection: "row", gap: 12, marginTop: 8 },
  metricText: { color: "#94A3B8", fontSize: 12 },
  title: { color: "#FFFFFF", fontSize: 16, fontWeight: "600", lineHeight: 22, marginTop: 8 },
});

export default ArticleCard;
