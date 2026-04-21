/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        serif: ['ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace',
        ],
      },
      colors: {
        ink: {
          900: '#0b1220',
          800: '#111827',
          700: '#1f2937',
          600: '#334155',
          500: '#475569',
          400: '#64748b',
          300: '#94a3b8',
          200: '#cbd5e1',
          100: '#e2e8f0',
          50: '#f1f5f9',
        },
        paper: {
          DEFAULT: '#ffffff',
          muted: '#f8fafc',
          sunken: '#f1f5f9',
        },
        accent: {
          DEFAULT: '#b45309',
          soft: '#fef3c7',
          ring: '#d97706',
        },
      },
      maxWidth: {
        prose: '68ch',
        narrative: '44rem',
        wide: '72rem',
      },
      spacing: {
        section: '6rem',
        'section-sm': '4rem',
      },
      fontSize: {
        eyebrow: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.12em' }],
        display: ['3.25rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-sm': ['2.25rem', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        lede: ['1.25rem', { lineHeight: '1.55' }],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15, 23, 42, 0.04), 0 2px 8px rgba(15, 23, 42, 0.04)',
        edge: 'inset 0 0 0 1px rgba(15, 23, 42, 0.06)',
      },
      letterSpacing: {
        eyebrow: '0.12em',
      },
    },
  },
  plugins: [],
};
