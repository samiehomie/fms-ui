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
import { useVehicleAllTrips } from '@/lib/query-hooks/use-vehicles'
import type { VehicleTripsQuery } from '@/types/features/vehicles/vehicle.types'
import type { VehicleTripEvent } from '@/types/features/vehicles/vehicle.types'
import { Skeleton } from '@/components/ui/skeleton'
import { TripPagination } from './trip-pagination'
import { formatDuration } from '@/lib/utils/build-url'
import { useTpmsResultsByVehicle } from '@/lib/query-hooks/use-vehicles-tpms'
import type { TPMSResultsByVehicleGetQuery } from '@/types/features/vehicles/vehicle-tpms.types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export interface TripSession {
  id: number
  startTime: string
  endTime: string
  driveTime: string // in minutes
  idleTime: string // in minutes
  distance: string // in km
  events: VehicleTripEvent[]
  status: string
  startPoint: {
    latitude: string
    longitude: string
  }
  endPoint: {
    latitude: string
    longitude: string
  }
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
  query: Omit<VehicleTripsQuery, 'id'>
  setQuery: React.Dispatch<React.SetStateAction<Omit<VehicleTripsQuery, 'id'>>>
  vehicleId?: string
}) {
  const [tpmsPagination, setTpmsPagination] = useState<
    Omit<TPMSResultsByVehicleGetQuery, 'startDate' | 'endDate' | 'id'>
  >({
    page: 1,
    limit: 10,
  })
  const [sessions, setSessions] = useState<TripSession[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [visibleIds, setVisibleIds] = useState<Set<number>>(new Set())
  const { search, status, ...tpmsQuery } = query
  const { data: tripsData, isLoading } = useVehicleAllTrips({
    ...query,
    id: vehicleId,
  })

  const { data: tpmsData, isLoading: tpmsLoading } = useTpmsResultsByVehicle({
    ...tpmsQuery,
    ...tpmsPagination,
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
        startPoint: {
          latitude: trip.startPoint.latitude,
          longitude: trip.startPoint.longitude,
        },
        endPoint: {
          latitude: trip.endPoint.latitude,
          longitude: trip.endPoint.longitude,
        },
      }))
      setSessions(newSessions)
      if (newSessions?.[0]?.id !== undefined) {
        const firstId = new Set([newSessions[0].id])
        setSelectedIds(firstId)
        setVisibleIds(firstId)
      } else {
        setSelectedIds(new Set())
        setVisibleIds(new Set())
      }
    }
  }, [tripsData, vehicleId])

  if (isLoading || !tripsData || tpmsLoading || !tpmsData) {
    return (
      <div className="col-span-3 flex flex-col gap-y-2">
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
      </div>
    )
  }

  const { vehicle, stats, trips } = tripsData.data
  return (
    <main className="flex-grow flex-1 overflow-hidden flex flex-col">
      <div className="flex-grow flex-1 overflow-hidden flex flex-col">
        {isMapVisible ? (
          <ResizablePanelGroup direction="horizontal" className="h-full w-full">
            <ResizablePanel
              defaultSize={35}
              minSize={25}
              maxSize={60}
              className="flex flex-col flex-1"
            >
              <div className="flex-1 flex flex-col overflow-y-auto mr-4 mb-3 ">
                <Tabs defaultValue="account" className="flex-1 flex flex-col">
                  <TabsList className="absolute top-[4.75rem] right-6">
                    <TabsTrigger value="account">Tracking</TabsTrigger>
                    <TabsTrigger value="password">TPMS Data</TabsTrigger>
                  </TabsList>
                  <TabsContent value="account" className="flex-1 flex flex-col">
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
                  </TabsContent>
                </Tabs>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle className="z-[999]" />
            <ResizablePanel
              defaultSize={65}
              minSize={40}
              className="mb-[.875rem] rounded-[4px]"
            >
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
              <TripMap selectedIds={Array.from(visibleIds)} />
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <div className="flex-1 flex flex-col  mr-4  mb-4 ">
            <Tabs defaultValue="account">
              <TabsList className=" absolute top-[4.75rem] right-6">
                <TabsTrigger value="account">Tracking</TabsTrigger>
                <TabsTrigger value="password">TPMS Data</TabsTrigger>
              </TabsList>
              <TabsContent value="account">
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
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </main>
  )
}
