'use client'

import { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { GaugeData } from '@/types'

interface GaugesRowProps {
  gauges: GaugeData[]
}

export default function GaugesRow({ gauges }: GaugesRowProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <div ref={ref} className="glass-card rounded-2xl p-6">
      <h3 className="font-orbitron text-lg font-semibold text-text-primary mb-6">
        Performance Metrics
      </h3>

      <div className="flex flex-wrap justify-around gap-8">
        {gauges.map((gauge, index) => (
          <Gauge key={gauge.label} {...gauge} index={index} isInView={isInView} />
        ))}
      </div>
    </div>
  )
}

function Gauge({ label, value, unit, color, index, isInView }: GaugeData & { index: number; isInView: boolean }) {
  const radius = 38
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (value / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {/* Outer dashed ring */}
          <circle
            cx="50"
            cy="50"
            r={radius + 4}
            fill="none"
            stroke={color}
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.4"
          />
          
          {/* Track circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="6"
          />
          
          {/* Progress arc */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={isInView ? { strokeDashoffset } : {}}
            transition={{ duration: 1.5, delay: index * 0.2, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        
        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span 
            className="font-orbitron text-xl font-bold"
            style={{ color, textShadow: `0 0 10px ${color}50` }}
          >
            {value}{unit}
          </span>
        </div>
      </div>
      
      {/* Label */}
      <span className="mt-3 text-[10px] font-mono uppercase tracking-wider text-text-dim">
        {label}
      </span>
    </div>
  )
}
