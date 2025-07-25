'use client'

import * as React from 'react'
import { motion, MotionProps } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Custom Islamic Scholarly Icons as SVG components
export const ScholarSearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    <circle cx="12" cy="8" r="2" strokeWidth={1.5} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14c0-2 2-3 4-3s4 1 4 3" />
  </svg>
)

export const TimelineIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6l4 2" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 4c0 1.5-.5 2.5-1.5 3.5C5.5 8.5 5 9.5 5 11" opacity={0.4} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 13c0-1.5.5-2.5 1.5-3.5C21.5 8.5 22 7.5 22 6" opacity={0.4} />
  </svg>
)

export const NetworkIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
    <circle cx="6" cy="6" r="2" strokeWidth={1.5} fill="currentColor" opacity={0.2} />
    <circle cx="18" cy="18" r="2" strokeWidth={1.5} fill="currentColor" opacity={0.2} />
    <circle cx="12" cy="12" r="1.5" strokeWidth={1.5} fill="currentColor" opacity={0.4} />
  </svg>
)

export const MapIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 20c2-1 4-2 4-4" opacity={0.3} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 20c-2-1-4-2-4-4" opacity={0.3} />
  </svg>
)

export const ManuscriptIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 12h6m-6 3h4m-4 3h2" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M16 16c0 .5.5 1 1 1s1-.5 1-1-.5-1-1-1-1 .5-1 1z" opacity={0.6} />
  </svg>
)

export const IslamicStarIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2l3 6 6 1-4.5 4.5L18 20l-6-3-6 3 1.5-6.5L3 9l6-1 3-6z" fill="currentColor" opacity={0.1} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2l3 6 6 1-4.5 4.5L18 20l-6-3-6 3 1.5-6.5L3 9l6-1 3-6z" />
    <circle cx="12" cy="12" r="2" strokeWidth={1} opacity={0.4} />
  </svg>
)

// Premium Card Variants
const premiumCardVariants = cva(
  'relative overflow-hidden transition-all duration-300 ease-out group cursor-pointer',
  {
    variants: {
      variant: {
        // Feature card - for landing page features
        feature: [
          'bg-white/95 backdrop-blur-sm border border-white/20',
          'shadow-premium-medium rounded-2xl',
          'hover:shadow-premium-hover hover:-translate-y-2',
          'before:absolute before:inset-0 before:bg-gradient-to-br before:opacity-0',
          'before:transition-opacity before:duration-300',
          'hover:before:opacity-5'
        ],
        
        // Scholar card - for scholar profiles
        scholar: [
          'bg-white border border-gray-200/50 shadow-premium-subtle',
          'rounded-xl backdrop-blur-sm',
          'hover:shadow-premium-medium hover:-translate-y-1',
          'hover:border-gray-300/50'
        ],
        
        // Glass card - glassmorphism variant
        glass: [
          'glass-medium rounded-2xl border border-white/20',
          'shadow-premium-large backdrop-blur-xl',
          'hover:bg-white/25 hover:-translate-y-1'
        ],
        
        // Premium card - elevated styling
        premium: [
          'bg-gradient-to-br from-white to-gray-50/50',
          'border border-gray-200/80 shadow-premium-warm',
          'rounded-2xl backdrop-blur-sm',
          'hover:shadow-premium-hover hover:-translate-y-2',
          'hover:from-white hover:to-white'
        ],
        
        // Islamic pattern card
        islamic: [
          'bg-white pattern-geometric-subtle',
          'border border-gray-200/60 shadow-premium-medium',
          'rounded-2xl corner-ornament',
          'hover:shadow-premium-large hover:-translate-y-1'
        ]
      },
      
      size: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10'
      },
      
      color: {
        blue: 'hover:before:from-blue-500 hover:before:to-blue-600',
        purple: 'hover:before:from-purple-500 hover:before:to-purple-600',
        orange: 'hover:before:from-orange-500 hover:before:to-orange-600',
        green: 'hover:before:from-green-500 hover:before:to-green-600',
        gold: 'hover:before:from-yellow-400 hover:before:to-yellow-500',
        navy: 'hover:before:from-slate-700 hover:before:to-slate-800'
      }
    },
    defaultVariants: {
      variant: 'feature',
      size: 'md',
      color: 'blue'
    }
  }
)

// Animation variants
const cardAnimations = {
  initial: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1
  },
  hover: {
    y: -8,
    scale: 1.02
  },
  tap: {
    scale: 0.98
  }
}

