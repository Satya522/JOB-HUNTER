'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { PipelineStage } from '@/types'

interface PipelineSectionProps {
  data: PipelineStage[]
}

export default function PipelineSection({ data }: PipelineSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const maxCount = Math.max(...data.map(d => d.count))

  return (
    <div ref={ref} className="glass-card rounded-2xl p-6">
      <h3 className="font-orbitron text-lg font-semibold text-text-primary mb-6">
        Hiring Pipeline
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Funnel Bars */}
        <div className="space-y-3">
          {data.map((stage, index) => {
            const percentage = Math.round((stage.count / data[0].count) * 100)
            const conversionRate = index > 0 
              ? Math.round((stage.count / data[index - 1].count) * 100) 
              : 100

            return (
              <motion.div
                key={stage.stage}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="flex items-center gap-4">
                  <span className="w-24 text-right text-xs font-mono text-text-dim uppercase">
                    {stage.stage}
                  </span>
                  <div className="flex-1 h-11 bg-bg-deep rounded-lg overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${(stage.count / maxCount) * 100}%` } : {}}
                      transition={{ duration: 1, delay: index * 0.15, ease: 'easeOut' }}
                      className="h-full rounded-lg relative"
                      style={{ 
                        background: `linear-gradient(90deg, ${stage.color}40, ${stage.color})`,
                      }}
                    >
                      <span 
                        className="absolute inset-0 flex items-center justify-center text-sm font-orbitron font-bold"
                        style={{ color: stage.color, textShadow: `0 0 10px ${stage.color}50` }}
                      >
                        {stage.count}
                      </span>
                    </motion.div>
                  </div>
                  <div className="w-20 text-right">
                    <span className="text-xs font-mono text-text-dim">{percentage}%</span>
                    {index > 0 && (
                      <span className="text-[10px] text-text-dimmer block">
                        {conversionRate}% conv.
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Radial Chart */}
        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              {data.map((stage, index) => {
                const previousTotal = data.slice(0, index).reduce((sum, s) => sum + s.count, 0)
                const circumference = 2 * Math.PI * 35
                const strokeDasharray = `${(stage.count / data[0].count) * circumference} ${circumference}`
                const strokeDashoffset = -((previousTotal / data[0].count) * circumference)
                
                return (
                  <motion.circle
                    key={stage.stage}
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke={stage.color}
                    strokeWidth="8"
                    strokeDasharray={strokeDasharray}
                    initial={{ strokeDashoffset: circumference }}
                    animate={isInView ? { strokeDashoffset } : {}}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    style={{ filter: `drop-shadow(0 0 4px ${stage.color})` }}
                  />
                )
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-orbitron text-3xl font-bold text-text-primary">
                {data[0].count}
              </span>
              <span className="text-xs font-mono text-text-dim">Total</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
