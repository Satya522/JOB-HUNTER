'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Eye, Mail, Archive } from 'lucide-react'
import { toast } from 'sonner'
import { TimelineEvent } from '@/types'

interface ActivityTimelineProps {
  events: TimelineEvent[]
}

export default function ActivityTimeline({ events }: ActivityTimelineProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-orbitron text-lg font-semibold text-text-primary mb-6">
        Activity Timeline
      </h3>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-5 top-0 bottom-0 w-px bg-border-dim" />

        <div className="space-y-4">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative pl-14"
            >
              {/* Node */}
              <motion.div
                whileHover={{ scale: 1.2 }}
                className="absolute left-0 w-10 h-10 rounded-full flex items-center justify-center border-2"
                style={{ 
                  backgroundColor: `${event.color}20`,
                  borderColor: event.color,
                  boxShadow: `0 0 10px ${event.color}40`
                }}
              >
                <span className="text-lg">{event.icon}</span>
              </motion.div>

              {/* Content */}
              <div 
                className="p-4 rounded-xl bg-bg-glass border border-border-dim hover:border-opacity-50 transition-all cursor-pointer"
                onClick={() => setExpandedId(expandedId === index ? null : index)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-text-primary">{event.text}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span 
                        className="text-[10px] px-2 py-0.5 rounded-full font-mono"
                        style={{ backgroundColor: `${event.color}20`, color: event.color }}
                      >
                        {event.company}
                      </span>
                      <span className="text-xs text-text-dim">{event.time}</span>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedId === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4 text-text-dim" />
                  </motion.div>
                </div>

                {/* Expanded Actions */}
                <AnimatePresence>
                  {expandedId === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-border-dim"
                    >
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            toast.info('Viewing details...')
                          }}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-deep text-text-dim hover:text-text-primary transition-colors text-xs"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            toast.info('Follow-up email drafted')
                          }}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-deep text-text-dim hover:text-neon-cyan transition-colors text-xs"
                        >
                          <Mail className="w-3 h-3" />
                          Follow Up
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            toast.info('Archived')
                          }}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-deep text-text-dim hover:text-neon-rose transition-colors text-xs"
                        >
                          <Archive className="w-3 h-3" />
                          Archive
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
