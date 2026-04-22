// 13 — Splash
// Brand moment: layered concentric rings + breathing orb + logo mark.

import { statusBar } from '../lib/helpers.js';

export const screen = {
  id: 'splash',
  label: 'Splash',
  section: 'brand',
  render: () => `
    ${statusBar}
    <div class="h-full relative mesh-bg flex items-center justify-center">
      <div class="absolute top-1/4 left-1/4 w-72 h-72 smoke opacity-90" aria-hidden="true"></div>
      <div class="absolute bottom-1/4 right-1/4 w-56 h-56 breath-orb opacity-75" aria-hidden="true"></div>

      <div class="absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <div class="relative">
          <div class="w-72 h-72 rounded-full border border-aurora-300/8"></div>
          <div class="absolute inset-6 rounded-full border border-aurora-300/12"></div>
          <div class="absolute inset-14 rounded-full border border-sage-300/15"></div>
          <div class="absolute inset-22 rounded-full border border-sage-300/22"></div>
          <div class="absolute inset-28 rounded-full breath-orb"></div>
        </div>
      </div>

      <div class="relative z-10 text-center">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-sage-300 via-aurora-300 to-lavender-300 mx-auto mb-5 flex items-center justify-center"
             style="box-shadow: 0 0 60px -10px rgba(107,143,255,0.6);">
          <div class="w-4 h-4 rounded-full bg-warm-50"></div>
        </div>
        <p class="font-display text-[36px] font-light text-warm-50 tracking-tight">Solace</p>
        <p class="bracket-label text-aurora-300 mt-2">a quiet companion</p>
      </div>

      <p class="absolute bottom-12 left-0 right-0 text-center bracket-label text-warm-500">v4.2 &middot; loading&hellip;</p>
    </div>
  `,
};
