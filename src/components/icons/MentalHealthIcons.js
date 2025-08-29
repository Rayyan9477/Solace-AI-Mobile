import PropTypes from "prop-types";
import React from "react";
import {
  WebSafeSvg as Svg,
  Path,
  Circle,
  Rect,
  Line,
  Polyline,
  Polygon,
  G,
} from "./WebSafeSvg";
import { useTheme } from "../../shared/theme/ThemeContext";

// For gradient support, we need to import these separately
let Ellipse, Defs, LinearGradient, Stop;
try {
  const svgComponents = require("react-native-svg");
  Ellipse = svgComponents.Ellipse;
  Defs = svgComponents.Defs;
  LinearGradient = svgComponents.LinearGradient;
  Stop = svgComponents.Stop;
} catch (error) {
  // Fallback for web compatibility
  Ellipse = Circle;
  Defs = G;
  LinearGradient = G;
  Stop = G;
}

// Base Mental Health Icon Component
const MentalHealthIcon = ({
  name,
  size = 24,
  color,
  therapeuticTheme = "nurturing",
  variant = "outline",
  strokeWidth = 2,
  style,
  testID,
}) => {
  const { theme } = useTheme();

  const getColor = () => {
    if (color) return color;

    if (therapeuticTheme && theme?.colors?.therapeutic?.[therapeuticTheme]) {
      const therapeuticColors = theme.colors.therapeutic[therapeuticTheme];
      return therapeuticColors?.[600] || therapeuticColors?.[500] || theme.colors.primary[600];
    }

    return theme?.colors?.primary?.[600] || "#6366F1"; // Fallback color
  };

  const iconColor = getColor();
  const fillColor = variant === "filled" ? iconColor : "none";
  const strokeColor = variant === "filled" ? "none" : iconColor;

  const renderIcon = () => {
    switch (name) {
      // Mindfulness and Meditation
      case "mindfulness":
        return (
          <G>
            <Circle
              cx="12"
              cy="8"
              r="3"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Path
              d="M12 11c-2 0-4 1-4 3v4c0 1 1 2 2 2h4c1 0 2-1 2-2v-4c0-2-2-3-4-3z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M8 14l-2-2"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M16 14l2-2"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Circle cx="12" cy="4" r="1" fill={strokeColor} />
            <Circle cx="8" cy="6" r="0.5" fill={strokeColor} />
            <Circle cx="16" cy="6" r="0.5" fill={strokeColor} />
            <Circle cx="6" cy="10" r="0.5" fill={strokeColor} />
            <Circle cx="18" cy="10" r="0.5" fill={strokeColor} />
          </G>
        );

      case "meditation-pose":
        return (
          <G>
            <Circle
              cx="12"
              cy="6"
              r="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Path
              d="M8 10c0-1 1-2 2-2h4c1 0 2 1 2 2v2l-2 2v4c0 1-1 2-2 2s-2-1-2-2v-4l-2-2v-2z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M8 12l-3 1"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M16 12l3 1"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Circle
              cx="6"
              cy="16"
              r="1"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fill={fillColor}
            />
            <Circle
              cx="18"
              cy="16"
              r="1"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fill={fillColor}
            />
          </G>
        );

      case "zen-circle":
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
              d="M12 3c-2.5 4-2.5 10 0 18"
              fill="none"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth * 1.5}
              strokeLinecap="round"
            />
            <Circle
              cx="12"
              cy="12"
              r="2"
              fill={variant === "filled" ? "#FFFFFF" : fillColor}
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
            />
          </G>
        );

      // Emotional Wellness
      case "emotional-balance":
        return (
          <G>
            <Path
              d="M7 10h10l-1 8H8l-1-8z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle
              cx="9"
              cy="6"
              r="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Circle
              cx="15"
              cy="6"
              r="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Line
              x1="12"
              y1="2"
              x2="12"
              y2="6"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="12"
              y1="10"
              x2="12"
              y2="14"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Circle cx="12" cy="2" r="1" fill={strokeColor} />
          </G>
        );

      case "inner-peace":
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
              d="M8 12c2-4 6-4 8 0"
              fill="none"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M9 15c1.5-2 4.5-2 6 0"
              fill="none"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Circle
              cx="10"
              cy="9"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle
              cx="14"
              cy="9"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
          </G>
        );

      case "emotional-growth":
        return (
          <G>
            <Path
              d="M12 2v20"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M8 6c0-2 2-4 4-4s4 2 4 4-2 4-4 4-4-2-4-4z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Path
              d="M6 12c0-3 3-6 6-6s6 3 6 6-3 6-6 6-6-3-6-6z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeOpacity="0.7"
            />
            <Path
              d="M4 18c0-4 4-8 8-8s8 4 8 8-4 8-8 8-8-4-8-8z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeOpacity="0.4"
            />
          </G>
        );

      // Mood and Feelings
      case "mood-tracker":
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
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle
              cx="15"
              cy="9"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Path
              d="M8 14s1.5 2 4 2 4-2 4-2"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M6 6l12 12"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeOpacity="0.5"
            />
          </G>
        );

      case "emotions":
        return (
          <G>
            <Path
              d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle
              cx="9"
              cy="9"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle
              cx="15"
              cy="9"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Path
              d="M9 13s1 1 3 1 3-1 3-1"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      case "feelings-journal":
        return (
          <G>
            <Rect
              x="4"
              y="2"
              width="16"
              height="20"
              rx="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Line
              x1="8"
              y1="7"
              x2="16"
              y2="7"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="8"
              y1="11"
              x2="16"
              y2="11"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="8"
              y1="15"
              x2="14"
              y2="15"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Circle
              cx="17"
              cy="17"
              r="2"
              fill={variant === "filled" ? "#FFFFFF" : fillColor}
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
            />
            <Circle
              cx="16.5"
              cy="16.5"
              r="0.5"
              fill={variant === "filled" ? strokeColor : "#FFFFFF"}
            />
            <Path
              d="M17.5 17.5c0 .3-.2.5-.5.5s-.5-.2-.5-.5.2-.5.5-.5.5.2.5.5z"
              stroke={variant === "filled" ? strokeColor : "#FFFFFF"}
              strokeWidth="0.5"
            />
          </G>
        );

      // Therapy and Support
      case "therapy-session":
        return (
          <G>
            <Path
              d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M8 12c0-2 2-4 4-4s4 2 4 4-2 4-4 4"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Circle
              cx="12"
              cy="12"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
          </G>
        );

      case "support-group":
        return (
          <G>
            <Circle
              cx="9"
              cy="7"
              r="4"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Circle
              cx="15"
              cy="7"
              r="4"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Path
              d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M16 3.13a4 4 0 0 1 0 7.75"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M21 21v-2a4 4 0 0 0-3-3.85"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle
              cx="12"
              cy="12"
              r="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
          </G>
        );

      case "counselor":
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
          </G>
        );

      // Self-Care and Wellness
      case "self-care":
        return (
          <G>
            <Path
              d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M12 7v8"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M8 11h8"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      case "wellness-routine":
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
            <Circle
              cx="12"
              cy="4"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle
              cx="20"
              cy="12"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle
              cx="12"
              cy="20"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle
              cx="4"
              cy="12"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
          </G>
        );

      case "mental-strength":
        return (
          <G>
            <Path
              d="M6 2l3 6 5-4 4 6 3-2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h1z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle
              cx="12"
              cy="14"
              r="2"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              fill={variant === "filled" ? "#FFFFFF" : fillColor}
            />
            <Path
              d="M10 12l4 4"
              stroke={variant === "filled" ? strokeColor : "#FFFFFF"}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      // Breathing and Relaxation
      case "breathing-exercise":
        return (
          <G>
            <Circle
              cx="12"
              cy="12"
              r="8"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeOpacity="0.3"
            />
            <Circle
              cx="12"
              cy="12"
              r="5"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeOpacity="0.6"
            />
            <Circle
              cx="12"
              cy="12"
              r="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Path
              d="M12 2v4"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M12 18v4"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M2 12h4"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M18 12h4"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      case "relaxation":
        return (
          <G>
            <Path
              d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle
              cx="15"
              cy="8"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle
              cx="18"
              cy="6"
              r="0.5"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle
              cx="16"
              cy="11"
              r="0.5"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
          </G>
        );

      // Progress and Goals
      case "progress-tracking":
        return (
          <G>
            <Path
              d="M18 20V10"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M12 20V4"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M6 20v-6"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Circle
              cx="18"
              cy="8"
              r="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Circle
              cx="12"
              cy="2"
              r="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Circle
              cx="6"
              cy="12"
              r="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
          </G>
        );

      case "mental-goals":
        return (
          <G>
            <Path
              d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle
              cx="8.5"
              cy="7"
              r="4"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Polyline
              points="17,11 19,13 23,9"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle
              cx="8"
              cy="6"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Path
              d="M7 8s.5.5 1.5.5S10 8 10 8"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      // Crisis and Emergency
      case "crisis-support":
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
              d="M12 7v6"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth * 1.5}
              strokeLinecap="round"
            />
            <Circle
              cx="12"
              cy="17"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Path
              d="M8 4l8 8"
              stroke="red"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeOpacity="0.7"
            />
            <Path
              d="M16 4l-8 8"
              stroke="red"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeOpacity="0.7"
            />
          </G>
        );

      case "emergency-contact":
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
              d="M12 1v6"
              stroke="red"
              strokeWidth={strokeWidth * 1.5}
              strokeLinecap="round"
            />
            <Path
              d="M9 4h6"
              stroke="red"
              strokeWidth={strokeWidth * 1.5}
              strokeLinecap="round"
            />
          </G>
        );

      // UI and Navigation Icons
      case "brain":
        return (
          <G>
            <Path
              d="M9.5 2A2.5 2.5 0 0 0 7 4.5v.5a2.5 2.5 0 0 0 0 5v.5A2.5 2.5 0 0 0 9.5 13h5a2.5 2.5 0 0 0 2.5-2.5v-.5a2.5 2.5 0 0 0 0-5v-.5A2.5 2.5 0 0 0 14.5 2z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M9 6.5a1 1 0 1 1 2 0 1 1 0 0 1-2 0"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Path
              d="M13 8.5a1 1 0 1 1 2 0 1 1 0 0 1-2 0"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Path
              d="M9 10c1 1 2 1 3 0s2-1 3 0"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      case "heart":
        return (
          <G>
            <Path
              d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        );

      case "menu":
        return (
          <G>
            <Line x1="3" y1="6" x2="21" y2="6" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round"/>
            <Line x1="3" y1="12" x2="21" y2="12" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round"/>
            <Line x1="3" y1="18" x2="21" y2="18" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round"/>
          </G>
        );

      case "search":
        return (
          <G>
            <Circle cx="11" cy="11" r="8" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
            <Path d="m21 21-4.35-4.35" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
          </G>
        );

      case "settings":
        return (
          <G>
            <Circle cx="12" cy="12" r="3" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
            <Path d="M12 1v6" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round"/>
            <Path d="M12 17v6" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round"/>
            <Path d="m4.2 19.8 4.2-4.2" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round"/>
            <Path d="m15.8 8.2 4.2-4.2" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round"/>
            <Path d="M1 12h6" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round"/>
            <Path d="M17 12h6" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round"/>
            <Path d="m4.2 4.2 4.2 4.2" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round"/>
            <Path d="m15.8 15.8 4.2 4.2" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round"/>
          </G>
        );

      case "close":
        return (
          <G>
            <Line x1="18" y1="6" x2="6" y2="18" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
            <Line x1="6" y1="6" x2="18" y2="18" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
          </G>
        );

      case "grid":
        return (
          <G>
            <Rect x="3" y="3" width="7" height="7" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} rx="1"/>
            <Rect x="14" y="3" width="7" height="7" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} rx="1"/>
            <Rect x="14" y="14" width="7" height="7" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} rx="1"/>
            <Rect x="3" y="14" width="7" height="7" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} rx="1"/>
          </G>
        );

      case "users":
        return (
          <G>
            <Circle cx="9" cy="7" r="4" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
            <Path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
            <Path d="M16 3.13a4 4 0 0 1 0 7.75" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
            <Path d="M21 21v-2a4 4 0 0 0-3-3.85" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
          </G>
        );

      case "plus":
        return (
          <G>
            <Line x1="12" y1="5" x2="12" y2="19" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
            <Line x1="5" y1="12" x2="19" y2="12" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
          </G>
        );

      case "bookmark":
        return (
          <G>
            <Path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
          </G>
        );

      case "trash":
        return (
          <G>
            <Polyline points="3,6 5,6 21,6" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
            <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
            <Line x1="10" y1="11" x2="10" y2="17" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round"/>
            <Line x1="14" y1="11" x2="14" y2="17" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round"/>
          </G>
        );

      case "folder":
        return (
          <G>
            <Path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2l5 2h9a2 2 0 0 1 2 2z" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
          </G>
        );

      case "chevron-right":
        return (
          <G>
            <Polyline points="9,18 15,12 9,6" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
          </G>
        );

      // Default fallback
      default:
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
              d="M8 12c2-4 6-4 8 0"
              fill="none"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Circle
              cx="10"
              cy="9"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle
              cx="14"
              cy="9"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
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
      testID={testID || `mental-health-icon-${name}`}
    >
      {renderIcon()}
    </Svg>
  );
};

