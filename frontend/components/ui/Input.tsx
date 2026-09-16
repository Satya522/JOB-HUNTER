'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  floatingLabel?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, floatingLabel, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && !floatingLabel && (
          <label className="block text-xs font-mono text-text-dim mb-2 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative input-underline">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={cn(
              'w-full bg-bg-glass border border-border-dim rounded-xl text-sm text-text-primary placeholder:text-text-dimmer focus:outline-none focus:border-neon-cyan transition-all duration-300',
              leftIcon && 'pl-12',
              rightIcon && 'pr-12',
              !leftIcon && 'pl-4',
              !rightIcon && 'pr-4',
              error && 'border-neon-rose focus:border-neon-rose',
              'py-3.5',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dim">
              {rightIcon}
            </div>
          )}
          {floatingLabel && label && (
            <label className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim text-sm pointer-events-none transition-all duration-300 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-neon-cyan peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs">
              {label}
            </label>
          )}
        </div>
        {error && (
          <p className="mt-2 text-xs font-mono text-neon-rose">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
