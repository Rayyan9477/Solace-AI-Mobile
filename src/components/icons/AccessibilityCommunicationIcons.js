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

// Base Accessibility Communication Icon Component
const AccessibilityCommunicationIcon = ({
  name,
  size = 24,
  color,
  therapeuticTheme = "nurturing",
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
      // Accessibility Icons
      case "accessibility":
        return (
          <G>
            <Circle
              cx="12"
              cy="4"
              r="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Path
              d="M15.5 8.5L19 7l-1-2-3.5 1.5L12 8L9.5 6.5L6 5l-1 2 3.5 1.5"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M12 8v8"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M10 16v4"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M14 16v4"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      case "wheelchair":
        return (
          <G>
            <Circle
              cx="12"
              cy="4"
              r="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Path
              d="M12 6v6"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M16 12h2"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Circle
              cx="12"
              cy="18"
              r="4"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Circle
              cx="12"
              cy="18"
              r="1.5"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Path
              d="M8 12h4l2-4"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        );

      case "hearing-aid":
        return (
          <G>
            <Path
              d="M17 14c0-3.31-2.69-6-6-6s-6 2.69-6 6"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M14 14c0-1.1-.9-2-2-2s-2 .9-2 2"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Circle cx="12" cy="14" r="1" fill={strokeColor} />
            <Path
              d="M17 14v3a2 2 0 0 1-2 2h-1"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Circle
              cx="19"
              cy="16"
              r="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
          </G>
        );

      case "sign-language":
        return (
          <G>
            <Path
              d="M8 12c0-2 1-3 2-3s2 1 2 3v6c0 1-1 2-2 2s-2-1-2-2v-6z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M6 14c0-1 0.5-2 1.5-2s1.5 1 1.5 2v4c0 0.5-0.5 1-1.5 1s-1.5-0.5-1.5-1v-4z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M14 14c0-1 0.5-2 1.5-2s1.5 1 1.5 2v4c0 0.5-0.5 1-1.5 1s-1.5-0.5-1.5-1v-4z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M16 16c0-0.5 0.5-1 1-1s1 0.5 1 1v2c0 0.5-0.5 1-1 1s-1-0.5-1-1v-2z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle
              cx="10"
              cy="6"
              r="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Path
              d="M8 8c0 1 1 2 2 2s2-1 2-2"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      case "braille":
        return (
          <G>
            <Circle cx="6" cy="6" r="1.5" fill={strokeColor} />
            <Circle cx="6" cy="10" r="1.5" fill={strokeColor} />
            <Circle cx="6" cy="14" r="1.5" fill={strokeColor} />
            <Circle cx="10" cy="6" r="1.5" fill={strokeColor} />
            <Circle
              cx="10"
              cy="10"
              r="1.5"
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Circle cx="10" cy="14" r="1.5" fill={strokeColor} />
            <Circle cx="14" cy="6" r="1.5" fill={strokeColor} />
            <Circle cx="14" cy="10" r="1.5" fill={strokeColor} />
            <Circle
              cx="14"
              cy="14"
              r="1.5"
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Circle
              cx="18"
              cy="6"
              r="1.5"
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Circle cx="18" cy="10" r="1.5" fill={strokeColor} />
            <Circle cx="18" cy="14" r="1.5" fill={strokeColor} />
          </G>
        );

      case "voice-recognition":
        return (
          <G>
            <Path
              d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M19 10v2a7 7 0 0 1-14 0v-2"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Line
              x1="12"
              y1="19"
              x2="12"
              y2="23"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="8"
              y1="23"
              x2="16"
              y2="23"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M7 10h2"
              stroke={strokeColor}
              strokeWidth={strokeWidth * 0.5}
              strokeLinecap="round"
            />
            <Path
              d="M15 10h2"
              stroke={strokeColor}
              strokeWidth={strokeWidth * 0.5}
              strokeLinecap="round"
            />
          </G>
        );

      case "screen-reader":
        return (
          <G>
            <Rect
              x="2"
              y="3"
              width="20"
              height="14"
              rx="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Circle
              cx="8"
              cy="10"
              r="2"
              fill={variant === "filled" ? "#FFFFFF" : fillColor}
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
            />
            <Circle
              cx="16"
              cy="10"
              r="2"
              fill={variant === "filled" ? "#FFFFFF" : fillColor}
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
            />
            <Path
              d="M6 13c1 1 3 1 4 0"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M14 13c1 1 3 1 4 0"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="8"
              y1="21"
              x2="16"
              y2="21"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="12"
              y1="17"
              x2="12"
              y2="21"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      case "high-contrast":
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
              d="M12 3v18"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M21 12H3"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M12 3A9 9 0 0 1 21 12"
              fill={variant === "filled" ? "#FFFFFF" : "#000000"}
            />
          </G>
        );

      // Communication Icons
      case "chat-bubble":
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
          </G>
        );

      case "speech-bubble":
        return (
          <G>
            <Path
              d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1.5-2s-1.5.62-1.5 2a2.5 2.5 0 0 0 2.5 2.5z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Path
              d="M14 9c0-2.21-1.79-4-4-4S6 6.79 6 9c0 1.38.56 2.63 1.46 3.54L8 21l1.54-8.46C10.44 11.63 11 10.38 11 9"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M14 9c0 .55.45 1 1 1h4c.55 0 1-.45 1-1s-.45-1-1-1h-4c-.55 0-1 .45-1 1z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Path
              d="M18 6c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"
              fill={strokeColor}
            />
            <Path
              d="M18 12c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"
              fill={strokeColor}
            />
          </G>
        );

      case "video-call":
        return (
          <G>
            <Rect
              x="2"
              y="6"
              width="16"
              height="12"
              rx="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Polygon
              points="22,8 18,12 22,16 22,8"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle
              cx="7"
              cy="10"
              r="1.5"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle
              cx="13"
              cy="10"
              r="1.5"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Path
              d="M6 14c1 1 2 1 3 1s2 0 3-1"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      case "voice-call":
        return (
          <G>
            <Path
              d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M15 2s1 1 1 3-1 3-1 3"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M17 1s2 1 2 4-2 4-2 4"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        );

      case "text-to-speech":
        return (
          <G>
            <Path
              d="M11 5L6 9H2v6h4l5 4V5z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Rect x="16" y="2" width="6" height="2" rx="1" fill={strokeColor} />
            <Rect
              x="18"
              y="20"
              width="4"
              height="2"
              rx="1"
              fill={strokeColor}
            />
          </G>
        );

      case "live-caption":
        return (
          <G>
            <Rect
              x="2"
              y="8"
              width="20"
              height="10"
              rx="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Line
              x1="6"
              y1="12"
              x2="18"
              y2="12"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="6"
              y1="15"
              x2="14"
              y2="15"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Circle
              cx="12"
              cy="4"
              r="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Path
              d="M8 4c0 1 1 2 2 2"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M14 6c1 0 2-1 2-2"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      case "translation":
        return (
          <G>
            <Path
              d="M5 8l6 6"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M4 14l6-6 2-3"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M2 5h12"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M7 2h1"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M22 22l-5-10-5 10"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M14 18h6"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        );

      // Support and Help Icons
      case "help-circle":
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
            <Path
              d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle
              cx="12"
              cy="17"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
          </G>
        );

      case "support":
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
            <Path
              d="M12 13v3"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
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
              cy="18"
              r="3"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Path
              d="M17 17h2v2"
              stroke={variant === "filled" ? strokeColor : "#FFFFFF"}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      case "feedback":
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
            <Path
              d="M13 8H7"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M17 12H7"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Circle
              cx="17"
              cy="8"
              r="2"
              fill={variant === "filled" ? "#FFFFFF" : fillColor}
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
            />
            <Path
              d="M16 7h2v2"
              stroke={variant === "filled" ? strokeColor : "#FFFFFF"}
              strokeWidth={strokeWidth * 0.8}
              strokeLinecap="round"
            />
          </G>
        );

      case "contact-support":
        return (
          <G>
            <Path
              d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle
              cx="18"
              cy="6"
              r="3"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Path
              d="M17 5h2v2"
              stroke={variant === "filled" ? strokeColor : "#FFFFFF"}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      // Language and Localization
      case "language":
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
            <Path
              d="M2 12h20"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      case "localization":
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
            <Polygon
              points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76"
              fill={variant === "filled" ? "#FFFFFF" : fillColor}
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle
              cx="8"
              cy="8"
              r="1"
              fill={variant === "filled" ? strokeColor : "#FFFFFF"}
            />
            <Circle
              cx="16"
              cy="16"
              r="1"
              fill={variant === "filled" ? strokeColor : "#FFFFFF"}
            />
          </G>
        );

      // Default fallback
      default:
        return (
          <G>
            <Circle
              cx="12"
              cy="4"
              r="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Path
              d="M15.5 8.5L19 7l-1-2-3.5 1.5L12 8L9.5 6.5L6 5l-1 2 3.5 1.5"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M12 8v8"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M10 16v4"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M14 16v4"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
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
      testID={testID || `accessibility-communication-icon-${name}`}
    >
      {renderIcon()}
    </Svg>
  );
};

// Specialized Accessibility Communication Icon Components
export const AccessibilityIcon = (props) => (
  <AccessibilityCommunicationIcon name="accessibility" {...props} />
);
export const WheelchairIcon = (props) => (
  <AccessibilityCommunicationIcon name="wheelchair" {...props} />
);
export const HearingAidIcon = (props) => (
  <AccessibilityCommunicationIcon name="hearing-aid" {...props} />
);
export const SignLanguageIcon = (props) => (
  <AccessibilityCommunicationIcon name="sign-language" {...props} />
);
export const BrailleIcon = (props) => (
  <AccessibilityCommunicationIcon name="braille" {...props} />
);
export const VoiceRecognitionIcon = (props) => (
  <AccessibilityCommunicationIcon name="voice-recognition" {...props} />
);
export const ScreenReaderIcon = (props) => (
  <AccessibilityCommunicationIcon name="screen-reader" {...props} />
);
export const HighContrastIcon = (props) => (
  <AccessibilityCommunicationIcon name="high-contrast" {...props} />
);
export const ChatBubbleIcon = (props) => (
  <AccessibilityCommunicationIcon name="chat-bubble" {...props} />
);
export const SpeechBubbleIcon = (props) => (
  <AccessibilityCommunicationIcon name="speech-bubble" {...props} />
);
export const VideoCallIcon = (props) => (
  <AccessibilityCommunicationIcon name="video-call" {...props} />
);
export const VoiceCallIcon = (props) => (
  <AccessibilityCommunicationIcon name="voice-call" {...props} />
);
export const TextToSpeechIcon = (props) => (
  <AccessibilityCommunicationIcon name="text-to-speech" {...props} />
);
export const LiveCaptionIcon = (props) => (
  <AccessibilityCommunicationIcon name="live-caption" {...props} />
);
export const TranslationIcon = (props) => (
  <AccessibilityCommunicationIcon name="translation" {...props} />
);
export const HelpCircleIcon = (props) => (
  <AccessibilityCommunicationIcon name="help-circle" {...props} />
);
export const SupportIcon = (props) => (
  <AccessibilityCommunicationIcon name="support" {...props} />
);
export const FeedbackIcon = (props) => (
  <AccessibilityCommunicationIcon name="feedback" {...props} />
);
export const ContactSupportIcon = (props) => (
  <AccessibilityCommunicationIcon name="contact-support" {...props} />
);
export const LanguageIcon = (props) => (
  <AccessibilityCommunicationIcon name="language" {...props} />
);
export const LocalizationIcon = (props) => (
  <AccessibilityCommunicationIcon name="localization" {...props} />
);

// Accessibility Communication Icon Collection
export const AccessibilityCommunicationIconCollection = {
  // Accessibility
  accessibility: AccessibilityIcon,
  wheelchair: WheelchairIcon,
  hearingAid: HearingAidIcon,
  signLanguage: SignLanguageIcon,
  braille: BrailleIcon,
  voiceRecognition: VoiceRecognitionIcon,
  screenReader: ScreenReaderIcon,
  highContrast: HighContrastIcon,

  // Communication
  chatBubble: ChatBubbleIcon,
  speechBubble: SpeechBubbleIcon,
  videoCall: VideoCallIcon,
  voiceCall: VoiceCallIcon,
  textToSpeech: TextToSpeechIcon,
  liveCaption: LiveCaptionIcon,
  translation: TranslationIcon,

  // Support
  helpCircle: HelpCircleIcon,
  support: SupportIcon,
  feedback: FeedbackIcon,
  contactSupport: ContactSupportIcon,

  // Language
  language: LanguageIcon,
  localization: LocalizationIcon,
};

// PropTypes
AccessibilityCommunicationIcon.propTypes = {
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

export default AccessibilityCommunicationIcon;
