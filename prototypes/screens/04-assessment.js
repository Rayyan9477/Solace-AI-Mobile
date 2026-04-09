// 04 — Assessment question
// Question 4 of 14 in the GAD-7/PHQ-9/PSS check-in flow.

import { statusBar } from '../lib/helpers.js';

export const screen = {
  id: 'assessment',
  label: 'Assessment',
  section: 'auth',
  render: () => {
    const options = [
      { icon: 'sun',             label: 'Mostly good', desc: 'Feeling balanced and content' },
      { icon: 'cloud',           label: 'Neutral',     desc: 'Just going through the motions', selected: true },
      { icon: 'cloud-rain',      label: 'A bit low',   desc: 'More down than usual' },
      { icon: 'cloud-lightning', label: 'Struggling',  desc: 'Things feel heavy right now' },
    ];
    return `
      ${statusBar}
      <div class="bg-midnight-950 h-full relative">
        <div class="absolute top-0 left-0 right-0 h-56 mesh-bg opacity-50" aria-hidden="true"></div>

        <div class="relative px-7 pt-16">
          <header class="flex items-center justify-between mb-10">
            <button type="button" class="icon-btn glass" aria-label="Previous question">
              <i data-lucide="arrow-left" class="w-4 h-4" aria-hidden="true"></i>
            </button>
            <div class="text-center">
              <p class="bracket-label text-warm-500">Question</p>
              <p class="text-sm font-medium font-mono text-warm-50 mt-0.5">04 / 14</p>
            </div>
            <button type="button" class="icon-btn glass" aria-label="Help with this question">
              <i data-lucide="help-circle" class="w-4 h-4 text-warm-400" aria-hidden="true"></i>
            </button>
          </header>

          <!-- Progress ring -->
          <div class="flex flex-col items-center mb-8">
            <div class="ring-progress w-24 h-24 mb-2" style="--p: 29%;" role="progressbar" aria-valuenow="29" aria-valuemin="0" aria-valuemax="100" aria-label="Assessment progress">
              <div>
                <span class="font-mono text-[11px] text-warm-50 font-medium">29%</span>
                <span class="text-[8px] text-warm-500 mt-0.5 bracket-label">complete</span>
              </div>
            </div>
            <span class="chip mt-1">
              <i data-lucide="sparkles" class="w-3 h-3 text-sage-300" aria-hidden="true"></i>
              Solace is listening
            </span>
          </div>

          <p class="bracket-label text-aurora-300 mb-3 text-center">Mental health check</p>
          <h2 class="font-display text-[26px] font-light text-warm-50 text-center leading-[1.15] mb-8">
            How have you been<br/>
            <span class="italic">feeling lately?</span>
          </h2>

          <!-- Previous answer chip -->
          <div class="flex justify-center mb-5">
            <div class="chip">
              <i data-lucide="rotate-ccw" class="w-3 h-3 text-warm-500" aria-hidden="true"></i>
              Earlier you said: <span class="text-warm-200">Neutral</span>
            </div>
          </div>

          <!-- Options (radiogroup) -->
          <div class="space-y-2.5 pb-32" role="radiogroup" aria-labelledby="question-text">
            ${options.map((o, i) => `
              <button type="button"
                      role="radio"
                      aria-checked="${o.selected ? 'true' : 'false'}"
                      class="w-full ${o.selected ? 'bg-sage-300/12 border-sage-300/60' : 'glass'} border rounded-2xl px-4 py-4 flex items-center gap-4 text-left transition-all"
                      style="min-height:72px;">
                <div class="w-11 h-11 rounded-xl ${o.selected ? 'bg-sage-300/20 border border-sage-300/35' : 'bg-white/4 border border-white/5'} flex items-center justify-center flex-shrink-0">
                  <i data-lucide="${o.icon}" class="w-5 h-5 ${o.selected ? 'text-sage-300' : 'text-warm-400'}" aria-hidden="true"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-warm-50">${o.label}</p>
                  <p class="text-[11px] text-warm-500 mt-0.5">${o.desc}</p>
                </div>
                <div class="w-5 h-5 rounded-full ${o.selected ? 'bg-sage-300 border-sage-300' : 'border-warm-500'} border flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  ${o.selected ? '<i data-lucide="check" class="w-3 h-3 text-midnight-950" stroke-width="3"></i>' : ''}
                </div>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Sticky CTA -->
        <div class="absolute bottom-0 left-0 right-0 px-7 pb-8 pt-6 bg-gradient-to-t from-midnight-950 via-midnight-950 to-transparent">
          <button type="button" class="btn btn-sage w-full">
            Next question
            <i data-lucide="arrow-right" class="w-4 h-4" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    `;
  },
};
