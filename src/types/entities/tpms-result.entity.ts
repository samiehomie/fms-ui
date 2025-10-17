import { BaseEntity } from './base.entity'
import { Tire } from './tire.entity'
import { Gps } from './gps.entity'

export interface TpmsResult extends BaseEntity {
  pressure: number

  temperature: number

  slowleak: boolean

  blowout: boolean

  resultTime: string

  tire: Tire

  gps: Gps
}
