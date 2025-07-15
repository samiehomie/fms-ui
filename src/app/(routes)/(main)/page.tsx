'use client'
import { useAuth } from '@/components/features/auth/auth-provider'
import { StatCard } from '@/components/features/dashboard/stat-card'
import { RecentCompaniesList } from '@/components/features/dashboard/recent-companies-list'
import { VehicleStatusList } from '@/components/features/dashboard/vehicle-status-list'
import { Globe, Users, Truck, RefreshCw } from 'lucide-react'
import DashboardContent from '@/components/features/dashboard/dashboard-content'

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
      <DashboardContent />
      <div className="grid gap-6 md:grid-cols-2">
        <RecentCompaniesList />
        <VehicleStatusList />
      </div>
    </div>
  )
}
