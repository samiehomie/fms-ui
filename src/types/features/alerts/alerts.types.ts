import { AlertType, AlertSeverity, AlertStatus } from "./alerts.enum"
import type {
  CommonProperties,
  PaginationQuery,
} from "@/types/common/common.types"
import type {
  Vehicle,
  Company,
  User,
  Alert,
  AlertReadStatus,
} from "@/types/entities/index"

type VehicleData = Pick<
  Vehicle,
  "id" | "vehicleName" | "plateNumber" | "vehicleType"
> & {
  company: Pick<Company, "id" | "name">
  users: Pick<User, "id" | "name" | "username">[]
}

type ReadStatusesData = Pick<AlertReadStatus, "readAt">

type AlertData = Pick<
  Alert,
  | CommonProperties
  | "type"
  | "severity"
  | "title"
  | "message"
  | "resolvedAt"
  | "status"
  | "isdeleted"
> & {
  vehicle: VehicleData
  readStatuse?: ReadStatusesData['readAt']
}

// GET /alerts
export type AlertGetAllResponse = AlertData[]

// GET /alerts
export interface AlertGetAllQuery extends PaginationQuery {
  includeDeleted: boolean
  type?: AlertType
  severity?: AlertSeverity
  status?: AlertStatus
  search?: string
}

// GET /alerts/{id}
export type AlertGetOneResponse = AlertData

// GET /alerts/{id}
export interface AlertGetOneQuery {
  id: number
}
