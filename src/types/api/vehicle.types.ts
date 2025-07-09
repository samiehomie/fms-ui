import type { PaginatedResponseWithKey } from './api.common'

export interface Vehicle {
  id: number
  vehicle_name: string
  plate_number: string
  brand: string
  model: string
  manuf_year: number
  can_bitrate: string
  fuel_type: string
  gear_type: string
  num_tire: number
  isdeleted: boolean
  company_id: {
    id: number
    name: string
  }
  created_at: string
}

export interface VehicleReference {
  id: number
  created_at: string
  updated_at: string
  vehicle_name: string | null
  plate_number: string
  brand: string
  model: string
  manuf_year: number
  can_bitrate: string
  fuel_type: string
  gear_type: string
  num_tire: number
  isdeleted: boolean
  deletedAt: string | null
}

export type VehiclesResponse = PaginatedResponseWithKey<Vehicle, 'vehicles'>
export interface VehiclesPaginationParams {
  page: number
  limit: number
  include_deleted?: boolean
}

export interface VehiclesByCompany {
  id: number
  vehicle_name: string
  plate_number: string
  brand: string
  model: string
  manuf_year: number
  can_bitrate: string
  fuel_type: string
  gear_type: string
  num_tire: number
  isdeleted: boolean
  deletedAt: string
  company_id: {
    id: number
    name: string
    type: string
    reg_number: string
  }
  users: {
    id: number
    name: string
    username: string
  }[]
  tires: {
    id: number
    tire_location: string
  }[]
  edge_devices: {
    id: number
    name: string
    serial_number: string
  }[]
  created_at: string
  updated_at: string
}

export type VehiclesByCompanyIdResponse = PaginatedResponseWithKey<
  VehiclesByCompany,
  'vehicles'
> & { company_id: number }

export interface VehiclesByCompanyIdPaginationParams {
  page: number
  limit: number
}

export interface VehiclesCreateRequest {
  vehicle: {
    vehicle_name: string
    plate_number: string
    brand: string
    model: string
    manuf_year: number
    can_bitrate: string
    fuel_type: string
    gear_type: string
    num_tire: number
    company_name: string
  }
}

export interface VehiclesCreateResponse {
  message: string
  vehicle: {
    id: number
    vehicle_name: string
    plate_number: string
    brand: string
    model: string
    manuf_year: number
    can_bitrate: string
    fuel_type: string
    gear_type: string
    num_tire: number
    isdeleted: boolean
    deletedAt: string
    company_id: {
      id: number
      name: string
      type: string
      reg_number: string
    }
    users: {
      id: number
      name: string
      username: string
    }[]
    tires: {
      id: number
      tire_location: string
    }[]
    edge_devices: {
      id: number
      name: string
      serial_number: string
    }[]
    created_at: string
    updated_at: string
  }
}

export interface VehiclesSearchPaginationParams {
  query: string
  page: number
  limit: number
  include_deleted: boolean
}

export type VehiclesSearchResponse = VehiclesResponse & {
  search_query: string
}

export type VehicleTripStatus = 'active' | 'completed' | 'cancelled'
export interface VehicleTripsPaginationParams {
  page: number
  limit: number
  status?: VehicleTripStatus
}

export interface VehicleTripsPathParams {
  id: number
}

export type VehicleTripsParams = VehicleTripsPaginationParams &
  VehicleTripsPathParams

export interface VehicleTrip {
  id: number
  created_at: string
  updated_at: string
  start_time: string
  end_time: string
  status: VehicleTripStatus
  vehicle_id: VehicleReference
}

export type VehicleTripsResponse = PaginatedResponseWithKey<
  VehicleTrip,
  'trips'
>

export interface GPS {
  id: number
  created_at: string
  updated_at: string
  latitude: string
  longitude: string
  north_south: string
  east_west: string
  speed_over_grd: string
  gps_time: string | null
}

export interface Trip {
  id: number
  created_at: string
  updated_at: string
  start_time: string
  end_time: string
  status: VehicleTripStatus
  vehicle_id: VehicleReference
  gpss: GPS[]
  statistics: {
    total_gps_points: number
    start_location: {
      id: number
      created_at: string
      updated_at: string
      latitude: string
      longitude: string
      north_south: string
      east_west: string
      speed_over_grd: string
      gps_time?: string | null
    }
    end_location: {
      id: number
      created_at: string
      updated_at: string
      latitude: string
      longitude: string
      north_south: string
      east_west: string
      speed_over_grd: string
      gps_time?: string | null
    }
    duration_minutes: number
  }
}

export type VehicleTripDetailResponse = Trip

export interface VehicleApiTypes {
  'GET /vehicles': {
    request: {}
    response: VehiclesResponse
  }
  'GET /vehicles/search': {
    request: {}
    response: VehiclesSearchResponse
  }
  'GET /vehicles/company/id': {
    request: {}
    response: VehiclesByCompanyIdResponse
  }
  'POST /vehicles': {
    request: VehiclesCreateRequest
    response: VehiclesCreateResponse
  }
  'GET /vehicles/trips/vehicle/id': {
    request: {}
    response: VehicleTripsResponse
  }
  'GET /vehicles/trips/id': {
    request: {}
    response: VehicleTripDetailResponse
  }
}
