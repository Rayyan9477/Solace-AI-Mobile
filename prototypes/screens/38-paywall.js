// 38 — Paywall / Solace Plus
// Feature list + plan selector + 7-day trial CTA.

import { statusBar } from '../lib/helpers.js';

export const screen = {
  id: 'paywall',
  label: 'Paywall',
  section: 'system',
  render: () => {
    const features = [
      { icon: 'infinity',    title: 'Unlimited AI therapy',  desc: 'No session caps or daily limits' },
      { icon: 'library',     title: 'Full practice library', desc: '200+ guided meditations & exercises' },
      { icon: 'trending-up', title: 'Deep insights',         desc: 'Correlations across mood, sleep, and stress' },
      { icon: 'moon',        title: 'All soundscapes',       desc: 'Every ambient sound in the collection' },
      { icon: 'download',    title: 'Offline mode',          desc: 'Listen and journal without connection' },
    ];
    return `
      ${statusBar}
      <div class="h-full relative" style="background:radial-gradient(ellipse at top,#161D3D,#040818 60%);">
        <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div class="absolute top-0 left-0 right-0 h-72 mesh-bg opacity-40"></div>
          <div class="absolute top-20 right-10 w-44 h-44 smoke opacity-55"></div>
        </div>

        <div class="relative z-10 px-6 pt-14 pb-32">
          <div class="flex justify-end mb-4">
            <button type="button" class="icon-btn glass" aria-label="Close paywall">
              <i data-lucide="x" class="w-4 h-4" aria-hidden="true"></i>
            </button>
          </div>

          <div class="text-center mb-7">
            <div class="inline-block mb-4 relative">
              <div class="absolute -inset-2 rounded-3xl" aria-hidden="true"
                   style="background:radial-gradient(circle,rgba(244,167,126,0.4),transparent 70%);filter:blur(14px);"></div>
              <div class="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-peach-300 via-aurora-300 to-lavender-300 flex items-center justify-center"
                   style="box-shadow: 0 0 60px -10px rgba(107,143,255,0.5);">
                <i data-lucide="sparkles" class="w-8 h-8 text-midnight-950" aria-hidden="true"></i>
              </div>
            </div>
            <p class="bracket-label text-aurora-300 mb-2">Solace Plus</p>
            <h1 class="font-display text-[30px] font-light text-warm-50 leading-[1.05] mb-3">
              Unlock the full<br/>
              <span class="italic">experience.</span>
            </h1>
            <p class="text-[13px] text-warm-400 max-w-[280px] mx-auto">
              Deeper insights, unlimited therapy, all practices &mdash; free for 7 days.
            </p>
          </div>

          <!-- Features -->
          <section class="hero-card glass-strong rounded-3xl p-5 mb-5" aria-labelledby="features-heading">
            <h2 id="features-heading" class="sr-only">Plus features</h2>
            <ul class="space-y-3.5">
              ${features.map(f => `
                <li class="flex items-start gap-3">
                  <div class="w-8 h-8 rounded-lg bg-sage-300/12 border border-sage-300/22 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i data-lucide="${f.icon}" class="w-4 h-4 text-sage-300" aria-hidden="true"></i>
                  </div>
                  <div class="flex-1">
                    <p class="text-[12px] font-medium text-warm-50">${f.title}</p>
                    <p class="text-[10px] text-warm-500 mt-0.5">${f.desc}</p>
                  </div>
                </li>
              `).join('')}
            </ul>
          </section>

          <!-- Plans -->
          <div class="space-y-2.5 mb-5" role="radiogroup" aria-label="Choose a plan">
            <button type="button" role="radio" aria-checked="true"
                    class="w-full hero-card rounded-2xl p-4 text-left flex items-center gap-4 border-2 border-sage-300"
                    style="background:rgba(155,196,176,0.12);min-height:80px;">
              <div class="w-10 h-10 rounded-full bg-sage-300 text-midnight-950 flex items-center justify-center flex-shrink-0">
                <i data-lucide="check" class="w-5 h-5" stroke-width="3" aria-hidden="true"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-0.5">
                  <p class="text-[13px] font-medium text-warm-50">Annual</p>
                  <span class="px-2 py-0.5 rounded-full bg-peach-300 text-midnight-950 text-[9px] font-bold">SAVE 60%</span>
                </div>
                <p class="text-[10px] text-warm-500 font-mono">$59.99/year &middot; $4.99/mo</p>
              </div>
              <div class="text-right">
                <p class="font-display text-[20px] text-warm-50">$4.99</p>
                <p class="text-[9px] text-warm-500 font-mono">/mo</p>
              </div>
            </button>

            <button type="button" role="radio" aria-checked="false"
                    class="w-full glass rounded-2xl p-4 text-left flex items-center gap-4"
                    style="min-height:80px;">
              <div class="w-10 h-10 rounded-full border-2 border-warm-500 flex-shrink-0"></div>
              <div class="flex-1">
                <p class="text-[13px] font-medium text-warm-50">Monthly</p>
                <p class="text-[10px] text-warm-500">Cancel anytime</p>
              </div>
              <div class="text-right">
                <p class="font-display text-[20px] text-warm-50">$12.99</p>
                <p class="text-[9px] text-warm-500 font-mono">/mo</p>
              </div>
            </button>
          </div>

          <p class="text-[10px] text-warm-500 text-center mb-4 leading-relaxed">
            7 days free, then $59.99/year. Cancel anytime in Settings.
          </p>
        </div>

        <div class="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-gradient-to-t from-midnight-950 to-transparent">
          <button type="button" class="btn btn-peach w-full">
            Start 7-day free trial
            <i data-lucide="arrow-right" class="w-4 h-4" aria-hidden="true"></i>
          </button>
          <div class="flex justify-center gap-3 mt-4 text-[9px] text-warm-500">
            <button type="button">Terms</button>
            <span class="opacity-40" aria-hidden="true">&middot;</span>
            <button type="button">Privacy</button>
            <span class="opacity-40" aria-hidden="true">&middot;</span>
            <button type="button">Restore purchase</button>
          </div>
        </div>
      </div>
    `;
  },
};
