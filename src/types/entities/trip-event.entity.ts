import { BaseEntity } from './base.entity'
import { Trip } from './trip.entity'
import { Gps } from './gps.entity'

export interface TripEvent extends BaseEntity {
  eventType: string

  eventTime: string

  details: string

  eventCount: number

  gps: Gps

  trip: Trip
}
