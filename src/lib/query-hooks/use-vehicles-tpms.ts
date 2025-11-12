import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueries,
  skipToken,
} from '@tanstack/react-query'
import type {
  TPMSResultsByVehicleGetQuery,
} from '@/types/features/vehicles/vehicle-tpms.types'
import { getTpmsResultsByVehicle } from '../actions/vehicle-tpms.actions'

export function useTpmsResultsByVehicle(query: TPMSResultsByVehicleGetQuery) {
  return useQuery({
    queryKey: ['tpmsResults', query],
    queryFn:query.id !== undefined ? async () => {
      const result = await getTpmsResultsByVehicle(query)

      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    } : skipToken,
    staleTime: 5 * 60 * 1000,
  })
}
