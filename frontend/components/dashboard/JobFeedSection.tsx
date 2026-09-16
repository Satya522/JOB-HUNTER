'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, DollarSign, Clock, ExternalLink, Bookmark, Share2, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { JobFeedItem } from '@/types'

const filters = ['All', 'Thane', 'Mumbai', 'Remote', 'India', 'Global']

const mockJobs: JobFeedItem[] = [
  {
    id: '1',
    source: 'Remotive',
    company: 'Stripe',
    title: 'Senior ML Engineer',
    location: 'Remote',
    salary: '$180k - $250k',
    postedAt: '2 hours ago',
    matchPercentage: 94,
    tags: ['Python', 'TensorFlow', 'AWS'],
    url: '#',
  },
  {
    id: '2',
    source: 'Jobicy',
    company: 'DataRobot',
    title: 'AI Research Scientist',
    location: 'Mumbai, India',
    salary: '$120k - $180k',
    postedAt: '4 hours ago',
    matchPercentage: 89,
    tags: ['PyTorch', 'NLP', 'Research'],
    url: '#',
  },
  {
    id: '3',
    source: 'Adzuna',
    company: 'Oracle',
    title: 'Machine Learning Engineer',
    location: 'Thane, India',
    salary: '$100k - $150k',
    postedAt: '6 hours ago',
    matchPercentage: 85,
    tags: ['Java', 'Spark', 'ML'],
    url: '#',
  },
  {
    id: '4',
    source: 'TheMuse',
    company: 'Spotify',
    title: 'Data Scientist',
    location: 'Remote',
    salary: '$140k - $200k',
    postedAt: '1 day ago',
    matchPercentage: 82,
    tags: ['Python', 'SQL', 'Statistics'],
    url: '#',
  },
]

export default function JobFeedSection() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [isLoading, setIsLoading] = useState(false)
  const [jobs, setJobs] = useState(mockJobs)

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast.success('Job feed refreshed!')
    }, 1500)
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="font-orbitron text-lg font-semibold text-text-primary">
            📍 LIVE JOB FEED
          </h3>
          <span className="w-2 h-2 rounded-full bg-neon-rose pulse-dot" />
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 rounded-lg hover:bg-bg-glass text-text-dim transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>
      </div>

      <p className="text-sm text-text-dim mb-4">
        Jobs near Thane · Mumbai · Remote — Updated live
      </p>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all ${
              activeFilter === filter
                ? 'bg-neon-violet/20 text-neon-violet border border-neon-violet/30'
                : 'bg-bg-glass text-text-dim border border-border-dim hover:text-text-primary'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Job Cards */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[280px] h-[200px] rounded-xl bg-bg-glass animate-pulse" />
          ))
        ) : (
          jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-[280px] p-4 rounded-xl bg-bg-glass border border-border-dim hover:border-neon-violet/30 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-bg-deep text-text-dim">
                    {job.source}
                  </span>
                  <h4 className="font-semibold text-text-primary mt-2">{job.title}</h4>
                  <p className="text-sm text-text-dim">{job.company}</p>
                </div>
                <span 
                  className="px-2 py-1 rounded-full text-[10px] font-mono"
                  style={{ 
                    backgroundColor: job.matchPercentage >= 90 ? '#00FFA320' : '#FFB80020',
                    color: job.matchPercentage >= 90 ? '#00FFA3' : '#FFB800',
                  }}
                >
                  {job.matchPercentage}% match
                </span>
              </div>

              {/* Details */}
              <div className="space-y-1 mb-3">
                <div className="flex items-center gap-2 text-xs text-text-dim">
                  <MapPin className="w-3 h-3" />
                  {job.location}
                </div>
                <div className="flex items-center gap-2 text-xs text-text-dim">
                  <DollarSign className="w-3 h-3" />
                  {job.salary}
                </div>
                <div className="flex items-center gap-2 text-xs text-text-dim">
                  <Clock className="w-3 h-3" />
                  {job.postedAt}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {job.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded bg-bg-deep text-text-dim"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button 
                  onClick={() => toast.info(`Applied to ${job.company}!`)}
                  className="flex-1 py-2 rounded-lg bg-neon-violet/20 text-neon-violet text-xs font-mono hover:bg-neon-violet/30 transition-colors"
                >
                  Apply Now
                </button>
                <button 
                  onClick={() => toast.info(`Saved ${job.title}`)}
                  className="p-2 rounded-lg bg-bg-deep text-text-dim hover:text-neon-gold transition-colors"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => toast.info('Link copied!')}
                  className="p-2 rounded-lg bg-bg-deep text-text-dim hover:text-text-primary transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
