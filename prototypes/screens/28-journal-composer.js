// 28 — Journal entry composer
// Mood strip + optional writing prompt + rich-text body + tag chips + toolbar.

import { statusBar, moodFace } from '../lib/helpers.js';

export const screen = {
  id: 'journal-composer',
  label: 'Journal composer',
  section: 'journal',
  render: () => `
    ${statusBar}
    <div class="bg-midnight-950 h-full relative">
      <div class="px-6 pt-14 pb-20">
        <header class="flex items-center justify-between mb-6">
          <button type="button" class="text-[12px] text-warm-400 px-2 py-3">Cancel</button>
          <p class="bracket-label text-warm-500">New entry</p>
          <button type="button" class="text-[12px] text-sage-300 font-medium px-2 py-3">Save</button>
        </header>

        <!-- Mood strip -->
        <div class="glass rounded-2xl p-3 mb-4" role="radiogroup" aria-label="Current mood">
          <p class="bracket-label text-warm-500 mb-2.5 text-center">How are you right now?</p>
          <div class="flex justify-between items-center">
            ${[1,2,3,4,5].map(i => {
              const labels = {1:'Struggling',2:'Down',3:'Neutral',4:'Content',5:'Overjoyed'};
              return `
              <button type="button" role="radio" aria-checked="${i===4?'true':'false'}"
                      aria-label="${labels[i]}"
                      class="${i===4?'ring-2 ring-sage-300 rounded-full ring-offset-2 ring-offset-midnight-800':''}"
                      style="min-height:44px;">
                ${moodFace(i, 36)}
              </button>
            `}).join('')}
          </div>
        </div>

        <!-- Date & weather -->
        <div class="flex items-center gap-2 mb-4 text-[10px] text-warm-500 font-mono">
          <i data-lucide="calendar" class="w-3 h-3" aria-hidden="true"></i>
          <span>Thursday, April 9 &middot; 2:45 PM</span>
          <span class="opacity-40" aria-hidden="true">&middot;</span>
          <i data-lucide="cloud" class="w-3 h-3" aria-hidden="true"></i>
          <span>Cloudy, 64&deg;</span>
        </div>

        <!-- Title -->
        <label for="entry-title" class="sr-only">Entry title</label>
        <input id="entry-title" class="w-full bg-transparent font-display text-[26px] text-warm-50 placeholder-warm-500 outline-none mb-3" placeholder="Give this a title&hellip;" value="A quiet morning"/>

        <!-- Writing prompt -->
        <div class="glass rounded-xl p-3 mb-4 flex items-start gap-3 border border-peach-300/18" role="note">
          <i data-lucide="lightbulb" class="w-4 h-4 text-peach-300 mt-0.5 flex-shrink-0" aria-hidden="true"></i>
          <p class="text-[11px] text-warm-400 leading-relaxed flex-1">
            <span class="text-peach-300 font-medium bracket-label">Prompt</span> &nbsp;
            What&rsquo;s one thing you&rsquo;re grateful for right now?
          </p>
          <button type="button" class="text-[14px] text-warm-500 leading-none flex items-center justify-center" style="min-width:44px;min-height:44px;" aria-label="Dismiss prompt">&times;</button>
        </div>

        <!-- Body text -->
        <label for="entry-body" class="sr-only">Entry body</label>
        <div id="entry-body" class="text-[14px] text-warm-50 leading-[1.65]" contenteditable="true">
          Started the day with coffee and that book I&rsquo;ve been meaning to finish. The rain outside makes everything feel softer &mdash; like the world is holding its breath with me.
          <br/><br/>
          I&rsquo;m still anxious about the meeting today, but I&rsquo;m also noticing how much lighter I feel after journaling for the past week. Maybe Solace is onto something with the &ldquo;small consistent actions&rdquo; idea.
          <br/><br/>
          Things I&rsquo;m grateful for<span class="inline-block w-0.5 h-4 bg-sage-300 align-middle ml-0.5 animate-pulse" aria-hidden="true"></span>
        </div>

        <!-- Tag chips -->
        <div class="mt-6 flex flex-wrap gap-2" role="group" aria-label="Entry tags">
          <span class="chip !bg-sage-300/12 !border-sage-300/30 !text-sage-300">#gratitude</span>
          <span class="chip !bg-sage-300/12 !border-sage-300/30 !text-sage-300">#morning</span>
          <button type="button" class="chip" style="min-height:32px;">+ Add tag</button>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="absolute bottom-0 left-0 right-0 glass-strong border-t border-white/5 px-4 py-3 flex items-center justify-around" role="toolbar" aria-label="Formatting">
        <button type="button" class="icon-btn" style="width:40px;height:40px;" aria-label="Bold"><i data-lucide="bold" class="w-4 h-4 text-warm-400" aria-hidden="true"></i></button>
        <button type="button" class="icon-btn" style="width:40px;height:40px;" aria-label="Italic"><i data-lucide="italic" class="w-4 h-4 text-warm-400" aria-hidden="true"></i></button>
        <button type="button" class="icon-btn" style="width:40px;height:40px;" aria-label="List"><i data-lucide="list" class="w-4 h-4 text-warm-400" aria-hidden="true"></i></button>
        <button type="button" class="icon-btn" style="width:40px;height:40px;" aria-label="Insert image"><i data-lucide="image" class="w-4 h-4 text-warm-400" aria-hidden="true"></i></button>
        <button type="button" class="icon-btn" style="width:40px;height:40px;" aria-label="Voice to text"><i data-lucide="mic" class="w-4 h-4 text-warm-400" aria-hidden="true"></i></button>
        <div class="flex-1"></div>
        <span class="text-[10px] text-warm-500 font-mono" aria-live="polite">142 words</span>
      </div>
    </div>
  `,
};
