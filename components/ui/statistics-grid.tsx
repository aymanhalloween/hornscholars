'use client'

import * as React from 'react'
import { useInView } from 'react-intersection-observer'
import { cn } from '@/lib/utils'

interface StatisticItem {
  value: number | string
  label: string
  description?: string
  suffix?: string
  prefix?: string
  color?: 'blue' | 'purple' | 'green' | 'gold' | 'navy'
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'stable'
  trendValue?: string
}

interface StatisticsGridProps {
  statistics: StatisticItem[]
  className?: string
  variant?: 'default' | 'premium' | 'minimal' | 'glassmorphism'
  columns?: 1 | 2 | 3 | 4 | 5
  animated?: boolean
  staggerDelay?: number
}

// Animated Counter Component
const AnimatedCounter: React.FC<{
  value: number
  suffix?: string
  prefix?: string
  duration?: number
}> = ({ value, suffix = '', prefix = '', duration = 2 }) => {
  const [displayValue, setDisplayValue] = React.useState(0)
  
  React.useEffect(() => {
    let startTime: number
    let animationFrame: number
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(Math.round(value * easeOut))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }
    
    animationFrame = requestAnimationFrame(animate)
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [value, duration])

  return (
    <span>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  )
}

// Individual Statistic Component
const StatisticCard: React.FC<{
  statistic: StatisticItem
  index: number
  variant: 'default' | 'premium' | 'minimal' | 'glassmorphism'
  animated: boolean
  delay: number
}> = ({ statistic, index, variant, animated, delay }) => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })
  
  const [hasAnimated, setHasAnimated] = React.useState(false)
  
  React.useEffect(() => {
    if (inView && !hasAnimated && animated) {
      setTimeout(() => setHasAnimated(true), delay * 1000)
    }
  }, [inView, hasAnimated, animated, delay])

  const getCardClasses = () => {
    const base = 'relative group transition-all duration-300'
    
    switch (variant) {
      case 'premium':
        return cn(
          base,
          'bg-gradient-to-br from-white to-gray-50/50 border border-gray-200/80',
          'shadow-premium-warm rounded-2xl p-6 backdrop-blur-sm',
          'hover:shadow-premium-hover hover:-translate-y-1'
        )
      case 'glassmorphism':
        return cn(
          base,
          'glass-medium rounded-2xl border border-white/20 p-8',
          'shadow-premium-large backdrop-blur-xl',
          'hover:bg-white/25 hover:-translate-y-1'
        )
      case 'minimal':
        return cn(
          base,
          'bg-white border-l-4 p-6 rounded-r-lg shadow-premium-subtle',
          'hover:shadow-premium-medium hover:translate-x-1',
          getColorClasses(statistic.color, 'border')
        )
      default:
        return cn(
          base,
          'bg-white border border-gray-200 rounded-xl p-6 shadow-premium-subtle',
          'hover:shadow-premium-medium hover:-translate-y-1'
        )
    }
  }

  const getColorClasses = (color: string = 'blue', type: 'text' | 'bg' | 'border' = 'text') => {
    const colors = {
      blue: {
        text: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-500'
      },
      purple: {
        text: 'text-purple-600',
        bg: 'bg-purple-50',
        border: 'border-purple-500'
      },
      green: {
        text: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-500'
      },
      gold: {
        text: 'text-yellow-600',
        bg: 'bg-yellow-50',
        border: 'border-yellow-500'
      },
      navy: {
        text: 'text-slate-700',
        bg: 'bg-slate-50',
        border: 'border-slate-600'
      }
    }
    
    return colors[color as keyof typeof colors]?.[type] || colors.blue[type]
  }

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return (
          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l10-10M17 7v10" />
          </svg>
        )
      case 'down':
        return (
          <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17l-10-10M7 7v10" />
          </svg>
        )
      case 'stable':
        return (
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
          </svg>
        )
      default:
        return null
    }
  }

  const StatisticContent = () => (
    <>
      {/* Icon */}
      {statistic.icon && (
        <div 
          className={cn(
            'flex-shrink-0 p-3 rounded-xl mb-4 transition-all duration-500',
            getColorClasses(statistic.color, 'bg'),
            getColorClasses(statistic.color, 'text'),
            hasAnimated ? 'animate-scale-in' : 'opacity-0 scale-90'
          )}
        >
          <div className="w-6 h-6">
            {statistic.icon}
          </div>
        </div>
      )}

      {/* Main Value */}
      <div 
        className={cn(
          'text-4xl lg:text-5xl font-black text-display mb-2 transition-opacity duration-500',
          getColorClasses(statistic.color, 'text'),
          hasAnimated ? 'opacity-100' : 'opacity-0'
        )}
      >
        {animated && typeof statistic.value === 'number' && hasAnimated ? (
          <AnimatedCounter
            value={statistic.value}
            prefix={statistic.prefix}
            suffix={statistic.suffix}
            duration={2}
          />
        ) : (
          `${statistic.prefix || ''}${statistic.value}${statistic.suffix || ''}`
        )}
      </div>

      {/* Label */}
      <div 
        className={cn(
          'text-base font-semibold text-gray-800 mb-1 transition-all duration-400',
          hasAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        )}
      >
        {statistic.label}
      </div>

      {/* Description */}
      {statistic.description && (
        <p 
          className={cn(
            'text-sm text-gray-600 leading-relaxed transition-all duration-400',
            hasAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          )}
        >
          {statistic.description}
        </p>
      )}

      {/* Trend Indicator */}
      {statistic.trend && (
        <div 
          className={cn(
            'flex items-center gap-2 mt-3 transition-all duration-300',
            hasAnimated ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
          )}
        >
          {getTrendIcon(statistic.trend)}
          {statistic.trendValue && (
            <span className="text-xs font-medium text-gray-600">
              {statistic.trendValue}
            </span>
          )}
        </div>
      )}

      {/* Premium Accent Line */}
      {variant === 'premium' && (
        <div
          className={cn(
            'absolute bottom-0 left-8 right-8 h-1 rounded-full transition-transform duration-800 origin-left',
            getColorClasses(statistic.color, 'bg'),
            'opacity-20',
            hasAnimated ? 'scale-x-100' : 'scale-x-0'
          )}
        />
      )}
    </>
  )

  return (
    <div 
      ref={ref} 
      className={cn(
        getCardClasses(),
        animated && hasAnimated ? 'animate-slide-up' : animated ? 'opacity-0 translate-y-4' : ''
      )}
    >
      <StatisticContent />
    </div>
  )
}

