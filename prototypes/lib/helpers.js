// ============================================================================
// Solace AI — Shared helpers v4
// Accessibility-first: 44px touch targets, semantic HTML, aria labels
// ============================================================================

/**
 * Wrap a screen's markup in a phone frame with a section label.
 * @param {string} id       — screen label shown above the phone
 * @param {string} content  — the HTML body of the frame
 */
export const phone = (id, content) => `
  <div class="screen-card">
    <p class="bracket-label text-warm-500 mb-3 text-center">${id}</p>
    <div class="phone grain" role="figure" aria-label="${id} screen">
      <div class="frame">${content}</div>
    </div>
  </div>
`;

/**
 * iOS-style status bar. Rendered once at the top of every screen.
 */
export const statusBar = `
  <div class="absolute top-4 left-0 right-0 px-8 flex justify-between items-center text-[11px] font-medium text-warm-50 z-50" aria-hidden="true">
    <span class="font-mono tracking-tight">9:41</span>
    <div class="flex items-center gap-1.5">
      <i data-lucide="signal" class="w-3 h-3"></i>
      <i data-lucide="wifi" class="w-3 h-3"></i>
      <i data-lucide="battery-full" class="w-4 h-4"></i>
    </div>
  </div>
`;

/**
 * Bottom tab bar. Aria-current marks active tab for screen readers.
 * @param {'home'|'mood'|'chat'|'journal'|'profile'} active
 */
export const tabBar = (active) => {
  const tabs = [
    { name: 'home',    icon: 'home',           label: 'Home' },
    { name: 'mood',    icon: 'heart',          label: 'Mood' },
    { name: 'chat',    icon: 'message-circle', label: 'Chat' },
    { name: 'journal', icon: 'book-open',      label: 'Journal' },
    { name: 'profile', icon: 'user',           label: 'You' },
  ];
  return `
    <nav class="absolute bottom-0 left-0 right-0 px-5 pt-3 pb-7" style="background:linear-gradient(to top, #040818 70%, transparent);" aria-label="Primary">
      <div class="glass-strong rounded-full flex justify-around items-center px-3 py-2">
        ${tabs.map(t => `
          <button type="button" class="tab-btn ${active === t.name ? 'text-sage-300' : 'text-warm-500'}"
                  ${active === t.name ? 'aria-current="page"' : ''}
                  aria-label="${t.label}">
            <i data-lucide="${t.icon}" class="w-[18px] h-[18px]" aria-hidden="true"></i>
            <span class="text-[9px] font-medium ${active === t.name ? 'opacity-100' : 'opacity-65'}">${t.label}</span>
          </button>
        `).join('')}
      </div>
    </nav>
  `;
};

/**
 * Mini header with back button + title + optional right action.
 * @param {string} title
 * @param {string} right   — html fragment for right-hand control (optional)
 */
export const miniHeader = (title, right = '') => `
  <header class="flex items-center justify-between mb-5">
    <button type="button" class="icon-btn glass" aria-label="Go back">
      <i data-lucide="arrow-left" class="w-4 h-4" aria-hidden="true"></i>
    </button>
    <p class="bracket-label text-warm-500">${title}</p>
    <div class="w-11 h-11 flex items-center justify-center">${right}</div>
  </header>
`;

/**
 * Mood face SVG glyph — consistent visual language across 5 levels.
 * Level 1 = struggling, 5 = overjoyed.
 * @param {1|2|3|4|5} level
 * @param {number} size     px
 */
