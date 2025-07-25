/**
 * Premium Horn Scholars Design System
 * 
 * Design Philosophy:
 * - Apple's refined minimalism meets Porsche's sophisticated craftsmanship
 * - Islamic scholarly design elements with museum-quality presentation
 * - 8px grid system with golden ratio proportions (1.618)
 */

// Typography System - Inter Display/Inter with precise hierarchy
export const typography = {
  // Primary Headings - Inter Display 900, tight letter-spacing
  display: {
    fontSize: 'clamp(3rem, 5vw, 5rem)', // 48px - 80px
    fontWeight: '900',
    lineHeight: '1.1',
    letterSpacing: '-0.02em',
    fontFamily: 'Inter Display, system-ui, sans-serif',
  },
  
  // Secondary Headings - Inter Display 700
  heading: {
    h1: {
      fontSize: 'clamp(2.25rem, 4vw, 3.75rem)', // 36px - 60px
      fontWeight: '700',
      lineHeight: '1.2',
      letterSpacing: '-0.01em',
      fontFamily: 'Inter Display, system-ui, sans-serif',
    },
    h2: {
      fontSize: 'clamp(1.875rem, 3vw, 3rem)', // 30px - 48px
      fontWeight: '700',
      lineHeight: '1.25',
      letterSpacing: '-0.008em',
      fontFamily: 'Inter Display, system-ui, sans-serif',
    },
    h3: {
      fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)', // 24px - 36px
      fontWeight: '600',
      lineHeight: '1.3',
      letterSpacing: '-0.005em',
      fontFamily: 'Inter Display, system-ui, sans-serif',
    },
  },
  
  // Body Text - Inter with optimal reading metrics
  body: {
    large: {
      fontSize: '1.125rem', // 18px
      fontWeight: '400',
      lineHeight: '1.6',
      letterSpacing: '0',
      fontFamily: 'Inter, system-ui, sans-serif',
    },
    regular: {
      fontSize: '1rem', // 16px
      fontWeight: '400',
      lineHeight: '1.6',
      letterSpacing: '0',
      fontFamily: 'Inter, system-ui, sans-serif',
    },
    medium: {
      fontSize: '1rem', // 16px
      fontWeight: '500',
      lineHeight: '1.5',
      letterSpacing: '0',
      fontFamily: 'Inter, system-ui, sans-serif',
    },
    small: {
      fontSize: '0.875rem', // 14px
      fontWeight: '400',
      lineHeight: '1.5',
      letterSpacing: '0.01em',
      fontFamily: 'Inter, system-ui, sans-serif',
    },
  },
  
  // Accent Text - For decorative elements
  accent: {
    fontSize: '0.75rem', // 12px
    fontWeight: '600',
    lineHeight: '1.4',
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
    fontFamily: 'Inter, system-ui, sans-serif',
  },
}

// Premium Color Palette - Sophisticated with warm undertones
export const colors = {
  // Primary Colors
  primary: {
    50: '#fafafa',  // Lightest warm white
    100: '#f8f7f5', // Sophisticated warm gray
    200: '#e5e3df', // Light warm gray
    300: '#d1cfc9', // Medium warm gray
    400: '#a8a5a0', // Darker warm gray
    500: '#6b6863', // Medium charcoal
    600: '#4a4742', // Dark charcoal
    700: '#2d2b27', // Very dark charcoal
    800: '#1a1a1a', // Deep charcoal with warm undertones
    900: '#0f0f0f', // Darkest charcoal
  },
  
  // Accent Colors
  accent: {
    // Subtle burgundy for emphasis
    burgundy: {
      50: '#fdf8f7',
      100: '#f9ede9',
      200: '#f0d3c9',
      300: '#e5b7a8',
      400: '#d4956e',
      500: '#8b4513', // Primary burgundy
      600: '#7a3a0f',
      700: '#642f0c',
      800: '#4d2409',
      900: '#3a1b07',
    },
    
    // Warm gold for premium touches
    gold: {
      50: '#fefcf0',
      100: '#fdf7d9',
      200: '#faedb3',
      300: '#f6e08c',
      400: '#f0d666',
      500: '#d4af37', // Primary gold
      600: '#b8932a',
      700: '#9c771d',
      800: '#7a5b16',
      900: '#5c440f',
    },
    
    // Deep navy for authority
    navy: {
      50: '#f0f4ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#1e2a5e', // Primary navy
      800: '#1e1b4b',
      900: '#1e1b4b',
    },
  },
  
  // Semantic Colors
  semantic: {
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    info: '#2563eb',
  },
  
  // Feature Colors (for cards)
  features: {
    blue: '#2563eb',
    purple: '#7c3aed',
    orange: '#ea580c',
    green: '#059669',
  },
}

// Spacing System - 8px grid with golden ratio proportions
export const spacing = {
  // Base unit
  unit: 8,
  
  // Micro spacing (component level)
  micro: {
    xs: '4px',   // 0.5 * 8
    sm: '8px',   // 1 * 8
    md: '12px',  // 1.5 * 8
    lg: '16px',  // 2 * 8
    xl: '20px',  // 2.5 * 8
    '2xl': '24px', // 3 * 8
  },
  
  // Macro spacing (layout level) - Golden ratio inspired
  macro: {
    xs: '32px',   // 4 * 8
    sm: '48px',   // 6 * 8 (48 * 1.618 ≈ 80)
    md: '80px',   // 10 * 8 (golden ratio from 48)
    lg: '128px',  // 16 * 8 (golden ratio from 80)
    xl: '208px',  // 26 * 8 (golden ratio from 128)
  },
  
  // Section spacing
  section: {
    xs: '48px',
    sm: '80px',
    md: '128px',
    lg: '208px',
  },
}

// Shadow System - Multiple layers for depth
export const shadows = {
  // Subtle shadows for cards
  subtle: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
  
  // Medium shadows for floating elements
  medium: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.1)',
  
  // Large shadows for modals and overlays
  large: '0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1)',
  
  // Premium shadows with warm undertones
  premium: '0 8px 32px rgba(26, 26, 26, 0.12), 0 2px 8px rgba(26, 26, 26, 0.08)',
  
  // Glassmorphism shadow
  glass: '0 8px 32px rgba(31, 38, 135, 0.37)',
  
  // Hover states
  hover: '0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)',
}

// Border Radius System
export const borderRadius = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  full: '9999px',
}

// Breakpoints - Mobile-first approach
export const breakpoints = {
  xs: '320px',
  sm: '768px',
  md: '1024px',
  lg: '1280px',
  xl: '1920px',
}

// Animation Curves - Apple-inspired easing
export const easings = {
  // Standard easing for most interactions
  standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  
  // Accelerated easing for exit animations
  accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
  
  // Decelerated easing for enter animations
  decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  
  // Sharp easing for emphasis
  sharp: 'cubic-bezier(0.4, 0.0, 0.6, 1)',
  
  // Bouncy easing for playful interactions
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
}

// Animation Durations
export const durations = {
  // Micro-interactions
  fast: '150ms',
  
  // Standard interactions
  standard: '250ms',
  
  // Complex animations
  slow: '400ms',
  
  // Page transitions
  page: '600ms',
}

// Z-index Scale
export const zIndex = {
  hide: -1,
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
}

// Export unified design system
export const designSystem = {
  typography,
  colors,
  spacing,
  shadows,
  borderRadius,
  breakpoints,
  easings,
  durations,
  zIndex,
} as const

export type DesignSystem = typeof designSystem