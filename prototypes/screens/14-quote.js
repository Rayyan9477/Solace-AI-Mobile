// 14 — Quote splash
// Editorial loading moment with a therapeutic quote.

import { statusBar } from '../lib/helpers.js';

export const screen = {
  id: 'quote',
  label: 'Quote splash',
  section: 'brand',
  render: () => `
    ${statusBar}
    <div class="h-full relative mesh-bg">
      <div class="absolute top-20 right-10 w-48 h-48 smoke opacity-70" aria-hidden="true"></div>
      <div class="absolute bottom-32 left-8 w-40 h-40 breath-orb opacity-50" aria-hidden="true"></div>

      <div class="absolute inset-0 flex flex-col items-center justify-center px-10 text-center">
        <i data-lucide="quote" class="w-7 h-7 text-sage-300/40 mb-6" style="transform: scaleX(-1);" aria-hidden="true"></i>
        <blockquote class="font-display text-[28px] text-warm-50 italic leading-[1.2] font-light">
          Almost everything<br/>will work again<br/>if you unplug it<br/>for a few minutes<br/>
          <span class="not-italic text-aurora-300">&mdash;</span> <span class="text-2xl">including you.</span>
        </blockquote>
        <p class="bracket-label text-aurora-300 mt-8">Anne Lamott</p>

        <div class="absolute bottom-20 left-0 right-0 flex flex-col items-center px-12">
          <div class="w-full max-w-[200px] h-0.5 bg-white/5 rounded-full overflow-hidden mb-3" role="progressbar" aria-valuenow="33" aria-valuemin="0" aria-valuemax="100" aria-label="Loading progress">
            <div class="h-full w-1/3 bg-gradient-to-r from-sage-300 to-aurora-300 rounded-full"></div>
          </div>
          <p class="bracket-label text-warm-500">Preparing your space&hellip;</p>
        </div>
      </div>
    </div>
  `,
};
