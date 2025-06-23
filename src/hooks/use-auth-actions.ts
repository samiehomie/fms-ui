'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useAuthActions as useStoreActions } from '@/stores/auth-store'
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
} from '@/types/api/auth.types'

interface LoginSuccessData {
  user: LoginResponse['user']
  expiresIn: number // seconds
}

interface RefreshSuccessData {
  user: RefreshTokenResponse['user']
  expiresIn: number // seconds
}

export function useAuthActions() {
  const storeActions = useStoreActions()
  const router = useRouter()
  const queryClient = useQueryClient()

  const loginMutation = useMutation<LoginSuccessData, Error, LoginRequest>({
    mutationFn: async (credentials) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }
      return response.json()
    },
    onSuccess: (data) => {
      storeActions.setUser(data.user, data.expiresIn)
      router.push('/dashboard') // Or your desired redirect path
    },
    onError: (error) => {
      console.error('Login error:', error)
      storeActions.clearAuth()
      // You might want to show a toast notification here
    },
  })

  const logoutMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      const response = await fetch('/api/auth/logout', { method: 'POST' })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Logout failed')
      }
    },
    onSuccess: () => {
      storeActions.clearAuth()
      queryClient.clear() // Clear all query cache on logout
      router.push('/login')
    },
    onError: (error) => {
      console.error('Logout error:', error)
      // Handle logout error, maybe show a toast
    },
  })

  const refreshAccessToken = async (): Promise<RefreshSuccessData | null> => {
    try {
      storeActions.setLoading(true)
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
      })
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Token refresh failed:', errorData.message)
        storeActions.clearAuth()
        router.push('/login') // Force logout if refresh fails
        return null
      }
      const data: RefreshSuccessData = await response.json()
      storeActions.setUser(data.user, data.expiresIn)
      return data
    } catch (error) {
      console.error('Token refresh error:', error)
      storeActions.clearAuth()
      router.push('/login') // Force logout on unexpected error
      return null
    } finally {
      storeActions.setLoading(false)
    }
  }

  return {
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
    refreshAccessToken,
  }
}
