import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueries,
  skipToken,
} from '@tanstack/react-query'
import { devicesApi } from '@/lib/api/device'
import { toast } from 'sonner'
import { useMemo } from 'react'
import type {
  DevicesGetQuery,
  DevicesGetResponse,
  DeviceCreateBody,
  DeviceCreateResponse,
} from '@/types/features/device/device.types'
import type { ServerActionResult } from '@/types/features/common.types'
import { getAllDevices, createDevice } from '../actions/device.actions'

export function useAllDevices(query: DevicesGetQuery) {
  return useQuery({
    queryKey: ['devices', query],
    queryFn: async () => {
      const result = await getAllDevices(query)

      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateDevice() {
  const queryClient = useQueryClient()
  return useMutation<
    ServerActionResult<DeviceCreateResponse>,
    Error,
    DeviceCreateBody
  >({
    mutationFn: async (newDevice) => {
      const res = await createDevice(newDevice)
      return res
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ['devices'],
      })
      if (res.success) {
        toast.success('A new device added', {
          description: `serial number: ${res.data.serialNumber}`,
          position: 'bottom-center',
        })
      }
    },
    onError: (error) => {
      toast.error('Adding a new device failed.', {
        position: 'bottom-center',
        description: error.message,
      })
    },
  })
}
