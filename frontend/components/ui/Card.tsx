'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glowColor?: string
  onClick?: () => void
}

export default function Card({ 
  children, 
  className, 
  hover = true, 
  glowColor = '#7B61FF',
  onClick 
}: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { 
        y: -2, 
        boxShadow: `0 0 28px ${glowColor}33, 0 8px 32px rgba(0, 0, 0, 0.5)` 
      } : {}}
      onClick={onClick}
      className={cn(
        'glass-card rounded-2xl p-6 transition-all duration-300',
        onClick && 'cursor-pointer',
        className
      )}
      style={{
        ['--glow-color' as string]: glowColor,
      }}
    >
      {children}
    </motion.div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mb-4', className)}>{children}</div>
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn('font-orbitron text-lg font-semibold text-text-primary', className)}>{children}</h3>
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('text-sm text-text-dim mt-1', className)}>{children}</p>
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('', className)}>{children}</div>
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mt-4 pt-4 border-t border-border-dim', className)}>{children}</div>
}
