// 16 — Biometric / Face ID primer
// Optional security step. Soft emphasis on privacy.

import { statusBar, miniHeader } from '../lib/helpers.js';

export const screen = {
  id: 'biometric',
  label: 'Face ID primer',
  section: 'onboarding-plus',
  render: () => `
    ${statusBar}
    <div class="bg-midnight-950 h-full relative">
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 breath-orb opacity-40" aria-hidden="true"></div>

      <div class="relative px-6 pt-14 pb-8 h-full flex flex-col">
        ${miniHeader('Security')}

        <div class="flex-1 flex flex-col items-center justify-center text-center">
          <div class="w-32 h-32 rounded-3xl border-2 border-sage-300/30 flex items-center justify-center mb-8 relative" aria-hidden="true">
            <div class="absolute inset-3 border-2 border-dashed border-sage-300/20 rounded-2xl"></div>
            <div class="absolute inset-0 rounded-3xl" style="background:radial-gradient(circle,rgba(155,196,176,0.15),transparent 70%);"></div>
            <i data-lucide="scan-face" class="w-16 h-16 text-sage-300 relative z-10"></i>
          </div>

          <p class="bracket-label text-aurora-300 mb-3">Optional &middot; 2 seconds</p>
          <h1 class="font-display text-[30px] font-light text-warm-50 leading-[1.05] mb-4">
            Use Face ID<br/>
            <span class="italic">for quick access?</span>
          </h1>
          <p class="text-[13px] text-warm-400 leading-relaxed max-w-[280px] mb-10">
            Your journal entries and conversations stay private &mdash; even from people who have your phone.
          </p>

          <div class="w-full">
            <button type="button" class="btn btn-primary w-full mb-3">Turn on Face ID</button>
            <button type="button" class="w-full text-sm text-warm-400 font-medium py-3">Maybe later</button>
          </div>
        </div>
      </div>
    </div>
  `,
};
