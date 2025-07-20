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
  search?: string
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

export interface VehicleCreateRequest {
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

export interface VehicleCreateResponse {
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

export type VehicleTripStatus = 'active' | 'completed' | 'cancelled' | ''
export interface VehicleTripsPaginationParams {
  page?: number
  limit?: number
  status?: VehicleTripStatus
  start_date?: string
  end_date?: string
}

export interface VehicleTripsPathParams {
  id: number
}

export type VehicleTripsParams = VehicleTripsPaginationParams &
  VehicleTripsPathParams

export interface VehicleTripEvent {
  id: number
  created_at: string
  updated_at: string
  event_type: string
  event_time: string
  event_count: number
  details: string
}
export interface VehicleTrip {
  id: number
  created_at: string
  updated_at: string
  start_time: string
  end_time: string
  status: VehicleTripStatus
  distance_in_kph: string | null
  duration_in_secs: string | null
  fuel_consumed: string | null
  vehicle_id: VehicleReference
  start_point: string | null
  end_point: string | null
  events: VehicleTripEvent[]
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
}

export type VehicleTripsByTripIdResponse = {
  trip: Trip
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

export interface VehicleTripsByTripIdParams {
  tripId: number
}

export interface ActiveTrip {
  id: number
  plate_number: string
  start_time: string
  end_time: string
  status: 'active'
  created_at: string
  updated_at: string
}

export interface VehicleActiveTripsPaginationParams {
  page: number
  limit: number
}
export type ActiveTripsResponse = PaginatedResponseWithKey<
  ActiveTrip,
  'active_trips'
>

export interface VehicleDeleteParams {
  id: string
}

export interface VehicleDeleteResponse {
  message: string
  deleted_at: string
}

export interface VehicleRestoreParams {
  id: string
}

export interface VehicleRestoreResponse {
  message: string
  vehicle: VehicleCreateResponse
}

export interface VehicleUpdateParams {
  id: string
}

export interface VehicleUpdateRequest {
  vehicle: {
    vehicle_name: string
    brand: string
    model: string
    fuel_type: string
  }
}

export interface VehicleRequest {
  vehicle: {
    id: number
  }
}

export type VehicleResponse = VehicleCreateResponse['vehicle']

export type VehicleUpdateResponse = VehicleCreateResponse

export interface VehicleApiTypes {
  'GET /vehicles': {
    params: VehiclesPaginationParams
    request: {}
    response: VehiclesResponse
  }
  'DELETE /vehicles/{id}': {
    params: VehicleDeleteParams
    request: {}
    response: VehicleDeleteResponse
  }
  'GET /vehicles/search': {
    params: VehiclesSearchPaginationParams
    request: {}
    response: VehiclesSearchResponse
  }
  'GET /vehicles/company/{company_id}': {
    params: VehiclesByCompanyIdPaginationParams
    request: {}
    response: VehiclesByCompanyIdResponse
  }
  'POST /vehicles': {
    params: {}
    request: VehicleCreateRequest
    response: VehicleCreateResponse
  }
  'GET /vehicles/trips/vehicle/{vehicle_id}': {
    params: VehicleTripsParams
    request: {}
    response: VehicleTripsResponse
  }
  'GET /vehicles/trips/{id}': {
    params: VehicleTripsByTripIdParams
    request: {}
    response: VehicleTripsByTripIdResponse
  }
  'GET /vehicles/trips': {
    params: VehicleTripsParams
    request: {}
    response: VehicleTripsResponse
  }
  'PATCH /vehicles/{id}/restore': {
    params: VehicleRestoreParams
    request: {}
    response: VehicleRestoreResponse
  }
  'PUT /vehicles/{id}': {
    params: VehicleUpdateParams
    request: VehicleUpdateRequest
    response: VehicleUpdateResponse
  }
  'POST /vehicles/get': {
    params: {}
    request: VehicleRequest
    response: VehicleResponse
  }
}
