/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        card: 'rgb(var(--color-card) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        safe: 'rgb(var(--color-safe) / <alpha-value>)',
        suspicious: '#ffcc00',
        phishing: '#ff4444',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        nav: 'rgb(var(--color-nav) / <alpha-value>)',
      }
    },
  },
  plugins: [],
}