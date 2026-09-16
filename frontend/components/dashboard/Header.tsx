'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, ChevronDown, Link as LinkIcon, Download, Bell, Search,
  Settings, Globe, LogOut, Zap, Copy, Check, X, Moon
} from 'lucide-react'

// ==========================================
// 1. THEME CONTEXT DEFINED HERE (Dark & Neon Only)
// ==========================================
export type Theme = 'dark' | 'neon'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Theme Configuration
const themeConfig = {
  dark: {
    bg: 'bg-slate-950',
    header: 'bg-slate-950/90',
    border: 'border-slate-700/30',
    input: 'bg-slate-900/50 border-slate-700/30',
    text: 'text-white',
    textMuted: 'text-slate-400',
    accent: '#13F287',
    secondary: '#6200D9',
  },
  neon: {
    bg: 'bg-black',
    header: 'bg-black/90',
    border: 'border-cyan-500/30',
    input: 'bg-cyan-950/20 border-cyan-500/20',
    text: 'text-cyan-50',
    textMuted: 'text-cyan-400/60',
    accent: '#00ffff',
    secondary: '#ff00ff',
  },
}

// Notification Toast Component
const Toast = ({ message, type = 'success', duration = 3000 }: any) => {
  const [isVisible, setIsVisible] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), duration)
    return () => clearTimeout(timer)
  }, [duration])

  const bgColor = type === 'success' ? 'bg-emerald-500/20 border-emerald-500/50' : 
                  type === 'error' ? 'bg-red-500/20 border-red-500/50' :
                  'bg-blue-500/20 border-blue-500/50'

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className={`fixed top-6 right-6 px-4 py-3 rounded-xl border backdrop-blur-xl ${bgColor} text-white text-sm font-medium z-[999]`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Main Header Component
interface HeaderProps {
  setIsMobileMenuOpen?: (val: boolean) => void
  userName?: string
  handleLogout?: () => void
}

export default function PremiumHeader({
  setIsMobileMenuOpen = () => {},
  userName = 'John Doe',
  handleLogout = () => {},
}: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const config = themeConfig[theme]

  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null)
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setToast({ message: '✓ Link copied to clipboard!', type: 'success' })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setToast({ message: '✗ Failed to copy', type: 'error' })
    }
  }

  const handleDownload = () => {
    setToast({ message: '⬇ Downloading profile data...', type: 'info' })
    setTimeout(() => {
      setToast({ message: '✓ Download completed!', type: 'success' })
    }, 1500)
  }

  const handleBellClick = () => {
    setToast({ message: '🔔 You have 5 new AI job matches!', type: 'info' })
  }

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    setToast({ message: `✓ Switched to ${newTheme} mode`, type: 'success' })
    setIsProfileOpen(false)
  }

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setToast({ message: `🔍 Searching for: "${searchQuery}"`, type: 'info' })
    }
  }

  const filters = ['Date', 'Company', 'Role']

  return (
    <>
      <header
        className={`h-20 shrink-0 border-b ${config.border} ${config.header} backdrop-blur-md flex items-center justify-between px-6 z-50 sticky top-0 transition-all duration-500`}
        style={{
          background: theme === 'neon' ? 'linear-gradient(90deg, #000 0%, #0a0a0a 50%, #000 100%)' : undefined,
        }}
      >
        {/* Left Section - Logo & Brand */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4"
        >
          <motion.button
            onClick={() => setIsMobileMenuOpen(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`md:hidden ${config.textMuted} hover:${config.text} transition-colors p-2 -ml-2 rounded-lg hover:bg-white/5`}
          >
            <Menu size={22} />
          </motion.button>

          <motion.h1
            whileHover={{ scale: 1.05 }}
            className={`font-black tracking-widest text-2xl bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent`}
          >
            JOB_HUNTER<span className={`text-[${config.accent}]`}>.ai</span>
          </motion.h1>

          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`px-2.5 py-1 rounded-full bg-white/5 border ${config.border} text-white/70 font-mono text-[10px] hidden sm:block`}
          >
            v2.0.26
          </motion.span>

          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className={`w-1.5 h-1.5 rounded-full hidden sm:block`}
            style={{
              backgroundColor: config.accent,
              boxShadow: `0 0 8px ${config.accent}`,
            }}
          />
        </motion.div>

        {/* Center Section - Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="hidden lg:flex items-center gap-3"
        >
          {/* Search Box */}
          <motion.div
            whileFocus={{ scale: 1.02 }}
            className={`flex items-center gap-2 ${config.input} border rounded-xl px-3 py-1.5 focus-within:border-[${config.accent}] focus-within:shadow-[0_0_10px_rgba(19,242,135,0.2)] transition-all w-64`}
          >
            <Search size={14} className={config.textMuted} />
            <input
              type="text"
              placeholder="Search jobs, skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className={`${config.input} border-none outline-none text-xs w-full ${config.text} placeholder:${config.textMuted} font-mono`}
            />
          </motion.div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2">
            {filters.map((filter, idx) => (
              <motion.button
                key={filter}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setActiveFilter(activeFilter === filter ? null : filter)
                  setToast({ message: `📊 Filtered by: ${filter}`, type: 'info' })
                }}
                className={`px-3 py-1.5 rounded-xl border font-mono text-[11px] transition-all whitespace-nowrap ${
                  activeFilter === filter
                    ? `bg-[${config.accent}]/10 border-[${config.accent}] text-[${config.accent}]`
                    : `${config.input} border-${config.border.split('-')[1]} ${config.textMuted} hover:${config.text} hover:border-white/20`
                }`}
                style={{
                  backgroundColor: activeFilter === filter ? `${config.accent}10` : undefined,
                  borderColor: activeFilter === filter ? config.accent : undefined,
                  color: activeFilter === filter ? config.accent : undefined,
                  boxShadow: activeFilter === filter ? `inset 0 0 10px ${config.accent}20` : undefined,
                }}
              >
                {filter}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Right Section - Icons & Profile */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-5 relative"
        >
          {/* Action Icons */}
          <div className="hidden sm:flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCopyLink}
              className={`${config.textMuted} hover:text-[${config.accent}] transition-all relative group`}
            >
              {copied ? (
                <Check size={16} className="text-emerald-400" />
              ) : (
                <LinkIcon size={16} className="group-hover:scale-110 transition-transform" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDownload}
              className={`${config.textMuted} hover:text-[${config.accent}] transition-all relative group`}
            >
              <Download size={16} className="group-hover:scale-110 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleBellClick}
              className={`relative text-[${config.textMuted}] hover:text-[${config.accent}] transition-all group`}
            >
              <Bell size={18} className="group-hover:scale-110 transition-transform" />
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-[${config.secondary}] text-[#0C0513] text-[8px] font-bold rounded-full flex items-center justify-center`}
                style={{
                  backgroundColor: config.secondary,
                  boxShadow: `0 0 8px ${config.secondary}`,
                }}
              >
                5
              </motion.span>
            </motion.button>
          </div>

          {/* Profile Section */}
          <div className={`flex items-center gap-4 border-l ${config.border} pl-5 relative`}>
            <motion.button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 outline-none group"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center font-bold text-[#0C0513] text-xs`}
                style={{ boxShadow: `0 0 12px ${config.accent}` }}
              >
                JD
              </motion.div>
              <motion.div
                animate={{ rotate: isProfileOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className={`${config.textMuted} group-hover:${config.text} transition-colors hidden sm:block`}
              >
                <ChevronDown size={14} />
              </motion.div>
            </motion.button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute top-14 right-0 w-64 ${config.header} border ${config.border} rounded-xl shadow-2xl py-2 z-[60] backdrop-blur-xl`}
                >
                  {/* User Info */}
                  <div className={`px-4 py-3 border-b ${config.border} mb-1`}>
                    <p className={`text-sm ${config.text} font-medium`}>{userName}</p>
                    <p className="text-[10px] text-cyan-400 font-mono mt-1">PRO ACCOUNT</p>
                  </div>

                  {/* Settings Button */}
                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={() => { setIsProfileOpen(false) }}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-xs ${config.textMuted} hover:text-[${config.accent}] hover:bg-white/5 transition-colors`}
                  >
                    <Settings size={14} /> Account Settings
                  </motion.button>

                  {/* Public Profile Button */}
                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={() => { setIsProfileOpen(false) }}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-xs ${config.textMuted} hover:text-[${config.accent}] hover:bg-white/5 transition-colors`}
                  >
                    <Globe size={14} /> Public Profile
                  </motion.button>

                  {/* 👉 NEW CIRCULAR/PILL THEME SWITCHER */}
                  <motion.div className={`border-t ${config.border} mt-2 pt-3 px-4 py-2`}>
                    <p className={`text-[10px] ${config.textMuted} uppercase tracking-wide mb-2`}>Theme</p>
                    <div className={`flex gap-1 p-1 rounded-full border ${config.border} bg-white/5`}>
                      {(['dark', 'neon'] as const).map((t) => (
                        <motion.button
                          key={t}
                          onClick={() => handleThemeChange(t)}
                          className={`flex-1 py-1.5 flex items-center justify-center gap-2 rounded-full text-[10px] font-mono transition-all duration-300 ${
                            theme === t 
                              ? `bg-[${config.accent}]/20 text-[${config.accent}] shadow-[0_0_10px_rgba(19,242,135,0.2)]` 
                              : `${config.textMuted} hover:text-white`
                          }`}
                        >
                          {t === 'dark' ? <Moon size={12} /> : <Zap size={12} />}
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Sign Out Button */}
                  <motion.div className={`border-t ${config.border} mt-3 pt-2`}>
                    <motion.button
                      whileHover={{ x: 4 }}
                      onClick={() => {
                        setToast({ message: '👋 Logging out...', type: 'info' })
                        setTimeout(() => {
                          handleLogout()
                          setIsProfileOpen(false)
                        }, 1500)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={14} /> Sign Out
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </header>

      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  )
}