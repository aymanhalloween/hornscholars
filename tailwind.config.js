/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Professional neutrals
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          500: '#737373',
          900: '#171717',
        },
        // Academic blue - primary
        blue: {
          50: '#eff6ff',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        // Manuscript amber - accent
        amber: {
          50: '#fffbeb',
          600: '#d97706',
        },
        // Gold color for Islamic decorative elements
        gold: {
          500: '#d4af37',
          600: '#b8932a',
        },
      },
      fontFamily: {
        arabic: ['Noto Sans Arabic', 'sans-serif'],
        latin: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}