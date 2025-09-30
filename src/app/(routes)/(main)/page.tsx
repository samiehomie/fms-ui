import { Skeleton } from '@/components/ui/skeleton'
import dynamic from 'next/dynamic'
// import DashboardMockContent from '@/components/features/dashboard_mock/dashboard-mock-content'

const DashboardSkeleton = () => {
  return (
    <div>
      <Skeleton className="w-full h-10" />
    </div>
  )
}

const DashboardMockContent = dynamic(
  () => import('@/components/features/dashboard_mock/dashboard-mock-content'),
  {
    loading: () => <DashboardSkeleton />,
  },
)

export default function DashboardPage() {
  return <DashboardMockContent />
}
