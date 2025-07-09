import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueries,
  skipToken,
} from '@tanstack/react-query'
import { vehiclesApi } from '@/lib/api/vehicle'
import type {
  VehiclesPaginationParams,
  VehiclesSearchPaginationParams,
  VehicleTripsParams,
  VehicleTripsByTripIdParams,
} from '@/types/api/vehicle.types'
import { ApiResponseType, ApiRequestType } from '@/types/api'
import { toast } from 'sonner'
import { useMemo } from 'react'

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

export function useVehicleTripDetailsBatch(tripIds: number[]) {
  const queries = useQueries({
    queries: tripIds.map((tripId) => ({
      queryKey: ['trip details', tripId],
      queryFn:
        tripIds.length > 0
          ? () => vehiclesApi.getVehicleTripsByTripId({ tripId })
          : skipToken,
      staleTime: 5 * 60 * 1000, // 5 minutes
      enabled: tripId > 0, // 유효한 ID만 요청
    })),
  })

  // tripId와 결과를 매핑하여 객체로 반환
  const mappedData = useMemo(() => {
    const result: Record<number, any> = {}

    tripIds.forEach((tripId, index) => {
      const query = queries[index]
      if (query?.data) {
        result[tripId] = query.data.data
      }
    })

    return result
  }, [tripIds, queries])

  // 추가 유틸리티 정보들
  const isLoading = queries.some((query) => query.isLoading)
  const isError = queries.some((query) => query.isError)
  const errors = queries
    .filter((query) => query.isError)
    .map((query) => query.error)
  const isSuccess = queries.every((query) => query.isSuccess)

  return {
    data: mappedData, // { 1: tripData1, 2: tripData2, ... }
    queries, // 원본 쿼리 배열 (필요시 사용)
    isLoading,
    isError,
    errors,
    isSuccess,
  }
}
