'use client' // This page uses hooks like useRouter and checks auth state
import { LoginForm } from '@/components/features/auth/login-form'
import { useIsAuthenticated, useAuthIsLoading } from '@/stores/auth-store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const isAuthenticated = useIsAuthenticated()
  const isLoading = useAuthIsLoading()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/') // Or your default authenticated route
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || (!isLoading && isAuthenticated)) {
    // Show a loading state or null while checking auth/redirecting
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
      <LoginForm />
    </div>
  )
}
