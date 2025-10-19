'use client'
import { StatCard } from '@/components/features/dashboard/stat-card'
import { Globe, Users, Truck, Cpu } from 'lucide-react'
import { useDashboard } from '@/lib/query-hooks/useDashboard'
import { Skeleton } from '@/components/ui/skeleton'
import { RecentCompaniesList } from '@/components/features/dashboard/recent-companies-list'
import { VehicleStatusList } from '@/components/features/dashboard/vehicle-status-list'

export default function DashboardContent() {
  const { companies, vehicles, users, isLoading } = useDashboard()

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-[9.625rem]" />
        <Skeleton className="h-[9.625rem]" />
        <Skeleton className="h-[9.625rem]" />
        <Skeleton className="h-[9.625rem]" />
      </div>
    )
  }
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Companies"
          value={companies?.data.length ?? 0}
          description="Companies in system"
          Icon={Globe}
        />
        <StatCard
          title="Total Users"
          value={users?.data.length ?? 0}
          description="Registered users"
          Icon={Users}
        />
        <StatCard
          title="Total Vehicles"
          value={vehicles?.data.length ?? 0}
          description="Fleet vehicles"
          Icon={Truck}
        />
      </div>
      {/* <div className="grid gap-6 md:grid-cols-2">
        <RecentCompaniesList companies={companies?.data ?? []} />
        <VehicleStatusList />
      </div> */}
    </>
  )
}
