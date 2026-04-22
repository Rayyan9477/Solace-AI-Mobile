// =============================================================================
// Solace AI — Custom Inline SVG Illustrations
// Dark-theme, flat/minimal line-art with subtle gradients.
// All colours reference CSS custom-property channel variables so they respond
// to every theme preset defined in themes.js.
//
// Usage:
//   import { illustrationBreath } from './lib/illustrations.js';
//   element.innerHTML = illustrationBreath;
//
// Design language: editorial minimalism — think Linear error states, Arc empty
// states. Every piece reads cleanly at 120-180 px in a phone frame.
// =============================================================================


// -----------------------------------------------------------------------------
// 1. BREATH — Welcome / Splash
//
// Intent: A central orb surrounded by concentric sound-wave arcs that expand
// outward like an exhale. The inner orb pulses with a radial gradient built
// from sage + aurora channels. Arcs fade as they move outward, suggesting
// infinite, calm expansion. The overall feeling is "you are here, breathe."
// -----------------------------------------------------------------------------
export const illustrationBreath = `<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 220 220"
  fill="none"
  aria-hidden="true"
>
  <defs>
    <!-- Soft glow filter applied to the inner orb -->
    <filter id="breath-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- Orb fill: sage center bleeding into aurora -->
    <radialGradient id="breath-orb-fill" cx="38%" cy="35%" r="65%">
      <stop offset="0%"   stop-color="rgba(var(--ch-sage),0.95)"/>
      <stop offset="55%"  stop-color="rgba(var(--ch-aurora),0.55)"/>
      <stop offset="100%" stop-color="rgba(var(--ch-aurora),0.0)"/>
    </radialGradient>

    <!-- Outer ambient halo -->
    <radialGradient id="breath-halo" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stop-color="rgba(var(--ch-sage),0.18)"/>
      <stop offset="100%" stop-color="rgba(var(--ch-sage),0.0)"/>
    </radialGradient>
  </defs>

  <!-- Ambient background halo — ties the illustration into the screen's own glow -->
  <circle cx="110" cy="110" r="105" fill="url(#breath-halo)"/>

  <!-- Sound-wave arcs: each ring is an arc pair (top + bottom) that together
       form an incomplete oval, deliberately broken at the sides to feel like
       waves rather than containers. Opacity decreases outward. -->

  <!-- Wave 1 — outermost, most transparent -->
  <path d="M 40 110 A 70 70 0 0 1 180 110" stroke="rgba(var(--ch-sage),0.10)" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M 40 110 A 70 70 0 0 0 180 110" stroke="rgba(var(--ch-sage),0.08)" stroke-width="1.5" stroke-linecap="round"/>

  <!-- Wave 2 -->
  <path d="M 52 110 A 58 58 0 0 1 168 110" stroke="rgba(var(--ch-sage),0.16)" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M 52 110 A 58 58 0 0 0 168 110" stroke="rgba(var(--ch-sage),0.13)" stroke-width="1.5" stroke-linecap="round"/>

  <!-- Wave 3 -->
  <path d="M 64 110 A 46 46 0 0 1 156 110" stroke="rgba(var(--ch-sage),0.25)" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M 64 110 A 46 46 0 0 0 156 110" stroke="rgba(var(--ch-sage),0.20)" stroke-width="1.5" stroke-linecap="round"/>

  <!-- Wave 4 — innermost arc ring, transitions to aurora -->
  <path d="M 76 110 A 34 34 0 0 1 144 110" stroke="rgba(var(--ch-aurora),0.35)" stroke-width="2" stroke-linecap="round"/>
  <path d="M 76 110 A 34 34 0 0 0 144 110" stroke="rgba(var(--ch-aurora),0.28)" stroke-width="2" stroke-linecap="round"/>

  <!-- Centre orb — the calm "you" -->
  <circle cx="110" cy="110" r="22" fill="url(#breath-orb-fill)" filter="url(#breath-glow)"/>

  <!-- Inner highlight: off-centre specular dot for a soft 3-D feel -->
  <circle cx="103" cy="103" r="6" fill="rgba(var(--ch-warm),0.30)"/>

  <!-- Four cardinal tick marks — compass-like, anchoring the orb -->
  <line x1="110" y1="82"  x2="110" y2="74"  stroke="rgba(var(--ch-sage),0.35)" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="110" y1="138" x2="110" y2="146" stroke="rgba(var(--ch-sage),0.35)" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="82"  y1="110" x2="74"  y2="110" stroke="rgba(var(--ch-sage),0.35)" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="138" y1="110" x2="146" y2="110" stroke="rgba(var(--ch-sage),0.35)" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;


// -----------------------------------------------------------------------------
// 2. GROWTH — Assessment Results
//
// Intent: A cupped hand holds a small sprouting plant. The hand is rendered as
// a minimal, slightly abstract path — two fingers + palm implied rather than
// literally drawn. The sprout has two leaves emerging from a single stem. A
// warm peach glow rises from behind the hand; sage gradient climbs the leaves.
// Reading: "something in you is beginning to grow."
// -----------------------------------------------------------------------------
export const illustrationGrowth = `<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 220 230"
  fill="none"
  aria-hidden="true"
