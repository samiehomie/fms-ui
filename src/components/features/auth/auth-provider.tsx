'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import type { JWTAuthPayload } from '@/types/api'
import { getAuthData } from '@/lib/actions/auth'

type AuthContextType = {
  user: JWTAuthPayload | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthContextType>({
    user: null,
    isLoading: true,
  })

  useEffect(() => {
    const handleAuthChange = async () => {
      try {
        const authData = await getAuthData()
        setAuthState({
          user: authData?.user ?? null,
          isLoading: false,
        })
      } catch (error) {
        setAuthState({ user: null, isLoading: false })
      }
    }
    handleAuthChange()
  }, [])

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
