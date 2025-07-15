import { fetchJson } from '@/lib/api/fetch'
import type { ApiRequestType, ApiResponseType } from '@/types/api'
import { ApiSuccessResponse } from '@/types/api/route.types'
import type { DevicesPaginationParams } from '@/types/api/device.types'

export const devicesApi = {
  getDevicesPaginated: async (
    params: DevicesPaginationParams,
    cookie?: string,
  ): Promise<
    ApiSuccessResponse<ApiResponseType<'GET /devices/edge-devices'>>
  > => {
    const searchParams =
      params &&
      new URLSearchParams({
        page: params.page.toString(),
        limit: params.limit.toString(),
      })

    const response = await fetchJson<
      ApiSuccessResponse<ApiResponseType<'GET /devices/edge-devices'>>
    >(
      `${process.env.NEXT_PUBLIC_FRONT_URL}/api/devices?${searchParams}`,
      cookie
        ? {
            headers: {
              Cookie: cookie,
            },
          }
        : { revalidate: false },
    )

    if (!response.success) {
      throw new Error('Failed to fetch devices')
    }

    return response.data
  },

  createVehicle: async (
    device: ApiRequestType<'POST /devices/edge-devices'>,
  ): Promise<
    ApiSuccessResponse<ApiResponseType<'POST /devices/edge-devices'>>
  > => {
    const response = await fetchJson<
      ApiSuccessResponse<ApiResponseType<'POST /devices/edge-devices'>>
    >(`${process.env.NEXT_PUBLIC_FRONT_URL}/api/devices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(device),
    })

    if (!response.success) {
      throw new Error('Failed to create device')
    }

    return response.data
  },
}
