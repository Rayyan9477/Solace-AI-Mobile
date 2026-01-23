/**
 * Animation Timings Tests
 * @description TDD tests for animation timing token system
 * @task Task 1.1.3: Add Animation Timings
 */

import {
  animations,
  easings,
  animationPresets,
  type DurationKey,
  type StaggerKey,
  type EasingKey,
  type AnimationPresetKey,
} from "../animationTimings";

describe("Animation Timings", () => {
  describe("animations object", () => {
    it("should export animations object", () => {
      expect(animations).toBeDefined();
      expect(typeof animations).toBe("object");
    });

    describe("animations.duration", () => {
      it("should have all required duration values", () => {
        expect(animations.duration).toBeDefined();
        expect(animations.duration.instant).toBeDefined();
        expect(animations.duration.fast).toBeDefined();
        expect(animations.duration.normal).toBeDefined();
        expect(animations.duration.slow).toBeDefined();
        expect(animations.duration.therapeutic).toBeDefined();
        expect(animations.duration.breathing).toBeDefined();
      });

      it("should have correct millisecond values", () => {
        expect(animations.duration.instant).toBe(100);
        expect(animations.duration.fast).toBe(200);
        expect(animations.duration.normal).toBe(300);
        expect(animations.duration.slow).toBe(500);
        expect(animations.duration.therapeutic).toBe(800);
        expect(animations.duration.breathing).toBe(4000);
      });

      it("should have increasing duration values", () => {
        expect(animations.duration.instant).toBeLessThan(
          animations.duration.fast,
        );
        expect(animations.duration.fast).toBeLessThan(
          animations.duration.normal,
        );
        expect(animations.duration.normal).toBeLessThan(
          animations.duration.slow,
        );
        expect(animations.duration.slow).toBeLessThan(
          animations.duration.therapeutic,
        );
        expect(animations.duration.therapeutic).toBeLessThan(
          animations.duration.breathing,
        );
      });

      it("should have all values as numbers", () => {
        Object.values(animations.duration).forEach((value) => {
          expect(typeof value).toBe("number");
          expect(value).toBeGreaterThan(0);
        });
      });
    });

    describe("animations.stagger", () => {
      it("should have all required stagger values", () => {
        expect(animations.stagger).toBeDefined();
        expect(animations.stagger.fast).toBeDefined();
        expect(animations.stagger.normal).toBeDefined();
        expect(animations.stagger.slow).toBeDefined();
      });

      it("should have increasing stagger values", () => {
        expect(animations.stagger.fast).toBeLessThan(animations.stagger.normal);
        expect(animations.stagger.normal).toBeLessThan(animations.stagger.slow);
      });

      it("should have all values as numbers", () => {
        Object.values(animations.stagger).forEach((value) => {
          expect(typeof value).toBe("number");
          expect(value).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("easings object", () => {
    it("should export easings object", () => {
      expect(easings).toBeDefined();
      expect(typeof easings).toBe("object");
    });

    describe("standard easing curves", () => {
      it("should have easeIn curve", () => {
        expect(easings.easeIn).toBeDefined();
      });

      it("should have easeOut curve", () => {
        expect(easings.easeOut).toBeDefined();
      });

      it("should have easeInOut curve", () => {
        expect(easings.easeInOut).toBeDefined();
      });
    });

    describe("therapeutic easing curves", () => {
      it("should have gentle curve for subtle animations", () => {
        expect(easings.gentle).toBeDefined();
      });

      it("should have calming curve for relaxation features", () => {
        expect(easings.calming).toBeDefined();
      });
    });

    describe("spring configurations", () => {
      it("should have spring config", () => {
        expect(easings.spring).toBeDefined();
        expect(typeof easings.spring).toBe("object");
      });

      it("should have therapeuticSpring config", () => {
        expect(easings.therapeuticSpring).toBeDefined();
        expect(typeof easings.therapeuticSpring).toBe("object");
      });

      it("spring should have required properties", () => {
        expect(easings.spring).toHaveProperty("damping");
        expect(easings.spring).toHaveProperty("stiffness");
      });

      it("therapeuticSpring should have required properties", () => {
        expect(easings.therapeuticSpring).toHaveProperty("damping");
        expect(easings.therapeuticSpring).toHaveProperty("stiffness");
      });

      it("therapeuticSpring should be gentler than regular spring", () => {
        // Higher damping = less bouncy, more calming
        expect(easings.therapeuticSpring.damping).toBeGreaterThanOrEqual(
          easings.spring.damping,
        );
        // Lower stiffness = slower, more gentle
        expect(easings.therapeuticSpring.stiffness).toBeLessThanOrEqual(
          easings.spring.stiffness,
        );
      });
    });
  });

  describe("animationPresets object", () => {
    it("should export animationPresets object", () => {
      expect(animationPresets).toBeDefined();
      expect(typeof animationPresets).toBe("object");
    });

    describe("fadeIn preset", () => {
      it("should have fadeIn preset", () => {
        expect(animationPresets.fadeIn).toBeDefined();
      });

      it("should have from and to states", () => {
        expect(animationPresets.fadeIn).toHaveProperty("from");
        expect(animationPresets.fadeIn).toHaveProperty("to");
      });

      it("should animate opacity", () => {
        expect(animationPresets.fadeIn.from).toHaveProperty("opacity");
        expect(animationPresets.fadeIn.to).toHaveProperty("opacity");
        expect(animationPresets.fadeIn.from.opacity).toBe(0);
        expect(animationPresets.fadeIn.to.opacity).toBe(1);
      });
    });

    describe("slideUp preset", () => {
      it("should have slideUp preset", () => {
        expect(animationPresets.slideUp).toBeDefined();
      });

      it("should have from and to states", () => {
        expect(animationPresets.slideUp).toHaveProperty("from");
        expect(animationPresets.slideUp).toHaveProperty("to");
      });

      it("should animate translateY", () => {
        expect(animationPresets.slideUp.from).toHaveProperty("translateY");
        expect(animationPresets.slideUp.to).toHaveProperty("translateY");
        expect(animationPresets.slideUp.from.translateY).toBeGreaterThan(0);
        expect(animationPresets.slideUp.to.translateY).toBe(0);
      });
    });

    describe("scalePress preset", () => {
      it("should have scalePress preset", () => {
        expect(animationPresets.scalePress).toBeDefined();
      });

      it("should have from and to states", () => {
        expect(animationPresets.scalePress).toHaveProperty("from");
        expect(animationPresets.scalePress).toHaveProperty("to");
      });

      it("should animate scale", () => {
        expect(animationPresets.scalePress.from).toHaveProperty("scale");
        expect(animationPresets.scalePress.to).toHaveProperty("scale");
        expect(animationPresets.scalePress.from.scale).toBe(1);
        expect(animationPresets.scalePress.to.scale).toBeLessThan(1);
      });
    });

    describe("breathingCircle preset", () => {
      it("should have breathingCircle preset", () => {
        expect(animationPresets.breathingCircle).toBeDefined();
      });

      it("should have from and to states", () => {
        expect(animationPresets.breathingCircle).toHaveProperty("from");
        expect(animationPresets.breathingCircle).toHaveProperty("to");
      });

      it("should animate scale for breathing effect", () => {
        expect(animationPresets.breathingCircle.from).toHaveProperty("scale");
        expect(animationPresets.breathingCircle.to).toHaveProperty("scale");
      });

      it("should have therapeutic duration", () => {
        expect(animationPresets.breathingCircle).toHaveProperty("duration");
        expect(animationPresets.breathingCircle.duration).toBe(
          animations.duration.breathing,
        );
      });
    });
  });

  describe("TypeScript types", () => {
    it("should have DurationKey type with all keys", () => {
      const keys: DurationKey[] = [
        "instant",
        "fast",
        "normal",
        "slow",
        "therapeutic",
        "breathing",
      ];
      expect(keys).toHaveLength(6);
    });

    it("should have StaggerKey type with all keys", () => {
      const keys: StaggerKey[] = ["fast", "normal", "slow"];
      expect(keys).toHaveLength(3);
    });

    it("should have EasingKey type with all keys", () => {
      const keys: EasingKey[] = [
        "easeIn",
        "easeOut",
        "easeInOut",
        "gentle",
        "calming",
      ];
      expect(keys).toHaveLength(5);
    });

    it("should have AnimationPresetKey type with all keys", () => {
      const keys: AnimationPresetKey[] = [
        "fadeIn",
        "slideUp",
        "scalePress",
        "breathingCircle",
      ];
      expect(keys).toHaveLength(4);
    });
  });

  describe("Reanimated compatibility", () => {
    it("easing curves should be functions or Reanimated-compatible", () => {
      // Easing curves should be usable with withTiming
      expect(easings.easeIn).toBeDefined();
      expect(easings.easeOut).toBeDefined();
      expect(easings.easeInOut).toBeDefined();
    });

    it("spring configs should be usable with withSpring", () => {
      const springConfig = easings.spring;
      expect(springConfig.damping).toBeDefined();
      expect(springConfig.stiffness).toBeDefined();
      expect(typeof springConfig.damping).toBe("number");
      expect(typeof springConfig.stiffness).toBe("number");
    });

    it("durations should be usable with withTiming", () => {
      Object.values(animations.duration).forEach((duration) => {
        expect(typeof duration).toBe("number");
        expect(duration).toBeGreaterThan(0);
      });
    });
  });

  describe("Moti compatibility", () => {
    it("animation presets should have moti-compatible structure", () => {
      const preset = animationPresets.fadeIn;

      // Moti uses from/animate pattern
      expect(preset.from).toBeDefined();
      expect(preset.to).toBeDefined();
    });

    it("should be spreadable in moti components", () => {
      const motiProps = {
        ...animationPresets.fadeIn,
        transition: { duration: animations.duration.normal },
      };

      expect(motiProps.from).toBeDefined();
      expect(motiProps.to).toBeDefined();
      expect(motiProps.transition.duration).toBe(300);
    });
  });
});
