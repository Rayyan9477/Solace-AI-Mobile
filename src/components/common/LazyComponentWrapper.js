import { LinearGradient } from "expo-linear-gradient";
import React, { Suspense, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";

import { useTheme } from "../../shared/theme/ThemeContext";

const { width: screenWidth } = Dimensions.get("window");

/**
 * Enhanced loading skeleton component with therapeutic design
 */
const LoadingSkeleton = ({
  width = "100%",
  height = 60,
  borderRadius = 8,
  showPulse = true,
}) => {
  const { theme } = useTheme();
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (!showPulse) return;

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );

    pulse.start();

    return () => pulse.stop();
  }, [showPulse, pulseAnim]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          backgroundColor: theme.colors.gray[200],
          opacity: pulseAnim,
        },
      ]}
    />
  );
};

/**
 * Intelligent loading component that adapts to content type
 */
const IntelligentLoader = ({
  componentType = "default",
  size = "medium",
  message,
  showProgress = false,
  progress = 0,
}) => {
  const { theme } = useTheme();

  const getSkeletonConfig = () => {
    switch (componentType) {
      case "chat":
        return (
          <View style={styles.chatSkeleton}>
            <LoadingSkeleton width={60} height={60} borderRadius={30} />
            <View style={styles.chatBubbleSkeleton}>
              <LoadingSkeleton width="80%" height={20} />
              <LoadingSkeleton width="60%" height={20} />
            </View>
          </View>
        );

      case "card":
        return (
          <View style={styles.cardSkeleton}>
            <LoadingSkeleton width="100%" height={120} />
            <LoadingSkeleton width="70%" height={16} />
            <LoadingSkeleton width="50%" height={16} />
          </View>
        );

      case "list":
        return (
          <View style={styles.listSkeleton}>
            {Array.from({ length: 3 }).map((_, index) => (
              <View key={index} style={styles.listItemSkeleton}>
                <LoadingSkeleton width={40} height={40} borderRadius={20} />
                <View style={styles.listTextSkeleton}>
                  <LoadingSkeleton width="100%" height={16} />
                  <LoadingSkeleton width="70%" height={14} />
                </View>
              </View>
            ))}
          </View>
        );

      case "dashboard":
        return (
          <View style={styles.dashboardSkeleton}>
            <LoadingSkeleton width="100%" height={80} />
            <View style={styles.dashboardRowSkeleton}>
              <LoadingSkeleton width="48%" height={100} />
              <LoadingSkeleton width="48%" height={100} />
            </View>
            <LoadingSkeleton width="100%" height={120} />
          </View>
        );

      default:
        return <LoadingSkeleton />;
    }
  };

  const sizeConfig = {
    small: { indicator: 20, text: 12 },
    medium: { indicator: 30, text: 14 },
    large: { indicator: 40, text: 16 },
  };

  const config = sizeConfig[size];

  return (
    <View style={styles.loaderContainer}>
      <LinearGradient
        colors={[
          theme.colors.therapeutic.calming[50],
          theme.colors.therapeutic.peaceful[50],
        ]}
        style={styles.loaderGradient}
      >
        {componentType !== "default" ? (
          getSkeletonConfig()
        ) : (
          <View style={styles.defaultLoader}>
            <ActivityIndicator
              size={config.indicator}
              color={theme.colors.therapeutic.calming[500]}
            />
            {message && (
              <Text
                style={[
                  styles.loaderText,
                  {
                    color: theme.colors.text.secondary,
                    fontSize: config.text,
                  },
                ]}
              >
                {message}
              </Text>
            )}
            {showProgress && (
              <View style={styles.progressContainer}>
                <View
                  style={[
                    styles.progressBar,
                    { backgroundColor: theme.colors.gray[200] },
                  ]}
                >
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${progress}%`,
                        backgroundColor: theme.colors.therapeutic.calming[500],
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.progressText,
                    { color: theme.colors.text.tertiary },
                  ]}
                >
                  {Math.round(progress)}%
                </Text>
              </View>
            )}
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

/**
 * Error boundary for lazy components
 */
class LazyComponentErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.warn("LazyComponent Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Failed to load component</Text>
            <Text style={styles.errorMessage}>
              {this.state.error?.message || "Unknown error occurred"}
            </Text>
          </View>
        )
      );
    }

    return this.props.children;
  }
}

/**
 * Enhanced lazy component wrapper with intelligent loading states
 */
const LazyComponentWrapper = ({
  children,
  fallback,
  componentType = "default",
  size = "medium",
  loadingMessage,
  showProgress = false,
  progress = 0,
  errorFallback,
  onLoadStart,
  onLoadComplete,
  onError,
  timeout = 30000, // 30 second timeout
}) => {
  const [isTimeout, setIsTimeout] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    onLoadStart?.();

    // Set timeout for loading
    timeoutRef.current = setTimeout(() => {
      setIsTimeout(true);
      onError?.(new Error("Component loading timeout"));
    }, timeout);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onLoadStart, onError, timeout]);

  useEffect(() => {
    // Clear timeout when component loads
    const handleLoad = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      onLoadComplete?.();
    };

    // This is a bit hacky, but we listen for when Suspense resolves
    const timer = setTimeout(handleLoad, 100);
    return () => clearTimeout(timer);
  }, [children, onLoadComplete]);

  if (isTimeout) {
    return (
      errorFallback || (
        <View style={styles.timeoutContainer}>
          <Text style={styles.timeoutTitle}>Loading timeout</Text>
          <Text style={styles.timeoutMessage}>
            Component took too long to load. Please try again.
          </Text>
        </View>
      )
    );
  }

  const defaultFallback = (
    <IntelligentLoader
      componentType={componentType}
      size={size}
      message={loadingMessage}
      showProgress={showProgress}
      progress={progress}
    />
  );

  return (
    <LazyComponentErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback || defaultFallback}>{children}</Suspense>
    </LazyComponentErrorBoundary>
  );
};

/**
 * Higher-order component for creating lazy-loaded components
 */
export const withLazyWrapper = (importFunc, wrapperProps = {}) => {
  const LazyComponent = React.lazy(importFunc);

  return React.forwardRef((props, ref) => (
    <LazyComponentWrapper {...wrapperProps}>
      <LazyComponent {...props} ref={ref} />
    </LazyComponentWrapper>
  ));
};

/**
 * Hook for managing multiple lazy components
 */
export const useLazyComponents = (componentConfigs = []) => {
  const [loadedComponents, setLoadedComponents] = useState(new Map());
  const [loadingStates, setLoadingStates] = useState(new Map());
  const [errors, setErrors] = useState(new Map());

  const loadComponent = async (key) => {
    const config = componentConfigs.find((c) => c.key === key);
    if (!config || loadedComponents.has(key)) return;

    setLoadingStates((prev) => new Map([...prev, [key, true]]));

    try {
      const module = await config.importFunc();
      const Component = module.default || module;

      setLoadedComponents((prev) => new Map([...prev, [key, Component]]));
      setLoadingStates((prev) => new Map([...prev, [key, false]]));
    } catch (error) {
      setErrors((prev) => new Map([...prev, [key, error]]));
      setLoadingStates((prev) => new Map([...prev, [key, false]]));
    }
  };

  return {
    loadComponent,
    getComponent: (key) => loadedComponents.get(key),
    isLoading: (key) => loadingStates.get(key) || false,
    getError: (key) => errors.get(key),
    isLoaded: (key) => loadedComponents.has(key),
  };
};

const styles = StyleSheet.create({
  loaderContainer: {
    minHeight: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loaderGradient: {
    width: "100%",
    minHeight: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    padding: 20,
  },
  defaultLoader: {
    alignItems: "center",
  },
  loaderText: {
    marginTop: 12,
    textAlign: "center",
    fontWeight: "500",
  },
  progressContainer: {
    width: "100%",
    marginTop: 16,
    alignItems: "center",
  },
  progressBar: {
    width: "100%",
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    marginTop: 4,
  },
  skeleton: {
    marginVertical: 4,
  },
  chatSkeleton: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
    padding: 12,
  },
  chatBubbleSkeleton: {
    flex: 1,
    marginLeft: 12,
  },
  cardSkeleton: {
    width: "100%",
    padding: 16,
  },
  listSkeleton: {
    width: "100%",
  },
  listItemSkeleton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
  },
  listTextSkeleton: {
    flex: 1,
    marginLeft: 12,
  },
  dashboardSkeleton: {
    width: "100%",
    padding: 16,
  },
  dashboardRowSkeleton: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  timeoutContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
  },
  timeoutTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F59E0B",
    marginBottom: 8,
  },
  timeoutMessage: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});

export default LazyComponentWrapper;
