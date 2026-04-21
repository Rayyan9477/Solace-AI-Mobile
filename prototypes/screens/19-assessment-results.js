// 19 — Assessment results
// Post-assessment wrap: big score ring + breakdown bars + personalized recommendations.

import { statusBar, miniHeader } from '../lib/helpers.js';
import { illustrationGrowth } from '../lib/illustrations.js';

export const screen = {
  id: 'assessment-results',
  label: 'Assessment results',
  section: 'onboarding-plus',
  render: () => {
    const breakdown = [
      { label: 'Mood',   v: 72, hue: '155,196,176', note: 'Feeling balanced' },
      { label: 'Stress', v: 58, hue: '244,167,126', note: 'A bit elevated' },
      { label: 'Sleep',  v: 81, hue: '168,154,224', note: 'Sleeping well' },
      { label: 'Social', v: 62, hue: '138,163,255', note: 'Could connect more' },
    ];
    const recs = [
      { icon: 'wind',           label: 'Try the 4-7-8 breathing exercise', time: '4 min', hue: '155,196,176' },
      { icon: 'book-open',      label: 'Journal about your stressors',     time: '10 min', hue: '244,167,126' },
      { icon: 'message-circle', label: 'Talk to Solace about work',        time: 'Now',    hue: '138,163,255' },
    ];
    return `
      ${statusBar}
      <div class="bg-midnight-950 h-full relative">
        <div class="absolute top-0 left-0 right-0 h-96 opacity-50" aria-hidden="true"
             style="background:radial-gradient(ellipse at top,rgba(107,143,255,0.18),transparent 60%);"></div>

        <div class="relative px-6 pt-14 pb-32">
          ${miniHeader('Your results', '<button type="button" class="icon-btn" aria-label="Share results"><i data-lucide="share-2" class="w-4 h-4 text-warm-400"></i></button>')}

          <p class="bracket-label text-aurora-300 mb-3 text-center">April 9 &middot; 4 min ago</p>
          <h1 class="font-display text-[30px] font-light text-warm-50 text-center leading-[1.05] mb-2">
            You&rsquo;re doing<br/>
            <span class="italic">okay, Rayyan.</span>
          </h1>

          <!-- Growth illustration above the score ring -->
          <div class="flex justify-center mb-2 mt-2" aria-hidden="true">
            <div class="w-28 h-28 opacity-90" style="filter: drop-shadow(0 0 24px rgba(155,196,176,0.30));">
              ${illustrationGrowth}
            </div>
          </div>

          <!-- Big score ring -->
          <div class="flex justify-center my-6">
            <div class="relative w-56 h-56" role="img" aria-label="Score 68 out of 100, moderate">
              <svg viewBox="0 0 200 200" class="w-full h-full -rotate-90" aria-hidden="true">
                <circle cx="100" cy="100" r="88" stroke="rgba(255,255,255,0.05)" stroke-width="14" fill="none"/>
                <circle cx="100" cy="100" r="88" stroke="url(#ar-grad)" stroke-width="14" fill="none"
                        stroke-linecap="round" stroke-dasharray="553" stroke-dashoffset="177"/>
                <defs>
                  <linearGradient id="ar-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#9BC4B0"/>
                    <stop offset="50%" stop-color="#8AA3FF"/>
                    <stop offset="100%" stop-color="#A89AE0"/>
                  </linearGradient>
                </defs>
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <p class="font-display text-[68px] font-light text-warm-50 leading-none tracking-tight">68</p>
                <p class="text-[10px] text-warm-500 mt-1 font-mono">out of 100</p>
                <p class="bracket-label text-sage-300 mt-2">Moderate</p>
              </div>
            </div>
          </div>

          <!-- Breakdown -->
          <section class="hero-card glass-strong rounded-3xl p-5 mb-4" aria-labelledby="breakdown-heading">
            <p id="breakdown-heading" class="text-sm font-medium text-warm-50 mb-4">How it breaks down</p>
            <ul class="space-y-4">
              ${breakdown.map(b => `
                <li>
                  <div class="flex justify-between items-center mb-1.5">
                    <span class="text-[12px] text-warm-50">${b.label}</span>
                    <span class="font-mono text-[12px] text-warm-400">${b.v}</span>
                  </div>
                  <div class="h-1.5 rounded-full bg-white/5 overflow-hidden" role="progressbar" aria-valuenow="${b.v}" aria-valuemin="0" aria-valuemax="100" aria-label="${b.label} ${b.v}">
                    <div class="h-full rounded-full" style="width:${b.v}%;background:linear-gradient(90deg,rgba(${b.hue},0.7),rgba(${b.hue},1));"></div>
                  </div>
                  <p class="text-[10px] text-warm-500 mt-1">${b.note}</p>
                </li>
              `).join('')}
            </ul>
          </section>

          <!-- Recommendations -->
          <section class="glass rounded-3xl p-5 mb-4" aria-labelledby="recs-heading">
            <p id="recs-heading" class="text-sm font-medium text-warm-50 mb-3">What we suggest</p>
            <ul class="space-y-1">
              ${recs.map(r => `
                <li>
                  <button type="button" class="w-full flex items-center gap-3 px-0 text-left" style="min-height:48px;">
                    <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style="background:rgba(${r.hue},0.12);border:1px solid rgba(${r.hue},0.2);">
                      <i data-lucide="${r.icon}" class="w-4 h-4" style="color:rgb(${r.hue});" aria-hidden="true"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-[12px] text-warm-50">${r.label}</p>
                    </div>
                    <span class="text-[10px] text-warm-500 font-mono">${r.time}</span>
                    <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-warm-500" aria-hidden="true"></i>
                  </button>
                </li>
              `).join('')}
            </ul>
          </section>

          <p class="text-[10px] text-warm-500 text-center leading-relaxed px-4">
            Not a medical diagnosis. If things feel overwhelming, please reach out to a professional.
          </p>
        </div>

        <div class="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-gradient-to-t from-midnight-950 to-transparent">
          <button type="button" class="btn btn-sage w-full">Continue to Solace</button>
        </div>
      </div>
    `;
  },
};
