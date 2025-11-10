"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { TripSession } from "./trip-content"
import { Eye, EyeOff, MoveRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format, parseISO } from "date-fns"

interface TripHistoryTableProps {
  isTracking: boolean
  sessions: TripSession[]
  selectedIds: Set<number>
  onRowClick: (id: number) => void
  visibleIds: Set<number>
  onVisibilityToggle: (id: number) => void
}

export function TripHistoryTable({
  isTracking,
  sessions,
  selectedIds,
  onRowClick,
  visibleIds,
  onVisibilityToggle,
}: TripHistoryTableProps) {
  // TODO 역 geocode 처리
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-inherit text-sm">
            <TableHead className="w-[43%] pl-6">
              {/* <MapPin className="inline-block mt-[-1px] mr-1 h-4 w-4" /> */}
              Route
            </TableHead>
            <TableHead>{`Status`}</TableHead>
            <TableHead>
              {/* <Clock className="inline-block mt-[-1px] mr-1 h-4 w-4" /> */}
              {`Trip Length`}
            </TableHead>

            <TableHead className=""></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => (
            <TableRow
              key={session.id}
              onClick={() => onRowClick(session.id)}
              data-selected={selectedIds.has(session.id)}
              className={cn(
                "group cursor-pointer transition-colors hover:bg-inherit",
                "hover:bg-slate-100/50",
                selectedIds.has(session.id) &&
                  "bg-slate-100/50 hover:bg-slate-200/70 ",
              )}
            >
              <TableCell className="font-medium relative">
                <div
                  className={cn(
                    "absolute top-0 bottom-0 -left-1 w-[22px] transition-all duration-200 text-[9px] tracking-tight flex justify-center pl-1 leading-none items-center ",
                    selectedIds.has(session.id)
                      ? "bg-[#0055a3] text-white"
                      : "bg-transparent",
                  )}
                >
                  {session.id}
                </div>
                <div className="flex items-center pl-4 text-xs text-gray-800 font-[400]">
                  <div className="flex flex-col gap-y-[9px] leading-none">
                    <div>
                      {session.startTime &&
                        format(parseISO(session.startTime), "yy.MM.d HH:mm")}
                    </div>
                    <div className="flex gap-x-1 items-center">
                      <MoveRight
                        className="leading-none text-muted-foreground"
                        size={12}
                      />
                      {session.endTime &&
                        format(parseISO(session.endTime), "yy.MM.d HH:mm")}
                    </div>
                    {/* <div className="text-muted-foreground font-light tracking-wider text-[11.6px] font-mono">
                      {`${format(
                        parseISO(session.startTime),
                        'yy.MM.d HH:mm',
                      )} ~ ${format(
                        parseISO(session.endTime),
                        'yy.MM.d HH:mm',
                      )}`}
                    </div> */}
                  </div>
                </div>
              </TableCell>
              <TableCell className="">
                <Badge
                  variant={"outline"}
                  className={cn(
                    "text-xs text-muted-foreground font-[400]",
                    session?.status === "active" &&
                      "border-green-500 text-green-500",
                  )}
                >
                  {session?.status}
                </Badge>
              </TableCell>
              <TableCell className="text-xs">
                <div>Driving: {session?.driveTime ?? 0}</div>
                <div className="text-muted-foreground">
                  Distance: {session?.distance ?? 0}km
                </div>
              </TableCell>

              <TableCell className="text-center pr-[.625rem]">
                {selectedIds.has(session.id) && isTracking ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation() // 행 전체 클릭 방지
                      onVisibilityToggle(session.id)
                    }}
                    className="h-6 w-6"
                  >
                    {visibleIds.has(session.id) ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">Toggle visibility</span>
                  </Button>
                ) : (
                  <div className="w-6" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
