import type {
  PaginatedResponseWithKey,
  CommonProperties,
  PaginationQuery,
} from '../common.types'
import { GearType, FuelType } from '@/types/enums/vehicle.enum'
import type { Vehicle } from '@/types/entities/vehicle.entity'
import type { Company } from '@/types/entities/company.entity'
import type { User } from '@/types/entities/user.entity'
import type { Tire } from '@/types/entities/tire.entity'
import type { SmartProfiler } from '@/types/entities/smart-profiler.entity'
import type { Sensor } from '@/types/entities/sensor.entity'
import type { EdgeDevice } from '@/types/entities/edge-device.entity'
import type { Trip } from '@/types/entities/trip.entity'
import { TripStatus } from '@/types/enums/trip.enum'

type VehicleData = Pick<
  Vehicle,
  | CommonProperties
  | 'vehicleName'
  | 'plateNumber'
  | 'brand'
  | 'model'
  | 'manufactureYear'
  | 'canBitrate'
  | 'fuelType'
  | 'gearType'
  | 'numTire'
  | 'isdeleted'
>
// GET /vehicles
export type VehiclesGetResponse = (VehicleData & {
  company: Pick<Company, 'id' | 'name'>
  tires: Pick<Tire, 'id' | 'tireLocation'>[]
})[]

// GET /vehicles
export interface VehiclesGetQuery extends PaginationQuery {
  includeDeleted?: boolean
  search?: string
}

// GET /vehicles/{id}
export type VehicleGetResponse = VehicleData & {
  users: Pick<User, 'id' | 'username' | 'email'>[]
  tires: (Pick<Tire, 'id' | 'tireLocation'> & {
    profiler: Pick<SmartProfiler, 'id' | 'serialNumber' | 'isdeleted'>
    sensor: Pick<Sensor, 'id' | 'serialNumber' | 'isdeleted'>
  })[]
  edgeDevices: Pick<
    EdgeDevice,
    'id' | 'serialNumber' | 'type' | 'verified' | 'terminated'
  >[]
  company: Pick<
    Company,
    | 'id'
    | 'name'
    | 'regNumber'
    | 'type'
    | 'details'
    | 'phone'
    | 'email'
    | 'website'
    | 'verified'
    | 'isdeleted'
  >
}

// GET /vehicles/{id}
export interface VehicleGetQuery {
  id: string
}

// POST /vehicles
export type VehicleCreateBody = Pick<
  Vehicle,
  | 'vehicleName'
  | 'plateNumber'
  | 'brand'
  | 'model'
  | 'manufactureYear'
  | 'canBitrate'
  | 'fuelType'
  | 'gearType'
  | 'numTire'
> & {
  companyId: number
}

// POST /vehicles
export type VehicleCreateResponse = VehicleGetResponse

// DELETE /vehicles/{id}
export interface VehicleDeleteQuery {
  id: string
}

// DELETE /vehicles/{id}
export type VehicleDeleteResponse = undefined

// PATCH /vehicles/{id}/restore
export type VehicleRestoreResponse = undefined

// PATCH /vehicles/{id}/restore
export interface VehicleRestoreQuery {
  id: string
}

// PATCH /vehicles/{id}
export type VehicleUpdateBody = VehicleCreateBody

// PATCH /vehicles/{id}
export type VehicleUpdateResponse = VehicleCreateResponse

// PATCH /vehicles/{id}
export interface VehicleUpdateQuery {
  id: string
}

// GET /vehicles/{id}/trips
// TODO API에 numTire 포하되게 수정 해야함
export type VehicleTripsResponse = {
  vehicle: Pick<Vehicle, 'id' | 'plateNumber' | 'vehicleName' | 'numTire'>
  trips: Pick<
    Trip,
    | CommonProperties
    | 'startTime'
    | 'endTime'
    | 'status'
    | 'distanceInKph'
    | 'durationInSecs'
    | 'fuelConsumed'
    | 'startPoint'
    | 'endPoint'
  >[]
  stats: {
    totalTrips: number
    activeTrips: number
    totalDistance: number
    totalDuration: number
    totalFuelConsumed: number
  }
}

// GET /vehicles/{id}/trips
export interface VehicleTripsQuery extends PaginationQuery {
  id?: string
  search?: string
  status?: TripStatus
  startDate?: string
  endDate?: string
}

