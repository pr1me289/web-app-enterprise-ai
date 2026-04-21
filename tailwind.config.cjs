/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Avenir Next"', '"Segoe UI"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        serif: ['"Iowan Old Style"', '"Palatino Linotype"', '"Book Antiqua"', 'Georgia', 'serif'],
        mono: [
          '"IBM Plex Mono"',
          '"SFMono-Regular"',
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
          950: '#0f1517',
          900: '#182126',
          800: '#22313a',
          700: '#314650',
          600: '#47616d',
          500: '#617c88',
          400: '#8095a0',
          300: '#afbdc5',
          200: '#d2dce1',
          100: '#e6ecef',
          50: '#f3f6f7',
        },
        paper: {
          DEFAULT: '#fcfaf5',
          muted: '#f3eee4',
          sunken: '#e8dfd0',
        },
        spruce: {
          700: '#21473c',
          600: '#2d6152',
          100: '#d7e7df',
          50: '#edf5f1',
        },
        rose: {
          700: '#8f4d4a',
          100: '#f1dddc',
          50: '#faf1f0',
        },
        accent: {
          DEFAULT: '#9d5728',
          soft: '#eed8c8',
          ring: '#bf713d',
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
        soft: '0 8px 24px rgba(24, 33, 38, 0.06), 0 1px 2px rgba(24, 33, 38, 0.05)',
        edge: 'inset 0 0 0 1px rgba(24, 33, 38, 0.08)',
      },
      letterSpacing: {
        eyebrow: '0.12em',
      },
    },
  },
  plugins: [],
};
