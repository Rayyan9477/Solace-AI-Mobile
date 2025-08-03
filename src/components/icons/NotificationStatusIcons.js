import PropTypes from "prop-types";
import React from "react";
import Svg, {
  Path,
  Circle,
  Rect,
  Line,
  Polyline,
  Polygon,
  G,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";

import { BaseDesignTokens } from "../../design-system/DesignTokens";

// Base Notification Status Icon Component
const NotificationStatusIcon = ({
  name,
  size = 24,
  color,
  therapeuticTheme = "balance",
  variant = "outline",
  strokeWidth = 2,
  style,
  testID,
}) => {
  const tokens = BaseDesignTokens;

  const getColor = () => {
    if (color) return color;

    if (therapeuticTheme) {
      const therapeuticColors = tokens.colors.therapeutic[therapeuticTheme];
      return therapeuticColors?.[600] || tokens.colors.primary[600];
    }

    return tokens.colors.primary[600];
  };

  const iconColor = getColor();
  const fillColor = variant === "filled" ? iconColor : "none";
  const strokeColor = variant === "filled" ? "none" : iconColor;

  const renderIcon = () => {
    switch (name) {
      // Basic Notifications
      case "bell":
        return (
          <G>
            <Path
              d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M13.73 21a2 2 0 0 1-3.46 0"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        );

      case "bell-off":
        return (
          <G>
            <Path
              d="M13.73 21a2 2 0 0 1-3.46 0"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M18.63 13A17.89 17.89 0 0 1 18 8"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M18 8a6 6 0 0 0-9.33-5"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Line
              x1="1"
              y1="1"
              x2="23"
              y2="23"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      case "notification":
        return (
          <G>
            <Path
              d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M13.73 21a2 2 0 0 1-3.46 0"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle
              cx="18"
              cy="6"
              r="3"
              fill={variant === "filled" ? "#FF4444" : "#FF4444"}
              stroke="#FFFFFF"
              strokeWidth={1}
            />
          </G>
        );

      case "notification-dot":
        return (
          <G>
            <Circle
              cx="12"
              cy="12"
              r="9"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Circle
              cx="12"
              cy="12"
              r="3"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle cx="18" cy="6" r="2" fill="#FF4444" />
          </G>
        );

      // Alert and Status Indicators
      case "alert":
        return (
          <G>
            <Path
              d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Line
              x1="12"
              y1="9"
              x2="12"
              y2="13"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Circle
              cx="12"
              cy="17"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
          </G>
        );

      case "alert-circle":
        return (
          <G>
            <Circle
              cx="12"
              cy="12"
              r="10"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Line
              x1="12"
              y1="8"
              x2="12"
              y2="12"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Circle
              cx="12"
              cy="16"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
          </G>
        );

      case "warning":
        return (
          <G>
            <Path
              d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Line
              x1="12"
              y1="9"
              x2="12"
              y2="13"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Circle
              cx="12"
              cy="17"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
          </G>
        );

      case "error":
        return (
          <G>
            <Circle
              cx="12"
              cy="12"
              r="10"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Line
              x1="15"
              y1="9"
              x2="9"
              y2="15"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="9"
              y1="9"
              x2="15"
              y2="15"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      case "success":
        return (
          <G>
            <Circle
              cx="12"
              cy="12"
              r="10"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Polyline
              points="9,12 12,15 16,10"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        );

      case "info":
        return (
          <G>
            <Circle
              cx="12"
              cy="12"
              r="10"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Line
              x1="12"
              y1="16"
              x2="12"
              y2="12"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Circle
              cx="12"
              cy="8"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
          </G>
        );

      // Status Badges and Indicators
      case "badge":
        return (
          <G>
            <Circle
              cx="12"
              cy="12"
              r="9"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Circle
              cx="12"
              cy="12"
              r="4"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle
              cx="16"
              cy="8"
              r="3"
              fill="#FF4444"
              stroke="#FFFFFF"
              strokeWidth={1}
            />
          </G>
        );

      case "badge-check":
        return (
          <G>
            <Circle
              cx="12"
              cy="12"
              r="9"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Polyline
              points="9,12 12,15 16,10"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle cx="18" cy="6" r="2" fill="#22C55E" />
          </G>
        );

      case "status-online":
        return (
          <G>
            <Circle
              cx="12"
              cy="12"
              r="9"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Circle
              cx="12"
              cy="12"
              r="4"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle
              cx="18"
              cy="6"
              r="3"
              fill="#22C55E"
              stroke="#FFFFFF"
              strokeWidth={1}
            />
          </G>
        );

      case "status-offline":
        return (
          <G>
            <Circle
              cx="12"
              cy="12"
              r="9"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Circle
              cx="12"
              cy="12"
              r="4"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle
              cx="18"
              cy="6"
              r="3"
              fill="#6B7280"
              stroke="#FFFFFF"
              strokeWidth={1}
            />
          </G>
        );

      case "status-away":
        return (
          <G>
            <Circle
              cx="12"
              cy="12"
              r="9"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Circle
              cx="12"
              cy="12"
              r="4"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle
              cx="18"
              cy="6"
              r="3"
              fill="#F59E0B"
              stroke="#FFFFFF"
              strokeWidth={1}
            />
          </G>
        );

      case "status-busy":
        return (
          <G>
            <Circle
              cx="12"
              cy="12"
              r="9"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Circle
              cx="12"
              cy="12"
              r="4"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle
              cx="18"
              cy="6"
              r="3"
              fill="#EF4444"
              stroke="#FFFFFF"
              strokeWidth={1}
            />
            <Line
              x1="16"
              y1="4"
              x2="20"
              y2="8"
              stroke="#FFFFFF"
              strokeWidth={1}
              strokeLinecap="round"
            />
          </G>
        );

      // Progress and Loading Indicators
      case "loading":
        return (
          <G>
            <Circle
              cx="12"
              cy="12"
              r="8"
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeOpacity="0.2"
            />
            <Path
              d="M12 4A8 8 0 0 1 20 12"
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      case "spinner":
        return (
          <G>
            <Circle
              cx="12"
              cy="12"
              r="8"
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeOpacity="0.2"
            />
            <Path
              d="M12 4A8 8 0 0 1 20 12A8 8 0 0 1 16 19"
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      case "progress-indicator":
        return (
          <G>
            <Circle
              cx="12"
              cy="12"
              r="9"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Path
              d="M12 3A9 9 0 0 1 19.5 8"
              fill="none"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth * 1.5}
              strokeLinecap="round"
            />
            <Circle
              cx="12"
              cy="12"
              r="3"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
          </G>
        );

      // Mental Health Specific Status
      case "mood-positive":
        return (
          <G>
            <Circle
              cx="12"
              cy="12"
              r="9"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Circle
              cx="9"
              cy="9"
              r="1.5"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle
              cx="15"
              cy="9"
              r="1.5"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Path
              d="M8 14s1.5 2 4 2 4-2 4-2"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        );

      case "mood-negative":
        return (
          <G>
            <Circle
              cx="12"
              cy="12"
              r="9"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Circle
              cx="9"
              cy="9"
              r="1.5"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle
              cx="15"
              cy="9"
              r="1.5"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Path
              d="M16 16s-1.5-2-4-2-4 2-4 2"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        );

      case "mood-neutral":
        return (
          <G>
            <Circle
              cx="12"
              cy="12"
              r="9"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Circle
              cx="9"
              cy="9"
              r="1.5"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle
              cx="15"
              cy="9"
              r="1.5"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Line
              x1="8"
              y1="15"
              x2="16"
              y2="15"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      case "wellness-status":
        return (
          <G>
            <Circle
              cx="12"
              cy="12"
              r="9"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Path
              d="M12 6c3 0 6 2.5 6 6s-3 6-6 6-6-2.5-6-6 3-6 6-6z"
              fill={variant === "filled" ? "#FFFFFF" : "none"}
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
            />
            <Circle
              cx="12"
              cy="12"
              r="2"
              fill={variant === "filled" ? strokeColor : "#FFFFFF"}
            />
            <Path
              d="M12 8v2l1.5 1.5"
              stroke={variant === "filled" ? strokeColor : "#FFFFFF"}
              strokeWidth={strokeWidth * 0.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        );

      // Push Notification Types
      case "message-notification":
        return (
          <G>
            <Path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle
              cx="9"
              cy="10"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle
              cx="12"
              cy="10"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle
              cx="15"
              cy="10"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle
              cx="18"
              cy="3"
              r="3"
              fill="#FF4444"
              stroke="#FFFFFF"
              strokeWidth={1}
            />
          </G>
        );

      case "reminder-notification":
        return (
          <G>
            <Circle
              cx="12"
              cy="12"
              r="9"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Polyline
              points="12,6 12,12 16,14"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle cx="18" cy="6" r="2" fill="#F59E0B" />
          </G>
        );

      case "therapy-reminder":
        return (
          <G>
            <Circle
              cx="12"
              cy="8"
              r="5"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Path
              d="M20 21a8 8 0 1 0-16 0"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Circle
              cx="10"
              cy="6"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle
              cx="14"
              cy="6"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Path
              d="M10 9s1 1 2 1 2-1 2-1"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Circle
              cx="18"
              cy="6"
              r="3"
              fill="#22C55E"
              stroke="#FFFFFF"
              strokeWidth={1}
            />
          </G>
        );

      // Priority and Urgency Indicators
      case "priority-high":
        return (
          <G>
            <Path
              d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Line
              x1="12"
              y1="8"
              x2="12"
              y2="12"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Circle
              cx="12"
              cy="16"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle cx="18" cy="6" r="2" fill="#EF4444" />
          </G>
        );

      case "priority-medium":
        return (
          <G>
            <Path
              d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle
              cx="12"
              cy="12"
              r="2"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle cx="18" cy="6" r="2" fill="#F59E0B" />
          </G>
        );

      case "priority-low":
        return (
          <G>
            <Path
              d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Line
              x1="8"
              y1="12"
              x2="16"
              y2="12"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Circle cx="18" cy="6" r="2" fill="#22C55E" />
          </G>
        );

      case "urgent":
        return (
          <G>
            <Path
              d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Line
              x1="12"
              y1="9"
              x2="12"
              y2="13"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Circle
              cx="12"
              cy="17"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Defs>
              <LinearGradient
                id="urgentGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <Stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
                <Stop offset="100%" stopColor="#DC2626" stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <Circle
              cx="20"
              cy="4"
              r="3"
              fill="url(#urgentGradient)"
              stroke="#FFFFFF"
              strokeWidth={1}
            />
          </G>
        );

      // Default fallback
      default:
        return (
          <G>
            <Path
              d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M13.73 21a2 2 0 0 1-3.46 0"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        );
    }
  };

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={style}
      testID={testID || `notification-status-icon-${name}`}
    >
      {renderIcon()}
    </Svg>
  );
};

// Specialized Notification Status Icon Components
export const BellIcon = (props) => (
  <NotificationStatusIcon name="bell" {...props} />
);
export const BellOffIcon = (props) => (
  <NotificationStatusIcon name="bell-off" {...props} />
);
export const NotificationIcon = (props) => (
  <NotificationStatusIcon name="notification" {...props} />
);
export const NotificationDotIcon = (props) => (
  <NotificationStatusIcon name="notification-dot" {...props} />
);
export const AlertIcon = (props) => (
  <NotificationStatusIcon name="alert" {...props} />
);
export const AlertCircleIcon = (props) => (
  <NotificationStatusIcon name="alert-circle" {...props} />
);
export const WarningIcon = (props) => (
  <NotificationStatusIcon name="warning" {...props} />
);
export const ErrorIcon = (props) => (
  <NotificationStatusIcon name="error" {...props} />
);
export const SuccessIcon = (props) => (
  <NotificationStatusIcon name="success" {...props} />
);
export const InfoIcon = (props) => (
  <NotificationStatusIcon name="info" {...props} />
);
export const BadgeIcon = (props) => (
  <NotificationStatusIcon name="badge" {...props} />
);
export const BadgeCheckIcon = (props) => (
  <NotificationStatusIcon name="badge-check" {...props} />
);
export const StatusOnlineIcon = (props) => (
  <NotificationStatusIcon name="status-online" {...props} />
);
export const StatusOfflineIcon = (props) => (
  <NotificationStatusIcon name="status-offline" {...props} />
);
export const StatusAwayIcon = (props) => (
  <NotificationStatusIcon name="status-away" {...props} />
);
export const StatusBusyIcon = (props) => (
  <NotificationStatusIcon name="status-busy" {...props} />
);
export const LoadingIcon = (props) => (
  <NotificationStatusIcon name="loading" {...props} />
);
export const SpinnerIcon = (props) => (
  <NotificationStatusIcon name="spinner" {...props} />
);
export const ProgressIndicatorIcon = (props) => (
  <NotificationStatusIcon name="progress-indicator" {...props} />
);
export const MoodPositiveIcon = (props) => (
  <NotificationStatusIcon name="mood-positive" {...props} />
);
export const MoodNegativeIcon = (props) => (
  <NotificationStatusIcon name="mood-negative" {...props} />
);
export const MoodNeutralIcon = (props) => (
  <NotificationStatusIcon name="mood-neutral" {...props} />
);
export const WellnessStatusIcon = (props) => (
  <NotificationStatusIcon name="wellness-status" {...props} />
);
export const MessageNotificationIcon = (props) => (
  <NotificationStatusIcon name="message-notification" {...props} />
);
export const ReminderNotificationIcon = (props) => (
  <NotificationStatusIcon name="reminder-notification" {...props} />
);
export const TherapyReminderIcon = (props) => (
  <NotificationStatusIcon name="therapy-reminder" {...props} />
);
export const PriorityHighIcon = (props) => (
  <NotificationStatusIcon name="priority-high" {...props} />
);
export const PriorityMediumIcon = (props) => (
  <NotificationStatusIcon name="priority-medium" {...props} />
);
export const PriorityLowIcon = (props) => (
  <NotificationStatusIcon name="priority-low" {...props} />
);
export const UrgentIcon = (props) => (
  <NotificationStatusIcon name="urgent" {...props} />
);

// Notification Status Icon Collection
export const NotificationStatusIconCollection = {
  // Basic Notifications
  bell: BellIcon,
  bellOff: BellOffIcon,
  notification: NotificationIcon,
  notificationDot: NotificationDotIcon,

  // Alert & Status
  alert: AlertIcon,
  alertCircle: AlertCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  success: SuccessIcon,
  info: InfoIcon,

  // Status Badges
  badge: BadgeIcon,
  badgeCheck: BadgeCheckIcon,
  statusOnline: StatusOnlineIcon,
  statusOffline: StatusOfflineIcon,
  statusAway: StatusAwayIcon,
  statusBusy: StatusBusyIcon,

  // Progress & Loading
  loading: LoadingIcon,
  spinner: SpinnerIcon,
  progressIndicator: ProgressIndicatorIcon,

  // Mental Health Status
  moodPositive: MoodPositiveIcon,
  moodNegative: MoodNegativeIcon,
  moodNeutral: MoodNeutralIcon,
  wellnessStatus: WellnessStatusIcon,

  // Push Notifications
  messageNotification: MessageNotificationIcon,
  reminderNotification: ReminderNotificationIcon,
  therapyReminder: TherapyReminderIcon,

  // Priority & Urgency
  priorityHigh: PriorityHighIcon,
  priorityMedium: PriorityMediumIcon,
  priorityLow: PriorityLowIcon,
  urgent: UrgentIcon,
};

// PropTypes
NotificationStatusIcon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
  therapeuticTheme: PropTypes.oneOf([
    "calming",
    "nurturing",
    "peaceful",
    "grounding",
    "energizing",
    "focus",
    "mindful",
    "balance",
  ]),
  variant: PropTypes.oneOf(["outline", "filled"]),
  strokeWidth: PropTypes.number,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  testID: PropTypes.string,
};

export default NotificationStatusIcon;
