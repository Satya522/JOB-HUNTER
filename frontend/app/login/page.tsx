// 'use client'

// import { useState, useEffect, useRef } from 'react'
// import { useRouter } from 'next/navigation'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Canvas, useFrame } from '@react-three/fiber'
// import { Stars, Float } from '@react-three/drei'
// import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
// import * as THREE from 'three'
// import Tilt from 'react-parallax-tilt'
// import { 
//   Mail, 
//   Lock, 
//   Eye, 
//   EyeOff, 
//   ArrowRight,
//   Check,
//   Loader2
// } from 'lucide-react'
// import { toast } from 'sonner'

// import { authApi } from '@/lib/api' 
// import { auth, googleProvider, githubProvider, facebookProvider, microsoftProvider } from '@/lib/firebase' // microsoftProvider import kiya
// import { signInWithPopup, AuthProvider } from 'firebase/auth'

// // 3D Scene Component
// function LoginScene() {
//   const meshRef = useRef<THREE.Group>(null)
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       setMousePosition({
//         x: (e.clientX / window.innerWidth) * 2 - 1,
//         y: -(e.clientY / window.innerHeight) * 2 + 1
//       })
//     }
//     window.addEventListener('mousemove', handleMouseMove)
//     return () => window.removeEventListener('mousemove', handleMouseMove)
//   }, [])

//   useFrame((state) => {
//     if (meshRef.current) {
//       meshRef.current.rotation.y += 0.001
//       meshRef.current.rotation.x = mousePosition.y * 0.1
//       meshRef.current.rotation.z = mousePosition.x * 0.05
//     }
//     state.camera.position.x += (mousePosition.x * 3 - state.camera.position.x) * 0.02
//     state.camera.position.y += (mousePosition.y * 2 - state.camera.position.y) * 0.02
//     state.camera.lookAt(0, 0, 0)
//   })

//   return (
//     <>
//       <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
//       <group ref={meshRef}>
//         <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
//           <mesh position={[-3, 1, -5]}>
//             <icosahedronGeometry args={[1.8, 0]} />
//             <meshStandardMaterial 
//               wireframe 
//               color="#7B61FF" 
//               emissive="#7B61FF"
//               emissiveIntensity={0.5}
//             />
//           </mesh>
//         </Float>
//         <Float speed={2} rotationIntensity={1.2} floatIntensity={1.5}>
//           <mesh position={[3, -1, -6]}>
//             <octahedronGeometry args={[1.5, 0]} />
//             <meshStandardMaterial 
//               wireframe 
//               color="#00F5FF" 
//               emissive="#00F5FF"
//               emissiveIntensity={0.5}
//             />
//           </mesh>
//         </Float>
//         <Float speed={1.8} rotationIntensity={0.8} floatIntensity={2.2}>
//           <mesh position={[0, 2, -8]}>
//             <torusKnotGeometry args={[1, 0.3, 100, 16]} />
//             <meshStandardMaterial 
//               wireframe 
//               color="#FF2D78" 
//               emissive="#FF2D78"
//               emissiveIntensity={0.3}
//             />
//           </mesh>
//         </Float>
//         <Float speed={2.2} rotationIntensity={1.5} floatIntensity={1.8}>
//           <mesh position={[-2, -2, -4]}>
//             <tetrahedronGeometry args={[1.2, 0]} />
//             <meshStandardMaterial 
//               wireframe 
//               color="#00FFA3" 
//               emissive="#00FFA3"
//               emissiveIntensity={0.4}
//             />
//           </mesh>
//         </Float>
//       </group>
//       <EffectComposer>
//         <Bloom luminanceThreshold={0.3} intensity={1.5} levels={9} />
//         <ChromaticAberration offset={new THREE.Vector2(0.002, 0.002)} />
//       </EffectComposer>
//     </>
//   )
// }

// // Custom Cursor Component
// function CustomCursor() {
//   const dotRef = useRef<HTMLDivElement>(null)
//   const ringRef = useRef<HTMLDivElement>(null)
//   const mousePosition = useRef({ x: 0, y: 0 })
//   const ringPosition = useRef({ x: 0, y: 0 })

//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       mousePosition.current = { x: e.clientX, y: e.clientY }
//       if (dotRef.current) {
//         dotRef.current.style.left = `${e.clientX}px`
//         dotRef.current.style.top = `${e.clientY}px`
//       }
//     }

//     const animateRing = () => {
//       ringPosition.current.x += (mousePosition.current.x - ringPosition.current.x) * 0.12
//       ringPosition.current.y += (mousePosition.current.y - ringPosition.current.y) * 0.12
//       if (ringRef.current) {
//         ringRef.current.style.left = `${ringPosition.current.x}px`
//         ringRef.current.style.top = `${ringPosition.current.y}px`
//       }
//       requestAnimationFrame(animateRing)
//     }

//     window.addEventListener('mousemove', handleMouseMove)
//     const animationId = requestAnimationFrame(animateRing)

//     return () => {
//       window.removeEventListener('mousemove', handleMouseMove)
//       cancelAnimationFrame(animationId)
//     }
//   }, [])

//   return (
//     <>
//       <div 
//         ref={dotRef}
//         className="fixed w-2.5 h-2.5 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
//         style={{
//           background: 'linear-gradient(135deg, #7B61FF, #00F5FF)',
//           boxShadow: '0 0 10px rgba(123, 97, 255, 0.8)',
//         }}
//       />
//       <div 
//         ref={ringRef}
//         className="fixed w-10 h-10 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 border-[1.5px] border-neon-cyan/50"
//       />
//       <style jsx global>{`
//         * { cursor: none !important; }
//       `}</style>
//     </>
//   )
// }

// // Social Login Button
// function SocialButton({ 
//   icon, 
//   label, 
//   color, 
//   onClick 
// }: { 
//   icon: React.ReactNode
//   label: string
//   color: string
//   onClick: () => void 
// }) {
//   return (
//     <motion.button
//       whileHover={{ y: -6, scale: 1.12 }}
//       whileTap={{ scale: 0.95 }}
//       onClick={onClick}
//       type="button"
//       className="flex flex-col items-center gap-2 group"
//       style={{ ['--glow-color' as string]: color }}
//     >
//       <div 
//         className="w-[52px] h-[52px] rounded-full flex items-center justify-center transition-all duration-300 relative overflow-hidden"
//         style={{ 
//           background: 'rgba(255, 255, 255, 0.05)',
//           border: '1px solid rgba(255, 255, 255, 0.1)',
//         }}
//       >
//         <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300" style={{ backgroundColor: color }} />
//         {icon}
//       </div>
//       <span className="font-mono text-[9px] text-text-dim uppercase tracking-wider group-hover:text-white transition-colors">
//         {label}
//       </span>
//     </motion.button>
//   )
// }

// // Main Login Page
// export default function LoginPage() {
//   const router = useRouter()
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [showPassword, setShowPassword] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const [isSuccess, setIsSuccess] = useState(false)
//   const [error, setError] = useState('')
//   const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin')
//   const [showForgotModal, setShowForgotModal] = useState(false)

//   // 1. Standard Email/Password Login
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')
//     setIsLoading(true)

//     try {
//       const response = await authApi.login(email, password)
//       const token = response.data?.token
      
//       if (token) {
//         localStorage.setItem('token', token)
//         setIsSuccess(true)
//         toast.success('Welcome back! Redirecting...')
//         setTimeout(() => {
//           router.push('/dashboard')
//         }, 1000)
//       } else {
//         setError('Invalid response from server')
//         setIsLoading(false)
//       }
//     } catch (err: any) {
//       console.error("Login Error:", err)
//       setError(err.response?.data?.message || err.response?.data || 'Invalid email or password')
//       toast.error('Authentication failed')
//       setIsLoading(false)
//     }
//   }

//   // 2. Core Social Login Logic (Firebase -> Backend)
//   const executeSocialLogin = async (provider: AuthProvider, providerName: string) => {
//     setIsLoading(true)
//     setError('')

//     try {
//       const result = await signInWithPopup(auth, provider)
//       const user = result.user

//       const payload = {
//         email: user.email,
//         fullName: user.displayName,
//         provider: providerName,
//         providerId: user.uid,
//         avatarUrl: user.photoURL,
//       }

//       const response = await authApi.socialLogin(payload)
//       const token = response.data?.token

//       if (token) {
//         localStorage.setItem('token', token)
//         setIsSuccess(true)
//         toast.success(`Access Granted: ${user.displayName || 'Hunter'}!`)
//         setTimeout(() => {
//           router.push('/dashboard')
//         }, 1000)
//       } else {
//         throw new Error('No token received from backend')
//       }
//     } catch (err: any) {
//       console.error(`${providerName} Login Error:`, err)
//       setError(err.message || `Failed to authenticate with ${providerName}`)
//       toast.error(`${providerName} login failed`)
//       setIsLoading(false)
//     }
//   }

//   // 3. Wrapper to map buttons to correct providers
//   const handleSocialClick = (providerStr: string) => {
//     if (providerStr === 'Google') {
//       executeSocialLogin(googleProvider, 'GOOGLE')
//     } else if (providerStr === 'GitHub') {
//       executeSocialLogin(githubProvider, 'GITHUB')
//     } else if (providerStr === 'Facebook') {
//       executeSocialLogin(facebookProvider, 'FACEBOOK')
//     } else if (providerStr === 'Microsoft') {
//       // 👇 MICROSOFT CLICK HANDLER ADDED 👇
//       executeSocialLogin(microsoftProvider, 'MICROSOFT')
//     } else {
//       toast.info(`${providerStr} login coming soon!`)
//     }
//   }

//   return (
//     <div className="min-h-screen relative overflow-hidden">
//       <CustomCursor />
      
//       {/* 3D Background */}
//       <div className="fixed inset-0 z-0">
//         <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
//           <LoginScene />
//         </Canvas>
//       </div>

//       {/* Content */}
//       <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
//         <Tilt
//           tiltMaxAngleX={8}
//           tiltMaxAngleY={8}
//           glareEnable
//           glareMaxOpacity={0.1}
//           glareColor="#7B61FF"
//           glarePosition="all"
//         >
//           <motion.div
//             initial={{ y: 80, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//             className="w-full max-w-[420px]"
//           >
//             {/* Glass Card */}
//             <div className="glass-card rounded-3xl overflow-hidden relative">
//               {/* Top Gradient Accent */}
//               <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-neon-violet to-neon-cyan to-transparent" />
              
//               {/* Corner Brackets */}
//               <svg className="absolute top-4 left-4 w-6 h-6 text-neon-violet/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
//                 <path d="M6 4H4v16h2M18 4h2v16h-2" />
//               </svg>
//               <svg className="absolute bottom-4 right-4 w-6 h-6 text-neon-cyan/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
//                 <path d="M6 20H4V4h2M18 20h2V4h-2" />
//               </svg>

//               <div className="p-8">
//                 {/* Logo Section */}
//                 <motion.div
//                   initial={{ scale: 0, rotate: -180 }}
//                   animate={{ scale: 1, rotate: 0 }}
//                   transition={{ type: 'spring', stiffness: 200, damping: 20 }}
//                   className="text-center mb-8"
//                 >
//                   <div className="relative w-20 h-20 mx-auto mb-4 animate-float">
//                     <svg viewBox="0 0 100 100" className="w-full h-full">
//                       <defs>
//                         <linearGradient id="loginLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
//                           <stop offset="0%" stopColor="#7B61FF" />
//                           <stop offset="100%" stopColor="#00F5FF" />
//                         </linearGradient>
//                       </defs>
//                       <circle cx="50" cy="50" r="45" fill="none" stroke="url(#loginLogoGradient)" strokeWidth="2" />
//                       <path d="M30 35 L30 65 L50 75 L70 65 L70 35 L50 25 Z" fill="none" stroke="url(#loginLogoGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                       <circle cx="50" cy="50" r="8" fill="url(#loginLogoGradient)" opacity="0.5" />
//                       <path d="M50 20 L50 15 M50 85 L50 80 M20 50 L15 50 M85 50 L80 50" stroke="url(#loginLogoGradient)" strokeWidth="2" strokeLinecap="round" />
//                     </svg>
//                   </div>
//                   <h1 className="font-orbitron text-2xl font-bold text-gradient mb-1">
//                     AI JOB HUNTER
//                   </h1>
//                   <div className="flex items-center justify-center gap-2">
//                     <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-neon-violet/20 text-neon-violet border border-neon-violet/30">
//                       v2.0.26
//                     </span>
//                     <span className="font-mono text-[10px] text-text-dim">
//                       CAREER OS
//                     </span>
//                   </div>
//                 </motion.div>

//                 {/* Tabs */}
//                 <div className="flex gap-2 mb-6 p-1 rounded-xl bg-bg-glass border border-border-dim">
//                   <button
//                     onClick={() => setActiveTab('signin')}
//                     type="button"
//                     className={`flex-1 py-2 px-4 rounded-lg font-mono text-sm transition-all duration-300 ${
//                       activeTab === 'signin'
//                         ? 'bg-neon-violet/20 text-neon-violet border border-neon-violet/30'
//                         : 'text-text-dim hover:text-text-primary'
//                     }`}
//                   >
//                     Sign In
//                   </button>
//                   <button
//                     onClick={() => router.push('/register')}
//                     type="button"
//                     className={`flex-1 py-2 px-4 rounded-lg font-mono text-sm transition-all duration-300 ${
//                       activeTab === 'signup'
//                         ? 'bg-neon-violet/20 text-neon-violet border border-neon-violet/30'
//                         : 'text-text-dim hover:text-text-primary'
//                     }`}
//                   >
//                     Sign Up
//                   </button>
//                 </div>

//                 {/* Form */}
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   <AnimatePresence mode="wait">
//                     {error && (
//                       <motion.div
//                         initial={{ opacity: 0, x: -10 }}
//                         animate={{ opacity: 1, x: [0, -10, 10, -10, 10, 0] }}
//                         exit={{ opacity: 0 }}
//                         className="p-3 rounded-lg bg-neon-rose/10 border border-neon-rose/30 text-neon-rose text-sm font-mono"
//                       >
//                         {error}
//                       </motion.div>
//                     )}
//                   </AnimatePresence>

//                   <motion.div
//                     initial={{ x: -30, opacity: 0 }}
//                     animate={{ x: 0, opacity: 1 }}
//                     transition={{ delay: 0.3 }}
//                     className="relative input-underline"
//                   >
//                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-dim" />
//                     <input
//                       type="email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       placeholder="Email address"
//                       className="w-full bg-bg-glass border border-border-dim rounded-xl py-3.5 pl-12 pr-4 text-sm text-text-primary placeholder:text-text-dimmer focus:outline-none focus:border-neon-cyan transition-all duration-300"
//                       required
//                     />
//                   </motion.div>

//                   <motion.div
//                     initial={{ x: -30, opacity: 0 }}
//                     animate={{ x: 0, opacity: 1 }}
//                     transition={{ delay: 0.4 }}
//                     className="relative input-underline"
//                   >
//                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-dim" />
//                     <input
//                       type={showPassword ? 'text' : 'password'}
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       placeholder="Password"
//                       className="w-full bg-bg-glass border border-border-dim rounded-xl py-3.5 pl-12 pr-12 text-sm text-text-primary placeholder:text-text-dimmer focus:outline-none focus:border-neon-cyan transition-all duration-300"
//                       required
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-primary transition-colors z-10"
//                     >
//                       {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                     </button>
//                   </motion.div>

//                   <div className="flex items-center justify-between text-sm">
//                     <label className="flex items-center gap-2 cursor-pointer z-10">
//                       <input type="checkbox" className="w-4 h-4 rounded border-border-dim bg-bg-glass text-neon-violet focus:ring-neon-violet" />
//                       <span className="text-text-dim font-mono text-xs">Remember me</span>
//                     </label>
//                     <button
//                       type="button"
//                       onClick={() => setShowForgotModal(true)}
//                       className="text-neon-cyan hover:text-neon-violet transition-colors font-mono text-xs z-10"
//                     >
//                       Forgot password?
//                     </button>
//                   </div>

//                   <motion.button
//                     initial={{ y: 20, opacity: 0 }}
//                     animate={{ y: 0, opacity: 1 }}
//                     transition={{ delay: 0.5 }}
//                     type="submit"
//                     disabled={isLoading || isSuccess}
//                     className={`w-full py-4 rounded-xl font-orbitron font-semibold text-sm relative overflow-hidden btn-shimmer transition-all duration-300 z-10 ${
//                       isSuccess
//                         ? 'bg-neon-emerald text-bg-void'
//                         : 'bg-gradient-to-r from-neon-violet via-neon-rose to-neon-cyan text-white hover:shadow-neon-violet'
//                     }`}
//                   >
//                     {isLoading ? (
//                       <Loader2 className="w-5 h-5 animate-spin mx-auto" />
//                     ) : isSuccess ? (
//                       <span className="flex items-center justify-center gap-2">
//                         <Check className="w-5 h-5" />
//                         access_granted()
//                       </span>
//                     ) : (
//                       <span className="flex items-center justify-center gap-2">
//                         {activeTab === 'signin' ? 'Sign In' : 'Create Account'}
//                         <ArrowRight className="w-4 h-4" />
//                       </span>
//                     )}
//                   </motion.button>
//                 </form>

//                 {/* Divider */}
//                 <div className="flex items-center gap-4 my-6 relative z-10">
//                   <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border-dim" />
//                   <span className="text-text-dimmer font-mono text-[10px] uppercase tracking-wider">
//                     Or continue with
//                   </span>
//                   <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border-dim" />
//                 </div>

//                 {/* Social Login */}
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.6 }}
//                   className="flex justify-center gap-6 relative z-10"
//                 >
//                   <SocialButton
//                     label="Google"
//                     color="#4285F4"
//                     onClick={() => handleSocialClick('Google')}
//                     icon={
//                       <svg className="w-5 h-5" viewBox="0 0 24 24">
//                         <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                         <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                         <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                         <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//                       </svg>
//                     }
//                   />
//                   <SocialButton
//                     label="GitHub"
//                     color="#ffffff"
//                     onClick={() => handleSocialClick('GitHub')}
//                     icon={
//                       <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
//                         <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
//                       </svg>
//                     }
//                   />
                  
