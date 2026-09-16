'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

export default function ApplicationLineChart() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)

  // Mock data for 12 months
  const data = {
    applied: [45, 52, 48, 61, 55, 67, 72, 68, 75, 82, 89, 95],
    responded: [12, 15, 18, 22, 25, 28, 32, 35, 38, 42, 48, 52],
    interviewed: [5, 7, 8, 10, 12, 14, 16, 18, 20, 22, 25, 28],
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const maxValue = Math.max(...data.applied, ...data.responded, ...data.interviewed)

  const getPath = (values: number[]) => {
    const points = values.map((value, i) => {
      const x = (i / (values.length - 1)) * 100
      // Scaled by 95 instead of 100 so the highest point doesn't get clipped at the top border
      const y = 100 - (value / maxValue) * 95 
      return `${x},${y}`
    })
    return `M ${points.join(' L ')}`
  }

  const getAreaPath = (values: number[]) => {
    const linePath = getPath(values)
    return `${linePath} L 100,100 L 0,100 Z`
  }

  return (
    <div ref={ref} className="w-full h-full flex flex-col justify-between">
      <div className="flex-1 relative w-full pb-2">
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="0.5"
            />
          ))}

          {/* Applied Area (Cyan) */}
          <motion.path
            d={getAreaPath(data.applied)}
            fill="url(#gradientApplied)"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.3 } : {}}
            transition={{ duration: 1 }}
          />

          {/* Responded Area (Purple) */}
          <motion.path
            d={getAreaPath(data.responded)}
            fill="url(#gradientResponded)"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.3 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
          />

          {/* Interviewed Area (Magenta) */}
          <motion.path
            d={getAreaPath(data.interviewed)}
            fill="url(#gradientInterviewed)"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.3 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
          />

          {/* Lines */}
          <motion.path
            d={getPath(data.applied)}
            fill="none"
            stroke="#13F287"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
          <motion.path
            d={getPath(data.responded)}
            fill="none"
            stroke="#6200D9"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.2, ease: 'easeOut' }}
          />
          <motion.path
            d={getPath(data.interviewed)}
            fill="none"
            stroke="#DB66FF"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.4, ease: 'easeOut' }}
          />

          {/* Gradients Defined with Arunda Colors */}
          <defs>
            <linearGradient id="gradientApplied" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#13F287" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#13F287" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gradientResponded" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6200D9" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#6200D9" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gradientInterviewed" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#DB66FF" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#DB66FF" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Legend with glowing dots */}
      <div className="flex justify-center gap-4 mt-1 border-t border-white/5 pt-3">
        {[
          { label: 'Applied', color: '#13F287' },
          { label: 'Responded', color: '#6200D9' },
          { label: 'Interviewed', color: '#DB66FF' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}80` }} 
            />
            <span className="text-[10px] text-white/60 font-mono tracking-wide">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}