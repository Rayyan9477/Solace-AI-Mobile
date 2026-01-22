/**
 * Shadow Tokens Tests
 * @description TDD tests for shadow token system
 * @task Task 1.1.1: Add Shadow Tokens
 */

import {
  shadows,
  applyShadow,
  type ShadowLevel,
  type ShadowStyle,
} from "../shadows";

describe("Shadow Tokens", () => {
  describe("shadows object", () => {
    it("should export shadows object", () => {
      expect(shadows).toBeDefined();
      expect(typeof shadows).toBe("object");
    });

    it("should have all required shadow levels", () => {
      const requiredLevels: ShadowLevel[] = ["none", "sm", "md", "lg", "xl"];

      requiredLevels.forEach((level) => {
        expect(shadows[level]).toBeDefined();
      });
    });

    describe("none level", () => {
      it("should have zero values for no shadow effect", () => {
        expect(shadows.none).toEqual({
          shadowColor: "transparent",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 0,
        });
      });
    });

    describe("each shadow level structure", () => {
      const levels: ShadowLevel[] = ["none", "sm", "md", "lg", "xl"];

      levels.forEach((level) => {
        describe(`${level} level`, () => {
          it("should have shadowColor property", () => {
            expect(shadows[level]).toHaveProperty("shadowColor");
            expect(typeof shadows[level].shadowColor).toBe("string");
          });

          it("should have shadowOffset with width and height", () => {
            expect(shadows[level]).toHaveProperty("shadowOffset");
            expect(shadows[level].shadowOffset).toHaveProperty("width");
            expect(shadows[level].shadowOffset).toHaveProperty("height");
            expect(typeof shadows[level].shadowOffset.width).toBe("number");
            expect(typeof shadows[level].shadowOffset.height).toBe("number");
          });

          it("should have shadowOpacity as number", () => {
            expect(shadows[level]).toHaveProperty("shadowOpacity");
            expect(typeof shadows[level].shadowOpacity).toBe("number");
            expect(shadows[level].shadowOpacity).toBeGreaterThanOrEqual(0);
            expect(shadows[level].shadowOpacity).toBeLessThanOrEqual(1);
          });

          it("should have shadowRadius as number", () => {
            expect(shadows[level]).toHaveProperty("shadowRadius");
            expect(typeof shadows[level].shadowRadius).toBe("number");
            expect(shadows[level].shadowRadius).toBeGreaterThanOrEqual(0);
          });

          it("should have elevation for Android", () => {
            expect(shadows[level]).toHaveProperty("elevation");
            expect(typeof shadows[level].elevation).toBe("number");
            expect(shadows[level].elevation).toBeGreaterThanOrEqual(0);
          });
        });
      });
    });

    describe("shadow progression", () => {
      it("should have increasing elevation from sm to xl", () => {
        expect(shadows.sm.elevation).toBeLessThan(shadows.md.elevation);
        expect(shadows.md.elevation).toBeLessThan(shadows.lg.elevation);
        expect(shadows.lg.elevation).toBeLessThan(shadows.xl.elevation);
      });

      it("should have increasing shadowRadius from sm to xl", () => {
        expect(shadows.sm.shadowRadius).toBeLessThan(shadows.md.shadowRadius);
        expect(shadows.md.shadowRadius).toBeLessThan(shadows.lg.shadowRadius);
        expect(shadows.lg.shadowRadius).toBeLessThan(shadows.xl.shadowRadius);
      });

      it("should have increasing or equal shadowOpacity from sm to xl", () => {
        expect(shadows.sm.shadowOpacity).toBeLessThanOrEqual(
          shadows.md.shadowOpacity,
        );
        expect(shadows.md.shadowOpacity).toBeLessThanOrEqual(
          shadows.lg.shadowOpacity,
        );
        expect(shadows.lg.shadowOpacity).toBeLessThanOrEqual(
          shadows.xl.shadowOpacity,
        );
      });

      it("should have increasing shadowOffset height from sm to xl", () => {
        expect(shadows.sm.shadowOffset.height).toBeLessThan(
          shadows.md.shadowOffset.height,
        );
        expect(shadows.md.shadowOffset.height).toBeLessThan(
          shadows.lg.shadowOffset.height,
        );
        expect(shadows.lg.shadowOffset.height).toBeLessThan(
          shadows.xl.shadowOffset.height,
        );
      });
    });

    describe("non-none levels", () => {
      const nonNoneLevels: ShadowLevel[] = ["sm", "md", "lg", "xl"];

      nonNoneLevels.forEach((level) => {
        it(`${level} should have non-transparent shadowColor`, () => {
          expect(shadows[level].shadowColor).not.toBe("transparent");
        });

        it(`${level} should have positive elevation`, () => {
          expect(shadows[level].elevation).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("applyShadow function", () => {
    it("should be a function", () => {
      expect(typeof applyShadow).toBe("function");
    });

    it("should return shadow object for valid level", () => {
      const result = applyShadow("md");
      expect(result).toEqual(shadows.md);
    });

    it("should return correct shadow for each level", () => {
      const levels: ShadowLevel[] = ["none", "sm", "md", "lg", "xl"];

      levels.forEach((level) => {
        expect(applyShadow(level)).toEqual(shadows[level]);
      });
    });

    it("should return md shadow as default when no argument provided", () => {
      const result = applyShadow();
      expect(result).toEqual(shadows.md);
    });

    it("should return object spreadable in style", () => {
      const style = {
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        ...applyShadow("lg"),
      };

      expect(style.shadowColor).toBeDefined();
      expect(style.shadowOffset).toBeDefined();
      expect(style.shadowOpacity).toBeDefined();
      expect(style.shadowRadius).toBeDefined();
      expect(style.elevation).toBeDefined();
      expect(style.backgroundColor).toBe("#FFFFFF");
      expect(style.borderRadius).toBe(8);
    });
  });

  describe("TypeScript types", () => {
    it("should have ShadowLevel type with correct values", () => {
      const levels: ShadowLevel[] = ["none", "sm", "md", "lg", "xl"];
      expect(levels).toHaveLength(5);
    });

    it("should have ShadowStyle type with all required properties", () => {
      const shadow: ShadowStyle = shadows.md;

      expect(shadow.shadowColor).toBeDefined();
      expect(shadow.shadowOffset).toBeDefined();
      expect(shadow.shadowOpacity).toBeDefined();
      expect(shadow.shadowRadius).toBeDefined();
      expect(shadow.elevation).toBeDefined();
    });
  });

  describe("cross-platform compatibility", () => {
    it("should have iOS shadow properties (shadowColor, shadowOffset, shadowOpacity, shadowRadius)", () => {
      const shadow = shadows.md;

      // iOS uses these properties
      expect(shadow).toHaveProperty("shadowColor");
      expect(shadow).toHaveProperty("shadowOffset");
      expect(shadow).toHaveProperty("shadowOpacity");
      expect(shadow).toHaveProperty("shadowRadius");
    });

    it("should have Android elevation property", () => {
      const shadow = shadows.md;

      // Android uses elevation
      expect(shadow).toHaveProperty("elevation");
    });

    it("should work with React Native style requirements", () => {
      // React Native requires specific types for shadow properties
      const shadow = shadows.lg;

      expect(typeof shadow.shadowColor).toBe("string");
      expect(typeof shadow.shadowOffset.width).toBe("number");
      expect(typeof shadow.shadowOffset.height).toBe("number");
      expect(typeof shadow.shadowOpacity).toBe("number");
      expect(typeof shadow.shadowRadius).toBe("number");
      expect(typeof shadow.elevation).toBe("number");
    });
  });
});
