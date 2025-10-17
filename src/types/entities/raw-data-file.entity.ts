import { BaseEntity } from './base.entity'
import { Tire } from './tire.entity'
import { Metadata } from './metadata.entity'

export interface RawDataFile extends BaseEntity {
  filename: string

  filePath: string

  timeLength: number

  tire: Tire
  
  metadata: Metadata
}
