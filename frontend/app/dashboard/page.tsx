'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

// 👉 Extracted Layout Components 
import Sidebar from '@/components/dashboard/Sidebar'
// 🔥 IMPORT ThemeProvider aur useTheme directly Header se!
import Header, { ThemeProvider, useTheme } from '@/components/dashboard/Header'

// 👉 Dashboard Specific Components
import KpiCard from '@/components/dashboard/KpiCard'
import CompanyCarousel from '@/components/dashboard/CompanyCarousel'
import LiveTicker from '@/components/dashboard/LiveTicker'
import ActivityTimeline from '@/components/dashboard/ActivityTimeline'
import AiInsightsPanel from '@/components/dashboard/AiInsightsPanel'
import JobFeedSection from '@/components/dashboard/JobFeedSection'
import CodingStats from '@/components/dashboard/CodingStats'
import PipelineSection from '@/components/dashboard/PipelineSection'
import GaugesRow from '@/components/dashboard/GaugesRow'
import QuickActions from '@/components/dashboard/QuickActions'
import ApplicationLineChart from '@/components/charts/ApplicationLineChart'
import StatusDoughnut from '@/components/charts/StatusDoughnut'
import SkillsRadar from '@/components/charts/SkillsRadar'
import SalaryScatter from '@/components/charts/SalaryScatter'
import NivoSkillsBar from '@/components/charts/NivoSkillsBar'
import ActivityHeatmap from '@/components/charts/ActivityHeatmap'
import CalendarView from '@/components/dashboard/CalendarView'
import AppliedJobsBoard from '@/components/dashboard/AppliedJobsBoard' // 
// AI TOOL KA IMPORT 
import AiToolsHub from '@/components/dashboard/AiToolsHub'

// ==========================================
// MOCK DATA 
// ==========================================
const Colors = { cyan: '#13F287', purple: '#6200D9', magenta: '#DB66FF' }

const kpiData = [
  { label: 'Total Applications', value: 127, trend: 12, trendUp: true, color: Colors.cyan, sparkline: [80, 85, 92, 88, 95, 102, 98, 105, 112, 118, 122, 127] },
  { label: 'Response Rate', value: 64, suffix: '%', trend: 5, trendUp: true, color: Colors.magenta, sparkline: [55, 58, 56, 60, 59, 62, 61, 63, 62, 64, 63, 64], alert: true },
  { label: 'AI Matches', value: 35, trend: 8, trendUp: true, color: Colors.cyan, sparkline: [20, 22, 25, 24, 26, 28, 27, 29, 31, 33, 34, 35] },
  { label: 'Avg Response Time', value: 3.2, suffix: 'd', trend: 0.4, trendUp: false, color: Colors.purple, sparkline: [4.5, 4.2, 4.0, 3.8, 3.9, 3.7, 3.6, 3.5, 3.4, 3.3, 3.2, 3.2] },
  { label: 'Success Rate', value: 22, suffix: '%', trend: 3, trendUp: true, color: Colors.cyan, sparkline: [15, 16, 17, 16, 18, 17, 19, 18, 20, 21, 21, 22] },
  { label: 'Cost per App', value: 45, prefix: '$', trend: 5, trendUp: false, color: Colors.magenta, sparkline: [55, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 45] },
]

const companies = [
  { name: 'OpenAI', match: 96, emoji: '🤖', salary: '$180k–240k', location: 'SF', days: 5, color: Colors.cyan, hot: true },
  { name: 'Anthropic', match: 94, emoji: '🧠', salary: '$200k–280k', location: 'SF', days: 2, color: Colors.purple, hot: true },
  { name: 'DeepMind', match: 89, emoji: '🔬', salary: '$190k–260k', location: 'Remote', days: 4, color: Colors.cyan, hot: true },
  { name: 'Google', match: 88, emoji: '🔍', salary: '$170k–220k', location: 'Remote', days: 8, color: Colors.magenta, hot: false },
]

const pipelineData = [
  { stage: 'Applied', count: 127, color: Colors.cyan },
  { stage: 'Phone Screen', count: 48, color: Colors.purple },
  { stage: 'Technical', count: 28, color: Colors.magenta },
  { stage: 'Interview', count: 22, color: Colors.cyan },
  { stage: 'Offer', count: 8, color: Colors.cyan },
]

const timelineEvents = [
  { type: 'applied', icon: '🚀', color: Colors.cyan, text: 'Applied to ML Engineer at OpenAI', company: 'OpenAI', time: '2 hours ago' },
  { type: 'match', icon: '🎯', color: Colors.cyan, text: 'AI match found: Senior Data Scientist at Anthropic', company: 'Anthropic', time: '4 hours ago' },
  { type: 'viewed', icon: '👁️', color: Colors.purple, text: 'Google viewed your application', company: 'Google', time: '6 hours ago' },
]

type InsightPriority = "critical" | "forecast" | "optimize" | "timing" | "network" | "skill";

const aiInsights: Array<{
  priority: InsightPriority;
  icon: string;
  text: string;
  action: string;
  color: string;
}> = [
  { priority: 'critical', icon: '⚠️', text: 'LinkedIn converting 2.1% vs 8.4% direct email — shift strategy', action: 'View Analysis', color: Colors.magenta },
  { priority: 'forecast', icon: '🔮', text: '3 offers predicted in next 7 days based on pipeline', action: 'View Pipeline', color: Colors.cyan },
  { priority: 'optimize', icon: '✨', text: 'Add "RLHF" + "RAG Systems" keywords → ATS score 96%', action: 'Optimize Resume', color: Colors.cyan },
]

