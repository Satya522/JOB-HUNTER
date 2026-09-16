'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const tickerMessages = [
  { icon: '🔴', text: 'LIVE: 3 new ML/AI roles in Mumbai posted 2 min ago' },
  { icon: '⚡', text: 'Anthropic updated salary range → $200k–$280k' },
  { icon: '🎯', text: 'Your profile matched 2 new roles at Google DeepMind' },
  { icon: '📈', text: 'AI/ML job market up 23% this month — act now' },
  { icon: '🤖', text: 'OpenAI hiring 50+ engineers this quarter' },
  { icon: '💼', text: 'Microsoft expanding AI team in Bangalore' },
]

export default function LiveTicker() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tickerMessages.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="glass-card rounded-xl py-3 px-4 flex items-center gap-4 overflow-hidden">
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="w-2 h-2 rounded-full bg-neon-rose pulse-dot" />
        <span className="text-xs font-mono text-neon-rose uppercase tracking-wider">Live</span>
      </div>
      
      <div className="flex-1 relative h-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center"
          >
            <span className="text-sm text-text-primary">
              {tickerMessages[currentIndex].icon} {tickerMessages[currentIndex].text}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex-shrink-0 text-xs font-mono text-text-dim">
        {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  )
}
