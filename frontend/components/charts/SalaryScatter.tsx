'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SalaryScatter() {
  const [hoveredBubble, setHoveredBubble] = useState<number | null>(null)
  const [selectedBubble, setSelectedBubble] = useState<number | null>(null)

  // 👉 Mapped exactly to Arunda Premium Theme
  const data = [
    { id: 1, skill: 'Python', demand: 95, salary: 145, postings: 1200, category: 'Backend', color: '#13F287' },
    { id: 2, skill: 'TensorFlow', demand: 82, salary: 165, postings: 800, category: 'AI/ML', color: '#DB66FF' },
    { id: 3, skill: 'PyTorch', demand: 78, salary: 170, postings: 650, category: 'AI/ML', color: '#DB66FF' },
    { id: 4, skill: 'AWS', demand: 88, salary: 155, postings: 950, category: 'DevOps', color: '#6200D9' },
    { id: 5, skill: 'Kubernetes', demand: 75, salary: 175, postings: 550, category: 'DevOps', color: '#6200D9' },
    { id: 6, skill: 'React', demand: 92, salary: 135, postings: 1300, category: 'Frontend', color: '#13F287' },
    { id: 7, skill: 'Node.js', demand: 80, salary: 145, postings: 750, category: 'Backend', color: '#13F287' },
    { id: 8, skill: 'SQL', demand: 90, salary: 140, postings: 1100, category: 'Database', color: '#6200D9' },
    { id: 9, skill: 'Docker', demand: 85, salary: 150, postings: 900, category: 'DevOps', color: '#6200D9' },
    { id: 10, skill: 'Go', demand: 65, salary: 180, postings: 400, category: 'Backend', color: '#13F287' },
    { id: 11, skill: 'Rust', demand: 55, salary: 190, postings: 280, category: 'Backend', color: '#DB66FF' },
    { id: 12, skill: 'Spark', demand: 70, salary: 160, postings: 480, category: 'Big Data', color: '#DB66FF' },
  ]

  const categories = [
    { name: 'Frontend / Backend', color: '#13F287' },
    { name: 'AI / Big Data', color: '#DB66FF' },
    { name: 'DevOps / Database', color: '#6200D9' },
  ]

  const bubbleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: (index: number) => ({
      scale: 1,
      opacity: 1,
      transition: { delay: index * 0.05, duration: 0.6, type: 'spring', stiffness: 100 },
    }),
  }

  const tooltipVariants = {
    initial: { opacity: 0, scale: 0.8, y: -20 },
    animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, y: -20, transition: { duration: 0.2 } },
  }

  const axisVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.8, delay: 0.2 } },
  }

  // Adjusted Math for 1000x600 ViewBox 
  // Demand: 0 to 100 -> X: 120 to 920
  // Salary: 100k to 200k -> Y: 520 to 80
  const getX = (demand: number) => 120 + (demand / 100) * 800
  const getY = (salary: number) => 520 - ((salary - 100) / 100) * 440

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-hidden">
      
      {/* 🟢 Main SVG Chart Container */}
      <div className="relative w-full flex-1 min-h-0 overflow-hidden">
        
        {/* Animated Background Grid */}
        <motion.svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1000 600"
          preserveAspectRatio="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1 }}
          style={{ pointerEvents: 'none' }}
        >
          <defs>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="url(#gridGradient)" strokeWidth="1" />
            </pattern>
            <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#13F287" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#6200D9" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </motion.svg>

        {/* The Actual Graph */}
        <svg viewBox="0 0 1000 600" className="w-full h-full relative z-10" preserveAspectRatio="xMidYMid meet">
          
          {/* 🟢 Axes */}
          <motion.g variants={axisVariants} initial="initial" animate="animate">
            {/* Y-Axis Line */}
            <motion.line x1="120" y1="80" x2="120" y2="520" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
            {/* X-Axis Line */}
            <motion.line x1="120" y1="520" x2="920" y2="520" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />

            {/* Labels */}
            <text x="40" y="300" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="20" fontWeight="600" transform="rotate(-90 40 300)" className="font-orbitron tracking-widest">
              Salary ($K)
            </text>
            <text x="520" y="570" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="20" fontWeight="600" className="font-orbitron tracking-widest">
              Market Demand %
            </text>

            {/* Y-Axis Ticks (Salary 100k to 200k) */}
            {[100, 125, 150, 175, 200].map((val, i) => (
              <g key={`y-${i}`}>
                <line x1="110" y1={getY(val)} x2="120" y2={getY(val)} stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                <text x="95" y={getY(val) + 6} textAnchor="end" fill="rgba(255,255,255,0.5)" fontSize="16" fontFamily="monospace">
                  ${val}K
                </text>
              </g>
            ))}

            {/* X-Axis Ticks (Demand 0 to 100) */}
            {[0, 25, 50, 75, 100].map((val, i) => (
              <g key={`x-${i}`}>
                <line x1={getX(val)} y1="520" x2={getX(val)} y2="530" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                <text x={getX(val)} y="555" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="16" fontFamily="monospace">
                  {val}%
                </text>
              </g>
            ))}
          </motion.g>

          {/* 🟢 Bubbles */}
          {data.map((bubble, index) => {
            const x = getX(bubble.demand)
            const y = getY(bubble.salary)
            const radius = 25 + (bubble.postings / 1300) * 35
            const isHovered = hoveredBubble === bubble.id
            const isSelected = selectedBubble === bubble.id

            return (
              <motion.g
                key={bubble.id}
                custom={index}
                variants={bubbleVariants}
                initial="initial"
                animate="animate"
                onMouseEnter={() => setHoveredBubble(bubble.id)}
                onMouseLeave={() => setHoveredBubble(null)}
                onClick={() => setSelectedBubble(isSelected ? null : bubble.id)}
                className="cursor-pointer"
              >
                {/* Glow/Halo Effect */}
                <motion.circle
                  cx={x} cy={y} r={radius} fill={bubble.color} opacity={0}
                  animate={{
                    opacity: isHovered ? 0.3 : isSelected ? 0.4 : 0.05,
                    r: isHovered ? radius + 20 : isSelected ? radius + 30 : radius + 10,
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Main Translucent Bubble */}
                <motion.circle
                  cx={x} cy={y} r={radius} fill={bubble.color}
                  animate={{
                    opacity: isHovered || isSelected ? 0.9 : 0.6,
                    filter: isHovered || isSelected ? `drop-shadow(0 0 20px ${bubble.color})` : `drop-shadow(0 0 5px ${bubble.color}80)`,
                  }}
                  transition={{ duration: 0.4, type: 'spring' }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 1.2 }}
                />

                {/* Solid Inner Ring */}
                <motion.circle
                  cx={x} cy={y} r={radius} fill="none" stroke={bubble.color}
                  strokeWidth={isHovered || isSelected ? 4 : 2}
                  opacity={isHovered || isSelected ? 1 : 0.8}
                />

                {/* Skill Name */}
                <motion.text
                  x={x} y={y - 5} textAnchor="middle" fill="#ffffff" fontWeight="bold"
                  animate={{
                    fontSize: isHovered || isSelected ? 22 : 18,
                    opacity: isHovered || isSelected ? 1 : 0.8,
                  }}
                >
                  {bubble.skill}
                </motion.text>

                {/* Postings Text */}
                <motion.text
                  x={x} y={y + 18} textAnchor="middle" fill="#ffffff"
                  animate={{
                    fontSize: isHovered || isSelected ? 14 : 12,
                    opacity: isHovered || isSelected ? 1 : 0.6,
                  }}
                >
                  {bubble.postings} jobs
                </motion.text>

                {/* 🟢 Interactive Click Tooltip */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.g variants={tooltipVariants} initial="initial" animate="animate" exit="exit">
                      {/* Tooltip Background */}
                      <rect x={x - 110} y={y - 170} width="220" height="130" rx="16" fill="#0C0513" opacity="0.95" stroke={bubble.color} strokeWidth="2" style={{ filter: `drop-shadow(0 10px 20px rgba(0,0,0,0.8))` }} />
                      
                      {/* Header */}
                      <text x={x} y={y - 135} textAnchor="middle" fill="#FFFFFF" fontSize="20" fontWeight="bold" className="font-orbitron">
                        {bubble.skill}
                      </text>
                      <line x1={x - 90} y1={y - 120} x2={x + 90} y2={y - 120} stroke={bubble.color} strokeWidth="1" opacity="0.4" />
                      
                      {/* Details */}
                      <text x={x - 90} y={y - 95} fill="rgba(255,255,255,0.6)" fontSize="14" fontFamily="monospace">Demand:</text>
                      <text x={x + 90} y={y - 95} textAnchor="end" fill="#13F287" fontSize="16" fontWeight="bold" fontFamily="monospace">{bubble.demand}%</text>
                      
                      <text x={x - 90} y={y - 70} fill="rgba(255,255,255,0.6)" fontSize="14" fontFamily="monospace">Salary:</text>
                      <text x={x + 90} y={y - 70} textAnchor="end" fill="#DB66FF" fontSize="16" fontWeight="bold" fontFamily="monospace">${bubble.salary}K</text>
                      
                      <text x={x - 90} y={y - 45} fill="rgba(255,255,255,0.6)" fontSize="14" fontFamily="monospace">Category:</text>
                      <text x={x + 90} y={y - 45} textAnchor="end" fill="#6200D9" fontSize="16" fontWeight="bold" fontFamily="monospace">{bubble.category}</text>
                    </motion.g>
                  )}
                </AnimatePresence>
              </motion.g>
            )
          })}
        </svg>
      </div>

      {/* 🟢 Responsive Legend & Instructions */}
      <div className="shrink-0 mt-4 flex items-center justify-between border-t border-white/5 pt-3">
        <div className="flex gap-4">
          {categories.map((cat, i) => (
            <motion.div key={cat.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 + i * 0.1 }} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color, boxShadow: `0 0 8px ${cat.color}` }} />
              <span className="text-[10px] text-white/50 font-mono hidden sm:block">{cat.name}</span>
            </motion.div>
          ))}
        </div>
        <div className="text-[10px] text-white/40 font-mono text-right">
          Click bubble to expand details
        </div>
      </div>
    </div>
  )
}