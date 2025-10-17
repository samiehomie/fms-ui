'use client'

import { useState, useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import { useLiveVehicles } from '@/lib/query-hooks/useVehicles'
import { VehicleListSidebar } from '@/components/features/map/vehicle-list-sidebar'
import SubSidebar from '@/components/features/companies/sub-sidebar'

export type NavItems = 'Company' | 'Users' | 'Vehicles' | 'Devices'

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
  const vehicles = useMemo(
    () => (vehiclesMap ? Array.from(vehiclesMap.values()) : []),
    [vehiclesMap],
  )

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState<NavItems>('Company')
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(
    null,
  )

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicleId(vehicle.id)
    if (isSidebarCollapsed) {
      setIsSidebarCollapsed(false)
    }
  }

  return (
    <div className="flex flex-col flex-1 -ml-6 -mt-6 -mb-6">
      <div className="flex-1 flex">
        <SubSidebar
          isCollapsed={isSidebarCollapsed}
          activeNavItem={activeNavItem}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          setActiveNavItem={setActiveNavItem}
        />
        <div className="flex-1 flex flex-col pl-[1.8rem] pt-5 pb-10">
          <LiveMap vehicles={vehicles} selectedVehicleId={selectedVehicleId} />
        </div>

        {/* <VehicleListSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        vehicles={vehicles}
        onVehicleSelect={handleVehicleSelect}
        selectedVehicleId={selectedVehicleId}
      /> */}
      </div>
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
