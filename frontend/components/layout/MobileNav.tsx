'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  ClipboardList, 
  BarChart3, 
  Calendar, 
  Bot,
  Menu,
  X
} from 'lucide-react'

const mobileNavItems = [
  { icon: LayoutDashboard, label: 'Home', href: '/dashboard' },
  { icon: ClipboardList, label: 'Jobs', href: '/dashboard/jobs' },
  { icon: BarChart3, label: 'Stats', href: '/dashboard/analytics' },
  { icon: Calendar, label: 'Calendar', href: '/dashboard/calendar' },
  { icon: Bot, label: 'AI', href: '/dashboard/ai-tools' },
]

export default function MobileNav() {
  const pathname = usePathname()
  const [showMenu, setShowMenu] = useState(false)

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-border-dim rounded-none lg:hidden">
        <div className="flex items-center justify-around py-2">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${
                    isActive ? 'text-neon-violet' : 'text-text-dim'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-[10px] font-mono">{item.label}</span>
                </motion.div>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden"
            onClick={() => setShowMenu(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 glass-card rounded-t-3xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-orbitron text-lg font-semibold">Menu</h3>
                <button 
                  onClick={() => setShowMenu(false)}
                  className="p-2 rounded-lg hover:bg-bg-glass"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* Additional menu items can go here */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
