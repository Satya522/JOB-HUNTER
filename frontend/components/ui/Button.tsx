'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.PropsWithChildren<Omit<React.ComponentProps<typeof motion.button>, 'children'>> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'neon'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  glowColor?: string
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  glowColor = '#7B61FF',
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'relative inline-flex items-center justify-center font-mono font-medium rounded-xl transition-all duration-300 overflow-hidden focus-ring disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-gradient-to-r from-neon-violet to-neon-cyan text-white hover:shadow-lg',
    secondary: 'bg-bg-glass border border-border-dim text-text-primary hover:border-neon-violet/50',
    outline: 'bg-transparent border border-neon-violet text-neon-violet hover:bg-neon-violet/10',
    ghost: 'bg-transparent text-text-dim hover:text-text-primary hover:bg-bg-glass',
    neon: `bg-transparent border-2 text-white hover:shadow-[0_0_20px_${glowColor}40]`,
  }

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        variant === 'neon' && `border-[${glowColor}]`,
        'btn-shimmer',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      ) : leftIcon ? (
        <span className="mr-2">{leftIcon}</span>
      ) : null}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </motion.button>
  )
}
