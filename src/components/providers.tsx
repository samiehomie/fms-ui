'use client'
import '@/lib/global'
import { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './features/auth/auth-provider'
import { getQueryClient } from '@/lib/api/get-query-client'
import { SessionMonitorProvider } from './features/auth/session-monitor-provider'

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <SessionMonitorProvider>
        <AuthProvider>{children}</AuthProvider>
      </SessionMonitorProvider>
    </QueryClientProvider>
  )
}
