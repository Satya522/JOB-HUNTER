import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        'bg-void': '#00020f',
        'bg-deep': '#030518',
        'bg-surface': 'rgba(8, 10, 40, 0.85)',
        'bg-glass': 'rgba(255, 255, 255, 0.03)',

        // 2026 Neon Palette
        'neon-violet': '#7B61FF',
        'neon-cyan': '#00F5FF',
        'neon-rose': '#FF2D78',
        'neon-gold': '#FFB800',
        'neon-emerald': '#00FFA3',
        'neon-azure': '#4D9FFF',

        // Text
        'text-primary': '#E8EAFF',
        'text-dim': 'rgba(232, 234, 255, 0.5)',
        'text-dimmer': 'rgba(232, 234, 255, 0.2)',

        // Borders
        'border-dim': 'rgba(123, 97, 255, 0.12)',
        'border-glow': 'rgba(123, 97, 255, 0.45)',

        // Glassmorphism
        'glass-bg': 'rgba(8, 10, 40, 0.82)',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        syne: ['Syne', 'sans-serif'],
        space: ['Space Grotesk', 'sans-serif'],
      },
      backdropBlur: {
        glass: '24px',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3.5s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'matrix-fall': 'matrix-fall 1s linear infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(0.95)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'matrix-fall': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(123, 97, 255, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(123, 97, 255, 0.8)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'neon-gradient': 'linear-gradient(135deg, #7B61FF, #FF2D78, #00F5FF)',
      },
      boxShadow: {
        'glass': '0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
        'neon-violet': '0 0 28px rgba(123, 97, 255, 0.2), 0 8px 32px rgba(0, 0, 0, 0.5)',
        'neon-cyan': '0 0 28px rgba(0, 245, 255, 0.2), 0 8px 32px rgba(0, 0, 0, 0.5)',
        'neon-rose': '0 0 28px rgba(255, 45, 120, 0.2), 0 8px 32px rgba(0, 0, 0, 0.5)',
        'neon-emerald': '0 0 28px rgba(0, 255, 163, 0.2), 0 8px 32px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}

export default config
