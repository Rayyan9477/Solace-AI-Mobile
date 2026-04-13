// 20 — Home v2 (emotional check-in first)
// Same hero flow as screen 05 but leading with "How are you right now?" instead of Solace score.

import { statusBar, tabBar, moodFace } from '../lib/helpers.js';

export const screen = {
  id: 'home-v2',
  label: 'Home v2 (check-in)',
  section: 'daily-loop',
  render: () => `
    ${statusBar}
    <div class="bg-midnight-950 h-full relative">
      <div class="absolute top-0 left-0 right-0 h-80 opacity-50" aria-hidden="true"
           style="background:radial-gradient(ellipse at top,rgba(107,143,255,0.18),transparent 60%);"></div>

      <div class="relative px-6 pt-14 pb-32">
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

        <!-- Check-in hero -->
        <section class="hero-card glass-aurora rounded-3xl p-5 mt-5 relative overflow-hidden" aria-labelledby="checkin-q">
          <div class="absolute -top-10 -right-10 w-40 h-40 breath-orb opacity-65" aria-hidden="true"></div>
          <p id="checkin-q" class="relative text-sm text-warm-50 font-medium mb-4">How are you right now?</p>
          <div class="relative flex justify-between items-end gap-2" role="radiogroup" aria-label="Current mood">
            ${[1,2,3,4,5].map(i => {
              const labels = {1:'Struggling',2:'Down',3:'Neutral',4:'Content',5:'Overjoyed'};
              return `
              <button type="button" role="radio" aria-checked="${i===4?'true':'false'}"
                      aria-label="${labels[i]}"
                      class="flex-1 flex flex-col items-center gap-1.5 ${i===4?'scale-110':''}"
                      style="min-height:44px;">
                <div class="${i===4?'ring-2 ring-sage-300 ring-offset-2 ring-offset-midnight-800 rounded-full':''}">
                  ${moodFace(i, 40)}
                </div>
              </button>
            `}).join('')}
          </div>
        </section>

        <!-- Solace + streak compact -->
        <div class="grid grid-cols-2 gap-3 mt-4">
          <div class="glass rounded-2xl p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="bracket-label text-warm-500">Solace</span>
              <i data-lucide="trending-up" class="w-3.5 h-3.5 text-sage-300" aria-hidden="true"></i>
            </div>
            <p class="font-display text-[28px] font-light text-warm-50 leading-none">72<span class="text-base text-warm-400 font-mono">/100</span></p>
            <p class="text-[10px] text-sage-300 mt-1.5">+5 this week</p>
          </div>
          <div class="glass rounded-2xl p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="bracket-label text-warm-500">Streak</span>
              <i data-lucide="flame" class="w-3.5 h-3.5 text-peach-300" aria-hidden="true"></i>
            </div>
            <p class="font-display text-[28px] font-light text-warm-50 leading-none">23<span class="text-base text-warm-400 font-mono">d</span></p>
            <div class="flex gap-0.5 mt-2" aria-hidden="true">
              ${Array(7).fill(0).map((_,i)=>`<div class="flex-1 h-0.5 rounded-full ${i<6?'bg-peach-300':'bg-white/8'}"></div>`).join('')}
            </div>
          </div>
        </div>

        <!-- AI continue -->
        <button type="button" class="w-full mt-4 hero-card rounded-3xl p-5 relative overflow-hidden text-left"
                style="background: linear-gradient(135deg, rgba(155,196,176,0.18) 0%, rgba(107,143,255,0.12) 50%, rgba(168,154,224,0.12) 100%); border: 1px solid rgba(155,196,176,0.25);">
          <div class="absolute -bottom-16 -right-16 w-44 h-44 breath-orb" aria-hidden="true"></div>
          <div class="relative flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-sage-300 via-aurora-300 to-lavender-300 flex items-center justify-center flex-shrink-0"
                 style="box-shadow: 0 0 40px -8px rgba(155,196,176,0.55);">
              <i data-lucide="sparkles" class="w-6 h-6 text-midnight-950" aria-hidden="true"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="bracket-label text-aurora-300 mb-1">Pick up where you left off</p>
              <p class="text-sm font-medium text-warm-50 leading-snug truncate">&ldquo;Let&rsquo;s talk about that meeting&hellip;&rdquo;</p>
              <p class="text-[10px] text-warm-500 mt-1 font-mono">3 min ago &middot; 12 messages</p>
            </div>
            <i data-lucide="arrow-right" class="w-4 h-4 text-warm-400" aria-hidden="true"></i>
          </div>
        </button>

        <!-- Today's practice -->
        <section class="mt-6" aria-labelledby="practice-heading">
          <div class="flex justify-between items-baseline mb-3">
            <h3 id="practice-heading" class="font-display text-lg text-warm-50">Today&rsquo;s practice</h3>
            <button type="button" class="text-[11px] text-aurora-300 font-medium">All practices &rarr;</button>
          </div>
          <div class="flex gap-3 scroll-x -mx-6 px-6" role="list">
            ${[
              { tag: 'Breathing',   title: '4-7-8 calming breath', time: '4 min',  icon: 'wind',       hue: '155,196,176' },
              { tag: 'Mindfulness', title: 'Body scan',            time: '10 min', icon: 'user-round', hue: '168,154,224' },
              { tag: 'CBT',         title: 'Thought record',       time: '6 min',  icon: 'feather',    hue: '244,167,126' },
            ].map(a => `
              <article class="w-44 flex-shrink-0 glass rounded-2xl p-4" role="listitem">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style="background:rgba(${a.hue},0.12);border:1px solid rgba(${a.hue},0.2);">
                  <i data-lucide="${a.icon}" class="w-4 h-4" style="color:rgb(${a.hue});" aria-hidden="true"></i>
                </div>
                <span class="text-[9px] bracket-label" style="color:rgb(${a.hue});">${a.tag}</span>
                <p class="text-[13px] font-medium text-warm-50 mt-1 leading-snug">${a.title}</p>
                <p class="text-[10px] text-warm-500 mt-1 font-mono">${a.time}</p>
              </article>
            `).join('')}
          </div>
        </section>
      </div>
      ${tabBar('home')}
    </div>
  `,
};
