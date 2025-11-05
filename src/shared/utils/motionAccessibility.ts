// Motion accessibility bridge for legacy imports
export const MOTION_TYPES = {
  NONE: "none",
  REDUCED: "reduced",
  FULL: "full",
};

export const useMotionAccessibility = () => ({
  prefersReducedMotion: false,
  motionType: MOTION_TYPES.FULL,
});
