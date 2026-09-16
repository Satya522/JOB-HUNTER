'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const skills = [
  { name: 'Python', value: 95 },
  { name: 'Machine Learning', value: 88 },
  { name: 'Deep Learning', value: 82 },
  { name: 'SQL', value: 90 },
  { name: 'AWS', value: 78 },
  { name: 'TensorFlow', value: 85 },
  { name: 'PyTorch', value: 80 },
  { name: 'NLP', value: 75 },
  { name: 'Computer Vision', value: 72 },
  { name: 'MLOps', value: 68 },
]

// 👉 Arunda Color Palette Array (Repeating Cyan, Purple, Magenta)
const colors = [
  '#13F287', // Cyan
  '#6200D9', // Purple
  '#DB66FF', // Magenta
  '#13F287', 
  '#6200D9', 
  '#DB66FF', 
  '#13F287', 
  '#6200D9', 
  '#DB66FF', 
  '#13F287'
]

export default function NivoSkillsBar() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const maxValue = Math.max(...skills.map((s) => s.value))

  return (
    <div ref={ref} className="w-full h-full overflow-y-auto scrollbar-hide py-2">
      <div className="space-y-3">
        {skills.map((skill, index) => (
          <div key={skill.name} className="flex items-center gap-3">
            <span className="w-24 text-xs text-white/60 font-mono text-right truncate">
              {skill.name}
            </span>
            
            {/* Background Track */}
            <div className="flex-1 h-6 bg-white/5 border border-white/5 rounded-lg overflow-hidden relative">
              
              {/* Animated Skill Bar */}
              <motion.div
                initial={{ width: 0 }}
                animate={isInView ? { width: `${(skill.value / maxValue) * 100}%` } : {}}
                transition={{ duration: 0.8, delay: index * 0.05, ease: 'easeOut' }}
                className="h-full rounded-lg flex items-center justify-end pr-3"
                style={{ 
                  backgroundColor: colors[index],
                  boxShadow: `0 0 15px ${colors[index]}40`, // Arunda Glow
                }}
              >
                {/* Dynamic Text Color based on Bar Color */}
                <span 
                  className={`text-[10px] font-mono font-bold ${
                    colors[index] === '#6200D9' ? 'text-white' : 'text-[#0C0513]'
                  }`}
                >
                  {skill.value}%
                </span>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}