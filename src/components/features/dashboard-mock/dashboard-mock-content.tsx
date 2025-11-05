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
import { useOverview } from "@/lib/query-hooks/use-dashboard"
import { Spinner } from "@/components/ui/spinner"

export default function DashboardMockContent() {
  const {
    data: overviewData,
    isPending,
    isError,
  } = useOverview({
    start: "2024-01-01T00:00:00Z",
    end: "2025-12-31T23:59:59Z",
  })

  // query는 error 발생시 throw 하도록 설정. error.tsx에서 처리됨
  if (isPending || isError) return <Spinner />

  const { overview, tripStats, alertStats, tpmsStats } = overviewData.data

  return (
    <div className="flex flex-col flex-1">
      <main className="flex-1 overflow-y-auto space-y-6">
        {/* Filters */}
        <DashboardFilters />
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <MetricCard title="Total Vehicles" value={overview.totalVehicles} />
          <MetricCard
            title="Active Vehicles"
            value={overview.activeTripsCount}
          />
          <MetricCard
            title="Total Distance"
            value={`${tripStats.totalDistance.toLocaleString()} km`}
            change={`${tripStats?.distanceComparison?.changePercentage} %`}
            changeType={tripStats?.distanceComparison?.direction}
          />
          <MetricCard
            title="Active Alerts"
            value={alertStats.unresolvedAlertsCount}
            change={`${alertStats.alertsComparison?.changePercentage} %`}
            changeType={alertStats.alertsComparison?.direction}
          />
          <MetricCard
            title="TPMS Alerts"
            value={`${tpmsStats.slowleakCount}`}
            change={`${tpmsStats.slowleakComparison?.changePercentage} %`}
            changeType={tpmsStats.slowleakComparison?.direction}
          />
          <MetricCard
            title="Avg Speed"
            value={`${tripStats.averageSpeed.toLocaleString()} km/h`}
            change={`${tripStats?.speedComparison?.changePercentage} %`}
            changeType={tripStats?.speedComparison?.direction}
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
