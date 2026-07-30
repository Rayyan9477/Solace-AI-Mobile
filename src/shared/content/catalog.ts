/**
 * Bundled content catalogue.
 *
 * @description The canonical list of non-user content the app ships with:
 *   guided practices and soundscapes. Every entry here is reachable — each maps
 *   to a route that exists — which is what makes it safe to return from search.
 *
 *   This module exists because the same content was previously declared three
 *   times (`DEFAULT_SESSIONS` in MindfulnessLibraryScreen, `SOUNDSCAPES` in
 *   SoundscapesScreen, `DEFAULT_ARTICLES` on Home) with no shared source, so
 *   the copies were free to drift apart. Search reads from here.
 *
 *   **Articles are deliberately absent.** The app bundles no article content —
 *   the home "article" carousel is a practice carousel whose press handler is a
 *   no-op. A real article library is Phase 2 work; when it lands it belongs
 *   here, and search will pick it up without further change.
 *
 * @module shared/content
 */

import type { IconTileHue } from "../components/primitives";

/** What kind of surface a practice opens. Drives result navigation. */
export type PracticeKind = "session" | "soundscape";

/** A single piece of bundled, playable content. */
export interface CatalogPractice {
  /** Stable id. Matches the id the destination screen expects. */
  readonly id: string;
  readonly title: string;
  /** One-line description, shown as the search-result caption. */
  readonly caption: string;
  readonly iconName: string;
  readonly hue: IconTileHue;
  readonly kind: PracticeKind;
  /** Runtime in minutes, or null for a continuous soundscape. */
  readonly durationMinutes: number | null;
  /** Bracket label shown by the player, e.g. "MEDITATION". */
  readonly category: string;
  /**
   * Extra search terms that do not appear in the title or caption — what a
   * user might plausibly type when looking for this ("panic" → 4-7-8 breath).
   */
  readonly keywords: readonly string[];
}

/**
 * Guided sessions from the mindfulness library. Ids match `DEFAULT_SESSIONS`
 * in `MindfulnessLibraryScreen`, which is what `MindfulPlayer` routes on.
 */
const SESSIONS: readonly CatalogPractice[] = [
  {
    // The library's featured card. It offered this session before the
    // catalogue existed but appeared in no session list, so opening it routed
    // to an id nothing could resolve — the drift `catalog.test.ts` now guards.
    id: "monday-reset",
    durationMinutes: 10,
    category: "MEDITATION",
    title: "Monday reset",
    caption: "10 min guided meditation",
    iconName: "sun",
    hue: "aurora",
    kind: "session",
    keywords: ["meditation", "week", "start", "focus", "intention"],
  },
  {
    id: "breath-478",
    durationMinutes: 4,
    category: "BREATHING",
    title: "4-7-8 breath",
    caption: "4 min breathing exercise",
    iconName: "wind",
    hue: "sage",
    kind: "session",
    keywords: ["breathing", "anxiety", "panic", "calm", "relax"],
  },
  {
    id: "body-scan",
    durationMinutes: 10,
    category: "MEDITATION",
    title: "Body scan",
    caption: "10 min guided meditation",
    iconName: "user-round",
    hue: "lavender",
    kind: "session",
    keywords: ["meditation", "tension", "relax", "grounding"],
  },
  {
    id: "loving-kindness",
    durationMinutes: 12,
    category: "MEDITATION",
    title: "Loving kindness",
    caption: "12 min guided meditation",
    iconName: "heart",
    hue: "peach",
    kind: "session",
    keywords: ["meditation", "compassion", "metta", "self-esteem"],
  },
  {
    id: "noting",
    durationMinutes: 15,
    category: "MEDITATION",
    title: "Noting practice",
    caption: "15 min guided meditation",
    iconName: "feather",
    hue: "aurora",
    kind: "session",
    keywords: ["meditation", "mindfulness", "focus", "awareness"],
  },
  {
    id: "wind-down",
    durationMinutes: 20,
    category: "SLEEP",
    title: "Sleep wind-down",
    caption: "20 min before bed",
    iconName: "moon",
    hue: "lavender",
    kind: "session",
    keywords: ["sleep", "insomnia", "bedtime", "rest", "night"],
  },
  {
    id: "quick-reset",
    durationMinutes: 2,
    category: "RESET",
    title: "Quick reset",
    caption: "2 min reset",
    iconName: "zap",
    hue: "peach",
    kind: "session",
    keywords: ["short", "stress", "break", "fast"],
  },
];

/**
 * Ambient soundscapes. Ids match `SOUNDSCAPES` in `SoundscapesScreen`.
 */
const SOUNDSCAPES: readonly CatalogPractice[] = [
  {
    id: "rain",
    durationMinutes: null,
    category: "SOUNDSCAPE",
    title: "Gentle rain",
    caption: "Soundscape · continuous",
    iconName: "cloud-rain",
    hue: "lavender",
    kind: "soundscape",
    keywords: ["rain", "storm", "water", "ambient", "sleep"],
  },
  {
    id: "ocean",
    durationMinutes: null,
    category: "SOUNDSCAPE",
    title: "Ocean waves",
    caption: "Soundscape · continuous",
    iconName: "waves",
    hue: "sage",
    kind: "soundscape",
    keywords: ["sea", "beach", "water", "ambient"],
  },
  {
    id: "forest",
    durationMinutes: 60,
    category: "SOUNDSCAPE",
    title: "Forest night",
    caption: "Soundscape · 60 min",
    iconName: "trees",
    hue: "sage",
    kind: "soundscape",
    keywords: ["nature", "woods", "crickets", "ambient"],
  },
  {
    id: "white-noise",
    durationMinutes: null,
    category: "SOUNDSCAPE",
    title: "White noise",
    caption: "Soundscape · continuous",
    iconName: "radio",
    hue: "peach",
    kind: "soundscape",
    keywords: ["static", "focus", "concentration", "ambient"],
  },
  {
    id: "fire",
    durationMinutes: 45,
    category: "SOUNDSCAPE",
    title: "Crackling fire",
    caption: "Soundscape · 45 min",
    iconName: "flame",
    hue: "peach",
    kind: "soundscape",
    keywords: ["fireplace", "warm", "cosy", "ambient"],
  },
  {
    id: "bowl",
    durationMinutes: 20,
    category: "SOUNDSCAPE",
    title: "Tibetan bowl",
    caption: "Soundscape · 20 min",
    iconName: "circle-dot",
    hue: "lavender",
    kind: "soundscape",
    keywords: ["singing bowl", "chime", "meditation", "ambient"],
  },
];

/** Every bundled practice, sessions first. */
export const PRACTICE_CATALOG: readonly CatalogPractice[] = [
  ...SESSIONS,
  ...SOUNDSCAPES,
];

/** Look up a bundled practice by id. */
export function findPractice(id: string): CatalogPractice | undefined {
  return PRACTICE_CATALOG.find((p) => p.id === id);
}
