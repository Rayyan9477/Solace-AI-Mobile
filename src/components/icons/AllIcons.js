// Comprehensive Icon System - All Icons Export
// Mental Health Focused UI Icon Library for Solace AI Mobile

// Import all icon collections
// Import collections for organized access
import { AccessibilityCommunicationIconCollection } from "./AccessibilityCommunicationIcons";
import { ArrowDirectionIconCollection } from "./ArrowsDirectionsIcons";
import { DataVisualizationIconCollection } from "./DataVisualizationIcons";
import { GeneralUIIconCollection } from "./GeneralUIIcons";
import { HealthTechIconCollection } from "./HealthTechIcons";
import { MentalHealthIconCollection } from "./MentalHealthIcons";
import { NavigationInterfaceIconCollection } from "./NavigationInterfaceIcons";
import { NotificationStatusIconCollection } from "./NotificationStatusIcons";

// Export core system components only to avoid conflicts
export * from "./IconSystem";
export * from "./AppIcons";
export * from "./PlatformIcon";

// Note: Individual icon components are available through IconCollections
// to avoid naming conflicts between collections

// Comprehensive Icon Collections
export const IconCollections = {
  healthTech: HealthTechIconCollection,
  generalUI: GeneralUIIconCollection,
  arrowsDirections: ArrowDirectionIconCollection,
  mentalHealth: MentalHealthIconCollection,
  navigationInterface: NavigationInterfaceIconCollection,
  dataVisualization: DataVisualizationIconCollection,
  accessibilityCommunication: AccessibilityCommunicationIconCollection,
  notificationStatus: NotificationStatusIconCollection,
};

// All Icons Combined for Easy Access
export const AllIcons = {
  // Health Tech Icons
  ...HealthTechIconCollection,

  // General UI Icons
  ...GeneralUIIconCollection,

  // Arrows and Directions
  ...ArrowDirectionIconCollection,

  // Mental Health Specific
  ...MentalHealthIconCollection,

  // Navigation and Interface
  ...NavigationInterfaceIconCollection,

  // Data Visualization
  ...DataVisualizationIconCollection,

  // Accessibility & Communication
  ...AccessibilityCommunicationIconCollection,

  // Notification & Status
  ...NotificationStatusIconCollection,
};

