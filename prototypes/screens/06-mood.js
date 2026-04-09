// 06 — Mood tracker
// Weekly mood hero + 7-day bar chart + AI insights.

import { statusBar, tabBar } from '../lib/helpers.js';

export const screen = {
  id: 'mood',
  label: 'Mood tracker',
  section: 'main',
  render: () => {
    const days = [
      { d: 'M', h: 50, hue: '155,196,176' },
      { d: 'T', h: 70, hue: '155,196,176' },
      { d: 'W', h: 30, hue: '244,167,126' },
      { d: 'T', h: 60, hue: '155,196,176' },
      { d: 'F', h: 90, hue: '155,196,176' },
      { d: 'S', h: 80, hue: '168,154,224' },
      { d: 'S', h: 75, hue: '155,196,176', today: true },
    ];
    return `
      ${statusBar}
      <div class="bg-midnight-950 h-full relative">
        <div class="absolute top-0 left-0 right-0 h-80 opacity-40" aria-hidden="true"
             style="background:radial-gradient(ellipse at 20% 0%, rgba(155,196,176,0.18), transparent 60%);"></div>

        <div class="relative px-6 pt-14 pb-32">
          <header class="flex items-center justify-between mb-2">
            <div>
              <p class="bracket-label text-warm-500">Mood</p>
              <h1 class="font-display text-[32px] font-light text-warm-50 leading-tight mt-0.5">This week</h1>
            </div>
            <button type="button" class="icon-btn glass" aria-label="View calendar">
              <i data-lucide="calendar-days" class="w-4 h-4" aria-hidden="true"></i>
            </button>
          </header>

          <!-- Current mood hero -->
          <article class="mt-6 hero-card glass-strong rounded-3xl p-6 relative overflow-hidden" aria-labelledby="today-mood">
            <div class="absolute -top-12 -left-12 w-48 h-48 breath-orb opacity-55" aria-hidden="true"></div>
            <div class="relative flex items-end justify-between">
              <div>
                <p id="today-mood" class="bracket-label text-sage-300 mb-2">Today &middot; 2:45 PM</p>
                <p class="font-display text-[44px] font-light italic text-warm-50 leading-none">Content</p>
                <div class="flex items-center gap-1.5 mt-2.5">
                  <i data-lucide="arrow-up" class="w-3 h-3 text-sage-300" aria-hidden="true"></i>
                  <span class="text-[11px] text-sage-300 font-medium">Up from neutral</span>
                </div>
              </div>
              <div class="w-20 h-20 rounded-full bg-gradient-to-br from-sage-300 to-sage-700 flex items-center justify-center"
                   style="box-shadow: 0 0 40px -8px rgba(155,196,176,0.45);"
                   role="img" aria-label="Content mood illustration">
                <svg viewBox="0 0 100 100" width="62" height="62" aria-hidden="true">
                  <circle cx="36" cy="44" r="3.5" fill="#040818"/>
                  <circle cx="64" cy="44" r="3.5" fill="#040818"/>
                  <path d="M35 60 Q50 72 65 60" stroke="#040818" stroke-width="3.5" fill="none" stroke-linecap="round"/>
                </svg>
              </div>
            </div>
          </article>

          <!-- Weekly chart -->
          <figure class="glass rounded-3xl p-5 mt-4">
            <figcaption class="flex justify-between items-baseline mb-5">
              <p class="text-sm font-medium text-warm-50">7-day trend</p>
              <span class="chip text-[9px]">
                <span class="w-1.5 h-1.5 rounded-full bg-sage-300" aria-hidden="true"></span>
                Avg <span class="font-mono text-warm-50">3.8/5</span>
              </span>
            </figcaption>
            <div class="flex justify-between items-end gap-2" style="height:128px;" role="img" aria-label="Mood levels by day of week">
              ${days.map(d => `
                <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div class="w-full rounded-t-lg ${d.today ? 'bg-sage-300' : ''}"
                       style="height:${d.h}%;${d.today ? '' : `background:rgba(${d.hue},0.4);`}"
                       aria-label="${d.d}day"></div>
                  <span class="text-[10px] font-mono ${d.today ? 'text-sage-300 font-bold' : 'text-warm-500'}">${d.d}</span>
                </div>
              `).join('')}
            </div>
          </figure>

          <!-- Insights -->
          <section class="mt-5" aria-labelledby="insights-heading">
            <div class="flex items-center justify-between mb-3">
              <h3 id="insights-heading" class="font-display text-lg text-warm-50">Insights</h3>
              <span class="bracket-label text-warm-500">AI-analyzed</span>
            </div>
            <ul class="space-y-2.5">
              ${[
                { icon: 'trending-up', accent: 'sage-300',     hue: '155,196,176', title: 'Mood improved 18% this week',    desc: 'Your mindfulness sessions seem to help.' },
                { icon: 'moon',        accent: 'lavender-300', hue: '168,154,224', title: 'You feel best after 7+ hours sleep', desc: 'Consistent on weekends &mdash; try weeknights too.' },
                { icon: 'sun',         accent: 'peach-300',    hue: '244,167,126', title: 'Outdoor days lift your mood',   desc: '21% boost on days with sunlight.' },
              ].map(i => `
                <li class="glass rounded-2xl p-4 flex items-start gap-3">
                  <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style="background:rgba(${i.hue},0.12);border:1px solid rgba(${i.hue},0.2);">
                    <i data-lucide="${i.icon}" class="w-4 h-4 text-${i.accent}" aria-hidden="true"></i>
                  </div>
                  <div class="flex-1">
                    <p class="text-[12px] font-medium text-warm-50">${i.title}</p>
                    <p class="text-[10px] text-warm-500 mt-0.5">${i.desc}</p>
                  </div>
                </li>
              `).join('')}
            </ul>
          </section>
        </div>

        <!-- FAB -->
        <button type="button" class="absolute bottom-28 right-6 icon-btn btn-peach"
                style="width:56px;height:56px;"
                aria-label="Log a new mood entry">
          <i data-lucide="plus" class="w-6 h-6" aria-hidden="true"></i>
        </button>

        ${tabBar('mood')}
      </div>
    `;
  },
};
