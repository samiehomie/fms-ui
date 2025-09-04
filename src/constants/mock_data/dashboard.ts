// Dashboard mock data
export interface DashboardMetrics {
  totalVehicles: number
  activeVehicles: number
  totalDistance: number
  totalIssues: number
  fuelConsumption: number
  averageSpeed: number
}

export interface VehicleStatus {
  id: number
  plateNumber: string
  status: "active" | "idle" | "maintenance" | "offline"
  location: string
  lastUpdate: string
  driver: string
}

export interface Issue {
  id: number
  vehicleId: number
  plateNumber: string
  type: "maintenance" | "fuel" | "tire" | "engine" | "other"
  severity: "low" | "medium" | "high" | "critical"
  description: string
  timestamp: string
  status: "open" | "in-progress" | "resolved"
}

export interface ChartDataPoint {
  date: string
  distance: number
  vehicles: number
  fuelConsumption: number
  issues: number
}

// Mock data
export const dashboardMetrics: DashboardMetrics = {
  totalVehicles: 45,
  activeVehicles: 38,
  totalDistance: 10317,
  totalIssues: 7,
  fuelConsumption: 2205,
  averageSpeed: 42.3,
}

export const vehicleStatuses: VehicleStatus[] = [
  {
    id: 1,
    plateNumber: "12가 3456",
    status: "active",
    location: "서울시 강남구",
    lastUpdate: "2 minutes ago",
    driver: "김철수",
  },
  {
    id: 2,
    plateNumber: "GHT-6610",
    status: "idle",
    location: "경기도 성남시",
    lastUpdate: "5 minutes ago",
    driver: "이영희",
  },
  {
    id: 3,
    plateNumber: "GHT-6610",
    status: "maintenance",
    location: "부산시 해운대구",
    lastUpdate: "1 hour ago",
    driver: "박민수",
  },
  {
    id: 4,
    plateNumber: "78라 1234",
    status: "active",
    location: "대구시 중구",
    lastUpdate: "1 minute ago",
    driver: "정수진",
  },
  {
    id: 5,
    plateNumber: "90마 5678",
    status: "offline",
    location: "인천시 연수구",
    lastUpdate: "2 hours ago",
    driver: "최동훈",
  },
]

export const recentIssues: Issue[] = [
  {
    id: 1,
    vehicleId: 3,
    plateNumber: "RDT-1239",
    type: "maintenance",
    severity: "high",
    description: "Engine temperature warning",
    timestamp: "2025-09-01T10:30:00Z",
    status: "in-progress",
  },
  {
    id: 2,
    vehicleId: 5,
    plateNumber: "MLB-8005",
    type: "tire",
    severity: "medium",
    description: "Low tire pressure detected",
    timestamp: "2025-08-31T09:15:00Z",
    status: "open",
  },
  {
    id: 3,
    vehicleId: 2,
    plateNumber: "GHT-6610",
    type: "fuel",
    severity: "low",
    description: "Fuel level below 20%",
    timestamp: "2025-08-29T08:45:00Z",
    status: "resolved",
  },
]

export const chartData: ChartDataPoint[] = [
  { date: "Jan 07", distance: 1250, vehicles: 35, fuelConsumption: 285, issues: 2 },
  { date: "Jan 08", distance: 1380, vehicles: 37, fuelConsumption: 310, issues: 1 },
  { date: "Jan 09", distance: 1420, vehicles: 39, fuelConsumption: 295, issues: 3 },
  { date: "Jan 10", distance: 1180, vehicles: 36, fuelConsumption: 265, issues: 1 },
  { date: "Jan 11", distance: 1650, vehicles: 41, fuelConsumption: 340, issues: 4 },
  { date: "Jan 12", distance: 1590, vehicles: 40, fuelConsumption: 325, issues: 2 },
  { date: "Jan 13", distance: 1847, vehicles: 38, fuelConsumption: 385, issues: 7 },
]

export const vehicleStatusDistribution = [
  { status: "Active", count: 38, color: "#22c55e" },
  { status: "Idle", count: 5, color: "#eab308" },
  { status: "Maintenance", count: 1, color: "#f97316" },
  { status: "Offline", count: 1, color: "#ef4444" },
]
