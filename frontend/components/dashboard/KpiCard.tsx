// 'use client'

// import { useEffect, useState } from 'react'
// import { motion } from 'framer-motion'
// import CountUp from 'react-countup'
// import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'

// interface KpiCardProps {
//   label: string
//   value: number
//   suffix?: string
//   prefix?: string
//   trend: number
//   trendUp: boolean
//   color: string
//   sparkline: number[]
//   alert?: boolean
// }

// export default function KpiCard({ 
//   label, 
//   value, 
//   suffix = '', 
//   prefix = '',
//   trend, 
//   trendUp, 
//   color, 
//   sparkline,
//   alert 
// }: KpiCardProps) {
//   const [mounted, setMounted] = useState(false)

//   useEffect(() => {
//     setMounted(true)
//   }, [])

//   // ==========================================
//   // Premium SVG Path Calculation
//   // ==========================================
//   const min = Math.min(...sparkline)
//   const max = Math.max(...sparkline)
//   const range = max - min || 1

//   // Generating coordinates for the SVG (X: 0 to 100, Y: 0 to 40)
//   const points = sparkline.map((val, i) => {
//     const x = (i / (sparkline.length - 1)) * 100
//     // Padding top by 5 units so line doesn't cut off
//     const y = 38 - ((val - min) / range) * 33 
//     return { x, y }
//   })

//   const pathData = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`
//   const areaData = `${pathData} L 100,40 L 0,40 Z`
  
//   // Coordinate for the glowing dot at the end of the line
//   const lastPoint = points[points.length - 1]
//   const gradientId = `kpi-grad-${label.replace(/\s+/g, '-')}`

//   if (!mounted) {
//     return (
//       <div className="bg-[#0C0513] border border-white/5 rounded-2xl p-5 h-[140px] animate-pulse flex flex-col justify-between shadow-lg">
//         <div className="h-3 w-24 bg-white/5 rounded" />
//         <div className="h-8 w-20 bg-white/10 rounded" />
//         <div className="h-3 w-32 bg-white/5 rounded" />
//       </div>
//     )
//   }

//   return (
//     <motion.div
//       whileHover={{ y: -4, boxShadow: `0 10px 30px -10px ${color}40` }}
//       className={`bg-[#121826] border border-white/5 rounded-2xl p-5 relative overflow-hidden h-[140px] flex flex-col justify-between group transition-all duration-300 ${alert ? 'border-[#FF2D78]/30' : ''}`}
//     >
//       {/* Top Background Hover Glow */}
//       <div 
//         className="absolute -top-12 -right-12 w-32 h-32 blur-[40px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" 
//         style={{ backgroundColor: color }} 
//       />

//       {/* Alert Icon */}
//       {alert && (
//         <div className="absolute top-4 right-4 z-10">
//           <AlertCircle className="w-4 h-4 text-[#FF2D78] animate-pulse drop-shadow-[0_0_5px_#FF2D78]" />
//         </div>
//       )}
      
//       {/* Top Label */}
//       <p className="text-[10px] font-mono uppercase tracking-widest text-white/50 relative z-10">
//         {label}
//       </p>

//       {/* Center Data */}
//       <div className="relative z-10 mb-3">
//         <div className="flex items-baseline gap-1">
//           <span className="text-3xl font-bold tracking-tight text-white drop-shadow-md">
//             {prefix}
//             <CountUp end={value} duration={2} decimals={value % 1 !== 0 ? 1 : 0} />
//           </span>
//           <span className="text-lg text-white/40 font-medium">{suffix}</span>
//         </div>

//         <div className="flex items-center gap-2 mt-1">
//           <span 
//             className={`flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded border ${
//               trendUp ? 'text-[#13F287] border-[#13F287]/20 bg-[#13F287]/10' : 'text-[#FF2D78] border-[#FF2D78]/20 bg-[#FF2D78]/10'
//             }`}
//           >
//             {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
//             {trendUp ? '+' : ''}{trend}%
//           </span>
//           <span className="text-[9px] text-white/40 uppercase tracking-wider font-mono">vs last month</span>
//         </div>
//       </div>

//       {/* Bottom Absolute Custom SVG Graph */}
//       <div className="absolute bottom-0 left-0 right-0 h-[60px] pointer-events-none">
//         <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full">
//           <defs>
//             <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
//               <stop offset="0%" stopColor={color} stopOpacity="0.25" />
//               <stop offset="100%" stopColor={color} stopOpacity="0" />
//             </linearGradient>
//           </defs>
          
//           {/* Fill Area underneath the line */}
//           <motion.path 
//             d={areaData} 
//             fill={`url(#${gradientId})`} 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 1.5 }}
//           />
          
//           {/* The Sharp, Non-scaling Line */}
//           <motion.path 
//             d={pathData} 
//             fill="none" 
//             stroke={color} 
//             strokeWidth="1.5" 
//             strokeLinejoin="round"
//             strokeLinecap="round"
//             vectorEffect="non-scaling-stroke" // THIS is the magic for a thin line!
//             initial={{ pathLength: 0 }}
//             animate={{ pathLength: 1 }}
//             transition={{ duration: 1.5, ease: "easeOut" }}
//             className="opacity-70 group-hover:opacity-100 transition-opacity"
//           />

//           {/* Glowing Dot at the end of the line */}
//           <motion.circle
//             cx={lastPoint.x}
//             cy={lastPoint.y}
//             r="1.5"
//             fill="#FFFFFF"
//             vectorEffect="non-scaling-stroke"
//             initial={{ opacity: 0, scale: 0 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 1.5, duration: 0.3 }}
//             style={{ filter: `drop-shadow(0 0 4px ${color})` }}
//           />
//         </svg>
//       </div>
//     </motion.div>
//   )
// }


