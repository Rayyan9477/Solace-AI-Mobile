// Tailwind CDN runtime config
// Colors reference CSS custom properties from tokens.css so theme switching works.
window.tailwind = window.tailwind || {};
window.tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
      colors: {
        // Map Tailwind color classes to CSS custom properties
        // This means `bg-midnight-950` reads `var(--mn-950)` at runtime
        midnight: {
          950: 'var(--mn-950)', 900: 'var(--mn-900)', 800: 'var(--mn-800)',
          700: 'var(--mn-700)', 600: 'var(--mn-600)', 500: 'var(--mn-500)',
        },
        ink: {
          950: 'var(--mn-950)', 900: 'var(--mn-900)', 800: 'var(--mn-800)',
          700: 'var(--mn-700)', 600: 'var(--mn-600)',
        },
        aurora: {
          100: 'var(--aurora-100)', 300: 'var(--aurora-300)',
          500: 'var(--aurora-500)', 700: 'var(--aurora-700)',
        },
        sage: {
          50: '#EEF5F1',
          100: 'var(--sage-100)', 300: 'var(--sage-300)',
          500: 'var(--sage-500)', 700: 'var(--sage-700)', 900: 'var(--sage-900)',
        },
        peach: {
          100: 'var(--peach-100)', 300: 'var(--peach-300)',
          500: 'var(--peach-500)', 700: 'var(--peach-700)',
        },
        lavender: {
          100: 'var(--lavender-100)', 300: 'var(--lavender-300)',
          500: 'var(--lavender-500)', 700: 'var(--lavender-700)',
        },
        warm: {
          50: 'var(--warm-50)', 100: 'var(--warm-100)', 200: 'var(--warm-200)',
          400: 'var(--warm-400)', 500: 'var(--warm-500)', 700: 'var(--warm-700)',
        },
        mist: 'var(--mist)',
      },
      boxShadow: {
        'glass': 'var(--shadow-md)',
        'sage-glow': 'var(--glow-sage)',
        'peach-glow': 'var(--glow-peach)',
        'aurora-glow': 'var(--glow-aurora)',
        'cosmic': 'var(--shadow-cosmic)',
      },
    },
  },
};
