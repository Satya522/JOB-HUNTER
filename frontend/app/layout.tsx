import type { Metadata, Viewport } from 'next'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Job Hunter — Career OS v2.0.26',
  description: 'AI-powered job hunting platform with advanced analytics, resume optimization, and real-time job feeds.',
  keywords: ['job search', 'AI', 'career', 'resume', 'interview', 'analytics'],
  authors: [{ name: 'AI Job Hunter Team' }],
  creator: 'AI Job Hunter',
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'AI Job Hunter — Career OS',
    description: 'Next-generation AI-powered job hunting platform',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#00020f',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        {/* Background Layers */}
        <div className="fixed inset-0 z-0 bg-bg-void" />
        
        {/* Ambient Glow Blobs */}
        <div className="ambient-glow ambient-glow-1" />
        <div className="ambient-glow ambient-glow-2" />
        <div className="ambient-glow ambient-glow-3" />
        
        {/* Grid Pattern */}
        <div className="grid-pattern" />
        
        {/* Scanlines */}
        <div className="scanlines" />
        
        {/* Main Content */}
        <main className="relative z-10 min-h-screen">
          {children}
        </main>
        
        {/* Toast Notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(8, 10, 40, 0.95)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(123, 97, 255, 0.2)',
              color: '#E8EAFF',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '13px',
            },
          }}
        />
      </body>
    </html>
  )
}
