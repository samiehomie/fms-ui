"use client"

import { MetricCard } from "@/components/features/dashboard-mock/metric-card"
import { FleetActivityChart } from "@/components/features/dashboard-mock/fleet-activity-chart"
import { RecentIssues } from "@/components/features/dashboard-mock/recent-issues"
import { DashboardFilters } from "@/components/features/dashboard-mock/dashboard-filters"
import {
  dashboardMetrics,
  recentIssues,
  chartData,
} from "@/lib/mock-data/dashboard"

export default function DashboardMockContent() {
  return (
    <div className="flex flex-col flex-1">
      <main className="flex-1 overflow-y-auto space-y-6">
        {/* Filters */}
        <DashboardFilters />
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <MetricCard
            title="Total Vehicles"
            value={dashboardMetrics.totalVehicles}
          />
          <MetricCard
            title="Active Vehicles"
            value={dashboardMetrics.activeVehicles}
            change="+2.5%"
            changeType="positive"
          />
          <MetricCard
            title="Total Distance"
            value={`${dashboardMetrics.totalDistance.toLocaleString()} km`}
            change="+12.3%"
            changeType="positive"
          />
          <MetricCard
            title="Active Issues"
            value={dashboardMetrics.totalIssues}
            change="-1"
            changeType="positive"
          />
          <MetricCard
            title="Fuel Consumption"
            value={`${dashboardMetrics.fuelConsumption.toLocaleString()} L`}
            change="+5.2%"
            changeType="negative"
          />
          <MetricCard
            title="Avg Speed"
            value={`${dashboardMetrics.averageSpeed} km/h`}
            change="+1.8%"
            changeType="positive"
          />
        </div>
        {/* Charts and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FleetActivityChart data={chartData} />
          <RecentIssues issues={recentIssues} />
        </div>
      </main>
    </div>
  )
}
