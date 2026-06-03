@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-display: 'Exo 2', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}

* { -webkit-tap-highlight-color: transparent; }

body {
  @apply bg-void-950 text-white font-sans;
  background-image: radial-gradient(ellipse at top, #1a0030 0%, #0d0018 60%);
  min-height: 100dvh;
}

/* Scrollbar */
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { @apply bg-void-900; }
::-webkit-scrollbar-thumb { @apply bg-void-600 rounded-full; }

/* Glass card */
.glass {
  @apply bg-void-900/60 backdrop-blur-md border border-void-700/50 rounded-2xl;
}
.glass-sm {
  @apply bg-void-900/40 backdrop-blur-sm border border-void-700/30 rounded-xl;
}

/* Void glow */
.void-glow { box-shadow: 0 0 20px rgba(168,85,247,0.3), 0 0 40px rgba(126,34,206,0.15); }
.void-glow-sm { box-shadow: 0 0 10px rgba(168,85,247,0.25); }

/* Tier badges */
.tier-sp { @apply bg-pink-500/20 text-pink-400 border-pink-500/40; }
.tier-s  { @apply bg-yellow-500/20 text-yellow-400 border-yellow-500/40; }
.tier-a  { @apply bg-green-500/20 text-green-400 border-green-500/40; }
.tier-b  { @apply bg-blue-500/20 text-blue-400 border-blue-500/40; }
.tier-c  { @apply bg-gray-500/20 text-gray-400 border-gray-500/40; }
.tier-d  { @apply bg-red-500/20 text-red-400 border-red-500/40; }

/* Touch targets */
.touch-target { @apply min-h-[44px] min-w-[44px]; }

/* Stat bar */
.stat-bar-track { @apply h-1.5 bg-void-800 rounded-full overflow-hidden; }
.stat-bar-fill  { @apply h-full rounded-full transition-all duration-500; }

/* Animations */
@keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
.shimmer { animation: shimmer 1.5s infinite; background: linear-gradient(90deg,transparent,rgba(168,85,247,0.1),transparent); }

/* Safe area for iPhone */
.safe-bottom { padding-bottom: env(safe-area-inset-bottom, 0px); }
.safe-top    { padding-top: env(safe-area-inset-top, 0px); }