>
  <defs>
    <filter id="growth-glow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- Warm uplift gradient for the hand's background halo -->
    <radialGradient id="growth-halo" cx="50%" cy="75%" r="55%">
      <stop offset="0%"   stop-color="rgba(var(--ch-peach),0.28)"/>
      <stop offset="100%" stop-color="rgba(var(--ch-peach),0.0)"/>
    </radialGradient>

    <!-- Leaf gradient: roots in peach warmth, tips in sage -->
    <linearGradient id="leaf-grad-left" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="rgba(var(--ch-sage),0.5)"/>
      <stop offset="100%" stop-color="rgba(var(--ch-sage),0.9)"/>
    </linearGradient>
    <linearGradient id="leaf-grad-right" x1="100%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%"   stop-color="rgba(var(--ch-sage),0.5)"/>
      <stop offset="100%" stop-color="rgba(var(--ch-sage),0.85)"/>
    </linearGradient>
  </defs>

  <!-- Ambient halo behind the scene -->
  <ellipse cx="110" cy="165" rx="78" ry="50" fill="url(#growth-halo)" filter="url(#growth-glow)"/>

  <!-- Hand — a simplified cupped palm.
       The shape reads as a gentle open hand from a front-low angle.
       Drawn as a single closed path: base of palm → right side → finger
       tips rounded → back down on left. Deliberately abstract, not anatomical. -->
  <path
    d="
      M 68 180
      C 62 174, 58 164, 60 154
      C 62 144, 70 140, 78 142
      L 82 145
      C 80 138, 82 130, 90 129
      C 97 128, 102 133, 102 140
      L 103 145
      C 103 138, 106 131, 114 131
      C 121 131, 125 138, 124 145
      L 125 148
      C 126 141, 131 136, 138 138
      C 144 140, 147 148, 145 156
      L 142 166
      C 150 158, 156 152, 158 158
      C 161 166, 152 178, 144 182
      C 134 187, 120 188, 108 188
      L 82 188
      C 75 188, 70 185, 68 180
      Z
    "
    stroke="rgba(var(--ch-peach),0.70)"
    stroke-width="1.8"
    stroke-linejoin="round"
    fill="rgba(var(--ch-peach),0.07)"
  />

  <!-- Palm crease — single arc suggesting depth -->
  <path d="M 78 170 Q 110 162 142 168" stroke="rgba(var(--ch-peach),0.28)" stroke-width="1.2" stroke-linecap="round" fill="none"/>

  <!-- Stem — thin, organic, slightly curved -->
  <path d="M 110 183 C 110 170, 108 155, 110 128" stroke="rgba(var(--ch-sage),0.75)" stroke-width="2" stroke-linecap="round"/>

  <!-- Left leaf — teardrop shape pointing upper-left -->
  <path
    d="M 110 148 C 100 140, 90 130, 92 118 C 94 108, 106 110, 110 128"
    fill="url(#leaf-grad-left)"
    stroke="rgba(var(--ch-sage),0.6)"
    stroke-width="1.5"
  />
  <!-- Left leaf midrib -->
  <path d="M 110 148 C 104 136, 96 126, 92 118" stroke="rgba(var(--ch-warm),0.18)" stroke-width="1" stroke-linecap="round"/>

  <!-- Right leaf — mirrored, slightly higher to show alternating growth -->
  <path
    d="M 110 140 C 120 130, 132 120, 130 108 C 128 97, 116 100, 110 120"
    fill="url(#leaf-grad-right)"
    stroke="rgba(var(--ch-sage),0.6)"
    stroke-width="1.5"
  />
  <!-- Right leaf midrib -->
  <path d="M 110 140 C 118 128, 127 118, 130 108" stroke="rgba(var(--ch-warm),0.18)" stroke-width="1" stroke-linecap="round"/>

  <!-- Tiny bud at the top of the stem — suggests more to come -->
  <circle cx="110" cy="125" r="3.5" fill="rgba(var(--ch-sage),0.9)" filter="url(#growth-glow)"/>
  <circle cx="110" cy="125" r="1.5" fill="rgba(var(--ch-warm),0.6)"/>

  <!-- Three small earth dots below the hand — anchors the composition -->
  <circle cx="94"  cy="194" r="1.8" fill="rgba(var(--ch-peach),0.30)"/>
  <circle cx="110" cy="197" r="1.8" fill="rgba(var(--ch-peach),0.22)"/>
  <circle cx="126" cy="194" r="1.8" fill="rgba(var(--ch-peach),0.30)"/>
