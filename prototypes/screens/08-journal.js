// 08 — Journal list
// Mood-from-writing trend chart + recent entries list.

import { statusBar, tabBar } from '../lib/helpers.js';

export const screen = {
  id: 'journal',
  label: 'Journal',
  section: 'main',
  render: () => {
    const entries = [
      { date: 'Today',     mood: 'Content',    moodColor: 'sage-300',     hue: '155,196,176', title: 'A quiet morning', preview: 'Started the day with coffee and that book I keep meaning to finish. Still anxious about the meeting but&hellip;' },
      { date: 'Yesterday', mood: 'Reflective', moodColor: 'lavender-300', hue: '168,154,224', title: 'Letting go',       preview: 'Talked to mom for an hour. It helped more than I expected. Sometimes just being heard&hellip;' },
      { date: 'Apr 4',     mood: 'Stressed',   moodColor: 'peach-300',    hue: '244,167,126', title: 'Deadline week',    preview: 'Three projects due this week. Trying to take it one task at a time&hellip;' },
    ];
    return `
      ${statusBar}
      <div class="bg-midnight-950 h-full relative">
        <div class="absolute top-0 left-0 right-0 h-80 opacity-40" aria-hidden="true"
             style="background:radial-gradient(ellipse at 80% 0%, rgba(168,154,224,0.18), transparent 60%);"></div>

        <div class="relative px-6 pt-14 pb-32">
          <header class="flex items-baseline justify-between mb-1">
            <div>
              <p class="bracket-label text-warm-500">Journal</p>
              <h1 class="font-display text-[32px] font-light text-warm-50 mt-0.5">12 entries</h1>
            </div>
            <button type="button" class="icon-btn glass" aria-label="Search journal">
              <i data-lucide="search" class="w-4 h-4" aria-hidden="true"></i>
            </button>
          </header>
          <div class="flex items-center gap-2 mt-1.5 text-[11px] text-warm-400">
            <span>April</span>
            <span class="opacity-40" aria-hidden="true">&middot;</span>
            <i data-lucide="flame" class="w-3 h-3 text-peach-300" aria-hidden="true"></i>
            <span>23-day streak</span>
          </div>

          <!-- Mood trend chart -->
          <figure class="hero-card glass-strong rounded-3xl p-5 mt-5 relative overflow-hidden">
            <div class="absolute -top-10 right-0 w-32 h-32 breath-orb opacity-45" aria-hidden="true"></div>
            <div class="relative">
              <figcaption class="flex justify-between items-baseline mb-4">
                <div>
                  <p class="text-sm font-medium text-warm-50">Mood from your writing</p>
                  <p class="text-[10px] text-warm-500 mt-0.5">Trending up over the last week</p>
                </div>
                <span class="chip text-[9px]">
                  <i data-lucide="sparkles" class="w-3 h-3 text-aurora-300" aria-hidden="true"></i>AI
                </span>
              </figcaption>
              <svg viewBox="0 0 300 90" class="w-full h-24" role="img" aria-label="Mood from writing over the past month, trending upward">
                <defs>
                  <linearGradient id="jr-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#9BC4B0" stop-opacity="0.5"/>
                    <stop offset="100%" stop-color="#9BC4B0" stop-opacity="0"/>
                  </linearGradient>
                  <linearGradient id="jr-line" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#9BC4B0"/>
                    <stop offset="100%" stop-color="#8AA3FF"/>
                  </linearGradient>
                </defs>
                <path d="M 0,65 Q 30,60 50,45 T 100,28 T 150,38 T 200,18 T 250,22 T 300,12 L 300,90 L 0,90 Z" fill="url(#jr-grad)"/>
                <path d="M 0,65 Q 30,60 50,45 T 100,28 T 150,38 T 200,18 T 250,22 T 300,12" fill="none" stroke="url(#jr-line)" stroke-width="2"/>
                <circle cx="300" cy="12" r="4" fill="#8AA3FF"/>
                <circle cx="300" cy="12" r="8" fill="#8AA3FF" opacity="0.2"/>
              </svg>
              <div class="flex justify-between mt-2">
                ${['Apr 1','Apr 8','Apr 15','Apr 22','Apr 29'].map(d=>`<span class="text-[9px] text-warm-500 font-mono">${d}</span>`).join('')}
              </div>
            </div>
          </figure>

          <!-- Recent entries -->
          <section class="mt-6" aria-labelledby="recent-heading">
            <div class="flex justify-between items-baseline mb-3">
              <h3 id="recent-heading" class="font-display text-lg text-warm-50">Recent</h3>
              <button type="button" class="text-[11px] text-aurora-300 font-medium">View all &rarr;</button>
            </div>
            <ul class="space-y-3">
              ${entries.map(e => `
                <li>
                  <button type="button" class="w-full glass rounded-2xl p-4 text-left relative overflow-hidden">
                    <div class="absolute top-0 left-0 bottom-0 w-1 rounded-r-full" style="background:rgba(${e.hue},0.65);" aria-hidden="true"></div>
                    <div class="flex items-center gap-2 mb-2 pl-2">
                      <span class="bracket-label text-warm-500">${e.date}</span>
                      <span class="opacity-30 text-[9px]" aria-hidden="true">&middot;</span>
                      <span class="text-[9px] text-${e.moodColor} font-medium">${e.mood}</span>
                    </div>
                    <p class="font-display text-[17px] text-warm-50 leading-tight mb-1.5 pl-2">${e.title}</p>
                    <p class="text-[11px] text-warm-400 leading-relaxed line-clamp-2 pl-2">${e.preview}</p>
                  </button>
                </li>
              `).join('')}
            </ul>
          </section>
        </div>

        <!-- FAB -->
        <button type="button" class="absolute bottom-28 right-6 icon-btn btn-peach" style="width:56px;height:56px;" aria-label="Write a new entry">
          <i data-lucide="pen-line" class="w-5 h-5" aria-hidden="true"></i>
        </button>

        ${tabBar('journal')}
      </div>
    `;
  },
};
