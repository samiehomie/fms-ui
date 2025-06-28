'use client'
import { ReactNode, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './features/auth/auth-provider'

export function Providers({
  children,
  token,
}: {
  children: ReactNode
  token?: string
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 3 * 60 * 1000, // 3분
            gcTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  )
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider token={token}>{children}</AuthProvider>
    </QueryClientProvider>
  )
}
