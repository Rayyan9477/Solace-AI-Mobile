// 42 — 404 Not found
// Editorial giant number with breathing orb + warm copy.

import { statusBar } from '../lib/helpers.js';
import { illustrationCompass } from '../lib/illustrations.js';

export const screen = {
  id: 'not-found',
  label: '404 not found',
  section: 'states',
  render: () => `
    ${statusBar}
    <div class="bg-midnight-950 h-full relative">
      <div class="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 breath-orb opacity-45" aria-hidden="true"></div>

      <div class="relative px-6 pt-14 h-full flex flex-col">
        <div class="flex justify-start">
          <button type="button" class="icon-btn glass" aria-label="Go back">
            <i data-lucide="arrow-left" class="w-4 h-4" aria-hidden="true"></i>
          </button>
        </div>

        <div class="flex-1 flex flex-col items-center justify-center text-center">
          <div class="relative mb-6" role="img" aria-label="Page not found">
            <!-- Ghost 404 number behind the compass -->
            <p class="font-display text-[120px] font-light text-warm-50/6 leading-none tracking-tighter text-center" aria-hidden="true">404</p>
            <!-- Compass illustration centred over the number -->
            <div class="absolute inset-0 flex items-center justify-center" aria-hidden="true">
              <div class="w-36 h-36 opacity-92" style="filter: drop-shadow(0 0 24px rgba(107,143,255,0.30));">
                ${illustrationCompass}
              </div>
            </div>
          </div>

          <p class="bracket-label text-aurora-300 mb-2">This page doesn&rsquo;t exist</p>
          <h1 class="font-display text-[26px] font-light text-warm-50 leading-[1.1] mb-3">
            Let&rsquo;s get you<br/>
            <span class="italic">back to calm.</span>
          </h1>
          <p class="text-[13px] text-warm-400 max-w-[260px] mx-auto mb-8">
            The page you&rsquo;re looking for has moved, or perhaps it was never here.
          </p>

          <button type="button" class="btn btn-sage w-full max-w-xs">
            <i data-lucide="home" class="w-4 h-4" aria-hidden="true"></i>
            Back home
          </button>
        </div>
      </div>
    </div>
  `,
};
