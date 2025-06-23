import { create } from 'zustand'
import type { LoginResponse } from '@/types/api/auth.types'

type User = LoginResponse['user']

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  tokenExpiresAt: number | null // Timestamp in ms
  isLoading: boolean
  actions: {
    setUser: (user: User | null, expiresIn?: number) => void
    clearAuth: () => void
    setLoading: (loading: boolean) => void
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  tokenExpiresAt: null,
  isLoading: true, // Start with loading true until session is checked
  actions: {
    setUser: (user, expiresIn) => {
      const expiresAt = expiresIn ? Date.now() + expiresIn * 1000 : null
      set({
        user,
        isAuthenticated: !!user,
        tokenExpiresAt: expiresAt,
        isLoading: false,
      })
    },
    clearAuth: () =>
      set({
        user: null,
        isAuthenticated: false,
        tokenExpiresAt: null,
        isLoading: false,
      }),
    setLoading: (loading) => set({ isLoading: loading }),
  },
}))

// Export actions and selectors for convenience
export const useAuthUser = () => useAuthStore((state) => state.user)
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated)
export const useAuthIsLoading = () => useAuthStore((state) => state.isLoading)
export const useTokenExpiresAt = () =>
  useAuthStore((state) => state.tokenExpiresAt)
export const useAuthActions = () => useAuthStore((state) => state.actions)
