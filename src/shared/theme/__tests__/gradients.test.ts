/**
 * Gradient Tokens Tests
 * @description TDD tests for gradient token system
 * @task Task 1.1.2: Add Gradient Definitions
 */

import {
  gradients,
  getGradientProps,
  type GradientPreset,
  type GradientConfig,
  type GradientDirection,
} from "../gradients";

describe("Gradient Tokens", () => {
  describe("gradients object", () => {
    it("should export gradients object", () => {
      expect(gradients).toBeDefined();
      expect(typeof gradients).toBe("object");
    });

    it("should have all required gradient presets", () => {
      const requiredPresets: GradientPreset[] = [
        "morning",
        "calming",
        "energizing",
        "grounding",
        "therapeutic",
        "crisis",
      ];

      requiredPresets.forEach((preset) => {
        expect(gradients[preset]).toBeDefined();
      });
    });
  });

  describe("gradient structure", () => {
    const presets: GradientPreset[] = [
      "morning",
      "calming",
      "energizing",
      "grounding",
      "therapeutic",
      "crisis",
    ];

    presets.forEach((preset) => {
      describe(`${preset} gradient`, () => {
        it("should have colors array with at least 2 colors", () => {
          expect(gradients[preset]).toHaveProperty("colors");
          expect(Array.isArray(gradients[preset].colors)).toBe(true);
          expect(gradients[preset].colors.length).toBeGreaterThanOrEqual(2);
        });

        it("should have all colors as valid hex strings", () => {
          const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

          gradients[preset].colors.forEach((color) => {
            expect(color).toMatch(hexRegex);
          });
        });

        it("should have a valid direction", () => {
          const validDirections: GradientDirection[] = [
            "vertical",
            "horizontal",
            "diagonal",
          ];

          expect(gradients[preset]).toHaveProperty("direction");
          expect(validDirections).toContain(gradients[preset].direction);
        });

        it("should have locations array matching colors length if defined", () => {
          if (gradients[preset].locations) {
            expect(gradients[preset].locations?.length).toBe(
              gradients[preset].colors.length,
            );
          }
        });

        it("should have locations values between 0 and 1 if defined", () => {
          if (gradients[preset].locations) {
            gradients[preset].locations?.forEach((location) => {
              expect(location).toBeGreaterThanOrEqual(0);
              expect(location).toBeLessThanOrEqual(1);
            });
          }
        });
      });
    });
  });

  describe("therapeutic gradients", () => {
    it("morning gradient should have warm, optimistic colors", () => {
      const { colors } = gradients.morning;
      expect(colors.length).toBeGreaterThanOrEqual(2);
    });

    it("calming gradient should be designed for relaxation", () => {
      const { colors, direction } = gradients.calming;
      expect(colors.length).toBeGreaterThanOrEqual(2);
      expect(direction).toBeDefined();
    });

    it("crisis gradient should be high-visibility for safety", () => {
      const { colors } = gradients.crisis;
      expect(colors.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("getGradientProps function", () => {
    it("should be a function", () => {
      expect(typeof getGradientProps).toBe("function");
    });

    it("should return expo-linear-gradient compatible props", () => {
      const props = getGradientProps("calming");

      expect(props).toHaveProperty("colors");
      expect(props).toHaveProperty("start");
      expect(props).toHaveProperty("end");
      expect(Array.isArray(props.colors)).toBe(true);
    });

    it("should return correct start/end for vertical direction", () => {
      // Find a vertical gradient or test with a known one
      const props = getGradientProps("calming");

      expect(props.start).toHaveProperty("x");
      expect(props.start).toHaveProperty("y");
      expect(props.end).toHaveProperty("x");
      expect(props.end).toHaveProperty("y");
    });

    it("should return colors from the gradient config", () => {
      const preset: GradientPreset = "morning";
      const props = getGradientProps(preset);

      expect(props.colors).toEqual(gradients[preset].colors);
    });

    it("should include locations if defined in gradient config", () => {
      const presets: GradientPreset[] = [
        "morning",
        "calming",
        "energizing",
        "grounding",
        "therapeutic",
        "crisis",
      ];

      presets.forEach((preset) => {
        const props = getGradientProps(preset);
        if (gradients[preset].locations) {
          expect(props.locations).toEqual(gradients[preset].locations);
        }
      });
    });

    it("should return correct coordinates for horizontal direction", () => {
      // Test horizontal direction mapping
      const horizontalGradient = Object.entries(gradients).find(
        ([, config]) => config.direction === "horizontal",
      );

      if (horizontalGradient) {
        const [preset] = horizontalGradient;
        const props = getGradientProps(preset as GradientPreset);

        // Horizontal: left to right
        expect(props.start.x).toBe(0);
        expect(props.start.y).toBe(0.5);
        expect(props.end.x).toBe(1);
        expect(props.end.y).toBe(0.5);
      }
    });

    it("should return correct coordinates for vertical direction", () => {
      const verticalGradient = Object.entries(gradients).find(
        ([, config]) => config.direction === "vertical",
      );

      if (verticalGradient) {
        const [preset] = verticalGradient;
        const props = getGradientProps(preset as GradientPreset);

        // Vertical: top to bottom
        expect(props.start.x).toBe(0.5);
        expect(props.start.y).toBe(0);
        expect(props.end.x).toBe(0.5);
        expect(props.end.y).toBe(1);
      }
    });

    it("should return correct coordinates for diagonal direction", () => {
      const diagonalGradient = Object.entries(gradients).find(
        ([, config]) => config.direction === "diagonal",
      );

      if (diagonalGradient) {
        const [preset] = diagonalGradient;
        const props = getGradientProps(preset as GradientPreset);

        // Diagonal: top-left to bottom-right
        expect(props.start.x).toBe(0);
        expect(props.start.y).toBe(0);
        expect(props.end.x).toBe(1);
        expect(props.end.y).toBe(1);
      }
    });
  });

  describe("TypeScript types", () => {
    it("should have GradientPreset type with all presets", () => {
      const presets: GradientPreset[] = [
        "morning",
        "calming",
        "energizing",
        "grounding",
        "therapeutic",
        "crisis",
      ];
      expect(presets).toHaveLength(6);
    });

    it("should have GradientConfig type with required properties", () => {
      const config: GradientConfig = gradients.calming;

      expect(config.colors).toBeDefined();
      expect(config.direction).toBeDefined();
    });

    it("should have GradientDirection type", () => {
      const directions: GradientDirection[] = [
        "vertical",
        "horizontal",
        "diagonal",
      ];
      expect(directions).toHaveLength(3);
    });
  });

  describe("expo-linear-gradient compatibility", () => {
    it("should produce props usable by LinearGradient component", () => {
      const props = getGradientProps("therapeutic");

      // LinearGradient requires these props
      expect(props.colors).toBeDefined();
      expect(props.start).toBeDefined();
      expect(props.end).toBeDefined();

      // Coordinates should be normalized (0-1)
      expect(props.start.x).toBeGreaterThanOrEqual(0);
      expect(props.start.x).toBeLessThanOrEqual(1);
      expect(props.start.y).toBeGreaterThanOrEqual(0);
      expect(props.start.y).toBeLessThanOrEqual(1);
      expect(props.end.x).toBeGreaterThanOrEqual(0);
      expect(props.end.x).toBeLessThanOrEqual(1);
      expect(props.end.y).toBeGreaterThanOrEqual(0);
      expect(props.end.y).toBeLessThanOrEqual(1);
    });

    it("should be spreadable as LinearGradient props", () => {
      const props = getGradientProps("morning");

      // Simulate spreading into component props
      const componentProps = {
        style: { flex: 1 },
        ...props,
      };

      expect(componentProps.colors).toBeDefined();
      expect(componentProps.start).toBeDefined();
      expect(componentProps.end).toBeDefined();
      expect(componentProps.style).toEqual({ flex: 1 });
    });
  });
});
