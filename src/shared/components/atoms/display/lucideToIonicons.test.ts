import { LUCIDE_TO_IONICON, resolveIconName } from "./lucideToIonicons";

describe("lucideToIonicons", () => {
  describe("LUCIDE_TO_IONICON map", () => {
    it("maps canonical Lucide names to Ionicons equivalents", () => {
      expect(LUCIDE_TO_IONICON["heart"]).toBe("heart-outline");
      expect(LUCIDE_TO_IONICON["chevron-right"]).toBe("chevron-forward");
      expect(LUCIDE_TO_IONICON["arrow-left"]).toBe("arrow-back");
      expect(LUCIDE_TO_IONICON["x"]).toBe("close");
      expect(LUCIDE_TO_IONICON["check"]).toBe("checkmark");
      expect(LUCIDE_TO_IONICON["plus"]).toBe("add");
    });

    it("covers the wellness-critical icons used across prototype hero screens", () => {
      expect(LUCIDE_TO_IONICON["sparkles"]).toBe("sparkles-outline");
      expect(LUCIDE_TO_IONICON["shield-check"]).toBe("shield-checkmark-outline");
      expect(LUCIDE_TO_IONICON["moon"]).toBe("moon-outline");
      expect(LUCIDE_TO_IONICON["flame"]).toBe("flame-outline");
      expect(LUCIDE_TO_IONICON["phone"]).toBe("call-outline");
      expect(LUCIDE_TO_IONICON["book-open"]).toBe("book-outline");
    });

    it("never maps to a value that starts with 'lucide-' or any non-Ionicons prefix", () => {
      Object.entries(LUCIDE_TO_IONICON).forEach(([key, value]) => {
        expect(value).not.toMatch(/^lucide-/);
        expect(value).not.toMatch(/^feather-/);
        expect(value.length).toBeGreaterThan(0);
      });
    });
  });

  describe("resolveIconName", () => {
    it("translates known Lucide names", () => {
      expect(resolveIconName("heart")).toBe("heart-outline");
      expect(resolveIconName("pen-line")).toBe("create-outline");
    });

    it("passes Ionicons names through unchanged", () => {
      expect(resolveIconName("chevron-forward")).toBe("chevron-forward");
      expect(resolveIconName("heart-outline")).toBe("heart-outline");
      expect(resolveIconName("locate-outline")).toBe("locate-outline");
    });

    it("passes unknown names through unchanged (consumer responsibility)", () => {
      expect(resolveIconName("totally-made-up-icon")).toBe("totally-made-up-icon");
    });
  });
});
