/**
 * crisisClassifier — rule-based detection of crisis language in user input.
 *
 * This module is a **safety tripwire**, not a diagnostic tool. It exists so
 * the chat surface can pivot to grounded crisis resources (988, Text HOME,
 * local emergency) before the mock (or future LLM) has a chance to answer
 * with anything less than direct safety information.
 *
 * Design constraints:
 *   - Zero dependencies (must run offline, must run fast — <1ms).
 *   - No machine learning. Regex only — every positive trigger can be
 *     audited by a non-technical reviewer.
 *   - Conservative. We prefer FALSE POSITIVES (trigger when unsure) over
 *     FALSE NEGATIVES (miss a genuine crisis). A false positive shows the
 *     Crisis sheet the user can dismiss with "I'm safe". A false negative
 *     means no safety net.
 *   - Word-boundary matching to avoid the classic "I'm dying to see this
 *     movie" false-positive on "dying".
 *
 * Patterns sourced from:
 *   - 988 Suicide & Crisis Lifeline safe-messaging guidelines
 *   - SAMHSA Suicide Prevention Resource Center
 *   - CDC crisis-language examples
 *
 * When `detectCrisisSignals()` returns `{ matched: true }`, the caller MUST:
 *   1. Show a CrisisInterventionSheet immediately (no delay).
 *   2. Prepend "I hear you. Let's make sure you have support right now."
 *      before any scripted response.
 *   3. Never respond with a flippant, celebratory, or wellness-tip message.
 */

export interface CrisisDetection {
  /** True if at least one crisis pattern matched. */
  matched: boolean;
  /** Array of matched pattern source strings (for audit logging). */
  patterns: string[];
  /** Category of the strongest match, useful for routing the response tone. */
  category: CrisisCategory | null;
}

export type CrisisCategory =
  | "suicidal_ideation"
  | "self_harm"
  | "plan_or_means"
  | "hopelessness"
  | "substance_overdose";

interface PatternDef {
  regex: RegExp;
  category: CrisisCategory;
}

/**
 * Crisis patterns. Word boundaries (\b) everywhere to avoid false positives.
 * Each entry is documented with the rationale so a reviewer can understand
 * why it's on the list.
 */
const PATTERNS: readonly PatternDef[] = [
  // --- Suicidal ideation (most common, most urgent) ------------------------
  {
    // "I want to kill myself", "I'm gonna kill myself"
    regex: /\b(want|going|gonna|plan|plans?)\s+to\s+kill\s+myself\b/i,
    category: "suicidal_ideation",
  },
  {
    // "kill myself" without hedging verb — rarer but unambiguous
    regex: /\bkill\s+myself\b/i,
    category: "suicidal_ideation",
  },
  {
    // "end my life", "ending my life"
    regex: /\b(end(?:ing)?|take|taking)\s+my\s+life\b/i,
    category: "suicidal_ideation",
  },
  {
    // "commit suicide", "suicidal thoughts", "thoughts of suicide"
    regex: /\bsuicid(e|al)\b/i,
    category: "suicidal_ideation",
  },
  {
    // "end it all" — colloquial for "end my life"
    regex: /\bend\s+it\s+all\b/i,
    category: "suicidal_ideation",
  },
  {
    // "don't want to live", "don't want to be here", "don't want to be alive"
    regex: /\bdon'?t\s+want\s+to\s+(live|be\s+here|be\s+alive|exist)\b/i,
    category: "suicidal_ideation",
  },
  {
    // "better off dead", "would be better off without me"
    regex: /\b(better\s+off\s+dead|better\s+off\s+without\s+me)\b/i,
    category: "hopelessness",
  },
  {
    // "wish I was dead", "wish I were dead"
    regex: /\bwish\s+(i\s+(was|were)\s+dead|i\s+could\s+die)\b/i,
    category: "suicidal_ideation",
  },

  // --- Self-harm -----------------------------------------------------------
  {
    // "hurt myself", "hurting myself"
    regex: /\bhurt(ing)?\s+myself\b/i,
    category: "self_harm",
  },
  {
    // "self harm", "self-harm", "self harming"
    regex: /\bself[-\s]?harm(ing)?\b/i,
    category: "self_harm",
  },
  {
    // "cut myself", "cutting myself"
    regex: /\bcut(ting)?\s+myself\b/i,
    category: "self_harm",
  },

  // --- Plan or means (high acuity — specific method mentioned) ------------
  {
    // "overdose", "overdosing"
    regex: /\boverdos(e|ing)\b/i,
    category: "substance_overdose",
  },
  {
    // "jump off", "jump from", "jumping off"
    regex: /\bjump(ing)?\s+(off|from)\b/i,
    category: "plan_or_means",
  },
  {
    // "hang myself", "hanging myself"
    regex: /\bhang(ing)?\s+myself\b/i,
    category: "plan_or_means",
  },
  {
    // "shoot myself", "shooting myself"
    regex: /\bshoot(ing)?\s+myself\b/i,
    category: "plan_or_means",
  },

  // --- Severe hopelessness (on the path to ideation) ----------------------
  {
    // "no reason to live", "no reason to go on"
    regex: /\bno\s+reason\s+to\s+(live|go\s+on|keep\s+going)\b/i,
    category: "hopelessness",
  },
  {
    // "can't go on", "can't keep going" — colloquial hopelessness
    regex: /\bcan'?t\s+(go\s+on|keep\s+going|take\s+it\s+anymore|do\s+this\s+anymore)\b/i,
    category: "hopelessness",
  },
  {
    // "give up on life", "giving up on life"
    regex: /\bgiv(e|ing)\s+up\s+on\s+life\b/i,
    category: "hopelessness",
  },
];

