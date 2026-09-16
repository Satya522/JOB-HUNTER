'use client'

import { motion } from 'framer-motion'
import { 
  PenTool, 
  FileText, 
  GitBranch, 
  Target, 
  Linkedin, 
  Calendar 
} from 'lucide-react'
import { toast } from 'sonner'

const actions = [
  { icon: PenTool, label: 'Generate Cover Letter', color: '#00F5FF', ai: true },
  { icon: FileText, label: 'Optimize Resume', color: '#7B61FF', ai: true },
  { icon: GitBranch, label: 'Track Pipeline', color: '#FF2D78', ai: false },
  { icon: Target, label: 'AI Job Matches', color: '#00FFA3', ai: true, pulse: true },
  { icon: Linkedin, label: 'LinkedIn Sync', color: '#4D9FFF', ai: false },
  { icon: Calendar, label: 'Interview Prep', color: '#FFB800', ai: false },
]

export default function QuickActions() {
  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-orbitron text-sm font-semibold text-text-primary mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -2, boxShadow: `0 0 20px ${action.color}40` }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toast.info(`${action.label} coming soon!`)}
            className="relative p-4 rounded-xl bg-bg-glass border border-border-dim hover:border-opacity-50 transition-all text-left group"
            style={{ ['--hover-color' as string]: action.color }}
          >
            {action.ai && (
              <span className={`absolute top-2 right-2 text-[8px] font-mono px-1.5 py-0.5 rounded-full ${action.pulse ? 'animate-pulse' : ''}`}
                style={{ backgroundColor: `${action.color}30`, color: action.color }}
              >
                AI
              </span>
            )}
            <action.icon 
              className="w-5 h-5 mb-2 transition-colors group-hover:text-[var(--hover-color)]" 
              style={{ color: action.color }}
            />
            <span className="text-xs text-text-primary block leading-tight">
              {action.label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Mock WebSocket Feed */}
      <div className="mt-4 pt-4 border-t border-border-dim">
        <div className="flex items-center gap-2 text-xs font-mono text-text-dim">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-emerald animate-pulse" />
          <span className="truncate">📡 LIVE: ML Engineer @ Tesla posted now</span>
        </div>
      </div>
    </div>
  )
}
