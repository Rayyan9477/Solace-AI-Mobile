// 17 — Notification primer
// Soft, consent-first framing. Emphasizes control and no guilt.

import { statusBar, miniHeader } from '../lib/helpers.js';

export const screen = {
  id: 'notif-primer',
  label: 'Notifications primer',
  section: 'onboarding-plus',
  render: () => `
    ${statusBar}
    <div class="bg-midnight-950 h-full relative">
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 smoke opacity-60" aria-hidden="true"></div>

      <div class="relative px-6 pt-14 pb-8 h-full flex flex-col">
        ${miniHeader('Reminders')}

        <div class="flex-1 flex flex-col justify-center">
          <!-- Stacked notification preview -->
          <div class="relative mb-10 mx-2" aria-hidden="true">
            <div class="glass rounded-2xl absolute left-4 right-4 -bottom-6 opacity-25 -z-20" style="height:72px;"></div>
            <div class="glass rounded-2xl absolute left-2 right-2 -bottom-3 opacity-50 -z-10" style="height:72px;"></div>
            <div class="glass-strong rounded-2xl p-4 flex items-center gap-3 relative z-10"
                 style="box-shadow: var(--shadow-cosmic);">
              <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-sage-300 via-aurora-300 to-lavender-300 flex items-center justify-center">
                <i data-lucide="sparkles" class="w-4 h-4 text-midnight-950"></i>
              </div>
              <div class="flex-1">
                <p class="text-[11px] font-medium text-warm-50">Solace</p>
                <p class="text-[11px] text-warm-400">How are you feeling right now?</p>
              </div>
              <span class="text-[9px] text-warm-500 font-mono">now</span>
            </div>
          </div>

          <p class="bracket-label text-aurora-300 mb-3 text-center">Gentle &middot; You&rsquo;re in control</p>
          <h1 class="font-display text-[30px] font-light text-warm-50 leading-[1.05] mb-3 text-center">
            A soft check-in<br/>
            <span class="italic">once a day?</span>
          </h1>
          <p class="text-[13px] text-warm-400 leading-relaxed text-center max-w-[280px] mx-auto mb-10">
            We&rsquo;ll send a quiet reminder at your chosen time. No streaks, no guilt
            &mdash; just a small nudge when it helps.
          </p>

          <button type="button" class="btn btn-sage w-full mb-3">Allow notifications</button>
          <button type="button" class="w-full text-sm text-warm-400 font-medium py-3">Not now</button>
        </div>
      </div>
    </div>
  `,
};
