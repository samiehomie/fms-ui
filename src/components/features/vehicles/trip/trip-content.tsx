'use client'

import { useState, useMemo, useEffect } from 'react'
import dynamic from 'next/dynamic'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { TripHistoryTable } from '@/components/features/vehicles/trip/trip-history-table'
import { DateRangePicker } from '@/components/ui/data-range-picker'
import { TripOverview } from '@/components/features/vehicles/trip/trip-overview'
import { useVehicleTripsPaginated } from '@/lib/hooks/queries/useVehicles'
import type { VehicleTripsPaginationParams } from '@/types/api/vehicle.types'
import { Skeleton } from '@/components/ui/skeleton'
import { TripPagination } from './trip-pagination'
import { logger } from '@/lib/utils'
import { formatDuration, formatTotalDuration } from '@/lib/api/utils'

export interface TripSession {
  id: number
  startLocation: string
  endLocation: string
  driveTime: string // in minutes
  idleTime: string // in minutes
  distance: string // in km
  events: string[]
  path: [number, number][] // [lat, lng]
}

const TripMap = dynamic(
  () => import('@/components/features/vehicles/trip/trip-map'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <p>Loading Map...</p>
      </div>
    ),
  },
)

export default function TripContent({ vehicleId }: { vehicleId: number }) {
  const [sessions, setSessions] = useState<TripSession[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [pageParams, setPageParams] = useState<VehicleTripsPaginationParams>({
    page: 1,
    limit: 5,
    //status: 'completed',
  })

  const { data, isLoading } = useVehicleTripsPaginated({
    ...pageParams,
    id: vehicleId,
  })

  const handleRowClick = (id: number) => {
    setSelectedIds((prev) => {
      const newSelectedIds = new Set(prev)
      if (newSelectedIds.has(id)) {
        newSelectedIds.delete(id)
      } else {
        newSelectedIds.add(id)
      }
      return newSelectedIds
    })
  }

  const handleToggleSelectAll = () => {
    if (selectedIds.size === sessions.length) {
      setSelectedIds(new Set())
    } else {
      const allIds = new Set(sessions.map((s) => s.id))
      setSelectedIds(allIds)
    }
  }

  const selectedSessions = useMemo(
    () => sessions.filter((session) => selectedIds.has(session.id)),
    [sessions, selectedIds],
  )

  const isMapVisible = selectedIds.size > 0
  const areAllSelected =
    selectedIds.size > 0 && selectedIds.size === sessions.length

  useEffect(() => {
    if (data) {
      const newSessions: TripSession[] = data.data.trips.map((trip) => ({
        id: trip.id,
        startLocation: `601 Marks St, Henderson, NV 89014, USA`,
        endLocation: `Las Vegas Blvd S, Sloan, NV 89054, USA`,
        driveTime: formatDuration(trip.start_time, trip.end_time),
        idleTime: '10',
        distance: '10',
        events: ['test'],
        path: [],
      }))
      setSessions(newSessions)
    }
  }, [data])

  if (isLoading || !data) {
    return (
      <div className="col-span-3 flex flex-col gap-y-2">
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
      </div>
    )
  }

  return (
    <div className="flex-1 w-full bg-background text-foreground flex flex-col">
      <header className="flex items-center justify-between mb-8  shrink-0">
        <h1 className="text-xl font-bold sm:text-4xl tracking-tight">
          Trips History
        </h1>
        <DateRangePicker />
      </header>
      <main className="flex-grow flex-1 overflow-hidden flex flex-col">
        <TripOverview
          totalDriveTime={formatTotalDuration(
            data.data.trips.map((trip) => ({
              created_at: trip.start_time,
              updated_at: trip.end_time,
            })),
          )}
          totalIdleTime={'100'}
          totalDistance={'100'}
          totalTrips={data.data.trips.length}
          vehicleName="Vehicle-001"
          onToggleSelectAll={handleToggleSelectAll}
          areAllSelected={areAllSelected}
        />
        <div className="flex-grow flex-1 overflow-hidden flex flex-col">
          {isMapVisible ? (
            <ResizablePanelGroup
              direction="horizontal"
              className="h-full w-full"
            >
              <ResizablePanel
                defaultSize={50}
                minSize={40}
                maxSize={60}
                className="flex flex-col flex-1"
              >
                <div className="flex-1 flex flex-col overflow-y-auto pl-1 pr-4 pt-4 pb-4">
                  <TripHistoryTable
                    sessions={sessions}
                    selectedIds={selectedIds}
                    onRowClick={handleRowClick}
                    onRowHover={setHoveredId}
                    onMouseLeave={() => setHoveredId(null)}
                  />
                  <TripPagination
                    currentPage={pageParams.page}
                    totalPages={data.data.pagination.pages}
                    onPageChange={(page) => {
                      setPageParams({
                        ...pageParams,
                        page,
                      })
                    }}
                  />
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle className="z-[999]" />
              <ResizablePanel defaultSize={50} minSize={30}>
                <TripMap sessions={selectedSessions} hoveredId={hoveredId} />
              </ResizablePanel>
            </ResizablePanelGroup>
          ) : (
            <div className="flex-1 flex flex-col pl-1 pr-4 pt-4 pb-4 ">
              <div className="flex-grow overflow-y-auto">
                <TripHistoryTable
                  sessions={sessions}
                  selectedIds={selectedIds}
                  onRowClick={handleRowClick}
                  onRowHover={() => {}}
                  onMouseLeave={() => {}}
                />
              </div>
              <TripPagination
                currentPage={pageParams.page}
                totalPages={data.data.pagination.pages}
                onPageChange={(page) => {
                  setPageParams({
                    ...pageParams,
                    page,
                  })
                }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
