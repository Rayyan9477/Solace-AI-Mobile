/**
 * Catalogue integrity tests.
 *
 * The bundled content was declared in three places with no shared source, and
 * the copies had already drifted: the mindfulness library's featured card
 * offered a "Monday reset" session that appears in no session list, so opening
 * it routed to a `sessionId` nothing could resolve.
 *
 * These tests pin the catalogue as the single source of truth for anything the
 * app can navigate to.
 */

import Ionicons from "@expo/vector-icons/Ionicons";

import { resolveIconName } from "../components/atoms/display/lucideToIonicons";
import {
  DEFAULT_FEATURED,
  DEFAULT_SESSIONS,
} from "../../features/mindful/screens/MindfulnessLibraryScreen";
import { DEFAULT_SOUNDS } from "../../features/mindful/screens/SoundscapesScreen";
import { PRACTICE_CATALOG, findPractice } from "./catalog";

describe("catalogue integrity", () => {
  it("resolves every session the mindfulness library can open", () => {
    DEFAULT_SESSIONS.forEach((session) => {
      expect(findPractice(session.id)).toBeDefined();
    });
  });

  it("resolves the featured session", () => {
    expect(findPractice(DEFAULT_FEATURED.id)).toBeDefined();
  });

  it("agrees with the library on every session title", () => {
    DEFAULT_SESSIONS.forEach((session) => {
      expect(findPractice(session.id)?.title).toBe(session.title);
    });
  });

  it("agrees with the library on every session duration", () => {
    DEFAULT_SESSIONS.forEach((session) => {
      expect(findPractice(session.id)?.durationMinutes).toBe(
        session.durationMinutes,
      );
    });
  });

  it("resolves every soundscape the browser can play", () => {
    DEFAULT_SOUNDS.forEach((sound) => {
      expect(findPractice(sound.id)?.title).toBe(sound.title);
    });
  });

  it("has no duplicate ids", () => {
    const ids = PRACTICE_CATALOG.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  // Unmapped Lucide names pass straight through to Ionicons and render as a
  // missing glyph. That bug class has already recurred twice in this repo, so
  // the catalogue checks its own icons rather than relying on review.
  it("uses only icon names that resolve to a real glyph", () => {
    PRACTICE_CATALOG.forEach((p) => {
      const resolved = resolveIconName(p.iconName);
      expect(Object.keys(Ionicons.glyphMap)).toContain(resolved);
    });
  });

  it("gives every entry searchable text", () => {
    PRACTICE_CATALOG.forEach((p) => {
      expect(p.title.length).toBeGreaterThan(0);
      expect(p.caption.length).toBeGreaterThan(0);
      expect(p.keywords.length).toBeGreaterThan(0);
    });
  });
});
