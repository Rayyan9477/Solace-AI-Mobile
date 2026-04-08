// Solace AI - v2/v3 Prototype Screens
// 30 screens covering every flow. Same craftsmanship as the v1 hero screens.
// All screens use the v3 cosmic editorial system (midnight + aurora + sage).

// ------------------------------------------------------------------
// Shared helpers
// ------------------------------------------------------------------

const phone2 = (id, content) => `
  <div>
    <p class="bracket-label text-warm-500 mb-3 text-center">${id}</p>
    <div class="phone grain">
      <div class="frame">${content}</div>
    </div>
  </div>
`;

const statusBar2 = `
  <div class="absolute top-4 left-0 right-0 px-8 flex justify-between items-center text-[11px] font-medium text-warm-50 z-40">
    <span class="font-mono tracking-tight">9:41</span>
    <div class="flex items-center gap-1.5">
      <i data-lucide="signal" class="w-3 h-3"></i>
      <i data-lucide="wifi" class="w-3 h-3"></i>
      <i data-lucide="battery-full" class="w-4 h-4"></i>
    </div>
  </div>
`;

const tabBar2 = (active) => `
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
        </button>
      `).join('')}
    </div>
  </div>
`;

// Mini header (back + title + action)
const miniHeader = (title, right = '') => `
  <div class="flex items-center justify-between mb-5">
    <button class="w-10 h-10 rounded-full glass flex items-center justify-center">
      <i data-lucide="arrow-left" class="w-4 h-4"></i>
    </button>
    <p class="bracket-label text-warm-500">${title}</p>
    <div class="w-10 h-10 flex items-center justify-center">${right}</div>
  </div>
`;

// Custom mood face glyphs (SVG) — refined: cleaner curves, subtle inner highlight
const moodFace = (level, size = 72) => {
  const faces = {
    5: { bg: 'linear-gradient(135deg,#F4A77E,#E88B5A)', label: 'Overjoyed',
         eyes: '<circle cx="35" cy="42" r="4" fill="#040818"/><circle cx="65" cy="42" r="4" fill="#040818"/>',
         mouth: '<path d="M30 58 Q50 78 70 58" stroke="#040818" stroke-width="4" fill="none" stroke-linecap="round"/>' },
    4: { bg: 'linear-gradient(135deg,#9BC4B0,#7AAA94)', label: 'Content',
         eyes: '<circle cx="36" cy="44" r="3.5" fill="#040818"/><circle cx="64" cy="44" r="3.5" fill="#040818"/>',
         mouth: '<path d="M35 60 Q50 70 65 60" stroke="#040818" stroke-width="3.5" fill="none" stroke-linecap="round"/>' },
    3: { bg: 'linear-gradient(135deg,#C7BEA9,#8B95A8)', label: 'Neutral',
         eyes: '<circle cx="36" cy="44" r="3.5" fill="#040818"/><circle cx="64" cy="44" r="3.5" fill="#040818"/>',
         mouth: '<line x1="35" y1="65" x2="65" y2="65" stroke="#040818" stroke-width="3.5" stroke-linecap="round"/>' },
    2: { bg: 'linear-gradient(135deg,#A89AE0,#8B7CC8)', label: 'Down',
         eyes: '<path d="M32 46 Q36 42 40 46" stroke="#040818" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M60 46 Q64 42 68 46" stroke="#040818" stroke-width="3" fill="none" stroke-linecap="round"/>',
         mouth: '<path d="M35 68 Q50 58 65 68" stroke="#040818" stroke-width="3.5" fill="none" stroke-linecap="round"/>' },
    1: { bg: 'linear-gradient(135deg,#6B5BA8,#3A4255)', label: 'Struggling',
         eyes: '<line x1="32" y1="46" x2="40" y2="46" stroke="#040818" stroke-width="3" stroke-linecap="round"/><line x1="60" y1="46" x2="68" y2="46" stroke="#040818" stroke-width="3" stroke-linecap="round"/>',
         mouth: '<path d="M32 70 Q50 58 68 70" stroke="#040818" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="76" cy="62" r="2.5" fill="#A89AE0"/>' },
  };
  const f = faces[level];
  return `
    <div class="rounded-full flex items-center justify-center relative" style="width:${size}px;height:${size}px;background:${f.bg};box-shadow:inset 0 ${size*0.05}px ${size*0.1}px rgba(255,255,255,0.2),inset 0 -${size*0.04}px ${size*0.08}px rgba(0,0,0,0.15);">
      <svg viewBox="0 0 100 100" width="${size*0.9}" height="${size*0.9}">
        ${f.eyes}
        ${f.mouth}
      </svg>
    </div>
  `;
};

// ------------------------------------------------------------------
// 01 - SPLASH (signature breathing orb)
// ------------------------------------------------------------------
const splashScreen = `
  ${statusBar2}
  <div class="h-full relative mesh-bg flex items-center justify-center">
    <!-- Layered ambient depth -->
    <div class="absolute top-1/4 left-1/4 w-72 h-72 smoke opacity-90"></div>
    <div class="absolute bottom-1/4 right-1/4 w-56 h-56 breath-orb opacity-70"></div>

    <div class="absolute inset-0 flex items-center justify-center">
      <div class="relative">
        <div class="w-72 h-72 rounded-full border border-aurora-300/8"></div>
        <div class="absolute inset-6 rounded-full border border-aurora-300/12"></div>
        <div class="absolute inset-14 rounded-full border border-sage-300/15"></div>
        <div class="absolute inset-22 rounded-full border border-sage-300/22"></div>
        <div class="absolute inset-28 rounded-full breath-orb"></div>
      </div>
    </div>

    <div class="relative z-10 text-center">
      <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-sage-300 via-aurora-300 to-lavender-300 mx-auto mb-5 flex items-center justify-center shadow-aurora-glow">
        <div class="w-4 h-4 rounded-full bg-warm-50"></div>
      </div>
      <p class="font-display text-[36px] font-light text-warm-50 tracking-tight">Solace</p>
      <p class="bracket-label text-aurora-300 mt-2">a quiet companion</p>
    </div>

    <p class="absolute bottom-12 left-0 right-0 text-center bracket-label text-warm-500">v3.0 &middot; loading&hellip;</p>
  </div>
`;

// ------------------------------------------------------------------
// 02 - QUOTE SPLASH (editorial loading moment)
// ------------------------------------------------------------------
const quoteSplashScreen = `
  ${statusBar2}
  <div class="h-full relative mesh-bg">
    <!-- Atmospheric blobs -->
    <div class="absolute top-20 right-10 w-48 h-48 smoke opacity-70"></div>
    <div class="absolute bottom-32 left-8 w-40 h-40 breath-orb opacity-50"></div>

    <div class="absolute inset-0 flex flex-col items-center justify-center px-10 text-center">
      <i data-lucide="quote" class="w-7 h-7 text-sage-300/40 mb-6" style="transform: scaleX(-1);"></i>
      <p class="font-display text-[28px] text-warm-50 italic leading-[1.2] font-light">
        Almost everything<br/>will work again<br/>if you unplug it<br/>for a few minutes<br/>
        <span class="not-italic text-aurora-300">&mdash;</span> <span class="text-2xl">including you.</span>
      </p>
      <p class="bracket-label text-aurora-300 mt-8">Anne Lamott</p>

      <div class="absolute bottom-20 left-0 right-0 flex flex-col items-center px-12">
        <div class="w-full max-w-[200px] h-0.5 bg-white/5 rounded-full overflow-hidden mb-3">
          <div class="h-full w-1/3 bg-gradient-to-r from-sage-300 to-aurora-300 rounded-full"></div>
        </div>
        <p class="bracket-label text-warm-500">Preparing your space&hellip;</p>
      </div>
    </div>
  </div>
`;

// ------------------------------------------------------------------
// 03 - GOALS PICKER
// ------------------------------------------------------------------
const goalsScreen = `
  ${statusBar2}
  <div class="bg-midnight-950 h-full relative">
    <div class="absolute top-0 left-0 right-0 h-72 mesh-bg opacity-40"></div>

    <div class="relative px-6 pt-14">
      ${miniHeader('Step 3 of 4', '<button class="text-xs text-warm-400 font-medium">Skip</button>')}

      <p class="bracket-label text-aurora-300 mb-3">What matters most</p>
      <h1 class="font-display text-[30px] font-light text-warm-50 leading-[1.05] mb-3">
        What brings you<br/>
        <span class="italic">here today?</span>
      </h1>
      <p class="text-[13px] text-warm-400 mb-7 leading-relaxed">Pick a few &mdash; we&rsquo;ll tailor your experience. You can change these anytime.</p>

      <div class="grid grid-cols-2 gap-3 pb-32">
        ${[
          { icon: 'alert-triangle', label: 'Anxiety', selected: true, hue: '155,196,176' },
          { icon: 'cloud-drizzle', label: 'Low mood', selected: true, hue: '168,154,224' },
          { icon: 'moon', label: 'Sleep', hue: '168,154,224' },
          { icon: 'activity', label: 'Stress', selected: true, hue: '244,167,126' },
          { icon: 'users', label: 'Relationships', hue: '155,196,176' },
          { icon: 'trending-up', label: 'Self-growth', hue: '244,167,126' },
          { icon: 'heart', label: 'Grief', hue: '168,154,224' },
          { icon: 'focus', label: 'Focus', hue: '138,163,255' },
        ].map(g => `
          <button class="${g.selected ? '' : 'glass'} border rounded-2xl p-4 text-left flex flex-col gap-3 aspect-square justify-between transition-all" style="${g.selected ? `background:rgba(${g.hue},0.12);border-color:rgba(${g.hue},0.5);` : 'border-color:rgba(255,255,255,0.06);'}">
            <div class="w-11 h-11 rounded-xl flex items-center justify-center" style="background:rgba(${g.hue},${g.selected?0.2:0.08});border:1px solid rgba(${g.hue},${g.selected?0.35:0.15});">
              <i data-lucide="${g.icon}" class="w-5 h-5" style="color:rgb(${g.hue});"></i>
            </div>
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-warm-50">${g.label}</p>
              ${g.selected ? `<div class="w-4 h-4 rounded-full flex items-center justify-center" style="background:rgb(${g.hue});"><i data-lucide="check" class="w-2.5 h-2.5 text-midnight-950" stroke-width="3"></i></div>` : ''}
            </div>
          </button>
        `).join('')}
      </div>
    </div>

    <div class="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-6 bg-gradient-to-t from-midnight-950 via-midnight-950 to-transparent">
      <p class="text-center text-[11px] text-warm-500 mb-3">3 selected</p>
      <button class="w-full py-4 rounded-2xl btn-peach font-medium text-sm flex items-center justify-center gap-2">
        Continue <i data-lucide="arrow-right" class="w-4 h-4"></i>
      </button>
    </div>
  </div>
`;

// ------------------------------------------------------------------
// 04 - BIOMETRIC / FACE ID PRIMER
// ------------------------------------------------------------------
const biometricScreen = `
  ${statusBar2}
  <div class="bg-midnight-950 h-full relative">
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 breath-orb opacity-40"></div>

    <div class="relative px-6 pt-14 pb-8 h-full flex flex-col">
      ${miniHeader('Security')}

      <div class="flex-1 flex flex-col items-center justify-center text-center">
        <!-- Face ID icon -->
        <div class="w-32 h-32 rounded-3xl border-2 border-sage-300/30 flex items-center justify-center mb-8 relative">
          <div class="absolute inset-3 border-2 border-dashed border-sage-300/20 rounded-2xl"></div>
          <div class="absolute inset-0 rounded-3xl" style="background:radial-gradient(circle,rgba(155,196,176,0.15),transparent 70%);"></div>
          <i data-lucide="scan-face" class="w-16 h-16 text-sage-300 relative z-10"></i>
        </div>

        <p class="bracket-label text-aurora-300 mb-3">Optional &middot; 2 seconds</p>
        <h1 class="font-display text-[30px] font-light text-warm-50 leading-[1.05] mb-4">
          Use Face ID<br/>
          <span class="italic">for quick access?</span>
        </h1>
        <p class="text-[13px] text-warm-400 leading-relaxed max-w-[280px] mb-10">
          Your journal entries and conversations stay private &mdash; even from people who have your phone.
        </p>

        <div class="w-full">
          <button class="w-full py-4 rounded-2xl btn-primary font-medium text-sm mb-3">
            Turn on Face ID
          </button>
          <button class="text-sm text-warm-400 font-medium py-3 w-full">
            Maybe later
          </button>
        </div>
      </div>
    </div>
  </div>