export const moodFace = (level, size = 72) => {
  const faces = {
    5: {
      bg: 'linear-gradient(135deg,#F4A77E,#E88B5A)',
      label: 'Overjoyed',
      eyes: '<circle cx="35" cy="42" r="4" fill="#040818"/><circle cx="65" cy="42" r="4" fill="#040818"/>',
      mouth: '<path d="M30 58 Q50 78 70 58" stroke="#040818" stroke-width="4" fill="none" stroke-linecap="round"/>',
    },
    4: {
      bg: 'linear-gradient(135deg,#9BC4B0,#7AAA94)',
      label: 'Content',
      eyes: '<circle cx="36" cy="44" r="3.5" fill="#040818"/><circle cx="64" cy="44" r="3.5" fill="#040818"/>',
      mouth: '<path d="M35 60 Q50 70 65 60" stroke="#040818" stroke-width="3.5" fill="none" stroke-linecap="round"/>',
    },
    3: {
      bg: 'linear-gradient(135deg,#C7BEA9,#8B95A8)',
      label: 'Neutral',
      eyes: '<circle cx="36" cy="44" r="3.5" fill="#040818"/><circle cx="64" cy="44" r="3.5" fill="#040818"/>',
      mouth: '<line x1="35" y1="65" x2="65" y2="65" stroke="#040818" stroke-width="3.5" stroke-linecap="round"/>',
    },
    2: {
      bg: 'linear-gradient(135deg,#A89AE0,#8B7CC8)',
      label: 'Down',
      eyes: '<path d="M32 46 Q36 42 40 46" stroke="#040818" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M60 46 Q64 42 68 46" stroke="#040818" stroke-width="3" fill="none" stroke-linecap="round"/>',
      mouth: '<path d="M35 68 Q50 58 65 68" stroke="#040818" stroke-width="3.5" fill="none" stroke-linecap="round"/>',
    },
    1: {
      bg: 'linear-gradient(135deg,#6B5BA8,#3A4255)',
      label: 'Struggling',
      eyes: '<line x1="32" y1="46" x2="40" y2="46" stroke="#040818" stroke-width="3" stroke-linecap="round"/><line x1="60" y1="46" x2="68" y2="46" stroke="#040818" stroke-width="3" stroke-linecap="round"/>',
      mouth: '<path d="M32 70 Q50 58 68 70" stroke="#040818" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="76" cy="62" r="2.5" fill="#A89AE0"/>',
    },
  };
  const f = faces[level];
  return `
    <div class="rounded-full flex items-center justify-center relative"
         style="width:${size}px;height:${size}px;background:${f.bg};box-shadow:inset 0 ${Math.max(2, size*0.05)}px ${Math.max(4, size*0.1)}px rgba(255,255,255,0.22),inset 0 -${Math.max(1, size*0.04)}px ${Math.max(3, size*0.08)}px rgba(0,0,0,0.15);"
         role="img" aria-label="${f.label} mood">
      <svg viewBox="0 0 100 100" width="${size*0.9}" height="${size*0.9}" aria-hidden="true">
        ${f.eyes}
        ${f.mouth}
      </svg>
    </div>
  `;
};

/**
 * Helper: primary accessible button with minimum 48px height.
 */
export const button = ({ variant = 'sage', label, icon, trailing, type = 'button', ariaLabel, width = 'full' }) => {
  const classes = `btn btn-${variant} ${width === 'full' ? 'w-full' : ''}`;
  const aria = ariaLabel ? `aria-label="${ariaLabel}"` : '';
  return `
    <button type="${type}" class="${classes}" ${aria}>
      ${icon ? `<i data-lucide="${icon}" class="w-4 h-4" aria-hidden="true"></i>` : ''}
      <span>${label}</span>
      ${trailing ? `<i data-lucide="${trailing}" class="w-4 h-4" aria-hidden="true"></i>` : ''}
    </button>
  `;
};

/**
 * Helper: stat tile used across dashboards (home, mood, profile).
 */
export const statTile = ({ icon, label, value, unit, pct, accent = 'sage-300', hue = '155,196,176', variant = 'bar' }) => `
  <div class="glass rounded-2xl p-4">
    <div class="flex items-center justify-between mb-2">
      <i data-lucide="${icon}" class="w-4 h-4 text-${accent}" aria-hidden="true"></i>
      <span class="text-[9px] text-warm-500 font-medium tracking-widest uppercase">${label}</span>
    </div>
    <p class="font-display text-[26px] font-light text-warm-50 leading-none">${value}<span class="text-sm text-warm-400 ml-0.5 font-mono">${unit}</span></p>
    ${variant === 'bar' ? `<div class="stat-bar mt-2.5"><span style="width:${pct}%"></span></div>`
      : variant === 'dots' ? `<div class="flex gap-0.5 mt-2.5">${Array(7).fill(0).map((_,i)=>`<div class="flex-1 h-1 rounded-full ${i<Math.round(pct/100*7)?`bg-${accent}`:'bg-white/8'}"></div>`).join('')}</div>`
      : ''}
  </div>
`;
