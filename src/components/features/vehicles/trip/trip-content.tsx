'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { TripHistoryTable } from '@/components/features/vehicles/trip/trip-history-table'
import { TripOverview } from '@/components/features/vehicles/trip/trip-overview'
import { useVehicleAllTrips } from '@/lib/query-hooks/useVehicles'
import type { VehicleTripsQuery } from '@/types/features/vehicles/vehicle.types'
import type { VehicleTripEvent } from '@/types/features/vehicles/vehicle.types'
import { Skeleton } from '@/components/ui/skeleton'
import { TripPagination } from './trip-pagination'
import { formatDuration } from '@/lib/utils/build-url'

export interface TripSession {
  id: number
  startTime: string
  endTime: string
  driveTime: string // in minutes
  idleTime: string // in minutes
  distance: string // in km
  events: VehicleTripEvent[]
  status: string
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

export default function TripContent({
  vehicleId,
  query,
  setQuery,
}: {
  vehicleId: string
  query: Omit<VehicleTripsQuery, 'id'>
  setQuery: React.Dispatch<React.SetStateAction<Omit<VehicleTripsQuery, 'id'>>>
}) {
  const [sessions, setSessions] = useState<TripSession[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [visibleIds, setVisibleIds] = useState<Set<number>>(new Set())

  const { data: tripsData, isLoading } = useVehicleAllTrips({
    ...query,
    id: vehicleId,
  })

  const handleRowClick = (id: number) => {
    const newSelectedIds = new Set(selectedIds)
    const newVisibleIds = new Set(visibleIds)

    if (newSelectedIds.has(id)) {
      newSelectedIds.delete(id)
      newVisibleIds.delete(id) // 선택 해제 시, 보임 목록에서도 제거
    } else {
      newSelectedIds.add(id)
      newVisibleIds.add(id) // 선택 시, 기본적으로 보이도록 추가
    }
    setSelectedIds(newSelectedIds)
    setVisibleIds(newVisibleIds)
  }

  const handleVisibilityToggle = (id: number) => {
    const newVisibleIds = new Set(visibleIds)
    if (newVisibleIds.has(id)) {
      newVisibleIds.delete(id)
    } else {
      newVisibleIds.add(id)
    }
    setVisibleIds(newVisibleIds)
  }

  const handleToggleSelectAll = () => {
    if (selectedIds.size === sessions.length) {
      setSelectedIds(new Set())
      setVisibleIds(new Set())
    } else {
      const allIds = new Set(sessions.map((s) => s.id))
      setSelectedIds(allIds)
      setVisibleIds(allIds)
    }
  }

  const isMapVisible = selectedIds.size > 0
  const areAllSelected =
    selectedIds.size > 0 && selectedIds.size === sessions.length

  useEffect(() => {
    if (tripsData) {
      const newSessions: TripSession[] = tripsData.data.trips.map((trip) => ({
        id: trip.id,
        startTime: trip.startTime,
        endTime: trip.endTime,
        driveTime: formatDuration(trip.startTime, trip.endTime),
        idleTime: '10',
        distance: '10',
        events: [],
        status: trip.status,
      }))
      setSessions(newSessions)
    }
  }, [tripsData])

  if (isLoading || !tripsData) {
    return (
      <div className="col-span-3 flex flex-col gap-y-2">
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
      </div>
    )
  }

  const { vehicle, stats } = tripsData.data

  return (
    <main className="flex-grow flex-1 overflow-hidden flex flex-col">
      <TripOverview
        totalDriveTime={stats.totalDuration}
        activeTrips={stats.activeTrips}
        totalDistance={stats.totalDistance}
        totalTrips={stats.totalTrips}
        vehicleName={`${vehicle.plateNumber} ${
          vehicle.vehicleName && `(${vehicle.vehicleName})`
        }`}
        onToggleSelectAll={handleToggleSelectAll}
        areAllSelected={areAllSelected}
      />
      <div className="flex-grow flex-1 overflow-hidden flex flex-col">
        {isMapVisible ? (
          <ResizablePanelGroup direction="horizontal" className="h-full w-full">
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
                  visibleIds={visibleIds}
                  onRowClick={handleRowClick}
                  onVisibilityToggle={handleVisibilityToggle}
                />
                <TripPagination
                  currentPage={query.page ?? 1}
                  totalPages={tripsData.pagination!.totalPages}
                  onPageChange={(page) => {
                    setQuery({
                      ...query,
                      page,
                    })
                  }}
                />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle className="z-[999]" />
            <ResizablePanel defaultSize={50} minSize={30}>
              <TripMap selectedIds={Array.from(visibleIds)} />
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <div className="flex-1 flex flex-col pl-1 pr-4 pt-4 pb-4 ">
            <div className="flex-grow overflow-y-auto">
              <TripHistoryTable
                sessions={sessions}
                selectedIds={selectedIds}
                visibleIds={visibleIds}
                onRowClick={handleRowClick}
                onVisibilityToggle={handleVisibilityToggle}
              />
            </div>
            <TripPagination
              currentPage={query.page ?? 1}
              totalPages={tripsData.pagination!.totalPages}
              onPageChange={(page) => {
                setQuery({
                  ...query,
                  page,
                })
              }}
            />
          </div>
        )}
      </div>
    </main>
  )
}