//                   {/* 👇 MICROSOFT BUTTON ADDED HERE 👇 */}
//                   <SocialButton
//                     label="Microsoft"
//                     color="#00a4ef"
//                     onClick={() => handleSocialClick('Microsoft')}
//                     icon={
//                       <svg className="w-5 h-5" viewBox="0 0 21 21">
//                         <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
//                         <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
//                         <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
//                         <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
//                       </svg>
//                     }
//                   />

//                   <SocialButton
//                     label="Facebook"
//                     color="#1877F2"
//                     onClick={() => handleSocialClick('Facebook')}
//                     icon={
//                       <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
//                         <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
//                       </svg>
//                     }
//                   />
//                 </motion.div>
//               </div>
//             </div>
//           </motion.div>
//         </Tilt>
//       </div>

//       {/* Status Bar */}
//       <div className="fixed bottom-0 left-0 right-0 z-20 px-6 py-3 bg-bg-deep/80 backdrop-blur-md border-t border-border-dim pointer-events-none">
//         <div className="flex items-center justify-between font-mono text-[10px] text-text-dim">
//           <span>ai-job-hunter · v2.0.26</span>
//           <div className="flex items-center gap-2">
//             <span className="w-2 h-2 rounded-full bg-neon-emerald pulse-dot" />
//             <span>SYSTEMS ONLINE</span>
//           </div>
//           <span>SEC: AES-256 · TLS 1.3</span>
//         </div>
//       </div>

