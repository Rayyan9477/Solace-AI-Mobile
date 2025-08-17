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
} from "react-native-svg";

import { useTheme } from "../../shared/theme/ThemeContext";

// Base Navigation Interface Icon Component
const NavigationInterfaceIcon = ({
  name,
  size = 24,
  color,
  therapeuticTheme = "peaceful",
  variant = "outline",
  strokeWidth = 2,
  style,
  testID,
}) => {
  const { theme } = useTheme();

  const getColor = () => {
    if (color) return color;

    if (therapeuticTheme) {
      const therapeuticColors = theme.colors.therapeutic[therapeuticTheme];
      return therapeuticColors?.[600] || theme.colors.primary[600];
    }

    return theme.colors.primary[600];
  };

  const iconColor = getColor();
  const fillColor = variant === "filled" ? iconColor : "none";
  const strokeColor = variant === "filled" ? "none" : iconColor;

  const renderIcon = () => {
    switch (name) {
      // Navigation Icons
      case "home":
        return (
          <G>
            <Path
              d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Polyline
              points="9,22 9,12 15,12 15,22"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        );

      case "dashboard":
        return (
          <G>
            <Rect
              x="3"
              y="3"
              width="7"
              height="9"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Rect
              x="14"
              y="3"
              width="7"
              height="5"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Rect
              x="14"
              y="12"
              width="7"
              height="9"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Rect
              x="3"
              y="16"
              width="7"
              height="5"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
          </G>
        );

      case "profile":
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
          </G>
        );

      case "chat":
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

      case "explore":
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
          </G>
        );

      case "discover":
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
            <Circle
              cx="11"
              cy="8"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle
              cx="8"
              cy="11"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle
              cx="14"
              cy="11"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle
              cx="11"
              cy="14"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
          </G>
        );

      // Menu and Navigation Controls
      case "menu-bars":
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

      case "sidebar":
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
              d="M9 3v18"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="12"
              y1="8"
              x2="18"
              y2="8"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="12"
              y1="12"
              x2="18"
              y2="12"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="12"
              y1="16"
              x2="18"
              y2="16"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      case "bottom-nav":
        return (
          <G>
            <Rect
              x="2"
              y="16"
              width="20"
              height="6"
              rx="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Circle
              cx="7"
              cy="19"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle
              cx="12"
              cy="19"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle
              cx="17"
              cy="19"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Path
              d="M7 16V8a5 5 0 0 1 10 0v8"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      case "tab-bar":
        return (
          <G>
            <Rect
              x="2"
              y="18"
              width="20"
              height="4"
              rx="1"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Line
              x1="8"
              y1="18"
              x2="8"
              y2="22"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
            />
            <Line
              x1="16"
              y1="18"
              x2="16"
              y2="22"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
            />
            <Circle
              cx="5"
              cy="15"
              r="1"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fill={fillColor}
            />
            <Circle
              cx="12"
              cy="15"
              r="1"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fill={fillColor}
            />
            <Circle
              cx="19"
              cy="15"
              r="1"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fill={fillColor}
            />
          </G>
        );

      // Interface Components
      case "modal":
        return (
          <G>
            <Rect
              x="4"
              y="6"
              width="16"
              height="14"
              rx="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Line
              x1="16"
              y1="8"
              x2="18"
              y2="8"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
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
              y1="16"
              x2="14"
              y2="16"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Rect
              x="2"
              y="4"
              width="20"
              height="16"
              rx="2"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fill="none"
              strokeOpacity="0.3"
            />
          </G>
        );

      case "drawer":
        return (
          <G>
            <Rect
              x="2"
              y="3"
              width="20"
              height="18"
              rx="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Path
              d="M8 3v18"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="4"
              y1="7"
              x2="6"
              y2="7"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="4"
              y1="11"
              x2="6"
              y2="11"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="4"
              y1="15"
              x2="6"
              y2="15"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="11"
              y1="8"
              x2="19"
              y2="8"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="11"
              y1="12"
              x2="19"
              y2="12"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      case "popup":
        return (
          <G>
            <Rect
              x="6"
              y="8"
              width="12"
              height="10"
              rx="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Path
              d="M12 8V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Circle
              cx="15"
              cy="10"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
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
            <Line
              x1="8"
              y1="15"
              x2="13"
              y2="15"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      // Layout and Structure
      case "layout-grid":
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

      case "layout-list":
        return (
          <G>
            <Rect
              x="3"
              y="4"
              width="18"
              height="4"
              rx="1"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Rect
              x="3"
              y="10"
              width="18"
              height="4"
              rx="1"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Rect
              x="3"
              y="16"
              width="18"
              height="4"
              rx="1"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Circle
              cx="6"
              cy="6"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle
              cx="6"
              cy="12"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle
              cx="6"
              cy="18"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
          </G>
        );

      case "layout-columns":
        return (
          <G>
            <Rect
              x="3"
              y="3"
              width="5"
              height="18"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Rect
              x="10"
              y="3"
              width="4"
              height="18"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Rect
              x="16"
              y="3"
              width="5"
              height="18"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
          </G>
        );

      case "layout-rows":
        return (
          <G>
            <Rect
              x="3"
              y="3"
              width="18"
              height="5"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Rect
              x="3"
              y="10"
              width="18"
              height="4"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Rect
              x="3"
              y="16"
              width="18"
              height="5"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
          </G>
        );

      // Screen States
      case "fullscreen":
        return (
          <G>
            <Path
              d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        );

      case "minimize":
        return (
          <G>
            <Path
              d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        );

      case "split-screen":
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
              d="M12 3v18"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Circle
              cx="8"
              cy="8"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle
              cx="16"
              cy="8"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Line
              x1="6"
              y1="12"
              x2="10"
              y2="12"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="14"
              y1="12"
              x2="18"
              y2="12"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </G>
        );

      // Breadcrumbs and Navigation Paths
      case "breadcrumbs":
        return (
          <G>
            <Circle
              cx="5"
              cy="12"
              r="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Circle
              cx="12"
              cy="12"
              r="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Circle
              cx="19"
              cy="12"
              r="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Path
              d="M7 12h3"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M14 12h3"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Polyline
              points="16,9 19,12 16,15"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        );

      case "navigation-path":
        return (
          <G>
            <Path
              d="M3 12h18"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M8 5l7 7-7 7"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle
              cx="3"
              cy="12"
              r="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Circle
              cx="21"
              cy="12"
              r="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
          </G>
        );

      // Widget and Component Icons
      case "widget":
        return (
          <G>
            <Rect
              x="3"
              y="3"
              width="6"
              height="6"
              rx="1"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Rect
              x="15"
              y="3"
              width="6"
              height="6"
              rx="1"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Rect
              x="3"
              y="15"
              width="6"
              height="6"
              rx="1"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Rect
              x="15"
              y="15"
              width="6"
              height="6"
              rx="1"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Circle
              cx="6"
              cy="6"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle
              cx="18"
              cy="6"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle
              cx="6"
              cy="18"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle
              cx="18"
              cy="18"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
          </G>
        );

      case "component":
        return (
          <G>
            <Rect
              x="5"
              y="5"
              width="14"
              height="14"
              rx="2"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Path
              d="M5 10h14"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Circle
              cx="8"
              cy="7"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle
              cx="11"
              cy="7"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Circle
              cx="14"
              cy="7"
              r="1"
              fill={variant === "filled" ? "#FFFFFF" : strokeColor}
            />
            <Line
              x1="7"
              y1="13"
              x2="17"
              y2="13"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Line
              x1="7"
              y1="16"
              x2="14"
              y2="16"
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
            <Path
              d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Polyline
              points="9,22 9,12 15,12 15,22"
              stroke={variant === "filled" ? "#FFFFFF" : strokeColor}
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
      testID={testID || `navigation-interface-icon-${name}`}
    >
      {renderIcon()}
    </Svg>
  );
};

// Specialized Navigation Interface Icon Components
export const HomeIcon = (props) => (
  <NavigationInterfaceIcon name="home" {...props} />
);
export const DashboardIcon = (props) => (
  <NavigationInterfaceIcon name="dashboard" {...props} />
);
export const ProfileIcon = (props) => (
  <NavigationInterfaceIcon name="profile" {...props} />
);
export const ChatIcon = (props) => (
  <NavigationInterfaceIcon name="chat" {...props} />
);
export const ExploreIcon = (props) => (
  <NavigationInterfaceIcon name="explore" {...props} />
);
export const DiscoverIcon = (props) => (
  <NavigationInterfaceIcon name="discover" {...props} />
);
export const MenuBarsIcon = (props) => (
  <NavigationInterfaceIcon name="menu-bars" {...props} />
);
export const SidebarIcon = (props) => (
  <NavigationInterfaceIcon name="sidebar" {...props} />
);
export const BottomNavIcon = (props) => (
  <NavigationInterfaceIcon name="bottom-nav" {...props} />
);
export const TabBarIcon = (props) => (
  <NavigationInterfaceIcon name="tab-bar" {...props} />
);
export const ModalIcon = (props) => (
  <NavigationInterfaceIcon name="modal" {...props} />
);
export const DrawerIcon = (props) => (
  <NavigationInterfaceIcon name="drawer" {...props} />
);
export const PopupIcon = (props) => (
  <NavigationInterfaceIcon name="popup" {...props} />
);
export const LayoutGridIcon = (props) => (
  <NavigationInterfaceIcon name="layout-grid" {...props} />
);
export const LayoutListIcon = (props) => (
  <NavigationInterfaceIcon name="layout-list" {...props} />
);
export const LayoutColumnsIcon = (props) => (
  <NavigationInterfaceIcon name="layout-columns" {...props} />
);
export const LayoutRowsIcon = (props) => (
  <NavigationInterfaceIcon name="layout-rows" {...props} />
);
export const FullscreenIcon = (props) => (
  <NavigationInterfaceIcon name="fullscreen" {...props} />
);
export const MinimizeIcon = (props) => (
  <NavigationInterfaceIcon name="minimize" {...props} />
);
export const SplitScreenIcon = (props) => (
  <NavigationInterfaceIcon name="split-screen" {...props} />
);
export const BreadcrumbsIcon = (props) => (
  <NavigationInterfaceIcon name="breadcrumbs" {...props} />
);
export const NavigationPathIcon = (props) => (
  <NavigationInterfaceIcon name="navigation-path" {...props} />
);
export const WidgetIcon = (props) => (
  <NavigationInterfaceIcon name="widget" {...props} />
);
export const ComponentIcon = (props) => (
  <NavigationInterfaceIcon name="component" {...props} />
);

// Navigation Interface Icon Collection
export const NavigationInterfaceIconCollection = {
  // Main Navigation
  home: HomeIcon,
  dashboard: DashboardIcon,
  profile: ProfileIcon,
  chat: ChatIcon,
  explore: ExploreIcon,
  discover: DiscoverIcon,

  // Menu Controls
  menuBars: MenuBarsIcon,
  sidebar: SidebarIcon,
  bottomNav: BottomNavIcon,
  tabBar: TabBarIcon,

  // Interface Components
  modal: ModalIcon,
  drawer: DrawerIcon,
  popup: PopupIcon,

  // Layout
  layoutGrid: LayoutGridIcon,
  layoutList: LayoutListIcon,
  layoutColumns: LayoutColumnsIcon,
  layoutRows: LayoutRowsIcon,

  // Screen States
  fullscreen: FullscreenIcon,
  minimize: MinimizeIcon,
  splitScreen: SplitScreenIcon,

  // Navigation Paths
  breadcrumbs: BreadcrumbsIcon,
  navigationPath: NavigationPathIcon,

  // Components
  widget: WidgetIcon,
  component: ComponentIcon,
};

// PropTypes
NavigationInterfaceIcon.propTypes = {
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

export default NavigationInterfaceIcon;
