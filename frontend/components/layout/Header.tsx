'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  Search, 
  Bell, 
  Download, 
  Pill,
  Accessibility,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  Settings,
  User,
  CreditCard
} from 'lucide-react'
import { toast } from 'sonner'

interface HeaderProps {
  onMenuClick: () => void
  matrixMode: boolean
  onMatrixToggle: () => void
}

const notifications = [
  { id: 1, icon: '🎯', text: 'New AI match: Senior ML Engineer at OpenAI', time: '2 min ago', color: '#00FFA3' },
  { id: 2, icon: '📅', text: 'Interview reminder: DeepMind (Tomorrow 10 AM)', time: '1 hour ago', color: '#FFB800' },
  { id: 3, icon: '👁️', text: 'Google viewed your application', time: '3 hours ago', color: '#7B61FF' },
  { id: 4, icon: '🎊', text: 'Offer received from LinkedIn!', time: '1 day ago', color: '#00FFA3' },
  { id: 5, icon: '✨', text: 'Resume optimization complete', time: '2 days ago', color: '#00F5FF' },
]

export default function Header({ onMenuClick, matrixMode, onMatrixToggle }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleExport = (type: 'pdf' | 'csv') => {
    toast.success(`Exporting as ${type.toUpperCase()}...`)
    setShowExportMenu(false)
  }

  return (
    <header className="sticky top-0 z-50 h-16 glass-card border-b border-border-dim rounded-none flex items-center justify-between px-4 lg:px-6">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-bg-glass transition-colors"
        >
          <Menu className="w-5 h-5 text-text-dim" />
        </motion.button>
        
        <div className="hidden md:flex items-center gap-3">
          <motion.span 
            className="font-orbitron text-lg font-bold text-gradient"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            JOB_HUNTER.ai
          </motion.span>
          <span className="px-2 py-0.5 rounded-full bg-neon-violet/20 text-neon-violet text-[10px] font-mono border border-neon-violet/30">
            v2.0.26
          </span>
          <span className="w-2 h-2 rounded-full bg-neon-emerald pulse-dot" />
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="hidden lg:flex items-center gap-4 flex-1 max-w-2xl mx-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search applications, companies, roles..."
            className="w-full bg-bg-glass border border-border-dim rounded-xl py-2 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-dimmer focus:outline-none focus:border-neon-cyan transition-all"
          />
        </div>
        <div className="flex gap-2">
          {['Date', 'Company', 'Role', 'Status'].map((filter) => (
            <button
              key={filter}
              className="px-3 py-1.5 rounded-lg bg-bg-glass border border-border-dim text-xs font-mono text-text-dim hover:text-text-primary hover:border-neon-violet/30 transition-all"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Matrix Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onMatrixToggle}
          className={`p-2 rounded-lg transition-colors ${matrixMode ? 'bg-neon-emerald/20 text-neon-emerald' : 'hover:bg-bg-glass text-text-dim'}`}
          title="Toggle Matrix Mode"
        >
          <Pill className="w-4 h-4" />
        </motion.button>

        {/* High Contrast */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hidden sm:flex p-2 rounded-lg hover:bg-bg-glass text-text-dim transition-colors"
          title="High Contrast"
        >
          <Accessibility className="w-4 h-4" />
        </motion.button>

        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hidden sm:flex p-2 rounded-lg hover:bg-bg-glass text-text-dim transition-colors"
        >
          <Moon className="w-4 h-4" />
        </motion.button>

        {/* Export */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="hidden sm:flex p-2 rounded-lg hover:bg-bg-glass text-text-dim transition-colors"
          >
            <Download className="w-4 h-4" />
          </motion.button>
          <AnimatePresence>
            {showExportMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 top-full mt-2 w-40 glass-card rounded-xl overflow-hidden z-50"
              >
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full px-4 py-3 text-left text-sm text-text-primary hover:bg-bg-glass transition-colors flex items-center gap-2"
                >
                  <span>📄</span> Export PDF
                </button>
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full px-4 py-3 text-left text-sm text-text-primary hover:bg-bg-glass transition-colors flex items-center gap-2"
                >
                  <span>📊</span> Export CSV
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-bg-glass text-text-dim transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-neon-rose text-[8px] font-mono flex items-center justify-center text-white">
              5
            </span>
          </motion.button>
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-80 glass-card rounded-xl overflow-hidden z-50"
              >
                <div className="p-4 border-b border-border-dim flex items-center justify-between">
                  <h4 className="font-orbitron text-sm font-semibold">Notifications</h4>
                  <button className="text-xs text-neon-cyan hover:text-neon-violet transition-colors">
                    Mark all read
                  </button>
                </div>
                <div className="max-h-80 overflow-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-4 border-b border-border-dim hover:bg-bg-glass transition-colors flex gap-3"
                    >
                      <div 
                        className="w-1 rounded-full flex-shrink-0"
                        style={{ backgroundColor: notif.color }}
                      />
                      <div className="flex-1">
                        <p className="text-sm text-text-primary">{notif.icon} {notif.text}</p>
                        <p className="text-xs text-text-dim mt-1">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-border-dim">
                  <button className="w-full text-center text-xs text-neon-cyan hover:text-neon-violet transition-colors">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Menu */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-bg-glass transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-violet to-neon-cyan flex items-center justify-center text-white font-orbitron text-sm">
              JD
            </div>
            <ChevronDown className="w-4 h-4 text-text-dim hidden sm:block" />
          </motion.button>
          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-56 glass-card rounded-xl overflow-hidden z-50"
              >
                <div className="p-4 border-b border-border-dim">
                  <p className="font-semibold text-text-primary">John Doe</p>
                  <p className="text-xs text-text-dim">john.doe@email.com</p>
                </div>
                <div className="py-2">
                  {[
                    { icon: User, label: 'Profile', shortcut: '⌘P' },
                    { icon: Settings, label: 'Settings', shortcut: '⌘S' },
                    { icon: CreditCard, label: 'Billing', shortcut: '⌘B' },
                  ].map((item) => (
                    <button
                      key={item.label}
                      className="w-full px-4 py-2.5 text-left text-sm text-text-primary hover:bg-bg-glass transition-colors flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <item.icon className="w-4 h-4 text-text-dim" />
                        {item.label}
                      </span>
                      <span className="text-xs text-text-dimmer">{item.shortcut}</span>
                    </button>
                  ))}
                </div>
                <div className="border-t border-border-dim py-2">
                  <button
                    onClick={() => toast.info('Logged out')}
                    className="w-full px-4 py-2.5 text-left text-sm text-neon-rose hover:bg-neon-rose/10 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Date */}
        <div className="hidden xl:block font-mono text-xs text-text-dim">
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>
    </header>
  )
}
