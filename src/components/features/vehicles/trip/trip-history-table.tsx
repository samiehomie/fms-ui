"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { TripSession } from "./types"
import { Car, Clock, MapPin, AlertTriangle } from "lucide-react"

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
          <TableRow>
            <TableHead className="w-[40%]">
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
              className={cn("cursor-pointer transition-colors", "data-[selected=true]:bg-muted/80 hover:bg-muted/50")}
            >
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <Car className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <div>{session.startLocation}</div>
                    <div className="text-muted-foreground text-xs">to {session.endLocation}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>Driving: {session.driveTime} min</div>
                <div className="text-muted-foreground text-xs">Idle: {session.idleTime} min</div>
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
