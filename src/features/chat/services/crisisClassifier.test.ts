import { detectCrisisSignals } from "./crisisClassifier";

describe("crisisClassifier", () => {
  describe("POSITIVE — must flag (12+ real crisis phrases)", () => {
    const positives: ReadonlyArray<[string, string]> = [
      ["I want to kill myself", "kill myself"],
      ["I'm going to end my life", "end my life"],
      ["I've been having suicidal thoughts all week", "suicidal"],
      ["thinking about suicide again", "suicide"],
      ["I just want to end it all", "end it all"],
      ["I don't want to live anymore", "don't want to live"],
      ["honestly I'd be better off dead", "better off dead"],
      ["I wish I were dead", "wish I were dead"],
      ["I've been hurting myself again", "hurt myself"],
      ["I keep cutting myself when things get bad", "cut myself"],
      ["I took an overdose last night", "overdose"],
      ["I can't go on like this", "can't go on"],
      ["there's no reason to live anymore", "no reason to live"],
      ["I've been thinking about hanging myself", "hang myself"],
      ["I'm giving up on life", "giving up on life"],
    ];

    it.each(positives)("detects %p", (input) => {
      const result = detectCrisisSignals(input);
      expect(result.matched).toBe(true);
      expect(result.category).not.toBeNull();
      expect(result.patterns.length).toBeGreaterThan(0);
    });
  });

  describe("NEGATIVE — must NOT flag (12+ adjacent-but-safe phrases)", () => {
    const negatives: readonly string[] = [
      // Idiomatic uses of "dying"
      "I'm dying to see this movie",
      "I'm dying of laughter",
      // Past-tense / third-person
      "My grandfather died last year, I miss him",
      "A character in the book ended their life — tough read",
      // Discussing the topic academically / supportively
      "I volunteer at a suicide prevention hotline",
      "We're reading a paper about self-harm prevention",
      // Gaming / casual
      "I keep killing myself in this boss fight",
      "I'm going to kill this workout today",
      // Hopeful / recovering
      "I used to think about it but therapy has been helping",
      "I finally feel reasons to live again",
      // Ordinary venting (should NOT flag)
      "I hate my job sometimes",
      "Today was rough but I'll get through it",
      "I feel overwhelmed",
      "I'm so tired of everything",
    ];

    it.each(negatives)("does NOT flag %p", (input) => {
      const result = detectCrisisSignals(input);
      expect(result.matched).toBe(false);
      expect(result.category).toBeNull();
      expect(result.patterns).toEqual([]);
    });
  });

  describe("category priority", () => {
    it("prefers plan_or_means over ideation when both present", () => {
      const result = detectCrisisSignals(
        "I've been thinking about hanging myself and I'm suicidal",
      );
      expect(result.matched).toBe(true);
      expect(result.category).toBe("plan_or_means");
    });

    it("returns substance_overdose when only that matches", () => {
      const result = detectCrisisSignals("I took an overdose");
      expect(result.matched).toBe(true);
      expect(result.category).toBe("substance_overdose");
    });

    it("returns hopelessness for 'better off dead' + 'can't go on' only", () => {
      const result = detectCrisisSignals("I'd be better off dead, I can't go on");
      expect(result.matched).toBe(true);
      expect(result.category).toBe("hopelessness");
    });
  });

  describe("input guards", () => {
    it("returns a safe default for empty string", () => {
      expect(detectCrisisSignals("")).toEqual({
        matched: false,
        patterns: [],
        category: null,
      });
    });

    it("returns a safe default for whitespace-only input", () => {
      expect(detectCrisisSignals("   \n\t  ")).toEqual({
        matched: false,
        patterns: [],
        category: null,
      });
    });

    it("returns a safe default for null / undefined / non-string", () => {
      expect(detectCrisisSignals(null).matched).toBe(false);
      expect(detectCrisisSignals(undefined).matched).toBe(false);
      expect(detectCrisisSignals(42).matched).toBe(false);
      expect(detectCrisisSignals({}).matched).toBe(false);
    });
  });

  describe("performance", () => {
    it("runs in well under 5ms even on a 2 KB input", () => {
      const input =
        "I just had a long day at work ".repeat(70) +
        " and honestly I'd be better off dead";
      const start = performance.now();
      const result = detectCrisisSignals(input);
      const elapsed = performance.now() - start;
      expect(result.matched).toBe(true);
      expect(elapsed).toBeLessThan(5);
    });
  });
});
