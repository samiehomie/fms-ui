import { BaseEntity } from './base.entity'
import { RawDataFile } from './raw-data-file.entity'

export interface Metadata extends BaseEntity {
  camber: number

  friction: string

  load: number

  lugnut: number

  pothole: number

  potholeDepth: string

  toe: number

  wear: number

  damage: string

  rawFiles: RawDataFile[]
}
