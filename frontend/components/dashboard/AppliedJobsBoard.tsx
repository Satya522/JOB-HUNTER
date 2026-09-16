'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, MapPin, DollarSign, Calendar, MoreVertical, Sparkles, Trash2, Plus, X, Filter, Search, Loader, ChevronRight } from 'lucide-react'
import { useTheme } from '@/components/dashboard/Header'
import { toast } from 'sonner'

// 🚀 DRAG AND DROP IMPORTS
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors, DragStartEvent, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const Colors = { 
  cyan: '#13F287', 
  purple: '#6200D9', 
  magenta: '#DB66FF', 
  red: '#FF2D78', 
  yellow: '#FFD700', 
  blue: '#3B82F6', 
  green: '#10B981' 
}

const COLUMNS = [
  { id: 'applied', title: 'Applied', color: Colors.blue, icon: '📝' },
  { id: 'screening', title: 'Screening', color: Colors.cyan, icon: '👀' },
  { id: 'interview', title: 'Interview', color: Colors.purple, icon: '🎯' },
  { id: 'offer', title: 'Offer', color: Colors.green, icon: '🏆' },
  { id: 'rejected', title: 'Rejected', color: Colors.red, icon: '❌' },
]

// ==========================================
// 🧩 SEPARATED JOB CARD UI (For Dragging & Display)
// ==========================================
const JobCardUI = ({ job, columnColor, onClick, isOverlay = false }: any) => (
  <div 
    onClick={onClick}
    // 👉 YAHAN SE 'rotate-2' REMOVE KAR DIYA HAI. AB YE EKDUM SEEDHA DRAG HOGA.
    className={`bg-[#0C0513]/80 rounded-[1.25rem] p-3.5 border border-white/5 transition-all group relative overflow-hidden backdrop-blur-md 
    ${isOverlay ? 'scale-105 shadow-[0_20px_40px_rgba(0,0,0,0.8)] border-white/20 cursor-grabbing' : 'hover:border-white/20 hover:shadow-lg cursor-grab active:cursor-grabbing'}`}
    style={isOverlay ? { boxShadow: `0 0 30px ${columnColor}30` } : {}}
  >
    <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${isOverlay ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} style={{ backgroundColor: columnColor, boxShadow: `0 0 12px ${columnColor}` }} />

    <div className="flex justify-between items-start mb-2.5">
      <div className="flex gap-3 items-center flex-1 min-w-0 pointer-events-none">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-orbitron font-bold text-base shadow-inner border border-white/10" style={{ backgroundColor: `${columnColor}15`, color: columnColor }}>
          {job.companyLogo || job.companyName.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-white leading-none mb-1 truncate max-w-[180px]">{job.position}</h4>
          <div className="flex items-center gap-1 text-[10px] font-mono text-white/50 uppercase tracking-wider truncate"><Building2 size={10} /> {job.companyName}</div>
        </div>
      </div>
      <button className="text-white/20 hover:text-white transition-colors p-1"><MoreVertical size={14} /></button>
    </div>

    <div className="flex flex-wrap gap-1.5 mb-3 pointer-events-none">
      <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/[0.03] border border-white/5 text-[9px] font-mono text-white/60"><MapPin size={10} /> {job.location}</span>
      <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/[0.03] border border-white/5 text-[9px] font-mono text-[#13F287]"><DollarSign size={10} /> {job.salary?.max ? `$${job.salary.max/1000}k` : 'TBD'}</span>
    </div>

    <div className="flex items-center justify-between pt-2.5 border-t border-white/5 pointer-events-none">
      <div className="flex items-center gap-1.5 text-[9px] font-mono text-white/40 uppercase tracking-widest"><Calendar size={10} /> {new Date(job.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
      <div className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold font-mono border" style={{ backgroundColor: `${columnColor}10`, color: columnColor, borderColor: `${columnColor}30` }}>
        <Sparkles size={10} /> {job.matchScore}%
      </div>
    </div>
  </div>
)

// ==========================================
// 🧩 SORTABLE WRAPPER COMPONENT
// ==========================================
const SortableJobCard = ({ job, columnColor, onClick }: any) => {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({ id: job.id, data: { job } })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.3 : 1 }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none pb-2.5">
      <JobCardUI job={job} columnColor={columnColor} onClick={onClick} />
    </div>
  )
}

// ==========================================
// 🟢 MAIN BOARD COMPONENT
// ==========================================
export default function AppliedJobsBoard() {
  const { theme } = useTheme()
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filteredJobs, setFilteredJobs] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  
  // Modals & States
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [showJobModal, setShowJobModal] = useState(false)
  const [showNewJobForm, setShowNewJobForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [activeDragJob, setActiveDragJob] = useState<any>(null)
  
  const [newJob, setNewJob] = useState({ companyName: '', position: '', location: '', salary: { min: 0, max: 0 }, jobType: 'Full-time', link: '' })

  const cardBgClass = theme === 'neon' ? 'bg-[#0A0F18] border-[#13F287]/20 shadow-[0_0_15px_rgba(19,242,135,0.03)]' : 'bg-[#121826] border-white/5'

  // DnD Sensors (5px distance allows clicking buttons inside the card without dragging)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  // 🔄 FETCH API
  const fetchJobs = useCallback(async () => {
    try {
      const response = await fetch(`/api/applied-jobs`)
      const data = await response.json()
      if (data.success) {
        setJobs(data.data)
        if (activeFilter) setFilteredJobs(data.data.filter((j: any) => j.status === activeFilter))
        else setFilteredJobs(data.data)
        setStats(data.stats)
      }
    } catch { toast.error('Failed to load jobs') } finally { setLoading(false) }
  }, [activeFilter])

  useEffect(() => { fetchJobs() }, [fetchJobs])

  // 🔍 APPLY STATUS FILTER
  const applyFilter = useCallback((status: string | null) => {
    setActiveFilter(status)
    if (!status) setFilteredJobs(jobs)
    else setFilteredJobs(jobs.filter(job => job.status === status))
  }, [jobs])

  // 🔍 SEARCH
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setActiveFilter(null)
    if (!query) setFilteredJobs(jobs)
    else setFilteredJobs(jobs.filter(j => j.companyName.toLowerCase().includes(query.toLowerCase()) || j.position.toLowerCase().includes(query.toLowerCase())))
  }

  // 📝 ADD JOB
  const handleAddJob = async () => {
    if (!newJob.companyName || !newJob.position) return toast.error('Fill required fields')
    try {
      const response = await fetch('/api/applied-jobs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newJob) })
      const data = await response.json()
      if (data.success) {
        fetchJobs(); setShowNewJobForm(false)
        setNewJob({ companyName: '', position: '', location: '', salary: { min: 0, max: 0 }, jobType: 'Full-time', link: '' })
        toast.success('Job added successfully!')
      }
    } catch { toast.error('Failed to add job') }
  }

  // 📊 UPDATE STATUS (Used by DragDrop & Modal)
  const handleUpdateStatus = async (jobId: number, newStatus: string) => {
    // ⚡ Optimistic UI Update
    const prevJobs = [...jobs]
    const updatedJobs = jobs.map(j => j.id === jobId ? { ...j, status: newStatus } : j)
    setJobs(updatedJobs)
    setFilteredJobs(activeFilter ? updatedJobs.filter(j => j.status === activeFilter) : updatedJobs)
    if (selectedJob?.id === jobId) setSelectedJob(updatedJobs.find(j => j.id === jobId))

    try {
      const response = await fetch('/api/applied-jobs', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: jobId, status: newStatus }) })
      const data = await response.json()
      if (data.success) { fetchJobs(); toast.success('Status updated!') } 
      else { throw new Error('Failed') }
    } catch {
      setJobs(prevJobs)
      setFilteredJobs(activeFilter ? prevJobs.filter(j => j.status === activeFilter) : prevJobs)
      toast.error('Failed to update status')
    }
  }

  // 🚀 DRAG & DROP HANDLERS
  const handleDragStart = (e: DragStartEvent) => {
    const { active } = e
    const job = jobs.find(j => j.id === active.id)
    if (job) setActiveDragJob(job)
  }

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveDragJob(null)
    const { active, over } = e
    if (!over) return

    const activeId = active.id as number
    const overId = over.id
    
    let newStatus = ''
    if (COLUMNS.some(c => c.id === overId)) newStatus = overId as string
    else {
      const overJob = jobs.find(j => j.id === overId)
      if (overJob) newStatus = overJob.status
    }

    const activeJob = jobs.find(j => j.id === activeId)
    if (activeJob && newStatus && activeJob.status !== newStatus) {
      handleUpdateStatus(activeId, newStatus)
    }
  }

  // 🗑️ DELETE JOB
  const handleDeleteJob = async (jobId: number) => {
    try {
      const response = await fetch(`/api/applied-jobs?id=${jobId}`, { method: 'DELETE' })
      const data = await response.json()
      if (data.success) { fetchJobs(); setShowJobModal(false); toast.success('Job removed!') }
    } catch { toast.error('Failed to delete job') }
  }

  const statButtons = stats ? [
    { id: null, label: 'Total', value: stats.total, color: '#ffffff' },
    { id: 'applied', label: 'Applied', value: stats.applied, color: Colors.blue },
    { id: 'screening', label: 'Screening', value: stats.screening, color: Colors.cyan },
    { id: 'interview', label: 'Interview', value: stats.interview, color: Colors.purple },
    { id: 'offer', label: 'Offer', value: stats.offer, color: Colors.green }
  ] : []

  if (loading) return <div className="h-full flex items-center justify-center"><Loader className="w-8 h-8 text-[#13F287] animate-spin" /></div>

  return (
    <div className="space-y-6 pb-20 h-full flex flex-col font-sans">
      
      {/* 🟢 HEADER & STATS */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-orbitron font-semibold text-white">Application Pipeline</h2>
            <p className="text-white/50 font-mono text-xs mt-1">Track and manage your job hunting journey.</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowFilters(!showFilters)} className="p-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white transition-all bg-[#0C0513]/50">
              <Filter size={18} />
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowNewJobForm(true)} className={`px-4 py-2.5 rounded-xl font-bold font-mono text-xs flex items-center gap-2 transition-all ${theme === 'neon' ? 'bg-[#13F287]/20 border border-[#13F287] text-[#13F287] shadow-[0_0_15px_rgba(19,242,135,0.3)]' : 'bg-[#13F287] text-[#0C0513]'}`}>
              <Plus size={16} /> Add Job
            </motion.button>
          </div>
        </div>

        {/* CLICKABLE FILTER STATS ROW */}
        {stats && (
          <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2">
            {statButtons.map((stat) => {
              const isActive = activeFilter === stat.id
              return (
                <button key={stat.id || 'total'} onClick={() => applyFilter(stat.id)}
                  className={`px-4 py-2.5 rounded-xl border flex items-center gap-3 min-w-max transition-all duration-300 ${isActive ? 'shadow-lg scale-[1.02]' : 'bg-[#0C0513]/50 border-white/5 hover:border-white/20 hover:bg-white/[0.02]'}`}
                  style={isActive ? { backgroundColor: `${stat.color}15`, borderColor: stat.color, boxShadow: `0 0 20px ${stat.color}30` } : {}}
                >
                  <span className={`font-mono text-[10px] uppercase tracking-widest transition-colors ${!isActive && 'text-white/40'}`} style={isActive ? { color: stat.color } : {}}>{stat.label}</span>
                  <span className={`font-bold font-mono text-sm transition-colors ${!isActive && 'text-white'}`} style={isActive ? { color: stat.color } : {}}>{stat.value}</span>
                </button>
              )
            })}
          </div>
        )}

        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="relative overflow-hidden">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#13F287]/50" size={16} />
              <input type="text" placeholder="Search jobs, companies, or locations..." value={searchQuery} onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#0A0F18] border border-[#13F287]/30 text-white placeholder-white/30 focus:border-[#13F287] outline-none shadow-[inset_0_0_20px_rgba(19,242,135,0.05)] font-mono text-sm transition-all"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 🟢 DRAG & DROP KANBAN BOARD */}
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex-1 overflow-x-auto overflow-y-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style dangerouslySetInnerHTML={{__html: `::-webkit-scrollbar { display: none; }`}} />
          <div className="flex items-start gap-6 h-full min-w-max pb-4">
            
            <AnimatePresence mode="popLayout">
              {COLUMNS.map((column) => {
                if (activeFilter && activeFilter !== column.id) return null // Hide columns if filtered
                const columnJobs = filteredJobs.filter(job => job.status === column.id)

                return (
                  <SortableContext key={column.id} id={column.id} items={columnJobs.map(j => j.id)} strategy={verticalListSortingStrategy}>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9, x: -20 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9, width: 0, padding: 0, margin: 0 }} transition={{ duration: 0.3 }}
                      className={`w-[320px] flex flex-col max-h-full rounded-[2rem] p-3.5 transition-all duration-500 ${cardBgClass} relative overflow-hidden shrink-0`}
                      style={activeFilter === column.id ? { borderColor: `${column.color}50`, boxShadow: `0 0 20px ${column.color}10` } : {}}
                    >
                      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[70px] opacity-15 pointer-events-none" style={{ backgroundColor: column.color }} />
                      
                      <div className="flex items-center justify-between mb-3 relative z-10 px-2 pt-1">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: column.color, color: column.color }} />
                          <h3 className="text-sm font-orbitron font-bold text-white uppercase tracking-widest">{column.title}</h3>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-lg bg-white/5 text-white/60 font-mono text-[10px] border border-white/10 shadow-sm">{columnJobs.length}</span>
                      </div>

                      <div className="flex-1 overflow-y-auto relative z-10 pr-1" style={{ scrollbarWidth: 'none' }}>
                        {columnJobs.map((job) => (
                          <SortableJobCard key={job.id} job={job} columnColor={column.color} onClick={() => { setSelectedJob(job); setShowJobModal(true); }} />
                        ))}
                        
                        {columnJobs.length === 0 && (
                          <div className="h-20 flex items-center justify-center rounded-[1.25rem] border border-dashed border-white/10 bg-white/[0.01] text-white/30 font-mono text-[10px] uppercase tracking-widest mt-2">
                            ✨ Drop Here
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </SortableContext>
                )
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* 🪄 DRAG OVERLAY */}
        <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
          {activeDragJob ? (
            <JobCardUI job={activeDragJob} columnColor={COLUMNS.find(c => c.id === activeDragJob.status)?.color} isOverlay={true} />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* 🔴 JOB DETAILS MODAL */}
      <AnimatePresence>
        {showJobModal && selectedJob && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowJobModal(false)} className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-[#0C0513] border border-white/10 rounded-[2rem] p-8 w-full max-w-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
              <div className="flex items-start justify-between mb-8 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-orbitron font-bold text-2xl border border-white/10 bg-white/5 text-white">{selectedJob.companyLogo || selectedJob.companyName.charAt(0)}</div>
                  <div>
                    <h2 className="text-2xl font-orbitron font-bold text-white leading-tight">{selectedJob.position}</h2>
                    <p className="text-sm font-mono text-white/50 uppercase tracking-widest mt-1">{selectedJob.companyName}</p>
                  </div>
                </div>
                <button onClick={() => setShowJobModal(false)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 transition-colors"><X size={20} /></button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Location</p>
                  <p className="text-sm font-bold text-white flex items-center gap-2"><MapPin size={14} className="text-[#13F287]" /> {selectedJob.location}</p>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Salary</p>
                  <p className="text-sm font-bold text-white flex items-center gap-2"><DollarSign size={14} className="text-[#13F287]" /> ${selectedJob.salary?.min?.toLocaleString()} - ${selectedJob.salary?.max?.toLocaleString()}</p>
                </div>
              </div>

              <div className="mb-8 relative z-10">
                <p className="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-3">Move to Stage</p>
                <div className="flex flex-wrap gap-2">
                  {COLUMNS.map(col => (
                    <motion.button key={col.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleUpdateStatus(selectedJob.id, col.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all border ${selectedJob.status === col.id ? `bg-[${col.color}]/20 text-[${col.color}] border-[${col.color}]/50 shadow-[0_0_10px_rgba(0,0,0,0.2)]` : 'bg-white/5 text-white/50 hover:text-white border-transparent hover:border-white/20'}`}
                      style={selectedJob.status === col.id ? { backgroundColor: `${col.color}20`, color: col.color, borderColor: `${col.color}50` } : {}}
                    >
                      {col.title}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 relative z-10 pt-6 border-t border-white/5">
                <button onClick={() => handleDeleteJob(selectedJob.id)} className="px-6 py-3 rounded-xl border border-[#FF2D78]/30 bg-[#FF2D78]/5 text-[#FF2D78] text-xs font-mono font-bold hover:bg-[#FF2D78]/10 transition-all flex items-center gap-2">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🟢 ADD NEW JOB MODAL */}
      <AnimatePresence>
        {showNewJobForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNewJobForm(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-[#0C0513] border border-[#13F287]/20 rounded-[2rem] p-8 w-full max-w-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#13F287] rounded-full blur-[80px] opacity-10 pointer-events-none" />
              <h2 className="text-xl font-orbitron font-bold text-white mb-6 flex items-center gap-3 relative z-10"><div className="p-2 rounded-xl bg-[#13F287]/10"><Plus className="text-[#13F287]" size={20} /></div> Track New Application</h2>

              <div className="space-y-4 mb-8 relative z-10">
                <input type="text" placeholder="Company Name (e.g., Google)" value={newJob.companyName} onChange={(e) => setNewJob({ ...newJob, companyName: e.target.value })} className="w-full bg-[#121826] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#13F287] outline-none" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Role (e.g., UI Engineer)" value={newJob.position} onChange={(e) => setNewJob({ ...newJob, position: e.target.value })} className="bg-[#121826] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#13F287] outline-none" />
                  <input type="text" placeholder="Location (e.g., Remote)" value={newJob.location} onChange={(e) => setNewJob({ ...newJob, location: e.target.value })} className="bg-[#121826] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#13F287] outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" placeholder="Min Salary ($)" value={newJob.salary.min || ''} onChange={(e) => setNewJob({ ...newJob, salary: { ...newJob.salary, min: parseInt(e.target.value) } })} className="bg-[#121826] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#13F287] outline-none" />
                  <input type="number" placeholder="Max Salary ($)" value={newJob.salary.max || ''} onChange={(e) => setNewJob({ ...newJob, salary: { ...newJob.salary, max: parseInt(e.target.value) } })} className="bg-[#121826] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#13F287] outline-none" />
                </div>
              </div>

              <div className="flex gap-3 relative z-10">
                <button onClick={handleAddJob} className="flex-1 py-3.5 rounded-xl bg-[#13F287] text-[#0C0513] font-bold text-sm hover:scale-[1.02] transition-all shadow-[0_0_15px_rgba(19,242,135,0.3)]">Save Application</button>
                <button onClick={() => setShowNewJobForm(false)} className="flex-1 py-3.5 rounded-xl bg-white/5 text-white font-bold text-sm border border-white/5 hover:bg-white/10">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}