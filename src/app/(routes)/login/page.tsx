'use client' // This page uses hooks like useRouter and checks auth state
import { LoginForm } from '@/components/features/auth/login-form'

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
      <LoginForm />
    </div>
  )
}
