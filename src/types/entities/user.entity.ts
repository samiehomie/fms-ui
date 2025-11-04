import { Vehicle } from "./vehicle.entity"
import { BaseEntity } from "./base.entity"
import { Role } from "./role.entity"
import { Company } from "./company.entity"
import { Issue } from "./issue.entity"
import { Ticket } from "./ticket.entity"
import { AlertReadStatus } from "./alert-read-status.entity"

export interface User extends BaseEntity {
  name: string

  username: string

  password: string

  email: string

  verified: boolean

  isdeleted: boolean

  company: Company

  role: Role

  vehicles?: Vehicle[]

  issues?: Issue[]

  assignedIssues?: Issue[]

  createdTickets?: Ticket[]

  assignedTickets?: Ticket[]

  emailVerificationToken: string

  emailVerificationExpires: Date

  passwordResetToken: string

  passwordResetExpires: Date

  alertReadStatuses: AlertReadStatus[]
}