`;

// ------------------------------------------------------------------
// 05 - NOTIFICATION PRIMER
// ------------------------------------------------------------------
const notifPrimerScreen = `
  ${statusBar2}
  <div class="bg-midnight-950 h-full relative">
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 smoke opacity-60"></div>

    <div class="relative px-6 pt-14 pb-8 h-full flex flex-col">
      ${miniHeader('Reminders')}

      <div class="flex-1 flex flex-col justify-center">
        <div class="relative mb-10 mx-2">
          <!-- Stack of notification cards -->
          <div class="glass rounded-2xl p-4 absolute left-4 right-4 -bottom-6 opacity-25 -z-20"></div>
          <div class="glass rounded-2xl p-4 absolute left-2 right-2 -bottom-3 opacity-50 -z-10"></div>
          <div class="glass-strong rounded-2xl p-4 flex items-center gap-3 relative z-10 shadow-cosmic">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-sage-300 via-aurora-300 to-lavender-300 flex items-center justify-center">
              <i data-lucide="sparkles" class="w-4 h-4 text-midnight-950"></i>
            </div>
            <div class="flex-1">
              <p class="text-[11px] font-medium text-warm-50">Solace</p>
              <p class="text-[11px] text-warm-400">How are you feeling right now?</p>
            </div>
            <span class="text-[9px] text-warm-500 font-mono">now</span>
          </div>
        </div>

        <p class="bracket-label text-aurora-300 mb-3 text-center">Gentle &middot; You&rsquo;re in control</p>
        <h1 class="font-display text-[30px] font-light text-warm-50 leading-[1.05] mb-3 text-center">
          A soft check-in<br/>
          <span class="italic">once a day?</span>
        </h1>
        <p class="text-[13px] text-warm-400 leading-relaxed text-center max-w-[280px] mx-auto mb-10">
          We&rsquo;ll send a quiet reminder at your chosen time. No streaks, no guilt &mdash; just a small nudge when it helps.
        </p>

        <button class="w-full py-4 rounded-2xl btn-sage font-medium text-sm mb-3">
          Allow notifications
        </button>
        <button class="text-sm text-warm-400 font-medium py-3 w-full">
          Not now
        </button>
      </div>
    </div>
  </div>
`;

// ------------------------------------------------------------------
// 06 - ASSESSMENT INTRO
// ------------------------------------------------------------------
const assessmentIntroScreen = `
  ${statusBar2}
  <div class="bg-midnight-950 h-full relative">
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 breath-orb opacity-50"></div>

    <div class="relative px-6 pt-14 pb-8 h-full flex flex-col">
      ${miniHeader('Check-in')}

      <div class="flex-1 flex flex-col justify-center text-center">
        <div class="mx-auto mb-7 relative">
          <div class="w-24 h-24 rounded-full bg-gradient-to-br from-sage-300/30 via-aurora-300/25 to-lavender-300/25 backdrop-blur-xl border border-sage-300/30 flex items-center justify-center shadow-sage-glow">
            <i data-lucide="shield-check" class="w-10 h-10 text-sage-300"></i>
          </div>
        </div>

        <p class="bracket-label text-aurora-300 mb-3">Mental health check</p>
        <h1 class="font-display text-[30px] font-light text-warm-50 leading-[1.05] mb-3">
          A quiet check-in<br/>
          <span class="italic">just for you.</span>
        </h1>
        <p class="text-[13px] text-warm-400 leading-relaxed max-w-[280px] mx-auto mb-7">
          14 questions based on the validated GAD-7, PHQ-9 and PSS scales. There are no wrong answers.
        </p>

        <div class="flex gap-2 justify-center mb-10 flex-wrap">
          <span class="chip"><i data-lucide="clock" class="w-3 h-3 text-sage-300"></i><span class="font-mono">5-7</span> minutes</span>
          <span class="chip"><i data-lucide="lock" class="w-3 h-3 text-sage-300"></i>Private</span>
          <span class="chip"><i data-lucide="file-text" class="w-3 h-3 text-sage-300"></i><span class="font-mono">14</span> questions</span>
        </div>

        <button class="w-full py-4 rounded-2xl btn-sage font-medium text-sm flex items-center justify-center gap-2 mb-3">
          Begin <i data-lucide="arrow-right" class="w-4 h-4"></i>
        </button>
        <button class="text-[11px] text-warm-500 py-2">
          Learn how we protect your data
        </button>
      </div>
    </div>
  </div>
