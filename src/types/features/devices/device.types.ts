import type {
  CommonProperties,
  PaginationQuery,
} from "../../common/common.types"
import type { Vehicle } from "@/types/entities/vehicle.entity"
import type { Company } from "@/types/entities/company.entity"
import type { User } from "@/types/entities/user.entity"
import type { Tire } from "@/types/entities/tire.entity"
import type { SmartProfiler } from "@/types/entities/smart-profiler.entity"
import type { Sensor } from "@/types/entities/sensor.entity"
import type { EdgeDevice } from "@/types/entities/edge-device.entity"
import type { Trip } from "@/types/entities/trip.entity"
import { EdgeDeviceType } from "@/types/enums/edge-device.enum"

type DeviceData = Pick<
  EdgeDevice,
  | CommonProperties
  | "name"
  | "username"
  | "serialNumber"
  | "type"
  | "wlanIpAddr"
  | "ethIpAddr"
  | "verified"
  | "terminated"
  | "terminatedAt"
>
// GET /edge-devices
export type DevicesGetResponse = (DeviceData & {
  vehicle: Pick<Vehicle, "id" | "plateNumber">
})[]

// GET /edge-devices
export interface DevicesGetQuery extends PaginationQuery {
  search?: string
  type?: EdgeDeviceType
  verified?: boolean
  includeTerminated?: boolean
}

// GET /edge-devices/{id}
export type DeviceGetResponse = DeviceData & {
  vehicle: Pick<
    Vehicle,
    | CommonProperties
    | "vehicleName"
    | "plateNumber"
    | "brand"
    | "model"
    | "fuelType"
    | "gearType"
    | "numTire"
    | "isdeleted"
  > & {
    company: Pick<
      Company,
      | CommonProperties
      | "name"
      | "regNumber"
      | "type"
      | "details"
      | "phone"
      | "email"
      | "website"
      | "contactPerson"
      | "contactPhone"
      | "verified"
      | "isdeleted"
    >
  }
}

// GET /edge-devices/{id}
export interface DeviceGetQuery {
  id: string
}

// POST /edge-devices
export type DeviceCreateBody = Partial<
  Pick<
    EdgeDevice,
    "name" | "username" | "password" | "type" | "wlanIpAddr" | "ethIpAddr"
  > & {
    vehicleId: number
  }
>

// POST /edge-devices
export type DeviceCreateResponse = DeviceGetResponse
