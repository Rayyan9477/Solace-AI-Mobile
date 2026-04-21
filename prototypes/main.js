// ============================================================================
// Solace AI — Prototype loader v4.1
// Dynamically imports every screen module from ./screens/ and mounts them.
// Includes theme switching support.
// ============================================================================

import { sections } from './sections.js';
import { phone } from './lib/helpers.js';
import { themes, applyTheme, restoreTheme } from './lib/themes.js';

// Restore persisted theme immediately
restoreTheme();

async function loadAllScreens() {
  const ids = [
    '01-welcome', '02-signin', '03-onboarding', '04-assessment',
    '05-home', '06-mood', '07-chat', '08-journal', '09-profile',
    '10-breathing', '11-sleep', '12-crisis',
    '13-splash', '14-quote',
    '15-goals', '16-biometric', '17-notif-primer', '18-assessment-intro', '19-assessment-results',
    '20-home-v2', '21-checkin', '22-mood-calendar', '23-mood-insights',
    '24-chat-list', '25-voice', '26-session-summary', '27-cbt',
    '28-journal-composer', '29-journal-detail',
    '30-mindful-library', '31-mindful-player', '32-session-complete', '33-sleep-log', '34-soundscapes',
    '35-notifications', '36-search', '37-account-settings', '38-paywall',
    '39-loading', '40-empty', '41-offline', '42-not-found',
  ];
  const result = {};
  const errors = [];
  await Promise.all(ids.map(async (filename) => {
    try {
      const mod = await import(`./screens/${filename}.js`);
      if (mod.screen) result[mod.screen.id] = mod.screen;
    } catch (err) {
      errors.push({ filename, err: err.message });
    }
  }));
  if (errors.length) console.warn(`[Solace] ${errors.length} screens failed:`, errors);
  return result;
}

function renderThemeSwitcher() {
  const saved = (() => { try { return localStorage.getItem('solace-theme') || 'cosmic'; } catch(e) { return 'cosmic'; } })();
  return `
    <div id="theme-switcher" class="flex items-center gap-2 mt-6">
      <span class="bracket-label text-warm-500 mr-1">Theme</span>
      ${themes.map(t => `
        <button type="button"
                data-theme-id="${t.id}"
                class="theme-dot group relative"
                style="width:36px;height:36px;border-radius:9999px;border:2px solid ${saved === t.id ? 'var(--aurora-300)' : 'rgba(255,255,255,0.1)'};background:${t.preview.bg};display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:border-color 200ms ease;"
                aria-label="${t.name}: ${t.description}"
                title="${t.name}">
          <span style="width:12px;height:12px;border-radius:50%;background:${t.preview.accent};"></span>
          <span class="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[9px] text-warm-500 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">${t.name}</span>
        </button>
      `).join('')}
    </div>
  `;
}

function renderSection(section, screenMap) {
  return `
    <section class="mb-16" id="section-${section.id}">
      <div class="flex items-end justify-between mb-6">
        <div>
          <p class="bracket-label text-aurora-300 mb-3">${section.number} &mdash; ${section.kicker}</p>
          <h2 class="font-display text-3xl text-warm-50 leading-tight">${section.title}</h2>
          <p class="text-warm-400 mt-2 max-w-xl">${section.subtitle}</p>
        </div>
        <span class="text-xs font-mono text-warm-500 hidden md:block">${section.screens.length} screens</span>
      </div>
      <div class="flex gap-12 scroll-x pb-8 pt-2">
        ${section.screens.map(id => {
          const s = screenMap[id];
          if (!s) return `<div class="text-peach-300 text-sm font-mono">Missing: ${id}</div>`;
          return phone(s.label, s.render());
        }).join('')}
      </div>
    </section>
  `;
}

async function mount() {
  const screenMap = await loadAllScreens();
  const host = document.getElementById('prototypes-root');
  if (!host) return;

  // Inject theme switcher into the header
  const themePlaceholder = document.getElementById('theme-switcher-slot');
  if (themePlaceholder) {
    themePlaceholder.innerHTML = renderThemeSwitcher();
    // Bind click handlers
    themePlaceholder.querySelectorAll('[data-theme-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.themeId;
        applyTheme(id);
        // Update active ring indicator only
        themePlaceholder.querySelectorAll('[data-theme-id]').forEach(b => {
          b.style.borderColor = b.dataset.themeId === id ? 'var(--aurora-300)' : 'rgba(255,255,255,0.1)';
        });
        // Screens read colors from CSS vars at runtime — no re-render needed.
        // This preserves focus, scroll position, and lazy-loaded state.
      });
    });
  }

  // Render all sections
  host.innerHTML = sections.map(sec => renderSection(sec, screenMap)).join('');

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons({ attrs: { 'stroke-width': 1.75 } });
  }

  document.documentElement.dataset.prototypesReady = 'true';
  window.__solacePrototypesReady = true;
  window.__solaceScreenMap = screenMap;
  console.info(`[Solace] Mounted ${Object.keys(screenMap).length} screens across ${sections.length} sections.`);
}

mount().catch(err => {
  console.error('[Solace] Failed to mount:', err);
  const host = document.getElementById('prototypes-root');
  if (host) host.innerHTML = `<div class="p-10 text-peach-300 text-sm font-mono">Error: ${err.message}</div>`;
});
