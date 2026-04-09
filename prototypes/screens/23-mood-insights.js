// 23 — Mood insights
// Pattern detection hero + mood × sleep correlation scatter plot + supporting insights.

import { statusBar, tabBar, miniHeader } from '../lib/helpers.js';

export const screen = {
  id: 'mood-insights',
  label: 'Mood insights',
  section: 'daily-loop',
  render: () => {
    const insights = [
      { icon: 'sun',       title: 'You feel brighter after sunlight', desc: '21% boost on outdoor-activity days',    hue: '244,167,126' },
      { icon: 'users',     title: 'Social time matters',              desc: 'Mood jumps when you log family or friends', hue: '155,196,176' },
      { icon: 'briefcase', title: 'Mondays are harder',               desc: 'Consider a Sunday wind-down ritual',    hue: '168,154,224' },
    ];
    const dots = [[55,90,3],[75,75,4],[95,65,4],[115,40,5],[130,55,4],[60,100,2],[150,35,5],[85,80,3],[175,45,5],[195,30,5],[105,70,4],[155,50,4]];
    return `
      ${statusBar}
      <div class="bg-midnight-950 h-full relative">
        <div class="absolute top-0 left-0 right-0 h-72 opacity-40" aria-hidden="true"
             style="background:radial-gradient(ellipse at 60% 0%,rgba(107,143,255,0.18),transparent 60%);"></div>

        <div class="relative px-6 pt-14 pb-32">
          ${miniHeader('Insights')}
          <h1 class="font-display text-[30px] font-light text-warm-50 leading-tight">What we&rsquo;ve learned</h1>
          <p class="text-[13px] text-warm-400 mt-1 mb-6">From 23 days of data &middot; AI-analyzed</p>

          <!-- Key pattern hero -->
          <article class="hero-card rounded-3xl p-5 mb-4 relative overflow-hidden"
                   style="background:linear-gradient(135deg, rgba(155,196,176,0.18), rgba(107,143,255,0.12)); border:1px solid rgba(155,196,176,0.25);">
            <div class="absolute -top-10 -right-10 w-40 h-40 breath-orb opacity-60" aria-hidden="true"></div>
            <div class="relative">
              <span class="chip mb-3"><i data-lucide="sparkles" class="w-3 h-3 text-aurora-300" aria-hidden="true"></i>Pattern detected</span>
              <p class="font-display text-[20px] text-warm-50 italic leading-snug">You feel calmer after 7+ hours of sleep.</p>
              <p class="text-[11px] text-warm-400 mt-2.5 leading-relaxed">
                Your mood score averages <span class="text-sage-300 font-mono">78</span> on well-rested days
                vs. <span class="text-peach-300 font-mono">62</span> on short nights. Protecting sleep is high-leverage for you.
              </p>
            </div>
          </article>

          <!-- Correlation scatter -->
          <figure class="glass rounded-2xl p-5 mb-4">
            <figcaption class="flex justify-between items-baseline mb-1">
              <p class="text-sm font-medium text-warm-50">Mood &times; Sleep correlation</p>
              <span class="bracket-label text-warm-500">23 days</span>
            </figcaption>
            <p class="text-[10px] text-warm-500 mb-4">Each dot is one day</p>
            <svg viewBox="0 0 300 140" class="w-full h-32" role="img" aria-label="Scatter plot showing positive correlation between sleep duration and mood">
              <line x1="30" y1="10" x2="30" y2="120" stroke="rgba(255,255,255,0.08)"/>
              <line x1="30" y1="120" x2="290" y2="120" stroke="rgba(255,255,255,0.08)"/>
              ${dots.map(([x,y,m]) => {
                const c = ['#6B5BA8','#A89AE0','#C7BEA9','#9BC4B0','#F4A77E'][m-1];
                return `<circle cx="${x+30}" cy="${y}" r="5" fill="${c}" opacity="0.85"/>`;
              }).join('')}
              <line x1="40" y1="110" x2="280" y2="30" stroke="#8AA3FF" stroke-width="1.5" stroke-dasharray="3 4" opacity="0.6"/>
              <text x="30" y="135" fill="#5A6478" font-size="9" font-family="Fira Code">5h</text>
              <text x="280" y="135" fill="#5A6478" font-size="9" font-family="Fira Code">10h</text>
              <text x="5" y="20" fill="#5A6478" font-size="9" font-family="Fira Code">5</text>
              <text x="5" y="120" fill="#5A6478" font-size="9" font-family="Fira Code">1</text>
            </svg>
          </figure>

          <!-- Supporting insights -->
          <ul class="space-y-2.5">
            ${insights.map(i => `
              <li class="glass rounded-2xl p-4 flex items-start gap-3">
                <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style="background:rgba(${i.hue},0.12);border:1px solid rgba(${i.hue},0.2);">
                  <i data-lucide="${i.icon}" class="w-4 h-4" style="color:rgb(${i.hue});" aria-hidden="true"></i>
                </div>
                <div class="flex-1">
                  <p class="text-[12px] font-medium text-warm-50">${i.title}</p>
                  <p class="text-[10px] text-warm-500 mt-0.5">${i.desc}</p>
                </div>
              </li>
            `).join('')}
          </ul>
        </div>
        ${tabBar('mood')}
      </div>
    `;
  },
};
