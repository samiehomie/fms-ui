export type ReportCategory = "fleet-overview" | "vehicle-detail"
export type ExportFormat = "csv" | "xlsx"

export interface VehicleData {
  id: number
  company: string
  name: string
  plateNo: string
  model: string
  canBitrate: string
  tires: number
  createdAt: string
}

export interface FleetOverviewData {
  reportPeriod: string
  fleetSummary: {
    category: string
    count: number
    active: number
    maintenance: number
    idle: number
    utilization: number
  }[]
  kpi: {
    name: string
    current: number | string
    target: number | string
    status: string
  }[]
  vehiclePerformance: {
    vehicleId: string
    type: string
    model: string
    operatingHours: number
    distance: number
    fuelUsed: number
    fuelEfficiency: number
    idleTime: number
    idlePercent: number
    avgSpeed: number
    loadFactor: number
    performanceScore: number
    status: string
  }[]
  tireHealth: {
    vehicleId: string
    position: string
    tireId: string
    treadDepth: number
    pressure: number
    temperature: number
    alertStatus: string
    recommendation: string
  }[]
  tripAnalysis: {
    tripId: string
    vehicleId: string
    startTime: string
    endTime: string
    duration: number
    distance: number
    avgSpeed: number
    maxSpeed: number
    fuelUsed: number
    idlePercent: number
    status: string
  }[]
  maintenance: {
    vehicleId: string
    type: string
    lastService: string
    nextDue: string
    hoursUntilDue: number
    serviceType: string
    estimatedCost: number
    status: string
  }[]
  companySummary: {
    companyName: string
    totalVehicles: number
    activeVehicles: number
    totalHours: number
    totalDistance: number
    avgUtilization: number
    maintenanceCompliance: number
    performanceScore: number
  }[]
}

export interface VehicleDetailData {
  vehicleId: string
  type: string
  model: string
  reportGenerated: string
  vehicleInfo: {
    serialNumber: string
    year: number
    engineHours: number
    odometer: number
    fuelType: string
    company: string
  }
  operatingHistory: {
    date: string
    startTime: string
    endTime: string
    duration: number
    distance: number
    fuelUsed: number
    avgSpeed: number
    maxSpeed: number
    events: string
  }[]
  tireAnalysis: {
    position: string
    tireId: string
    brand: string
    size: string
    treadDepth: number
    pressure: number
    pressureStatus: string
    temperature: number
  }[]
  maintenance: {
    serviceType: string
    dueDate: string
    hoursUntilDue: number
    status: string
    notes: string
  }[]
  costAnalysis: {
    month: string
    fuel: number
    maintenance: number
    tires: number
    total: number
    costPerHour: number
  }[]
  performanceTrends: {
    week: string
    operatingHours: number
    distance: number
    fuelEfficiency: number
    avgSpeed: number
    idlePercent: number
    score: number
  }[]
  eventLog: {
    dateTime: string
    eventType: string
    severity: string
    description: string
    location: string
    operator: string
    actionTaken: string
  }[]
}
