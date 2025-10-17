import { BaseEntity } from './base.entity'
import { EdgeDevice } from './edge-device.entity'

export interface SystemModule extends BaseEntity {
  name: string

  target: string

  version: string

  releaseDate: string

  serverLink: string

  cloudLink: string

  details: string

  edgeDevice: EdgeDevice[]
}
