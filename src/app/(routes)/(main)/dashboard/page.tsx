import { Car, Route, AlertTriangle, Fuel, Gauge, TrendingUp } from "lucide-react"
import { MetricCard } from "@/components/features/dashboard_mock/metric-card"
import { FleetActivityChart } from "@/components/features/dashboard_mock/fleet-activity-chart"
import { VehicleStatusChart } from "@/components/features/dashboard_mock/vehicle-status-chart"
import { RecentIssues } from "@/components/features/dashboard_mock/recent-issues"
import { VehicleStatusList } from "@/components/features/dashboard_mock/vehicle-status-list"
import { LiveMapPlaceholder } from "@/components/features/dashboard_mock/live-map-placeholder"
import { DashboardFilters } from "@/components/features/dashboard_mock/dashboard-filters"
import {
  dashboardMetrics,
  vehicleStatuses,
  recentIssues,
  chartData,
  vehicleStatusDistribution,
} from "@/constants/mock_data/dashboard"

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b shrink-0">
        <h1 className="text-2xl font-bold">Fleet Management Dashboard</h1>
        <div className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleString()}</div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Filters */}
        <DashboardFilters />

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <MetricCard
            title="Total Vehicles"
            value={dashboardMetrics.totalVehicles}
            icon={Car}
            description="Fleet size"
          />
          <MetricCard
            title="Active Vehicles"
            value={dashboardMetrics.activeVehicles}
            change="+2.5%"
            changeType="positive"
            icon={TrendingUp}
            description="Currently operational"
          />
          <MetricCard
            title="Total Distance"
            value={`${dashboardMetrics.totalDistance.toLocaleString()} km`}
            change="+12.3%"
            changeType="positive"
            icon={Route}
            description="This period"
          />
          <MetricCard
            title="Active Issues"
            value={dashboardMetrics.totalIssues}
            change="-1"
            changeType="positive"
            icon={AlertTriangle}
            description="Requiring attention"
          />
          <MetricCard
            title="Fuel Consumption"
            value={`${dashboardMetrics.fuelConsumption.toLocaleString()} L`}
            change="+5.2%"
            changeType="negative"
            icon={Fuel}
            description="This period"
          />
          <MetricCard
            title="Avg Speed"
            value={`${dashboardMetrics.averageSpeed} km/h`}
            change="+1.8%"
            changeType="positive"
            icon={Gauge}
            description="Fleet average"
          />
        </div>

        {/* Charts and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FleetActivityChart data={chartData} />
          <VehicleStatusChart data={vehicleStatusDistribution} />
        </div>

        {/* Live Map */}
        <LiveMapPlaceholder />

        {/* Issues and Vehicle Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentIssues issues={recentIssues} />
          <VehicleStatusList vehicles={vehicleStatuses} />
        </div>
      </main>
    </div>
  )
}