`;

// ------------------------------------------------------------------
// 07 - ASSESSMENT RESULTS
// ------------------------------------------------------------------
const assessmentResultsScreen = `
  ${statusBar2}
  <div class="bg-midnight-950 h-full relative">
    <div class="absolute top-0 left-0 right-0 h-96 opacity-50" style="background:radial-gradient(ellipse at top,rgba(107,143,255,0.18),transparent 60%);"></div>

    <div class="relative px-6 pt-14 pb-32">
      ${miniHeader('Your results', '<i data-lucide="share-2" class="w-4 h-4 text-warm-400"></i>')}

      <p class="bracket-label text-aurora-300 mb-3 text-center">April 6 &middot; 4 min ago</p>
      <h1 class="font-display text-[30px] font-light text-warm-50 text-center leading-[1.05] mb-2">
        You&rsquo;re doing<br/>
        <span class="italic">okay, Rayyan.</span>
      </h1>

      <!-- Big score ring -->
      <div class="flex justify-center my-8">
        <div class="relative w-56 h-56">
          <svg viewBox="0 0 200 200" class="w-full h-full -rotate-90">
            <circle cx="100" cy="100" r="88" stroke="rgba(255,255,255,0.05)" stroke-width="14" fill="none"/>
            <circle cx="100" cy="100" r="88" stroke="url(#resultGrad)" stroke-width="14" fill="none"
                    stroke-linecap="round" stroke-dasharray="553" stroke-dashoffset="166"/>
            <defs>
              <linearGradient id="resultGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#9BC4B0"/>
                <stop offset="50%" stop-color="#8AA3FF"/>
                <stop offset="100%" stop-color="#A89AE0"/>
              </linearGradient>
            </defs>
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <p class="font-display text-[68px] font-light text-warm-50 leading-none tracking-tight">68</p>
            <p class="text-[10px] text-warm-500 mt-1 font-mono">out of 100</p>
            <p class="bracket-label text-sage-300 mt-2">Moderate</p>
          </div>
        </div>
      </div>

      <!-- Breakdown -->
      <div class="hero-card glass-strong rounded-3xl p-5 mb-4">
        <p class="text-sm font-medium text-warm-50 mb-4">How it breaks down</p>
        <div class="space-y-4">
          ${[
            { label: 'Mood', v: 72, color: 'sage-300', hue: '155,196,176', note: 'Feeling balanced' },
            { label: 'Stress', v: 58, color: 'peach-300', hue: '244,167,126', note: 'A bit elevated' },
            { label: 'Sleep', v: 81, color: 'lavender-300', hue: '168,154,224', note: 'Sleeping well' },
            { label: 'Social', v: 62, color: 'aurora-300', hue: '138,163,255', note: 'Could connect more' },
          ].map(b => `
            <div>
              <div class="flex justify-between items-center mb-1.5">
                <span class="text-[12px] text-warm-50">${b.label}</span>
                <span class="font-mono text-[12px] text-warm-400">${b.v}</span>
              </div>
              <div class="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div class="h-full rounded-full" style="width:${b.v}%;background:linear-gradient(90deg,rgba(${b.hue},0.7),rgba(${b.hue},1));"></div>
              </div>
              <p class="text-[10px] text-warm-500 mt-1">${b.note}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Recommendations -->
      <div class="glass rounded-3xl p-5 mb-4">
        <p class="text-sm font-medium text-warm-50 mb-3">What we suggest</p>
        <div class="space-y-1">
          ${[
            { icon: 'wind', label: 'Try the 4-7-8 breathing exercise', time: '4 min', hue: '155,196,176' },
            { icon: 'book-open', label: 'Journal about your stressors', time: '10 min', hue: '244,167,126' },
            { icon: 'message-circle', label: 'Talk to Solace about work', time: 'Now', hue: '138,163,255' },
          ].map(r => `
            <button class="w-full flex items-center gap-3 py-2.5 px-0 text-left">
              <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style="background:rgba(${r.hue},0.12);border:1px solid rgba(${r.hue},0.2);">
                <i data-lucide="${r.icon}" class="w-4 h-4" style="color:rgb(${r.hue});"></i>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[12px] text-warm-50">${r.label}</p>
              </div>
              <span class="text-[10px] text-warm-500 font-mono">${r.time}</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-warm-500"></i>
            </button>
          `).join('')}
        </div>
      </div>

      <p class="text-[10px] text-warm-500 text-center leading-relaxed px-4">
        Not a medical diagnosis. If things feel overwhelming, please reach out to a professional.
      </p>
    </div>

    <div class="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-gradient-to-t from-midnight-950 to-transparent">
      <button class="w-full py-4 rounded-2xl btn-sage font-medium text-sm">
        Continue to Solace
      </button>
    </div>
  </div>
`;

// ------------------------------------------------------------------
// 08 - HOME v2 (with emotional check-in added)
// ------------------------------------------------------------------
const homeV2Screen = `
  ${statusBar2}
  <div class="bg-midnight-950 h-full relative">
    <div class="absolute top-0 left-0 right-0 h-80 opacity-50" style="background:radial-gradient(ellipse at top,rgba(107,143,255,0.18),transparent 60%);"></div>

    <div class="relative px-6 pt-14 pb-32">
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

      <!-- NEW: Emotional check-in (before the score) -->
      <div class="hero-card glass-aurora rounded-3xl p-5 mt-5 relative overflow-hidden">
        <div class="absolute -top-10 -right-10 w-40 h-40 breath-orb opacity-60"></div>
        <p class="relative text-sm text-warm-50 font-medium mb-4">How are you right now?</p>
        <div class="relative flex justify-between items-end gap-2">
          ${[1,2,3,4,5].map(i => `
            <button class="flex-1 flex flex-col items-center gap-1.5 ${i===4?'scale-110':''}">
              <div class="${i===4?'ring-2 ring-sage-300 ring-offset-2 ring-offset-midnight-800 rounded-full':''}">
                ${moodFace(i, 40)}
              </div>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Solace score (now second, compact) -->
      <div class="grid grid-cols-2 gap-3 mt-4">
        <div class="glass rounded-2xl p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="bracket-label text-warm-500">Solace</span>
            <i data-lucide="trending-up" class="w-3.5 h-3.5 text-sage-300"></i>
          </div>
          <p class="font-display text-[28px] font-light text-warm-50 leading-none">72<span class="text-base text-warm-400 font-mono">/100</span></p>
          <p class="text-[10px] text-sage-300 mt-1.5">+5 this week</p>
        </div>
        <div class="glass rounded-2xl p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="bracket-label text-warm-500">Streak</span>
            <i data-lucide="flame" class="w-3.5 h-3.5 text-peach-300"></i>
          </div>
          <p class="font-display text-[28px] font-light text-warm-50 leading-none">23<span class="text-base text-warm-400 font-mono">d</span></p>
          <div class="flex gap-0.5 mt-2">
            ${Array(7).fill(0).map((_,i)=>`<div class="flex-1 h-0.5 rounded-full ${i<6?'bg-peach-300':'bg-white/8'}"></div>`).join('')}
          </div>
        </div>
      </div>

      <!-- AI continue (prominent, signature orb) -->
      <button class="w-full mt-4 hero-card rounded-3xl p-5 relative overflow-hidden text-left"
              style="background: linear-gradient(135deg, rgba(155,196,176,0.18) 0%, rgba(107,143,255,0.12) 50%, rgba(168,154,224,0.12) 100%); border: 1px solid rgba(155,196,176,0.25);">
        <div class="absolute -bottom-16 -right-16 w-44 h-44 breath-orb"></div>
        <div class="relative flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-sage-300 via-aurora-300 to-lavender-300 flex items-center justify-center flex-shrink-0 shadow-sage-glow">
            <i data-lucide="sparkles" class="w-6 h-6 text-midnight-950"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="bracket-label text-aurora-300 mb-1">Pick up where you left off</p>
            <p class="text-sm font-medium text-warm-50 leading-snug truncate">&ldquo;Let&rsquo;s talk about that meeting&hellip;&rdquo;</p>
            <p class="text-[10px] text-warm-500 mt-1 font-mono">3 min ago &middot; 12 messages</p>
          </div>
          <i data-lucide="arrow-right" class="w-4 h-4 text-warm-400"></i>
        </div>
      </button>

      <!-- Today's practice -->
      <div class="mt-6">
        <div class="flex justify-between items-baseline mb-3">
          <h3 class="font-display text-lg text-warm-50">Today&rsquo;s practice</h3>
          <button class="text-[11px] text-aurora-300 font-medium">All practices &rarr;</button>
        </div>
        <div class="flex gap-3 scroll-x -mx-6 px-6">
          ${[
            { tag: 'Breathing', title: '4-7-8 calming breath', time: '4 min', icon: 'wind', hue: '155,196,176' },
            { tag: 'Mindfulness', title: 'Body scan', time: '10 min', icon: 'user-round', hue: '168,154,224' },
            { tag: 'CBT', title: 'Thought record', time: '6 min', icon: 'feather', hue: '244,167,126' },
          ].map(a => `
            <div class="w-44 flex-shrink-0 glass rounded-2xl p-4">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style="background:rgba(${a.hue},0.12);border:1px solid rgba(${a.hue},0.2);">
                <i data-lucide="${a.icon}" class="w-4 h-4" style="color:rgb(${a.hue});"></i>
              </div>
              <span class="text-[9px] bracket-label" style="color:rgb(${a.hue});">${a.tag}</span>
              <p class="text-[13px] font-medium text-warm-50 mt-1 leading-snug">${a.title}</p>
              <p class="text-[10px] text-warm-500 mt-1 font-mono">${a.time}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    ${tabBar2('home')}
  </div>
`;

// ------------------------------------------------------------------
// 09 - DAILY CHECK-IN (quick mood, full screen)
// ------------------------------------------------------------------
const checkinScreen = `
  ${statusBar2}
  <div class="bg-midnight-950 h-full relative">
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 breath-orb opacity-40"></div>

    <div class="relative px-6 pt-14 pb-8 h-full flex flex-col">
      <div class="flex justify-between items-center mb-6">
        <button class="w-10 h-10 rounded-full glass flex items-center justify-center">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
        <p class="bracket-label text-warm-500">Daily check-in</p>
        <div class="w-10 h-10"></div>
      </div>

      <div class="flex-1 flex flex-col justify-center">
        <p class="text-center bracket-label text-aurora-300 mb-3">Right now</p>
        <h1 class="font-display text-[30px] font-light text-warm-50 text-center leading-[1.05] mb-8">
          How are you<br/>
          <span class="italic">feeling?</span>
        </h1>

        <!-- Big mood selector -->
        <div class="flex justify-center mb-5 relative">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-44 h-44 rounded-full breath-orb opacity-50"></div>
          </div>
          <div class="relative z-10">${moodFace(4, 130)}</div>
        </div>
        <p class="font-display text-[24px] text-center text-warm-50 italic mb-8">Content</p>

        <!-- Mood scale -->
        <div class="px-2 mb-7">
          <div class="flex justify-between mb-3">
            ${[1,2,3,4,5].map(i => `
              <button class="${i===4?'ring-2 ring-sage-300 rounded-full ring-offset-2 ring-offset-midnight-950':''}">
                ${moodFace(i, 40)}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Activity tags -->
        <div class="mb-6">
          <p class="bracket-label text-warm-500 mb-3">What&rsquo;s influencing you?</p>
          <div class="flex flex-wrap gap-2">
            ${['Work','Family','Sleep','Exercise','Food','Weather','Social','Alone'].map((t,i) => `
              <button class="chip ${[0,2].includes(i)?'!bg-sage-300/12 !border-sage-300/35 !text-sage-300':''}">${t}</button>
            `).join('')}
          </div>
        </div>
      </div>

      <button class="w-full py-4 rounded-2xl btn-sage font-medium text-sm flex items-center justify-center gap-2">
        Log this mood <i data-lucide="check" class="w-4 h-4"></i>
      </button>
    </div>
  </div>
`;

// ------------------------------------------------------------------
// 10 - MOOD CALENDAR / HEATMAP
// ------------------------------------------------------------------
const moodCalendarScreen = `
  ${statusBar2}
  <div class="bg-midnight-950 h-full relative">
    <div class="absolute top-0 left-0 right-0 h-72 opacity-40" style="background:radial-gradient(ellipse at 30% 0%,rgba(155,196,176,0.18),transparent 60%);"></div>

    <div class="relative px-6 pt-14 pb-32">
      ${miniHeader('April 2026', '<i data-lucide="calendar-days" class="w-4 h-4 text-warm-400"></i>')}

      <h1 class="font-display text-[30px] font-light text-warm-50 leading-tight">Your month</h1>
      <p class="text-[13px] text-warm-400 mt-1 mb-6">23 days logged &middot; mostly calm</p>

      <!-- Month grid -->
      <div class="hero-card glass-strong rounded-3xl p-5 mb-4">
        <div class="grid grid-cols-7 gap-1.5 mb-3">
          ${['M','T','W','T','F','S','S'].map(d=>`<div class="text-center text-[9px] text-warm-500 bracket-label">${d}</div>`).join('')}
        </div>
        <div class="grid grid-cols-7 gap-1.5">
          ${Array(30).fill(0).map((_,i) => {
            const moods = [4,3,4,5,3,4,4,2,3,4,5,5,4,3,3,4,2,3,4,5,4,4,3,4,null,null,null,null,null,null];
            const m = moods[i];
            const colors = {1:'107,91,168',2:'168,154,224',3:'199,190,169',4:'155,196,176',5:'244,167,126'};
            const isToday = i === 5;
            return `
              <div class="aspect-square rounded-lg ${isToday?'ring-2 ring-warm-50 ring-offset-1 ring-offset-midnight-700':''} flex items-center justify-center text-[9px] font-mono text-warm-400/70"
                   style="${m?`background:rgba(${colors[m]},0.35);border:1px solid rgba(${colors[m]},0.55);box-shadow:inset 0 1px 0 rgba(255,255,255,0.05);`:'background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.04);'}">
                ${i+1}
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Legend -->
      <div class="glass rounded-2xl p-3.5 mb-4">
        <p class="bracket-label text-warm-500 mb-2.5">Legend</p>
        <div class="flex justify-between items-center text-[9px] text-warm-400">
          ${[
            { c: '107,91,168', l: 'Struggling' },
            { c: '168,154,224', l: 'Down' },
            { c: '199,190,169', l: 'Neutral' },
            { c: '155,196,176', l: 'Content' },
            { c: '244,167,126', l: 'Great' },
          ].map(l=>`
            <div class="flex flex-col items-center gap-1.5">
              <div class="w-5 h-5 rounded-md" style="background:rgba(${l.c},0.35);border:1px solid rgba(${l.c},0.55);"></div>
              <span>${l.l}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Month summary -->
      <div class="glass rounded-2xl p-4 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-sage-300/15 border border-sage-300/25 flex items-center justify-center">
          <i data-lucide="trending-up" class="w-4 h-4 text-sage-300"></i>
        </div>
        <div class="flex-1">
          <p class="text-[12px] font-medium text-warm-50">18% better than March</p>
          <p class="text-[10px] text-warm-500 mt-0.5">Your streak and sleep are both improving.</p>
        </div>
      </div>
    </div>
    ${tabBar2('mood')}
  </div>
`;

// ------------------------------------------------------------------
// 11 - MOOD INSIGHTS
// ------------------------------------------------------------------
const moodInsightsScreen = `
  ${statusBar2}
  <div class="bg-midnight-950 h-full relative">
    <div class="absolute top-0 left-0 right-0 h-72 opacity-40" style="background:radial-gradient(ellipse at 60% 0%,rgba(107,143,255,0.18),transparent 60%);"></div>

    <div class="relative px-6 pt-14 pb-32">
      ${miniHeader('Insights')}
      <h1 class="font-display text-[30px] font-light text-warm-50 leading-tight">What we&rsquo;ve learned</h1>
      <p class="text-[13px] text-warm-400 mt-1 mb-6">From 23 days of data &middot; AI-analyzed</p>

      <!-- Key insight hero -->
      <div class="hero-card rounded-3xl p-5 mb-4 relative overflow-hidden"
           style="background: linear-gradient(135deg, rgba(155,196,176,0.18), rgba(107,143,255,0.12)); border: 1px solid rgba(155,196,176,0.25);">
        <div class="absolute -top-10 -right-10 w-40 h-40 breath-orb opacity-60"></div>
        <div class="relative">
          <span class="chip mb-3"><i data-lucide="sparkles" class="w-3 h-3 text-aurora-300"></i>Pattern detected</span>
          <p class="font-display text-[20px] text-warm-50 italic leading-snug">You feel calmer after 7+ hours of sleep.</p>
          <p class="text-[11px] text-warm-400 mt-2.5 leading-relaxed">Your mood score averages <span class="text-sage-300 font-mono">78</span> on well-rested days vs. <span class="text-peach-300 font-mono">62</span> on short nights. Protecting sleep is high-leverage for you.</p>
        </div>
      </div>

      <!-- Correlation chart -->
      <div class="glass rounded-2xl p-5 mb-4">
        <div class="flex justify-between items-baseline mb-1">
          <p class="text-sm font-medium text-warm-50">Mood &times; Sleep correlation</p>
          <span class="bracket-label text-warm-500">23 days</span>
        </div>
        <p class="text-[10px] text-warm-500 mb-4">Each dot is one day</p>
        <svg viewBox="0 0 300 140" class="w-full h-32">
          <line x1="30" y1="10" x2="30" y2="120" stroke="rgba(255,255,255,0.08)"/>
          <line x1="30" y1="120" x2="290" y2="120" stroke="rgba(255,255,255,0.08)"/>
          ${[[55,90,3],[75,75,4],[95,65,4],[115,40,5],[130,55,4],[60,100,2],[150,35,5],[85,80,3],[175,45,5],[195,30,5],[105,70,4],[155,50,4]].map(([x,y,m]) => {
            const c = ['#6B5BA8','#A89AE0','#C7BEA9','#9BC4B0','#F4A77E'][m-1];
            return `<circle cx="${x+30}" cy="${y}" r="5" fill="${c}" opacity="0.85"/>`;
          }).join('')}
          <line x1="40" y1="110" x2="280" y2="30" stroke="#8AA3FF" stroke-width="1.5" stroke-dasharray="3 4" opacity="0.6"/>
          <text x="30" y="135" fill="#5A6478" font-size="9" font-family="Fira Code">5h</text>
          <text x="280" y="135" fill="#5A6478" font-size="9" font-family="Fira Code">10h</text>
          <text x="5" y="20" fill="#5A6478" font-size="9" font-family="Fira Code">5</text>
          <text x="5" y="120" fill="#5A6478" font-size="9" font-family="Fira Code">1</text>
        </svg>
      </div>

      <!-- Other insights -->
      <div class="space-y-2.5">
        ${[
          { icon: 'sun', title: 'You feel brighter after sunlight', desc: '21% boost on outdoor-activity days', hue: '244,167,126' },
          { icon: 'users', title: 'Social time matters', desc: 'Mood jumps when you log family or friends', hue: '155,196,176' },
          { icon: 'briefcase', title: 'Mondays are harder', desc: 'Consider a Sunday wind-down ritual', hue: '168,154,224' },
        ].map(i => `
          <div class="glass rounded-2xl p-4 flex items-start gap-3">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style="background:rgba(${i.hue},0.12);border:1px solid rgba(${i.hue},0.2);">
              <i data-lucide="${i.icon}" class="w-4 h-4" style="color:rgb(${i.hue});"></i>
            </div>
            <div class="flex-1">
              <p class="text-[12px] font-medium text-warm-50">${i.title}</p>
              <p class="text-[10px] text-warm-500 mt-0.5">${i.desc}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    ${tabBar2('mood')}
  </div>
`;

// ------------------------------------------------------------------
// 12 - CHAT LIST / SESSIONS HISTORY
// ------------------------------------------------------------------
const chatListScreen = `
  ${statusBar2}
  <div class="bg-midnight-950 h-full relative">
    <div class="absolute top-0 left-0 right-0 h-72 opacity-40" style="background:radial-gradient(ellipse at 70% 0%,rgba(168,154,224,0.18),transparent 60%);"></div>

    <div class="relative px-6 pt-14 pb-32">
      <div class="flex items-center justify-between mb-2">
        <div>
          <p class="bracket-label text-warm-500">Conversations</p>
          <h1 class="font-display text-[30px] font-light text-warm-50 mt-0.5">Your sessions</h1>
        </div>
        <button class="w-10 h-10 rounded-full glass flex items-center justify-center">
          <i data-lucide="search" class="w-4 h-4"></i>
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex gap-2 mt-5 mb-5">
        <button class="px-4 py-1.5 rounded-full bg-sage-300 text-midnight-950 text-[11px] font-medium">All <span class="font-mono">5</span></button>
        <button class="px-4 py-1.5 rounded-full glass text-warm-400 text-[11px] font-medium">Active</button>
        <button class="px-4 py-1.5 rounded-full glass text-warm-400 text-[11px] font-medium">Archived</button>
      </div>

      <!-- Conversation cards -->
      <div class="space-y-2.5">
        ${[
          { title: 'Work stress & boundaries', preview: 'Let us reframe that meeting&hellip;', time: '3m', unread: true, hue: '155,196,176', tag: 'CBT', msgs: 12 },
          { title: 'Morning anxiety routine', preview: 'Try starting with 5 breaths before&hellip;', time: '2h', hue: '155,196,176', tag: 'Mindfulness', msgs: 8 },
          { title: 'Processing the breakup', preview: 'Grief takes time &mdash; that is okay.', time: '1d', hue: '168,154,224', tag: 'Support', msgs: 34 },
          { title: 'Sleep routine check-in', preview: 'Your bedtime has improved by 20 min', time: '3d', hue: '168,154,224', tag: 'Sleep', msgs: 6 },
          { title: 'Handling the interview', preview: 'Congratulations on getting to stage 3!', time: '1w', hue: '244,167,126', tag: 'Growth', msgs: 22 },
        ].map(c => `
          <button class="w-full glass rounded-2xl p-4 text-left flex items-start gap-3 relative overflow-hidden">
            <div class="absolute top-0 left-0 bottom-0 w-1 rounded-r-full" style="background:rgba(${c.hue},0.6);"></div>
            <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ml-1" style="background:linear-gradient(135deg,rgba(${c.hue},0.2),rgba(${c.hue},0.08));border:1px solid rgba(${c.hue},0.3);">
              <i data-lucide="sparkles" class="w-4 h-4" style="color:rgb(${c.hue});"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-2 mb-1">
                <p class="text-[13px] font-medium text-warm-50 truncate">${c.title}</p>
                ${c.unread ? '<span class="w-2 h-2 rounded-full bg-peach-300 flex-shrink-0"></span>' : ''}
              </div>
              <p class="text-[11px] text-warm-400 truncate mb-1.5">${c.preview}</p>
              <div class="flex items-center gap-2">
                <span class="text-[9px] bracket-label" style="color:rgb(${c.hue});">${c.tag}</span>
                <span class="text-[9px] text-warm-500 opacity-40">&middot;</span>
                <span class="text-[9px] text-warm-500 font-mono">${c.msgs} msgs</span>
                <span class="text-[9px] text-warm-500 ml-auto font-mono">${c.time} ago</span>
              </div>
            </div>
          </button>
        `).join('')}
      </div>
    </div>

    <!-- FAB -->
    <button class="absolute bottom-28 right-6 w-14 h-14 rounded-full btn-peach flex items-center justify-center">
      <i data-lucide="plus" class="w-6 h-6"></i>
    </button>

    ${tabBar2('chat')}
  </div>
`;

// ------------------------------------------------------------------
// 13 - VOICE SESSION ACTIVE
// ------------------------------------------------------------------
const voiceScreen = `
  ${statusBar2}
  <div class="h-full relative mesh-bg">
    <!-- Layered cosmic depth -->
    <div class="absolute top-1/4 left-1/4 w-96 h-96 smoke opacity-80"></div>
    <div class="absolute bottom-1/4 right-1/4 w-72 h-72 breath-orb opacity-70"></div>

    <div class="relative px-6 pt-14 flex justify-between items-center">
      <button class="w-10 h-10 rounded-full glass flex items-center justify-center">
        <i data-lucide="x" class="w-4 h-4"></i>
      </button>
      <p class="bracket-label text-warm-400">Voice session</p>
      <div class="px-3 py-1.5 rounded-full glass">
        <span class="text-[10px] font-mono text-warm-200">00:32</span>
      </div>
    </div>

    <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <!-- Avatar with pulse -->
      <div class="relative mb-12">
        <div class="absolute -inset-12 rounded-full breath-orb"></div>
        <div class="absolute -inset-6 rounded-full border border-sage-300/20"></div>
        <div class="absolute -inset-3 rounded-full border border-aurora-300/30"></div>
        <div class="relative w-36 h-36 rounded-full bg-gradient-to-br from-sage-300 via-aurora-300 to-lavender-300 flex items-center justify-center shadow-aurora-glow">
          <i data-lucide="sparkles" class="w-14 h-14 text-midnight-950"></i>
        </div>
      </div>

      <p class="font-display text-[26px] italic text-warm-50 mb-2">I&rsquo;m listening&hellip;</p>
      <p class="text-[11px] text-warm-400 mb-12">Tap to pause at any time</p>

      <!-- Waveform -->
      <div class="flex items-center gap-1 h-16 mb-16">
        ${Array(34).fill(0).map((_,i) => {
          const h = 12 + Math.abs(Math.sin(i*0.5)) * 48 + (i%3===0 ? 12 : 0);
          return `<div class="w-1 rounded-full bg-gradient-to-t from-sage-300 to-aurora-300" style="height:${h}px;opacity:${0.35+Math.abs(Math.sin(i*0.3))*0.6};"></div>`;
        }).join('')}
      </div>
    </div>

    <div class="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-6">
      <button class="w-12 h-12 rounded-full glass flex items-center justify-center">
        <i data-lucide="keyboard" class="w-4 h-4"></i>
      </button>
      <button class="w-16 h-16 rounded-full btn-peach flex items-center justify-center">
        <i data-lucide="pause" class="w-6 h-6"></i>
      </button>
      <button class="w-12 h-12 rounded-full glass flex items-center justify-center">
        <i data-lucide="check" class="w-4 h-4"></i>
      </button>
    </div>
  </div>
`;

// ------------------------------------------------------------------
// 14 - SESSION SUMMARY
// ------------------------------------------------------------------
const sessionSummaryScreen = `
  ${statusBar2}
  <div class="bg-midnight-950 h-full relative">
    <div class="absolute top-0 left-0 right-0 h-80 opacity-50" style="background:radial-gradient(ellipse at 50% 0%,rgba(155,196,176,0.18),transparent 60%);"></div>

    <div class="relative px-6 pt-14 pb-32">
      ${miniHeader('Session complete', '<i data-lucide="share-2" class="w-4 h-4 text-warm-400"></i>')}

      <div class="flex justify-center mb-5">
        <div class="relative">
          <div class="absolute -inset-3 rounded-full border border-sage-300/20"></div>
          <div class="w-16 h-16 rounded-full bg-sage-300/15 border border-sage-300/35 flex items-center justify-center shadow-sage-glow">
            <i data-lucide="check" class="w-8 h-8 text-sage-300" stroke-width="2.5"></i>
          </div>
          <i data-lucide="sparkle" class="w-3 h-3 text-peach-300 absolute -top-1 right-0"></i>
          <i data-lucide="sparkle" class="w-2 h-2 text-aurora-300 absolute bottom-2 -left-1"></i>
        </div>
      </div>

      <p class="bracket-label text-sage-300 mb-3 text-center">April 6 &middot; <span class="font-mono">14 min</span></p>
      <h1 class="font-display text-[30px] font-light text-warm-50 text-center leading-[1.05] mb-6">
        Well done,<br/>
        <span class="italic">Rayyan.</span>
      </h1>

      <!-- Topic card -->
      <div class="hero-card glass-strong rounded-3xl p-5 mb-4">
        <p class="bracket-label text-warm-500 mb-2">What we talked about</p>
        <p class="text-[13px] text-warm-50 leading-relaxed mb-3">
          You shared about work stress and how anxiety shows up before meetings. We explored thought patterns and practiced a grounding exercise together.
        </p>
        <div class="flex gap-2 flex-wrap">
          <span class="chip">Work stress</span>
          <span class="chip">Anxiety</span>
          <span class="chip">Meetings</span>
        </div>
      </div>

      <!-- Techniques used -->
      <div class="glass rounded-2xl p-4 mb-4">
        <p class="text-xs font-medium text-warm-50 mb-3">Techniques we used</p>
        <div class="space-y-2.5">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-sage-300/15 border border-sage-300/25 flex items-center justify-center flex-shrink-0">
              <i data-lucide="brain" class="w-4 h-4 text-sage-300"></i>
            </div>
            <div class="flex-1">
              <p class="text-[11px] font-medium text-warm-50">Thought reframing</p>
              <p class="text-[9px] text-warm-500 mt-0.5">CBT technique</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-lavender-300/15 border border-lavender-300/25 flex items-center justify-center flex-shrink-0">
              <i data-lucide="wind" class="w-4 h-4 text-lavender-300"></i>
            </div>
            <div class="flex-1">
              <p class="text-[11px] font-medium text-warm-50">4-7-8 breathing</p>
              <p class="text-[9px] text-warm-500 mt-0.5">Grounding technique</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Next step -->
      <div class="hero-card rounded-2xl p-4 border border-peach-300/25" style="background:linear-gradient(135deg,rgba(244,167,126,0.15),rgba(244,167,126,0.04));">
        <div class="flex items-start gap-3">
          <div class="w-9 h-9 rounded-lg bg-peach-300/20 border border-peach-300/30 flex items-center justify-center flex-shrink-0">
            <i data-lucide="target" class="w-4 h-4 text-peach-300"></i>
          </div>
          <div class="flex-1">
            <p class="text-[12px] font-medium text-warm-50 mb-1">Small action for today</p>
            <p class="text-[11px] text-warm-400 leading-relaxed">Try the 5-minute breathing exercise before your 3pm meeting.</p>
          </div>
        </div>
        <button class="w-full mt-3 py-2.5 rounded-xl bg-peach-300/20 border border-peach-300/35 text-peach-300 text-[11px] font-medium">
          Schedule reminder
        </button>
      </div>
    </div>

    <div class="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-gradient-to-t from-midnight-950 to-transparent">
      <button class="w-full py-4 rounded-2xl btn-primary font-medium text-sm">
        Back to home
      </button>
    </div>
  </div>
`;

// ------------------------------------------------------------------
// 15 - JOURNAL ENTRY COMPOSER
// ------------------------------------------------------------------
const journalComposerScreen = `
  ${statusBar2}
  <div class="bg-midnight-950 h-full relative">
    <div class="px-6 pt-14 pb-20">
      <div class="flex items-center justify-between mb-6">
        <button class="text-[12px] text-warm-400">Cancel</button>
        <p class="bracket-label text-warm-500">New entry</p>
        <button class="text-[12px] text-sage-300 font-medium">Save</button>
      </div>

      <!-- Mood strip -->
      <div class="glass rounded-2xl p-3 mb-4">
        <p class="bracket-label text-warm-500 mb-2.5 text-center">How are you right now?</p>
        <div class="flex justify-between items-center">
          ${[1,2,3,4,5].map(i => `
            <button class="${i===4?'ring-2 ring-sage-300 rounded-full ring-offset-2 ring-offset-midnight-800':''}">
              ${moodFace(i, 36)}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Date & weather -->
      <div class="flex items-center gap-2 mb-4 text-[10px] text-warm-500 font-mono">
        <i data-lucide="calendar" class="w-3 h-3"></i>
        <span>Tuesday, April 6 &middot; 2:45 PM</span>
        <span class="opacity-40">&middot;</span>
        <i data-lucide="cloud" class="w-3 h-3"></i>
        <span>Cloudy, 64&deg;</span>
      </div>

      <!-- Title -->
      <input class="w-full bg-transparent font-display text-[26px] text-warm-50 placeholder-warm-500 outline-none mb-3" placeholder="Give this a title&hellip;" value="A quiet morning"/>

      <!-- Writing prompt -->
      <div class="glass rounded-xl p-3 mb-4 flex items-start gap-3 border border-peach-300/15">
        <i data-lucide="lightbulb" class="w-4 h-4 text-peach-300 mt-0.5 flex-shrink-0"></i>
        <p class="text-[11px] text-warm-400 leading-relaxed flex-1">
          <span class="text-peach-300 font-medium bracket-label">Prompt</span> &nbsp; What&rsquo;s one thing you&rsquo;re grateful for right now?
        </p>
        <button class="text-[14px] text-warm-500 leading-none">&times;</button>
      </div>

      <!-- Body text -->
      <div class="text-[14px] text-warm-50 leading-[1.65]">
        Started the day with coffee and that book I&rsquo;ve been meaning to finish. The rain outside makes everything feel softer &mdash; like the world is holding its breath with me.
        <br/><br/>
        I&rsquo;m still anxious about the meeting today, but I&rsquo;m also noticing how much lighter I feel after journaling for the past week. Maybe Solace is onto something with the &ldquo;small consistent actions&rdquo; idea.
        <br/><br/>
        Things I&rsquo;m grateful for<span class="inline-block w-0.5 h-4 bg-sage-300 align-middle ml-0.5 animate-pulse"></span>
      </div>

      <!-- Tag chips -->
      <div class="mt-6 flex flex-wrap gap-2">
        <span class="chip !bg-sage-300/12 !border-sage-300/30 !text-sage-300">#gratitude</span>
        <span class="chip !bg-sage-300/12 !border-sage-300/30 !text-sage-300">#morning</span>
        <button class="chip">+ Add tag</button>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="absolute bottom-0 left-0 right-0 glass-strong border-t border-white/5 px-4 py-3 flex items-center justify-around">
      <button class="p-2 text-warm-400"><i data-lucide="bold" class="w-4 h-4"></i></button>
      <button class="p-2 text-warm-400"><i data-lucide="italic" class="w-4 h-4"></i></button>
      <button class="p-2 text-warm-400"><i data-lucide="list" class="w-4 h-4"></i></button>
      <button class="p-2 text-warm-400"><i data-lucide="image" class="w-4 h-4"></i></button>
      <button class="p-2 text-warm-400"><i data-lucide="mic" class="w-4 h-4"></i></button>
      <div class="flex-1"></div>
      <span class="text-[10px] text-warm-500 font-mono">142 words</span>
    </div>
  </div>
`;

// ------------------------------------------------------------------
// 16 - JOURNAL ENTRY DETAIL
// ------------------------------------------------------------------
const journalDetailScreen = `
  ${statusBar2}
  <div class="bg-midnight-950 h-full relative">
    <div class="absolute top-0 left-0 right-0 h-72 opacity-40" style="background:radial-gradient(ellipse at 30% 0%,rgba(155,196,176,0.15),transparent 60%);"></div>

    <div class="relative px-6 pt-14 pb-20">
      ${miniHeader('Apr 6, 2026', `<i data-lucide="edit-3" class="w-4 h-4 text-warm-400"></i>`)}

      <div class="flex items-center gap-3 mb-5">
        ${moodFace(4, 52)}
        <div>
          <p class="bracket-label text-sage-300">Content</p>
          <p class="text-[10px] text-warm-500 mt-1 font-mono">2:45 PM &middot; 4 min read</p>
        </div>
      </div>

      <h1 class="font-display text-[30px] font-light text-warm-50 leading-[1.1] mb-5">A quiet morning</h1>

      <div class="text-[13px] text-warm-200 leading-[1.7] space-y-3">
        <p>Started the day with coffee and that book I&rsquo;ve been meaning to finish. The rain outside makes everything feel softer &mdash; like the world is holding its breath with me.</p>
        <p>I&rsquo;m still anxious about the meeting today, but I&rsquo;m also noticing how much lighter I feel after journaling for the past week. Maybe Solace is onto something with the &ldquo;small consistent actions&rdquo; idea.</p>
        <p>Things I&rsquo;m grateful for right now:</p>
        <ul class="space-y-1.5 pl-2">
          <li>&mdash; The hum of the rain</li>
          <li>&mdash; This quiet hour before everyone wakes</li>
          <li>&mdash; The fact that I&rsquo;m learning to sit with feelings instead of running</li>
        </ul>
      </div>

      <!-- AI insight -->
      <div class="hero-card rounded-2xl p-4 mt-6 border border-sage-300/22" style="background:linear-gradient(135deg,rgba(155,196,176,0.14),rgba(107,143,255,0.06));">
        <div class="flex items-center gap-2 mb-2">
          <i data-lucide="sparkles" class="w-3.5 h-3.5 text-sage-300"></i>
          <span class="bracket-label text-sage-300">Solace noticed</span>
        </div>
        <p class="text-[11px] text-warm-200 leading-relaxed">
          This is the 4th morning entry mentioning gratitude. Your morning routine seems to be a stable anchor &mdash; worth protecting.
        </p>
      </div>

      <!-- Tags -->
      <div class="mt-4 flex flex-wrap gap-2">
        <span class="chip !bg-sage-300/12 !border-sage-300/30 !text-sage-300">#gratitude</span>
        <span class="chip !bg-sage-300/12 !border-sage-300/30 !text-sage-300">#morning</span>
      </div>

      <!-- Metadata -->
      <div class="mt-6 pt-4 border-t border-white/5 flex items-center gap-3 text-[10px] text-warm-500 font-mono">
        <span>142 words</span>
        <span class="opacity-40">&middot;</span>
        <span>HR <span class="text-warm-200">68</span> bpm</span>
        <span class="opacity-40">&middot;</span>
        <span>Rain 64&deg;</span>
      </div>
    </div>
  </div>
`;

// ------------------------------------------------------------------
// 17 - MINDFULNESS LIBRARY
// ------------------------------------------------------------------
const mindfulLibraryScreen = `
  ${statusBar2}
  <div class="bg-midnight-950 h-full relative">
    <div class="absolute top-0 left-0 right-0 h-80 opacity-40" style="background:radial-gradient(ellipse at 50% 0%,rgba(107,143,255,0.18),transparent 60%);"></div>

    <div class="relative px-6 pt-14 pb-32">
      <div class="flex items-center justify-between mb-2">
        <div>
          <p class="bracket-label text-warm-500">Mindfulness</p>
          <h1 class="font-display text-[30px] font-light text-warm-50 mt-0.5">Find your calm</h1>
        </div>
        <button class="w-10 h-10 rounded-full glass flex items-center justify-center">
          <i data-lucide="search" class="w-4 h-4"></i>
        </button>
      </div>

      <!-- Hero featured -->
      <div class="hero-card relative rounded-3xl overflow-hidden h-48 mb-5 mt-5"
           style="background:linear-gradient(135deg,#9BC4B0 0%,#8AA3FF 50%,#A89AE0 100%);">
        <div class="absolute inset-0 mesh-bg opacity-30"></div>
        <div class="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-warm-50/15 blur-2xl"></div>
        <div class="absolute inset-0 flex flex-col justify-end p-5">
          <span class="chip mb-2 w-fit !bg-white/20 !text-warm-50 !border-white/20">Featured &middot; <span class="font-mono">10 min</span></span>
          <p class="font-display text-[26px] font-light text-warm-50 leading-tight">Monday reset<br/><span class="italic">meditation</span></p>
          <p class="text-[11px] text-warm-50/80 mt-1">Start your week grounded and clear.</p>
        </div>
        <button class="absolute top-5 right-5 w-12 h-12 rounded-full bg-warm-50 text-midnight-950 flex items-center justify-center shadow-2xl">
          <i data-lucide="play" class="w-5 h-5 ml-0.5"></i>
        </button>
      </div>

      <!-- Categories -->
      <div class="flex gap-2 mb-5 scroll-x -mx-6 px-6">
        ${['For you','Quick','Sleep','Anxiety','Focus','Body scan','Loving-kindness'].map((c,i)=>`
          <button class="chip whitespace-nowrap ${i===0?'!bg-sage-300/15 !border-sage-300/40 !text-sage-300':''}">${c}</button>
        `).join('')}
      </div>

      <!-- Grid of sessions -->
      <div class="grid grid-cols-2 gap-3">
        ${[
          { title: '4-7-8 breath', time: '4 min', hue: '155,196,176', icon: 'wind' },
          { title: 'Body scan', time: '10 min', hue: '168,154,224', icon: 'user-round' },
          { title: 'Loving kindness', time: '12 min', hue: '244,167,126', icon: 'heart' },
          { title: 'Noting practice', time: '15 min', hue: '138,163,255', icon: 'feather' },
          { title: 'Sleep wind-down', time: '20 min', hue: '168,154,224', icon: 'moon' },
          { title: 'Quick reset', time: '2 min', hue: '244,167,126', icon: 'zap' },
        ].map(s => `
          <button class="glass rounded-2xl p-4 text-left flex flex-col gap-2 h-36 relative overflow-hidden">
            <div class="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-30" style="background:radial-gradient(circle,rgba(${s.hue},0.5),transparent 70%);filter:blur(8px);"></div>
            <div class="w-10 h-10 rounded-xl flex items-center justify-center relative" style="background:rgba(${s.hue},0.12);border:1px solid rgba(${s.hue},0.22);">
              <i data-lucide="${s.icon}" class="w-5 h-5" style="color:rgb(${s.hue});"></i>
            </div>
            <div class="mt-auto relative">
              <p class="text-[13px] font-medium text-warm-50 leading-tight">${s.title}</p>
              <p class="text-[10px] text-warm-500 mt-0.5 font-mono">${s.time}</p>
            </div>
          </button>
        `).join('')}
      </div>
    </div>
    ${tabBar2('home')}
  </div>
`;

// ------------------------------------------------------------------
// 18 - MINDFULNESS SESSION PLAYER
// ------------------------------------------------------------------
const mindfulPlayerScreen = `
  ${statusBar2}
  <div class="h-full relative" style="background:linear-gradient(180deg,#161D3D 0%,#0E1430 50%,#040818 100%);">
    <!-- Ambient mesh -->
    <div class="absolute inset-0">
      <div class="absolute top-20 left-10 w-72 h-72 breath-orb opacity-50"></div>
      <div class="absolute bottom-32 right-10 w-56 h-56 smoke opacity-60"></div>
    </div>

    <div class="relative z-10 px-6 pt-14 h-full flex flex-col">
      <div class="flex items-center justify-between mb-7">
        <button class="w-10 h-10 rounded-full glass flex items-center justify-center">
          <i data-lucide="chevron-down" class="w-4 h-4"></i>
        </button>
        <p class="bracket-label text-warm-400">Now playing</p>
        <button class="w-10 h-10 rounded-full glass flex items-center justify-center">
          <i data-lucide="more-horizontal" class="w-4 h-4"></i>
        </button>
      </div>

      <!-- Hero artwork -->
      <div class="flex justify-center mb-7">
        <div class="w-60 h-60 rounded-3xl relative overflow-hidden hero-card"
             style="background:linear-gradient(135deg,#9BC4B0 0%,#8AA3FF 50%,#A89AE0 100%);box-shadow:0 50px 100px -25px rgba(107,143,255,0.5);">
          <div class="absolute inset-0 mesh-bg opacity-30"></div>
          <div class="absolute top-4 right-4 w-24 h-24 rounded-full bg-warm-50/25 blur-2xl"></div>
          <div class="absolute bottom-8 left-8 w-28 h-28 rounded-full bg-warm-50/15 blur-xl"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-20 h-20 rounded-full bg-warm-50/15 backdrop-blur-md flex items-center justify-center">
              <i data-lucide="sparkles" class="w-8 h-8 text-warm-50"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Info -->
      <div class="text-center mb-6">
        <p class="bracket-label text-aurora-300 mb-1">Meditation &middot; Sarah Kim</p>
        <p class="font-display text-[24px] font-light text-warm-50">Monday reset</p>
        <p class="text-[11px] text-warm-400 mt-1">Start your week grounded</p>
      </div>

      <!-- Progress -->
      <div class="mb-5">
        <div class="h-1 rounded-full bg-white/8 mb-2 overflow-hidden">
          <div class="h-full rounded-full bg-gradient-to-r from-sage-300 to-aurora-300" style="width:34%"></div>
        </div>
        <div class="flex justify-between font-mono text-[10px] text-warm-500">
          <span class="text-warm-200">03:24</span>
          <span>-06:36</span>
        </div>
      </div>

      <!-- Controls -->
      <div class="flex items-center justify-center gap-5 mb-7">
        <button class="w-10 h-10 rounded-full flex items-center justify-center text-warm-400">
          <i data-lucide="shuffle" class="w-4 h-4"></i>
        </button>
        <button class="w-12 h-12 rounded-full flex items-center justify-center text-warm-200">
          <i data-lucide="skip-back" class="w-5 h-5"></i>
        </button>
        <button class="w-20 h-20 rounded-full btn-primary flex items-center justify-center">
          <i data-lucide="pause" class="w-8 h-8"></i>
        </button>
        <button class="w-12 h-12 rounded-full flex items-center justify-center text-warm-200">
          <i data-lucide="skip-forward" class="w-5 h-5"></i>
        </button>
        <button class="w-10 h-10 rounded-full flex items-center justify-center text-warm-400">
          <i data-lucide="repeat" class="w-4 h-4"></i>
        </button>
      </div>

      <!-- Bottom actions -->
      <div class="flex items-center justify-around">
        <button class="flex items-center gap-1.5 text-[10px] text-warm-400">
          <i data-lucide="volume-2" class="w-3.5 h-3.5"></i> Rain
        </button>
        <button class="flex items-center gap-1.5 text-[10px] text-warm-400">
          <i data-lucide="heart" class="w-3.5 h-3.5"></i>
        </button>
        <button class="flex items-center gap-1.5 text-[10px] text-warm-400">
          <i data-lucide="download" class="w-3.5 h-3.5"></i>
        </button>
        <button class="flex items-center gap-1.5 text-[10px] text-warm-400">
          <i data-lucide="share-2" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    </div>
  </div>
`;

// ------------------------------------------------------------------
// 19 - SESSION COMPLETE (celebration)
// ------------------------------------------------------------------
const sessionCompleteScreen = `
  ${statusBar2}
  <div class="h-full relative" style="background:radial-gradient(ellipse at top,#161D3D,#040818 70%);">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-20 left-10 w-72 h-72 breath-orb opacity-50"></div>
      <div class="absolute top-40 right-20 w-44 h-44 rounded-full" style="background:radial-gradient(circle,rgba(244,167,126,0.3),transparent 70%);filter:blur(20px);"></div>
    </div>

    <div class="relative z-10 px-6 pt-16 pb-8 h-full flex flex-col">
      <div class="flex justify-end">
        <button class="w-10 h-10 rounded-full glass flex items-center justify-center">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>

      <div class="flex-1 flex flex-col items-center justify-center text-center">
        <!-- Success ring -->
        <div class="relative mb-8">
          <div class="absolute -inset-6 rounded-full border border-sage-300/15"></div>
          <div class="absolute -inset-3 rounded-full border border-aurora-300/20"></div>
          <div class="w-32 h-32 rounded-full border-2 border-sage-300/25 flex items-center justify-center">
            <div class="w-24 h-24 rounded-full bg-gradient-to-br from-sage-300 via-aurora-300 to-sage-700 flex items-center justify-center shadow-aurora-glow">
              <i data-lucide="check" class="w-12 h-12 text-midnight-950" stroke-width="2.5"></i>
            </div>
          </div>
          <i data-lucide="sparkle" class="w-4 h-4 text-peach-300 absolute -top-2 right-0"></i>
          <i data-lucide="sparkle" class="w-3 h-3 text-aurora-300 absolute bottom-4 -left-2"></i>
          <i data-lucide="sparkle" class="w-2 h-2 text-lavender-300 absolute top-8 -right-3"></i>
        </div>

        <p class="bracket-label text-sage-300 mb-2">Well done</p>
        <h1 class="font-display text-[36px] font-light text-warm-50 leading-[1.05] mb-3">
          That&rsquo;s 10 minutes<br/>
          <span class="italic">for yourself.</span>
        </h1>
        <p class="text-[13px] text-warm-400 max-w-[280px] mx-auto mb-8">
          You completed the Monday reset meditation. Small actions compound.
        </p>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-3 w-full max-w-[320px] mb-8">
          ${[
            { v: '24', u: '', l: 'Total min' },
            { v: '23', u: 'd', l: 'Streak' },
            { v: '+2', u: '', l: 'Mood points' },
          ].map(s => `
            <div class="glass rounded-2xl p-3 text-center">
              <p class="font-display text-[22px] font-light text-warm-50">${s.v}<span class="text-[10px] text-warm-400 ml-0.5 font-mono">${s.u}</span></p>
              <p class="text-[9px] text-warm-500 mt-0.5 bracket-label">${s.l}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <button class="w-full py-4 rounded-2xl btn-primary font-medium text-sm mb-2">
        How do you feel now?
      </button>
      <button class="w-full py-3 text-[12px] text-warm-400">
        Back to library
      </button>
    </div>
  </div>
`;

// ------------------------------------------------------------------
// 20 - CBT THOUGHT RECORD
// ------------------------------------------------------------------
const cbtScreen = `
  ${statusBar2}
  <div class="bg-midnight-950 h-full relative">
    <div class="absolute top-0 left-0 right-0 h-80 opacity-40" style="background:radial-gradient(ellipse at 70% 0%,rgba(244,167,126,0.15),transparent 60%);"></div>

    <div class="relative px-6 pt-14 pb-32">
      ${miniHeader('Thought record', '<span class="text-[10px] text-warm-500 font-mono">2 of 5</span>')}

      <p class="bracket-label text-aurora-300 mb-2">Cognitive behavioral therapy</p>
      <h1 class="font-display text-[26px] font-light text-warm-50 leading-[1.1] mb-6">
        Let&rsquo;s examine<br/>
        <span class="italic">that thought.</span>
      </h1>

      <!-- Progress stepper -->
      <div class="flex gap-1.5 mb-6">
        ${[
          { done: true, label: 'Situation' },
          { active: true, label: 'Thought' },
          { label: 'Emotion' },
          { label: 'Reframe' },
          { label: 'Action' },
        ].map(s => `
          <div class="flex-1">
            <div class="h-1.5 rounded-full ${s.done?'bg-sage-300':s.active?'bg-peach-300':'bg-white/5'}"></div>
            <p class="text-[9px] mt-1.5 ${s.done?'text-sage-300':s.active?'text-peach-300':'text-warm-500'} bracket-label">${s.label}</p>
          </div>
        `).join('')}
      </div>

      <!-- Previous answer (context) -->
      <div class="glass rounded-2xl p-3 mb-3 flex items-start gap-3">
        <i data-lucide="rotate-ccw" class="w-3.5 h-3.5 text-warm-500 mt-0.5"></i>
        <div class="flex-1">
          <p class="bracket-label text-warm-500 mb-1">Situation</p>
          <p class="text-[12px] text-warm-200">I have a team meeting at 3 PM and I&rsquo;ll need to present an update.</p>
        </div>
      </div>

      <!-- Current question -->
      <div class="hero-card glass-strong rounded-2xl p-5 mb-3 border border-peach-300/22">
        <p class="bracket-label text-peach-300 mb-2">Now &rarr; what&rsquo;s the thought?</p>
        <p class="text-[13px] text-warm-50 mb-4">What was running through your mind?</p>
        <textarea class="w-full bg-white/4 rounded-xl p-3 text-[12px] text-warm-50 border border-white/8 outline-none h-24 resize-none placeholder-warm-500 leading-relaxed">I&rsquo;m going to mess this up and everyone will judge me for it.</textarea>

        <!-- Cognitive distortions -->
        <p class="bracket-label text-warm-500 mt-4 mb-2.5">Any of these feel familiar?</p>
        <div class="flex flex-wrap gap-1.5">
          ${[
            { label: 'Catastrophizing', on: true },
            { label: 'Mind reading', on: true },
            { label: 'All-or-nothing', on: false },
            { label: 'Personalization', on: false },
            { label: 'Should statements', on: false },
          ].map(d => `
            <button class="chip ${d.on?'!bg-peach-300/15 !border-peach-300/40 !text-peach-300':''}">${d.label}</button>
          `).join('')}
        </div>
      </div>

      <button class="w-full py-3.5 rounded-2xl btn-sage font-medium text-sm flex items-center justify-center gap-2">
        Next step <i data-lucide="arrow-right" class="w-4 h-4"></i>
      </button>
    </div>
  </div>
`;

// ------------------------------------------------------------------
// 21 - SLEEP LOG ENTRY
// ------------------------------------------------------------------
const sleepLogScreen = `
  ${statusBar2}
  <div class="h-full relative" style="background:linear-gradient(180deg,#161D3D 0%,#0E1430 35%,#040818 100%);">
    <div class="absolute inset-0 overflow-hidden">
      ${Array(24).fill(0).map((_,i)=>{
        const x = (i*149)%380;
        const y = (i*97)%280;
        const sz = i%4===0?1.5:0.5;
        return `<div class="absolute rounded-full bg-white/40" style="left:${x}px;top:${y}px;width:${sz}px;height:${sz}px;"></div>`;
      }).join('')}
      <div class="absolute top-10 right-12 w-48 h-48 smoke opacity-70"></div>
      <div class="absolute top-32 left-12 w-40 h-40 rounded-full" style="background:radial-gradient(circle,rgba(168,154,224,0.2),transparent 70%);filter:blur(20px);"></div>
    </div>

    <div class="relative z-10 px-6 pt-14 pb-8">
      ${miniHeader('Last night')}

      <div class="text-center mb-7">
        <i data-lucide="moon" class="w-9 h-9 text-lavender-300 mx-auto mb-3"></i>
        <p class="bracket-label text-lavender-300 mb-2">Log your sleep</p>
        <h1 class="font-display text-[30px] font-light text-warm-50 leading-[1.05]">
          How did you<br/>
          <span class="italic">rest?</span>
        </h1>
      </div>

      <!-- Time picker row -->
      <div class="grid grid-cols-2 gap-3 mb-5">
        <div class="hero-card glass-strong rounded-2xl p-4 text-center">
          <p class="bracket-label text-warm-500 mb-2"><i data-lucide="moon" class="w-2.5 h-2.5 inline mr-1"></i>Bedtime</p>
          <p class="font-mono text-[24px] text-warm-50 font-light">11:14<span class="text-[14px] text-warm-400 ml-0.5">PM</span></p>
        </div>
        <div class="hero-card glass-strong rounded-2xl p-4 text-center">
          <p class="bracket-label text-warm-500 mb-2"><i data-lucide="sun" class="w-2.5 h-2.5 inline mr-1"></i>Woke up</p>
          <p class="font-mono text-[24px] text-warm-50 font-light">7:02<span class="text-[14px] text-warm-400 ml-0.5">AM</span></p>
        </div>
      </div>

      <!-- Duration total -->
      <div class="text-center mb-6">
        <p class="font-display text-[52px] font-light text-warm-50 leading-none">7h <span class="font-mono">48m</span></p>
        <p class="text-[11px] text-sage-300 mt-2">Above your <span class="font-mono">7h</span> goal</p>
      </div>

      <!-- Quality slider -->
      <div class="glass rounded-2xl p-5 mb-4">
        <div class="flex justify-between items-center mb-3">
          <p class="text-[13px] text-warm-50 font-medium">Quality</p>
          <p class="text-[14px] font-mono text-warm-50">86%</p>
        </div>
        <div class="relative h-2 rounded-full bg-white/5 mb-2">
          <div class="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-lavender-300 to-sage-300" style="width:86%"></div>
          <div class="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-warm-50 border-2 border-lavender-300 shadow-lg" style="left:calc(86% - 10px);"></div>
        </div>
        <div class="flex justify-between text-[9px] text-warm-500">
          <span>Restless</span>
          <span>Deep &amp; restful</span>
        </div>
      </div>

      <!-- Tags -->
      <div class="mb-6">
        <p class="bracket-label text-warm-500 mb-2.5">How did you feel waking up?</p>
        <div class="flex flex-wrap gap-2">
          ${[
            { label: 'Rested', on: true },
            { label: 'Groggy' },
            { label: 'Anxious' },
            { label: 'Energized', on: true },
            { label: 'Sore' },
            { label: 'Refreshed' },
          ].map(t => `<button class="chip ${t.on?'!bg-lavender-300/15 !border-lavender-300/40 !text-lavender-300':''}">${t.label}</button>`).join('')}
        </div>
      </div>

      <button class="w-full py-4 rounded-2xl font-medium text-sm" style="background:linear-gradient(180deg,#A89AE0,#8B7CC8);color:#040818;box-shadow:0 8px 24px -8px rgba(168,154,224,0.5),inset 0 1px 0 0 rgba(255,255,255,0.25);">
        Save entry
      </button>
    </div>
  </div>
`;

// ------------------------------------------------------------------
// 22 - SLEEP SOUNDSCAPES
// ------------------------------------------------------------------
const soundscapesScreen = `
  ${statusBar2}
  <div class="h-full relative" style="background:linear-gradient(180deg,#161D3D 0%,#040818 100%);">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-10 left-10 w-44 h-44 rounded-full" style="background:radial-gradient(circle,rgba(168,154,224,0.2),transparent 70%);filter:blur(24px);"></div>
    </div>

    <div class="relative z-10 px-6 pt-14 pb-32">
      ${miniHeader('Sounds')}

      <p class="bracket-label text-lavender-300 mb-2">Ambient</p>
      <h1 class="font-display text-[30px] font-light text-warm-50 mb-6">Drift off gently</h1>

      <!-- Now playing mini -->
      <div class="hero-card glass-strong rounded-2xl p-4 mb-5 flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl relative overflow-hidden flex-shrink-0" style="background:linear-gradient(135deg,#A89AE0,#6B5BA8);">
          <div class="absolute inset-0 flex items-center justify-center gap-0.5">
            ${[8,14,10,16,12].map(h=>`<div class="w-0.5 rounded-full bg-warm-50" style="height:${h}px"></div>`).join('')}
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-[13px] font-medium text-warm-50">Gentle rain</p>
          <p class="text-[10px] text-warm-500 font-mono">Playing &middot; 24 min</p>
        </div>
        <button class="w-10 h-10 rounded-full bg-warm-50 text-midnight-950 flex items-center justify-center">
          <i data-lucide="pause" class="w-4 h-4"></i>
        </button>
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-2 gap-3">
        ${[
          { title: 'Gentle rain', duration: '∞', icon: 'cloud-rain', active: true, gradient: 'linear-gradient(135deg,#A89AE0,#6B5BA8)' },
          { title: 'Ocean waves', duration: '∞', icon: 'waves', gradient: 'linear-gradient(135deg,#9BC4B0,#5A8A78)' },
          { title: 'Forest night', duration: '60m', icon: 'trees', gradient: 'linear-gradient(135deg,#5A8A78,#2F5345)' },
          { title: 'White noise', duration: '∞', icon: 'radio', gradient: 'linear-gradient(135deg,#C7BEA9,#5A6478)' },
          { title: 'Crackling fire', duration: '45m', icon: 'flame', gradient: 'linear-gradient(135deg,#F4A77E,#B86A3E)' },
          { title: 'Tibetan bowl', duration: '20m', icon: 'circle-dot', gradient: 'linear-gradient(135deg,#A89AE0,#8B7CC8)' },
        ].map(s => `
          <button class="rounded-2xl p-4 text-left h-32 relative overflow-hidden ${s.active?'ring-2 ring-lavender-300 ring-offset-2 ring-offset-midnight-950':''}"
                  style="background:${s.gradient};box-shadow:0 8px 24px -8px rgba(0,0,0,0.5),inset 0 1px 0 0 rgba(255,255,255,0.15);">
            <div class="absolute inset-0" style="background:radial-gradient(circle at 70% 30%,rgba(255,255,255,0.15),transparent 60%);"></div>
            <i data-lucide="${s.icon}" class="w-6 h-6 text-warm-50/95 relative"></i>
            <div class="absolute bottom-4 left-4 right-4">
              <p class="text-[13px] font-medium text-warm-50">${s.title}</p>
              <p class="text-[10px] text-warm-50/70 mt-0.5 font-mono">${s.duration}</p>
            </div>
            ${s.active?`<i data-lucide="volume-2" class="w-4 h-4 text-warm-50 absolute top-4 right-4"></i>`:''}
          </button>
        `).join('')}
      </div>
    </div>
  </div>
`;

// ------------------------------------------------------------------
// 23 - NOTIFICATIONS INBOX
// ------------------------------------------------------------------
const notificationsScreen = `
  ${statusBar2}
  <div class="bg-midnight-950 h-full relative">
    <div class="absolute top-0 left-0 right-0 h-72 opacity-40" style="background:radial-gradient(ellipse at 50% 0%,rgba(107,143,255,0.18),transparent 60%);"></div>

    <div class="relative px-6 pt-14 pb-32">
      ${miniHeader('Notifications', '<button class="text-[10px] text-aurora-300 font-medium">Mark all read</button>')}

      <h1 class="font-display text-[30px] font-light text-warm-50 leading-tight">Inbox</h1>
      <p class="text-[13px] text-warm-400 mt-1 mb-6"><span class="text-peach-300 font-medium">3 new</span> &middot; this week</p>

      <!-- Filter pills -->
      <div class="flex gap-2 mb-5">
        ${['All','Insights','Reminders','Achievements'].map((f,i)=>`<button class="chip ${i===0?'!bg-sage-300/15 !border-sage-300/35 !text-sage-300':''}">${f}</button>`).join('')}
      </div>

      <!-- Today section -->
      <p class="bracket-label text-warm-500 mb-3">Today</p>
      <div class="space-y-2 mb-5">
        ${[
          { icon: 'sparkles', title: 'Your Solace Score went up', desc: '+5 points since last week. Keep going!', time: '3m', hue: '155,196,176', unread: true },
          { icon: 'trending-up', title: 'Streak milestone: 23 days', desc: 'This is your longest streak yet.', time: '2h', hue: '244,167,126', unread: true },
        ].map(n => `
          <div class="glass rounded-2xl p-4 flex items-start gap-3 relative ${n.unread?'':'opacity-65'}">
            ${n.unread?'<div class="absolute top-4 right-4 w-2 h-2 rounded-full bg-peach-300"></div>':''}
            <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style="background:rgba(${n.hue},0.12);border:1px solid rgba(${n.hue},0.22);">
              <i data-lucide="${n.icon}" class="w-4 h-4" style="color:rgb(${n.hue});"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[12px] font-medium text-warm-50">${n.title}</p>
              <p class="text-[10px] text-warm-500 mt-0.5 leading-relaxed">${n.desc}</p>
              <p class="text-[9px] text-warm-500 mt-1.5 font-mono">${n.time} ago</p>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Yesterday -->
      <p class="bracket-label text-warm-500 mb-3">Yesterday</p>
      <div class="space-y-2 mb-5">
        ${[
          { icon: 'bell', title: 'Evening check-in reminder', desc: "How&rsquo;s your day winding down?", time: '6:30 PM', hue: '168,154,224' },
          { icon: 'book-open', title: 'Your weekly summary is ready', desc: 'Review your mood patterns for the week', time: '9:00 AM', hue: '155,196,176' },
        ].map(n => `
          <div class="glass rounded-2xl p-4 flex items-start gap-3 opacity-65">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style="background:rgba(${n.hue},0.12);border:1px solid rgba(${n.hue},0.22);">
              <i data-lucide="${n.icon}" class="w-4 h-4" style="color:rgb(${n.hue});"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[12px] font-medium text-warm-50">${n.title}</p>
              <p class="text-[10px] text-warm-500 mt-0.5">${n.desc}</p>
              <p class="text-[9px] text-warm-500 mt-1.5 font-mono">${n.time}</p>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Earlier -->
      <p class="bracket-label text-warm-500 mb-3">Earlier this week</p>
      <div class="space-y-2">
        <div class="glass rounded-2xl p-4 flex items-start gap-3 opacity-65">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style="background:rgba(244,167,126,0.12);border:1px solid rgba(244,167,126,0.22);">
            <i data-lucide="gift" class="w-4 h-4 text-peach-300"></i>
          </div>
          <div class="flex-1">
            <p class="text-[12px] font-medium text-warm-50">New soundscape unlocked</p>
            <p class="text-[10px] text-warm-500 mt-0.5">&ldquo;Tibetan singing bowl&rdquo; is now available</p>
            <p class="text-[9px] text-warm-500 mt-1.5 font-mono">3 days ago</p>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

// ------------------------------------------------------------------
// 24 - SEARCH
// ------------------------------------------------------------------
const searchScreen = `
  ${statusBar2}
  <div class="bg-midnight-950 h-full relative">
    <div class="px-6 pt-14 pb-8">
      <!-- Search bar -->
      <div class="flex items-center gap-3 mb-6">
        <button class="text-warm-400">
          <i data-lucide="arrow-left" class="w-4 h-4"></i>
        </button>
        <div class="glass-strong rounded-full flex items-center gap-3 flex-1 px-4 py-3 border border-aurora-300/20">
          <i data-lucide="search" class="w-4 h-4 text-aurora-300"></i>
          <input class="bg-transparent outline-none flex-1 text-[13px] text-warm-50 placeholder-warm-500" placeholder="Search everything&hellip;" value="anxiety"/>
          <button class="w-5 h-5 rounded-full bg-white/8 flex items-center justify-center"><i data-lucide="x" class="w-3 h-3 text-warm-400"></i></button>
        </div>
      </div>

      <!-- Live results header -->
      <p class="bracket-label text-warm-500 mb-3"><span class="font-mono text-warm-200">24</span> results for &ldquo;anxiety&rdquo;</p>

      <!-- Categories tabs -->
      <div class="flex gap-2 mb-5 scroll-x -mx-6 px-6">
        ${[
          { l: 'All', n: 24, active: true },
          { l: 'Chats', n: 8 },
          { l: 'Journal', n: 5 },
          { l: 'Practices', n: 7 },
          { l: 'Articles', n: 4 },
        ].map(t => `<button class="chip whitespace-nowrap ${t.active?'!bg-sage-300/15 !border-sage-300/35 !text-sage-300':''}">${t.l} <span class="font-mono opacity-70">${t.n}</span></button>`).join('')}
      </div>

      <!-- Sections -->
      <div class="space-y-5">
        <!-- Practices section -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <p class="bracket-label text-warm-500">Practices</p>
            <button class="text-[10px] text-aurora-300 font-medium">All 7</button>
          </div>
          <div class="space-y-2">
            ${[
              { icon: 'wind', title: '4-7-8 breathing', desc: 'Calms anxiety in 4 min', hue: '155,196,176' },
              { icon: 'user-round', title: 'Body scan for anxious minds', desc: '10 min guided meditation', hue: '168,154,224' },
            ].map(r => `
              <button class="w-full glass rounded-2xl p-3 flex items-center gap-3 text-left">
                <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style="background:rgba(${r.hue},0.12);border:1px solid rgba(${r.hue},0.22);">
                  <i data-lucide="${r.icon}" class="w-4 h-4" style="color:rgb(${r.hue});"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-[12px] font-medium text-warm-50">
                    ${r.title.replace(/anxi/i, '<mark class="bg-sage-300/30 text-sage-300 px-0.5 rounded">anxi</mark>')}
                  </p>
                  <p class="text-[10px] text-warm-500 mt-0.5">${r.desc}</p>
                </div>
                <i data-lucide="chevron-right" class="w-3.5 h-3.5 text-warm-500"></i>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Journal -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <p class="bracket-label text-warm-500">Journal</p>
            <button class="text-[10px] text-aurora-300 font-medium">All 5</button>
          </div>
          <div class="space-y-2">
            <button class="w-full glass rounded-2xl p-3 text-left relative overflow-hidden">
              <div class="absolute top-0 left-0 bottom-0 w-1 rounded-r-full bg-lavender-300/60"></div>
              <div class="flex items-center gap-2 mb-1 pl-2">
                <span class="bracket-label text-warm-500">Apr 3</span>
                <span class="opacity-30 text-[9px]">&middot;</span>
                <span class="text-[9px] text-lavender-300 font-medium">Stressed</span>
              </div>
              <p class="text-[12px] font-medium text-warm-50 pl-2">Handling work <mark class="bg-sage-300/30 text-sage-300 px-0.5 rounded">anxi</mark>ety</p>
              <p class="text-[10px] text-warm-500 mt-0.5 line-clamp-1 pl-2">I&rsquo;ve been feeling more on-edge than usual about the new project&hellip;</p>
            </button>
          </div>
        </div>

        <!-- Articles -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <p class="bracket-label text-warm-500">Articles</p>
            <button class="text-[10px] text-aurora-300 font-medium">All 4</button>
          </div>
          <div class="space-y-2">
            <button class="w-full glass rounded-2xl p-3 flex items-center gap-3 text-left">
              <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style="background:rgba(244,167,126,0.12);border:1px solid rgba(244,167,126,0.22);">
                <i data-lucide="book-open" class="w-4 h-4 text-peach-300"></i>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[12px] font-medium text-warm-50">Understanding your <mark class="bg-sage-300/30 text-sage-300 px-0.5 rounded">anxi</mark>ety triggers</p>
                <p class="text-[10px] text-warm-500 font-mono mt-0.5">6 min read</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

// ------------------------------------------------------------------
// 25 - PAYWALL
// ------------------------------------------------------------------
const paywallScreen = `
  ${statusBar2}
  <div class="h-full relative" style="background:radial-gradient(ellipse at top,#161D3D,#040818 60%);">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-0 left-0 right-0 h-72 mesh-bg opacity-40"></div>
      <div class="absolute top-20 right-10 w-44 h-44 smoke opacity-50"></div>
    </div>

    <div class="relative z-10 px-6 pt-14 pb-32">
      <div class="flex justify-end mb-4">
        <button class="w-10 h-10 rounded-full glass flex items-center justify-center">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>

      <div class="text-center mb-7">
        <div class="inline-block mb-4 relative">
          <div class="absolute -inset-2 rounded-3xl" style="background:radial-gradient(circle,rgba(244,167,126,0.4),transparent 70%);filter:blur(12px);"></div>
          <div class="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-peach-300 via-aurora-300 to-lavender-300 flex items-center justify-center shadow-aurora-glow">
            <i data-lucide="sparkles" class="w-8 h-8 text-midnight-950"></i>
          </div>
        </div>
        <p class="bracket-label text-aurora-300 mb-2">Solace Plus</p>
        <h1 class="font-display text-[30px] font-light text-warm-50 leading-[1.05] mb-3">
          Unlock the full<br/>
          <span class="italic">experience.</span>
        </h1>
        <p class="text-[13px] text-warm-400 max-w-[280px] mx-auto">Deeper insights, unlimited therapy, all practices &mdash; free for 7 days.</p>
      </div>

      <!-- Features -->
      <div class="hero-card glass-strong rounded-3xl p-5 mb-5">
        <div class="space-y-3.5">
          ${[
            { icon: 'infinity', title: 'Unlimited AI therapy', desc: 'No session caps or daily limits' },
            { icon: 'library', title: 'Full practice library', desc: '200+ guided meditations & exercises' },
            { icon: 'trending-up', title: 'Deep insights', desc: 'Correlations across mood, sleep, and stress' },
            { icon: 'moon', title: 'All soundscapes', desc: 'Every ambient sound in the collection' },
            { icon: 'download', title: 'Offline mode', desc: 'Listen and journal without connection' },
          ].map(f => `
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-sage-300/12 border border-sage-300/22 flex items-center justify-center flex-shrink-0 mt-0.5">
                <i data-lucide="${f.icon}" class="w-4 h-4 text-sage-300"></i>
              </div>
              <div class="flex-1">
                <p class="text-[12px] font-medium text-warm-50">${f.title}</p>
                <p class="text-[10px] text-warm-500 mt-0.5">${f.desc}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Plans -->
      <div class="space-y-2.5 mb-5">
        <button class="w-full hero-card rounded-2xl p-4 text-left flex items-center gap-4 border-2 border-sage-300" style="background:rgba(155,196,176,0.12);">
          <div class="w-10 h-10 rounded-full bg-sage-300 text-midnight-950 flex items-center justify-center flex-shrink-0">
            <i data-lucide="check" class="w-5 h-5" stroke-width="3"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-0.5">
              <p class="text-[13px] font-medium text-warm-50">Annual</p>
              <span class="px-2 py-0.5 rounded-full bg-peach-300 text-midnight-950 text-[9px] font-bold">SAVE 60%</span>
            </div>
            <p class="text-[10px] text-warm-500 font-mono">$59.99/year &middot; $4.99/mo</p>
          </div>
          <div class="text-right">
            <p class="font-display text-[20px] text-warm-50">$4.99</p>
            <p class="text-[9px] text-warm-500 font-mono">/mo</p>
          </div>
        </button>

        <button class="w-full glass rounded-2xl p-4 text-left flex items-center gap-4">
          <div class="w-10 h-10 rounded-full border-2 border-warm-500 flex-shrink-0"></div>
          <div class="flex-1">
            <p class="text-[13px] font-medium text-warm-50">Monthly</p>
            <p class="text-[10px] text-warm-500">Cancel anytime</p>
          </div>
          <div class="text-right">
            <p class="font-display text-[20px] text-warm-50">$12.99</p>
            <p class="text-[9px] text-warm-500 font-mono">/mo</p>
          </div>
        </button>
      </div>

      <p class="text-[10px] text-warm-500 text-center mb-4 leading-relaxed">
        7 days free, then $59.99/year. Cancel anytime in Settings.
      </p>
    </div>

    <div class="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-gradient-to-t from-midnight-950 to-transparent">
      <button class="w-full py-4 rounded-2xl btn-peach font-medium text-sm flex items-center justify-center gap-2">
        Start 7-day free trial <i data-lucide="arrow-right" class="w-4 h-4"></i>
      </button>
      <div class="flex justify-center gap-3 mt-4 text-[9px] text-warm-500">
        <a>Terms</a> <span class="opacity-40">&middot;</span> <a>Privacy</a> <span class="opacity-40">&middot;</span> <a>Restore purchase</a>
      </div>
    </div>
  </div>
`;

// ------------------------------------------------------------------
// 26 - ACCOUNT SETTINGS
// ------------------------------------------------------------------
const accountSettingsScreen = `
  ${statusBar2}
  <div class="bg-midnight-950 h-full relative">
    <div class="absolute top-0 left-0 right-0 h-72 opacity-40" style="background:radial-gradient(ellipse at 50% 0%,rgba(107,143,255,0.15),transparent 60%);"></div>

    <div class="relative px-6 pt-14 pb-10">
      ${miniHeader('Settings')}
      <h1 class="font-display text-[30px] font-light text-warm-50 mb-5 leading-tight">Account</h1>

      <!-- Account card -->
      <div class="hero-card glass-strong rounded-2xl p-4 flex items-center gap-3 mb-5">
        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-sage-300 via-aurora-300 to-peach-300 p-0.5 shadow-aurora-glow">
          <div class="w-full h-full rounded-full bg-midnight-800 flex items-center justify-center">
            <span class="font-display text-lg text-warm-50">R</span>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-[13px] font-medium text-warm-50">Rayyan Ahmed</p>
          <p class="text-[10px] text-warm-500 font-mono">rayyan@solace.ai</p>
        </div>
        <span class="chip !bg-sage-300/12 !text-sage-300 !border-sage-300/22">Plus</span>
      </div>

      <!-- Sections -->
      ${[
        {
          label: 'Account',
          items: [
            { icon: 'user', label: 'Personal information' },
            { icon: 'mail', label: 'Email address', value: 'rayyan@&hellip;' },
            { icon: 'lock', label: 'Change password' },
            { icon: 'credit-card', label: 'Subscription', value: 'Plus Annual' },
          ]
        },
        {
          label: 'Preferences',
          items: [
            { icon: 'bell', label: 'Notifications', value: 'On' },
            { icon: 'moon', label: 'Appearance', value: 'Dark' },
            { icon: 'globe', label: 'Language', value: 'English' },
            { icon: 'clock', label: 'Daily check-in', value: '9:00 AM' },
          ]
        },
        {
          label: 'Privacy & safety',
          items: [
            { icon: 'shield', label: 'Privacy & security' },
            { icon: 'scan-face', label: 'Face ID', toggle: true },
            { icon: 'download', label: 'Export my data' },
            { icon: 'trash-2', label: 'Delete account', danger: true },
          ]
        },
      ].map(sec => `
        <div class="mb-5">
          <p class="bracket-label text-warm-500 mb-2 px-2">${sec.label}</p>
          <div class="glass rounded-2xl divide-y divide-white/5">
            ${sec.items.map(item => `
              <button class="w-full px-4 py-3.5 flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-white/4 flex items-center justify-center">
                  <i data-lucide="${item.icon}" class="w-4 h-4 ${item.danger?'text-peach-300':'text-sage-300'}"></i>
                </div>
                <span class="text-[13px] ${item.danger?'text-peach-300':'text-warm-50'} flex-1 text-left">${item.label}</span>
                ${item.value ? `<span class="text-[10px] text-warm-500 font-mono">${item.value}</span>` : ''}
                ${item.toggle ? `
                  <div class="w-9 h-5 rounded-full bg-sage-300 relative">
                    <div class="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-warm-50"></div>
                  </div>
                ` : ''}
                ${!item.toggle && !item.danger ? `<i data-lucide="chevron-right" class="w-3.5 h-3.5 text-warm-500"></i>` : ''}
              </button>
            `).join('')}
          </div>
        </div>
      `).join('')}

      <button class="w-full glass rounded-2xl p-3.5 flex items-center justify-center gap-2 text-[13px] text-peach-300 mt-2">
        <i data-lucide="log-out" class="w-4 h-4"></i> Sign out
      </button>

      <p class="text-[9px] text-warm-500 text-center mt-6 font-mono">Solace v3.0.0 &middot; Made with care</p>
    </div>
  </div>
`;

// ------------------------------------------------------------------
// 27 - LOADING / SKELETON STATE
// ------------------------------------------------------------------
const loadingScreen = `
  ${statusBar2}
  <style>
    @keyframes shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
    .skel { background: linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 100%); background-size: 800px 100%; animation: shimmer 1.6s linear infinite; border-radius: 8px; }
  </style>
  <div class="bg-midnight-950 h-full relative">
    <div class="absolute top-0 left-0 right-0 h-72 opacity-30" style="background:radial-gradient(ellipse at 50% 0%,rgba(107,143,255,0.15),transparent 60%);"></div>

    <div class="relative px-6 pt-14 pb-32">
      <div class="flex items-center justify-between mb-3">
        <div class="skel h-3 w-32"></div>
        <div class="skel w-10 h-10 rounded-full"></div>
      </div>
      <div class="skel h-9 w-48 mb-2"></div>
      <div class="skel h-9 w-40 mb-6"></div>

      <div class="glass rounded-3xl p-5 mb-4">
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1 space-y-2.5">
            <div class="skel h-3 w-20"></div>
            <div class="skel h-9 w-28"></div>
            <div class="skel h-2 w-24"></div>
          </div>
          <div class="skel w-20 h-20 rounded-full"></div>
        </div>
        <div class="skel h-2 w-full mb-1.5"></div>
        <div class="skel h-2 w-3/4"></div>
      </div>

      <div class="grid grid-cols-2 gap-3 mb-4">
        ${Array(4).fill(0).map(() => `
          <div class="glass rounded-2xl p-4">
            <div class="skel w-4 h-4 rounded-full mb-3"></div>
            <div class="skel h-7 w-16 mb-2"></div>
            <div class="skel h-1 w-full"></div>
          </div>
        `).join('')}
      </div>

      <div class="glass rounded-3xl p-5">
        <div class="flex items-center gap-3">
          <div class="skel w-12 h-12 rounded-2xl"></div>
          <div class="flex-1 space-y-2">
            <div class="skel h-3 w-3/4"></div>
            <div class="skel h-2 w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Subtle breathing orb loader center -->
      <div class="flex justify-center mt-12">
        <div class="w-16 h-16 relative">
          <div class="absolute inset-0 rounded-full border border-sage-300/15"></div>
          <div class="absolute inset-2 rounded-full border border-aurora-300/25"></div>
          <div class="absolute inset-4 rounded-full breath-orb"></div>
        </div>
      </div>
      <p class="text-center bracket-label text-warm-500 mt-4">Preparing your space&hellip;</p>
    </div>
  </div>
`;

// ------------------------------------------------------------------
// 28 - EMPTY STATE (Journal first-time)
// ------------------------------------------------------------------
const emptyStateScreen = `
  ${statusBar2}
  <div class="bg-midnight-950 h-full relative">
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 breath-orb opacity-50"></div>

    <div class="relative px-6 pt-14 h-full flex flex-col">
      ${miniHeader('Journal')}

      <div class="flex-1 flex flex-col items-center justify-center text-center px-4">
        <!-- Illustration with orb -->
        <div class="relative mb-8">
          <div class="w-44 h-44 rounded-full border border-aurora-300/12 relative flex items-center justify-center">
            <div class="absolute inset-6 rounded-full border border-sage-300/18"></div>
            <div class="absolute inset-12 rounded-full border border-sage-300/25"></div>
            <div class="absolute inset-16 rounded-full breath-orb"></div>
            <i data-lucide="book-open" class="w-12 h-12 text-sage-300 relative z-10"></i>
          </div>
          <i data-lucide="sparkle" class="w-3 h-3 text-peach-300 absolute top-4 -right-2"></i>
          <i data-lucide="sparkle" class="w-2 h-2 text-aurora-300 absolute bottom-8 -left-3"></i>
        </div>

        <p class="bracket-label text-aurora-300 mb-2">Start somewhere</p>
        <h1 class="font-display text-[30px] font-light text-warm-50 leading-[1.05] mb-3">
          Your story<br/>
          <span class="italic">begins here.</span>
        </h1>
        <p class="text-[13px] text-warm-400 max-w-[260px] mx-auto mb-7">
          No need for perfect words. Write one sentence &mdash; we&rsquo;ll take it from there.
        </p>

        <!-- Suggested prompts -->
        <div class="w-full space-y-2 mb-7">
          ${[
            'How are you feeling right now?',
            "What&rsquo;s one small win from today?",
            "What&rsquo;s weighing on your mind?",
          ].map(p => `
            <button class="w-full glass rounded-2xl p-3 flex items-center gap-3 text-left">
              <div class="w-7 h-7 rounded-lg bg-sage-300/10 border border-sage-300/20 flex items-center justify-center flex-shrink-0">
                <i data-lucide="pen-line" class="w-3.5 h-3.5 text-sage-300"></i>
              </div>
              <p class="text-[12px] text-warm-200 flex-1">${p}</p>
              <i data-lucide="chevron-right" class="w-3.5 h-3.5 text-warm-500"></i>
            </button>
          `).join('')}
        </div>

        <button class="w-full py-4 rounded-2xl btn-peach font-medium text-sm flex items-center justify-center gap-2">
          <i data-lucide="pen-line" class="w-4 h-4"></i> Write freely
        </button>
      </div>
    </div>
  </div>
`;

// ------------------------------------------------------------------
// 29 - NETWORK / OFFLINE ERROR
// ------------------------------------------------------------------
const offlineScreen = `
  ${statusBar2}
  <div class="bg-midnight-950 h-full relative">
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full opacity-30" style="background:radial-gradient(circle,rgba(139,149,168,0.25),transparent 70%);filter:blur(28px);"></div>

    <div class="relative px-6 pt-14 h-full flex flex-col">
      <div class="flex justify-between items-center mb-4">
        <div class="w-10"></div>
        <p class="bracket-label text-warm-500">Connection</p>
        <div class="w-10"></div>
      </div>

      <div class="flex-1 flex flex-col items-center justify-center text-center px-4">
        <!-- Illustration: broken connection -->
        <div class="relative mb-8">
          <div class="w-32 h-32 rounded-full border-2 border-warm-500/20 border-dashed flex items-center justify-center">
            <i data-lucide="wifi-off" class="w-14 h-14 text-warm-400"></i>
          </div>
        </div>

        <p class="bracket-label text-warm-500 mb-2">No connection</p>
        <h1 class="font-display text-[30px] font-light text-warm-50 leading-[1.05] mb-3">
          You&rsquo;re<br/>
          <span class="italic">offline.</span>
        </h1>
        <p class="text-[13px] text-warm-400 max-w-[260px] mx-auto mb-8">
          No worries &mdash; your journal and recent sessions are saved locally. They&rsquo;ll sync when you&rsquo;re back.
        </p>

        <button class="w-full max-w-xs py-4 rounded-2xl btn-primary font-medium text-sm flex items-center justify-center gap-2 mb-3">
          <i data-lucide="refresh-cw" class="w-4 h-4"></i> Try again
        </button>
        <button class="text-[13px] text-warm-400 py-3">
          Continue offline
        </button>

        <!-- Available offline -->
        <div class="mt-10 glass rounded-2xl p-4 w-full max-w-xs">
          <p class="bracket-label text-warm-500 mb-2.5 text-center">Still available offline</p>
          <div class="flex gap-2 flex-wrap justify-center">
            <span class="chip"><i data-lucide="pen-line" class="w-3 h-3 text-sage-300"></i>Journal</span>
            <span class="chip"><i data-lucide="wind" class="w-3 h-3 text-sage-300"></i>Breathing</span>
            <span class="chip"><i data-lucide="moon" class="w-3 h-3 text-lavender-300"></i>Sounds</span>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

// ------------------------------------------------------------------
// 30 - 404 / NOT FOUND
// ------------------------------------------------------------------
const notFoundScreen = `
  ${statusBar2}
  <div class="bg-midnight-950 h-full relative">
    <div class="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 breath-orb opacity-40"></div>

    <div class="relative px-6 pt-14 h-full flex flex-col">
      <div class="flex justify-start">
        <button class="w-10 h-10 rounded-full glass flex items-center justify-center">
          <i data-lucide="arrow-left" class="w-4 h-4"></i>
        </button>
      </div>

      <div class="flex-1 flex flex-col items-center justify-center text-center">
        <div class="relative mb-6">
          <p class="font-display text-[140px] font-light text-warm-50/8 leading-none tracking-tighter">404</p>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-20 h-20 rounded-full breath-orb"></div>
          </div>
        </div>

        <p class="bracket-label text-aurora-300 mb-2">This page doesn&rsquo;t exist</p>
        <h1 class="font-display text-[26px] font-light text-warm-50 leading-[1.1] mb-3">
          Let&rsquo;s get you<br/>
          <span class="italic">back to calm.</span>
        </h1>
        <p class="text-[13px] text-warm-400 max-w-[260px] mx-auto mb-8">
          The page you&rsquo;re looking for has moved, or perhaps it was never here.
        </p>

        <button class="w-full max-w-xs py-4 rounded-2xl btn-sage font-medium text-sm flex items-center justify-center gap-2">
          <i data-lucide="home" class="w-4 h-4"></i> Back home
        </button>
      </div>
    </div>
  </div>
`;

// ------------------------------------------------------------------
// MOUNT
// ------------------------------------------------------------------
const mountsV2 = {
  // New brand moments
  'v2-splash': ['Splash', splashScreen],
  'v2-quote': ['Quote splash', quoteSplashScreen],

  // Onboarding additions
  'v2-goals': ['Goals picker', goalsScreen],
  'v2-biometric': ['Face ID primer', biometricScreen],
  'v2-notif-primer': ['Notifications primer', notifPrimerScreen],

  // Assessment
  'v2-assessment-intro': ['Assessment intro', assessmentIntroScreen],
  'v2-assessment-results': ['Assessment results', assessmentResultsScreen],

  // Main
  'v2-home': ['Home v2 (with check-in)', homeV2Screen],
  'v2-checkin': ['Daily check-in', checkinScreen],

  // Mood
  'v2-mood-calendar': ['Mood calendar', moodCalendarScreen],
  'v2-mood-insights': ['Mood insights', moodInsightsScreen],

  // Chat
  'v2-chat-list': ['Conversations list', chatListScreen],
  'v2-voice': ['Voice session', voiceScreen],
  'v2-session-summary': ['Session summary', sessionSummaryScreen],

  // Journal
  'v2-journal-composer': ['Journal composer', journalComposerScreen],
  'v2-journal-detail': ['Journal entry detail', journalDetailScreen],

  // Mindfulness
  'v2-mindful-library': ['Mindfulness library', mindfulLibraryScreen],
  'v2-mindful-player': ['Meditation player', mindfulPlayerScreen],
  'v2-session-complete': ['Session complete', sessionCompleteScreen],

  // CBT
  'v2-cbt': ['CBT thought record', cbtScreen],

  // Sleep
  'v2-sleep-log': ['Sleep log entry', sleepLogScreen],
  'v2-soundscapes': ['Soundscapes', soundscapesScreen],

  // System screens
  'v2-notifications': ['Notifications inbox', notificationsScreen],
  'v2-search': ['Search', searchScreen],

  // Commerce
  'v2-paywall': ['Paywall', paywallScreen],

  // Settings
  'v2-account-settings': ['Account settings', accountSettingsScreen],

  // States
  'v2-loading': ['Loading skeleton', loadingScreen],
  'v2-empty': ['Empty state', emptyStateScreen],
  'v2-offline': ['Offline state', offlineScreen],
  'v2-404': ['404 not found', notFoundScreen],
};

Object.entries(mountsV2).forEach(([id, [label, content]]) => {
  const el = document.getElementById(id);
  if (el) el.innerHTML = phone2(label, content);
});
