// 27 — CBT thought record
// 5-step cognitive behavioral therapy flow. Step 2: examining the thought.

import { statusBar, miniHeader } from '../lib/helpers.js';

export const screen = {
  id: 'cbt',
  label: 'CBT thought record',
  section: 'therapy',
  render: () => {
    const steps = [
      { done: true, label: 'Situation' },
      { active: true, label: 'Thought' },
      { label: 'Emotion' },
      { label: 'Reframe' },
      { label: 'Action' },
    ];
    const distortions = [
      { label: 'Catastrophizing',   on: true },
      { label: 'Mind reading',      on: true },
      { label: 'All-or-nothing',    on: false },
      { label: 'Personalization',   on: false },
      { label: 'Should statements', on: false },
    ];
    return `
      ${statusBar}
      <div class="bg-midnight-950 h-full relative">
        <div class="absolute top-0 left-0 right-0 h-80 opacity-40" aria-hidden="true"
             style="background:radial-gradient(ellipse at 70% 0%,rgba(244,167,126,0.15),transparent 60%);"></div>

        <div class="relative px-6 pt-14 pb-32">
          ${miniHeader('Thought record', '<span class="text-[10px] text-warm-500 font-mono">2 of 5</span>')}

          <p class="bracket-label text-aurora-300 mb-2">Cognitive behavioral therapy</p>
          <h1 class="font-display text-[26px] font-light text-warm-50 leading-[1.1] mb-6">
            Let&rsquo;s examine<br/>
            <span class="italic">that thought.</span>
          </h1>

          <!-- Progress stepper -->
          <ol class="flex gap-1.5 mb-6" role="progressbar" aria-valuenow="2" aria-valuemin="1" aria-valuemax="5" aria-label="CBT step 2 of 5">
            ${steps.map(s => `
              <li class="flex-1">
                <div class="h-1.5 rounded-full ${s.done?'bg-sage-300':s.active?'bg-peach-300':'bg-white/5'}"></div>
                <p class="text-[9px] mt-1.5 ${s.done?'text-sage-300':s.active?'text-peach-300':'text-warm-500'} bracket-label">${s.label}</p>
              </li>
            `).join('')}
          </ol>

          <!-- Previous answer -->
          <div class="glass rounded-2xl p-3 mb-3 flex items-start gap-3">
            <i data-lucide="rotate-ccw" class="w-3.5 h-3.5 text-warm-500 mt-0.5" aria-hidden="true"></i>
            <div class="flex-1">
              <p class="bracket-label text-warm-500 mb-1">Situation</p>
              <p class="text-[12px] text-warm-200">I have a team meeting at 3 PM and I&rsquo;ll need to present an update.</p>
            </div>
          </div>

          <!-- Current question -->
          <section class="hero-card glass-strong rounded-2xl p-5 mb-3 border border-peach-300/22" aria-labelledby="thought-heading">
            <p id="thought-heading" class="bracket-label text-peach-300 mb-2">Now &rarr; what&rsquo;s the thought?</p>
            <label for="cbt-thought" class="text-[13px] text-warm-50 mb-4 block">What was running through your mind?</label>
            <textarea id="cbt-thought"
                      class="w-full bg-white/4 rounded-xl p-3 text-[12px] text-warm-50 border border-white/8 outline-none h-24 resize-none placeholder-warm-500 leading-relaxed">I&rsquo;m going to mess this up and everyone will judge me for it.</textarea>

            <fieldset class="mt-4">
              <legend class="bracket-label text-warm-500 mb-2.5">Any of these feel familiar?</legend>
              <div class="flex flex-wrap gap-1.5">
                ${distortions.map(d => `
                  <button type="button" aria-pressed="${d.on?'true':'false'}"
                          class="chip ${d.on?'!bg-peach-300/15 !border-peach-300/40 !text-peach-300':''}"
                          style="min-height:36px;">${d.label}</button>
                `).join('')}
              </div>
            </fieldset>
          </section>

          <button type="button" class="btn btn-sage w-full">
            Next step
            <i data-lucide="arrow-right" class="w-4 h-4" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    `;
  },
};
