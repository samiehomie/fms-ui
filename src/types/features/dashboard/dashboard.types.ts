import type { DateRange } from "@/types/common/common.types"
import { DataDirection } from "./dashbaord.enum"

// GET /dashboards/overview
export interface DashboardOverviewResponse {
  overview: {
    totalVehicles: number
    activeTripsCount: number
  }
  tripStats: {
    totalDistance: number
    averageSpeed: number
    distanceComparison?: {
      current: number
      previous: number
      changePercentage: number
      direction: DataDirection
    }
    speedComparison?: {
      current: number
      previous: number
      changePercentage: number
      direction: DataDirection
    }
  }
  alertStats: {
    unresolvedAlertsCount: number
    alertsComparison?: {
      current: number
      previous: number
      changePercentage: number
      direction: DataDirection
    }
  }
  tpmsStats: {
    slowleakCount: number
    slowleakComparison?: {
      current: number
      previous: number
      changePercentage: number
      direction: DataDirection
    }
  }
  dateRange?: {
    startDate: string
    endDate: string
    currentPeriodDays: number
  }
}

// GET /dashboards/overview
export type DashboardOverviewQuery = Partial<DateRange> & {
  vehicleId?: string
}
