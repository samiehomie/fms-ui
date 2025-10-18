import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueries,
  skipToken,
} from '@tanstack/react-query'
import { devicesApi } from '@/lib/api/device'
import type { DevicesPaginationParams } from '@/types/features/device.types'
import { ApiResponseType, ApiRequestType } from '@/types/features'
import { toast } from 'sonner'
import { useMemo } from 'react'

type CreateDeviceResponse = ApiResponseType<'POST /edge-devices'>
type CreateDeviceRequest = ApiRequestType<'POST /edge-devices'>

export function useDevicesPaginated(params: DevicesPaginationParams) {
  return useQuery({
    queryKey: ['devices', params],
    queryFn: () => devicesApi.getDevicesPaginated(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCreateDevice() {
  const queryClient = useQueryClient()
  return useMutation<CreateDeviceResponse, Error, CreateDeviceRequest>({
    mutationFn: async (newDevice) => {
      const res = await devicesApi.createVehicle(newDevice)
      return res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['devices'],
      })
      toast.success('A new device added', {
        position: 'bottom-center',
      })
    },
    onError: (error) => {
      toast.error('Adding a new device failed.', {
        position: 'bottom-center',
        description: error.message,
      })
    },
  })
}
