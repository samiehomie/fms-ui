import type { PaginatedResponseWithKey } from './api.common'
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

export type VehiclesByCompanyResponse = PaginatedResponseWithKey<
  VehiclesByCompany,
  'vehicles'
> & { company_id: number }

export interface VehiclesPaginationParams {
  page: number
  limit: number
}

export interface VehicleApiTypes {
  'GET /vehicles/company/id': {
    request: {}
    response: VehiclesByCompanyResponse
  }
}