// Icon Categories for Navigation
export const IconCategories = {
  // Health & Medical
  "Brain & Mental": [
    "brain",
    "mind",
    "neuron",
    "mindfulness",
    "meditation-pose",
    "zen-circle",
    "emotional-balance",
    "inner-peace",
    "emotional-growth",
  ],

  "Physical Health": [
    "heart-pulse",
    "wellness",
    "stethoscope",
    "health-monitor",
    "thermometer",
    "activity",
    "exercise",
    "nutrition",
    "water",
  ],

  "Therapy & Support": [
    "therapy",
    "counseling",
    "treatment",
    "therapy-session",
    "support-group",
    "counselor",
    "crisis-support",
    "emergency-contact",
  ],

  "Wellness & Self-Care": [
    "self-care",
    "wellness-routine",
    "mental-strength",
    "sleep",
    "recovery",
    "breathing-exercise",
    "relaxation",
  ],

  "Mood & Emotions": [
    "mood-tracker",
    "emotions",
    "feelings-journal",
    "progress-tracking",
    "mental-goals",
  ],

  // UI & Interface
  "Basic Controls": [
    "menu",
    "close",
    "search",
    "filter",
    "sort",
    "more-horizontal",
    "more-vertical",
    "plus",
    "minus",
  ],

  Actions: [
    "edit",
    "delete",
    "save",
    "copy",
    "check",
    "check-circle",
    "x-circle",
    "alert-circle",
    "info",
  ],

  "View Controls": ["eye", "eye-off", "grid", "list", "zoom-in", "zoom-out"],

  "Media Controls": ["play", "pause", "stop", "skip-back", "skip-forward"],

  // Navigation & Layout
  "Main Navigation": [
    "home",
    "dashboard",
    "profile",
    "chat",
    "explore",
    "discover",
  ],

  "Layout & Structure": [
    "layout-grid",
    "layout-list",
    "layout-columns",
    "layout-rows",
    "sidebar",
    "modal",
    "drawer",
    "popup",
  ],

  "Screen States": [
    "fullscreen",
    "minimize",
    "split-screen",
    "expand",
    "collapse",
  ],

  // Arrows & Directions
  "Basic Arrows": [
    "arrow-up",
    "arrow-down",
    "arrow-left",
    "arrow-right",
    "arrow-up-right",
    "arrow-up-left",
    "arrow-down-right",
    "arrow-down-left",
  ],

  Chevrons: [
    "chevron-up",
    "chevron-down",
    "chevron-left",
    "chevron-right",
    "chevrons-up",
    "chevrons-down",
    "chevrons-left",
    "chevrons-right",
  ],

  "Circular & Special": [
    "refresh-cw",
    "refresh-ccw",
    "rotate-cw",
    "rotate-ccw",
    "navigation",
    "compass",
    "move",
    "drag",
  ],

  // Files & Documents
  "File System": ["folder", "file", "document", "settings", "preferences"],

  // Data Visualization
  "Charts & Analytics": [
    "bar-chart",
    "line-chart",
    "area-chart",
    "pie-chart",
    "donut-chart",
    "scatter-plot",
    "analytics",
    "trending-up",
    "trending-down",
  ],

  "Progress & Metrics": [
    "progress-ring",
    "progress-bar",
    "statistics",
    "metrics",
    "dashboard-data",
    "compare",
    "correlation",
  ],

  "Mental Health Data": [
    "mood-graph",
    "wellness-meter",
    "stress-level",
    "heart-rate-chart",
    "sleep-chart",
  ],

  // Accessibility & Communication
  Accessibility: [
    "accessibility",
    "wheelchair",
    "hearing-aid",
    "sign-language",
    "braille",
    "voice-recognition",
    "screen-reader",
    "high-contrast",
  ],

  Communication: [
    "chat-bubble",
    "speech-bubble",
    "video-call",
    "voice-call",
    "text-to-speech",
    "live-caption",
    "translation",
  ],

  "Support & Help": [
    "help-circle",
    "support",
    "feedback",
    "contact-support",
    "language",
    "localization",
  ],

  // Notification & Status
  Notifications: [
    "bell",
    "bell-off",
    "notification",
    "notification-dot",
    "message-notification",
    "reminder-notification",
    "therapy-reminder",
  ],

  "Status Indicators": [
    "alert",
    "alert-circle",
    "warning",
    "error",
    "success",
    "info",
    "status-online",
    "status-offline",
    "status-away",
    "status-busy",
  ],

  "Progress & Loading": [
    "loading",
    "spinner",
    "progress-indicator",
    "badge",
    "badge-check",
  ],

  "Mental Health Status": [
    "mood-positive",
    "mood-negative",
    "mood-neutral",
    "wellness-status",
  ],

  "Priority & Urgency": [
    "priority-high",
    "priority-medium",
    "priority-low",
    "urgent",
  ],
};

