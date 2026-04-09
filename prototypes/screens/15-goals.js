// 15 — Goals picker
// Step 3 of 4 onboarding. Multi-select 2x4 grid of what the user wants to work on.

import { statusBar, miniHeader } from '../lib/helpers.js';

export const screen = {
  id: 'goals',
  label: 'Goals picker',
  section: 'onboarding-plus',
  render: () => {
    const goals = [
      { icon: 'alert-triangle', label: 'Anxiety',       selected: true, hue: '155,196,176' },
      { icon: 'cloud-drizzle',  label: 'Low mood',      selected: true, hue: '168,154,224' },
      { icon: 'moon',           label: 'Sleep',                          hue: '168,154,224' },
      { icon: 'activity',       label: 'Stress',        selected: true, hue: '244,167,126' },
      { icon: 'users',          label: 'Relationships',                  hue: '155,196,176' },
      { icon: 'trending-up',    label: 'Self-growth',                    hue: '244,167,126' },
      { icon: 'heart',          label: 'Grief',                          hue: '168,154,224' },
      { icon: 'focus',          label: 'Focus',                          hue: '138,163,255' },
    ];
    return `
      ${statusBar}
      <div class="bg-midnight-950 h-full relative">
        <div class="absolute top-0 left-0 right-0 h-72 mesh-bg opacity-40" aria-hidden="true"></div>

        <div class="relative px-6 pt-14">
          ${miniHeader('Step 3 of 4', '<button type="button" class="text-xs text-warm-400 font-medium px-2 py-2">Skip</button>')}

          <p class="bracket-label text-aurora-300 mb-3">What matters most</p>
          <h1 class="font-display text-[30px] font-light text-warm-50 leading-[1.05] mb-3">
            What brings you<br/>
            <span class="italic">here today?</span>
          </h1>
          <p class="text-[13px] text-warm-400 mb-7 leading-relaxed">
            Pick a few &mdash; we&rsquo;ll tailor your experience. You can change these anytime.
          </p>

          <div class="grid grid-cols-2 gap-3 pb-32" role="group" aria-label="Select your goals">
            ${goals.map(g => `
              <button type="button"
                      aria-pressed="${g.selected ? 'true' : 'false'}"
                      class="${g.selected ? '' : 'glass'} border rounded-2xl p-4 text-left flex flex-col gap-3 aspect-square justify-between transition-all"
                      style="${g.selected ? `background:rgba(${g.hue},0.12);border-color:rgba(${g.hue},0.55);` : 'border-color:rgba(255,255,255,0.06);'}">
                <div class="w-11 h-11 rounded-xl flex items-center justify-center" style="background:rgba(${g.hue},${g.selected?0.22:0.08});border:1px solid rgba(${g.hue},${g.selected?0.4:0.15});">
                  <i data-lucide="${g.icon}" class="w-5 h-5" style="color:rgb(${g.hue});" aria-hidden="true"></i>
                </div>
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium text-warm-50">${g.label}</p>
                  ${g.selected ? `<div class="w-4 h-4 rounded-full flex items-center justify-center" style="background:rgb(${g.hue});"><i data-lucide="check" class="w-2.5 h-2.5 text-midnight-950" stroke-width="3" aria-hidden="true"></i></div>` : ''}
                </div>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-6 bg-gradient-to-t from-midnight-950 via-midnight-950 to-transparent">
          <p class="text-center text-[11px] text-warm-500 mb-3" aria-live="polite">3 selected</p>
          <button type="button" class="btn btn-peach w-full">
            Continue
            <i data-lucide="arrow-right" class="w-4 h-4" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    `;
  },
};
