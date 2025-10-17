'use client'

import { useState, useMemo } from 'react'
import { VehicleList } from './vehicle-list'
import { RealTimeDataTable } from './real-time-data-table'
import type { Vehicle, CombinedTireData } from '@/types/api/vehicle.types'
import { useAllVehicles } from '@/lib/query-hooks/useVehicles'
import {
  useAIResults,
  useTPMSResults,
} from '@/lib/query-hooks/useActiveVehicles'
import type { VehicleDataParams } from '@/types/api/vehicle.types'

export default function ActiveVehiclesContent() {
  const { data, isLoading } = useAllVehicles({
    page: 1,
    limit: 100,
    include_deleted: false,
    search: '',
  })
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const params: VehicleDataParams = {
    page: 1,
    limit: 4,
    start_date: '2025-06-01T00:00:00Z',
    end_date: '2025-12-30T23:59:59Z',
  }

  const {
    data: aiData,
    isLoading: aiLoading,
    error: aiError,
  } = useAIResults(selectedVehicle?.id, params)
  const {
    data: tpmsData,
    isLoading: tpmsLoading,
    error: tpmsError,
  } = useTPMSResults(selectedVehicle?.id, params)

  const aiResult = aiData?.data.ai_results
  const tpmsResult = tpmsData?.data.tpms_results

  // Combine TPMS and AI data by tire_location
  const combinedTireData: CombinedTireData[] = useMemo(() => {
    if (!selectedVehicle || !aiData || !tpmsData) return []

    const tpmsResults = tpmsData.data.tpms_results
    const aiResults = aiData.data.ai_results

    // Get unique tire locations from the selected vehicle
    const tireLocations = selectedVehicle.tires.map(
      (tire) => tire.tire_location,
    )

    return tireLocations.map((location) => {
      const tpmsData = tpmsResults.find(
        (result) => result.tire_id.tire_location === location,
      )
      const aiData = aiResults.find(
        (result) => result.tire_id.tire_location === location,
      )

      return {
        tire_location: location,
        // TPMS data
        pressure: tpmsData?.pressure,
        temperature: tpmsData?.temperature,
        slowleak: tpmsData?.slowleak,
        blowout: tpmsData?.blowout,
        result_time: tpmsData?.result_time,
        // AI data
        model: aiData?.model,
        model_result: aiData?.model_result,
        pred_time: aiData?.pred_time,
        // GPS data (from either source, preferring TPMS)
        latitude: tpmsData?.gps_id.latitude || aiData?.gps_id.latitude,
        longitude: tpmsData?.gps_id.longitude || aiData?.gps_id.longitude,
        speed: tpmsData?.gps_id.speed_over_grd || aiData?.gps_id.speed_over_grd,
      }
    })
  }, [selectedVehicle, aiResult, tpmsResult])

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
  }

  const vehicles = data?.data.vehicles

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 overflow-hidden flex">
        {/* Left sidebar - Vehicle List (30%) */}
        <div className="w-[30%] ">
          {vehicles && (
            <VehicleList
              vehicles={vehicles}
              selectedVehicleId={selectedVehicle?.id}
              onVehicleSelect={handleVehicleSelect}
            />
          )}
        </div>

        {/* Right content - Real-time Data (70%) */}
        <div className="flex-1 p-4">
          <RealTimeDataTable
            selectedVehicle={selectedVehicle}
            tireData={combinedTireData}
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  )
}
