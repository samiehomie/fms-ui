'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import type { ApiResponseType } from '@/types/api'
import { parseJWT } from '@/lib/api/auth'
import type { JWTAuthPayload } from '@/types/api'

type User = ApiResponseType<'POST /auth/login'>['user']

type AuthContextType = {
  user: JWTAuthPayload | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
})

export function AuthProvider({
  children,
  token,
}: {
  children: ReactNode
  token?: string
}) {
  const [authState, setAuthState] = useState<AuthContextType>({
    user: null,
    isLoading: true,
  })

  useEffect(() => {
    const handleAuthChange = async () => {
      if (!token) {
        return setAuthState({ user: null, isLoading: false })
      }
      try {
        const user = await parseJWT<JWTAuthPayload>(token)
        setAuthState({
          user,
          isLoading: false,
        })
      } catch (error) {
        setAuthState({ user: null, isLoading: false })
      }
    }

    // 1. 초기 로드 시
    handleAuthChange()

    // 2. 탭 간 인증 상태 동기화
    window.addEventListener('storage', handleAuthChange)

    return () => window.removeEventListener('storage', handleAuthChange)
  }, [token])

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
