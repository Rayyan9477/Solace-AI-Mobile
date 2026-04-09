// 34 — Sleep soundscapes
// Now playing mini + grid of ambient sound tiles with gradient art.

import { statusBar, miniHeader } from '../lib/helpers.js';

export const screen = {
  id: 'soundscapes',
  label: 'Soundscapes',
  section: 'mindful-sleep',
  render: () => {
    const sounds = [
      { title: 'Gentle rain',    duration: '∞',   icon: 'cloud-rain', active: true, gradient: 'linear-gradient(135deg,#A89AE0,#6B5BA8)' },
      { title: 'Ocean waves',    duration: '∞',   icon: 'waves',                     gradient: 'linear-gradient(135deg,#9BC4B0,#5A8A78)' },
      { title: 'Forest night',   duration: '60m', icon: 'trees',                     gradient: 'linear-gradient(135deg,#5A8A78,#2F5345)' },
      { title: 'White noise',    duration: '∞',   icon: 'radio',                     gradient: 'linear-gradient(135deg,#C7BEA9,#5A6478)' },
      { title: 'Crackling fire', duration: '45m', icon: 'flame',                     gradient: 'linear-gradient(135deg,#F4A77E,#B86A3E)' },
      { title: 'Tibetan bowl',   duration: '20m', icon: 'circle-dot',                gradient: 'linear-gradient(135deg,#A89AE0,#8B7CC8)' },
    ];
    return `
      ${statusBar}
      <div class="h-full relative" style="background:linear-gradient(180deg,#161D3D 0%,#040818 100%);">
        <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div class="absolute top-10 left-10 w-44 h-44 rounded-full" style="background:radial-gradient(circle,rgba(168,154,224,0.22),transparent 70%);filter:blur(26px);"></div>
        </div>

        <div class="relative z-10 px-6 pt-14 pb-32">
          ${miniHeader('Sounds')}

          <p class="bracket-label text-lavender-300 mb-2">Ambient</p>
          <h1 class="font-display text-[30px] font-light text-warm-50 mb-6">Drift off gently</h1>

          <!-- Now playing mini -->
          <div class="hero-card glass-strong rounded-2xl p-4 mb-5 flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl relative overflow-hidden flex-shrink-0" style="background:linear-gradient(135deg,#A89AE0,#6B5BA8);" aria-hidden="true">
              <div class="absolute inset-0 flex items-center justify-center gap-0.5">
                ${[8,14,10,16,12].map(h=>`<div class="w-0.5 rounded-full bg-warm-50" style="height:${h}px"></div>`).join('')}
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[13px] font-medium text-warm-50">Gentle rain</p>
              <p class="text-[10px] text-warm-500 font-mono">Playing &middot; 24 min</p>
            </div>
            <button type="button" class="icon-btn" style="width:44px;height:44px;background:#F5F1EA;color:#040818;" aria-label="Pause gentle rain">
              <i data-lucide="pause" class="w-4 h-4" aria-hidden="true"></i>
            </button>
          </div>

          <!-- Grid -->
          <div class="grid grid-cols-2 gap-3" role="list">
            ${sounds.map(s => `
              <button type="button" role="listitem" aria-pressed="${s.active?'true':'false'}"
                      class="rounded-2xl p-4 text-left h-32 relative overflow-hidden ${s.active?'ring-2 ring-lavender-300 ring-offset-2 ring-offset-midnight-950':''}"
                      style="background:${s.gradient};box-shadow:0 8px 24px -8px rgba(0,0,0,0.5),inset 0 1px 0 0 rgba(255,255,255,0.15);">
                <div class="absolute inset-0" aria-hidden="true" style="background:radial-gradient(circle at 70% 30%,rgba(255,255,255,0.16),transparent 60%);"></div>
                <i data-lucide="${s.icon}" class="w-6 h-6 text-warm-50/95 relative" aria-hidden="true"></i>
                <div class="absolute bottom-4 left-4 right-4">
                  <p class="text-[13px] font-medium text-warm-50">${s.title}</p>
                  <p class="text-[10px] text-warm-50/70 mt-0.5 font-mono">${s.duration}</p>
                </div>
                ${s.active ? '<i data-lucide="volume-2" class="w-4 h-4 text-warm-50 absolute top-4 right-4" aria-hidden="true"></i>' : ''}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },
};
