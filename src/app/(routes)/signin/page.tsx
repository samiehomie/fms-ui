'use client'
import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

const LoadingSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-4">
      <Skeleton className="w-[10.625rem] h-[2.4656rem]" />
      <Skeleton className="w-[24rem] h-[22.5rem]" />
    </div>
  )
}

const LoginForm = dynamic(
  () => import('@/components/features/auth/login-form'),
  { ssr: false, loading: () => <LoadingSkeleton /> },
)

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
      <LoginForm />
    </div>
  )
}
