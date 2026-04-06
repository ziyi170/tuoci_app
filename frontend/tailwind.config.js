/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        serif: ['Lora', 'serif'],
      },
      colors: {
        bg:       '#0d0d0f',
        surface:  '#18181d',
        surface2: '#1f1f26',
        border:   '#27272f',
        accent:   '#a8e063',
        accent2:  '#63d4e0',
        muted:    '#9b9aab',
        danger:   '#e06363',
        warn:     '#e0c463',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
