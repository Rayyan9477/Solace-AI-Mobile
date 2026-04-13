// 41 — Offline / network error
// Friendly, not alarming — emphasizes what still works.

import { statusBar } from '../lib/helpers.js';

export const screen = {
  id: 'offline',
  label: 'Offline state',
  section: 'states',
  render: () => `
    ${statusBar}
    <div class="bg-midnight-950 h-full relative">
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full opacity-35" aria-hidden="true"
           style="background:radial-gradient(circle,rgba(139,149,168,0.28),transparent 70%);filter:blur(32px);"></div>

      <div class="relative px-6 pt-14 h-full flex flex-col">
        <header class="flex justify-between items-center mb-4">
          <div class="w-11 h-11"></div>
          <p class="bracket-label text-warm-500">Connection</p>
          <div class="w-11 h-11"></div>
        </header>

        <div class="flex-1 flex flex-col items-center justify-center text-center px-4">
          <div class="relative mb-8" aria-hidden="true">
            <div class="w-32 h-32 rounded-full border-2 border-warm-500/25 border-dashed flex items-center justify-center">
              <i data-lucide="wifi-off" class="w-14 h-14 text-warm-400"></i>
            </div>
          </div>

          <p class="bracket-label text-warm-500 mb-2">No connection</p>
          <h1 class="font-display text-[30px] font-light text-warm-50 leading-[1.05] mb-3">
            You&rsquo;re<br/>
            <span class="italic">offline.</span>
          </h1>
          <p class="text-[13px] text-warm-400 max-w-[260px] mx-auto mb-8">
            No worries &mdash; your journal and recent sessions are saved locally. They&rsquo;ll sync when you&rsquo;re back.
          </p>

          <button type="button" class="btn btn-primary w-full max-w-xs mb-3">
            <i data-lucide="refresh-cw" class="w-4 h-4" aria-hidden="true"></i>
            Try again
          </button>
          <button type="button" class="text-[13px] text-warm-400 py-3">Continue offline</button>

          <!-- Still available offline -->
          <div class="mt-10 glass rounded-2xl p-4 w-full max-w-xs">
            <p class="bracket-label text-warm-500 mb-2.5 text-center">Still available offline</p>
            <div class="flex gap-2 flex-wrap justify-center">
              <span class="chip"><i data-lucide="pen-line" class="w-3 h-3 text-sage-300" aria-hidden="true"></i>Journal</span>
              <span class="chip"><i data-lucide="wind" class="w-3 h-3 text-sage-300" aria-hidden="true"></i>Breathing</span>
              <span class="chip"><i data-lucide="moon" class="w-3 h-3 text-lavender-300" aria-hidden="true"></i>Sounds</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
};
