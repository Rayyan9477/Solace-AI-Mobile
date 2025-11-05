/**
 * Responsive Layout Components
 * Optimized layouts for mental health app across mobile and web platforms
 * Based on modern design principles and accessibility best practices
 */

import { useTheme } from "@theme/ThemeProvider";
import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  Platform,
  ScrollView,
  Animated,
} from "react-native";

// Mock spacing
const spacing = { sm: 8, md: 16, lg: 24 };

// Simple animated wrappers to replace TherapeuticAnimatedComponents
const SimpleAnimatedView = ({ children, delay = 0, style = {} }) => (
  <Animated.View style={[style]}>{children}</Animated.View>
);

// Create aliases for compatibility
const TherapeuticAnimatedComponents = {
  StaggeredEntrance: SimpleAnimatedView,
  MoodFadeIn: SimpleAnimatedView,
};

// Breakpoints for responsive design
export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
};

// Layout configurations for different screen sizes
export const LAYOUT_CONFIGS = {
  mobile: {
    columns: 1,
    padding: spacing.md,
    gap: spacing.md,
    maxWidth: "100%",
    cardPadding: spacing.md,
  },
  tablet: {
    columns: 2,
    padding: spacing.lg,
    gap: spacing.lg,
    maxWidth: "100%",
    cardPadding: spacing.lg,
  },
  desktop: {
    columns: 3,
    padding: spacing.xl,
    gap: spacing.xl,
    maxWidth: 1200,
    cardPadding: spacing.xl,
  },
  wide: {
    columns: 4,
    padding: spacing.xl,
    gap: spacing.xl,
    maxWidth: 1440,
    cardPadding: spacing.xl,
  },
};

// Hook for responsive layout
export const useResponsiveLayout = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));
  const [screenType, setScreenType] = useState("mobile");

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    const { width } = dimensions;

    if (width >= BREAKPOINTS.wide) {
      setScreenType("wide");
    } else if (width >= BREAKPOINTS.desktop) {
      setScreenType("desktop");
    } else if (width >= BREAKPOINTS.tablet) {
      setScreenType("tablet");
    } else {
      setScreenType("mobile");
    }
  }, [dimensions]);

  const config = LAYOUT_CONFIGS[screenType];
  const isMobile = screenType === "mobile";
  const isTablet = screenType === "tablet";
  const isDesktop = screenType === "desktop" || screenType === "wide";

  return {
    dimensions,
    screenType,
    config,
    isMobile,
    isTablet,
    isDesktop,
    breakpoint: {
      mobile: screenType === "mobile",
      tablet: screenType === "tablet",
      desktop: screenType === "desktop",
      wide: screenType === "wide",
    },
  };
};

// Responsive container component
export const ResponsiveContainer = ({
  children,
  style = {},
  centerContent = false,
  maxWidth,
  padding,
}) => {
  const { theme } = useTheme();
  const { config, dimensions } = useResponsiveLayout();

  const containerStyles = [
    styles.container,
    {
      backgroundColor: theme.colors.background.primary,
      padding: padding || config.padding,
      maxWidth: maxWidth || config.maxWidth,
      width: "100%",
    },
    centerContent && styles.centered,
    Platform.OS === "web" && dimensions.width > 1024 && styles.webCentered,
    style,
  ];

  return <View style={containerStyles}>{children}</View>;
};