// Main Statistics Grid Component
export const StatisticsGrid: React.FC<StatisticsGridProps> = ({
  statistics,
  className,
  variant = 'default',
  columns = 3,
  animated = true,
  staggerDelay = 0.1
}) => {
  const getGridClasses = () => {
    const base = 'grid gap-4 lg:gap-5'
    const columnClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
      5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
    }
    
    return cn(base, columnClasses[columns])
  }

  return (
    <div className={cn(getGridClasses(), className)}>
      {statistics.map((statistic, index) => (
        <StatisticCard
          key={`${statistic.label}-${index}`}
          statistic={statistic}
          index={index}
          variant={variant}
          animated={animated}
          delay={animated ? index * staggerDelay : 0}
        />
      ))}
    </div>
  )
}

// Hook for easy statistics data management
export const useStatistics = (data: StatisticItem[]) => {
  const [statistics, setStatistics] = React.useState<StatisticItem[]>(data)
  
  const updateStatistic = (index: number, updates: Partial<StatisticItem>) => {
    setStatistics(prev => 
      prev.map((stat, i) => 
        i === index ? { ...stat, ...updates } : stat
      )
    )
  }
  
  const addStatistic = (statistic: StatisticItem) => {
    setStatistics(prev => [...prev, statistic])
  }
  
  const removeStatistic = (index: number) => {
    setStatistics(prev => prev.filter((_, i) => i !== index))
  }
  
  return {
    statistics,
    updateStatistic,
    addStatistic,
    removeStatistic,
    setStatistics
  }
}

export default StatisticsGrid