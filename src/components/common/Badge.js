import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useTheme } from "../../shared/theme/ThemeContext";

const variantColor = (theme, variant = "primary") => {
  const v = theme?.colors?.[variant];
  if (typeof v === "string") return { bg: v, fg: theme.colors?.text?.inverse || "#fff" };
  if (v?.dark && v?.light) return { bg: v.dark, fg: v.light };
  if (v?.[500]) return { bg: v[500], fg: theme.colors?.text?.inverse || "#fff" };
  return { bg: theme?.colors?.primary?.[500] || "#007AFF", fg: "#fff" };
};

const sizeStyle = (size = "medium") => {
  switch (size) {
    case "small":
      return { paddingVertical: 2, paddingHorizontal: 6, borderRadius: 8, fontSize: 10 };
    case "large":
      return { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 14, fontSize: 14 };
    default:
      return { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12, fontSize: 12 };
  }
};

const formatLabel = (label, max) => {
  if (typeof label === "number" && typeof max === "number" && label > max) {
    return `${max}+`;
  }
  return String(label ?? "");
};

const Badge = ({
  label,
  variant = "primary",
  size = "medium",
  dot = false,
  icon,
  iconPosition = "left",
  outline = false,
  onPress,
  max,
  accessibilityLabel,
  testID = "badge",
}) => {
  const { theme } = useTheme();
  const { bg, fg } = variantColor(theme, variant);
  const sz = sizeStyle(size);
  const Container = onPress ? TouchableOpacity : View;

  const a11yLabel =
    accessibilityLabel || (dot ? "Status indicator" : `${formatLabel(label, max)} badge`);

  const content = (
    <View
      style={[
        styles.badge,
        { backgroundColor: outline ? "transparent" : bg, borderColor: bg },
        { paddingVertical: sz.paddingVertical, paddingHorizontal: sz.paddingHorizontal, borderRadius: sz.borderRadius },
      ]}
    >
      {dot ? (
        <View style={[styles.dot, { backgroundColor: bg }]} />
      ) : (
        <View style={styles.row}>
          {icon && iconPosition === "left" ? <Text style={[styles.icon, { color: fg }]}>{icon}</Text> : null}
          <Text style={[styles.text, { color: fg, fontSize: sz.fontSize }]}>{formatLabel(label, max)}</Text>
          {icon && iconPosition === "right" ? <Text style={[styles.icon, { color: fg }]}>{icon}</Text> : null}
        </View>
      )}
    </View>
  );

  return (
    <Container
      onPress={onPress}
      accessibilityRole={onPress ? "button" : "text"}
      accessibilityLabel={a11yLabel}
      testID={testID}
    >
      {content}
    </Container>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  row: { flexDirection: "row", alignItems: "center", gap: 4 },
  text: { fontWeight: "600" },
  icon: { marginHorizontal: 2 },
  dot: { width: 8, height: 8, borderRadius: 4 },
});

export default Badge;