export interface PremiumCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof premiumCardVariants> {
  icon?: React.ReactNode
  title?: string
  description?: string
  badge?: string
  motionProps?: MotionProps
  href?: string
  animate?: boolean
  delay?: number
}

const PremiumCard = React.forwardRef<HTMLDivElement, PremiumCardProps>(
  ({ 
    className, 
    variant, 
    size, 
    color,
    icon,
    title,
    description,
    badge,
    children,
    motionProps,
    href,
    animate = true,
    delay = 0,
    ...props 
  }, ref) => {
    
    const cardContent = (
      <>
        {/* Icon Section */}
        {icon && (
          <motion.div 
            className={cn(
              'flex-shrink-0 p-3 rounded-xl mb-6',
              'transition-all duration-300 group-hover:scale-110',
              color === 'blue' && 'bg-blue-100 text-blue-600 group-hover:bg-blue-200',
              color === 'purple' && 'bg-purple-100 text-purple-600 group-hover:bg-purple-200',
              color === 'orange' && 'bg-orange-100 text-orange-600 group-hover:bg-orange-200',
              color === 'green' && 'bg-green-100 text-green-600 group-hover:bg-green-200',
              color === 'gold' && 'bg-yellow-100 text-yellow-600 group-hover:bg-yellow-200',
              color === 'navy' && 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
            )}
            initial={{ rotate: 0 }}
            whileHover={{ rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-8 h-8">
              {icon}
            </div>
          </motion.div>
        )}

        {/* Badge */}
        {badge && (
          <motion.div 
            className="absolute top-4 right-4 z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: delay + 0.2 }}
          >
            <div className={cn(
              'px-2 py-1 text-xs font-medium rounded-md',
              'bg-white/80 text-gray-600 backdrop-blur-sm',
              'border border-gray-200/50'
            )}>
              {badge}
            </div>
          </motion.div>
        )}

        {/* Content */}
        <div className="relative z-10 flex-1">
          {title && (
            <motion.h3 
              className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors duration-200"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: delay + 0.1 }}
            >
              {title}
            </motion.h3>
          )}
          
          {description && (
            <motion.p 
              className="text-gray-600 leading-relaxed mb-4 group-hover:text-gray-700 transition-colors duration-200"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: delay + 0.2 }}
            >
              {description}
            </motion.p>
          )}
          
          {children}
        </div>

        {/* Hover Arrow Indicator */}
        {href && (
          <motion.div 
            className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            initial={{ x: -10 }}
            whileHover={{ x: 0 }}
          >
            <div className="w-6 h-6 text-gray-400 group-hover:text-gray-600">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l10-10M17 7v10" />
              </svg>
            </div>
          </motion.div>
        )}

        {/* Premium Shimmer Effect */}
        {variant === 'premium' && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-500 pointer-events-none" />
        )}

        {/* Islamic Geometric Accent */}
        {variant === 'islamic' && (
          <div className="absolute top-0 right-0 w-24 h-24 opacity-5 pointer-events-none">
            <IslamicStarIcon className="w-full h-full" />
          </div>
        )}
      </>
    )

    if (animate) {
      return (
        <motion.div
          ref={ref}
          className={cn(premiumCardVariants({ variant, size, color, className }))}
          variants={cardAnimations}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileTap="tap"
          transition={{ 
            delay,
            duration: 0.4,
            ease: "easeOut"
          }}
          {...motionProps}
        >
          {cardContent}
        </motion.div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(premiumCardVariants({ variant, size, color, className }))}
        {...props}
      >
        {cardContent}
      </div>
    )
  }
)

PremiumCard.displayName = 'PremiumCard'

// Specialized card variants
export const FeatureCard = React.forwardRef<HTMLDivElement, PremiumCardProps>(
  (props, ref) => <PremiumCard {...props} ref={ref} variant="feature" />
)
FeatureCard.displayName = 'FeatureCard'

export const ScholarCard = React.forwardRef<HTMLDivElement, PremiumCardProps>(
  (props, ref) => <PremiumCard {...props} ref={ref} variant="scholar" />
)
ScholarCard.displayName = 'ScholarCard'

export const GlassCard = React.forwardRef<HTMLDivElement, PremiumCardProps>(
  (props, ref) => <PremiumCard {...props} ref={ref} variant="glass" />
)
GlassCard.displayName = 'GlassCard'

export const IslamicCard = React.forwardRef<HTMLDivElement, PremiumCardProps>(
  (props, ref) => <PremiumCard {...props} ref={ref} variant="islamic" />
)
IslamicCard.displayName = 'IslamicCard'

export { PremiumCard, premiumCardVariants }