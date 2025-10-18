'use client'

import { useQuery, skipToken } from '@tanstack/react-query'
import { activeVehiclesApi } from '@/lib/api/active-vehicles'
import type { VehicleDataParams } from '@/types/features/vehicle/vehicle.types'

export const useAIResults = (
  vehicleId: number | undefined,
  params: VehicleDataParams,
  enabled = true,
) => {
  return useQuery({
    queryKey: ['ai-results', vehicleId, params],
    queryFn: vehicleId
      ? () => activeVehiclesApi.getAIResults(vehicleId.toString(), params)
      : skipToken,
    enabled,
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
  })
}

export const useTPMSResults = (
  vehicleId: number | undefined,
  params: VehicleDataParams,
  enabled = true,
) => {
  return useQuery({
    queryKey: ['tpms-results', vehicleId, params],
    queryFn: vehicleId
      ? () => activeVehiclesApi.getTPMSResults(vehicleId.toString(), params)
      : skipToken,
    enabled,
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
  })
}