//       {/* Forgot Password Modal */}
//       <AnimatePresence>
//         {showForgotModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
//             onClick={() => setShowForgotModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               onClick={(e) => e.stopPropagation()}
//               className="glass-card rounded-2xl p-6 w-full max-w-sm"
//             >
//               <h3 className="font-orbitron text-lg font-semibold text-gradient mb-2">
//                 Reset Password
//               </h3>
//               <p className="text-text-dim text-sm mb-4">
//                 Enter your email and we&apos;ll send you a reset link.
//               </p>
//               <input
//                 type="email"
//                 placeholder="Email address"
//                 className="w-full bg-bg-glass border border-border-dim rounded-xl py-3 px-4 text-sm text-text-primary placeholder:text-text-dimmer focus:outline-none focus:border-neon-cyan transition-all duration-300 mb-4"
//               />
//               <button
//                 type="button"
//                 onClick={() => {
//                   toast.success('Reset link sent!')
//                   setShowForgotModal(false)
//                 }}
//                 className="w-full py-3 rounded-xl bg-neon-violet/20 text-neon-violet border border-neon-violet/30 font-mono text-sm hover:bg-neon-violet/30 transition-all"
//               >
//                 send_reset_link()
//               </button>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }


'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Float } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import * as THREE from 'three'
import Tilt from 'react-parallax-tilt'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Check,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'

