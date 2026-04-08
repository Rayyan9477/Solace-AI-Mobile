// Solace AI - Prototype Screens v3.0
// Each screen refined with the cosmic editorial system inspired by Draper, LangSmith, Calm.
// Same level of craftsmanship and dedication on every screen.

// ------------------------------------------------------------------
// Shared helpers (v3)
// ------------------------------------------------------------------

const phone = (id, content) => `
  <div>
    <p class="bracket-label text-warm-500 mb-3 text-center">${id}</p>
    <div class="phone grain">
      <div class="frame">${content}</div>
    </div>
  </div>
`;

// Status bar — refined with monospace clock + tighter icons
const statusBar = `
  <div class="absolute top-4 left-0 right-0 px-8 flex justify-between items-center text-[11px] font-medium text-warm-50 z-40">
    <span class="font-mono tracking-tight">9:41</span>
    <div class="flex items-center gap-1.5">
      <i data-lucide="signal" class="w-3 h-3"></i>
      <i data-lucide="wifi" class="w-3 h-3"></i>
      <i data-lucide="battery-full" class="w-4 h-4"></i>
    </div>
  </div>
`;

// Bottom tab bar — refined with active dot indicator
const tabBar = (active) => `
  <div class="absolute bottom-0 left-0 right-0 px-5 pt-3 pb-7" style="background:linear-gradient(to top, #040818 70%, transparent);">
    <div class="glass-strong rounded-full flex justify-around items-center px-3 py-2.5">
      ${[
        { name: 'home', icon: 'home', label: 'Home' },
        { name: 'mood', icon: 'heart', label: 'Mood' },
        { name: 'chat', icon: 'message-circle', label: 'Chat' },
        { name: 'journal', icon: 'book-open', label: 'Journal' },
        { name: 'profile', icon: 'user', label: 'You' },
      ].map(t => `
        <button class="flex flex-col items-center gap-1 py-1 px-2 rounded-full ${active === t.name ? 'text-sage-300' : 'text-warm-500'}">
          <i data-lucide="${t.icon}" class="w-[18px] h-[18px]"></i>
          <span class="text-[9px] font-medium ${active === t.name ? 'opacity-100' : 'opacity-60'}">${t.label}</span>
          ${active === t.name ? '<div class="absolute bottom-1 w-1 h-1 rounded-full bg-sage-300"></div>' : ''}
        </button>
      `).join('')}
    </div>
  </div>
`;

// =====================================================================
// SCREEN 1 — WELCOME / SPLASH
// =====================================================================
const welcomeScreen = `
  ${statusBar}
  <div class="mesh-bg h-full relative flex flex-col">
    <!-- Cosmic depth: layered blobs of varying tints -->
    <div class="absolute top-24 left-8 w-48 h-48 breath-orb opacity-70"></div>
    <div class="absolute top-44 right-4 w-40 h-40 breath-orb-warm opacity-50"></div>
    <div class="absolute top-72 left-28 w-32 h-32 rounded-full" style="background:radial-gradient(circle at 30% 30%, rgba(168,154,224,0.5), transparent 70%);filter:blur(24px);"></div>
    <div class="absolute top-12 right-12 w-28 h-28 rounded-full" style="background:radial-gradient(circle at 30% 30%, rgba(107,143,255,0.4), transparent 70%);filter:blur(28px);"></div>

    <div class="relative z-10 flex-1 flex flex-col px-8 pt-12">
      <!-- Logo mark -->
      <div class="flex items-center justify-between mb-auto">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-2xl bg-gradient-to-br from-sage-300 via-aurora-300 to-lavender-300 flex items-center justify-center shadow-aurora-glow">
            <div class="w-3 h-3 rounded-full bg-warm-50"></div>
          </div>
          <span class="font-display text-lg font-medium tracking-tight text-warm-50">Solace</span>
        </div>
        <span class="bracket-label text-warm-500">v3.0</span>
      </div>

      <!-- Hero -->
      <div class="mb-8">
        <p class="bracket-label text-aurora-300 mb-4">Mental wellness, reimagined</p>
        <h1 class="font-display text-[46px] leading-[1.02] font-light text-warm-50 tracking-tight mb-4">
          Find your<br/>
          <span class="italic font-medium gradient-text">quiet within.</span>
        </h1>
        <p class="text-warm-400 text-[15px] leading-relaxed max-w-[300px]">
          AI-powered therapy, mood tracking, and mindful practices &mdash; designed by clinicians, tuned to you.
        </p>
      </div>

      <!-- Trust row -->
      <div class="flex items-center gap-2 mb-5 text-[10px] text-warm-500">
        <i data-lucide="shield-check" class="w-3 h-3 text-sage-300"></i>
        <span>HIPAA-compliant</span>
        <span class="opacity-40">&middot;</span>
        <i data-lucide="lock" class="w-3 h-3 text-sage-300"></i>
        <span>End-to-end encrypted</span>
      </div>

      <!-- CTA -->
      <button class="w-full py-4 rounded-2xl btn-primary font-medium text-[15px] flex items-center justify-center gap-2 mb-3">
        Begin your journey
        <i data-lucide="arrow-right" class="w-4 h-4"></i>
      </button>
      <button class="w-full py-3 text-warm-400 text-sm">
        Already have an account? <span class="text-aurora-300 font-medium">Sign in</span>
      </button>
    </div>
  </div>
`;

// =====================================================================
// SCREEN 2 — SIGN IN
// =====================================================================
const signinScreen = `
  ${statusBar}
  <div class="bg-midnight-950 h-full relative">
    <!-- Cosmic top wash -->
    <div class="absolute top-0 left-0 right-0 h-80 mesh-bg opacity-70"></div>
    <div class="absolute top-20 right-0 w-56 h-56 smoke"></div>

    <div class="relative z-10 px-8 pt-16 pb-8">
      <button class="w-10 h-10 rounded-full glass flex items-center justify-center mb-12">
        <i data-lucide="arrow-left" class="w-4 h-4"></i>
      </button>

      <p class="bracket-label text-aurora-300 mb-3">Welcome back</p>
      <h1 class="font-display text-[40px] font-light text-warm-50 leading-[1.05] mb-2">
        Sign in to<br/>
        <span class="italic">continue.</span>
      </h1>
      <p class="text-warm-400 text-sm mb-10">Pick up exactly where you left off.</p>

      <!-- Form -->
      <div class="space-y-4 mb-6">
        <div>
          <label class="bracket-label text-warm-500 mb-2 block">Email address</label>
          <div class="glass rounded-2xl px-4 py-3.5 flex items-center gap-3 focus-within:border-aurora-300/40">
            <i data-lucide="mail" class="w-4 h-4 text-warm-400"></i>
            <input type="email" placeholder="you@example.com" class="bg-transparent flex-1 outline-none text-sm placeholder-warm-500" />
          </div>
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="bracket-label text-warm-500">Password</label>
            <button class="text-[10px] text-aurora-300 font-medium">Forgot?</button>
          </div>
          <div class="glass rounded-2xl px-4 py-3.5 flex items-center gap-3">
            <i data-lucide="lock" class="w-4 h-4 text-warm-400"></i>
            <input type="password" placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" class="bg-transparent flex-1 outline-none text-sm placeholder-warm-500" />
            <i data-lucide="eye-off" class="w-4 h-4 text-warm-500"></i>
          </div>
        </div>
      </div>

      <!-- Remember me -->
      <label class="flex items-center gap-2 mb-6 text-[11px] text-warm-400 cursor-pointer">
        <div class="w-4 h-4 rounded bg-sage-300 flex items-center justify-center"><i data-lucide="check" class="w-2.5 h-2.5 text-midnight-950" stroke-width="3"></i></div>
        Keep me signed in on this device
      </label>

      <button class="w-full py-4 rounded-2xl btn-sage font-medium text-sm flex items-center justify-center gap-2 mb-6">
        Continue <i data-lucide="arrow-right" class="w-4 h-4"></i>
      </button>

      <div class="flex items-center gap-3 mb-6">
        <div class="flex-1 h-px bg-white/8"></div>
        <span class="text-[10px] text-warm-500 bracket-label">or</span>
        <div class="flex-1 h-px bg-white/8"></div>
      </div>

      <div class="grid grid-cols-3 gap-3">
        <button class="glass rounded-2xl py-3.5 flex items-center justify-center"><i data-lucide="apple" class="w-5 h-5"></i></button>
        <button class="glass rounded-2xl py-3.5 flex items-center justify-center"><svg viewBox="0 0 24 24" class="w-5 h-5" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg></button>
        <button class="glass rounded-2xl py-3.5 flex items-center justify-center"><i data-lucide="github" class="w-5 h-5"></i></button>
      </div>

      <p class="text-center text-[11px] text-warm-500 mt-8">
        New here? <span class="text-aurora-300 font-medium">Create an account</span>
      </p>
    </div>
  </div>
`;

