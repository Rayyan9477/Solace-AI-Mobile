// ============================================================================
// Solace AI — Prototype loader v4
// Dynamically imports every screen module from ./screens/ and mounts them.
// ============================================================================

import { sections } from './sections.js';
import { phone } from './lib/helpers.js';

// Screen modules — order matches the filename numeric prefix. Every module
// default-exports { id, label, render }.
const modules = import.meta.glob
  ? import.meta.glob('./screens/*.js', { eager: true })
  : null;

async function loadAllScreens() {
  // import.meta.glob is Vite/Webpack only — falls back to static list for plain http-server.
  const ids = [
    // v1 hero
    '01-welcome', '02-signin', '03-onboarding', '04-assessment',
    '05-home', '06-mood', '07-chat', '08-journal', '09-profile',
    '10-breathing', '11-sleep', '12-crisis',
    // brand moments
    '13-splash', '14-quote',
    // onboarding plus
    '15-goals', '16-biometric', '17-notif-primer', '18-assessment-intro', '19-assessment-results',
    // daily loop
    '20-home-v2', '21-checkin', '22-mood-calendar', '23-mood-insights',
    // therapy
    '24-chat-list', '25-voice', '26-session-summary', '27-cbt',
    // journal
    '28-journal-composer', '29-journal-detail',
    // mindful/sleep
    '30-mindful-library', '31-mindful-player', '32-session-complete', '33-sleep-log', '34-soundscapes',
    // system
    '35-notifications', '36-search', '37-account-settings', '38-paywall',
    // states
    '39-loading', '40-empty', '41-offline', '42-not-found',
  ];
  const result = {};
  const errors = [];
  await Promise.all(ids.map(async (filename) => {
    try {
      const mod = await import(`./screens/${filename}.js`);
      const screen = mod.screen;
      if (screen) result[screen.id] = screen;
    } catch (err) {
      errors.push({ filename, err: err.message });
    }
  }));
  if (errors.length) {
    console.warn(`[Solace] ${errors.length} screens failed to load:`, errors);
  }
  return result;
}

function renderSection(section, screenMap) {
  return `
    <section class="mb-16" id="section-${section.id}">
      <div class="flex items-end justify-between mb-6">
        <div>
          <p class="bracket-label text-aurora-300 mb-3">${section.number} — ${section.kicker}</p>
          <h2 class="font-display text-3xl text-warm-50 leading-tight">${section.title}</h2>
          <p class="text-warm-400 mt-2 max-w-xl">${section.subtitle}</p>
        </div>
        <span class="text-xs font-mono text-warm-500 hidden md:block">${section.screens.length} screens</span>
      </div>
      <div class="flex gap-12 scroll-x pb-8 pt-2">
        ${section.screens.map(id => {
          const s = screenMap[id];
          if (!s) return `<div class="text-peach-300 text-sm">Missing screen: ${id}</div>`;
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

  const html = sections.map(sec => renderSection(sec, screenMap)).join('');
  host.innerHTML = html;

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons({ attrs: { 'stroke-width': 1.75 } });
  }

  // Mark readiness for test hooks
  document.documentElement.dataset.prototypesReady = 'true';
  window.__solacePrototypesReady = true;
  console.info(`[Solace] Mounted ${Object.keys(screenMap).length} screens across ${sections.length} sections.`);
}

mount().catch(err => {
  console.error('[Solace] Failed to mount prototypes:', err);
  const host = document.getElementById('prototypes-root');
  if (host) {
    host.innerHTML = `<div class="p-10 text-peach-300 text-sm font-mono">Error loading prototypes: ${err.message}</div>`;
  }
});
