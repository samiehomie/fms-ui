import {
  useQuery,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { vehiclesApi } from '@/lib/api/vehicle'
import type {
  VehiclesPaginationParams,
  VehiclesSearchPaginationParams,
  VehicleTripsPaginationParams,
  VehicleTripsParams,
} from '@/types/api/vehicle.types'
import { ApiResponseType, ApiRequestType } from '@/types/api'
import { toast } from 'sonner'

type CreateVehicleResponse = ApiResponseType<'POST /vehicles'>
type CreateVehicleRequest = ApiRequestType<'POST /vehicles'>

export function useVehiclesPaginated(params: VehiclesPaginationParams) {
  return useQuery({
    queryKey: ['vehicles', params],
    queryFn: () => vehiclesApi.getVehiclesPaginated(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// TODO: useVehiclesPaginated와 통합될 예정
export function useVehiclesSearchPaginated(
  params: VehiclesSearchPaginationParams,
) {
  return useQuery({
    queryKey: ['vehicles', params],
    queryFn: () => vehiclesApi.getVehiclesSearchPaginated(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCreateVehicle() {
  const queryClient = useQueryClient()
  return useMutation<CreateVehicleResponse, Error, CreateVehicleRequest>({
    mutationFn: async (newVehicle) => {
      const { data } = await vehiclesApi.createVehicle(newVehicle)
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['vehicles'],
      })
      toast.success('A new vehicle added', {
        description: `${data.vehicle.vehicle_name}`,
        position: 'bottom-center',
      })
    },
    onError: (error) => {
      toast.error('Adding a new vehicle failed.', {
        position: 'bottom-center',
        description: error.message,
      })
    },
  })
}

export function useVehicleTripsPaginated(params: VehicleTripsParams) {
  return useQuery({
    queryKey: ['trips', params],
    queryFn: () => vehiclesApi.getVehicleTripsByVehicleIdPaginated(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
