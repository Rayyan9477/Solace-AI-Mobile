/**
 * Enhanced UI Components Index
 * Exports all Freud UI Kit components for easy import
 */

// Theme System
export {
  FreudThemeProvider,
  useFreudTheme,
  withFreudTheme,
} from "./FreudThemeProvider";

// Background Components
export {
  PageShaderBackground,
  CalmingBackground,
  NurturingBackground,
  PeacefulBackground,
  GroundingBackground,
  EnergizingBackground,
  ZenBackground,
  TherapeuticBackground,
  WelcomingBackground,
} from "./PageShaderBackground";

// Mood Components
export {
  EnhancedMoodCard,
  MoodGrid,
  MoodSlider,
  QuickMoodCheck,
} from "./EnhancedMoodCard";

// Enhanced Dashboard Components (to be created)
export { EnhancedDashboard, EnhancedDashboardCard } from "./EnhancedDashboard";

// Enhanced Mood Tracker (to be created)
export { EnhancedMoodTracker } from "./EnhancedMoodTracker";

// Core UI Components
export {
  FreudCard,
  TherapeuticSurface,
  FreudButton,
  TherapeuticButton,
  FreudText,
  TherapeuticText,
  ResponsiveView,
  FreudContainer,
} from "./FreudUISystem";

// Showcase Component
export { FreudUIShowcase } from "./FreudUIShowcase";

// Pre-configured Component Combinations
export const MentalHealthDashboard = ({
  user,
  onNavigate,
  onMoodTrack,
  ...props
}) => {
  const EnhancedDashboard = require("./EnhancedDashboard").EnhancedDashboard;
  return (
    <EnhancedDashboard
      user={user}
      onNavigate={onNavigate}
      onMoodTrack={onMoodTrack}
      {...props}
    />
  );
};

export const MoodTrackingFlow = ({ onComplete, onCancel, ...props }) => {
  const EnhancedMoodTracker =
    require("./EnhancedMoodTracker").EnhancedMoodTracker;
  return (
    <EnhancedMoodTracker
      onComplete={onComplete}
      onCancel={onCancel}
      {...props}
    />
  );
};

// Utility Functions
export const getFreudThemeColors = (
  therapeutic = "balanced",
  isDarkMode = false,
) => {
  const { FreudColors } = require("../../shared/theme/FreudDesignSystem");

  const therapeuticThemes = {
    calming: FreudColors.serenityGreen,
    nurturing: FreudColors.empathyOrange,
    peaceful: FreudColors.optimisticGray,
    grounding: FreudColors.mindfulBrown,
    energizing: FreudColors.zenYellow,
    zen: FreudColors.kindPurple,
    balanced: FreudColors.mindfulBrown,
  };

  return therapeuticThemes[therapeutic] || therapeuticThemes.balanced;
};

export const getShaderConfig = (shader = "therapeutic") => {
  return (
    {
      therapeutic: {
        colors: ["#E5EAD7", "#F2F5EB", "#FFF6E2"],
        type: "gradient",
      },
      calming: { colors: ["#E5EAD7", "#F2F5EB"], type: "wave" },
      nurturing: { colors: ["#FFF6E2", "#FFC89E"], type: "gradient" },
      peaceful: { colors: ["#F5F5F5", "#E1E1E0"], type: "noise" },
      grounding: { colors: ["#F7F4F2", "#FFF6E2"], type: "wave" },
      energizing: { colors: ["#FFF4E0", "#EAEFFF"], type: "gradient" },
      zen: { colors: ["#EAEFFF", "#E5EAD7"], type: "wave" },
    }[shader] || { colors: ["#E5EAD7", "#F2F5EB"], type: "gradient" }
  );
};

export default {
  FreudThemeProvider,
  PageShaderBackground,
  EnhancedMoodCard,
  MoodGrid,
  MoodSlider,
  QuickMoodCheck,
  MentalHealthDashboard,
  MoodTrackingFlow,
};
