/**
 * Z-Index Scale Tests
 * @description TDD tests for z-index layering system
 * @task Task 1.1.4: Add Z-Index Scale
 */

import { zIndex, type ZIndexLevel } from "../zIndex";

describe("Z-Index Scale", () => {
  describe("zIndex object", () => {
    it("should export zIndex object", () => {
      expect(zIndex).toBeDefined();
      expect(typeof zIndex).toBe("object");
    });

    it("should have all required levels", () => {
      expect(zIndex.base).toBeDefined();
      expect(zIndex.dropdown).toBeDefined();
      expect(zIndex.sticky).toBeDefined();
      expect(zIndex.fixed).toBeDefined();
      expect(zIndex.modalBackdrop).toBeDefined();
      expect(zIndex.modal).toBeDefined();
      expect(zIndex.popover).toBeDefined();
      expect(zIndex.tooltip).toBeDefined();
      expect(zIndex.toast).toBeDefined();
      expect(zIndex.crisis).toBeDefined();
    });
  });

  describe("z-index values", () => {
    it("should have correct base value", () => {
      expect(zIndex.base).toBe(0);
    });

    it("should have correct dropdown value", () => {
      expect(zIndex.dropdown).toBe(100);
    });

    it("should have correct sticky value", () => {
      expect(zIndex.sticky).toBe(200);
    });

    it("should have correct fixed value", () => {
      expect(zIndex.fixed).toBe(300);
    });

    it("should have correct modalBackdrop value", () => {
      expect(zIndex.modalBackdrop).toBe(400);
    });

    it("should have correct modal value", () => {
      expect(zIndex.modal).toBe(500);
    });

    it("should have correct popover value", () => {
      expect(zIndex.popover).toBe(600);
    });

    it("should have correct tooltip value", () => {
      expect(zIndex.tooltip).toBe(700);
    });

    it("should have correct toast value", () => {
      expect(zIndex.toast).toBe(800);
    });

    it("should have correct crisis value (highest)", () => {
      expect(zIndex.crisis).toBe(1000);
    });
  });

  describe("z-index ordering", () => {
    it("should have values in ascending order", () => {
      expect(zIndex.base).toBeLessThan(zIndex.dropdown);
      expect(zIndex.dropdown).toBeLessThan(zIndex.sticky);
      expect(zIndex.sticky).toBeLessThan(zIndex.fixed);
      expect(zIndex.fixed).toBeLessThan(zIndex.modalBackdrop);
      expect(zIndex.modalBackdrop).toBeLessThan(zIndex.modal);
      expect(zIndex.modal).toBeLessThan(zIndex.popover);
      expect(zIndex.popover).toBeLessThan(zIndex.tooltip);
      expect(zIndex.tooltip).toBeLessThan(zIndex.toast);
      expect(zIndex.toast).toBeLessThan(zIndex.crisis);
    });

    it("crisis should be the highest z-index value", () => {
      const allValues = Object.values(zIndex);
      const maxValue = Math.max(...allValues);
      expect(zIndex.crisis).toBe(maxValue);
    });

    it("base should be the lowest z-index value", () => {
      const allValues = Object.values(zIndex);
      const minValue = Math.min(...allValues);
      expect(zIndex.base).toBe(minValue);
    });
  });

  describe("z-index value types", () => {
    it("all values should be numbers", () => {
      Object.values(zIndex).forEach((value) => {
        expect(typeof value).toBe("number");
      });
    });

    it("all values should be non-negative", () => {
      Object.values(zIndex).forEach((value) => {
        expect(value).toBeGreaterThanOrEqual(0);
      });
    });

    it("all values should be integers", () => {
      Object.values(zIndex).forEach((value) => {
        expect(Number.isInteger(value)).toBe(true);
      });
    });
  });

  describe("TypeScript types", () => {
    it("should have ZIndexLevel type with all keys", () => {
      const keys: ZIndexLevel[] = [
        "base",
        "dropdown",
        "sticky",
        "fixed",
        "modalBackdrop",
        "modal",
        "popover",
        "tooltip",
        "toast",
        "crisis",
      ];
      expect(keys).toHaveLength(10);
    });
  });

  describe("layer relationships", () => {
    it("modal should be above modalBackdrop", () => {
      expect(zIndex.modal).toBeGreaterThan(zIndex.modalBackdrop);
    });

    it("popover should be above modal", () => {
      expect(zIndex.popover).toBeGreaterThan(zIndex.modal);
    });

    it("tooltip should be above popover", () => {
      expect(zIndex.tooltip).toBeGreaterThan(zIndex.popover);
    });

    it("toast should be above tooltip for notifications", () => {
      expect(zIndex.toast).toBeGreaterThan(zIndex.tooltip);
    });

    it("crisis alerts must never be covered by any other element", () => {
      const nonCrisisValues = Object.entries(zIndex)
        .filter(([key]) => key !== "crisis")
        .map(([, value]) => value);

      nonCrisisValues.forEach((value) => {
        expect(zIndex.crisis).toBeGreaterThan(value);
      });
    });
  });

  describe("React Native compatibility", () => {
    it("values should be usable with React Native zIndex style", () => {
      // React Native accepts numeric zIndex values
      const style = { zIndex: zIndex.modal };
      expect(style.zIndex).toBe(500);
    });

    it("values should be spreadable in style objects", () => {
      const style = {
        position: "absolute" as const,
        zIndex: zIndex.toast,
      };
      expect(style.zIndex).toBe(800);
    });
  });
});
