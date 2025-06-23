'use client' // This page uses hooks like useRouter and checks auth state

import {
  useIsAuthenticated,
  useAuthUser,
  useAuthIsLoading,
} from '@/stores/auth-store'
import { useAuthActions } from '@/hooks/use-auth-actions'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const router = useRouter()
  const isAuthenticated = useIsAuthenticated()
  const isLoading = useAuthIsLoading()
  const user = useAuthUser()
  const { logout, isLoggingOut } = useAuthActions()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || (!isLoading && !isAuthenticated)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">
        Welcome to the Dashboard, {user?.name || user?.username}!
      </h1>
      <p className="mb-8">You are successfully logged in.</p>
      <Button onClick={() => logout()} disabled={isLoggingOut}>
        {isLoggingOut ? 'Logging out...' : 'Logout'}
      </Button>
    </div>
  )
}