</svg>`;


// -----------------------------------------------------------------------------
// 3. REACH — Crisis Support
//
// Intent: Two hands nearly touching across the centre of the frame — echoing
// Michelangelo's Creation but stripped to bare strokes. The gap between
// fingertips holds a warm peach glow: the most important visual beat. One hand
// comes from the lower-left (the person in crisis), one from the upper-right
// (support). Neither hand is fully rendered — just fingertips and wrist lines,
// emphasising the moment of connection, not the people.
// -----------------------------------------------------------------------------
export const illustrationReach = `<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 220 200"
  fill="none"
  aria-hidden="true"
>
  <defs>
    <filter id="reach-glow" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- The gap glow: warm peach blooming at centre -->
    <radialGradient id="reach-gap-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stop-color="rgba(var(--ch-peach),0.55)"/>
      <stop offset="60%"  stop-color="rgba(var(--ch-peach),0.20)"/>
      <stop offset="100%" stop-color="rgba(var(--ch-peach),0.0)"/>
    </radialGradient>

    <!-- Skin-tone-neutral finger fill: very low opacity warm -->
    <linearGradient id="hand-left-grad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="rgba(var(--ch-peach),0.18)"/>
      <stop offset="100%" stop-color="rgba(var(--ch-peach),0.08)"/>
    </linearGradient>
    <linearGradient id="hand-right-grad" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stop-color="rgba(var(--ch-peach),0.18)"/>
      <stop offset="100%" stop-color="rgba(var(--ch-peach),0.08)"/>
    </linearGradient>
  </defs>

  <!-- Centre gap glow — the emotional epicentre -->
  <ellipse cx="110" cy="100" rx="34" ry="28" fill="url(#reach-gap-glow)" filter="url(#reach-glow)"/>

  <!-- ─── LEFT HAND (lower-left, reaching up-right) ───────────────────────── -->
  <!-- Wrist / forearm — enters from bottom-left corner -->
  <path d="M 20 185 C 40 165, 60 148, 80 132" stroke="rgba(var(--ch-peach),0.45)" stroke-width="1.5" stroke-linecap="round"/>

  <!-- Palm body — simplified oval tilted to the right -->
  <path
    d="M 80 132 C 86 125, 94 120, 100 118
       C 104 117, 108 118, 106 124
       C 104 129, 98 130, 95 134
       C 92 138, 88 140, 84 138
       C 80 136, 78 133, 80 132 Z"
    fill="url(#hand-left-grad)"
    stroke="rgba(var(--ch-peach),0.60)"
    stroke-width="1.8"
    stroke-linejoin="round"
  />

  <!-- Index finger reaching toward centre gap -->
  <path
    d="M 100 118 C 104 112, 108 106, 107 100
       C 106.5 97, 105 96, 103.5 97.5
       C 102 99, 102 103, 101 107
       C 100 111, 100 115, 100 118"
    fill="url(#hand-left-grad)"
    stroke="rgba(var(--ch-peach),0.65)"
    stroke-width="1.8"
    stroke-linejoin="round"
  />

  <!-- Fingertip highlight dot — the reaching point -->
  <circle cx="104.5" cy="97" r="2.8" fill="rgba(var(--ch-peach),0.7)" filter="url(#reach-glow)"/>

  <!-- ─── RIGHT HAND (upper-right, reaching down-left) ────────────────────── -->
  <!-- Wrist / forearm — enters from top-right corner -->
  <path d="M 200 15 C 180 35, 160 55, 140 72" stroke="rgba(var(--ch-peach),0.38)" stroke-width="1.5" stroke-linecap="round"/>

  <!-- Palm body — mirrored, slightly more recessed -->
  <path
    d="M 140 72 C 134 78, 126 82, 120 84
       C 116 85, 112 84, 114 91
       C 116 96, 122 96, 126 93
       C 130 90, 134 87, 138 87
       C 142 87, 144 82, 142 78
       C 140 74, 140 72, 140 72 Z"
    fill="url(#hand-right-grad)"
    stroke="rgba(var(--ch-peach),0.55)"
    stroke-width="1.8"
    stroke-linejoin="round"
  />

  <!-- Index finger reaching toward centre gap -->
  <path
    d="M 120 84 C 116 90, 113 96, 114 102
       C 114.5 105, 116 106, 117.5 104.5
       C 119 103, 119 99, 120 95
       C 121 91, 121 87, 120 84"
    fill="url(#hand-right-grad)"
    stroke="rgba(var(--ch-peach),0.60)"
    stroke-width="1.8"
    stroke-linejoin="round"
  />

  <!-- Fingertip highlight dot — the offering point -->
  <circle cx="116" cy="104" r="2.8" fill="rgba(var(--ch-peach),0.65)" filter="url(#reach-glow)"/>

  <!-- Gap particle — a single ambient mote between the two fingertips -->
  <circle cx="110" cy="100.5" r="1.5" fill="rgba(var(--ch-warm),0.50)"/>
