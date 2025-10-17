export enum TicketTypes {
  MAINTENANCE = 'maintenance',
  REPAIR = 'repair',
  REPLACEMENT = 'replacement',
  INVESTIGATION = 'investigation',
}

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}