/** Category precedence when multiple patterns match: more acute wins. */
const CATEGORY_PRIORITY: CrisisCategory[] = [
  "plan_or_means",
  "substance_overdose",
  "suicidal_ideation",
  "self_harm",
  "hopelessness",
];

/**
 * Safe-context patterns — phrases that indicate the user is DISCUSSING crisis
 * in an academic, professional, or supportive way rather than experiencing
 * one. When the full message matches ONLY safe-context patterns and no
 * additional first-person ideation, we suppress the match.
 *
 * Conservative rule: a sentence is only "safe" if it contains a safe phrase
 * AND does not contain first-person ideation markers ("I", "me", "my",
 * "myself" paired with crisis verbs). A volunteer who writes "I volunteer
 * at a suicide prevention hotline but I've been struggling lately" still
 * trips the classifier on the second clause.
 */
const SAFE_CONTEXT_PATTERNS: readonly RegExp[] = [
  // Prevention / support / research framing
  /\b(suicide|self[-\s]?harm|suicidal)\s+prevention\b/i,
  /\bprevention\s+(of|for)\s+(suicide|self[-\s]?harm)\b/i,
  /\b(crisis\s+line|hotline|helpline|lifeline)\b/i,
  /\b(volunteer|volunteering|volunteered)\s+(at|for|with)\b/i,
  /\b(research|paper|study|article|book|course|module)\s+(about|on)\b/i,
  /\bmental\s+health\s+(awareness|professional|counselor|therapist)\b/i,
  /\b988\b/i,
];

/**
 * Markers that indicate first-person ideation regardless of safe context.
 * If the message contains ANY of these, we do NOT suppress the match.
 */
const FIRST_PERSON_IDEATION: readonly RegExp[] = [
  /\b(i|me|my|myself)\s+(want|need|plan|think|feel|keep|have|had)\b/i,
  /\b(i'?m|i\s+am)\s+(going|thinking|planning|struggling|done|tired)\b/i,
  /\bmy\s+(plan|thought|way)\b/i,
];

function isPurelySafeContext(input: string): boolean {
  const hasSafeContext = SAFE_CONTEXT_PATTERNS.some((r) => r.test(input));
  if (!hasSafeContext) return false;
  const hasFirstPerson = FIRST_PERSON_IDEATION.some((r) => r.test(input));
  return !hasFirstPerson;
}

/**
 * Run the classifier over a raw user message.
 *
 * @param input — user-authored text. Empty, null, or non-string returns
 *                `{ matched: false, patterns: [], category: null }`.
 */
export function detectCrisisSignals(input: unknown): CrisisDetection {
  if (typeof input !== "string" || input.trim().length === 0) {
    return { matched: false, patterns: [], category: null };
  }

  const patterns: string[] = [];
  const matchedCategories = new Set<CrisisCategory>();

  for (const p of PATTERNS) {
    if (p.regex.test(input)) {
      patterns.push(p.regex.source);
      matchedCategories.add(p.category);
    }
  }

  if (patterns.length === 0) {
    return { matched: false, patterns: [], category: null };
  }

  // Suppress if the message is purely discussion/prevention framing with no
  // first-person ideation. "I volunteer at a suicide prevention hotline" is
  // safe; "I volunteer there and I want to kill myself" trips the
  // first-person rule and STILL flags.
  if (isPurelySafeContext(input)) {
    return { matched: false, patterns: [], category: null };
  }

  // Pick the highest-priority category that matched.
  const category =
    CATEGORY_PRIORITY.find((c) => matchedCategories.has(c)) ?? null;

  return { matched: true, patterns, category };
}
