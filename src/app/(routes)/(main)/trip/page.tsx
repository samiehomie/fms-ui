'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { TripHistoryTable } from '@/components/features/vehicles/trip/trip-history-table'
import { tripData } from '@/components/features/vehicles/trip/data'
import type { TripSession } from '@/components/features/vehicles/trip/types'
import { DateRangePicker } from '@/components/ui/data-range-picker'
import { TripOverview } from '@/components/features/vehicles/trip/trip-overview'

// react-leaflet은 클라이언트 측에서만 렌더링되어야 하므로 dynamic import를 사용합니다.
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

export default function TripHistoryPage() {
  const [sessions] = useState<TripSession[]>(tripData)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const handleRowClick = (id: string) => {
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

  return (
    <div className="h-screen w-full bg-background text-foreground flex flex-col">
      <header className="flex items-center justify-between p-4 border-b shrink-0">
        <h1 className="text-xl font-bold sm:text-2xl">Trip History</h1>
        <DateRangePicker />
      </header>
      <main className="flex-grow overflow-hidden flex flex-col">
        <TripOverview
          sessions={sessions}
          vehicleName="Vehicle-001"
          onToggleSelectAll={handleToggleSelectAll}
          areAllSelected={areAllSelected}
        />
        <div className="flex-grow overflow-hidden">
          {isMapVisible ? (
            <ResizablePanelGroup
              direction="horizontal"
              className="h-full w-full"
            >
              <ResizablePanel defaultSize={50} minSize={40} maxSize={60}>
                <div className="h-full overflow-y-auto p-4">
                  <TripHistoryTable
                    sessions={sessions}
                    selectedIds={selectedIds}
                    onRowClick={handleRowClick}
                    onRowHover={setHoveredId}
                    onMouseLeave={() => setHoveredId(null)}
                  />
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle className="z-[999]" />
              <ResizablePanel defaultSize={50} minSize={30}>
                <TripMap sessions={selectedSessions} hoveredId={hoveredId} />
              </ResizablePanel>
            </ResizablePanelGroup>
          ) : (
            <div className="h-full overflow-y-auto p-4">
              <TripHistoryTable
                sessions={sessions}
                selectedIds={selectedIds}
                onRowClick={handleRowClick}
                onRowHover={() => {}}
                onMouseLeave={() => {}}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
