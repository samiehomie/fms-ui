import { User } from './user.entity'
import { BaseEntity } from './base.entity'
import { Ticket } from './ticket.entity'
import { IssueStatus, IssuePriority, IssueType } from '@/types/features/issues/issue.enum'

export interface Issue extends BaseEntity {
  type: IssueType

  description: string

  component: string

  device: string

  status: IssueStatus

  priority: IssuePriority

  resolutionNotes: string

  resolvedAt: string

  user: User

  assignedUser: User

  tickets: Ticket[]
}