</svg>`;


// -----------------------------------------------------------------------------
// 4. JOURNAL FLIGHT — Empty Journal
//
// Intent: An open book sits at the bottom of the frame. Its left page has
// three handwritten-style lines (slightly wavy strokes). The lines on the
// right page progressively dissolve into small abstract birds/leaves taking
// flight upward — the last "line" is already mid-air. The metaphor: your
// words become something that flies. The gradient climbs from warm page-cream
// at the book to aurora blue at the top where the birds vanish.
// -----------------------------------------------------------------------------
export const illustrationJournalFlight = `<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 220 230"
  fill="none"
  aria-hidden="true"
>
  <defs>
    <filter id="journal-glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- Book page warm gradient -->
    <linearGradient id="page-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="rgba(var(--ch-warm),0.12)"/>
      <stop offset="100%" stop-color="rgba(var(--ch-warm),0.05)"/>
    </linearGradient>

    <!-- Flight path: warm at base, aurora in mid-air, transparent at top -->
    <linearGradient id="flight-grad" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%"   stop-color="rgba(var(--ch-peach),0.80)"/>
      <stop offset="45%"  stop-color="rgba(var(--ch-aurora),0.70)"/>
      <stop offset="100%" stop-color="rgba(var(--ch-aurora),0.0)"/>
    </linearGradient>

    <!-- Ambient book glow -->
    <radialGradient id="book-halo" cx="50%" cy="100%" r="55%">
      <stop offset="0%"   stop-color="rgba(var(--ch-peach),0.22)"/>
      <stop offset="100%" stop-color="rgba(var(--ch-peach),0.0)"/>
    </radialGradient>
  </defs>

  <!-- Subtle upward ambient light from the book -->
  <ellipse cx="110" cy="195" rx="72" ry="38" fill="url(#book-halo)" filter="url(#journal-glow)"/>

  <!-- ─── OPEN BOOK ─────────────────────────────────────────────────────────
       The book is drawn as two trapezoidal pages meeting at a spine.
       Slight perspective: pages angle away from the spine at the bottom. -->

  <!-- Left page -->
  <path
    d="M 42 215 L 50 165 L 108 162 L 108 210 Z"
    fill="url(#page-grad)"
    stroke="rgba(var(--ch-warm),0.28)"
    stroke-width="1.6"
    stroke-linejoin="round"
  />

  <!-- Right page -->
  <path
    d="M 178 215 L 170 165 L 112 162 L 112 210 Z"
    fill="url(#page-grad)"
    stroke="rgba(var(--ch-warm),0.22)"
    stroke-width="1.6"
    stroke-linejoin="round"
  />

  <!-- Spine / binding shadow -->
  <path d="M 108 162 L 108 210 L 112 210 L 112 162 Z" fill="rgba(var(--ch-warm),0.10)"/>
  <line x1="110" y1="160" x2="110" y2="212" stroke="rgba(var(--ch-warm),0.35)" stroke-width="1.5"/>

  <!-- Left page: three handwritten-style wavy lines (words) -->
  <path d="M 58 178 Q 66 176, 74 178 Q 82 180, 90 178 Q 96 176, 100 177"
        stroke="rgba(var(--ch-warm),0.38)" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  <path d="M 58 186 Q 67 184, 76 186 Q 84 188, 92 186 Q 97 185, 101 186"
        stroke="rgba(var(--ch-warm),0.30)" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  <path d="M 58 194 Q 68 192, 76 194 Q 83 196, 90 194"
        stroke="rgba(var(--ch-warm),0.22)" stroke-width="1.5" stroke-linecap="round" fill="none"/>

  <!-- Right page: lines dissolving into birds.
       Line 1 (bottom) — still a line but slightly broken -->
  <path d="M 120 194 Q 128 192, 136 194 Q 142 196, 148 194"
        stroke="rgba(var(--ch-aurora),0.30)" stroke-width="1.5" stroke-linecap="round" fill="none"/>

  <!-- Line 2 — fragmenting into dashes that suggest wing shapes -->
  <path d="M 120 185 Q 124 183, 128 185" stroke="rgba(var(--ch-aurora),0.40)" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  <path d="M 133 183 Q 137 181, 141 183" stroke="rgba(var(--ch-aurora),0.40)" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  <path d="M 146 185 Q 149 183.5, 152 185" stroke="rgba(var(--ch-aurora),0.35)" stroke-width="1.5" stroke-linecap="round" fill="none"/>

  <!-- ─── BIRDS IN FLIGHT ────────────────────────────────────────────────────
       Each "bird" is a simple two-arc shape: like a shallow M — two wings
       meeting at a centre point. They scale down and fade as they ascend. -->

  <!-- Bird 1 — lowest, largest, just lifted off the page -->
  <path d="M 122 174 C 126 168, 132 167, 134 170 C 136 167, 142 168, 144 174"
        stroke="rgba(var(--ch-aurora),0.65)" stroke-width="1.8" stroke-linecap="round" fill="none"/>

  <!-- Bird 2 — mid-altitude, drifting right -->
  <path d="M 130 158 C 133 153, 137 152, 139 155 C 141 152, 145 153, 147 158"
        stroke="rgba(var(--ch-aurora),0.52)" stroke-width="1.7" stroke-linecap="round" fill="none"/>

  <!-- Bird 3 — higher, smaller, drifting left -->
  <path d="M 114 144 C 116 140, 119 139, 121 141 C 123 139, 126 140, 127 144"
        stroke="rgba(var(--ch-aurora),0.42)" stroke-width="1.6" stroke-linecap="round" fill="none"/>

  <!-- Bird 4 — near top, very small -->
  <path d="M 136 128 C 137.5 125, 140 124, 141 126 C 142 124, 144.5 125, 145 128"
        stroke="rgba(var(--ch-aurora),0.30)" stroke-width="1.5" stroke-linecap="round" fill="none"/>

  <!-- Bird 5 — topmost, barely visible, almost gone -->
  <path d="M 118 112 C 119 109.5, 121 109, 122 110.5 C 123 109, 125 109.5, 125 112"
        stroke="rgba(var(--ch-aurora),0.18)" stroke-width="1.4" stroke-linecap="round" fill="none"/>

  <!-- Soft aurora glow behind the ascending birds -->
  <ellipse cx="132" cy="150" rx="28" ry="40" fill="rgba(var(--ch-aurora),0.06)" filter="url(#journal-glow)"/>
