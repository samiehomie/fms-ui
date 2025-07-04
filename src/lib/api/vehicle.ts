import { fetchJson } from '@/lib/api/fetch'
import type { ApiRequestType, ApiResponseType } from '@/types/api'
import { ApiSuccessResponse } from '@/types/api/route.types'
import type {
  VehiclesPaginationParams,
  VehiclesByCompanyIdPaginationParams,
} from '@/types/api/vehicle.types'
import { logger } from '../utils'

export const vehiclesApi = {
  getVehiclesPaginated: async (
    params: VehiclesPaginationParams,
    cookie?: string,
  ): Promise<ApiSuccessResponse<ApiResponseType<'GET /vehicles'>>> => {
    const searchParams =
      params &&
      new URLSearchParams({
        page: params.page.toString(),
        limit: params.limit.toString(),
        include_deleted: `${params.include_deleted ?? false}`,
      })

    const response = await fetchJson<
      ApiSuccessResponse<ApiResponseType<'GET /vehicles'>>
    >(
      `${process.env.NEXT_PUBLIC_FRONT_URL}/api/vehicles?${searchParams}`,
      cookie
        ? {
            headers: {
              Cookie: cookie,
            },
          }
        : { revalidate: false },
    )

    if (!response.success) {
      throw new Error('Failed to fetch vehicles')
    }

    return response.data
  },

  createVehicle: async (
    vehicle: ApiRequestType<'POST /vehicles'>,
  ): Promise<ApiSuccessResponse<ApiResponseType<'POST /vehicles'>>> => {
    const response = await fetchJson<
      ApiSuccessResponse<ApiResponseType<'POST /vehicles'>>
    >(`${process.env.NEXT_PUBLIC_FRONT_URL}/api/vehicles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vehicle),
    })

    if (!response.success) {
      throw new Error('Failed to create vehicle')
    }

    return response.data
  },
  // 페이지네이션된 회사 목록 조회
  getVehiclesByCompanyIdPaginated: async (
    params: VehiclesByCompanyIdPaginationParams,
    id: number,
  ): Promise<
    ApiSuccessResponse<ApiResponseType<'GET /vehicles/company/id'>>
  > => {
    const searchParams =
      params &&
      new URLSearchParams({
        page: params.page.toString(),
        limit: params.limit.toString(),
      })

    const response = await fetchJson<
      ApiSuccessResponse<ApiResponseType<'GET /vehicles/company/id'>>
    >(
      `${process.env.NEXT_PUBLIC_FRONT_URL}/api/companies/vehicles?id=${id}&${searchParams}`,
    )

    if (!response.success) {
      throw new Error('Failed to fetch vehicles')
    }

    return response.data
  },
}