import { authApi } from '@/lib/api' 
import { auth, googleProvider, githubProvider, facebookProvider, microsoftProvider } from '@/lib/firebase'
import { signInWithPopup, AuthProvider } from 'firebase/auth'

// 3D Scene Component
function LoginScene() {
  const meshRef = useRef<THREE.Group>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001
      meshRef.current.rotation.x = mousePosition.y * 0.1
      meshRef.current.rotation.z = mousePosition.x * 0.05
    }
    state.camera.position.x += (mousePosition.x * 3 - state.camera.position.x) * 0.02
    state.camera.position.y += (mousePosition.y * 2 - state.camera.position.y) * 0.02
    state.camera.lookAt(0, 0, 0)
  })

  return (
    <>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
      <group ref={meshRef}>
        <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
          <mesh position={[-3, 1, -5]}>
            <icosahedronGeometry args={[1.8, 0]} />
            <meshStandardMaterial 
              wireframe 
              color="#7B61FF" 
              emissive="#7B61FF"
              emissiveIntensity={0.5}
            />
          </mesh>
        </Float>
        <Float speed={2} rotationIntensity={1.2} floatIntensity={1.5}>
          <mesh position={[3, -1, -6]}>
            <octahedronGeometry args={[1.5, 0]} />
            <meshStandardMaterial 
              wireframe 
              color="#00F5FF" 
              emissive="#00F5FF"
              emissiveIntensity={0.5}
            />
          </mesh>
        </Float>
        <Float speed={1.8} rotationIntensity={0.8} floatIntensity={2.2}>
          <mesh position={[0, 2, -8]}>
            <torusKnotGeometry args={[1, 0.3, 100, 16]} />
            <meshStandardMaterial 
              wireframe 
              color="#FF2D78" 
              emissive="#FF2D78"
              emissiveIntensity={0.3}
            />
          </mesh>
        </Float>
        <Float speed={2.2} rotationIntensity={1.5} floatIntensity={1.8}>
          <mesh position={[-2, -2, -4]}>
            <tetrahedronGeometry args={[1.2, 0]} />
            <meshStandardMaterial 
              wireframe 
              color="#00FFA3" 
              emissive="#00FFA3"
              emissiveIntensity={0.4}
            />
          </mesh>
        </Float>
      </group>
      <EffectComposer>
        <Bloom luminanceThreshold={0.3} intensity={1.5} levels={9} />
        {/* Fix applied here to remove the TypeScript error */}
        <ChromaticAberration 
          offset={new THREE.Vector2(0.002, 0.002)} 
          radialModulation={false}
          modulationOffset={0}
        />
      </EffectComposer>
    </>
  )
}

