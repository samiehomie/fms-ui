'use client'
import '@/lib/global'
import { ReactNode, useEffect } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './features/auth/auth-provider'
import { getQueryClient } from '@/lib/api/get-query-client'
import { logger as loggerUtils } from '@/lib/utils'

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  )
}
