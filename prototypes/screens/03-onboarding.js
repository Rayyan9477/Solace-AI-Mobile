// 03 — Onboarding
// Step 1 of 4. Personalized AI intro with concentric ring illustration.

import { statusBar } from '../lib/helpers.js';

export const screen = {
  id: 'onboarding',
  label: 'Onboarding',
  section: 'auth',
  render: () => `
    ${statusBar}
    <div class="bg-midnight-950 h-full relative flex flex-col">
      <!-- Top illustration -->
      <div class="h-[440px] relative overflow-hidden">
        <div class="absolute inset-0" aria-hidden="true"
             style="background:linear-gradient(180deg,#161D3D 0%,#0E1430 60%,#040818 100%);"></div>
        <div class="absolute top-20 left-8 w-44 h-44 smoke opacity-80" aria-hidden="true"></div>
        <div class="absolute top-32 right-12 w-32 h-32 breath-orb opacity-55" aria-hidden="true"></div>

        <!-- Concentric rings -->
        <div class="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <div class="relative">
            <div class="w-72 h-72 rounded-full border border-aurora-300/8"></div>
            <div class="absolute inset-6 rounded-full border border-aurora-300/12"></div>
            <div class="absolute inset-14 rounded-full border border-sage-300/15"></div>
            <div class="absolute inset-22 rounded-full border border-sage-300/20"></div>
            <div class="absolute inset-28 rounded-full bg-gradient-to-br from-sage-300/25 via-aurora-300/20 to-lavender-300/20 backdrop-blur-2xl flex items-center justify-center border border-white/10">
              <i data-lucide="sparkles" class="w-9 h-9 text-sage-300"></i>
            </div>
          </div>
        </div>

        <button type="button" class="absolute top-16 right-6 text-xs font-medium text-warm-400 px-3 py-2">Skip</button>
      </div>

      <!-- Content -->
      <div class="flex-1 px-8 pt-7 pb-8 flex flex-col">

        <!-- Progress dots -->
        <div class="flex gap-1.5 mb-7" role="progressbar" aria-valuenow="1" aria-valuemin="1" aria-valuemax="4" aria-label="Onboarding progress">
          <div class="h-1 flex-1 rounded-full bg-aurora-300"></div>
          <div class="h-1 flex-1 rounded-full bg-white/8"></div>
          <div class="h-1 flex-1 rounded-full bg-white/8"></div>
          <div class="h-1 flex-1 rounded-full bg-white/8"></div>
        </div>

        <p class="bracket-label text-aurora-300 mb-3">01 / 04 &mdash; Personalized AI</p>
        <h2 class="font-display text-[34px] font-light text-warm-50 leading-[1.05] mb-3">
          Therapy that<br/>
          <span class="italic font-medium">learns you.</span>
        </h2>
        <p class="text-warm-400 text-[13px] leading-relaxed mb-8">
          Evidence-based techniques (CBT, mindfulness, ACT) adapted to your
          personality, mood, and goals &mdash; every conversation.
        </p>

        <div class="mt-auto flex items-center justify-between">
          <button type="button" class="text-sm text-warm-400 font-medium px-3 py-3" aria-label="Previous step">Back</button>
          <button type="button" class="icon-btn btn-peach" style="width:56px;height:56px;" aria-label="Next step">
            <i data-lucide="arrow-right" class="w-5 h-5" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  `,
};
