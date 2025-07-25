import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden group cursor-pointer',
  {
    variants: {
      variant: {
        // Premium primary - Gold gradient with sophisticated shadows
        primary: [
          'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-premium-medium',
          'hover:from-blue-700 hover:to-blue-800 hover:shadow-premium-hover hover:-translate-y-0.5',
          'active:translate-y-0 active:scale-[0.98]',
          'focus-visible:ring-blue-600/30',
          'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
          'before:translate-x-[-100%] before:transition-transform before:duration-700',
          'hover:before:translate-x-[100%]'
        ],
        
        // Premium secondary - Sophisticated warm gray
        secondary: [
          'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 border border-gray-200 shadow-premium-subtle',
          'hover:from-gray-200 hover:to-gray-300 hover:shadow-premium-medium hover:-translate-y-0.5',
          'active:translate-y-0 active:scale-[0.98]',
          'focus-visible:ring-gray-500/20'
        ],
        
        // Premium outline - Clean with subtle hover states
        outline: [
          'border-2 border-gray-300 bg-transparent text-gray-700 shadow-premium-subtle backdrop-blur-sm',
          'hover:border-gray-400 hover:bg-white/50 hover:shadow-premium-medium hover:-translate-y-0.5',
          'active:translate-y-0 active:scale-[0.98]',
          'focus-visible:ring-gray-500/20'
        ],
        
        // Premium ghost - Minimal with elegant interactions
        ghost: [
          'text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 backdrop-blur-sm',
          'hover:shadow-premium-subtle hover:-translate-y-0.5',
          'active:translate-y-0 active:scale-[0.98]',
          'focus-visible:ring-gray-500/20'
        ],
        
        // Gold variant - Premium accent
        gold: [
          'bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 shadow-premium-gold',
          'hover:from-yellow-500 hover:to-yellow-600 hover:shadow-premium-hover hover:-translate-y-0.5',
          'active:translate-y-0 active:scale-[0.98]',
          'focus-visible:ring-yellow-500/30'
        ],
        
        // Navy variant - Authority and depth
        navy: [
          'bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-premium-medium',
          'hover:from-slate-900 hover:to-slate-950 hover:shadow-premium-hover hover:-translate-y-0.5',
          'active:translate-y-0 active:scale-[0.98]',
          'focus-visible:ring-slate-700/30'
        ],
        
        // Glassmorphism variant
        glass: [
          'glass-light text-gray-700 backdrop-blur-xl',
          'hover:bg-white/40 hover:shadow-premium-medium hover:-translate-y-0.5',
          'active:translate-y-0 active:scale-[0.98]',
          'focus-visible:ring-white/20'
        ],
        
        // Link variant - Sophisticated underline
        link: [
          'text-blue-600 underline-offset-4 hover:underline hover:text-blue-700',
          'focus-visible:ring-blue-600/20'
        ],
      },
      size: {
        xs: 'h-7 px-2.5 text-xs rounded-md',
        sm: 'h-8 px-3 text-sm rounded-lg',
        md: 'h-10 px-4 py-2 text-sm rounded-xl',
        lg: 'h-12 px-6 text-base rounded-xl',
        xl: 'h-14 px-8 text-lg rounded-2xl',
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : 'button'
    
    const buttonContent = (
      <>
        {/* Loading spinner */}
        {loading && (
          <div className="mr-2 animate-fade-in">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin opacity-60" />
          </div>
        )}
        
        {/* Left icon */}
        {leftIcon && !loading && (
          <span className="mr-2 opacity-80 group-hover:opacity-100 transition-opacity duration-200">
            {leftIcon}
          </span>
        )}
        
        {/* Button text */}
        <span className="relative z-10">{children}</span>
        
        {/* Right icon */}
        {rightIcon && (
          <span className="ml-2 opacity-80 group-hover:opacity-100 transition-opacity duration-200">
            {rightIcon}
          </span>
        )}
        
        {/* Shimmer effect overlay for premium variants */}
        {(variant === 'primary' || variant === 'gold' || variant === 'navy') && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-500" />
        )}
      </>
    )

    if (asChild) {
      return (
        <Slot className={cn(buttonVariants({ variant, size, className }))}>
          {children}
        </Slot>
      )
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {buttonContent}
      </Comp>
    )
  }
)

Button.displayName = 'Button'

// Premium button variants for specific use cases
export const PremiumButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => <Button {...props} ref={ref} variant="primary" />
)
PremiumButton.displayName = 'PremiumButton'

export const GoldButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => <Button {...props} ref={ref} variant="gold" />
)
GoldButton.displayName = 'GoldButton'

export const NavyButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => <Button {...props} ref={ref} variant="navy" />
)
NavyButton.displayName = 'NavyButton'

export const GlassButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => <Button {...props} ref={ref} variant="glass" />
)
GlassButton.displayName = 'GlassButton'

export { Button, buttonVariants }