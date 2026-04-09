// 33 — Sleep log entry
// Night-sky scenery + bedtime/woke times + quality slider + wake-up tags.

import { statusBar, miniHeader } from '../lib/helpers.js';

export const screen = {
  id: 'sleep-log',
  label: 'Sleep log entry',
  section: 'mindful-sleep',
  render: () => {
    const feelings = [
      { label: 'Rested',    on: true },
      { label: 'Groggy' },
      { label: 'Anxious' },
      { label: 'Energized', on: true },
      { label: 'Sore' },
      { label: 'Refreshed' },
    ];
    const stars = Array(20).fill(0).map((_,i)=>{
      const x = (i*137)%380;
      const y = (i*89)%260;
      return `<div class="absolute w-0.5 h-0.5 rounded-full bg-white/40" style="left:${x}px;top:${y}px;"></div>`;
    }).join('');

    return `
      ${statusBar}
      <div class="h-full relative" style="background:linear-gradient(180deg,#161D3D 0%,#0E1430 35%,#040818 100%);">
        <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
          ${stars}
          <div class="absolute top-10 right-12 w-48 h-48 smoke opacity-70"></div>
          <div class="absolute top-32 left-12 w-40 h-40 rounded-full" style="background:radial-gradient(circle,rgba(168,154,224,0.22),transparent 70%);filter:blur(22px);"></div>
        </div>

        <div class="relative z-10 px-6 pt-14 pb-8">
          ${miniHeader('Last night')}

          <div class="text-center mb-7">
            <i data-lucide="moon" class="w-9 h-9 text-lavender-300 mx-auto mb-3" aria-hidden="true"></i>
            <p class="bracket-label text-lavender-300 mb-2">Log your sleep</p>
            <h1 class="font-display text-[30px] font-light text-warm-50 leading-[1.05]">
              How did you<br/>
              <span class="italic">rest?</span>
            </h1>
          </div>

          <!-- Time picker row -->
          <div class="grid grid-cols-2 gap-3 mb-5">
            <button type="button" class="hero-card glass-strong rounded-2xl p-4 text-center" aria-label="Bedtime 11:14 PM">
              <p class="bracket-label text-warm-500 mb-2"><i data-lucide="moon" class="w-2.5 h-2.5 inline mr-1" aria-hidden="true"></i>Bedtime</p>
              <p class="font-mono text-[24px] text-warm-50 font-light">11:14<span class="text-[14px] text-warm-400 ml-0.5">PM</span></p>
            </button>
            <button type="button" class="hero-card glass-strong rounded-2xl p-4 text-center" aria-label="Woke up 7:02 AM">
              <p class="bracket-label text-warm-500 mb-2"><i data-lucide="sun" class="w-2.5 h-2.5 inline mr-1" aria-hidden="true"></i>Woke up</p>
              <p class="font-mono text-[24px] text-warm-50 font-light">7:02<span class="text-[14px] text-warm-400 ml-0.5">AM</span></p>
            </button>
          </div>

          <!-- Duration total -->
          <div class="text-center mb-6">
            <p class="font-display text-[52px] font-light text-warm-50 leading-none">7h <span class="font-mono">48m</span></p>
            <p class="text-[11px] text-sage-300 mt-2">Above your <span class="font-mono">7h</span> goal</p>
          </div>

          <!-- Quality slider -->
          <div class="glass rounded-2xl p-5 mb-4">
            <div class="flex justify-between items-center mb-3">
              <label for="sleep-quality" class="text-[13px] text-warm-50 font-medium">Quality</label>
              <output id="sleep-quality-output" for="sleep-quality" class="text-[14px] font-mono text-warm-50">86%</output>
            </div>
            <div class="relative h-2 rounded-full bg-white/5 mb-2" role="slider" id="sleep-quality" aria-valuemin="0" aria-valuemax="100" aria-valuenow="86" aria-label="Sleep quality">
              <div class="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-lavender-300 to-sage-300" style="width:86%"></div>
              <div class="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-warm-50 border-2 border-lavender-300"
                   style="left:calc(86% - 10px);box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>
            </div>
            <div class="flex justify-between text-[9px] text-warm-500">
              <span>Restless</span>
              <span>Deep &amp; restful</span>
            </div>
          </div>

          <!-- Tags -->
          <fieldset class="mb-6">
            <legend class="bracket-label text-warm-500 mb-2.5">How did you feel waking up?</legend>
            <div class="flex flex-wrap gap-2">
              ${feelings.map(t => `
                <button type="button" aria-pressed="${t.on?'true':'false'}"
                        class="chip ${t.on?'!bg-lavender-300/15 !border-lavender-300/40 !text-lavender-300':''}"
                        style="min-height:36px;">${t.label}</button>
              `).join('')}
            </div>
          </fieldset>

          <button type="button" class="btn btn-lavender w-full">Save entry</button>
        </div>
      </div>
    `;
  },
};
