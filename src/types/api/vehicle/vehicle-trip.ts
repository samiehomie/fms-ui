import type { DefaultPaginatedResponse } from '../common.types'
import { Gps } from '@/types/entities/gps.entity'
import { Vehicle } from '@/types/entities/vehicle.entity'
import { Trip } from '@/types/entities/trip.entity'
import { TripStatus } from '@/types/enums/trip.enum'

type GpsData = Pick<
  Gps,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'latitude'
  | 'longitude'
  | 'northSouth'
  | 'eastWest'
  | 'speedOverGrd'
  | 'gpsTime'
>

type VehicleData = Pick<
  Vehicle,
  | 'id'
  | 'plateNumber'
  | 'vehicleName'
  | 'fuelType'
  | 'gearType'
  | 'numTire'
  | 'model'
  | 'brand'
  | 'canBitrate'
  | 'manufactureYear'
>

type TripData = Pick<
  Trip,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'startTime'
  | 'endTime'
  | 'status'
  | 'distanceInKph'
  | 'durationInSecs'
  | 'fuelConsumed'
>

export type VehicleTripsData = TripData & {
  vehicle: VehicleData
  startPoint: GpsData
  endPoint: GpsData
}

export type VehicleTripsResponse = DefaultPaginatedResponse<VehicleTripsData>

export interface VehicleTripsParams {
  id: number
  search?: string
  status?: TripStatus
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

export interface VehicleTripApiTypes {
  'GET /vehicles/{id}/trips': {
    params: VehicleTripsParams
    request: {}
    response: VehicleTripsResponse
  }
}
