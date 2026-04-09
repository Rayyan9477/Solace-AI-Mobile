// 11 — Sleep dashboard
// Last night summary + sleep stages + weekly history + log CTA.

import { statusBar } from '../lib/helpers.js';

export const screen = {
  id: 'sleep',
  label: 'Sleep',
  section: 'wellness',
  render: () => {
    const stages = [
      { l: 'Deep', v: '1h 52m', c: 'lavender-300' },
      { l: 'Core', v: '3h 45m', c: 'sage-300' },
      { l: 'REM',  v: '1h 06m', c: 'peach-300' },
      { l: 'Awake', v: '1h 05m', c: 'warm-200' },
    ];
    const weekHours = [5.2, 6.8, 7.4, 6.5, 7.8, 8.1, 7.8];
    const weekDays = ['M','T','W','T','F','S','S'];
    const stars = Array(24).fill(0).map((_,i)=>{
      const x = (i*149)%380;
      const y = (i*97)%320;
      const sz = i%4===0 ? 1.5 : 0.5;
      return `<div class="absolute rounded-full bg-white/40" style="left:${x}px;top:${y}px;width:${sz}px;height:${sz}px;"></div>`;
    }).join('');

    return `
      ${statusBar}
      <div class="h-full relative" style="background:linear-gradient(180deg, #161D3D 0%, #0E1430 35%, #040818 100%);">
        <!-- Stars -->
        <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
          ${stars}
          <div class="absolute top-10 right-12 w-48 h-48 smoke opacity-70"></div>
        </div>

        <div class="relative z-10 px-6 pt-14 pb-12">
          <header class="flex items-center justify-between mb-6">
            <button type="button" class="icon-btn glass" aria-label="Go back">
              <i data-lucide="arrow-left" class="w-4 h-4" aria-hidden="true"></i>
            </button>
            <p class="bracket-label text-warm-500">Sleep</p>
            <button type="button" class="icon-btn glass" aria-label="Sleep options">
              <i data-lucide="more-horizontal" class="w-4 h-4" aria-hidden="true"></i>
            </button>
          </header>

          <!-- Hero score card -->
          <article class="hero-card glass-strong rounded-3xl p-6 relative overflow-hidden" aria-labelledby="last-night-label">
            <div class="absolute -top-12 -right-12 w-48 h-48 rounded-full" aria-hidden="true"
                 style="background:radial-gradient(circle, rgba(168,154,224,0.38), transparent 70%);filter:blur(20px);"></div>
            <div class="relative">
              <div class="flex items-center gap-2 mb-3">
                <i data-lucide="moon" class="w-3.5 h-3.5 text-lavender-300" aria-hidden="true"></i>
                <p id="last-night-label" class="bracket-label text-lavender-300">Last night</p>
              </div>
              <p class="font-display text-[64px] font-light text-warm-50 leading-none tracking-tight">
                7<span class="text-3xl text-warm-400 font-mono">h</span> 48<span class="text-3xl text-warm-400 font-mono">m</span>
              </p>
              <div class="flex items-center gap-2 mt-4">
                <div class="px-2.5 py-1 rounded-full bg-sage-300/15 border border-sage-300/30">
                  <span class="text-[10px] text-sage-300 font-medium">Quality <span class="font-mono">86%</span></span>
                </div>
                <span class="text-[10px] text-warm-500 font-mono">11:14 PM &mdash; 7:02 AM</span>
              </div>
            </div>
          </article>

          <!-- Sleep stages bar -->
          <figure class="glass rounded-2xl p-5 mt-4">
            <figcaption class="flex items-center justify-between mb-4">
              <p class="text-sm font-medium text-warm-50">Sleep stages</p>
              <span class="bracket-label text-warm-500">Per hypnogram</span>
            </figcaption>
            <div class="h-2.5 rounded-full overflow-hidden flex bg-white/5" role="img" aria-label="Sleep stages hypnogram">
              <div style="width:24%;background:linear-gradient(90deg,#8B7CC8,#A89AE0);" aria-label="Deep 24 percent"></div>
              <div style="width:48%;background:linear-gradient(90deg,#9BC4B0,#7AAA94);" aria-label="Core 48 percent"></div>
              <div style="width:14%;background:linear-gradient(90deg,#F4A77E,#E88B5A);" aria-label="REM 14 percent"></div>
              <div style="width:14%;background:linear-gradient(90deg,#C7BEA9,#8B95A8);" aria-label="Awake 14 percent"></div>
            </div>
            <div class="grid grid-cols-4 gap-2 mt-4">
              ${stages.map(s => `
                <div>
                  <div class="flex items-center gap-1 mb-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-${s.c}" aria-hidden="true"></span>
                    <span class="text-[9px] text-warm-500 bracket-label">${s.l}</span>
                  </div>
                  <p class="text-[11px] font-medium text-warm-50 font-mono">${s.v}</p>
                </div>
              `).join('')}
            </div>
          </figure>

          <!-- Insight -->
          <div class="mt-4 hero-card glass-aurora rounded-2xl p-4 flex items-start gap-3">
            <div class="w-9 h-9 rounded-xl bg-sage-300/15 border border-sage-300/30 flex items-center justify-center flex-shrink-0">
              <i data-lucide="sparkles" class="w-4 h-4 text-sage-300" aria-hidden="true"></i>
            </div>
            <div class="flex-1">
              <p class="text-[12px] font-medium text-warm-50">Your best sleep this week</p>
              <p class="text-[10px] text-warm-500 mt-0.5">You went to bed 30 min earlier &mdash; keep it up.</p>
            </div>
          </div>

          <!-- Weekly bars -->
          <figure class="mt-4 glass rounded-2xl p-5">
            <figcaption class="flex justify-between items-baseline mb-4">
              <p class="text-sm font-medium text-warm-50">7-day history</p>
              <span class="text-[10px] text-warm-500">Avg <span class="font-mono text-warm-200">7.2h</span></span>
            </figcaption>
            <div class="flex justify-between items-end gap-2" style="height:96px;" role="img" aria-label="Sleep duration over the last 7 days">
              ${weekHours.map((h,i)=>{
                const pct = (h/9)*100;
                const isToday = i===6;
                return `
                  <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div class="w-full rounded-t-md ${isToday?'bg-lavender-300':'bg-lavender-300/40'}" style="height:${pct}%" aria-label="${weekDays[i]} ${h} hours"></div>
                    <span class="text-[9px] font-mono ${isToday?'text-lavender-300 font-bold':'text-warm-500'}">${weekDays[i]}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </figure>

          <!-- Log sleep CTA -->
          <button type="button" class="btn btn-primary w-full mt-6">
            <i data-lucide="moon" class="w-4 h-4" aria-hidden="true"></i>
            Log tonight&rsquo;s sleep
          </button>
        </div>
      </div>
    `;
  },
};