// Custom Cursor Component
function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const mousePosition = useRef({ x: 0, y: 0 })
  const ringPosition = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`
        dotRef.current.style.top = `${e.clientY}px`
      }
    }

    const animateRing = () => {
      ringPosition.current.x += (mousePosition.current.x - ringPosition.current.x) * 0.12
      ringPosition.current.y += (mousePosition.current.y - ringPosition.current.y) * 0.12
      if (ringRef.current) {
        ringRef.current.style.left = `${ringPosition.current.x}px`
        ringRef.current.style.top = `${ringPosition.current.y}px`
      }
      requestAnimationFrame(animateRing)
    }

    window.addEventListener('mousemove', handleMouseMove)
    const animationId = requestAnimationFrame(animateRing)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <>
      <div 
        ref={dotRef}
        className="fixed w-2.5 h-2.5 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{
          background: 'linear-gradient(135deg, #7B61FF, #00F5FF)',
          boxShadow: '0 0 10px rgba(123, 97, 255, 0.8)',
        }}
      />
      <div 
        ref={ringRef}
        className="fixed w-10 h-10 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 border-[1.5px] border-neon-cyan/50"
      />
      <style jsx global>{`
        * { cursor: none !important; }
      `}</style>
    </>
  )
}

// Social Login Button Component
function SocialButton({ 
  icon, 
  label, 
  color, 
  onClick 
}: { 
  icon: React.ReactNode
  label: string
  color: string
  onClick: () => void 
}) {
  return (
    <motion.button
      whileHover={{ y: -6, scale: 1.12 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      type="button"
      className="flex flex-col items-center gap-2 group"
      style={{ ['--glow-color' as string]: color }}
    >
      <div 
        className="w-[52px] h-[52px] rounded-full flex items-center justify-center transition-all duration-300 relative overflow-hidden"
        style={{ 
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300" style={{ backgroundColor: color }} />
        {icon}
      </div>
      <span className="font-mono text-[9px] text-text-dim uppercase tracking-wider group-hover:text-white transition-colors">
        {label}
      </span>
    </motion.button>
  )
}

// Main Login Page
export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin')
  const [showForgotModal, setShowForgotModal] = useState(false)

  // Standard Email/Password Login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await authApi.login(email, password)
      const token = response.data?.token
      
      if (token) {
        localStorage.setItem('token', token)
        setIsSuccess(true)
        toast.success('Welcome back! Redirecting...')
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      } else {
        setError('Invalid response from server')
        setIsLoading(false)
      }
    } catch (err: any) {
      console.error("Login Error:", err)
      setError(err.response?.data?.message || err.response?.data || 'Invalid email or password')
      toast.error('Authentication failed')
      setIsLoading(false)
    }
  }

  // Social Login Logic (Firebase -> Backend)
  const executeSocialLogin = async (provider: AuthProvider, providerName: string) => {
    setIsLoading(true)
    setError('')

    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      const payload = {
        email: user.email,
        fullName: user.displayName,
        provider: providerName,
        providerId: user.uid,
        avatarUrl: user.photoURL,
      }

      const response = await authApi.socialLogin(payload)
      const token = response.data?.token

      if (token) {
        localStorage.setItem('token', token)
        setIsSuccess(true)
        toast.success(`Access Granted: ${user.displayName || 'Hunter'}!`)
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      } else {
        throw new Error('No token received from backend')
      }
    } catch (err: any) {
      console.error(`${providerName} Login Error:`, err)
      setError(err.message || `Failed to authenticate with ${providerName}`)
      toast.error(`${providerName} login failed`)
      setIsLoading(false)
    }
  }

  // Map buttons to correct providers
  const handleSocialClick = (providerStr: string) => {
    if (providerStr === 'Google') {
      executeSocialLogin(googleProvider, 'GOOGLE')
    } else if (providerStr === 'GitHub') {
      executeSocialLogin(githubProvider, 'GITHUB')
    } else if (providerStr === 'Facebook') {
      executeSocialLogin(facebookProvider, 'FACEBOOK')
    } else if (providerStr === 'Microsoft') {
      executeSocialLogin(microsoftProvider, 'MICROSOFT')
    } else {
      toast.info(`${providerStr} login coming soon!`)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CustomCursor />
      
      {/* 3D Background */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
          <LoginScene />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <Tilt
          tiltMaxAngleX={8}
          tiltMaxAngleY={8}
          glareEnable
          glareMaxOpacity={0.1}
          glareColor="#7B61FF"
          glarePosition="all"
        >
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-[420px]"
          >
            {/* Glass Card */}
            <div className="glass-card rounded-3xl overflow-hidden relative">
              {/* Top Gradient Accent */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-neon-violet to-neon-cyan to-transparent" />
              
              {/* Corner Brackets */}
              <svg className="absolute top-4 left-4 w-6 h-6 text-neon-violet/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 4H4v16h2M18 4h2v16h-2" />
              </svg>
              <svg className="absolute bottom-4 right-4 w-6 h-6 text-neon-cyan/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 20H4V4h2M18 20h2V4h-2" />
              </svg>

              <div className="p-8">
                {/* Logo Section */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className="text-center mb-8"
                >
                  <div className="relative w-20 h-20 mx-auto mb-4 animate-float">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <defs>
                        <linearGradient id="loginLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#7B61FF" />
                          <stop offset="100%" stopColor="#00F5FF" />
                        </linearGradient>
                      </defs>
                      <circle cx="50" cy="50" r="45" fill="none" stroke="url(#loginLogoGradient)" strokeWidth="2" />
                      <path d="M30 35 L30 65 L50 75 L70 65 L70 35 L50 25 Z" fill="none" stroke="url(#loginLogoGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="50" cy="50" r="8" fill="url(#loginLogoGradient)" opacity="0.5" />
                      <path d="M50 20 L50 15 M50 85 L50 80 M20 50 L15 50 M85 50 L80 50" stroke="url(#loginLogoGradient)" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <h1 className="font-orbitron text-2xl font-bold text-gradient mb-1">
                    AI JOB HUNTER
                  </h1>
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-neon-violet/20 text-neon-violet border border-neon-violet/30">
                      v2.0.26
                    </span>
                    <span className="font-mono text-[10px] text-text-dim">
                      CAREER OS
                    </span>
                  </div>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 p-1 rounded-xl bg-bg-glass border border-border-dim">
                  <button
                    onClick={() => setActiveTab('signin')}
                    type="button"
                    className={`flex-1 py-2 px-4 rounded-lg font-mono text-sm transition-all duration-300 ${
                      activeTab === 'signin'
                        ? 'bg-neon-violet/20 text-neon-violet border border-neon-violet/30'
                        : 'text-text-dim hover:text-text-primary'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => router.push('/register')}
                    type="button"
                    className={`flex-1 py-2 px-4 rounded-lg font-mono text-sm transition-all duration-300 ${
                      activeTab === 'signup'
                        ? 'bg-neon-violet/20 text-neon-violet border border-neon-violet/30'
                        : 'text-text-dim hover:text-text-primary'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <AnimatePresence mode="wait">
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: [0, -10, 10, -10, 10, 0] }}
                        exit={{ opacity: 0 }}
                        className="p-3 rounded-lg bg-neon-rose/10 border border-neon-rose/30 text-neon-rose text-sm font-mono"
                      >
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="relative input-underline"
                  >
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-dim" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address"
                      className="w-full bg-bg-glass border border-border-dim rounded-xl py-3.5 pl-12 pr-4 text-sm text-text-primary placeholder:text-text-dimmer focus:outline-none focus:border-neon-cyan transition-all duration-300"
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="relative input-underline"
                  >
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-dim" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full bg-bg-glass border border-border-dim rounded-xl py-3.5 pl-12 pr-12 text-sm text-text-primary placeholder:text-text-dimmer focus:outline-none focus:border-neon-cyan transition-all duration-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-primary transition-colors z-10"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </motion.div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer z-10">
                      <input type="checkbox" className="w-4 h-4 rounded border-border-dim bg-bg-glass text-neon-violet focus:ring-neon-violet" />
                      <span className="text-text-dim font-mono text-xs">Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-neon-cyan hover:text-neon-violet transition-colors font-mono text-xs z-10"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    type="submit"
                    disabled={isLoading || isSuccess}
                    className={`w-full py-4 rounded-xl font-orbitron font-semibold text-sm relative overflow-hidden btn-shimmer transition-all duration-300 z-10 ${
                      isSuccess
                        ? 'bg-neon-emerald text-bg-void'
                        : 'bg-gradient-to-r from-neon-violet via-neon-rose to-neon-cyan text-white hover:shadow-neon-violet'
                    }`}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    ) : isSuccess ? (
                      <span className="flex items-center justify-center gap-2">
                        <Check className="w-5 h-5" />
                        access_granted()
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        {activeTab === 'signin' ? 'Sign In' : 'Create Account'}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </motion.button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6 relative z-10">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border-dim" />
                  <span className="text-text-dimmer font-mono text-[10px] uppercase tracking-wider">
                    Or continue with
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border-dim" />
                </div>

                {/* Social Login */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex justify-center gap-6 relative z-10"
                >
                  <SocialButton
                    label="Google"
                    color="#4285F4"
                    onClick={() => handleSocialClick('Google')}
                    icon={
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    }
                  />
                  <SocialButton
                    label="GitHub"
                    color="#ffffff"
                    onClick={() => handleSocialClick('GitHub')}
                    icon={
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    }
                  />
                  
                  <SocialButton
                    label="Microsoft"
                    color="#00a4ef"
                    onClick={() => handleSocialClick('Microsoft')}
                    icon={
                      <svg className="w-5 h-5" viewBox="0 0 21 21">
                        <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                        <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                        <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                        <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                      </svg>
                    }
                  />

                  <SocialButton
                    label="Facebook"
                    color="#1877F2"
                    onClick={() => handleSocialClick('Facebook')}
                    icon={
                      <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    }
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </Tilt>
      </div>

      {/* Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 px-6 py-3 bg-bg-deep/80 backdrop-blur-md border-t border-border-dim pointer-events-none">
        <div className="flex items-center justify-between font-mono text-[10px] text-text-dim">
          <span>ai-job-hunter · v2.0.26</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neon-emerald pulse-dot" />
            <span>SYSTEMS ONLINE</span>
          </div>
          <span>SEC: AES-256 · TLS 1.3</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowForgotModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card rounded-2xl p-6 w-full max-w-sm"
            >
              <h3 className="font-orbitron text-lg font-semibold text-gradient mb-2">
                Reset Password
              </h3>
              <p className="text-text-dim text-sm mb-4">
                Enter your email and we'll send you a reset link.
              </p>
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-bg-glass border border-border-dim rounded-xl py-3 px-4 text-sm text-text-primary placeholder:text-text-dimmer focus:outline-none focus:border-neon-cyan transition-all duration-300 mb-4"
              />
              <button
                type="button"
                onClick={() => {
                  toast.success('Reset link sent!')
                  setShowForgotModal(false)
                }}
                className="w-full py-3 rounded-xl bg-neon-violet/20 text-neon-violet border border-neon-violet/30 font-mono text-sm hover:bg-neon-violet/30 transition-all"
              >
                send_reset_link()
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}