// =====================================================================
// SCREEN 3 — ONBOARDING
// =====================================================================
const onboardingScreen = `
  ${statusBar}
  <div class="bg-midnight-950 h-full relative flex flex-col">
    <!-- Top illustration area -->
    <div class="h-[440px] relative overflow-hidden">
      <div class="absolute inset-0" style="background: linear-gradient(180deg, #161D3D 0%, #0E1430 60%, #040818 100%);"></div>
      <!-- Cosmic blobs -->
      <div class="absolute top-20 left-8 w-44 h-44 smoke opacity-80"></div>
      <div class="absolute top-32 right-12 w-32 h-32 breath-orb opacity-50"></div>

      <!-- Concentric ring illustration -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="relative">
          <div class="w-72 h-72 rounded-full border border-aurora-300/8"></div>
          <div class="absolute inset-6 rounded-full border border-aurora-300/12"></div>
          <div class="absolute inset-14 rounded-full border border-sage-300/15"></div>
          <div class="absolute inset-22 rounded-full border border-sage-300/20"></div>
          <div class="absolute inset-28 rounded-full bg-gradient-to-br from-sage-300/25 via-aurora-300/20 to-lavender-300/20 backdrop-blur-2xl flex items-center justify-center border border-white/10">
            <i data-lucide="sparkles" class="w-9 h-9 text-sage-300"></i>
          </div>
        </div>
      </div>
      <!-- Skip -->
      <button class="absolute top-16 right-6 text-xs font-medium text-warm-400">Skip</button>
    </div>

    <!-- Content -->
    <div class="flex-1 px-8 pt-7 pb-8 flex flex-col">
      <!-- Progress dots -->
      <div class="flex gap-1.5 mb-7">
        <div class="h-1 flex-1 rounded-full bg-aurora-300"></div>
        <div class="h-1 flex-1 rounded-full bg-white/8"></div>
        <div class="h-1 flex-1 rounded-full bg-white/8"></div>
        <div class="h-1 flex-1 rounded-full bg-white/8"></div>
      </div>

      <p class="bracket-label text-aurora-300 mb-3">01 / 04 &mdash; Personalized AI</p>
      <h2 class="font-display text-[34px] font-light text-warm-50 leading-[1.05] mb-3">
        Therapy that<br/>
        <span class="italic font-medium">learns you.</span>
      </h2>
      <p class="text-warm-400 text-[13px] leading-relaxed mb-8">
        Evidence-based techniques (CBT, mindfulness, ACT) adapted to your personality, mood, and goals &mdash; every conversation.
      </p>

      <div class="mt-auto flex items-center justify-between">
        <button class="text-sm text-warm-400 font-medium px-2">Back</button>
        <button class="w-14 h-14 rounded-full btn-peach flex items-center justify-center">
          <i data-lucide="arrow-right" class="w-5 h-5"></i>
        </button>
      </div>
    </div>
  </div>
`;

// =====================================================================
// SCREEN 4 — ASSESSMENT QUESTION
// =====================================================================
const assessmentScreen = `
  ${statusBar}
  <div class="bg-midnight-950 h-full relative">
    <div class="absolute top-0 left-0 right-0 h-56 mesh-bg opacity-50"></div>

    <div class="relative px-7 pt-16">
      <!-- Header -->
      <div class="flex items-center justify-between mb-10">
        <button class="w-10 h-10 rounded-full glass flex items-center justify-center"><i data-lucide="arrow-left" class="w-4 h-4"></i></button>
        <div class="text-center">
          <p class="bracket-label text-warm-500">Question</p>
          <p class="text-sm font-medium font-mono text-warm-50 mt-0.5">04 / 14</p>
        </div>
        <button class="w-10 h-10 rounded-full glass flex items-center justify-center"><i data-lucide="help-circle" class="w-4 h-4 text-warm-400"></i></button>
      </div>

      <!-- Progress ring with chip -->
      <div class="flex flex-col items-center mb-8">
        <div class="ring-progress w-24 h-24 mb-2" style="--p: 29%;">
          <div>
            <span class="font-mono text-[11px] text-warm-50 font-medium">29%</span>
            <span class="text-[8px] text-warm-500 mt-0.5 bracket-label">complete</span>
          </div>
        </div>
        <span class="chip mt-1"><i data-lucide="sparkles" class="w-3 h-3 text-sage-300"></i>Solace is listening</span>
      </div>

      <p class="bracket-label text-aurora-300 mb-3 text-center">Mental health check</p>
      <h2 class="font-display text-[26px] font-light text-warm-50 text-center leading-[1.15] mb-8">
        How have you been<br/>
        <span class="italic">feeling lately?</span>
      </h2>

      <!-- Previous answer chip (context) -->
      <div class="flex justify-center mb-5">
        <div class="chip"><i data-lucide="rotate-ccw" class="w-3 h-3 text-warm-500"></i>Earlier you said: <span class="text-warm-200">Neutral</span></div>
      </div>

      <!-- Options -->
      <div class="space-y-2.5 pb-32">
        ${[
          { icon: 'sun', label: 'Mostly good', desc: 'Feeling balanced and content' },
          { icon: 'cloud', label: 'Neutral', desc: 'Just going through the motions', selected: true },
          { icon: 'cloud-rain', label: 'A bit low', desc: 'More down than usual' },
          { icon: 'cloud-lightning', label: 'Struggling', desc: 'Things feel heavy right now' },
        ].map(o => `
          <button class="w-full ${o.selected ? 'bg-sage-300/12 border-sage-300/60' : 'glass'} border rounded-2xl px-4 py-4 flex items-center gap-4 text-left transition-all">
            <div class="w-11 h-11 rounded-xl ${o.selected ? 'bg-sage-300/20 border border-sage-300/30' : 'bg-white/4 border border-white/5'} flex items-center justify-center">
              <i data-lucide="${o.icon}" class="w-5 h-5 ${o.selected ? 'text-sage-300' : 'text-warm-400'}"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-warm-50">${o.label}</p>
              <p class="text-[11px] text-warm-500 mt-0.5">${o.desc}</p>
            </div>
            <div class="w-5 h-5 rounded-full ${o.selected ? 'bg-sage-300 border-sage-300' : 'border border-warm-500'} border flex items-center justify-center">
              ${o.selected ? '<i data-lucide="check" class="w-3 h-3 text-midnight-950" stroke-width="3"></i>' : ''}
            </div>
          </button>
        `).join('')}
      </div>
    </div>

    <div class="absolute bottom-0 left-0 right-0 px-7 pb-8 pt-6 bg-gradient-to-t from-midnight-950 via-midnight-950 to-transparent">
      <button class="w-full py-4 rounded-2xl btn-sage font-medium text-sm flex items-center justify-center gap-2">
        Next question <i data-lucide="arrow-right" class="w-4 h-4"></i>
      </button>
    </div>
  </div>
`;

