'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

const platforms = [
  {
    id: 'leetcode',
    name: 'LeetCode',
    color: '#FFA116',
    icon: '🔥',
    stats: { solved: 342, easy: 120, medium: 180, hard: 42, streak: 45, ranking: 12543 },
  },
  {
    id: 'gfg',
    name: 'GeeksforGeeks',
    color: '#2F8D46',
    icon: '📚',
    stats: { score: 1250, solved: 156, instituteRank: 23, streak: 30 },
  },
  {
    id: 'codingninjas',
    name: 'Coding Ninjas',
    color: '#F0631A',
    icon: '⚔️',
    stats: { solved: 89, courses: 3, points: 4500 },
  },
  {
    id: 'github',
    name: 'GitHub',
    color: '#E8EAFF',
    icon: '🐙',
    stats: { repos: 45, stars: 234, contributions: 892, followers: 156 },
  },
]

export default function CodingStats() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      toast.success('Coding stats refreshed!')
    }, 1500)
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-orbitron text-lg font-semibold text-text-primary">
          ⚡ CODING PROFILE
        </h3>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg hover:bg-bg-glass text-text-dim transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {platforms.map((platform, index) => (
          <motion.div
            key={platform.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl bg-bg-glass border border-border-dim hover:border-opacity-50 transition-all"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">{platform.icon}</span>
                <span className="font-semibold text-sm" style={{ color: platform.color }}>
                  {platform.name}
                </span>
              </div>
              <button 
                onClick={() => toast.info(`Connecting to ${platform.name}...`)}
                className="p-1.5 rounded-lg hover:bg-bg-deep text-text-dim transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* Stats */}
            <div className="space-y-2">
              {platform.id === 'leetcode' && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-dim">Solved</span>
                    <span className="font-mono text-neon-emerald">{platform.stats.solved}</span>
                  </div>
                  <div className="flex gap-1 h-2">
                    <div className="flex-1 rounded-full bg-neon-emerald/60" style={{ width: `${(platform.stats.easy / platform.stats.solved) * 100}%` }} />
                    <div className="flex-1 rounded-full bg-neon-gold/60" style={{ width: `${(platform.stats.medium / platform.stats.solved) * 100}%` }} />
                    <div className="flex-1 rounded-full bg-neon-rose/60" style={{ width: `${(platform.stats.hard / platform.stats.solved) * 100}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-text-dimmer">
                    <span className="text-neon-emerald">{platform.stats.easy} Easy</span>
                    <span className="text-neon-gold">{platform.stats.medium} Med</span>
                    <span className="text-neon-rose">{platform.stats.hard} Hard</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-border-dim">
                    <span className="text-text-dim">Streak</span>
                    <span className="font-mono text-neon-cyan">{platform.stats.streak} days</span>
                  </div>
                </>
              )}

              {platform.id === 'gfg' && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-dim">Coding Score</span>
                    <span className="font-mono" style={{ color: platform.color }}>{platform.stats.score}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-dim">Problems Solved</span>
                    <span className="font-mono text-neon-emerald">{platform.stats.solved}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-dim">Institute Rank</span>
                    <span className="font-mono text-neon-cyan">#{platform.stats.instituteRank}</span>
                  </div>
                </>
              )}

              {platform.id === 'codingninjas' && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-dim">Problems Solved</span>
                    <span className="font-mono text-neon-emerald">{platform.stats.solved}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-dim">Courses</span>
                    <span className="font-mono text-neon-cyan">{platform.stats.courses}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-dim">Points</span>
                    <span className="font-mono text-neon-gold">{platform.stats.points}</span>
                  </div>
                </>
              )}

              {platform.id === 'github' && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-dim">Repositories</span>
                    <span className="font-mono text-neon-cyan">{platform.stats.repos}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-dim">Total Stars</span>
                    <span className="font-mono text-neon-gold">⭐ {platform.stats.stars}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-dim">Contributions</span>
                    <span className="font-mono text-neon-emerald">{platform.stats.contributions}</span>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
