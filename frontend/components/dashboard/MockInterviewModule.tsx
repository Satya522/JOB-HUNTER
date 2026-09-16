'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Mic, MicOff, Square, Camera, Video, VideoOff, Loader2, Cpu } from 'lucide-react'
import { toast } from 'sonner'

interface InterviewProps {
  resumeText: string;
}

export default function MockInterviewModule({ resumeText }: InterviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null) // 🔥 Camera/Mic stream ko global control karne ke liye
  const recognitionRef = useRef<any>(null) 
  
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [aiQuestion, setAiQuestion] = useState("Initializing... Please introduce yourself to begin.")
  const [history, setHistory] = useState<any[]>([])
  const [difficulty, setDifficulty] = useState('easy')
  const [isThinking, setIsThinking] = useState(false)

  // 🔥 Nayi Privacy States
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)

  // 1. Camera Setup
  useEffect(() => {
    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream
      } catch (error) {
        toast.error("Camera/Mic access denied!")
        setIsVideoOn(false)
        setIsAudioOn(false)
      }
    }
    initCamera()
    
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices()
    }

    setTimeout(() => speakAndListen("Hello! I am ready. Please introduce yourself in English or Hindi."), 1500)

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop()); 
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop(); 
      }
      window.speechSynthesis.cancel(); 
    }
  }, [])

  // 🔥 2. Privacy Control Functions (Camera & Mic Toggles)
  const toggleVideo = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !isVideoOn; // Video Pause/Resume karega
      });
      setIsVideoOn(!isVideoOn);
    }
  }

  const toggleAudio = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !isAudioOn; // System mic mute/unmute karega
      });
      setIsAudioOn(!isAudioOn);
    }
  }

  // 3. Text to Speech 
  const speakAndListen = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    
    const bestMaleVoice = voices.find(v => 
      v.name.includes('Google UK English Male') || 
      v.name.includes('Google US English Male') || 
      v.name.includes('Microsoft Mark') ||         
      v.name.includes('Daniel') ||                 
      (v.name.includes('Male') && v.lang.includes('en'))
    );
    
    if (bestMaleVoice) {
      utterance.voice = bestMaleVoice;
    }
    
    utterance.lang = 'en-US'; 
    utterance.rate = 0.95;  
    utterance.pitch = 0.9;  

    utterance.onend = () => {
      // Agar mic purposely off kiya hai, toh AI sawal puchkar ruk jayega, mic on nahi karega
      if (isAudioOn) {
        startRecording();
      }
    };

    window.speechSynthesis.speak(utterance);
  }

  // 4. Handle Voice Recording 
  const startRecording = useCallback(() => {
    if (!isAudioOn) {
      toast.error("Please turn on your Microphone first!");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return toast.error("Browser not supported. Use Chrome.")

    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition; 
    
    recognition.lang = 'hi-IN' 
    recognition.continuous = true 
    recognition.interimResults = true

    recognition.onstart = () => {
      setIsRecording(true)
      setTranscript("") 
    }
    
    recognition.onresult = (event: any) => {
      let currentText = ""
      for (let i = 0; i < event.results.length; i++) {
        currentText += event.results[i][0].transcript
      }
      setTranscript(currentText)
    }

    recognition.onerror = (event: any) => {
       console.error("Speech Rec Error:", event.error)
       setIsRecording(false)
    }

    try {
      recognition.start()
    } catch (e) {
      console.log("Mic already active")
    }
  }, [isAudioOn])

  // 5. Submit Answer
  const submitAnswer = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop(); 
    }
    setIsRecording(false)
    setIsThinking(true)
    
    if (!transcript.trim()) {
       setAiQuestion("I didn't hear anything. Please try again.")
       setIsThinking(false)
       if (isAudioOn) startRecording()
       return;
    }

    const newHistory = [...history, { role: "user", content: transcript }]
    setHistory(newHistory)
    setAiQuestion("Analyzing your response...")

    try {
      const res = await fetch('/api/mock-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAnswer: transcript,
          history: newHistory,
          difficulty: difficulty,
          jobRole: "Software Developer",
          resumeText: resumeText
        })
      })
      
      const data = await res.json()
      setAiQuestion(data.nextQuestion)
      speakAndListen(data.nextQuestion)
      if (newHistory.length > 3) setDifficulty('hard')

    } catch (error) {
      setAiQuestion("Connection error. Try again.")
      setIsThinking(false)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 md:gap-6 w-full relative z-10">
      
      {/* LEFT: CAMERA FEED */}
      <div className="lg:w-1/2 flex flex-col gap-4">
        <div className="relative w-full aspect-video bg-[#050A0F] rounded-3xl overflow-hidden border border-[#00E5FF]/30 shadow-[0_0_30px_rgba(0,229,255,0.1)]">
          
          <video ref={videoRef} autoPlay playsInline muted className={`absolute inset-0 w-full h-full object-cover transform scale-x-[-1] z-0 transition-opacity duration-300 ${!isVideoOn ? 'opacity-0' : 'opacity-100'}`} />
          
          {/* Camera Off Placeholder */}
          {!isVideoOn && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050A0F] z-10">
              <VideoOff className="w-12 h-12 text-white/20 mb-2" />
              <p className="text-white/40 font-mono text-xs uppercase tracking-widest">Camera Disabled</p>
            </div>
          )}
          
          <div className="absolute top-4 left-4 z-50 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-sm border border-white/10 text-[9px] md:text-[10px] font-mono uppercase tracking-widest text-white shadow-lg">
            <Camera size={12} className="text-[#00E5FF]" /> Live Feed
          </div>
          
          <div className="absolute top-4 right-4 z-50 flex gap-2 shadow-lg">
            <div className={`px-3 py-1.5 rounded-sm text-[9px] md:text-[10px] font-mono uppercase tracking-widest border bg-black/60 backdrop-blur-md ${difficulty === 'hard' ? 'border-[#FF2A5F]/50 text-[#FF2A5F]' : 'border-[#00FF94]/50 text-[#00FF94]'}`}>
              {difficulty === 'hard' ? 'DEEPSEEK: HARD' : 'GEMINI: STANDARD'}
            </div>
          </div>

          {/* 🔥 Privacy Controls (Bottom Right) */}
          <div className="absolute bottom-4 right-4 z-50 flex gap-2">
            <button onClick={toggleAudio} className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${isAudioOn ? 'bg-black/60 border-white/10 text-white hover:bg-black/80' : 'bg-red-500/80 border-red-500 text-white shadow-[0_0_15px_rgba(255,0,0,0.5)]'}`} title={isAudioOn ? "Mute Microphone" : "Unmute Microphone"}>
              {isAudioOn ? <Mic size={16} /> : <MicOff size={16} />}
            </button>
            <button onClick={toggleVideo} className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${isVideoOn ? 'bg-black/60 border-white/10 text-white hover:bg-black/80' : 'bg-red-500/80 border-red-500 text-white shadow-[0_0_15px_rgba(255,0,0,0.5)]'}`} title={isVideoOn ? "Turn Off Camera" : "Turn On Camera"}>
              {isVideoOn ? <Video size={16} /> : <VideoOff size={16} />}
            </button>
          </div>

          {isRecording && isAudioOn && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-red-600/90 backdrop-blur-md px-6 py-2 rounded-full text-xs font-bold text-white animate-pulse shadow-[0_0_20px_red]">
              <Mic size={14} /> RECORDING... TAKE YOUR TIME
            </div>
          )}
        </div>

        {/* Action Button */}
        {isRecording ? (
          <motion.button 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={submitAnswer} 
            className="w-full py-4 rounded-2xl font-mono font-bold tracking-widest uppercase text-xs transition-all flex items-center justify-center gap-3 bg-[#00FF94]/20 border border-[#00FF94] text-[#00FF94] shadow-[0_0_30px_rgba(0,255,148,0.3)]"
          >
            <Square size={16} fill="currentColor" /> Done Speaking (Submit Answer)
          </motion.button>
        ) : (
          <motion.button 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={startRecording} disabled={isThinking || !isAudioOn}
            className={`w-full py-4 rounded-2xl font-mono font-bold tracking-widest uppercase text-xs transition-all flex items-center justify-center gap-3 overflow-hidden group
              ${isThinking ? 'bg-gray-800 border border-gray-700 text-gray-500' : 
                !isAudioOn ? 'bg-red-900/20 border border-red-900 text-red-500 cursor-not-allowed' : 
                'bg-[#00E5FF]/10 border border-[#00E5FF]/50 text-[#00E5FF] hover:bg-[#00E5FF]/20 hover:shadow-[0_0_30px_rgba(0,229,255,0.2)]'}`}
          >
            {!isAudioOn ? <MicOff size={16} /> : <Mic size={16} />} 
            {isThinking ? 'AI is thinking...' : !isAudioOn ? 'Mic is Muted' : 'Tap to Speak'}
          </motion.button>
        )}
      </div>

      {/* RIGHT: AI CONSOLE */}
      <div className="lg:w-1/2 flex flex-col gap-4">
        
        {/* AI Output Terminal */}
        <div className="flex-1 bg-[#050A0F] border border-white/10 rounded-3xl p-5 md:p-6 relative overflow-hidden shadow-inner flex flex-col min-h-[250px]">
          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
            <label className="flex items-center gap-2 text-[9px] md:text-[10px] font-mono text-white/50 uppercase tracking-[0.2em]">
              <Cpu size={14} className="text-[#00E5FF]" /> System.Interviewer
            </label>
            {isThinking && <Loader2 size={14} className="text-[#00E5FF] animate-spin" />}
          </div>
          
          <div className="flex-1 flex items-center justify-center p-4">
            <p className="text-lg md:text-xl font-mono leading-relaxed text-white/90 text-center italic">
              "{aiQuestion}"
            </p>
          </div>
        </div>

        {/* User Transcript Terminal */}
        <div className="h-32 bg-[#0A0F18]/80 border border-white/5 rounded-3xl p-5 relative overflow-y-auto custom-scrollbar">
          <label className="text-[9px] md:text-[10px] font-mono text-[#00FF94] uppercase tracking-[0.2em] mb-2 block">
            User.Transcript
          </label>
          <p className="text-xs font-mono text-white/60">
            {transcript ? `> ${transcript}` : '> Awaiting voice input...'}
          </p>
        </div>

      </div>
    </div>
  )
}