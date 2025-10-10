import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueries,
  skipToken,
} from '@tanstack/react-query'
import { vehiclesApi } from '@/lib/api/vehicle'
import type {
  VehicleTripsByTripIdResponse,
  VehicleTripsPaginationParams,
} from '@/types/api/vehicle.types'
import { ApiResponseType, ApiRequestType, ApiParamsType } from '@/types/api'
import { toast } from 'sonner'
import { useMemo, useEffect } from 'react'

type CreateVehicleResponse = ApiResponseType<'POST /vehicles'>
type CreateVehicleRequest = ApiRequestType<'POST /vehicles'>

export function useVehiclesPaginated(params: ApiParamsType<'GET /vehicles'>) {
  return useQuery({
    queryKey: ['vehicles', params],
    queryFn: () => vehiclesApi.getVehiclesPaginated(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
export function useVehicleById(id: number) {
  return useQuery({
    queryKey: ['vehicle', id],
    queryFn: () =>
      vehiclesApi.getVehicleById({
        vehicle: {
          id,
        },
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
export function useCreateVehicle() {
  const queryClient = useQueryClient()
  return useMutation<CreateVehicleResponse, Error, CreateVehicleRequest>({
    mutationFn: async (newVehicle) => {
      const res = await vehiclesApi.createVehicle(newVehicle)
      return res
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ['vehicles'],
      })
      toast.success('A new vehicle added', {
        description: `${res.data.vehicleName}`,
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

export function useDeleteVehicle() {
  const queryClient = useQueryClient()
  return useMutation<
    ApiResponseType<'DELETE /vehicles/{id}'>,
    Error,
    ApiParamsType<'DELETE /vehicles/{id}'>
  >({
    mutationFn: async (deleteParams) => {
      const res = await vehiclesApi.deleteVehicle(deleteParams.id)
      return res
    },
    onSuccess: () => {
      // 회사 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['vehicles'],
      })
      toast.success('A vehicle deleted.', {
        position: 'bottom-center',
      })
    },
    onError: (error) => {
      toast.error('Deleting a vehicle failed.', {
        position: 'bottom-center',
      })
      logger.error('Delete vehicle error:', error)
    },
  })
}

export function useUpdateVehicle(id: number) {
  const queryClient = useQueryClient()
  return useMutation<
    ApiResponseType<'PUT /vehicles/{id}'>,
    Error,
    ApiRequestType<'PUT /vehicles/{id}'>
  >({
    mutationFn: async (vehicle) => {
      const res = await vehiclesApi.updateVehicle(
        { id: id.toString() },
        vehicle,
      )
      return res
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ['vehicles'],
      })
      queryClient.invalidateQueries({
        queryKey: ['vehicle', id],
      })
      toast.success('A new vehicle added', {
        description: `${res.data.vehicleName}`,
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

export function useRestoreVehicle() {
  const queryClient = useQueryClient()
  return useMutation<
    ApiResponseType<'PATCH /vehicles/{id}/restore'>,
    Error,
    ApiParamsType<'PATCH /vehicles/{id}/restore'>
  >({
    mutationFn: async (restoreParams) => {
      const res = await vehiclesApi.restoreVehicle(restoreParams.id)
      return res
    },
    onSuccess: () => {
      // 회사 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['vehicles'],
      })
      toast.success('A vehicle restored.', {
        position: 'bottom-center',
      })
    },
    onError: (error) => {
      toast.error('Restoring a vehicle failed.', {
        position: 'bottom-center',
      })
      logger.error('Restore vehicle error:', error)
    },
  })
}

export function useVehicleTripsPaginated(
  params: ApiParamsType<'GET /vehicles/trips/vehicle/{vehicle_id}'>,
) {
  return useQuery({
    queryKey: ['trips', params],
    queryFn: () => vehiclesApi.getVehicleTripsByVehicleIdPaginated(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useVehicleTripDetailsBatch(tripIds: number[]) {
  // tripIds가 비어있으면 빈 배열, 아니면 쿼리 배열 생성
  const queryConfigs = useMemo(() => {
    if (tripIds.length === 0) {
      return []
    }

    return tripIds.map((tripId) => ({
      queryKey: ['trip details', tripId] as const,
      queryFn: () => vehiclesApi.getVehicleTripsByTripId({ tripId }),
      staleTime: 5 * 60 * 1000, // 5 minutes
    }))
  }, [tripIds])

  const queries = useQueries({
    queries: queryConfigs,
  })

  // tripId와 결과를 매핑하여 객체로 반환
  const mappedData = useMemo(() => {
    const result: Record<number, VehicleTripsByTripIdResponse> = {}

    tripIds.forEach((tripId, index) => {
      const query = queries[index]
      if (query?.data) {
        result[tripId] = query.data
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
    data: mappedData,
    queries,
    isLoading,
    isError,
    errors,
    isSuccess,
  }
}

export function useAllVehicleTripsPaginated(
  params: VehicleTripsPaginationParams,
) {
  return useQuery({
    queryKey: ['all trips', params],
    queryFn: () => vehiclesApi.getAllVehicleTrips(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

interface Vehicle {
  id: number
  plate_number: string
  lat: number
  lng: number
  heading: number
}

export function useLiveVehicles() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const eventSource = new EventSource('/api/vehicles/live')
    eventSource.onmessage = (event) => {
      const updates: Vehicle[] = JSON.parse(event.data)
      // Update TanStack Query cache directly
      queryClient.setQueryData<Map<number, Vehicle>>(
        ['live-vehicles'],
        (oldData) => {
          const newData = oldData ? new Map(oldData) : new Map()
          updates.forEach((vehicle) => {
            newData.set(vehicle.id, vehicle)
          })
          return newData
        },
      )
    }

    // Basic error handling with reconnection logic
    eventSource.onerror = () => {
      // Here you would implement exponential backoff for retries
      logger.error(
        'SSE connection error. Closing and will be retried by browser.',
      )
      eventSource.close()
    }

    // Cleanup on component unmount
    return () => {
      eventSource.close()
    }
  }, [queryClient])

  return useQuery<Map<number, Vehicle>>({
    queryKey: ['live-vehicles'],
    initialData: new Map(),
    staleTime: Number.POSITIVE_INFINITY, // Data is live, no need to refetch via standard means
  })
}
