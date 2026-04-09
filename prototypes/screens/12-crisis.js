// 12 — Crisis support
// Soft warm palette (not alarming red). Direct call/text/international + talk to AI fallback.

import { statusBar } from '../lib/helpers.js';

export const screen = {
  id: 'crisis',
  label: 'Crisis support',
  section: 'wellness',
  render: () => `
    ${statusBar}
    <div class="h-full relative" style="background: linear-gradient(180deg, #1A1530 0%, #0E1430 50%, #040818 100%);">
      <!-- Soft warm glow (not alarming) -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full" aria-hidden="true"
           style="background:radial-gradient(circle, rgba(244,167,126,0.2), transparent 60%);filter:blur(42px);"></div>

      <!-- Top bar -->
      <header class="relative px-6 pt-14 flex justify-end">
        <button type="button" class="icon-btn glass" aria-label="Close crisis support">
          <i data-lucide="x" class="w-4 h-4" aria-hidden="true"></i>
        </button>
      </header>

      <div class="relative px-6 pt-6 pb-12">

        <!-- Soft heart icon -->
        <div class="flex justify-center mb-6" aria-hidden="true">
          <div class="w-24 h-24 rounded-full flex items-center justify-center"
               style="background: radial-gradient(circle, rgba(244,167,126,0.18), transparent 70%);">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-peach-300/35 to-peach-300/10 backdrop-blur-xl flex items-center justify-center border border-peach-300/30"
                 style="box-shadow: 0 8px 24px -8px rgba(244,167,126,0.55);">
              <i data-lucide="heart-handshake" class="w-7 h-7 text-peach-300"></i>
            </div>
          </div>
        </div>

        <p class="bracket-label text-peach-300 text-center mb-3">You are not alone</p>
        <h1 class="font-display text-[34px] font-light text-warm-50 text-center leading-[1.05] mb-3">
          We&rsquo;re here<br/>
          <span class="italic">for you.</span>
        </h1>
        <p class="text-warm-400 text-[13px] text-center max-w-[280px] mx-auto leading-relaxed mb-8">
          Talk to someone right now &mdash; completely confidential, available 24/7.
        </p>

        <!-- Resource cards -->
        <div class="space-y-3 mb-5">
          <a href="tel:988" class="w-full hero-card glass-strong rounded-2xl p-4 flex items-center gap-4 border border-peach-300/25" style="min-height:76px;text-decoration:none;">
            <div class="w-12 h-12 rounded-xl bg-peach-300/15 border border-peach-300/30 flex items-center justify-center flex-shrink-0">
              <i data-lucide="phone" class="w-5 h-5 text-peach-300" aria-hidden="true"></i>
            </div>
            <div class="flex-1 text-left">
              <p class="text-[13px] font-semibold text-warm-50">Call <span class="font-mono">988</span></p>
              <p class="text-[10px] text-warm-400 mt-0.5">Suicide &amp; Crisis Lifeline &middot; 24/7</p>
            </div>
            <div class="w-11 h-11 rounded-full btn-peach flex items-center justify-center flex-shrink-0" aria-hidden="true">
              <i data-lucide="phone" class="w-4 h-4"></i>
            </div>
          </a>

          <button type="button" class="w-full glass rounded-2xl p-4 flex items-center gap-4" style="min-height:76px;">
            <div class="w-12 h-12 rounded-xl bg-sage-300/15 border border-sage-300/25 flex items-center justify-center flex-shrink-0">
              <i data-lucide="message-square" class="w-5 h-5 text-sage-300" aria-hidden="true"></i>
            </div>
            <div class="flex-1 text-left">
              <p class="text-[13px] font-medium text-warm-50">Text <span class="font-mono">HOME</span> to <span class="font-mono">741741</span></p>
              <p class="text-[10px] text-warm-400 mt-0.5">Crisis Text Line &middot; Free SMS</p>
            </div>
            <i data-lucide="arrow-right" class="w-4 h-4 text-warm-500 flex-shrink-0" aria-hidden="true"></i>
          </button>

          <button type="button" class="w-full glass rounded-2xl p-4 flex items-center gap-4" style="min-height:76px;">
            <div class="w-12 h-12 rounded-xl bg-aurora-300/15 border border-aurora-300/25 flex items-center justify-center flex-shrink-0">
              <i data-lucide="globe" class="w-5 h-5 text-aurora-300" aria-hidden="true"></i>
            </div>
            <div class="flex-1 text-left">
              <p class="text-[13px] font-medium text-warm-50">International resources</p>
              <p class="text-[10px] text-warm-400 mt-0.5">Find help in your country</p>
            </div>
            <i data-lucide="arrow-right" class="w-4 h-4 text-warm-500 flex-shrink-0" aria-hidden="true"></i>
          </button>
        </div>

        <!-- Talk to AI fallback -->
        <div class="glass rounded-2xl p-4 mb-4">
          <div class="flex items-start gap-3">
            <div class="w-9 h-9 rounded-full bg-gradient-to-br from-sage-300 via-aurora-300 to-lavender-300 flex items-center justify-center flex-shrink-0" aria-hidden="true">
              <i data-lucide="sparkles" class="w-4 h-4 text-midnight-950"></i>
            </div>
            <div class="flex-1">
              <p class="text-[12px] font-medium text-warm-50 mb-1">Or talk to Solace</p>
              <p class="text-[10px] text-warm-400 leading-relaxed">
                If you&rsquo;re not ready for a person, I&rsquo;m here to listen &mdash; no judgment.
              </p>
            </div>
          </div>
          <button type="button" class="w-full mt-3 rounded-xl bg-warm-50/8 text-warm-50 text-[11px] font-medium border border-white/10" style="min-height:44px;">
            Start a conversation
          </button>
        </div>

        <button type="button" class="w-full text-center text-[11px] text-warm-500 py-3">I&rsquo;m okay, dismiss</button>
      </div>
    </div>
  `,
};
