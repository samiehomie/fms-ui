import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueries,
  skipToken,
} from '@tanstack/react-query'
import type {
  TPMSResultsByVehicleGetQuery,
  TPMSResultsByVehicleGetResponse,
} from '@/types/features/vehicles/vehicle-tpms.types'
import {
  ApiResponseType,
  ApiRequestType,
  ApiParamsType,
} from '@/types/features'
import { toast } from 'sonner'
import { useMemo, useEffect } from 'react'
import { getTpmsResultsByVehicle } from '../actions/vehicle-tpms.actions'

export function useTpmsResultsByVehicle(query: TPMSResultsByVehicleGetQuery) {
  return useQuery({
    queryKey: ['tpmsResults', query],
    queryFn: async () => {
      const result = await getTpmsResultsByVehicle(query)

      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    },
    staleTime: 5 * 60 * 1000,
  })
}
