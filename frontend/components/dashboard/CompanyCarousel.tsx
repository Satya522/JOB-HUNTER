'use client'

import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Tilt from 'react-parallax-tilt'
import { Star, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { Company } from '@/types'

interface CompanyCarouselProps {
  companies: Company[]
}

export default function CompanyCarousel({ companies }: CompanyCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return
    
    const scroll = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft += 0.5
        if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth / 2) {
          scrollRef.current.scrollLeft = 0
        }
      }
    }

    const interval = setInterval(scroll, 30)
    return () => clearInterval(interval)
  }, [isPaused])

  const duplicatedCompanies = [...companies, ...companies]

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-orbitron text-sm font-semibold text-text-primary">
          Top Company Matches
        </h3>
        <span className="text-xs font-mono text-text-dim">
          {companies.length} companies
        </span>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {duplicatedCompanies.map((company, index) => (
          <Tilt key={`${company.name}-${index}`} tiltMaxAngleX={5} tiltMaxAngleY={5}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (index % companies.length) * 0.1 }}
              className="flex-shrink-0 w-[200px] p-4 rounded-xl bg-bg-glass border border-border-dim hover:border-opacity-50 transition-all group"
              style={{ ['--hover-color' as string]: company.color }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{company.emoji}</span>
                  <div>
                    <p className="font-semibold text-sm text-text-primary">{company.name}</p>
                    {company.hot && (
                      <span className="text-[8px] font-mono px-1.5 py-0.5 rounded-full bg-neon-rose/20 text-neon-rose">
                        HOT
                      </span>
                    )}
                  </div>
                </div>
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-orbitron font-bold"
                  style={{ 
                    backgroundColor: `${company.color}20`,
                    color: company.color,
                    boxShadow: `0 0 10px ${company.color}30`
                  }}
                >
                  {company.match}%
                </div>
              </div>

              {/* Details */}
              <div className="space-y-1 mb-3">
                <p className="text-xs text-neon-emerald font-mono">{company.salary}</p>
                <p className="text-xs text-text-dim">{company.location}</p>
                <p className="text-xs text-text-dimmer">{company.days}d ago</p>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 bg-bg-deep rounded-full overflow-hidden mb-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${company.match}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: company.color }}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button 
                  onClick={() => toast.info(`Applied to ${company.name}!`)}
                  className="flex-1 py-2 rounded-lg text-xs font-mono transition-colors"
                  style={{ 
                    backgroundColor: `${company.color}20`,
                    color: company.color,
                  }}
                >
                  Apply Now
                </button>
                <button 
                  onClick={() => toast.info(`Saved ${company.name}`)}
                  className="p-2 rounded-lg bg-bg-deep text-text-dim hover:text-neon-gold transition-colors"
                >
                  <Star className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </Tilt>
        ))}
      </div>
    </div>
  )
}