// =====================================================================
// SCREEN 5 — HOME DASHBOARD (the hero)
// =====================================================================
const homeScreen = `
  ${statusBar}
  <div class="bg-midnight-950 h-full relative">
    <!-- Top cosmic wash -->
    <div class="absolute top-0 left-0 right-0 h-80 opacity-50" style="background: radial-gradient(ellipse at top, rgba(107,143,255,0.18), transparent 60%);"></div>

    <div class="relative px-6 pt-14 pb-32">
      <!-- Header row -->
      <div class="flex items-center justify-between mb-1">
        <p class="bracket-label text-warm-500">Tuesday, April 6</p>
        <button class="w-10 h-10 rounded-full glass flex items-center justify-center relative">
          <i data-lucide="bell" class="w-4 h-4 text-warm-50"></i>
          <span class="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-peach-300"></span>
        </button>
      </div>
      <h1 class="font-display text-[32px] font-light text-warm-50 mt-1 leading-[1.05]">
        Good morning,<br/>
        <span class="italic font-medium">Rayyan.</span>
      </h1>

      <!-- Solace Score Hero Card -->
      <div class="mt-6 hero-card glass-aurora rounded-3xl p-6 overflow-hidden relative">
        <div class="absolute -top-20 -right-20 w-64 h-64 breath-orb opacity-60"></div>
        <div class="relative">
          <div class="flex items-start justify-between mb-5">
            <div>
              <p class="bracket-label text-aurora-300 mb-2">Solace Score</p>
              <p class="font-display text-[56px] font-light text-warm-50 leading-none tracking-tight">72<span class="text-2xl text-warm-400 font-mono">/100</span></p>
              <div class="flex items-center gap-1.5 mt-2">
                <i data-lucide="trending-up" class="w-3 h-3 text-sage-300"></i>
                <span class="text-[11px] text-sage-300 font-medium">+5 from last week</span>
              </div>
            </div>
            <div class="ring-progress w-20 h-20" style="--p: 72%;">
              <div>
                <i data-lucide="sparkles" class="w-5 h-5 text-aurora-300"></i>
              </div>
            </div>
          </div>
          <div class="aurora-hairline mb-3"></div>
          <p class="text-[11px] text-warm-400 leading-relaxed">Your mood has been steady. Try a 5-minute breathing session to maintain momentum.</p>
        </div>
      </div>

      <!-- Quick metrics grid -->
      <div class="grid grid-cols-2 gap-3 mt-4">
        ${[
          { icon: 'moon', label: 'SLEEP', value: '7.8', unit: 'h', pct: 78, accent: 'lavender-300' },
          { icon: 'wind', label: 'MINDFUL', value: '12', unit: 'min', pct: 60, accent: 'sage-300' },
          { icon: 'activity', label: 'STRESS', value: '2', unit: '/5', pct: 40, accent: 'peach-300' },
          { icon: 'flame', label: 'STREAK', value: '23', unit: 'd', pct: 71, accent: 'peach-300', isStreak: true },
        ].map(m => `
          <div class="glass rounded-2xl p-4">
            <div class="flex items-center justify-between mb-2">
              <i data-lucide="${m.icon}" class="w-4 h-4 text-${m.accent}"></i>
              <span class="text-[9px] text-warm-500 font-medium tracking-widest">${m.label}</span>
            </div>
            <p class="font-display text-[26px] font-light text-warm-50 leading-none">${m.value}<span class="text-sm text-warm-400 ml-0.5">${m.unit}</span></p>
            ${m.isStreak ? `
              <div class="flex gap-0.5 mt-2.5">
                ${Array(7).fill(0).map((_,i)=>`<div class="flex-1 h-1 rounded-full ${i<5?'bg-peach-300':'bg-white/8'}"></div>`).join('')}
              </div>
            ` : `<div class="stat-bar mt-2.5"><span style="width:${m.pct}%"></span></div>`}
          </div>
        `).join('')}
      </div>

      <!-- AI Therapy CTA -->
      <button class="mt-4 w-full hero-card rounded-3xl p-5 relative overflow-hidden text-left" style="background: linear-gradient(135deg, rgba(155,196,176,0.15) 0%, rgba(107,143,255,0.1) 50%, rgba(168,154,224,0.1) 100%); border: 1px solid rgba(155,196,176,0.18);">
        <div class="absolute -bottom-12 -right-12 w-44 h-44 breath-orb"></div>
        <div class="relative flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-sage-300 to-aurora-300 flex items-center justify-center flex-shrink-0 shadow-sage-glow">
            <i data-lucide="sparkles" class="w-6 h-6 text-midnight-950"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-warm-50">Continue your session</p>
            <p class="text-[11px] text-warm-400 truncate mt-0.5">3 min ago &mdash; &ldquo;Let&rsquo;s talk about that meeting&hellip;&rdquo;</p>
          </div>
          <i data-lucide="arrow-right" class="w-4 h-4 text-warm-400 flex-shrink-0"></i>
        </div>
      </button>

      <!-- Mindful articles section -->
      <div class="mt-6">
        <div class="flex justify-between items-baseline mb-3">
          <h3 class="font-display text-lg text-warm-50">For you today</h3>
          <button class="text-[11px] text-aurora-300 font-medium">See all &rarr;</button>
        </div>
        <div class="flex gap-3 scroll-x -mx-6 px-6">
          ${[
            { tag: 'Anxiety', title: 'The 5-4-3-2-1 grounding technique', time: '4 min', color: 'sage-300', hue: '155,196,176' },
            { tag: 'Sleep', title: 'Why your phone hurts your sleep', time: '6 min', color: 'lavender-300', hue: '168,154,224' },
            { tag: 'Focus', title: 'Reset your mornings', time: '3 min', color: 'aurora-300', hue: '138,163,255' },
          ].map(a => `
            <div class="w-44 flex-shrink-0 glass rounded-2xl p-4">
              <div class="h-20 rounded-xl mb-3 relative overflow-hidden" style="background: linear-gradient(135deg, rgba(${a.hue},0.2), rgba(${a.hue},0.05));">
                <div class="absolute inset-0" style="background:radial-gradient(circle at 70% 30%, rgba(${a.hue},0.3), transparent 60%);"></div>
              </div>
              <span class="chip text-[9px] py-0.5 px-2 text-${a.color}" style="background:rgba(${a.hue},0.1);border-color:rgba(${a.hue},0.25);">${a.tag}</span>
              <p class="text-[12px] font-medium text-warm-50 mt-2 leading-snug">${a.title}</p>
              <p class="text-[10px] text-warm-500 mt-1 font-mono">${a.time} read</p>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    ${tabBar('home')}
  </div>
