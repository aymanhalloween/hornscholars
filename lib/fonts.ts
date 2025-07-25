/**
 * Premium Horn Scholars Font System
 * 
 * Optimized font loading with Next.js for premium typography experience
 * Inter Display for headings, Inter for body text, Noto Sans Arabic for Arabic content
 */

import { Inter } from 'next/font/google'

// Inter Display for premium headings - 900 weight for display text
const interDisplay = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-display',
  fallback: ['system-ui', 'sans-serif'],
  preload: true,
  adjustFontFallback: true,
})

// Inter for body text - optimal reading weights
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-body',
  fallback: ['system-ui', 'sans-serif'],
  preload: true,
  adjustFontFallback: true,
})

// Export font classes and variables for use throughout the app
export const fonts = {
  display: interDisplay,
  body: inter,
}

// Export CSS variables for use in components
export const fontVariables = `${interDisplay.variable} ${inter.variable}`

// Export font family strings for use in CSS
export const fontFamilies = {
  display: 'var(--font-display)',
  body: 'var(--font-body)',
}

// Typography helper functions
export const getDisplayClassName = (weight: 300 | 400 | 500 | 600 | 700 | 800 | 900 = 900) => {
  return `${interDisplay.className} font-[${weight}]`
}

export const getBodyClassName = (weight: 300 | 400 | 500 | 600 | 700 = 400) => {
  return `${inter.className} font-[${weight}]`
}