// Responsive grid layout for cards and components
export const ResponsiveGrid = ({
  children,
  columns,
  gap,
  style = {},
  animated = true,
  staggerDelay = 100,
}) => {
  const { config } = useResponsiveLayout();
  const gridColumns = columns || config.columns;
  const gridGap = gap || config.gap;

  const gridStyles = [
    styles.grid,
    {
      gap: gridGap,
    },
    Platform.OS === "web" && {
      display: "grid",
      gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
      gridGap,
    },
    style,
  ];

  // For React Native, we need to handle grid layout manually
  if (Platform.OS !== "web") {
    const rows = [];
    const childrenArray = React.Children.toArray(children);

    for (let i = 0; i < childrenArray.length; i += gridColumns) {
      const rowChildren = childrenArray.slice(i, i + gridColumns);

      rows.push(
        <View key={i} style={styles.gridRow}>
          {rowChildren.map((child, index) => (
            <View
              key={index}
              style={[
                styles.gridItem,
                {
                  flex: 1,
                  marginRight: index < rowChildren.length - 1 ? gridGap : 0,
                },
              ]}
            >
              {animated ? (
                <TherapeuticAnimatedComponents.StaggeredEntrance
                  index={i + index}
                  style={styles.animatedGridItem}
                >
                  {child}
                </TherapeuticAnimatedComponents.StaggeredEntrance>
              ) : (
                child
              )}
            </View>
          ))}
          {/* Fill empty spaces in the last row */}
          {rowChildren.length < gridColumns &&
            Array.from({ length: gridColumns - rowChildren.length }).map(
              (_, index) => <View key={`empty-${index}`} style={{ flex: 1 }} />,
            )}
        </View>,
      );
    }

    return <View style={[styles.grid, style]}>{rows}</View>;
  }

  // Web grid layout
  const childrenWithAnimation = animated
    ? React.Children.map(children, (child, index) => (
        <TherapeuticAnimatedComponents.StaggeredEntrance
          key={index}
          index={index}
          style={styles.animatedGridItem}
        >
          {child}
        </TherapeuticAnimatedComponents.StaggeredEntrance>
      ))
    : children;

  return <div style={gridStyles}>{childrenWithAnimation}</div>;
};

// Dashboard layout specifically designed for mental health app
export const DashboardLayout = ({ children, header, sidebar, style = {} }) => {
  const { theme } = useTheme();
  const { isMobile, isDesktop, config } = useResponsiveLayout();

  if (isMobile) {
    // Mobile layout: vertical stack
    return (
      <ResponsiveContainer style={style}>
        <ScrollView
          style={styles.mobileScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.mobileContent}
        >
          {header && (
            <TherapeuticAnimatedComponents.MoodFadeIn delay={0}>
              <View style={styles.mobileHeader}>{header}</View>
            </TherapeuticAnimatedComponents.MoodFadeIn>
          )}

          <TherapeuticAnimatedComponents.MoodFadeIn delay={200}>
            <View style={styles.mobileMain}>{children}</View>
          </TherapeuticAnimatedComponents.MoodFadeIn>
        </ScrollView>
      </ResponsiveContainer>
    );
  }

  if (isDesktop && sidebar) {
    // Desktop layout: sidebar + main content
    return (
      <ResponsiveContainer style={[styles.desktopLayout, style]}>
        <View style={styles.desktopContainer}>
          <TherapeuticAnimatedComponents.MoodFadeIn delay={0}>
            <View
              style={[
                styles.sidebar,
                { backgroundColor: theme.colors.background.secondary },
              ]}
            >
              {sidebar}
            </View>
          </TherapeuticAnimatedComponents.MoodFadeIn>

          <View style={styles.desktopMain}>
            {header && (
              <TherapeuticAnimatedComponents.MoodFadeIn delay={100}>
                <View style={styles.desktopHeader}>{header}</View>
              </TherapeuticAnimatedComponents.MoodFadeIn>
            )}

            <TherapeuticAnimatedComponents.MoodFadeIn delay={200}>
              <ScrollView
                style={styles.desktopScroll}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.desktopContent}
              >
                {children}
              </ScrollView>
            </TherapeuticAnimatedComponents.MoodFadeIn>
          </View>
        </View>
      </ResponsiveContainer>
    );
  }

  // Tablet layout: header + main content
  return (
    <ResponsiveContainer style={style}>
      <View style={styles.tabletContainer}>
        {header && (
          <TherapeuticAnimatedComponents.MoodFadeIn delay={0}>
            <View style={styles.tabletHeader}>{header}</View>
          </TherapeuticAnimatedComponents.MoodFadeIn>
        )}

        <TherapeuticAnimatedComponents.MoodFadeIn delay={100}>
          <ScrollView
            style={styles.tabletScroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.tabletContent}
          >
            {children}
          </ScrollView>
        </TherapeuticAnimatedComponents.MoodFadeIn>
      </View>
    </ResponsiveContainer>
  );
};

