'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { TripSession } from './types'
import { Car, Clock, MapPin, AlertTriangle } from 'lucide-react'

interface TripHistoryTableProps {
  sessions: TripSession[]
  selectedIds: Set<string>
  onRowClick: (id: string) => void
  onRowHover: (id: string | null) => void
  onMouseLeave: () => void
}

export function TripHistoryTable({
  sessions,
  selectedIds,
  onRowClick,
  onRowHover,
  onMouseLeave,
}: TripHistoryTableProps) {
  return (
    <div onMouseLeave={onMouseLeave}>
      <Table>
        <TableHeader>
          <TableRow className='hover:bg-inherit'>
            <TableHead className="w-[40%] pl-6">
              <MapPin className="inline-block mr-2 h-4 w-4" />
              Route
            </TableHead>
            <TableHead>
              <Clock className="inline-block mr-2 h-4 w-4" />
              Duration
            </TableHead>
            <TableHead>
              <AlertTriangle className="inline-block mr-2 h-4 w-4" />
              Events
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => (
            <TableRow
              key={session.id}
              onClick={() => onRowClick(session.id)}
              onMouseEnter={() => onRowHover(session.id)}
              data-selected={selectedIds.has(session.id)}
              className={cn(
                'group cursor-pointer transition-colors hover:bg-inherit',
                'hover:bg-slate-100/50',
                selectedIds.has(session.id) && 'bg-slate-100/50 hover:bg-slate-200/70 ', // 선택된 상태에서 hover 시 더 진한 배경
              )}
            >
              <TableCell className="font-medium relative">
                <div
                  className={cn(
                    'absolute top-0 bottom-0 -left-1 w-4 transition-all duration-200',
                    selectedIds.has(session.id)
                      ? 'bg-[#005eae]'
                      : 'bg-transparent',
                  )}
                />
                <div className="flex items-center pl-6">
                  <div>
                    <div>{session.startLocation}</div>
                    <div className="text-muted-foreground text-xs">
                      to {session.endLocation}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>Driving: {session.driveTime} min</div>
                <div className="text-muted-foreground text-xs">
                  Idle: {session.idleTime} min
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {session.events.map((event, index) => (
                    <Badge key={index} variant="secondary">
                      {event}
                    </Badge>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
