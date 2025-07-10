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
import type { TripSession } from './trip-content'
import { Clock, MapPin, AlertTriangle, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useReverseGeocode } from '@/lib/hooks/queries/useGeocoding'

interface TripHistoryTableProps {
  sessions: TripSession[]
  selectedIds: Set<number>
  onRowClick: (id: number) => void
  visibleIds: Set<number>
  onVisibilityToggle: (id: number) => void
}

export function TripHistoryTable({
  sessions,
  selectedIds,
  onRowClick,
  visibleIds,
  onVisibilityToggle,
}: TripHistoryTableProps) {
  const {
    data: address,
    isLoading,
    isError,
  } = useReverseGeocode('37.364037', '126.946976')

  if (isLoading) {
    return <span className="text-muted-foreground">Loading address...</span>
  }

  if (isError) {
    return <span className="text-muted-foreground">eror</span>
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-inherit">
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
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => (
            <TableRow
              key={session.id}
              onClick={() => onRowClick(session.id)}
              data-selected={selectedIds.has(session.id)}
              className={cn(
                'group cursor-pointer transition-colors hover:bg-inherit',
                'hover:bg-slate-100/50',
                selectedIds.has(session.id) &&
                  'bg-slate-100/50 hover:bg-slate-200/70 ', // 선택된 상태에서 hover 시 더 진한 배경
              )}
            >
              <TableCell className="font-medium relative">
                <div
                  className={cn(
                    'absolute top-0 bottom-0 -left-1 w-4 transition-all duration-200',
                    selectedIds.has(session.id)
                      ? 'bg-[#0055a3]'
                      : 'bg-transparent',
                  )}
                />
                <div className="flex items-center pl-6">
                  <div>
                    <div>{address}</div>
                    <div className="text-muted-foreground text-xs">
                      to {session.endLocation}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>Driving: {session.driveTime}</div>
                <div className="text-muted-foreground text-xs">
                  Idle: {session.idleTime}
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
              <TableCell className="text-center">
                {selectedIds.has(session.id) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation() // 행 전체 클릭 방지
                      onVisibilityToggle(session.id)
                    }}
                    className="h-8 w-8"
                  >
                    {visibleIds.has(session.id) ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">Toggle visibility</span>
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
