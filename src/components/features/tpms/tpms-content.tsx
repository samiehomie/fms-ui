'use client'

import { useState, useMemo, useEffect } from 'react'
import dynamic from 'next/dynamic'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { TpmsHistoryTable } from './tpms-history-table'
import { TripOverview } from '@/components/features/vehicles/trip/trip-overview'
// import { useVehicleTripsPaginated } from '@/lib/queries/useVehicles'
import type {
  VehicleTripsPaginationParams,
  VehicleTripEvent,
} from '@/types/api/vehicle.types'
import { Skeleton } from '@/components/ui/skeleton'
import { TripPagination } from '../vehicles/trip/trip-pagination'
import { formatDuration, formatTotalDuration } from '@/lib/api/utils'
import { tpmsPaginationData } from './mock-data'

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

const TripMap = dynamic(() => import('@/components/features/tpms/tpms-map'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-muted">
      <p>Loading Map...</p>
    </div>
  ),
})

export default function TpmsContent({
  vehicleId,
  pageParams,
  setPageParams,
}: {
  vehicleId: number
  pageParams: VehicleTripsPaginationParams
  setPageParams: React.Dispatch<
    React.SetStateAction<VehicleTripsPaginationParams>
  >
}) {
  const [sessions, setSessions] = useState<TripSession[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [visibleIds, setVisibleIds] = useState<Set<number>>(new Set())

  const tpmsData = tpmsPaginationData
  const isLoading = false
  //   const { data, isLoading } = useVehicleTripsPaginated({
  //     ...pageParams,
  //     id: vehicleId,
  //   })

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
    if (tpmsData) {
      const newSessions: TripSession[] = tpmsData.data.trips.map((trip) => ({
        id: trip.id,
        startTime: trip.start_time,
        endTime: trip.end_time,
        driveTime: formatDuration(trip.start_time, trip.end_time),
        idleTime: '10',
        distance: '10',
        events: trip.events,
        status: trip.status,
      }))
      setSessions(newSessions)
    }
  }, [tpmsData])

  const totalDriveTime = useMemo(() => {
    if (!tpmsData?.data.trips) return '0s'

    return formatTotalDuration(
      tpmsData.data.trips.map((trip) => ({
        created_at: trip.start_time,
        updated_at: trip.end_time,
      })),
    )
  }, [tpmsData])

  if (isLoading || !tpmsData) {
    return (
      <div className="col-span-3 flex flex-col gap-y-2">
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
      </div>
    )
  }

  return (
    <main className="flex-grow flex-1 overflow-hidden flex flex-col">
      <TripOverview
        totalDriveTime={totalDriveTime}
        totalIdleTime={'100'}
        totalDistance={'100'}
        totalTrips={tpmsData.data.pagination.total}
        vehicleName={`Vehicle-${vehicleId}`}
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
                <TpmsHistoryTable
                  sessions={sessions}
                  selectedIds={selectedIds}
                  visibleIds={visibleIds}
                  onRowClick={handleRowClick}
                  onVisibilityToggle={handleVisibilityToggle}
                />
                <TripPagination
                  currentPage={pageParams.page ?? 1}
                  totalPages={tpmsData.data.pagination.pages}
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
              <TripMap selectedIds={Array.from(visibleIds)} />
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <div className="flex-1 flex flex-col pl-1 pr-4 pt-4 pb-4 ">
            <div className="flex-grow overflow-y-auto">
              <TpmsHistoryTable
                sessions={sessions}
                selectedIds={selectedIds}
                visibleIds={visibleIds}
                onRowClick={handleRowClick}
                onVisibilityToggle={handleVisibilityToggle}
              />
            </div>
            <TripPagination
              currentPage={pageParams.page ?? 1}
              totalPages={tpmsData.data.pagination.pages}
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
  )
}
