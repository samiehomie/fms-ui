'use client'

import { useQuery } from '@tanstack/react-query'
import { activeVehiclesApi } from '@/lib/api/active-vehicles'
import type { VehicleDataParams } from '@/types/api/vehicle.types'

export const useAIResults = (vehicleId: string, params: VehicleDataParams, enabled = true) => {
  return useQuery({
    queryKey: ['ai-results', vehicleId, params],
    queryFn: () => activeVehiclesApi.getAIResults(vehicleId, params),
    enabled,
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
  })
}

export const useTPMSResults = (vehicleId: string, params: VehicleDataParams, enabled = true) => {
  return useQuery({
    queryKey: ['tpms-results', vehicleId, params],
    queryFn: () => activeVehiclesApi.getTPMSResults(vehicleId, params),
    enabled,
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
  })
}