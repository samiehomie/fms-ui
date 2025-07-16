'use client'

import * as React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import { useLiveVehicles } from '@/lib/hooks/queries/useVehicles'
import { VehicleListSidebar } from '@/components/features/map/vehicle-list-sidebar'

const LiveMap = dynamic(
  () => import('@/components/features/map/live-map').then((mod) => mod.LiveMap),
  {
    ssr: false,
    loading: () => <div className="flex-1 bg-muted animate-pulse" />,
  },
)

interface Vehicle {
  id: number
  plate_number: string
  lat: number
  lng: number
  heading: number
}

function LiveTrackingPage() {
  const { data: vehiclesMap } = useLiveVehicles()
  const vehicles = React.useMemo(
    () => (vehiclesMap ? Array.from(vehiclesMap.values()) : []),
    [vehiclesMap],
  )

  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false)
  const [selectedVehicleId, setSelectedVehicleId] = React.useState<
    number | null
  >(null)

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicleId(vehicle.id)
    if (isSidebarCollapsed) {
      setIsSidebarCollapsed(false)
    }
  }

  return (
    <div className="flex h-full w-full">
      <div className="flex-1 relative">
        <LiveMap vehicles={vehicles} selectedVehicleId={selectedVehicleId} />
      </div>
      <VehicleListSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        vehicles={vehicles}
        onVehicleSelect={handleVehicleSelect}
        selectedVehicleId={selectedVehicleId}
      />
    </div>
  )
}

const queryClient = new QueryClient()

export default function MapPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <LiveTrackingPage />
    </QueryClientProvider>
  )
}
