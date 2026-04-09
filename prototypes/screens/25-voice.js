// 25 — Voice session (active)
// Pulsing cosmic orb + live timer + gradient waveform.

import { statusBar } from '../lib/helpers.js';

export const screen = {
  id: 'voice',
  label: 'Voice session',
  section: 'therapy',
  render: () => {
    const bars = Array(34).fill(0).map((_,i) => {
      const h = 12 + Math.abs(Math.sin(i*0.5)) * 48 + (i%3===0 ? 12 : 0);
      const op = 0.35 + Math.abs(Math.sin(i*0.3)) * 0.6;
      return `<div class="w-1 rounded-full bg-gradient-to-t from-sage-300 to-aurora-300" style="height:${h}px;opacity:${op};"></div>`;
    }).join('');

    return `
      ${statusBar}
      <div class="h-full relative mesh-bg">
        <div class="absolute top-1/4 left-1/4 w-96 h-96 smoke opacity-80" aria-hidden="true"></div>
        <div class="absolute bottom-1/4 right-1/4 w-72 h-72 breath-orb opacity-75" aria-hidden="true"></div>

        <header class="relative px-6 pt-14 flex justify-between items-center">
          <button type="button" class="icon-btn glass" aria-label="End voice session">
            <i data-lucide="x" class="w-4 h-4" aria-hidden="true"></i>
          </button>
          <p class="bracket-label text-warm-400">Voice session</p>
          <div class="px-3 py-2 rounded-full glass" role="timer" aria-live="off" aria-label="Session time 32 seconds">
            <span class="text-[10px] font-mono text-warm-200">00:32</span>
          </div>
        </header>

        <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <!-- Avatar with pulse -->
          <div class="relative mb-12">
            <div class="absolute -inset-12 rounded-full breath-orb" aria-hidden="true"></div>
            <div class="absolute -inset-6 rounded-full border border-sage-300/22" aria-hidden="true"></div>
            <div class="absolute -inset-3 rounded-full border border-aurora-300/32" aria-hidden="true"></div>
            <div class="relative w-36 h-36 rounded-full bg-gradient-to-br from-sage-300 via-aurora-300 to-lavender-300 flex items-center justify-center"
                 style="box-shadow: 0 0 80px -8px rgba(107,143,255,0.6);"
                 role="img" aria-label="Solace avatar, listening">
              <i data-lucide="sparkles" class="w-14 h-14 text-midnight-950" aria-hidden="true"></i>
            </div>
          </div>

          <p class="font-display text-[26px] italic text-warm-50 mb-2" aria-live="polite">I&rsquo;m listening&hellip;</p>
          <p class="text-[11px] text-warm-400 mb-12">Tap to pause at any time</p>

          <!-- Waveform -->
          <div class="flex items-center gap-1 h-16 mb-16" role="img" aria-label="Audio waveform">
            ${bars}
          </div>
        </div>

        <div class="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-6">
          <button type="button" class="icon-btn glass" style="width:52px;height:52px;" aria-label="Switch to keyboard">
            <i data-lucide="keyboard" class="w-4 h-4" aria-hidden="true"></i>
          </button>
          <button type="button" class="icon-btn btn-peach" style="width:68px;height:68px;" aria-label="Pause voice session">
            <i data-lucide="pause" class="w-6 h-6" aria-hidden="true"></i>
          </button>
          <button type="button" class="icon-btn glass" style="width:52px;height:52px;" aria-label="End and save session">
            <i data-lucide="check" class="w-4 h-4" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    `;
  },
};
