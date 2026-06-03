module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: { 50:'#f5f0ff',100:'#ede0ff',200:'#d8c0ff',300:'#be93ff',400:'#a855f7',500:'#9333ea',600:'#7e22ce',700:'#6b21a8',800:'#3b0764',900:'#1a0030',950:'#0d0018' },
        ember:{ 400:'#fb923c',500:'#f97316',600:'#ea580c' },
        aqua: { 400:'#22d3ee',500:'#06b6d4',600:'#0891b2' },
      },
      fontFamily: { display:['var(--font-display)'], mono:['var(--font-mono)'] },
      animation: {
        'pulse-slow':'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'glow':'glow 2s ease-in-out infinite alternate',
        'float':'float 3s ease-in-out infinite',
      },
      keyframes: {
        glow: { '0%':{ boxShadow:'0 0 5px #a855f7' }, '100%':{ boxShadow:'0 0 20px #a855f7,0 0 40px #7e22ce' } },
        float: { '0%,100%':{ transform:'translateY(0)' }, '50%':{ transform:'translateY(-6px)' } },
      },
    },
  },
  plugins: [],
};
