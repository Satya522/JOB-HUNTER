'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// 👉 Mapped with Arunda Theme & Semantic Status Colors
const data = [
  { label: 'Applied', value: 127, color: '#6200D9' },   // Arunda Purple
  { label: 'Screen', value: 48, color: '#DB66FF' },     // Arunda Magenta
  { label: 'Interview', value: 22, color: '#13F287' },  // Arunda Cyan
  { label: 'Offer', value: 8, color: '#10B981' },       // Emerald Green
  { label: 'Rejected', value: 15, color: '#FF2D78' },   // Neon Pink
]

export default function StatusDoughnut() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const total = data.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = 0

  return (
    <div ref={ref} className="w-full h-full flex flex-col items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-32 h-32 drop-shadow-xl">
        {data.map((item, index) => {
          const angle = (item.value / total) * 360
          const startAngle = currentAngle
          currentAngle += angle
          const endAngle = currentAngle

          const startRad = (startAngle - 90) * (Math.PI / 180)
          const endRad = (endAngle - 90) * (Math.PI / 180)

          const x1 = 50 + 35 * Math.cos(startRad)
          const y1 = 50 + 35 * Math.sin(startRad)
          const x2 = 50 + 35 * Math.cos(endRad)
          const y2 = 50 + 35 * Math.sin(endRad)

          const largeArc = angle > 180 ? 1 : 0

          return (
            <motion.path
              key={item.label}
              d={`M 50 50 L ${x1} ${y1} A 35 35 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={item.color}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.1 }}
              style={{ transformOrigin: 'center' }}
              className="hover:opacity-80 transition-opacity cursor-pointer"
            />
          )
        })}
        
        {/* Center circle - Matched with Dashboard Background */}
        <circle cx="50" cy="50" r="26" fill="#0C0513" />
        
        {/* Center text - Made visible and clear */}
        <text x="50" y="48" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold" fontFamily="monospace">
          {total}
        </text>
        <text x="50" y="58" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="6" fontFamily="monospace">
          Total
        </text>
      </svg>

      {/* Legend with glowing dots */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4">
        {data.map((item) => (
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