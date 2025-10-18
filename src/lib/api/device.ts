import type { ApiRequestType, ApiResponseType } from '@/types/features'
import { ApiSuccessResponse } from '@/types/features/route.types'
import type { DevicesPaginationParams } from '@/types/features/device.types'
import { fetchClient } from './fetch-client'
import { buildURL } from '../utils/build-url'

export const devicesApi = {
  getDevicesPaginated: async (params: DevicesPaginationParams) => {
    const apiUrl = buildURL(
      `${process.env.NEXT_PUBLIC_FRONT_URL}/api/devices`,
      params,
    )
    const response = await fetchClient<ApiResponseType<'GET /edge-devices'>>(
      apiUrl,
    )

    return response
  },

  createVehicle: async (device: ApiRequestType<'POST /edge-devices'>) => {
    const response = await fetchClient<ApiResponseType<'POST /edge-devices'>>(
      `${process.env.NEXT_PUBLIC_FRONT_URL}/api/devices`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(device),
      },
    )

    return response
  },
}
