import PropTypes from "prop-types";
import React from "react";
import Svg, {
  Path,
  Circle,
  Rect,
  Line,
  Polyline,
  Polygon,
  Ellipse,
  G,
  Defs,
  LinearGradient,
  Stop,
  ClipPath,
} from "react-native-svg";

import { BaseDesignTokens } from "../../design-system/DesignTokens";

// Base Health Tech Icon Component
const HealthTechIcon = ({
  name,
  size = 24,
  color,
  therapeuticTheme = "calming",
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
      // Brain and Mental Health Icons
      case "brain":
        return (
          <G>
            <Path
              d="M12 2C8.5 2 6 4.5 6 8c0 1.5.5 3 1.5 4.5L12 22l4.5-9.5C17.5 11 18 9.5 18 8c0-3.5-2.5-6-6-6z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M10 8c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Path
              d="M8.5 10.5C9.5 9.5 10.5 9 12 9s2.5.5 3.5 1.5"
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      case "mind":
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
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M10 8c1-2 3-2 4 0"
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Circle cx="12" cy="12" r="2" fill={strokeColor} />
          </G>
        );

      case "neuron":
        return (
          <G>
            <Circle
              cx="12"
              cy="12"
              r="3"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Line
              x1="12"
              y1="3"
              x2="12"
              y2="9"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="21"
              y1="12"
              x2="15"
              y2="12"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="12"
              y1="21"
              x2="12"
              y2="15"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="3"
              y1="12"
              x2="9"
              y2="12"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Circle cx="12" cy="4" r="1" fill={strokeColor} />
            <Circle cx="20" cy="12" r="1" fill={strokeColor} />
            <Circle cx="12" cy="20" r="1" fill={strokeColor} />
            <Circle cx="4" cy="12" r="1" fill={strokeColor} />
          </G>
        );

      // Heart and Wellness Icons
      case "heart-pulse":
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
            <Polyline
              points="7,10 9,12 11,8 13,14 15,10"
              fill="none"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        );

      case "wellness":
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
              fill={fillColor}
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
            <Path
              d="M10.5 14.5l3-3"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      case "meditation":
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
            <Circle cx="8" cy="6" r="1" fill={strokeColor} />
            <Circle cx="16" cy="6" r="1" fill={strokeColor} />
          </G>
        );

      // Medical and Health Monitoring Icons
      case "stethoscope":
        return (
          <G>
            <Path
              d="M11 2a2 2 0 0 1 2 0"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M11 4a2 2 0 0 0-2 2v4a6 6 0 0 0 6 6 6 6 0 0 0 6-6V6a2 2 0 0 0-2-2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M19 10v1a3 3 0 0 1-6 0v-1"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle
              cx="19"
              cy="19"
              r="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Path
              d="M19 16v-3"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      case "health-monitor":
        return (
          <G>
            <Rect
              x="2"
              y="4"
              width="20"
              height="14"
              rx="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Polyline
              points="6,12 8,8 10,16 12,10 14,14 16,12 18,12"
              fill="none"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle
              cx="19"
              cy="7"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
          </G>
        );

      case "thermometer":
        return (
          <G>
            <Path
              d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle
              cx="12"
              cy="17"
              r="1.5"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Line
              x1="12"
              y1="9"
              x2="12"
              y2="15"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth * 1.5}
              strokeLinecap="round"
            />
          </G>
        );

      // Therapy and Treatment Icons
      case "therapy":
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
              d="M8 12h4l2-4 2 8 2-4h2"
              fill="none"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        );

      case "counseling":
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
            <Circle
              cx="9"
              cy="11"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle
              cx="15"
              cy="11"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Path
              d="M9.5 14.5c.5.5 1.5.5 2.5.5s2-.5 2.5-.5"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      case "treatment":
        return (
          <G>
            <Rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Path
              d="M12 8v8"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M8 12h8"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      // Sleep and Recovery Icons
      case "sleep":
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
            <Path
              d="M15 8h2l-3 4h2l-3 4"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        );

      case "recovery":
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
              d="M7 12c0-2.76 2.24-5 5-5s5 2.24 5 5-2.24 5-5 5"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Polyline
              points="14,9 17,12 14,15"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        );

      // Exercise and Activity Icons
      case "exercise":
        return (
          <G>
            <Circle
              cx="12"
              cy="5"
              r="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Path
              d="M10 8h4l-1 7h-2l-1-7z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M8 12l2-2"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M16 12l-2-2"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M9 19l2-2"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M15 19l-2-2"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      case "activity":
        return (
          <G>
            <Polyline
              points="22,12 18,12 15,21 9,3 6,12 2,12"
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        );

      // Nutrition and Lifestyle Icons
      case "nutrition":
        return (
          <G>
            <Path
              d="M12 2a3 3 0 0 0-3 3c0 1.5 1 3 1 4.5V22h4V9.5c0-1.5 1-3 1-4.5a3 3 0 0 0-3-3z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M8 12h8"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M8 16h8"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      case "water":
        return (
          <G>
            <Path
              d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M8 14c0 2 2 2 4 2s4 0 4-2"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
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
              d="M12 7v6"
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
    }
  };

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={style}
      testID={testID || `health-tech-icon-${name}`}
    >
      {renderIcon()}
    </Svg>
  );
};