// Specialized Mental Health Icon Components
export const MindfulnessIcon = (props) => (
  <MentalHealthIcon name="mindfulness" {...props} />
);
export const MeditationPoseIcon = (props) => (
  <MentalHealthIcon name="meditation-pose" {...props} />
);
export const ZenCircleIcon = (props) => (
  <MentalHealthIcon name="zen-circle" {...props} />
);
export const EmotionalBalanceIcon = (props) => (
  <MentalHealthIcon name="emotional-balance" {...props} />
);
export const InnerPeaceIcon = (props) => (
  <MentalHealthIcon name="inner-peace" {...props} />
);
export const EmotionalGrowthIcon = (props) => (
  <MentalHealthIcon name="emotional-growth" {...props} />
);
export const MoodTrackerIcon = (props) => (
  <MentalHealthIcon name="mood-tracker" {...props} />
);
export const EmotionsIcon = (props) => (
  <MentalHealthIcon name="emotions" {...props} />
);
export const FeelingsJournalIcon = (props) => (
  <MentalHealthIcon name="feelings-journal" {...props} />
);
export const TherapySessionIcon = (props) => (
  <MentalHealthIcon name="therapy-session" {...props} />
);
export const SupportGroupIcon = (props) => (
  <MentalHealthIcon name="support-group" {...props} />
);
export const CounselorIcon = (props) => (
  <MentalHealthIcon name="counselor" {...props} />
);
export const SelfCareIcon = (props) => (
  <MentalHealthIcon name="self-care" {...props} />
);
export const WellnessRoutineIcon = (props) => (
  <MentalHealthIcon name="wellness-routine" {...props} />
);
export const MentalStrengthIcon = (props) => (
  <MentalHealthIcon name="mental-strength" {...props} />
);
export const BreathingExerciseIcon = (props) => (
  <MentalHealthIcon name="breathing-exercise" {...props} />
);
export const RelaxationIcon = (props) => (
  <MentalHealthIcon name="relaxation" {...props} />
);
export const ProgressTrackingIcon = (props) => (
  <MentalHealthIcon name="progress-tracking" {...props} />
);
export const MentalGoalsIcon = (props) => (
  <MentalHealthIcon name="mental-goals" {...props} />
);
export const CrisisSupportIcon = (props) => (
  <MentalHealthIcon name="crisis-support" {...props} />
);
export const EmergencyContactIcon = (props) => (
  <MentalHealthIcon name="emergency-contact" {...props} />
);

