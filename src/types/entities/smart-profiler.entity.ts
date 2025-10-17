import { BaseEntity } from './base.entity'
import { Tire } from './tire.entity'
import { SensorStatus } from '@/types/enums/sensor.enum'

export interface SmartProfiler extends BaseEntity {
  serialNumber: string

  profilerFwVer: string

  profilerRev: string

  releaseDate: string

  verified: boolean

  isdeleted: boolean

  tire: Tire

  status: SensorStatus
}
