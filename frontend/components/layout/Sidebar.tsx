'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  ClipboardList, 
  Bookmark, 
  Target, 
  Globe, 
  BarChart3, 
  Calendar, 
  Bot, 
  Settings,
  ChevronRight
} from 'lucide-react'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', badge: null, color: '#7B61FF' },
  { icon: ClipboardList, label: 'Applied Jobs', href: '/dashboard/jobs', badge: 127, color: '#00FFA3' },
  { icon: Bookmark, label: 'Saved Jobs', href: '/dashboard/saved', badge: 45, color: '#FFB800' },
  { icon: Target, label: 'AI Matches', href: '/dashboard/matches', badge: 35, color: '#00F5FF', pulse: true },
  { icon: Globe, label: 'Network', href: '/dashboard/network', badge: null, color: '#4D9FFF' },
  { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics', badge: null, color: '#FF2D78' },
  { icon: Calendar, label: 'Calendar', href: '/dashboard/calendar', badge: null, color: '#FFB800' },
  { icon: Bot, label: 'AI Tools', href: '/dashboard/ai-tools', badge: null, color: '#00FFA3' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings', badge: null, color: '#7B61FF' },
]

export default function Sidebar({ collapsed }: SidebarProps) {
  const pathname = usePathname()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 bottom-0 z-40 glass-card border-r border-border-dim rounded-none flex flex-col"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-border-dim">
        <motion.div
          animate={{ rotate: collapsed ? 0 : 360 }}
          transition={{ duration: 0.5 }}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-violet to-neon-cyan flex items-center justify-center"
        >
          <span className="font-orbitron text-white text-sm font-bold">AI</span>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const isHovered = hoveredItem === item.href

            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <motion.div
                    onHoverStart={() => setHoveredItem(item.href)}
                    onHoverEnd={() => setHoveredItem(null)}
                    whileHover={{ x: 4 }}
                    className={`relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? `bg-[${item.color}]/10 border-l-[3px]`
                        : 'hover:bg-bg-glass'
                    }`}
                    style={{
                      borderLeftColor: isActive ? item.color : 'transparent',
                      backgroundColor: isActive ? `${item.color}10` : undefined,
                    }}
                  >
                    <item.icon
                      className="w-5 h-5 flex-shrink-0 transition-colors"
                      style={{ color: isActive ? item.color : isHovered ? item.color : 'rgba(232, 234, 255, 0.5)' }}
                    />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className={`text-sm font-medium whitespace-nowrap transition-colors ${
                            isActive ? 'text-text-primary' : 'text-text-dim'
                          }`}
                          style={{ color: isActive ? item.color : undefined }}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {!collapsed && item.badge && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-mono ${
                          item.pulse ? 'animate-pulse' : ''
                        }`}
                        style={{ 
                          backgroundColor: `${item.color}20`,
                          color: item.color,
                        }}
                      >
                        {item.badge}
                      </motion.span>
                    )}
                    {collapsed && isHovered && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="absolute left-full ml-2 px-3 py-2 glass-card rounded-lg whitespace-nowrap z-50"
                      >
                        <span className="text-sm text-text-primary">{item.label}</span>
                        {item.badge && (
                          <span 
                            className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-mono"
                            style={{ backgroundColor: `${item.color}20`, color: item.color }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Card */}
      <div className="p-3 border-t border-border-dim">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-bg-glass transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-violet to-neon-cyan flex items-center justify-center text-white font-orbitron text-xs flex-shrink-0">
            JD
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <p className="text-sm font-medium text-text-primary truncate">John Doe</p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-emerald" />
                  <span className="text-[10px] text-text-dim">Online</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.aside>
  )
}
