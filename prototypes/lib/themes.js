// ============================================================================
// Solace AI — Theme Presets
// Each theme overrides the CSS custom properties from tokens.css.
// The app stores the active theme in localStorage and applies it via
// data-theme="<id>" on <html>.
// ============================================================================

export const themes = [
  {
    id: 'cosmic',
    name: 'Cosmic Night',
    emoji: '',
    description: 'Deep midnight blue + aurora accents — the default',
    preview: { bg: '#040818', accent: '#6B8FFF', sage: '#9BC4B0' },
    // Default — no overrides needed, tokens.css :root IS the cosmic theme
  },
  {
    id: 'earth',
    name: 'Warm Earth',
    emoji: '',
    description: 'Rich walnut brown with terracotta and olive',
    preview: { bg: '#0F0B08', accent: '#D4915E', sage: '#8BA67A' },
    vars: {
      '--mn-950': '#0F0B08', '--mn-900': '#16110C', '--mn-800': '#221A12',
      '--mn-700': '#2F2419', '--mn-600': '#3D3022', '--mn-500': '#4A3C2C',
      '--aurora-100': '#F5E0CA', '--aurora-300': '#D4915E', '--aurora-500': '#C27A45', '--aurora-700': '#9A5E30',
      '--sage-100': '#D6E5CE', '--sage-300': '#8BA67A', '--sage-500': '#6D8C5E', '--sage-700': '#4E6E42', '--sage-900': '#2D4026',
      '--peach-100': '#F9DDD0', '--peach-300': '#E8976A', '--peach-500': '#D07A4C', '--peach-700': '#A8593A',
      '--lavender-100': '#E4D8C8', '--lavender-300': '#B8A080', '--lavender-500': '#9A8468', '--lavender-700': '#7A6850',
      '--warm-50': '#F5EDE4', '--warm-100': '#E8DDD0', '--warm-200': '#C4B69C', '--warm-400': '#8A8070', '--warm-500': '#7E756A', '--warm-700': '#3A342C',
      '--mist': '#D4C8B8',
      '--ch-sage': '139,166,122', '--ch-aurora': '212,145,94', '--ch-peach': '232,151,106',
      '--ch-lavender': '184,160,128', '--ch-warm': '245,237,228',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean Calm',
    emoji: '',
    description: 'Deep sea navy with teal and seafoam',
    preview: { bg: '#030D14', accent: '#5BB8C9', sage: '#6EC5A8' },
    vars: {
      '--mn-950': '#030D14', '--mn-900': '#061520', '--mn-800': '#0C1F2E',
      '--mn-700': '#142C3D', '--mn-600': '#1E3D52', '--mn-500': '#2A5068',
      '--aurora-100': '#CCF0F5', '--aurora-300': '#5BB8C9', '--aurora-500': '#3DA5B8', '--aurora-700': '#2A8A9E',
      '--sage-100': '#D0EFE0', '--sage-300': '#6EC5A8', '--sage-500': '#50A88A', '--sage-700': '#38886E', '--sage-900': '#1E5544',
      '--peach-100': '#FCE8DA', '--peach-300': '#F0B08A', '--peach-500': '#E09468', '--peach-700': '#B87048',
      '--lavender-100': '#D5E5F0', '--lavender-300': '#8AAEC8', '--lavender-500': '#6890A8', '--lavender-700': '#4A7088',
      '--warm-50': '#F0F4F5', '--warm-100': '#DEE6E8', '--warm-200': '#B8C8CC', '--warm-400': '#7A919A', '--warm-500': '#6F8088', '--warm-700': '#354048',
      '--mist': '#B0D0DD',
      '--ch-sage': '110,197,168', '--ch-aurora': '91,184,201', '--ch-peach': '240,176,138',
      '--ch-lavender': '138,174,200', '--ch-warm': '240,244,245',
    },
  },
  {
    id: 'forest',
    name: 'Deep Forest',
    emoji: '',
    description: 'Emerald green with warm amber highlights',
    preview: { bg: '#040E08', accent: '#D4A545', sage: '#68B088' },
    vars: {
      '--mn-950': '#040E08', '--mn-900': '#08160E', '--mn-800': '#102218',
      '--mn-700': '#1A3024', '--mn-600': '#264035', '--mn-500': '#325048',
      '--aurora-100': '#F5E8C8', '--aurora-300': '#D4A545', '--aurora-500': '#C29030', '--aurora-700': '#9A7020',
      '--sage-100': '#D0EADB', '--sage-300': '#68B088', '--sage-500': '#4E9870', '--sage-700': '#367858', '--sage-900': '#1E5040',
      '--peach-100': '#F8E0CC', '--peach-300': '#E8A570', '--peach-500': '#D08850', '--peach-700': '#A86838',
      '--lavender-100': '#D8E8D0', '--lavender-300': '#90B480', '--lavender-500': '#709860', '--lavender-700': '#507840',
      '--warm-50': '#F0EDE5', '--warm-100': '#E0DBD0', '--warm-200': '#B8B0A0', '--warm-400': '#808878', '--warm-500': '#788070', '--warm-700': '#38403A',
      '--mist': '#B8D0C0',
      '--ch-sage': '104,176,136', '--ch-aurora': '212,165,69', '--ch-peach': '232,165,112',
      '--ch-lavender': '144,180,128', '--ch-warm': '240,237,229',
    },
  },
  {
    id: 'rose',
    name: 'Soft Rose',
    emoji: '',
    description: 'Warm plum with dusty rose and gold',
    preview: { bg: '#0E0610', accent: '#D4789A', sage: '#B8909A' },
    vars: {
      '--mn-950': '#0E0610', '--mn-900': '#160C18', '--mn-800': '#221428',
      '--mn-700': '#301E38', '--mn-600': '#3E2A48', '--mn-500': '#4E3858',
      '--aurora-100': '#F5D0E0', '--aurora-300': '#D4789A', '--aurora-500': '#C06088', '--aurora-700': '#9A4870',
      '--sage-100': '#E8D8DE', '--sage-300': '#B8909A', '--sage-500': '#987880', '--sage-700': '#786068', '--sage-900': '#504048',
      '--peach-100': '#F8DDD5', '--peach-300': '#E8A090', '--peach-500': '#D08878', '--peach-700': '#A86860',
      '--lavender-100': '#E5D0E8', '--lavender-300': '#B890C0', '--lavender-500': '#9870A0', '--lavender-700': '#785880',
      '--warm-50': '#F5F0F0', '--warm-100': '#E8E0E2', '--warm-200': '#C8B8C0', '--warm-400': '#908088', '--warm-500': '#807078', '--warm-700': '#3E3438',
      '--mist': '#D0C0D0',
      '--ch-sage': '184,144,154', '--ch-aurora': '212,120,154', '--ch-peach': '232,160,144',
      '--ch-lavender': '184,144,192', '--ch-warm': '245,240,240',
    },
  },
];

/**
 * Apply a theme by ID. Sets CSS custom properties + data-theme attribute.
 * @param {string} themeId
 */
export function applyTheme(themeId) {
  const theme = themes.find(t => t.id === themeId);
  if (!theme) return;

  const root = document.documentElement;

  // Reset to default (cosmic) first by removing overrides
  if (themeId === 'cosmic') {
    root.removeAttribute('data-theme');
    // Remove any inline overrides
    themes.forEach(t => {
      if (t.vars) {
        Object.keys(t.vars).forEach(prop => root.style.removeProperty(prop));
      }
    });
  } else if (theme.vars) {
    root.setAttribute('data-theme', themeId);
    Object.entries(theme.vars).forEach(([prop, val]) => {
      root.style.setProperty(prop, val);
    });
  }

  // Persist choice
  try { localStorage.setItem('solace-theme', themeId); } catch (e) {}

  // Update Tailwind colors dynamically (they read from CSS vars via the config)
  // Tailwind CDN re-evaluates on next render cycle automatically

  console.info(`[Solace] Theme applied: ${theme.name}`);
}

/**
 * Restore persisted theme on page load.
 */
export function restoreTheme() {
  try {
    const saved = localStorage.getItem('solace-theme');
    if (saved && saved !== 'cosmic') applyTheme(saved);
  } catch (e) {}
}
