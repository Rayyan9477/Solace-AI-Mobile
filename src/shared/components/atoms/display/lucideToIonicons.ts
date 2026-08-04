/**
 * Lucide → Ionicons icon-name mapping
 *
 * The prototype (`prototypes/`) uses Lucide icon names; our RN codebase renders
 * via `react-native-vector-icons/Ionicons`. This map lets prototype markup port
 * 1:1 without renaming every icon.
 *
 * Keys started as the exact Lucide names scraped from `prototypes/screens/*.js`
 * and `prototypes/lib/helpers.js`, and now also cover the Lucide names the app
 * itself introduced (93 unique names).
 *
 * Unknown names pass through unchanged via `resolveIconName()` — consumers can
 * still pass native Ionicons names directly. That passthrough is why a typo or
 * an unmapped Lucide name fails silently as a blank "missing glyph" box rather
 * than throwing, so `lucideToIonicons.test.ts` sweeps every icon name written
 * under `src/` and fails when one does not resolve. Add the mapping here rather
 * than renaming the call site, and where Ionicons has no true equivalent pick
 * the closest glyph and say so in a comment (see `wind`).
 */

export const LUCIDE_TO_IONICON: Readonly<Record<string, string>> = {
  // Logos + brand
  apple: "logo-apple",

  // Navigation + arrows
  "arrow-left": "arrow-back",
  "arrow-right": "arrow-forward",
  "arrow-up": "arrow-up",
  "chevron-down": "chevron-down",
  "chevron-left": "chevron-back",
  "chevron-right": "chevron-forward",

  // System / status
  "battery-full": "battery-full-outline",
  signal: "cellular-outline",
  wifi: "wifi",
  "wifi-off": "cloud-offline-outline", // Ionicons has no wifi-off; nearest-meaning fallback
  cloud: "cloud-outline",
  moon: "moon-outline",
  sun: "sunny-outline",

  // App chrome + common actions
  bell: "notifications-outline",
  "credit-card": "card-outline",
  "trash-2": "trash-outline",
  search: "search-outline",
  "settings-2": "settings-outline",
  "more-horizontal": "ellipsis-horizontal",
  "more-vertical": "ellipsis-vertical",
  x: "close",
  check: "checkmark",
  "check-circle": "checkmark-circle-outline",
  plus: "add",
  "log-out": "log-out-outline",
  "help-circle": "help-circle-outline",
  lock: "lock-closed-outline",
  "eye-off": "eye-off-outline",
  "refresh-cw": "refresh",
  "rotate-ccw": "reload",
  // approximation — Ionicons has no directional "rotate" glyph. Paired with
  // `rotate-ccw → reload` so the skip-back / skip-forward transport buttons read
  // as mirrored circular arrows instead of clashing with `skip-forward`.
  "rotate-cw": "refresh",
  download: "download-outline",
  "share-2": "share-outline",
  gift: "gift-outline",
  globe: "globe-outline",
  target: "locate-outline",

  // Media playback
  play: "play",
  pause: "pause",
  "skip-back": "play-back",
  "skip-forward": "play-forward",
  shuffle: "shuffle",
  repeat: "repeat",
  "volume-2": "volume-high-outline",
  gauge: "speedometer-outline", // playback-speed control

  // Communication
  mail: "mail-outline",
  phone: "call-outline",
  "message-square": "chatbubble-outline",
  message: "chatbubble-outline",
  mic: "mic-outline",
  camera: "camera-outline",

  // Content authoring
  "edit-3": "create-outline",
  "pen-line": "create-outline",
  "file-text": "document-text-outline",
  "book-open": "book-outline",
  list: "list-outline",
  image: "image-outline",
  bold: "text-outline", // no direct Ionicons — text-outline is the softest fallback
  italic: "text-outline", // same
  quote: "chatbox-ellipses-outline",

  // Time / calendar
  calendar: "calendar-outline",
  "calendar-days": "calendar-number-outline",
  clock: "time-outline",

  // Feedback / reactions
  heart: "heart-outline",
  flame: "flame-outline",
  star: "star",
  "thumbs-up": "thumbs-up-outline",
  "thumbs-down": "thumbs-down-outline",
  "trending-up": "trending-up",

  // Mindful / wellness
  sparkle: "sparkles-outline",
  sparkles: "sparkles-outline",
  lightbulb: "bulb-outline",
  brain: "bulb-outline", // approximation
  wind: "leaf-outline", // approximation — Ionicons has no wind glyph
  feather: "leaf-outline", // approximation — Ionicons has no feather glyph
  zap: "flash-outline",
  lotus: "flower-outline", // approximation — Ionicons has no lotus glyph
  "circle-dot": "radio-button-on-outline",

  // Navigation (home / profile)
  home: "home-outline",

  // Profile / people
  user: "person-outline",
  "user-round": "person-outline",
  users: "people-outline",

  // Security
  "shield-check": "shield-checkmark-outline",
  "scan-face": "scan-outline",
  shield: "shield-outline",

  // Input helpers
  keyboard: "keypad-outline",

  // Soundscapes / nature
  "cloud-rain": "rainy-outline",
  waves: "water-outline",
  trees: "leaf-outline", // approximation — Ionicons has no trees glyph
  radio: "radio-outline",

  // Help / support
  "life-buoy": "help-buoy-outline",
  "message-circle": "chatbubble-ellipses-outline",
  briefcase: "briefcase-outline",
};

/**
 * Resolve any icon name (Lucide-style or Ionicons-native) to an Ionicons name.
 *
 * - If `name` is a known Lucide name, returns the mapped Ionicons name.
 * - Otherwise, returns `name` unchanged (consumer is using Ionicons directly).
 *
 * @example
 *   resolveIconName('heart')           // → 'heart-outline'       (Lucide)
 *   resolveIconName('heart-outline')   // → 'heart-outline'       (passthrough)
 *   resolveIconName('chevron-forward') // → 'chevron-forward'     (passthrough Ionicons)
 */
export function resolveIconName(name: string): string {
  return LUCIDE_TO_IONICON[name] ?? name;
}
