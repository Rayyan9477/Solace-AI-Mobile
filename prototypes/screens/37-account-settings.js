// 37 — Account settings
// Hierarchical settings: Account / Preferences / Privacy & safety / Sign out.

import { statusBar, miniHeader } from '../lib/helpers.js';

export const screen = {
  id: 'account-settings',
  label: 'Account settings',
  section: 'system',
  render: () => {
    const sections = [
      {
        label: 'Account',
        items: [
          { icon: 'user',        label: 'Personal information' },
          { icon: 'mail',        label: 'Email address',  value: 'rayyan@&hellip;' },
          { icon: 'lock',        label: 'Change password' },
          { icon: 'credit-card', label: 'Subscription',   value: 'Plus Annual' },
        ],
      },
      {
        label: 'Preferences',
        items: [
          { icon: 'bell',  label: 'Notifications',    value: 'On' },
          { icon: 'moon',  label: 'Appearance',       value: 'Dark' },
          { icon: 'globe', label: 'Language',         value: 'English' },
          { icon: 'clock', label: 'Daily check-in',   value: '9:00 AM' },
        ],
      },
      {
        label: 'Privacy & safety',
        items: [
          { icon: 'shield',    label: 'Privacy & security' },
          { icon: 'scan-face', label: 'Face ID', toggle: true },
          { icon: 'download',  label: 'Export my data' },
          { icon: 'trash-2',   label: 'Delete account', danger: true },
        ],
      },
    ];
    return `
      ${statusBar}
      <div class="bg-midnight-950 h-full relative">
        <div class="absolute top-0 left-0 right-0 h-72 opacity-40" aria-hidden="true"
             style="background:radial-gradient(ellipse at 50% 0%,rgba(107,143,255,0.15),transparent 60%);"></div>

        <div class="relative px-6 pt-14 pb-10">
          ${miniHeader('Settings')}
          <h1 class="font-display text-[30px] font-light text-warm-50 mb-5 leading-tight">Account</h1>

          <!-- Account card -->
          <div class="hero-card glass-strong rounded-2xl p-4 flex items-center gap-3 mb-5">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-sage-300 via-aurora-300 to-peach-300 p-0.5"
                 style="box-shadow: 0 0 40px -10px rgba(107,143,255,0.5);">
              <div class="w-full h-full rounded-full bg-midnight-800 flex items-center justify-center">
                <span class="font-display text-lg text-warm-50" aria-hidden="true">R</span>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[13px] font-medium text-warm-50">Rayyan Ahmed</p>
              <p class="text-[10px] text-warm-500 font-mono">rayyan@solace.ai</p>
            </div>
            <span class="chip !bg-sage-300/12 !text-sage-300 !border-sage-300/22">Plus</span>
          </div>

          ${sections.map(sec => `
            <section class="mb-5" aria-labelledby="set-${sec.label.replace(/\s|&/g,'-').toLowerCase()}">
              <h2 id="set-${sec.label.replace(/\s|&/g,'-').toLowerCase()}" class="bracket-label text-warm-500 mb-2 px-2">${sec.label}</h2>
              <div class="glass rounded-2xl divide-y divide-white/5">
                ${sec.items.map(item => `
                  <button type="button" class="w-full px-4 flex items-center gap-3" style="min-height:56px;">
                    <div class="w-8 h-8 rounded-lg bg-white/4 flex items-center justify-center">
                      <i data-lucide="${item.icon}" class="w-4 h-4 ${item.danger?'text-peach-300':'text-sage-300'}" aria-hidden="true"></i>
                    </div>
                    <span class="text-[13px] ${item.danger?'text-peach-300':'text-warm-50'} flex-1 text-left">${item.label}</span>
                    ${item.value ? `<span class="text-[10px] text-warm-500 font-mono">${item.value}</span>` : ''}
                    ${item.toggle ? `
                      <div class="w-10 h-5 rounded-full bg-sage-300 relative" role="switch" aria-checked="true" aria-label="${item.label}">
                        <div class="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-warm-50"></div>
                      </div>
                    ` : ''}
                    ${!item.toggle && !item.danger ? '<i data-lucide="chevron-right" class="w-3.5 h-3.5 text-warm-500" aria-hidden="true"></i>' : ''}
                  </button>
                `).join('')}
              </div>
            </section>
          `).join('')}

          <button type="button" class="w-full glass rounded-2xl flex items-center justify-center gap-2 text-[13px] text-peach-300 mt-2" style="min-height:52px;">
            <i data-lucide="log-out" class="w-4 h-4" aria-hidden="true"></i> Sign out
          </button>

          <p class="text-[9px] text-warm-500 text-center mt-6 font-mono">Solace v4.2.0 &middot; Made with care</p>
        </div>
      </div>
    `;
  },
};
