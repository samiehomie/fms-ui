import { Vehicle } from "./vehicle.entity"
import { BaseEntity } from "./base.entity"
import { SystemModule } from "./system-module.entity"
import { DeviceType } from "@/types/features/devices/device.enum"

export interface EdgeDevice extends BaseEntity {
  name: string

  username: string

  password: string

  serialNumber: string

  type: DeviceType

  wlanIpAddr: string

  ethIpAddr: string

  verified: boolean

  terminated: boolean

  terminatedAt: string

  vehicle: Vehicle

  systemModules: SystemModule[]
}
