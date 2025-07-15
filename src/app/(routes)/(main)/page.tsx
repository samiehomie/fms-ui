'use client'
import { useAuth } from '@/components/features/auth/auth-provider'
import { StatCard } from '@/components/features/dashboard/stat-card'
import { RecentCompaniesList } from '@/components/features/dashboard/recent-companies-list'
import { VehicleStatusList } from '@/components/features/dashboard/vehicle-status-list'
import { Globe, Users, Truck, RefreshCw } from 'lucide-react'

export default function DashboardPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex-1 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0f172a] dark:text-slate-50">
          Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Welcome, {user?.name || user?.username || 'User'}!
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Companies"
          value="3"
          description="Companies in system"
          Icon={Globe}
        />
        <StatCard
          title="Total Users"
          value="4"
          description="Registered users"
          Icon={Users}
        />
        <StatCard
          title="Total Vehicles"
          value="3"
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

      <div className="grid gap-6 md:grid-cols-2">
        <RecentCompaniesList />
        <VehicleStatusList />
      </div>
    </div>
  )
}
