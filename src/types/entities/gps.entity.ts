import type { BaseEntity } from './base.entity'
import { AiResult } from './ai-result.entity'
import { Vehicle } from './vehicle.entity'
import { Trip } from './trip.entity'
import { TpmsResult } from './tpms-result.entity'

export interface Gps extends BaseEntity {
  latitude: string

  longitude: string

  northSouth: 'N' | 'S'

  eastWest: 'E' | 'W'

  speedOverGrd: number

  gpsTime: string

  vehicle: Vehicle

  trip: Trip

  aiResults: AiResult[]

  tpmsResults: TpmsResult[]

  startPoints: Trip[]

  endPoints: Trip[]
}
