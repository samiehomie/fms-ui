import { BaseEntity } from './base.entity'
import { Vehicle } from './vehicle.entity'
import { TripEvent } from './trip-event.entity'
import { Gps } from './gps.entity'
import { TripStatus } from '@/constants/enums/trip.enum'

export interface Trip extends BaseEntity {
  vehicle: Vehicle

  gpss: Gps[]

  startTime: string

  endTime: string

  status: TripStatus

  startPoint: Gps

  endPoint: Gps

  distanceInKph: number

  durationInSecs: number

  fuelConsumed: number

  events: TripEvent[]
}
