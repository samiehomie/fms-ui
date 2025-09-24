// Reports data structure for FMS
export interface ReportData {
  trips: TripReport[]
  vehicles: VehicleReport[]
  drivers: DriverReport[]
  fuel: FuelReport[]
  maintenance: MaintenanceReport[]
  incidents: IncidentReport[]
  routes: RouteReport[]
  costs: CostReport[]
}

export interface TripReport {
  id: number
  vehicleId: number
  plateNumber: string
  driverId: number
  driverName: string
  startTime: string
  endTime: string
  startLocation: string
  endLocation: string
  distance: number
  duration: number
  averageSpeed: number
  maxSpeed: number
  fuelConsumed: number
  fuelEfficiency: number
  status: 'completed' | 'in-progress' | 'cancelled'
  events: string[]
  cost: number
}

export interface VehicleReport {
  id: number
  plateNumber: string
  brand: string
  model: string
  year: number
  mileage: number
  fuelType: string
  status: 'active' | 'maintenance' | 'retired'
  lastMaintenanceDate: string
  nextMaintenanceDate: string
  totalTrips: number
  totalDistance: number
  totalFuelConsumed: number
  averageFuelEfficiency: number
  incidentCount: number
  utilizationRate: number
}

export interface DriverReport {
  id: number
  name: string
  licenseNumber: string
  phoneNumber: string
  email: string
  hireDate: string
  status: 'active' | 'inactive' | 'suspended'
  totalTrips: number
  totalDistance: number
  totalDrivingHours: number
  averageSpeed: number
  safetyScore: number
  incidentCount: number
  fuelEfficiencyRating: number
  onTimeDeliveryRate: number
}

export interface FuelReport {
  id: number
  vehicleId: number
  plateNumber: string
  driverId: number
  driverName: string
  date: string
  fuelType: string
  quantity: number
  pricePerLiter: number
  totalCost: number
  location: string
  odometer: number
  fuelEfficiency: number
}

export interface MaintenanceReport {
  id: number
  vehicleId: number
  plateNumber: string
  date: string
  type: 'scheduled' | 'unscheduled' | 'emergency'
  category:
    | 'engine'
    | 'transmission'
    | 'brakes'
    | 'tires'
    | 'electrical'
    | 'other'
  description: string
  cost: number
  duration: number
  serviceProvider: string
  nextServiceDate: string
  status: 'completed' | 'in-progress' | 'scheduled'
}

export interface IncidentReport {
  id: number
  vehicleId: number
  plateNumber: string
  driverId: number
  driverName: string
  date: string
  time: string
  location: string
  type: 'accident' | 'breakdown' | 'violation' | 'theft' | 'other'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  cost: number
  resolved: boolean
  insuranceClaim: boolean
}

export interface RouteReport {
  id: number
  name: string
  startLocation: string
  endLocation: string
  distance: number
  estimatedDuration: number
  averageTraffic: string
  fuelConsumption: number
  tollCosts: number
  frequency: number
  efficiency: number
  popularityScore: number
}

export interface CostReport {
  id: number
  vehicleId: number
  plateNumber: string
  date: string
  category:
    | 'fuel'
    | 'maintenance'
    | 'insurance'
    | 'registration'
    | 'tolls'
    | 'fines'
    | 'other'
  description: string
  amount: number
  currency: string
  approved: boolean
  approvedBy: string
}

