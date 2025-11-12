import type {
  CommonProperties,
  PaginationQuery,
} from "../../common/common.types"
import type { Vehicle } from "@/types/entities/vehicle.entity"
import type { Company } from "@/types/entities/company.entity"
import type { EdgeDevice } from "@/types/entities/edge-device.entity"
import { DeviceType } from "@/types/features/devices/device.enum"

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
  type?: DeviceType
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