`;

// =====================================================================
// SCREEN 6 — MOOD TRACKER
// =====================================================================
const moodScreen = `
  ${statusBar}
  <div class="bg-midnight-950 h-full relative">
    <div class="absolute top-0 left-0 right-0 h-80 opacity-40" style="background:radial-gradient(ellipse at 20% 0%, rgba(155,196,176,0.18), transparent 60%);"></div>

    <div class="relative px-6 pt-14 pb-32">
      <div class="flex items-center justify-between mb-2">
        <div>
          <p class="bracket-label text-warm-500">Mood</p>
          <h1 class="font-display text-[32px] font-light text-warm-50 leading-tight mt-0.5">This week</h1>
        </div>
        <button class="w-10 h-10 rounded-full glass flex items-center justify-center">
          <i data-lucide="calendar-days" class="w-4 h-4"></i>
        </button>
      </div>

      <!-- Current mood hero -->
      <div class="mt-6 hero-card glass-strong rounded-3xl p-6 relative overflow-hidden">
        <div class="absolute -top-12 -left-12 w-48 h-48 breath-orb opacity-50"></div>
        <div class="relative flex items-end justify-between">
          <div>
            <p class="bracket-label text-sage-300 mb-2">Today &middot; 2:45 PM</p>
            <p class="font-display text-[44px] font-light italic text-warm-50 leading-none">Content</p>
            <div class="flex items-center gap-1.5 mt-2.5">
              <i data-lucide="arrow-up" class="w-3 h-3 text-sage-300"></i>
              <span class="text-[11px] text-sage-300 font-medium">Up from neutral</span>
            </div>
          </div>
          <div class="w-20 h-20 rounded-full bg-gradient-to-br from-sage-300 to-sage-700 flex items-center justify-center shadow-sage-glow">
            <svg viewBox="0 0 100 100" width="62" height="62">
              <circle cx="36" cy="44" r="3.5" fill="#040818"/>
              <circle cx="64" cy="44" r="3.5" fill="#040818"/>
              <path d="M35 60 Q50 72 65 60" stroke="#040818" stroke-width="3.5" fill="none" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Weekly chart -->
      <div class="glass rounded-3xl p-5 mt-4">
        <div class="flex justify-between items-baseline mb-5">
          <p class="text-sm font-medium text-warm-50">7-day trend</p>
          <span class="chip text-[9px]"><span class="w-1.5 h-1.5 rounded-full bg-sage-300"></span>Avg <span class="font-mono text-warm-50">3.8/5</span></span>
        </div>
        <div class="flex justify-between items-end gap-2" style="height:128px;">
          ${[
            { d: 'M', h: 50, c: '155,196,176' },
            { d: 'T', h: 70, c: '155,196,176' },
            { d: 'W', h: 30, c: '244,167,126' },
            { d: 'T', h: 60, c: '155,196,176' },
            { d: 'F', h: 90, c: '155,196,176' },
            { d: 'S', h: 80, c: '168,154,224' },
            { d: 'S', h: 75, c: '155,196,176', today: true },
          ].map(d => `
            <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div class="w-full rounded-t-lg ${d.today ? 'bg-sage-300' : ''}" style="height:${d.h}%;${d.today ? '' : `background:rgba(${d.c},0.4);`}"></div>
              <span class="text-[10px] font-mono ${d.today ? 'text-sage-300 font-bold' : 'text-warm-500'}">${d.d}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Insights -->
      <div class="mt-5">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-display text-lg text-warm-50">Insights</h3>
          <span class="bracket-label text-warm-500">AI-analyzed</span>
        </div>
        <div class="space-y-2.5">
          ${[
            { icon: 'trending-up', accent: 'sage-300', hue: '155,196,176', title: 'Mood improved 18% this week', desc: 'Your mindfulness sessions seem to help.' },
            { icon: 'moon', accent: 'lavender-300', hue: '168,154,224', title: 'You feel best after 7+ hours sleep', desc: 'Consistent on weekends &mdash; try weeknights too.' },
            { icon: 'sun', accent: 'peach-300', hue: '244,167,126', title: 'Outdoor days lift your mood', desc: '21% boost on days with sunlight.' },
          ].map(i => `
            <div class="glass rounded-2xl p-4 flex items-start gap-3">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style="background:rgba(${i.hue},0.12);border:1px solid rgba(${i.hue},0.2);">
                <i data-lucide="${i.icon}" class="w-4 h-4 text-${i.accent}"></i>
              </div>
              <div class="flex-1">
                <p class="text-[12px] font-medium text-warm-50">${i.title}</p>
                <p class="text-[10px] text-warm-500 mt-0.5">${i.desc}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- FAB -->
    <button class="absolute bottom-28 right-6 w-14 h-14 rounded-full btn-peach flex items-center justify-center">
      <i data-lucide="plus" class="w-6 h-6"></i>
    </button>

    ${tabBar('mood')}
  </div>
`;

// =====================================================================
// SCREEN 7 — AI CHAT (active session)
// =====================================================================
const chatScreen = `
  ${statusBar}
  <div class="bg-midnight-950 h-full relative flex flex-col">
    <!-- Header -->
    <div class="px-5 pt-14 pb-4 glass-strong border-b border-white/5">
      <div class="flex items-center gap-3">
        <button class="w-9 h-9 rounded-full glass flex items-center justify-center">
          <i data-lucide="arrow-left" class="w-4 h-4"></i>
        </button>
        <div class="relative">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-sage-300 via-aurora-300 to-lavender-300 flex items-center justify-center shadow-sage-glow">
            <i data-lucide="sparkles" class="w-4 h-4 text-midnight-950"></i>
          </div>
          <span class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-sage-300 border-2 border-midnight-800"></span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-warm-50">Solace</p>
          <p class="text-[10px] text-sage-300 flex items-center gap-1">
            <span>Always here</span>
            <span class="opacity-40">&middot;</span>
            <span class="text-warm-500">CBT mode</span>
          </p>
        </div>
        <button class="w-9 h-9 rounded-full glass flex items-center justify-center">
          <i data-lucide="phone" class="w-4 h-4"></i>
        </button>
        <button class="w-9 h-9 rounded-full glass flex items-center justify-center">
          <i data-lucide="more-horizontal" class="w-4 h-4"></i>
        </button>
      </div>
    </div>

    <!-- Messages -->
    <div class="flex-1 px-5 py-5 space-y-4 overflow-y-auto">
      <p class="text-center text-[10px] text-warm-500 bracket-label">Today, 2:45 PM</p>

      <!-- AI message -->
      <div class="flex gap-2.5 max-w-[85%]">
        <div class="w-7 h-7 rounded-full bg-gradient-to-br from-sage-300 via-aurora-300 to-lavender-300 flex items-center justify-center flex-shrink-0">
          <i data-lucide="sparkles" class="w-3 h-3 text-midnight-950"></i>
        </div>
        <div class="glass rounded-2xl rounded-tl-sm px-4 py-3">
          <p class="text-[13px] text-warm-50 leading-relaxed">Hey Rayyan. How are you feeling about that meeting you mentioned earlier?</p>
        </div>
      </div>

      <!-- User message -->
      <div class="flex justify-end">
        <div class="max-w-[80%] rounded-2xl rounded-tr-sm px-4 py-3" style="background: linear-gradient(135deg, #F4A77E 0%, #E88B5A 100%); box-shadow: 0 4px 14px -4px rgba(244,167,126,0.4);">
          <p class="text-[13px] text-midnight-950 leading-relaxed font-medium">Honestly, anxious. I keep replaying it in my head.</p>
        </div>
      </div>

      <!-- AI message with action -->
      <div class="flex gap-2.5 max-w-[88%]">
        <div class="w-7 h-7 rounded-full bg-gradient-to-br from-sage-300 via-aurora-300 to-lavender-300 flex items-center justify-center flex-shrink-0">
          <i data-lucide="sparkles" class="w-3 h-3 text-midnight-950"></i>
        </div>
        <div class="space-y-2 flex-1">
          <div class="glass rounded-2xl rounded-tl-sm px-4 py-3">
            <p class="text-[13px] text-warm-50 leading-relaxed">That&rsquo;s a really common pattern called <span class="text-sage-300">rumination</span>. Let&rsquo;s try a quick grounding exercise to interrupt it.</p>
          </div>

          <!-- Reaction chips -->
          <div class="flex gap-1.5">
            <button class="chip text-[9px] py-0.5 px-2"><i data-lucide="thumbs-up" class="w-2.5 h-2.5"></i>This helped</button>
            <button class="chip text-[9px] py-0.5 px-2"><i data-lucide="thumbs-down" class="w-2.5 h-2.5"></i>Not quite</button>
          </div>

          <!-- Action card (prominent) -->
          <button class="w-full hero-card glass-aurora rounded-2xl px-4 py-3.5 flex items-center gap-3 mt-1">
            <div class="w-10 h-10 rounded-xl bg-sage-300/15 border border-sage-300/30 flex items-center justify-center">
              <i data-lucide="wind" class="w-5 h-5 text-sage-300"></i>
            </div>
            <div class="flex-1 text-left">
              <p class="text-[12px] font-medium text-warm-50">Try: 4-7-8 Breathing</p>
              <p class="text-[10px] text-warm-500 mt-0.5">2 minutes &middot; in-app</p>
            </div>
            <div class="w-9 h-9 rounded-full bg-sage-300 text-midnight-950 flex items-center justify-center">
              <i data-lucide="play" class="w-4 h-4 ml-0.5"></i>
            </div>
          </button>
        </div>
      </div>

      <!-- AI typing -->
      <div class="flex gap-2.5">
        <div class="w-7 h-7 rounded-full bg-gradient-to-br from-sage-300 via-aurora-300 to-lavender-300 flex items-center justify-center flex-shrink-0">
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
    <div class="px-5 pb-7 pt-3 border-t border-white/5">
      <div class="glass rounded-full pl-4 pr-1.5 py-1.5 flex items-center gap-2">
        <button class="w-8 h-8 rounded-full flex items-center justify-center text-warm-400">
          <i data-lucide="plus" class="w-5 h-5"></i>
        </button>
        <input placeholder="Type how you feel&hellip;" class="flex-1 bg-transparent outline-none text-[12px] text-warm-50 placeholder-warm-500 py-2" />
        <button class="w-8 h-8 rounded-full flex items-center justify-center text-warm-400">
          <i data-lucide="mic" class="w-4 h-4"></i>
        </button>
        <button class="w-9 h-9 rounded-full btn-sage flex items-center justify-center">
          <i data-lucide="arrow-up" class="w-4 h-4"></i>
        </button>
      </div>
    </div>
  </div>
`;

// =====================================================================
// SCREEN 8 — JOURNAL
// =====================================================================
const journalScreen = `
  ${statusBar}
  <div class="bg-midnight-950 h-full relative">
    <div class="absolute top-0 left-0 right-0 h-80 opacity-40" style="background:radial-gradient(ellipse at 80% 0%, rgba(168,154,224,0.18), transparent 60%);"></div>

    <div class="relative px-6 pt-14 pb-32">
      <div class="flex items-baseline justify-between mb-1">
        <div>
          <p class="bracket-label text-warm-500">Journal</p>
          <h1 class="font-display text-[32px] font-light text-warm-50 mt-0.5">12 entries</h1>
        </div>
        <button class="w-10 h-10 rounded-full glass flex items-center justify-center">
          <i data-lucide="search" class="w-4 h-4"></i>
        </button>
      </div>
      <div class="flex items-center gap-2 mt-1.5 text-[11px] text-warm-400">
        <span>April</span>
        <span class="opacity-40">&middot;</span>
        <i data-lucide="flame" class="w-3 h-3 text-peach-300"></i>
        <span>23-day streak</span>
      </div>

      <!-- Mood trend chart card -->
      <div class="hero-card glass-strong rounded-3xl p-5 mt-5 relative overflow-hidden">
        <div class="absolute -top-10 right-0 w-32 h-32 breath-orb opacity-40"></div>
        <div class="relative">
          <div class="flex justify-between items-baseline mb-4">
            <div>
              <p class="text-sm font-medium text-warm-50">Mood from your writing</p>
              <p class="text-[10px] text-warm-500 mt-0.5">Trending up over the last week</p>
            </div>
            <span class="chip text-[9px]"><i data-lucide="sparkles" class="w-3 h-3 text-aurora-300"></i>AI</span>
          </div>
          <!-- Smooth line chart -->
          <svg viewBox="0 0 300 90" class="w-full h-24">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#9BC4B0" stop-opacity="0.5"/>
                <stop offset="100%" stop-color="#9BC4B0" stop-opacity="0"/>
              </linearGradient>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#9BC4B0"/>
                <stop offset="100%" stop-color="#8AA3FF"/>
              </linearGradient>
            </defs>
            <path d="M 0,65 Q 30,60 50,45 T 100,28 T 150,38 T 200,18 T 250,22 T 300,12 L 300,90 L 0,90 Z" fill="url(#grad1)"/>
            <path d="M 0,65 Q 30,60 50,45 T 100,28 T 150,38 T 200,18 T 250,22 T 300,12" fill="none" stroke="url(#lineGrad)" stroke-width="2"/>
            <circle cx="300" cy="12" r="4" fill="#8AA3FF"/>
            <circle cx="300" cy="12" r="8" fill="#8AA3FF" opacity="0.2"/>
          </svg>
          <div class="flex justify-between mt-2">
            ${['Apr 1','Apr 8','Apr 15','Apr 22','Apr 29'].map(d=>`<span class="text-[9px] text-warm-500 font-mono">${d}</span>`).join('')}
          </div>
        </div>
      </div>

      <!-- Recent entries -->
      <div class="mt-6">
        <div class="flex justify-between items-baseline mb-3">
          <h3 class="font-display text-lg text-warm-50">Recent</h3>
          <button class="text-[11px] text-aurora-300 font-medium">View all &rarr;</button>
        </div>
        <div class="space-y-3">
          ${[
            { date: 'Today', mood: 'Content', moodColor: 'sage-300', hue: '155,196,176', title: 'A quiet morning', preview: 'Started the day with coffee and that book I keep meaning to finish. Still anxious about the meeting but&hellip;' },
            { date: 'Yesterday', mood: 'Reflective', moodColor: 'lavender-300', hue: '168,154,224', title: 'Letting go', preview: 'Talked to mom for an hour. It helped more than I expected. Sometimes just being heard&hellip;' },
            { date: 'Apr 4', mood: 'Stressed', moodColor: 'peach-300', hue: '244,167,126', title: 'Deadline week', preview: 'Three projects due this week. Trying to take it one task at a time&hellip;' },
          ].map(e => `
            <button class="w-full glass rounded-2xl p-4 text-left relative overflow-hidden">
              <div class="absolute top-0 left-0 bottom-0 w-1 rounded-r-full" style="background:rgba(${e.hue},0.6);"></div>
              <div class="flex items-center gap-2 mb-2 pl-2">
                <span class="bracket-label text-warm-500">${e.date}</span>
                <span class="opacity-30 text-[9px]">&middot;</span>
                <span class="text-[9px] text-${e.moodColor} font-medium">${e.mood}</span>
              </div>
              <p class="font-display text-[17px] text-warm-50 leading-tight mb-1.5 pl-2">${e.title}</p>
              <p class="text-[11px] text-warm-400 leading-relaxed line-clamp-2 pl-2">${e.preview}</p>
            </button>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- FAB -->
    <button class="absolute bottom-28 right-6 w-14 h-14 rounded-full btn-peach flex items-center justify-center">
      <i data-lucide="pen-line" class="w-5 h-5"></i>
    </button>

    ${tabBar('journal')}
  </div>
`;

// =====================================================================
// SCREEN 9 — PROFILE
// =====================================================================
const profileScreen = `
  ${statusBar}
  <div class="bg-midnight-950 h-full relative">
    <div class="absolute top-0 left-0 right-0 h-80 opacity-50" style="background:radial-gradient(ellipse at 50% 0%, rgba(107,143,255,0.15), transparent 60%);"></div>

    <div class="relative px-6 pt-14 pb-32">
      <!-- Profile header -->
      <div class="text-center mb-6">
        <div class="relative inline-block">
          <div class="w-24 h-24 rounded-full bg-gradient-to-br from-sage-300 via-aurora-300 to-peach-300 p-1 shadow-aurora-glow">
            <div class="w-full h-full rounded-full bg-midnight-800 flex items-center justify-center">
              <span class="font-display text-3xl font-light text-warm-50">R</span>
            </div>
          </div>
          <button class="absolute -bottom-1 -right-1 w-7 h-7 rounded-full btn-peach flex items-center justify-center border-2 border-midnight-950">
            <i data-lucide="camera" class="w-3 h-3"></i>
          </button>
        </div>
        <h1 class="font-display text-[26px] font-light text-warm-50 mt-3 leading-tight">Rayyan Ahmed</h1>
        <span class="chip mt-1 inline-flex"><i data-lucide="sparkles" class="w-2.5 h-2.5 text-peach-300"></i>Premium member</span>
      </div>

      <!-- Stats grid -->
      <div class="grid grid-cols-3 gap-2.5 mb-6">
        ${[
          { v: '23', u: 'd', label: 'Streak', icon: 'flame', color: 'peach-300' },
          { v: '142', u: '', label: 'Sessions', icon: 'message-circle', color: 'sage-300' },
          { v: '12', u: 'h', label: 'Mindful', icon: 'wind', color: 'aurora-300' },
        ].map(s => `
          <div class="glass rounded-2xl p-3.5 text-center">
            <i data-lucide="${s.icon}" class="w-3 h-3 text-${s.color} mx-auto mb-1.5"></i>
            <p class="font-display text-[22px] font-light text-warm-50 leading-none">${s.v}<span class="text-[10px] text-warm-400 ml-0.5">${s.u}</span></p>
            <p class="text-[9px] text-warm-500 mt-1 bracket-label">${s.label}</p>
          </div>
        `).join('')}
      </div>

      <!-- Settings groups -->
      <div class="space-y-4">
        <div>
          <p class="bracket-label text-warm-500 mb-2 px-2">Account</p>
          <div class="glass rounded-2xl divide-y divide-white/5">
            ${[
              { icon: 'user', label: 'Personal information' },
              { icon: 'bell', label: 'Notifications', badge: '3' },
              { icon: 'shield', label: 'Privacy & security' },
              { icon: 'globe', label: 'Language', value: 'English' },
            ].map(item => `
              <button class="w-full px-4 py-3.5 flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-white/4 flex items-center justify-center">
                  <i data-lucide="${item.icon}" class="w-4 h-4 text-sage-300"></i>
                </div>
                <span class="text-sm text-warm-50 flex-1 text-left">${item.label}</span>
                ${item.badge ? `<span class="px-2 py-0.5 rounded-full bg-peach-300 text-midnight-950 text-[9px] font-bold">${item.badge}</span>` : ''}
                ${item.value ? `<span class="text-[11px] text-warm-500 font-mono">${item.value}</span>` : ''}
                <i data-lucide="chevron-right" class="w-4 h-4 text-warm-500"></i>
              </button>
            `).join('')}
          </div>
        </div>

        <div>
          <p class="bracket-label text-warm-500 mb-2 px-2">Support</p>
          <div class="glass rounded-2xl divide-y divide-white/5">
            ${[
              { icon: 'life-buoy', label: 'Help center' },
              { icon: 'message-square', label: 'Send feedback' },
              { icon: 'gift', label: 'Invite friends' },
            ].map(item => `
              <button class="w-full px-4 py-3.5 flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-white/4 flex items-center justify-center">
                  <i data-lucide="${item.icon}" class="w-4 h-4 text-aurora-300"></i>
                </div>
                <span class="text-sm text-warm-50 flex-1 text-left">${item.label}</span>
                <i data-lucide="chevron-right" class="w-4 h-4 text-warm-500"></i>
              </button>
            `).join('')}
          </div>
        </div>

        <button class="w-full glass rounded-2xl p-3.5 flex items-center justify-center gap-2 text-sm text-peach-300 mt-4">
          <i data-lucide="log-out" class="w-4 h-4"></i> Sign out
        </button>

        <p class="text-[9px] text-warm-500 text-center mt-2 font-mono">Solace v3.0.0 &middot; Made with care</p>
      </div>
    </div>
    ${tabBar('profile')}
  </div>
`;

// =====================================================================
// SCREEN 10 — BREATHING EXERCISE (immersive)
// =====================================================================
const breathingScreen = `
  ${statusBar}
  <div class="h-full relative overflow-hidden mesh-bg">
    <!-- Layered cosmic depth -->
    <div class="absolute top-1/4 left-1/4 w-96 h-96 smoke opacity-80"></div>
    <div class="absolute bottom-1/4 right-1/4 w-80 h-80 breath-orb opacity-60"></div>

    <!-- Top bar -->
    <div class="relative z-10 px-6 pt-14 flex justify-between items-center">
      <button class="w-10 h-10 rounded-full glass flex items-center justify-center">
        <i data-lucide="x" class="w-4 h-4"></i>
      </button>
      <div class="text-center">
        <p class="bracket-label text-warm-400">4-7-8 Breathing</p>
        <p class="text-[10px] text-warm-500 mt-0.5">Cycle 3 of 8</p>
      </div>
      <button class="w-10 h-10 rounded-full glass flex items-center justify-center">
        <i data-lucide="volume-2" class="w-4 h-4"></i>
      </button>
    </div>

    <!-- Center breathing orb -->
    <div class="relative z-10 flex-1 flex flex-col items-center justify-center pt-16">
      <div class="relative mb-12">
        <!-- Outer ring -->
        <div class="w-72 h-72 rounded-full border border-aurora-300/15 flex items-center justify-center">
          <div class="w-60 h-60 rounded-full border border-sage-300/20 flex items-center justify-center">
            <div class="w-48 h-48 rounded-full border border-sage-300/30 flex items-center justify-center">
              <!-- Inner orb -->
              <div class="w-32 h-32 rounded-full flex items-center justify-center" style="background: radial-gradient(circle at 35% 35%, rgba(155,196,176,0.6), rgba(107,143,255,0.3) 60%, transparent); box-shadow: 0 0 100px 10px rgba(155,196,176,0.35), inset 0 0 30px rgba(255,255,255,0.1);">
                <p class="font-display text-2xl italic text-warm-50">Breathe in</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Counter -->
      <p class="font-mono text-[64px] font-light text-warm-50 mb-1 leading-none tracking-tight">04</p>
      <p class="text-[11px] text-warm-500 mb-12 bracket-label">seconds</p>

      <!-- Cycle progress -->
      <div class="flex gap-2 mb-6">
        ${Array(8).fill(0).map((_,i)=>`<div class="w-1.5 h-1.5 rounded-full ${i<3?'bg-sage-300':'bg-white/12'}"></div>`).join('')}
      </div>

      <!-- Time remaining -->
      <p class="bracket-label text-warm-500"><span class="font-mono text-warm-200">2:45</span> remaining</p>
    </div>

    <!-- Controls -->
    <div class="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-6">
      <button class="w-12 h-12 rounded-full glass flex items-center justify-center">
        <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
      </button>
      <button class="w-16 h-16 rounded-full btn-primary flex items-center justify-center">
        <i data-lucide="pause" class="w-6 h-6"></i>
      </button>
      <button class="w-12 h-12 rounded-full glass flex items-center justify-center">
        <i data-lucide="settings-2" class="w-4 h-4"></i>
      </button>
    </div>
  </div>
`;

// =====================================================================
// SCREEN 11 — SLEEP DASHBOARD
// =====================================================================
const sleepScreen = `
  ${statusBar}
  <div class="h-full relative" style="background:linear-gradient(180deg, #161D3D 0%, #0E1430 35%, #040818 100%);">
    <!-- Stars -->
    <div class="absolute inset-0 overflow-hidden">
      ${Array(24).fill(0).map((_,i)=>{
        const x = (i*149)%380;
        const y = (i*97)%320;
        const sz = i%4===0?1.5:0.5;
        return `<div class="absolute rounded-full bg-white/40" style="left:${x}px;top:${y}px;width:${sz}px;height:${sz}px;"></div>`;
      }).join('')}
      <div class="absolute top-10 right-12 w-48 h-48 smoke opacity-70"></div>
    </div>

    <div class="relative z-10 px-6 pt-14 pb-12">
      <div class="flex items-center justify-between mb-6">
        <button class="w-10 h-10 rounded-full glass flex items-center justify-center">
          <i data-lucide="arrow-left" class="w-4 h-4"></i>
        </button>
        <p class="bracket-label text-warm-500">Sleep</p>
        <button class="w-10 h-10 rounded-full glass flex items-center justify-center">
          <i data-lucide="more-horizontal" class="w-4 h-4"></i>
        </button>
      </div>

      <!-- Hero score card -->
      <div class="hero-card glass-strong rounded-3xl p-6 relative overflow-hidden">
        <div class="absolute -top-12 -right-12 w-48 h-48 rounded-full" style="background: radial-gradient(circle, rgba(168,154,224,0.35), transparent 70%);filter:blur(20px);"></div>
        <div class="relative">
          <div class="flex items-center gap-2 mb-3">
            <i data-lucide="moon" class="w-3.5 h-3.5 text-lavender-300"></i>
            <p class="bracket-label text-lavender-300">Last night</p>
          </div>
          <div class="flex items-end gap-3 mb-1">
            <p class="font-display text-[64px] font-light text-warm-50 leading-none tracking-tight">7<span class="text-3xl text-warm-400 font-mono">h</span> 48<span class="text-3xl text-warm-400 font-mono">m</span></p>
          </div>
          <div class="flex items-center gap-2 mt-4">
            <div class="px-2.5 py-1 rounded-full bg-sage-300/15 border border-sage-300/30">
              <span class="text-[10px] text-sage-300 font-medium">Quality <span class="font-mono">86%</span></span>
            </div>
            <span class="text-[10px] text-warm-500 font-mono">11:14 PM &mdash; 7:02 AM</span>
          </div>
        </div>
      </div>

      <!-- Sleep stages bar -->
      <div class="glass rounded-2xl p-5 mt-4">
        <div class="flex items-center justify-between mb-4">
          <p class="text-sm font-medium text-warm-50">Sleep stages</p>
          <span class="bracket-label text-warm-500">Per hypnogram</span>
        </div>
        <div class="h-2.5 rounded-full overflow-hidden flex bg-white/5">
          <div style="width:24%;background:linear-gradient(90deg,#8B7CC8,#A89AE0);"></div>
          <div style="width:48%;background:linear-gradient(90deg,#9BC4B0,#7AAA94);"></div>
          <div style="width:14%;background:linear-gradient(90deg,#F4A77E,#E88B5A);"></div>
          <div style="width:14%;background:linear-gradient(90deg,#C7BEA9,#8B95A8);"></div>
        </div>
        <div class="grid grid-cols-4 gap-2 mt-4">
          ${[
            { l: 'Deep', v: '1h 52m', c: 'lavender-300' },
            { l: 'Core', v: '3h 45m', c: 'sage-300' },
            { l: 'REM', v: '1h 06m', c: 'peach-300' },
            { l: 'Awake', v: '1h 05m', c: 'warm-200' },
          ].map(s => `
            <div>
              <div class="flex items-center gap-1 mb-1">
                <span class="w-1.5 h-1.5 rounded-full bg-${s.c}"></span>
                <span class="text-[9px] text-warm-500 bracket-label">${s.l}</span>
              </div>
              <p class="text-[11px] font-medium text-warm-50 font-mono">${s.v}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Insight -->
      <div class="mt-4 hero-card glass-aurora rounded-2xl p-4 flex items-start gap-3">
        <div class="w-9 h-9 rounded-xl bg-sage-300/15 border border-sage-300/30 flex items-center justify-center flex-shrink-0">
          <i data-lucide="sparkles" class="w-4 h-4 text-sage-300"></i>
        </div>
        <div class="flex-1">
          <p class="text-[12px] font-medium text-warm-50">Your best sleep this week</p>
          <p class="text-[10px] text-warm-500 mt-0.5">You went to bed 30 min earlier &mdash; keep it up.</p>
        </div>
      </div>

      <!-- Weekly bars -->
      <div class="mt-4 glass rounded-2xl p-5">
        <div class="flex justify-between items-baseline mb-4">
          <p class="text-sm font-medium text-warm-50">7-day history</p>
          <span class="text-[10px] text-warm-500">Avg <span class="font-mono text-warm-200">7.2h</span></span>
        </div>
        <div class="flex justify-between items-end gap-2" style="height:96px;">
          ${[5.2,6.8,7.4,6.5,7.8,8.1,7.8].map((h,i)=>{
            const pct = (h/9)*100;
            const isToday = i===6;
            return `
              <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div class="w-full rounded-t-md ${isToday?'bg-lavender-300':'bg-lavender-300/25'}" style="height:${pct}%"></div>
                <span class="text-[9px] font-mono ${isToday?'text-lavender-300 font-bold':'text-warm-500'}">${['M','T','W','T','F','S','S'][i]}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Log sleep CTA -->
      <button class="w-full mt-6 py-4 rounded-2xl btn-primary font-medium text-sm flex items-center justify-center gap-2">
        <i data-lucide="moon" class="w-4 h-4"></i> Log tonight&rsquo;s sleep
      </button>
    </div>
  </div>
`;

// =====================================================================
// SCREEN 12 — CRISIS SUPPORT
// =====================================================================
const crisisScreen = `
  ${statusBar}
  <div class="h-full relative" style="background: linear-gradient(180deg, #1A1530 0%, #0E1430 50%, #040818 100%);">
    <!-- Soft warm glow (not alarming red) -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full" style="background:radial-gradient(circle, rgba(244,167,126,0.18), transparent 60%);filter:blur(40px);"></div>

    <!-- Top bar -->
    <div class="relative px-6 pt-14 flex justify-end">
      <button class="w-10 h-10 rounded-full glass flex items-center justify-center">
        <i data-lucide="x" class="w-4 h-4"></i>
      </button>
    </div>

    <div class="relative px-6 pt-6 pb-12">
      <!-- Soft heart icon -->
      <div class="flex justify-center mb-6">
        <div class="w-24 h-24 rounded-full flex items-center justify-center" style="background: radial-gradient(circle, rgba(244,167,126,0.18), transparent 70%);">
          <div class="w-16 h-16 rounded-full bg-gradient-to-br from-peach-300/35 to-peach-300/10 backdrop-blur-xl flex items-center justify-center border border-peach-300/30 shadow-peach-glow">
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
        <button class="w-full hero-card glass-strong rounded-2xl p-4 flex items-center gap-4 border border-peach-300/25">
          <div class="w-12 h-12 rounded-xl bg-peach-300/15 border border-peach-300/30 flex items-center justify-center flex-shrink-0">
            <i data-lucide="phone" class="w-5 h-5 text-peach-300"></i>
          </div>
          <div class="flex-1 text-left">
            <p class="text-[13px] font-semibold text-warm-50">Call <span class="font-mono">988</span></p>
            <p class="text-[10px] text-warm-400 mt-0.5">Suicide &amp; Crisis Lifeline &middot; 24/7</p>
          </div>
          <div class="w-9 h-9 rounded-full btn-peach flex items-center justify-center">
            <i data-lucide="phone" class="w-4 h-4"></i>
          </div>
        </button>

        <button class="w-full glass rounded-2xl p-4 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-sage-300/15 border border-sage-300/25 flex items-center justify-center flex-shrink-0">
            <i data-lucide="message-square" class="w-5 h-5 text-sage-300"></i>
          </div>
          <div class="flex-1 text-left">
            <p class="text-[13px] font-medium text-warm-50">Text <span class="font-mono">HOME</span> to <span class="font-mono">741741</span></p>
            <p class="text-[10px] text-warm-400 mt-0.5">Crisis Text Line &middot; Free SMS</p>
          </div>
          <i data-lucide="arrow-right" class="w-4 h-4 text-warm-500"></i>
        </button>

        <button class="w-full glass rounded-2xl p-4 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-aurora-300/15 border border-aurora-300/25 flex items-center justify-center flex-shrink-0">
            <i data-lucide="globe" class="w-5 h-5 text-aurora-300"></i>
          </div>
          <div class="flex-1 text-left">
            <p class="text-[13px] font-medium text-warm-50">International resources</p>
            <p class="text-[10px] text-warm-400 mt-0.5">Find help in your country</p>
          </div>
          <i data-lucide="arrow-right" class="w-4 h-4 text-warm-500"></i>
        </button>
      </div>

      <!-- Talk to AI -->
      <div class="glass rounded-2xl p-4 mb-4">
        <div class="flex items-start gap-3">
          <div class="w-9 h-9 rounded-full bg-gradient-to-br from-sage-300 via-aurora-300 to-lavender-300 flex items-center justify-center flex-shrink-0">
            <i data-lucide="sparkles" class="w-4 h-4 text-midnight-950"></i>
          </div>
          <div class="flex-1">
            <p class="text-[12px] font-medium text-warm-50 mb-1">Or talk to Solace</p>
            <p class="text-[10px] text-warm-400 leading-relaxed">If you&rsquo;re not ready for a person, I&rsquo;m here to listen &mdash; no judgment.</p>
          </div>
        </div>
        <button class="w-full mt-3 py-2.5 rounded-xl bg-warm-50/8 text-warm-50 text-[11px] font-medium border border-white/10">
          Start a conversation
        </button>
      </div>

      <button class="w-full text-center text-[11px] text-warm-500 py-3">I&rsquo;m okay, dismiss</button>
    </div>
  </div>
`;

// =====================================================================
// MOUNT ALL SCREENS
// =====================================================================
const mounts = {
  'screen-welcome': ['Welcome', welcomeScreen],
  'screen-signin': ['Sign in', signinScreen],
  'screen-onboarding': ['Onboarding', onboardingScreen],
  'screen-assessment': ['Assessment', assessmentScreen],
  'screen-home': ['Home dashboard', homeScreen],
  'screen-mood': ['Mood tracker', moodScreen],
  'screen-chat': ['AI chat', chatScreen],
  'screen-journal': ['Journal', journalScreen],
  'screen-profile': ['Profile', profileScreen],
  'screen-breathing': ['Breathing', breathingScreen],
  'screen-sleep': ['Sleep', sleepScreen],
  'screen-crisis': ['Crisis support', crisisScreen],
};

Object.entries(mounts).forEach(([id, [label, content]]) => {
  const el = document.getElementById(id);
  if (el) el.innerHTML = phone(label, content);
});
