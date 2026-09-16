'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Wand2, FileText, FileSearch, Mic, UploadCloud, 
  CheckCircle, AlertCircle, Zap, Sparkles, Copy, RefreshCw, Loader, ChevronRight, Terminal, Crosshair, Cpu
} from 'lucide-react'
import { useTheme } from '@/components/dashboard/Header'
import { toast } from 'sonner'

import MockInterviewModule from './MockInterviewModule'



const Colors = { cyan: '#00E5FF', green: '#00FF94', purple: '#B026FF', darkPurple: '#7000FF', red: '#FF2A5F', yellow: '#FFD700' }

const TOOLS = [
  { id: 'ats', title: 'ATS Scanner', desc: 'Neural Resume Analysis', icon: <FileSearch className="w-4 h-4 md:w-5 md:h-5" />, color: Colors.green },
  { id: 'cover_letter', title: 'AI Synthesizer', desc: 'Cover Letter Gen', icon: <Wand2 className="w-4 h-4 md:w-5 md:h-5" />, color: Colors.purple },
  { id: 'interview', title: 'Mock Interview', desc: 'Voice-to-Voice', icon: <Mic className="w-4 h-4 md:w-5 md:h-5" />, color: Colors.cyan },
]

export default function AiToolsHub() {
  const { theme } = useTheme()
  const [activeTool, setActiveTool] = useState('ats')
  
  // States
  const [file, setFile] = useState<File | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<any>(null)
  const [jobDesc, setJobDesc] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedLetter, setGeneratedLetter] = useState('')
  
  // 🟢 NAYI STATE: ATS se text save karne ke liye
  const [resumeText, setResumeText] = useState<string>('') 

  const bgStyle = theme === 'neon' ? 'bg-[#030712]' : 'bg-[#050505]'

  // 🪄 REAL GEMINI AI SCANNING LOGIC
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      startAiScan(selectedFile) // Pass file directly
    }
  }

  const startAiScan = async (uploadedFile: File) => {
    setIsScanning(true)
    setScanResult(null)
    setResumeText('') // Pura clear karo naye scan se pehle
    
    try {
      const formData = new FormData()
      formData.append('file', uploadedFile)

      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setScanResult(data.data)
        
        // 🟢 UPDATE: Extracting Resume Text for Cover Letter
        // API response me text ka jo bhi naam ho (text ya resumeText), usko save kar lenge
        const extractedText = data.data.text || data.data.resumeText || JSON.stringify(data.data);
        setResumeText(extractedText);

        toast.success('Neural scan completed successfully!')
      } else {
        toast.error('Failed to analyze resume: ' + data.error)
      }
    } catch (error) {
      console.error("Scan error:", error)
      toast.error('Network error during scan.')
    } finally {
      setIsScanning(false)
    }
  }

  // 🟢 UPDATE: GROQ REAL-TIME STREAMING LOGIC
  const handleGenerateLetter = async () => {
    if (!jobDesc) return toast.error('Input job parameters first!')
    if (!resumeText) return toast.error('Please run the ATS Scanner first to extract your resume data!')
    
    setIsGenerating(true)
    setGeneratedLetter('') // Terminal output ko clear karna zaroori hai
    
    try {
      const res = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: resumeText, jobDescription: jobDesc })
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      // 🪄 Asli Hacker Streaming Magic Yahan Hai
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break; // Job khatam hone par loop se bahaar
          
          const chunkText = decoder.decode(value, { stream: true });
          // Live text update (Typing effect bina fake setTimeout ke)
          setGeneratedLetter((prev) => prev + chunkText); 
        }
      }
      
      toast.success('Document synthesis complete!')
    } catch (error) {
      console.error("Generation error:", error)
      toast.error('Neural link severed. Try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-4 md:space-y-6 pb-20 min-h-full flex flex-col font-sans relative">
      
      {/* 🟢 HYPER-PREMIUM HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 md:gap-4 border-b border-white/[0.05] pb-3 md:pb-6 relative z-10 shrink-0">
        <div className="absolute bottom-0 left-0 w-[40%] h-[2px] bg-gradient-to-r from-[var(--active-color)] to-transparent transition-colors duration-500" style={{ '--active-color': TOOLS.find(t=>t.id===activeTool)?.color } as any} />
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-white/[0.03] border border-white/[0.05] font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] mb-2 md:mb-4">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#00FF94] animate-pulse shadow-[0_0_10px_#00FF94]" /> System Online
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-orbitron font-black text-white tracking-widest uppercase">
            Aether<span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${Colors.cyan}, ${Colors.purple})` }}>Core</span> Tools
          </h2>
        </div>
      </div>

      {/* 🟢 CYBERPUNK TABS */}
      <div className="flex gap-2.5 md:gap-4 overflow-x-auto scrollbar-hide pb-2 relative z-10 shrink-0">
        {TOOLS.map((tool) => {
          const isActive = activeTool === tool.id
          return (
            <motion.button
              key={tool.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTool(tool.id)}
              className={`relative flex items-center gap-2.5 md:gap-3 px-3 py-2 md:px-5 md:py-3 rounded-xl border transition-all duration-300 min-w-max overflow-hidden group
                ${isActive ? 'bg-[#0C0513] shadow-2xl' : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.03]'}`
              }
              style={{ borderColor: isActive ? `${tool.color}50` : undefined }}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r opacity-10 pointer-events-none" style={{ backgroundImage: `linear-gradient(to right, ${tool.color}, transparent)` }} />
              )}
              {isActive && (
                <motion.div layoutId="tab-indicator" className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: tool.color, boxShadow: `0 0 15px ${tool.color}` }} />
              )}
              
              <span className={`p-1.5 rounded-md transition-colors ${isActive ? 'bg-white/10' : 'bg-transparent group-hover:bg-white/5'}`} style={{ color: isActive ? tool.color : '#ffffff60' }}>
                {tool.icon}
              </span>
              <div className="text-left">
                <h3 className={`font-orbitron font-bold text-[10px] md:text-xs tracking-wider uppercase transition-colors ${isActive ? 'text-white' : 'text-white/50'}`}>{tool.title}</h3>
                <p className="text-[8px] md:text-[9px] font-mono text-white/30 uppercase tracking-[0.1em] md:tracking-[0.2em] mt-0.5">{tool.desc}</p>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* 🟢 HUD MAIN DASHBOARD AREA */}
      <div className={`flex-1 rounded-[1.5rem] md:rounded-[2.5rem] p-4 sm:p-6 lg:p-8 transition-all duration-700 relative shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] border border-white/[0.05] ${bgStyle}`}>
        
        {/* Dynamic Background Cyber-Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 rounded-[1.5rem] md:rounded-[2.5rem]" 
             style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        
        {/* Background Core Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[800px] md:h-[800px] rounded-full blur-[100px] md:blur-[150px] pointer-events-none opacity-20 transition-colors duration-1000" 
             style={{ backgroundColor: TOOLS.find(t=>t.id===activeTool)?.color }} />

        <AnimatePresence mode="wait">
          
          {/* ========================================== */}
          {/* 1. ATS SCANNER (PERFECT CIRCULAR UI) */}
          {/* ========================================== */}
          {activeTool === 'ats' && (
            <motion.div key="ats" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="h-full flex flex-col relative z-10">
              
              {/* UPLOAD STATE */}
              {!isScanning && !scanResult && (
                <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] py-10">
                  
                  <label className="group relative flex flex-col items-center justify-center w-64 h-64 md:w-[360px] md:h-[360px] rounded-full cursor-pointer bg-[#050A0F]/80 backdrop-blur-xl hover:bg-[#050A0F] transition-all border border-white/5 shadow-[0_0_60px_rgba(0,255,148,0.05)] hover:shadow-[0_0_80px_rgba(0,255,148,0.15)]">
                    
                    {/* Spinning Border Ring */}
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#00FF94]/50 via-transparent to-transparent animate-[spin_4s_linear_infinite] opacity-50 group-hover:opacity-100 transition-opacity" />
                    {/* Inner Mask to hollow the spinning ring */}
                    <div className="absolute inset-[2px] rounded-full bg-[#050A0F]/90 backdrop-blur-xl" />

                    {/* Circular Content */}
                    <div className="relative z-10 flex flex-col items-center text-center p-6">
                      <motion.div whileHover={{ scale: 1.1 }} className="w-16 h-16 md:w-20 md:h-20 mb-4 md:mb-6 rounded-full bg-[#00FF94]/10 flex items-center justify-center border border-[#00FF94]/30 shadow-[0_0_30px_rgba(0,255,148,0.2)]">
                        <UploadCloud className="w-8 h-8 md:w-10 md:h-10 text-[#00FF94]" />
                      </motion.div>
                      
                      <h3 className="mb-2 text-lg md:text-xl font-orbitron font-bold text-white tracking-widest uppercase">Initialize Parse</h3>
                      <p className="text-[9px] md:text-[10px] font-mono text-[#00FF94]/70 uppercase tracking-[0.2em] md:tracking-[0.3em] bg-[#00FF94]/10 px-3 md:px-4 py-1 md:py-1.5 rounded-full border border-[#00FF94]/20">Drop PDF Payload</p>
                    </div>
                    
                    <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileUpload} />
                  </label>

                </div>
              )}

              {/* SCANNING STATE */}
              {isScanning && (
                <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] py-10">
                  <div className="relative w-56 h-56 md:w-72 md:h-72 flex items-center justify-center">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: 'linear' }} className="absolute inset-0 border-2 border-dashed border-[#00FF94]/30 rounded-full" />
                    <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 12, ease: 'linear' }} className="absolute inset-4 border border-[#00FF94]/20 rounded-full" />
                    <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.8, 0.3] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-12 bg-[#00FF94]/5 rounded-full shadow-[0_0_50px_rgba(0,255,148,0.2)]" />
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Cpu className="w-10 h-10 md:w-12 md:h-12 text-[#00FF94] animate-pulse" />
                    </div>
                    
                    <motion.div className="absolute top-0 left-1/2 w-[2px] h-1/2 bg-gradient-to-b from-transparent via-[#00FF94] to-transparent origin-bottom" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }} />
                  </div>
                  
                  <div className="mt-8 md:mt-12 text-center flex flex-col items-center">
                    <h3 className="text-lg md:text-2xl font-orbitron font-bold text-white tracking-[0.2em] uppercase mb-2 md:mb-3 drop-shadow-[0_0_10px_#00FF94]">Extracting Data</h3>
                    <div className="flex gap-1">
                      {[1,2,3].map(i => (
                         <motion.div key={i} animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }} className="w-1.5 h-3 md:w-2 md:h-4 bg-[#00FF94]" />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* RESULTS STATE */}
              {scanResult && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col lg:flex-row gap-4 md:gap-6 mt-4">
                  
                  {/* LEFT: MASTER SCORE DIAL */}
                  <div className="lg:w-[35%] relative group flex flex-col shrink-0">
                    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 bg-[#0A0F18]/80 backdrop-blur-2xl rounded-3xl border border-white/5 relative overflow-hidden shadow-2xl min-h-[300px]">
                      
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00FF94] to-transparent opacity-50" />

                      <div className="flex items-center gap-2 mb-4 md:mb-8 relative z-10">
                        <Crosshair size={14} className="text-[#00FF94]" />
                        <h3 className="text-[#00FF94] font-mono text-[9px] md:text-[11px] uppercase tracking-[0.2em] md:tracking-[0.3em]">System Match Index</h3>
                      </div>
                      
                      <div className="relative w-40 h-40 md:w-56 md:h-56 flex items-center justify-center mb-6 md:mb-8 z-10">
                        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_50px_rgba(0,255,148,0.1)] border border-white/[0.02]" />
                        <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_20px_rgba(0,255,148,0.5)]" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="44" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" fill="none" />
                          <circle cx="50" cy="50" r="38" stroke="rgba(0,255,148,0.2)" strokeWidth="1" strokeDasharray="2 4" fill="none" />
                          <defs>
                            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor={Colors.cyan} />
                              <stop offset="100%" stopColor={Colors.green} />
                            </linearGradient>
                          </defs>
                          <motion.circle initial={{ strokeDashoffset: 276 }} animate={{ strokeDashoffset: 276 - (276 * scanResult.score) / 100 }} transition={{ duration: 2, ease: "easeOut" }}
                            cx="50" cy="50" r="44" stroke="url(#scoreGrad)" strokeWidth="5" fill="none" strokeDasharray="276" strokeLinecap="round" 
                          />
                        </svg>

                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#00FF94]/[0.02] rounded-full m-3 md:m-4">
                          <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5 }} className="text-5xl md:text-7xl font-orbitron font-bold text-white tracking-tighter">
                            {scanResult.score}
                          </motion.span>
                          <span className="text-[8px] md:text-[9px] font-mono text-white/40 uppercase tracking-[0.2em] md:tracking-[0.4em] mt-1 border-t border-white/10 pt-1">Percentile</span>
                        </div>
                      </div>
                      
                      <button onClick={() => setScanResult(null)} className="flex items-center gap-2 px-4 py-2.5 md:px-6 md:py-3 rounded-sm bg-[#00FF94]/10 border border-[#00FF94]/30 text-[10px] md:text-xs font-mono text-[#00FF94] hover:bg-[#00FF94]/20 hover:shadow-[0_0_20px_rgba(0,255,148,0.3)] transition-all uppercase tracking-widest group w-full justify-center relative z-10">
                        <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" /> Reboot Scanner
                      </button>
                    </div>
                  </div>

                  {/* RIGHT: HUD DATA PANELS */}
                  <div className="lg:w-[65%] flex flex-col gap-4">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 shrink-0">
                      {/* FOUND MODULE */}
                      <div className="bg-[#0A0F18]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-5 relative overflow-hidden group">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00FF94] opacity-70" />
                        <h4 className="flex items-center gap-2 font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-[#00FF94] mb-4">
                          <CheckCircle size={14} /> Validated Vectors
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {scanResult.matched.map((kw: string) => (
                            <span key={kw} className="px-2.5 py-1 md:px-3 md:py-1.5 rounded-sm bg-[#00FF94]/5 border border-[#00FF94]/20 text-white/80 font-mono text-[10px] md:text-[11px] flex items-center gap-2 hover:bg-[#00FF94]/10 transition-colors shadow-[inset_0_0_10px_rgba(0,255,148,0.05)]">
                              <span className="w-1 h-1 bg-[#00FF94]" /> {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* MISSING MODULE */}
                      <div className="bg-[#0A0F18]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-5 relative overflow-hidden group">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF2A5F] opacity-70" />
                        <h4 className="flex items-center gap-2 font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-[#FF2A5F] mb-4">
                          <AlertCircle size={14} /> Missing Dependencies
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {scanResult.missing.map((kw: string) => (
                            <span key={kw} className="px-2.5 py-1 md:px-3 md:py-1.5 rounded-sm bg-[#FF2A5F]/5 border border-[#FF2A5F]/20 text-white/80 font-mono text-[10px] md:text-[11px] flex items-center gap-2 hover:bg-[#FF2A5F]/10 transition-colors shadow-[inset_0_0_10px_rgba(255,42,95,0.05)]">
                              <span className="w-1 h-1 bg-[#FF2A5F]" /> {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* TERMINAL SUGGESTIONS */}
                    <div className="bg-[#0A0F18]/90 backdrop-blur-xl border border-white/5 rounded-3xl p-5 md:p-6 flex-1 min-h-[200px] relative overflow-hidden flex flex-col">
                      <div className="flex items-center justify-between mb-4 md:mb-6 pb-3 md:pb-4 border-b border-white/5">
                        <h4 className="flex items-center gap-2 font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-white/50">
                          <Terminal size={14} className="text-white" /> System.out.optimization_tips
                        </h4>
                        <div className="flex gap-1.5">
                          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white/20" />
                          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white/20" />
                          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white/20" />
                        </div>
                      </div>
                      
                      <ul className="space-y-3 md:space-y-4 flex-1">
                        {scanResult.tips.map((tip: string, i: number) => (
                          <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 + (i * 0.2) }} 
                            className="flex items-start gap-2.5 md:gap-3 text-[11px] md:text-sm text-white/70 font-mono leading-relaxed bg-white/[0.02] p-3 md:p-4 rounded-xl border border-white/[0.02]">
                            <span className="text-[#00FF94] mt-0.5 shrink-0">&gt;</span> 
                            {tip}
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ========================================== */}
          {/* 2. COVER LETTER GENERATOR */}
          {/* ========================================== */}
          {activeTool === 'cover_letter' && (
            <motion.div key="cover" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="flex flex-col lg:flex-row gap-4 md:gap-6 relative z-10 mt-4">
              
              {/* INPUT IDE */}
              <div className="lg:w-1/2 flex flex-col space-y-3 md:space-y-4 shrink-0 min-h-[300px]">
                <div className="flex-1 bg-[#050A0F] border border-white/10 rounded-3xl p-5 md:p-6 flex flex-col relative overflow-hidden group shadow-inner">
                  <div className="flex items-center justify-between mb-3 md:mb-4 border-b border-white/5 pb-3 md:pb-4">
                    <label className="flex items-center gap-2 text-[9px] md:text-[10px] font-mono text-[#B026FF] uppercase tracking-[0.2em]">
                      <Terminal size={14} /> Input.JobDescription
                    </label>
                    <span className="text-[8px] md:text-[10px] font-mono text-white/30 uppercase">markdown / text</span>
                  </div>
                  
                  <textarea 
                    value={jobDesc} onChange={(e) => setJobDesc(e.target.value)}
                    placeholder="// Paste target role requirements here..."
                    className="flex-1 bg-transparent resize-none text-[11px] md:text-[13px] text-white/90 placeholder-white/20 outline-none font-mono leading-relaxed md:leading-loose min-h-[150px]"
                    spellCheck="false"
                  />
                </div>
                
                <button onClick={handleGenerateLetter} disabled={isGenerating} className="relative w-full py-3 md:py-4 rounded-2xl bg-[#B026FF]/10 border border-[#B026FF]/50 text-[#B026FF] font-mono font-bold tracking-widest uppercase text-[10px] md:text-xs hover:bg-[#B026FF]/20 hover:shadow-[0_0_30px_rgba(176,38,255,0.2)] transition-all flex items-center justify-center gap-2 md:gap-3 disabled:opacity-50 overflow-hidden group">
                  {isGenerating ? <Loader className="animate-spin w-4 h-4 md:w-5 md:h-5" /> : <Zap className="w-4 h-4 md:w-5 md:h-5" />}
                  <span>{isGenerating ? 'Executing Synthesis...' : 'Run Generation Protocol'}</span>
                </button>
              </div>

              {/* OUTPUT RENDERER */}
              <div className="lg:w-1/2 bg-[#050A0F] border border-white/10 rounded-3xl p-5 md:p-6 relative flex flex-col shadow-inner min-h-[300px]">
                <div className="flex items-center justify-between mb-3 md:mb-4 border-b border-white/5 pb-3 md:pb-4">
                  <h3 className="font-mono text-[9px] md:text-[10px] text-white/50 uppercase tracking-[0.2em] flex items-center gap-2">
                    <FileText size={14} className="text-[#00E5FF]" /> Output.Document
                  </h3>
                  {generatedLetter && (
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => { navigator.clipboard.writeText(generatedLetter); toast.success('Copied to clipboard!') }} className="p-1.5 md:p-2 bg-white/5 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors">
                      <Copy size={14} />
                    </motion.button>
                  )}
                </div>
                
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <div className="prose prose-invert max-w-none text-[11px] md:text-[13px] text-white/80 whitespace-pre-wrap font-mono leading-[1.8] md:leading-[2]">
                    {generatedLetter ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-l-2 border-[#00E5FF]/50 pl-3 md:pl-4 py-2">
                        {generatedLetter}
                      </motion.div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-white/20 mt-10 md:mt-20 pb-10">
                        <Cpu className="w-8 h-8 md:w-10 md:h-10 mb-3 md:mb-4 opacity-20" />
                        <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-center">Awaiting parameters to compile.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          
          {/* ========================================== */}
          {/* 3. MOCK INTERVIEW UI (CLEAN MODULAR COMPONENT) */}
          {/* ========================================== */}
          {activeTool === 'interview' && (
            <motion.div 
              key="interview" 
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full flex-1 relative z-10"
            >
              <MockInterviewModule resumeText={resumeText} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
      
      {/* Custom Scrollbar CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}} />
    </div>
  )
}