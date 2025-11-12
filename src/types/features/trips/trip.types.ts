import type { Trip } from "@/types/entities/trip.entity"
import type { Gps } from "@/types/entities/gps.entity"
import type { Vehicle } from "@/types/entities/vehicle.entity"
import type { PaginationQuery } from "../../common/common.types"
import type { TpmsResult } from "@/types/entities/tpms-result.entity"
import type { Tire } from "@/types/entities/tire.entity"
import { TripStatus } from "@/types/features/trips/trip.enum"

type GpsData = Pick<
  Gps,
  | "id"
  | "latitude"
  | "longitude"
  | "northSouth"
  | "eastWest"
  | "speedOverGrd"
  | "gpsTime"
>

type VehicleData = Pick<Vehicle, "id" | "plateNumber">

// GET /trips/{id}
export type TripGpsDetailsResponse = Pick<
  Trip,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "startTime"
  | "endTime"
  | "status"
  | "distanceInKph"
  | "durationInSecs"
  | "fuelConsumed"
> & {
  vehicle: VehicleData
  startPoint: GpsData
  endPoint: GpsData
  gpss: GpsData[]
}

export interface TripGpsDetailsQuery {
  id: number
}

type TripTpmsDetailsData = Pick<
  TpmsResult,
  "id" | "pressure" | "temperature" | "resultTime" | "status"
> & {
  gps: Pick<Gps, "id" | "latitude" | "longitude">
  tire: Pick<Tire, "id" | "tireLocation">
}

// GET /trips/{id}/tpms-results
export interface TripTpmsDetailsQuery extends PaginationQuery {
  id: number
  startDate?: string
  endDate?: string
}

// GET /trips/{id}/tpms-results
export type TripTpmsDetailsResponse = TripTpmsDetailsData[]

// GET /trips
export interface TripsGetQuery extends PaginationQuery {
  status?: TripStatus
  startDate?: string
  endDate?: string
  search?: string
}

// GET /trips

export type TripsGetResponse = { id: number }[]
