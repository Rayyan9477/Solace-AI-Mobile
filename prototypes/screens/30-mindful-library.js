// 30 — Mindfulness library
// Featured hero + category filter row + grid of practices.

import { statusBar, tabBar } from '../lib/helpers.js';

export const screen = {
  id: 'mindful-library',
  label: 'Mindfulness library',
  section: 'mindful-sleep',
  render: () => {
    const categories = ['For you','Quick','Sleep','Anxiety','Focus','Body scan','Loving-kindness'];
    const sessions = [
      { title: '4-7-8 breath',      time: '4 min',  hue: '155,196,176', icon: 'wind' },
      { title: 'Body scan',          time: '10 min', hue: '168,154,224', icon: 'user-round' },
      { title: 'Loving kindness',    time: '12 min', hue: '244,167,126', icon: 'heart' },
      { title: 'Noting practice',    time: '15 min', hue: '138,163,255', icon: 'feather' },
      { title: 'Sleep wind-down',    time: '20 min', hue: '168,154,224', icon: 'moon' },
      { title: 'Quick reset',        time: '2 min',  hue: '244,167,126', icon: 'zap' },
    ];
    return `
      ${statusBar}
      <div class="bg-midnight-950 h-full relative">
        <div class="absolute top-0 left-0 right-0 h-80 opacity-40" aria-hidden="true"
             style="background:radial-gradient(ellipse at 50% 0%,rgba(107,143,255,0.18),transparent 60%);"></div>

        <div class="relative px-6 pt-14 pb-32">
          <header class="flex items-center justify-between mb-2">
            <div>
              <p class="bracket-label text-warm-500">Mindfulness</p>
              <h1 class="font-display text-[30px] font-light text-warm-50 mt-0.5">Find your calm</h1>
            </div>
            <button type="button" class="icon-btn glass" aria-label="Search practices">
              <i data-lucide="search" class="w-4 h-4" aria-hidden="true"></i>
            </button>
          </header>

          <!-- Hero featured -->
          <article class="hero-card relative rounded-3xl overflow-hidden h-48 mb-5 mt-5"
                   style="background:linear-gradient(135deg,#9BC4B0 0%,#8AA3FF 50%,#A89AE0 100%);"
                   aria-labelledby="hero-title">
            <div class="absolute inset-0 mesh-bg opacity-30" aria-hidden="true"></div>
            <div class="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-warm-50/15 blur-2xl" aria-hidden="true"></div>
            <div class="absolute inset-0 flex flex-col justify-end p-5">
              <span class="chip mb-2 w-fit !bg-white/20 !text-warm-50 !border-white/20">Featured &middot; <span class="font-mono">10 min</span></span>
              <p id="hero-title" class="font-display text-[26px] font-light text-warm-50 leading-tight">Monday reset<br/><span class="italic">meditation</span></p>
              <p class="text-[11px] text-warm-50/80 mt-1">Start your week grounded and clear.</p>
            </div>
            <button type="button" class="absolute top-5 right-5 icon-btn" style="width:48px;height:48px;background:rgba(245,241,234,0.95);color:#040818;box-shadow:0 10px 30px -10px rgba(0,0,0,0.5);" aria-label="Play featured meditation">
              <i data-lucide="play" class="w-5 h-5 ml-0.5" aria-hidden="true"></i>
            </button>
          </article>

          <!-- Categories -->
          <div class="flex gap-2 mb-5 scroll-x -mx-6 px-6" role="tablist" aria-label="Categories">
            ${categories.map((c,i)=>`
              <button type="button" role="tab" aria-selected="${i===0?'true':'false'}"
                      class="chip whitespace-nowrap ${i===0?'!bg-sage-300/15 !border-sage-300/40 !text-sage-300':''}"
                      style="min-height:36px;">${c}</button>
            `).join('')}
          </div>

          <!-- Grid -->
          <div class="grid grid-cols-2 gap-3" role="list">
            ${sessions.map(s => `
              <button type="button" class="glass rounded-2xl p-4 text-left flex flex-col gap-2 h-36 relative overflow-hidden" role="listitem">
                <div class="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-30" aria-hidden="true"
                     style="background:radial-gradient(circle,rgba(${s.hue},0.55),transparent 70%);filter:blur(8px);"></div>
                <div class="w-10 h-10 rounded-xl flex items-center justify-center relative" style="background:rgba(${s.hue},0.12);border:1px solid rgba(${s.hue},0.22);">
                  <i data-lucide="${s.icon}" class="w-5 h-5" style="color:rgb(${s.hue});" aria-hidden="true"></i>
                </div>
                <div class="mt-auto relative">
                  <p class="text-[13px] font-medium text-warm-50 leading-tight">${s.title}</p>
                  <p class="text-[10px] text-warm-500 mt-0.5 font-mono">${s.time}</p>
                </div>
              </button>
            `).join('')}
          </div>
        </div>
        ${tabBar('home')}
      </div>
    `;
  },
};
