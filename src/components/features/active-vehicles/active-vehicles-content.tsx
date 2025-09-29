'use client'

import { useState } from 'react'
import VehicleList from './vehicle-list'
import RealTimeDataTable from './real-time-data-table'
import type { VehicleReference } from '@/types/api/vehicle.types'
import { useVehiclesPaginated } from '@/lib/queries/useVehicles'

const mockVehicle: VehicleReference = {
  id: 4,
  created_at: '2025-09-27T18:45:13.885Z',
  updated_at: '2025-09-27T18:45:13.885Z',
  vehicle_name: null,
  plate_number: 'ABC1234',
  brand: 'Temp',
  model: 'Flat-trac',
  manuf_year: 2015,
  can_bitrate: '500K',
  fuel_type: 'Electric',
  gear_type: 'Auto',
  num_tire: 4,
  isdeleted: false,
  deletedAt: null,
}

export default function ActiveVehiclesContent() {
  const { data, isLoading } = useVehiclesPaginated({
    page: 1,
    limit: 100,
    include_deleted: false,
    search: '',
  })
  const [selectedVehicleId, setSelectedVehicleId] = useState<
    number | undefined
  >(4)

  const vehicles = [mockVehicle]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <h2 className="text-xl font-semibold mb-4">Vehicle List</h2>
        {data && (
          <VehicleList
            vehicles={data.data.vehicles}
            selectedVehicleId={selectedVehicleId}
            onVehicleSelectAction={setSelectedVehicleId}
          />
        )}
      </div>

      <div className="lg:col-span-2">
        <h2 className="text-xl font-semibold mb-4">Real-time Data</h2>
        {selectedVehicleId ? (
          <RealTimeDataTable vehicleId={selectedVehicleId} />
        ) : (
          <div className="flex items-center justify-center h-64 border border-dashed border-gray-300 rounded-lg">
            <span className="text-muted-foreground">
              Select a vehicle to view real-time data
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
