// 02 — Sign in
// Returning-user flow. Email + password + social providers + remember me.

import { statusBar } from '../lib/helpers.js';

export const screen = {
  id: 'signin',
  label: 'Sign in',
  section: 'auth',
  render: () => `
    ${statusBar}
    <div class="bg-midnight-950 h-full relative">
      <!-- Cosmic top wash -->
      <div class="absolute top-0 left-0 right-0 h-80 mesh-bg opacity-70" aria-hidden="true"></div>
      <div class="absolute top-20 right-0 w-56 h-56 smoke" aria-hidden="true"></div>

      <div class="relative z-10 px-8 pt-16 pb-8">
        <button type="button" class="icon-btn glass mb-12" aria-label="Go back">
          <i data-lucide="arrow-left" class="w-4 h-4" aria-hidden="true"></i>
        </button>

        <p class="bracket-label text-aurora-300 mb-3">Welcome back</p>
        <h1 class="font-display text-[40px] font-light text-warm-50 leading-[1.05] mb-2">
          Sign in to<br/>
          <span class="italic">continue.</span>
        </h1>
        <p class="text-warm-400 text-sm mb-10">Pick up exactly where you left off.</p>

        <!-- Form -->
        <form class="space-y-4 mb-6" onsubmit="event.preventDefault()">
          <div>
            <label for="signin-email" class="bracket-label text-warm-500 mb-2 block">Email address</label>
            <div class="glass rounded-2xl px-4 flex items-center gap-3" style="min-height:52px;">
              <i data-lucide="mail" class="w-4 h-4 text-warm-400" aria-hidden="true"></i>
              <input id="signin-email" type="email" autocomplete="email"
                     placeholder="you@example.com"
                     class="bg-transparent flex-1 outline-none text-sm placeholder-warm-500 py-3" />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <label for="signin-password" class="bracket-label text-warm-500">Password</label>
              <button type="button" class="text-[10px] text-aurora-300 font-medium">Forgot?</button>
            </div>
            <div class="glass rounded-2xl px-4 flex items-center gap-3" style="min-height:52px;">
              <i data-lucide="lock" class="w-4 h-4 text-warm-400" aria-hidden="true"></i>
              <input id="signin-password" type="password" autocomplete="current-password"
                     placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                     class="bg-transparent flex-1 outline-none text-sm placeholder-warm-500 py-3" />
              <button type="button" class="icon-btn" style="width:44px;height:44px;" aria-label="Show password">
                <i data-lucide="eye-off" class="w-4 h-4 text-warm-500" aria-hidden="true"></i>
              </button>
            </div>
          </div>

          <!-- Remember me -->
          <label class="flex items-center gap-2 text-[11px] text-warm-400 cursor-pointer" style="min-height:32px;">
            <div class="w-4 h-4 rounded bg-sage-300 flex items-center justify-center flex-shrink-0">
              <i data-lucide="check" class="w-2.5 h-2.5 text-midnight-950" stroke-width="3" aria-hidden="true"></i>
            </div>
            Keep me signed in on this device
          </label>

          <button type="submit" class="btn btn-sage w-full mt-4">
            Continue
            <i data-lucide="arrow-right" class="w-4 h-4" aria-hidden="true"></i>
          </button>
        </form>

        <!-- Divider -->
        <div class="flex items-center gap-3 mb-5" aria-hidden="true">
          <div class="flex-1 h-px bg-white/8"></div>
          <span class="bracket-label text-warm-500">or</span>
          <div class="flex-1 h-px bg-white/8"></div>
        </div>

        <!-- Social providers -->
        <div class="grid grid-cols-3 gap-3" role="group" aria-label="Sign in with">
          <button type="button" class="glass rounded-2xl flex items-center justify-center" style="min-height:52px;" aria-label="Sign in with Apple">
            <i data-lucide="apple" class="w-5 h-5" aria-hidden="true"></i>
          </button>
          <button type="button" class="glass rounded-2xl flex items-center justify-center" style="min-height:52px;" aria-label="Sign in with Google">
            <svg viewBox="0 0 24 24" class="w-5 h-5" fill="currentColor" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </button>
          <button type="button" class="glass rounded-2xl flex items-center justify-center" style="min-height:52px;" aria-label="Sign in with GitHub">
            <svg viewBox="0 0 24 24" class="w-5 h-5" fill="currentColor" aria-hidden="true"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
          </button>
        </div>

        <p class="text-center text-[11px] text-warm-500 mt-8">
          New here? <button type="button" class="text-aurora-300 font-medium">Create an account</button>
        </p>
      </div>
    </div>
  `,
};
