import type { DateRange } from "@/types/common/common.types"
import { VehicleType, VehicleStatus, AlertPriority, TirePosition } from "./reports.enum"

export interface VehicleDetailReport {
  reportInfo: VehicleReportInfo
  vehicleInfo: VehicleInfo
  performanceMetrics: PerformanceMetrics
  activeAlerts: Alert[]
  operatingHistory: OperatingHistoryEntry[]
  tireAnalysis: TireAnalysis
  maintenanceRecords: MaintenanceRecords
  costAnalysis: CostAnalysis
  performanceTrends: PerformanceTrend[]
  eventLog: EventLogEntry[]
}

export interface VehicleReportInfo {
  reportId: string
  reportType: "vehicle_detail"
  vehicleId: string
  generatedAt: string
  period: DateRange
}

export interface VehicleInfo {
  vehicleId: string
  type: VehicleType
  brand: string
  model: string
  plateNumber: string
  manufactureYear: number
  engineHours: number
  odometer: number
  fuelType: "diesel" | "gasoline" | "electric" | "hybrid"
  company: string
  primaryOperator: string
  status: VehicleStatus
  gpsDevice: string
  lastGpsUpdate: string
  numberOfTires: number
  canBitrate: "125 Kbps" | "250 Kbps" | "500 Kbps" | "1 Mbps"
}

export interface PerformanceMetrics {
  period: string // e.g., "Last 30 Days"
  metrics: {
    availability: MetricValue
    utilization: MetricValue
    fuelEfficiency: MetricValue
    avgSpeed: MetricValue
    operatingHoursPerDay: MetricValue
    idleTime: MetricValue
    productivityScore: MetricValue
    safetyScore: MetricValue
  }
}

export interface MetricValue {
  value: number
  target: number
  unit: string
  status: "good" | "below_target" | "above_target" | "monitor"
}

export interface Alert {
  id: string
  priority: AlertPriority
  type: string
  description: string
  detectedAt: string
  actionRequired: string
}

export interface OperatingHistoryEntry {
  date: string
  startTime: string
  endTime: string
  totalHours: number
  operatingHours: number
  idleHours: number
  distance: number
  fuelUsed: number
  fuelRate: number
  avgLoad: number
  maxSpeed: number
  events: string
}

export interface TireAnalysis {
  currentStatus: TireStatus[]
  replacementHistory: TireReplacementHistory[]
}

export interface TireStatus {
  position: TirePosition
  tireId: string
  brand: string
  model: string
  size: string
  installDate: string
  pressure: {
    current: number
    target: number
    status: "ok" | "low" | "high"
  }
  temperature: number
  treadDepth: {
    current: number
    original: number
  }
  wearPercentage: number
  estimatedRemainingLife: number // hours
}

export interface TireReplacementHistory {
  position: TirePosition
  removedDate: string
  tireId: string
  totalHours: number
  totalDistance: number
  removalReason: "scheduled" | "wear" | "damage"
  finalTread: number
  avgWearRate: number // mm/1000hr
  cost: number
  performanceRating: "excellent" | "good" | "fair" | "poor"
}

export interface MaintenanceRecords {
  upcoming: UpcomingMaintenance[]
  history: MaintenanceHistory[]
}

export interface UpcomingMaintenance {
  serviceType: string
  dueDate: string
  dueHours: number
  currentHours: number
  hoursRemaining: number
  estimatedDuration: number
  estimatedCost: number
  priority: AlertPriority
  partsRequired: string[]
  status: "scheduled" | "pending"
  notes: string
}

export interface MaintenanceHistory {
  date: string
  serviceType: string
  hoursAtService: number
  duration: number
  cost: number
  partsReplaced: string[]
  laborHours: number
  technician: string
  result: "completed" | "partial" | "failed"
  nextDue: string
  notes: string
}

export interface CostAnalysis {
  monthlyCosts: MonthlyCost[]
  costByActivity: ActivityCost[]
  totalCost: {
    period: string
    total: number
    avgPerHour: number
    avgPerKm: number
  }
}

export interface MonthlyCost {
  month: string
  fuel: number
  maintenance: number
  tires: number
  operator: number
  insurance: number
  other: number
  total: number
  costPerHour: number
}

export interface ActivityCost {
  activity: string
  hours: number
  fuelCost: number
  totalCost: number
  costPerHour: number
}

export interface PerformanceTrend {
  week: string
  weekNumber: number
  startDate: string
  availability: number
  utilization: number
  fuelEfficiency: number
  productivityIndex: number
  operatingHours: number
  distance: number
  idleTime: number
  eventsCount: number
  costPerHour: number
  score: number
}

export interface EventLogEntry {
  id: string
  timestamp: string
  eventType:
    | "over_speed"
    | "hard_brake"
    | "rapid_acceleration"
    | "long_idle"
    | "geofence_alert"
    | "maintenance_alert"
    | "system_warning"
  severity: AlertPriority
  description: string
  location: string
  speed?: number
  operator: string
  actionTaken: string
}

export interface GenerateVehicleReportRequest {
  vehicleId: string
  period?: DateRange
  includeCostAnalysis?: boolean
  includeEventLog?: boolean
}
