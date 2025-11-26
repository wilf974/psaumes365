import type { Config } from 'tailwindcss'

/**
 * Configuration Tailwind pour Meditatio
 * Palette calme : beige, sable, bleu ciel, vert olive
 */
const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Palette principale - tons doux et apaisants
        beige: {
          50: '#FDFCFA',
          100: '#FAF7F2',
          200: '#F5EFE6',
          300: '#EBE1D3',
          400: '#DDD0BC',
          500: '#C9B99A',
          600: '#B5A17D',
          700: '#9A8663',
          800: '#7A6A4F',
          900: '#5C503C',
        },
        sable: {
          50: '#FEFDFB',
          100: '#FCF9F3',
          200: '#F8F1E4',
          300: '#F0E4CF',
          400: '#E5D3B3',
          500: '#D4BC8E',
          600: '#C4A66E',
          700: '#A98B52',
          800: '#876E42',
          900: '#655333',
        },
        ciel: {
          50: '#F5F9FC',
          100: '#E8F2F8',
          200: '#D1E5F1',
          300: '#AFD3E8',
          400: '#85BBDB',
          500: '#5EA3CE',
          600: '#4388B5',
          700: '#376E94',
          800: '#2D5776',
          900: '#244559',
        },
        olive: {
          50: '#F7F9F5',
          100: '#EDF2E8',
          200: '#DBE5D1',
          300: '#C2D3AF',
          400: '#A3BC85',
          500: '#85A35E',
          600: '#6A8847',
          700: '#546B38',
          800: '#44562E',
          900: '#374527',
        },
        // Couleurs sémantiques
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}

export default config


