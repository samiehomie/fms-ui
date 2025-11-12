import { BaseEntity } from './base.entity'
import { Issue } from './issue.entity'
import { User } from './user.entity'
import {
  TicketTypes,
  TicketPriority,
  TicketStatus,
} from '@/types/features/ticket/ticket.enum'

export interface Ticket extends BaseEntity {
  ticketType: TicketTypes

  description: string

  status: TicketStatus

  priority: TicketPriority

  dueDate: string

  completedAt: string

  workNotes: string

  estimatedCost: number

  actualCost: number

  issue: Issue

  createdBy: User

  assignedTo: User
}
