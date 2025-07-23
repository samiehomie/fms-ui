import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueries,
  skipToken,
} from '@tanstack/react-query'
import { devicesApi } from '@/lib/api/device'
import type { DevicesPaginationParams } from '@/types/api/device.types'
import { ApiResponseType, ApiRequestType } from '@/types/api'
import { toast } from 'sonner'
import { useMemo } from 'react'

type CreateDeviceResponse = ApiResponseType<'POST /devices/edge-devices'>
type CreateDeviceRequest = ApiRequestType<'POST /devices/edge-devices'>

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
      const { data } = await devicesApi.createVehicle(newDevice)
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['devices'],
      })
      toast.success('A new device added', {
        description: `${data.edge_device.name}`,
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
