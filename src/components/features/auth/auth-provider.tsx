'use client'

import type React from 'react'
import { useEffect, useRef } from 'react'
import {
  useAuthActions as useStoreActions,
  useTokenExpiresAt,
  useIsAuthenticated,
} from '@/stores/auth-store'
import { useAuthActions } from '@/hooks/use-auth'

interface LoginResponse {
  user: any // Replace 'any' with the actual type of your user object
}

interface SessionData {
  user: LoginResponse['user'] | null
  isAuthenticated: boolean
  // If your session endpoint returns expiresIn for the current token:
  // expiresIn?: number;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const storeActions = useStoreActions()
  const { refreshAccessToken } = useAuthActions()
  const tokenExpiresAt = useTokenExpiresAt()
  const isAuthenticated = useIsAuthenticated()
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // TODO: 실제 없는 더미 API 호출중임
  // useEffect(() => {
  //   const checkSession = async () => {
  //     try {
  //       storeActions.setLoading(true)
  //       const response = await fetch('/api/auth/session')
  //       if (response.ok) {
  //         const data: SessionData = await response.json()
  //         // If your /api/auth/session returns `expiresIn` for the current token, use it.
  //         // Otherwise, the client won't know the initial token's exact expiry without it.
  //         // For this example, we assume login/refresh are the primary sources of `expiresIn`.
  //         // If `data.expiresIn` is available from session: storeActions.setUser(data.user, data.expiresIn);
  //         // Else, if only user is returned:
  //         if (data.isAuthenticated && data.user) {
  //           // We don't get expiresIn from session, so we can't set a precise timer here initially.
  //           // The timer will be set after a login or a manual refresh.
  //           // Or, if the cookie Max-Age is the sole source of truth for expiry,
  //           // the refresh will be attempted when an API call fails or proactively.
  //           storeActions.setUser(data.user) // Not passing expiresIn here
  //         } else {
  //           storeActions.clearAuth()
  //         }
  //       } else {
  //         storeActions.clearAuth()
  //       }
  //     } catch (error) {
  //       console.error('Failed to check session:', error)
  //       storeActions.clearAuth()
  //     } finally {
  //       storeActions.setLoading(false)
  //     }
  //   }
  //   checkSession()
  // }, [storeActions])

  // useEffect(() => {
  //   if (refreshTimeoutRef.current) {
  //     clearTimeout(refreshTimeoutRef.current)
  //   }

  //   if (isAuthenticated && tokenExpiresAt) {
  //     const now = Date.now()
  //     // Refresh 1 minute before expiry, or sooner if expiry is very short
  //     const refreshOffset = Math.min(60 * 1000, (tokenExpiresAt - now) * 0.1)
  //     const timeoutDuration = tokenExpiresAt - now - refreshOffset

  //     if (timeoutDuration > 0) {
  //       refreshTimeoutRef.current = setTimeout(async () => {
  //         console.log('Attempting token refresh...')
  //         await refreshAccessToken()
  //       }, timeoutDuration)
  //     } else if (tokenExpiresAt < now) {
  //       // Token already expired
  //       console.log('Token already expired, attempting refresh immediately.')
  //       refreshAccessToken()
  //     }
  //   }

  //   return () => {
  //     if (refreshTimeoutRef.current) {
  //       clearTimeout(refreshTimeoutRef.current)
  //     }
  //   }
  // }, [isAuthenticated, tokenExpiresAt, refreshAccessToken])

  return <>{children}</>
}
