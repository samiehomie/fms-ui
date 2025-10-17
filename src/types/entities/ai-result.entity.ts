import { BaseEntity } from './base.entity'
import { Gps } from './gps.entity'
import { Tire } from './tire.entity'

export interface AiResult extends BaseEntity {
  model: string

  modelResult: string

  predTime: string

  gps: Gps

  tire: Tire
}
