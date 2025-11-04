import { BaseEntity } from "./base.entity"
import { AlertType, AlertSeverity, AlertStatus } from "../features/alerts/alerts.enum"
import { AlertReadStatus } from "./alert-read-status.entity"
import { Vehicle } from "./vehicle.entity"

export interface Alert extends BaseEntity {
  type: AlertType

  severity: AlertSeverity

  title: string

  message: string

  resolvedAt: Date | null

  status: AlertStatus

  isdeleted: boolean

  vehicle: Vehicle

  readStatuses: AlertReadStatus[]
}
