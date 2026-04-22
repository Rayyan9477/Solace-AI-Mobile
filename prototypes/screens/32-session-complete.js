// 32 — Session complete (celebration)
// Success ring with sparkles + streak stats + next-step CTAs.

import { statusBar } from '../lib/helpers.js';
import { illustrationWave } from '../lib/illustrations.js';

export const screen = {
  id: 'session-complete',
  label: 'Session complete',
  section: 'mindful-sleep',
  render: () => {
    const stats = [
      { v: '24', u: '',  l: 'Total min' },
      { v: '23', u: 'd', l: 'Streak' },
      { v: '+2', u: '',  l: 'Mood points' },
    ];
    return `
      ${statusBar}
      <div class="h-full relative" style="background:radial-gradient(ellipse at top,#161D3D,#040818 70%);">
        <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div class="absolute top-20 left-10 w-72 h-72 breath-orb opacity-55"></div>
          <div class="absolute top-40 right-20 w-44 h-44 rounded-full" style="background:radial-gradient(circle,rgba(244,167,126,0.32),transparent 70%);filter:blur(20px);"></div>
        </div>

        <div class="relative z-10 px-6 pt-16 pb-8 h-full flex flex-col">
          <div class="flex justify-end">
            <button type="button" class="icon-btn glass" aria-label="Close celebration">
              <i data-lucide="x" class="w-4 h-4" aria-hidden="true"></i>
            </button>
          </div>

          <div class="flex-1 flex flex-col items-center justify-center text-center">
            <!-- Wave illustration above the success ring -->
            <div class="w-56 h-44 mb-2 opacity-90" aria-hidden="true"
                 style="filter: drop-shadow(0 0 28px rgba(155,196,176,0.28));">
              ${illustrationWave}
            </div>

            <!-- Success ring -->
            <div class="relative mb-6" role="img" aria-label="Session completed successfully">
              <div class="absolute -inset-6 rounded-full border border-sage-300/15" aria-hidden="true"></div>
              <div class="absolute -inset-3 rounded-full border border-aurora-300/22" aria-hidden="true"></div>
              <div class="w-32 h-32 rounded-full border-2 border-sage-300/28 flex items-center justify-center">
                <div class="w-24 h-24 rounded-full bg-gradient-to-br from-sage-300 via-aurora-300 to-sage-700 flex items-center justify-center"
                     style="box-shadow: 0 0 60px -10px rgba(107,143,255,0.5);">
                  <i data-lucide="check" class="w-12 h-12 text-midnight-950" stroke-width="2.5" aria-hidden="true"></i>
                </div>
              </div>
              <i data-lucide="sparkle" class="w-4 h-4 text-peach-300 absolute -top-2 right-0 anim-burst" aria-hidden="true"></i>
              <i data-lucide="sparkle" class="w-3 h-3 text-aurora-300 absolute bottom-4 -left-2 anim-burst" aria-hidden="true"></i>
              <i data-lucide="sparkle" class="w-2 h-2 text-lavender-300 absolute top-8 -right-3 anim-burst" aria-hidden="true"></i>
            </div>

            <p class="bracket-label text-sage-300 mb-2">Well done</p>
            <h1 class="font-display text-[36px] font-light text-warm-50 leading-[1.05] mb-3">
              That&rsquo;s 10 minutes<br/>
              <span class="italic">for yourself.</span>
            </h1>
            <p class="text-[13px] text-warm-400 max-w-[280px] mx-auto mb-8">
              You completed the Monday reset meditation. Small actions compound.
            </p>

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-3 w-full max-w-[320px] mb-8" role="group" aria-label="Session stats">
              ${stats.map(s => `
                <div class="glass rounded-2xl p-3 text-center">
                  <p class="font-display text-[22px] font-light text-warm-50">
                    ${s.v}<span class="text-[10px] text-warm-400 ml-0.5 font-mono">${s.u}</span>
                  </p>
                  <p class="text-[9px] text-warm-500 mt-0.5 bracket-label">${s.l}</p>
                </div>
              `).join('')}
            </div>
          </div>

          <button type="button" class="btn btn-primary w-full mb-2">How do you feel now?</button>
          <button type="button" class="w-full text-[12px] text-warm-400 py-3">Back to library</button>
        </div>
      </div>
    `;
  },
};
