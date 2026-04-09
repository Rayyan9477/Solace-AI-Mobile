// 18 — Assessment intro
// Pre-assessment trust moment. Explains the flow before the user begins.

import { statusBar, miniHeader } from '../lib/helpers.js';

export const screen = {
  id: 'assessment-intro',
  label: 'Assessment intro',
  section: 'onboarding-plus',
  render: () => `
    ${statusBar}
    <div class="bg-midnight-950 h-full relative">
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 breath-orb opacity-50" aria-hidden="true"></div>

      <div class="relative px-6 pt-14 pb-8 h-full flex flex-col">
        ${miniHeader('Check-in')}

        <div class="flex-1 flex flex-col justify-center text-center">
          <div class="mx-auto mb-7 relative">
            <div class="w-24 h-24 rounded-full bg-gradient-to-br from-sage-300/30 via-aurora-300/25 to-lavender-300/25 backdrop-blur-xl border border-sage-300/30 flex items-center justify-center"
                 style="box-shadow: 0 0 40px -8px rgba(155,196,176,0.5);">
              <i data-lucide="shield-check" class="w-10 h-10 text-sage-300" aria-hidden="true"></i>
            </div>
          </div>

          <p class="bracket-label text-aurora-300 mb-3">Mental health check</p>
          <h1 class="font-display text-[30px] font-light text-warm-50 leading-[1.05] mb-3">
            A quiet check-in<br/>
            <span class="italic">just for you.</span>
          </h1>
          <p class="text-[13px] text-warm-400 leading-relaxed max-w-[280px] mx-auto mb-7">
            14 questions based on the validated GAD-7, PHQ-9 and PSS scales. There are no wrong answers.
          </p>

          <div class="flex gap-2 justify-center mb-10 flex-wrap">
            <span class="chip"><i data-lucide="clock" class="w-3 h-3 text-sage-300" aria-hidden="true"></i><span class="font-mono">5-7</span> minutes</span>
            <span class="chip"><i data-lucide="lock" class="w-3 h-3 text-sage-300" aria-hidden="true"></i>Private</span>
            <span class="chip"><i data-lucide="file-text" class="w-3 h-3 text-sage-300" aria-hidden="true"></i><span class="font-mono">14</span> questions</span>
          </div>

          <button type="button" class="btn btn-sage w-full mb-3">
            Begin
            <i data-lucide="arrow-right" class="w-4 h-4" aria-hidden="true"></i>
          </button>
          <button type="button" class="text-[11px] text-warm-500 py-3">
            Learn how we protect your data
          </button>
        </div>
      </div>
    </div>
  `,
};
