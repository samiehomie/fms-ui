"use client"

import { useState, useEffect, useCallback, memo } from "react"
import dynamic from "next/dynamic"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { TripHistoryTable } from "@/components/features/vehicles/trip/trip-history-table"
import { TripOverview } from "@/components/features/vehicles/trip/trip-overview"
import { useVehicleAllTrips } from "@/lib/query-hooks/use-vehicles"
import type { VehicleTripsQuery } from "@/types/features/vehicles/vehicle.types"
import { Skeleton } from "@/components/ui/skeleton"
import { TripPagination } from "./trip-pagination"
import { formatDuration } from "@/lib/utils/build-url"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type {
  PressureUnit,
  TemperatureUnit,
} from "@/lib/utils/unit-conversions"
import TripTpmsHeader from "./trip-tpms-header"
import type { TripTpmsDetailsQuery } from "@/types/features/trips/trip.types"

export interface TripSession {
  id: number
  startTime: string
  endTime: string
  driveTime: string // in minutes
  distance: number // in km
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
  () => import("@/components/features/vehicles/trip/trip-map"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <p>Loading Map...</p>
      </div>
    ),
  },
)

const TripTpmsTable = dynamic(
  () => import("@/components/features/vehicles/trip/trip-tpms-table"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <p>Loading table...</p>
      </div>
    ),
  },
)

const TripTpmsCharts = dynamic(
  () => import("@/components/features/vehicles/trip/trip-tpms-charts"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <p>Loading table...</p>
      </div>
    ),
  },
)

const TripContent = ({
  vehicleId,
  query,
  setQuery,
}: {
  query: Omit<VehicleTripsQuery, "id">
  setQuery: React.Dispatch<React.SetStateAction<Omit<VehicleTripsQuery, "id">>>
  vehicleId?: string
}) => {
  const [sessions, setSessions] = useState<TripSession[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [visibleIds, setVisibleIds] = useState<Set<number>>(new Set())
  const [currentTab, setCurrentTab] = useState<"tracking" | "tpms">("tracking")
  const { data: tripsData, isLoading } = useVehicleAllTrips({
    ...query,
    id: vehicleId,
  })

  const [selectedTires, setSelectedTires] = useState<string[]>(["all"])
  const [pressureUnit, setPressureUnit] = useState<PressureUnit>("PSI")
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>("°C")
  const [viewMode, setViewMode] = useState<"charts" | "table">("table")
  const [tpmsQuery, setTpmsQuery] = useState<
    Omit<TripTpmsDetailsQuery, "id" | "limit">
  >({
    page: 1,
    endDate: query?.endDate,
    startDate: query?.startDate,
  })

  const handleRowClick = (id: number) => {
    const newSelectedIds = new Set(selectedIds)
    const newVisibleIds = new Set(visibleIds)

    if (currentTab === "tracking") {
      // tracking 탭: 복수 선택 허용
      if (newSelectedIds.has(id)) {
        newSelectedIds.delete(id)
        newVisibleIds.delete(id) // 선택 해제 시, 보임 목록에서도 제거
      } else {
        newSelectedIds.add(id)
        newVisibleIds.add(id) // 선택 시, 기본적으로 보이도록 추가
      }
    } else {
      // tpms 탭: 단일 선택만 허용
      newSelectedIds.clear()
      newVisibleIds.clear()
      newSelectedIds.add(id)
      newVisibleIds.add(id)
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
    // tracking 탭에서만 전체 선택 기능 허용
    if (currentTab === "tracking") {
      if (selectedIds.size === sessions.length) {
        setSelectedIds(new Set())
        setVisibleIds(new Set())
      } else {
        const allIds = new Set(sessions.map((s) => s.id))
        setSelectedIds(allIds)
        setVisibleIds(allIds)
      }
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
        distance: trip.distanceInKph,
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

  const handleDateRangeChange = useCallback(
    (dateRange: { from: string; to: string } | null) => {
      if (dateRange) {
        setTpmsQuery((old) => ({
          ...old,
          startDate: dateRange.from,
          endDate: dateRange.to,
        }))
      }
    },
    [setTpmsQuery],
  )

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

  const { numTire, tireLocations } = vehicle

  return (
    <main className="grow flex-1 overflow-hidden flex flex-col">
      <div className="grow flex-1 overflow-hidden flex flex-col">
        {isMapVisible ? (
          <ResizablePanelGroup
            direction="horizontal"
            className="h-full w-full mb-4"
          >
            <ResizablePanel
              defaultSize={35}
              minSize={25}
              maxSize={60}
              className="flex flex-col flex-1"
            >
              <div className="flex-1 flex flex-col overflow-y-auto mr-4 ">
                <TripHistoryTable
                  isTracking={currentTab === "tracking"}
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
            <ResizablePanel
              defaultSize={65}
              minSize={40}
              className="rounded-[4px] flex flex-col flex-1"
            >
              <Tabs
                defaultValue="tracking"
                value={currentTab}
                onValueChange={(value) =>
                  setCurrentTab(value as "tracking" | "tpms")
                }
                className="flex-1 flex flex-col w-full"
              >
                <TabsList className="absolute top-[4.75rem] right-6">
                  <TabsTrigger value="tracking">Tracking</TabsTrigger>
                  <TabsTrigger value="tpms">TPMS Data</TabsTrigger>
                </TabsList>
                <TabsContent
                  value="tracking"
                  className="flex-1 flex flex-col w-full relative"
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
                </TabsContent>
                <TabsContent
                  value="tpms"
                  className="flex-1 flex flex-col w-full relative"
                >
                  <div className="ml-3 flex-1 flex flex-col ">
                    <TripTpmsHeader
                      startDate={query?.startDate}
                      endDate={query?.endDate}
                      tireLocations={tireLocations}
                      selectedTires={selectedTires}
                      setSelectedTires={setSelectedTires}
                      viewMode={viewMode}
                      setViewMode={setViewMode}
                      pressureUnit={pressureUnit}
                      temperatureUnit={temperatureUnit}
                      setTemperatureUnit={setTemperatureUnit}
                      setPressureUnit={setPressureUnit}
                      handleDateRangeChange={handleDateRangeChange}
                    />
                    {viewMode === "table" ? (
                      <TripTpmsTable
                        tireLocations={tireLocations}
                        selectedTires={selectedTires}
                        pressureUnit={pressureUnit}
                        temperatureUnit={temperatureUnit}
                        selectedId={Array.from(selectedIds)[0] ?? 1}
                        numTire={numTire}
                        setTpmsQuery={setTpmsQuery}
                        tpmsQuery={tpmsQuery}
                      />
                    ) : (
                      <TripTpmsCharts
                        tireLocations={tireLocations}
                        selectedTires={selectedTires}
                        pressureUnit={pressureUnit}
                        temperatureUnit={temperatureUnit}
                        selectedId={Array.from(selectedIds)[0] ?? 1}
                        numTire={numTire}
                        tpmsQuery={tpmsQuery}
                      />
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <div className="flex-1 flex flex-col  mr-4  mb-4 ">
            <div className="flex-grow overflow-y-auto">
              <TripHistoryTable
                isTracking={currentTab === "tracking"}
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

export default memo(TripContent)
