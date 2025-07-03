import { fetchJson } from '@/lib/api/fetch'
import type { ApiRequestType, ApiResponseType } from '@/types/api'
import { ApiSuccessResponse } from '@/types/api/route.types'
import type { VehiclesPaginationParams } from '@/types/api/vehicle.types'
import { logger } from '../utils'

export const vehiclesApi = {
  // 페이지네이션된 회사 목록 조회
  getVehiclesByCompanyIdPaginated: async (
    params: VehiclesPaginationParams,
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