// Mock data for reports
export const mockReportsData: ReportData = {
  trips: [
    {
      id: 1,
      vehicleId: 1,
      plateNumber: '12가 3456',
      driverId: 1,
      driverName: 'John Smith',
      startTime: '2025-01-13T08:00:00Z',
      endTime: '2025-01-13T12:30:00Z',
      startLocation: 'Seoul, Gangnam-gu',
      endLocation: 'Busan, Haeundae-gu',
      distance: 325.5,
      duration: 270,
      averageSpeed: 72.3,
      maxSpeed: 95.0,
      fuelConsumed: 45.2,
      fuelEfficiency: 7.2,
      status: 'completed',
      events: ['Speed Warning', 'Rest Stop'],
      cost: 125.5,
    },
    {
      id: 2,
      vehicleId: 2,
      plateNumber: '34나 5678',
      driverId: 2,
      driverName: 'Emily Johnson',
      startTime: '2025-01-13T09:15:00Z',
      endTime: '2025-01-13T11:45:00Z',
      startLocation: 'Incheon Airport',
      endLocation: 'Seoul, Mapo-gu',
      distance: 58.2,
      duration: 150,
      averageSpeed: 23.3,
      maxSpeed: 65.0,
      fuelConsumed: 12.8,
      fuelEfficiency: 4.5,
      status: 'completed',
      events: ['Traffic Delay'],
      cost: 35.2,
    },
  ],
  vehicles: [
    {
      id: 1,
      plateNumber: '12가 3456',
      brand: 'Hyundai',
      model: 'Mighty',
      year: 2022,
      mileage: 45230,
      fuelType: 'Diesel',
      status: 'active',
      lastMaintenanceDate: '2025-01-01T00:00:00Z',
      nextMaintenanceDate: '2025-04-01T00:00:00Z',
      totalTrips: 156,
      totalDistance: 23450.5,
      totalFuelConsumed: 3245.8,
      averageFuelEfficiency: 7.2,
      incidentCount: 2,
      utilizationRate: 85.5,
    },
  ],
  drivers: [
    {
      id: 1,
      name: 'John Smith',
      licenseNumber: 'DL123456789',
      phoneNumber: '+82-10-1234-5678',
      email: 'john.smith@company.com',
      hireDate: '2023-03-15T00:00:00Z',
      status: 'active',
      totalTrips: 234,
      totalDistance: 45230.5,
      totalDrivingHours: 1250,
      averageSpeed: 65.2,
      safetyScore: 92.5,
      incidentCount: 1,
      fuelEfficiencyRating: 8.5,
      onTimeDeliveryRate: 96.8,
    },
  ],
  fuel: [
    {
      id: 1,
      vehicleId: 1,
      plateNumber: '12가 3456',
      driverId: 1,
      driverName: 'John Smith',
      date: '2025-01-13T10:30:00Z',
      fuelType: 'Diesel',
      quantity: 85.5,
      pricePerLiter: 1.45,
      totalCost: 123.98,
      location: 'Seoul Gas Station A',
      odometer: 45230,
      fuelEfficiency: 7.2,
    },
  ],
  maintenance: [
    {
      id: 1,
      vehicleId: 1,
      plateNumber: '12가 3456',
      date: '2025-01-01T00:00:00Z',
      type: 'scheduled',
      category: 'engine',
      description: 'Regular engine oil change and filter replacement',
      cost: 150.0,
      duration: 120,
      serviceProvider: 'Seoul Auto Service',
      nextServiceDate: '2025-04-01T00:00:00Z',
      status: 'completed',
    },
  ],
  incidents: [
    {
      id: 1,
      vehicleId: 1,
      plateNumber: '12가 3456',
      driverId: 1,
      driverName: 'John Smith',
      date: '2025-01-10',
      time: '14:30',
      location: 'Highway 1, KM 45',
      type: 'breakdown',
      severity: 'medium',
      description: 'Tire puncture on highway, replaced with spare tire',
      cost: 85.0,
      resolved: true,
      insuranceClaim: false,
    },
  ],
  routes: [
    {
      id: 1,
      name: 'Seoul-Busan Express',
      startLocation: 'Seoul, Gangnam-gu',
      endLocation: 'Busan, Haeundae-gu',
      distance: 325.5,
      estimatedDuration: 240,
      averageTraffic: 'Medium',
      fuelConsumption: 45.2,
      tollCosts: 25.5,
      frequency: 15,
      efficiency: 88.5,
      popularityScore: 9.2,
    },
  ],
  costs: [
    {
      id: 1,
      vehicleId: 1,
      plateNumber: '12가 3456',
      date: '2025-01-13T00:00:00Z',
      category: 'fuel',
      description: 'Diesel fuel purchase',
      amount: 123.98,
      currency: 'USD',
      approved: true,
      approvedBy: 'Manager A',
    },
  ],
}
