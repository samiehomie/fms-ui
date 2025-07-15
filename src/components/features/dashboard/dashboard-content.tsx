'use client'
import { StatCard } from '@/components/features/dashboard/stat-card'
import { Globe, Users, Truck, RefreshCw } from 'lucide-react'
import { useDashboard } from '@/lib/hooks/queries/useDashboard'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardContent() {
  const { companies, vehicles, users, devices, isLoading } = useDashboard()

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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Companies"
        value={companies?.data.companies.length ?? 0}
        description="Companies in system"
        Icon={Globe}
      />
      <StatCard
        title="Total Users"
        value={users?.data.users.length ?? 0}
        description="Registered users"
        Icon={Users}
      />
      <StatCard
        title="Total Vehicles"
        value={vehicles?.data.vehicles.length ?? 0}
        description="Fleet vehicles"
        Icon={Truck}
      />
      <StatCard
        title="Active Vehicles"
        value="2"
        description="Currently active"
        Icon={RefreshCw}
      />
    </div>
  )
}
