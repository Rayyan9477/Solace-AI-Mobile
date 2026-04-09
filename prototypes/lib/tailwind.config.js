// Tailwind CDN runtime config — injected from index.html before CDN loads
window.tailwind = window.tailwind || {};
window.tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
      colors: {
        midnight: {
          950: '#040818', 900: '#070C20', 800: '#0E1430',
          700: '#161D3D', 600: '#202A55', 500: '#2C3870',
        },
        ink: { 950: '#040818', 900: '#070C20', 800: '#0E1430', 700: '#161D3D', 600: '#202A55' },
        aurora: { 100: '#D6E0FF', 300: '#8AA3FF', 500: '#6B8FFF', 700: '#4A6FE5' },
        sage: { 50: '#EEF5F1', 100: '#D8EADF', 300: '#9BC4B0', 500: '#7AAA94', 700: '#5A8A78', 900: '#2F5345' },
        peach: { 100: '#FCE3D4', 300: '#F4A77E', 500: '#E88B5A', 700: '#B86A3E' },
        lavender: { 100: '#E0DAF3', 300: '#A89AE0', 500: '#8B7CC8', 700: '#6B5BA8' },
        warm: { 50: '#F5F1EA', 100: '#EAE3D5', 200: '#C7BEA9', 400: '#8B95A8', 500: '#5A6478', 700: '#3A4255' },
        mist: '#BFCFE8',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0,0,0,0.4), inset 0 1px 0 0 rgba(255,255,255,0.06)',
        'sage-glow': '0 0 40px -8px rgba(155,196,176,0.45)',
        'peach-glow': '0 8px 24px -8px rgba(244,167,126,0.55)',
        'aurora-glow': '0 0 60px -10px rgba(107,143,255,0.4)',
        'cosmic': '0 30px 80px -30px rgba(74,111,229,0.25), 0 8px 32px 0 rgba(0,0,0,0.5), inset 0 1px 0 0 rgba(255,255,255,0.07)',
      },
    },
  },
};
