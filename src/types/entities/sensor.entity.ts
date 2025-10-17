import { BaseEntity } from './base.entity'
import { Tire } from './tire.entity'
import { SensorStatus } from '@/types/enums/sensor.enum'

export interface Sensor extends BaseEntity {
  serialNumber: string

  sensorFwVer: string

  sensorRev: string

  releaseDate: string

  verified: boolean

  isdeleted: boolean

  tire: Tire

  status: SensorStatus
}
