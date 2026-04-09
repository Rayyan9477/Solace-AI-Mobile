// 09 — Profile
// Avatar + stats + settings sections.

import { statusBar, tabBar } from '../lib/helpers.js';

export const screen = {
  id: 'profile',
  label: 'Profile',
  section: 'main',
  render: () => {
    const stats = [
      { v: '23',  u: 'd', label: 'Streak',   icon: 'flame',           color: 'peach-300' },
      { v: '142', u: '',  label: 'Sessions', icon: 'message-circle',  color: 'sage-300' },
      { v: '12',  u: 'h', label: 'Mindful',  icon: 'wind',            color: 'aurora-300' },
    ];
    const account = [
      { icon: 'user',   label: 'Personal information' },
      { icon: 'bell',   label: 'Notifications', badge: '3' },
      { icon: 'shield', label: 'Privacy & security' },
      { icon: 'globe',  label: 'Language', value: 'English' },
    ];
    const support = [
      { icon: 'life-buoy',      label: 'Help center' },
      { icon: 'message-square', label: 'Send feedback' },
      { icon: 'gift',           label: 'Invite friends' },
    ];
    return `
      ${statusBar}
      <div class="bg-midnight-950 h-full relative">
        <div class="absolute top-0 left-0 right-0 h-80 opacity-50" aria-hidden="true"
             style="background:radial-gradient(ellipse at 50% 0%, rgba(107,143,255,0.15), transparent 60%);"></div>

        <div class="relative px-6 pt-14 pb-32">

          <!-- Profile header -->
          <div class="text-center mb-6">
            <div class="relative inline-block">
              <div class="w-24 h-24 rounded-full bg-gradient-to-br from-sage-300 via-aurora-300 to-peach-300 p-1"
                   style="box-shadow: 0 0 60px -10px rgba(107,143,255,0.4);">
                <div class="w-full h-full rounded-full bg-midnight-800 flex items-center justify-center">
                  <span class="font-display text-3xl font-light text-warm-50" aria-hidden="true">R</span>
                </div>
              </div>
              <button type="button" class="absolute -bottom-1 -right-1 w-8 h-8 rounded-full btn-peach flex items-center justify-center border-2 border-midnight-950"
                      aria-label="Change photo">
                <i data-lucide="camera" class="w-3 h-3" aria-hidden="true"></i>
              </button>
            </div>
            <h1 class="font-display text-[26px] font-light text-warm-50 mt-3 leading-tight">Rayyan Ahmed</h1>
            <span class="chip mt-1 inline-flex">
              <i data-lucide="sparkles" class="w-2.5 h-2.5 text-peach-300" aria-hidden="true"></i>
              Premium member
            </span>
          </div>

          <!-- Stats grid -->
          <div class="grid grid-cols-3 gap-2.5 mb-6" role="group" aria-label="Your stats">
            ${stats.map(s => `
              <div class="glass rounded-2xl p-3.5 text-center">
                <i data-lucide="${s.icon}" class="w-3 h-3 text-${s.color} mx-auto mb-1.5" aria-hidden="true"></i>
                <p class="font-display text-[22px] font-light text-warm-50 leading-none">
                  ${s.v}<span class="text-[10px] text-warm-400 ml-0.5 font-mono">${s.u}</span>
                </p>
                <p class="text-[9px] text-warm-500 mt-1 bracket-label">${s.label}</p>
              </div>
            `).join('')}
          </div>

          <!-- Settings groups -->
          <div class="space-y-4">
            ${[
              { label: 'Account', items: account, accent: 'sage-300' },
              { label: 'Support', items: support, accent: 'aurora-300' },
            ].map(sec => `
              <section aria-labelledby="profile-${sec.label.toLowerCase()}-heading">
                <h2 id="profile-${sec.label.toLowerCase()}-heading" class="bracket-label text-warm-500 mb-2 px-2">${sec.label}</h2>
                <div class="glass rounded-2xl divide-y divide-white/5">
                  ${sec.items.map(item => `
                    <button type="button" class="w-full px-4 flex items-center gap-3" style="min-height:56px;">
                      <div class="w-8 h-8 rounded-lg bg-white/4 flex items-center justify-center flex-shrink-0">
                        <i data-lucide="${item.icon}" class="w-4 h-4 text-${sec.accent}" aria-hidden="true"></i>
                      </div>
                      <span class="text-sm text-warm-50 flex-1 text-left">${item.label}</span>
                      ${item.badge ? `<span class="px-2 py-0.5 rounded-full bg-peach-300 text-midnight-950 text-[9px] font-bold" aria-label="${item.badge} unread">${item.badge}</span>` : ''}
                      ${item.value ? `<span class="text-[11px] text-warm-500 font-mono">${item.value}</span>` : ''}
                      <i data-lucide="chevron-right" class="w-4 h-4 text-warm-500" aria-hidden="true"></i>
                    </button>
                  `).join('')}
                </div>
              </section>
            `).join('')}

            <button type="button" class="w-full glass rounded-2xl flex items-center justify-center gap-2 text-sm text-peach-300 mt-4" style="min-height:52px;">
              <i data-lucide="log-out" class="w-4 h-4" aria-hidden="true"></i> Sign out
            </button>

            <p class="text-[9px] text-warm-500 text-center mt-2 font-mono">Solace v4.0.0 &middot; Made with care</p>
          </div>
        </div>
        ${tabBar('profile')}
      </div>
    `;
  },
};
