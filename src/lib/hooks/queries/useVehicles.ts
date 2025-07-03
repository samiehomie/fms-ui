import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { vehiclesApi } from '@/lib/api/vehicle'
import type { VehiclesPaginationParams } from '@/types/api/vehicle.types'
import { ApiResponseType, ApiRequestType } from '@/types/api'
import { toast } from 'sonner'

export function useCompanyVehiclesPaginated(
  companyId: number,
  params: VehiclesPaginationParams,
) {
  return useQuery({
    queryKey: ['vehicles', params, companyId],
    queryFn: () =>
      vehiclesApi.getVehiclesByCompanyIdPaginated(params, companyId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
