'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login after brief animation
    const timer = setTimeout(() => {
      router.push('/login')
    }, 1500)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        {/* Logo Animation */}
        <motion.div
          className="relative w-24 h-24 mx-auto mb-6"
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
            scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7B61FF" />
                <stop offset="100%" stopColor="#00F5FF" />
              </linearGradient>
            </defs>
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#logoGradient)"
              strokeWidth="2"
              strokeDasharray="10 5"
            />
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke="url(#logoGradient)"
              strokeWidth="1.5"
              opacity="0.5"
            />
            <path
              d="M35 40 L35 60 L50 68 L65 60 L65 40 L50 32 Z"
              fill="none"
              stroke="url(#logoGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M42 45 L42 55 L50 59 L58 55 L58 45 L50 41 Z"
              fill="url(#logoGradient)"
              opacity="0.3"
            />
          </svg>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-orbitron text-3xl font-bold text-gradient mb-2"
        >
          AI JOB HUNTER
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-mono text-sm text-text-dim"
        >
          Career OS v2.0.26
        </motion.p>

        {/* Loading Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 w-48 h-1 bg-bg-surface rounded-full overflow-hidden mx-auto"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-neon-violet to-neon-cyan"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Status */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-4 font-mono text-xs text-text-dimmer"
        >
          Initializing systems...
        </motion.p>
      </motion.div>
    </div>
  )
}