</svg>`;


// -----------------------------------------------------------------------------
// 5. COMPASS — 404 Not Found
//
// Intent: A minimal compass rose drawn with just the four cardinal lines and a
// needle. The needle is deliberately off-axis — pointing roughly NE, as if
// spinning, not settled. A dashed outer ring suggests the full compass circle
// without closing it (implying incompleteness / being lost). A subtle aurora
// glow pulses around the needle tip, the "we'll redirect you" warmth.
// -----------------------------------------------------------------------------
export const illustrationCompass = `<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 220 220"
  fill="none"
  aria-hidden="true"
>
  <defs>
    <filter id="compass-glow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- Needle gradient: aurora tip → warm base -->
    <linearGradient id="needle-north-grad" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%"   stop-color="rgba(var(--ch-aurora),0.4)"/>
      <stop offset="100%" stop-color="rgba(var(--ch-aurora),0.95)"/>
    </linearGradient>
    <linearGradient id="needle-south-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stop-color="rgba(var(--ch-warm),0.15)"/>
      <stop offset="100%" stop-color="rgba(var(--ch-warm),0.38)"/>
    </linearGradient>

    <!-- Ambient backdrop -->
    <radialGradient id="compass-halo" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stop-color="rgba(var(--ch-aurora),0.12)"/>
      <stop offset="100%" stop-color="rgba(var(--ch-aurora),0.0)"/>
    </radialGradient>
  </defs>

  <!-- Ambient background halo -->
  <circle cx="110" cy="110" r="98" fill="url(#compass-halo)"/>

  <!-- Outer dashed ring — the compass bezel, deliberately incomplete -->
  <circle cx="110" cy="110" r="88"
          stroke="rgba(var(--ch-aurora),0.18)"
          stroke-width="1.5"
          stroke-dasharray="6 5"
          stroke-linecap="round"/>

  <!-- Inner solid ring — the compass face -->
  <circle cx="110" cy="110" r="66"
          stroke="rgba(var(--ch-aurora),0.25)"
          stroke-width="1.5"/>

  <!-- Cardinal cross-hairs: faint full-width guides -->
  <line x1="110" y1="42"  x2="110" y2="178" stroke="rgba(var(--ch-aurora),0.10)" stroke-width="1"/>
  <line x1="42"  y1="110" x2="178" y2="110" stroke="rgba(var(--ch-aurora),0.10)" stroke-width="1"/>

  <!-- Cardinal tick marks at rim — N S E W -->
  <!-- N -->
  <line x1="110" y1="22"  x2="110" y2="42"  stroke="rgba(var(--ch-aurora),0.55)" stroke-width="2" stroke-linecap="round"/>
  <!-- S -->
  <line x1="110" y1="178" x2="110" y2="198" stroke="rgba(var(--ch-warm),0.25)"   stroke-width="1.5" stroke-linecap="round"/>
  <!-- E -->
  <line x1="178" y1="110" x2="198" y2="110" stroke="rgba(var(--ch-warm),0.25)"   stroke-width="1.5" stroke-linecap="round"/>
  <!-- W -->
  <line x1="22"  y1="110" x2="42"  y2="110" stroke="rgba(var(--ch-warm),0.25)"   stroke-width="1.5" stroke-linecap="round"/>

  <!-- Intercardinal marks: shorter, more faint -->
  <line x1="158" y1="62"  x2="163" y2="57"  stroke="rgba(var(--ch-aurora),0.18)" stroke-width="1.2" stroke-linecap="round"/>
  <line x1="62"  y1="158" x2="57"  y2="163" stroke="rgba(var(--ch-aurora),0.14)" stroke-width="1.2" stroke-linecap="round"/>
  <line x1="62"  y1="62"  x2="57"  y2="57"  stroke="rgba(var(--ch-aurora),0.14)" stroke-width="1.2" stroke-linecap="round"/>
  <line x1="158" y1="158" x2="163" y2="163" stroke="rgba(var(--ch-aurora),0.14)" stroke-width="1.2" stroke-linecap="round"/>

  <!-- ─── NEEDLE — off-axis (~35° from north, suggesting mid-spin) ────────── -->
  <!-- Transform rotates the needle group around the compass centre (110,110) -->
  <g transform="rotate(35, 110, 110)">
    <!-- North half: elongated diamond, aurora-coloured -->
    <path d="M 110 110 L 107 80 L 110 44 L 113 80 Z"
          fill="url(#needle-north-grad)"
          stroke="rgba(var(--ch-aurora),0.50)"
          stroke-width="0.8"/>
    <!-- South half: shorter, warm-muted, counterweight -->
    <path d="M 110 110 L 107 132 L 110 152 L 113 132 Z"
          fill="url(#needle-south-grad)"
          stroke="rgba(var(--ch-warm),0.25)"
          stroke-width="0.8"/>
  </g>

  <!-- Needle tip glow — aurora burst at the north point -->
  <g transform="rotate(35, 110, 110)">
    <circle cx="110" cy="47" r="5" fill="rgba(var(--ch-aurora),0.40)" filter="url(#compass-glow)"/>
    <circle cx="110" cy="47" r="2" fill="rgba(var(--ch-aurora),0.90)"/>
  </g>

  <!-- Pivot jewel at centre -->
  <circle cx="110" cy="110" r="5.5" fill="rgba(var(--ch-aurora),0.18)" stroke="rgba(var(--ch-aurora),0.45)" stroke-width="1.5"/>
  <circle cx="110" cy="110" r="2.5" fill="rgba(var(--ch-aurora),0.75)"/>

  <!-- Cardinal letter marks — N only, to show intent without cluttering -->
  <text x="110" y="18" text-anchor="middle" dominant-baseline="auto"
        font-size="9" font-family="system-ui, sans-serif" letter-spacing="0.12em"
        fill="rgba(var(--ch-aurora),0.55)">N</text>
