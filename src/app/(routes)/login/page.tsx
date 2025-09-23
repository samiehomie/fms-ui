'use client'
import dynamic from 'next/dynamic'

const LoginForm = dynamic(
  () => import('@/components/features/auth/login-form'),
  { ssr: false },
)

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
      <LoginForm />
    </div>
  )
}
