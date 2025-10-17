import { Vehicle } from './vehicle.entity'
import { BaseEntity } from './base.entity'
import { SystemModule } from './system-module.entity'
import { EdgeDeviceType } from '@/types/enums/edge-device.enum'

export interface EdgeDevice extends BaseEntity {
  name: string

  username: string

  password: string

  serialNumber: string

  type: EdgeDeviceType

  wlanIpAddr: string

  ethIpAddr: string

  verified: boolean

  terminated: boolean

  terminatedAt: string

  vehicle: Vehicle

  systemModules: SystemModule[]
}