// Specialized Health Tech Icon Components
export const BrainIcon = (props) => <HealthTechIcon name="brain" {...props} />;
export const MindIcon = (props) => <HealthTechIcon name="mind" {...props} />;
export const NeuronIcon = (props) => (
  <HealthTechIcon name="neuron" {...props} />
);
export const HeartPulseIcon = (props) => (
  <HealthTechIcon name="heart-pulse" {...props} />
);
export const WellnessIcon = (props) => (
  <HealthTechIcon name="wellness" {...props} />
);
export const MeditationIcon = (props) => (
  <HealthTechIcon name="meditation" {...props} />
);
export const StethoscopeIcon = (props) => (
  <HealthTechIcon name="stethoscope" {...props} />
);
export const HealthMonitorIcon = (props) => (
  <HealthTechIcon name="health-monitor" {...props} />
);
export const ThermometerIcon = (props) => (
  <HealthTechIcon name="thermometer" {...props} />
);
export const TherapyIcon = (props) => (
  <HealthTechIcon name="therapy" {...props} />
);
export const CounselingIcon = (props) => (
  <HealthTechIcon name="counseling" {...props} />
);
export const TreatmentIcon = (props) => (
  <HealthTechIcon name="treatment" {...props} />
);
export const SleepIcon = (props) => <HealthTechIcon name="sleep" {...props} />;
export const RecoveryIcon = (props) => (
  <HealthTechIcon name="recovery" {...props} />
);
export const ExerciseIcon = (props) => (
  <HealthTechIcon name="exercise" {...props} />
);
export const ActivityIcon = (props) => (
  <HealthTechIcon name="activity" {...props} />
);
export const NutritionIcon = (props) => (
  <HealthTechIcon name="nutrition" {...props} />
);
export const WaterIcon = (props) => <HealthTechIcon name="water" {...props} />;

// Health Tech Icon Collection
export const HealthTechIconCollection = {
  // Mental Health & Brain
  brain: BrainIcon,
  mind: MindIcon,
  neuron: NeuronIcon,
  meditation: MeditationIcon,
  therapy: TherapyIcon,
  counseling: CounselingIcon,
  treatment: TreatmentIcon,

  // Physical Health & Wellness
  heartPulse: HeartPulseIcon,
  wellness: WellnessIcon,
  stethoscope: StethoscopeIcon,
  healthMonitor: HealthMonitorIcon,
  thermometer: ThermometerIcon,

  // Lifestyle & Recovery
  sleep: SleepIcon,
  recovery: RecoveryIcon,
  exercise: ExerciseIcon,
  activity: ActivityIcon,
  nutrition: NutritionIcon,
  water: WaterIcon,
};

// PropTypes
HealthTechIcon.propTypes = {
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

export default HealthTechIcon;
