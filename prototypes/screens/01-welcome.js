// 01 — Welcome / Splash
// The premium opening. Editorial headline + breathing orb + trust signals + primary CTA.

import { statusBar } from '../lib/helpers.js';

export const screen = {
  id: 'welcome',
  label: 'Welcome',
  section: 'auth',
  render: () => `
    ${statusBar}
    <div class="mesh-bg h-full relative flex flex-col">
      <!-- Layered cosmic depth -->
      <div class="absolute top-24 left-6 w-52 h-52 breath-orb opacity-75" aria-hidden="true"></div>
      <div class="absolute top-44 right-2 w-40 h-40 breath-orb-warm opacity-60" aria-hidden="true"></div>
      <div class="absolute top-72 left-28 w-32 h-32 rounded-full" aria-hidden="true"
           style="background:radial-gradient(circle at 30% 30%, rgba(168,154,224,0.5), transparent 70%);filter:blur(26px);"></div>
      <div class="absolute top-12 right-12 w-28 h-28 rounded-full" aria-hidden="true"
           style="background:radial-gradient(circle at 30% 30%, rgba(107,143,255,0.45), transparent 70%);filter:blur(30px);"></div>

      <div class="relative z-10 flex-1 flex flex-col px-8 pt-12">

        <!-- Logo + version mark -->
        <div class="flex items-center justify-between mb-auto">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-sage-300 via-aurora-300 to-lavender-300 flex items-center justify-center"
                 style="box-shadow: 0 0 40px -8px rgba(107,143,255,0.6);">
              <div class="w-3 h-3 rounded-full bg-warm-50"></div>
            </div>
            <span class="font-display text-lg font-medium tracking-tight text-warm-50">Solace</span>
          </div>
          <span class="bracket-label text-warm-500">v4.0</span>
        </div>

        <!-- Hero -->
        <div class="mb-8">
          <p class="bracket-label text-aurora-300 mb-4">Mental wellness, reimagined</p>
          <h1 class="font-display text-[48px] leading-[1.0] font-light text-warm-50 tracking-tight mb-4">
            Find your<br/>
            <span class="italic font-medium gradient-text">quiet within.</span>
          </h1>
          <p class="text-warm-400 text-[15px] leading-relaxed max-w-[300px]">
            AI-powered therapy, mood tracking, and mindful practices &mdash;
            designed by clinicians, tuned to you.
          </p>
        </div>

        <!-- Trust row -->
        <div class="flex items-center gap-2 mb-5 text-[10px] text-warm-500">
          <i data-lucide="shield-check" class="w-3 h-3 text-sage-300" aria-hidden="true"></i>
          <span>HIPAA-compliant</span>
          <span class="opacity-40">&middot;</span>
          <i data-lucide="lock" class="w-3 h-3 text-sage-300" aria-hidden="true"></i>
          <span>End-to-end encrypted</span>
          <span class="opacity-40">&middot;</span>
          <i data-lucide="star" class="w-3 h-3 text-peach-300" aria-hidden="true"></i>
          <span><span class="font-mono">4.8</span></span>
        </div>

        <!-- CTAs -->
        <button type="button" class="btn btn-primary w-full mb-3">
          Begin your journey
          <i data-lucide="arrow-right" class="w-4 h-4" aria-hidden="true"></i>
        </button>
        <button type="button" class="w-full py-3 text-warm-400 text-sm">
          Already have an account? <span class="text-aurora-300 font-medium">Sign in</span>
        </button>
      </div>
    </div>
  `,
};
