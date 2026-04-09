// 26 — Session summary
// Post-session recap: topic card + techniques used + small action.

import { statusBar, miniHeader } from '../lib/helpers.js';

export const screen = {
  id: 'session-summary',
  label: 'Session summary',
  section: 'therapy',
  render: () => `
    ${statusBar}
    <div class="bg-midnight-950 h-full relative">
      <div class="absolute top-0 left-0 right-0 h-80 opacity-50" aria-hidden="true"
           style="background:radial-gradient(ellipse at 50% 0%,rgba(155,196,176,0.18),transparent 60%);"></div>

      <div class="relative px-6 pt-14 pb-32">
        ${miniHeader('Session complete', '<button type="button" class="icon-btn" aria-label="Share summary"><i data-lucide="share-2" class="w-4 h-4 text-warm-400"></i></button>')}

        <div class="flex justify-center mb-5">
          <div class="relative">
            <div class="absolute -inset-3 rounded-full border border-sage-300/22" aria-hidden="true"></div>
            <div class="w-16 h-16 rounded-full bg-sage-300/15 border border-sage-300/35 flex items-center justify-center"
                 style="box-shadow: 0 0 40px -8px rgba(155,196,176,0.55);"
                 role="img" aria-label="Session completed">
              <i data-lucide="check" class="w-8 h-8 text-sage-300" stroke-width="2.5" aria-hidden="true"></i>
            </div>
            <i data-lucide="sparkle" class="w-3 h-3 text-peach-300 absolute -top-1 right-0" aria-hidden="true"></i>
            <i data-lucide="sparkle" class="w-2 h-2 text-aurora-300 absolute bottom-2 -left-1" aria-hidden="true"></i>
          </div>
        </div>

        <p class="bracket-label text-sage-300 mb-3 text-center">April 9 &middot; <span class="font-mono">14 min</span></p>
        <h1 class="font-display text-[30px] font-light text-warm-50 text-center leading-[1.05] mb-6">
          Well done,<br/>
          <span class="italic">Rayyan.</span>
        </h1>

        <!-- Topic card -->
        <section class="hero-card glass-strong rounded-3xl p-5 mb-4" aria-labelledby="topic-heading">
          <p id="topic-heading" class="bracket-label text-warm-500 mb-2">What we talked about</p>
          <p class="text-[13px] text-warm-50 leading-relaxed mb-3">
            You shared about work stress and how anxiety shows up before meetings. We explored thought patterns and practiced a grounding exercise together.
          </p>
          <div class="flex gap-2 flex-wrap">
            <span class="chip">Work stress</span>
            <span class="chip">Anxiety</span>
            <span class="chip">Meetings</span>
          </div>
        </section>

        <!-- Techniques used -->
        <section class="glass rounded-2xl p-4 mb-4" aria-labelledby="techniques-heading">
          <p id="techniques-heading" class="text-xs font-medium text-warm-50 mb-3">Techniques we used</p>
          <ul class="space-y-2.5">
            <li class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-lg bg-sage-300/15 border border-sage-300/25 flex items-center justify-center flex-shrink-0">
                <i data-lucide="brain" class="w-4 h-4 text-sage-300" aria-hidden="true"></i>
              </div>
              <div class="flex-1">
                <p class="text-[11px] font-medium text-warm-50">Thought reframing</p>
                <p class="text-[9px] text-warm-500 mt-0.5">CBT technique</p>
              </div>
            </li>
            <li class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-lg bg-lavender-300/15 border border-lavender-300/25 flex items-center justify-center flex-shrink-0">
                <i data-lucide="wind" class="w-4 h-4 text-lavender-300" aria-hidden="true"></i>
              </div>
              <div class="flex-1">
                <p class="text-[11px] font-medium text-warm-50">4-7-8 breathing</p>
                <p class="text-[9px] text-warm-500 mt-0.5">Grounding technique</p>
              </div>
            </li>
          </ul>
        </section>

        <!-- Next step -->
        <section class="hero-card rounded-2xl p-4 border border-peach-300/25" style="background:linear-gradient(135deg,rgba(244,167,126,0.15),rgba(244,167,126,0.04));" aria-labelledby="action-heading">
          <div class="flex items-start gap-3">
            <div class="w-9 h-9 rounded-lg bg-peach-300/20 border border-peach-300/30 flex items-center justify-center flex-shrink-0">
              <i data-lucide="target" class="w-4 h-4 text-peach-300" aria-hidden="true"></i>
            </div>
            <div class="flex-1">
              <p id="action-heading" class="text-[12px] font-medium text-warm-50 mb-1">Small action for today</p>
              <p class="text-[11px] text-warm-400 leading-relaxed">Try the 5-minute breathing exercise before your 3pm meeting.</p>
            </div>
          </div>
          <button type="button" class="w-full mt-3 rounded-xl bg-peach-300/20 border border-peach-300/35 text-peach-300 text-[11px] font-medium" style="min-height:44px;">
            Schedule reminder
          </button>
        </section>
      </div>

      <div class="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-gradient-to-t from-midnight-950 to-transparent">
        <button type="button" class="btn btn-primary w-full">Back to home</button>
      </div>
    </div>
  `,
};
