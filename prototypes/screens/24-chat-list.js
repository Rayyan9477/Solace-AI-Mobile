// 24 — Chat list / conversation history
// Your previous Solace sessions grouped by status + per-conversation metadata.

import { statusBar, tabBar } from '../lib/helpers.js';

export const screen = {
  id: 'chat-list',
  label: 'Conversations list',
  section: 'therapy',
  render: () => {
    const conversations = [
      { title: 'Work stress & boundaries',  preview: 'Let us reframe that meeting&hellip;',    time: '3m', unread: true, hue: '155,196,176', tag: 'CBT',         msgs: 12 },
      { title: 'Morning anxiety routine',   preview: 'Try starting with 5 breaths before&hellip;', time: '2h',             hue: '155,196,176', tag: 'Mindfulness', msgs: 8 },
      { title: 'Processing the breakup',    preview: 'Grief takes time &mdash; that is okay.', time: '1d',             hue: '168,154,224', tag: 'Support',     msgs: 34 },
      { title: 'Sleep routine check-in',    preview: 'Your bedtime has improved by 20 min',    time: '3d',             hue: '168,154,224', tag: 'Sleep',       msgs: 6  },
      { title: 'Handling the interview',    preview: 'Congratulations on getting to stage 3!', time: '1w',             hue: '244,167,126', tag: 'Growth',      msgs: 22 },
    ];
    return `
      ${statusBar}
      <div class="bg-midnight-950 h-full relative">
        <div class="absolute top-0 left-0 right-0 h-72 opacity-40" aria-hidden="true"
             style="background:radial-gradient(ellipse at 70% 0%,rgba(168,154,224,0.18),transparent 60%);"></div>

        <div class="relative px-6 pt-14 pb-32">
          <header class="flex items-center justify-between mb-2">
            <div>
              <p class="bracket-label text-warm-500">Conversations</p>
              <h1 class="font-display text-[30px] font-light text-warm-50 mt-0.5">Your sessions</h1>
            </div>
            <button type="button" class="icon-btn glass" aria-label="Search conversations">
              <i data-lucide="search" class="w-4 h-4" aria-hidden="true"></i>
            </button>
          </header>

          <!-- Filter tabs -->
          <div class="flex gap-2 mt-5 mb-5" role="tablist">
            <button type="button" role="tab" aria-selected="true" class="px-4 py-2 rounded-full bg-sage-300 text-midnight-950 text-[11px] font-medium" style="min-height:36px;">
              All <span class="font-mono">5</span>
            </button>
            <button type="button" role="tab" aria-selected="false" class="px-4 py-2 rounded-full glass text-warm-400 text-[11px] font-medium" style="min-height:36px;">Active</button>
            <button type="button" role="tab" aria-selected="false" class="px-4 py-2 rounded-full glass text-warm-400 text-[11px] font-medium" style="min-height:36px;">Archived</button>
          </div>

          <!-- Conversations -->
          <ul class="space-y-2.5">
            ${conversations.map(c => `
              <li>
                <button type="button" class="w-full glass rounded-2xl p-4 text-left flex items-start gap-3 relative overflow-hidden">
                  <div class="absolute top-0 left-0 bottom-0 w-1 rounded-r-full" style="background:rgba(${c.hue},0.65);" aria-hidden="true"></div>
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ml-1" style="background:linear-gradient(135deg,rgba(${c.hue},0.2),rgba(${c.hue},0.08));border:1px solid rgba(${c.hue},0.3);">
                    <i data-lucide="sparkles" class="w-4 h-4" style="color:rgb(${c.hue});" aria-hidden="true"></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-2 mb-1">
                      <p class="text-[13px] font-medium text-warm-50 truncate">${c.title}</p>
                      ${c.unread ? '<span class="w-2 h-2 rounded-full bg-peach-300 flex-shrink-0" aria-label="Unread"></span>' : ''}
                    </div>
                    <p class="text-[11px] text-warm-400 truncate mb-1.5">${c.preview}</p>
                    <div class="flex items-center gap-2">
                      <span class="text-[9px] bracket-label" style="color:rgb(${c.hue});">${c.tag}</span>
                      <span class="text-[9px] text-warm-500 opacity-40" aria-hidden="true">&middot;</span>
                      <span class="text-[9px] text-warm-500 font-mono">${c.msgs} msgs</span>
                      <span class="text-[9px] text-warm-500 ml-auto font-mono">${c.time} ago</span>
                    </div>
                  </div>
                </button>
              </li>
            `).join('')}
          </ul>
        </div>

        <button type="button" class="absolute bottom-28 right-6 icon-btn btn-peach" style="width:56px;height:56px;" aria-label="Start a new conversation">
          <i data-lucide="plus" class="w-6 h-6" aria-hidden="true"></i>
        </button>

        ${tabBar('chat')}
      </div>
    `;
  },
};
