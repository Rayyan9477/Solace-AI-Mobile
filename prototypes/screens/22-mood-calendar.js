// 22 — Mood calendar / heatmap
// Month grid of mood entries colored by intensity, with legend + summary.

import { statusBar, tabBar, miniHeader } from '../lib/helpers.js';

export const screen = {
  id: 'mood-calendar',
  label: 'Mood calendar',
  section: 'daily-loop',
  render: () => {
    const moods = [4,3,4,5,3,4,4,2,3,4,5,5,4,3,3,4,2,3,4,5,4,4,3,4,null,null,null,null,null,null];
    const colors = { 1:'107,91,168', 2:'168,154,224', 3:'199,190,169', 4:'155,196,176', 5:'244,167,126' };
    const legendItems = [
      { c: '107,91,168',  l: 'Struggling' },
      { c: '168,154,224', l: 'Down' },
      { c: '199,190,169', l: 'Neutral' },
      { c: '155,196,176', l: 'Content' },
      { c: '244,167,126', l: 'Great' },
    ];

    return `
      ${statusBar}
      <div class="bg-midnight-950 h-full relative">
        <div class="absolute top-0 left-0 right-0 h-72 opacity-40" aria-hidden="true"
             style="background:radial-gradient(ellipse at 30% 0%,rgba(155,196,176,0.18),transparent 60%);"></div>

        <div class="relative px-6 pt-14 pb-32">
          ${miniHeader('April 2026', '<button type="button" class="icon-btn" aria-label="Change view"><i data-lucide="calendar-days" class="w-4 h-4 text-warm-400"></i></button>')}

          <h1 class="font-display text-[30px] font-light text-warm-50 leading-tight">Your month</h1>
          <p class="text-[13px] text-warm-400 mt-1 mb-6">23 days logged &middot; mostly calm</p>

          <!-- Month grid -->
          <figure class="hero-card glass-strong rounded-3xl p-5 mb-4">
            <figcaption class="sr-only">Mood heatmap for April 2026</figcaption>
            <div class="grid grid-cols-7 gap-1.5 mb-3" aria-hidden="true">
              ${['M','T','W','T','F','S','S'].map(d=>`<div class="text-center text-[9px] text-warm-500 bracket-label">${d}</div>`).join('')}
            </div>
            <div class="grid grid-cols-7 gap-1.5">
              ${moods.map((m,i) => {
                const isToday = i === 8;
                const label = m ? `Day ${i+1}: ${legendItems[m-1].l}` : `Day ${i+1}: no entry`;
                return `
                  <div class="aspect-square rounded-lg ${isToday?'ring-2 ring-warm-50 ring-offset-1 ring-offset-midnight-700':''} flex items-center justify-center text-[9px] font-mono text-warm-400/70"
                       style="${m?`background:rgba(${colors[m]},0.35);border:1px solid rgba(${colors[m]},0.55);box-shadow:inset 0 1px 0 rgba(255,255,255,0.05);`:'background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.04);'}"
                       role="img" aria-label="${label}">
                    ${i+1}
                  </div>
                `;
              }).join('')}
            </div>
          </figure>

          <!-- Legend -->
          <div class="glass rounded-2xl p-3.5 mb-4" role="group" aria-label="Mood legend">
            <p class="bracket-label text-warm-500 mb-2.5">Legend</p>
            <div class="flex justify-between items-center text-[9px] text-warm-400">
              ${legendItems.map(l=>`
                <div class="flex flex-col items-center gap-1.5">
                  <div class="w-5 h-5 rounded-md" style="background:rgba(${l.c},0.35);border:1px solid rgba(${l.c},0.55);"></div>
                  <span>${l.l}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Summary -->
          <div class="glass rounded-2xl p-4 flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-sage-300/15 border border-sage-300/25 flex items-center justify-center flex-shrink-0">
              <i data-lucide="trending-up" class="w-4 h-4 text-sage-300" aria-hidden="true"></i>
            </div>
            <div class="flex-1">
              <p class="text-[12px] font-medium text-warm-50">18% better than March</p>
              <p class="text-[10px] text-warm-500 mt-0.5">Your streak and sleep are both improving.</p>
            </div>
          </div>
        </div>
        ${tabBar('mood')}
      </div>
    `;
  },
};