'use client'

import { useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import CountUp from 'react-countup'
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'

interface KpiCardProps {
  label: string
  value: number
  suffix?: string
  prefix?: string
  trend: number
  trendUp: boolean
  color: string
  sparkline: number[]
  alert?: boolean
}

// 👉 1. Premium Animated Line
const ChartLine = ({ d, color }: { d: string, color: string }) => {
  const lineControls = useAnimation()

  useEffect(() => {
    lineControls.start({
      pathLength: 1,
      transition: { duration: 1.2, delay: 0.3, ease: 'easeOut' },
    })
  }, [lineControls])

  return (
    <motion.path
      d={d}
      stroke={color}
      strokeWidth="1.2" // Ekdum sharp aur thin line
      fill="none"
      vectorEffect="non-scaling-stroke" // Mobile/Tab pe line moti nahi hogi
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={lineControls}
    />
  )
}

// 👉 2. Premium Animated Glow Area (Neeche ka gradient)
const ChartArea = ({ d, color }: { d: string, color: string }) => {
  const areaControls = useAnimation()

  useEffect(() => {
    areaControls.start({
      pathLength: 1,
      opacity: 0.2, // Subtle premium glow
      transition: { duration: 1.4, delay: 0.5, ease: 'easeOut' },
    })
  }, [areaControls])

  return (
    <motion.path
      d={d}
      fill={color}
      stroke="none"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={areaControls}
    />
  )
}

// 👉 3. Glowing Dot at the end of the line
const SparklineDot = ({ cx, cy, color }: { cx: string, cy: string, color: string }) => {
  const dotControls = useAnimation()

  useEffect(() => {
    dotControls.start({
      scale: [0, 1.3, 1],
      opacity: [0, 1],
      transition: { duration: 0.6, delay: 1.6, ease: 'easeOut' },
    })
  }, [dotControls])

  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r="2"
      fill={color}
      stroke="#ffffff"
      strokeWidth="1.5"
      initial={{ scale: 0, opacity: 0 }}
      animate={dotControls}
      style={{ filter: `drop-shadow(0 0 5px ${color})` }}
    />
  )
}

// 👉 Main KPI Card Component
export default function KpiCard({
  label,
  value,
  suffix = '',
  prefix = '',
  trend,
  trendUp,
  color,
  sparkline,
  alert,
}: KpiCardProps) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  // ==========================================
  // Premium custom SVG generation Math
  // ==========================================
  const min = Math.min(...sparkline)
  const max = Math.max(...sparkline)
  const range = max - min || 1
  const viewBoxWidth = 100
  const viewBoxHeight = 40
  const topPadding = 5
  const bottomPadding = 5

  const points = sparkline.map((val, i) => {
    const x = (i / (sparkline.length - 1)) * viewBoxWidth
    const y = topPadding + (bottomPadding - topPadding) + (viewBoxHeight - 2 * bottomPadding) * (1 - (val - min) / range)
    return { x, y }
  })

  const lineData = `M ${points.map((p) => `${p.x},${p.y}`).join(' L ')}`
  const areaData = `${lineData} L ${viewBoxWidth},${viewBoxHeight} L 0,${viewBoxHeight} Z`

  if (!mounted) {
    return (
      <div className="bg-[#0b0c1e] border border-white/5 rounded-2xl p-5 h-[130px] animate-pulse flex flex-col justify-between">
        <div className="h-3 w-24 bg-white/10 rounded" />
        <div className="h-8 w-20 bg-white/10 rounded" />
        <div className="h-3 w-32 bg-white/10 rounded" />
      </div>
    )
  }

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: `0 10px 30px -10px ${color}30` }}
      className={`bg-[#0c0d24] border border-white/5 rounded-2xl p-5 relative overflow-hidden h-[130px] flex flex-col justify-between group transition-all duration-300 ${alert ? 'border-[#FF2D78]/30' : ''}`} 
    >
      {/* Background Hover Glow */}
      <div
        className="absolute -top-12 -right-12 w-32 h-32 blur-[40px] opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: color }}
      />

      {alert && (
        <div className="absolute top-4 right-4 z-10">
          <AlertCircle className="w-4 h-4 text-[#FF2D78] animate-pulse drop-shadow-[0_0_5px_#FF2D78]" />
        </div>
      )}

      {/* Label */}
      <p className="text-[10px] font-mono uppercase tracking-widest text-white/50 relative z-10">
        {label}
      </p>

      {/* Numbers & Trend */}
      <div className="relative z-10 mb-3">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold tracking-tight text-white drop-shadow-md">
            {prefix}
            <CountUp end={value} duration={2} decimals={value % 1 !== 0 ? 1 : 0} />
          </span>
          <span className="text-lg text-white/40 font-medium">{suffix}</span>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <span
            className={`flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded border ${
              trendUp ? 'text-[#13F287] border-[#13F287]/20 bg-[#13F287]/10' : 'text-[#FF2D78] border-[#FF2D78]/20 bg-[#FF2D78]/10'
            }`}
          >
            {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trendUp ? '+' : ''}
            {trend}%
          </span>
          <span className="text-[9px] text-white/40 uppercase tracking-wider font-mono">vs last month</span>
        </div>
      </div>

      {/* Custom Animated Graph */}
      <div className="absolute bottom-0 left-0 right-0 h-[60px] pointer-events-none">
        <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full">
          {/* 1. Area Fill */}
          <ChartArea d={areaData} color={color} />
          {/* 2. Sleek Line */}
          <ChartLine d={lineData} color={color} />
          {/* 3. Glowing Dot */}
          <SparklineDot cx={String(points[points.length - 1].x)} cy={String(points[points.length - 1].y)} color={color} />
        </svg>
      </div>
    </motion.div>
  )
}