// Therapeutic Theme Suggestions for Icons
export const TherapeuticThemeMapping = {
  // Calming themes for anxiety-reducing icons
  calming: [
    "breathing-exercise",
    "relaxation",
    "zen-circle",
    "inner-peace",
    "meditation-pose",
    "mindfulness",
  ],

  // Nurturing themes for growth and healing
  nurturing: [
    "emotional-growth",
    "self-care",
    "wellness-routine",
    "support-group",
    "counselor",
    "therapy-session",
  ],

  // Peaceful themes for serenity and balance
  peaceful: [
    "emotional-balance",
    "mental-strength",
    "progress-tracking",
    "wellness",
    "sleep",
  ],

  // Grounding themes for stability
  grounding: [
    "therapy",
    "treatment",
    "counseling",
    "mental-goals",
    "crisis-support",
  ],

  // Energizing themes for motivation
  energizing: ["exercise", "activity", "mood-tracker", "emotions"],

  // Focus themes for concentration
  focus: [
    "brain",
    "mind",
    "neuron",
    "search",
    "filter",
    "zoom-in",
    "analytics",
    "bar-chart",
    "line-chart",
    "dashboard-data",
  ],

  // Mindful themes for awareness
  mindful: [
    "feelings-journal",
    "heart-pulse",
    "nutrition",
    "water",
    "mood-graph",
    "wellness-meter",
    "mood-positive",
    "mood-neutral",
  ],

  // Balance themes for equilibrium
  balance: [
    "home",
    "dashboard",
    "settings",
    "preferences",
    "notification",
    "reminder-notification",
    "wellness-status",
    "priority-medium",
    "badge",
    "status-online",
  ],
};

// Icon Size Presets
export const IconSizePresets = {
  xs: 12,
  sm: 16,
  base: 20,
  md: 24,
  lg: 28,
  xl: 32,
  "2xl": 40,
  "3xl": 48,
  "4xl": 64,
};

// Common Icon Props for Consistency
export const defaultIconProps = {
  size: IconSizePresets.md,
  therapeuticTheme: "peaceful",
  variant: "outline",
  strokeWidth: 2,
};

// Icon Usage Examples
export const IconUsageExamples = {
  // Basic usage
  basic: {
    component: "BrainIcon",
    props: { size: 24, color: "#0EA5E9" },
    usage: '<BrainIcon size={24} color="#0EA5E9" />',
  },

  // Therapeutic themed
  therapeutic: {
    component: "MindfulnessIcon",
    props: { size: 32, therapeuticTheme: "calming", variant: "filled" },
    usage:
      '<MindfulnessIcon size={32} therapeuticTheme="calming" variant="filled" />',
  },

  // Interactive with animation
  interactive: {
    component: "HeartPulseIcon",
    props: {
      size: 28,
      therapeuticTheme: "nurturing",
      variant: "outline",
      style: { animationDuration: "2s" },
    },
    usage:
      '<HeartPulseIcon size={28} therapeuticTheme="nurturing" style={{ animationDuration: "2s" }} />',
  },
};

// Icon Accessibility Guidelines
export const IconAccessibilityGuidelines = {
  minimumTouchTarget: 44, // pixels
  recommendedSizes: {
    "Tab Bar": 24,
    Navigation: 20,
    Button: 16,
    Inline: 14,
  },
  colorContrastRatio: 4.5, // WCAG AA standard
  semanticLabeling: "Always include accessibilityLabel for screen readers",
  testIDConvention: "icon-{category}-{name}",
};

// Export utility functions
export const IconUtils = {
  // Get icon by name from any collection
  getIcon: (iconName) => {
    return AllIcons[iconName] || null;
  },

  // Get icons by category
  getIconsByCategory: (category) => {
    return IconCategories[category] || [];
  },

  // Get therapeutic theme suggestions for icon
  getTherapeuticTheme: (iconName) => {
    for (const [theme, icons] of Object.entries(TherapeuticThemeMapping)) {
      if (icons.includes(iconName)) {
        return theme;
      }
    }
    return "peaceful"; // default
  },

  // Validate icon props for accessibility
  validateIconProps: (props) => {
    const warnings = [];

    if (
      props.size &&
      props.size < IconAccessibilityGuidelines.minimumTouchTarget
    ) {
      warnings.push(
        `Icon size ${props.size}px is below minimum touch target of ${IconAccessibilityGuidelines.minimumTouchTarget}px`,
      );
    }

    if (!props.accessibilityLabel && !props.testID) {
      warnings.push(
        "Consider adding accessibilityLabel or testID for better accessibility",
      );
    }

    return warnings;
  },
};

// Default export for most common usage
export default AllIcons;
