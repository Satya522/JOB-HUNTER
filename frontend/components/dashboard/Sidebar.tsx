// components/dashboard/Sidebar.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, ClipboardList, Bookmark, Target, Globe, 
  BarChart2, Calendar, Bot, Settings, LogOut 
} from 'lucide-react'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'applied_jobs', label: 'Applied Jobs', icon: ClipboardList, badge: '127' },
  { id: 'saved_jobs', label: 'Saved Jobs', icon: Bookmark, badge: '45' },
  { id: 'ai_matches', label: 'AI Matches', icon: Target, badge: '35' },
  { id: 'network', label: 'Network', icon: Globe },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'ai_tools', label: 'AI Tools', icon: Bot },
  { id: 'settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (val: boolean) => void
  userName: string
  handleLogout: () => void
}

export default function Sidebar({ activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen, userName, handleLogout }: SidebarProps) {
  return (
    <>
      {/* 👉 Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[90] md:hidden cursor-pointer"
          />
        )}
      </AnimatePresence>

      {/* 👉 The Sidebar Itself */}
      <aside className={`
        fixed md:relative top-0 left-0 h-screen z-[100] md:z-20
        w-[260px] shrink-0 border-r border-white/5 bg-[#0C0513] flex flex-col justify-between
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0 shadow-[20px_0_50px_rgba(0,0,0,0.5)]' : '-translate-x-full md:translate-x-0'}
      `}>
        <div>
          <div className="h-20 flex items-center justify-center px-6 border-b border-transparent">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#6200D9] to-[#13F287] flex items-center justify-center shadow-[0_0_15px_rgba(19,242,135,0.4)]">
              <span className="font-orbitron font-bold text-white text-lg">AI</span>
            </div>
          </div>

          <nav className="p-4 space-y-1 mt-4 overflow-y-auto max-h-[calc(100vh-200px)] scrollbar-hide">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setIsMobileMenuOpen(false) 
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
                    isActive ? 'bg-[#13F287]/10 border border-[#13F287]/30 text-[#13F287]' : 'border border-transparent text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className={isActive ? 'text-[#13F287]' : 'text-white/50 group-hover:text-white transition-colors'} />
                    <span className={`font-mono text-[13px] tracking-wide ${isActive ? 'font-medium' : ''}`}>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border transition-colors ${
                      isActive ? 'text-[#13F287] border-[#13F287]/50 bg-[#13F287]/10' : 'text-white/40 border-white/10 bg-white/5 group-hover:border-[#13F287]/30 group-hover:text-[#13F287]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t border-white/5 bg-[#0C0513]">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-tr from-[#13F287] to-[#6200D9] flex items-center justify-center font-orbitron font-bold text-[#0C0513] shadow-[0_0_10px_rgba(19,242,135,0.3)]">
              JD
            </div>
            <div className="flex-1 text-left overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{userName}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#13F287] animate-pulse" />
                <p className="text-[10px] text-white/50 font-mono">Online</p>
              </div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 text-white/50 hover:text-[#FF2D78] hover:bg-[#FF2D78]/10 transition-colors w-full px-4 py-2.5 rounded-xl border border-transparent hover:border-[#FF2D78]/20"
          >
            <LogOut size={14} />
            <span className="font-mono text-[11px] uppercase tracking-wider">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}