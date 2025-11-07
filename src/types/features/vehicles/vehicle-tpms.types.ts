import type { Gps } from "@/types/entities/gps.entity"
import type { TpmsResult } from "@/types/entities/tpms-result.entity"
import type { Tire } from "@/types/entities/tire.entity"
import type {
  CommonProperties,
  PaginationQuery,
} from "../../common/common.types"

type TPMSResultData = Pick<
  TpmsResult,
  "id" | "pressure" | "temperature" | "status" | "resultTime"
>

// GET /vehicles/{id}/tpms-results
export type TPMSResultsByVehicleGetResponse = (TPMSResultData & {
  tire: Pick<Tire, "id" | "tireLocation">
  gps: Pick<Gps, "id" | "latitude" | "longitude" | "speedOverGrd" | "gpsTime">
})[]

// GET /vehicles/{id}/tpms-results
export interface TPMSResultsByVehicleGetQuery extends PaginationQuery {
  id?: string
  startDate?: string
  endDate?: string
}
