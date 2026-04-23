/**
 * Lucide → Ionicons icon-name mapping
 *
 * The prototype (`prototypes/`) uses Lucide icon names; our RN codebase renders
 * via `react-native-vector-icons/Ionicons`. This map lets prototype markup port
 * 1:1 without renaming every icon.
 *
 * Keys are the exact Lucide names scraped from `prototypes/screens/*.js` and
 * `prototypes/lib/helpers.js` (70 unique names as of prototype v4.2).
 *
 * Unknown names pass through unchanged via `resolveIconName()` — consumers can
 * still pass native Ionicons names directly.
 */

export const LUCIDE_TO_IONICON: Readonly<Record<string, string>> = {
  // Logos + brand
  apple: "logo-apple",

  // Navigation + arrows
  "arrow-left": "arrow-back",
  "arrow-right": "arrow-forward",
  "arrow-up": "arrow-up",
  "chevron-down": "chevron-down",
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
  search: "search-outline",
  "settings-2": "settings-outline",
  "more-horizontal": "ellipsis-horizontal",
  x: "close",
  check: "checkmark",
  plus: "add",
  "log-out": "log-out-outline",
  "help-circle": "help-circle-outline",
  lock: "lock-closed-outline",
  "eye-off": "eye-off-outline",
  "refresh-cw": "refresh",
  "rotate-ccw": "reload",
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

  // Communication
  mail: "mail-outline",
  phone: "call-outline",
  "message-square": "chatbubble-outline",
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

  // Navigation (home / profile)
  home: "home-outline",

  // Security
  "shield-check": "shield-checkmark-outline",
  "scan-face": "scan-outline",

  // Input helpers
  keyboard: "keypad-outline",
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
