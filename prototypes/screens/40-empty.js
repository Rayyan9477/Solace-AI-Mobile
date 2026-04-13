// 40 — Empty state (Journal first-time)
// Warm invitation with suggested prompts.

import { statusBar, miniHeader } from '../lib/helpers.js';

export const screen = {
  id: 'empty',
  label: 'Empty state',
  section: 'states',
  render: () => {
    const prompts = [
      'How are you feeling right now?',
      "What&rsquo;s one small win from today?",
      "What&rsquo;s weighing on your mind?",
    ];
    return `
      ${statusBar}
      <div class="bg-midnight-950 h-full relative">
        <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 breath-orb opacity-55" aria-hidden="true"></div>

        <div class="relative px-6 pt-14 h-full flex flex-col">
          ${miniHeader('Journal')}

          <div class="flex-1 flex flex-col items-center justify-center text-center px-4">
            <!-- Illustration -->
            <div class="relative mb-8" aria-hidden="true">
              <div class="w-44 h-44 rounded-full border border-aurora-300/12 relative flex items-center justify-center">
                <div class="absolute inset-6 rounded-full border border-sage-300/18"></div>
                <div class="absolute inset-12 rounded-full border border-sage-300/25"></div>
                <div class="absolute inset-16 rounded-full breath-orb"></div>
                <i data-lucide="book-open" class="w-12 h-12 text-sage-300 relative z-10"></i>
              </div>
              <i data-lucide="sparkle" class="w-3 h-3 text-peach-300 absolute top-4 -right-2"></i>
              <i data-lucide="sparkle" class="w-2 h-2 text-aurora-300 absolute bottom-8 -left-3"></i>
            </div>

            <p class="bracket-label text-aurora-300 mb-2">Start somewhere</p>
            <h1 class="font-display text-[30px] font-light text-warm-50 leading-[1.05] mb-3">
              Your story<br/>
              <span class="italic">begins here.</span>
            </h1>
            <p class="text-[13px] text-warm-400 max-w-[260px] mx-auto mb-7">
              No need for perfect words. Write one sentence &mdash; we&rsquo;ll take it from there.
            </p>

            <!-- Suggested prompts -->
            <ul class="w-full space-y-2 mb-7">
              ${prompts.map(p => `
                <li>
                  <button type="button" class="w-full glass rounded-2xl p-3 flex items-center gap-3 text-left" style="min-height:52px;">
                    <div class="w-7 h-7 rounded-lg bg-sage-300/10 border border-sage-300/22 flex items-center justify-center flex-shrink-0">
                      <i data-lucide="pen-line" class="w-3.5 h-3.5 text-sage-300" aria-hidden="true"></i>
                    </div>
                    <p class="text-[12px] text-warm-200 flex-1">${p}</p>
                    <i data-lucide="chevron-right" class="w-3.5 h-3.5 text-warm-500" aria-hidden="true"></i>
                  </button>
                </li>
              `).join('')}
            </ul>

            <button type="button" class="btn btn-peach w-full">
              <i data-lucide="pen-line" class="w-4 h-4" aria-hidden="true"></i>
              Write freely
            </button>
          </div>
        </div>
      </div>
    `;
  },
};
