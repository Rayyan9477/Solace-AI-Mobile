// 07 — AI chat (active session)
// Conversational therapy with Solace. CBT mode indicator, voice button, action cards.

import { statusBar } from '../lib/helpers.js';

export const screen = {
  id: 'chat',
  label: 'AI chat',
  section: 'main',
  render: () => `
    ${statusBar}
    <div class="bg-midnight-950 h-full relative flex flex-col">

      <!-- Header -->
      <header class="px-5 pt-14 pb-4 glass-strong border-b border-white/5">
        <div class="flex items-center gap-3">
          <button type="button" class="icon-btn glass" aria-label="Back to conversations">
            <i data-lucide="arrow-left" class="w-4 h-4" aria-hidden="true"></i>
          </button>
          <div class="relative">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-sage-300 via-aurora-300 to-lavender-300 flex items-center justify-center"
                 style="box-shadow: 0 0 20px -4px rgba(107,143,255,0.5);">
              <i data-lucide="sparkles" class="w-4 h-4 text-midnight-950" aria-hidden="true"></i>
            </div>
            <span class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-sage-300 border-2 border-midnight-800" aria-hidden="true"></span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-warm-50">Solace</p>
            <p class="text-[10px] text-sage-300 flex items-center gap-1">
              <span>Always here</span>
              <span class="opacity-40">&middot;</span>
              <span class="text-warm-500">CBT mode</span>
            </p>
          </div>
          <button type="button" class="icon-btn glass" aria-label="Start voice call">
            <i data-lucide="phone" class="w-4 h-4" aria-hidden="true"></i>
          </button>
          <button type="button" class="icon-btn glass" aria-label="Conversation options">
            <i data-lucide="more-horizontal" class="w-4 h-4" aria-hidden="true"></i>
          </button>
        </div>
      </header>

      <!-- Messages -->
      <div class="flex-1 px-5 py-5 space-y-4 overflow-y-auto" role="log" aria-live="polite" aria-label="Chat messages">
        <p class="text-center text-[10px] text-warm-500 bracket-label">Today, 2:45 PM</p>

        <!-- AI message -->
        <div class="flex gap-2.5 max-w-[85%]">
          <div class="w-7 h-7 rounded-full bg-gradient-to-br from-sage-300 via-aurora-300 to-lavender-300 flex items-center justify-center flex-shrink-0" aria-hidden="true">
            <i data-lucide="sparkles" class="w-3 h-3 text-midnight-950"></i>
          </div>
          <div class="glass rounded-2xl rounded-tl-sm px-4 py-3">
            <p class="text-[13px] text-warm-50 leading-relaxed">
              Hey Rayyan. How are you feeling about that meeting you mentioned earlier?
            </p>
          </div>
        </div>

        <!-- User message -->
        <div class="flex justify-end">
          <div class="max-w-[80%] rounded-2xl rounded-tr-sm px-4 py-3"
               style="background: linear-gradient(135deg, #F4A77E 0%, #E88B5A 100%); box-shadow: 0 4px 14px -4px rgba(244,167,126,0.4);">
            <p class="text-[13px] text-midnight-950 leading-relaxed font-medium">
              Honestly, anxious. I keep replaying it in my head.
            </p>
          </div>
        </div>

        <!-- AI message with action card -->
        <div class="flex gap-2.5 max-w-[88%]">
          <div class="w-7 h-7 rounded-full bg-gradient-to-br from-sage-300 via-aurora-300 to-lavender-300 flex items-center justify-center flex-shrink-0" aria-hidden="true">
            <i data-lucide="sparkles" class="w-3 h-3 text-midnight-950"></i>
          </div>
          <div class="space-y-2 flex-1">
            <div class="glass rounded-2xl rounded-tl-sm px-4 py-3">
              <p class="text-[13px] text-warm-50 leading-relaxed">
                That&rsquo;s a really common pattern called <span class="text-sage-300 font-medium">rumination</span>.
                Let&rsquo;s try a quick grounding exercise to interrupt it.
              </p>
            </div>

            <!-- Feedback chips -->
            <div class="flex gap-1.5" role="group" aria-label="Rate this response">
              <button type="button" class="chip text-[9px] py-1 px-2" style="min-height:28px;">
                <i data-lucide="thumbs-up" class="w-2.5 h-2.5" aria-hidden="true"></i>This helped
              </button>
              <button type="button" class="chip text-[9px] py-1 px-2" style="min-height:28px;">
                <i data-lucide="thumbs-down" class="w-2.5 h-2.5" aria-hidden="true"></i>Not quite
              </button>
            </div>

            <!-- Action card -->
            <button type="button" class="w-full hero-card glass-aurora rounded-2xl px-4 py-3.5 flex items-center gap-3 mt-1"
                    aria-label="Start 4-7-8 breathing exercise, 2 minutes">
              <div class="w-10 h-10 rounded-xl bg-sage-300/15 border border-sage-300/30 flex items-center justify-center">
                <i data-lucide="wind" class="w-5 h-5 text-sage-300" aria-hidden="true"></i>
              </div>
              <div class="flex-1 text-left">
                <p class="text-[12px] font-medium text-warm-50">Try: 4-7-8 Breathing</p>
                <p class="text-[10px] text-warm-500 mt-0.5">2 minutes &middot; in-app</p>
              </div>
              <div class="w-9 h-9 rounded-full bg-sage-300 text-midnight-950 flex items-center justify-center flex-shrink-0">
                <i data-lucide="play" class="w-4 h-4 ml-0.5" aria-hidden="true"></i>
              </div>
            </button>
          </div>
        </div>

        <!-- Typing indicator -->
        <div class="flex gap-2.5" aria-label="Solace is typing">
          <div class="w-7 h-7 rounded-full bg-gradient-to-br from-sage-300 via-aurora-300 to-lavender-300 flex items-center justify-center flex-shrink-0" aria-hidden="true">
            <i data-lucide="sparkles" class="w-3 h-3 text-midnight-950"></i>
          </div>
          <div class="glass rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-sage-300 animate-pulse"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-sage-300 animate-pulse" style="animation-delay:0.2s"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-sage-300 animate-pulse" style="animation-delay:0.4s"></span>
          </div>
        </div>
      </div>

      <!-- Input -->
      <form class="px-5 pb-7 pt-3 border-t border-white/5" onsubmit="event.preventDefault()">
        <div class="glass rounded-full pl-4 pr-1.5 py-1.5 flex items-center gap-2">
          <button type="button" class="icon-btn" style="width:44px;height:44px;" aria-label="Attach file">
            <i data-lucide="plus" class="w-5 h-5 text-warm-400" aria-hidden="true"></i>
          </button>
          <label for="chat-input" class="sr-only">Message Solace</label>
          <input id="chat-input" type="text"
                 placeholder="Type how you feel&hellip;"
                 class="flex-1 bg-transparent outline-none text-[13px] text-warm-50 placeholder-warm-500 py-2" />
          <button type="button" class="icon-btn" style="width:44px;height:44px;" aria-label="Record voice message">
            <i data-lucide="mic" class="w-4 h-4 text-warm-400" aria-hidden="true"></i>
          </button>
          <button type="submit" class="icon-btn btn-sage" style="width:40px;height:40px;" aria-label="Send message">
            <i data-lucide="arrow-up" class="w-4 h-4" aria-hidden="true"></i>
          </button>
        </div>
      </form>
    </div>
  `,
};
