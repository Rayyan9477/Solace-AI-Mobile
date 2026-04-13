// 21 — Daily check-in (full screen)
// Big mood face + radio row + influence tags + log CTA.

import { statusBar, moodFace } from '../lib/helpers.js';

export const screen = {
  id: 'checkin',
  label: 'Daily check-in',
  section: 'daily-loop',
  render: () => {
    const influences = ['Work','Family','Sleep','Exercise','Food','Weather','Social','Alone'];
    return `
      ${statusBar}
      <div class="bg-midnight-950 h-full relative">
        <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 breath-orb opacity-40" aria-hidden="true"></div>

        <div class="relative px-6 pt-14 pb-8 h-full flex flex-col">
          <header class="flex justify-between items-center mb-6">
            <button type="button" class="icon-btn glass" aria-label="Close check-in">
              <i data-lucide="x" class="w-4 h-4" aria-hidden="true"></i>
            </button>
            <p class="bracket-label text-warm-500">Daily check-in</p>
            <div class="w-11 h-11" aria-hidden="true"></div>
          </header>

          <div class="flex-1 flex flex-col justify-center">
            <p class="text-center bracket-label text-aurora-300 mb-3">Right now</p>
            <h1 class="font-display text-[30px] font-light text-warm-50 text-center leading-[1.05] mb-8">
              How are you<br/>
              <span class="italic">feeling?</span>
            </h1>

            <!-- Big mood with halo -->
            <div class="flex justify-center mb-5 relative">
              <div class="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                <div class="w-44 h-44 rounded-full breath-orb opacity-55"></div>
              </div>
              <div class="relative z-10" role="img" aria-label="Current mood: Content">${moodFace(4, 130)}</div>
            </div>
            <p class="font-display text-[24px] text-center text-warm-50 italic mb-8">Content</p>

            <!-- Mood row -->
            <div class="px-2 mb-7" role="radiogroup" aria-label="Mood intensity">
              <div class="flex justify-between">
                ${[1,2,3,4,5].map(i => {
                  const labels = {1:'Struggling',2:'Down',3:'Neutral',4:'Content',5:'Overjoyed'};
                  return `
                  <button type="button" role="radio" aria-checked="${i===4?'true':'false'}"
                          aria-label="${labels[i]}"
                          class="${i===4?'ring-2 ring-sage-300 rounded-full ring-offset-2 ring-offset-midnight-950':''}"
                          style="min-height:44px;">
                    ${moodFace(i, 40)}
                  </button>
                `}).join('')}
              </div>
            </div>

            <!-- Activity tags -->
            <fieldset class="mb-6">
              <legend class="bracket-label text-warm-500 mb-3">What&rsquo;s influencing you?</legend>
              <div class="flex flex-wrap gap-2">
                ${influences.map((t,i) => `
                  <button type="button" aria-pressed="${[0,2].includes(i)?'true':'false'}"
                          class="chip ${[0,2].includes(i)?'!bg-sage-300/12 !border-sage-300/35 !text-sage-300':''}"
                          style="min-height:36px;">${t}</button>
                `).join('')}
              </div>
            </fieldset>
          </div>

          <button type="button" class="btn btn-sage w-full">
            Log this mood
            <i data-lucide="check" class="w-4 h-4" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    `;
  },
};