export interface CombinedTireData {
  tire_location: string
  pressure?: string
  temperature?: string
  slowleak?: boolean
  blowout?: boolean
  result_time?: string
  model?: string
  model_result?: string
  pred_time?: string
  latitude?: string
  longitude?: string
  speed?: string
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

export type DefaultResponse<T> = {
  data: T
}

export interface VehiclesPaginationParams {
  page?: number
  limit?: number
  include_deleted?: boolean
  search?: string
  id?: string
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
    reg_number: string
    type: string
    details: string
    phone: string
    email: string
    website: string
    contact_person: string
    contact_phone: string
    verified: boolean
    isdeleted: boolean
    deletedAt: string
    created_at: string
    updated_at: string
  }
  users: {
    name: string
    username: string
    password: string
    email: string
    created_at: string
    updated_at: string
    verified: boolean
    isdeleted: boolean
    deletedAt: string
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

export interface VehiclesByCompanyIdPaginationParams {
  page: number
  limit: number
}

export interface VehicleCreateRequest {
  vehicleName: string
  plateNumber: string
  brand: string
  model: string
  manufactureYear: number
  canBitrate: string
  fuelType: FuelType
  gearType: GearType
  numTire: number
  companyId: number
}

export interface VehiclesSearchPaginationParams {
  query: string
  page: number
  limit: number
  include_deleted: boolean
}

export type VehiclesSearchResponse = VehiclesGetResponse & {
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

export interface VehicleRestoreParams {
  id: string
}

export interface VehicleUpdateParams {
  id: string
}

export interface VehicleUpdateRequest {
  vehicleName?: string
  brand?: string
  model?: string
  fuelType?: FuelType
}

export interface VehicleRequest {
  vehicle: {
    id: number
  }
}

// export type VehicleResponse = VehicleCreateResponse['data']

export interface VehicleInLiveStream {
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
  users: {
    id: number
    name: string
    username: string
    email: string
    verified: boolean
    isdeleted: boolean
  }[]
  company_id: {
    id: number
    name: string
    reg_number: string
    type: string
  }
  // todo: trips이 계속 아래로 늘어나는 형태인지 - 실제 차량 데이터 확인은 언제할지
  trips: {
    id: number
    start_time: string
    end_time: string
    status: VehicleTripStatus
    distance_in_kph: number
    duration_in_secs: number
    fuel_consumed: number
  }[]
}
export interface VehiclesLiveStreamParams {
  companyId: number
  page?: number // default: 1
  limit?: number // default: 10, max: 1000
  include_deleted?: boolean // default: false
}

export type VehiclesLiveStreamTypes = 'vehicle-update' | 'heartbeat' | 'error'

export type VehiclesLiveStreamPagination = PaginatedResponseWithKey<
  VehicleInLiveStream,
  'vehicles'
>

export interface VehiclesLiveStreamData {
  type: VehiclesLiveStreamTypes
  data: Partial<VehiclesLiveStreamPagination>
  timestamp: string
}

export interface GPSWithVehicle {
  id: number
  created_at: string
  updated_at: string
  latitude: string
  longitude: string
  north_south: string
  east_west: string
  speed_over_grd: string
  gps_time: string
  vehicle_id: VehicleReference
}

export interface AIResult {
  id: number
  created_at: string
  updated_at: string
  model: string
  model_result: string
  pred_time: string
  gps_id: GPSWithVehicle
  tire_id: {
    id: number
    created_at: string
    updated_at: string
    tire_location: string
  }
}

export interface TPMSResult {
  id: number
  created_at: string
  updated_at: string
  pressure: string
  temperature: string
  slowleak: boolean
  blowout: boolean
  result_time: string
  gps_id: GPSWithVehicle
  tire_id: {
    id: number
    created_at: string
    updated_at: string
    tire_location: string
  }
}

export type AIResultsResponse = PaginatedResponseWithKey<AIResult, 'ai_results'>
export type TPMSResultsResponse = PaginatedResponseWithKey<
  TPMSResult,
  'tpms_results'
>

export interface VehicleDataParams {
  page: number
  limit: number
  start_date: string
  end_date: string
}

export interface VehicleApiTypes {
  'GET /vehicles': {
    params: VehiclesPaginationParams
    request: {}
    response: VehiclesGetResponse
  }
  'GET /vehicles/{id}': {
    params: { id: string }
    request: {}
    response: VehicleGetResponse
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
    response: {}
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
  'PATCH /vehicles/{id}': {
    params: VehicleUpdateParams
    request: VehicleUpdateRequest
    response: VehicleUpdateResponse
  }
  'POST /vehicles/get': {
    params: {}
    request: VehicleRequest
    response: VehicleGetResponse
  }
  'GET /sse/vehicles/live-stream/{company_id}': {
    params: VehiclesLiveStreamParams
    request: {}
    response: VehiclesLiveStreamData
  }
  'GET /data/ai-results/vehicle/{id}': {
    params: VehicleDataParams
    request: {}
    response: AIResultsResponse
  }
  'GET /data/tpms-results/vehicle/{id}': {
    params: VehicleDataParams
    request: {}
    response: TPMSResultsResponse
  }
}
