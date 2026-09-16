import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, AuthResponse } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  isMounted: boolean  // ✅ NEW: For SSR hydration
  
  // Actions
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  login: (response: AuthResponse) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  setMounted: (mounted: boolean) => void  // ✅ NEW
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isMounted: false,  // ✅ NEW

      setUser: (user) => set({ user }),
      
      setToken: (token) => set({ token, isAuthenticated: !!token }),
      
      login: (response) => {
        // ✅ FIXED: Check if we're in browser before accessing localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', response.token)
        }
        set({
          user: {
            id: response.userId,
            fullName: response.fullName,
            email: response.email,
            avatarUrl: response.avatarUrl,
          },
          token: response.token,
          isAuthenticated: true,
        })
      },
      
      logout: () => {
        // ✅ FIXED: Check if we're in browser before accessing localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token')
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setMounted: (mounted) => set({ isMounted: mounted }),  // ✅ NEW
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
)
