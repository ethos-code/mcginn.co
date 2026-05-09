import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0A0908',
        muted: '#7A7672',
        paper: '#FAFAF7',
        parchment: '#F5F2EC',
        hairline: 'rgba(10, 9, 8, 0.08)',
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
        display: [
          '"Inter Display Variable"',
          '"Inter Variable"',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono Variable"',
          '"JetBrains Mono"',
          '"IBM Plex Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace',
        ],
      },
      transitionTimingFunction: {
        reveal: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
