// 05 — Home dashboard
// The hero screen of the entire app. Solace Score + metrics + AI continue + articles.

import { statusBar, tabBar } from '../lib/helpers.js';

export const screen = {
  id: 'home',
  label: 'Home dashboard',
  section: 'main',
  render: () => `
    ${statusBar}
    <div class="bg-midnight-950 h-full relative">
      <div class="absolute top-0 left-0 right-0 h-80 opacity-50" aria-hidden="true"
           style="background:radial-gradient(ellipse at top, rgba(107,143,255,0.18), transparent 60%);"></div>

      <div class="relative px-6 pt-14 pb-32">

        <!-- Header row -->
        <header class="flex items-center justify-between mb-1">
          <p class="bracket-label text-warm-500">Tuesday, April 9</p>
          <button type="button" class="icon-btn glass relative" aria-label="Notifications (1 unread)">
            <i data-lucide="bell" class="w-4 h-4 text-warm-50" aria-hidden="true"></i>
            <span class="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-peach-300" aria-hidden="true"></span>
          </button>
        </header>
        <h1 class="font-display text-[32px] font-light text-warm-50 mt-1 leading-[1.05]">
          Good morning,<br/>
          <span class="italic font-medium">Rayyan.</span>
        </h1>

        <!-- Solace Score hero card -->
        <article class="mt-6 hero-card glass-aurora rounded-3xl p-6 overflow-hidden relative" aria-labelledby="score-label">
          <div class="absolute -top-20 -right-20 w-64 h-64 breath-orb opacity-65" aria-hidden="true"></div>
          <div class="relative">
            <div class="flex items-start justify-between mb-5">
              <div>
                <p id="score-label" class="bracket-label text-aurora-300 mb-2">Solace Score</p>
                <p class="font-display text-[56px] font-light text-warm-50 leading-none tracking-tight">
                  72<span class="text-2xl text-warm-400 font-mono">/100</span>
                </p>
                <div class="flex items-center gap-1.5 mt-2">
                  <i data-lucide="trending-up" class="w-3 h-3 text-sage-300" aria-hidden="true"></i>
                  <span class="text-[11px] text-sage-300 font-medium">+5 from last week</span>
                </div>
              </div>
              <div class="ring-progress w-20 h-20" style="--p: 72%;" role="img" aria-label="Score ring 72 percent">
                <div>
                  <i data-lucide="sparkles" class="w-5 h-5 text-aurora-300" aria-hidden="true"></i>
                </div>
              </div>
            </div>
            <div class="aurora-hairline mb-3"></div>
            <p class="text-[11px] text-warm-400 leading-relaxed">
              Your mood has been steady. Try a 5-minute breathing session to maintain momentum.
            </p>
          </div>
        </article>

        <!-- Quick metrics grid -->
        <div class="grid grid-cols-2 gap-3 mt-4">
          ${[
            { icon: 'moon',     label: 'SLEEP',   value: '7.8', unit: 'h',   pct: 78, accent: 'lavender-300', ariaLabel: 'Sleep 7.8 hours' },
            { icon: 'wind',     label: 'MINDFUL', value: '12',  unit: 'min', pct: 60, accent: 'sage-300',     ariaLabel: '12 minutes mindful' },
            { icon: 'activity', label: 'STRESS',  value: '2',   unit: '/5',  pct: 40, accent: 'peach-300',    ariaLabel: 'Stress 2 out of 5' },
            { icon: 'flame',    label: 'STREAK',  value: '23',  unit: 'd',   pct: 71, accent: 'peach-300', isStreak: true, ariaLabel: '23 day streak' },
          ].map(m => `
            <div class="glass rounded-2xl p-4" role="group" aria-label="${m.ariaLabel}">
              <div class="flex items-center justify-between mb-2">
                <i data-lucide="${m.icon}" class="w-4 h-4 text-${m.accent}" aria-hidden="true"></i>
                <span class="text-[9px] text-warm-500 font-medium tracking-widest uppercase">${m.label}</span>
              </div>
              <p class="font-display text-[26px] font-light text-warm-50 leading-none">
                ${m.value}<span class="text-sm text-warm-400 ml-0.5 font-mono">${m.unit}</span>
              </p>
              ${m.isStreak
                ? `<div class="flex gap-0.5 mt-2.5" aria-hidden="true">${Array(7).fill(0).map((_,i)=>`<div class="flex-1 h-1 rounded-full ${i<5?'bg-peach-300':'bg-white/8'}"></div>`).join('')}</div>`
                : `<div class="stat-bar mt-2.5"><span style="width:${m.pct}%"></span></div>`}
            </div>
          `).join('')}
        </div>

        <!-- AI Therapy continue -->
        <button type="button" class="mt-4 w-full hero-card rounded-3xl p-5 relative overflow-hidden text-left"
                style="background: linear-gradient(135deg, rgba(155,196,176,0.15) 0%, rgba(107,143,255,0.1) 50%, rgba(168,154,224,0.1) 100%); border: 1px solid rgba(155,196,176,0.18);"
                aria-label="Continue your session: Let's talk about that meeting, 3 minutes ago">
          <div class="absolute -bottom-12 -right-12 w-44 h-44 breath-orb" aria-hidden="true"></div>
          <div class="relative flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-sage-300 to-aurora-300 flex items-center justify-center flex-shrink-0"
                 style="box-shadow: 0 0 40px -8px rgba(107,143,255,0.5);">
              <i data-lucide="sparkles" class="w-6 h-6 text-midnight-950" aria-hidden="true"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-warm-50">Continue your session</p>
              <p class="text-[11px] text-warm-400 truncate mt-0.5">3 min ago &mdash; &ldquo;Let&rsquo;s talk about that meeting&hellip;&rdquo;</p>
            </div>
            <i data-lucide="arrow-right" class="w-4 h-4 text-warm-400 flex-shrink-0" aria-hidden="true"></i>
          </div>
        </button>

        <!-- For you today -->
        <section class="mt-6" aria-labelledby="for-you-heading">
          <div class="flex justify-between items-baseline mb-3">
            <h3 id="for-you-heading" class="font-display text-lg text-warm-50">For you today</h3>
            <button type="button" class="text-[11px] text-aurora-300 font-medium">See all &rarr;</button>
          </div>
          <div class="flex gap-3 scroll-x -mx-6 px-6" role="list">
            ${[
              { tag: 'Anxiety', title: 'The 5-4-3-2-1 grounding technique', time: '4 min', color: 'sage-300',    hue: '155,196,176' },
              { tag: 'Sleep',   title: 'Why your phone hurts your sleep',   time: '6 min', color: 'lavender-300', hue: '168,154,224' },
              { tag: 'Focus',   title: 'Reset your mornings',               time: '3 min', color: 'aurora-300',   hue: '138,163,255' },
            ].map(a => `
              <article class="w-44 flex-shrink-0 glass rounded-2xl p-4" role="listitem">
                <div class="h-20 rounded-xl mb-3 relative overflow-hidden" style="background: linear-gradient(135deg, rgba(${a.hue},0.2), rgba(${a.hue},0.05));">
                  <div class="absolute inset-0" style="background:radial-gradient(circle at 70% 30%, rgba(${a.hue},0.35), transparent 60%);"></div>
                </div>
                <span class="chip text-[9px] py-0.5 px-2" style="color:rgb(${a.hue});background:rgba(${a.hue},0.1);border-color:rgba(${a.hue},0.25);">${a.tag}</span>
                <p class="text-[12px] font-medium text-warm-50 mt-2 leading-snug">${a.title}</p>
                <p class="text-[10px] text-warm-500 mt-1 font-mono">${a.time} read</p>
              </article>
            `).join('')}
          </div>
        </section>
      </div>
      ${tabBar('home')}
    </div>
  `,
};
