'use client'
import { Skeleton } from '@/components/ui/skeleton'
import dynamic from 'next/dynamic'

const DashboardSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-4">
      <Skeleton className="w-full h-9" />
      <Skeleton className="w-full h-12" />
      <Skeleton className="w-full h-12" />
      <Skeleton className="w-full h-12" />
      <Skeleton className="w-full h-12" />
    </div>
  )
}

const DashboardMockContent = dynamic(
  () => import('@/components/features/dashboard-mock/dashboard-mock-content'),
  {
    ssr: false,
    loading: () => <DashboardSkeleton />,
  },
)

export default function DashboardPage() {
  return <DashboardMockContent />
}
