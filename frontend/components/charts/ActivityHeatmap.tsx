'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// Generate mock data for 52 weeks x 7 days
const generateData = () => {
  const data = []
  for (let week = 0; week < 52; week++) {
    for (let day = 0; day < 7; day++) {
      // Random activity level 0-10
      const value = Math.floor(Math.random() * 11)
      data.push({ week, day, value })
    }
  }
  return data
}

const data = generateData()

// Arunda Color Palette Mapping
const getColor = (value: number): string => {
  if (value === 0) return 'rgba(255, 255, 255, 0.05)' // Empty cell (Glass)
  if (value <= 2) return '#6200D940' // Faint Purple (40% opacity)
  if (value <= 5) return '#6200D9'   // Solid Purple
  if (value <= 8) return '#13F28760' // Faint Cyan (60% opacity)
  return '#13F287'                   // Solid Cyan (High activity)
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function ActivityHeatmap() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="bg-[#0C0513] rounded-2xl p-6 border border-white/5">
      <h3 className="font-orbitron text-lg font-semibold text-white mb-6 tracking-wide">
        APPLICATION ACTIVITY <span className="text-white/40 text-sm font-sans font-normal">— Last 12 Months</span>
      </h3>

      <div className="overflow-x-auto scrollbar-hide">
        <div className="min-w-[800px]">
          {/* Month labels */}
          <div className="flex mb-2">
            <div className="w-8" /> {/* Spacer for day labels */}
            <div className="flex-1 flex justify-between pr-2">
              {months.map((month) => (
                <span key={month} className="text-[10px] text-white/40 font-mono">
                  {month}
                </span>
              ))}
            </div>
          </div>

          {/* Heatmap Area */}
          <div className="flex gap-2">
            {/* Day labels */}
            <div className="w-6 flex flex-col justify-between py-[4px]">
              {['Mon', 'Wed', 'Fri'].map((day) => (
                <span key={day} className="text-[9px] text-white/40 font-mono leading-none">
                  {day}
                </span>
              ))}
            </div>

            {/* Grid - FIXED THE VERTICAL LINE ISSUE HERE */}
            <div className="flex-1 grid grid-rows-7 grid-flow-col gap-[3px]">
              {data.map((cell, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: index * 0.001, duration: 0.2 }}
                  className="w-3 h-3 rounded-[2px] cursor-pointer hover:ring-1 hover:ring-[#13F287] hover:scale-125 transition-all z-0 hover:z-10 relative"
                  style={{ 
                    backgroundColor: getColor(cell.value),
                    boxShadow: cell.value > 8 ? '0 0 8px rgba(19,242,135,0.4)' : 'none' 
                  }}
                  title={`Week ${cell.week + 1}, Day ${cell.day + 1}: ${cell.value} applications`}
                />
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-3 mt-6">
            <span className="text-[10px] text-white/40 font-mono">Less</span>
            <div className="flex gap-[3px]">
              {[0, 2, 5, 8, 10].map((level) => (
                <div
                  key={level}
                  className="w-3 h-3 rounded-[2px]"
                  style={{ backgroundColor: getColor(level) }}
                />
              ))}
            </div>
            <span className="text-[10px] text-white/40 font-mono">More</span>
          </div>
        </div>
      </div>
    </div>
  )
}