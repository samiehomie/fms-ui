import { BaseEntity } from "./base.entity"
import { Alert } from "./alert.entity"
import { User } from "./user.entity"

export interface AlertReadStatus extends BaseEntity {
  id: number

  readAt: Date

  alert: Alert

  user: User
}
