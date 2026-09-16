'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThumbsUp, ThumbsDown, Sparkles, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { AiInsight } from '@/types'

interface AiInsightsPanelProps {
  insights: AiInsight[]
}

export default function AiInsightsPanel({ insights }: AiInsightsPanelProps) {
  const [feedbacks, setFeedbacks] = useState<Record<number, 'like' | 'dislike' | null>>({})
  const [showReason, setShowReason] = useState<number | null>(null)

  const handleFeedback = (index: number, type: 'like' | 'dislike') => {
    setFeedbacks(prev => ({ ...prev, [index]: type }))
    if (type === 'like') {
      toast.success('Thanks for your feedback!')
    } else {
      setShowReason(index)
    }
  }

  const priorityColors: Record<string, string> = {
    critical: '#FF2D78',
    forecast: '#00F5FF',
    optimize: '#FFB800',
    timing: '#7B61FF',
    network: '#4D9FFF',
    skill: '#00FFA3',
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="font-orbitron text-lg font-semibold text-text-primary">
            🤖 AI_INSIGHTS
          </h3>
          <span className="px-2 py-0.5 rounded-full bg-neon-violet/20 text-neon-violet text-[10px] font-mono border border-neon-violet/30 animate-pulse">
            Gemini 1.5 Pro
          </span>
        </div>
        <motion.button
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.5 }}
          onClick={() => toast.info('Refreshing insights...')}
          className="p-2 rounded-lg hover:bg-bg-glass text-text-dim transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative p-4 rounded-xl bg-bg-glass border border-border-dim hover:border-opacity-50 transition-all"
            style={{ borderLeftColor: priorityColors[insight.priority], borderLeftWidth: '3px' }}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{insight.icon}</span>
              <div className="flex-1">
                <p className="text-xs font-mono text-text-primary leading-relaxed mb-3">
                  {insight.text}
                </p>
                <button 
                  onClick={() => toast.info(`${insight.action} coming soon!`)}
                  className="text-xs font-mono px-3 py-1.5 rounded-lg transition-colors"
                  style={{ 
                    backgroundColor: `${priorityColors[insight.priority]}20`,
                    color: priorityColors[insight.priority],
                  }}
                >
                  {insight.action}
                </button>
              </div>
            </div>

            {/* Feedback */}
            <div className="absolute top-2 right-2 flex gap-1">
              <button
                onClick={() => handleFeedback(index, 'like')}
                className={`p-1.5 rounded-lg transition-colors ${
                  feedbacks[index] === 'like' 
                    ? 'bg-neon-emerald/20 text-neon-emerald' 
                    : 'text-text-dim hover:text-neon-emerald'
                }`}
              >
                <ThumbsUp className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleFeedback(index, 'dislike')}
                className={`p-1.5 rounded-lg transition-colors ${
                  feedbacks[index] === 'dislike' 
                    ? 'bg-neon-rose/20 text-neon-rose' 
                    : 'text-text-dim hover:text-neon-rose'
                }`}
              >
                <ThumbsDown className="w-3 h-3" />
              </button>
            </div>

            {/* Dislike Reason */}
            <AnimatePresence>
              {showReason === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 pt-3 border-t border-border-dim"
                >
                  <p className="text-[10px] text-text-dim mb-2">Why wasn&apos;t this helpful?</p>
                  <div className="flex gap-2">
                    {['Not relevant', 'Incorrect', 'Too vague'].map((reason) => (
                      <button
                        key={reason}
                        onClick={() => {
                          toast.success('Feedback recorded')
                          setShowReason(null)
                        }}
                        className="text-[10px] px-2 py-1 rounded bg-bg-deep text-text-dim hover:text-text-primary transition-colors"
                      >
                        {reason}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
