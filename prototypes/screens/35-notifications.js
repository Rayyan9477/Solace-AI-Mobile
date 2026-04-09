// 35 — Notifications inbox
// Grouped by Today / Yesterday / Earlier with filter pills.

import { statusBar, miniHeader } from '../lib/helpers.js';

export const screen = {
  id: 'notifications',
  label: 'Notifications inbox',
  section: 'system',
  render: () => {
    const filters = ['All','Insights','Reminders','Achievements'];
    const today = [
      { icon: 'sparkles',     title: 'Your Solace Score went up',  desc: '+5 points since last week. Keep going!', time: '3m', hue: '155,196,176', unread: true },
      { icon: 'trending-up',  title: 'Streak milestone: 23 days',  desc: 'This is your longest streak yet.',        time: '2h', hue: '244,167,126', unread: true },
    ];
    const yesterday = [
      { icon: 'bell',         title: 'Evening check-in reminder',  desc: "How&rsquo;s your day winding down?",     time: '6:30 PM', hue: '168,154,224' },
      { icon: 'book-open',    title: 'Your weekly summary is ready', desc: 'Review your mood patterns for the week', time: '9:00 AM', hue: '155,196,176' },
    ];
    return `
      ${statusBar}
      <div class="bg-midnight-950 h-full relative">
        <div class="absolute top-0 left-0 right-0 h-72 opacity-40" aria-hidden="true"
             style="background:radial-gradient(ellipse at 50% 0%,rgba(107,143,255,0.18),transparent 60%);"></div>

        <div class="relative px-6 pt-14 pb-32">
          ${miniHeader('Notifications', '<button type="button" class="text-[10px] text-aurora-300 font-medium px-2 py-2">Mark all read</button>')}

          <h1 class="font-display text-[30px] font-light text-warm-50 leading-tight">Inbox</h1>
          <p class="text-[13px] text-warm-400 mt-1 mb-6"><span class="text-peach-300 font-medium">3 new</span> &middot; this week</p>

          <!-- Filter pills -->
          <div class="flex gap-2 mb-5" role="tablist" aria-label="Notification filters">
            ${filters.map((f,i)=>`
              <button type="button" role="tab" aria-selected="${i===0?'true':'false'}"
                      class="chip ${i===0?'!bg-sage-300/15 !border-sage-300/35 !text-sage-300':''}"
                      style="min-height:36px;">${f}</button>
            `).join('')}
          </div>

          <!-- Today -->
          <h2 class="bracket-label text-warm-500 mb-3">Today</h2>
          <ul class="space-y-2 mb-5">
            ${today.map(n => `
              <li class="glass rounded-2xl p-4 flex items-start gap-3 relative">
                ${n.unread?'<div class="absolute top-4 right-4 w-2 h-2 rounded-full bg-peach-300" aria-label="Unread"></div>':''}
                <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style="background:rgba(${n.hue},0.12);border:1px solid rgba(${n.hue},0.22);">
                  <i data-lucide="${n.icon}" class="w-4 h-4" style="color:rgb(${n.hue});" aria-hidden="true"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-[12px] font-medium text-warm-50">${n.title}</p>
                  <p class="text-[10px] text-warm-500 mt-0.5 leading-relaxed">${n.desc}</p>
                  <p class="text-[9px] text-warm-500 mt-1.5 font-mono">${n.time} ago</p>
                </div>
              </li>
            `).join('')}
          </ul>

          <!-- Yesterday -->
          <h2 class="bracket-label text-warm-500 mb-3">Yesterday</h2>
          <ul class="space-y-2 mb-5">
            ${yesterday.map(n => `
              <li class="glass rounded-2xl p-4 flex items-start gap-3 opacity-65">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style="background:rgba(${n.hue},0.12);border:1px solid rgba(${n.hue},0.22);">
                  <i data-lucide="${n.icon}" class="w-4 h-4" style="color:rgb(${n.hue});" aria-hidden="true"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-[12px] font-medium text-warm-50">${n.title}</p>
                  <p class="text-[10px] text-warm-500 mt-0.5">${n.desc}</p>
                  <p class="text-[9px] text-warm-500 mt-1.5 font-mono">${n.time}</p>
                </div>
              </li>
            `).join('')}
          </ul>

          <!-- Earlier -->
          <h2 class="bracket-label text-warm-500 mb-3">Earlier this week</h2>
          <ul class="space-y-2">
            <li class="glass rounded-2xl p-4 flex items-start gap-3 opacity-65">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style="background:rgba(244,167,126,0.12);border:1px solid rgba(244,167,126,0.22);">
                <i data-lucide="gift" class="w-4 h-4 text-peach-300" aria-hidden="true"></i>
              </div>
              <div class="flex-1">
                <p class="text-[12px] font-medium text-warm-50">New soundscape unlocked</p>
                <p class="text-[10px] text-warm-500 mt-0.5">&ldquo;Tibetan singing bowl&rdquo; is now available</p>
                <p class="text-[9px] text-warm-500 mt-1.5 font-mono">3 days ago</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    `;
  },
};
