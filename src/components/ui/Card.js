import { BlurView } from "@react-native-community/blur";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
} from "react-native";

import FreudDesignSystem, {
  FreudColors,
  FreudComponents,
  FreudShadows,
  FreudBorderRadius,
  FreudSpacing,
  FreudTypography,
} from "../../shared/theme/FreudDesignSystem";
import { useTheme } from "../../shared/theme/ThemeContext";
import { MentalHealthIcon } from "../icons";
import Button from "./Button";
import Tag from "./Tag";

const { width: screenWidth } = Dimensions.get("window");

const Card = ({
  children,
  title,
  subtitle,
  description,
  image,
  icon,
  onPress,
  therapeuticColor = "calming",
  variant = "primary",
  size = "medium",
  fullWidth = false,
  style = {},
  contentStyle = {},
  headerStyle = {},
  footerStyle = {},
  disabled = false,
  loading = false,
  glassmorphism = false,
  gradient = false,
  elevation = "sm",
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const { theme, isDarkMode } = useTheme();
  const [scaleAnim] = useState(new Animated.Value(1));
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    if (!onPress || disabled) return;
    setIsPressed(true);
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (!onPress || disabled) return;
    setIsPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getCardStyles = () => {
    const currentTheme = isDarkMode
      ? FreudDesignSystem.themes.dark
      : FreudDesignSystem.themes.light;
    let baseStyle = {
      ...getSizeStyles(),
      ...styles.card,
    };

    // Apply Freud Design System styles
    switch (variant) {
      case "primary":
        baseStyle = {
          ...baseStyle,
          ...FreudComponents.card.primary,
          backgroundColor: currentTheme.colors.background.primary,
        };
        break;
      case "elevated":
        baseStyle = {
          ...baseStyle,
          ...FreudComponents.card.elevated,
          backgroundColor: currentTheme.colors.background.primary,
        };
        break;
      case "outlined":
        baseStyle = {
          ...baseStyle,
          ...FreudComponents.card.outlined,
          backgroundColor: currentTheme.colors.background.primary,
          borderColor: currentTheme.colors.border.primary,
        };
        break;
      case "therapeutic":
        baseStyle = {
          ...baseStyle,
          ...FreudComponents.card.primary,
          backgroundColor: FreudColors.serenityGreen[10],
          borderLeftWidth: 4,
          borderLeftColor: FreudColors.serenityGreen[60],
        };
        break;
      case "mindful":
        baseStyle = {
          ...baseStyle,
          ...FreudComponents.card.primary,
          backgroundColor: FreudColors.mindfulBrown[10],
          borderLeftWidth: 4,
          borderLeftColor: FreudColors.mindfulBrown[60],
        };
        break;
      case "empathy":
        baseStyle = {
          ...baseStyle,
          ...FreudComponents.card.primary,
          backgroundColor: FreudColors.empathyOrange[10],
          borderLeftWidth: 4,
          borderLeftColor: FreudColors.empathyOrange[60],
        };
        break;
    }

    // Apply elevation
    if (elevation && FreudShadows[elevation]) {
      baseStyle = { ...baseStyle, ...FreudShadows[elevation] };
    }

    // Glassmorphism effect
    if (glassmorphism) {
      baseStyle = {
        ...baseStyle,
        backgroundColor: "rgba(255, 255, 255, 0.25)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.3)",
        backdropFilter: "blur(10px)",
      };
    }

    if (fullWidth) {
      baseStyle.width = "100%";
    }

    if (disabled) {
      baseStyle.opacity = 0.6;
    }

    if (onPress && isPressed) {
      baseStyle.opacity = 0.8;
    }

    return [baseStyle, style];
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          padding: FreudSpacing[3],
          borderRadius: FreudBorderRadius.lg,
          minHeight: 80,
        };

      case "large":
        return {
          padding: FreudSpacing[6],
          borderRadius: FreudBorderRadius["2xl"],
          minHeight: 120,
        };

      default: // medium
        return {
          padding: FreudSpacing[4],
          borderRadius: FreudBorderRadius.xl,
          minHeight: 100,
        };
    }
  };

  const renderImage = () => {
    if (!image) return null;

    const imageStyle = {
      width: "100%",
      height: size === "small" ? 80 : size === "large" ? 140 : 100,
      borderRadius: getSizeStyles().borderRadius - 4,
      marginBottom: 12,
    };

    if (typeof image === "string") {
      return (
        <Image source={{ uri: image }} style={imageStyle} resizeMode="cover" />
      );
    }

    return React.cloneElement(image, {
      style: [image.props.style, imageStyle],
    });
  };

  const renderHeader = () => {
    if (!title && !subtitle && !icon) return null;

    const currentTheme = isDarkMode
      ? FreudDesignSystem.themes.dark
      : FreudDesignSystem.themes.light;

    return (
      <View style={[styles.header, headerStyle]}>
        {icon && (
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: FreudColors.serenityGreen[10],
                borderRadius: FreudBorderRadius.lg,
                padding: FreudSpacing[2],
              },
            ]}
          >
            {typeof icon === "string" ? (
              <MentalHealthIcon
                name={icon}
                size={size === "small" ? 20 : size === "large" ? 28 : 24}
                color={FreudColors.mindfulBrown[70]}
              />
            ) : (
              React.cloneElement(icon, {
                size: size === "small" ? 20 : size === "large" ? 28 : 24,
                color: FreudColors.mindfulBrown[70],
              })
            )}
          </View>
        )}

        <View style={styles.titleContainer}>
          {title && (
            <Text
              style={[
                styles.title,
                {
                  color: currentTheme.colors.text.primary,
                  fontSize:
                    size === "small"
                      ? FreudTypography.sizes.base
                      : size === "large"
                        ? FreudTypography.sizes.xl
                        : FreudTypography.sizes.lg,
                  fontFamily: FreudTypography.fontFamily.primary,
                  fontWeight: FreudTypography.weights.semiBold,
                  lineHeight:
                    (size === "small"
                      ? FreudTypography.sizes.base
                      : size === "large"
                        ? FreudTypography.sizes.xl
                        : FreudTypography.sizes.lg) *
                    FreudTypography.lineHeights.normal,
                },
              ]}
              numberOfLines={2}
            >
              {title}
            </Text>
          )}

          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                {
                  color: currentTheme.colors.text.secondary,
                  fontSize:
                    size === "small"
                      ? FreudTypography.sizes.xs
                      : size === "large"
                        ? FreudTypography.sizes.base
                        : FreudTypography.sizes.sm,
                  fontFamily: FreudTypography.fontFamily.primary,
                  fontWeight: FreudTypography.weights.normal,
                  lineHeight:
                    (size === "small"
                      ? FreudTypography.sizes.xs
                      : size === "large"
                        ? FreudTypography.sizes.base
                        : FreudTypography.sizes.sm) *
                    FreudTypography.lineHeights.normal,
                  marginTop: FreudSpacing[1],
                },
              ]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const renderDescription = () => {
    if (!description) return null;

    return (
      <Text
        style={[
          styles.description,
          {
            color: theme.colors.text.secondary,
            fontSize: size === "small" ? 12 : size === "large" ? 16 : 14,
          },
        ]}
        numberOfLines={size === "small" ? 2 : size === "large" ? 4 : 3}
      >
        {description}
      </Text>
    );
  };

  const renderContent = () => {
    if (!children) return null;

    return <View style={[styles.content, contentStyle]}>{children}</View>;
  };

  const CardWrapper = ({ children }) => {
    if (glassmorphism) {
      return (
        <BlurView
          style={getCardStyles()}
          blurType={isDarkMode ? "dark" : "light"}
          blurAmount={10}
          reducedTransparencyFallbackColor={
            isDarkMode ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.8)"
          }
        >
          {children}
        </BlurView>
      );
    }
    return <View style={getCardStyles()}>{children}</View>;
  };

  const CardContent = () => (
    <CardWrapper>
      {renderImage()}
      {renderHeader()}
      {renderDescription()}
      {renderContent()}
    </CardWrapper>
  );

  if (onPress) {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled || loading}
          activeOpacity={0.95}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel || title}
          accessibilityHint={accessibilityHint}
          testID={testID}
        >
          <CardContent />
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return <CardContent />;
};

