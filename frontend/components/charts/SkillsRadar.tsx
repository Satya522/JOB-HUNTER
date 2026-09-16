'use client'

// 👉 React import added here to fix the "Cannot find name 'div'" error
import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const skills = ['Python', 'ML', 'Deep Learning', 'NLP', 'SQL', 'AWS', 'TensorFlow', 'PyTorch']
const yourSkills = [90, 85, 75, 70, 80, 65, 78, 72]
const marketDemand = [95, 90, 85, 88, 85, 80, 82, 85]

export default function SkillsRadar() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  const centerX = 50
  const centerY = 50
  const radius = 35
  const angleStep = (2 * Math.PI) / skills.length

  const getPoint = (value: number, index: number) => {
    const angle = index * angleStep - Math.PI / 2
    const r = (value / 100) * radius
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
    }
  }

  const yourPath = yourSkills.map((v, i) => getPoint(v, i))
  const marketPath = marketDemand.map((v, i) => getPoint(v, i))

  return (
    <div ref={ref} className="w-full h-full flex flex-col justify-between pb-2">
      <div className="flex-1 relative w-full">
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
          {/* Grid circles */}
          {[25, 50, 75, 100].map((level) => (
            <circle
              key={level}
              cx={centerX}
              cy={centerY}
              r={(level / 100) * radius}
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="0.5"
            />
          ))}

          {/* Axis lines */}
          {skills.map((_, i) => {
            const angle = i * angleStep - Math.PI / 2
            const x = centerX + radius * Math.cos(angle)
            const y = centerY + radius * Math.sin(angle)
            return (
              <line
                key={i}
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="0.5"
              />
            )
          })}

          {/* Market Demand Area (Arunda Cyan) */}
          <motion.polygon
            points={marketPath.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="rgba(19, 242, 135, 0.15)"
            stroke="#13F287"
            strokeWidth="1"
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ transformOrigin: '50px 50px' }}
          />

          {/* Your Skills Area (Arunda Purple) */}
          <motion.polygon
            points={yourPath.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="rgba(98, 0, 217, 0.4)"
            stroke="#6200D9"
            strokeWidth="1.5"
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            style={{ transformOrigin: '50px 50px' }}
          />

          {/* Labels */}
          {skills.map((skill, i) => {
            const angle = i * angleStep - Math.PI / 2
            const x = centerX + (radius + 10) * Math.cos(angle)
            const y = centerY + (radius + 10) * Math.sin(angle)
            return (
              <text
                key={skill}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="rgba(255,255,255,0.6)"
                fontSize="4"
                fontFamily="monospace"
              >
                {skill}
              </text>
            )
          })}
        </svg>
      </div>

      {/* Legend with Arunda Glow */}
      <div className="flex justify-center gap-4 mt-2 pt-2 border-t border-white/5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#13F287', boxShadow: '0 0 6px #13F28780' }} />
          <span className="text-[10px] text-white/60 font-mono">Market Demand</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6200D9', boxShadow: '0 0 6px #6200D980' }} />
          <span className="text-[10px] text-white/60 font-mono">Your Skills</span>
        </div>
      </div>
    </div>
  )
}