</svg>`;


// -----------------------------------------------------------------------------
// 6. WAVE — Session Complete
//
// Intent: A single sinusoidal wave crosses the full width of the frame,
// intersecting a clean horizon line. Below the horizon the wave area is filled
// with a translucent sage gradient — the "water you've crossed". Above, the
// wave crest catches a warm aurora highlight. A small sun-like radial detail
// sits just above the horizon on the right, suggesting dawn.
// Reading: "you crossed something today."
// -----------------------------------------------------------------------------
export const illustrationWave = `<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 240 200"
  fill="none"
  aria-hidden="true"
>
  <defs>
    <filter id="wave-glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- Water fill: sage at horizon, transparent at bottom -->
    <linearGradient id="water-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stop-color="rgba(var(--ch-sage),0.28)"/>
      <stop offset="100%" stop-color="rgba(var(--ch-sage),0.06)"/>
    </linearGradient>

    <!-- Wave stroke: aurora on the crest, sage on the trough -->
    <linearGradient id="wave-stroke-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="rgba(var(--ch-sage),0.6)"/>
      <stop offset="40%"  stop-color="rgba(var(--ch-aurora),0.85)"/>
      <stop offset="70%"  stop-color="rgba(var(--ch-sage),0.7)"/>
      <stop offset="100%" stop-color="rgba(var(--ch-sage),0.4)"/>
    </linearGradient>

    <!-- Sky ambient glow -->
    <radialGradient id="sky-halo" cx="78%" cy="42%" r="42%">
      <stop offset="0%"   stop-color="rgba(var(--ch-peach),0.25)"/>
      <stop offset="100%" stop-color="rgba(var(--ch-peach),0.0)"/>
    </radialGradient>

    <!-- Clip path: below the wave surface, for the water fill -->
    <clipPath id="wave-clip">
      <path d="
        M -4 102
        C 20 88, 40 76, 60 90
        C 80 104, 100 116, 120 100
        C 140 84, 160 72, 180 88
        C 200 104, 220 112, 244 98
        L 244 210 L -4 210 Z
      "/>
    </clipPath>
  </defs>

  <!-- Sky ambient warmth (top right — dawn position) -->
  <rect x="0" y="0" width="240" height="200" fill="url(#sky-halo)"/>

  <!-- Horizon line — the crossing point, perfectly straight -->
  <line x1="0" y1="100" x2="240" y2="100" stroke="rgba(var(--ch-warm),0.12)" stroke-width="1"/>

  <!-- ─── WATER FILL beneath the wave ──────────────────────────────────────── -->
  <rect x="0" y="0" width="240" height="200" fill="url(#water-grad)" clip-path="url(#wave-clip)"/>

  <!-- Secondary smaller wave behind — depth layer, more transparent -->
  <path
    d="M -4 108 C 18 96, 38 86, 58 98 C 78 110, 98 120, 118 106 C 138 92, 158 80, 178 96 C 198 112, 218 118, 244 104"
    stroke="rgba(var(--ch-sage),0.20)"
    stroke-width="1.5"
    stroke-linecap="round"
    fill="none"
  />

  <!-- PRIMARY WAVE — the one being crossed -->
  <path
    d="
      M -4 102
      C 20 88, 40 76, 60 90
      C 80 104, 100 116, 120 100
      C 140 84, 160 72, 180 88
      C 200 104, 220 112, 244 98
    "
    stroke="url(#wave-stroke-grad)"
    stroke-width="2"
    stroke-linecap="round"
    fill="none"
  />

  <!-- Crest highlight: a short bright segment at the wave's apex (near x=120) -->
  <path
    d="M 105 105 C 112 97, 120 97, 126 101"
    stroke="rgba(var(--ch-aurora),0.80)"
    stroke-width="2.5"
    stroke-linecap="round"
    fill="none"
    filter="url(#wave-glow)"
  />

  <!-- Spray dots at the crest — three small circles suggesting whitecaps -->
  <circle cx="115" cy="97"  r="1.8" fill="rgba(var(--ch-aurora),0.65)" filter="url(#wave-glow)"/>
  <circle cx="122" cy="95"  r="1.2" fill="rgba(var(--ch-aurora),0.45)"/>
  <circle cx="109" cy="100" r="1.0" fill="rgba(var(--ch-aurora),0.40)"/>

  <!-- ─── SUN — just above horizon, upper-right ─────────────────────────── -->
  <!-- Full circle: sunrise, not midday — positioned at 78% across, 35% down -->
  <circle cx="188" cy="70" r="14"
          fill="none"
          stroke="rgba(var(--ch-peach),0.55)"
          stroke-width="1.5"/>
  <!-- Inner disc: very light fill for a hollow-sun feel -->
  <circle cx="188" cy="70" r="8"
          fill="rgba(var(--ch-peach),0.22)"
          filter="url(#wave-glow)"/>

  <!-- Sun rays: 8 short lines radiating outward -->
  <line x1="188" y1="50"  x2="188" y2="43"  stroke="rgba(var(--ch-peach),0.40)" stroke-width="1.4" stroke-linecap="round"/>
  <line x1="188" y1="90"  x2="188" y2="97"  stroke="rgba(var(--ch-peach),0.30)" stroke-width="1.4" stroke-linecap="round"/>
  <line x1="168" y1="70"  x2="161" y2="70"  stroke="rgba(var(--ch-peach),0.30)" stroke-width="1.4" stroke-linecap="round"/>
  <line x1="208" y1="70"  x2="215" y2="70"  stroke="rgba(var(--ch-peach),0.40)" stroke-width="1.4" stroke-linecap="round"/>
  <line x1="174" y1="56"  x2="169" y2="51"  stroke="rgba(var(--ch-peach),0.32)" stroke-width="1.3" stroke-linecap="round"/>
  <line x1="202" y1="56"  x2="207" y2="51"  stroke="rgba(var(--ch-peach),0.32)" stroke-width="1.3" stroke-linecap="round"/>
  <line x1="174" y1="84"  x2="169" y2="89"  stroke="rgba(var(--ch-peach),0.24)" stroke-width="1.3" stroke-linecap="round"/>
  <line x1="202" y1="84"  x2="207" y2="89"  stroke="rgba(var(--ch-peach),0.24)" stroke-width="1.3" stroke-linecap="round"/>

  <!-- Sun glow halo -->
  <circle cx="188" cy="70" r="22" fill="rgba(var(--ch-peach),0.10)" filter="url(#wave-glow)"/>

  <!-- Horizon reflection of the sun: a short shimmering line on the water -->
  <path d="M 182 104 Q 188 102, 194 104" stroke="rgba(var(--ch-peach),0.38)" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  <path d="M 184 109 Q 188 107.5, 192 109" stroke="rgba(var(--ch-peach),0.22)" stroke-width="1.2" stroke-linecap="round" fill="none"/>
</svg>`;
