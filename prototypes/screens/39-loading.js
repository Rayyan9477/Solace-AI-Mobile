// 39 — Loading skeleton
// Shimmering placeholder that mirrors the home layout + breathing orb loader.

import { statusBar } from '../lib/helpers.js';

export const screen = {
  id: 'loading',
  label: 'Loading skeleton',
  section: 'states',
  render: () => `
    ${statusBar}
    <div class="bg-midnight-950 h-full relative" aria-busy="true" aria-live="polite">
      <div class="absolute top-0 left-0 right-0 h-72 opacity-30" aria-hidden="true"
           style="background:radial-gradient(ellipse at 50% 0%,rgba(107,143,255,0.15),transparent 60%);"></div>

      <div class="relative px-6 pt-14 pb-32">
        <div class="flex items-center justify-between mb-3">
          <div class="skel h-3 w-32"></div>
          <div class="skel w-11 h-11 rounded-full"></div>
        </div>
        <div class="skel h-9 w-48 mb-2"></div>
        <div class="skel h-9 w-40 mb-6"></div>

        <div class="glass rounded-3xl p-5 mb-4">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1 space-y-2.5">
              <div class="skel h-3 w-20"></div>
              <div class="skel h-9 w-28"></div>
              <div class="skel h-2 w-24"></div>
            </div>
            <div class="skel w-20 h-20 rounded-full"></div>
          </div>
          <div class="skel h-2 w-full mb-1.5"></div>
          <div class="skel h-2 w-3/4"></div>
        </div>

        <div class="grid grid-cols-2 gap-3 mb-4">
          ${Array(4).fill(0).map(() => `
            <div class="glass rounded-2xl p-4">
              <div class="skel w-4 h-4 rounded-full mb-3"></div>
              <div class="skel h-7 w-16 mb-2"></div>
              <div class="skel h-1 w-full"></div>
            </div>
          `).join('')}
        </div>

        <div class="glass rounded-3xl p-5">
          <div class="flex items-center gap-3">
            <div class="skel w-12 h-12 rounded-2xl"></div>
            <div class="flex-1 space-y-2">
              <div class="skel h-3 w-3/4"></div>
              <div class="skel h-2 w-1/2"></div>
            </div>
          </div>
        </div>

        <!-- Breathing orb loader -->
        <div class="flex justify-center mt-12">
          <div class="w-16 h-16 relative" role="progressbar" aria-label="Loading your space">
            <div class="absolute inset-0 rounded-full border border-sage-300/15"></div>
            <div class="absolute inset-2 rounded-full border border-aurora-300/25"></div>
            <div class="absolute inset-4 rounded-full breath-orb"></div>
          </div>
        </div>
        <p class="text-center bracket-label text-warm-500 mt-4">Preparing your space&hellip;</p>
      </div>
    </div>
  `,
};