// Mood tracking specific layout
export const MoodTrackingLayout = ({
  children,
  progress,
  onNext,
  onPrevious,
  style = {},
}) => {
  const { isMobile, config } = useResponsiveLayout();

  return (
    <ResponsiveContainer style={style}>
      <View style={styles.moodTrackingContainer}>
        {/* Progress indicator */}
        {progress && (
          <TherapeuticAnimatedComponents.MoodFadeIn delay={0}>
            <View style={styles.progressContainer}>{progress}</View>
          </TherapeuticAnimatedComponents.MoodFadeIn>
        )}

        {/* Main content */}
        <TherapeuticAnimatedComponents.MoodFadeIn delay={200}>
          <ScrollView
            style={styles.moodTrackingScroll}
            contentContainerStyle={[
              styles.moodTrackingContent,
              { padding: config.padding },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </TherapeuticAnimatedComponents.MoodFadeIn>

        {/* Navigation buttons */}
        {(onNext || onPrevious) && (
          <TherapeuticAnimatedComponents.MoodFadeIn delay={400}>
            <View style={styles.moodTrackingNavigation}>
              {onPrevious && onPrevious}
              {onNext && onNext}
            </View>
          </TherapeuticAnimatedComponents.MoodFadeIn>
        )}
      </View>
    </ResponsiveContainer>
  );
};

// Therapy session layout
export const TherapySessionLayout = ({
  children,
  chatHeader,
  chatInput,
  style = {},
}) => {
  const { theme } = useTheme();
  const { config } = useResponsiveLayout();

  return (
    <ResponsiveContainer style={[styles.therapySessionContainer, style]}>
      <View style={styles.therapySessionLayout}>
        {/* Chat header */}
        {chatHeader && (
          <TherapeuticAnimatedComponents.MoodFadeIn delay={0}>
            <View
              style={[
                styles.therapyHeader,
                { backgroundColor: theme.colors.background.secondary },
              ]}
            >
              {chatHeader}
            </View>
          </TherapeuticAnimatedComponents.MoodFadeIn>
        )}

        {/* Chat messages */}
        <TherapeuticAnimatedComponents.MoodFadeIn delay={100}>
          <ScrollView
            style={styles.therapyMessages}
            contentContainerStyle={[
              styles.therapyMessagesContent,
              { padding: config.padding },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </TherapeuticAnimatedComponents.MoodFadeIn>

        {/* Chat input */}
        {chatInput && (
          <TherapeuticAnimatedComponents.MoodFadeIn delay={200}>
            <View
              style={[
                styles.therapyInput,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              {chatInput}
            </View>
          </TherapeuticAnimatedComponents.MoodFadeIn>
        )}
      </View>
    </ResponsiveContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
  webCentered: {
    ...Platform.select({
      web: {
        marginLeft: "auto",
        marginRight: "auto",
      },
    }),
  },
  grid: {
    width: "100%",
  },
  gridRow: {
    flexDirection: "row",
    marginBottom: spacing.md,
  },
  gridItem: {
    flex: 1,
  },
  animatedGridItem: {
    width: "100%",
  },

  // Mobile layouts
  mobileScroll: {
    flex: 1,
  },
  mobileContent: {
    flexGrow: 1,
  },
  mobileHeader: {
    marginBottom: spacing.lg,
  },
  mobileMain: {
    flex: 1,
  },

  // Desktop layouts
  desktopLayout: {
    flex: 1,
  },
  desktopContainer: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    width: 280,
    padding: spacing.lg,
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
  },
  desktopMain: {
    flex: 1,
  },
  desktopHeader: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  desktopScroll: {
    flex: 1,
  },
  desktopContent: {
    flexGrow: 1,
    padding: spacing.xl,
  },

  // Tablet layouts
  tabletContainer: {
    flex: 1,
  },
  tabletHeader: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tabletScroll: {
    flex: 1,
  },
  tabletContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },

  // Mood tracking layout
  moodTrackingContainer: {
    flex: 1,
  },
  progressContainer: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  moodTrackingScroll: {
    flex: 1,
  },
  moodTrackingContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  moodTrackingNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  // Therapy session layout
  therapySessionContainer: {
    flex: 1,
  },
  therapySessionLayout: {
    flex: 1,
  },
  therapyHeader: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  therapyMessages: {
    flex: 1,
  },
  therapyMessagesContent: {
    flexGrow: 1,
  },
  therapyInput: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
});

export default {
  useResponsiveLayout,
  ResponsiveContainer,
  ResponsiveGrid,
  DashboardLayout,
  MoodTrackingLayout,
  TherapySessionLayout,
  BREAKPOINTS,
  LAYOUT_CONFIGS,
};
