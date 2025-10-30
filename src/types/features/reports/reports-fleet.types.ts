import type { DateRange } from "@/types/common/common.types"
import { VehicleType, TirePosition, AlertPriority } from "./reports.enum"

export interface FleetOverviewReport {
  reportInfo: ReportInfo
  fleetSummary: FleetSummary
  keyPerformanceIndicators: KPI[]
  vehiclePerformance: VehiclePerformance[]
  tireHealth: TireHealthSummary[]
  tripAnalysis: TripSummary[]
  maintenanceSchedule: MaintenanceScheduleItem[]
  companySummary: CompanySummary[]
}

export interface ReportInfo {
  reportId: string
  reportType: "fleet_overview" | "vehicle_detail"
  generatedAt: string
  period: DateRange
  totalVehicles: number
  companyId: string
  companyName: string
}

export interface FleetSummary {
  categories: FleetCategory[]
  total: {
    count: number
    active: number
    maintenance: number
    idle: number
    utilizationRate: number
  }
}

export interface FleetCategory {
  category: VehicleType
  count: number
  active: number
  maintenance: number
  idle: number
  utilizationRate: number
}

export interface KPI {
  name: string
  current: number
  target: number
  unit: string
  status: "good" | "warning" | "critical"
  trend?: "improving" | "declining" | "stable"
}

export interface VehiclePerformance {
  vehicleId: string
  type: VehicleType
  model: string
  operatingHours: number
  distance: number
  fuelUsed: number
  fuelEfficiency: number
  idleTime: number
  idlePercentage: number
  avgSpeed: number
  loadFactor: number
  performanceScore: number
  status: "excellent" | "good" | "fair" | "poor"
}

export interface TireHealthSummary {
  vehicleId: string
  tirePosition: TirePosition
  pressure: {
    current: number
    target: number
    unit: "psi" | "kpa"
  }
  temperature: number
  treadDepth: {
    current: number
    initial: number
    unit: "mm"
  }
  wearPercentage: number
  estimatedLifeRemaining: number // hours
  alertStatus: "ok" | "warning" | "alert"
  recommendation: string
}

export interface TripSummary {
  tripId: string
  vehicleId: string
  vehicleType: VehicleType
  startTime: string
  endTime: string
  duration: number // hours
  distance: number // km
  avgSpeed: number // km/h
  fuelUsed: number // liters
  fuelEfficiency: number // km/l
  idleTimePercentage: number
  status: "completed" | "in_progress" | "cancelled"
}

export interface MaintenanceScheduleItem {
  vehicleId: string
  vehicleType: VehicleType
  lastService: string
  nextServiceDue: string
  daysUntilDue: number
  serviceType: string
  priority: AlertPriority
  estimatedHours: number
  estimatedCost: number
  status: "scheduled" | "overdue" | "pending"
}

export interface CompanySummary {
  companyName: string
  companyType:
    | "owner"
    | "construction"
    | "logistics"
    | "transportation"
    | "manufacturing"
  totalVehicles: number
  activeVehicles: number
  totalOperatingHours: number
  totalDistance: number
  totalFuel: number
  avgUtilization: number
  performanceScore: number
}

// ============================================
// API Endpoints Types
// ============================================

export interface GenerateFleetReportRequest {
  companyId: string
  period?: DateRange
  vehicleTypes?: VehicleType[]
  includeInactive?: boolean
}

export interface GenerateReportResponse {
  reportId: string
  downloadUrl: string
  expiresAt: string
  format: "xlsx" | "pdf" | "csv"
  sizeInBytes: number
}
