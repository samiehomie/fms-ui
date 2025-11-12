import { BaseEntity } from "./base.entity"
import { User } from "./user.entity"
import { Company } from "./company.entity"
import { Trip } from "./trip.entity"
import { EdgeDevice } from "./edge-device.entity"
import { Gps } from "./gps.entity"
import { Tire } from "./tire.entity"
import {
  GearType,
  FuelType,
  CanBitrateType,
  VehicleType,
} from "@/types/features/vehicles/vehicle.enum"

export interface Vehicle extends BaseEntity {
  vehicleName: string

  plateNumber: string

  brand: string

  model: string

  manufactureYear: number

  canBitrate: CanBitrateType

  fuelType: FuelType

  gearType: GearType

  vehicleType: VehicleType

  numTire: number

  isdeleted: boolean

  users: User[]

  company: Company

  edgeDevices: EdgeDevice[]

  gpss: Gps[]

  trips: Trip[]

  tires: Tire[]
}
