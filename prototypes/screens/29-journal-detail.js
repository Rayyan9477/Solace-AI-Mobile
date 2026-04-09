// 29 — Journal entry detail (read)
// Past entry view with mood badge + body + AI insight + metadata.

import { statusBar, miniHeader, moodFace } from '../lib/helpers.js';

export const screen = {
  id: 'journal-detail',
  label: 'Journal detail',
  section: 'journal',
  render: () => `
    ${statusBar}
    <div class="bg-midnight-950 h-full relative">
      <div class="absolute top-0 left-0 right-0 h-72 opacity-40" aria-hidden="true"
           style="background:radial-gradient(ellipse at 30% 0%,rgba(155,196,176,0.15),transparent 60%);"></div>

      <div class="relative px-6 pt-14 pb-20">
        ${miniHeader('Apr 9, 2026', '<button type="button" class="icon-btn" aria-label="Edit entry"><i data-lucide="edit-3" class="w-4 h-4 text-warm-400"></i></button>')}

        <div class="flex items-center gap-3 mb-5">
          ${moodFace(4, 52)}
          <div>
            <p class="bracket-label text-sage-300">Content</p>
            <p class="text-[10px] text-warm-500 mt-1 font-mono">2:45 PM &middot; 4 min read</p>
          </div>
        </div>

        <h1 class="font-display text-[30px] font-light text-warm-50 leading-[1.1] mb-5">A quiet morning</h1>

        <article class="text-[13px] text-warm-200 leading-[1.7] space-y-3">
          <p>Started the day with coffee and that book I&rsquo;ve been meaning to finish. The rain outside makes everything feel softer &mdash; like the world is holding its breath with me.</p>
          <p>I&rsquo;m still anxious about the meeting today, but I&rsquo;m also noticing how much lighter I feel after journaling for the past week. Maybe Solace is onto something with the &ldquo;small consistent actions&rdquo; idea.</p>
          <p>Things I&rsquo;m grateful for right now:</p>
          <ul class="space-y-1.5 pl-2">
            <li>&mdash; The hum of the rain</li>
            <li>&mdash; This quiet hour before everyone wakes</li>
            <li>&mdash; The fact that I&rsquo;m learning to sit with feelings instead of running</li>
          </ul>
        </article>

        <!-- AI insight -->
        <aside class="hero-card rounded-2xl p-4 mt-6 border border-sage-300/22" style="background:linear-gradient(135deg,rgba(155,196,176,0.14),rgba(107,143,255,0.06));" aria-label="AI insight">
          <div class="flex items-center gap-2 mb-2">
            <i data-lucide="sparkles" class="w-3.5 h-3.5 text-sage-300" aria-hidden="true"></i>
            <span class="bracket-label text-sage-300">Solace noticed</span>
          </div>
          <p class="text-[11px] text-warm-200 leading-relaxed">
            This is the 4th morning entry mentioning gratitude. Your morning routine seems to be a stable anchor &mdash; worth protecting.
          </p>
        </aside>

        <!-- Tags -->
        <div class="mt-4 flex flex-wrap gap-2">
          <span class="chip !bg-sage-300/12 !border-sage-300/30 !text-sage-300">#gratitude</span>
          <span class="chip !bg-sage-300/12 !border-sage-300/30 !text-sage-300">#morning</span>
        </div>

        <!-- Metadata -->
        <div class="mt-6 pt-4 border-t border-white/5 flex items-center gap-3 text-[10px] text-warm-500 font-mono">
          <span>142 words</span>
          <span class="opacity-40" aria-hidden="true">&middot;</span>
          <span>HR <span class="text-warm-200">68</span> bpm</span>
          <span class="opacity-40" aria-hidden="true">&middot;</span>
          <span>Rain 64&deg;</span>
        </div>
      </div>
    </div>
  `,
};