// Mental Health Icon Collection
export const MentalHealthIconCollection = {
  // Mindfulness & Meditation
  mindfulness: MindfulnessIcon,
  meditationPose: MeditationPoseIcon,
  zenCircle: ZenCircleIcon,

  // Emotional Wellness
  emotionalBalance: EmotionalBalanceIcon,
  innerPeace: InnerPeaceIcon,
  emotionalGrowth: EmotionalGrowthIcon,

  // Mood & Feelings
  moodTracker: MoodTrackerIcon,
  emotions: EmotionsIcon,
  feelingsJournal: FeelingsJournalIcon,

  // Therapy & Support
  therapySession: TherapySessionIcon,
  supportGroup: SupportGroupIcon,
  counselor: CounselorIcon,

  // Self-Care & Wellness
  selfCare: SelfCareIcon,
  wellnessRoutine: WellnessRoutineIcon,
  mentalStrength: MentalStrengthIcon,

  // Breathing & Relaxation
  breathingExercise: BreathingExerciseIcon,
  relaxation: RelaxationIcon,

  // Progress & Goals
  progressTracking: ProgressTrackingIcon,
  mentalGoals: MentalGoalsIcon,

  // Crisis & Emergency
  crisisSupport: CrisisSupportIcon,
  emergencyContact: EmergencyContactIcon,
};

// PropTypes
MentalHealthIcon.propTypes = {
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

export default MentalHealthIcon;
