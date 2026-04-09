// 10 — Breathing exercise (immersive)
// 4-7-8 box breathing with animated concentric orb and cycle progress.

import { statusBar } from '../lib/helpers.js';

export const screen = {
  id: 'breathing',
  label: 'Breathing',
  section: 'wellness',
  render: () => `
    ${statusBar}
    <div class="h-full relative overflow-hidden mesh-bg">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 smoke opacity-80" aria-hidden="true"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 breath-orb opacity-65" aria-hidden="true"></div>

      <!-- Top bar -->
      <header class="relative z-10 px-6 pt-14 flex justify-between items-center">
        <button type="button" class="icon-btn glass" aria-label="Close breathing exercise">
          <i data-lucide="x" class="w-4 h-4" aria-hidden="true"></i>
        </button>
        <div class="text-center">
          <p class="bracket-label text-warm-400">4-7-8 Breathing</p>
          <p class="text-[10px] text-warm-500 mt-0.5 font-mono">Cycle 3 of 8</p>
        </div>
        <button type="button" class="icon-btn glass" aria-label="Toggle sound">
          <i data-lucide="volume-2" class="w-4 h-4" aria-hidden="true"></i>
        </button>
      </header>

      <!-- Center breathing orb -->
      <div class="relative z-10 flex-1 flex flex-col items-center justify-center pt-16">
        <div class="relative mb-12" role="img" aria-label="Breathe in, 4 seconds remaining">
          <div class="w-72 h-72 rounded-full border border-aurora-300/18 flex items-center justify-center">
            <div class="w-60 h-60 rounded-full border border-sage-300/22 flex items-center justify-center">
              <div class="w-48 h-48 rounded-full border border-sage-300/32 flex items-center justify-center">
                <div class="w-32 h-32 rounded-full flex items-center justify-center"
                     style="background: radial-gradient(circle at 35% 35%, rgba(155,196,176,0.65), rgba(107,143,255,0.32) 60%, transparent); box-shadow: 0 0 110px 12px rgba(155,196,176,0.4), inset 0 0 32px rgba(255,255,255,0.12);">
                  <p class="font-display text-2xl italic text-warm-50">Breathe in</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Counter -->
        <p class="font-mono text-[64px] font-light text-warm-50 mb-1 leading-none tracking-tight" aria-live="polite">04</p>
        <p class="text-[11px] text-warm-500 mb-12 bracket-label">seconds</p>

        <!-- Cycle progress -->
        <div class="flex gap-2 mb-6" role="progressbar" aria-valuenow="3" aria-valuemin="0" aria-valuemax="8" aria-label="Breathing cycle">
          ${Array(8).fill(0).map((_,i)=>`<div class="w-1.5 h-1.5 rounded-full ${i<3?'bg-sage-300':'bg-white/12'}"></div>`).join('')}
        </div>

        <p class="bracket-label text-warm-500"><span class="font-mono text-warm-200">2:45</span> remaining</p>
      </div>

      <!-- Controls -->
      <div class="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-6">
        <button type="button" class="icon-btn glass" style="width:52px;height:52px;" aria-label="Restart exercise">
          <i data-lucide="rotate-ccw" class="w-4 h-4" aria-hidden="true"></i>
        </button>
        <button type="button" class="icon-btn btn-primary" style="width:68px;height:68px;" aria-label="Pause breathing exercise">
          <i data-lucide="pause" class="w-6 h-6" aria-hidden="true"></i>
        </button>
        <button type="button" class="icon-btn glass" style="width:52px;height:52px;" aria-label="Exercise settings">
          <i data-lucide="settings-2" class="w-4 h-4" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  `,
};
