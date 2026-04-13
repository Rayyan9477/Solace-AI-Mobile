// 36 — Search
// Live results for "anxiety" across chats, journal, practices, and articles.

import { statusBar } from '../lib/helpers.js';

export const screen = {
  id: 'search',
  label: 'Search',
  section: 'system',
  render: () => {
    const tabs = [
      { l: 'All',       n: 24, active: true },
      { l: 'Chats',     n: 8 },
      { l: 'Journal',   n: 5 },
      { l: 'Practices', n: 7 },
      { l: 'Articles',  n: 4 },
    ];
    const practices = [
      { icon: 'wind',       title: '4-7-8 breathing',           desc: 'Calms anxiety in 4 min',  hue: '155,196,176' },
      { icon: 'user-round', title: 'Body scan for anxious minds', desc: '10 min guided meditation', hue: '168,154,224' },
    ];
    return `
      ${statusBar}
      <div class="bg-midnight-950 h-full relative">
        <div class="px-6 pt-14 pb-8">

          <!-- Search bar -->
          <form class="flex items-center gap-3 mb-6" onsubmit="event.preventDefault()" role="search">
            <button type="button" class="icon-btn" aria-label="Back">
              <i data-lucide="arrow-left" class="w-4 h-4 text-warm-400" aria-hidden="true"></i>
            </button>
            <label for="search-input" class="sr-only">Search everything</label>
            <div class="glass-strong rounded-full flex items-center gap-3 flex-1 px-4 border border-aurora-300/22" style="min-height:48px;">
              <i data-lucide="search" class="w-4 h-4 text-aurora-300" aria-hidden="true"></i>
              <input id="search-input" type="search"
                     class="bg-transparent outline-none flex-1 text-[13px] text-warm-50 placeholder-warm-500"
                     placeholder="Search everything&hellip;" value="anxiety"/>
              <button type="button" class="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center" style="min-width:44px;min-height:44px;" aria-label="Clear search">
                <i data-lucide="x" class="w-3 h-3 text-warm-400" aria-hidden="true"></i>
              </button>
            </div>
          </form>

          <!-- Results count -->
          <p class="bracket-label text-warm-500 mb-3" aria-live="polite">
            <span class="font-mono text-warm-200">24</span> results for &ldquo;anxiety&rdquo;
          </p>

          <!-- Category tabs -->
          <div class="flex gap-2 mb-5 scroll-x -mx-6 px-6" role="tablist" aria-label="Result categories">
            ${tabs.map(t => `
              <button type="button" role="tab" aria-selected="${t.active?'true':'false'}"
                      class="chip whitespace-nowrap ${t.active?'!bg-sage-300/15 !border-sage-300/35 !text-sage-300':''}"
                      style="min-height:36px;">
                ${t.l} <span class="font-mono opacity-70">${t.n}</span>
              </button>
            `).join('')}
          </div>

          <!-- Sections -->
          <div class="space-y-5">
            <!-- Practices -->
            <section aria-labelledby="practices-heading">
              <div class="flex items-center justify-between mb-2">
                <h2 id="practices-heading" class="bracket-label text-warm-500">Practices</h2>
                <button type="button" class="text-[10px] text-aurora-300 font-medium">All 7</button>
              </div>
              <ul class="space-y-2">
                ${practices.map(r => `
                  <li>
                    <button type="button" class="w-full glass rounded-2xl p-3 flex items-center gap-3 text-left" style="min-height:56px;">
                      <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style="background:rgba(${r.hue},0.12);border:1px solid rgba(${r.hue},0.22);">
                        <i data-lucide="${r.icon}" class="w-4 h-4" style="color:rgb(${r.hue});" aria-hidden="true"></i>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-[12px] font-medium text-warm-50">${r.title.replace(/anxi/i, '<mark>anxi</mark>')}</p>
                        <p class="text-[10px] text-warm-500 mt-0.5">${r.desc}</p>
                      </div>
                      <i data-lucide="chevron-right" class="w-3.5 h-3.5 text-warm-500" aria-hidden="true"></i>
                    </button>
                  </li>
                `).join('')}
              </ul>
            </section>

            <!-- Journal -->
            <section aria-labelledby="journal-results-heading">
              <div class="flex items-center justify-between mb-2">
                <h2 id="journal-results-heading" class="bracket-label text-warm-500">Journal</h2>
                <button type="button" class="text-[10px] text-aurora-300 font-medium">All 5</button>
              </div>
              <ul class="space-y-2">
                <li>
                  <button type="button" class="w-full glass rounded-2xl p-3 text-left relative overflow-hidden" style="min-height:64px;">
                    <div class="absolute top-0 left-0 bottom-0 w-1 rounded-r-full bg-lavender-300/65" aria-hidden="true"></div>
                    <div class="flex items-center gap-2 mb-1 pl-2">
                      <span class="bracket-label text-warm-500">Apr 3</span>
                      <span class="opacity-30 text-[9px]" aria-hidden="true">&middot;</span>
                      <span class="text-[9px] text-lavender-300 font-medium">Stressed</span>
                    </div>
                    <p class="text-[12px] font-medium text-warm-50 pl-2">Handling work <mark>anxi</mark>ety</p>
                    <p class="text-[10px] text-warm-500 mt-0.5 line-clamp-1 pl-2">I&rsquo;ve been feeling more on-edge than usual about the new project&hellip;</p>
                  </button>
                </li>
              </ul>
            </section>

            <!-- Articles -->
            <section aria-labelledby="articles-results-heading">
              <div class="flex items-center justify-between mb-2">
                <h2 id="articles-results-heading" class="bracket-label text-warm-500">Articles</h2>
                <button type="button" class="text-[10px] text-aurora-300 font-medium">All 4</button>
              </div>
              <ul class="space-y-2">
                <li>
                  <button type="button" class="w-full glass rounded-2xl p-3 flex items-center gap-3 text-left" style="min-height:56px;">
                    <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style="background:rgba(244,167,126,0.12);border:1px solid rgba(244,167,126,0.22);">
                      <i data-lucide="book-open" class="w-4 h-4 text-peach-300" aria-hidden="true"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-[12px] font-medium text-warm-50">Understanding your <mark>anxi</mark>ety triggers</p>
                      <p class="text-[10px] text-warm-500 font-mono mt-0.5">6 min read</p>
                    </div>
                  </button>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    `;
  },
};