// Card Header Component
export const CardHeader = ({ title, subtitle, icon, action, style = {} }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.cardHeader, style]}>
      <View style={styles.cardHeaderLeft}>
        {icon && (
          <View style={styles.cardHeaderIcon}>
            {typeof icon === "string" ? (
              <MentalHealthIcon
                name={icon}
                size={24}
                color={theme.colors.text.primary}
              />
            ) : (
              icon
            )}
          </View>
        )}

        <View style={styles.cardHeaderText}>
          {title && (
            <Text
              style={[
                styles.cardHeaderTitle,
                { color: theme.colors.text.primary },
              ]}
            >
              {title}
            </Text>
          )}
          {subtitle && (
            <Text
              style={[
                styles.cardHeaderSubtitle,
                { color: theme.colors.text.secondary },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {action && <View style={styles.cardHeaderAction}>{action}</View>}
    </View>
  );
};

// Card Footer Component
export const CardFooter = ({
  children,
  actions,
  orientation = "horizontal",
  style = {},
}) => {
  const renderActions = () => {
    if (!actions) return null;

    return (
      <View
        style={[
          styles.cardFooterActions,
          {
            flexDirection: orientation === "horizontal" ? "row" : "column",
            gap: orientation === "horizontal" ? 12 : 8,
          },
        ]}
      >
        {actions}
      </View>
    );
  };

  return (
    <View style={[styles.cardFooter, style]}>
      {children}
      {renderActions()}
    </View>
  );
};

// Specialized Card Components - Enhanced with Freud Design System

// Therapeutic Card Variants
export const TherapeuticCard = (props) => (
  <Card {...props} variant="therapeutic" elevation="md" />
);

export const MindfulCard = (props) => (
  <Card {...props} variant="mindful" elevation="md" />
);

export const EmpathyCard = (props) => (
  <Card {...props} variant="empathy" elevation="md" />
);

export const GlassMorphCard = (props) => <Card {...props} glassmorphism />;

// Card Group for related cards
export const CardGroup = ({
  children,
  orientation = "vertical",
  spacing = FreudSpacing[3],
  style = {},
}) => {
  return (
    <View
      style={[
        {
          gap: spacing,
          flexDirection: orientation === "horizontal" ? "row" : "column",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

// Specialized Card Components

// Journal Card for mental health journaling
export const JournalCard = ({
  entry,
  mood,
  date,
  tags = [],
  onPress,
  onEdit,
  onDelete,
  ...props
}) => {
  const { theme } = useTheme();

  return (
    <Card
      {...props}
      onPress={onPress}
      therapeuticColor="nurturing"
      variant="therapeutic"
    >
      <View style={styles.journalHeader}>
        <Text
          style={[styles.journalDate, { color: theme.colors.text.tertiary }]}
        >
          {date}
        </Text>
        {mood && <Tag label={mood} therapeuticColor="calming" size="small" />}
      </View>

      <Text
        style={[styles.journalEntry, { color: theme.colors.text.primary }]}
        numberOfLines={4}
      >
        {entry}
      </Text>

      {tags.length > 0 && (
        <View style={styles.journalTags}>
          {tags.slice(0, 3).map((tag, index) => (
            <Tag key={index} label={tag} variant="outline" size="small" />
          ))}
          {tags.length > 3 && (
            <Text
              style={[styles.moreTags, { color: theme.colors.text.tertiary }]}
            >
              +{tags.length - 3} more
            </Text>
          )}
        </View>
      )}

      <CardFooter
        actions={[
          <Button
            key="edit"
            title="Edit"
            variant="ghost"
            size="small"
            onPress={onEdit}
          />,
          <Button
            key="delete"
            title="Delete"
            variant="ghost"
            size="small"
            therapeuticColor="energizing"
            onPress={onDelete}
          />,
        ]}
      />
    </Card>
  );
};

// Progress Card for tracking mental health metrics
export const ProgressCard = ({
  title,
  value,
  maxValue = 100,
  change,
  period = "this week",
  icon,
  ...props
}) => {
  const { theme } = useTheme();
  const percentage = (value / maxValue) * 100;
  const isPositive = change > 0;

  return (
    <Card
      {...props}
      title={title}
      icon={icon}
      therapeuticColor="grounding"
      variant="elevated"
    >
      <View style={styles.progressValue}>
        <Text
          style={[styles.progressNumber, { color: theme.colors.text.primary }]}
        >
          {value}
        </Text>
        <Text
          style={[styles.progressMax, { color: theme.colors.text.tertiary }]}
        >
          / {maxValue}
        </Text>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: getTherapeuticColor("grounding", 500),
            },
          ]}
        />
      </View>

      {change !== undefined && (
        <View style={styles.progressChange}>
          <MentalHealthIcon
            name="Heart"
            size={12}
            color={
              isPositive ? theme.colors.success[500] : theme.colors.error[500]
            }
          />
          <Text
            style={[
              styles.progressChangeText,
              {
                color: isPositive
                  ? theme.colors.success[500]
                  : theme.colors.error[500],
              },
            ]}
          >
            {isPositive ? "+" : ""}
            {change} {period}
          </Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "600",
    marginBottom: 2,
  },
  subtitle: {
    fontWeight: "400",
  },
  description: {
    lineHeight: 20,
    marginBottom: 12,
  },
  content: {
    flex: 1,
  },

  // Card Header Styles
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cardHeaderIcon: {
    marginRight: 12,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardHeaderSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  cardHeaderAction: {
    marginLeft: 12,
  },

  // Card Footer Styles
  cardFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  cardFooterActions: {
    alignItems: "center",
    justifyContent: "flex-end",
  },

  // Journal Card Styles
  journalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  journalDate: {
    fontSize: 12,
    fontWeight: "500",
  },
  journalEntry: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  journalTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  moreTags: {
    fontSize: 12,
    alignSelf: "center",
  },

  // Progress Card Styles
  progressValue: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  progressNumber: {
    fontSize: 24,
    fontWeight: "bold",
  },
  progressMax: {
    fontSize: 16,
    marginLeft: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressChange: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressChangeText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
});

export default Card;