const gaugeData = [
  { label: 'ATS Score', value: 91, unit: '%', color: Colors.cyan },
  { label: 'Response', value: 64, unit: '%', color: Colors.magenta },
  { label: 'Profile Views', value: 78, unit: '%', color: Colors.purple },
  { label: 'Success', value: 22, unit: '%', color: Colors.cyan },
]

// ==========================================
// MAIN LAYOUT WRAPPER (Fixes the Context Error)
// ==========================================
export default function MainDashboardLayout() {
  return (
    <ThemeProvider>
      <DashboardContent />
    </ThemeProvider>
  )
}

// ==========================================
// DASHBOARD CONTENT
// ==========================================
function DashboardContent() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState('John Doe') 
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const { theme } = useTheme() 

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Unauthorized Access!')
      router.push('/login')
    } else {
      setIsLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    toast.success('Logged out successfully')
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0C0513] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#13F287] border-t-transparent animate-spin" />
      </div>
    )
  }

 const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView /> 
      case 'applied_jobs': return <AppliedJobsBoard /> // 👉 KANBAN BOARD LINKED HERE
      case 'saved_jobs': return <div className="text-white p-6 font-mono">Saved Jobs Module (Pending...)</div>
      case 'calendar': return <CalendarView /> 
      case 'ai_tools': return <AiToolsHub /> // 👉 AI TOOLS HUB ADDED HERE
      default: return <div className="text-white p-6 font-mono">Module under construction...</div>
    }
  }

  return (
    <div className={`min-h-screen text-white flex overflow-hidden font-sans selection:bg-[#13F287]/30 relative transition-colors duration-500 ${theme === 'neon' ? 'bg-[#000000]' : 'bg-[#0C0513]'}`}>
      
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        userName={userName}
        handleLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col h-screen relative bg-transparent min-w-0">
        
        {/* Main Content Header */}
        <div className="flex items-center justify-between z-20">
          <div className="flex-1">
            <Header 
              setIsMobileMenuOpen={setIsMobileMenuOpen}
              userName={userName}
              handleLogout={handleLogout}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 z-10 relative scrollbar-hide">
          
          {/* Background Glows */}
          <div className={`absolute top-20 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none transition-all duration-700 ${
            theme === 'neon' ? 'bg-[#6200D9]/20 blur-[100px]' : 'bg-[#6200D9]/5 blur-[150px]'
          }`} />
          <div className={`absolute bottom-20 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none transition-all duration-700 ${
            theme === 'neon' ? 'bg-[#13F287]/15 blur-[100px]' : 'bg-[#13F287]/5 blur-[150px]'
          }`} />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

// ==========================================
// DASHBOARD VIEW (Main Graphs & Stats)
// ==========================================
function DashboardView() {
  const { theme } = useTheme()
  const cardBgClass = theme === 'neon' ? 'bg-[#0A0F18] border-[#13F287]/30 shadow-[0_0_20px_rgba(19,242,135,0.05)]' : 'bg-[#121826] border-white/5'

  return (
    <div className="space-y-6 pb-20">
      <div className={`w-full rounded-xl p-3 flex items-center justify-between border transition-all duration-500 ${
        theme === 'neon' ? 'bg-[#13F287]/10 border-[#13F287]/50 shadow-[0_0_15px_rgba(19,242,135,0.2)]' : 'bg-[#13F287]/5 border-[#13F287]/20'
      }`}>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-[#13F287] text-[10px] font-mono font-bold tracking-widest uppercase">
            <span className={`w-1.5 h-1.5 rounded-full bg-[#13F287] ${theme === 'neon' ? 'animate-ping' : 'animate-pulse'}`} /> LIVE
          </span>
          <span className="text-xs text-white/80 font-mono">AI/ML job market up 23% this month</span>
        </div>
      </div>

      <LiveTicker />

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4">
          {kpiData.map((kpi, index) => (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <KpiCard {...kpi} />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2"><CompanyCarousel companies={companies} /></div>
        <div><QuickActions /></div>
      </section>

      <section><JobFeedSection /></section>
      <section><CodingStats /></section>
      <section><PipelineSection data={pipelineData} /></section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`rounded-2xl p-6 transition-all duration-500 ${cardBgClass}`}>
          <h3 className="font-orbitron text-lg font-semibold text-white mb-4">Skills vs Salary</h3>
          <div className="h-[300px]"><SalaryScatter /></div>
        </div>
        <div className={`rounded-2xl p-6 transition-all duration-500 ${cardBgClass}`}>
          <h3 className="font-orbitron text-lg font-semibold text-white mb-4">Top Skills Demand</h3>
          <div className="h-[300px]"><NivoSkillsBar /></div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`rounded-2xl p-6 transition-all duration-500 ${cardBgClass}`}>
          <h3 className="font-orbitron text-sm font-semibold text-white mb-4">Applications</h3>
          <div className="h-[200px]"><ApplicationLineChart /></div>
        </div>
        <div className={`rounded-2xl p-6 transition-all duration-500 ${cardBgClass}`}>
          <h3 className="font-orbitron text-sm font-semibold text-white mb-4">Status Distribution</h3>
          <div className="h-[200px]"><StatusDoughnut /></div>
        </div>
        <div className={`rounded-2xl p-6 transition-all duration-500 ${cardBgClass}`}>
          <h3 className="font-orbitron text-sm font-semibold text-white mb-4">Profile vs Market</h3>
          <div className="h-[200px]"><SkillsRadar /></div>
        </div>
      </section>

      <section><ActivityHeatmap /></section>
      <section><ActivityTimeline events={timelineEvents} /></section>
      <section><AiInsightsPanel insights={aiInsights} /></section>
      <section><GaugesRow gauges={gaugeData} /></section>
    </div>
  )
}