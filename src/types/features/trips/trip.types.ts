import type { Trip } from '@/types/entities/trip.entity'
import type { Gps } from '@/types/entities/gps.entity'
import type { Vehicle } from '@/types/entities/vehicle.entity'
import type { PaginationQuery } from '../common.types'

type GpsData = Pick<
  Gps,
  | 'id'
  | 'latitude'
  | 'longitude'
  | 'northSouth'
  | 'eastWest'
  | 'speedOverGrd'
  | 'gpsTime'
>

type VehicleData = Pick<Vehicle, 'id' | 'plateNumber'>

// GET /trips/{id}
export type TripDetailsResponse = Pick<
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
> & {
  vehicle: VehicleData
  startPoint: GpsData
  endPoint: GpsData
  gpss: GpsData[]
}

export interface TripDetailsQuery {
  id: number
}
