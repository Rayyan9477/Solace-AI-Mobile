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
} from "react-native-svg";

import { BaseDesignTokens } from "../../design-system/DesignTokens";
import { InfoIcon } from "./NotificationStatusIcons";

// Base General UI Icon Component
const GeneralUIIcon = ({
  name,
  size = 24,
  color,
  therapeuticTheme = "peaceful",
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
      // Basic UI Controls
      case "menu":
        return (
          <G>
            <Line
              x1="3"
              y1="6"
              x2="21"
              y2="6"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="3"
              y1="12"
              x2="21"
              y2="12"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="3"
              y1="18"
              x2="21"
              y2="18"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      case "close":
        return (
          <G>
            <Line
              x1="18"
              y1="6"
              x2="6"
              y2="18"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="6"
              y1="6"
              x2="18"
              y2="18"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      case "search":
        return (
          <G>
            <Circle
              cx="11"
              cy="11"
              r="8"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Path
              d="m21 21-4.35-4.35"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      case "filter":
        return (
          <G>
            <Polygon
              points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        );

      case "sort":
        return (
          <G>
            <Path
              d="M3 6h18"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M7 12h10"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M10 18h4"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      case "more-horizontal":
        return (
          <G>
            <Circle cx="12" cy="12" r="1" fill={strokeColor} />
            <Circle cx="19" cy="12" r="1" fill={strokeColor} />
            <Circle cx="5" cy="12" r="1" fill={strokeColor} />
          </G>
        );

      case "more-vertical":
        return (
          <G>
            <Circle cx="12" cy="12" r="1" fill={strokeColor} />
            <Circle cx="12" cy="5" r="1" fill={strokeColor} />
            <Circle cx="12" cy="19" r="1" fill={strokeColor} />
          </G>
        );

      // Action Icons
      case "plus":
        return (
          <G>
            <Line
              x1="12"
              y1="5"
              x2="12"
              y2="19"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="5"
              y1="12"
              x2="19"
              y2="12"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      case "minus":
        return (
          <G>
            <Line
              x1="5"
              y1="12"
              x2="19"
              y2="12"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      case "edit":
        return (
          <G>
            <Path
              d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        );

      case "delete":
        return (
          <G>
            <Polyline
              points="3,6 5,6 21,6"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Line
              x1="10"
              y1="11"
              x2="10"
              y2="17"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="14"
              y1="11"
              x2="14"
              y2="17"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      case "save":
        return (
          <G>
            <Path
              d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Polyline
              points="17,21 17,13 7,13 7,21"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Polyline
              points="7,3 7,8 15,8"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        );

      case "copy":
        return (
          <G>
            <Rect
              x="9"
              y="9"
              width="13"
              height="13"
              rx="2"
              ry="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        );

      // View Controls
      case "eye":
        return (
          <G>
            <Path
              d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle
              cx="12"
              cy="12"
              r="3"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
          </G>
        );

      case "eye-off":
        return (
          <G>
            <Path
              d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
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

      case "grid":
        return (
          <G>
            <Rect
              x="3"
              y="3"
              width="7"
              height="7"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Rect
              x="14"
              y="3"
              width="7"
              height="7"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Rect
              x="14"
              y="14"
              width="7"
              height="7"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Rect
              x="3"
              y="14"
              width="7"
              height="7"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
          </G>
        );

      case "list":
        return (
          <G>
            <Line
              x1="8"
              y1="6"
              x2="21"
              y2="6"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="8"
              y1="12"
              x2="21"
              y2="12"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="8"
              y1="18"
              x2="21"
              y2="18"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="3"
              y1="6"
              x2="3.01"
              y2="6"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="3"
              y1="12"
              x2="3.01"
              y2="12"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="3"
              y1="18"
              x2="3.01"
              y2="18"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      // Settings and Configuration
      case "settings":
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
            <Path
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        );

      case "preferences":
        return (
          <G>
            <Line
              x1="4"
              y1="21"
              x2="4"
              y2="14"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="4"
              y1="10"
              x2="4"
              y2="3"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="12"
              y1="21"
              x2="12"
              y2="12"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="12"
              y1="8"
              x2="12"
              y2="3"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="20"
              y1="21"
              x2="20"
              y2="16"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="20"
              y1="12"
              x2="20"
              y2="3"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="1"
              y1="14"
              x2="7"
              y2="14"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="9"
              y1="8"
              x2="15"
              y2="8"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="17"
              y1="16"
              x2="23"
              y2="16"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      // File and Document Icons
      case "folder":
        return (
          <G>
            <Path
              d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        );

      case "file":
        return (
          <G>
            <Path
              d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Polyline
              points="14,2 14,8 20,8"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        );

      case "document":
        return (
          <G>
            <Path
              d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Polyline
              points="14,2 14,8 20,8"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Line
              x1="16"
              y1="13"
              x2="8"
              y2="13"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="16"
              y1="17"
              x2="8"
              y2="17"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Polyline
              points="10,9 9,9 8,9"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        );

      // Status and Feedback Icons
      case "check":
        return (
          <G>
            <Polyline
              points="20,6 9,17 4,12"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        );

      case "check-circle":
        return (
          <G>
            <Path
              d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Polyline
              points="22,4 12,14.01 9,11.01"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        );

      case "x-circle":
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

      // Media Controls
      case "play":
        return (
          <G>
            <Polygon
              points="5,3 19,12 5,21 5,3"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        );

      case "pause":
        return (
          <G>
            <Rect
              x="6"
              y="4"
              width="4"
              height="16"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Rect
              x="14"
              y="4"
              width="4"
              height="16"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
          </G>
        );

      case "stop":
        return (
          <G>
            <Rect
              x="6"
              y="6"
              width="12"
              height="12"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
          </G>
        );

      // Zoom and Resize
      case "zoom-in":
        return (
          <G>
            <Circle
              cx="11"
              cy="11"
              r="8"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Line
              x1="8"
              y1="11"
              x2="14"
              y2="11"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="11"
              y1="8"
              x2="11"
              y2="14"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="m21 21-4.35-4.35"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      case "zoom-out":
        return (
          <G>
            <Circle
              cx="11"
              cy="11"
              r="8"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Line
              x1="8"
              y1="11"
              x2="14"
              y2="11"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="m21 21-4.35-4.35"
              stroke={strokeColor}
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
      testID={testID || `general-ui-icon-${name}`}
    >
      {renderIcon()}
    </Svg>
  );
};

// Specialized General UI Icon Components
export const MenuIcon = (props) => <GeneralUIIcon name="menu" {...props} />;
export const CloseIcon = (props) => <GeneralUIIcon name="close" {...props} />;
export const SearchIcon = (props) => <GeneralUIIcon name="search" {...props} />;
export const FilterIcon = (props) => <GeneralUIIcon name="filter" {...props} />;
export const SortIcon = (props) => <GeneralUIIcon name="sort" {...props} />;
export const MoreHorizontalIcon = (props) => (
  <GeneralUIIcon name="more-horizontal" {...props} />
);
export const MoreVerticalIcon = (props) => (
  <GeneralUIIcon name="more-vertical" {...props} />
);
export const PlusIcon = (props) => <GeneralUIIcon name="plus" {...props} />;
export const MinusIcon = (props) => <GeneralUIIcon name="minus" {...props} />;
export const EditIcon = (props) => <GeneralUIIcon name="edit" {...props} />;
export const DeleteIcon = (props) => <GeneralUIIcon name="delete" {...props} />;
export const SaveIcon = (props) => <GeneralUIIcon name="save" {...props} />;
export const CopyIcon = (props) => <GeneralUIIcon name="copy" {...props} />;
export const EyeIcon = (props) => <GeneralUIIcon name="eye" {...props} />;
export const EyeOffIcon = (props) => (
  <GeneralUIIcon name="eye-off" {...props} />
);
export const GridIcon = (props) => <GeneralUIIcon name="grid" {...props} />;
export const ListIcon = (props) => <GeneralUIIcon name="list" {...props} />;
export const SettingsIcon = (props) => (
  <GeneralUIIcon name="settings" {...props} />
);
export const PreferencesIcon = (props) => (
  <GeneralUIIcon name="preferences" {...props} />
);
export const FolderIcon = (props) => <GeneralUIIcon name="folder" {...props} />;
export const FileIcon = (props) => <GeneralUIIcon name="file" {...props} />;
export const DocumentIcon = (props) => (
  <GeneralUIIcon name="document" {...props} />
);
export const CheckIcon = (props) => <GeneralUIIcon name="check" {...props} />;
export const CheckCircleIcon = (props) => (
  <GeneralUIIcon name="check-circle" {...props} />
);
export const XCircleIcon = (props) => (
  <GeneralUIIcon name="x-circle" {...props} />
);
// AlertCircleIcon moved to NotificationStatusIcons to avoid conflicts
export const GeneralInfoIcon = (props) => <GeneralUIIcon name="info" {...props} />;
export const PlayIcon = (props) => <GeneralUIIcon name="play" {...props} />;
export const PauseIcon = (props) => <GeneralUIIcon name="pause" {...props} />;
export const StopIcon = (props) => <GeneralUIIcon name="stop" {...props} />;
export const ZoomInIcon = (props) => (
  <GeneralUIIcon name="zoom-in" {...props} />
);
export const ZoomOutIcon = (props) => (
  <GeneralUIIcon name="zoom-out" {...props} />
);

// General UI Icon Collection
export const GeneralUIIconCollection = {
  // Basic Controls
  menu: MenuIcon,
  close: CloseIcon,
  search: SearchIcon,
  filter: FilterIcon,
  sort: SortIcon,
  moreHorizontal: MoreHorizontalIcon,
  moreVertical: MoreVerticalIcon,

  // Actions
  plus: PlusIcon,
  minus: MinusIcon,
  edit: EditIcon,
  delete: DeleteIcon,
  save: SaveIcon,
  copy: CopyIcon,

  // View Controls
  eye: EyeIcon,
  eyeOff: EyeOffIcon,
  grid: GridIcon,
  list: ListIcon,

  // Settings
  settings: SettingsIcon,
  preferences: PreferencesIcon,

  // Files
  folder: FolderIcon,
  file: FileIcon,
  document: DocumentIcon,

  // Status
  check: CheckIcon,
  checkCircle: CheckCircleIcon,
  xCircle: XCircleIcon,
  // alertCircle: moved to NotificationStatusIcons
  info: InfoIcon,

  // Media
  play: PlayIcon,
  pause: PauseIcon,
  stop: StopIcon,

  // Zoom
  zoomIn: ZoomInIcon,
  zoomOut: ZoomOutIcon,
};

// PropTypes
GeneralUIIcon.propTypes = {
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

export default GeneralUIIcon;
