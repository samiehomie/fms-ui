import type { PaginatedResponseWithKey } from './api.common'

export type DeviceTypes = 'master' | 'slave' | 'gateway' | 'sensor' | 'logger'
export interface Device {
  id: number
  name: string
  serial_number: string
  type: DeviceTypes
  user_name: string
  ip_addr: string
  verified: boolean
  terminated: boolean
  vehicle_id: {
    id: number
    vehicle_name: string
    plate_number: string
  }
  modules: {
    id: number
    name: string
    version: string
  }[]
  created_at: string
}

export type DevicesResponse = PaginatedResponseWithKey<Device, 'edge_devices'>

export interface DevicesPaginationParams {
  page: number
  limit: number
  verified?: boolean
  terminated?: boolean
  type?: DeviceTypes
}

export interface DeviceCreateRequest {
  edge_device: {
    name: string
    serial_number: string
    type: DeviceTypes
    user_name: string
    ip_addr: string
    vehicle_id: number
  }
}

export interface DeviceCreateResponse {
  message: string
  edge_device: {
    id: number
    name: string
    serial_number: string
    type: DeviceTypes
    user_name: string
    ip_addr: string
    verified: boolean
    terminated: boolean
    terminatedAt: string
    vehicle_id: {
      id: number
      vehicle_name: string
      plate_number: string
      brand: string
      model: string
    }
    modules: {
      id: 0
      name: string
      version: string
      target: string
      release_date: string
    }[]
    created_at: string
    updated_at: string
  }
}

export interface DeviceApiTypes {
  'GET /devices/edge-devices': {
    params: {}
    request: {}
    response: DevicesResponse
  }
  'POST /devices/edge-devices': {
    params: {}
    request: DeviceCreateRequest
    response: DeviceCreateResponse
  }
}
