// 31 — Meditation player
// Now playing screen with cosmic gradient artwork + scrub bar + transport + ambient layer.

import { statusBar } from '../lib/helpers.js';

export const screen = {
  id: 'mindful-player',
  label: 'Meditation player',
  section: 'mindful-sleep',
  render: () => `
    ${statusBar}
    <div class="h-full relative" style="background:linear-gradient(180deg,#161D3D 0%,#0E1430 50%,#040818 100%);">
      <div class="absolute inset-0" aria-hidden="true">
        <div class="absolute top-20 left-10 w-72 h-72 breath-orb opacity-50"></div>
        <div class="absolute bottom-32 right-10 w-56 h-56 smoke opacity-60"></div>
      </div>

      <div class="relative z-10 px-6 pt-14 h-full flex flex-col">
        <header class="flex items-center justify-between mb-7">
          <button type="button" class="icon-btn glass" aria-label="Minimize player">
            <i data-lucide="chevron-down" class="w-4 h-4" aria-hidden="true"></i>
          </button>
          <p class="bracket-label text-warm-400">Now playing</p>
          <button type="button" class="icon-btn glass" aria-label="Player options">
            <i data-lucide="more-horizontal" class="w-4 h-4" aria-hidden="true"></i>
          </button>
        </header>

        <!-- Hero artwork -->
        <div class="flex justify-center mb-7">
          <div class="w-60 h-60 rounded-3xl relative overflow-hidden hero-card"
               style="background:linear-gradient(135deg,#9BC4B0 0%,#8AA3FF 50%,#A89AE0 100%);box-shadow:0 50px 100px -25px rgba(107,143,255,0.55);"
               role="img" aria-label="Monday reset meditation cover art">
            <div class="absolute inset-0 mesh-bg opacity-30" aria-hidden="true"></div>
            <div class="absolute top-4 right-4 w-24 h-24 rounded-full bg-warm-50/25 blur-2xl" aria-hidden="true"></div>
            <div class="absolute bottom-8 left-8 w-28 h-28 rounded-full bg-warm-50/15 blur-xl" aria-hidden="true"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-20 h-20 rounded-full bg-warm-50/15 backdrop-blur-md flex items-center justify-center">
                <i data-lucide="sparkles" class="w-8 h-8 text-warm-50" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Info -->
        <div class="text-center mb-6">
          <p class="bracket-label text-aurora-300 mb-1">Meditation &middot; Sarah Kim</p>
          <p class="font-display text-[24px] font-light text-warm-50">Monday reset</p>
          <p class="text-[11px] text-warm-400 mt-1">Start your week grounded</p>
        </div>

        <!-- Progress -->
        <div class="mb-5">
          <div class="h-1 rounded-full bg-white/8 mb-2 overflow-hidden" role="progressbar" aria-valuenow="34" aria-valuemin="0" aria-valuemax="100" aria-label="Playback progress">
            <div class="h-full rounded-full bg-gradient-to-r from-sage-300 to-aurora-300" style="width:34%"></div>
          </div>
          <div class="flex justify-between font-mono text-[10px] text-warm-500">
            <span class="text-warm-200">03:24</span>
            <span>-06:36</span>
          </div>
        </div>

        <!-- Controls -->
        <div class="flex items-center justify-center gap-5 mb-7">
          <button type="button" class="icon-btn" style="width:44px;height:44px;" aria-label="Shuffle">
            <i data-lucide="shuffle" class="w-4 h-4 text-warm-400" aria-hidden="true"></i>
          </button>
          <button type="button" class="icon-btn" style="width:48px;height:48px;" aria-label="Previous track">
            <i data-lucide="skip-back" class="w-5 h-5 text-warm-200" aria-hidden="true"></i>
          </button>
          <button type="button" class="icon-btn btn-primary" style="width:80px;height:80px;" aria-label="Pause playback">
            <i data-lucide="pause" class="w-8 h-8" aria-hidden="true"></i>
          </button>
          <button type="button" class="icon-btn" style="width:48px;height:48px;" aria-label="Next track">
            <i data-lucide="skip-forward" class="w-5 h-5 text-warm-200" aria-hidden="true"></i>
          </button>
          <button type="button" class="icon-btn" style="width:44px;height:44px;" aria-label="Repeat">
            <i data-lucide="repeat" class="w-4 h-4 text-warm-400" aria-hidden="true"></i>
          </button>
        </div>

        <!-- Bottom actions -->
        <div class="flex items-center justify-around">
          <button type="button" class="flex items-center gap-1.5 text-[10px] text-warm-400 px-3 py-2" aria-label="Ambient sound: rain">
            <i data-lucide="volume-2" class="w-3.5 h-3.5" aria-hidden="true"></i> Rain
          </button>
          <button type="button" class="flex items-center gap-1.5 text-[10px] text-warm-400 px-3 py-2" aria-label="Favorite">
            <i data-lucide="heart" class="w-3.5 h-3.5" aria-hidden="true"></i>
          </button>
          <button type="button" class="flex items-center gap-1.5 text-[10px] text-warm-400 px-3 py-2" aria-label="Download">
            <i data-lucide="download" class="w-3.5 h-3.5" aria-hidden="true"></i>
          </button>
          <button type="button" class="flex items-center gap-1.5 text-[10px] text-warm-400 px-3 py-2" aria-label="Share">
            <i data-lucide="share-2" class="w-3.5 h-3.5" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  `,
};
